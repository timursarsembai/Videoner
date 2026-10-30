import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { cookieCryptoEnabled, decryptCookies, encryptCookies } from 'src/lib/cookie-crypto';
import {
  COOKIE_PLATFORMS,
  CookiePlatform,
  ExtractResult,
  cookiePlatformFor,
  extractPlatformCookies,
  scrubCookieLines,
  sessionFailureKind,
} from 'src/lib/user-cookies';

// Подключённые людьми куки (см. модель UserCookie в schema.prisma).
//
// Сервер доверяет боту в том, КТО и КУДА подключает куки (права админа группы,
// настройка «кто может подключать» — проверяет бот), и сам следит за тем,
// чтобы куки одной области никогда не использовались в другой.

// Область — личка человека или одна группа. Другой формы сервер не примет:
// иначе опечатка в боте могла бы создать «общую» область.
const SCOPE_RE = /^(user:\d{1,19}|chat:-?\d{1,19})$/;

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_TTL_MS = 10 * 60_000;
// Сколько записей пула пробуем на один запрос: дальше — уже долгое ожидание
// для человека, а не помощь.
const MAX_ATTEMPTS = 3;
// Подряд идущие «вход не действует», после которых запись выключается.
const FAILURES_TO_DISABLE = 3;
// Сколько аккаунтов одной площадки в одной области — защита от мусора.
const MAX_PER_SCOPE_PLATFORM = 20;

export interface Owner {
  telegramId: number;
  name?: string;
  lang?: string;
}

export interface CookieView {
  id: string;
  scope: string;
  platform: string;
  ownerTelegramId: string;
  ownerName: string | null;
  active: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
}

function assertScope(scope: string) {
  if (!SCOPE_RE.test(scope)) throw new BadRequestException('Invalid scope');
}

function assertPlatform(platform?: string): CookiePlatform | undefined {
  if (platform === undefined) return undefined;
  if (!(platform in COOKIE_PLATFORMS)) throw new BadRequestException('Unknown platform');
  return platform as CookiePlatform;
}

function newCode(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `${s.slice(0, 3)}-${s.slice(3)}`;
}

@Injectable()
export class UserCookiesService {
  constructor(private readonly prisma: PrismaService) {}

  enabled(): boolean {
    return cookieCryptoEnabled();
  }

  private requireEnabled() {
    if (!this.enabled()) throw new ServiceUnavailableException('User cookies are not configured');
  }

  private extract(raw: string, platform?: string) {
    if (typeof raw !== 'string' || !raw.trim()) throw new BadRequestException('No cookies');
    // Файл cookies.txt целого браузера бывает большим, но не мегабайтами.
    if (Buffer.byteLength(raw, 'utf8') > 2 * 1024 * 1024) throw new BadRequestException('Cookies file is too large');
    const res = extractPlatformCookies(raw, assertPlatform(platform));
    // Явное сужение: strictNullChecks в проекте выключен, и TypeScript не
    // различает ветки объединения по полю ok сам.
    if (res.ok === false) throw new BadRequestException(`Cookies rejected: ${(res as { reason: string }).reason}`);
    return res as Extract<ExtractResult, { ok: true }>;
  }

  private async save(scope: string, platform: CookiePlatform, netscape: string, owner: Owner) {
    assertScope(scope);
    const ownerId = BigInt(owner.telegramId);
    const existing = await this.prisma.userCookie.findUnique({
      where: { scope_platform_ownerTelegramId: { scope, platform, ownerTelegramId: ownerId } },
      select: { id: true },
    });
    if (!existing) {
      const count = await this.prisma.userCookie.count({ where: { scope, platform } });
      if (count >= MAX_PER_SCOPE_PLATFORM) throw new BadRequestException('Too many accounts for this platform here');
    }
    const data = encryptCookies(netscape);
    const row = await this.prisma.userCookie.upsert({
      where: { scope_platform_ownerTelegramId: { scope, platform, ownerTelegramId: ownerId } },
      create: { scope, platform, ownerTelegramId: ownerId, ownerName: owner.name, ownerLang: owner.lang, data },
      // Повторное подключение — свежие куки и чистая история отказов.
      update: { data, ownerName: owner.name, ownerLang: owner.lang, failures: 0, invalidAt: null },
    });
    return { id: row.id, platform };
  }

