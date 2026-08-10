"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const COUNTER_ID = 111459879;

declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Яндекс.Метрика.
 *
 * Идентификатор зашит в компонент — так же, как у соседних GoogleAnalytics и
 * GoogleTagManager; заводить ради него переменную окружения значило бы держать
 * три счётчика по двум разным схемам.
 *
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.ym?.(COUNTER_ID, "hit", window.location.href, {
      referer: document.referrer,
    });
  }, [pathname]);

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

export const YandexMetrikaNoScript = () => (
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
