"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Яндекс.Метрика.
 *
 * Идентификатор берётся из переменной окружения, в отличие от соседних
 * GoogleAnalytics и GoogleTagManager, где он зашит в код. Причина одна: staging
 * собирается из этого же кода и своим трафиком портил бы статистику боевого
 * сайта — а вебвизор ещё и записывал бы отладочные сессии. В аргументах сборки
 * docker-compose.staging.yml переменной нет, поэтому там счётчик просто не
 * появляется. Проверка на этапе сборки, а не по домену в браузере: тогда и
 * noscript-пиксель не попадает в разметку staging.
 */
const COUNTER_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) || 0;

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Сам код счётчика — стандартный сниппет Яндекса без изменений, включая
 * проверку document.scripts: она защищает от повторной вставки, когда React в
 * строгом режиме монтирует компонент дважды.
 */
export const YandexMetrika = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Сайт — SPA: при переходах между страницами документ не перезагружается,
  // и без явного hit Метрика засчитала бы ровно один просмотр за весь визит,
  // сколько бы страниц человек ни открыл. Первый просмотр отправляет сам init,
  // поэтому стартовый рендер пропускаем, иначе он посчитается дважды.
  useEffect(() => {
    if (!COUNTER_ID) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.ym?.(COUNTER_ID, "hit", window.location.href, {
      referer: document.referrer,
    });
  }, [pathname]);

  if (!COUNTER_ID) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}', 'ym');

        ym(${COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `}
    </Script>
  );
};

export const YandexMetrikaNoScript = () => {
  if (!COUNTER_ID) return null;

  return (
    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
};
