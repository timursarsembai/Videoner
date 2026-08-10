import { operator } from "./operator";
import { LegalByLanguage } from "./types";

// Тексты документов на трёх языках. Держим отдельно от lib/i18n/translations.ts:
// тот файл и так за тысячу строк, а документы правятся своим ритмом — вместе
// они превратились бы в файл, в котором ничего не найти.
//
// Содержание описывает сервис таким, какой он есть: бесплатный, без рекламы и
// подписок, скачивание только после входа через Telegram, не более
// DAILY_LIMIT загрузок в сутки. Меняется поведение сервиса — правится и здесь,
// иначе документы начнут расходиться с действительностью, а это хуже, чем их
// отсутствие.

const DAILY_LIMIT = 20;
const MAIL = operator.email;
const BOT = `@${operator.bot}`;

export const legal: LegalByLanguage = {
  ru: {
    ui: {
      updated: "Редакция от",
      back: "На главную",
      operatorHeading: "Оператор сервиса",
      navHeading: "Другие документы",
      labels: {
        privacy: "Политика конфиденциальности",
        terms: "Пользовательское соглашение",
        cookies: "Политика cookie",
        copyright: "Правообладателям",
      },
    },
    docs: {
      privacy: {
        title: "Политика конфиденциальности",
        summary: `Какие данные собирает ${operator.site}, зачем они нужны, сколько хранятся и как их удалить.`,
        sections: [
          {
            heading: "Общие положения",
            body: [
              `Настоящая Политика описывает, какие персональные данные обрабатывает сервис ${operator.site} и с какой целью. Оператором данных выступает ${operator.nameRu}.`,
              "Пользуясь сервисом, вы соглашаетесь с описанным здесь порядком обработки. Если вы с ним не согласны, пожалуйста, не используйте сервис.",
              "Обработка ведётся в соответствии с Законом Республики Казахстан «О персональных данных и их защите», а в отношении посетителей из Европейской экономической зоны — с учётом требований GDPR.",
            ],
          },
          {
            heading: "Какие данные мы обрабатываем",
            body: [
              "Мы сознательно не собираем ничего сверх необходимого для работы сервиса и не запрашиваем документы, платёжные данные или адрес.",
            ],
            bullets: [
              "Данные учётной записи Telegram, которые передаёт виджет входа: числовой идентификатор, имя, при наличии — фамилия, имя пользователя, ссылка на фотографию профиля и код языка.",
              "Ссылки, которые вы отправляете на скачивание, и сведения о самой попытке: площадка, дата и время, выбранное качество, результат (успех или ошибка).",
              "Технические данные соединения: IP-адрес, тип и версия браузера, язык, страница перехода. Они попадают в журналы сервера и в системы веб-аналитики.",
              "Файлы cookie и идентификаторы аналитики — подробнее в Политике cookie.",
            ],
          },
          {
            heading: "Зачем эти данные нужны",
            bullets: [
              "Предоставить саму услугу: получить видео по вашей ссылке и отдать вам файл.",
              "Отличить вашу учётную запись от чужой и соблюсти суточное ограничение — не более " + DAILY_LIMIT + " скачиваний в сутки.",
              "Защитить сервис от автоматизированных злоупотреблений: проверка Cloudflare Turnstile перед отправкой ссылки.",
              "Понимать, как используется сайт, и устранять ошибки — обезличенная и агрегированная статистика.",
              "Отвечать на ваши обращения и обращения правообладателей.",
            ],
          },
          {
            heading: "Основания обработки",
            body: [
              "Данные учётной записи Telegram и сведения о скачиваниях обрабатываются для исполнения Пользовательского соглашения, которое вы принимаете, начиная пользоваться сервисом.",
              "Файлы cookie аналитики и запись действий на сайте обрабатываются на основании вашего согласия, которое вы можете отозвать в любой момент — способы описаны в Политике cookie.",
              "Журналы сервера и защита от ботов обрабатываются в рамках нашего законного интереса поддерживать сервис работоспособным и защищённым.",
            ],
          },
          {
            heading: "Сторонние сервисы",
            body: [
              "Мы не продаём и не передаём ваши данные третьим лицам для их собственных целей. Для работы сервиса задействованы следующие поставщики, каждый из которых обрабатывает данные по своим правилам:",
            ],
            bullets: [
              "Telegram — авторизация через виджет входа и работа бота " + BOT + ".",
              "Cloudflare — защита от ботов (Turnstile), доставка сайта и маршрутизация почты.",
              "Google Analytics и Google Tag Manager — статистика посещений.",
              "Яндекс.Метрика — статистика посещений, карта кликов и Вебвизор. Вебвизор записывает действия на странице: перемещения указателя, прокрутку и клики. Записи используются только для анализа удобства сайта.",
            ],
          },
          {
            heading: "Сколько мы храним данные",
            bullets: [
              "Скачанные файлы удаляются с сервера автоматически примерно через час после создания. Мы не храним архив ваших видео.",
              "Записи о попытках скачивания хранятся, пока это нужно для соблюдения суточного лимита и разбора обращений.",
              "Данные учётной записи хранятся, пока вы пользуетесь сервисом, и удаляются по вашему запросу.",
              "Журналы сервера хранятся ограниченное время и перезаписываются по мере ротации.",
            ],
          },
          {
            heading: "Где обрабатываются данные",
            body: [
              "Серверы сервиса расположены в дата-центре на территории Европейского союза. Часть поставщиков, перечисленных выше, может обрабатывать данные за его пределами в соответствии со своими политиками.",
            ],
          },
          {
            heading: "Ваши права",
            body: [
              `Вы вправе получить сведения об обработке ваших данных, потребовать их исправления или удаления, отозвать согласие и возразить против обработки. Для этого напишите на ${MAIL} с той почты или того аккаунта Telegram, которые связаны с обращением.`,
              "Мы отвечаем в разумный срок, как правило в течение тридцати календарных дней. Удаление учётной записи влечёт удаление связанной с ней истории скачиваний.",
            ],
          },
          {
            heading: "Несовершеннолетние",
            body: [
              "Сервис не предназначен для детей младше 16 лет и не адресован им. Мы сознательно не собираем данные таких пользователей; если это произошло по ошибке, напишите нам, и данные будут удалены.",
            ],
          },
          {
            heading: "Изменения",
            body: [
              "Мы можем обновлять эту Политику. Дата актуальной редакции указана в начале страницы; существенные изменения мы будем отмечать в сервисе.",
            ],
          },
        ],
      },
      terms: {
        title: "Пользовательское соглашение",
        summary: `Правила использования ${operator.site}: что можно, что нельзя и на каких условиях работает сервис.`,
        sections: [
          {
            heading: "Общие положения",
            body: [
              `Соглашение регулирует использование сайта ${operator.site} и Telegram-бота ${BOT}. Владелец и администратор сервиса — ${operator.nameRu}.`,
              "Начиная пользоваться сервисом, вы подтверждаете, что прочитали условия и принимаете их. Если какое-либо условие вам не подходит, пользоваться сервисом не следует.",
            ],
          },
          {
            heading: "Сервис бесплатный",
            body: [
              "Все возможности сервиса предоставляются бесплатно. У нас нет подписок, платных тарифов, платных качеств видео и внутренних покупок.",
              "Мы не показываем рекламу и не размещаем партнёрские ссылки.",
              "Суточное ограничение на количество скачиваний существует ради устойчивости сервиса и не снимается за деньги ни при каких условиях.",
            ],
          },
          {
            heading: "Условия доступа",
            bullets: [
              "Скачивание доступно только после авторизации через Telegram. Это нужно, чтобы соблюдать ограничение и противодействовать злоупотреблениям.",
              `Одна учётная запись может скачать не более ${DAILY_LIMIT} файлов в сутки. Счётчик общий для сайта и бота.`,
              "Просматривать сайт и список доступных качеств можно без авторизации.",
            ],
          },
          {
            heading: "Что делает сервис",
            body: [
              "Сервис является техническим посредником: по вашей ссылке он обращается к общедоступной странице, получает медиафайл и передаёт его вам.",
              "Мы не размещаем у себя каталог видео, не ведём поиск по чужому контенту и не храним скачанные файлы дольше времени, необходимого для передачи, — примерно час.",
              "Доступность конкретной площадки зависит от её технических решений и может измениться без предупреждения.",
            ],
          },
          {
            heading: "Обязанности пользователя",
            body: [
              "Вы самостоятельно отвечаете за то, как используете полученные файлы, и подтверждаете, что имеете на это право.",
            ],
            bullets: [
              "Скачивайте только тот материал, права на который принадлежат вам, либо использование которого разрешено правообладателем или законом.",
              "Не используйте сервис для нарушения авторских и смежных прав, распространения запрещённого контента и нарушения прав третьих лиц.",
              "Не пытайтесь обойти технические ограничения сервиса, включая суточный лимит, проверку на ботов и авторизацию.",
              "Не создавайте автоматизированную нагрузку: массовые запросы, скрипты и парсеры не допускаются.",
            ],
          },
          {
            heading: "Ограничение ответственности",
            body: [
              "Сервис предоставляется на условиях «как есть». Мы не гарантируем бесперебойной работы, доступности конкретной площадки или пригодности файла для ваших целей.",
              "Мы не несём ответственности за то, как вы распорядились скачанным материалом, и за последствия нарушения вами прав третьих лиц.",
              "Мы вправе изменять состав возможностей, приостанавливать работу сервиса для обслуживания и прекращать его работу.",
            ],
          },
          {
            heading: "Ограничение доступа",
            body: [
              "Мы можем ограничить или прекратить доступ к сервису при нарушении настоящих условий, при попытках обойти ограничения, а также при поступлении обоснованной жалобы правообладателя.",
            ],
          },
          {
            heading: "Изменения и применимое право",
            body: [
              "Мы можем изменять условия; дата действующей редакции указана в начале страницы. Продолжая пользоваться сервисом после изменений, вы принимаете новую редакцию.",
              "К отношениям сторон применяется право Республики Казахстан. Споры стороны стремятся урегулировать перепиской, а при недостижении согласия — в порядке, установленном законодательством Республики Казахстан.",
            ],
          },
        ],
      },
      cookies: {
        title: "Политика cookie",
        summary: `Какие файлы cookie использует ${operator.site}, зачем они нужны и как от них отказаться.`,
        sections: [
          {
            heading: "Что такое cookie",
            body: [
              "Cookie — небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Они позволяют запомнить, что вы вошли в сервис, и собрать обезличенную статистику посещений.",
              "Вместе с cookie в этом документе мы описываем и близкие технологии — локальное хранилище браузера и счётчики-пиксели.",
            ],
          },
          {
            heading: "Необходимые",
            body: [
              "Без них сервис не работает, поэтому они устанавливаются всегда.",
            ],
            bullets: [
              "Сессия входа — подтверждает, что вы авторизованы через Telegram, и позволяет вести суточный счётчик скачиваний.",
              "Cloudflare Turnstile — проверка, что ссылку отправляет человек, а не скрипт.",
              "Настройки интерфейса — выбранный язык и тема оформления.",
            ],
          },
          {
            heading: "Аналитические",
            body: [
              "Они помогают понять, какими страницами пользуются и где возникают ошибки. Устанавливаются с вашего согласия и не обязательны для работы сервиса.",
            ],
            bullets: [
              "Google Analytics и Google Tag Manager — посещаемость и поведение на сайте в обезличенном виде.",
              "Яндекс.Метрика — посещаемость, карта кликов и Вебвизор.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Вебвизор Яндекс.Метрики записывает действия на странице: перемещения указателя, прокрутку, клики и ввод в поле ссылки. Это нужно, чтобы видеть, где интерфейс сбивает с толку.",
              "Мы не используем эти записи для отслеживания конкретных людей. Не вводите в поля сайта сведения, которые не хотели бы сохранять.",
            ],
          },
          {
            heading: "Как отказаться",
            bullets: [
              "Настройте блокировку или удаление cookie в вашем браузере — этот способ работает для всех перечисленных систем.",
              "Google Analytics: официальное дополнение для браузера, отключающее сбор, доступно на сайте Google.",
              "Яндекс.Метрика: отказ доступен через официальное дополнение Яндекса.",
              "Отключение необходимых cookie сделает вход и скачивание невозможными.",
            ],
          },
          {
            heading: "Сроки",
            body: [
              "Сессионные cookie удаляются при закрытии браузера или по истечении срока сессии. Аналитические счётчики хранят идентификаторы в течение сроков, установленных их поставщиками.",
            ],
          },
        ],
      },
      copyright: {
        title: "Правообладателям",
        summary: "Позиция сервиса по авторским правам и порядок подачи жалобы на нарушение.",
        sections: [
          {
            heading: "Позиция сервиса",
            body: [
              "Сервис не размещает у себя видео и не ведёт их каталог. Он выступает техническим посредником: по ссылке, которую ввёл пользователь, обращается к общедоступной странице и передаёт пользователю файл.",
              "Скачанные файлы хранятся на сервере около часа и удаляются автоматически. Постоянной копии чужого контента у нас не остаётся.",
              "Ответственность за использование скачанного материала несёт пользователь — это прямо закреплено в Пользовательском соглашении.",
            ],
          },
          {
            heading: "Если ваши права нарушены",
            body: [
              `Если вы правообладатель или его представитель и считаете, что сервис используется для нарушения ваших прав, напишите на ${MAIL}. Мы рассматриваем такие обращения и принимаем меры.`,
            ],
          },
          {
            heading: "Что указать в обращении",
            bullets: [
              "Какое произведение затронуто и на каком основании вы обладаете правами на него.",
              "Ссылку на материал и, если известно, обстоятельства нарушения.",
              "Ваши контактные данные: имя или наименование, адрес и адрес электронной почты.",
              "Если вы действуете от имени правообладателя — подтверждение полномочий.",
              "Заявление о том, что сведения в обращении достоверны, а использование материала не разрешено правообладателем или законом.",
            ],
          },
          {
            heading: "Что мы сделаем",
            body: [
              "Мы рассматриваем обращение в разумный срок, как правило в течение тридцати календарных дней, и при подтверждении нарушения ограничиваем доступ к материалу через сервис и при необходимости — доступ нарушителя к сервису.",
              "О результатах рассмотрения мы сообщим на указанный вами адрес электронной почты.",
            ],
          },
          {
            heading: "Недобросовестные обращения",
            body: [
              "Обращение, содержащее заведомо недостоверные сведения, может повлечь ответственность заявителя в соответствии с законодательством. Мы вправе отказать в рассмотрении обращения, если оно не позволяет установить ни правообладателя, ни спорный материал.",
            ],
          },
        ],
      },
    },
  },

  en: {
    ui: {
      updated: "Last updated",
      back: "Back to home",
      operatorHeading: "Service operator",
      navHeading: "Other documents",
      labels: {
        privacy: "Privacy Policy",
        terms: "Terms of Use",
        cookies: "Cookie Policy",
        copyright: "Copyright",
      },
    },
    docs: {
      privacy: {
        title: "Privacy Policy",
        summary: `What data ${operator.site} collects, why it is needed, how long it is kept and how to have it deleted.`,
        sections: [
          {
            heading: "General",
            body: [
              `This Policy describes what personal data the ${operator.site} service processes and for what purpose. The data controller is ${operator.nameEn}.`,
              "By using the service you agree to the processing described here. If you do not agree with it, please do not use the service.",
              "Processing follows the Law of the Republic of Kazakhstan on Personal Data and its Protection, and, for visitors from the European Economic Area, the requirements of the GDPR.",
            ],
          },
          {
            heading: "What we process",
            body: [
              "We deliberately collect nothing beyond what the service needs, and we never ask for identity documents, payment details or a postal address.",
            ],
            bullets: [
              "Telegram account data passed by the login widget: numeric id, first name, last name where present, username, a link to the profile photo and a language code.",
              "The links you submit for download and details of the attempt itself: platform, date and time, chosen quality, and the outcome (success or error).",
              "Technical connection data: IP address, browser type and version, language and referring page. These end up in server logs and in the web analytics tools.",
              "Cookies and analytics identifiers — see the Cookie Policy for details.",
            ],
          },
          {
            heading: "Why we need it",
            bullets: [
              "To provide the service itself: fetch the video at your link and hand you the file.",
              `To tell your account from anyone else's and enforce the daily allowance of ${DAILY_LIMIT} downloads.`,
              "To protect the service from automated abuse through the Cloudflare Turnstile check before a link is submitted.",
              "To understand how the site is used and to fix errors, using anonymised and aggregated statistics.",
              "To answer your enquiries and those of rights holders.",
            ],
          },
          {
            heading: "Legal grounds",
            body: [
              "Telegram account data and download records are processed to perform the Terms of Use, which you accept when you start using the service.",
              "Analytics cookies and on-site session recording are processed on the basis of your consent, which you may withdraw at any time — see the Cookie Policy.",
              "Server logs and bot protection rest on our legitimate interest in keeping the service running and secure.",
            ],
          },
          {
            heading: "Third-party services",
            body: [
              "We do not sell your data and do not pass it to third parties for their own purposes. The service relies on the following providers, each processing data under its own rules:",
            ],
            bullets: [
              `Telegram — login widget authentication and the ${BOT} bot.`,
              "Cloudflare — bot protection (Turnstile), site delivery and mail routing.",
              "Google Analytics and Google Tag Manager — visit statistics.",
              "Yandex Metrica — visit statistics, click map and Webvisor. Webvisor records on-page activity: pointer movement, scrolling and clicks. Recordings are used only to analyse usability.",
            ],
          },
          {
            heading: "How long we keep it",
            bullets: [
              "Downloaded files are removed from the server automatically about an hour after they are created. We keep no archive of your videos.",
              "Records of download attempts are kept for as long as the daily allowance and enquiry handling require.",
              "Account data is kept while you use the service and is deleted on your request.",
              "Server logs are kept for a limited time and are overwritten as they rotate.",
            ],
          },
          {
            heading: "Where data is processed",
            body: [
              "The service runs on servers in a data centre within the European Union. Some of the providers listed above may process data outside it in line with their own policies.",
            ],
          },
          {
            heading: "Your rights",
            body: [
              `You may request information about the processing of your data, ask for it to be corrected or deleted, withdraw consent and object to processing. Write to ${MAIL} from the address or Telegram account the request concerns.`,
              "We reply within a reasonable time, normally within thirty calendar days. Deleting an account also deletes the download history attached to it.",
            ],
          },
          {
            heading: "Children",
            body: [
              "The service is not intended for and not directed at children under 16. We do not knowingly collect their data; if this has happened in error, write to us and it will be deleted.",
            ],
          },
          {
            heading: "Changes",
            body: [
              "We may update this Policy. The date of the current version is shown at the top of the page, and we will flag material changes within the service.",
            ],
          },
        ],
      },
      terms: {
        title: "Terms of Use",
        summary: `The rules for using ${operator.site}: what is allowed, what is not, and on what terms the service runs.`,
        sections: [
          {
            heading: "General",
            body: [
              `These Terms govern the use of the ${operator.site} website and the ${BOT} Telegram bot. The service is owned and operated by ${operator.nameEn}.`,
              "By starting to use the service you confirm that you have read these Terms and accept them. If any condition does not suit you, please do not use the service.",
            ],
          },
          {
            heading: "The service is free",
            body: [
              "Everything the service offers is free of charge. There are no subscriptions, paid plans, paid video qualities or in-service purchases.",
              "We show no advertising and place no affiliate links.",
              "The daily download allowance exists to keep the service stable and cannot be lifted by payment under any circumstances.",
            ],
          },
          {
            heading: "Access conditions",
            bullets: [
              "Downloading requires signing in with Telegram. This is what makes the allowance enforceable and abuse harder.",
              `One account may download up to ${DAILY_LIMIT} files per day. The counter is shared between the website and the bot.`,
              "Browsing the site and checking available qualities requires no sign-in.",
            ],
          },
          {
            heading: "What the service does",
            body: [
              "The service acts as a technical intermediary: it follows the link you provide, retrieves the media file from a publicly accessible page and passes it to you.",
              "We host no video catalogue, run no search over other people's content and keep downloaded files no longer than delivery requires — about an hour.",
              "Whether a particular platform works depends on that platform's technical decisions and may change without notice.",
            ],
          },
          {
            heading: "Your obligations",
            body: [
              "You alone are responsible for how you use the files you obtain, and you confirm that you are entitled to do so.",
            ],
            bullets: [
              "Download only material you own the rights to, or whose use the rights holder or the law permits.",
              "Do not use the service to infringe copyright or related rights, to distribute prohibited content or to violate the rights of others.",
              "Do not attempt to circumvent the service's technical limits, including the daily allowance, the bot check and authentication.",
              "Do not generate automated load: bulk requests, scripts and scrapers are not permitted.",
            ],
          },
          {
            heading: "Limitation of liability",
            body: [
              "The service is provided as is. We do not guarantee uninterrupted operation, the availability of any particular platform, or that a file will suit your purpose.",
              "We are not liable for what you do with the material you download, nor for the consequences of your infringing the rights of others.",
              "We may change what the service offers, suspend it for maintenance and discontinue it.",
            ],
          },
          {
            heading: "Restricting access",
            body: [
              "We may restrict or end access to the service where these Terms are breached, where limits are circumvented, or upon a substantiated complaint from a rights holder.",
            ],
          },
          {
            heading: "Changes and governing law",
            body: [
              "We may amend these Terms; the date of the current version is shown at the top of the page. Continuing to use the service after a change means you accept the new version.",
              "These Terms are governed by the law of the Republic of Kazakhstan. The parties will seek to settle disputes by correspondence and, failing agreement, in the manner established by Kazakhstan law.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie Policy",
        summary: `Which cookies ${operator.site} uses, what they are for and how to refuse them.`,
        sections: [
          {
            heading: "What cookies are",
            body: [
              "Cookies are small text files a site stores in your browser. They let the service remember that you are signed in and allow anonymised visit statistics to be collected.",
              "Alongside cookies, this document also covers related technologies: browser local storage and tracking pixels.",
            ],
          },
          {
            heading: "Strictly necessary",
            body: ["Without these the service does not work, so they are always set."],
            bullets: [
              "Login session — confirms that you are signed in with Telegram and makes the daily counter possible.",
              "Cloudflare Turnstile — checks that a link is submitted by a person rather than a script.",
              "Interface settings — your chosen language and colour theme.",
            ],
          },
          {
            heading: "Analytics",
            body: [
              "These help us see which pages are used and where errors occur. They are set with your consent and are not required for the service to work.",
            ],
            bullets: [
              "Google Analytics and Google Tag Manager — anonymised traffic and on-site behaviour.",
              "Yandex Metrica — traffic, click map and Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica's Webvisor records on-page activity: pointer movement, scrolling, clicks and typing in the link field. It exists so we can see where the interface confuses people.",
              "We do not use these recordings to track individuals. Please do not enter anything into the site's fields that you would not want stored.",
            ],
          },
          {
            heading: "How to refuse",
            bullets: [
              "Block or delete cookies in your browser settings — this works for every system listed here.",
              "Google Analytics: the official browser add-on that disables collection is available from Google.",
              "Yandex Metrica: opting out is possible through Yandex's official add-on.",
              "Disabling strictly necessary cookies will make signing in and downloading impossible.",
            ],
          },
          {
            heading: "Retention",
            body: [
              "Session cookies are deleted when you close the browser or when the session expires. Analytics tools keep their identifiers for the periods set by their providers.",
            ],
          },
        ],
      },
      copyright: {
        title: "Copyright",
        summary: "Where the service stands on copyright and how to file an infringement complaint.",
        sections: [
          {
            heading: "Where we stand",
            body: [
              "The service hosts no video and keeps no catalogue. It acts as a technical intermediary: it follows the link a user enters, reaches a publicly accessible page and passes the file to that user.",
              "Downloaded files sit on the server for about an hour and are then deleted automatically. No lasting copy of anyone's content remains with us.",
              "Responsibility for the use of downloaded material rests with the user, as the Terms of Use state explicitly.",
            ],
          },
          {
            heading: "If your rights are infringed",
            body: [
              `If you are a rights holder or their representative and believe the service is being used to infringe your rights, write to ${MAIL}. We review such complaints and act on them.`,
            ],
          },
          {
            heading: "What to include",
            bullets: [
              "Which work is affected and on what basis you hold the rights to it.",
              "A link to the material and, where known, the circumstances of the infringement.",
              "Your contact details: name, address and email address.",
              "If you act on a rights holder's behalf, evidence of your authority.",
              "A statement that the information in the complaint is accurate and that use of the material is not authorised by the rights holder or by law.",
            ],
          },
          {
            heading: "What we will do",
            body: [
              "We review a complaint within a reasonable time, normally within thirty calendar days, and where infringement is confirmed we block access to the material through the service and, where necessary, the infringer's access to the service.",
              "We will report the outcome to the email address you provide.",
            ],
          },
          {
            heading: "Bad-faith complaints",
            body: [
              "A complaint containing knowingly false information may render the complainant liable under applicable law. We may decline to consider a complaint that identifies neither the rights holder nor the disputed material.",
            ],
          },
        ],
      },
    },
  },

  es: {
    ui: {
      updated: "Última actualización",
      back: "Volver al inicio",
      operatorHeading: "Operador del servicio",
      navHeading: "Otros documentos",
      labels: {
        privacy: "Política de privacidad",
        terms: "Condiciones de uso",
        cookies: "Política de cookies",
        copyright: "Derechos de autor",
      },
    },
    docs: {
      privacy: {
        title: "Política de privacidad",
        summary: `Qué datos recopila ${operator.site}, para qué se necesitan, cuánto tiempo se conservan y cómo eliminarlos.`,
        sections: [
          {
            heading: "Disposiciones generales",
            body: [
              `Esta Política describe qué datos personales trata el servicio ${operator.site} y con qué finalidad. El responsable del tratamiento es ${operator.nameEs}.`,
              "Al utilizar el servicio, usted acepta el tratamiento aquí descrito. Si no está de acuerdo, le rogamos que no utilice el servicio.",
              "El tratamiento se realiza conforme a la Ley de la República de Kazajistán sobre datos personales y su protección y, respecto de los visitantes del Espacio Económico Europeo, atendiendo a los requisitos del RGPD.",
            ],
          },
          {
            heading: "Qué datos tratamos",
            body: [
              "No recopilamos deliberadamente nada más allá de lo que el servicio necesita y nunca solicitamos documentos de identidad, datos de pago ni domicilio.",
            ],
            bullets: [
              "Datos de la cuenta de Telegram que transmite el widget de inicio de sesión: identificador numérico, nombre, apellidos si constan, nombre de usuario, enlace a la foto de perfil y código de idioma.",
              "Los enlaces que envía para descargar y los datos del propio intento: plataforma, fecha y hora, calidad elegida y resultado (éxito o error).",
              "Datos técnicos de la conexión: dirección IP, tipo y versión del navegador, idioma y página de procedencia. Quedan registrados en los registros del servidor y en las herramientas de analítica web.",
              "Cookies e identificadores de analítica: véase la Política de cookies.",
            ],
          },
          {
            heading: "Para qué se necesitan",
            bullets: [
              "Para prestar el servicio: obtener el vídeo de su enlace y entregarle el archivo.",
              `Para distinguir su cuenta de las demás y respetar el límite diario de ${DAILY_LIMIT} descargas.`,
              "Para proteger el servicio frente a abusos automatizados mediante la verificación Cloudflare Turnstile antes de enviar un enlace.",
              "Para entender cómo se usa el sitio y corregir errores, mediante estadísticas anonimizadas y agregadas.",
              "Para responder a sus consultas y a las de los titulares de derechos.",
            ],
          },
          {
            heading: "Bases del tratamiento",
            body: [
              "Los datos de la cuenta de Telegram y el registro de descargas se tratan para ejecutar las Condiciones de uso, que usted acepta al comenzar a utilizar el servicio.",
              "Las cookies de analítica y la grabación de la actividad en el sitio se tratan con su consentimiento, que puede retirar en cualquier momento según se indica en la Política de cookies.",
              "Los registros del servidor y la protección antibots se amparan en nuestro interés legítimo de mantener el servicio operativo y seguro.",
            ],
          },
          {
            heading: "Servicios de terceros",
            body: [
              "No vendemos sus datos ni los cedemos a terceros para sus propios fines. El servicio se apoya en los siguientes proveedores, cada uno con sus propias normas de tratamiento:",
            ],
            bullets: [
              `Telegram: autenticación mediante el widget de inicio de sesión y funcionamiento del bot ${BOT}.`,
              "Cloudflare: protección antibots (Turnstile), entrega del sitio y enrutamiento del correo.",
              "Google Analytics y Google Tag Manager: estadísticas de visitas.",
              "Yandex Metrica: estadísticas de visitas, mapa de clics y Webvisor. Webvisor graba la actividad en la página: movimientos del puntero, desplazamiento y clics. Las grabaciones se usan únicamente para analizar la usabilidad.",
            ],
          },
          {
            heading: "Plazos de conservación",
            bullets: [
              "Los archivos descargados se eliminan del servidor automáticamente alrededor de una hora después de crearse. No conservamos ningún archivo histórico de sus vídeos.",
              "Los registros de los intentos de descarga se conservan mientras sean necesarios para el límite diario y la atención de consultas.",
              "Los datos de la cuenta se conservan mientras utilice el servicio y se eliminan a petición suya.",
              "Los registros del servidor se conservan un tiempo limitado y se sobrescriben con su rotación.",
            ],
          },
          {
            heading: "Dónde se tratan los datos",
            body: [
              "El servicio funciona en servidores ubicados en un centro de datos de la Unión Europea. Algunos de los proveedores indicados pueden tratar datos fuera de ella conforme a sus propias políticas.",
            ],
          },
          {
            heading: "Sus derechos",
            body: [
              `Puede solicitar información sobre el tratamiento de sus datos, pedir su rectificación o supresión, retirar el consentimiento y oponerse al tratamiento. Escriba a ${MAIL} desde la dirección o la cuenta de Telegram a la que se refiera la solicitud.`,
              "Respondemos en un plazo razonable, por lo general dentro de treinta días naturales. La eliminación de la cuenta conlleva la del historial de descargas asociado.",
            ],
          },
          {
            heading: "Menores",
            body: [
              "El servicio no está destinado ni dirigido a menores de 16 años. No recopilamos conscientemente sus datos; si ello ocurriera por error, escríbanos y los eliminaremos.",
            ],
          },
          {
            heading: "Modificaciones",
            body: [
              "Podemos actualizar esta Política. La fecha de la versión vigente figura al principio de la página y señalaremos en el servicio los cambios sustanciales.",
            ],
          },
        ],
      },
      terms: {
        title: "Condiciones de uso",
        summary: `Normas de uso de ${operator.site}: qué está permitido, qué no y en qué condiciones funciona el servicio.`,
        sections: [
          {
            heading: "Disposiciones generales",
            body: [
              `Estas Condiciones regulan el uso del sitio ${operator.site} y del bot de Telegram ${BOT}. El titular y administrador del servicio es ${operator.nameEs}.`,
              "Al empezar a utilizar el servicio, usted confirma que ha leído estas Condiciones y las acepta. Si alguna no le conviene, no debe utilizar el servicio.",
            ],
          },
          {
            heading: "El servicio es gratuito",
            body: [
              "Todas las funciones del servicio se prestan de forma gratuita. No hay suscripciones, planes de pago, calidades de vídeo de pago ni compras internas.",
              "No mostramos publicidad ni incluimos enlaces de afiliación.",
              "El límite diario de descargas existe para mantener el servicio estable y no puede levantarse mediante pago en ningún caso.",
            ],
          },
          {
            heading: "Condiciones de acceso",
            bullets: [
              "La descarga requiere iniciar sesión con Telegram. Es lo que permite aplicar el límite y dificultar los abusos.",
              `Una cuenta puede descargar hasta ${DAILY_LIMIT} archivos al día. El contador es común para el sitio web y el bot.`,
              "Navegar por el sitio y consultar las calidades disponibles no requiere iniciar sesión.",
            ],
          },
          {
            heading: "Qué hace el servicio",
            body: [
              "El servicio actúa como intermediario técnico: sigue el enlace que usted facilita, obtiene el archivo multimedia de una página de acceso público y se lo entrega.",
              "No alojamos ningún catálogo de vídeos, no realizamos búsquedas sobre contenido ajeno y no conservamos los archivos descargados más allá de lo necesario para su entrega, alrededor de una hora.",
              "El funcionamiento de cada plataforma depende de sus decisiones técnicas y puede cambiar sin previo aviso.",
            ],
          },
          {
            heading: "Obligaciones del usuario",
            body: [
              "Usted es el único responsable del uso que haga de los archivos obtenidos y confirma que tiene derecho a ello.",
            ],
            bullets: [
              "Descargue únicamente material cuyos derechos le pertenezcan o cuyo uso permitan el titular de los derechos o la ley.",
              "No utilice el servicio para infringir derechos de autor o conexos, difundir contenido prohibido o vulnerar derechos de terceros.",
              "No intente eludir las limitaciones técnicas del servicio, incluidos el límite diario, la verificación antibots y la autenticación.",
              "No genere carga automatizada: no se admiten peticiones masivas, scripts ni rastreadores.",
            ],
          },
          {
            heading: "Limitación de responsabilidad",
            body: [
              "El servicio se presta tal cual. No garantizamos su funcionamiento ininterrumpido, la disponibilidad de una plataforma concreta ni la idoneidad del archivo para sus fines.",
              "No respondemos del uso que usted haga del material descargado ni de las consecuencias de que vulnere derechos de terceros.",
              "Podemos modificar las funciones del servicio, suspenderlo por mantenimiento y cesar su prestación.",
            ],
          },
          {
            heading: "Limitación del acceso",
            body: [
              "Podemos limitar o cesar el acceso al servicio en caso de incumplimiento de estas Condiciones, de intentos de eludir las limitaciones o ante una reclamación fundada de un titular de derechos.",
            ],
          },
          {
            heading: "Modificaciones y ley aplicable",
            body: [
              "Podemos modificar estas Condiciones; la fecha de la versión vigente figura al principio de la página. Continuar utilizando el servicio tras un cambio supone aceptar la nueva versión.",
              "Estas Condiciones se rigen por la legislación de la República de Kazajistán. Las partes procurarán resolver las controversias por correspondencia y, de no alcanzarse acuerdo, conforme a lo establecido por dicha legislación.",
            ],
          },
        ],
      },
      cookies: {
        title: "Política de cookies",
        summary: `Qué cookies utiliza ${operator.site}, para qué sirven y cómo rechazarlas.`,
        sections: [
          {
            heading: "Qué son las cookies",
            body: [
              "Las cookies son pequeños archivos de texto que un sitio guarda en su navegador. Permiten recordar que ha iniciado sesión y recopilar estadísticas de visitas anonimizadas.",
              "Junto con las cookies, este documento cubre tecnologías afines: el almacenamiento local del navegador y los píxeles de seguimiento.",
            ],
          },
          {
            heading: "Necesarias",
            body: ["Sin ellas el servicio no funciona, por lo que siempre se instalan."],
            bullets: [
              "Sesión de acceso: confirma que ha iniciado sesión con Telegram y hace posible el contador diario.",
              "Cloudflare Turnstile: comprueba que el enlace lo envía una persona y no un script.",
              "Preferencias de interfaz: el idioma y el tema elegidos.",
            ],
          },
          {
            heading: "Analíticas",
            body: [
              "Nos ayudan a saber qué páginas se utilizan y dónde se producen errores. Se instalan con su consentimiento y no son necesarias para el funcionamiento del servicio.",
            ],
            bullets: [
              "Google Analytics y Google Tag Manager: tráfico y comportamiento en el sitio de forma anonimizada.",
              "Yandex Metrica: tráfico, mapa de clics y Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor de Yandex Metrica graba la actividad en la página: movimientos del puntero, desplazamiento, clics y escritura en el campo del enlace. Sirve para detectar dónde confunde la interfaz.",
              "No utilizamos estas grabaciones para seguir a personas concretas. No introduzca en los campos del sitio información que no desee que quede almacenada.",
            ],
          },
          {
            heading: "Cómo rechazarlas",
            bullets: [
              "Bloquee o elimine las cookies en la configuración de su navegador: sirve para todos los sistemas indicados.",
              "Google Analytics: el complemento oficial que desactiva la recopilación está disponible en Google.",
              "Yandex Metrica: puede oponerse mediante el complemento oficial de Yandex.",
              "Desactivar las cookies necesarias hará imposible iniciar sesión y descargar.",
            ],
          },
          {
            heading: "Plazos",
            body: [
              "Las cookies de sesión se eliminan al cerrar el navegador o al expirar la sesión. Las herramientas de analítica conservan sus identificadores durante los plazos que fijan sus proveedores.",
            ],
          },
        ],
      },
      copyright: {
        title: "Derechos de autor",
        summary: "Posición del servicio sobre los derechos de autor y procedimiento de reclamación.",
        sections: [
          {
            heading: "Nuestra posición",
            body: [
              "El servicio no aloja vídeos ni mantiene un catálogo. Actúa como intermediario técnico: sigue el enlace introducido por el usuario, accede a una página de acceso público y le entrega el archivo.",
              "Los archivos descargados permanecen en el servidor alrededor de una hora y después se eliminan automáticamente. No conservamos ninguna copia permanente de contenido ajeno.",
              "La responsabilidad por el uso del material descargado recae en el usuario, tal como establecen expresamente las Condiciones de uso.",
            ],
          },
          {
            heading: "Si se vulneran sus derechos",
            body: [
              `Si es titular de derechos o su representante y considera que el servicio se utiliza para vulnerarlos, escriba a ${MAIL}. Examinamos estas reclamaciones y adoptamos medidas.`,
            ],
          },
          {
            heading: "Qué debe indicar",
            bullets: [
              "Qué obra se ve afectada y en virtud de qué ostenta usted los derechos sobre ella.",
              "El enlace al material y, si se conocen, las circunstancias de la infracción.",
              "Sus datos de contacto: nombre o denominación, domicilio y dirección de correo electrónico.",
              "Si actúa en nombre del titular, acreditación de su representación.",
              "Una declaración de que la información de la reclamación es veraz y de que el uso del material no está autorizado por el titular ni por la ley.",
            ],
          },
          {
            heading: "Qué haremos",
            body: [
              "Examinamos la reclamación en un plazo razonable, por lo general dentro de treinta días naturales, y, confirmada la infracción, bloqueamos el acceso al material a través del servicio y, si procede, el acceso del infractor al servicio.",
              "Comunicaremos el resultado a la dirección de correo electrónico que nos facilite.",
            ],
          },
          {
            heading: "Reclamaciones de mala fe",
            body: [
              "Una reclamación con información deliberadamente falsa puede acarrear responsabilidad para quien la presenta conforme a la legislación aplicable. Podemos no admitir a trámite una reclamación que no permita identificar ni al titular de los derechos ni el material controvertido.",
            ],
          },
        ],
      },
    },
  },
};
