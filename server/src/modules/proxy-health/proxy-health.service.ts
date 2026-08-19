import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { request as httpRequest } from 'node:http';
import { AlertService } from '../alert/alert.service';

// Раз в час проверяет, что ISP-прокси жив, и пишет админу в Telegram, если нет.
//
// Зачем: YouTube ходит через прокси ВСЕГДА (alwaysProxyPlatforms в
// ytdlp-process.service.ts) — с адреса дата-центра он почти всегда требует
// антибот-проверку, и попытка напрямую только тратила бы время. Обратная
// сторона: стоит аренде прокси закончиться, и YouTube отваливается ЦЕЛИКОМ,
// молча. Ровно это и случилось 19.08.2026 — узнали не от мониторинга, а когда
// дошли руки проверить. Threads по коротким ссылкам ложится там же: резолверу
// нужен резидентный адрес, иначе Facebook отдаёт ему заглушку вместо поста.
@Injectable()
export class ProxyHealthService {
  private readonly logger = new Logger(ProxyHealthService.name);

  private readonly TIMEOUT_MS = 10_000;
  // Одна осечка — не повод будить админа: сеть могла моргнуть ровно в момент
  // проверки. Повторяем один раз и только потом считаем прокси мёртвым.
  private readonly RETRY_DELAY_MS = 5_000;
  // Обычный http, а не https, сознательно: так запрос идёт К прокси
  // абсолютным URI, и одного ответа хватает, чтобы проверить и связность, и
  // логин с паролем (истёкшая аренда даёт 407). Через CONNECT-туннель для
  // https пришлось бы городить разбор ответа туннеля ради того же самого.
  // Ответ — сам выходной адрес, его удобно видеть в логе.
  // ДВА адреса, а не один. Проверка ходит через прокси на чужой сервис, и его
  // собственные неприятности — 429 при лимите запросов, редирект, страница
  // блокировки — выглядели бы точно так же, как отказ прокси. Алерт при этом
  // советует вполне конкретное и в таком случае неверное действие («купить
  // новый прокси»), да ещё каждый час. Поэтому неоднозначный ответ первого
  // адреса перепроверяется вторым, и только если оба молчат, речь идёт о
  // прокси.
  private readonly PROBE_URLS = [
    process.env.PROXY_PROBE_URL || 'http://ifconfig.me/ip',
    'http://icanhazip.com',
  ];

  // Чтобы отправить «снова работает» ровно один раз, а не после каждой удачной
  // проверки. Живёт в памяти: после передеплоя сервера состояние теряется, и
  // сообщения о восстановлении не будет — не беда, оно и так вторично.
  private failing = false;

  constructor(private readonly alert: AlertService) {}

