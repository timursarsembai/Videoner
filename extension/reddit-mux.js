// Склейка видео и звука Reddit в один mp4 — прямо в браузере, без
// перекодирования и без ffmpeg.
//
// Reddit отдаёт ролик по DASH: видео и звук — отдельные файлы (v.redd.it,
// DASH_720.mp4 и DASH_AUDIO_128.mp4 или старые DASH_2_4_M и audio). Оба —
// фрагментированные mp4 «on-demand»: ftyp, moov с одной дорожкой (у обеих
// номер 1), sidx и пары moof+mdat. Проверено 15.11.2026 на ролике из тестов
// yt-dlp: tfhd с флагом default-base-is-moof, то есть смещения данных
// отсчитываются от своего moof, и пару moof+mdat можно переносить целиком.
//
// Что делаем:
//   moov — mvhd видео, дорожка видео (№1), дорожка звука (№2), mvex с trex и
//          trep обеих дорожек; длительности звука переводим в шкалу видео;
//   кусочки (moof и всё до следующего moof) обоих файлов — вперемешку по
//          времени начала (tfdt), с новыми номерами mfhd и номером дорожки в
//          tfhd; абсолютный base_data_offset, если он вдруг есть, пересчитываем;
//   sidx, mfra, free, udta — выбрасываем: их смещения в новом файле неверны.
//
// Обычный скрипт, а не модуль: его подключают content scripts (Chrome не
// умеет их модулями), а тест — через vm (extension/test/reddit-mux.test.mjs).

