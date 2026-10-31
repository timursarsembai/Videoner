import { test } from "node:test";
import assert from "node:assert/strict";
import { cookieScopeFor, looksLikeCookiesText, parseConnectCode, rejectionReason } from "./accounts.js";

test("код подключения: с дефисом и без, обычные слова — не код", () => {
  assert.equal(parseConnectCode("ABC-234"), "ABC-234");
  assert.equal(parseConnectCode(" KXM7QZ "), "KXM-7QZ");
  assert.equal(parseConnectCode("abc-234"), null);
  assert.equal(parseConnectCode("HELLO1"), null); // L и 1 в алфавите кода нет
  assert.equal(parseConnectCode("ABC-2345"), null);
  assert.equal(parseConnectCode("привет"), null);
  // Без команды — только с дефисом: слово из заглавных — не код.
  assert.equal(parseConnectCode("PRAVDA", { strict: true }), null);
  assert.equal(parseConnectCode("PRA-VDA", { strict: true }), "PRA-VDA");
});

test("область: личка — по человеку, группа — по чату", () => {
  assert.equal(cookieScopeFor({ id: 42, type: "private" }, 42), "user:42");
  assert.equal(cookieScopeFor({ id: -1001, type: "supergroup" }, 42), "chat:-1001");
  assert.equal(cookieScopeFor({ id: -5, type: "group" }, 42), "chat:-5");
});

test("вставленные куки узнаются, обычный текст — нет", () => {
  assert.equal(looksLikeCookiesText("# Netscape HTTP Cookie File\n.instagram.com\tTRUE\t/\tTRUE\t0\tsessionid\tx"), true);
  assert.equal(looksLikeCookiesText(".instagram.com\tTRUE\t/\tTRUE\t0\tsessionid\tx"), true);
  assert.equal(looksLikeCookiesText(".instagram.com TRUE / TRUE 0 sessionid x"), true);
  assert.equal(looksLikeCookiesText('[{"domain":".x.com","name":"auth_token","value":"t"}]'), true);
  assert.equal(looksLikeCookiesText("https://www.instagram.com/stories/a/1"), false);
  assert.equal(looksLikeCookiesText("привет, как дела"), false);
});

test("причины отказа сервера", () => {
  assert.equal(rejectionReason("Cookies rejected: no-session"), "no-session");
  assert.equal(rejectionReason("Cookies rejected: unknown-platform"), "unknown");
  assert.equal(rejectionReason("User cookies are not configured"), "unavailable");
  assert.equal(rejectionReason("Code not found"), "not-found");
  assert.equal(rejectionReason("boom"), null);
});