  // Файл cookies.txt, присланный боту.
  async addFromFile(scope: string, raw: string, owner: Owner, platform?: string) {
    this.requireEnabled();
    const res = this.extract(raw, platform);
    const saved = await this.save(scope, res.platform, res.netscape, owner);
    return { ...saved, count: res.count };
  }

  // Кнопка в расширении: куки сразу на сервер, человеку — короткий код.
  async createCode(raw: string, platform?: string) {
    this.requireEnabled();
    const res = this.extract(raw, platform);
    await this.prisma.cookieConnectCode.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);
    const data = encryptCookies(res.netscape);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = newCode();
      try {
        await this.prisma.cookieConnectCode.create({ data: { code, platform: res.platform, data, expiresAt } });
        return { code, platform: res.platform, expiresAt };
      } catch {
        // Совпал с живым кодом — берём другой.
      }
    }
    throw new ServiceUnavailableException('Could not create a code');
  }

  private normalizeCode(rawCode: string): string | null {
    const letters = String(rawCode ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return letters.length === 6 ? `${letters.slice(0, 3)}-${letters.slice(3)}` : null;
  }

  // Код засветился там, где его могли подсмотреть (в группе отказали, код
  // прислали в общий чат без команды), — уничтожаем, не подключая.
  async burnCode(rawCode: string) {
    const code = this.normalizeCode(rawCode);
    if (code) await this.prisma.cookieConnectCode.delete({ where: { code } }).catch(() => null);
    return { ok: true };
  }

  // Бота удалили из группы — её подключения больше незачем хранить.
  async removeScope(scope: string) {
    assertScope(scope);
    if (!scope.startsWith('chat:')) throw new BadRequestException('Only group scopes');
    const { count } = await this.prisma.userCookie.deleteMany({ where: { scope } });
    return { removed: count };
  }

  // Код из чата: «ABC-123», «abc123», с пробелами — человек мог переписать
  // его руками.
  async claim(rawCode: string, scope: string, owner: Owner) {
    this.requireEnabled();
    const code = this.normalizeCode(rawCode);
    if (!code) throw new NotFoundException('Code not found');
    // Удаляем сразу при чтении: второй раз тот же код не сработает, даже если
    // его подсмотрели в группе.
    const row = await this.prisma.cookieConnectCode.delete({ where: { code } }).catch(() => null);
    if (!row || row.expiresAt < new Date()) throw new NotFoundException('Code not found');
    return this.save(scope, row.platform as CookiePlatform, decryptCookies(row.data), owner);
  }

  private view(r: {
    id: string;
    scope: string;
    platform: string;
    ownerTelegramId: bigint;
    ownerName: string | null;
    invalidAt: Date | null;
    createdAt: Date;
    lastUsedAt: Date | null;
  }): CookieView {
    return {
      id: r.id,
      scope: r.scope,
      platform: r.platform,
      ownerTelegramId: r.ownerTelegramId.toString(),
      ownerName: r.ownerName,
      active: r.invalidAt === null,
      createdAt: r.createdAt,
      lastUsedAt: r.lastUsedAt,
    };
  }

  private readonly listSelect = {
    id: true,
    scope: true,
    platform: true,
    ownerTelegramId: true,
    ownerName: true,
    invalidAt: true,
    createdAt: true,
    lastUsedAt: true,
  } as const;

  async listScope(scope: string): Promise<CookieView[]> {
    assertScope(scope);
    const rows = await this.prisma.userCookie.findMany({
      where: { scope },
      select: this.listSelect,
      orderBy: [{ platform: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map((r) => this.view(r));
  }

  async listOwned(telegramId: number): Promise<CookieView[]> {
    const rows = await this.prisma.userCookie.findMany({
      where: { ownerTelegramId: BigInt(telegramId) },
      select: this.listSelect,
      orderBy: [{ scope: 'asc' }, { platform: 'asc' }],
    });
    return rows.map((r) => this.view(r));
  }

  // Удалить может владелец; админ группы — любые куки своей группы (права
  // проверил бот и передал adminOfScope).
  async remove(id: string, byTelegramId: number, adminOfScope?: string) {
    const row = await this.prisma.userCookie.findUnique({ where: { id }, select: { scope: true, ownerTelegramId: true } });
    if (!row) throw new NotFoundException('Not found');
    const isOwner = row.ownerTelegramId === BigInt(byTelegramId);
    const isAdmin = adminOfScope !== undefined && adminOfScope === row.scope;
    if (!isOwner && !isAdmin) throw new NotFoundException('Not found');
    await this.prisma.userCookie.delete({ where: { id } });
    return { ok: true };
  }

  // Удалить все свои куки разом — «забудьте меня».
  async removeAllOwned(telegramId: number) {
    const { count } = await this.prisma.userCookie.deleteMany({ where: { ownerTelegramId: BigInt(telegramId) } });
    return { removed: count };
  }

  // Группа стала супергруппой — у неё новый id, подключения едут следом
  // (бот ловит migrate_to_chat_id). По одной записи: если в новой области у
  // того же человека уже есть та же площадка, старая просто удаляется.
  async migrateScope(from: string, to: string) {
    assertScope(from);
    assertScope(to);
    if (!from.startsWith('chat:') || !to.startsWith('chat:')) throw new BadRequestException('Only group scopes move');
    const rows = await this.prisma.userCookie.findMany({ where: { scope: from }, select: { id: true } });
    let moved = 0;
    for (const { id } of rows) {
      try {
        await this.prisma.userCookie.update({ where: { id }, data: { scope: to } });
        moved++;
      } catch {
        await this.prisma.userCookie.delete({ where: { id } }).catch(() => undefined);
      }
    }
    return { moved };
  }

  // Первая из областей (по порядку важности), где для площадки есть рабочий
  // вход, — или undefined. См. lib/cookie-scope.ts.
  async pickScope(scopes: string[], platform: string | null): Promise<string | undefined> {
    for (const scope of scopes) {
      if (await this.hasActive(scope, platform)) return scope;
    }
    return undefined;
  }

  async hasActive(scope: string | undefined, platform: string | null): Promise<boolean> {
    const p = cookiePlatformFor(platform);
    if (!scope || !p || !this.enabled() || !SCOPE_RE.test(scope)) return false;
    const n = await this.prisma.userCookie.count({ where: { scope, platform: p, invalidAt: null } });
    return n > 0;
  }

  /**
   * Выполнить fn с куками из пула области: по очереди, начиная с давно не
   * использованных (так нагрузка ложится на все аккаунты ровно и ни один не
   * выглядит для площадки ботом). Удача — запись помечается использованной.
   * Отказ «вход точно не действует» засчитывается сразу; неоднозначный —
   * только если следующий аккаунт тот же ролик получил (см.
   * sessionFailureKind). Третий засчитанный отказ подряд выключает запись и
   * пишет владельцу. Остальные ошибки куки не касаются — пробрасываем.
   * Текст ошибки чистим от строк, где могли оказаться сами куки.
   */
  async withScopeCookies<T>(
    scope: string,
    platform: string | null,
    fn: (netscape: string) => Promise<T>,
  ): Promise<{ result: T; cookieId: string }> {
    const p = cookiePlatformFor(platform);
    if (!p || !SCOPE_RE.test(scope) || !this.enabled()) throw new Error('No user cookies for this request');
    const rows = await this.prisma.userCookie.findMany({
      where: { scope, platform: p, invalidAt: null },
      orderBy: [{ lastUsedAt: { sort: 'asc', nulls: 'first' } }],
      take: MAX_ATTEMPTS,
    });
    if (!rows.length) throw new Error('No user cookies for this request');

    let lastError: unknown;
    const ambiguous: { id: string; message: string }[] = [];
    for (const row of rows) {
      let netscape: string;
      try {
        netscape = decryptCookies(row.data);
      } catch {
        // Не расшифровалось — почти наверняка не тот USER_COOKIES_KEY на
        // сервере, а не мёртвый вход. Выключать записи нельзя: при неверном
        // ключе это выключило бы всех и разослало сообщения всем владельцам.
        console.error(`[user-cookies] ${row.id}: не расшифровывается — проверьте USER_COOKIES_KEY`);
        continue;
      }
      try {
        const result = await fn(netscape);
        await this.prisma.userCookie.update({ where: { id: row.id }, data: { lastUsedAt: new Date(), failures: 0 } });
        // Этот аккаунт ролик получил — значит, у предыдущих дело было в них.
        for (const a of ambiguous) await this.recordFailure(a.id, a.message);
        return { result, cookieId: row.id };
      } catch (e) {
        const message = scrubCookieLines(e instanceof Error ? e.message : String(e));
        lastError = new Error(message);
        const kind = sessionFailureKind(message);
        if (kind === 'dead') await this.recordFailure(row.id, message);
        else if (kind === 'ambiguous') ambiguous.push({ id: row.id, message });
        else throw lastError;
      }
    }
    throw lastError ?? new Error('No usable user cookies');
  }

  private async recordFailure(id: string, message: string) {
    const row = await this.prisma.userCookie.update({
      where: { id },
      data: { failures: { increment: 1 }, lastUsedAt: new Date() },
    });
    console.warn(`[user-cookies] ${id} (${row.platform}, ${row.scope}): отказ ${row.failures}/${FAILURES_TO_DISABLE}: ${message.slice(0, 200)}`);
    if (row.failures >= FAILURES_TO_DISABLE) await this.disable(id, message);
  }

  private async disable(id: string, reason: string) {
    const row = await this.prisma.userCookie.update({ where: { id }, data: { invalidAt: new Date() } });
    void this.notifyOwner(row.ownerTelegramId, row.ownerLang, row.platform, row.scope).catch((e) =>
      console.error(`[user-cookies] ${id}: владельцу не написали:`, e?.message ?? e),
    );
    console.warn(`[user-cookies] ${id} выключена: ${reason.slice(0, 200)}`);
  }

  // Пишем владельцу сами: бот о выключении не знает, а человеку важно
  // узнать, что вход перестал работать (и, возможно, что аккаунт ограничили).
  private async notifyOwner(ownerId: bigint, lang: string | null, platform: string, scope: string) {
    const token = process.env.BOT_TOKEN;
    if (!token) return;
    const code = (lang ?? '').toLowerCase();
    const l = code.startsWith('uk') ? 'uk' : code.startsWith('ru') ? 'ru' : 'en';
    const name = { instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', twitter: 'X', vk: 'VK', tiktok: 'TikTok' }[platform] ?? platform;
    const forGroup = scope.startsWith('chat:');
    const where = {
      ru: forGroup ? 'для группы' : 'для вас',
      uk: forGroup ? 'для групи' : 'для вас',
      en: forGroup ? 'for a group' : 'for you',
    }[l];
    const text = {
      ru: `⚠️ Подключённый вход ${name} (${where}) перестал работать: площадка его больше не принимает. Возможно, вы вышли из аккаунта или его ограничили.\n\nЧтобы снова скачивать с ним, подключите аккаунт заново. Список подключений — /accounts.`,
      uk: `⚠️ Підключений вхід ${name} (${where}) перестав працювати: платформа його більше не приймає. Можливо, ви вийшли з акаунта або його обмежили.\n\nЩоб знову завантажувати з ним, підключіть акаунт заново. Список підключень — /accounts.`,
      en: `⚠️ Your connected ${name} login (${where}) stopped working: the platform no longer accepts it. You may have signed out, or the account was restricted.\n\nTo keep downloading with it, connect the account again. Your connections: /accounts.`,
    }[l];
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ownerId.toString(), text }),
    });
  }
}
