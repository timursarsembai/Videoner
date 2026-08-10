// Реквизиты оператора сайта — ОДНИМ местом на все документы, футер и разметку.
// Ровно тот же приём, что на sarsembai.dev: стоит развести реквизиты по
// нескольким файлам, и при первой же правке (сменился адрес, добавился счёт)
// документы начинают противоречить друг другу, а расхождение в реквизитах —
// первое, за что цепляется проверяющий.
//
// Данные совпадают со страницей реквизитов sarsembai.dev того же ИП: сайты
// разные, лицо одно, и расходиться им незачем.

export const LEGAL_UPDATED = "2026-08-10";

export const operator = {
  nameRu: "ИП САРСЕМБАЕВ",
  nameEn: "Individual Entrepreneur SARSEMBAYEV",
  nameEs: "Empresario Individual SARSEMBAYEV",
  directorRu: "Сарсембаев Тимур Сейпилович",
  directorEn: "Timur Sarsembayev",
  basisRu:
    "Уведомление о начале деятельности ИП № KZ45UUZ00498687 от 22.07.2026 г.",
  basisEn:
    "Notice of commencement of business activity No. KZ45UUZ00498687 dated 22.07.2026",
  basisEs:
    "Notificación de inicio de actividad empresarial n.º KZ45UUZ00498687 de 22.07.2026",
  bin: "880625350383",
  addressRu:
    "Республика Казахстан, Алматинская область, Енбекшиказахский район, Рахатский сельский округ, село Азат, ПКСТ «Алмагуль-2», дом 117",
  addressEn:
    "Republic of Kazakhstan, Almaty region, Yenbekshikazakh district, Rakhat rural district, Azat village, PKST «Almagul-2», building 117",
  addressEs:
    "República de Kazajistán, región de Almaty, distrito de Yenbekshikazakh, distrito rural de Rakhat, pueblo de Azat, PKST «Almagul-2», edificio 117",
  email: "info@sarsembai.dev",
  site: "videoner.download",
  bot: "VideonerBot",
} as const;