  // Расписание из окружения (по умолчанию раз в час) — чтобы прогнать весь
  // сценарий на staging, поставив «каждую минуту», и не ждать час.
  @Cron(process.env.PROXY_HEALTH_CRON || CronExpression.EVERY_HOUR)
  async checkProxy() {
    // Выключатель. По умолчанию ВЫКЛЮЧЕНО и включается только в
    // docker-compose.prod.yml — иначе staging, у которого свой контур, но тот
    // же BOT_TOKEN, слал бы админу вторую копию каждого алерта (та же причина,
    // что и у NUDGE_ENABLED).
    if (process.env.PROXY_HEALTH_ENABLED !== 'true') {
      return;
    }

    const proxyUrl = process.env.YOUTUBE_PROXY_URL;
    if (!proxyUrl) {
      // Прокси не настроен вовсе — это не поломка, а конфигурация.
      return;
    }

    let verdict = await this.probe(proxyUrl, this.PROBE_URLS[0]);

    // Ответ, по которому нельзя судить о прокси (не 200 и не 407) — идём на
    // запасной адрес. Если там всё хорошо, дело было в первом сервисе, и
    // будить админа не за чем.
    if (verdict && !verdict.proxyFault) {
      const fallback = await this.probe(proxyUrl, this.PROBE_URLS[1]);
      if (!fallback) {
        this.logger.warn(
          `${this.PROBE_URLS[0]} ответил странно (${verdict.reason}), но через запасной адрес прокси жив — тревогу не поднимаю`,
        );
        verdict = null;
      } else {
        verdict = {
          proxyFault: fallback.proxyFault,
          reason: `${this.PROBE_URLS[0]}: ${verdict.reason}; ${this.PROBE_URLS[1]}: ${fallback.reason}`,
        };
      }
    }

    // Одна осечка — не повод будить админа: сеть могла моргнуть ровно в момент
    // проверки.
    if (verdict) {
      await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS));
      verdict = await this.probe(proxyUrl, this.PROBE_URLS[0]);
      if (verdict && !verdict.proxyFault) {
        const fallback = await this.probe(proxyUrl, this.PROBE_URLS[1]);
        verdict = fallback ? verdict : null;
      }
    }

    const reason = verdict?.reason ?? null;
    const masked = this.maskCredentials(proxyUrl);

    if (reason) {
      this.failing = true;
      this.logger.error(`Прокси ${masked} не отвечает: ${reason}`);
      await this.alert.notifyProxyDown(
        masked,
        this.PROBE_URLS.join(' и '),
        reason,
      );
      return;
    }

    if (this.failing) {
      this.failing = false;
      this.logger.log(`Прокси ${masked} снова отвечает`);
      await this.alert.notifyProxyRecovered(masked);
    }
  }

  // null — прокси в порядке. Иначе причина отказа и признак того, виноват ли
  // именно прокси: 407 и обрыв связи — да, а неожиданный статус от сервиса-
  // мишени сам по себе ещё ни о чём не говорит.
  private probe(
    proxyUrl: string,
    probeUrl: string,
  ): Promise<{ reason: string; proxyFault: boolean } | null> {
    return new Promise((resolve) => {
      let proxy: URL;
      let target: URL;
      try {
        proxy = new URL(proxyUrl);
        target = new URL(probeUrl);
      } catch {
        resolve({
          reason: 'YOUTUBE_PROXY_URL не разбирается как адрес',
          proxyFault: true,
        });
        return;
      }

      const headers: Record<string, string> = { Host: target.host };
      if (proxy.username) {
        // Логин и пароль в URL хранятся процентно-экранированными, а в
        // заголовок должны уйти в исходном виде.
        const credentials = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
        headers['Proxy-Authorization'] =
          'Basic ' + Buffer.from(credentials).toString('base64');
      }

      const req = httpRequest(
        {
          host: proxy.hostname,
          port: proxy.port || 80,
          method: 'GET',
          // Абсолютный URI, а не путь: так формулируется запрос, адресованный
          // прокси, а не самому серверу.
          path: target.toString(),
          headers,
          timeout: this.TIMEOUT_MS,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            // Ответ должен быть коротким (адрес), но полагаться на это нельзя:
            // прокси на отказе умеет вернуть и целую HTML-страницу.
            if (body.length < 200) {
              body += chunk.toString();
            }
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              this.logger.log(`Прокси жив, выходной адрес: ${body.trim()}`);
              resolve(null);
            } else if (res.statusCode === 407) {
              resolve({
                reason:
                  'прокси не принял логин и пароль (HTTP 407) — обычно это значит, что аренда закончилась',
                proxyFault: true,
              });
            } else {
              resolve({
                reason: `ответ HTTP ${res.statusCode}`,
                proxyFault: false,
              });
            }
          });
        },
      );

      // destroy(err) поднимает 'error' с этим же текстом — отдельного
      // resolve() здесь не нужно, иначе он разошёлся бы с обработчиком ниже.
      req.on('timeout', () => {
        req.destroy(new Error(`нет ответа за ${this.TIMEOUT_MS / 1000} с`));
      });
      // Обрыв связи и таймаут — это уже про прокси: до сервиса-мишени мы даже
      // не добрались.
      req.on('error', (error: Error) =>
        resolve({ reason: error.message, proxyFault: true }),
      );
      req.end();
    });
  }

  // В логи и в Telegram уходит адрес без пароля: сообщение о поломке — не то
  // место, где стоит светить учётными данными.
  private maskCredentials(proxyUrl: string): string {
    // Жадный [^/]*, а не [^/@]*: пароль может содержать «@» (new URL() такое
    // принимает и делит по ПОСЛЕДНЕМУ), и нежадный вариант обрывался на первом
    // символе — из «http://user:p@ss@host» получалось «//***@ss@host», то есть
    // хвост пароля утекал и в лог, и в Telegram. Ровно то, что эта функция
    // должна была предотвращать.
    return proxyUrl.replace(/\/\/[^/]*@/, '//***@');
  }
}
