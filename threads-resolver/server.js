'use strict';

/**
 * Резервный резолвер Threads.
 *
 * Основной путь (плагин yt-dlp, server/ytdlp-plugins/threads) берёт данные из
 * server-side рендера, который Meta отдаёт по UA поискового робота. Путь живой,
 * но держится на том, что Meta не сверяет этот UA с reverse DNS. Начнёт сверять —
 * он умрёт без предупреждения, и тогда работает этот контейнер.
 *
 * Здесь важны два замера от 10.08.2026.
 *
 * Настоящему браузеру с IP дата-центра Threads отдаёт заглушку «The link's not
 * working or the page is gone» — пустую страницу вместо поста. Через резидентный
 * прокси тот же Chromium открывает пост нормально. Поэтому прокси тут не опция,
 * а условие работы: без него резерв бесполезен.
 *
 * И тогда данные лежат прямо в HTML страницы, теми же блоками data-sjs, что и в
 * SSR для робота, — перехватывать GraphQL не нужно. Читаем блоки из готового DOM
 * и отдаём плагину узел поста, который он разбирает тем же кодом, что и SSR.
 *
 * Два пути ломаются по разным причинам (один — от сверки UA робота, другой — от
 * репутации IP), в этом и смысл резерва: общей точки отказа у них нет.
 *
 * Сюда же уходят короткие ссылки /t/CODE: их SSR не отдаёт ни при каком UA.
 *
 * Chromium поднимается только по требованию и гасится после простоя — держать
 * браузер в памяти ради резерва, который в норме не нужен, незачем.
 */

const http = require('http');
const { chromium } = require('playwright');

const PORT = Number(process.env.PORT || 4417);
const NAV_TIMEOUT_MS = Number(process.env.NAV_TIMEOUT_MS || 45000);
// Отдельный, более короткий срок на появление данных в DOM. Живой пост
// отдаётся за 2–4 секунды, так что ждать дольше смысла нет: если данных не
// появилось, помогает не терпение, а новая попытка с чистого контекста.
const EXTRACT_TIMEOUT_MS = Number(process.env.EXTRACT_TIMEOUT_MS || 12000);
// Неудачная попытка теперь обрывается на заглушке за пару секунд, а не
// досиживает таймаут, поэтому попыток можно позволить больше.
const ATTEMPTS = Number(process.env.ATTEMPTS || 5);
const IDLE_SHUTDOWN_MS = Number(process.env.IDLE_SHUTDOWN_MS || 5 * 60 * 1000);
const PROXY_URL = process.env.THREADS_PROXY_URL || '';

