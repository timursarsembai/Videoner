import { InlineKeyboard, type Bot } from "grammy";
import { api } from "./helpers.js";
import type { Lang } from "./i18n.js";
import { langOf } from "./language.js";
import { SURVEY_TEXTS, type SurveyTexts } from "./survey-texts.js";

// Опрос о расшифровке видео (владелец 23.11.2026): приходит как подсказка
// после скачивания (promo.ts, ключ "survey") — один раз, первым в очереди — и
// разовой рассылкой тем, кто давно не качал. Можно отметить несколько
// вариантов; каждое нажатие сразу пишется на сервер (lib/surveys.ts), там же
// правило «ничего из этого» снимает остальные. Итоги — в дашборде.

export const SURVEY = "transcribe";
type Option = keyof SurveyTexts["options"];
export const SURVEY_OPTIONS: Option[] = ["subtitles", "text", "summary", "none"];

// Кнопки опроса: отмеченные — с галочкой, внизу «Готово».
export function surveyKeyboard(lang: Lang, chosen: readonly string[] = []): InlineKeyboard {
  const t = SURVEY_TEXTS[lang] ?? SURVEY_TEXTS.en;
  const kb = new InlineKeyboard();
  for (const o of SURVEY_OPTIONS) {
    kb.text(chosen.includes(o) ? `☑️ ${t.options[o]}` : t.options[o], `sv|${SURVEY}|t|${o}`).row();
  }
  return kb.text(t.done, `sv|${SURVEY}|d`);
}

export function registerSurveyHandlers(bot: Bot) {
  bot.callbackQuery(/^sv\|([a-z0-9-]+)\|(?:t\|([a-z0-9-]+)|d)$/, async (ctx) => {
    const lang = await langOf(ctx);
    const t = SURVEY_TEXTS[lang] ?? SURVEY_TEXTS.en;
    const [, survey, option] = ctx.match;
    const done = !option;
    let choices: string[] | null = null;
    try {
      ({ choices } = await api<{ choices: string[] | null }>(
        `/bot-users/${ctx.from.id}/survey/${survey}`,
        done ? { done: true } : { option },
        { timeoutMs: 5000 },
      ));
    } catch (e: any) {
      console.error("Ответ на опрос не записан:", e?.message ?? e);
      await ctx.answerCallbackQuery().catch(() => {});
      return;
    }
    if (!choices) {
      await ctx.answerCallbackQuery().catch(() => {});
      return;
    }
    if (done) {
      if (!choices.length) {
        await ctx.answerCallbackQuery({ text: t.pickOne }).catch(() => {});
        return;
      }
      // Вместо вариантов — одна кнопка «Спасибо»: видно, что ответ принят.
      // Нажатие на неё — снова «Готово», ничего не меняет.
      await ctx.answerCallbackQuery({ text: t.thanks }).catch(() => {});
      await ctx
        .editMessageReplyMarkup({ reply_markup: new InlineKeyboard().text(`✅ ${t.thanks}`, `sv|${survey}|d`) })
        .catch((e) => console.error("Не удалось закрыть опрос:", e?.message ?? e));
      return;
    }
    await ctx.answerCallbackQuery().catch(() => {});
    await ctx
      .editMessageReplyMarkup({ reply_markup: surveyKeyboard(lang, choices) })
      .catch((e) => console.error("Не удалось обновить кнопки опроса:", e?.message ?? e));
  });
}