(function (root) {
  const CONTAINERS = new Set(["moov", "trak", "mdia", "minf", "stbl", "mvex", "moof", "traf", "edts"]);

  const typeAt = (b, at) => String.fromCharCode(b[at + 4], b[at + 5], b[at + 6], b[at + 7]);
  const u32 = (b, at) => ((b[at] << 24) >>> 0) + (b[at + 1] << 16) + (b[at + 2] << 8) + b[at + 3];
  const u64 = (b, at) => u32(b, at) * 2 ** 32 + u32(b, at + 4);
  function setU32(b, at, v) {
    b[at] = (v >>> 24) & 255;
    b[at + 1] = (v >>> 16) & 255;
    b[at + 2] = (v >>> 8) & 255;
    b[at + 3] = v & 255;
  }
  function setU64(b, at, v) {
    setU32(b, at, Math.floor(v / 2 ** 32));
    setU32(b, at + 4, v % 2 ** 32);
  }

  // Боксы на отрезке [start, end): { type, start, size, body } (body — начало содержимого).
  function boxes(b, start, end) {
    const list = [];
    for (let at = start; at + 8 <= end; ) {
      let size = u32(b, at);
      let header = 8;
      if (size === 1) {
        size = u64(b, at + 8);
        header = 16;
      } else if (size === 0) {
        size = end - at;
      }
      if (size < header || at + size > end) throw new Error(`broken box at ${at}`);
      list.push({ type: typeAt(b, at), start: at, size, body: at + header });
      at += size;
    }
    return list;
  }

  const child = (b, box, type) => boxes(b, box.body, box.start + box.size).find((x) => x.type === type);
  function path(b, box, ...types) {
    let cur = box;
    for (const type of types) {
      cur = cur && child(b, cur, type);
    }
    return cur;
  }
  const copy = (b, box) => b.slice(box.start, box.start + box.size);
  // Бокс, вынутый копией: его собственные смещения — от нуля.
  const asBox = (bytes) => boxes(bytes, 0, bytes.length)[0];

  function makeBox(type, ...parts) {
    const size = 8 + parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(size);
    setU32(out, 0, size);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    let at = 8;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }

  // Полный бокс (version + flags): поле после 4 байт версии и флагов.
  const version = (b, box) => b[box.body];

  // Шкала и длительность фильма (mvhd) и дорожки (mdhd) — у них одно устройство.
  function timing(b, box) {
    const v = version(b, box);
    return v === 1
      ? { timescale: u32(b, box.body + 20), duration: u64(b, box.body + 24) }
      : { timescale: u32(b, box.body + 12), duration: u32(b, box.body + 16) };
  }
  function setTimingDuration(b, box, duration) {
    if (version(b, box) === 1) setU64(b, box.body + 24, duration);
    else setU32(b, box.body + 16, Math.min(duration, 0xffffffff));
  }

  // tkhd: номер дорожки и её длительность (в шкале фильма).
  function patchTkhd(b, box, trackId, duration) {
    const v = version(b, box);
    setU32(b, box.body + (v === 1 ? 20 : 12), trackId);
    if (duration === null) return;
    if (v === 1) setU64(b, box.body + 28, duration);
    else setU32(b, box.body + 20, Math.min(duration, 0xffffffff));
  }

  // elst: длительность каждого отрезка — в шкале фильма, её и переводим.
  function rescaleElst(b, box, factor) {
    const v = version(b, box);
    const count = u32(b, box.body + 4);
    const entry = v === 1 ? 20 : 12;
    for (let i = 0; i < count; i++) {
      const at = box.body + 8 + i * entry;
      if (v === 1) setU64(b, at, Math.round(u64(b, at) * factor));
      else setU32(b, at, Math.min(Math.round(u32(b, at) * factor), 0xffffffff));
    }
  }

  // Дорожка с новым номером; длительности tkhd и elst — в шкале фильма-результата.
  function retrack(b, trak, trackId, movieScale, ownScale, seconds) {
    const out = copy(b, trak);
    const t = asBox(out);
    const tkhd = child(out, t, "tkhd");
    if (!tkhd) throw new Error("no tkhd");
    patchTkhd(out, tkhd, trackId, seconds > 0 ? Math.round(seconds * movieScale) : null);
    const elst = path(out, t, "edts", "elst");
    if (elst && ownScale && ownScale !== movieScale) rescaleElst(out, elst, movieScale / ownScale);
    return out;
  }

  // trex и trep начинаются с номера дорожки сразу после версии и флагов.
  function retrackExt(b, box, trackId) {
    const out = copy(b, box);
    setU32(out, 12, trackId);
    return out;
  }

  // Файл: ftyp, moov, дорожка, её шкала и длительность, кусочки по времени.
  function parse(b) {
    const top = boxes(b, 0, b.length);
    const ftyp = top.find((x) => x.type === "ftyp");
    const moov = top.find((x) => x.type === "moov");
    if (!moov) throw new Error("no moov");
    const traks = boxes(b, moov.body, moov.start + moov.size).filter((x) => x.type === "trak");
    if (traks.length !== 1) throw new Error(`expected one track, got ${traks.length}`);
    const trak = traks[0];
    const mvhd = child(b, moov, "mvhd");
    const mdhd = path(b, trak, "mdia", "mdhd");
    if (!mvhd || !mdhd) throw new Error("no mvhd/mdhd");
    const mvex = child(b, moov, "mvex");
    const movie = timing(b, mvhd);
    const media = timing(b, mdhd);
    const mehd = mvex && child(b, mvex, "mehd");
    const mehdDuration = mehd ? (version(b, mehd) === 1 ? u64(b, mehd.body + 4) : u32(b, mehd.body + 4)) : 0;
    const seconds = Math.max(movie.duration, mehdDuration) / movie.timescale || media.duration / media.timescale || 0;

    // Кусочек — moof и всё, что за ним до следующего moof (mdat, иногда ещё что-то).
    const fragments = [];
    const moofs = top.filter((x) => x.type === "moof");
    for (const moof of moofs) {
      const next = top.find((x) => x.start > moof.start && (x.type === "moof" || x.type === "mfra"));
      const end = next ? next.start : b.length;
      const tfdt = path(b, moof, "traf", "tfdt");
      const decode = tfdt ? (version(b, tfdt) === 1 ? u64(b, tfdt.body + 4) : u32(b, tfdt.body + 4)) : 0;
      fragments.push({ start: moof.start, end, time: decode / media.timescale });
    }
    if (!fragments.length) throw new Error("not a fragmented mp4");
    return { b, ftyp, moov, mvhd, mvex, trak, movieScale: movie.timescale, seconds, fragments };
  }

  // Кусочек на новом месте: номер по порядку, номер дорожки, абсолютные смещения.
  function placeFragment(src, frag, trackId, sequence, newStart) {
    const out = src.b.slice(frag.start, frag.end);
    const moof = asBox(out);
    const mfhd = child(out, moof, "mfhd");
    if (mfhd) setU32(out, mfhd.body + 4, sequence);
    for (const traf of boxes(out, moof.body, moof.start + moof.size)) {
      if (traf.type !== "traf") continue;
      const tfhd = child(out, traf, "tfhd");
      if (!tfhd) continue;
      setU32(out, tfhd.body + 4, trackId);
      const flags = (out[tfhd.body + 1] << 16) | (out[tfhd.body + 2] << 8) | out[tfhd.body + 3];
      // base_data_offset — от начала файла: сдвигаем вместе с кусочком.
      if (flags & 1) setU64(out, tfhd.body + 8, u64(out, tfhd.body + 8) - frag.start + newStart);
    }
    return out;
  }

  function mergeFmp4(videoBytes, audioBytes, fallbackSeconds) {
    const video = parse(videoBytes);
    const audio = parse(audioBytes);
    const scale = video.movieScale;
    const seconds = Math.max(video.seconds, audio.seconds, fallbackSeconds || 0);

    const mvhdBytes = copy(video.b, video.mvhd);
    const mvhd = asBox(mvhdBytes);
    setTimingDuration(mvhdBytes, mvhd, Math.round(seconds * scale));
    // next_track_ID — последние 4 байта mvhd в обеих версиях.
    setU32(mvhdBytes, mvhdBytes.length - 4, 3);

    const vtrak = retrack(video.b, video.trak, 1, scale, video.movieScale, video.seconds || seconds);
    const atrak = retrack(audio.b, audio.trak, 2, scale, audio.movieScale, audio.seconds || seconds);

    const mvexParts = [];
    const fragmentDuration = new Uint8Array(8);
    setU32(fragmentDuration, 4, Math.min(Math.round(seconds * scale), 0xffffffff));
    mvexParts.push(makeBox("mehd", fragmentDuration));
    for (const [src, id] of [[video, 1], [audio, 2]]) {
      const ext = src.mvex ? boxes(src.b, src.mvex.body, src.mvex.start + src.mvex.size) : [];
      const trex = ext.find((x) => x.type === "trex");
      if (!trex) throw new Error("no trex");
      mvexParts.push(retrackExt(src.b, trex, id));
      const trep = ext.find((x) => x.type === "trep");
      if (trep) mvexParts.push(retrackExt(src.b, trep, id));
    }
    const moov = makeBox("moov", mvhdBytes, vtrak, atrak, makeBox("mvex", ...mvexParts));
    const ftyp = video.ftyp ? copy(video.b, video.ftyp) : new Uint8Array(0);

    // Вперемешку по времени: плеер читает файл по порядку, и звук не должен
    // оказаться весь в хвосте после видео. При равном времени — сначала видео.
    const order = [
      ...video.fragments.map((f) => ({ src: video, f, id: 1 })),
      ...audio.fragments.map((f) => ({ src: audio, f, id: 2 })),
    ].sort((x, y) => x.f.time - y.f.time || x.id - y.id);

    const parts = [ftyp, moov];
    let offset = ftyp.length + moov.length;
    order.forEach(({ src, f, id }, i) => {
      const placed = placeFragment(src, f, id, i + 1, offset);
      parts.push(placed);
      offset += placed.length;
    });

    const out = new Uint8Array(offset);
    let at = 0;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }

  root.videonerMergeFmp4 = mergeFmp4;
})(globalThis);
