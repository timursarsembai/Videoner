import { Bot, Context, InlineKeyboard } from "grammy";
import { LANGS, LANGUAGE_NAMES, detectLang, isLang, messages, type Lang } from "../i18n.js";
import { chosenLanguage, langOf, saveChosenLanguage } from "../language.js";
import { applyChatCommands } from "../commands.js";
import { loadSettings, saveSettings } from "../settings-store.js";
import { isGroupAdmin, settingsMessage } from "./group.js";

// Выбор языка вручную (language.ts):
//   /language в личке — свой язык (кнопки lg|u|…);
//   /language в группе или кнопка «Язык» в /settings — язык ответов в группе,
//   только для админов (кнопки lg|g|…, «назад» — lg|g|back).
// «auto» — снова по языку Telegram.

type Scope = "u" | "g";

function pickerKeyboard(scope: Scope, current: Lang | null, m: (typeof messages)[Lang]): InlineKeyboard {
  const kb = new InlineKeyboard();
  LANGS.forEach((code, i) => {
    kb.text(`${current === code ? "✓ " : ""}${LANGUAGE_NAMES[code]}`, `lg|${scope}|${code}`);
    if (i % 2 === 1) kb.row();
  });
  kb.row().text(`${current === null ? "✓ " : ""}${scope === "g" ? m.languageAutoGroup : m.languageAuto}`, `lg|${scope}|auto`);
  if (scope === "g") kb.row().text(m.settingsBack, "lg|g|back");
  return kb;
}

function isGroup(ctx: Context): boolean {
  return ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
}

async function groupPicker(ctx: Context) {
  const m = messages[await langOf(ctx)];
  const s = await loadSettings(ctx.chat!.id);
  return {
    text: m.languageChooseGroup,
    reply_markup: pickerKeyboard("g", isLang(s.language) ? s.language : null, m),
  };
}

export function registerLanguageHandlers(bot: Bot) {
  // ДО групп (см. bot.ts): иначе команду в группе проглотил бы групповой
  // обработчик текста.
  bot.command("language", async (ctx) => {
    if (ctx.chat.type === "channel") return;
    if (isGroup(ctx)) {
      if (!(await isGroupAdmin(ctx))) {
        await ctx.reply(messages[await langOf(ctx)].settingsAdminsOnly);
        return;
      }
      const { text, reply_markup } = await groupPicker(ctx);
      await ctx.reply(text, { reply_markup });
      return;
    }
    const m = messages[await langOf(ctx)];
    await ctx.reply(m.languageChoose, {
      reply_markup: pickerKeyboard("u", ctx.from ? await chosenLanguage(ctx.from.id) : null, m),
    });
  });

  // Кнопка «Язык» в /settings. ДО обработчика gs|… (handlers/group.ts).
  bot.callbackQuery("gs|lang", async (ctx) => {
    if (!isGroup(ctx) || !(await isGroupAdmin(ctx))) {
      await ctx.answerCallbackQuery({ text: messages[await langOf(ctx)].settingsAdminsOnly, show_alert: true });
      return;
    }
    await ctx.answerCallbackQuery();
    const { text, reply_markup } = await groupPicker(ctx);
    await ctx.editMessageText(text, { reply_markup }).catch((e) => console.error("Выбор языка:", e?.message ?? e));
  });

  bot.callbackQuery(/^lg\|(u|g)\|(\w+)$/, async (ctx) => {
    const [, scope, value] = ctx.match as RegExpMatchArray;
    const lang: Lang | null = value === "auto" ? null : isLang(value) ? value : null;
    if (value !== "auto" && value !== "back" && !lang) {
      await ctx.answerCallbackQuery();
      return;
    }

    if (scope === "u") {
      // Свой язык выбирают в личке: в группе такая кнопка была бы чужой.
      if (ctx.chat?.type !== "private" || value === "back") {
        await ctx.answerCallbackQuery();
        return;
      }
      try {
        await saveChosenLanguage(ctx.from.id, lang);
      } catch (e: any) {
        console.error(`Язык ${ctx.from.id}: не сохранился:`, e?.message ?? e);
        await ctx.answerCallbackQuery({ text: messages[await langOf(ctx)].settingsFailed, show_alert: true });
        return;
      }
      await ctx.answerCallbackQuery();
      const m = messages[lang ?? detectLang(ctx.from.language_code)];
      await ctx
        .editMessageText(lang ? m.languageSaved(LANGUAGE_NAMES[lang]) : m.languageSavedAuto)
        .catch((e) => console.error("Выбор языка:", e?.message ?? e));
      await applyChatCommands(ctx.api, ctx.from.id, lang, false);
      return;
    }

    if (!isGroup(ctx) || !(await isGroupAdmin(ctx))) {
      await ctx.answerCallbackQuery({ text: messages[await langOf(ctx)].settingsAdminsOnly, show_alert: true });
      return;
    }
    const chatId = ctx.chat!.id;
    let settings;
    if (value === "back") {
      settings = await loadSettings(chatId);
    } else {
      try {
        settings = await saveSettings(chatId, { language: lang });
      } catch (e: any) {
        console.error(`Группа ${chatId}: язык не сохранился:`, e?.message ?? e);
        await ctx.answerCallbackQuery({ text: messages[await langOf(ctx)].settingsFailed, show_alert: true });
        return;
      }
      await applyChatCommands(ctx.api, chatId, lang, true);
    }
    await ctx.answerCallbackQuery();
    const { text, reply_markup } = await settingsMessage(ctx, settings);
    await ctx.editMessageText(text, { reply_markup }).catch((e) => console.error("Настройки:", e?.message ?? e));
  });
}
