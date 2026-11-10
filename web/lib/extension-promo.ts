import type { Language } from "@/lib/i18n/languages";

// Окошко «Установите расширение» в правом нижнем углу сайта
// (components/common/ExtensionPromo.tsx). Отдельный файл, а не extension-page.ts:
// окошко рисуется в браузере, и тащить туда тексты всей страницы расширения незачем.
export interface ExtensionPromoText {
  title: string;
  text: string;
  install: string;
  close: string;
}

export const extensionPromo: Record<Language, ExtensionPromoText> = {
  ru: {
    title: "Videoner для браузера",
    text: "Кнопка «Скачать» прямо на странице видео — YouTube, Instagram, TikTok и других площадок.",
    install: "Установить",
    close: "Закрыть",
  },
  en: {
    title: "Videoner for your browser",
    text: "A Download button right on the video page — YouTube, Instagram, TikTok and more.",
    install: "Install",
    close: "Close",
  },
  es: {
    title: "Videoner para tu navegador",
    text: "Un botón Descargar directamente en la página del video: YouTube, Instagram, TikTok y más.",
    install: "Instalar",
    close: "Cerrar",
  },
  uk: {
    title: "Videoner для браузера",
    text: "Кнопка «Завантажити» просто на сторінці відео — YouTube, Instagram, TikTok та інших платформ.",
    install: "Встановити",
    close: "Закрити",
  },
  kk: {
    title: "Браузерге арналған Videoner",
    text: "«Жүктеп алу» батырмасы тікелей бейне бетінде — YouTube, Instagram, TikTok және басқа платформаларда.",
    install: "Орнату",
    close: "Жабу",
  },
  ar: {
    title: "Videoner في متصفحك",
    text: "زر «تحميل» مباشرةً في صفحة الفيديو — على YouTube وInstagram وTikTok وغيرها.",
    install: "تثبيت",
    close: "إغلاق",
  },
  zh: {
    title: "Videoner 浏览器版",
    text: "视频页面上直接出现“下载”按钮——支持 YouTube、Instagram、TikTok 等平台。",
    install: "安装",
    close: "关闭",
  },
  hi: {
    title: "आपके ब्राउज़र के लिए Videoner",
    text: "वीडियो पेज पर ही “डाउनलोड” बटन — YouTube, Instagram, TikTok और दूसरी साइटों पर।",
    install: "इंस्टॉल करें",
    close: "बंद करें",
  },
  id: {
    title: "Videoner untuk browser Anda",
    text: "Tombol Unduh langsung di halaman video — YouTube, Instagram, TikTok, dan lainnya.",
    install: "Pasang",
    close: "Tutup",
  },
  sw: {
    title: "Videoner kwa kivinjari chako",
    text: "Kitufe cha Pakua moja kwa moja kwenye ukurasa wa video — YouTube, Instagram, TikTok na mengineyo.",
    install: "Sakinisha",
    close: "Funga",
  },
  de: {
    title: "Videoner für deinen Browser",
    text: "Ein Download-Button direkt auf der Videoseite – YouTube, Instagram, TikTok und mehr.",
    install: "Installieren",
    close: "Schließen",
  },
  nl: {
    title: "Videoner voor je browser",
    text: "Een knop “Downloaden” direct op de videopagina — YouTube, Instagram, TikTok en meer.",
    install: "Installeren",
    close: "Sluiten",
  },
  fr: {
    title: "Videoner pour votre navigateur",
    text: "Un bouton Télécharger directement sur la page de la vidéo : YouTube, Instagram, TikTok et bien d’autres.",
    install: "Installer",
    close: "Fermer",
  },
  it: {
    title: "Videoner per il tuo browser",
    text: "Il pulsante Scarica direttamente nella pagina del video: YouTube, Instagram, TikTok e altro ancora.",
    install: "Installa",
    close: "Chiudi",
  },
  pt: {
    title: "Videoner para o seu navegador",
    text: "Um botão Baixar direto na página do vídeo — YouTube, Instagram, TikTok e outras plataformas.",
    install: "Instalar",
    close: "Fechar",
  },
  tr: {
    title: "Tarayıcınız için Videoner",
    text: "Video sayfasında doğrudan bir İndir düğmesi — YouTube, Instagram, TikTok ve daha fazlası.",
    install: "Yükle",
    close: "Kapat",
  },
  uz: {
    title: "Brauzeringiz uchun Videoner",
    text: "«Yuklab olish» tugmasi toʻgʻridan-toʻgʻri video sahifasida — YouTube, Instagram, TikTok va boshqa platformalarda.",
    install: "Oʻrnatish",
    close: "Yopish",
  },
  fa: {
    title: "Videoner برای مرورگر شما",
    text: "دکمه «دانلود» درست در صفحه ویدیو — در YouTube، Instagram، TikTok و سایت‌های دیگر.",
    install: "نصب",
    close: "بستن",
  },
  vi: {
    title: "Videoner cho trình duyệt của bạn",
    text: "Nút “Tải xuống” ngay trên trang video — YouTube, Instagram, TikTok và nhiều nền tảng khác.",
    install: "Cài đặt",
    close: "Đóng",
  },
  bn: {
    title: "আপনার ব্রাউজারের জন্য Videoner",
    text: "ভিডিও পেজেই “ডাউনলোড” বাটন — YouTube, Instagram, TikTok এবং আরও অনেক সাইটে।",
    install: "ইনস্টল করুন",
    close: "বন্ধ করুন",
  },
  ur: {
    title: "آپ کے براؤزر کے لیے Videoner",
    text: "ویڈیو صفحے پر ہی “ڈاؤن لوڈ” بٹن — YouTube، Instagram، TikTok اور دیگر پلیٹ فارمز پر۔",
    install: "انسٹال کریں",
    close: "بند کریں",
  },
  pl: {
    title: "Videoner w twojej przeglądarce",
    text: "Przycisk „Pobierz” bezpośrednio na stronie filmu — YouTube, Instagram, TikTok i inne serwisy.",
    install: "Zainstaluj",
    close: "Zamknij",
  },
  ja: {
    title: "ブラウザで使える Videoner",
    text: "動画ページに「ダウンロード」ボタンを直接表示。YouTube、Instagram、TikTok などに対応しています。",
    install: "インストール",
    close: "閉じる",
  },
  ko: {
    title: "브라우저에서 쓰는 Videoner",
    text: "동영상 페이지에 바로 '다운로드' 버튼이 생겨요. YouTube, Instagram, TikTok 등에서 쓸 수 있어요.",
    install: "설치",
    close: "닫기",
  },
  th: {
    title: "Videoner สำหรับเบราว์เซอร์ของคุณ",
    text: "ปุ่ม ดาวน์โหลด บนหน้าวิดีโอโดยตรง — YouTube, Instagram, TikTok และอื่นๆ",
    install: "ติดตั้ง",
    close: "ปิด",
  },
  am: {
    title: "Videoner ለብሮውዘርዎ",
    text: "«አውርድ» ቁልፍ በቪዲዮው ገጽ ላይ — በYouTube፣ Instagram፣ TikTok እና በሌሎችም።",
    install: "ጫን",
    close: "ዝጋ",
  },
  om: {
    title: "Videoner biraawuzarii keessaniif",
    text: "Qabduu “Buusi” kallattiin fuula viidiyoo irratti — YouTube, Instagram, TikTok fi kanneen biroo.",
    install: "Fe'i",
    close: "Cufi",
  },
  ha: {
    title: "Videoner don burauzarku",
    text: "Maɓallin Sauke kai tsaye a shafin bidiyo — YouTube, Instagram, TikTok da sauransu.",
    install: "Shigar",
    close: "Rufe",
  },
  so: {
    title: "Videoner biraawsarkaaga",
    text: "Badhanka Soo deji oo toos ugu jira bogga muuqaalka — YouTube, Instagram, TikTok iyo kuwo kale.",
    install: "Rakib",
    close: "Xir",
  },
  az: {
    title: "Brauzeriniz üçün Videoner",
    text: "«Yüklə» düyməsi birbaşa video səhifəsində — YouTube, Instagram, TikTok və digər platformalarda.",
    install: "Quraşdır",
    close: "Bağla",
  },
  ky: {
    title: "Videoner Сиздин браузериңизде",
    text: "«Жүктөп алуу» баскычы түз эле видео бетинде — YouTube, Instagram, TikTok жана башка аянттарда.",
    install: "Орнотуу",
    close: "Жабуу",
  },
  tg: {
    title: "Videoner барои браузери Шумо",
    text: "Тугмаи «Боргирӣ» бевосита дар саҳифаи видео — YouTube, Instagram, TikTok ва дигар платформаҳо.",
    install: "Насб кардан",
    close: "Пӯшидан",
  },
  tl: {
    title: "Videoner para sa iyong browser",
    text: "May button na I-download mismo sa page ng video — YouTube, Instagram, TikTok at iba pa.",
    install: "I-install",
    close: "Isara",
  },
  ms: {
    title: "Videoner untuk pelayar anda",
    text: "Butang Muat turun terus pada halaman video — YouTube, Instagram, TikTok dan banyak lagi.",
    install: "Pasang",
    close: "Tutup",
  },
  ro: {
    title: "Videoner pentru browserul tău",
    text: "Un buton Descarcă direct pe pagina videoclipului — YouTube, Instagram, TikTok și altele.",
    install: "Instalează",
    close: "Închide",
  },
  ps: {
    title: "Videoner ستاسو د براوزر لپاره",
    text: "د «ښکته کول» تڼۍ مستقیم د ویډیو په پاڼه کې — YouTube، Instagram، TikTok او نورو ځایونو کې.",
    install: "نصب کړئ",
    close: "بند کړئ",
  },
  ckb: {
    title: "Videoner بۆ وێبگەڕەکەت",
    text: "دوگمەی «داگرتن» ڕاستەوخۆ لە پەڕەی ڤیدیۆکەدا — YouTube، Instagram، TikTok و شوێنەکانی تر.",
    install: "دامەزراندن",
    close: "داخستن",
  },
  ku: {
    title: "Videoner ji bo geroka te",
    text: "Bişkoka Daxîne rasterast li ser rûpela vîdyoyê — YouTube, Instagram, TikTok û yên din.",
    install: "Saz bike",
    close: "Bigire",
  },
  ug: {
    title: "توركۆرگۈڭىز ئۈچۈن Videoner",
    text: "«چۈشۈرۈش» كۇنۇپكىسى بىۋاسىتە ۋىدىيو بېتىدە — YouTube، Instagram، TikTok ۋە باشقا سۇپىلاردا.",
    install: "ئورنىتىش",
    close: "تاقاش",
  },
  tk: {
    title: "Brauzeriňiz üçin Videoner",
    text: "“Ýükle” düwmesi göni wideo sahypasynda — YouTube, Instagram, TikTok we beýleki platformalarda.",
    install: "Gurna",
    close: "Ýap",
  },
  tt: {
    title: "Браузер өчен Videoner",
    text: "«Йөкләү» төймәсе туп-туры видео битендә — YouTube, Instagram, TikTok һәм башка мәйданчыкларда.",
    install: "Урнаштыру",
    close: "Ябу",
  },
  sq: {
    title: "Videoner për shfletuesin tuaj",
    text: "Butoni “Shkarko” drejtpërdrejt në faqen e videos — YouTube, Instagram, TikTok dhe të tjera.",
    install: "Instalo",
    close: "Mbyll",
  },
  bs: {
    title: "Videoner za vaš preglednik",
    text: "Dugme „Preuzmi“ direktno na stranici videozapisa — YouTube, Instagram, TikTok i druge platforme.",
    install: "Instaliraj",
    close: "Zatvori",
  },
  ce: {
    title: "Videoner Шайн браузерехь",
    text: "«Чуяккха» кнопка видеон агӀонан тӀехь — YouTube, Instagram, TikTok кхин а майданашкахь.",
    install: "ДӀахӀоттае",
    close: "ДӀакъовла",
  },
  inh: {
    title: "Videoner Шун браузерана",
    text: "«Чуяккха» кнопка видео оагӀон тӀа — YouTube, Instagram, TikTok кхыдола майданашка а.",
    install: "ХӀоттаде",
    close: "ДӀакъовла",
  },
  av: {
    title: "Videoner Нужер браузералъе",
    text: "«Босизе» кнопка видеоялъул гьумералда — YouTube, Instagram, TikTok ва цогидал майданазда.",
    install: "Лъезе",
    close: "Къазе",
  },
};
