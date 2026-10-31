// Реквизиты оператора сайта — ОДНИМ местом на все документы, футер и разметку.
// Ровно тот же приём, что на sarsembai.dev: стоит развести реквизиты по
// нескольким файлам, и при первой же правке (сменился адрес, добавился счёт)
// документы начинают противоречить друг другу, а расхождение в реквизитах —
// первое, за что цепляется проверяющий.
//
// Данные совпадают со страницей реквизитов sarsembai.dev того же ИП: сайты
// разные, лицо одно, и расходиться им незачем.

export const LEGAL_UPDATED = "2026-10-31";

export const operator = {
  nameRu: "ИП САРСЕМБАЕВ",
  nameEn: "Individual Entrepreneur SARSEMBAYEV",
  nameEs: "Empresario Individual SARSEMBAYEV",
  nameUk: "Індивідуальний підприємець САРСЕМБАЄВ",
  nameKk: "ЖК САРСЕМБАЕВ",
  nameZh: "个体经营者 SARSEMBAYEV（萨尔森巴耶夫）",
  nameAr: "رائد الأعمال الفردي سارسيمباييف (SARSEMBAYEV)",
  directorRu: "Сарсембаев Тимур Сейпилович",
  directorEn: "Timur Sarsembayev",
  basisRu:
    "Уведомление о начале деятельности ИП № KZ45UUZ00498687 от 22.07.2026 г.",
  basisEn:
    "Notice of commencement of business activity No. KZ45UUZ00498687 dated 22.07.2026",
  basisEs:
    "Notificación de inicio de actividad empresarial n.º KZ45UUZ00498687 de 22.07.2026",
  basisKk:
    "Жеке кәсіпкер ретінде қызметтің басталғаны туралы 22.07.2026 ж. № KZ45UUZ00498687 хабарлама",
  basisZh:
    "个体经营者开业通知书 第 KZ45UUZ00498687 号，日期 2026年7月22日",
  basisAr:
    "إشعار ببدء نشاط رائد الأعمال الفردي رقم KZ45UUZ00498687 بتاريخ 22.07.2026",
  basisUk:
    "Повідомлення про початок діяльності індивідуального підприємця № KZ45UUZ00498687 від 22.07.2026 р.",
  bin: "880625350383",
  addressRu:
    "Республика Казахстан, Алматинская область, Енбекшиказахский район, Рахатский сельский округ, село Азат, ПКСТ «Алмагуль-2», дом 117",
  addressEn:
    "Republic of Kazakhstan, Almaty region, Yenbekshikazakh district, Rakhat rural district, Azat village, PKST «Almagul-2», building 117",
  addressKk:
    "Қазақстан Республикасы, Алматы облысы, Еңбекшіқазақ ауданы, Рахат ауылдық округі, Азат ауылы, ПКСТ «Алмагуль-2», 117-үй",
  addressUk:
    "Республіка Казахстан, Алматинська область, Єнбекшиказахський район, Рахатський сільський округ, село Азат, ПКСТ «Алмагуль-2», будинок 117",
  addressZh:
    "哈萨克斯坦共和国，阿拉木图州，叶恩别克希哈萨克区，拉哈特农村区，阿扎特村，PKST «Almagul-2»，117号楼",
  addressAr:
    "جمهورية كازاخستان، منطقة ألماتي، مقاطعة إنبيكشيكازاخ، الدائرة الريفية راخات، قرية آزات، PKST «Almagul-2»، المبنى 117",
  addressEs:
    "República de Kazajistán, región de Almaty, distrito de Yenbekshikazakh, distrito rural de Rakhat, pueblo de Azat, PKST «Almagul-2», edificio 117",
  email: "info@sarsembai.dev",
  site: "videoner.download",
  bot: "VideonerBot",
} as const;