// Три формы адреса: канонический пост, короткая ссылка /t/ и ссылка
// «Поделиться» /share/ из мобильного приложения. У последней код СВОЙ и с
// кодом поста не совпадает — настоящий берётся из og:url уже на странице.
const POST_RE = /^\/(?:@([^/?#]+)\/post|t|share)\/([A-Za-z0-9_-]+)/;
const SHARE_RE = /^\/share\//;

// Обычный браузерный UA: здесь мы и есть браузер, притворяться роботом не нужно
// (и вредно — роботам Meta отдаёт другую страницу).
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

let browser = null;
let idleTimer = null;

function proxyConfig() {
  if (!PROXY_URL) return undefined;
  const u = new URL(PROXY_URL);
  return {
    server: `${u.protocol}//${u.hostname}:${u.port}`,
    username: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
  };
}

async function getBrowser() {
  if (browser && browser.isConnected()) return browser;
  browser = await chromium.launch({
    // Chromium в контейнере без своего пользователя и без большого /dev/shm:
    // без этих флагов он падает на старте.
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    proxy: proxyConfig(),
  });
  return browser;
}

async function closeBrowser() {
  if (!browser) return;
  const b = browser;
  browser = null;
  await b.close().catch(() => {});
}

function touchIdle() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(async () => {
    if (browser) {
      await closeBrowser();
      console.log('Chromium закрыт после простоя');
    }
  }, IDLE_SHUTDOWN_MS);
  idleTimer.unref();
}

/**
 * Достаём узел поста из блоков data-sjs готовой страницы.
 *
 * Выполняется внутри вкладки: textContent отдаёт уже раскодированный JSON, так
 * что возни с HTML-сущностями (из-за которых иначе ломаются ссылки CDN с &amp;
 * в параметрах) здесь просто нет.
 *
 * Сверка по code обязательна. На несуществующий или удалённый пост Threads не
 * отдаёт 404, а молча показывает посторонние — без сверки резолвер вернул бы
 * чужое видео. На странице поста рядом лежат ещё и «похожие треды», так что
 * взять первое попавшееся видео тем более нельзя.
 */
function extractInPage(code) {
  // Ссылка «Поделиться» кода поста не содержит — достаём его из og:url.
  // Если поста нет, og:url вырождается в голый https://www.threads.com/,
  // шаблон не совпадёт и мы честно вернём «не найдено», а не первое
  // попавшееся видео со страницы.
  if (!code) {
    const og = document.querySelector('meta[property="og:url"]');
    const m = og && og.content.match(/\/@([^/?#]+)\/post\/([A-Za-z0-9_-]+)/);
    if (!m) return { node: null, gone: false };
    code = m[2];
  }

  const found = [];
  const walk = (obj) => {
    if (found.length) return;
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (obj && typeof obj === 'object') {
      if (obj.code === code && (obj.video_versions || obj.carousel_media)) {
        found.push(obj);
        return;
      }
      Object.values(obj).forEach(walk);
    }
  };

  for (const script of document.querySelectorAll('script[type="application/json"][data-sjs]')) {
    try {
      walk(JSON.parse(script.textContent));
    } catch (e) {
      /* блок не наш — пропускаем */
    }
    if (found.length) break;
  }

  // Заглушка, которую Threads показывает вместо поста, когда решил нам его не
  // отдавать. Отличить её важно: без этого каждая неудачная попытка досиживала
  // весь таймаут, и три попытки складывались в минуту с лишним, хотя ответ был
  // ясен на второй секунде.
  const text = document.body ? document.body.innerText : '';
  const gone = /page is gone|link's not working|Sorry, this page/i.test(text);

  return { node: found[0] || null, gone };
}

function hasVideo(node) {
  if (!node) return false;
  if (node.video_versions && node.video_versions.length) return true;
  return (node.carousel_media || []).some((m) => m && m.video_versions && m.video_versions.length);
}

async function resolve(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, error: 'Некорректная ссылка' };
  }
  if (!/^(?:www\.)?threads\.(?:net|com)$/.test(parsed.hostname)) {
    return { ok: false, error: 'Это не ссылка на Threads' };
  }
  const match = POST_RE.exec(parsed.pathname);
  if (!match) return { ok: false, error: 'Это не ссылка на пост Threads' };
  // null — код поста в адресе не назван, страница подскажет его сама.
  const code = SHARE_RE.test(parsed.pathname) ? null : match[2];

  // Threads и через прокси иногда отдаёт страницу без данных — та же
  // нестабильность, что и у основного пути. Пробуем несколько раз с чистого
  // контекста: удачная попытка занимает 2–4 секунды, так что повтор дёшев.
  let last = { ok: false, error: 'Пост не найден или недоступен' };
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    last = await attemptResolve(parsed, code);
    if (last.ok) return last;
    // Ссылка заведомо не та — повторять нечего.
    if (last.fatal) return last;
    // Следующую попытку делаем с нуля, а не только с новым контекстом: по
    // логам промахи шли пачками внутри одного запущенного браузера, а сразу
    // после его перезапуска ответ приходил нормальный. Чистого контекста
    // для этого мало — состояние переживает его (кэш, живые соединения).
    // Запуск Chromium стоит около секунды, а резерв и так редкий путь.
    await closeBrowser();
  }
  return last;
}

async function attemptResolve(parsed, code) {
  const b = await getBrowser();
  const context = await b.newContext({
    userAgent: UA,
    viewport: { width: 1280, height: 900 },
    locale: 'en-US',
  });
  // Картинки, шрифты, стили и сами видеопотоки не нужны — нам нужен только
  // JSON в разметке. Трафик резидентного прокси платный и считается по
  // гигабайтам, а на них приходится основная часть веса страницы.
  await context.route('**/*', (route) => {
    const type = route.request().resourceType();
    if (type === 'image' || type === 'font' || type === 'media') {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();

  let node = null;
  try {
    await page.goto(parsed.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: NAV_TIMEOUT_MS,
    });
    // Короткие ссылки /t/<code> отдельной обработки не требуют: Threads уводит
    // на канонический /@user/post/<code> ещё редиректом, и к первому же кадру
    // данные в разметке уже есть (проверено — code в DOM на нулевой миллисекунде).
    // Ожидание смены адреса тут стояло и только добавляло по 12 секунд к каждой
    // неудачной попытке.

    // Ждём появления самих данных, а не networkidle: у Threads фоновые запросы
    // не смолкают никогда, и ожидание тишины упиралось бы в таймаут всегда.
    const deadline = Date.now() + EXTRACT_TIMEOUT_MS;
    let lastEvalError = null;
    while (Date.now() < deadline) {
      try {
        const result = await page.evaluate(extractInPage, code);
        node = result.node;
        if (!node && result.gone) {
          // Страница-заглушка: данных тут не появится, ждать нечего.
          break;
        }
      } catch (e) {
        // Молча глотать нельзя: при ошибке разбора резолвер выглядел бы как
        // «поста нет», и настоящая причина не попала бы даже в лог.
        lastEvalError = e.message;
        node = null;
      }
      if (hasVideo(node)) break;
      await page.waitForTimeout(300);
    }
    if (!hasVideo(node) && lastEvalError) {
      console.error(`разбор страницы не удался: ${lastEvalError}`);
    }
  } catch (e) {
    return { ok: false, error: `Не удалось открыть пост: ${e.message}` };
  } finally {
    await context.close().catch(() => {});
    touchIdle();
  }

  if (!node) return { ok: false, error: 'Пост не найден или недоступен' };
  // fatal: пост открылся, видео в нём просто нет — повторы ничего не изменят.
  if (!hasVideo(node)) {
    return { ok: false, fatal: true, error: 'В этом посте Threads нет видео' };
  }
  return { ok: true, node };
}

// Chromium прожорлив, а это резерв — обрабатываем по одному запросу за раз,
// чтобы всплеск обращений не съел память сервера.
let queue = Promise.resolve();
function enqueue(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      browser: Boolean(browser && browser.isConnected()),
      proxy: Boolean(PROXY_URL),
    }));
    return;
  }

  if (url.pathname !== '/resolve') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Не найдено' }));
    return;
  }

  const target = url.searchParams.get('url');
  if (!target) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Не передан параметр url' }));
    return;
  }

  enqueue(() => resolve(target))
    .then((result) => {
      console.log(`${result.ok ? 'ok  ' : 'fail'} ${target}${result.ok ? '' : ' — ' + result.error}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })
    .catch((e) => {
      console.error(`ошибка ${target}: ${e.stack || e.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: `Резолвер упал: ${e.message}` }));
    });
});

server.listen(PORT, () => {
  console.log(`threads-resolver слушает :${PORT}${PROXY_URL ? ' (через прокси)' : ' БЕЗ ПРОКСИ — Threads отдаст заглушку'}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, async () => {
    server.close();
    if (browser) await browser.close().catch(() => {});
    process.exit(0);
  });
}
