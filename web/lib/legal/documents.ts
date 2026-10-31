import { operator } from "./operator";
import { LegalByLanguage } from "./types";

// Тексты документов на десяти языках. Держим отдельно от lib/i18n/translations.ts:
// тот файл и так за тысячу строк, а документы правятся своим ритмом — вместе
// они превратились бы в файл, в котором ничего не найти.
//
// Содержание описывает сервис таким, какой он есть: бесплатный, без рекламы и
// подписок, на сайте скачивание без входа, суточного лимита скачиваний нет
// (есть только лимит трафика YouTube — 10 ГБ на сеть, 25 ГБ на аккаунт в боте),
// подписка на канал не требуется. Меняется поведение сервиса — правится и здесь,
// иначе документы начнут расходиться с действительностью, а это хуже, чем их
// отсутствие.

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
              "Данные учётной записи Telegram, которые бот получает, когда вы ему пишете: числовой идентификатор, имя пользователя, имя и код языка.",
              "Ссылки, которые вы отправляете на скачивание, и сведения о самой попытке: площадка, дата и время, выбранное качество, результат (успех или ошибка).",
              "Технические данные соединения: IP-адрес, тип и версия браузера, язык, страница перехода. Они попадают в журналы сервера и в системы веб-аналитики.",
              "Файлы cookie и идентификаторы аналитики — подробнее в Политике cookie.",
            ],
          },
          {
            heading: "Зачем эти данные нужны",
            bullets: [
              "Предоставить саму услугу: получить видео по вашей ссылке и отдать вам файл.",
              "Отличить вашу учётную запись от чужой и противодействовать злоупотреблениям.",
              "Защитить сервис от автоматизированных злоупотреблений: проверка Cloudflare Turnstile перед отправкой ссылки.",
              "Понимать, как используется сайт, и устранять ошибки — обезличенная и агрегированная статистика.",
              "Отвечать на ваши обращения и обращения правообладателей.",
              "Изредка написать вам в Telegram, чтобы узнать ваше мнение о сервисе — например, если вы перестали им пользоваться. Отвечать необязательно; если такие сообщения вам не нужны, просто скажите об этом, и мы больше не напишем.",
            ],
          },
          {
            heading: "Основания обработки",
            body: [
              "Данные учётной записи Telegram и сведения о скачиваниях обрабатываются для исполнения Пользовательского соглашения, которое вы принимаете, начиная пользоваться сервисом.",
              "Файлы cookie аналитики и запись действий на сайте обрабатываются на основании вашего согласия, которое вы можете отозвать в любой момент — способы описаны в Политике cookie.",
              "Журналы сервера и защита от ботов обрабатываются в рамках нашего законного интереса поддерживать сервис работоспособным и защищённым.",
              "Вопросы о вашем мнении о сервисе — в рамках нашего законного интереса улучшать сервис; вы можете отказаться от них в любой момент.",
            ],
          },
          {
            heading: "Подключённые аккаунты",
            body: [
              "По желанию вы можете подключить к боту свой аккаунт на площадке (Instagram, Facebook, YouTube, X, VK, TikTok), чтобы бот скачивал записи, видные только вошедшим: сторис, закрытые публикации. Для этого бот получает куки этого аккаунта — от расширения Videoner по одноразовому коду или из файла, который вы прислали.",
              "Мы сохраняем куки только выбранной площадки, остальные отбрасываем сразу. Хранятся они в зашифрованном виде и используются только для скачиваний там, куда вы их подключили. Подключённые в личке — для ваших скачиваний, в том числе ваших собственных ссылок в группах, где свой аккаунт не подключён; для чужих ссылок они не используются. Подключённые к группе — для скачиваний её участников и больше нигде.",
              "Основание — ваше согласие: вы подключаете аккаунт сами и можете удалить его в любой момент командой /accounts. При удалении куки стираются безвозвратно. Если площадка перестаёт принимать вход, бот сообщает вам об этом.",
              "Записи, скачанные через подключённый аккаунт, не публикуются в нашем канале и не выдаются другим пользователям из общего кеша.",
            ],
          },
          {
            heading: "Сторонние сервисы",
            body: [
              "Мы не продаём и не передаём ваши данные третьим лицам для их собственных целей. Для работы сервиса задействованы следующие поставщики, каждый из которых обрабатывает данные по своим правилам:",
            ],
            bullets: [
              "Telegram — работа бота " + BOT + ".",
              "Cloudflare — защита от ботов (Turnstile), доставка сайта и маршрутизация почты.",
              "Google Analytics и Google Tag Manager — статистика посещений.",
              "Яндекс.Метрика — статистика посещений, карта кликов и Вебвизор. Вебвизор записывает действия на странице: перемещения указателя, прокрутку и клики. Записи используются только для анализа удобства сайта.",
            ],
          },
          {
            heading: "Сколько мы храним данные",
            bullets: [
              "Скачанные файлы удаляются с сервера автоматически примерно через час после создания. Мы не храним архив ваших видео.",
              "Записи о попытках скачивания хранятся, пока это нужно для противодействия злоупотреблениям и разбора обращений.",
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
            ],
          },
          {
            heading: "Условия доступа",
            bullets: [
              "Для скачивания на сайте не нужны ни учётная запись, ни вход. Бот различает пользователей по их аккаунту Telegram.",
              "От перегрузки и автоматизированных злоупотреблений сервис защищают технические ограничения на частоту запросов.",
              "Для YouTube действует суточный лимит трафика: 10 ГБ за 24 часа с одной сети на сайте и в расширении и 25 ГБ за 24 часа на один аккаунт Telegram в боте. Остальные площадки он не затрагивает.",
              "Подписка на наш канал для скачивания через бот не требуется. В подписи к файлам бот добавляет ссылку на новостной канал проекта; подписываться на него необязательно.",
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
              "Не пытайтесь обойти технические ограничения сервиса, включая ограничения частоты запросов и проверку на ботов.",
              "Не создавайте автоматизированную нагрузку: массовые запросы, скрипты и парсеры не допускаются.",
            ],
          },
          {
            heading: "Публикация ссылок в канале",
            body: [
              "Скачивая видео через бот, вы соглашаетесь с тем, что ссылка на исходный пост будет опубликована в нашем Telegram-канале. Предупреждение об этом показывается в боте до выбора качества — то есть до того, как вы примете решение скачивать.",
              "Публикация анонимна: в канал уходят ссылка на общедоступную страницу, название ролика и его обложка — тот самый кадр, который площадка показывает в превью поста. Кто скачал видео, не указывается. Сам видеофайл не публикуется нигде и никогда: распространяется ссылка, которую площадки и сами предлагают распространять кнопкой «Поделиться» под каждым постом.",
              "Одна и та же ссылка публикуется не более одного раза. Если вы не хотите, чтобы ссылка попала в канал, не скачивайте это видео через наш сервис.",
              "Ссылки из групп и записи, скачанные через подключённый аккаунт, в канале не публикуются."
            ],
          },
          {
            heading: "Подключение своего аккаунта",
            body: [
              "Подключая к боту свой аккаунт на площадке, вы подтверждаете, что это ваш аккаунт и вы вправе им распоряжаться.",
              "Площадки не одобряют автоматические скачивания и могут ограничить или заблокировать подключённый аккаунт. Этот риск вы принимаете на себя; мы советуем подключать отдельный, не основной аккаунт. Мы не отвечаем за ограничения, которые площадка наложит на ваш аккаунт.",
              "Подключённый к группе аккаунт используется для скачиваний всех её участников. Администраторы группы решают, кто может подключать аккаунты, и могут удалить любой из них.",
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
              "Cookie — небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Они позволяют запомнить ваши настройки и собрать обезличенную статистику посещений.",
              "Вместе с cookie в этом документе мы описываем и близкие технологии — локальное хранилище браузера и счётчики-пиксели.",
            ],
          },
          {
            heading: "Необходимые",
            body: [
              "Без них сервис не работает, поэтому они устанавливаются всегда.",
            ],
            bullets: [
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
              "Отключение необходимых cookie сделает скачивание невозможным.",
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
              "Telegram account data the bot receives when you message it: numeric id, username, first name and a language code.",
              "The links you submit for download and details of the attempt itself: platform, date and time, chosen quality, and the outcome (success or error).",
              "Technical connection data: IP address, browser type and version, language and referring page. These end up in server logs and in the web analytics tools.",
              "Cookies and analytics identifiers — see the Cookie Policy for details.",
            ],
          },
          {
            heading: "Why we need it",
            bullets: [
              "To provide the service itself: fetch the video at your link and hand you the file.",
              "To tell your account from anyone else's and prevent abuse.",
              "To protect the service from automated abuse through the Cloudflare Turnstile check before a link is submitted.",
              "To understand how the site is used and to fix errors, using anonymised and aggregated statistics.",
              "To answer your enquiries and those of rights holders.",
              "To occasionally message you on Telegram to ask what you think of the service — for example, if you have stopped using it. Replying is optional; if you would rather not receive such messages, just say so and we will not write again.",
            ],
          },
          {
            heading: "Legal grounds",
            body: [
              "Telegram account data and download records are processed to perform the Terms of Use, which you accept when you start using the service.",
              "Analytics cookies and on-site session recording are processed on the basis of your consent, which you may withdraw at any time — see the Cookie Policy.",
              "Server logs and bot protection rest on our legitimate interest in keeping the service running and secure.",
              "Asking for your opinion of the service rests on our legitimate interest in improving it; you can opt out at any time.",
            ],
          },
          {
            heading: "Connected accounts",
            body: [
              "If you choose to, you can connect your account on a platform (Instagram, Facebook, YouTube, X, VK, TikTok) to the bot so that it downloads posts only signed-in users can see: stories, private posts. To do this the bot receives that account's cookies — from the Videoner extension via a one-time code, or from a file you send.",
              "We keep only the chosen platform's cookies and discard the rest immediately. They are stored encrypted and used only for downloads where you connected them. Cookies connected in your private chat serve your downloads, including your own links in groups that have no account of their own; they are never used for other people's links. Cookies connected to a group serve its members' downloads and nothing else.",
              "The legal ground is your consent: you connect the account yourself and can remove it at any time with /accounts. Removed cookies are erased permanently. If the platform stops accepting the login, the bot tells you.",
              "Posts downloaded through a connected account are not published in our channel and are not served to other users from the shared cache.",
            ],
          },
          {
            heading: "Third-party services",
            body: [
              "We do not sell your data and do not pass it to third parties for their own purposes. The service relies on the following providers, each processing data under its own rules:",
            ],
            bullets: [
              `Telegram — operation of the ${BOT} bot.`,
              "Cloudflare — bot protection (Turnstile), site delivery and mail routing.",
              "Google Analytics and Google Tag Manager — visit statistics.",
              "Yandex Metrica — visit statistics, click map and Webvisor. Webvisor records on-page activity: pointer movement, scrolling and clicks. Recordings are used only to analyse usability.",
            ],
          },
          {
            heading: "How long we keep it",
            bullets: [
              "Downloaded files are removed from the server automatically about an hour after they are created. We keep no archive of your videos.",
              "Records of download attempts are kept for as long as abuse prevention and enquiry handling require.",
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
            ],
          },
          {
            heading: "Access conditions",
            bullets: [
              "Downloading on the website requires no account and no sign-in. The bot tells users apart by their Telegram account.",
              "Technical limits on request frequency protect the service from overload and automated abuse.",
              "YouTube downloads have a daily traffic limit: 10 GB per 24 hours per network on the website and in the extension, and 25 GB per 24 hours per Telegram account in the bot. Other platforms are not affected.",
              "No subscription to our channel is required to download through the bot. The bot adds a link to the project's news channel in file captions; subscribing to it is optional.",
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
              "Do not attempt to circumvent the service's technical limits, including request rate limits and the bot check.",
              "Do not generate automated load: bulk requests, scripts and scrapers are not permitted.",
            ],
          },
          {
            heading: "Sharing links in the channel",
            body: [
              "By downloading a video through the bot you agree that the link to the original post will be published in our Telegram channel. A notice about this is shown in the bot before you choose a quality — that is, before you decide to download.",
              "Publication is anonymous: the channel receives the link to a publicly accessible page, the title and the cover frame — the same still the platform shows in its own post preview. Who downloaded it is not stated. The video file itself is never published anywhere: what is passed on is the link, which the platforms themselves invite people to pass on through the Share button under every post.",
              "The same link is published no more than once. If you would rather a link did not reach the channel, do not download that video through our service.",
              "Links from groups and posts downloaded through a connected account are never published in the channel."
            ],
          },
          {
            heading: "Connecting your account",
            body: [
              "By connecting your account on a platform to the bot, you confirm that it is your account and that you are entitled to use it this way.",
              "Platforms do not approve of automated downloads and may restrict or ban a connected account. You accept this risk; we recommend connecting a secondary account rather than your main one. We are not responsible for restrictions a platform places on your account.",
              "An account connected to a group is used for downloads by all of its members. Group admins decide who may connect accounts and can remove any of them.",
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
              "Cookies are small text files a site stores in your browser. They let the service remember your settings and allow anonymised visit statistics to be collected.",
              "Alongside cookies, this document also covers related technologies: browser local storage and tracking pixels.",
            ],
          },
          {
            heading: "Strictly necessary",
            body: ["Without these the service does not work, so they are always set."],
            bullets: [
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
              "Disabling strictly necessary cookies will make downloading impossible.",
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
              "Datos de la cuenta de Telegram que recibe el bot cuando usted le escribe: identificador numérico, nombre de usuario, nombre y código de idioma.",
              "Los enlaces que envía para descargar y los datos del propio intento: plataforma, fecha y hora, calidad elegida y resultado (éxito o error).",
              "Datos técnicos de la conexión: dirección IP, tipo y versión del navegador, idioma y página de procedencia. Quedan registrados en los registros del servidor y en las herramientas de analítica web.",
              "Cookies e identificadores de analítica: véase la Política de cookies.",
            ],
          },
          {
            heading: "Para qué se necesitan",
            bullets: [
              "Para prestar el servicio: obtener el vídeo de su enlace y entregarle el archivo.",
              "Para distinguir su cuenta de las demás y prevenir abusos.",
              "Para proteger el servicio frente a abusos automatizados mediante la verificación Cloudflare Turnstile antes de enviar un enlace.",
              "Para entender cómo se usa el sitio y corregir errores, mediante estadísticas anonimizadas y agregadas.",
              "Para responder a sus consultas y a las de los titulares de derechos.",
              "Para escribirle ocasionalmente por Telegram y preguntarle su opinión sobre el servicio, por ejemplo, si ha dejado de usarlo. Responder es opcional; si prefiere no recibir estos mensajes, basta con decírnoslo y no volveremos a escribirle.",
            ],
          },
          {
            heading: "Bases del tratamiento",
            body: [
              "Los datos de la cuenta de Telegram y el registro de descargas se tratan para ejecutar las Condiciones de uso, que usted acepta al comenzar a utilizar el servicio.",
              "Las cookies de analítica y la grabación de la actividad en el sitio se tratan con su consentimiento, que puede retirar en cualquier momento según se indica en la Política de cookies.",
              "Los registros del servidor y la protección antibots se amparan en nuestro interés legítimo de mantener el servicio operativo y seguro.",
              "Las preguntas sobre su opinión del servicio se amparan en nuestro interés legítimo de mejorarlo; puede oponerse a ellas en cualquier momento.",
            ],
          },
          {
            heading: "Cuentas conectadas",
            body: [
              "Si lo desea, puede conectar al bot su cuenta en una plataforma (Instagram, Facebook, YouTube, X, VK, TikTok) para que descargue publicaciones visibles solo para usuarios que han iniciado sesión: historias, publicaciones privadas. Para ello el bot recibe las cookies de esa cuenta, desde la extensión de Videoner mediante un código de un solo uso o desde un archivo que usted envíe.",
              "Conservamos solo las cookies de la plataforma elegida y descartamos el resto de inmediato. Se guardan cifradas y se usan solo para descargas allí donde las conectó. Las conectadas en su chat privado sirven para sus descargas, incluidos sus propios enlaces en grupos que no tienen una cuenta propia; nunca se usan para enlaces de otras personas. Las conectadas a un grupo sirven para las descargas de sus miembros y nada más.",
              "La base jurídica es su consentimiento: usted conecta la cuenta y puede eliminarla en cualquier momento con /accounts. Las cookies eliminadas se borran de forma definitiva. Si la plataforma deja de aceptar el inicio de sesión, el bot se lo comunica.",
              "Las publicaciones descargadas mediante una cuenta conectada no se publican en nuestro canal ni se entregan a otros usuarios desde la caché común.",
            ],
          },
          {
            heading: "Servicios de terceros",
            body: [
              "No vendemos sus datos ni los cedemos a terceros para sus propios fines. El servicio se apoya en los siguientes proveedores, cada uno con sus propias normas de tratamiento:",
            ],
            bullets: [
              `Telegram: funcionamiento del bot ${BOT}.`,
              "Cloudflare: protección antibots (Turnstile), entrega del sitio y enrutamiento del correo.",
              "Google Analytics y Google Tag Manager: estadísticas de visitas.",
              "Yandex Metrica: estadísticas de visitas, mapa de clics y Webvisor. Webvisor graba la actividad en la página: movimientos del puntero, desplazamiento y clics. Las grabaciones se usan únicamente para analizar la usabilidad.",
            ],
          },
          {
            heading: "Plazos de conservación",
            bullets: [
              "Los archivos descargados se eliminan del servidor automáticamente alrededor de una hora después de crearse. No conservamos ningún archivo histórico de sus vídeos.",
              "Los registros de los intentos de descarga se conservan mientras sean necesarios para la prevención de abusos y la atención de consultas.",
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
            ],
          },
          {
            heading: "Condiciones de acceso",
            bullets: [
              "Para descargar en el sitio web no se necesita cuenta ni iniciar sesión. El bot distingue a los usuarios por su cuenta de Telegram.",
              "Los límites técnicos de frecuencia de solicitudes protegen el servicio frente a la sobrecarga y los abusos automatizados.",
              "Las descargas de YouTube tienen un límite diario de tráfico: 10 GB cada 24 horas por red en el sitio web y en la extensión, y 25 GB cada 24 horas por cuenta de Telegram en el bot. Las demás plataformas no se ven afectadas.",
              "No es necesario suscribirse a nuestro canal para descargar mediante el bot. El bot añade en el texto que acompaña a los archivos un enlace al canal de noticias del proyecto; suscribirse a él es opcional.",
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
              "No intente eludir las limitaciones técnicas del servicio, incluidos los límites de frecuencia de solicitudes y la verificación antibots.",
              "No genere carga automatizada: no se admiten peticiones masivas, scripts ni rastreadores.",
            ],
          },
          {
            heading: "Publicación de enlaces en el canal",
            body: [
              "Al descargar un vídeo mediante el bot, usted acepta que el enlace a la publicación original se publique en nuestro canal de Telegram. El aviso correspondiente se muestra en el bot antes de elegir la calidad, es decir, antes de que decida descargar.",
              "La publicación es anónima: al canal llegan el enlace a una página de acceso público, el título y la imagen de portada, el mismo fotograma que la plataforma muestra en la vista previa de la publicación. No se indica quién lo descargó. El archivo de vídeo no se publica en ningún sitio: se difunde el enlace, que las propias plataformas invitan a difundir con el botón Compartir de cada publicación.",
              "Un mismo enlace se publica como máximo una vez. Si prefiere que un enlace no llegue al canal, no descargue ese vídeo a través de nuestro servicio.",
              "Los enlaces de grupos y las publicaciones descargadas mediante una cuenta conectada nunca se publican en el canal."
            ],
          },
          {
            heading: "Conectar su cuenta",
            body: [
              "Al conectar al bot su cuenta en una plataforma, confirma que la cuenta es suya y que tiene derecho a usarla de este modo.",
              "Las plataformas no aprueban las descargas automatizadas y pueden restringir o bloquear una cuenta conectada. Usted asume este riesgo; le recomendamos conectar una cuenta secundaria y no la principal. No respondemos de las restricciones que una plataforma imponga a su cuenta.",
              "Una cuenta conectada a un grupo se usa para las descargas de todos sus miembros. Los administradores del grupo deciden quién puede conectar cuentas y pueden eliminar cualquiera de ellas.",
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
              "Las cookies son pequeños archivos de texto que un sitio guarda en su navegador. Permiten recordar sus ajustes y recopilar estadísticas de visitas anonimizadas.",
              "Junto con las cookies, este documento cubre tecnologías afines: el almacenamiento local del navegador y los píxeles de seguimiento.",
            ],
          },
          {
            heading: "Necesarias",
            body: ["Sin ellas el servicio no funciona, por lo que siempre se instalan."],
            bullets: [
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
              "Desactivar las cookies necesarias hará imposible descargar.",
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
  uk: {
    ui: {
      updated: "Редакція від",
      back: "На головну",
      operatorHeading: "Оператор сервісу",
      navHeading: "Інші документи",
      labels: {
        privacy: "Політика конфіденційності",
        terms: "Угода користувача",
        cookies: "Політика cookie",
        copyright: "Правовласникам",
      },
    },
    docs: {
      privacy: {
        title: "Політика конфіденційності",
        summary: `Які дані збирає ${operator.site}, навіщо вони потрібні, скільки зберігаються та як їх видалити.`,
        sections: [
          {
            heading: "Загальні положення",
            body: [
              `Ця Політика описує, які персональні дані обробляє сервіс ${operator.site} і з якою метою. Оператором даних є ${operator.nameUk}.`,
              "Користуючись сервісом, ви погоджуєтеся з описаним тут порядком обробки. Якщо ви з ним не згодні, будь ласка, не використовуйте сервіс.",
              "Обробка здійснюється відповідно до Закону Республіки Казахстан «Про персональні дані та їх захист», а щодо відвідувачів з Європейської економічної зони — з урахуванням вимог GDPR.",
            ],
          },
          {
            heading: "Які дані ми обробляємо",
            body: [
              "Ми свідомо не збираємо нічого понад необхідне для роботи сервісу та не запитуємо документи, платіжні дані чи адресу.",
            ],
            bullets: [
              "Дані облікового запису Telegram, які бот отримує, коли ви йому пишете: числовий ідентифікатор, ім'я користувача, ім'я та код мови.",
              "Посилання, які ви надсилаєте на завантаження, і відомості про саму спробу: платформа, дата й час, обрана якість, результат (успіх або помилка).",
              "Технічні дані з'єднання: IP-адреса, тип і версія браузера, мова, сторінка переходу. Вони потрапляють до журналів сервера та до систем вебаналітики.",
              "Файли cookie та ідентифікатори аналітики — докладніше в Політиці cookie.",
            ],
          },
          {
            heading: "Навіщо потрібні ці дані",
            bullets: [
              "Надати саму послугу: отримати відео за вашим посиланням і передати вам файл.",
              "Відрізнити ваш обліковий запис від чужого та протидіяти зловживанням.",
              "Захистити сервіс від автоматизованих зловживань: перевірка Cloudflare Turnstile перед надсиланням посилання.",
              "Розуміти, як використовується сайт, і усувати помилки — знеособлена та агрегована статистика.",
              "Відповідати на ваші звернення та звернення правовласників.",
              "Зрідка написати вам у Telegram, щоб дізнатися вашу думку про сервіс — наприклад, якщо ви перестали ним користуватися. Відповідати необов'язково; якщо такі повідомлення вам не потрібні, просто скажіть про це, і ми більше не писатимемо.",
            ],
          },
          {
            heading: "Підстави обробки",
            body: [
              "Дані облікового запису Telegram і відомості про завантаження обробляються для виконання Угоди користувача, яку ви приймаєте, починаючи користуватися сервісом.",
              "Файли cookie аналітики та запис дій на сайті обробляються на підставі вашої згоди, яку ви можете відкликати будь-коли — способи описано в Політиці cookie.",
              "Журнали сервера та захист від ботів обробляються в межах нашого законного інтересу підтримувати сервіс працездатним і захищеним.",
              "Запитання про вашу думку щодо сервісу — в межах нашого законного інтересу вдосконалювати сервіс; ви можете відмовитися від них будь-коли.",
            ],
          },
          {
            heading: "Підключені акаунти",
            body: [
              "За бажанням ви можете підключити до бота свій акаунт на платформі (Instagram, Facebook, YouTube, X, VK, TikTok), щоб бот завантажував записи, доступні лише користувачам, які увійшли: сторіс, закриті дописи. Для цього бот отримує куки цього акаунта — від розширення Videoner за одноразовим кодом або з файлу, який ви надіслали.",
              "Ми зберігаємо куки лише обраної платформи, решту відкидаємо одразу. Вони зберігаються в зашифрованому вигляді й використовуються лише для завантажень там, де ви їх підключили. Підключені в особистих повідомленнях — для ваших завантажень, зокрема ваших власних посилань у групах, де свій акаунт не підключено; для чужих посилань вони не використовуються. Підключені до групи — для завантажень її учасників і більше ніде.",
              "Підстава — ваша згода: ви підключаєте акаунт самостійно й можете видалити його будь-коли командою /accounts. У разі видалення куки стираються безповоротно. Якщо платформа перестає приймати вхід, бот повідомляє вам про це.",
              "Записи, завантажені через підключений акаунт, не публікуються в нашому каналі та не видаються іншим користувачам із загального кешу.",
            ],
          },
          {
            heading: "Сторонні сервіси",
            body: [
              "Ми не продаємо й не передаємо ваші дані третім особам для їхніх власних цілей. Для роботи сервісу залучено таких постачальників, кожен з яких обробляє дані за своїми правилами:",
            ],
            bullets: [
              "Telegram — робота бота " + BOT + ".",
              "Cloudflare — захист від ботів (Turnstile), доставка сайту та маршрутизація пошти.",
              "Google Analytics і Google Tag Manager — статистика відвідувань.",
              "Яндекс.Метрика — статистика відвідувань, карта кліків і Вебвізор. Вебвізор записує дії на сторінці: переміщення вказівника, прокручування та кліки. Записи використовуються лише для аналізу зручності сайту.",
            ],
          },
          {
            heading: "Скільки ми зберігаємо дані",
            bullets: [
              "Завантажені файли автоматично видаляються з сервера приблизно через годину після створення. Ми не зберігаємо архів ваших відео.",
              "Записи про спроби завантаження зберігаються, доки це потрібно для протидії зловживанням та розгляду звернень.",
              "Дані облікового запису зберігаються, доки ви користуєтеся сервісом, і видаляються на ваш запит.",
              "Журнали сервера зберігаються обмежений час і перезаписуються в міру ротації.",
            ],
          },
          {
            heading: "Де обробляються дані",
            body: [
              "Сервери сервісу розташовані в дата-центрі на території Європейського Союзу. Частина постачальників, перелічених вище, може обробляти дані за його межами відповідно до своїх політик.",
            ],
          },
          {
            heading: "Ваші права",
            body: [
              `Ви маєте право отримати відомості про обробку ваших даних, вимагати їх виправлення або видалення, відкликати згоду та заперечити проти обробки. Для цього напишіть на ${MAIL} з тієї пошти або того акаунта Telegram, які пов'язані зі зверненням.`,
              "Ми відповідаємо в розумний строк, як правило протягом тридцяти календарних днів. Видалення облікового запису тягне за собою видалення пов'язаної з ним історії завантажень.",
            ],
          },
          {
            heading: "Неповнолітні",
            body: [
              "Сервіс не призначений для дітей віком до 16 років і не адресований їм. Ми свідомо не збираємо дані таких користувачів; якщо це сталося помилково, напишіть нам, і дані буде видалено.",
            ],
          },
          {
            heading: "Зміни",
            body: [
              "Ми можемо оновлювати цю Політику. Дату чинної редакції зазначено на початку сторінки; про суттєві зміни ми повідомлятимемо в сервісі.",
            ],
          },
        ],
      },
      terms: {
        title: "Угода користувача",
        summary: `Правила використання ${operator.site}: що можна, що не можна і на яких умовах працює сервіс.`,
        sections: [
          {
            heading: "Загальні положення",
            body: [
              `Угода регулює використання сайту ${operator.site} і Telegram-бота ${BOT}. Власник і адміністратор сервісу — ${operator.nameUk}.`,
              "Починаючи користуватися сервісом, ви підтверджуєте, що прочитали умови та приймаєте їх. Якщо будь-яка умова вам не підходить, користуватися сервісом не слід.",
            ],
          },
          {
            heading: "Сервіс безкоштовний",
            body: [
              "Усі можливості сервісу надаються безкоштовно. У нас немає підписок, платних тарифів, платних якостей відео та внутрішніх покупок.",
              "Ми не показуємо рекламу та не розміщуємо партнерські посилання.",
            ],
          },
          {
            heading: "Умови доступу",
            bullets: [
              "Для завантаження на сайті не потрібні ні обліковий запис, ні вхід. Бот розрізняє користувачів за їхнім акаунтом Telegram.",
              "Від перевантаження та автоматизованих зловживань сервіс захищають технічні обмеження частоти запитів.",
              "Для YouTube діє добовий ліміт трафіку: 10 ГБ за 24 години з однієї мережі на сайті та в розширенні і 25 ГБ за 24 години на один акаунт Telegram у боті. Інших платформ він не стосується.",
              "Підписка на наш канал для завантаження через бот не потрібна. У підписі до файлів бот додає посилання на канал новин проєкту; підписуватися на нього необов'язково.",
            ],
          },
          {
            heading: "Що робить сервіс",
            body: [
              "Сервіс є технічним посередником: за вашим посиланням він звертається до загальнодоступної сторінки, отримує медіафайл і передає його вам.",
              "Ми не розміщуємо в себе каталог відео, не здійснюємо пошук чужим контентом і не зберігаємо завантажені файли довше за час, необхідний для передачі, — приблизно годину.",
              "Доступність конкретної платформи залежить від її технічних рішень і може змінитися без попередження.",
            ],
          },
          {
            heading: "Обов'язки користувача",
            body: [
              "Ви самостійно відповідаєте за те, як використовуєте отримані файли, і підтверджуєте, що маєте на це право.",
            ],
            bullets: [
              "Завантажуйте лише той матеріал, права на який належать вам або використання якого дозволено правовласником чи законом.",
              "Не використовуйте сервіс для порушення авторських і суміжних прав, поширення забороненого контенту та порушення прав третіх осіб.",
              "Не намагайтеся обійти технічні обмеження сервісу, зокрема обмеження частоти запитів і перевірку на ботів.",
              "Не створюйте автоматизоване навантаження: масові запити, скрипти та парсери не допускаються.",
            ],
          },
          {
            heading: "Публікація посилань у каналі",
            body: [
              "Завантажуючи відео через бот, ви погоджуєтеся з тим, що посилання на вихідний допис буде опубліковано в нашому Telegram-каналі. Попередження про це показується в боті до вибору якості — тобто до того, як ви ухвалите рішення завантажувати.",
              "Публікація анонімна: до каналу потрапляють посилання на загальнодоступну сторінку, назва ролика та його обкладинка — той самий кадр, який платформа показує в прев'ю допису. Хто завантажив відео, не зазначається. Сам відеофайл не публікується ніде й ніколи: поширюється посилання, яке платформи й самі пропонують поширювати кнопкою «Поділитися» під кожним дописом.",
              "Одне й те саме посилання публікується не більше одного разу. Якщо ви не хочете, щоб посилання потрапило до каналу, не завантажуйте це відео через наш сервіс.",
              "Посилання з груп і записи, завантажені через підключений акаунт, у каналі не публікуються."
            ],
          },
          {
            heading: "Підключення свого акаунта",
            body: [
              "Підключаючи до бота свій акаунт на платформі, ви підтверджуєте, що це ваш акаунт і ви маєте право ним розпоряджатися.",
              "Платформи не схвалюють автоматичні завантаження й можуть обмежити або заблокувати підключений акаунт. Цей ризик ви берете на себе; ми радимо підключати окремий, не основний акаунт. Ми не відповідаємо за обмеження, які платформа накладе на ваш акаунт.",
              "Підключений до групи акаунт використовується для завантажень усіх її учасників. Адміністратори групи вирішують, хто може підключати акаунти, і можуть видалити будь-який із них.",
            ],
          },
          {
            heading: "Обмеження відповідальності",
            body: [
              "Сервіс надається на умовах «як є». Ми не гарантуємо безперебійної роботи, доступності конкретної платформи чи придатності файлу для ваших цілей.",
              "Ми не несемо відповідальності за те, як ви розпорядилися завантаженим матеріалом, і за наслідки порушення вами прав третіх осіб.",
              "Ми маємо право змінювати склад можливостей, призупиняти роботу сервісу для обслуговування та припиняти його роботу.",
            ],
          },
          {
            heading: "Обмеження доступу",
            body: [
              "Ми можемо обмежити або припинити доступ до сервісу в разі порушення цих умов, спроб обійти обмеження, а також у разі надходження обґрунтованої скарги правовласника.",
            ],
          },
          {
            heading: "Зміни та застосовне право",
            body: [
              "Ми можемо змінювати умови; дату чинної редакції зазначено на початку сторінки. Продовжуючи користуватися сервісом після змін, ви приймаєте нову редакцію.",
              "До відносин сторін застосовується право Республіки Казахстан. Спори сторони прагнуть урегулювати шляхом листування, а в разі недосягнення згоди — в порядку, встановленому законодавством Республіки Казахстан.",
            ],
          },
        ],
      },
      cookies: {
        title: "Політика cookie",
        summary: `Які файли cookie використовує ${operator.site}, навіщо вони потрібні та як від них відмовитися.`,
        sections: [
          {
            heading: "Що таке cookie",
            body: [
              "Cookie — невеликі текстові файли, які сайт зберігає у вашому браузері. Вони дають змогу запам'ятати ваші налаштування та зібрати знеособлену статистику відвідувань.",
              "Разом із cookie в цьому документі ми описуємо й подібні технології — локальне сховище браузера та лічильники-пікселі.",
            ],
          },
          {
            heading: "Необхідні",
            body: [
              "Без них сервіс не працює, тому вони встановлюються завжди.",
            ],
            bullets: [
              "Cloudflare Turnstile — перевірка, що посилання надсилає людина, а не скрипт.",
              "Налаштування інтерфейсу — обрана мова та тема оформлення.",
            ],
          },
          {
            heading: "Аналітичні",
            body: [
              "Вони допомагають зрозуміти, якими сторінками користуються та де виникають помилки. Встановлюються за вашою згодою й не є обов'язковими для роботи сервісу.",
            ],
            bullets: [
              "Google Analytics і Google Tag Manager — відвідуваність і поведінка на сайті в знеособленому вигляді.",
              "Яндекс.Метрика — відвідуваність, карта кліків і Вебвізор.",
            ],
          },
          {
            heading: "Вебвізор",
            body: [
              "Вебвізор Яндекс.Метрики записує дії на сторінці: переміщення вказівника, прокручування, кліки та введення в поле посилання. Це потрібно, щоб бачити, де інтерфейс збиває з пантелику.",
              "Ми не використовуємо ці записи для відстеження конкретних людей. Не вводьте в поля сайту відомості, які не хотіли б зберігати.",
            ],
          },
          {
            heading: "Як відмовитися",
            bullets: [
              "Налаштуйте блокування або видалення cookie у вашому браузері — цей спосіб працює для всіх перелічених систем.",
              "Google Analytics: офіційне доповнення для браузера, що вимикає збір даних, доступне на сайті Google.",
              "Яндекс.Метрика: відмова доступна через офіційне доповнення Яндекса.",
              "Вимкнення необхідних cookie унеможливить завантаження.",
            ],
          },
          {
            heading: "Строки",
            body: [
              "Сесійні cookie видаляються після закриття браузера або після закінчення строку сесії. Аналітичні лічильники зберігають ідентифікатори протягом строків, встановлених їхніми постачальниками.",
            ],
          },
        ],
      },
      copyright: {
        title: "Правовласникам",
        summary: "Позиція сервісу щодо авторських прав і порядок подання скарги на порушення.",
        sections: [
          {
            heading: "Позиція сервісу",
            body: [
              "Сервіс не розміщує в себе відео й не веде їх каталогу. Він виступає технічним посередником: за посиланням, яке ввів користувач, звертається до загальнодоступної сторінки й передає користувачеві файл.",
              "Завантажені файли зберігаються на сервері близько години й видаляються автоматично. Постійної копії чужого контенту в нас не залишається.",
              "Відповідальність за використання завантаженого матеріалу несе користувач — це прямо закріплено в Угоді користувача.",
            ],
          },
          {
            heading: "Якщо ваші права порушено",
            body: [
              `Якщо ви правовласник або його представник і вважаєте, що сервіс використовується для порушення ваших прав, напишіть на ${MAIL}. Ми розглядаємо такі звернення та вживаємо заходів.`,
            ],
          },
          {
            heading: "Що зазначити у зверненні",
            bullets: [
              "Який твір зачеплено та на якій підставі ви маєте права на нього.",
              "Посилання на матеріал і, якщо відомо, обставини порушення.",
              "Ваші контактні дані: ім'я або найменування, адреса та адреса електронної пошти.",
              "Якщо ви дієте від імені правовласника — підтвердження повноважень.",
              "Заява про те, що відомості у зверненні достовірні, а використання матеріалу не дозволено правовласником або законом.",
            ],
          },
          {
            heading: "Що ми зробимо",
            body: [
              "Ми розглядаємо звернення в розумний строк, як правило протягом тридцяти календарних днів, і в разі підтвердження порушення обмежуємо доступ до матеріалу через сервіс, а за потреби — доступ порушника до сервісу.",
              "Про результати розгляду ми повідомимо на зазначену вами адресу електронної пошти.",
            ],
          },
          {
            heading: "Недобросовісні звернення",
            body: [
              "Звернення, що містить завідомо недостовірні відомості, може тягнути за собою відповідальність заявника відповідно до законодавства. Ми маємо право відмовити в розгляді звернення, якщо воно не дає змоги встановити ні правовласника, ні спірний матеріал.",
            ],
          },
        ],
      },
    },
  },
  kk: {
    ui: {
      updated: "Редакция күні",
      back: "Басты бетке",
      operatorHeading: "Сервис операторы",
      navHeading: "Басқа құжаттар",
      labels: {
        privacy: "Құпиялылық саясаты",
        terms: "Пайдаланушы келісімі",
        cookies: "Cookie саясаты",
        copyright: "Құқық иелеріне",
      },
    },
    docs: {
      privacy: {
        title: "Құпиялылық саясаты",
        summary: `${operator.site} қандай деректерді жинайды, олар не үшін қажет, қанша уақыт сақталады және оларды қалай жоюға болады.`,
        sections: [
          {
            heading: "Жалпы ережелер",
            body: [
              `Осы Саясат ${operator.site} сервисі қандай дербес деректерді және қандай мақсатпен өңдейтінін сипаттайды. Деректер операторы — ${operator.nameKk}.`,
              "Сервисті пайдалана отырып, сіз осы жерде сипатталған өңдеу тәртібімен келісесіз. Егер сіз онымен келіспесеңіз, сервисті пайдаланбауыңызды сұраймыз.",
              "Өңдеу «Дербес деректер және оларды қорғау туралы» Қазақстан Республикасының Заңына сәйкес, ал Еуропалық экономикалық аймақтан келушілерге қатысты GDPR талаптарын ескере отырып жүргізіледі.",
            ],
          },
          {
            heading: "Біз қандай деректерді өңдейміз",
            body: [
              "Біз сервистің жұмысына қажетті деректерден артық ештеңені әдейі жинамаймыз және құжаттарды, төлем деректерін немесе мекенжайды сұратпаймыз.",
            ],
            bullets: [
              "Сіз ботқа жазған кезде ол алатын Telegram есептік жазбасының деректері: сандық идентификатор, пайдаланушы аты, аты және тіл коды.",
              "Сіз жүктеп алуға жіберетін сілтемелер және әрекеттің өзі туралы мәліметтер: платформа, күні мен уақыты, таңдалған сапа, нәтиже (сәтті немесе қате).",
              "Қосылымның техникалық деректері: IP-мекенжай, браузердің түрі мен нұсқасы, тіл, өтпелі бет. Олар сервер журналдарына және веб-аналитика жүйелеріне түседі.",
              "Cookie файлдары және аналитика идентификаторлары — толығырақ Cookie саясатында.",
            ],
          },
          {
            heading: "Бұл деректер не үшін қажет",
            bullets: [
              "Қызметтің өзін көрсету: сіздің сілтемеңіз бойынша бейнені алу және файлды сізге беру.",
              "Сіздің есептік жазбаңызды басқа біреудікінен ажырату және теріс пайдаланушылыққа қарсы әрекет ету.",
              "Сервисті автоматтандырылған теріс пайдаланудан қорғау: сілтемені жібермес бұрын Cloudflare Turnstile тексерісі.",
              "Сайттың қалай пайдаланылатынын түсіну және қателерді жою — иесіздендірілген және жинақталған статистика.",
              "Сіздің өтініштеріңізге және құқық иелерінің өтініштеріне жауап беру.",
              "Анда-санда сервис туралы пікіріңізді білу үшін сізге Telegram-да жазу — мысалы, егер сіз оны пайдалануды тоқтатсаңыз. Жауап беру міндетті емес; егер мұндай хабарламалар сізге қажет болмаса, бұл туралы айтыңыз, біз бұдан былай жазбаймыз.",
            ],
          },
          {
            heading: "Өңдеу негіздері",
            body: [
              "Telegram есептік жазбасының деректері және жүктеп алулар туралы мәліметтер сервисті пайдалана бастаған кезде сіз қабылдайтын Пайдаланушы келісімін орындау үшін өңделеді.",
              "Аналитикалық cookie файлдары және сайттағы әрекеттерді жазу сіздің келісіміңіз негізінде өңделеді, оны кез келген уақытта кері қайтарып алуға болады — тәсілдері Cookie саясатында сипатталған.",
              "Сервер журналдары және боттардан қорғау сервисті жұмысқа қабілетті және қорғалған күйде ұстауға қатысты біздің заңды мүддеміз шеңберінде өңделеді.",
              "Сервис туралы пікіріңізді сұрау — сервисті жақсартуға қатысты біздің заңды мүддеміз шеңберінде; сіз олардан кез келген уақытта бас тарта аласыз.",
            ],
          },
          {
            heading: "Қосылған аккаунттар",
            body: [
              "Қаласаңыз, ботқа платформадағы (Instagram, Facebook, YouTube, X, VK, TikTok) өз аккаунтыңызды қоса аласыз, сонда бот тек жүйеге кірген пайдаланушыларға көрінетін жазбаларды: сторис, жабық жарияланымдарды жүктеп алады. Ол үшін бот осы аккаунттың cookie файлдарын алады — Videoner кеңейтімінен бір реттік код арқылы немесе сіз жіберген файлдан.",
              "Біз тек таңдалған платформаның cookie файлдарын сақтаймыз, қалғандарын бірден жоямыз. Олар шифрланған түрде сақталады және тек сіз қосқан жерде жүктеп алу үшін пайдаланылады. Жеке хатта қосылғандары — сіздің жүктеп алуларыңыз үшін, оның ішінде өз аккаунты қосылмаған топтардағы сіздің өз сілтемелеріңіз үшін; басқалардың сілтемелері үшін олар пайдаланылмайды. Топқа қосылғандары — оның қатысушыларының жүктеп алулары үшін және басқа еш жерде емес.",
              "Негіз — сіздің келісіміңіз: аккаунтты сіз өзіңіз қосасыз және оны кез келген уақытта /accounts командасымен жоя аласыз. Жойған кезде cookie файлдары қайтарымсыз өшіріледі. Егер платформа кіруді қабылдауды тоқтатса, бот бұл туралы сізге хабарлайды.",
              "Қосылған аккаунт арқылы жүктеп алынған жазбалар біздің арнада жарияланбайды және ортақ кэштен басқа пайдаланушыларға берілмейді.",
            ],
          },
          {
            heading: "Үшінші тарап сервистері",
            body: [
              "Біз сіздің деректеріңізді үшінші тұлғаларға олардың өз мақсаттары үшін сатпаймыз және бермейміз. Сервистің жұмысына келесі жеткізушілер тартылған, олардың әрқайсысы деректерді өз ережелері бойынша өңдейді:",
            ],
            bullets: [
              "Telegram — " + BOT + " ботының жұмысы.",
              "Cloudflare — боттардан қорғау (Turnstile), сайтты жеткізу және поштаны бағыттау.",
              "Google Analytics және Google Tag Manager — кірулер статистикасы.",
              "Яндекс.Метрика — кірулер статистикасы, басулар картасы және Вебвизор. Вебвизор беттегі әрекеттерді жазады: курсордың қозғалысын, айналдыруды және басуларды. Жазбалар тек сайттың ыңғайлылығын талдау үшін пайдаланылады.",
            ],
          },
          {
            heading: "Біз деректерді қанша уақыт сақтаймыз",
            bullets: [
              "Жүктеп алынған файлдар серверден жасалғаннан кейін шамамен бір сағаттан соң автоматты түрде жойылады. Біз сіздің бейнелеріңіздің мұрағатын сақтамаймыз.",
              "Жүктеп алу әрекеттері туралы жазбалар теріс пайдаланушылыққа қарсы әрекет ету және өтініштерді қарау үшін қажет болғанша сақталады.",
              "Есептік жазба деректері сіз сервисті пайдаланып жүрген уақытта сақталады және сіздің сұрауыңыз бойынша жойылады.",
              "Сервер журналдары шектеулі уақыт сақталады және ротация барысында қайта жазылады.",
            ],
          },
          {
            heading: "Деректер қай жерде өңделеді",
            body: [
              "Сервистің серверлері Еуропалық одақ аумағындағы деректер орталығында орналасқан. Жоғарыда аталған жеткізушілердің бір бөлігі деректерді өз саясаттарына сәйкес оның шегінен тыс жерде өңдеуі мүмкін.",
            ],
          },
          {
            heading: "Сіздің құқықтарыңыз",
            body: [
              `Сіз өз деректеріңізді өңдеу туралы мәліметтер алуға, оларды түзетуді немесе жоюды талап етуге, келісіміңізді кері қайтарып алуға және өңдеуге қарсылық білдіруге құқылысыз. Ол үшін өтінішке байланысты пошта мекенжайынан немесе Telegram аккаунтынан ${MAIL} мекенжайына жазыңыз.`,
              "Біз ақылға қонымды мерзімде, әдетте отыз күнтізбелік күн ішінде жауап береміз. Есептік жазбаны жою онымен байланысты жүктеп алу тарихының жойылуына әкеп соғады.",
            ],
          },
          {
            heading: "Кәмелетке толмағандар",
            body: [
              "Сервис 16 жасқа толмаған балаларға арналмаған және оларға бағытталмаған. Біз мұндай пайдаланушылардың деректерін әдейі жинамаймыз; егер бұл қателікпен орын алса, бізге жазыңыз, деректер жойылады.",
            ],
          },
          {
            heading: "Өзгерістер",
            body: [
              "Біз осы Саясатты жаңартуымыз мүмкін. Өзекті редакцияның күні беттің басында көрсетілген; елеулі өзгерістерді біз сервисте атап көрсетеміз.",
            ],
          },
        ],
      },
      terms: {
        title: "Пайдаланушы келісімі",
        summary: `${operator.site} пайдалану ережелері: не істеуге болады, не істеуге болмайды және сервис қандай шарттарда жұмыс істейді.`,
        sections: [
          {
            heading: "Жалпы ережелер",
            body: [
              `Келісім ${operator.site} сайтын және ${BOT} Telegram-ботын пайдалануды реттейді. Сервистің иесі және әкімшісі — ${operator.nameKk}.`,
              "Сервисті пайдалана бастай отырып, сіз шарттарды оқығаныңызды және оларды қабылдайтыныңызды растайсыз. Егер қандай да бір шарт сізге сай келмесе, сервисті пайдаланбауыңыз керек.",
            ],
          },
          {
            heading: "Сервис тегін",
            body: [
              "Сервистің барлық мүмкіндіктері тегін ұсынылады. Бізде жазылымдар, ақылы тарифтер, бейненің ақылы сапалары және ішкі сатып алулар жоқ.",
              "Біз жарнама көрсетпейміз және серіктестік сілтемелерді орналастырмаймыз.",
            ],
          },
          {
            heading: "Қолжетімділік шарттары",
            bullets: [
              "Сайтта жүктеп алу үшін есептік жазба да, кіру де қажет емес. Бот пайдаланушыларды олардың Telegram аккаунты бойынша ажыратады.",
              "Сервисті шамадан тыс жүктемеден және автоматтандырылған теріс пайдаланудан сұраныстар жиілігіне қойылған техникалық шектеулер қорғайды.",
              "YouTube үшін тәуліктік трафик лимиті бар: сайтта және кеңейтімде бір желіден 24 сағатта 10 ГБ, ал ботта бір Telegram аккаунтына 24 сағатта 25 ГБ. Басқа платформаларға ол қатысты емес.",
              "Бот арқылы жүктеп алу үшін біздің арнаға жазылу талап етілмейді. Бот файлдардың сипаттамасына жобаның жаңалықтар арнасына сілтеме қосады; оған жазылу міндетті емес.",
            ],
          },
          {
            heading: "Сервис не істейді",
            body: [
              "Сервис техникалық делдал болып табылады: сіздің сілтемеңіз бойынша ол жалпыға қолжетімді бетке жүгінеді, медиафайлды алады және оны сізге береді.",
              "Біз өзімізде бейнелер каталогын орналастырмаймыз, басқалардың контенті бойынша іздеу жүргізбейміз және жүктеп алынған файлдарды беруге қажетті уақыттан — шамамен бір сағаттан ұзақ сақтамаймыз.",
              "Нақты платформаның қолжетімділігі оның техникалық шешімдеріне байланысты және ескертусіз өзгеруі мүмкін.",
            ],
          },
          {
            heading: "Пайдаланушының міндеттері",
            body: [
              "Алынған файлдарды қалай пайдаланатыныңыз үшін сіз дербес жауап бересіз және бұған құқығыңыз бар екенін растайсыз.",
            ],
            bullets: [
              "Құқықтары сізге тиесілі немесе пайдалануға құқық иесі не заң рұқсат еткен материалды ғана жүктеп алыңыз.",
              "Сервисті авторлық және сабақтас құқықтарды бұзу, тыйым салынған контентті тарату және үшінші тұлғалардың құқықтарын бұзу үшін пайдаланбаңыз.",
              "Сервистің техникалық шектеулерін, оның ішінде сұраныстар жиілігінің шектеулерін және боттарға тексерісті айналып өтуге әрекеттенбеңіз.",
              "Автоматтандырылған жүктеме жасамаңыз: жаппай сұраулар, скрипттер және парсерлер жол берілмейді.",
            ],
          },
          {
            heading: "Арнада сілтемелерді жариялау",
            body: [
              "Бот арқылы бейнені жүктеп ала отырып, сіз бастапқы жазбаға сілтеменің біздің Telegram-арнада жариялануымен келісесіз. Бұл туралы ескерту ботта сапаны таңдағанға дейін — яғни сіз жүктеп алу туралы шешім қабылдағанға дейін көрсетіледі.",
              "Жариялау анонимді: арнаға жалпыға қолжетімді бетке сілтеме, роликтің атауы және оның мұқабасы — платформа жазбаның превьюінде көрсететін дәл сол кадр жіберіледі. Бейнені кім жүктеп алғаны көрсетілмейді. Бейнефайлдың өзі ешқашан және еш жерде жарияланбайды: платформалардың өздері әр жазбаның астындағы «Бөлісу» батырмасымен таратуды ұсынатын сілтеме таратылады.",
              "Бір сілтеме бір реттен артық жарияланбайды. Егер сілтеменің арнаға түскенін қаламасаңыз, бұл бейнені біздің сервис арқылы жүктеп алмаңыз.",
              "Топтардағы сілтемелер және қосылған аккаунт арқылы жүктеп алынған жазбалар арнада жарияланбайды."
            ],
          },
          {
            heading: "Өз аккаунтыңызды қосу",
            body: [
              "Ботқа платформадағы өз аккаунтыңызды қоса отырып, сіз бұл сіздің аккаунтыңыз екенін және оған билік етуге құқығыңыз бар екенін растайсыз.",
              "Платформалар автоматты жүктеп алуларды құптамайды және қосылған аккаунтты шектеуі немесе бұғаттауы мүмкін. Бұл тәуекелді сіз өзіңізге аласыз; біз негізгі емес, бөлек аккаунтты қосуға кеңес береміз. Платформа сіздің аккаунтыңызға салатын шектеулер үшін біз жауап бермейміз.",
              "Топқа қосылған аккаунт оның барлық қатысушыларының жүктеп алулары үшін пайдаланылады. Аккаунттарды кім қоса алатынын топ әкімшілері шешеді және олар кез келгенін жоя алады.",
            ],
          },
          {
            heading: "Жауапкершілікті шектеу",
            body: [
              "Сервис «сол күйінде» шарттарымен ұсынылады. Біз үздіксіз жұмысқа, нақты платформаның қолжетімділігіне немесе файлдың сіздің мақсаттарыңызға жарамдылығына кепілдік бермейміз.",
              "Жүктеп алынған материалға қалай билік еткеніңіз үшін және сіздің үшінші тұлғалардың құқықтарын бұзуыңыздың салдары үшін біз жауапкершілік көтермейміз.",
              "Біз мүмкіндіктердің құрамын өзгертуге, қызмет көрсету үшін сервистің жұмысын тоқтата тұруға және оның жұмысын тоқтатуға құқылымыз.",
            ],
          },
          {
            heading: "Қолжетімділікті шектеу",
            body: [
              "Осы шарттар бұзылған кезде, шектеулерді айналып өтуге әрекеттенген кезде, сондай-ақ құқық иесінен негізделген шағым түскен кезде біз сервиске қолжетімділікті шектей немесе тоқтата аламыз.",
            ],
          },
          {
            heading: "Өзгерістер және қолданылатын құқық",
            body: [
              "Біз шарттарды өзгерте аламыз; қолданыстағы редакцияның күні беттің басында көрсетілген. Өзгерістерден кейін сервисті пайдалануды жалғастыра отырып, сіз жаңа редакцияны қабылдайсыз.",
              "Тараптардың қатынастарына Қазақстан Республикасының құқығы қолданылады. Тараптар дауларды хат алмасу арқылы реттеуге ұмтылады, ал келісімге қол жеткізілмеген жағдайда — Қазақстан Республикасының заңнамасында белгіленген тәртіппен.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie саясаты",
        summary: `${operator.site} қандай cookie файлдарын пайдаланады, олар не үшін қажет және олардан қалай бас тартуға болады.`,
        sections: [
          {
            heading: "Cookie деген не",
            body: [
              "Cookie — сайт сіздің браузеріңізде сақтайтын шағын мәтіндік файлдар. Олар сіздің баптауларыңызды есте сақтауға және кірулердің иесіздендірілген статистикасын жинауға мүмкіндік береді.",
              "Осы құжатта cookie-мен бірге ұқсас технологияларды да — браузердің жергілікті қоймасын және пиксель-есептегіштерді де сипаттаймыз.",
            ],
          },
          {
            heading: "Қажетті",
            body: [
              "Оларсыз сервис жұмыс істемейді, сондықтан олар әрдайым орнатылады.",
            ],
            bullets: [
              "Cloudflare Turnstile — сілтемені скрипт емес, адам жіберіп жатқанын тексеру.",
              "Интерфейс баптаулары — таңдалған тіл және безендіру тақырыбы.",
            ],
          },
          {
            heading: "Аналитикалық",
            body: [
              "Олар қандай беттер пайдаланылатынын және қай жерде қателер туындайтынын түсінуге көмектеседі. Сіздің келісіміңізбен орнатылады және сервистің жұмысы үшін міндетті емес.",
            ],
            bullets: [
              "Google Analytics және Google Tag Manager — иесіздендірілген түрдегі кірулер саны және сайттағы мінез-құлық.",
              "Яндекс.Метрика — кірулер саны, басулар картасы және Вебвизор.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Яндекс.Метриканың Вебвизоры беттегі әрекеттерді жазады: курсордың қозғалысын, айналдыруды, басуларды және сілтеме өрісіне енгізуді. Бұл интерфейстің қай жерде шатастыратынын көру үшін қажет.",
              "Біз бұл жазбаларды нақты адамдарды бақылау үшін пайдаланбаймыз. Сайттың өрістеріне сақталғанын қаламайтын мәліметтерді енгізбеңіз.",
            ],
          },
          {
            heading: "Қалай бас тартуға болады",
            bullets: [
              "Браузеріңізде cookie файлдарын бұғаттауды немесе жоюды баптаңыз — бұл тәсіл аталған барлық жүйелер үшін жұмыс істейді.",
              "Google Analytics: деректер жинауды өшіретін ресми браузер қосымшасы Google сайтында қолжетімді.",
              "Яндекс.Метрика: бас тарту Яндекстің ресми қосымшасы арқылы қолжетімді.",
              "Қажетті cookie файлдарын өшіру жүктеп алуды мүмкін етпейді.",
            ],
          },
          {
            heading: "Мерзімдер",
            body: [
              "Сессиялық cookie файлдары браузер жабылған кезде немесе сессия мерзімі өткенде жойылады. Аналитикалық есептегіштер идентификаторларды олардың жеткізушілері белгілеген мерзім ішінде сақтайды.",
            ],
          },
        ],
      },
      copyright: {
        title: "Құқық иелеріне",
        summary: "Сервистің авторлық құқық жөніндегі ұстанымы және құқық бұзушылыққа шағым беру тәртібі.",
        sections: [
          {
            heading: "Сервистің ұстанымы",
            body: [
              "Сервис өзінде бейнелерді орналастырмайды және олардың каталогын жүргізбейді. Ол техникалық делдал ретінде әрекет етеді: пайдаланушы енгізген сілтеме бойынша жалпыға қолжетімді бетке жүгінеді және файлды пайдаланушыға береді.",
              "Жүктеп алынған файлдар серверде шамамен бір сағат сақталады және автоматты түрде жойылады. Бізде басқалардың контентінің тұрақты көшірмесі қалмайды.",
              "Жүктеп алынған материалды пайдаланғаны үшін жауапкершілікті пайдаланушы көтереді — бұл Пайдаланушы келісімінде тікелей бекітілген.",
            ],
          },
          {
            heading: "Егер сіздің құқықтарыңыз бұзылса",
            body: [
              `Егер сіз құқық иесі немесе оның өкілі болсаңыз және сервис сіздің құқықтарыңызды бұзу үшін пайдаланылып жатыр деп есептесеңіз, ${MAIL} мекенжайына жазыңыз. Біз мұндай өтініштерді қарап, шаралар қолданамыз.`,
            ],
          },
          {
            heading: "Өтініште нені көрсету керек",
            bullets: [
              "Қандай туынды қозғалғанын және оған қандай негізде құқықтарыңыз бар екенін.",
              "Материалға сілтемені және, егер белгілі болса, бұзушылықтың мән-жайларын.",
              "Байланыс деректеріңізді: аты-жөніңізді немесе атауыңызды, мекенжайыңызды және электрондық пошта мекенжайыңызды.",
              "Егер сіз құқық иесінің атынан әрекет етсеңіз — өкілеттіктерді растайтын құжатты.",
              "Өтініштегі мәліметтердің дұрыс екені және материалды пайдалануға құқық иесі немесе заң рұқсат бермегені туралы мәлімдемені.",
            ],
          },
          {
            heading: "Біз не істейміз",
            body: [
              "Біз өтінішті ақылға қонымды мерзімде, әдетте отыз күнтізбелік күн ішінде қараймыз және бұзушылық расталған кезде сервис арқылы материалға қолжетімділікті, ал қажет болған жағдайда — бұзушының сервиске қолжетімділігін шектейміз.",
              "Қарау нәтижелері туралы сіз көрсеткен электрондық пошта мекенжайына хабарлаймыз.",
            ],
          },
          {
            heading: "Адал емес өтініштер",
            body: [
              "Көрінеу жалған мәліметтері бар өтініш заңнамаға сәйкес өтініш берушінің жауапкершілігіне әкеп соғуы мүмкін. Егер өтініш құқық иесін де, даулы материалды да анықтауға мүмкіндік бермесе, біз оны қараудан бас тартуға құқылымыз.",
            ],
          },
        ],
      },
    },
  },

  ar: {
    ui: {
      updated: "تاريخ آخر تحديث",
      back: "العودة إلى الصفحة الرئيسية",
      operatorHeading: "مشغّل الخدمة",
      navHeading: "وثائق أخرى",
      labels: {
        privacy: "سياسة الخصوصية",
        terms: "شروط الاستخدام",
        cookies: "سياسة ملفات تعريف الارتباط",
        copyright: "لأصحاب الحقوق",
      },
    },
    docs: {
      privacy: {
        title: "سياسة الخصوصية",
        summary: `ما البيانات التي يجمعها ${operator.site}، ولماذا يحتاج إليها، وكم مدة الاحتفاظ بها، وكيف يمكن حذفها.`,
        sections: [
          {
            heading: "أحكام عامة",
            body: [
              `تبيّن هذه السياسة البيانات الشخصية التي تعالجها خدمة ${operator.site} والغرض من معالجتها. والمتحكّم في البيانات (مشغّلها) هو ${operator.nameAr}.`,
              "باستخدامك الخدمة فإنك توافق على إجراءات المعالجة المبيّنة هنا. وإذا كنت لا توافق عليها، فيُرجى عدم استخدام الخدمة.",
              "تجري المعالجة وفقًا لقانون جمهورية كازاخستان «بشأن البيانات الشخصية وحمايتها»، ومع مراعاة متطلبات اللائحة العامة لحماية البيانات (GDPR) فيما يخص الزوار من المنطقة الاقتصادية الأوروبية.",
            ],
          },
          {
            heading: "البيانات التي نعالجها",
            body: [
              "نحن لا نجمع عن قصد أي بيانات تتجاوز ما تحتاج إليه الخدمة لأداء عملها، ولا نطلب وثائق هوية أو بيانات دفع أو عنوانًا.",
            ],
            bullets: [
              "بيانات حساب Telegram التي يتلقاها البوت عندما تراسله: المعرّف الرقمي، واسم المستخدم، والاسم الأول، ورمز اللغة.",
              "الروابط التي ترسلها للتنزيل، والمعلومات المتعلقة بمحاولة التنزيل ذاتها: المنصة، والتاريخ والوقت، والجودة المختارة، والنتيجة (نجاح أو خطأ).",
              "البيانات التقنية للاتصال: عنوان IP، ونوع المتصفح وإصداره، واللغة، والصفحة المُحيلة. وتُسجَّل هذه البيانات في سجلات الخادم وفي أنظمة تحليلات الويب.",
              "ملفات تعريف الارتباط (cookies) ومعرّفات التحليلات — للتفاصيل راجع سياسة ملفات تعريف الارتباط.",
            ],
          },
          {
            heading: "الغرض من هذه البيانات",
            bullets: [
              "تقديم الخدمة ذاتها: جلب الفيديو من الرابط الذي قدّمته وتسليمك الملف.",
              "تمييز حسابك عن حسابات الآخرين ومكافحة إساءة الاستخدام.",
              "حماية الخدمة من إساءة الاستخدام الآلية عبر التحقق بواسطة Cloudflare Turnstile قبل إرسال الرابط.",
              "فهم كيفية استخدام الموقع وإصلاح الأخطاء، وذلك من خلال إحصاءات مجهّلة الهوية ومجمّعة.",
              "الرد على استفساراتك واستفسارات أصحاب الحقوق.",
              "مراسلتك أحيانًا عبر Telegram لمعرفة رأيك في الخدمة — على سبيل المثال إذا توقفت عن استخدامها. والرد اختياري؛ وإذا كنت لا ترغب في تلقي مثل هذه الرسائل، فيكفي أن تخبرنا بذلك ولن نراسلك مجددًا.",
            ],
          },
          {
            heading: "الأسس القانونية للمعالجة",
            body: [
              "تُعالَج بيانات حساب Telegram ومعلومات التنزيلات لتنفيذ شروط الاستخدام التي تقبلها عند بدء استخدامك الخدمة.",
              "تُعالَج ملفات تعريف الارتباط الخاصة بالتحليلات وتسجيل الأنشطة على الموقع بناءً على موافقتك، التي يجوز لك سحبها في أي وقت — وطرق ذلك مبيّنة في سياسة ملفات تعريف الارتباط.",
              "تستند سجلات الخادم والحماية من البوتات إلى مصلحتنا المشروعة في الحفاظ على تشغيل الخدمة وأمنها.",
              "يستند سؤالك عن رأيك في الخدمة إلى مصلحتنا المشروعة في تحسينها؛ ويمكنك رفض ذلك في أي وقت.",
            ],
          },
          {
            heading: "الحسابات المرتبطة",
            body: [
              "يمكنك، إن رغبت، ربط حسابك على إحدى المنصات (Instagram وFacebook وYouTube وX وVK وTikTok) بالبوت كي يتمكن من تنزيل المنشورات التي لا يراها إلا المستخدمون المسجّلو الدخول: القصص (Stories) والمنشورات الخاصة. ولهذا الغرض يتلقى البوت ملفات تعريف الارتباط الخاصة بذلك الحساب — من إضافة Videoner عبر رمز يُستخدم مرة واحدة، أو من ملف ترسله أنت.",
              "نحتفظ بملفات تعريف الارتباط الخاصة بالمنصة المختارة فقط، ونتخلص من غيرها فورًا. وتُخزَّن مشفّرةً ولا تُستخدم إلا للتنزيلات في الموضع الذي ربطتها به. فملفات تعريف الارتباط المرتبطة في محادثتك الخاصة تخدم تنزيلاتك أنت، بما في ذلك روابطك الخاصة في المجموعات التي لم يُربط بها حساب خاص بها؛ ولا تُستخدم أبدًا لروابط الآخرين. أما ملفات تعريف الارتباط المرتبطة بمجموعة فتخدم تنزيلات أعضائها ولا تُستخدم في أي موضع آخر.",
              "الأساس القانوني هو موافقتك: فأنت من يربط الحساب بنفسه، ويمكنك إزالته في أي وقت بالأمر ‎/accounts. وعند الإزالة تُمحى ملفات تعريف الارتباط نهائيًا. وإذا توقفت المنصة عن قبول تسجيل الدخول، يُعلمك البوت بذلك.",
              "لا تُنشر المنشورات التي نُزّلت عبر حساب مرتبط في قناتنا، ولا تُقدَّم لمستخدمين آخرين من ذاكرة التخزين المؤقت المشتركة.",
            ],
          },
          {
            heading: "خدمات الأطراف الثالثة",
            body: [
              "نحن لا نبيع بياناتك ولا ننقلها إلى أطراف ثالثة لأغراضها الخاصة. وتعتمد الخدمة على مزوّدي الخدمات التالين، ويعالج كل منهم البيانات وفق قواعده الخاصة:",
            ],
            bullets: [
              `Telegram — تشغيل البوت ‎${BOT}.`,
              "Cloudflare — الحماية من البوتات (Turnstile)، وتقديم الموقع، وتوجيه البريد الإلكتروني.",
              "Google Analytics وGoogle Tag Manager — إحصاءات الزيارات.",
              "Yandex Metrica — إحصاءات الزيارات، وخريطة النقرات، وأداة Webvisor. تسجّل أداة Webvisor الأنشطة على الصفحة: حركة المؤشر، والتمرير، والنقرات. ولا تُستخدم التسجيلات إلا لتحليل سهولة استخدام الموقع.",
            ],
          },
          {
            heading: "مدة الاحتفاظ بالبيانات",
            bullets: [
              "تُحذف الملفات المنزّلة من الخادم تلقائيًا بعد نحو ساعة من إنشائها. ولا نحتفظ بأرشيف لمقاطع الفيديو الخاصة بك.",
              "يُحتفظ بسجلات محاولات التنزيل ما دام ذلك لازمًا لمكافحة إساءة الاستخدام ومعالجة الاستفسارات.",
              "يُحتفظ ببيانات الحساب ما دمت تستخدم الخدمة، وتُحذف بناءً على طلبك.",
              "يُحتفظ بسجلات الخادم لمدة محدودة، ويُكتب فوقها مع تدويرها.",
            ],
          },
          {
            heading: "مكان معالجة البيانات",
            body: [
              "تعمل الخدمة على خوادم في مركز بيانات يقع داخل الاتحاد الأوروبي. وقد يعالج بعض مزوّدي الخدمات المذكورين أعلاه البيانات خارجه وفقًا لسياساتهم الخاصة.",
            ],
          },
          {
            heading: "حقوقك",
            body: [
              `يحق لك الحصول على معلومات حول معالجة بياناتك، وطلب تصحيحها أو حذفها، وسحب موافقتك، والاعتراض على المعالجة. ولهذا الغرض راسلنا على ${MAIL} من عنوان البريد الإلكتروني أو حساب Telegram الذي يتعلق به الطلب.`,
              "نرد خلال مدة معقولة، تكون عادةً في غضون ثلاثين يومًا تقويميًا. ويترتب على حذف الحساب حذف سجل التنزيلات المرتبط به.",
            ],
          },
          {
            heading: "القاصرون",
            body: [
              "الخدمة ليست مخصصة للأطفال دون سن 16 عامًا ولا موجّهة إليهم. ولا نجمع بياناتهم عن قصد؛ وإذا حدث ذلك عن طريق الخطأ، فراسلنا وستُحذف البيانات.",
            ],
          },
          {
            heading: "التعديلات",
            body: [
              "يجوز لنا تحديث هذه السياسة. ويظهر تاريخ النسخة السارية في أعلى الصفحة، وسننبّه إلى التغييرات الجوهرية داخل الخدمة.",
            ],
          },
        ],
      },
      terms: {
        title: "شروط الاستخدام",
        summary: `قواعد استخدام ${operator.site}: ما هو مسموح، وما هو غير مسموح، والشروط التي تعمل الخدمة بموجبها.`,
        sections: [
          {
            heading: "أحكام عامة",
            body: [
              `تنظّم هذه الشروط استخدام الموقع ${operator.site} وبوت Telegram ‎${BOT}. ومالك الخدمة ومديرها هو ${operator.nameAr}.`,
              "ببدء استخدامك الخدمة، فإنك تؤكد أنك قرأت هذه الشروط وتقبلها. وإذا كان أي شرط منها لا يناسبك، فلا ينبغي لك استخدام الخدمة.",
            ],
          },
          {
            heading: "الخدمة مجانية",
            body: [
              "جميع ما تقدّمه الخدمة متاح مجانًا. فلا توجد اشتراكات، ولا خطط مدفوعة، ولا مستويات جودة فيديو مدفوعة، ولا مشتريات داخل الخدمة.",
              "لا نعرض إعلانات ولا ننشر روابط تسويق بالعمولة.",
            ],
          },
          {
            heading: "شروط الوصول",
            bullets: [
              "لا يتطلب التنزيل على الموقع حسابًا ولا تسجيل دخول. ويميّز البوت بين المستخدمين من خلال حساباتهم على Telegram.",
              "تحمي القيود التقنية على معدّل الطلبات الخدمةَ من الحمل الزائد ومن إساءة الاستخدام الآلية.",
              "تخضع تنزيلات YouTube لحدّ يومي لحجم البيانات: 10 GB لكل 24 ساعة لكل شبكة على الموقع وفي الإضافة، و25 GB لكل 24 ساعة لكل حساب Telegram في البوت. ولا يسري هذا الحد على المنصات الأخرى.",
              "لا يُشترط الاشتراك في قناتنا للتنزيل عبر البوت. ويضيف البوت إلى تعليقات الملفات رابطًا إلى قناة أخبار المشروع؛ والاشتراك فيها اختياري.",
            ],
          },
          {
            heading: "ما تقوم به الخدمة",
            body: [
              "تعمل الخدمة بوصفها وسيطًا تقنيًا: فهي تتبع الرابط الذي تقدّمه، وتصل إلى صفحة متاحة للعموم، وتحصل على الملف الوسائطي وتنقله إليك.",
              "لا نستضيف كتالوجًا لمقاطع الفيديو، ولا نُجري بحثًا في محتوى الآخرين، ولا نحتفظ بالملفات المنزّلة لمدة تتجاوز ما يلزم لتسليمها — أي نحو ساعة.",
              "يتوقف عمل منصة بعينها على القرارات التقنية لتلك المنصة، وقد يتغير دون إشعار مسبق.",
            ],
          },
          {
            heading: "التزامات المستخدم",
            body: [
              "تتحمّل وحدك المسؤولية عن كيفية استخدامك للملفات التي تحصل عليها، وتؤكد أنه يحق لك ذلك.",
            ],
            bullets: [
              "لا تنزّل إلا المواد التي تملك حقوقها، أو التي يأذن صاحب الحقوق أو القانون باستخدامها.",
              "لا تستخدم الخدمة لانتهاك حقوق المؤلف أو الحقوق المجاورة، أو لنشر محتوى محظور، أو لانتهاك حقوق الغير.",
              "لا تحاول التحايل على القيود التقنية للخدمة، بما في ذلك قيود معدّل الطلبات والتحقق من البوتات.",
              "لا تُنشئ حملًا آليًا: فالطلبات الجماعية والبرامج النصية وأدوات استخراج البيانات غير مسموح بها.",
            ],
          },
          {
            heading: "نشر الروابط في القناة",
            body: [
              "بتنزيلك مقطع فيديو عبر البوت، فإنك توافق على نشر رابط المنشور الأصلي في قناتنا على Telegram. ويُعرض تنبيه بذلك في البوت قبل اختيار الجودة — أي قبل أن تتخذ قرار التنزيل.",
              "النشر مجهول الهوية: إذ تتلقى القناة رابط الصفحة المتاحة للعموم، وعنوان المقطع، وصورة غلافه — وهي اللقطة ذاتها التي تعرضها المنصة في معاينة منشورها. ولا يُذكر من قام بالتنزيل. ولا يُنشر ملف الفيديو نفسه في أي مكان على الإطلاق: فما يُتداول هو الرابط، الذي تدعو المنصات نفسها إلى تداوله عبر زر «مشاركة» أسفل كل منشور.",
              "لا يُنشر الرابط الواحد أكثر من مرة واحدة. وإذا كنت لا ترغب في أن يصل رابط ما إلى القناة، فلا تنزّل ذلك المقطع عبر خدمتنا.",
              "لا تُنشر في القناة أبدًا الروابط الواردة من المجموعات ولا المنشورات التي نُزّلت عبر حساب مرتبط.",
            ],
          },
          {
            heading: "ربط حسابك",
            body: [
              "بربطك حسابك على إحدى المنصات بالبوت، فإنك تؤكد أن هذا الحساب حسابك وأنه يحق لك التصرف فيه على هذا النحو.",
              "لا تقرّ المنصات التنزيلات الآلية، وقد تقيّد الحساب المرتبط أو تحظره. وأنت تتحمّل هذه المخاطرة؛ وننصح بربط حساب ثانوي لا حسابك الرئيسي. ولسنا مسؤولين عن القيود التي تفرضها المنصة على حسابك.",
              "يُستخدم الحساب المرتبط بمجموعة لتنزيلات جميع أعضائها. ويقرر مشرفو المجموعة من يجوز له ربط الحسابات، ويمكنهم إزالة أي منها.",
            ],
          },
          {
            heading: "حدود المسؤولية",
            body: [
              "تُقدَّم الخدمة «كما هي». ولا نضمن تشغيلها دون انقطاع، ولا توافر منصة بعينها، ولا ملاءمة الملف لأغراضك.",
              "لسنا مسؤولين عمّا تفعله بالمواد التي تنزّلها، ولا عن عواقب انتهاكك لحقوق الغير.",
              "يحق لنا تغيير ما تقدّمه الخدمة، وتعليق عملها لأغراض الصيانة، وإنهاء عملها.",
            ],
          },
          {
            heading: "تقييد الوصول",
            body: [
              "يجوز لنا تقييد الوصول إلى الخدمة أو إنهاؤه في حال مخالفة هذه الشروط، أو محاولة التحايل على القيود، أو ورود شكوى مسبّبة من صاحب حقوق.",
            ],
          },
          {
            heading: "التعديلات والقانون الواجب التطبيق",
            body: [
              "يجوز لنا تعديل هذه الشروط؛ ويظهر تاريخ النسخة السارية في أعلى الصفحة. ويُعدّ استمرارك في استخدام الخدمة بعد التعديل قبولًا منك للنسخة الجديدة.",
              "تخضع العلاقات بين الطرفين لقانون جمهورية كازاخستان. ويسعى الطرفان إلى تسوية النزاعات بالمراسلة، وفي حال تعذّر الاتفاق، وفقًا للإجراءات المنصوص عليها في تشريعات جمهورية كازاخستان.",
            ],
          },
        ],
      },
      cookies: {
        title: "سياسة ملفات تعريف الارتباط",
        summary: `ملفات تعريف الارتباط التي يستخدمها ${operator.site}، والغرض منها، وكيفية رفضها.`,
        sections: [
          {
            heading: "ما هي ملفات تعريف الارتباط",
            body: [
              "ملفات تعريف الارتباط (cookies) هي ملفات نصية صغيرة يحفظها الموقع في متصفحك. وهي تتيح للخدمة تذكّر إعداداتك وجمع إحصاءات زيارات مجهّلة الهوية.",
              "إلى جانب ملفات تعريف الارتباط، تتناول هذه الوثيقة أيضًا التقنيات المشابهة: التخزين المحلي للمتصفح وبكسلات التتبع.",
            ],
          },
          {
            heading: "الضرورية",
            body: [
              "لا تعمل الخدمة بدونها، ولذلك تُضبط دائمًا.",
            ],
            bullets: [
              "Cloudflare Turnstile — للتحقق من أن الرابط يرسله إنسان لا برنامج نصي.",
              "إعدادات الواجهة — اللغة التي اخترتها ونمط الألوان.",
            ],
          },
          {
            heading: "التحليلية",
            body: [
              "تساعدنا على معرفة الصفحات المستخدمة والمواضع التي تحدث فيها الأخطاء. وتُضبط بموافقتك وليست لازمة لعمل الخدمة.",
            ],
            bullets: [
              "Google Analytics وGoogle Tag Manager — حركة الزيارات والسلوك على الموقع بصورة مجهّلة الهوية.",
              "Yandex Metrica — حركة الزيارات، وخريطة النقرات، وأداة Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "تسجّل أداة Webvisor التابعة لـ Yandex Metrica الأنشطة على الصفحة: حركة المؤشر، والتمرير، والنقرات، والإدخال في حقل الرابط. والغرض من ذلك معرفة المواضع التي تُربك فيها الواجهةُ المستخدمين.",
              "لا نستخدم هذه التسجيلات لتتبّع أشخاص بعينهم. ويُرجى عدم إدخال أي معلومات في حقول الموقع لا ترغب في حفظها.",
            ],
          },
          {
            heading: "كيفية الرفض",
            bullets: [
              "اضبط حظر ملفات تعريف الارتباط أو حذفها في إعدادات متصفحك — تصلح هذه الطريقة لجميع الأنظمة المذكورة هنا.",
              "Google Analytics: تتوفر لدى Google الإضافة الرسمية للمتصفح التي تعطّل جمع البيانات.",
              "Yandex Metrica: يمكن إلغاء الاشتراك عبر الإضافة الرسمية من Yandex.",
              "يؤدي تعطيل ملفات تعريف الارتباط الضرورية إلى تعذّر التنزيل.",
            ],
          },
          {
            heading: "مدة الاحتفاظ",
            body: [
              "تُحذف ملفات تعريف الارتباط الخاصة بالجلسة عند إغلاق المتصفح أو عند انتهاء الجلسة. وتحتفظ أدوات التحليلات بمعرّفاتها للمدد التي يحددها مزوّدوها.",
            ],
          },
        ],
      },
      copyright: {
        title: "لأصحاب الحقوق",
        summary: "موقف الخدمة من حقوق المؤلف وإجراءات تقديم شكوى بشأن انتهاكها.",
        sections: [
          {
            heading: "موقف الخدمة",
            body: [
              "لا تستضيف الخدمة مقاطع فيديو ولا تحتفظ بكتالوج لها. وهي تعمل بوصفها وسيطًا تقنيًا: إذ تتبع الرابط الذي يُدخله المستخدم، وتصل إلى صفحة متاحة للعموم، وتنقل الملف إلى ذلك المستخدم.",
              "تبقى الملفات المنزّلة على الخادم نحو ساعة ثم تُحذف تلقائيًا. ولا تبقى لدينا أي نسخة دائمة من محتوى الآخرين.",
              "يتحمّل المستخدم المسؤولية عن استخدام المواد المنزّلة، وهو ما تنص عليه شروط الاستخدام صراحةً.",
            ],
          },
          {
            heading: "إذا انتُهكت حقوقك",
            body: [
              `إذا كنت صاحب حقوق أو ممثلًا عنه وترى أن الخدمة تُستخدم لانتهاك حقوقك، فراسلنا على ${MAIL}. ونحن ندرس هذه الشكاوى ونتخذ الإجراءات اللازمة بشأنها.`,
            ],
          },
          {
            heading: "ما يجب تضمينه في الشكوى",
            bullets: [
              "المصنَّف المعني، والأساس الذي تستند إليه في امتلاك الحقوق عليه.",
              "رابط المادة، وملابسات الانتهاك إن كانت معروفة.",
              "بيانات الاتصال الخاصة بك: الاسم أو التسمية التجارية، والعنوان، وعنوان البريد الإلكتروني.",
              "إذا كنت تتصرف نيابةً عن صاحب الحقوق — ما يثبت صلاحياتك.",
              "إقرار بأن المعلومات الواردة في الشكوى صحيحة، وبأن استخدام المادة غير مأذون به من صاحب الحقوق أو بموجب القانون.",
            ],
          },
          {
            heading: "ما سنقوم به",
            body: [
              "ندرس الشكوى خلال مدة معقولة، تكون عادةً في غضون ثلاثين يومًا تقويميًا، وعند ثبوت الانتهاك نقيّد الوصول إلى المادة عبر الخدمة، وعند الاقتضاء نقيّد وصول المنتهِك إلى الخدمة.",
              "سنبلغك بنتيجة الدراسة على عنوان البريد الإلكتروني الذي قدّمته.",
            ],
          },
          {
            heading: "الشكاوى الكيدية",
            body: [
              "قد تترتب على الشكوى التي تتضمن معلومات يُعلم بعدم صحتها مسؤوليةُ مقدّمها وفقًا للتشريعات المعمول بها. ويحق لنا رفض النظر في الشكوى إذا لم تتح تحديد صاحب الحقوق ولا المادة المتنازع عليها.",
            ],
          },
        ],
      },
    },
  },
  zh: {
    ui: {
      updated: "版本日期",
      back: "返回首页",
      operatorHeading: "服务运营者",
      navHeading: "其他文件",
      labels: {
        privacy: "隐私政策",
        terms: "用户协议",
        cookies: "Cookie 政策",
        copyright: "致权利人",
      },
    },
    docs: {
      privacy: {
        title: "隐私政策",
        summary: `${operator.site} 收集哪些数据、为何需要这些数据、保存多长时间以及如何删除。`,
        sections: [
          {
            heading: "总则",
            body: [
              `本政策说明 ${operator.site} 服务处理哪些个人数据以及处理目的。数据运营者为${operator.nameZh}。`,
              "使用本服务即表示您同意本政策所述的处理方式。如您不同意，请勿使用本服务。",
              "数据处理依照哈萨克斯坦共和国《个人数据及其保护法》进行；对于来自欧洲经济区的访问者，同时考虑《通用数据保护条例》（GDPR）的要求。",
            ],
          },
          {
            heading: "我们处理哪些数据",
            body: [
              "我们有意不收集超出服务运行所必需范围的任何数据，也不索取身份证件、支付信息或地址。",
            ],
            bullets: [
              "您向机器人发送消息时，机器人获取的 Telegram 账户数据：数字标识符、用户名、名字及语言代码。",
              "您提交下载的链接以及该次下载尝试的相关信息：平台、日期和时间、所选画质、结果（成功或出错）。",
              "连接的技术数据：IP 地址、浏览器类型及版本、语言、来源页面。这些数据会进入服务器日志和网站分析系统。",
              "Cookie 及分析标识符——详见《Cookie 政策》。",
            ],
          },
          {
            heading: "为何需要这些数据",
            bullets: [
              "提供服务本身：根据您提供的链接获取视频并将文件交付给您。",
              "区分您的账户与他人的账户，并防范滥用行为。",
              "保护服务免受自动化滥用：在提交链接前进行 Cloudflare Turnstile 验证。",
              "了解网站的使用情况并排除错误——使用去标识化的汇总统计数据。",
              "答复您的询问以及权利人的投诉。",
              "偶尔通过 Telegram 联系您，了解您对本服务的看法，例如在您停止使用本服务时。您可以不予回复；如您不希望收到此类消息，只需告知我们，我们将不再联系您。",
            ],
          },
          {
            heading: "处理依据",
            body: [
              "Telegram 账户数据及下载记录的处理是为了履行《用户协议》，您开始使用本服务即表示接受该协议。",
              "分析类 Cookie 及网站操作记录的处理以您的同意为依据，您可随时撤回同意——具体方式见《Cookie 政策》。",
              "服务器日志及机器人防护的处理基于我们维持服务正常运行和安全的合法利益。",
              "询问您对本服务的看法基于我们改进服务的合法利益；您可随时拒绝此类询问。",
            ],
          },
          {
            heading: "已关联的账户",
            body: [
              "您可以自愿将您在某平台（Instagram、Facebook、YouTube、X、VK、TikTok）上的账户关联至机器人，以便机器人下载仅登录用户可见的内容：快拍（Stories）、非公开发布内容。为此，机器人会获取该账户的 Cookie——通过一次性代码从 Videoner 扩展程序获取，或从您发送的文件中获取。",
              "我们仅保存所选平台的 Cookie，其余 Cookie 立即丢弃。这些 Cookie 以加密形式存储，仅用于您所关联范围内的下载。在私聊中关联的 Cookie 用于您本人的下载，包括您在未关联自有账户的群组中发送的您本人的链接；不用于他人发送的链接。关联至群组的 Cookie 仅用于该群组成员的下载，不作他用。",
              "处理依据为您的同意：账户由您自行关联，您可随时通过 /accounts 命令将其删除。删除后，Cookie 将被不可恢复地清除。如平台不再接受该登录，机器人会通知您。",
              "通过已关联账户下载的内容不会发布在我们的频道中，也不会从公共缓存中提供给其他用户。",
            ],
          },
          {
            heading: "第三方服务",
            body: [
              "我们不出售您的数据，也不为第三方自身目的向其转让您的数据。本服务的运行涉及以下服务提供者，各提供者依照其自身规则处理数据：",
            ],
            bullets: [
              `Telegram——${BOT} 机器人的运行。`,
              "Cloudflare——机器人防护（Turnstile）、网站内容分发及邮件路由。",
              "Google Analytics 和 Google Tag Manager——访问统计。",
              "Yandex Metrica——访问统计、点击热图及 Webvisor。Webvisor 记录页面上的操作：指针移动、滚动和点击。相关记录仅用于分析网站的易用性。",
            ],
          },
          {
            heading: "数据保存期限",
            bullets: [
              "下载的文件在生成后约一小时内从服务器自动删除。我们不保存您的视频存档。",
              "下载尝试记录在防范滥用和处理投诉所需的期限内保存。",
              "账户数据在您使用本服务期间保存，并可应您的请求删除。",
              "服务器日志保存有限时间，并随日志轮转被覆盖。",
            ],
          },
          {
            heading: "数据处理地点",
            body: [
              "本服务的服务器位于欧洲联盟境内的数据中心。上文所列的部分服务提供者可能依照其自身政策在欧盟境外处理数据。",
            ],
          },
          {
            heading: "您的权利",
            body: [
              `您有权获取有关您的数据处理情况的信息，要求更正或删除您的数据，撤回同意，以及反对数据处理。为此，请使用与该请求相关的电子邮箱或 Telegram 账户发送邮件至 ${MAIL}。`,
              "我们将在合理期限内答复，通常为三十个日历日内。删除账户将同时删除与其关联的下载历史。",
            ],
          },
          {
            heading: "未成年人",
            body: [
              "本服务并非为未满 16 周岁的儿童设计，也不以其为对象。我们不会有意收集此类用户的数据；如因失误收集了此类数据，请联系我们，相关数据将被删除。",
            ],
          },
          {
            heading: "政策变更",
            body: [
              "我们可能更新本政策。现行版本的日期标注于页面顶部；如有重大变更，我们将在服务中予以提示。",
            ],
          },
        ],
      },
      terms: {
        title: "用户协议",
        summary: `${operator.site} 的使用规则：允许什么、禁止什么，以及本服务的运行条件。`,
        sections: [
          {
            heading: "总则",
            body: [
              `本协议规范 ${operator.site} 网站及 Telegram 机器人 ${BOT} 的使用。本服务的所有者和管理者为${operator.nameZh}。`,
              "开始使用本服务即表示您确认已阅读并接受本协议条款。如任何条款不适合您，请勿使用本服务。",
            ],
          },
          {
            heading: "本服务免费",
            body: [
              "本服务的全部功能均免费提供。我们没有订阅、付费套餐、付费视频画质或内购项目。",
              "我们不展示广告，也不放置推广（联盟）链接。",
            ],
          },
          {
            heading: "使用条件",
            bullets: [
              "在网站上下载无需账户，也无需登录。机器人根据用户的 Telegram 账户区分用户。",
              "本服务通过对请求频率的技术限制，防止过载和自动化滥用。",
              "YouTube 下载设有每日流量限额：在网站和扩展程序中，每个网络每 24 小时 10 GB；在机器人中，每个 Telegram 账户每 24 小时 25 GB。其他平台不受此限。",
              "通过机器人下载无需订阅我们的频道。机器人会在文件说明中附上项目新闻频道的链接；是否订阅该频道由您自行决定。",
            ],
          },
          {
            heading: "本服务的功能",
            body: [
              "本服务是技术中介：根据您提供的链接访问公开可访问的页面，获取媒体文件并将其传送给您。",
              "我们不托管视频目录，不对他人内容进行检索，下载的文件保存时间不超过传送所需的时间——约一小时。",
              "特定平台能否使用取决于该平台的技术决策，可能在不另行通知的情况下发生变化。",
            ],
          },
          {
            heading: "用户义务",
            body: [
              "您自行对所获取文件的使用方式负责，并确认您有权如此使用。",
            ],
            bullets: [
              "仅下载您享有权利的内容，或经权利人许可或法律允许使用的内容。",
              "不得利用本服务侵犯著作权及相关权利、传播违禁内容或侵犯第三方权利。",
              "不得试图规避本服务的技术限制，包括请求频率限制和机器人验证。",
              "不得制造自动化负载：禁止批量请求、脚本和爬虫程序。",
            ],
          },
          {
            heading: "在频道中发布链接",
            body: [
              "通过机器人下载视频，即表示您同意原帖子的链接将发布在我们的 Telegram 频道中。有关提示会在您选择画质之前，即在您决定下载之前，显示在机器人中。",
              "发布是匿名的：发布到频道的内容为公开可访问页面的链接、视频标题及其封面——即平台在帖子预览中显示的同一帧画面。不会注明下载者身份。视频文件本身在任何时候、任何地方均不会被发布：传播的仅是链接，而平台自身也通过每个帖子下方的“分享”按钮鼓励传播该链接。",
              "同一链接最多发布一次。如您不希望某一链接出现在频道中，请勿通过本服务下载该视频。",
              "来自群组的链接以及通过已关联账户下载的内容不会发布在频道中。",
            ],
          },
          {
            heading: "关联您的账户",
            body: [
              "将您在某平台上的账户关联至机器人，即表示您确认该账户为您本人所有，且您有权处置该账户。",
              "各平台不认可自动化下载，可能限制或封禁已关联的账户。该风险由您自行承担；我们建议关联一个单独的非主要账户。对于平台对您的账户施加的限制，我们不承担责任。",
              "关联至群组的账户将用于该群组全体成员的下载。群组管理员决定谁可以关联账户，并可删除其中任何账户。",
            ],
          },
          {
            heading: "责任限制",
            body: [
              "本服务按“现状”提供。我们不保证服务不间断运行、特定平台的可用性，或文件适合您的用途。",
              "对于您如何处置所下载的内容，以及您侵犯第三方权利所产生的后果，我们不承担责任。",
              "我们有权变更服务功能、为维护而暂停服务以及终止服务。",
            ],
          },
          {
            heading: "限制访问",
            body: [
              "如您违反本协议条款、试图规避限制，或我们收到权利人有理有据的投诉，我们可以限制或终止您对本服务的访问。",
            ],
          },
          {
            heading: "协议变更及适用法律",
            body: [
              "我们可以变更本协议条款；现行版本的日期标注于页面顶部。变更后继续使用本服务，即表示您接受新版本。",
              "双方之间的关系适用哈萨克斯坦共和国法律。双方应力求通过书面往来解决争议；协商不成的，按照哈萨克斯坦共和国法律规定的程序解决。",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie 政策",
        summary: `${operator.site} 使用哪些 Cookie、其用途以及如何拒绝。`,
        sections: [
          {
            heading: "什么是 Cookie",
            body: [
              "Cookie 是网站保存在您浏览器中的小型文本文件。它们可用于记住您的设置，并收集去标识化的访问统计数据。",
              "除 Cookie 外，本文件还涵盖相关技术——浏览器本地存储和统计像素（跟踪像素）。",
            ],
          },
          {
            heading: "必要 Cookie",
            body: ["缺少这些 Cookie，本服务将无法运行，因此它们始终会被设置。"],
            bullets: [
              "Cloudflare Turnstile——验证提交链接的是真人而非脚本。",
              "界面设置——您所选择的语言和界面主题。",
            ],
          },
          {
            heading: "分析类 Cookie",
            body: [
              "这些 Cookie 帮助我们了解哪些页面被使用以及何处出现错误。它们经您同意后设置，并非本服务运行所必需。",
            ],
            bullets: [
              "Google Analytics 和 Google Tag Manager——以去标识化形式统计访问量和网站上的行为。",
              "Yandex Metrica——访问量、点击热图及 Webvisor。",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica 的 Webvisor 记录页面上的操作：指针移动、滚动、点击以及在链接输入框中的输入。其目的是发现界面中容易令人困惑之处。",
              "我们不利用这些记录追踪特定个人。请勿在网站的输入框中输入您不希望被保存的信息。",
            ],
          },
          {
            heading: "如何拒绝",
            bullets: [
              "在浏览器中设置阻止或删除 Cookie——此方法适用于上述所有系统。",
              "Google Analytics：可在 Google 网站获取用于停用数据收集的官方浏览器插件。",
              "Yandex Metrica：可通过 Yandex 的官方插件选择退出。",
              "停用必要 Cookie 将导致无法下载。",
            ],
          },
          {
            heading: "保存期限",
            body: [
              "会话 Cookie 在关闭浏览器或会话到期时删除。分析工具在其提供者规定的期限内保存标识符。",
            ],
          },
        ],
      },
      copyright: {
        title: "致权利人",
        summary: "本服务关于著作权的立场以及侵权投诉的提交程序。",
        sections: [
          {
            heading: "本服务的立场",
            body: [
              "本服务不托管视频，也不建立视频目录。本服务是技术中介：根据用户输入的链接访问公开可访问的页面，并将文件传送给该用户。",
              "下载的文件在服务器上保存约一小时后自动删除。我们不保留他人内容的永久副本。",
              "所下载内容的使用责任由用户承担——《用户协议》对此有明确规定。",
            ],
          },
          {
            heading: "如您的权利受到侵犯",
            body: [
              `如您是权利人或其代表，并认为本服务被用于侵犯您的权利，请发送邮件至 ${MAIL}。我们会审查此类投诉并采取相应措施。`,
            ],
          },
          {
            heading: "投诉应包含的内容",
            bullets: [
              "涉及哪一作品，以及您对该作品享有权利的依据。",
              "相关内容的链接，以及（如已知）侵权情况。",
              "您的联系方式：姓名或名称、地址及电子邮箱地址。",
              "如您代表权利人行事——授权证明。",
              "关于投诉所载信息真实，且相关内容的使用未经权利人许可或法律允许的声明。",
            ],
          },
          {
            heading: "我们将采取的措施",
            body: [
              "我们将在合理期限内审查投诉，通常为三十个日历日内；如侵权属实，我们将限制通过本服务访问相关内容，必要时限制侵权人对本服务的访问。",
              "我们将把审查结果发送至您提供的电子邮箱地址。",
            ],
          },
          {
            heading: "恶意投诉",
            body: [
              "含有明知虚假信息的投诉，可能导致投诉人依法承担责任。如投诉既无法确定权利人，也无法确定争议内容，我们有权拒绝审查。",
            ],
          },
        ],
      },
    },
  },
  hi: {
    ui: {
      updated: "अंतिम अद्यतन",
      back: "मुख्य पृष्ठ पर लौटें",
      operatorHeading: "सेवा संचालक",
      navHeading: "अन्य दस्तावेज़",
      labels: {
        privacy: "गोपनीयता नीति",
        terms: "उपयोग की शर्तें",
        cookies: "कुकी नीति",
        copyright: "कॉपीराइट धारकों के लिए",
      },
    },
    docs: {
      privacy: {
        title: "गोपनीयता नीति",
        summary: `${operator.site} कौन-सा डेटा एकत्र करता है, उसकी आवश्यकता क्यों है, उसे कितने समय तक रखा जाता है और उसे कैसे हटवाया जा सकता है।`,
        sections: [
          {
            heading: "सामान्य प्रावधान",
            body: [
              `यह नीति बताती है कि ${operator.site} सेवा कौन-सा व्यक्तिगत डेटा (personal data) संसाधित करती है और किस उद्देश्य से। डेटा नियंत्रक (data controller) ${operator.nameHi} है।`,
              "सेवा का उपयोग करके आप यहाँ वर्णित प्रसंस्करण से सहमति देते हैं। यदि आप इससे सहमत नहीं हैं, तो कृपया सेवा का उपयोग न करें।",
              "प्रसंस्करण कज़ाखस्तान गणराज्य के कानून «व्यक्तिगत डेटा और उसकी सुरक्षा के बारे में» के अनुसार किया जाता है, और यूरोपीय आर्थिक क्षेत्र (European Economic Area) के आगंतुकों के संबंध में GDPR की आवश्यकताओं को ध्यान में रखते हुए।",
            ],
          },
          {
            heading: "हम कौन-सा डेटा संसाधित करते हैं",
            body: [
              "हम जान-बूझकर सेवा के संचालन के लिए आवश्यक डेटा से अधिक कुछ भी एकत्र नहीं करते, और पहचान दस्तावेज़, भुगतान विवरण या पता कभी नहीं माँगते।",
            ],
            bullets: [
              "Telegram खाते का डेटा, जो बॉट को तब प्राप्त होता है जब आप उसे संदेश भेजते हैं: संख्यात्मक पहचानकर्ता (id), उपयोगकर्ता नाम (username), नाम और भाषा कोड।",
              "डाउनलोड के लिए आपके द्वारा भेजे गए लिंक और स्वयं प्रयास से जुड़ी जानकारी: प्लेटफ़ॉर्म, तारीख और समय, चुनी गई गुणवत्ता, और परिणाम (सफलता या त्रुटि)।",
              "कनेक्शन का तकनीकी डेटा: IP पता, ब्राउज़र का प्रकार और संस्करण, भाषा और वह पृष्ठ जिससे आप आए (referring page)। यह डेटा सर्वर लॉग और वेब एनालिटिक्स प्रणालियों में दर्ज होता है।",
              "कुकी (cookies) और एनालिटिक्स पहचानकर्ता — विवरण के लिए कुकी नीति देखें।",
            ],
          },
          {
            heading: "इस डेटा की आवश्यकता क्यों है",
            bullets: [
              "स्वयं सेवा प्रदान करने के लिए: आपके लिंक से वीडियो प्राप्त करना और आपको फ़ाइल देना।",
              "आपके खाते को दूसरों के खातों से अलग पहचानने और दुरुपयोग रोकने के लिए।",
              "स्वचालित दुरुपयोग से सेवा की रक्षा के लिए: लिंक भेजने से पहले Cloudflare Turnstile जाँच।",
              "यह समझने के लिए कि साइट का उपयोग कैसे होता है, और त्रुटियाँ ठीक करने के लिए — अनामीकृत (anonymised) और समेकित (aggregated) आँकड़ों के माध्यम से।",
              "आपके और कॉपीराइट धारकों के अनुरोधों का उत्तर देने के लिए।",
              "कभी-कभार Telegram पर आपको संदेश भेजकर सेवा के बारे में आपकी राय जानने के लिए — उदाहरण के लिए, यदि आपने उसका उपयोग बंद कर दिया है। उत्तर देना अनिवार्य नहीं है; यदि आप ऐसे संदेश नहीं चाहते, तो बस हमें बता दें, और हम फिर नहीं लिखेंगे।",
            ],
          },
          {
            heading: "प्रसंस्करण के कानूनी आधार",
            body: [
              "Telegram खाते का डेटा और डाउनलोड से जुड़ी जानकारी उपयोग की शर्तों के निष्पादन के लिए संसाधित की जाती है, जिन्हें आप सेवा का उपयोग शुरू करते ही स्वीकार करते हैं।",
              "एनालिटिक्स कुकी और साइट पर गतिविधियों की रिकॉर्डिंग आपकी सहमति के आधार पर संसाधित की जाती हैं, जिसे आप किसी भी समय वापस ले सकते हैं — तरीके कुकी नीति में बताए गए हैं।",
              "सर्वर लॉग और बॉट से सुरक्षा सेवा को कार्यशील और सुरक्षित बनाए रखने के हमारे वैध हित (legitimate interest) के अंतर्गत संसाधित किए जाते हैं।",
              "सेवा के बारे में आपकी राय पूछना सेवा को बेहतर बनाने के हमारे वैध हित के अंतर्गत होता है; आप किसी भी समय इससे इनकार कर सकते हैं।",
            ],
          },
          {
            heading: "कनेक्ट किए गए खाते",
            body: [
              "आप चाहें तो किसी प्लेटफ़ॉर्म (Instagram, Facebook, YouTube, X, VK, TikTok) पर अपना खाता बॉट से कनेक्ट कर सकते हैं, ताकि बॉट वे पोस्ट डाउनलोड कर सके जो केवल लॉग-इन किए हुए उपयोगकर्ताओं को दिखती हैं: स्टोरीज़, निजी पोस्ट। इसके लिए बॉट उस खाते की कुकी प्राप्त करता है — Videoner एक्सटेंशन से एक बार इस्तेमाल होने वाले कोड के माध्यम से, या आपके द्वारा भेजी गई फ़ाइल से।",
              "हम केवल चुने गए प्लेटफ़ॉर्म की कुकी रखते हैं, बाकी को तुरंत हटा देते हैं। वे एन्क्रिप्टेड रूप में संग्रहीत की जाती हैं और केवल वहीं डाउनलोड के लिए उपयोग की जाती हैं जहाँ आपने उन्हें कनेक्ट किया है। निजी चैट में कनेक्ट की गई कुकी आपके डाउनलोड के लिए होती हैं, जिनमें उन समूहों में आपके अपने लिंक भी शामिल हैं जहाँ कोई अलग खाता कनेक्ट नहीं है; दूसरों के लिंक के लिए उनका उपयोग नहीं किया जाता। किसी समूह से कनेक्ट की गई कुकी केवल उस समूह के सदस्यों के डाउनलोड के लिए होती हैं, और कहीं नहीं।",
              "कानूनी आधार आपकी सहमति है: आप खाता स्वयं कनेक्ट करते हैं और /accounts कमांड से उसे किसी भी समय हटा सकते हैं। हटाने पर कुकी स्थायी रूप से मिटा दी जाती हैं। यदि प्लेटफ़ॉर्म लॉग-इन स्वीकार करना बंद कर देता है, तो बॉट आपको इसकी सूचना देता है।",
              "कनेक्ट किए गए खाते के माध्यम से डाउनलोड की गई पोस्ट हमारे चैनल में प्रकाशित नहीं की जातीं और साझा कैश (shared cache) से अन्य उपयोगकर्ताओं को नहीं दी जातीं।",
            ],
          },
          {
            heading: "तृतीय-पक्ष सेवाएँ",
            body: [
              "हम आपका डेटा न बेचते हैं और न ही तृतीय पक्षों को उनके अपने उद्देश्यों के लिए देते हैं। सेवा के संचालन में निम्नलिखित प्रदाता शामिल हैं, जिनमें से प्रत्येक अपने नियमों के अनुसार डेटा संसाधित करता है:",
            ],
            bullets: [
              `Telegram — ${BOT} बॉट का संचालन।`,
              "Cloudflare — बॉट से सुरक्षा (Turnstile), साइट की डिलीवरी और ईमेल रूटिंग।",
              "Google Analytics और Google Tag Manager — विज़िट के आँकड़े।",
              "Yandex Metrica — विज़िट के आँकड़े, क्लिक मैप और Webvisor। Webvisor पृष्ठ पर गतिविधियाँ रिकॉर्ड करता है: पॉइंटर की गति, स्क्रॉलिंग और क्लिक। रिकॉर्डिंग का उपयोग केवल साइट की उपयोगिता के विश्लेषण के लिए किया जाता है।",
            ],
          },
          {
            heading: "हम डेटा कितने समय तक रखते हैं",
            bullets: [
              "डाउनलोड की गई फ़ाइलें बनने के लगभग एक घंटे बाद सर्वर से स्वचालित रूप से हटा दी जाती हैं। हम आपके वीडियो का कोई संग्रह नहीं रखते।",
              "डाउनलोड प्रयासों के रिकॉर्ड तब तक रखे जाते हैं जब तक दुरुपयोग रोकने और अनुरोधों के निपटारे के लिए आवश्यक हो।",
              "खाते का डेटा तब तक रखा जाता है जब तक आप सेवा का उपयोग करते हैं, और आपके अनुरोध पर हटा दिया जाता है।",
              "सर्वर लॉग सीमित समय तक रखे जाते हैं और रोटेशन के साथ अधिलेखित (overwrite) हो जाते हैं।",
            ],
          },
          {
            heading: "डेटा कहाँ संसाधित होता है",
            body: [
              "सेवा के सर्वर यूरोपीय संघ के क्षेत्र में स्थित एक डेटा सेंटर में हैं। ऊपर सूचीबद्ध कुछ प्रदाता अपनी नीतियों के अनुसार उसके बाहर भी डेटा संसाधित कर सकते हैं।",
            ],
          },
          {
            heading: "आपके अधिकार",
            body: [
              `आपको अपने डेटा के प्रसंस्करण के बारे में जानकारी प्राप्त करने, उसे सुधारने या हटाने की माँग करने, सहमति वापस लेने और प्रसंस्करण पर आपत्ति करने का अधिकार है। इसके लिए ${MAIL} पर उसी ईमेल पते या Telegram खाते से लिखें, जिससे अनुरोध संबंधित है।`,
              "हम उचित समय के भीतर उत्तर देते हैं, सामान्यतः तीस कैलेंडर दिनों के भीतर। खाता हटाने पर उससे जुड़ा डाउनलोड इतिहास भी हट जाता है।",
            ],
          },
          {
            heading: "नाबालिग",
            body: [
              "यह सेवा 16 वर्ष से कम आयु के बच्चों के लिए अभिप्रेत नहीं है और उन्हें लक्षित नहीं करती। हम जान-बूझकर ऐसे उपयोगकर्ताओं का डेटा एकत्र नहीं करते; यदि ऐसा भूलवश हुआ है, तो हमें लिखें, और डेटा हटा दिया जाएगा।",
            ],
          },
          {
            heading: "परिवर्तन",
            body: [
              "हम इस नीति को अद्यतन कर सकते हैं। वर्तमान संस्करण की तारीख पृष्ठ के शीर्ष पर दी गई है; महत्वपूर्ण परिवर्तनों की सूचना हम सेवा में देंगे।",
            ],
          },
        ],
      },
      terms: {
        title: "उपयोग की शर्तें",
        summary: `${operator.site} के उपयोग के नियम: क्या अनुमत है, क्या नहीं, और सेवा किन शर्तों पर काम करती है।`,
        sections: [
          {
            heading: "सामान्य प्रावधान",
            body: [
              `ये शर्तें ${operator.site} वेबसाइट और ${BOT} Telegram बॉट के उपयोग को नियंत्रित करती हैं। सेवा के स्वामी और संचालक ${operator.nameHi} हैं।`,
              "सेवा का उपयोग शुरू करके आप पुष्टि करते हैं कि आपने ये शर्तें पढ़ ली हैं और उन्हें स्वीकार करते हैं। यदि कोई शर्त आपके लिए उपयुक्त नहीं है, तो सेवा का उपयोग न करें।",
            ],
          },
          {
            heading: "सेवा निःशुल्क है",
            body: [
              "सेवा की सभी सुविधाएँ निःशुल्क प्रदान की जाती हैं। हमारे यहाँ कोई सदस्यता, सशुल्क प्लान, सशुल्क वीडियो गुणवत्ता या सेवा के भीतर खरीदारी नहीं है।",
              "हम विज्ञापन नहीं दिखाते और एफ़िलिएट (affiliate) लिंक नहीं लगाते।",
            ],
          },
          {
            heading: "पहुँच की शर्तें",
            bullets: [
              "वेबसाइट पर डाउनलोड करने के लिए न खाते की आवश्यकता है, न लॉग-इन की। बॉट उपयोगकर्ताओं को उनके Telegram खाते से पहचानता है।",
              "अनुरोधों की आवृत्ति पर तकनीकी सीमाएँ सेवा को अधिभार (overload) और स्वचालित दुरुपयोग से बचाती हैं।",
              "YouTube के लिए दैनिक ट्रैफ़िक सीमा लागू है: वेबसाइट और एक्सटेंशन पर प्रति नेटवर्क 24 घंटे में 10 GB, और बॉट में प्रति Telegram खाता 24 घंटे में 25 GB। अन्य प्लेटफ़ॉर्म इससे प्रभावित नहीं होते।",
              "बॉट के माध्यम से डाउनलोड करने के लिए हमारे चैनल की सदस्यता आवश्यक नहीं है। बॉट फ़ाइलों के कैप्शन में प्रोजेक्ट के समाचार चैनल का लिंक जोड़ता है; उसकी सदस्यता लेना वैकल्पिक है।",
            ],
          },
          {
            heading: "सेवा क्या करती है",
            body: [
              "सेवा एक तकनीकी मध्यस्थ (technical intermediary) है: आपके दिए गए लिंक के आधार पर वह सार्वजनिक रूप से उपलब्ध पृष्ठ तक पहुँचती है, मीडिया फ़ाइल प्राप्त करती है और उसे आपको सौंपती है।",
              "हम अपने यहाँ वीडियो की कोई सूची (catalogue) नहीं रखते, दूसरों की सामग्री में खोज नहीं करते और डाउनलोड की गई फ़ाइलों को सौंपने के लिए आवश्यक समय — लगभग एक घंटे — से अधिक नहीं रखते।",
              "किसी विशेष प्लेटफ़ॉर्म की उपलब्धता उसके तकनीकी निर्णयों पर निर्भर करती है और बिना पूर्व सूचना के बदल सकती है।",
            ],
          },
          {
            heading: "उपयोगकर्ता के दायित्व",
            body: [
              "प्राप्त फ़ाइलों का आप कैसे उपयोग करते हैं, इसके लिए केवल आप ही उत्तरदायी हैं, और आप पुष्टि करते हैं कि आपको ऐसा करने का अधिकार है।",
            ],
            bullets: [
              "केवल वही सामग्री डाउनलोड करें जिसके अधिकार आपके पास हैं, या जिसके उपयोग की अनुमति कॉपीराइट धारक या कानून देता है।",
              "कॉपीराइट और संबंधित अधिकारों (related rights) के उल्लंघन, प्रतिबंधित सामग्री के प्रसार या तृतीय पक्षों के अधिकारों के उल्लंघन के लिए सेवा का उपयोग न करें।",
              "सेवा की तकनीकी सीमाओं को दरकिनार करने का प्रयास न करें, जिनमें अनुरोधों की आवृत्ति की सीमाएँ और बॉट जाँच शामिल हैं।",
              "स्वचालित भार उत्पन्न न करें: बड़ी संख्या में अनुरोध, स्क्रिप्ट और स्क्रेपर (scrapers) की अनुमति नहीं है।",
            ],
          },
          {
            heading: "चैनल में लिंक का प्रकाशन",
            body: [
              "बॉट के माध्यम से वीडियो डाउनलोड करके आप सहमति देते हैं कि मूल पोस्ट का लिंक हमारे Telegram चैनल में प्रकाशित किया जाएगा। इसकी चेतावनी बॉट में गुणवत्ता चुनने से पहले — यानी डाउनलोड करने का निर्णय लेने से पहले — दिखाई जाती है।",
              "प्रकाशन अनाम होता है: चैनल में सार्वजनिक रूप से उपलब्ध पृष्ठ का लिंक, वीडियो का शीर्षक और उसका कवर जाता है — वही फ़्रेम जो प्लेटफ़ॉर्म स्वयं पोस्ट के प्रीव्यू में दिखाता है। वीडियो किसने डाउनलोड किया, यह नहीं बताया जाता। स्वयं वीडियो फ़ाइल कहीं भी और कभी भी प्रकाशित नहीं की जाती: केवल लिंक साझा किया जाता है, जिसे प्लेटफ़ॉर्म स्वयं हर पोस्ट के नीचे «Share» बटन के माध्यम से साझा करने के लिए आमंत्रित करते हैं।",
              "एक ही लिंक एक से अधिक बार प्रकाशित नहीं किया जाता। यदि आप नहीं चाहते कि कोई लिंक चैनल तक पहुँचे, तो वह वीडियो हमारी सेवा के माध्यम से डाउनलोड न करें।",
              "समूहों से आए लिंक और कनेक्ट किए गए खाते के माध्यम से डाउनलोड की गई पोस्ट चैनल में कभी प्रकाशित नहीं की जातीं।",
            ],
          },
          {
            heading: "अपना खाता कनेक्ट करना",
            body: [
              "किसी प्लेटफ़ॉर्म पर अपना खाता बॉट से कनेक्ट करके आप पुष्टि करते हैं कि वह आपका खाता है और आपको उसका इस प्रकार उपयोग करने का अधिकार है।",
              "प्लेटफ़ॉर्म स्वचालित डाउनलोड को स्वीकार नहीं करते और कनेक्ट किए गए खाते को प्रतिबंधित या ब्लॉक कर सकते हैं। यह जोखिम आप स्वयं उठाते हैं; हम सलाह देते हैं कि अपना मुख्य खाता नहीं, बल्कि एक अलग खाता कनेक्ट करें। प्लेटफ़ॉर्म द्वारा आपके खाते पर लगाए गए प्रतिबंधों के लिए हम उत्तरदायी नहीं हैं।",
              "किसी समूह से कनेक्ट किया गया खाता उसके सभी सदस्यों के डाउनलोड के लिए उपयोग किया जाता है। समूह के एडमिन तय करते हैं कि कौन खाते कनेक्ट कर सकता है, और उनमें से किसी को भी हटा सकते हैं।",
            ],
          },
          {
            heading: "दायित्व की सीमा",
            body: [
              "सेवा «जैसी है» (as is) आधार पर प्रदान की जाती है। हम निर्बाध संचालन, किसी विशेष प्लेटफ़ॉर्म की उपलब्धता या आपके उद्देश्य के लिए फ़ाइल की उपयुक्तता की गारंटी नहीं देते।",
              "आपने डाउनलोड की गई सामग्री का कैसे उपयोग किया, और आपके द्वारा तृतीय पक्षों के अधिकारों के उल्लंघन के परिणामों के लिए हम उत्तरदायी नहीं हैं।",
              "हम सेवा की सुविधाओं में परिवर्तन करने, रखरखाव के लिए उसका संचालन अस्थायी रूप से रोकने और उसे बंद करने का अधिकार रखते हैं।",
            ],
          },
          {
            heading: "पहुँच पर प्रतिबंध",
            body: [
              "इन शर्तों के उल्लंघन, सीमाओं को दरकिनार करने के प्रयासों, या कॉपीराइट धारक की ओर से प्रमाणित शिकायत प्राप्त होने पर हम सेवा तक पहुँच को सीमित या समाप्त कर सकते हैं।",
            ],
          },
          {
            heading: "परिवर्तन और लागू कानून",
            body: [
              "हम इन शर्तों में परिवर्तन कर सकते हैं; वर्तमान संस्करण की तारीख पृष्ठ के शीर्ष पर दी गई है। परिवर्तनों के बाद सेवा का उपयोग जारी रखकर आप नया संस्करण स्वीकार करते हैं।",
              "पक्षों के संबंधों पर कज़ाखस्तान गणराज्य का कानून लागू होता है (governing law)। पक्ष विवादों को पत्राचार के माध्यम से सुलझाने का प्रयास करते हैं, और सहमति न होने पर — कज़ाखस्तान गणराज्य के कानून द्वारा स्थापित प्रक्रिया के अनुसार।",
            ],
          },
        ],
      },
      cookies: {
        title: "कुकी नीति",
        summary: `${operator.site} कौन-सी कुकी (cookies) उपयोग करता है, वे किसलिए हैं और उन्हें कैसे अस्वीकार करें।`,
        sections: [
          {
            heading: "कुकी क्या हैं",
            body: [
              "कुकी छोटी टेक्स्ट फ़ाइलें होती हैं जिन्हें कोई साइट आपके ब्राउज़र में सहेजती है। इनसे आपकी सेटिंग्स याद रखी जा सकती हैं और विज़िट के अनामीकृत आँकड़े एकत्र किए जा सकते हैं।",
              "इस दस्तावेज़ में कुकी के साथ-साथ हम संबंधित तकनीकों का भी वर्णन करते हैं — ब्राउज़र का लोकल स्टोरेज (local storage) और ट्रैकिंग पिक्सेल।",
            ],
          },
          {
            heading: "अनिवार्य",
            body: [
              "इनके बिना सेवा काम नहीं करती, इसलिए ये हमेशा सेट की जाती हैं।",
            ],
            bullets: [
              "Cloudflare Turnstile — यह जाँच कि लिंक कोई व्यक्ति भेज रहा है, स्क्रिप्ट नहीं।",
              "इंटरफ़ेस सेटिंग्स — चुनी गई भाषा और रंग थीम।",
            ],
          },
          {
            heading: "एनालिटिक्स",
            body: [
              "ये हमें समझने में मदद करती हैं कि किन पृष्ठों का उपयोग होता है और त्रुटियाँ कहाँ होती हैं। ये आपकी सहमति से सेट की जाती हैं और सेवा के संचालन के लिए आवश्यक नहीं हैं।",
            ],
            bullets: [
              "Google Analytics और Google Tag Manager — अनामीकृत रूप में ट्रैफ़िक और साइट पर व्यवहार।",
              "Yandex Metrica — ट्रैफ़िक, क्लिक मैप और Webvisor।",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica का Webvisor पृष्ठ पर गतिविधियाँ रिकॉर्ड करता है: पॉइंटर की गति, स्क्रॉलिंग, क्लिक और लिंक फ़ील्ड में टाइपिंग। इसका उद्देश्य यह देखना है कि इंटरफ़ेस कहाँ लोगों को भ्रमित करता है।",
              "हम इन रिकॉर्डिंग का उपयोग विशिष्ट व्यक्तियों पर नज़र रखने के लिए नहीं करते। कृपया साइट के फ़ील्ड में ऐसी कोई जानकारी दर्ज न करें जिसे आप सहेजा जाना नहीं चाहेंगे।",
            ],
          },
          {
            heading: "कैसे अस्वीकार करें",
            bullets: [
              "अपने ब्राउज़र की सेटिंग्स में कुकी को ब्लॉक करें या हटाएँ — यह तरीका यहाँ सूचीबद्ध सभी प्रणालियों के लिए काम करता है।",
              "Google Analytics: डेटा संग्रह बंद करने वाला आधिकारिक ब्राउज़र ऐड-ऑन Google की साइट पर उपलब्ध है।",
              "Yandex Metrica: Yandex के आधिकारिक ऐड-ऑन के माध्यम से ऑप्ट-आउट किया जा सकता है।",
              "अनिवार्य कुकी अक्षम करने पर डाउनलोड करना संभव नहीं रहेगा।",
            ],
          },
          {
            heading: "संग्रहण अवधि",
            body: [
              "सत्र कुकी (session cookies) ब्राउज़र बंद करने पर या सत्र की अवधि समाप्त होने पर हट जाती हैं। एनालिटिक्स उपकरण अपने पहचानकर्ताओं को उनके प्रदाताओं द्वारा निर्धारित अवधि तक रखते हैं।",
            ],
          },
        ],
      },
      copyright: {
        title: "कॉपीराइट धारकों के लिए",
        summary: "कॉपीराइट पर सेवा की स्थिति और उल्लंघन की शिकायत दर्ज करने की प्रक्रिया।",
        sections: [
          {
            heading: "सेवा की स्थिति",
            body: [
              "सेवा अपने यहाँ कोई वीडियो होस्ट नहीं करती और उनकी कोई सूची नहीं रखती। वह एक तकनीकी मध्यस्थ के रूप में काम करती है: उपयोगकर्ता द्वारा दर्ज किए गए लिंक के आधार पर सार्वजनिक रूप से उपलब्ध पृष्ठ तक पहुँचती है और फ़ाइल उस उपयोगकर्ता को सौंपती है।",
              "डाउनलोड की गई फ़ाइलें लगभग एक घंटे तक सर्वर पर रहती हैं और फिर स्वचालित रूप से हटा दी जाती हैं। किसी और की सामग्री की कोई स्थायी प्रति हमारे पास नहीं रहती।",
              "डाउनलोड की गई सामग्री के उपयोग की ज़िम्मेदारी उपयोगकर्ता की है — यह उपयोग की शर्तों में स्पष्ट रूप से निर्धारित है।",
            ],
          },
          {
            heading: "यदि आपके अधिकारों का उल्लंघन हुआ है",
            body: [
              `यदि आप कॉपीराइट धारक या उसके प्रतिनिधि हैं और मानते हैं कि सेवा का उपयोग आपके अधिकारों के उल्लंघन के लिए किया जा रहा है, तो ${MAIL} पर लिखें। हम ऐसी शिकायतों की समीक्षा करते हैं और कार्रवाई करते हैं।`,
            ],
          },
          {
            heading: "शिकायत में क्या शामिल करें",
            bullets: [
              "कौन-सी कृति प्रभावित है और किस आधार पर आपके पास उसके अधिकार हैं।",
              "सामग्री का लिंक और, यदि ज्ञात हो, उल्लंघन की परिस्थितियाँ।",
              "आपके संपर्क विवरण: नाम या संस्था का नाम, पता और ईमेल पता।",
              "यदि आप कॉपीराइट धारक की ओर से कार्य कर रहे हैं — आपके प्राधिकार का प्रमाण।",
              "यह कथन कि शिकायत में दी गई जानकारी सत्य है और सामग्री का उपयोग कॉपीराइट धारक या कानून द्वारा अधिकृत नहीं है।",
            ],
          },
          {
            heading: "हम क्या करेंगे",
            body: [
              "हम शिकायत की समीक्षा उचित समय के भीतर, सामान्यतः तीस कैलेंडर दिनों के भीतर करते हैं, और उल्लंघन की पुष्टि होने पर सेवा के माध्यम से उस सामग्री तक पहुँच को सीमित करते हैं तथा आवश्यकता होने पर — उल्लंघनकर्ता की सेवा तक पहुँच को भी।",
              "समीक्षा के परिणाम की सूचना हम आपके द्वारा दिए गए ईमेल पते पर देंगे।",
            ],
          },
          {
            heading: "दुर्भावनापूर्ण शिकायतें",
            body: [
              "जान-बूझकर गलत जानकारी वाली शिकायत लागू कानून के अनुसार शिकायतकर्ता के दायित्व का कारण बन सकती है। यदि शिकायत से न तो कॉपीराइट धारक की पहचान हो पाती है और न ही विवादित सामग्री की, तो हम उस पर विचार करने से इनकार कर सकते हैं।",
            ],
          },
        ],
      },
    },
  },
  id: {
    ui: {
      updated: "Terakhir diperbarui",
      back: "Kembali ke beranda",
      operatorHeading: "Penyelenggara layanan",
      navHeading: "Dokumen lainnya",
      labels: {
        privacy: "Kebijakan Privasi",
        terms: "Ketentuan Penggunaan",
        cookies: "Kebijakan Cookie",
        copyright: "Untuk Pemegang Hak Cipta",
      },
    },
    docs: {
      privacy: {
        title: "Kebijakan Privasi",
        summary: `Data apa yang dikumpulkan oleh ${operator.site}, mengapa data tersebut diperlukan, berapa lama disimpan, dan bagaimana cara menghapusnya.`,
        sections: [
          {
            heading: "Ketentuan Umum",
            body: [
              `Kebijakan ini menjelaskan data pribadi apa yang diproses oleh layanan ${operator.site} dan untuk tujuan apa. Pengendali data adalah ${operator.nameId}.`,
              "Dengan menggunakan layanan, Anda menyetujui tata cara pemrosesan yang diuraikan di sini. Apabila Anda tidak menyetujuinya, mohon untuk tidak menggunakan layanan.",
              "Pemrosesan dilakukan sesuai dengan Undang-Undang Republik Kazakhstan tentang Data Pribadi dan Pelindungannya, dan, bagi pengunjung dari Kawasan Ekonomi Eropa, dengan memperhatikan ketentuan GDPR.",
            ],
          },
          {
            heading: "Data yang kami proses",
            body: [
              "Kami dengan sengaja tidak mengumpulkan apa pun di luar yang diperlukan untuk berjalannya layanan, dan kami tidak pernah meminta dokumen identitas, data pembayaran, atau alamat.",
            ],
            bullets: [
              "Data akun Telegram yang diterima bot ketika Anda mengirim pesan kepadanya: ID numerik, nama pengguna, nama depan, dan kode bahasa.",
              "Tautan yang Anda kirimkan untuk diunduh beserta keterangan mengenai upaya pengunduhan itu sendiri: platform, tanggal dan waktu, kualitas yang dipilih, serta hasilnya (berhasil atau galat).",
              "Data teknis koneksi: alamat IP, jenis dan versi peramban, bahasa, serta halaman perujuk. Data ini tercatat dalam log server dan dalam sistem analitik web.",
              "Cookie dan pengenal analitik — selengkapnya lihat Kebijakan Cookie.",
            ],
          },
          {
            heading: "Mengapa data ini diperlukan",
            bullets: [
              "Untuk menyediakan layanan itu sendiri: mengambil video dari tautan Anda dan menyerahkan berkasnya kepada Anda.",
              "Untuk membedakan akun Anda dari akun orang lain dan mencegah penyalahgunaan.",
              "Untuk melindungi layanan dari penyalahgunaan otomatis melalui pemeriksaan Cloudflare Turnstile sebelum tautan dikirimkan.",
              "Untuk memahami bagaimana situs digunakan dan memperbaiki galat, dengan menggunakan statistik yang dianonimkan dan diagregasi.",
              "Untuk menanggapi permintaan Anda dan permintaan pemegang hak cipta.",
              "Untuk sesekali mengirim pesan kepada Anda di Telegram guna menanyakan pendapat Anda tentang layanan — misalnya, apabila Anda berhenti menggunakannya. Anda tidak wajib membalas; apabila Anda tidak ingin menerima pesan semacam itu, cukup beri tahu kami dan kami tidak akan menghubungi Anda lagi.",
            ],
          },
          {
            heading: "Dasar hukum pemrosesan",
            body: [
              "Data akun Telegram dan catatan unduhan diproses untuk melaksanakan Ketentuan Penggunaan, yang Anda terima ketika mulai menggunakan layanan.",
              "Cookie analitik dan perekaman aktivitas di situs diproses berdasarkan persetujuan Anda, yang dapat Anda tarik kembali sewaktu-waktu — caranya diuraikan dalam Kebijakan Cookie.",
              "Log server dan perlindungan dari bot didasarkan pada kepentingan sah kami untuk menjaga layanan tetap berfungsi dan aman.",
              "Permintaan pendapat Anda tentang layanan didasarkan pada kepentingan sah kami untuk meningkatkan layanan; Anda dapat menolaknya sewaktu-waktu.",
            ],
          },
          {
            heading: "Akun yang terhubung",
            body: [
              "Jika Anda menghendaki, Anda dapat menghubungkan akun Anda di suatu platform (Instagram, Facebook, YouTube, X, VK, TikTok) ke bot agar bot dapat mengunduh postingan yang hanya dapat dilihat oleh pengguna yang telah masuk: stories dan postingan privat. Untuk itu, bot menerima cookie akun tersebut — dari ekstensi Videoner melalui kode sekali pakai, atau dari berkas yang Anda kirimkan.",
              "Kami hanya menyimpan cookie dari platform yang dipilih dan langsung membuang sisanya. Cookie tersebut disimpan dalam bentuk terenkripsi dan hanya digunakan untuk unduhan di tempat Anda menghubungkannya. Cookie yang dihubungkan dalam obrolan pribadi Anda digunakan untuk unduhan Anda, termasuk tautan Anda sendiri di grup yang tidak memiliki akun terhubung sendiri; cookie tersebut tidak pernah digunakan untuk tautan orang lain. Cookie yang dihubungkan ke suatu grup digunakan untuk unduhan para anggotanya dan tidak untuk keperluan lain.",
              "Dasar hukumnya adalah persetujuan Anda: Anda sendiri yang menghubungkan akun dan dapat menghapusnya sewaktu-waktu dengan perintah /accounts. Cookie yang dihapus akan dimusnahkan secara permanen. Apabila platform tidak lagi menerima proses masuk tersebut, bot akan memberi tahu Anda.",
              "Postingan yang diunduh melalui akun yang terhubung tidak dipublikasikan di kanal kami dan tidak diberikan kepada pengguna lain dari cache bersama.",
            ],
          },
          {
            heading: "Layanan pihak ketiga",
            body: [
              "Kami tidak menjual data Anda dan tidak menyerahkannya kepada pihak ketiga untuk tujuan mereka sendiri. Layanan ini menggunakan penyedia berikut, yang masing-masing memproses data sesuai dengan aturannya sendiri:",
            ],
            bullets: [
              `Telegram — pengoperasian bot ${BOT}.`,
              "Cloudflare — perlindungan dari bot (Turnstile), pengiriman situs, dan perutean surel.",
              "Google Analytics dan Google Tag Manager — statistik kunjungan.",
              "Yandex Metrica — statistik kunjungan, peta klik, dan Webvisor. Webvisor merekam aktivitas di halaman: pergerakan penunjuk, pengguliran, dan klik. Rekaman tersebut hanya digunakan untuk menganalisis kemudahan penggunaan situs.",
            ],
          },
          {
            heading: "Jangka waktu penyimpanan",
            bullets: [
              "Berkas yang diunduh dihapus dari server secara otomatis sekitar satu jam setelah dibuat. Kami tidak menyimpan arsip video Anda.",
              "Catatan upaya pengunduhan disimpan selama diperlukan untuk mencegah penyalahgunaan dan menangani permintaan.",
              "Data akun disimpan selama Anda menggunakan layanan dan dihapus atas permintaan Anda.",
              "Log server disimpan untuk jangka waktu terbatas dan ditimpa seiring rotasinya.",
            ],
          },
          {
            heading: "Lokasi pemrosesan data",
            body: [
              "Server layanan berada di pusat data di wilayah Uni Eropa. Sebagian penyedia yang disebutkan di atas dapat memproses data di luar wilayah tersebut sesuai dengan kebijakan mereka sendiri.",
            ],
          },
          {
            heading: "Hak Anda",
            body: [
              `Anda berhak memperoleh informasi mengenai pemrosesan data Anda, meminta perbaikan atau penghapusannya, menarik kembali persetujuan, dan mengajukan keberatan atas pemrosesan. Untuk itu, kirimkan surel ke ${MAIL} dari alamat surel atau akun Telegram yang terkait dengan permintaan tersebut.`,
              "Kami menanggapi dalam jangka waktu yang wajar, biasanya dalam tiga puluh hari kalender. Penghapusan akun juga mengakibatkan penghapusan riwayat unduhan yang terkait dengannya.",
            ],
          },
          {
            heading: "Anak-anak",
            body: [
              "Layanan ini tidak diperuntukkan dan tidak ditujukan bagi anak-anak di bawah usia 16 tahun. Kami tidak dengan sengaja mengumpulkan data mereka; apabila hal itu terjadi karena kekeliruan, hubungi kami dan data tersebut akan dihapus.",
            ],
          },
          {
            heading: "Perubahan",
            body: [
              "Kami dapat memperbarui Kebijakan ini. Tanggal versi yang berlaku tercantum di bagian atas halaman, dan perubahan yang material akan kami tandai di dalam layanan.",
            ],
          },
        ],
      },
      terms: {
        title: "Ketentuan Penggunaan",
        summary: `Aturan penggunaan ${operator.site}: apa yang diperbolehkan, apa yang tidak, dan dengan ketentuan apa layanan ini beroperasi.`,
        sections: [
          {
            heading: "Ketentuan Umum",
            body: [
              `Ketentuan ini mengatur penggunaan situs web ${operator.site} dan bot Telegram ${BOT}. Pemilik dan pengelola layanan adalah ${operator.nameId}.`,
              "Dengan mulai menggunakan layanan, Anda menyatakan bahwa Anda telah membaca Ketentuan ini dan menerimanya. Apabila ada ketentuan yang tidak sesuai bagi Anda, mohon untuk tidak menggunakan layanan.",
            ],
          },
          {
            heading: "Layanan ini gratis",
            body: [
              "Seluruh fitur layanan disediakan secara gratis. Tidak ada langganan, paket berbayar, kualitas video berbayar, maupun pembelian di dalam layanan.",
              "Kami tidak menampilkan iklan dan tidak memasang tautan afiliasi.",
            ],
          },
          {
            heading: "Ketentuan akses",
            bullets: [
              "Mengunduh di situs web tidak memerlukan akun maupun proses masuk. Bot membedakan pengguna berdasarkan akun Telegram mereka.",
              "Pembatasan teknis atas frekuensi permintaan melindungi layanan dari kelebihan beban dan penyalahgunaan otomatis.",
              "Untuk YouTube berlaku batas lalu lintas harian: 10 GB per 24 jam per jaringan di situs web dan di ekstensi, serta 25 GB per 24 jam per akun Telegram di bot. Platform lain tidak terpengaruh.",
              "Untuk mengunduh melalui bot tidak diperlukan langganan ke kanal kami. Bot menambahkan tautan ke kanal berita proyek pada keterangan berkas; berlangganan kanal tersebut bersifat opsional.",
            ],
          },
          {
            heading: "Apa yang dilakukan layanan",
            body: [
              "Layanan ini bertindak sebagai perantara teknis: layanan mengikuti tautan yang Anda berikan, mengakses halaman yang dapat diakses publik, mengambil berkas media, dan meneruskannya kepada Anda.",
              "Kami tidak menempatkan katalog video, tidak melakukan pencarian atas konten milik orang lain, dan tidak menyimpan berkas yang diunduh lebih lama dari yang diperlukan untuk pengirimannya — sekitar satu jam.",
              "Ketersediaan platform tertentu bergantung pada keputusan teknis platform tersebut dan dapat berubah tanpa pemberitahuan.",
            ],
          },
          {
            heading: "Kewajiban pengguna",
            body: [
              "Anda sendiri bertanggung jawab atas cara Anda menggunakan berkas yang Anda peroleh, dan Anda menyatakan bahwa Anda berhak untuk melakukannya.",
            ],
            bullets: [
              "Unduh hanya materi yang hak atasnya Anda miliki, atau yang penggunaannya diizinkan oleh pemegang hak atau oleh hukum.",
              "Jangan menggunakan layanan untuk melanggar hak cipta atau hak terkait, menyebarkan konten terlarang, atau melanggar hak pihak ketiga.",
              "Jangan mencoba mengakali pembatasan teknis layanan, termasuk pembatasan frekuensi permintaan dan pemeriksaan bot.",
              "Jangan menimbulkan beban otomatis: permintaan massal, skrip, dan scraper tidak diperbolehkan.",
            ],
          },
          {
            heading: "Publikasi tautan di kanal",
            body: [
              "Dengan mengunduh video melalui bot, Anda menyetujui bahwa tautan ke postingan asli akan dipublikasikan di kanal Telegram kami. Pemberitahuan mengenai hal ini ditampilkan di bot sebelum Anda memilih kualitas — yakni sebelum Anda memutuskan untuk mengunduh.",
              "Publikasi dilakukan secara anonim: kanal menerima tautan ke halaman yang dapat diakses publik, judul video, dan sampulnya — bingkai yang sama dengan yang ditampilkan platform dalam pratinjau postingannya. Siapa yang mengunduh video tidak disebutkan. Berkas video itu sendiri tidak pernah dipublikasikan di mana pun: yang disebarkan adalah tautan, yang oleh platform itu sendiri dianjurkan untuk disebarkan melalui tombol «Bagikan» di bawah setiap postingan.",
              "Tautan yang sama dipublikasikan tidak lebih dari satu kali. Apabila Anda tidak ingin suatu tautan masuk ke kanal, jangan unduh video tersebut melalui layanan kami.",
              "Tautan dari grup dan postingan yang diunduh melalui akun yang terhubung tidak pernah dipublikasikan di kanal."
            ],
          },
          {
            heading: "Menghubungkan akun Anda",
            body: [
              "Dengan menghubungkan akun Anda di suatu platform ke bot, Anda menyatakan bahwa akun tersebut adalah milik Anda dan Anda berhak menggunakannya dengan cara ini.",
              "Platform tidak menyetujui pengunduhan otomatis dan dapat membatasi atau memblokir akun yang terhubung. Anda menanggung risiko ini; kami menyarankan untuk menghubungkan akun cadangan, bukan akun utama Anda. Kami tidak bertanggung jawab atas pembatasan yang dikenakan platform terhadap akun Anda.",
              "Akun yang dihubungkan ke suatu grup digunakan untuk unduhan semua anggotanya. Admin grup menentukan siapa yang boleh menghubungkan akun dan dapat menghapus akun mana pun.",
            ],
          },
          {
            heading: "Batasan tanggung jawab",
            body: [
              "Layanan disediakan «sebagaimana adanya». Kami tidak menjamin layanan beroperasi tanpa gangguan, ketersediaan platform tertentu, atau kesesuaian berkas untuk tujuan Anda.",
              "Kami tidak bertanggung jawab atas apa yang Anda lakukan terhadap materi yang Anda unduh, maupun atas akibat pelanggaran hak pihak ketiga yang Anda lakukan.",
              "Kami berhak mengubah fitur layanan, menghentikan sementara layanan untuk pemeliharaan, dan menghentikan pengoperasiannya.",
            ],
          },
          {
            heading: "Pembatasan akses",
            body: [
              "Kami dapat membatasi atau mengakhiri akses ke layanan apabila Ketentuan ini dilanggar, apabila ada upaya mengakali pembatasan, atau apabila diterima pengaduan yang berdasar dari pemegang hak.",
            ],
          },
          {
            heading: "Perubahan dan hukum yang berlaku",
            body: [
              "Kami dapat mengubah Ketentuan ini; tanggal versi yang berlaku tercantum di bagian atas halaman. Dengan tetap menggunakan layanan setelah perubahan, Anda menerima versi yang baru.",
              "Hubungan para pihak tunduk pada hukum Republik Kazakhstan. Para pihak akan berupaya menyelesaikan sengketa melalui korespondensi dan, apabila tidak tercapai kesepakatan, sesuai dengan tata cara yang ditetapkan oleh peraturan perundang-undangan Republik Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Kebijakan Cookie",
        summary: `Cookie apa yang digunakan oleh ${operator.site}, untuk apa cookie tersebut, dan bagaimana cara menolaknya.`,
        sections: [
          {
            heading: "Apa itu cookie",
            body: [
              "Cookie adalah berkas teks kecil yang disimpan situs di peramban Anda. Cookie memungkinkan layanan mengingat pengaturan Anda dan mengumpulkan statistik kunjungan yang dianonimkan.",
              "Selain cookie, dokumen ini juga mencakup teknologi serupa: penyimpanan lokal peramban dan piksel pelacak.",
            ],
          },
          {
            heading: "Cookie yang mutlak diperlukan",
            body: [
              "Tanpa cookie ini layanan tidak dapat berfungsi, sehingga cookie ini selalu dipasang.",
            ],
            bullets: [
              "Cloudflare Turnstile — memeriksa bahwa tautan dikirimkan oleh manusia, bukan oleh skrip.",
              "Pengaturan antarmuka — bahasa dan tema tampilan yang Anda pilih.",
            ],
          },
          {
            heading: "Cookie analitik",
            body: [
              "Cookie ini membantu kami memahami halaman mana yang digunakan dan di mana galat terjadi. Cookie ini dipasang dengan persetujuan Anda dan tidak diperlukan untuk berfungsinya layanan.",
            ],
            bullets: [
              "Google Analytics dan Google Tag Manager — lalu lintas dan perilaku di situs dalam bentuk yang dianonimkan.",
              "Yandex Metrica — lalu lintas, peta klik, dan Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor dari Yandex Metrica merekam aktivitas di halaman: pergerakan penunjuk, pengguliran, klik, dan ketikan di kolom tautan. Hal ini diperlukan agar kami dapat melihat bagian antarmuka yang membingungkan pengguna.",
              "Kami tidak menggunakan rekaman ini untuk melacak individu tertentu. Mohon untuk tidak memasukkan ke dalam kolom situs informasi apa pun yang tidak ingin Anda simpan.",
            ],
          },
          {
            heading: "Cara menolak",
            bullets: [
              "Blokir atau hapus cookie melalui pengaturan peramban Anda — cara ini berlaku untuk semua sistem yang disebutkan di sini.",
              "Google Analytics: pengaya peramban resmi untuk menonaktifkan pengumpulan data tersedia di situs Google.",
              "Yandex Metrica: penolakan dapat dilakukan melalui pengaya resmi dari Yandex.",
              "Menonaktifkan cookie yang mutlak diperlukan akan membuat pengunduhan tidak dapat dilakukan.",
            ],
          },
          {
            heading: "Jangka waktu penyimpanan",
            body: [
              "Cookie sesi dihapus ketika Anda menutup peramban atau ketika sesi berakhir. Alat analitik menyimpan pengenalnya selama jangka waktu yang ditetapkan oleh penyedianya.",
            ],
          },
        ],
      },
      copyright: {
        title: "Untuk Pemegang Hak Cipta",
        summary: "Sikap layanan terkait hak cipta dan tata cara pengajuan pengaduan atas pelanggaran.",
        sections: [
          {
            heading: "Sikap layanan",
            body: [
              "Layanan ini tidak menempatkan video dan tidak mengelola katalog video. Layanan bertindak sebagai perantara teknis: mengikuti tautan yang dimasukkan pengguna, mengakses halaman yang dapat diakses publik, dan meneruskan berkas kepada pengguna tersebut.",
              "Berkas yang diunduh tersimpan di server sekitar satu jam, lalu dihapus secara otomatis. Tidak ada salinan permanen atas konten milik orang lain yang tersisa pada kami.",
              "Tanggung jawab atas penggunaan materi yang diunduh berada pada pengguna, sebagaimana dinyatakan secara tegas dalam Ketentuan Penggunaan.",
            ],
          },
          {
            heading: "Apabila hak Anda dilanggar",
            body: [
              `Apabila Anda adalah pemegang hak atau kuasanya dan berpendapat bahwa layanan digunakan untuk melanggar hak Anda, kirimkan surel ke ${MAIL}. Kami meninjau pengaduan semacam itu dan mengambil tindakan.`,
            ],
          },
          {
            heading: "Isi pengaduan",
            bullets: [
              "Ciptaan apa yang terdampak dan atas dasar apa Anda memegang hak atasnya.",
              "Tautan ke materi tersebut dan, jika diketahui, keadaan terjadinya pelanggaran.",
              "Data kontak Anda: nama orang atau nama badan usaha, alamat, dan alamat surel.",
              "Apabila Anda bertindak atas nama pemegang hak, bukti kewenangan Anda.",
              "Pernyataan bahwa informasi dalam pengaduan adalah benar dan bahwa penggunaan materi tersebut tidak diizinkan oleh pemegang hak atau oleh hukum.",
            ],
          },
          {
            heading: "Tindakan yang akan kami ambil",
            body: [
              "Kami meninjau pengaduan dalam jangka waktu yang wajar, biasanya dalam tiga puluh hari kalender, dan apabila pelanggaran terbukti, kami membatasi akses ke materi tersebut melalui layanan dan, apabila diperlukan, membatasi akses pelanggar ke layanan.",
              "Kami akan memberitahukan hasil peninjauan ke alamat surel yang Anda berikan.",
            ],
          },
          {
            heading: "Pengaduan dengan iktikad tidak baik",
            body: [
              "Pengaduan yang memuat informasi yang diketahui tidak benar dapat menimbulkan tanggung jawab hukum bagi pengadu sesuai dengan peraturan perundang-undangan yang berlaku. Kami berhak menolak meninjau pengaduan apabila pengaduan tersebut tidak memungkinkan untuk mengidentifikasi pemegang hak maupun materi yang disengketakan.",
            ],
          },
        ],
      },
    },
  },
  sw: {
    ui: {
      updated: "Imesasishwa mwisho",
      back: "Rudi ukurasa wa mwanzo",
      operatorHeading: "Mwendeshaji wa huduma",
      navHeading: "Nyaraka nyingine",
      labels: {
        privacy: "Sera ya Faragha",
        terms: "Masharti ya Matumizi",
        cookies: "Sera ya Vidakuzi",
        copyright: "Hakimiliki",
      },
    },
    docs: {
      privacy: {
        title: "Sera ya Faragha",
        summary: `Ni data gani ${operator.site} hukusanya, kwa nini zinahitajika, zinahifadhiwa kwa muda gani na jinsi ya kuzifuta.`,
        sections: [
          {
            heading: "Masharti ya jumla",
            body: [
              `Sera hii inaeleza ni data binafsi zipi zinazochakatwa na huduma ya ${operator.site} na kwa madhumuni gani. Mdhibiti wa data (data controller) ni ${operator.nameSw}.`,
              "Kwa kutumia huduma, unakubali utaratibu wa uchakataji ulioelezwa hapa. Ikiwa hukubaliani nao, tafadhali usitumie huduma.",
              "Uchakataji unafanywa kwa mujibu wa Sheria ya Jamhuri ya Kazakhstan kuhusu Data Binafsi na Ulinzi Wake, na, kwa wageni kutoka Eneo la Kiuchumi la Ulaya (European Economic Area), kwa kuzingatia matakwa ya GDPR.",
            ],
          },
          {
            heading: "Data tunazochakata",
            body: [
              "Kwa makusudi hatukusanyi chochote zaidi ya kinachohitajika kwa uendeshaji wa huduma, na hatuombi nyaraka za utambulisho, taarifa za malipo wala anwani.",
            ],
            bullets: [
              "Data za akaunti ya Telegram ambazo boti hupokea unapoiandikia: kitambulisho cha nambari, jina la mtumiaji (username), jina na msimbo wa lugha.",
              "Viungo unavyotuma kwa ajili ya kupakua na taarifa kuhusu jaribio lenyewe: jukwaa, tarehe na saa, ubora uliouchagua, na matokeo (mafanikio au hitilafu).",
              "Data za kiufundi za muunganisho: anwani ya IP, aina na toleo la kivinjari, lugha na ukurasa uliokuelekeza. Data hizi huingia kwenye kumbukumbu za seva (server logs) na kwenye mifumo ya takwimu za wavuti.",
              "Vidakuzi (cookies) na vitambulisho vya takwimu — maelezo zaidi yamo katika Sera ya Vidakuzi.",
            ],
          },
          {
            heading: "Kwa nini tunahitaji data hizi",
            bullets: [
              "Kutoa huduma yenyewe: kupata video kupitia kiungo chako na kukupatia faili.",
              "Kutofautisha akaunti yako na akaunti za watu wengine na kuzuia matumizi mabaya.",
              "Kulinda huduma dhidi ya matumizi mabaya ya kiotomatiki kupitia ukaguzi wa Cloudflare Turnstile kabla ya kiungo kutumwa.",
              "Kuelewa jinsi tovuti inavyotumiwa na kurekebisha hitilafu, kwa kutumia takwimu zisizomtambulisha mtu na zilizojumlishwa.",
              "Kujibu maombi yako na maombi ya wamiliki wa haki.",
              "Mara chache kukuandikia kwenye Telegram ili kujua maoni yako kuhusu huduma — kwa mfano, ikiwa umeacha kuitumia. Si lazima kujibu; ikiwa hutaki kupokea ujumbe kama huo, sema tu, nasi hatutakuandikia tena.",
            ],
          },
          {
            heading: "Misingi ya kisheria ya uchakataji",
            body: [
              "Data za akaunti ya Telegram na taarifa za upakuaji huchakatwa ili kutekeleza Masharti ya Matumizi, ambayo unayakubali unapoanza kutumia huduma.",
              "Vidakuzi vya takwimu na urekodi wa vitendo kwenye tovuti huchakatwa kwa msingi wa idhini yako, ambayo unaweza kuiondoa wakati wowote — njia za kufanya hivyo zimeelezwa katika Sera ya Vidakuzi.",
              "Kumbukumbu za seva na ulinzi dhidi ya boti huchakatwa kwa msingi wa maslahi yetu halali (legitimate interest) ya kuhakikisha kwamba huduma inafanya kazi na iko salama.",
              "Kuuliza maoni yako kuhusu huduma kunategemea maslahi yetu halali ya kuboresha huduma; unaweza kukataa wakati wowote.",
            ],
          },
          {
            heading: "Akaunti zilizounganishwa",
            body: [
              "Ukipenda, unaweza kuunganisha akaunti yako ya jukwaa (Instagram, Facebook, YouTube, X, VK, TikTok) na boti ili boti ipakue machapisho yanayoonekana tu kwa watumiaji walioingia: stori (stories) na machapisho ya faragha. Kwa ajili hiyo boti hupokea vidakuzi vya akaunti hiyo — kutoka kwa kiendelezi cha Videoner kupitia msimbo wa matumizi ya mara moja, au kutoka kwa faili uliyotuma.",
              "Tunahifadhi vidakuzi vya jukwaa lililochaguliwa pekee na kutupa vingine vyote mara moja. Vinahifadhiwa vikiwa vimesimbwa (encrypted) na hutumika tu kwa upakuaji pale ulipoviunganisha. Vidakuzi vilivyounganishwa kwenye gumzo lako la faragha hutumika kwa upakuaji wako, ikiwa ni pamoja na viungo vyako mwenyewe katika vikundi ambavyo havina akaunti yao iliyounganishwa; havitumiki kamwe kwa viungo vya watu wengine. Vidakuzi vilivyounganishwa kwenye kikundi hutumika kwa upakuaji wa wanachama wake pekee na si kwingineko.",
              "Msingi wa kisheria ni idhini yako: unaunganisha akaunti mwenyewe na unaweza kuiondoa wakati wowote kwa amri /accounts. Vidakuzi vilivyoondolewa hufutwa kabisa bila uwezekano wa kurejeshwa. Ikiwa jukwaa litaacha kukubali kuingia, boti itakujulisha.",
              "Machapisho yaliyopakuliwa kupitia akaunti iliyounganishwa hayachapishwi kwenye chaneli yetu na hayatolewi kwa watumiaji wengine kutoka kwenye akiba ya pamoja (cache).",
            ],
          },
          {
            heading: "Huduma za wahusika wengine",
            body: [
              "Hatuuzi data zako wala hatuzipitishi kwa wahusika wengine (third parties) kwa madhumuni yao wenyewe. Huduma inategemea watoa huduma wafuatao, ambao kila mmoja huchakata data kwa mujibu wa kanuni zake mwenyewe:",
            ],
            bullets: [
              `Telegram — uendeshaji wa boti ${BOT}.`,
              "Cloudflare — ulinzi dhidi ya boti (Turnstile), uwasilishaji wa tovuti na uelekezaji wa barua pepe.",
              "Google Analytics na Google Tag Manager — takwimu za ziara.",
              "Yandex Metrica — takwimu za ziara, ramani ya mibofyo na Webvisor. Webvisor hurekodi vitendo kwenye ukurasa: mwendo wa kiashiria, usogezaji (scrolling) na mibofyo. Rekodi hizo hutumika tu kuchambua urahisi wa matumizi ya tovuti.",
            ],
          },
          {
            heading: "Muda wa kuhifadhi data",
            bullets: [
              "Faili zilizopakuliwa hufutwa kiotomatiki kutoka kwenye seva takriban saa moja baada ya kuundwa. Hatuhifadhi kumbukumbu (archive) ya video zako.",
              "Rekodi za majaribio ya upakuaji huhifadhiwa kwa muda unaohitajika kuzuia matumizi mabaya na kushughulikia maombi.",
              "Data za akaunti huhifadhiwa kwa muda wote unaotumia huduma na hufutwa kwa ombi lako.",
              "Kumbukumbu za seva huhifadhiwa kwa muda maalum na huandikwa upya kadiri zinavyozungushwa (log rotation).",
            ],
          },
          {
            heading: "Mahali data zinapochakatwa",
            body: [
              "Seva za huduma ziko katika kituo cha data ndani ya Umoja wa Ulaya. Baadhi ya watoa huduma waliotajwa hapo juu wanaweza kuchakata data nje yake kwa mujibu wa sera zao wenyewe.",
            ],
          },
          {
            heading: "Haki zako",
            body: [
              `Una haki ya kupata taarifa kuhusu uchakataji wa data zako, kudai zirekebishwe au zifutwe, kuondoa idhini yako na kupinga uchakataji. Kwa ajili hiyo, tuandikie kupitia ${MAIL} kutoka kwa anwani ya barua pepe au akaunti ya Telegram inayohusiana na ombi hilo.`,
              "Tunajibu ndani ya muda unaofaa, kwa kawaida ndani ya siku thelathini za kalenda. Kufutwa kwa akaunti kunajumuisha kufutwa kwa historia ya upakuaji inayohusiana nayo.",
            ],
          },
          {
            heading: "Watoto",
            body: [
              "Huduma haikusudiwi kwa watoto walio chini ya umri wa miaka 16 wala haielekezwi kwao. Kwa makusudi hatukusanyi data za watumiaji kama hao; ikiwa hilo limetokea kwa makosa, tuandikie na data hizo zitafutwa.",
            ],
          },
          {
            heading: "Mabadiliko",
            body: [
              "Tunaweza kusasisha Sera hii. Tarehe ya toleo linalotumika imeonyeshwa juu ya ukurasa; mabadiliko muhimu tutayaashiria ndani ya huduma.",
            ],
          },
        ],
      },
      terms: {
        title: "Masharti ya Matumizi",
        summary: `Kanuni za matumizi ya ${operator.site}: kinachoruhusiwa, kisichoruhusiwa, na masharti ambayo huduma inafanya kazi kwayo.`,
        sections: [
          {
            heading: "Masharti ya jumla",
            body: [
              `Masharti haya yanasimamia matumizi ya tovuti ya ${operator.site} na boti ya Telegram ${BOT}. Mmiliki na msimamizi wa huduma ni ${operator.nameSw}.`,
              "Kwa kuanza kutumia huduma, unathibitisha kwamba umesoma Masharti haya na unayakubali. Ikiwa sharti lolote halikufai, tafadhali usitumie huduma.",
            ],
          },
          {
            heading: "Huduma ni bure",
            body: [
              "Huduma zote zinazotolewa ni bure. Hakuna usajili wa kulipia (subscriptions), mipango ya kulipia, ubora wa video wa kulipia wala ununuzi ndani ya huduma.",
              "Hatuonyeshi matangazo na hatuweki viungo vya ushirika (affiliate links).",
            ],
          },
          {
            heading: "Masharti ya ufikiaji",
            bullets: [
              "Kupakua kwenye tovuti hakuhitaji akaunti wala kuingia. Boti hutofautisha watumiaji kwa akaunti zao za Telegram.",
              "Vikomo vya kiufundi vya marudio ya maombi hulinda huduma dhidi ya kuzidiwa na matumizi mabaya ya kiotomatiki.",
              "Upakuaji kutoka YouTube una kikomo cha kila siku cha trafiki: 10 GB kwa saa 24 kwa kila mtandao kwenye tovuti na kwenye kiendelezi, na 25 GB kwa saa 24 kwa kila akaunti ya Telegram kwenye boti. Majukwaa mengine hayaathiriwi.",
              "Si lazima kujiunga na chaneli yetu ili kupakua kupitia boti. Boti huongeza kiungo cha chaneli ya habari ya mradi katika maelezo ya faili; kujiunga nayo ni hiari.",
            ],
          },
          {
            heading: "Huduma inafanya nini",
            body: [
              "Huduma hufanya kazi kama mpatanishi wa kiufundi (technical intermediary): kupitia kiungo unachotoa, hufikia ukurasa unaopatikana kwa umma, hupata faili la midia na kukupatia.",
              "Hatuhifadhi katalogi ya video, hatufanyi utafutaji katika maudhui ya watu wengine, na hatuhifadhi faili zilizopakuliwa kwa muda mrefu kuliko unaohitajika kwa uwasilishaji — takriban saa moja.",
              "Upatikanaji wa jukwaa fulani hutegemea maamuzi ya kiufundi ya jukwaa hilo na unaweza kubadilika bila taarifa.",
            ],
          },
          {
            heading: "Wajibu wa mtumiaji",
            body: [
              "Wewe peke yako unawajibika kwa jinsi unavyotumia faili unazopata, na unathibitisha kwamba una haki ya kufanya hivyo.",
            ],
            bullets: [
              "Pakua tu maudhui ambayo haki zake ni zako, au ambayo matumizi yake yameruhusiwa na mmiliki wa haki au na sheria.",
              "Usitumie huduma kukiuka hakimiliki na haki shirikishi (related rights), kusambaza maudhui yaliyopigwa marufuku au kukiuka haki za wahusika wengine.",
              "Usijaribu kukwepa vikomo vya kiufundi vya huduma, ikiwa ni pamoja na vikomo vya marudio ya maombi na ukaguzi dhidi ya boti.",
              "Usisababishe mzigo wa kiotomatiki: maombi ya wingi, hati za programu (scripts) na zana za kuvuna data (scrapers) haziruhusiwi.",
            ],
          },
          {
            heading: "Uchapishaji wa viungo kwenye chaneli",
            body: [
              "Kwa kupakua video kupitia boti, unakubali kwamba kiungo cha chapisho asili kitachapishwa kwenye chaneli yetu ya Telegram. Tahadhari kuhusu hili huonyeshwa kwenye boti kabla ya kuchagua ubora — yaani, kabla hujafanya uamuzi wa kupakua.",
              "Uchapishaji hufanywa bila kutaja utambulisho: chaneli hupokea kiungo cha ukurasa unaopatikana kwa umma, kichwa cha video na picha yake ya jalada — fremu ileile ambayo jukwaa huonyesha katika onyesho la awali la chapisho. Haielezwi ni nani aliyepakua video. Faili la video lenyewe halichapishwi popote wala wakati wowote: kinachosambazwa ni kiungo, ambacho majukwaa yenyewe yanaalika kisambazwe kupitia kitufe cha «Shiriki» (Share) chini ya kila chapisho.",
              "Kiungo kilekile huchapishwa si zaidi ya mara moja. Ikiwa hutaki kiungo kifike kwenye chaneli, usipakue video hiyo kupitia huduma yetu.",
              "Viungo kutoka kwenye vikundi, pamoja na machapisho yaliyopakuliwa kupitia akaunti iliyounganishwa, havichapishwi kwenye chaneli.",
            ],
          },
          {
            heading: "Kuunganisha akaunti yako",
            body: [
              "Kwa kuunganisha akaunti yako ya jukwaa na boti, unathibitisha kwamba akaunti hiyo ni yako na kwamba una haki ya kuitumia kwa njia hii.",
              "Majukwaa hayaridhii upakuaji wa kiotomatiki na yanaweza kuwekea vikwazo au kufungia akaunti iliyounganishwa. Unakubali hatari hii; tunapendekeza kuunganisha akaunti ya ziada badala ya akaunti yako kuu. Hatuwajibiki kwa vikwazo ambavyo jukwaa litaweka kwenye akaunti yako.",
              "Akaunti iliyounganishwa kwenye kikundi hutumika kwa upakuaji wa wanachama wake wote. Wasimamizi wa kikundi huamua nani anaweza kuunganisha akaunti na wanaweza kuondoa yoyote kati ya hizo.",
            ],
          },
          {
            heading: "Ukomo wa dhima",
            body: [
              "Huduma inatolewa «kama ilivyo» (as is). Hatutoi hakikisho la utendaji usiokatizwa, la upatikanaji wa jukwaa fulani, wala la kufaa kwa faili kwa madhumuni yako.",
              "Hatuwajibiki kwa jinsi unavyotumia maudhui uliyopakua, wala kwa matokeo ya ukiukaji wako wa haki za wahusika wengine.",
              "Tuna haki ya kubadilisha huduma zinazotolewa, kusimamisha huduma kwa muda kwa ajili ya matengenezo na kusitisha uendeshaji wake.",
            ],
          },
          {
            heading: "Kuzuia ufikiaji",
            body: [
              "Tunaweza kuzuia au kusitisha ufikiaji wa huduma pale Masharti haya yanapokiukwa, pale kunapokuwa na majaribio ya kukwepa vikomo, au tunapopokea malalamiko yenye msingi kutoka kwa mmiliki wa haki.",
            ],
          },
          {
            heading: "Mabadiliko na sheria inayotumika",
            body: [
              "Tunaweza kurekebisha Masharti haya; tarehe ya toleo linalotumika imeonyeshwa juu ya ukurasa. Kuendelea kutumia huduma baada ya mabadiliko kunamaanisha kwamba unakubali toleo jipya.",
              "Mahusiano ya pande husika yanasimamiwa na sheria za Jamhuri ya Kazakhstan. Pande zitajitahidi kutatua migogoro kwa njia ya mawasiliano ya maandishi, na zisipofikia makubaliano — kwa utaratibu uliowekwa na sheria za Jamhuri ya Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Sera ya Vidakuzi",
        summary: `Ni vidakuzi gani ${operator.site} hutumia, ni vya nini na jinsi ya kuvikataa.`,
        sections: [
          {
            heading: "Vidakuzi ni nini",
            body: [
              "Vidakuzi (cookies) ni faili ndogo za maandishi ambazo tovuti huhifadhi kwenye kivinjari chako. Huwezesha huduma kukumbuka mipangilio yako na kukusanya takwimu za ziara zisizomtambulisha mtu.",
              "Pamoja na vidakuzi, hati hii pia inashughulikia teknolojia zinazohusiana: hifadhi ya ndani ya kivinjari (local storage) na pikseli za ufuatiliaji.",
            ],
          },
          {
            heading: "Vidakuzi vya lazima kabisa",
            body: ["Bila hivi huduma haifanyi kazi, kwa hiyo huwekwa kila wakati."],
            bullets: [
              "Cloudflare Turnstile — hukagua kwamba kiungo kinatumwa na binadamu na si na hati ya programu (script).",
              "Mipangilio ya kiolesura — lugha na mandhari ya rangi uliyochagua.",
            ],
          },
          {
            heading: "Vidakuzi vya takwimu",
            body: [
              "Hutusaidia kuona ni kurasa zipi zinatumika na wapi hitilafu hutokea. Huwekwa kwa idhini yako na havihitajiki ili huduma ifanye kazi.",
            ],
            bullets: [
              "Google Analytics na Google Tag Manager — idadi ya ziara na tabia kwenye tovuti bila kumtambulisha mtu.",
              "Yandex Metrica — idadi ya ziara, ramani ya mibofyo na Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor ya Yandex Metrica hurekodi vitendo kwenye ukurasa: mwendo wa kiashiria, usogezaji, mibofyo na uandishi katika sehemu ya kiungo. Hii inahitajika ili tuone mahali kiolesura kinapowachanganya watu.",
              "Hatutumii rekodi hizi kufuatilia watu mahususi. Tafadhali usiingize katika sehemu za tovuti taarifa ambazo usingependa zihifadhiwe.",
            ],
          },
          {
            heading: "Jinsi ya kukataa",
            bullets: [
              "Zuia au futa vidakuzi katika mipangilio ya kivinjari chako — njia hii inafanya kazi kwa mifumo yote iliyotajwa hapa.",
              "Google Analytics: kiongezi rasmi cha kivinjari kinachozima ukusanyaji kinapatikana kwenye tovuti ya Google.",
              "Yandex Metrica: kujiondoa kunawezekana kupitia kiongezi rasmi cha Yandex.",
              "Kuzima vidakuzi vya lazima kabisa kutafanya upakuaji usiwezekane.",
            ],
          },
          {
            heading: "Muda wa kuhifadhi",
            body: [
              "Vidakuzi vya kipindi (session cookies) hufutwa unapofunga kivinjari au muda wa kipindi unapoisha. Zana za takwimu huhifadhi vitambulisho vyao kwa muda uliowekwa na watoa huduma wao.",
            ],
          },
        ],
      },
      copyright: {
        title: "Hakimiliki",
        summary: "Msimamo wa huduma kuhusu hakimiliki na utaratibu wa kuwasilisha malalamiko ya ukiukaji.",
        sections: [
          {
            heading: "Msimamo wetu",
            body: [
              "Huduma haihifadhi video wala haina katalogi ya video. Hufanya kazi kama mpatanishi wa kiufundi: kupitia kiungo ambacho mtumiaji ameingiza, hufikia ukurasa unaopatikana kwa umma na kumpatia mtumiaji huyo faili.",
              "Faili zilizopakuliwa hukaa kwenye seva kwa takriban saa moja kisha hufutwa kiotomatiki. Hakuna nakala ya kudumu ya maudhui ya watu wengine inayobaki kwetu.",
              "Jukumu la matumizi ya maudhui yaliyopakuliwa ni la mtumiaji, kama ilivyoelezwa waziwazi katika Masharti ya Matumizi.",
            ],
          },
          {
            heading: "Ikiwa haki zako zimekiukwa",
            body: [
              `Ikiwa wewe ni mmiliki wa haki au mwakilishi wake na unaamini kwamba huduma inatumika kukiuka haki zako, tuandikie kupitia ${MAIL}. Tunashughulikia malalamiko kama hayo na kuchukua hatua.`,
            ],
          },
          {
            heading: "Mambo ya kujumuisha katika malalamiko",
            bullets: [
              "Ni kazi gani inahusika na kwa msingi gani una haki juu yake.",
              "Kiungo cha maudhui na, ikiwa yanajulikana, mazingira ya ukiukaji.",
              "Maelezo yako ya mawasiliano: jina au jina la taasisi, anwani na anwani ya barua pepe.",
              "Ikiwa unatenda kwa niaba ya mmiliki wa haki — uthibitisho wa mamlaka yako.",
              "Tamko kwamba taarifa zilizo katika malalamiko ni sahihi na kwamba matumizi ya maudhui hayajaruhusiwa na mmiliki wa haki wala na sheria.",
            ],
          },
          {
            heading: "Tutakachofanya",
            body: [
              "Tunapitia malalamiko ndani ya muda unaofaa, kwa kawaida ndani ya siku thelathini za kalenda, na ukiukaji ukithibitishwa tunaweka vikwazo kwenye ufikiaji wa maudhui hayo kupitia huduma na, inapobidi, kwenye ufikiaji wa mkiukaji kwenye huduma.",
              "Tutakujulisha matokeo ya uchunguzi kupitia anwani ya barua pepe uliyotoa.",
            ],
          },
          {
            heading: "Malalamiko yenye nia mbaya",
            body: [
              "Malalamiko yenye taarifa ambazo zinajulikana kuwa si za kweli yanaweza kumsababishia mlalamikaji dhima ya kisheria kwa mujibu wa sheria inayotumika. Tuna haki ya kukataa kushughulikia malalamiko ambayo hayawezeshi kumtambua mmiliki wa haki wala maudhui yanayobishaniwa.",
            ],
          },
        ],
      },
    },
  },
};
