// Очередь ссылок одного человека в одном чате.
//
// Зачем. Человек присылает несколько ссылок — одним сообщением или несколькими
// подряд. Скачиваем их строго по одной: выбор качества показываем только для
// текущей ссылки, следующая получает свой выбор лишь после того, как файл
// предыдущей отправлен. Так у человека одновременно ровно одно скачивание, а
// в чате — ровно одна живая клавиатура, и перепутать, к какой ссылке кнопка,
// нельзя.
//
// Модуль чистый: ни Telegram, ни сервера он не знает — только состояние и
// переходы. Всё, что с сетью, делает handlers/download.ts. Поэтому переходы
// проверяются тестом без моков (queue.test.ts).
//
// Хранится в памяти процесса. При перевыкатке бота очередь пропадает — об этом
// бот предупреждает перед остановкой (notifyQueuesBeforeShutdown в download.ts).

import type { SubtitleTrack } from "./subtitles.js";

// Сколько ссылок держим на человека, считая текущую. Очередь — не склад:
// суточный лимит всё равно 20 скачиваний, и десятка хватает с запасом.
export const QUEUE_LIMIT = 10;

export type Phase = "analyzing" | "choosing" | "downloading";

export type Current = {
  url: string;
  phase: Phase;
  // Сообщение, в котором показан выбор качества (и в котором потом пишем
  // «пропущено»). До ответа сервера его ещё нет.
  messageId?: number;
  // Сведения о ролике — появляются после анализа.
  title?: string;
  thumbnail?: string;
  // Из чего собрана клавиатура выбора. Храним, чтобы вернуть её после
  // экрана языков субтитров, не спрашивая сервер второй раз.
  qualities?: { video: string[]; audio: string[] };
  // Уже упорядоченные под кнопки (orderTracks) — номер кнопки ссылается сюда.
  subtitles?: SubtitleTrack[];
  // Отличает эту ссылку от следующей с тем же адресом: таймер пропуска и
  // запоздалые ответы сверяют его и не трогают уже чужое состояние.
  token: number;
};

// Кто прислал ссылки. Нужен и для запросов к серверу (лимит считается по
// telegramId), и для языка сообщений, когда следующая ссылка стартует сама,
// уже без входящего сообщения под рукой.
export type Sender = {
  chatId: number;
  userId: number;
  username?: string;
  languageCode?: string;
};

export type OwnerState = Sender & {
  current: Current | null;
  pending: string[];
};

export type EnqueueResult = {
  // Ссылка, с которой начать прямо сейчас, — если до этого человек ничего не
  // ждал. Остальные легли в pending.
  startNow: string | null;
  // Сколько встало в ожидание и сколько всего ждёт после этого.
  queued: number;
  waiting: number;
  // Отброшенные — повтор уже присланной или сверх предела.
  duplicates: number;
  overLimit: number;
};

let nextToken = 1;

export class LinkQueues {
  private owners = new Map<string, OwnerState>();

  static key(chatId: number, userId: number): string {
    return `${chatId}:${userId}`;
  }

  get(key: string): OwnerState | undefined {
    return this.owners.get(key);
  }

  entries(): IterableIterator<[string, OwnerState]> {
    return this.owners.entries();
  }

  enqueue(key: string, sender: Sender, urls: string[]): EnqueueResult {
    let state = this.owners.get(key);
    if (!state) {
      state = { ...sender, current: null, pending: [] };
      this.owners.set(key, state);
    } else {
      // Имя и язык берём свежие: человек мог сменить их между сообщениями.
      state.username = sender.username;
      state.languageCode = sender.languageCode;
    }

    const result: EnqueueResult = { startNow: null, queued: 0, waiting: 0, duplicates: 0, overLimit: 0 };
    for (const url of urls) {
      // Одну ссылку дважды не качаем: чаще всего это случайная повторная
      // вставка, а не желание получить второй экземпляр файла.
      if (state.current?.url === url || state.pending.includes(url)) {
        result.duplicates++;
        continue;
      }
      if ((state.current ? 1 : 0) + state.pending.length >= QUEUE_LIMIT) {
        result.overLimit++;
        continue;
      }
      if (!state.current) {
        state.current = { url, phase: "analyzing", token: nextToken++ };
        result.startNow = url;
      } else {
        state.pending.push(url);
        result.queued++;
      }
    }
    result.waiting = state.pending.length;
    this.dropIfEmpty(key, state);
    return result;
  }

  // Закрывает текущую ссылку (скачана, пропущена, ошибка) и достаёт следующую.
  // token — защита от двойного закрытия: таймер пропуска и нажатие кнопки могут
  // прийти почти одновременно, и второй не должен выкинуть ещё и следующую
  // ссылку.
  finish(key: string, token: number): Current | null {
    const state = this.owners.get(key);
    if (!state || state.current?.token !== token) return null;
    const url = state.pending.shift();
    state.current = url ? { url, phase: "analyzing", token: nextToken++ } : null;
    this.dropIfEmpty(key, state);
    return state.current;
  }

  // Суточный лимит исчерпан — остальные ссылки всё равно не скачать. Возвращает,
  // сколько ожидавших сброшено.
  clear(key: string): number {
    const state = this.owners.get(key);
    if (!state) return 0;
    const dropped = state.pending.length;
    this.owners.delete(key);
    return dropped;
  }

  private dropIfEmpty(key: string, state: OwnerState) {
    if (!state.current && state.pending.length === 0) this.owners.delete(key);
  }
}

// Все ссылки из текста сообщения. Раньше сообщение целиком считалось одной
// ссылкой, и две ссылки в одном сообщении давали ошибку.
//
// Хвостовую пунктуацию срезаем: ссылку часто вставляют в фразу («вот:
// https://…, и ещё https://…»), и запятая, точка или скобка не должны уехать
// на сервер частью адреса.
export function extractUrls(text: string): string[] {
  const found = text.match(/https?:\/\/\S+/gi) ?? [];
  return found.map((u) => u.replace(/[.,;:!?)\]}»"'>]+$/, "")).filter((u) => u.length > "https://".length);
}
