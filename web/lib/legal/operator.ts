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
  nameHi: "व्यक्तिगत उद्यमी SARSEMBAYEV (सरसेम्बायेव)",
  nameId: "Pengusaha Perorangan SARSEMBAYEV",
  nameSw: "Mjasiriamali Binafsi SARSEMBAYEV",
  nameDe: "Einzelunternehmer SARSEMBAYEV",
  nameFr: "Entrepreneur individuel SARSEMBAYEV",
  nameIt: "Imprenditore individuale SARSEMBAYEV",
  namePt: "Empresário Individual SARSEMBAYEV",
  nameUz: "Yakka tartibdagi tadbirkor SARSEMBAYEV",
  nameTr: "Bireysel Girişimci SARSEMBAYEV",
  nameFa: "کارآفرین انفرادی SARSEMBAYEV (سارسمبایف)",
  nameVi: "Doanh nhân cá thể SARSEMBAYEV",
  nameBn: "একক উদ্যোক্তা SARSEMBAYEV (সারসেমবায়েভ)",
  nameUr: "انفرادی کاروباری SARSEMBAYEV (سارسیمبایف)",
  namePl: "Przedsiębiorca indywidualny SARSEMBAYEV",
  nameJa: "個人事業主 SARSEMBAYEV（サルセンバエフ）",
  nameKo: "개인사업자 SARSEMBAYEV(사르셈바예프)",
  nameTh: "ผู้ประกอบการรายบุคคล SARSEMBAYEV (ซาร์เซมบาเยฟ)",
  nameTl: "Indibidwal na Negosyante SARSEMBAYEV",
  nameAm: "ግለሰብ ሥራ ፈጣሪ SARSEMBAYEV",
  nameOm: "Daldalaa Dhuunfaa SARSEMBAYEV",
  nameHa: "Ɗan Kasuwa Mai Zaman Kansa SARSEMBAYEV",
  nameSo: "Ganacsade Shakhsi ah SARSEMBAYEV",
  nameAz: "Fərdi sahibkar SARSEMBAYEV",
  nameKy: "Жеке ишкер SARSEMBAYEV",
  nameTg: "Соҳибкори инфиродӣ SARSEMBAYEV",
  nameMs: "Usahawan Perseorangan SARSEMBAYEV",
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
  basisHi:
    "व्यक्तिगत उद्यमी के रूप में गतिविधि शुरू करने की सूचना संख्या KZ45UUZ00498687, दिनांक 22.07.2026",
  basisId:
    "Pemberitahuan dimulainya kegiatan usaha perorangan No. KZ45UUZ00498687 tanggal 22.07.2026",
  basisSw:
    "Taarifa ya kuanza shughuli za mjasiriamali binafsi Na. KZ45UUZ00498687 ya tarehe 22.07.2026",
  basisDe:
    "Mitteilung über die Aufnahme der Tätigkeit als Einzelunternehmer Nr. KZ45UUZ00498687 vom 22.07.2026",
  basisFr:
    "Notification de début d’activité d’entrepreneur individuel n° KZ45UUZ00498687 du 22.07.2026",
  basisIt:
    "Comunicazione di avvio dell’attività di imprenditore individuale n. KZ45UUZ00498687 del 22.07.2026",
  basisPt:
    "Notificação de início de atividade de empresário individual n.º KZ45UUZ00498687, de 22.07.2026",
  basisUz:
    "Yakka tartibdagi tadbirkor sifatida faoliyat boshlanganligi toʻgʻrisidagi 22.07.2026 yildagi KZ45UUZ00498687-son xabarnoma",
  basisTr:
    "22.07.2026 tarihli ve KZ45UUZ00498687 sayılı bireysel girişimci faaliyetine başlama bildirimi",
  basisFa:
    "اطلاعیه آغاز فعالیت کارآفرین انفرادی به شماره KZ45UUZ00498687 مورخ 22.07.2026",
  basisVi:
    "Thông báo bắt đầu hoạt động kinh doanh cá thể số KZ45UUZ00498687 ngày 22.07.2026",
  basisBn:
    "একক উদ্যোক্তা হিসেবে কার্যক্রম শুরুর বিজ্ঞপ্তি নং KZ45UUZ00498687, তারিখ 22.07.2026",
  basisUr:
    "انفرادی کاروباری سرگرمی شروع کرنے کا نوٹس نمبر KZ45UUZ00498687، مورخہ 22.07.2026",
  basisPl:
    "Zawiadomienie o rozpoczęciu działalności przedsiębiorcy indywidualnego nr KZ45UUZ00498687 z dnia 22.07.2026",
  basisJa:
    "個人事業主としての事業開始届 第KZ45UUZ00498687号（2026年7月22日付）",
  basisKo:
    "2026년 7월 22일자 개인사업자 사업 개시 신고 제KZ45UUZ00498687호",
  basisTh:
    "หนังสือแจ้งการเริ่มประกอบกิจการของผู้ประกอบการรายบุคคล เลขที่ KZ45UUZ00498687 ลงวันที่ 22.07.2026",
  basisTl:
    "Abiso ng pagsisimula ng negosyo bilang indibidwal na negosyante Blg. KZ45UUZ00498687 na may petsang 22.07.2026",
  basisAm:
    "የሥራ እንቅስቃሴ መጀመሩን የሚገልጽ ማስታወቂያ ቁ. KZ45UUZ00498687 ቀን 22.07.2026",
  basisOm:
    "Beeksisa jalqabbii hojii daldala dhuunfaa Lak. KZ45UUZ00498687 kan guyyaa 22.07.2026",
  basisHa:
    "Sanarwar fara harkokin kasuwanci na ɗan kasuwa mai zaman kansa Lamba KZ45UUZ00498687 ta ranar 22.07.2026",
  basisSo:
    "Ogeysiiska bilaabidda hawsha ganacsade shakhsi ah Lambar KZ45UUZ00498687 oo taariikhdu tahay 22.07.2026",
  basisAz:
    "Fərdi sahibkar kimi fəaliyyətə başlanması barədə bildiriş № KZ45UUZ00498687, 22.07.2026-cı il tarixli",
  basisKy:
    "Жеке ишкер катары ишкердик иштин башталышы жөнүндө билдирме № KZ45UUZ00498687, 22.07.2026-ж.",
  basisTg:
    "Огоҳинома дар бораи оғози фаъолият ҳамчун соҳибкори инфиродӣ № KZ45UUZ00498687 аз 22.07.2026",
  basisMs:
    "Notis permulaan aktiviti sebagai usahawan perseorangan No. KZ45UUZ00498687 bertarikh 22.07.2026",
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
  addressHi:
    "कज़ाखस्तान गणराज्य, अल्माटी क्षेत्र, येनबेकशीकज़ाख ज़िला, राखात ग्रामीण ज़िला, आज़ात गाँव, PKST «Almagul-2», भवन 117",
  addressId:
    "Republik Kazakhstan, Wilayah Almaty, Distrik Yenbekshikazakh, Distrik Pedesaan Rakhat, Desa Azat, PKST «Almagul-2», bangunan 117",
  addressSw:
    "Jamhuri ya Kazakhstan, Mkoa wa Almaty, Wilaya ya Yenbekshikazakh, Wilaya ya Vijijini ya Rakhat, Kijiji cha Azat, PKST «Almagul-2», jengo 117",
  addressDe:
    "Republik Kasachstan, Gebiet Almaty, Bezirk Jenbekschikasach, Landbezirk Rachat, Dorf Asat, PKST «Almagul-2», Gebäude 117",
  addressFr:
    "République du Kazakhstan, région d’Almaty, district d’Enbekchikazakh, district rural de Rakhat, village d’Azat, PKST «Almagul-2», bâtiment 117",
  addressIt:
    "Repubblica del Kazakistan, regione di Almaty, distretto di Enbekshikazakh, distretto rurale di Rakhat, villaggio di Azat, PKST «Almagul-2», edificio 117",
  addressPt:
    "República do Cazaquistão, região de Almaty, distrito de Enbekshikazakh, distrito rural de Rakhat, vila de Azat, PKST «Almagul-2», edifício 117",
  addressUz:
    "Qozogʻiston Respublikasi, Olmaota viloyati, Enbekshiqozoq tumani, Raxat qishloq okrugi, Azat qishlogʻi, PKST «Almagul-2», 117-uy",
  addressTr:
    "Kazakistan Cumhuriyeti, Almatı bölgesi, Enbekşikazak ilçesi, Rahat kırsal ilçesi, Azat köyü, PKST «Almagul-2», bina 117",
  addressFa:
    "جمهوری قزاقستان، استان آلماتی، شهرستان انبکشی‌قزاق، بخش روستایی راخات، روستای آزات، PKST «Almagul-2»، ساختمان 117",
  addressVi:
    "Cộng hòa Kazakhstan, tỉnh Almaty, huyện Enbekshikazakh, xã Rakhat, làng Azat, PKST «Almagul-2», tòa nhà 117",
  addressBn:
    "কাজাখস্তান প্রজাতন্ত্র, আলমাতি অঞ্চল, এনবেকশিকাজাখ জেলা, রাখাত গ্রামীণ জেলা, আজাত গ্রাম, PKST «Almagul-2», ভবন 117",
  addressUr:
    "جمہوریہ قازقستان، علاقہ الماتی، ضلع ینبیکشیقازاق، دیہی ضلع راخات، گاؤں آزات، PKST «Almagul-2»، عمارت 117",
  addressPl:
    "Republika Kazachstanu, obwód ałmacki, rejon jenbekszykazachski, okręg wiejski Rachat, wieś Azat, PKST «Almagul-2», budynek 117",
  addressJa:
    "カザフスタン共和国 アルマティ州 エンベクシカザフ地区 ラハト村管区 アザト村 PKST «Almagul-2» 117号棟",
  addressKo:
    "카자흐스탄 공화국 알마티주 엔베크시카자흐 지구 라하트 농촌 지구 아자트 마을 PKST «Almagul-2» 117동",
  addressTh:
    "สาธารณรัฐคาซัคสถาน ภูมิภาคอัลมาตี เขตเยนเบคชีคาซัค ตำบลชนบทราฮัต หมู่บ้านอาซัต PKST «Almagul-2» อาคาร 117",
  addressTl:
    "Republika ng Kazakhstan, Rehiyon ng Almaty, Distrito ng Enbekshikazakh, Rural na Distrito ng Rakhat, Nayon ng Azat, PKST «Almagul-2», gusali 117",
  addressAm:
    "የካዛኪስታን ሪፐብሊክ፣ አልማቲ ክልል፣ የንቤክሺካዛክ ወረዳ፣ ራኻት የገጠር ወረዳ፣ አዛት መንደር፣ PKST «Almagul-2»፣ ሕንፃ 117",
  addressOm:
    "Rippaabliika Kaazaakistaan, Naannoo Almaatii, Aanaa Yenbekshikazakh, Aanaa Baadiyyaa Rakhat, Ganda Azat, PKST «Almagul-2», gamoo 117",
  addressHa:
    "Jamhuriyar Kazakhstan, Yankin Almaty, Gundumar Yenbekshikazakh, Gundumar Karkara ta Rakhat, Ƙauyen Azat, PKST «Almagul-2», gini 117",
  addressSo:
    "Jamhuuriyadda Kazakhstan, Gobolka Almaty, Degmada Yenbekshikazakh, Degmada Miyiga ee Rakhat, Tuulada Azat, PKST «Almagul-2», dhismaha 117",
  addressAz:
    "Qazaxıstan Respublikası, Almatı vilayəti, Enbekşiqazax rayonu, Raxat kənd dairəsi, Azat kəndi, PKST «Almagul-2», bina 117",
  addressKy:
    "Казакстан Республикасы, Алматы облусу, Эңбекчиказак району, Рахат айылдык округу, Азат айылы, PKST «Almagul-2», 117-имарат",
  addressTg:
    "Ҷумҳурии Қазоқистон, вилояти Алмаато, ноҳияи Енбекшиқазақ, округи деҳоти Раҳат, деҳаи Азат, PKST «Almagul-2», бинои 117",
  addressMs:
    "Republik Kazakhstan, Wilayah Almaty, Daerah Yenbekshikazakh, Daerah Luar Bandar Rakhat, Kampung Azat, PKST «Almagul-2», bangunan 117",
  addressAr:
    "جمهورية كازاخستان، منطقة ألماتي، مقاطعة إنبيكشيكازاخ، الدائرة الريفية راخات، قرية آزات، PKST «Almagul-2»، المبنى 117",
  addressEs:
    "República de Kazajistán, región de Almaty, distrito de Yenbekshikazakh, distrito rural de Rakhat, pueblo de Azat, PKST «Almagul-2», edificio 117",
  email: "info@sarsembai.dev",
  site: "videoner.download",
  bot: "VideonerBot",
} as const;
