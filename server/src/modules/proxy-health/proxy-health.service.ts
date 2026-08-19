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
  private readonly PROBE_URL =
    process.env.PROXY_PROBE_URL || 'http://ifconfig.me/ip';

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

    let reason = await this.probe(proxyUrl);
    if (reason) {
      await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS));
      reason = await this.probe(proxyUrl);
    }

    const masked = this.maskCredentials(proxyUrl);

    if (reason) {
      this.failing = true;
      this.logger.error(`Прокси ${masked} не отвечает: ${reason}`);
      await this.alert.notifyProxyDown(masked, this.PROBE_URL, reason);
      return;
    }

    if (this.failing) {
      this.failing = false;
      this.logger.log(`Прокси ${masked} снова отвечает`);
      await this.alert.notifyProxyRecovered(masked);
    }
  }

  // null — прокси в порядке; строка — человекочитаемая причина отказа.
  private probe(proxyUrl: string): Promise<string | null> {
    return new Promise((resolve) => {
      let proxy: URL;
      let target: URL;
      try {
        proxy = new URL(proxyUrl);
        target = new URL(this.PROBE_URL);
      } catch {
        resolve('YOUTUBE_PROXY_URL не разбирается как адрес');
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
              resolve(
                'прокси не принял логин и пароль (HTTP 407) — обычно это значит, что аренда закончилась',
              );
            } else {
              resolve(`прокси ответил HTTP ${res.statusCode}`);
            }
          });
        },
      );

      // destroy(err) поднимает 'error' с этим же текстом — отдельного
      // resolve() здесь не нужно, иначе он разошёлся бы с обработчиком ниже.
      req.on('timeout', () => {
        req.destroy(new Error(`нет ответа за ${this.TIMEOUT_MS / 1000} с`));
      });
      req.on('error', (error: Error) => resolve(error.message));
      req.end();
    });
  }

  // В логи и в Telegram уходит адрес без пароля: сообщение о поломке — не то
  // место, где стоит светить учётными данными.
  private maskCredentials(proxyUrl: string): string {
    return proxyUrl.replace(/\/\/[^/@]*@/, '//***@');
  }
}
