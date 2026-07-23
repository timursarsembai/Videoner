import { Bot, InlineKeyboard } from "grammy";
import { detectLang, messages } from "../i18n.js";
import { api } from "../helpers.js";

// Цены подписок изначально подбирались от цены прежнего разового HD-скачивания
// (15⭐ ≈ $0.30 по курсу ~$0.02/⭐ при покупке звёзд в приложении, тот разовый
// вариант убран) — месяц ≈ $3, год ≈ $30 (экономия ~$6 к 12 месячным). Telegram
// Stars поддерживает автопродление подписки ТОЛЬКО с фиксированным периодом
// 30 дней — годовой автопродляемой подписки в принципе не существует, поэтому
// годовая реализована как разовая покупка на 365 дней
// (см. память security-audit — секция про подписки).
const SUBSCRIPTION_MONTHLY_STARS = 150;
const SUBSCRIPTION_YEARLY_STARS = 1500;
const SUBSCRIPTION_MONTH_SECONDS = 2592000; // фиксированное значение, требуется Telegram API
const SUBSCRIPTION_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Общие кнопки тарифов — переиспользуются в /subscribe, диплинке /start subscribe
// и как допродажа прямо в результате /info и в отказах по HD/лимиту
// (см. handlers/download.ts), чтобы не заставлять пользователя отдельно
// вспоминать команду /subscribe.
export function addSubscriptionButtons(kb: InlineKeyboard, m: (typeof messages)["ru"]): InlineKeyboard {
  return kb.text(m.subscribeMonthlyButton, "sub|month").row().text(m.subscribeYearlyButton, "sub|year");
}

// Подписочные payload детерминированы (sub_month_<telegramId> / sub_year_<telegramId>) —
// единственный вид оплаты, который теперь существует в боте (никаких разовых
// покупок конкретных скачиваний), включая ПОВТОРНЫЕ автосписания месячной
// подписки, для которых Telegram переиспользует тот же payload и снова шлёт
// pre_checkout_query/successful_payment без нового вызова createInvoiceLink.
export function isSubscriptionPayload(payload: string): boolean {
  return payload.startsWith("sub_month_") || payload.startsWith("sub_year_");
}

export function registerSubscriptionHandlers(bot: Bot) {
  bot.command("subscribe", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const kb = addSubscriptionButtons(new InlineKeyboard(), m);
    await ctx.reply(m.subscriptionPitch, { reply_markup: kb });
  });

  // Регистрируем ДО общего bot.on("callback_query:data", ...) в handlers/download.ts —
  // grammY идёт по обработчикам по порядку и останавливается на первом
  // совпадении, поэтому "sub|month"/"sub|year" сюда попадают, а не в generic
  // обработчик v|/a|-кнопок (порядок регистрации задаётся в bot.ts).
  bot.callbackQuery("sub|month", async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const telegramId = ctx.from.id;

    // subscription_period есть только у createInvoiceLink (не у sendInvoice) —
    // поэтому для настоящей автопродляемой подписки шлём ссылку, а не invoice-карточку.
    const link = await ctx.api.createInvoiceLink(
      m.subMonthlyInvoiceTitle,
      m.subMonthlyInvoiceDescription,
      `sub_month_${telegramId}`,
      "",
      "XTR",
      [{ label: m.subMonthlyInvoiceLabel, amount: SUBSCRIPTION_MONTHLY_STARS }],
      { subscription_period: SUBSCRIPTION_MONTH_SECONDS },
    );
    const kb = new InlineKeyboard().url(m.payButton, link);
    await ctx.reply(m.subMonthlyPrompt, { reply_markup: kb });
  });

  bot.callbackQuery("sub|year", async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const telegramId = ctx.from.id;

    // Годовая — обычный разовый invoice (без subscription_period, см. константы выше).
    await ctx.replyWithInvoice(
      m.subYearlyInvoiceTitle,
      m.subYearlyInvoiceDescription,
      `sub_year_${telegramId}`,
      "XTR",
      [{ label: m.subYearlyInvoiceLabel, amount: SUBSCRIPTION_YEARLY_STARS }],
    );
  });

  bot.on("pre_checkout_query", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const payload = ctx.preCheckoutQuery.invoice_payload;
    if (isSubscriptionPayload(payload)) {
      await ctx.answerPreCheckoutQuery(true);
      return;
    }
    await ctx.answerPreCheckoutQuery(false, messages[lang].orderExpired);
  });

  bot.on("message:successful_payment", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const payment = ctx.message.successful_payment;
    const payload = payment.invoice_payload;

    if (!isSubscriptionPayload(payload)) return;

    const isMonthly = payload.startsWith("sub_month_");
    let until: Date;
    if (isMonthly) {
      // Месячную дату истечения ведёт сам Telegram (subscription_expiration_date) —
      // при автопродлении он уже корректно двигает её на новый период.
      until = new Date(
        (payment.subscription_expiration_date ?? Math.floor(Date.now() / 1000) + SUBSCRIPTION_MONTH_SECONDS) * 1000,
      );
    } else {
      // Годовая — разовая покупка (см. константы выше), сервер её просто
      // перезаписывает при каждом вызове /bot-users/subscription. Без этого
      // повторная покупка ДО истечения текущей подписки могла бы УКОРОТИТЬ
      // реальный остаток (until = сейчас + год, а не текущий остаток + год).
      // Аддитивное продление: прибавляем год к максимуму из "сейчас" и уже
      // действующего subscriptionUntil, а не считаем заново от текущего момента.
      let base = Date.now();
      try {
        const current = await api<{ subscriptionUntil: string | null }>(
          `/bot-users/${ctx.from.id}/subscription`,
        );
        if (current.subscriptionUntil) {
          const currentUntilMs = new Date(current.subscriptionUntil).getTime();
          if (currentUntilMs > base) base = currentUntilMs;
        }
      } catch (e) {
        // Оплата уже прошла — ни в коем случае не блокируем активацию из-за
        // сбоя этого дополнительного запроса, просто считаем от "сейчас".
        console.error("Failed to fetch current subscription before renewal, defaulting to now:", e);
      }
      until = new Date(base + SUBSCRIPTION_YEAR_MS);
    }

    try {
      await api("/bot-users/subscription", {
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramLanguageCode: ctx.from.language_code,
        kind: isMonthly ? "MONTHLY" : "YEARLY",
        until: until.toISOString(),
      });
      const dateStr = until.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US");
      await ctx.reply(m.subscriptionActivated(dateStr, isMonthly));
    } catch (e: any) {
      console.error("Failed to persist subscription:", e);
      await ctx.reply(m.subscriptionActivationFailed);
    }
  });
}
