import { operator } from "./operator";
import { LegalByLanguage } from "./types";

// Тексты документов на сорока пяти языках. Держим отдельно от lib/i18n/translations.ts:
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

  de: {
    ui: {
      updated: "Stand",
      back: "Zur Startseite",
      operatorHeading: "Betreiber des Dienstes",
      navHeading: "Weitere Dokumente",
      labels: {
        privacy: "Datenschutzerklärung",
        terms: "Nutzungsbedingungen",
        cookies: "Cookie-Richtlinie",
        copyright: "Für Rechteinhaber",
      },
    },
    docs: {
      privacy: {
        title: "Datenschutzerklärung",
        summary: `Welche Daten ${operator.site} erhebt, wozu sie benötigt werden, wie lange sie gespeichert werden und wie Sie sie löschen lassen können.`,
        sections: [
          {
            heading: "Allgemeines",
            body: [
              `Diese Datenschutzerklärung beschreibt, welche personenbezogenen Daten der Dienst ${operator.site} verarbeitet und zu welchem Zweck. Verantwortlicher für die Datenverarbeitung ist ${operator.nameDe}.`,
              "Indem Sie den Dienst nutzen, erklären Sie sich mit der hier beschriebenen Verarbeitung einverstanden. Sind Sie damit nicht einverstanden, nutzen Sie den Dienst bitte nicht.",
              "Die Verarbeitung erfolgt gemäß dem Gesetz der Republik Kasachstan „Über personenbezogene Daten und deren Schutz“ und in Bezug auf Besucher aus dem Europäischen Wirtschaftsraum unter Berücksichtigung der Anforderungen der DSGVO.",
            ],
          },
          {
            heading: "Welche Daten wir verarbeiten",
            body: [
              "Wir erheben bewusst nichts über das hinaus, was für den Betrieb des Dienstes erforderlich ist, und fordern keine Ausweisdokumente, Zahlungsdaten oder Postanschriften an.",
            ],
            bullets: [
              "Daten Ihres Telegram-Kontos, die der Bot erhält, wenn Sie ihm schreiben: numerische Kennung, Benutzername, Vorname und Sprachcode.",
              "Die Links, die Sie zum Herunterladen übermitteln, und Angaben zum jeweiligen Downloadversuch: Plattform, Datum und Uhrzeit, gewählte Qualität sowie Ergebnis (Erfolg oder Fehler).",
              "Technische Verbindungsdaten: IP-Adresse, Browsertyp und -version, Sprache und verweisende Seite. Diese gelangen in die Serverprotokolle und in die Webanalysedienste.",
              "Cookies und Analysekennungen – Näheres dazu in der Cookie-Richtlinie.",
            ],
          },
          {
            heading: "Wozu wir die Daten benötigen",
            bullets: [
              "Zur Erbringung des Dienstes selbst: das Video unter Ihrem Link abzurufen und Ihnen die Datei bereitzustellen.",
              "Um Ihr Konto von dem anderer Personen zu unterscheiden und Missbrauch entgegenzuwirken.",
              "Zum Schutz des Dienstes vor automatisiertem Missbrauch durch die Prüfung mit Cloudflare Turnstile vor dem Absenden eines Links.",
              "Um zu verstehen, wie die Website genutzt wird, und Fehler zu beheben – anhand anonymisierter und aggregierter Statistiken.",
              "Zur Beantwortung Ihrer Anfragen und der Anfragen von Rechteinhabern.",
              "Um Ihnen gelegentlich über Telegram zu schreiben und Sie nach Ihrer Meinung zum Dienst zu fragen – etwa wenn Sie ihn nicht mehr nutzen. Eine Antwort ist freiwillig; wünschen Sie solche Nachrichten nicht, teilen Sie uns dies einfach mit, und wir schreiben Ihnen nicht mehr.",
            ],
          },
          {
            heading: "Rechtsgrundlagen der Verarbeitung",
            body: [
              "Die Daten Ihres Telegram-Kontos und die Angaben zu Downloads werden zur Erfüllung der Nutzungsbedingungen verarbeitet, die Sie mit Beginn der Nutzung des Dienstes annehmen.",
              "Analyse-Cookies und die Aufzeichnung von Aktivitäten auf der Website werden auf Grundlage Ihrer Einwilligung verarbeitet, die Sie jederzeit widerrufen können – wie, ist in der Cookie-Richtlinie beschrieben.",
              "Serverprotokolle und der Schutz vor Bots beruhen auf unserem berechtigten Interesse, den Dienst funktionsfähig und sicher zu halten.",
              "Fragen nach Ihrer Meinung zum Dienst beruhen auf unserem berechtigten Interesse, den Dienst zu verbessern; Sie können ihnen jederzeit widersprechen.",
            ],
          },
          {
            heading: "Verbundene Konten",
            body: [
              "Auf Wunsch können Sie Ihr Konto auf einer Plattform (Instagram, Facebook, YouTube, X, VK, TikTok) mit dem Bot verbinden, damit dieser Beiträge herunterlädt, die nur angemeldeten Nutzern angezeigt werden: Stories, nicht öffentliche Beiträge. Dazu erhält der Bot die Cookies dieses Kontos – von der Videoner-Erweiterung über einen Einmalcode oder aus einer Datei, die Sie übermittelt haben.",
              "Wir speichern nur die Cookies der gewählten Plattform und verwerfen alle übrigen sofort. Sie werden verschlüsselt gespeichert und ausschließlich für Downloads dort verwendet, wo Sie sie verbunden haben. Im privaten Chat verbundene Cookies dienen Ihren Downloads, einschließlich Ihrer eigenen Links in Gruppen, in denen kein eigenes Konto verbunden ist; für Links anderer Personen werden sie nicht verwendet. Mit einer Gruppe verbundene Cookies dienen den Downloads ihrer Mitglieder und nirgendwo sonst.",
              "Rechtsgrundlage ist Ihre Einwilligung: Sie verbinden das Konto selbst und können es jederzeit mit dem Befehl /accounts entfernen. Beim Entfernen werden die Cookies unwiderruflich gelöscht. Akzeptiert die Plattform die Anmeldung nicht mehr, teilt der Bot Ihnen dies mit.",
              "Über ein verbundenes Konto heruntergeladene Beiträge werden nicht in unserem Kanal veröffentlicht und anderen Nutzern nicht aus dem gemeinsamen Cache bereitgestellt.",
            ],
          },
          {
            heading: "Dienste Dritter",
            body: [
              "Wir verkaufen Ihre Daten nicht und geben sie nicht an Dritte für deren eigene Zwecke weiter. Für den Betrieb des Dienstes werden die folgenden Anbieter eingesetzt, die Daten jeweils nach ihren eigenen Regeln verarbeiten:",
            ],
            bullets: [
              `Telegram – Betrieb des Bots ${BOT}.`,
              "Cloudflare – Schutz vor Bots (Turnstile), Auslieferung der Website und E-Mail-Weiterleitung.",
              "Google Analytics und Google Tag Manager – Besuchsstatistiken.",
              "Yandex Metrica – Besuchsstatistiken, Klickkarte und Webvisor. Webvisor zeichnet Aktivitäten auf der Seite auf: Mauszeigerbewegungen, Scrollen und Klicks. Die Aufzeichnungen werden ausschließlich zur Analyse der Benutzerfreundlichkeit der Website verwendet.",
            ],
          },
          {
            heading: "Wie lange wir Daten speichern",
            bullets: [
              "Heruntergeladene Dateien werden etwa eine Stunde nach ihrer Erstellung automatisch vom Server gelöscht. Wir führen kein Archiv Ihrer Videos.",
              "Aufzeichnungen über Downloadversuche werden so lange gespeichert, wie dies zur Missbrauchsabwehr und zur Bearbeitung von Anfragen erforderlich ist.",
              "Kontodaten werden gespeichert, solange Sie den Dienst nutzen, und auf Ihren Wunsch gelöscht.",
              "Serverprotokolle werden für begrenzte Zeit gespeichert und im Rahmen der Rotation überschrieben.",
            ],
          },
          {
            heading: "Wo die Daten verarbeitet werden",
            body: [
              "Die Server des Dienstes befinden sich in einem Rechenzentrum innerhalb der Europäischen Union. Einige der oben genannten Anbieter können Daten gemäß ihren eigenen Richtlinien auch außerhalb der EU verarbeiten.",
            ],
          },
          {
            heading: "Ihre Rechte",
            body: [
              `Sie haben das Recht, Auskunft über die Verarbeitung Ihrer Daten zu erhalten, deren Berichtigung oder Löschung zu verlangen, Ihre Einwilligung zu widerrufen und der Verarbeitung zu widersprechen. Schreiben Sie dazu an ${MAIL} von der E-Mail-Adresse oder dem Telegram-Konto aus, auf die sich Ihr Anliegen bezieht.`,
              "Wir antworten innerhalb einer angemessenen Frist, in der Regel innerhalb von dreißig Kalendertagen. Mit der Löschung eines Kontos wird auch der damit verbundene Downloadverlauf gelöscht.",
            ],
          },
          {
            heading: "Minderjährige",
            body: [
              "Der Dienst ist nicht für Kinder unter 16 Jahren bestimmt und richtet sich nicht an sie. Wir erheben wissentlich keine Daten solcher Nutzer; sollte dies versehentlich geschehen sein, schreiben Sie uns, und die Daten werden gelöscht.",
            ],
          },
          {
            heading: "Änderungen",
            body: [
              "Wir können diese Datenschutzerklärung aktualisieren. Das Datum der aktuellen Fassung ist oben auf der Seite angegeben; auf wesentliche Änderungen weisen wir im Dienst hin.",
            ],
          },
        ],
      },
      terms: {
        title: "Nutzungsbedingungen",
        summary: `Die Regeln für die Nutzung von ${operator.site}: was erlaubt ist, was nicht und zu welchen Bedingungen der Dienst betrieben wird.`,
        sections: [
          {
            heading: "Allgemeines",
            body: [
              `Diese Nutzungsbedingungen regeln die Nutzung der Website ${operator.site} und des Telegram-Bots ${BOT}. Inhaber und Betreiber des Dienstes ist ${operator.nameDe}.`,
              "Mit Beginn der Nutzung des Dienstes bestätigen Sie, dass Sie diese Bedingungen gelesen haben und sie annehmen. Ist eine der Bedingungen für Sie nicht annehmbar, sollten Sie den Dienst nicht nutzen.",
            ],
          },
          {
            heading: "Der Dienst ist kostenlos",
            body: [
              "Alle Funktionen des Dienstes werden kostenlos bereitgestellt. Es gibt keine Abonnements, kostenpflichtigen Tarife, kostenpflichtigen Videoqualitäten oder In-App-Käufe.",
              "Wir zeigen keine Werbung und platzieren keine Affiliate-Links.",
            ],
          },
          {
            heading: "Zugangsbedingungen",
            bullets: [
              "Für Downloads auf der Website sind weder ein Konto noch eine Anmeldung erforderlich. Der Bot unterscheidet Nutzer anhand ihres Telegram-Kontos.",
              "Technische Begrenzungen der Anfragehäufigkeit schützen den Dienst vor Überlastung und automatisiertem Missbrauch.",
              "Für YouTube gilt ein tägliches Datenvolumenlimit: 10 GB pro 24 Stunden je Netzwerk auf der Website und in der Erweiterung sowie 25 GB pro 24 Stunden je Telegram-Konto im Bot. Andere Plattformen sind davon nicht betroffen.",
              "Für Downloads über den Bot ist kein Abonnement unseres Kanals erforderlich. Der Bot fügt den Dateibeschriftungen einen Link zum Nachrichtenkanal des Projekts hinzu; ein Abonnement ist freiwillig.",
            ],
          },
          {
            heading: "Was der Dienst tut",
            body: [
              "Der Dienst ist ein technischer Vermittler: Über den von Ihnen angegebenen Link ruft er eine öffentlich zugängliche Seite auf, erhält die Mediendatei und übermittelt sie Ihnen.",
              "Wir hosten keinen Videokatalog, betreiben keine Suche in fremden Inhalten und speichern heruntergeladene Dateien nicht länger, als für die Übermittlung erforderlich ist – etwa eine Stunde.",
              "Ob eine bestimmte Plattform verfügbar ist, hängt von deren technischen Entscheidungen ab und kann sich ohne Vorankündigung ändern.",
            ],
          },
          {
            heading: "Pflichten des Nutzers",
            body: [
              "Sie allein sind dafür verantwortlich, wie Sie die erhaltenen Dateien verwenden, und bestätigen, dass Sie dazu berechtigt sind.",
            ],
            bullets: [
              "Laden Sie nur Material herunter, an dem Sie selbst die Rechte innehaben oder dessen Nutzung der Rechteinhaber oder das Gesetz erlaubt.",
              "Nutzen Sie den Dienst nicht, um Urheberrechte oder verwandte Schutzrechte zu verletzen, verbotene Inhalte zu verbreiten oder Rechte Dritter zu verletzen.",
              "Versuchen Sie nicht, die technischen Begrenzungen des Dienstes zu umgehen, einschließlich der Begrenzung der Anfragehäufigkeit und der Bot-Prüfung.",
              "Erzeugen Sie keine automatisierte Last: Massenanfragen, Skripte und Scraper sind nicht zulässig.",
            ],
          },
          {
            heading: "Veröffentlichung von Links im Kanal",
            body: [
              "Wenn Sie ein Video über den Bot herunterladen, erklären Sie sich damit einverstanden, dass der Link zum ursprünglichen Beitrag in unserem Telegram-Kanal veröffentlicht wird. Ein Hinweis darauf wird im Bot angezeigt, bevor Sie die Qualität wählen – also bevor Sie sich für den Download entscheiden.",
              "Die Veröffentlichung erfolgt anonym: In den Kanal gelangen der Link zur öffentlich zugänglichen Seite, der Titel des Videos und sein Vorschaubild – dasselbe Bild, das die Plattform in der Vorschau des Beitrags anzeigt. Wer das Video heruntergeladen hat, wird nicht angegeben. Die Videodatei selbst wird nie und nirgends veröffentlicht: Weitergegeben wird der Link, zu dessen Weitergabe die Plattformen selbst mit der Schaltfläche „Teilen“ unter jedem Beitrag einladen.",
              "Derselbe Link wird höchstens einmal veröffentlicht. Wenn Sie nicht möchten, dass ein Link in den Kanal gelangt, laden Sie dieses Video nicht über unseren Dienst herunter.",
              "Links aus Gruppen und über ein verbundenes Konto heruntergeladene Beiträge werden im Kanal nicht veröffentlicht."
            ],
          },
          {
            heading: "Verbinden Ihres Kontos",
            body: [
              "Indem Sie Ihr Konto auf einer Plattform mit dem Bot verbinden, bestätigen Sie, dass es sich um Ihr Konto handelt und Sie berechtigt sind, darüber zu verfügen.",
              "Die Plattformen billigen automatisierte Downloads nicht und können ein verbundenes Konto einschränken oder sperren. Dieses Risiko tragen Sie selbst; wir empfehlen, ein separates Zweitkonto statt Ihres Hauptkontos zu verbinden. Für Einschränkungen, die eine Plattform Ihrem Konto auferlegt, übernehmen wir keine Haftung.",
              "Ein mit einer Gruppe verbundenes Konto wird für die Downloads aller ihrer Mitglieder verwendet. Die Administratoren der Gruppe entscheiden, wer Konten verbinden darf, und können jedes davon entfernen.",
            ],
          },
          {
            heading: "Haftungsbeschränkung",
            body: [
              "Der Dienst wird „wie besehen“ bereitgestellt. Wir gewährleisten weder einen unterbrechungsfreien Betrieb noch die Verfügbarkeit einer bestimmten Plattform oder die Eignung einer Datei für Ihre Zwecke.",
              "Wir haften nicht dafür, wie Sie mit dem heruntergeladenen Material verfahren, und nicht für die Folgen einer Verletzung von Rechten Dritter durch Sie.",
              "Wir sind berechtigt, den Funktionsumfang zu ändern, den Betrieb des Dienstes für Wartungsarbeiten zu unterbrechen und ihn einzustellen.",
            ],
          },
          {
            heading: "Beschränkung des Zugangs",
            body: [
              "Wir können den Zugang zum Dienst bei Verstößen gegen diese Bedingungen, bei Versuchen, Begrenzungen zu umgehen, sowie bei Eingang einer begründeten Beschwerde eines Rechteinhabers einschränken oder beenden.",
            ],
          },
          {
            heading: "Änderungen und anwendbares Recht",
            body: [
              "Wir können diese Bedingungen ändern; das Datum der geltenden Fassung ist oben auf der Seite angegeben. Wenn Sie den Dienst nach einer Änderung weiter nutzen, nehmen Sie die neue Fassung an.",
              "Auf das Verhältnis der Parteien findet das Recht der Republik Kasachstan Anwendung. Die Parteien bemühen sich, Streitigkeiten auf dem Korrespondenzweg beizulegen, und, falls keine Einigung erzielt wird, in dem durch die Gesetzgebung der Republik Kasachstan vorgesehenen Verfahren.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie-Richtlinie",
        summary: `Welche Cookies ${operator.site} verwendet, wozu sie dienen und wie Sie sie ablehnen können.`,
        sections: [
          {
            heading: "Was Cookies sind",
            body: [
              "Cookies sind kleine Textdateien, die eine Website in Ihrem Browser speichert. Sie ermöglichen es, Ihre Einstellungen zu speichern und anonymisierte Besuchsstatistiken zu erheben.",
              "Neben Cookies behandelt dieses Dokument auch verwandte Technologien – den lokalen Speicher des Browsers und Zählpixel.",
            ],
          },
          {
            heading: "Unbedingt erforderliche",
            body: [
              "Ohne sie funktioniert der Dienst nicht, daher werden sie stets gesetzt.",
            ],
            bullets: [
              "Cloudflare Turnstile – Prüfung, dass ein Link von einem Menschen und nicht von einem Skript übermittelt wird.",
              "Oberflächeneinstellungen – gewählte Sprache und Farbschema.",
            ],
          },
          {
            heading: "Analyse",
            body: [
              "Sie helfen zu verstehen, welche Seiten genutzt werden und wo Fehler auftreten. Sie werden mit Ihrer Einwilligung gesetzt und sind für den Betrieb des Dienstes nicht erforderlich.",
            ],
            bullets: [
              "Google Analytics und Google Tag Manager – Besucherzahlen und Verhalten auf der Website in anonymisierter Form.",
              "Yandex Metrica – Besucherzahlen, Klickkarte und Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor von Yandex Metrica zeichnet Aktivitäten auf der Seite auf: Mauszeigerbewegungen, Scrollen, Klicks und Eingaben in das Linkfeld. Dies dient dazu, zu erkennen, wo die Oberfläche Nutzer verwirrt.",
              "Wir verwenden diese Aufzeichnungen nicht, um bestimmte Personen zu verfolgen. Geben Sie in die Felder der Website keine Informationen ein, die nicht gespeichert werden sollen.",
            ],
          },
          {
            heading: "Wie Sie widersprechen können",
            bullets: [
              "Richten Sie in Ihrem Browser das Blockieren oder Löschen von Cookies ein – dies wirkt für alle hier genannten Systeme.",
              "Google Analytics: Das offizielle Browser-Add-on zur Deaktivierung der Datenerhebung ist auf der Website von Google erhältlich.",
              "Yandex Metrica: Ein Widerspruch ist über das offizielle Add-on von Yandex möglich.",
              "Das Deaktivieren unbedingt erforderlicher Cookies macht das Herunterladen unmöglich.",
            ],
          },
          {
            heading: "Speicherdauer",
            body: [
              "Sitzungscookies werden beim Schließen des Browsers oder mit Ablauf der Sitzung gelöscht. Analysedienste speichern ihre Kennungen für die von ihren Anbietern festgelegten Zeiträume.",
            ],
          },
        ],
      },
      copyright: {
        title: "Für Rechteinhaber",
        summary: "Die Haltung des Dienstes zum Urheberrecht und das Verfahren zur Einreichung einer Beschwerde über eine Rechtsverletzung.",
        sections: [
          {
            heading: "Haltung des Dienstes",
            body: [
              "Der Dienst hostet keine Videos und führt keinen Katalog. Er ist ein technischer Vermittler: Über den vom Nutzer eingegebenen Link ruft er eine öffentlich zugängliche Seite auf und übermittelt dem Nutzer die Datei.",
              "Heruntergeladene Dateien verbleiben etwa eine Stunde auf dem Server und werden dann automatisch gelöscht. Eine dauerhafte Kopie fremder Inhalte verbleibt bei uns nicht.",
              "Die Verantwortung für die Verwendung des heruntergeladenen Materials trägt der Nutzer – dies ist in den Nutzungsbedingungen ausdrücklich festgelegt.",
            ],
          },
          {
            heading: "Wenn Ihre Rechte verletzt werden",
            body: [
              `Wenn Sie Rechteinhaber oder dessen Vertreter sind und der Ansicht sind, dass der Dienst zur Verletzung Ihrer Rechte genutzt wird, schreiben Sie an ${MAIL}. Wir prüfen solche Beschwerden und ergreifen Maßnahmen.`,
            ],
          },
          {
            heading: "Was Ihre Beschwerde enthalten sollte",
            bullets: [
              "Welches Werk betroffen ist und auf welcher Grundlage Sie Rechte daran innehaben.",
              "Einen Link zum Material und, soweit bekannt, die Umstände der Rechtsverletzung.",
              "Ihre Kontaktdaten: Name bzw. Firma, Anschrift und E-Mail-Adresse.",
              "Wenn Sie im Namen eines Rechteinhabers handeln – einen Nachweis Ihrer Vertretungsbefugnis.",
              "Eine Erklärung, dass die Angaben in der Beschwerde zutreffend sind und die Nutzung des Materials weder vom Rechteinhaber noch durch das Gesetz gestattet ist.",
            ],
          },
          {
            heading: "Was wir tun",
            body: [
              "Wir prüfen eine Beschwerde innerhalb einer angemessenen Frist, in der Regel innerhalb von dreißig Kalendertagen, und beschränken bei bestätigter Rechtsverletzung den Zugang zu dem Material über den Dienst und erforderlichenfalls den Zugang des Rechtsverletzers zum Dienst.",
              "Über das Ergebnis der Prüfung informieren wir Sie an die von Ihnen angegebene E-Mail-Adresse.",
            ],
          },
          {
            heading: "Missbräuchliche Beschwerden",
            body: [
              "Eine Beschwerde mit wissentlich unwahren Angaben kann eine Haftung des Beschwerdeführers nach den geltenden Rechtsvorschriften nach sich ziehen. Wir sind berechtigt, die Prüfung einer Beschwerde abzulehnen, wenn sich aus ihr weder der Rechteinhaber noch das streitige Material ermitteln lässt.",
            ],
          },
        ],
      },
    },
  },
  fr: {
    ui: {
      updated: "Version du",
      back: "Retour à l’accueil",
      operatorHeading: "Exploitant du service",
      navHeading: "Autres documents",
      labels: {
        privacy: "Politique de confidentialité",
        terms: "Conditions d’utilisation",
        cookies: "Politique relative aux cookies",
        copyright: "Titulaires de droits",
      },
    },
    docs: {
      privacy: {
        title: "Politique de confidentialité",
        summary: `Quelles données ${operator.site} collecte, pourquoi elles sont nécessaires, combien de temps elles sont conservées et comment en obtenir la suppression.`,
        sections: [
          {
            heading: "Dispositions générales",
            body: [
              `La présente Politique décrit les données à caractère personnel traitées par le service ${operator.site} et les finalités de ce traitement. Le responsable du traitement est ${operator.nameFr}.`,
              "En utilisant le service, vous acceptez les modalités de traitement décrites ici. Si vous ne les acceptez pas, veuillez ne pas utiliser le service.",
              "Le traitement est effectué conformément à la loi de la République du Kazakhstan « sur les données personnelles et leur protection » et, à l’égard des visiteurs de l’Espace économique européen, en tenant compte des exigences du RGPD.",
            ],
          },
          {
            heading: "Données traitées",
            body: [
              "Nous ne collectons délibérément rien au-delà de ce qui est nécessaire au fonctionnement du service et ne demandons ni pièces d’identité, ni données de paiement, ni adresse.",
            ],
            bullets: [
              "Les données du compte Telegram que le bot reçoit lorsque vous lui écrivez : identifiant numérique, nom d’utilisateur, prénom et code de langue.",
              "Les liens que vous soumettez pour téléchargement et les informations relatives à la tentative elle-même : plateforme, date et heure, qualité choisie, résultat (succès ou erreur).",
              "Les données techniques de connexion : adresse IP, type et version du navigateur, langue, page de provenance. Elles sont enregistrées dans les journaux du serveur et dans les outils d’analyse d’audience.",
              "Les cookies et les identifiants d’analyse — pour plus de détails, voir la Politique relative aux cookies.",
            ],
          },
          {
            heading: "Finalités du traitement",
            bullets: [
              "Fournir le service lui-même : récupérer la vidéo à partir de votre lien et vous remettre le fichier.",
              "Distinguer votre compte de celui d’autrui et prévenir les abus.",
              "Protéger le service contre les abus automatisés : vérification Cloudflare Turnstile avant l’envoi d’un lien.",
              "Comprendre l’utilisation du site et corriger les erreurs, au moyen de statistiques anonymisées et agrégées.",
              "Répondre à vos demandes et à celles des titulaires de droits.",
              "Vous écrire occasionnellement sur Telegram pour recueillir votre avis sur le service — par exemple si vous avez cessé de l’utiliser. Vous n’êtes pas tenu de répondre ; si vous ne souhaitez pas recevoir de tels messages, il vous suffit de nous le dire et nous ne vous écrirons plus.",
            ],
          },
          {
            heading: "Bases juridiques du traitement",
            body: [
              "Les données du compte Telegram et les informations relatives aux téléchargements sont traitées pour l’exécution des Conditions d’utilisation, que vous acceptez en commençant à utiliser le service.",
              "Les cookies d’analyse et l’enregistrement des actions sur le site sont traités sur la base de votre consentement, que vous pouvez retirer à tout moment — les modalités sont décrites dans la Politique relative aux cookies.",
              "Les journaux du serveur et la protection contre les bots reposent sur notre intérêt légitime à maintenir le service opérationnel et sécurisé.",
              "Les demandes d’avis sur le service reposent sur notre intérêt légitime à améliorer le service ; vous pouvez vous y opposer à tout moment.",
            ],
          },
          {
            heading: "Comptes connectés",
            body: [
              "Si vous le souhaitez, vous pouvez connecter au bot votre compte sur une plateforme (Instagram, Facebook, YouTube, X, VK, TikTok) afin que le bot télécharge des publications visibles uniquement des utilisateurs connectés : stories, publications privées. Pour ce faire, le bot reçoit les cookies de ce compte — de l’extension Videoner au moyen d’un code à usage unique, ou à partir d’un fichier que vous avez envoyé.",
              "Nous ne conservons que les cookies de la plateforme choisie et supprimons immédiatement les autres. Ils sont stockés sous forme chiffrée et utilisés uniquement pour les téléchargements là où vous les avez connectés. Les cookies connectés dans votre conversation privée servent à vos téléchargements, y compris à vos propres liens dans les groupes auxquels aucun compte n’est connecté ; ils ne sont jamais utilisés pour les liens d’autres personnes. Les cookies connectés à un groupe servent aux téléchargements de ses membres et à rien d’autre.",
              "La base juridique est votre consentement : vous connectez le compte vous-même et pouvez le supprimer à tout moment avec la commande /accounts. Les cookies supprimés sont effacés de manière définitive. Si la plateforme cesse d’accepter la connexion, le bot vous en informe.",
              "Les publications téléchargées au moyen d’un compte connecté ne sont pas publiées dans notre canal et ne sont pas fournies à d’autres utilisateurs à partir du cache commun.",
            ],
          },
          {
            heading: "Services tiers",
            body: [
              "Nous ne vendons pas vos données et ne les transmettons pas à des tiers pour leurs propres finalités. Le fonctionnement du service fait appel aux prestataires suivants, chacun traitant les données selon ses propres règles :",
            ],
            bullets: [
              `Telegram — fonctionnement du bot ${BOT}.`,
              "Cloudflare — protection contre les bots (Turnstile), diffusion du site et routage du courrier électronique.",
              "Google Analytics et Google Tag Manager — statistiques de fréquentation.",
              "Yandex Metrica — statistiques de fréquentation, carte des clics et Webvisor. Webvisor enregistre les actions effectuées sur la page : mouvements du pointeur, défilement et clics. Les enregistrements sont utilisés uniquement pour analyser l’ergonomie du site.",
            ],
          },
          {
            heading: "Durée de conservation",
            bullets: [
              "Les fichiers téléchargés sont supprimés automatiquement du serveur environ une heure après leur création. Nous ne conservons aucune archive de vos vidéos.",
              "Les enregistrements des tentatives de téléchargement sont conservés aussi longtemps que nécessaire pour prévenir les abus et traiter les demandes.",
              "Les données du compte sont conservées tant que vous utilisez le service et sont supprimées sur votre demande.",
              "Les journaux du serveur sont conservés pendant une durée limitée et sont écrasés au fil de leur rotation.",
            ],
          },
          {
            heading: "Lieu de traitement des données",
            body: [
              "Les serveurs du service sont situés dans un centre de données sur le territoire de l’Union européenne. Certains des prestataires énumérés ci-dessus peuvent traiter des données en dehors de celle-ci conformément à leurs propres politiques.",
            ],
          },
          {
            heading: "Vos droits",
            body: [
              `Vous avez le droit d’obtenir des informations sur le traitement de vos données, d’en demander la rectification ou l’effacement, de retirer votre consentement et de vous opposer au traitement. Pour ce faire, écrivez à ${MAIL} depuis l’adresse électronique ou le compte Telegram concernés par la demande.`,
              "Nous répondons dans un délai raisonnable, en règle générale dans les trente jours calendaires. La suppression d’un compte entraîne la suppression de l’historique des téléchargements qui y est associé.",
            ],
          },
          {
            heading: "Mineurs",
            body: [
              "Le service n’est pas destiné aux enfants de moins de 16 ans et ne s’adresse pas à eux. Nous ne collectons pas sciemment les données de ces utilisateurs ; si cela s’est produit par erreur, écrivez-nous et les données seront supprimées.",
            ],
          },
          {
            heading: "Modifications",
            body: [
              "Nous pouvons mettre à jour la présente Politique. La date de la version en vigueur est indiquée en haut de la page ; les modifications substantielles seront signalées dans le service.",
            ],
          },
        ],
      },
      terms: {
        title: "Conditions d’utilisation",
        summary: `Les règles d’utilisation de ${operator.site} : ce qui est permis, ce qui ne l’est pas et à quelles conditions le service fonctionne.`,
        sections: [
          {
            heading: "Dispositions générales",
            body: [
              `Les présentes Conditions régissent l’utilisation du site ${operator.site} et du bot Telegram ${BOT}. Le propriétaire et l’exploitant du service est ${operator.nameFr}.`,
              "En commençant à utiliser le service, vous confirmez avoir lu les présentes Conditions et les accepter. Si l’une des conditions ne vous convient pas, vous ne devez pas utiliser le service.",
            ],
          },
          {
            heading: "Un service gratuit",
            body: [
              "Toutes les fonctionnalités du service sont fournies gratuitement. Il n’existe ni abonnements, ni formules payantes, ni qualités vidéo payantes, ni achats intégrés.",
              "Nous n’affichons pas de publicité et ne plaçons pas de liens d’affiliation.",
            ],
          },
          {
            heading: "Conditions d’accès",
            bullets: [
              "Le téléchargement sur le site ne nécessite ni compte ni connexion. Le bot distingue les utilisateurs par leur compte Telegram.",
              "Des limites techniques de fréquence des requêtes protègent le service contre la surcharge et les abus automatisés.",
              "Les téléchargements depuis YouTube sont soumis à une limite quotidienne de trafic : 10 Go par 24 heures par réseau sur le site et dans l’extension, et 25 Go par 24 heures par compte Telegram dans le bot. Les autres plateformes ne sont pas concernées.",
              "L’abonnement à notre canal n’est pas requis pour télécharger via le bot. Le bot ajoute dans la légende des fichiers un lien vers le canal d’actualités du projet ; l’abonnement à celui-ci est facultatif.",
            ],
          },
          {
            heading: "Fonctionnement du service",
            body: [
              "Le service agit en tant qu’intermédiaire technique : à partir du lien que vous fournissez, il accède à une page publiquement accessible, récupère le fichier multimédia et vous le transmet.",
              "Nous n’hébergeons aucun catalogue de vidéos, n’effectuons aucune recherche dans le contenu d’autrui et ne conservons pas les fichiers téléchargés au-delà du temps nécessaire à leur transmission, soit environ une heure.",
              "La disponibilité d’une plateforme donnée dépend des choix techniques de celle-ci et peut changer sans préavis.",
            ],
          },
          {
            heading: "Obligations de l’utilisateur",
            body: [
              "Vous êtes seul responsable de l’usage que vous faites des fichiers obtenus et vous confirmez que vous êtes en droit d’en faire usage.",
            ],
            bullets: [
              "Ne téléchargez que des contenus dont vous détenez les droits ou dont l’utilisation est autorisée par le titulaire des droits ou par la loi.",
              "N’utilisez pas le service pour porter atteinte au droit d’auteur ou aux droits voisins, diffuser des contenus interdits ou porter atteinte aux droits de tiers.",
              "Ne tentez pas de contourner les limites techniques du service, notamment les limites de fréquence des requêtes et la vérification anti-bots.",
              "Ne générez pas de charge automatisée : les requêtes massives, les scripts et les outils d’extraction automatisée (scrapers) ne sont pas autorisés.",
            ],
          },
          {
            heading: "Publication des liens dans le canal",
            body: [
              "En téléchargeant une vidéo via le bot, vous acceptez que le lien vers la publication d’origine soit publié dans notre canal Telegram. Un avertissement à ce sujet est affiché dans le bot avant le choix de la qualité, c’est-à-dire avant que vous ne décidiez de télécharger.",
              "La publication est anonyme : le canal reçoit le lien vers la page publiquement accessible, le titre de la vidéo et sa miniature — l’image même que la plateforme affiche dans l’aperçu de la publication. L’identité de la personne ayant téléchargé la vidéo n’est pas indiquée. Le fichier vidéo lui-même n’est jamais publié nulle part : ce qui est diffusé, c’est le lien, que les plateformes invitent elles-mêmes à diffuser au moyen du bouton « Partager » sous chaque publication.",
              "Un même lien n’est publié qu’une seule fois. Si vous ne souhaitez pas qu’un lien apparaisse dans le canal, ne téléchargez pas cette vidéo via notre service.",
              "Les liens provenant de groupes et les publications téléchargées au moyen d’un compte connecté ne sont jamais publiés dans le canal."
            ],
          },
          {
            heading: "Connexion de votre compte",
            body: [
              "En connectant au bot votre compte sur une plateforme, vous confirmez qu’il s’agit de votre compte et que vous êtes en droit d’en disposer ainsi.",
              "Les plateformes n’approuvent pas les téléchargements automatisés et peuvent restreindre ou bloquer un compte connecté. Vous assumez ce risque ; nous vous recommandons de connecter un compte secondaire plutôt que votre compte principal. Nous ne sommes pas responsables des restrictions qu’une plateforme imposerait à votre compte.",
              "Un compte connecté à un groupe est utilisé pour les téléchargements de tous ses membres. Les administrateurs du groupe décident qui peut connecter des comptes et peuvent supprimer n’importe lequel d’entre eux.",
            ],
          },
          {
            heading: "Limitation de responsabilité",
            body: [
              "Le service est fourni « en l’état ». Nous ne garantissons ni un fonctionnement ininterrompu, ni la disponibilité d’une plateforme donnée, ni l’adéquation d’un fichier à vos besoins.",
              "Nous déclinons toute responsabilité quant à l’usage que vous faites des contenus téléchargés et quant aux conséquences de toute atteinte de votre part aux droits de tiers.",
              "Nous nous réservons le droit de modifier les fonctionnalités proposées, de suspendre le service pour maintenance et d’en cesser l’exploitation.",
            ],
          },
          {
            heading: "Restriction de l’accès",
            body: [
              "Nous pouvons restreindre ou mettre fin à l’accès au service en cas de violation des présentes Conditions, de tentative de contournement des limites, ainsi qu’en cas de réclamation fondée d’un titulaire de droits.",
            ],
          },
          {
            heading: "Modifications et droit applicable",
            body: [
              "Nous pouvons modifier les présentes Conditions ; la date de la version en vigueur est indiquée en haut de la page. En continuant à utiliser le service après une modification, vous acceptez la nouvelle version.",
              "Les relations entre les parties sont régies par le droit de la République du Kazakhstan. Les parties s’efforcent de régler leurs différends par voie de correspondance et, à défaut d’accord, selon les modalités prévues par la législation de la République du Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Politique relative aux cookies",
        summary: `Quels cookies ${operator.site} utilise, à quoi ils servent et comment les refuser.`,
        sections: [
          {
            heading: "Qu’est-ce qu’un cookie",
            body: [
              "Les cookies sont de petits fichiers texte qu’un site enregistre dans votre navigateur. Ils permettent de mémoriser vos paramètres et de recueillir des statistiques de fréquentation anonymisées.",
              "Outre les cookies, le présent document décrit également des technologies apparentées : le stockage local du navigateur et les pixels de suivi.",
            ],
          },
          {
            heading: "Strictement nécessaires",
            body: [
              "Sans eux, le service ne fonctionne pas ; ils sont donc toujours déposés.",
            ],
            bullets: [
              "Cloudflare Turnstile — vérifie que le lien est soumis par une personne et non par un script.",
              "Paramètres de l’interface — la langue et le thème de couleur choisis.",
            ],
          },
          {
            heading: "Cookies d’analyse",
            body: [
              "Ils nous aident à comprendre quelles pages sont utilisées et où surviennent les erreurs. Ils sont déposés avec votre consentement et ne sont pas nécessaires au fonctionnement du service.",
            ],
            bullets: [
              "Google Analytics et Google Tag Manager — fréquentation et comportement sur le site, sous forme anonymisée.",
              "Yandex Metrica — fréquentation, carte des clics et Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Le Webvisor de Yandex Metrica enregistre les actions effectuées sur la page : mouvements du pointeur, défilement, clics et saisie dans le champ du lien. Il nous permet de voir à quels endroits l’interface prête à confusion.",
              "Nous n’utilisons pas ces enregistrements pour suivre des personnes déterminées. Ne saisissez pas dans les champs du site des informations que vous ne souhaiteriez pas voir enregistrées.",
            ],
          },
          {
            heading: "Comment les refuser",
            bullets: [
              "Configurez le blocage ou la suppression des cookies dans les paramètres de votre navigateur — cette méthode fonctionne pour tous les outils énumérés ici.",
              "Google Analytics : le module complémentaire officiel pour navigateur qui désactive la collecte est disponible sur le site de Google.",
              "Yandex Metrica : le refus est possible au moyen du module complémentaire officiel de Yandex.",
              "La désactivation des cookies strictement nécessaires rendra le téléchargement impossible.",
            ],
          },
          {
            heading: "Durée de conservation",
            body: [
              "Les cookies de session sont supprimés à la fermeture du navigateur ou à l’expiration de la session. Les outils d’analyse conservent leurs identifiants pendant les durées fixées par leurs fournisseurs.",
            ],
          },
        ],
      },
      copyright: {
        title: "Titulaires de droits",
        summary: "La position du service en matière de droit d’auteur et la procédure de signalement d’une atteinte.",
        sections: [
          {
            heading: "Position du service",
            body: [
              "Le service n’héberge aucune vidéo et ne tient aucun catalogue. Il agit en tant qu’intermédiaire technique : à partir du lien saisi par l’utilisateur, il accède à une page publiquement accessible et transmet le fichier à cet utilisateur.",
              "Les fichiers téléchargés sont conservés sur le serveur environ une heure, puis supprimés automatiquement. Aucune copie permanente du contenu d’autrui ne subsiste chez nous.",
              "La responsabilité de l’utilisation des contenus téléchargés incombe à l’utilisateur, comme le prévoient expressément les Conditions d’utilisation.",
            ],
          },
          {
            heading: "Si vos droits sont enfreints",
            body: [
              `Si vous êtes titulaire de droits ou son représentant et estimez que le service est utilisé pour porter atteinte à vos droits, écrivez à ${MAIL}. Nous examinons ces réclamations et prenons les mesures qui s’imposent.`,
            ],
          },
          {
            heading: "Contenu de la réclamation",
            bullets: [
              "L’œuvre concernée et le fondement sur lequel vous en détenez les droits.",
              "Le lien vers le contenu et, s’ils sont connus, les circonstances de l’atteinte.",
              "Vos coordonnées : nom ou dénomination, adresse postale et adresse électronique.",
              "Si vous agissez au nom du titulaire des droits, la justification de vos pouvoirs.",
              "Une déclaration attestant que les informations contenues dans la réclamation sont exactes et que l’utilisation du contenu n’est autorisée ni par le titulaire des droits ni par la loi.",
            ],
          },
          {
            heading: "Suite donnée à la réclamation",
            body: [
              "Nous examinons la réclamation dans un délai raisonnable, en règle générale dans les trente jours calendaires, et, si l’atteinte est confirmée, nous restreignons l’accès au contenu via le service et, le cas échéant, l’accès de l’auteur de l’atteinte au service.",
              "Nous vous communiquerons le résultat de l’examen à l’adresse électronique que vous aurez indiquée.",
            ],
          },
          {
            heading: "Réclamations de mauvaise foi",
            body: [
              "Une réclamation contenant des informations sciemment inexactes peut engager la responsabilité de son auteur conformément à la législation applicable. Nous nous réservons le droit de refuser d’examiner une réclamation qui ne permet d’identifier ni le titulaire des droits ni le contenu litigieux.",
            ],
          },
        ],
      },
    },
  },

  it: {
    ui: {
      updated: "Versione del",
      back: "Torna alla home",
      operatorHeading: "Gestore del servizio",
      navHeading: "Altri documenti",
      labels: {
        privacy: "Informativa sulla privacy",
        terms: "Condizioni d’uso",
        cookies: "Cookie policy",
        copyright: "Titolari dei diritti",
      },
    },
    docs: {
      privacy: {
        title: "Informativa sulla privacy",
        summary: `Quali dati raccoglie ${operator.site}, a quale scopo, per quanto tempo vengono conservati e come ottenerne la cancellazione.`,
        sections: [
          {
            heading: "Disposizioni generali",
            body: [
              `La presente Informativa descrive quali dati personali sono trattati dal servizio ${operator.site} e per quali finalità. Il titolare del trattamento è ${operator.nameIt}.`,
              "Utilizzando il servizio, Lei accetta le modalità di trattamento qui descritte. Qualora non le condivida, La preghiamo di non utilizzare il servizio.",
              "Il trattamento è effettuato in conformità alla legge della Repubblica del Kazakistan «Sui dati personali e sulla loro protezione» e, per i visitatori provenienti dallo Spazio economico europeo, tenendo conto dei requisiti del GDPR (Regolamento generale sulla protezione dei dati).",
            ],
          },
          {
            heading: "Quali dati trattiamo",
            body: [
              "Non raccogliamo deliberatamente nulla oltre a quanto necessario al funzionamento del servizio e non richiediamo documenti, dati di pagamento né indirizzi.",
            ],
            bullets: [
              "I dati dell’account Telegram che il bot riceve quando Lei gli scrive: identificativo numerico, nome utente, nome e codice della lingua.",
              "I link che Lei invia per il download e le informazioni sul tentativo stesso: piattaforma, data e ora, qualità scelta, esito (riuscito o errore).",
              "Dati tecnici della connessione: indirizzo IP, tipo e versione del browser, lingua, pagina di provenienza. Tali dati confluiscono nei log del server e nei sistemi di analisi web.",
              "Cookie e identificativi di analisi — per i dettagli si veda la Cookie policy.",
            ],
          },
          {
            heading: "Perché questi dati sono necessari",
            bullets: [
              "Per fornire il servizio stesso: ottenere il video dal link da Lei indicato e consegnarLe il file.",
              "Per distinguere il Suo account da quelli altrui e contrastare gli abusi.",
              "Per proteggere il servizio da abusi automatizzati: verifica Cloudflare Turnstile prima dell’invio di un link.",
              "Per comprendere come viene utilizzato il sito e correggere gli errori, mediante statistiche anonimizzate e aggregate.",
              "Per rispondere alle Sue richieste e a quelle dei titolari dei diritti.",
              "Per scriverLe occasionalmente su Telegram e chiederLe un parere sul servizio — ad esempio se ha smesso di utilizzarlo. Rispondere è facoltativo; se non desidera ricevere tali messaggi, è sufficiente comunicarcelo e non Le scriveremo più.",
            ],
          },
          {
            heading: "Basi giuridiche del trattamento",
            body: [
              "I dati dell’account Telegram e le informazioni sui download sono trattati per l’esecuzione delle Condizioni d’uso, che Lei accetta iniziando a utilizzare il servizio.",
              "I cookie di analisi e la registrazione delle azioni sul sito sono trattati sulla base del Suo consenso, che può revocare in qualsiasi momento secondo le modalità descritte nella Cookie policy.",
              "I log del server e la protezione dai bot si fondano sul nostro legittimo interesse a mantenere il servizio funzionante e sicuro.",
              "Le richieste di parere sul servizio si fondano sul nostro legittimo interesse a migliorarlo; Lei può opporsi a riceverle in qualsiasi momento.",
            ],
          },
          {
            heading: "Account collegati",
            body: [
              "Se lo desidera, può collegare al bot il Suo account su una piattaforma (Instagram, Facebook, YouTube, X, VK, TikTok) affinché il bot scarichi contenuti visibili solo agli utenti che hanno effettuato l’accesso: storie, pubblicazioni private. A tal fine il bot riceve i cookie di tale account — dall’estensione Videoner tramite un codice monouso oppure da un file da Lei inviato.",
              "Conserviamo soltanto i cookie della piattaforma scelta e scartiamo immediatamente gli altri. Sono conservati in forma cifrata e utilizzati esclusivamente per i download nel contesto in cui Lei li ha collegati. Quelli collegati nella chat privata servono ai Suoi download, compresi i Suoi link nei gruppi che non hanno un proprio account collegato; non sono mai utilizzati per i link di altre persone. Quelli collegati a un gruppo servono ai download dei suoi membri e a nient’altro.",
              "La base giuridica è il Suo consenso: Lei collega l’account di propria iniziativa e può rimuoverlo in qualsiasi momento con il comando /accounts. Alla rimozione i cookie vengono cancellati in modo irreversibile. Se la piattaforma smette di accettare l’accesso, il bot gliene dà comunicazione.",
              "I contenuti scaricati tramite un account collegato non vengono pubblicati nel nostro canale né forniti ad altri utenti dalla cache comune.",
            ],
          },
          {
            heading: "Servizi di terze parti",
            body: [
              "Non vendiamo i Suoi dati né li comunichiamo a terzi per finalità proprie di questi ultimi. Per il funzionamento del servizio ci avvaliamo dei seguenti fornitori, ciascuno dei quali tratta i dati secondo le proprie regole:",
            ],
            bullets: [
              `Telegram — funzionamento del bot ${BOT}.`,
              "Cloudflare — protezione dai bot (Turnstile), distribuzione del sito e instradamento della posta.",
              "Google Analytics e Google Tag Manager — statistiche delle visite.",
              "Yandex Metrica — statistiche delle visite, mappa dei clic e Webvisor. Webvisor registra le azioni sulla pagina: movimenti del puntatore, scorrimento e clic. Le registrazioni sono utilizzate esclusivamente per analizzare la fruibilità del sito.",
            ],
          },
          {
            heading: "Per quanto tempo conserviamo i dati",
            bullets: [
              "I file scaricati vengono eliminati automaticamente dal server circa un’ora dopo la loro creazione. Non conserviamo alcun archivio dei Suoi video.",
              "Le informazioni sui tentativi di download sono conservate per il tempo necessario a contrastare gli abusi e a gestire le richieste.",
              "I dati dell’account sono conservati finché Lei utilizza il servizio e vengono cancellati su Sua richiesta.",
              "I log del server sono conservati per un periodo limitato e vengono sovrascritti a ogni rotazione.",
            ],
          },
          {
            heading: "Dove sono trattati i dati",
            body: [
              "I server del servizio si trovano in un data center situato nel territorio dell’Unione europea. Alcuni dei fornitori sopra elencati possono trattare i dati al di fuori di essa in conformità alle proprie politiche.",
            ],
          },
          {
            heading: "I Suoi diritti",
            body: [
              `Lei ha il diritto di ottenere informazioni sul trattamento dei Suoi dati, di chiederne la rettifica o la cancellazione, di revocare il consenso e di opporsi al trattamento. A tal fine scriva a ${MAIL} dall’indirizzo e-mail o dall’account Telegram a cui si riferisce la richiesta.`,
              "Rispondiamo entro un termine ragionevole, di norma entro trenta giorni di calendario. La cancellazione dell’account comporta la cancellazione della cronologia dei download a esso associata.",
            ],
          },
          {
            heading: "Minori",
            body: [
              "Il servizio non è destinato né rivolto ai minori di 16 anni. Non raccogliamo consapevolmente i dati di tali utenti; qualora ciò sia avvenuto per errore, ci scriva e i dati saranno cancellati.",
            ],
          },
          {
            heading: "Modifiche",
            body: [
              "Possiamo aggiornare la presente Informativa. La data della versione vigente è indicata all’inizio della pagina; le modifiche sostanziali saranno segnalate all’interno del servizio.",
            ],
          },
        ],
      },
      terms: {
        title: "Condizioni d’uso",
        summary: `Le regole di utilizzo di ${operator.site}: che cosa è consentito, che cosa non lo è e a quali condizioni funziona il servizio.`,
        sections: [
          {
            heading: "Disposizioni generali",
            body: [
              `Le presenti Condizioni disciplinano l’utilizzo del sito ${operator.site} e del bot Telegram ${BOT}. Il servizio è di proprietà ed è gestito da ${operator.nameIt}.`,
              "Iniziando a utilizzare il servizio, Lei conferma di aver letto le presenti Condizioni e di accettarle. Qualora una qualsiasi condizione non Le sia gradita, non deve utilizzare il servizio.",
            ],
          },
          {
            heading: "Il servizio è gratuito",
            body: [
              "Tutte le funzionalità del servizio sono fornite gratuitamente. Non vi sono abbonamenti, piani a pagamento, qualità video a pagamento né acquisti interni.",
              "Non mostriamo pubblicità e non inseriamo link di affiliazione.",
            ],
          },
          {
            heading: "Condizioni di accesso",
            bullets: [
              "Per scaricare dal sito non sono necessari né un account né l’accesso. Il bot distingue gli utenti in base al loro account Telegram.",
              "Limiti tecnici alla frequenza delle richieste proteggono il servizio dal sovraccarico e dagli abusi automatizzati.",
              "Per YouTube vale un limite giornaliero di traffico: 10 GB nell’arco di 24 ore per rete sul sito e nell’estensione e 25 GB nell’arco di 24 ore per account Telegram nel bot. Le altre piattaforme non sono interessate da tale limite.",
              "Per scaricare tramite il bot non è richiesta l’iscrizione al nostro canale. Nella didascalia dei file il bot aggiunge un link al canale di notizie del progetto; iscriversi è facoltativo.",
            ],
          },
          {
            heading: "Che cosa fa il servizio",
            body: [
              "Il servizio agisce come intermediario tecnico: tramite il link da Lei fornito accede a una pagina pubblicamente accessibile, ottiene il file multimediale e Glielo trasmette.",
              "Non ospitiamo alcun catalogo di video, non effettuiamo ricerche nei contenuti altrui e non conserviamo i file scaricati oltre il tempo necessario alla trasmissione — circa un’ora.",
              "La disponibilità di una determinata piattaforma dipende dalle scelte tecniche di quest’ultima e può cambiare senza preavviso.",
            ],
          },
          {
            heading: "Obblighi dell’utente",
            body: [
              "Lei è il solo responsabile dell’uso che fa dei file ottenuti e conferma di averne il diritto.",
            ],
            bullets: [
              "Scarichi soltanto materiale i cui diritti appartengono a Lei, oppure il cui utilizzo è consentito dal titolare dei diritti o dalla legge.",
              "Non utilizzi il servizio per violare il diritto d’autore e i diritti connessi, per diffondere contenuti vietati o per violare i diritti di terzi.",
              "Non tenti di eludere i limiti tecnici del servizio, compresi i limiti alla frequenza delle richieste e la verifica anti-bot.",
              "Non generi carico automatizzato: richieste massive, script e parser non sono ammessi.",
            ],
          },
          {
            heading: "Pubblicazione dei link nel canale",
            body: [
              "Scaricando un video tramite il bot, Lei acconsente alla pubblicazione del link al post originale nel nostro canale Telegram. Un avviso in tal senso viene mostrato nel bot prima della scelta della qualità, ossia prima che Lei decida di scaricare.",
              "La pubblicazione è anonima: nel canale vengono inseriti il link alla pagina pubblicamente accessibile, il titolo del video e la sua copertina — lo stesso fotogramma che la piattaforma mostra nell’anteprima del post. Chi ha scaricato il video non viene indicato. Il file video in sé non viene mai pubblicato in alcun luogo: viene diffuso il link, che le piattaforme stesse invitano a condividere con il pulsante «Condividi» presente sotto ogni post.",
              "Uno stesso link viene pubblicato non più di una volta. Se non desidera che un link finisca nel canale, non scarichi quel video tramite il nostro servizio.",
              "I link provenienti dai gruppi e i contenuti scaricati tramite un account collegato non vengono mai pubblicati nel canale."
            ],
          },
          {
            heading: "Collegamento del proprio account",
            body: [
              "Collegando al bot il Suo account su una piattaforma, Lei conferma che si tratta del Suo account e di avere il diritto di disporne.",
              "Le piattaforme non approvano i download automatizzati e possono limitare o bloccare un account collegato. Lei si assume tale rischio; Le consigliamo di collegare un account secondario anziché quello principale. Non rispondiamo delle limitazioni che la piattaforma dovesse imporre al Suo account.",
              "Un account collegato a un gruppo viene utilizzato per i download di tutti i suoi membri. Gli amministratori del gruppo decidono chi può collegare account e possono rimuoverne qualsiasi.",
            ],
          },
          {
            heading: "Limitazione di responsabilità",
            body: [
              "Il servizio è fornito «così com’è». Non garantiamo il funzionamento ininterrotto, la disponibilità di una determinata piattaforma né l’idoneità di un file ai Suoi scopi.",
              "Non siamo responsabili dell’uso che Lei fa del materiale scaricato né delle conseguenze di Sue violazioni dei diritti di terzi.",
              "Ci riserviamo il diritto di modificare le funzionalità offerte, di sospendere il servizio per manutenzione e di cessarne l’attività.",
            ],
          },
          {
            heading: "Limitazione dell’accesso",
            body: [
              "Possiamo limitare o revocare l’accesso al servizio in caso di violazione delle presenti Condizioni, di tentativi di eludere i limiti, nonché a seguito di un reclamo fondato di un titolare dei diritti.",
            ],
          },
          {
            heading: "Modifiche e legge applicabile",
            body: [
              "Possiamo modificare le presenti Condizioni; la data della versione vigente è indicata all’inizio della pagina. Continuando a utilizzare il servizio dopo le modifiche, Lei accetta la nuova versione.",
              "I rapporti tra le parti sono regolati dalla legge della Repubblica del Kazakistan. Le parti si adoperano per risolvere le controversie tramite corrispondenza e, in mancanza di accordo, secondo le modalità previste dalla legislazione della Repubblica del Kazakistan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie policy",
        summary: `Quali cookie utilizza ${operator.site}, a che cosa servono e come rifiutarli.`,
        sections: [
          {
            heading: "Che cosa sono i cookie",
            body: [
              "I cookie sono piccoli file di testo che un sito memorizza nel Suo browser. Consentono di ricordare le Sue impostazioni e di raccogliere statistiche anonimizzate sulle visite.",
              "Insieme ai cookie, il presente documento descrive anche tecnologie affini: l’archiviazione locale del browser e i pixel di tracciamento.",
            ],
          },
          {
            heading: "Cookie necessari",
            body: [
              "Senza di essi il servizio non funziona, pertanto vengono sempre installati.",
            ],
            bullets: [
              "Cloudflare Turnstile — verifica che il link sia inviato da una persona e non da uno script.",
              "Impostazioni dell’interfaccia — la lingua e il tema grafico scelti.",
            ],
          },
          {
            heading: "Cookie di analisi",
            body: [
              "Ci aiutano a capire quali pagine vengono utilizzate e dove si verificano errori. Sono installati con il Suo consenso e non sono necessari al funzionamento del servizio.",
            ],
            bullets: [
              "Google Analytics e Google Tag Manager — traffico e comportamento sul sito in forma anonimizzata.",
              "Yandex Metrica — traffico, mappa dei clic e Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor di Yandex Metrica registra le azioni sulla pagina: movimenti del puntatore, scorrimento, clic e digitazione nel campo del link. Ciò serve a individuare i punti in cui l’interfaccia crea confusione.",
              "Non utilizziamo tali registrazioni per tracciare persone specifiche. La preghiamo di non inserire nei campi del sito informazioni che non desidera vengano conservate.",
            ],
          },
          {
            heading: "Come rifiutarli",
            bullets: [
              "Configuri il blocco o la cancellazione dei cookie nelle impostazioni del Suo browser: questo metodo funziona per tutti i sistemi sopra elencati.",
              "Google Analytics: il componente aggiuntivo ufficiale per browser che disattiva la raccolta è disponibile sul sito di Google.",
              "Yandex Metrica: la disattivazione è possibile tramite il componente aggiuntivo ufficiale di Yandex.",
              "La disattivazione dei cookie necessari renderà impossibile il download.",
            ],
          },
          {
            heading: "Durata di conservazione",
            body: [
              "I cookie di sessione vengono eliminati alla chiusura del browser o alla scadenza della sessione. Gli strumenti di analisi conservano i propri identificativi per i periodi stabiliti dai rispettivi fornitori.",
            ],
          },
        ],
      },
      copyright: {
        title: "Titolari dei diritti",
        summary: "La posizione del servizio in materia di diritto d’autore e la procedura per segnalare una violazione.",
        sections: [
          {
            heading: "La posizione del servizio",
            body: [
              "Il servizio non ospita video e non ne gestisce alcun catalogo. Agisce come intermediario tecnico: tramite il link inserito dall’utente accede a una pagina pubblicamente accessibile e trasmette il file all’utente.",
              "I file scaricati restano sul server per circa un’ora e vengono poi eliminati automaticamente. Non conserviamo alcuna copia permanente di contenuti altrui.",
              "La responsabilità per l’uso del materiale scaricato ricade sull’utente, come espressamente stabilito nelle Condizioni d’uso.",
            ],
          },
          {
            heading: "Se i Suoi diritti sono violati",
            body: [
              `Se è titolare dei diritti o un suo rappresentante e ritiene che il servizio venga utilizzato per violare i Suoi diritti, scriva a ${MAIL}. Esaminiamo tali segnalazioni e adottiamo le misure opportune.`,
            ],
          },
          {
            heading: "Che cosa indicare nella segnalazione",
            bullets: [
              "Quale opera è interessata e a quale titolo Lei detiene i diritti su di essa.",
              "Il link al materiale e, se note, le circostanze della violazione.",
              "I Suoi dati di contatto: nome o denominazione, indirizzo e indirizzo e-mail.",
              "Se agisce per conto del titolare dei diritti, la prova dei Suoi poteri di rappresentanza.",
              "Una dichiarazione attestante che le informazioni contenute nella segnalazione sono veritiere e che l’utilizzo del materiale non è autorizzato dal titolare dei diritti né dalla legge.",
            ],
          },
          {
            heading: "Che cosa faremo",
            body: [
              "Esaminiamo la segnalazione entro un termine ragionevole, di norma entro trenta giorni di calendario, e, qualora la violazione sia confermata, limitiamo l’accesso al materiale tramite il servizio e, se necessario, l’accesso al servizio dell’autore della violazione.",
              "Le comunicheremo l’esito dell’esame all’indirizzo e-mail da Lei indicato.",
            ],
          },
          {
            heading: "Segnalazioni in malafede",
            body: [
              "Una segnalazione contenente informazioni consapevolmente false può comportare la responsabilità del segnalante ai sensi della normativa applicabile. Ci riserviamo il diritto di non esaminare una segnalazione che non consenta di individuare né il titolare dei diritti né il materiale contestato.",
            ],
          },
        ],
      },
    },
  },
  pt: {
    ui: {
      updated: "Versão de",
      back: "Voltar à página inicial",
      operatorHeading: "Operador do serviço",
      navHeading: "Outros documentos",
      labels: {
        privacy: "Política de Privacidade",
        terms: "Termos de Uso",
        cookies: "Política de Cookies",
        copyright: "Titulares de direitos",
      },
    },
    docs: {
      privacy: {
        title: "Política de Privacidade",
        summary: `Quais dados o ${operator.site} coleta, para que são necessários, por quanto tempo são mantidos e como solicitar sua exclusão.`,
        sections: [
          {
            heading: "Disposições gerais",
            body: [
              `A presente Política descreve quais dados pessoais são tratados pelo serviço ${operator.site} e com qual finalidade. O controlador dos dados é ${operator.namePt}.`,
              "Ao utilizar o serviço, você concorda com o tratamento aqui descrito. Se não concordar com ele, pedimos que não utilize o serviço.",
              "O tratamento é realizado em conformidade com a Lei da República do Cazaquistão “Sobre Dados Pessoais e sua Proteção” e, em relação aos visitantes do Espaço Econômico Europeu, observando os requisitos do RGPD (GDPR).",
            ],
          },
          {
            heading: "Quais dados tratamos",
            body: [
              "Deliberadamente, não coletamos nada além do necessário para o funcionamento do serviço e não solicitamos documentos, dados de pagamento nem endereço.",
            ],
            bullets: [
              "Dados da conta do Telegram que o bot recebe quando você lhe envia uma mensagem: identificador numérico, nome de usuário, nome e código de idioma.",
              "Os links que você envia para download e informações sobre a própria tentativa: plataforma, data e hora, qualidade escolhida e resultado (sucesso ou erro).",
              "Dados técnicos da conexão: endereço IP, tipo e versão do navegador, idioma e página de origem. Eles são registrados nos logs do servidor e nas ferramentas de análise da web.",
              "Cookies e identificadores de análise — mais detalhes na Política de Cookies.",
            ],
          },
          {
            heading: "Para que precisamos desses dados",
            bullets: [
              "Prestar o próprio serviço: obter o vídeo a partir do seu link e entregar o arquivo a você.",
              "Distinguir a sua conta das contas de outras pessoas e prevenir abusos.",
              "Proteger o serviço contra abusos automatizados: verificação do Cloudflare Turnstile antes do envio de um link.",
              "Entender como o site é utilizado e corrigir erros — por meio de estatísticas anonimizadas e agregadas.",
              "Responder às suas solicitações e às dos titulares de direitos.",
              "Ocasionalmente, enviar a você uma mensagem no Telegram para saber sua opinião sobre o serviço — por exemplo, se você deixou de usá-lo. Responder não é obrigatório; se não quiser receber esse tipo de mensagem, basta nos dizer, e não escreveremos novamente.",
            ],
          },
          {
            heading: "Bases legais do tratamento",
            body: [
              "Os dados da conta do Telegram e as informações sobre downloads são tratados para a execução dos Termos de Uso, que você aceita ao começar a utilizar o serviço.",
              "Os cookies de análise e a gravação das ações no site são tratados com base no seu consentimento, que você pode revogar a qualquer momento — as formas de fazê-lo estão descritas na Política de Cookies.",
              "Os logs do servidor e a proteção contra bots baseiam-se no nosso legítimo interesse em manter o serviço funcionando e protegido.",
              "As perguntas sobre sua opinião a respeito do serviço baseiam-se no nosso legítimo interesse em aprimorá-lo; você pode recusá-las a qualquer momento.",
            ],
          },
          {
            heading: "Contas conectadas",
            body: [
              "Se desejar, você pode conectar ao bot a sua conta em uma plataforma (Instagram, Facebook, YouTube, X, VK, TikTok), para que o bot baixe publicações visíveis apenas para usuários conectados: stories e publicações privadas. Para isso, o bot recebe os cookies dessa conta — da extensão Videoner, por meio de um código de uso único, ou de um arquivo enviado por você.",
              "Guardamos apenas os cookies da plataforma escolhida e descartamos os demais imediatamente. Eles são armazenados de forma criptografada e utilizados somente para downloads no local onde você os conectou. Os cookies conectados no seu chat privado servem aos seus downloads, inclusive aos seus próprios links em grupos que não têm uma conta própria conectada; eles não são utilizados para links de outras pessoas. Os cookies conectados a um grupo servem aos downloads dos membros desse grupo e a nada mais.",
              "A base legal é o seu consentimento: você mesmo conecta a conta e pode removê-la a qualquer momento com o comando /accounts. Ao serem removidos, os cookies são apagados de forma definitiva. Se a plataforma deixar de aceitar o login, o bot avisará você.",
              "As publicações baixadas por meio de uma conta conectada não são publicadas no nosso canal nem são fornecidas a outros usuários a partir do cache compartilhado.",
            ],
          },
          {
            heading: "Serviços de terceiros",
            body: [
              "Não vendemos seus dados nem os transferimos a terceiros para fins próprios destes. O serviço utiliza os seguintes fornecedores, cada um dos quais trata os dados de acordo com suas próprias regras:",
            ],
            bullets: [
              `Telegram — funcionamento do bot ${BOT}.`,
              "Cloudflare — proteção contra bots (Turnstile), entrega do site e roteamento de e-mail.",
              "Google Analytics e Google Tag Manager — estatísticas de visitas.",
              "Yandex Metrica — estatísticas de visitas, mapa de cliques e Webvisor. O Webvisor grava as ações na página: movimentos do ponteiro, rolagem e cliques. As gravações são utilizadas exclusivamente para analisar a usabilidade do site.",
            ],
          },
          {
            heading: "Por quanto tempo mantemos os dados",
            bullets: [
              "Os arquivos baixados são excluídos do servidor automaticamente cerca de uma hora após sua criação. Não mantemos nenhum acervo dos seus vídeos.",
              "Os registros das tentativas de download são mantidos pelo tempo necessário para prevenir abusos e analisar solicitações.",
              "Os dados da conta são mantidos enquanto você utiliza o serviço e são excluídos mediante sua solicitação.",
              "Os logs do servidor são mantidos por tempo limitado e sobrescritos à medida que são rotacionados.",
            ],
          },
          {
            heading: "Onde os dados são tratados",
            body: [
              "Os servidores do serviço estão localizados em um data center no território da União Europeia. Alguns dos fornecedores listados acima podem tratar dados fora dela, de acordo com suas próprias políticas.",
            ],
          },
          {
            heading: "Seus direitos",
            body: [
              `Você tem o direito de obter informações sobre o tratamento dos seus dados, solicitar sua correção ou exclusão, revogar o consentimento e opor-se ao tratamento. Para isso, escreva para ${MAIL} a partir do endereço de e-mail ou da conta do Telegram a que a solicitação se refere.`,
              "Respondemos em prazo razoável, normalmente em até trinta dias corridos. A exclusão da conta implica a exclusão do histórico de downloads associado a ela.",
            ],
          },
          {
            heading: "Menores de idade",
            body: [
              "O serviço não se destina a crianças menores de 16 anos nem é dirigido a elas. Não coletamos conscientemente dados desses usuários; se isso tiver ocorrido por engano, escreva-nos e os dados serão excluídos.",
            ],
          },
          {
            heading: "Alterações",
            body: [
              "Podemos atualizar esta Política. A data da versão vigente está indicada no início da página; alterações significativas serão sinalizadas no serviço.",
            ],
          },
        ],
      },
      terms: {
        title: "Termos de Uso",
        summary: `As regras de uso do ${operator.site}: o que é permitido, o que não é e em que condições o serviço funciona.`,
        sections: [
          {
            heading: "Disposições gerais",
            body: [
              `Estes Termos regem o uso do site ${operator.site} e do bot do Telegram ${BOT}. O proprietário e administrador do serviço é ${operator.namePt}.`,
              "Ao começar a utilizar o serviço, você confirma que leu estes Termos e os aceita. Se alguma condição não lhe convier, não utilize o serviço.",
            ],
          },
          {
            heading: "O serviço é gratuito",
            body: [
              "Todas as funcionalidades do serviço são oferecidas gratuitamente. Não temos assinaturas, planos pagos, qualidades de vídeo pagas nem compras dentro do serviço.",
              "Não exibimos publicidade nem inserimos links de afiliados.",
            ],
          },
          {
            heading: "Condições de acesso",
            bullets: [
              "Para baixar pelo site, não é necessário ter conta nem fazer login. O bot distingue os usuários pela respectiva conta do Telegram.",
              "Limites técnicos à frequência de solicitações protegem o serviço contra sobrecarga e abusos automatizados.",
              "Para o YouTube, aplica-se um limite diário de tráfego: 10 GB a cada 24 horas por rede no site e na extensão, e 25 GB a cada 24 horas por conta do Telegram no bot. As demais plataformas não são afetadas.",
              "Não é necessário assinar o nosso canal para baixar pelo bot. Nas legendas dos arquivos, o bot adiciona um link para o canal de notícias do projeto; seguir o canal é opcional.",
            ],
          },
          {
            heading: "O que o serviço faz",
            body: [
              "O serviço atua como intermediário técnico: a partir do link fornecido por você, acessa uma página publicamente acessível, obtém o arquivo de mídia e o entrega a você.",
              "Não hospedamos nenhum catálogo de vídeos, não realizamos buscas em conteúdo de terceiros e não mantemos os arquivos baixados por mais tempo do que o necessário para a entrega — cerca de uma hora.",
              "A disponibilidade de cada plataforma depende das decisões técnicas dela e pode mudar sem aviso prévio.",
            ],
          },
          {
            heading: "Obrigações do usuário",
            body: [
              "Você é o único responsável pela forma como utiliza os arquivos obtidos e confirma que tem o direito de fazê-lo.",
            ],
            bullets: [
              "Baixe apenas materiais cujos direitos pertençam a você ou cujo uso seja permitido pelo titular de direitos ou pela lei.",
              "Não utilize o serviço para violar direitos autorais e direitos conexos, distribuir conteúdo proibido ou violar direitos de terceiros.",
              "Não tente contornar as limitações técnicas do serviço, incluindo os limites de frequência de solicitações e a verificação contra bots.",
              "Não gere carga automatizada: solicitações em massa, scripts e scrapers não são permitidos.",
            ],
          },
          {
            heading: "Publicação de links no canal",
            body: [
              "Ao baixar um vídeo pelo bot, você concorda que o link da publicação original será publicado no nosso canal do Telegram. Um aviso sobre isso é exibido no bot antes da escolha da qualidade — ou seja, antes de você decidir fazer o download.",
              "A publicação é anônima: o canal recebe o link para uma página publicamente acessível, o título do vídeo e sua capa — o mesmo quadro que a plataforma exibe na pré-visualização da publicação. Não se indica quem baixou o vídeo. O próprio arquivo de vídeo nunca é publicado em lugar algum: o que se divulga é o link, que as próprias plataformas convidam a compartilhar por meio do botão “Compartilhar” abaixo de cada publicação.",
              "Um mesmo link é publicado no máximo uma vez. Se você não quiser que um link chegue ao canal, não baixe esse vídeo pelo nosso serviço.",
              "Links provenientes de grupos e publicações baixadas por meio de uma conta conectada nunca são publicados no canal."
            ],
          },
          {
            heading: "Conexão da sua conta",
            body: [
              "Ao conectar ao bot a sua conta em uma plataforma, você confirma que a conta é sua e que tem o direito de utilizá-la dessa forma.",
              "As plataformas não aprovam downloads automatizados e podem restringir ou bloquear uma conta conectada. Você assume esse risco; recomendamos conectar uma conta secundária, e não a principal. Não nos responsabilizamos pelas restrições que uma plataforma venha a impor à sua conta.",
              "Uma conta conectada a um grupo é utilizada para os downloads de todos os seus membros. Os administradores do grupo decidem quem pode conectar contas e podem remover qualquer uma delas.",
            ],
          },
          {
            heading: "Limitação de responsabilidade",
            body: [
              "O serviço é fornecido “no estado em que se encontra”. Não garantimos o funcionamento ininterrupto, a disponibilidade de uma plataforma específica nem a adequação de um arquivo às suas finalidades.",
              "Não nos responsabilizamos pelo uso que você fizer do material baixado nem pelas consequências de eventuais violações, por sua parte, de direitos de terceiros.",
              "Reservamo-nos o direito de alterar as funcionalidades do serviço, suspendê-lo para manutenção e encerrar seu funcionamento.",
            ],
          },
          {
            heading: "Restrição de acesso",
            body: [
              "Podemos restringir ou encerrar o acesso ao serviço em caso de violação destes Termos, de tentativas de contornar os limites ou mediante reclamação fundamentada de um titular de direitos.",
            ],
          },
          {
            heading: "Alterações e lei aplicável",
            body: [
              "Podemos alterar estes Termos; a data da versão vigente está indicada no início da página. Ao continuar a utilizar o serviço após as alterações, você aceita a nova versão.",
              "As relações entre as partes são regidas pela legislação da República do Cazaquistão. As partes procurarão resolver eventuais litígios por correspondência e, na falta de acordo, na forma estabelecida pela legislação da República do Cazaquistão.",
            ],
          },
        ],
      },
      cookies: {
        title: "Política de Cookies",
        summary: `Quais cookies o ${operator.site} utiliza, para que servem e como recusá-los.`,
        sections: [
          {
            heading: "O que são cookies",
            body: [
              "Cookies são pequenos arquivos de texto que um site armazena no seu navegador. Eles permitem lembrar suas configurações e coletar estatísticas de visitas anonimizadas.",
              "Além dos cookies, este documento também trata de tecnologias semelhantes: o armazenamento local do navegador e os pixels de rastreamento.",
            ],
          },
          {
            heading: "Estritamente necessários",
            body: [
              "Sem eles o serviço não funciona; por isso, são sempre definidos.",
            ],
            bullets: [
              "Cloudflare Turnstile — verifica se o link é enviado por uma pessoa, e não por um script.",
              "Configurações da interface — o idioma e o tema visual escolhidos.",
            ],
          },
          {
            heading: "De análise",
            body: [
              "Ajudam-nos a entender quais páginas são utilizadas e onde ocorrem erros. São definidos com o seu consentimento e não são necessários para o funcionamento do serviço.",
            ],
            bullets: [
              "Google Analytics e Google Tag Manager — tráfego e comportamento no site, de forma anonimizada.",
              "Yandex Metrica — tráfego, mapa de cliques e Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "O Webvisor do Yandex Metrica grava as ações na página: movimentos do ponteiro, rolagem, cliques e digitação no campo do link. Isso serve para identificarmos os pontos em que a interface causa confusão.",
              "Não utilizamos essas gravações para rastrear pessoas específicas. Não insira nos campos do site informações que você não gostaria que fossem armazenadas.",
            ],
          },
          {
            heading: "Como recusar",
            bullets: [
              "Configure o bloqueio ou a exclusão de cookies no seu navegador — esse método funciona para todos os sistemas aqui listados.",
              "Google Analytics: o complemento oficial para navegador que desativa a coleta está disponível no site do Google.",
              "Yandex Metrica: a recusa é possível por meio do complemento oficial do Yandex.",
              "A desativação dos cookies estritamente necessários impossibilitará o download.",
            ],
          },
          {
            heading: "Prazos",
            body: [
              "Os cookies de sessão são excluídos ao fechar o navegador ou quando a sessão expira. As ferramentas de análise mantêm seus identificadores pelos prazos definidos por seus fornecedores.",
            ],
          },
        ],
      },
      copyright: {
        title: "Titulares de direitos",
        summary: "A posição do serviço em matéria de direitos autorais e o procedimento para apresentar uma reclamação por violação.",
        sections: [
          {
            heading: "Posição do serviço",
            body: [
              "O serviço não hospeda vídeos nem mantém um catálogo deles. Ele atua como intermediário técnico: a partir do link inserido pelo usuário, acessa uma página publicamente acessível e entrega o arquivo a esse usuário.",
              "Os arquivos baixados permanecem no servidor por cerca de uma hora e são excluídos automaticamente. Não fica conosco nenhuma cópia permanente de conteúdo de terceiros.",
              "A responsabilidade pelo uso do material baixado é do usuário — isso está expressamente estabelecido nos Termos de Uso.",
            ],
          },
          {
            heading: "Se os seus direitos forem violados",
            body: [
              `Se você é titular de direitos ou representante de um titular e considera que o serviço está sendo utilizado para violar os seus direitos, escreva para ${MAIL}. Analisamos essas reclamações e tomamos as medidas cabíveis.`,
            ],
          },
          {
            heading: "O que incluir na reclamação",
            bullets: [
              "Qual obra é afetada e com que fundamento você detém os direitos sobre ela.",
              "O link para o material e, se forem conhecidas, as circunstâncias da violação.",
              "Seus dados de contato: nome ou razão social, endereço e endereço de e-mail.",
              "Se você age em nome do titular de direitos, a comprovação dos seus poderes de representação.",
              "Uma declaração de que as informações da reclamação são verdadeiras e de que o uso do material não é autorizado pelo titular de direitos nem pela lei.",
            ],
          },
          {
            heading: "O que faremos",
            body: [
              "Analisamos a reclamação em prazo razoável, normalmente em até trinta dias corridos, e, se a violação for confirmada, restringimos o acesso ao material por meio do serviço e, se necessário, o acesso do infrator ao serviço.",
              "Informaremos o resultado da análise no endereço de e-mail indicado por você.",
            ],
          },
          {
            heading: "Reclamações de má-fé",
            body: [
              "Uma reclamação que contenha informações sabidamente falsas pode acarretar a responsabilidade do reclamante nos termos da legislação aplicável. Reservamo-nos o direito de recusar a análise de uma reclamação que não permita identificar nem o titular de direitos nem o material contestado.",
            ],
          },
        ],
      },
    },
  },
  uz: {
    ui: {
      updated: "Tahrir sanasi",
      back: "Bosh sahifaga",
      operatorHeading: "Servis operatori",
      navHeading: "Boshqa hujjatlar",
      labels: {
        privacy: "Maxfiylik siyosati",
        terms: "Foydalanuvchi kelishuvi",
        cookies: "Cookie siyosati",
        copyright: "Huquq egalari uchun",
      },
    },
    docs: {
      privacy: {
        title: "Maxfiylik siyosati",
        summary: `${operator.site} qanday maʼlumotlarni yigʻishi, ular nima uchun kerakligi, qancha muddat saqlanishi va ularni qanday oʻchirish mumkinligi.`,
        sections: [
          {
            heading: "Umumiy qoidalar",
            body: [
              `Ushbu Siyosat ${operator.site} servisi qanday shaxsga doir maʼlumotlarga va qanday maqsadda ishlov berishini belgilaydi. Maʼlumotlar operatori — ${operator.nameUz}.`,
              "Servisdan foydalanish orqali siz bu yerda bayon etilgan ishlov berish tartibiga rozilik bildirasiz. Agar siz unga rozi boʻlmasangiz, iltimos, servisdan foydalanmang.",
              "Ishlov berish Qozogʻiston Respublikasining «Shaxsga doir maʼlumotlar va ularni himoya qilish toʻgʻrisida»gi qonuniga muvofiq, Yevropa iqtisodiy hududidan tashrif buyuruvchilarga nisbatan esa GDPR talablarini hisobga olgan holda amalga oshiriladi.",
            ],
          },
          {
            heading: "Qanday maʼlumotlarga ishlov beramiz",
            body: [
              "Biz ataylab servis ishlashi uchun zarur boʻlganidan ortiq hech narsa yigʻmaymiz hamda hujjatlar, toʻlov maʼlumotlari yoki manzilni soʻramaymiz.",
            ],
            bullets: [
              "Siz botga yozganingizda u oladigan Telegram hisob qaydnomasi maʼlumotlari: raqamli identifikator, foydalanuvchi nomi, ism va til kodi.",
              "Yuklab olish uchun yuboradigan havolalaringiz va urinishning oʻzi haqidagi maʼlumotlar: platforma, sana va vaqt, tanlangan sifat, natija (muvaffaqiyat yoki xato).",
              "Ulanishning texnik maʼlumotlari: IP-manzil, brauzer turi va versiyasi, til, oʻtish amalga oshirilgan sahifa. Ular server jurnallariga va veb-tahlil tizimlariga tushadi.",
              "Cookie fayllari va tahlil identifikatorlari — batafsil maʼlumot Cookie siyosatida.",
            ],
          },
          {
            heading: "Bu maʼlumotlar nima uchun kerak",
            bullets: [
              "Xizmatning oʻzini koʻrsatish: havolangiz boʻyicha videoni olish va faylni sizga berish.",
              "Hisob qaydnomangizni boshqalarnikidan farqlash va suiisteʼmolliklarga qarshi kurashish.",
              "Servisni avtomatlashtirilgan suiisteʼmolliklardan himoya qilish: havola yuborilishidan oldin Cloudflare Turnstile tekshiruvi.",
              "Saytdan qanday foydalanilayotganini tushunish va xatolarni bartaraf etish — anonimlashtirilgan va umumlashtirilgan statistika.",
              "Sizning murojaatlaringizga va huquq egalarining murojaatlariga javob berish.",
              "Vaqti-vaqti bilan servis haqidagi fikringizni bilish uchun sizga Telegramda yozish — masalan, agar siz undan foydalanishni toʻxtatgan boʻlsangiz. Javob berish majburiy emas; agar bunday xabarlar sizga kerak boʻlmasa, shunchaki bu haqda ayting va biz boshqa yozmaymiz.",
            ],
          },
          {
            heading: "Ishlov berish asoslari",
            body: [
              "Telegram hisob qaydnomasi maʼlumotlari va yuklab olishlar haqidagi maʼlumotlarga siz servisdan foydalanishni boshlash bilan qabul qiladigan Foydalanuvchi kelishuvini ijro etish uchun ishlov beriladi.",
              "Tahliliy cookie fayllari va saytdagi harakatlarni yozib olishga sizning roziligingiz asosida ishlov beriladi, siz uni istalgan vaqtda qaytarib olishingiz mumkin — usullari Cookie siyosatida bayon etilgan.",
              "Server jurnallariga ishlov berish va botlardan himoya servisni ishlaydigan va himoyalangan holatda saqlashdan iborat qonuniy manfaatimiz doirasida amalga oshiriladi.",
              "Servis haqidagi fikringiz yuzasidan savollar servisni yaxshilashdan iborat qonuniy manfaatimiz doirasida beriladi; siz istalgan vaqtda ulardan voz kechishingiz mumkin.",
            ],
          },
          {
            heading: "Ulangan akkauntlar",
            body: [
              "Xohishingizga koʻra, bot faqat tizimga kirgan foydalanuvchilarga koʻrinadigan yozuvlarni — storislar va yopiq nashrlarni yuklab olishi uchun platformadagi akkauntingizni (Instagram, Facebook, YouTube, X, VK, TikTok) botga ulashingiz mumkin. Buning uchun bot ushbu akkauntning cookie fayllarini oladi — Videoner kengaytmasidan bir martalik kod orqali yoki siz yuborgan fayldan.",
              "Biz faqat tanlangan platformaning cookie fayllarini saqlaymiz, qolganlarini darhol chiqarib tashlaymiz. Ular shifrlangan holda saqlanadi va faqat siz ularni ulagan joydagi yuklab olishlar uchun ishlatiladi. Shaxsiy chatda ulanganlari — sizning yuklab olishlaringiz uchun, shu jumladan oʻz akkaunti ulanmagan guruhlardagi oʻzingizning havolalaringiz uchun; ular boshqalarning havolalari uchun ishlatilmaydi. Guruhga ulanganlari — faqat uning aʼzolarining yuklab olishlari uchun va boshqa hech qayerda emas.",
              "Asos — sizning roziligingiz: akkauntni oʻzingiz ulaysiz va uni istalgan vaqtda /accounts buyrugʻi bilan oʻchirishingiz mumkin. Oʻchirilganda cookie fayllari qaytarib boʻlmaydigan tarzda oʻchiriladi. Agar platforma kirishni qabul qilishni toʻxtatsa, bot bu haqda sizga xabar beradi.",
              "Ulangan akkaunt orqali yuklab olingan yozuvlar kanalimizda eʼlon qilinmaydi va umumiy keshdan boshqa foydalanuvchilarga berilmaydi.",
            ],
          },
          {
            heading: "Uchinchi tomon servislari",
            body: [
              "Biz maʼlumotlaringizni sotmaymiz va ularni uchinchi shaxslarga ularning oʻz maqsadlari uchun bermaymiz. Servis ishlashi uchun quyidagi provayderlar jalb etilgan, ularning har biri maʼlumotlarga oʻz qoidalari boʻyicha ishlov beradi:",
            ],
            bullets: [
              `Telegram — ${BOT} botining ishlashi.`,
              "Cloudflare — botlardan himoya (Turnstile), saytni yetkazib berish va pochtani marshrutlash.",
              "Google Analytics va Google Tag Manager — tashriflar statistikasi.",
              "Yandex Metrica — tashriflar statistikasi, kliklar xaritasi va Webvisor. Webvisor sahifadagi harakatlarni yozib oladi: koʻrsatkich harakatlari, sahifani aylantirish va kliklar. Yozuvlar faqat sayt qulayligini tahlil qilish uchun ishlatiladi.",
            ],
          },
          {
            heading: "Maʼlumotlarni qancha saqlaymiz",
            bullets: [
              "Yuklab olingan fayllar yaratilganidan taxminan bir soat oʻtgach serverdan avtomatik ravishda oʻchiriladi. Biz videolaringiz arxivini saqlamaymiz.",
              "Yuklab olishga urinishlar haqidagi yozuvlar suiisteʼmolliklarga qarshi kurashish va murojaatlarni koʻrib chiqish uchun zarur boʻlgan muddat davomida saqlanadi.",
              "Hisob qaydnomasi maʼlumotlari siz servisdan foydalanayotgan vaqt davomida saqlanadi va soʻrovingizga koʻra oʻchiriladi.",
              "Server jurnallari cheklangan muddat saqlanadi va rotatsiya jarayonida qayta yoziladi.",
            ],
          },
          {
            heading: "Maʼlumotlarga qayerda ishlov beriladi",
            body: [
              "Servis serverlari Yevropa Ittifoqi hududidagi maʼlumotlar markazida joylashgan. Yuqorida sanab oʻtilgan provayderlarning bir qismi oʻz siyosatlariga muvofiq maʼlumotlarga uning hududidan tashqarida ishlov berishi mumkin.",
            ],
          },
          {
            heading: "Sizning huquqlaringiz",
            body: [
              `Siz maʼlumotlaringizga ishlov berilishi haqida maʼlumot olish, ularni tuzatish yoki oʻchirishni talab qilish, roziligingizni qaytarib olish va ishlov berishga eʼtiroz bildirish huquqiga egasiz. Buning uchun murojaat bilan bogʻliq boʻlgan elektron pochta yoki Telegram akkauntidan ${MAIL} manziliga yozing.`,
              "Biz oqilona muddatda, qoida tariqasida, oʻttiz kalendar kuni ichida javob beramiz. Hisob qaydnomasining oʻchirilishi u bilan bogʻliq yuklab olishlar tarixining ham oʻchirilishiga olib keladi.",
            ],
          },
          {
            heading: "Voyaga yetmaganlar",
            body: [
              "Servis 16 yoshga toʻlmagan bolalar uchun moʻljallanmagan va ularga qaratilmagan. Biz bunday foydalanuvchilarning maʼlumotlarini bila turib yigʻmaymiz; agar bu xato tufayli sodir boʻlgan boʻlsa, bizga yozing va maʼlumotlar oʻchiriladi.",
            ],
          },
          {
            heading: "Oʻzgartirishlar",
            body: [
              "Biz ushbu Siyosatni yangilashimiz mumkin. Amaldagi tahrir sanasi sahifaning boshida koʻrsatilgan; muhim oʻzgarishlarni servisda qayd etib boramiz.",
            ],
          },
        ],
      },
      terms: {
        title: "Foydalanuvchi kelishuvi",
        summary: `${operator.site} servisidan foydalanish qoidalari: nima mumkin, nima mumkin emas va servis qanday shartlarda ishlaydi.`,
        sections: [
          {
            heading: "Umumiy qoidalar",
            body: [
              `Ushbu Kelishuv ${operator.site} saytidan va ${BOT} Telegram-botidan foydalanishni tartibga soladi. Servis egasi va maʼmuri — ${operator.nameUz}.`,
              "Servisdan foydalanishni boshlash bilan siz shartlarni oʻqib chiqqaningizni va ularni qabul qilishingizni tasdiqlaysiz. Agar biror shart sizga mos kelmasa, servisdan foydalanmasligingiz lozim.",
            ],
          },
          {
            heading: "Servis bepul",
            body: [
              "Servisning barcha imkoniyatlari bepul taqdim etiladi. Bizda obunalar, pullik tariflar, pullik video sifatlari va ichki xaridlar yoʻq.",
              "Biz reklama koʻrsatmaymiz va hamkorlik havolalarini joylashtirmaymiz.",
            ],
          },
          {
            heading: "Kirish shartlari",
            bullets: [
              "Saytda yuklab olish uchun na hisob qaydnomasi, na tizimga kirish talab etiladi. Bot foydalanuvchilarni ularning Telegram akkaunti boʻyicha farqlaydi.",
              "Servisni ortiqcha yuklanish va avtomatlashtirilgan suiisteʼmolliklardan soʻrovlar chastotasiga qoʻyilgan texnik cheklovlar himoya qiladi.",
              "YouTube uchun kunlik trafik limiti amal qiladi: saytda va kengaytmada bitta tarmoqdan 24 soatda 10 GB, botda esa bitta Telegram akkauntiga 24 soatda 25 GB. Boshqa platformalarga u taalluqli emas.",
              "Bot orqali yuklab olish uchun kanalimizga obuna boʻlish talab etilmaydi. Bot fayllar izohiga loyihaning yangiliklar kanaliga havola qoʻshadi; unga obuna boʻlish majburiy emas.",
            ],
          },
          {
            heading: "Servis nima qiladi",
            body: [
              "Servis texnik vositachi hisoblanadi: havolangiz boʻyicha u ommaga ochiq sahifaga murojaat qiladi, media faylni oladi va uni sizga uzatadi.",
              "Biz oʻzimizda video katalogini joylashtirmaymiz, boshqalarning kontenti boʻyicha qidiruv olib bormaymiz va yuklab olingan fayllarni uzatish uchun zarur boʻlgan vaqtdan — taxminan bir soatdan ortiq saqlamaymiz.",
              "Muayyan platformaning mavjudligi uning texnik qarorlariga bogʻliq va ogohlantirishsiz oʻzgarishi mumkin.",
            ],
          },
          {
            heading: "Foydalanuvchining majburiyatlari",
            body: [
              "Olingan fayllardan qanday foydalanishingiz uchun siz mustaqil ravishda javobgarsiz va bunga huquqingiz borligini tasdiqlaysiz.",
            ],
            bullets: [
              "Faqat huquqlari sizga tegishli boʻlgan yoki undan foydalanishga huquq egasi yoxud qonun ruxsat bergan materialni yuklab oling.",
              "Servisdan mualliflik va turdosh huquqlarni buzish, taqiqlangan kontentni tarqatish va uchinchi shaxslarning huquqlarini buzish uchun foydalanmang.",
              "Servisning texnik cheklovlarini, shu jumladan soʻrovlar chastotasi cheklovlari va botlarga qarshi tekshiruvni chetlab oʻtishga urinmang.",
              "Avtomatlashtirilgan yuklama yaratmang: ommaviy soʻrovlar, skriptlar va parserlarga yoʻl qoʻyilmaydi.",
            ],
          },
          {
            heading: "Kanalda havolalarni eʼlon qilish",
            body: [
              "Bot orqali video yuklab olish bilan siz asl postga havola Telegram-kanalimizda eʼlon qilinishiga rozilik bildirasiz. Bu haqdagi ogohlantirish botda sifat tanlanishidan oldin — yaʼni siz yuklab olish toʻgʻrisida qaror qabul qilishingizdan oldin koʻrsatiladi.",
              "Eʼlon qilish anonim tarzda amalga oshiriladi: kanalga ommaga ochiq sahifaga havola, rolik nomi va uning muqovasi — platforma post prevyusida koʻrsatadigan aynan oʻsha kadr yuboriladi. Videoni kim yuklab olgani koʻrsatilmaydi. Video faylning oʻzi hech qachon va hech qayerda eʼlon qilinmaydi: havola tarqatiladi, uni platformalarning oʻzi ham har bir post ostidagi «Ulashish» tugmasi orqali tarqatishni taklif qiladi.",
              "Ayni bir havola koʻpi bilan bir marta eʼlon qilinadi. Agar havola kanalga tushishini istamasangiz, ushbu videoni bizning servis orqali yuklab olmang.",
              "Guruhlardagi havolalar va ulangan akkaunt orqali yuklab olingan yozuvlar kanalda eʼlon qilinmaydi."
            ],
          },
          {
            heading: "Oʻz akkauntingizni ulash",
            body: [
              "Platformadagi akkauntingizni botga ulash bilan siz bu sizning akkauntingiz ekanini va uni tasarruf etishga haqli ekaningizni tasdiqlaysiz.",
              "Platformalar avtomatik yuklab olishlarni maʼqullamaydi va ulangan akkauntni cheklashi yoki bloklashi mumkin. Bu xavfni siz oʻz zimmangizga olasiz; asosiy boʻlmagan, alohida akkauntni ulashni tavsiya qilamiz. Platforma akkauntingizga qoʻyadigan cheklovlar uchun biz javobgar emasmiz.",
              "Guruhga ulangan akkaunt uning barcha aʼzolarining yuklab olishlari uchun ishlatiladi. Kim akkauntlarni ulashi mumkinligini guruh administratorlari hal qiladi va ular istalgan akkauntni oʻchirib tashlashi mumkin.",
            ],
          },
          {
            heading: "Javobgarlikni cheklash",
            body: [
              "Servis «qanday boʻlsa, shundayligicha» sharti asosida taqdim etiladi. Biz uzluksiz ishlashni, muayyan platformaning mavjudligini yoki faylning sizning maqsadlaringiz uchun yaroqliligini kafolatlamaymiz.",
              "Yuklab olingan materialni qanday tasarruf etganingiz va uchinchi shaxslarning huquqlarini buzganingiz oqibatlari uchun biz javobgar emasmiz.",
              "Biz imkoniyatlar tarkibini oʻzgartirish, texnik xizmat koʻrsatish uchun servis ishini toʻxtatib turish va uning faoliyatini tugatish huquqiga egamiz.",
            ],
          },
          {
            heading: "Kirishni cheklash",
            body: [
              "Ushbu shartlar buzilganda, cheklovlarni chetlab oʻtishga urinilganda, shuningdek huquq egasidan asoslantirilgan shikoyat kelib tushganda biz servisga kirishni cheklashimiz yoki toʻxtatishimiz mumkin.",
            ],
          },
          {
            heading: "Oʻzgartirishlar va qoʻllaniladigan huquq",
            body: [
              "Biz shartlarni oʻzgartirishimiz mumkin; amaldagi tahrir sanasi sahifaning boshida koʻrsatilgan. Oʻzgarishlardan keyin servisdan foydalanishni davom ettirish bilan siz yangi tahrirni qabul qilasiz.",
              "Taraflar oʻrtasidagi munosabatlarga Qozogʻiston Respublikasi huquqi qoʻllaniladi. Taraflar nizolarni yozishmalar orqali hal qilishga intiladi, kelishuvga erishilmagan taqdirda esa — Qozogʻiston Respublikasi qonunchiligida belgilangan tartibda.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie siyosati",
        summary: `${operator.site} qanday cookie fayllaridan foydalanishi, ular nima uchun kerakligi va ulardan qanday voz kechish mumkinligi.`,
        sections: [
          {
            heading: "Cookie nima",
            body: [
              "Cookie — sayt brauzeringizda saqlaydigan kichik matnli fayllar. Ular sozlamalaringizni eslab qolish va tashriflarning anonimlashtirilgan statistikasini yigʻish imkonini beradi.",
              "Ushbu hujjatda cookie bilan birga unga yaqin texnologiyalar — brauzerning lokal xotirasi va piksel-hisoblagichlar ham bayon etiladi.",
            ],
          },
          {
            heading: "Zarur cookie fayllari",
            body: [
              "Ularsiz servis ishlamaydi, shuning uchun ular har doim oʻrnatiladi.",
            ],
            bullets: [
              "Cloudflare Turnstile — havolani skript emas, inson yuborayotganini tekshirish.",
              "Interfeys sozlamalari — tanlangan til va bezak mavzusi.",
            ],
          },
          {
            heading: "Tahliliy cookie fayllari",
            body: [
              "Ular qaysi sahifalardan foydalanilayotganini va xatolar qayerda yuzaga kelayotganini tushunishga yordam beradi. Ular sizning roziligingiz bilan oʻrnatiladi va servis ishlashi uchun majburiy emas.",
            ],
            bullets: [
              "Google Analytics va Google Tag Manager — anonimlashtirilgan koʻrinishdagi tashriflar soni va saytdagi xatti-harakatlar.",
              "Yandex Metrica — tashriflar soni, kliklar xaritasi va Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica Webvisori sahifadagi harakatlarni yozib oladi: koʻrsatkich harakatlari, sahifani aylantirish, kliklar va havola maydoniga kiritilgan matn. Bu interfeys qayerda chalkashlikka sabab boʻlayotganini koʻrish uchun kerak.",
              "Biz bu yozuvlardan muayyan shaxslarni kuzatish uchun foydalanmaymiz. Sayt maydonlariga saqlanishini istamaydigan maʼlumotlarni kiritmang.",
            ],
          },
          {
            heading: "Qanday voz kechish mumkin",
            bullets: [
              "Brauzeringizda cookie fayllarini bloklash yoki oʻchirishni sozlang — bu usul sanab oʻtilgan barcha tizimlar uchun ishlaydi.",
              "Google Analytics: maʼlumot yigʻishni oʻchiradigan rasmiy brauzer qoʻshimchasi Google saytida mavjud.",
              "Yandex Metrica: voz kechish Yandexning rasmiy qoʻshimchasi orqali mumkin.",
              "Zarur cookie fayllarini oʻchirib qoʻyish yuklab olishni imkonsiz qiladi.",
            ],
          },
          {
            heading: "Saqlash muddatlari",
            body: [
              "Seans cookie fayllari brauzer yopilganda yoki seans muddati tugaganda oʻchiriladi. Tahliliy hisoblagichlar identifikatorlarni ularning provayderlari belgilagan muddatlar davomida saqlaydi.",
            ],
          },
        ],
      },
      copyright: {
        title: "Huquq egalari uchun",
        summary: "Servisning mualliflik huquqiga oid pozitsiyasi va huquqbuzarlik yuzasidan shikoyat berish tartibi.",
        sections: [
          {
            heading: "Servisning pozitsiyasi",
            body: [
              "Servis oʻzida video joylashtirmaydi va ularning katalogini yuritmaydi. U texnik vositachi sifatida ishlaydi: foydalanuvchi kiritgan havola boʻyicha ommaga ochiq sahifaga murojaat qiladi va faylni foydalanuvchiga uzatadi.",
              "Yuklab olingan fayllar serverda taxminan bir soat saqlanadi va avtomatik ravishda oʻchiriladi. Bizda boshqalar kontentining doimiy nusxasi qolmaydi.",
              "Yuklab olingan materialdan foydalanish uchun javobgarlik foydalanuvchining zimmasida — bu Foydalanuvchi kelishuvida bevosita mustahkamlab qoʻyilgan.",
            ],
          },
          {
            heading: "Agar huquqlaringiz buzilgan boʻlsa",
            body: [
              `Agar siz huquq egasi yoki uning vakili boʻlsangiz va servis huquqlaringizni buzish uchun ishlatilmoqda deb hisoblasangiz, ${MAIL} manziliga yozing. Biz bunday murojaatlarni koʻrib chiqamiz va choralar koʻramiz.`,
            ],
          },
          {
            heading: "Murojaatda nimalarni koʻrsatish kerak",
            bullets: [
              "Qaysi asarga daxl qilingani va qanday asosda unga nisbatan huquqlarga egaligingiz.",
              "Materialga havola va, agar maʼlum boʻlsa, huquqbuzarlik holatlari.",
              "Aloqa maʼlumotlaringiz: ism yoki nom, manzil va elektron pochta manzili.",
              "Agar siz huquq egasi nomidan harakat qilsangiz — vakolatlaringizni tasdiqlovchi hujjat.",
              "Murojaatdagi maʼlumotlar haqqoniy ekanligi, materialdan foydalanishga esa huquq egasi yoki qonun ruxsat bermaganligi toʻgʻrisidagi bayonot.",
            ],
          },
          {
            heading: "Biz nima qilamiz",
            body: [
              "Biz murojaatni oqilona muddatda, qoida tariqasida, oʻttiz kalendar kuni ichida koʻrib chiqamiz va huquqbuzarlik tasdiqlansa, servis orqali materialga kirishni, zarur hollarda esa huquqbuzarning servisga kirishini cheklaymiz.",
              "Koʻrib chiqish natijalari haqida siz koʻrsatgan elektron pochta manziliga xabar beramiz.",
            ],
          },
          {
            heading: "Insofsiz murojaatlar",
            body: [
              "Bila turib notoʻgʻri maʼlumotlarni oʻz ichiga olgan murojaat qonunchilikka muvofiq arizachining javobgarligiga sabab boʻlishi mumkin. Agar murojaat huquq egasini ham, nizoli materialni ham aniqlash imkonini bermasa, biz uni koʻrib chiqishni rad etish huquqiga egamiz.",
            ],
          },
        ],
      },
    },
  },
  tr: {
    ui: {
      updated: "Son güncelleme",
      back: "Ana sayfaya dön",
      operatorHeading: "Hizmet işletmecisi",
      navHeading: "Diğer belgeler",
      labels: {
        privacy: "Gizlilik Politikası",
        terms: "Kullanım Koşulları",
        cookies: "Çerez Politikası",
        copyright: "Hak Sahipleri İçin",
      },
    },
    docs: {
      privacy: {
        title: "Gizlilik Politikası",
        summary: `${operator.site} hizmetinin hangi verileri topladığı, bunlara neden ihtiyaç duyulduğu, ne kadar süre saklandığı ve nasıl silinebileceği.`,
        sections: [
          {
            heading: "Genel hükümler",
            body: [
              `İşbu Politika, ${operator.site} hizmetinin hangi kişisel verileri hangi amaçla işlediğini açıklar. Veri sorumlusu: ${operator.nameTr}.`,
              "Hizmeti kullanarak burada açıklanan işleme usulünü kabul etmiş olursunuz. Bu usulü kabul etmiyorsanız lütfen hizmeti kullanmayınız.",
              "İşleme faaliyetleri, Kazakistan Cumhuriyeti’nin “Kişisel Veriler ve Korunması Hakkında” Kanunu’na uygun olarak ve Avrupa Ekonomik Alanı’ndan gelen ziyaretçiler bakımından GDPR (Genel Veri Koruma Tüzüğü) gereklilikleri dikkate alınarak yürütülür.",
            ],
          },
          {
            heading: "Hangi verileri işliyoruz",
            body: [
              "Hizmetin işleyişi için gerekli olanın ötesinde hiçbir veriyi bilinçli olarak toplamıyoruz; kimlik belgesi, ödeme bilgisi veya adres talep etmiyoruz.",
            ],
            bullets: [
              "Bota mesaj yazdığınızda botun aldığı Telegram hesap verileri: sayısal kimlik numarası, kullanıcı adı, ad ve dil kodu.",
              "İndirmek üzere gönderdiğiniz bağlantılar ve indirme girişimine ilişkin bilgiler: platform, tarih ve saat, seçilen kalite, sonuç (başarılı veya hata).",
              "Bağlantıya ilişkin teknik veriler: IP adresi, tarayıcı türü ve sürümü, dil, yönlendiren sayfa. Bu veriler sunucu kayıtlarına ve web analitiği sistemlerine aktarılır.",
              "Çerezler ve analitik tanımlayıcılar — ayrıntılar için Çerez Politikası’na bakınız.",
            ],
          },
          {
            heading: "Bu verilere neden ihtiyaç duyuyoruz",
            bullets: [
              "Hizmetin kendisini sunmak: bağlantınızdaki videoyu almak ve dosyayı size iletmek.",
              "Hesabınızı başkalarının hesaplarından ayırt etmek ve kötüye kullanımı önlemek.",
              "Hizmeti otomatik kötüye kullanıma karşı korumak: bağlantı gönderilmeden önce Cloudflare Turnstile doğrulaması.",
              "Sitenin nasıl kullanıldığını anlamak ve hataları gidermek — anonimleştirilmiş ve toplu istatistikler.",
              "Sizin ve hak sahiplerinin başvurularını yanıtlamak.",
              "Hizmet hakkındaki görüşünüzü öğrenmek için ara sıra size Telegram üzerinden yazmak — örneğin hizmeti kullanmayı bıraktıysanız. Yanıt vermek zorunlu değildir; bu tür mesajlar almak istemiyorsanız bunu bize bildirmeniz yeterlidir, size bir daha yazmayız.",
            ],
          },
          {
            heading: "İşlemenin hukuki dayanakları",
            body: [
              "Telegram hesap verileri ve indirmelere ilişkin bilgiler, hizmeti kullanmaya başlamakla kabul ettiğiniz Kullanım Koşulları’nın ifası için işlenir.",
              "Analitik çerezler ve sitedeki işlemlerin kaydı, dilediğiniz zaman geri alabileceğiniz açık rızanıza dayanılarak işlenir — geri alma yolları Çerez Politikası’nda açıklanmıştır.",
              "Sunucu kayıtları ve bot koruması, hizmetin çalışır ve güvenli durumda tutulmasına yönelik meşru menfaatimiz kapsamında işlenir.",
              "Hizmet hakkındaki görüşünüzü sormak, hizmeti iyileştirmeye yönelik meşru menfaatimiz kapsamındadır; bundan dilediğiniz zaman vazgeçebilirsiniz.",
            ],
          },
          {
            heading: "Bağlı hesaplar",
            body: [
              "Dilerseniz bir platformdaki (Instagram, Facebook, YouTube, X, VK, TikTok) hesabınızı bota bağlayabilirsiniz; böylece bot yalnızca oturum açmış kullanıcıların görebildiği gönderileri, yani hikâyeleri ve gizli paylaşımları indirebilir. Bunun için bot, söz konusu hesabın çerezlerini Videoner uzantısından tek kullanımlık bir kodla veya gönderdiğiniz bir dosyadan alır.",
              "Yalnızca seçilen platformun çerezlerini saklıyor, diğerlerini derhal siliyoruz. Çerezler şifrelenmiş biçimde saklanır ve yalnızca onları bağladığınız yerdeki indirmeler için kullanılır. Özel sohbette bağlanan çerezler sizin indirmelerinize, kendi hesabı bağlı olmayan gruplarda paylaştığınız kendi bağlantılarınız da dahil olmak üzere hizmet eder; başkalarının bağlantıları için kullanılmaz. Bir gruba bağlanan çerezler yalnızca o grubun üyelerinin indirmelerine hizmet eder, başka hiçbir yerde kullanılmaz.",
              "Hukuki dayanak açık rızanızdır: hesabı kendiniz bağlarsınız ve /accounts komutuyla dilediğiniz zaman kaldırabilirsiniz. Kaldırılan çerezler geri dönülemez biçimde silinir. Platform oturum açmayı kabul etmemeye başlarsa bot sizi bilgilendirir.",
              "Bağlı bir hesap aracılığıyla indirilen gönderiler kanalımızda yayımlanmaz ve ortak önbellekten diğer kullanıcılara sunulmaz.",
            ],
          },
          {
            heading: "Üçüncü taraf hizmetleri",
            body: [
              "Verilerinizi satmıyor ve üçüncü kişilere kendi amaçları için aktarmıyoruz. Hizmetin işleyişi için, her biri verileri kendi kurallarına göre işleyen aşağıdaki sağlayıcılardan yararlanılmaktadır:",
            ],
            bullets: [
              `Telegram — ${BOT} botunun işleyişi.`,
              "Cloudflare — bot koruması (Turnstile), sitenin sunulması ve e-posta yönlendirmesi.",
              "Google Analytics ve Google Tag Manager — ziyaret istatistikleri.",
              "Yandex Metrica — ziyaret istatistikleri, tıklama haritası ve Webvisor. Webvisor, sayfadaki işlemleri kaydeder: imleç hareketleri, kaydırma ve tıklamalar. Kayıtlar yalnızca sitenin kullanım kolaylığını analiz etmek için kullanılır.",
            ],
          },
          {
            heading: "Verileri ne kadar süre saklıyoruz",
            bullets: [
              "İndirilen dosyalar, oluşturulmalarından yaklaşık bir saat sonra sunucudan otomatik olarak silinir. Videolarınızın arşivini tutmuyoruz.",
              "İndirme girişimlerine ilişkin kayıtlar, kötüye kullanımın önlenmesi ve başvuruların incelenmesi için gerekli olduğu sürece saklanır.",
              "Hesap verileri, hizmeti kullandığınız sürece saklanır ve talebiniz üzerine silinir.",
              "Sunucu kayıtları sınırlı bir süre saklanır ve döngüsel olarak üzerine yazılır.",
            ],
          },
          {
            heading: "Veriler nerede işlenir",
            body: [
              "Hizmetin sunucuları Avrupa Birliği sınırları içindeki bir veri merkezinde bulunmaktadır. Yukarıda sayılan sağlayıcıların bir kısmı, kendi politikalarına uygun olarak verileri Avrupa Birliği dışında işleyebilir.",
            ],
          },
          {
            heading: "Haklarınız",
            body: [
              `Verilerinizin işlenmesine ilişkin bilgi talep etme, verilerinizin düzeltilmesini veya silinmesini isteme, açık rızanızı geri alma ve işlemeye itiraz etme hakkına sahipsiniz. Bunun için başvurunun ilgili olduğu e-posta adresinden veya Telegram hesabından ${MAIL} adresine yazınız.`,
              "Makul bir süre içinde, kural olarak otuz takvim günü içinde yanıt veririz. Hesabın silinmesi, hesaba bağlı indirme geçmişinin de silinmesi sonucunu doğurur.",
            ],
          },
          {
            heading: "Reşit olmayanlar",
            body: [
              "Hizmet 16 yaşından küçük çocuklara yönelik değildir ve onlara hitap etmez. Bu kullanıcıların verilerini bilerek toplamıyoruz; bu durum yanlışlıkla gerçekleşmişse bize yazınız, veriler silinecektir.",
            ],
          },
          {
            heading: "Değişiklikler",
            body: [
              "Bu Politikayı güncelleyebiliriz. Yürürlükteki sürümün tarihi sayfanın başında belirtilmiştir; önemli değişiklikleri hizmet içinde ayrıca belirteceğiz.",
            ],
          },
        ],
      },
      terms: {
        title: "Kullanım Koşulları",
        summary: `${operator.site} kullanım kuralları: neye izin verildiği, neyin yasak olduğu ve hizmetin hangi koşullarla çalıştığı.`,
        sections: [
          {
            heading: "Genel hükümler",
            body: [
              `İşbu Koşullar, ${operator.site} web sitesinin ve ${BOT} Telegram botunun kullanımını düzenler. Hizmetin sahibi ve işletmecisi: ${operator.nameTr}.`,
              "Hizmeti kullanmaya başlayarak bu Koşulları okuduğunuzu ve kabul ettiğinizi teyit edersiniz. Herhangi bir koşul size uygun değilse hizmeti kullanmamalısınız.",
            ],
          },
          {
            heading: "Hizmet ücretsizdir",
            body: [
              "Hizmetin tüm olanakları ücretsiz olarak sunulur. Abonelik, ücretli tarife, ücretli video kalitesi veya hizmet içi satın alma bulunmamaktadır.",
              "Reklam göstermiyor ve satış ortaklığı (affiliate) bağlantıları yerleştirmiyoruz.",
            ],
          },
          {
            heading: "Erişim koşulları",
            bullets: [
              "Sitede indirme yapmak için hesap oluşturmak veya oturum açmak gerekmez. Bot, kullanıcıları Telegram hesaplarından ayırt eder.",
              "Hizmet, aşırı yüklenmeye ve otomatik kötüye kullanıma karşı istek sıklığına ilişkin teknik sınırlamalarla korunmaktadır.",
              "YouTube için günlük trafik sınırı uygulanır: sitede ve uzantıda tek bir ağ başına 24 saatte 10 GB, botta ise tek bir Telegram hesabı başına 24 saatte 25 GB. Bu sınır diğer platformları etkilemez.",
              "Bot aracılığıyla indirme yapmak için kanalımıza abone olmak gerekmez. Bot, dosya açıklamalarına projenin haber kanalının bağlantısını ekler; bu kanala abone olmak isteğe bağlıdır.",
            ],
          },
          {
            heading: "Hizmet ne yapar",
            body: [
              "Hizmet teknik bir aracıdır: sağladığınız bağlantı üzerinden herkese açık bir sayfaya erişir, medya dosyasını alır ve size iletir.",
              "Bünyemizde bir video kataloğu barındırmıyor, başkalarına ait içerikler üzerinde arama yapmıyor ve indirilen dosyaları iletim için gerekli süreden — yaklaşık bir saatten — daha uzun süre saklamıyoruz.",
              "Belirli bir platformun kullanılabilirliği o platformun teknik kararlarına bağlıdır ve önceden bildirimde bulunulmaksızın değişebilir.",
            ],
          },
          {
            heading: "Kullanıcının yükümlülükleri",
            body: [
              "Edindiğiniz dosyaları nasıl kullandığınızdan yalnızca siz sorumlusunuz ve bunu yapmaya hakkınız olduğunu teyit edersiniz.",
            ],
            bullets: [
              "Yalnızca haklarına sahip olduğunuz veya kullanımına hak sahibinin ya da kanunun izin verdiği materyalleri indiriniz.",
              "Hizmeti telif hakları ve bağlantılı hakları ihlal etmek, yasaklanmış içerik yaymak veya üçüncü kişilerin haklarını ihlal etmek için kullanmayınız.",
              "İstek sıklığı sınırlamaları ve bot doğrulaması dahil olmak üzere hizmetin teknik sınırlamalarını aşmaya çalışmayınız.",
              "Otomatik yük oluşturmayınız: toplu istekler, betikler ve kazıyıcılar (scraper) kullanılamaz.",
            ],
          },
          {
            heading: "Bağlantıların kanalda yayımlanması",
            body: [
              "Bot aracılığıyla video indirerek, orijinal gönderinin bağlantısının Telegram kanalımızda yayımlanmasını kabul etmiş olursunuz. Bu konudaki uyarı, kalite seçiminden önce — yani indirme kararınızı vermeden önce — botta gösterilir.",
              "Yayın anonimdir: kanala herkese açık sayfanın bağlantısı, videonun başlığı ve kapak görseli — platformun gönderi önizlemesinde gösterdiği kare — gönderilir. Videoyu kimin indirdiği belirtilmez. Video dosyasının kendisi hiçbir zaman ve hiçbir yerde yayımlanmaz: paylaşılan şey, platformların da her gönderinin altındaki “Paylaş” düğmesiyle paylaşılmasını önerdiği bağlantıdır.",
              "Aynı bağlantı en fazla bir kez yayımlanır. Bir bağlantının kanala düşmesini istemiyorsanız o videoyu hizmetimiz aracılığıyla indirmeyiniz.",
              "Gruplardan gelen bağlantılar ve bağlı bir hesap aracılığıyla indirilen gönderiler kanalda yayımlanmaz."
            ],
          },
          {
            heading: "Kendi hesabınızın bağlanması",
            body: [
              "Bir platformdaki hesabınızı bota bağlayarak, bunun sizin hesabınız olduğunu ve onu bu şekilde kullanmaya yetkili olduğunuzu teyit edersiniz.",
              "Platformlar otomatik indirmeleri onaylamaz ve bağlanan hesabı kısıtlayabilir veya engelleyebilir. Bu riski üstlenmiş olursunuz; ana hesabınızı değil, ayrı bir hesabı bağlamanızı tavsiye ederiz. Platformun hesabınıza uygulayacağı kısıtlamalardan sorumlu değiliz.",
              "Bir gruba bağlanan hesap, grubun tüm üyelerinin indirmeleri için kullanılır. Kimin hesap bağlayabileceğine grup yöneticileri karar verir ve bağlanan herhangi bir hesabı kaldırabilir.",
            ],
          },
          {
            heading: "Sorumluluğun sınırlandırılması",
            body: [
              "Hizmet “olduğu gibi” esasıyla sunulur. Kesintisiz çalışmayı, belirli bir platformun kullanılabilirliğini veya dosyanın amaçlarınıza uygunluğunu garanti etmiyoruz.",
              "İndirdiğiniz materyali nasıl kullandığınızdan ve üçüncü kişilerin haklarını ihlal etmenizin sonuçlarından sorumlu değiliz.",
              "Hizmetin sunduğu olanakları değiştirme, bakım için hizmeti askıya alma ve hizmetin işleyişine son verme hakkımız saklıdır.",
            ],
          },
          {
            heading: "Erişimin kısıtlanması",
            body: [
              "İşbu Koşulların ihlali, sınırlamaları aşma girişimleri veya hak sahibinden gerekçeli bir şikâyet alınması hâlinde hizmete erişimi kısıtlayabilir veya sona erdirebiliriz.",
            ],
          },
          {
            heading: "Değişiklikler ve uygulanacak hukuk",
            body: [
              "Koşulları değiştirebiliriz; yürürlükteki sürümün tarihi sayfanın başında belirtilmiştir. Değişikliklerden sonra hizmeti kullanmaya devam etmeniz, yeni sürümü kabul ettiğiniz anlamına gelir.",
              "Taraflar arasındaki ilişkilere Kazakistan Cumhuriyeti hukuku uygulanır. Taraflar uyuşmazlıkları yazışma yoluyla çözmeye çalışır; uzlaşma sağlanamazsa uyuşmazlıklar Kazakistan Cumhuriyeti mevzuatında belirlenen usule göre çözülür.",
            ],
          },
        ],
      },
      cookies: {
        title: "Çerez Politikası",
        summary: `${operator.site} hizmetinin hangi çerezleri kullandığı, bunların ne işe yaradığı ve nasıl reddedilebileceği.`,
        sections: [
          {
            heading: "Çerez nedir",
            body: [
              "Çerezler, bir sitenin tarayıcınızda sakladığı küçük metin dosyalarıdır. Ayarlarınızın hatırlanmasını ve anonimleştirilmiş ziyaret istatistiklerinin toplanmasını sağlar.",
              "Bu belgede çerezlerle birlikte bunlara yakın teknolojileri — tarayıcının yerel depolama alanını ve izleme piksellerini — de açıklıyoruz.",
            ],
          },
          {
            heading: "Zorunlu çerezler",
            body: [
              "Bunlar olmadan hizmet çalışmaz; bu nedenle her zaman yerleştirilirler.",
            ],
            bullets: [
              "Cloudflare Turnstile — bağlantının bir betik tarafından değil, bir insan tarafından gönderildiğinin doğrulanması.",
              "Arayüz ayarları — seçilen dil ve renk teması.",
            ],
          },
          {
            heading: "Analitik çerezler",
            body: [
              "Hangi sayfaların kullanıldığını ve hataların nerede ortaya çıktığını anlamamıza yardımcı olurlar. Açık rızanızla yerleştirilirler ve hizmetin çalışması için zorunlu değildirler.",
            ],
            bullets: [
              "Google Analytics ve Google Tag Manager — anonimleştirilmiş biçimde ziyaret sayıları ve site içi davranış.",
              "Yandex Metrica — ziyaret sayıları, tıklama haritası ve Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica’nın Webvisor aracı sayfadaki işlemleri kaydeder: imleç hareketleri, kaydırma, tıklamalar ve bağlantı alanına yapılan girişler. Bu, arayüzün kullanıcıların kafasını nerede karıştırdığını görmek için gereklidir.",
              "Bu kayıtları belirli kişileri izlemek için kullanmıyoruz. Sitenin alanlarına saklanmasını istemeyeceğiniz bilgileri girmeyiniz.",
            ],
          },
          {
            heading: "Nasıl reddedilir",
            bullets: [
              "Tarayıcınızda çerezlerin engellenmesini veya silinmesini ayarlayınız — bu yöntem burada sayılan tüm sistemler için geçerlidir.",
              "Google Analytics: veri toplamayı devre dışı bırakan resmî tarayıcı eklentisi Google’ın sitesinde mevcuttur.",
              "Yandex Metrica: Yandex’in resmî eklentisi aracılığıyla devre dışı bırakılabilir.",
              "Zorunlu çerezlerin devre dışı bırakılması indirme yapılmasını imkânsız hâle getirir.",
            ],
          },
          {
            heading: "Saklama süreleri",
            body: [
              "Oturum çerezleri, tarayıcı kapatıldığında veya oturum süresi dolduğunda silinir. Analitik araçlar, tanımlayıcılarını sağlayıcılarının belirlediği süreler boyunca saklar.",
            ],
          },
        ],
      },
      copyright: {
        title: "Hak Sahipleri İçin",
        summary: "Hizmetin telif haklarına ilişkin tutumu ve ihlal şikâyetinde bulunma usulü.",
        sections: [
          {
            heading: "Hizmetin tutumu",
            body: [
              "Hizmet bünyesinde video barındırmaz ve video kataloğu tutmaz. Teknik bir aracı olarak çalışır: kullanıcının girdiği bağlantı üzerinden herkese açık bir sayfaya erişir ve dosyayı kullanıcıya iletir.",
              "İndirilen dosyalar sunucuda yaklaşık bir saat saklanır ve otomatik olarak silinir. Başkalarına ait içeriğin kalıcı bir kopyası bizde kalmaz.",
              "İndirilen materyalin kullanımından kullanıcı sorumludur — bu husus Kullanım Koşulları’nda açıkça düzenlenmiştir.",
            ],
          },
          {
            heading: "Haklarınız ihlal ediliyorsa",
            body: [
              `Hak sahibi veya temsilcisiyseniz ve hizmetin haklarınızı ihlal etmek için kullanıldığını düşünüyorsanız ${MAIL} adresine yazınız. Bu tür başvuruları inceler ve gerekli önlemleri alırız.`,
            ],
          },
          {
            heading: "Başvuruda belirtilmesi gerekenler",
            bullets: [
              "Hangi eserin etkilendiği ve bu eser üzerindeki haklarınızın hangi dayanağa sahip olduğu.",
              "Materyalin bağlantısı ve biliniyorsa ihlalin koşulları.",
              "İletişim bilgileriniz: adınız veya unvanınız, adresiniz ve e-posta adresiniz.",
              "Hak sahibi adına hareket ediyorsanız yetkinizi gösteren belge.",
              "Başvurudaki bilgilerin doğru olduğuna ve materyalin kullanımına hak sahibinin veya kanunun izin vermediğine dair beyan.",
            ],
          },
          {
            heading: "Ne yapacağız",
            body: [
              "Başvuruyu makul bir süre içinde, kural olarak otuz takvim günü içinde inceleriz; ihlalin teyit edilmesi hâlinde materyale hizmet üzerinden erişimi ve gerekirse ihlal edenin hizmete erişimini kısıtlarız.",
              "İnceleme sonucunu belirttiğiniz e-posta adresine bildiririz.",
            ],
          },
          {
            heading: "Kötü niyetli başvurular",
            body: [
              "Bilerek gerçeğe aykırı bilgiler içeren bir başvuru, başvuru sahibinin mevzuat uyarınca sorumluluğunu doğurabilir. Ne hak sahibinin ne de uyuşmazlık konusu materyalin belirlenmesine imkân vermeyen bir başvuruyu incelemeyi reddetme hakkımız saklıdır.",
            ],
          },
        ],
      },
    },
  },
  fa: {
    ui: {
      updated: "تاریخ ویرایش",
      back: "بازگشت به صفحه اصلی",
      operatorHeading: "گرداننده سرویس",
      navHeading: "سایر اسناد",
      labels: {
        privacy: "سیاست حفظ حریم خصوصی",
        terms: "شرایط استفاده",
        cookies: "سیاست کوکی",
        copyright: "صاحبان حقوق",
      },
    },
    docs: {
      privacy: {
        title: "سیاست حفظ حریم خصوصی",
        summary: `چه داده‌هایی توسط ${operator.site} جمع‌آوری می‌شود، این داده‌ها برای چه لازم است، چه مدت نگهداری می‌شود و چگونه می‌توان آن‌ها را حذف کرد.`,
        sections: [
          {
            heading: "کلیات",
            body: [
              `این سیاست توضیح می‌دهد که سرویس ${operator.site} چه داده‌های شخصی‌ای را و با چه هدفی پردازش می‌کند. مسئول پردازش داده‌ها ${operator.nameFa} است.`,
              "با استفاده از سرویس، شما با ترتیب پردازشی که در اینجا شرح داده شده است موافقت می‌کنید. اگر با آن موافق نیستید، لطفاً از سرویس استفاده نکنید.",
              "پردازش داده‌ها مطابق با قانون جمهوری قزاقستان «درباره داده‌های شخصی و حفاظت از آن‌ها» و در مورد بازدیدکنندگان از منطقه اقتصادی اروپا، با رعایت الزامات GDPR انجام می‌شود.",
            ],
          },
          {
            heading: "چه داده‌هایی را پردازش می‌کنیم",
            body: [
              "ما آگاهانه چیزی فراتر از آنچه برای کارکرد سرویس لازم است جمع‌آوری نمی‌کنیم و مدارک هویتی، اطلاعات پرداخت یا نشانی پستی شما را درخواست نمی‌کنیم.",
            ],
            bullets: [
              "داده‌های حساب کاربری Telegram که ربات هنگام پیام دادن شما به آن دریافت می‌کند: شناسه عددی، نام کاربری، نام و کد زبان.",
              "پیوندهایی که برای دانلود ارسال می‌کنید و اطلاعات مربوط به خود تلاش دانلود: پلتفرم، تاریخ و زمان، کیفیت انتخاب‌شده و نتیجه (موفقیت یا خطا).",
              "داده‌های فنی اتصال: نشانی IP، نوع و نسخه مرورگر، زبان و صفحه ارجاع‌دهنده. این داده‌ها در گزارش‌های (لاگ‌های) سرور و در ابزارهای تحلیل وب ثبت می‌شوند.",
              "کوکی‌ها و شناسه‌های تحلیلی — جزئیات بیشتر در سیاست کوکی آمده است.",
            ],
          },
          {
            heading: "چرا به این داده‌ها نیاز داریم",
            bullets: [
              "ارائه خود خدمت: دریافت ویدیو از پیوند شما و تحویل فایل به شما.",
              "تمایز حساب کاربری شما از حساب دیگران و مقابله با سوءاستفاده.",
              "محافظت از سرویس در برابر سوءاستفاده خودکار: بررسی Cloudflare Turnstile پیش از ارسال پیوند.",
              "درک نحوه استفاده از سایت و رفع خطاها — با استفاده از آمار ناشناس‌شده و تجمیعی.",
              "پاسخ به درخواست‌های شما و درخواست‌های صاحبان حقوق.",
              "ارسال گاه‌به‌گاه پیام به شما در Telegram برای جویا شدن نظرتان درباره سرویس — برای مثال، اگر استفاده از آن را کنار گذاشته باشید. پاسخ دادن الزامی نیست؛ اگر مایل به دریافت چنین پیام‌هایی نیستید، کافی است این را به ما بگویید تا دیگر پیامی نفرستیم.",
            ],
          },
          {
            heading: "مبانی قانونی پردازش",
            body: [
              "داده‌های حساب Telegram و اطلاعات مربوط به دانلودها به منظور اجرای شرایط استفاده پردازش می‌شوند؛ شرایطی که شما با شروع استفاده از سرویس آن را می‌پذیرید.",
              "کوکی‌های تحلیلی و ضبط فعالیت در سایت بر اساس رضایت شما پردازش می‌شوند که می‌توانید هر زمان آن را پس بگیرید — روش‌های آن در سیاست کوکی شرح داده شده است.",
              "گزارش‌های سرور و محافظت در برابر ربات‌ها در چارچوب منافع مشروع ما در حفظ عملکرد و امنیت سرویس پردازش می‌شوند.",
              "پرسیدن نظر شما درباره سرویس در چارچوب منافع مشروع ما در بهبود سرویس انجام می‌شود؛ شما می‌توانید هر زمان از آن انصراف دهید.",
            ],
          },
          {
            heading: "حساب‌های متصل",
            body: [
              "در صورت تمایل، می‌توانید حساب کاربری خود در یک پلتفرم (Instagram، Facebook، YouTube، X، VK، TikTok) را به ربات متصل کنید تا ربات محتوایی را دانلود کند که فقط برای کاربرانِ واردشده قابل مشاهده است: استوری‌ها و پست‌های خصوصی. برای این منظور، ربات کوکی‌های آن حساب را دریافت می‌کند — از افزونه Videoner از طریق یک کد یک‌بارمصرف، یا از فایلی که خودتان ارسال کرده‌اید.",
              "ما فقط کوکی‌های پلتفرم انتخاب‌شده را نگه می‌داریم و بقیه را بی‌درنگ کنار می‌گذاریم. این کوکی‌ها به‌صورت رمزگذاری‌شده ذخیره می‌شوند و فقط برای دانلود در جایی به کار می‌روند که آن‌ها را متصل کرده‌اید. کوکی‌هایی که در گفت‌وگوی خصوصی متصل شده‌اند برای دانلودهای شما به کار می‌روند، از جمله پیوندهای خود شما در گروه‌هایی که حساب جداگانه‌ای به آن‌ها متصل نیست؛ این کوکی‌ها هرگز برای پیوندهای دیگران استفاده نمی‌شوند. کوکی‌هایی که به یک گروه متصل شده‌اند فقط برای دانلودهای اعضای همان گروه به کار می‌روند و در هیچ جای دیگری استفاده نمی‌شوند.",
              "مبنای قانونی، رضایت شماست: شما خودتان حساب را متصل می‌کنید و می‌توانید هر زمان آن را با فرمان ‎/accounts حذف کنید. با حذف، کوکی‌ها به‌طور برگشت‌ناپذیر پاک می‌شوند. اگر پلتفرم دیگر ورود را نپذیرد، ربات این موضوع را به شما اطلاع می‌دهد.",
              "محتوایی که از طریق حساب متصل دانلود می‌شود در کانال ما منتشر نمی‌شود و از حافظه پنهان (کش) مشترک در اختیار کاربران دیگر قرار نمی‌گیرد.",
            ],
          },
          {
            heading: "خدمات اشخاص ثالث",
            body: [
              "ما داده‌های شما را نمی‌فروشیم و آن‌ها را برای اهداف خودِ اشخاص ثالث به آنان منتقل نمی‌کنیم. برای کارکرد سرویس از ارائه‌دهندگان زیر استفاده می‌شود که هر یک داده‌ها را طبق قواعد خود پردازش می‌کند:",
            ],
            bullets: [
              `Telegram — کارکرد ربات ‎${BOT}.`,
              "Cloudflare — محافظت در برابر ربات‌ها (Turnstile)، تحویل سایت و مسیریابی ایمیل.",
              "Google Analytics و Google Tag Manager — آمار بازدید.",
              "Yandex Metrica — آمار بازدید، نقشه کلیک و Webvisor. ابزار Webvisor فعالیت در صفحه را ضبط می‌کند: حرکت نشانگر، پیمایش و کلیک‌ها. این ضبط‌ها فقط برای تحلیل سهولت استفاده از سایت به کار می‌روند.",
            ],
          },
          {
            heading: "مدت نگهداری داده‌ها",
            bullets: [
              "فایل‌های دانلودشده حدود یک ساعت پس از ایجاد به‌طور خودکار از سرور حذف می‌شوند. ما هیچ بایگانی‌ای از ویدیوهای شما نگه نمی‌داریم.",
              "سوابق تلاش‌های دانلود تا زمانی نگهداری می‌شوند که برای مقابله با سوءاستفاده و رسیدگی به درخواست‌ها لازم باشد.",
              "داده‌های حساب کاربری تا زمانی که از سرویس استفاده می‌کنید نگهداری می‌شوند و به درخواست شما حذف می‌گردند.",
              "گزارش‌های سرور برای مدت محدودی نگهداری می‌شوند و در جریان چرخش دوره‌ای بازنویسی می‌شوند.",
            ],
          },
          {
            heading: "محل پردازش داده‌ها",
            body: [
              "سرورهای سرویس در یک مرکز داده در قلمرو اتحادیه اروپا قرار دارند. برخی از ارائه‌دهندگانی که در بالا ذکر شدند ممکن است داده‌ها را مطابق با سیاست‌های خود در خارج از آن پردازش کنند.",
            ],
          },
          {
            heading: "حقوق شما",
            body: [
              `شما حق دارید درباره پردازش داده‌های خود اطلاعات دریافت کنید، اصلاح یا حذف آن‌ها را درخواست کنید، رضایت خود را پس بگیرید و به پردازش اعتراض کنید. برای این منظور، از همان نشانی ایمیل یا حساب Telegram که درخواست به آن مربوط است به ${MAIL} بنویسید.`,
              "ما در مهلتی معقول، معمولاً ظرف سی روز تقویمی، پاسخ می‌دهیم. حذف حساب کاربری موجب حذف سابقه دانلودهای مرتبط با آن نیز می‌شود.",
            ],
          },
          {
            heading: "افراد زیر سن قانونی",
            body: [
              "سرویس برای کودکان زیر 16 سال در نظر گرفته نشده و خطاب به آنان نیست. ما آگاهانه داده‌های چنین کاربرانی را جمع‌آوری نمی‌کنیم؛ اگر این امر از روی اشتباه رخ داده باشد، به ما بنویسید تا داده‌ها حذف شوند.",
            ],
          },
          {
            heading: "تغییرات",
            body: [
              "ما ممکن است این سیاست را به‌روزرسانی کنیم. تاریخ ویرایش جاری در بالای صفحه درج شده است؛ تغییرات اساسی را در سرویس اعلام خواهیم کرد.",
            ],
          },
        ],
      },
      terms: {
        title: "شرایط استفاده",
        summary: `قواعد استفاده از ${operator.site}: چه کارهایی مجاز است، چه کارهایی مجاز نیست و سرویس تحت چه شرایطی کار می‌کند.`,
        sections: [
          {
            heading: "کلیات",
            body: [
              `این شرایط، استفاده از وب‌سایت ${operator.site} و ربات Telegram ‎${BOT} را تنظیم می‌کند. مالک و مدیر سرویس ${operator.nameFa} است.`,
              "با شروع استفاده از سرویس، تأیید می‌کنید که این شرایط را خوانده‌اید و آن‌ها را می‌پذیرید. اگر هر یک از شرایط برای شما مناسب نیست، نباید از سرویس استفاده کنید.",
            ],
          },
          {
            heading: "سرویس رایگان است",
            body: [
              "همه امکانات سرویس به‌صورت رایگان ارائه می‌شوند. ما هیچ اشتراک، طرح پولی، کیفیت ویدیوی پولی یا خرید درون سرویس نداریم.",
              "ما تبلیغات نمایش نمی‌دهیم و پیوند همکاری در فروش (افیلیت) قرار نمی‌دهیم.",
            ],
          },
          {
            heading: "شرایط دسترسی",
            bullets: [
              "برای دانلود در سایت نه به حساب کاربری نیاز است و نه به ورود. ربات کاربران را بر اساس حساب Telegram آنان از یکدیگر تمیز می‌دهد.",
              "محدودیت‌های فنی بر تعداد درخواست‌ها، سرویس را در برابر بار بیش از حد و سوءاستفاده خودکار محافظت می‌کنند.",
              "برای YouTube محدودیت روزانه ترافیک اعمال می‌شود: 10 GB در هر 24 ساعت برای هر شبکه در سایت و در افزونه، و 25 GB در هر 24 ساعت برای هر حساب Telegram در ربات. این محدودیت شامل سایر پلتفرم‌ها نمی‌شود.",
              "برای دانلود از طریق ربات، عضویت در کانال ما لازم نیست. ربات در توضیح (کپشن) فایل‌ها پیوندی به کانال خبری پروژه اضافه می‌کند؛ عضویت در آن اختیاری است.",
            ],
          },
          {
            heading: "کارکرد سرویس",
            body: [
              "سرویس یک واسطه فنی است: از طریق پیوندی که شما ارائه می‌کنید به صفحه‌ای عمومی و در دسترس همگان مراجعه می‌کند، فایل رسانه‌ای را دریافت می‌کند و آن را به شما منتقل می‌کند.",
              "ما هیچ فهرست (کاتالوگ) ویدیویی را میزبانی نمی‌کنیم، در محتوای دیگران جست‌وجو انجام نمی‌دهیم و فایل‌های دانلودشده را بیش از مدت لازم برای انتقال — حدود یک ساعت — نگه نمی‌داریم.",
              "در دسترس بودن هر پلتفرم مشخص به تصمیم‌های فنی همان پلتفرم بستگی دارد و ممکن است بدون اطلاع قبلی تغییر کند.",
            ],
          },
          {
            heading: "تعهدات کاربر",
            body: [
              "شما شخصاً مسئول نحوه استفاده از فایل‌های دریافتی هستید و تأیید می‌کنید که حق چنین استفاده‌ای را دارید.",
            ],
            bullets: [
              "فقط محتوایی را دانلود کنید که حقوق آن متعلق به شماست یا استفاده از آن از سوی صاحب حق یا به موجب قانون مجاز است.",
              "از سرویس برای نقض حق مؤلف و حقوق مرتبط، توزیع محتوای ممنوع یا نقض حقوق اشخاص ثالث استفاده نکنید.",
              "برای دور زدن محدودیت‌های فنی سرویس، از جمله محدودیت تعداد درخواست‌ها و بررسی ربات‌ها، تلاش نکنید.",
              "بار خودکار ایجاد نکنید: درخواست‌های انبوه، اسکریپت‌ها و ابزارهای استخراج داده (پارسرها) مجاز نیستند.",
            ],
          },
          {
            heading: "انتشار پیوندها در کانال",
            body: [
              "با دانلود ویدیو از طریق ربات، موافقت می‌کنید که پیوند پست اصلی در کانال Telegram ما منتشر شود. اخطار مربوط به این موضوع پیش از انتخاب کیفیت — یعنی پیش از آنکه درباره دانلود تصمیم بگیرید — در ربات نمایش داده می‌شود.",
              "انتشار به‌صورت ناشناس انجام می‌شود: پیوند صفحه عمومی، عنوان ویدیو و تصویر کاور آن — همان فریمی که پلتفرم در پیش‌نمایش پست نشان می‌دهد — به کانال فرستاده می‌شود. اینکه چه کسی ویدیو را دانلود کرده است ذکر نمی‌شود. خود فایل ویدیویی هرگز و در هیچ جا منتشر نمی‌شود: آنچه منتشر می‌شود پیوند است؛ پیوندی که خود پلتفرم‌ها با دکمه «اشتراک‌گذاری» زیر هر پست به انتشار آن دعوت می‌کنند.",
              "هر پیوند حداکثر یک بار منتشر می‌شود. اگر نمی‌خواهید پیوندی به کانال راه یابد، آن ویدیو را از طریق سرویس ما دانلود نکنید.",
              "پیوندهای گروه‌ها و محتوایی که از طریق حساب متصل دانلود شده است در کانال منتشر نمی‌شوند.",
            ],
          },
          {
            heading: "اتصال حساب کاربری خود",
            body: [
              "با اتصال حساب کاربری خود در یک پلتفرم به ربات، تأیید می‌کنید که این حساب متعلق به شماست و اختیار استفاده از آن را دارید.",
              "پلتفرم‌ها دانلود خودکار را تأیید نمی‌کنند و ممکن است حساب متصل را محدود یا مسدود کنند. شما این خطر را می‌پذیرید؛ توصیه می‌کنیم یک حساب جداگانه و غیراصلی را متصل کنید. ما در قبال محدودیت‌هایی که پلتفرم بر حساب شما اعمال کند مسئولیتی نداریم.",
              "حسابی که به یک گروه متصل شده است برای دانلودهای همه اعضای آن گروه استفاده می‌شود. مدیران گروه تعیین می‌کنند چه کسی می‌تواند حساب متصل کند و می‌توانند هر یک از حساب‌ها را حذف کنند.",
            ],
          },
          {
            heading: "محدودیت مسئولیت",
            body: [
              "سرویس «همان‌گونه که هست» ارائه می‌شود. ما کارکرد بی‌وقفه، در دسترس بودن هیچ پلتفرم مشخصی یا مناسب بودن فایل برای اهداف شما را تضمین نمی‌کنیم.",
              "ما در قبال نحوه استفاده شما از محتوای دانلودشده و پیامدهای نقض حقوق اشخاص ثالث توسط شما مسئولیتی نداریم.",
              "ما حق داریم امکانات سرویس را تغییر دهیم، کار آن را برای نگهداری و تعمیرات به حالت تعلیق درآوریم و فعالیت آن را متوقف کنیم.",
            ],
          },
          {
            heading: "محدودسازی دسترسی",
            body: [
              "ما می‌توانیم در صورت نقض این شرایط، تلاش برای دور زدن محدودیت‌ها یا دریافت شکایت مستند از سوی صاحب حق، دسترسی به سرویس را محدود یا قطع کنیم.",
            ],
          },
          {
            heading: "تغییرات و قانون حاکم",
            body: [
              "ما می‌توانیم این شرایط را تغییر دهیم؛ تاریخ ویرایش جاری در بالای صفحه درج شده است. ادامه استفاده از سرویس پس از اعمال تغییرات به معنای پذیرش ویرایش جدید است.",
              "قوانین جمهوری قزاقستان بر روابط طرفین حاکم است. طرفین می‌کوشند اختلافات را از طریق مکاتبه حل‌وفصل کنند و در صورت عدم حصول توافق، به ترتیبی که قوانین جمهوری قزاقستان مقرر کرده است.",
            ],
          },
        ],
      },
      cookies: {
        title: "سیاست کوکی",
        summary: `کوکی‌هایی که ${operator.site} از آن‌ها استفاده می‌کند، هدف از آن‌ها و روش امتناع از آن‌ها.`,
        sections: [
          {
            heading: "کوکی چیست",
            body: [
              "کوکی‌ها فایل‌های متنی کوچکی هستند که سایت در مرورگر شما ذخیره می‌کند. این فایل‌ها امکان به خاطر سپردن تنظیمات شما و جمع‌آوری آمار ناشناس بازدید را فراهم می‌کنند.",
              "در این سند، علاوه بر کوکی‌ها، فناوری‌های مشابه — یعنی حافظه محلی مرورگر و پیکسل‌های ردیابی — را نیز شرح می‌دهیم.",
            ],
          },
          {
            heading: "کوکی‌های ضروری",
            body: ["سرویس بدون آن‌ها کار نمی‌کند، به همین دلیل همیشه تنظیم می‌شوند."],
            bullets: [
              "Cloudflare Turnstile — بررسی اینکه پیوند را یک انسان ارسال می‌کند، نه یک اسکریپت.",
              "تنظیمات رابط کاربری — زبان و طرح ظاهری انتخاب‌شده.",
            ],
          },
          {
            heading: "کوکی‌های تحلیلی",
            body: [
              "این کوکی‌ها به ما کمک می‌کنند بفهمیم از کدام صفحات استفاده می‌شود و خطاها کجا رخ می‌دهند. این کوکی‌ها با رضایت شما تنظیم می‌شوند و برای کارکرد سرویس الزامی نیستند.",
            ],
            bullets: [
              "Google Analytics و Google Tag Manager — میزان بازدید و رفتار در سایت به‌صورت ناشناس.",
              "Yandex Metrica — میزان بازدید، نقشه کلیک و Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "ابزار Webvisor در Yandex Metrica فعالیت در صفحه را ضبط می‌کند: حرکت نشانگر، پیمایش، کلیک‌ها و وارد کردن متن در فیلد پیوند. هدف این است که ببینیم رابط کاربری در کجا کاربران را سردرگم می‌کند.",
              "ما از این ضبط‌ها برای ردیابی افراد مشخص استفاده نمی‌کنیم. اطلاعاتی را که نمی‌خواهید ذخیره شود در فیلدهای سایت وارد نکنید.",
            ],
          },
          {
            heading: "روش امتناع",
            bullets: [
              "مسدود کردن یا حذف کوکی‌ها را در تنظیمات مرورگر خود پیکربندی کنید — این روش برای همه سامانه‌های ذکرشده کار می‌کند.",
              "Google Analytics: افزونه رسمی مرورگر برای غیرفعال کردن جمع‌آوری داده‌ها در وب‌سایت Google در دسترس است.",
              "Yandex Metrica: امتناع از طریق افزونه رسمی Yandex امکان‌پذیر است.",
              "غیرفعال کردن کوکی‌های ضروری، دانلود را ناممکن می‌کند.",
            ],
          },
          {
            heading: "مدت نگهداری",
            body: [
              "کوکی‌های نشست با بستن مرورگر یا پایان مدت نشست حذف می‌شوند. ابزارهای تحلیلی شناسه‌ها را در مدت‌هایی که ارائه‌دهندگانشان تعیین کرده‌اند نگه می‌دارند.",
            ],
          },
        ],
      },
      copyright: {
        title: "صاحبان حقوق",
        summary: "موضع سرویس در قبال حق مؤلف و نحوه ثبت شکایت درباره نقض حقوق.",
        sections: [
          {
            heading: "موضع سرویس",
            body: [
              "سرویس هیچ ویدیویی را میزبانی نمی‌کند و فهرستی از ویدیوها نگه نمی‌دارد. این سرویس به‌عنوان واسطه فنی عمل می‌کند: از طریق پیوندی که کاربر وارد کرده است به صفحه‌ای عمومی مراجعه می‌کند و فایل را به همان کاربر منتقل می‌کند.",
              "فایل‌های دانلودشده حدود یک ساعت روی سرور نگهداری می‌شوند و سپس به‌طور خودکار حذف می‌گردند. هیچ نسخه دائمی از محتوای دیگران نزد ما باقی نمی‌ماند.",
              "مسئولیت استفاده از محتوای دانلودشده بر عهده کاربر است — این موضوع به‌صراحت در شرایط استفاده قید شده است.",
            ],
          },
          {
            heading: "اگر حقوق شما نقض شده است",
            body: [
              `اگر صاحب حق یا نماینده او هستید و معتقدید که از سرویس برای نقض حقوق شما استفاده می‌شود، به ${MAIL} بنویسید. ما به این گونه درخواست‌ها رسیدگی می‌کنیم و اقدامات لازم را انجام می‌دهیم.`,
            ],
          },
          {
            heading: "آنچه باید در درخواست ذکر شود",
            bullets: [
              "کدام اثر موضوع نقض است و بر چه مبنایی حقوق آن را در اختیار دارید.",
              "پیوند به محتوا و در صورت اطلاع، شرایط و اوضاع‌واحوال نقض.",
              "اطلاعات تماس شما: نام شخص یا عنوان شخص حقوقی، نشانی و نشانی ایمیل.",
              "اگر از طرف صاحب حق اقدام می‌کنید — مدرک اثبات اختیارات شما.",
              "اظهاریه‌ای مبنی بر اینکه اطلاعات مندرج در درخواست صحیح است و استفاده از محتوا از سوی صاحب حق یا به موجب قانون مجاز نشده است.",
            ],
          },
          {
            heading: "اقدامات ما",
            body: [
              "ما در مهلتی معقول، معمولاً ظرف سی روز تقویمی، به درخواست رسیدگی می‌کنیم و در صورت تأیید نقض، دسترسی به محتوا از طریق سرویس و در صورت لزوم، دسترسی متخلف به سرویس را محدود می‌کنیم.",
              "نتیجه رسیدگی را به نشانی ایمیلی که اعلام کرده‌اید اطلاع خواهیم داد.",
            ],
          },
          {
            heading: "درخواست‌های با سوءنیت",
            body: [
              "درخواستی که حاوی اطلاعات آگاهانه نادرست باشد، ممکن است مطابق قوانین موجب مسئولیت درخواست‌کننده شود. ما حق داریم از رسیدگی به درخواستی که نه صاحب حق و نه محتوای مورد اختلاف را مشخص می‌کند خودداری کنیم.",
            ],
          },
        ],
      },
    },
  },
  vi: {
    ui: {
      updated: "Cập nhật lần cuối",
      back: "Về trang chủ",
      operatorHeading: "Đơn vị vận hành dịch vụ",
      navHeading: "Các tài liệu khác",
      labels: {
        privacy: "Chính sách quyền riêng tư",
        terms: "Điều khoản sử dụng",
        cookies: "Chính sách cookie",
        copyright: "Dành cho chủ sở hữu quyền",
      },
    },
    docs: {
      privacy: {
        title: "Chính sách quyền riêng tư",
        summary: `${operator.site} thu thập những dữ liệu nào, vì sao cần chúng, lưu giữ trong bao lâu và cách yêu cầu xóa.`,
        sections: [
          {
            heading: "Quy định chung",
            body: [
              `Chính sách này mô tả những dữ liệu cá nhân mà dịch vụ ${operator.site} xử lý và mục đích xử lý. Bên kiểm soát dữ liệu là ${operator.nameVi}.`,
              "Khi sử dụng dịch vụ, bạn đồng ý với cách thức xử lý được mô tả tại đây. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.",
              "Việc xử lý được thực hiện theo Luật của Cộng hòa Kazakhstan “Về dữ liệu cá nhân và bảo vệ dữ liệu cá nhân”, và đối với khách truy cập từ Khu vực Kinh tế Châu Âu, có tính đến các yêu cầu của GDPR.",
            ],
          },
          {
            heading: "Chúng tôi xử lý những dữ liệu nào",
            body: [
              "Chúng tôi chủ động không thu thập bất cứ điều gì vượt quá mức cần thiết cho hoạt động của dịch vụ và không yêu cầu giấy tờ tùy thân, thông tin thanh toán hay địa chỉ.",
            ],
            bullets: [
              "Dữ liệu tài khoản Telegram mà bot nhận được khi bạn nhắn tin cho bot: mã định danh dạng số, tên người dùng, tên và mã ngôn ngữ.",
              "Các liên kết bạn gửi để tải xuống và thông tin về chính lần tải đó: nền tảng, ngày và giờ, chất lượng đã chọn, kết quả (thành công hoặc lỗi).",
              "Dữ liệu kỹ thuật về kết nối: địa chỉ IP, loại và phiên bản trình duyệt, ngôn ngữ, trang giới thiệu. Các dữ liệu này được ghi vào nhật ký máy chủ và các hệ thống phân tích web.",
              "Cookie và mã định danh phân tích — xem chi tiết trong Chính sách cookie.",
            ],
          },
          {
            heading: "Vì sao cần những dữ liệu này",
            bullets: [
              "Để cung cấp chính dịch vụ: lấy video theo liên kết của bạn và chuyển tệp cho bạn.",
              "Để phân biệt tài khoản của bạn với tài khoản của người khác và ngăn chặn hành vi lạm dụng.",
              "Để bảo vệ dịch vụ khỏi hành vi lạm dụng tự động: kiểm tra Cloudflare Turnstile trước khi gửi liên kết.",
              "Để hiểu cách trang web được sử dụng và khắc phục lỗi — thông qua số liệu thống kê đã được ẩn danh hóa và tổng hợp.",
              "Để trả lời yêu cầu của bạn và của các chủ sở hữu quyền.",
              "Để thỉnh thoảng nhắn tin cho bạn trên Telegram nhằm hỏi ý kiến của bạn về dịch vụ — ví dụ, nếu bạn đã ngừng sử dụng dịch vụ. Bạn không bắt buộc phải trả lời; nếu không muốn nhận những tin nhắn như vậy, bạn chỉ cần cho chúng tôi biết và chúng tôi sẽ không nhắn tin nữa.",
            ],
          },
          {
            heading: "Cơ sở pháp lý của việc xử lý",
            body: [
              "Dữ liệu tài khoản Telegram và thông tin về các lần tải xuống được xử lý để thực hiện Điều khoản sử dụng mà bạn chấp nhận khi bắt đầu sử dụng dịch vụ.",
              "Cookie phân tích và việc ghi lại thao tác trên trang web được xử lý trên cơ sở sự đồng ý của bạn; bạn có thể rút lại sự đồng ý bất cứ lúc nào — cách thức được mô tả trong Chính sách cookie.",
              "Nhật ký máy chủ và cơ chế chống bot được xử lý trên cơ sở lợi ích hợp pháp của chúng tôi trong việc duy trì hoạt động ổn định và an toàn của dịch vụ.",
              "Việc hỏi ý kiến của bạn về dịch vụ dựa trên lợi ích hợp pháp của chúng tôi trong việc cải thiện dịch vụ; bạn có thể từ chối bất cứ lúc nào.",
            ],
          },
          {
            heading: "Tài khoản được kết nối",
            body: [
              "Nếu muốn, bạn có thể kết nối tài khoản của mình trên một nền tảng (Instagram, Facebook, YouTube, X, VK, TikTok) với bot để bot tải xuống những bài đăng chỉ người dùng đã đăng nhập mới xem được: story, bài đăng riêng tư. Để làm việc này, bot nhận cookie của tài khoản đó — từ tiện ích mở rộng Videoner thông qua mã dùng một lần, hoặc từ tệp do bạn gửi.",
              "Chúng tôi chỉ lưu cookie của nền tảng đã chọn và loại bỏ ngay phần còn lại. Cookie được lưu trữ ở dạng mã hóa và chỉ được dùng để tải xuống tại nơi bạn đã kết nối chúng. Cookie được kết nối trong cuộc trò chuyện riêng phục vụ các lần tải xuống của bạn, kể cả các liên kết của chính bạn trong những nhóm chưa kết nối tài khoản riêng; chúng không được dùng cho liên kết của người khác. Cookie được kết nối với một nhóm chỉ phục vụ các lần tải xuống của thành viên nhóm đó và không được dùng ở bất kỳ nơi nào khác.",
              "Cơ sở pháp lý là sự đồng ý của bạn: bạn tự kết nối tài khoản và có thể xóa tài khoản bất cứ lúc nào bằng lệnh /accounts. Khi bị xóa, cookie sẽ bị xóa vĩnh viễn. Nếu nền tảng không còn chấp nhận việc đăng nhập, bot sẽ thông báo cho bạn.",
              "Các bài đăng được tải xuống qua tài khoản được kết nối không được đăng trên kênh của chúng tôi và không được cung cấp cho người dùng khác từ bộ nhớ đệm chung.",
            ],
          },
          {
            heading: "Dịch vụ của bên thứ ba",
            body: [
              "Chúng tôi không bán và không chuyển giao dữ liệu của bạn cho bên thứ ba vì mục đích riêng của họ. Dịch vụ sử dụng các nhà cung cấp sau đây, mỗi nhà cung cấp xử lý dữ liệu theo quy định riêng của mình:",
            ],
            bullets: [
              `Telegram — vận hành bot ${BOT}.`,
              "Cloudflare — chống bot (Turnstile), phân phối trang web và định tuyến thư điện tử.",
              "Google Analytics và Google Tag Manager — thống kê lượt truy cập.",
              "Yandex Metrica — thống kê lượt truy cập, bản đồ nhấp chuột và Webvisor. Webvisor ghi lại thao tác trên trang: di chuyển con trỏ, cuộn trang và nhấp chuột. Các bản ghi chỉ được dùng để phân tích mức độ thuận tiện của trang web.",
            ],
          },
          {
            heading: "Thời hạn lưu trữ dữ liệu",
            bullets: [
              "Các tệp đã tải xuống được tự động xóa khỏi máy chủ khoảng một giờ sau khi được tạo. Chúng tôi không lưu trữ kho video của bạn.",
              "Thông tin về các lần tải xuống được lưu giữ trong thời gian cần thiết để ngăn chặn hành vi lạm dụng và xem xét các yêu cầu.",
              "Dữ liệu tài khoản được lưu giữ trong thời gian bạn sử dụng dịch vụ và được xóa theo yêu cầu của bạn.",
              "Nhật ký máy chủ được lưu giữ trong một thời gian giới hạn và bị ghi đè trong quá trình luân chuyển nhật ký.",
            ],
          },
          {
            heading: "Nơi xử lý dữ liệu",
            body: [
              "Máy chủ của dịch vụ đặt tại một trung tâm dữ liệu trên lãnh thổ Liên minh Châu Âu. Một số nhà cung cấp nêu trên có thể xử lý dữ liệu bên ngoài lãnh thổ này theo chính sách riêng của họ.",
            ],
          },
          {
            heading: "Quyền của bạn",
            body: [
              `Bạn có quyền nhận thông tin về việc xử lý dữ liệu của mình, yêu cầu chỉnh sửa hoặc xóa dữ liệu, rút lại sự đồng ý và phản đối việc xử lý. Để thực hiện các quyền này, hãy gửi thư đến ${MAIL} từ địa chỉ email hoặc tài khoản Telegram có liên quan đến yêu cầu.`,
              "Chúng tôi phản hồi trong thời hạn hợp lý, thông thường trong vòng ba mươi ngày theo lịch. Việc xóa tài khoản đồng thời xóa lịch sử tải xuống gắn với tài khoản đó.",
            ],
          },
          {
            heading: "Trẻ vị thành niên",
            body: [
              "Dịch vụ không dành cho và không hướng tới trẻ em dưới 16 tuổi. Chúng tôi không cố ý thu thập dữ liệu của những người dùng này; nếu việc đó xảy ra do nhầm lẫn, hãy liên hệ với chúng tôi và dữ liệu sẽ bị xóa.",
            ],
          },
          {
            heading: "Thay đổi",
            body: [
              "Chúng tôi có thể cập nhật Chính sách này. Ngày của phiên bản hiện hành được ghi ở đầu trang; những thay đổi quan trọng sẽ được chúng tôi thông báo trong dịch vụ.",
            ],
          },
        ],
      },
      terms: {
        title: "Điều khoản sử dụng",
        summary: `Quy tắc sử dụng ${operator.site}: điều gì được phép, điều gì không và dịch vụ hoạt động theo những điều kiện nào.`,
        sections: [
          {
            heading: "Quy định chung",
            body: [
              `Điều khoản này điều chỉnh việc sử dụng trang web ${operator.site} và bot Telegram ${BOT}. Chủ sở hữu và đơn vị quản trị dịch vụ là ${operator.nameVi}.`,
              "Khi bắt đầu sử dụng dịch vụ, bạn xác nhận rằng bạn đã đọc và chấp nhận Điều khoản này. Nếu có bất kỳ điều kiện nào không phù hợp với bạn, bạn không nên sử dụng dịch vụ.",
            ],
          },
          {
            heading: "Dịch vụ miễn phí",
            body: [
              "Mọi tính năng của dịch vụ đều được cung cấp miễn phí. Không có gói đăng ký, gói trả phí, chất lượng video trả phí hay giao dịch mua trong dịch vụ.",
              "Chúng tôi không hiển thị quảng cáo và không đặt liên kết tiếp thị liên kết.",
            ],
          },
          {
            heading: "Điều kiện truy cập",
            bullets: [
              "Để tải xuống trên trang web, bạn không cần tài khoản hay đăng nhập. Bot phân biệt người dùng theo tài khoản Telegram của họ.",
              "Các giới hạn kỹ thuật về tần suất yêu cầu bảo vệ dịch vụ khỏi tình trạng quá tải và hành vi lạm dụng tự động.",
              "Đối với YouTube có áp dụng giới hạn lưu lượng hằng ngày: 10 GB trong 24 giờ cho mỗi mạng trên trang web và trong tiện ích mở rộng, và 25 GB trong 24 giờ cho mỗi tài khoản Telegram trong bot. Giới hạn này không áp dụng cho các nền tảng khác.",
              "Không cần đăng ký theo dõi kênh của chúng tôi để tải xuống qua bot. Bot thêm liên kết đến kênh tin tức của dự án vào chú thích của tệp; việc theo dõi kênh này là không bắt buộc.",
            ],
          },
          {
            heading: "Dịch vụ làm gì",
            body: [
              "Dịch vụ là bên trung gian kỹ thuật: theo liên kết bạn cung cấp, dịch vụ truy cập trang công khai, lấy tệp phương tiện và chuyển cho bạn.",
              "Chúng tôi không lưu trữ danh mục video, không thực hiện tìm kiếm trong nội dung của người khác và không lưu giữ tệp đã tải xuống lâu hơn thời gian cần thiết để chuyển giao — khoảng một giờ.",
              "Khả năng hoạt động với một nền tảng cụ thể phụ thuộc vào các quyết định kỹ thuật của nền tảng đó và có thể thay đổi mà không cần báo trước.",
            ],
          },
          {
            heading: "Nghĩa vụ của người dùng",
            body: [
              "Bạn tự chịu trách nhiệm về cách sử dụng các tệp nhận được và xác nhận rằng bạn có quyền làm như vậy.",
            ],
            bullets: [
              "Chỉ tải xuống những tài liệu mà bạn là chủ sở hữu quyền, hoặc việc sử dụng chúng được chủ sở hữu quyền hoặc pháp luật cho phép.",
              "Không sử dụng dịch vụ để xâm phạm quyền tác giả và quyền liên quan, phát tán nội dung bị cấm hoặc xâm phạm quyền của bên thứ ba.",
              "Không tìm cách vượt qua các giới hạn kỹ thuật của dịch vụ, bao gồm giới hạn tần suất yêu cầu và cơ chế kiểm tra bot.",
              "Không tạo tải tự động: không được phép gửi yêu cầu hàng loạt, sử dụng script và công cụ thu thập dữ liệu (parser).",
            ],
          },
          {
            heading: "Đăng liên kết trên kênh",
            body: [
              "Khi tải video qua bot, bạn đồng ý rằng liên kết đến bài đăng gốc sẽ được đăng trên kênh Telegram của chúng tôi. Thông báo về việc này được hiển thị trong bot trước khi bạn chọn chất lượng — tức là trước khi bạn quyết định tải xuống.",
              "Việc đăng là ẩn danh: kênh nhận được liên kết đến trang công khai, tiêu đề video và ảnh bìa — chính khung hình mà nền tảng hiển thị trong bản xem trước của bài đăng. Không nêu rõ ai đã tải video. Bản thân tệp video không bao giờ được đăng ở bất kỳ đâu: thứ được chia sẻ là liên kết, vốn chính các nền tảng cũng khuyến khích chia sẻ bằng nút “Chia sẻ” bên dưới mỗi bài đăng.",
              "Mỗi liên kết chỉ được đăng không quá một lần. Nếu bạn không muốn liên kết xuất hiện trên kênh, đừng tải video đó qua dịch vụ của chúng tôi.",
              "Liên kết từ các nhóm và bài đăng được tải xuống qua tài khoản được kết nối không được đăng trên kênh."
            ],
          },
          {
            heading: "Kết nối tài khoản của bạn",
            body: [
              "Khi kết nối tài khoản của mình trên một nền tảng với bot, bạn xác nhận rằng đó là tài khoản của bạn và bạn có quyền sử dụng tài khoản theo cách này.",
              "Các nền tảng không chấp thuận việc tải xuống tự động và có thể hạn chế hoặc khóa tài khoản được kết nối. Bạn tự chịu rủi ro này; chúng tôi khuyên bạn nên kết nối một tài khoản phụ thay vì tài khoản chính. Chúng tôi không chịu trách nhiệm về các hạn chế mà nền tảng áp dụng đối với tài khoản của bạn.",
              "Tài khoản được kết nối với một nhóm được dùng cho các lần tải xuống của tất cả thành viên nhóm đó. Quản trị viên nhóm quyết định ai có thể kết nối tài khoản và có thể xóa bất kỳ tài khoản nào trong số đó.",
            ],
          },
          {
            heading: "Giới hạn trách nhiệm",
            body: [
              "Dịch vụ được cung cấp theo nguyên trạng (“as is”). Chúng tôi không bảo đảm dịch vụ hoạt động liên tục, khả năng truy cập một nền tảng cụ thể hoặc sự phù hợp của tệp với mục đích của bạn.",
              "Chúng tôi không chịu trách nhiệm về cách bạn sử dụng tài liệu đã tải xuống, cũng như về hậu quả của việc bạn xâm phạm quyền của bên thứ ba.",
              "Chúng tôi có quyền thay đổi các tính năng của dịch vụ, tạm ngừng dịch vụ để bảo trì và chấm dứt hoạt động của dịch vụ.",
            ],
          },
          {
            heading: "Hạn chế truy cập",
            body: [
              "Chúng tôi có thể hạn chế hoặc chấm dứt quyền truy cập dịch vụ khi Điều khoản này bị vi phạm, khi có hành vi tìm cách vượt qua các giới hạn, hoặc khi nhận được khiếu nại có căn cứ của chủ sở hữu quyền.",
            ],
          },
          {
            heading: "Thay đổi và luật áp dụng",
            body: [
              "Chúng tôi có thể sửa đổi Điều khoản này; ngày của phiên bản hiện hành được ghi ở đầu trang. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận phiên bản mới.",
              "Quan hệ giữa các bên được điều chỉnh bởi pháp luật của Cộng hòa Kazakhstan. Các bên sẽ cố gắng giải quyết tranh chấp thông qua trao đổi thư từ, và nếu không đạt được thỏa thuận, theo trình tự do pháp luật của Cộng hòa Kazakhstan quy định.",
            ],
          },
        ],
      },
      cookies: {
        title: "Chính sách cookie",
        summary: `${operator.site} sử dụng những cookie nào, chúng dùng để làm gì và cách từ chối chúng.`,
        sections: [
          {
            heading: "Cookie là gì",
            body: [
              "Cookie là những tệp văn bản nhỏ mà trang web lưu trong trình duyệt của bạn. Chúng cho phép ghi nhớ các cài đặt của bạn và thu thập số liệu thống kê truy cập đã được ẩn danh hóa.",
              "Ngoài cookie, tài liệu này cũng mô tả các công nghệ tương tự — bộ nhớ cục bộ của trình duyệt và pixel theo dõi.",
            ],
          },
          {
            heading: "Cookie thiết yếu",
            body: [
              "Thiếu các cookie này, dịch vụ không thể hoạt động, vì vậy chúng luôn được thiết lập.",
            ],
            bullets: [
              "Cloudflare Turnstile — kiểm tra rằng liên kết được gửi bởi con người chứ không phải bởi script.",
              "Cài đặt giao diện — ngôn ngữ và giao diện màu đã chọn.",
            ],
          },
          {
            heading: "Cookie phân tích",
            body: [
              "Các cookie này giúp chúng tôi hiểu những trang nào được sử dụng và lỗi phát sinh ở đâu. Chúng được thiết lập khi có sự đồng ý của bạn và không bắt buộc cho hoạt động của dịch vụ.",
            ],
            bullets: [
              "Google Analytics và Google Tag Manager — lưu lượng truy cập và hành vi trên trang web ở dạng ẩn danh.",
              "Yandex Metrica — lưu lượng truy cập, bản đồ nhấp chuột và Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor của Yandex Metrica ghi lại thao tác trên trang: di chuyển con trỏ, cuộn trang, nhấp chuột và nội dung nhập vào ô liên kết. Mục đích là để thấy được chỗ nào giao diện gây khó hiểu cho người dùng.",
              "Chúng tôi không sử dụng các bản ghi này để theo dõi những cá nhân cụ thể. Vui lòng không nhập vào các ô trên trang web những thông tin mà bạn không muốn bị lưu lại.",
            ],
          },
          {
            heading: "Cách từ chối",
            bullets: [
              "Thiết lập chặn hoặc xóa cookie trong cài đặt trình duyệt của bạn — cách này áp dụng được cho tất cả các hệ thống nêu trên.",
              "Google Analytics: tiện ích bổ sung chính thức cho trình duyệt để tắt việc thu thập dữ liệu có sẵn trên trang web của Google.",
              "Yandex Metrica: có thể từ chối thông qua tiện ích bổ sung chính thức của Yandex.",
              "Việc tắt cookie thiết yếu sẽ khiến bạn không thể tải xuống.",
            ],
          },
          {
            heading: "Thời hạn lưu trữ",
            body: [
              "Cookie phiên bị xóa khi bạn đóng trình duyệt hoặc khi phiên hết hạn. Các công cụ phân tích lưu giữ mã định danh trong thời hạn do nhà cung cấp của chúng quy định.",
            ],
          },
        ],
      },
      copyright: {
        title: "Dành cho chủ sở hữu quyền",
        summary: "Quan điểm của dịch vụ về quyền tác giả và trình tự gửi khiếu nại về hành vi xâm phạm.",
        sections: [
          {
            heading: "Quan điểm của dịch vụ",
            body: [
              "Dịch vụ không lưu trữ video và không duy trì danh mục video. Dịch vụ đóng vai trò bên trung gian kỹ thuật: theo liên kết do người dùng nhập, dịch vụ truy cập trang công khai và chuyển tệp cho người dùng đó.",
              "Các tệp đã tải xuống được lưu trên máy chủ khoảng một giờ và sau đó tự động bị xóa. Chúng tôi không giữ lại bản sao lâu dài nào đối với nội dung của người khác.",
              "Trách nhiệm về việc sử dụng tài liệu đã tải xuống thuộc về người dùng — điều này được quy định rõ ràng trong Điều khoản sử dụng.",
            ],
          },
          {
            heading: "Nếu quyền của bạn bị xâm phạm",
            body: [
              `Nếu bạn là chủ sở hữu quyền hoặc người đại diện của chủ sở hữu quyền và cho rằng dịch vụ đang bị sử dụng để xâm phạm quyền của bạn, hãy gửi thư đến ${MAIL}. Chúng tôi xem xét các khiếu nại như vậy và có biện pháp xử lý.`,
            ],
          },
          {
            heading: "Nội dung cần nêu trong khiếu nại",
            bullets: [
              "Tác phẩm nào bị ảnh hưởng và trên cơ sở nào bạn nắm giữ quyền đối với tác phẩm đó.",
              "Liên kết đến tài liệu và, nếu biết, các tình tiết của hành vi xâm phạm.",
              "Thông tin liên hệ của bạn: họ tên hoặc tên tổ chức, địa chỉ và địa chỉ email.",
              "Nếu bạn hành động thay mặt chủ sở hữu quyền — tài liệu xác nhận thẩm quyền đại diện.",
              "Tuyên bố rằng thông tin trong khiếu nại là chính xác và việc sử dụng tài liệu không được chủ sở hữu quyền hoặc pháp luật cho phép.",
            ],
          },
          {
            heading: "Chúng tôi sẽ làm gì",
            body: [
              "Chúng tôi xem xét khiếu nại trong thời hạn hợp lý, thông thường trong vòng ba mươi ngày theo lịch, và khi hành vi xâm phạm được xác nhận, chúng tôi hạn chế quyền truy cập tài liệu thông qua dịch vụ và, khi cần thiết, hạn chế quyền truy cập dịch vụ của người vi phạm.",
              "Chúng tôi sẽ thông báo kết quả xem xét đến địa chỉ email bạn đã cung cấp.",
            ],
          },
          {
            heading: "Khiếu nại không thiện chí",
            body: [
              "Khiếu nại chứa thông tin mà người gửi biết rõ là sai sự thật có thể khiến người khiếu nại phải chịu trách nhiệm theo quy định của pháp luật. Chúng tôi có quyền từ chối xem xét khiếu nại nếu khiếu nại đó không cho phép xác định được chủ sở hữu quyền cũng như tài liệu bị tranh chấp.",
            ],
          },
        ],
      },
    },
  },
  bn: {
    ui: {
      updated: "সর্বশেষ সংস্করণ",
      back: "মূল পাতায় ফিরুন",
      operatorHeading: "সেবা পরিচালনাকারী",
      navHeading: "অন্যান্য নথি",
      labels: {
        privacy: "গোপনীয়তা নীতি",
        terms: "ব্যবহারের শর্তাবলি",
        cookies: "কুকি নীতি",
        copyright: "কপিরাইট ধারকদের জন্য",
      },
    },
    docs: {
      privacy: {
        title: "গোপনীয়তা নীতি",
        summary: `${operator.site} কী কী তথ্য সংগ্রহ করে, কেন তা প্রয়োজন, কত দিন সংরক্ষণ করা হয় এবং কীভাবে তা মুছে ফেলা যায়।`,
        sections: [
          {
            heading: "সাধারণ বিধান",
            body: [
              `এই নীতিতে বর্ণনা করা হয়েছে, ${operator.site} সেবা কোন কোন ব্যক্তিগত তথ্য প্রক্রিয়া করে এবং কী উদ্দেশ্যে। তথ্য নিয়ন্ত্রক (data controller) হলেন ${operator.nameBn}।`,
              "সেবাটি ব্যবহার করে আপনি এখানে বর্ণিত তথ্য প্রক্রিয়াকরণ পদ্ধতিতে সম্মতি দিচ্ছেন। আপনি এতে সম্মত না হলে অনুগ্রহ করে সেবাটি ব্যবহার করবেন না।",
              "তথ্য প্রক্রিয়াকরণ করা হয় কাজাখস্তান প্রজাতন্ত্রের «ব্যক্তিগত তথ্য ও তার সুরক্ষা বিষয়ক» আইন অনুসারে, এবং ইউরোপীয় অর্থনৈতিক অঞ্চলের (EEA) দর্শনার্থীদের ক্ষেত্রে GDPR-এর প্রয়োজনীয়তা বিবেচনায় রেখে।",
            ],
          },
          {
            heading: "আমরা কোন তথ্য প্রক্রিয়া করি",
            body: [
              "সেবা পরিচালনার জন্য যা প্রয়োজন, তার বাইরে আমরা সচেতনভাবে কিছুই সংগ্রহ করি না এবং পরিচয়পত্র, অর্থপ্রদানের তথ্য বা ঠিকানা চাই না।",
            ],
            bullets: [
              "Telegram অ্যাকাউন্টের তথ্য, যা আপনি বটকে বার্তা পাঠালে বটটি পায়: সাংখ্যিক আইডি, ইউজারনেম, নাম এবং ভাষার কোড।",
              "ডাউনলোডের জন্য আপনি যে লিংকগুলো পাঠান এবং প্রতিটি প্রচেষ্টার বিবরণ: প্ল্যাটফর্ম, তারিখ ও সময়, নির্বাচিত মান এবং ফলাফল (সফল বা ত্রুটি)।",
              "সংযোগের প্রযুক্তিগত তথ্য: IP ঠিকানা, ব্রাউজারের ধরন ও সংস্করণ, ভাষা এবং যে পাতা থেকে আপনি এসেছেন। এগুলো সার্ভারের লগে এবং ওয়েব অ্যানালিটিক্স ব্যবস্থায় জমা হয়।",
              "কুকি এবং অ্যানালিটিক্স শনাক্তকারী — বিস্তারিত কুকি নীতিতে দেখুন।",
            ],
          },
          {
            heading: "এই তথ্য কেন প্রয়োজন",
            bullets: [
              "সেবাটি প্রদান করা: আপনার লিংক অনুযায়ী ভিডিও সংগ্রহ করে ফাইলটি আপনাকে দেওয়া।",
              "আপনার অ্যাকাউন্টকে অন্যদের অ্যাকাউন্ট থেকে আলাদা করা এবং অপব্যবহার প্রতিরোধ করা।",
              "স্বয়ংক্রিয় অপব্যবহার থেকে সেবাকে সুরক্ষিত রাখা: লিংক পাঠানোর আগে Cloudflare Turnstile যাচাই।",
              "সাইটটি কীভাবে ব্যবহৃত হচ্ছে তা বোঝা এবং ত্রুটি সংশোধন করা — বেনামি ও সমষ্টিগত পরিসংখ্যানের মাধ্যমে।",
              "আপনার এবং কপিরাইট ধারকদের আবেদনের উত্তর দেওয়া।",
              "সেবা সম্পর্কে আপনার মতামত জানতে মাঝে মাঝে Telegram-এ আপনাকে বার্তা পাঠানো — যেমন, আপনি যদি সেবাটি ব্যবহার করা বন্ধ করে দেন। উত্তর দেওয়া বাধ্যতামূলক নয়; এমন বার্তা না চাইলে শুধু আমাদের জানান, আমরা আর লিখব না।",
            ],
          },
          {
            heading: "প্রক্রিয়াকরণের আইনগত ভিত্তি",
            body: [
              "Telegram অ্যাকাউন্টের তথ্য এবং ডাউনলোডের বিবরণ প্রক্রিয়া করা হয় ব্যবহারের শর্তাবলি পালনের জন্য, যা আপনি সেবাটি ব্যবহার শুরু করার মাধ্যমে গ্রহণ করেন।",
              "অ্যানালিটিক্স কুকি এবং সাইটে আপনার কার্যকলাপের রেকর্ডিং প্রক্রিয়া করা হয় আপনার সম্মতির ভিত্তিতে, যা আপনি যেকোনো সময় প্রত্যাহার করতে পারেন — পদ্ধতিগুলো কুকি নীতিতে বর্ণিত আছে।",
              "সার্ভারের লগ এবং বট থেকে সুরক্ষা আমাদের বৈধ স্বার্থের (legitimate interest) ভিত্তিতে পরিচালিত হয় — সেবাটিকে সচল ও নিরাপদ রাখা।",
              "সেবা সম্পর্কে আপনার মতামত জানতে চাওয়া আমাদের বৈধ স্বার্থের ভিত্তিতে করা হয় — সেবার মান উন্নত করা; আপনি যেকোনো সময় এ থেকে বিরত থাকার অনুরোধ করতে পারেন।",
            ],
          },
          {
            heading: "সংযুক্ত অ্যাকাউন্ট",
            body: [
              "আপনি চাইলে কোনো প্ল্যাটফর্মে (Instagram, Facebook, YouTube, X, VK, TikTok) আপনার অ্যাকাউন্ট বটের সঙ্গে সংযুক্ত করতে পারেন, যাতে বটটি এমন পোস্ট ডাউনলোড করতে পারে যা কেবল লগ-ইন করা ব্যবহারকারীরা দেখতে পান: স্টোরি, ব্যক্তিগত (private) পোস্ট। এ জন্য বটটি সেই অ্যাকাউন্টের কুকি পায় — Videoner এক্সটেনশন থেকে একবার ব্যবহারযোগ্য কোডের মাধ্যমে, অথবা আপনার পাঠানো ফাইল থেকে।",
              "আমরা শুধু নির্বাচিত প্ল্যাটফর্মের কুকি সংরক্ষণ করি, বাকিগুলো সঙ্গে সঙ্গে বাদ দিই। এগুলো এনক্রিপ্ট করা অবস্থায় সংরক্ষিত থাকে এবং কেবল সেখানেই ডাউনলোডের জন্য ব্যবহৃত হয় যেখানে আপনি এগুলো সংযুক্ত করেছেন। ব্যক্তিগত চ্যাটে সংযুক্ত কুকি আপনার ডাউনলোডের জন্য ব্যবহৃত হয়, যার মধ্যে রয়েছে এমন গ্রুপে আপনার নিজের পাঠানো লিংকও, যেখানে গ্রুপের নিজস্ব কোনো অ্যাকাউন্ট সংযুক্ত নেই; অন্যদের লিংকের জন্য এগুলো কখনো ব্যবহৃত হয় না। কোনো গ্রুপে সংযুক্ত কুকি কেবল সেই গ্রুপের সদস্যদের ডাউনলোডের জন্য ব্যবহৃত হয়, অন্য কোথাও নয়।",
              "আইনগত ভিত্তি হলো আপনার সম্মতি: আপনি নিজেই অ্যাকাউন্ট সংযুক্ত করেন এবং যেকোনো সময় /accounts কমান্ড দিয়ে তা মুছে ফেলতে পারেন। মুছে ফেলা কুকি স্থায়ীভাবে বিলুপ্ত হয়। প্ল্যাটফর্ম লগ-ইন গ্রহণ করা বন্ধ করলে বট আপনাকে তা জানায়।",
              "সংযুক্ত অ্যাকাউন্টের মাধ্যমে ডাউনলোড করা পোস্ট আমাদের চ্যানেলে প্রকাশ করা হয় না এবং সাধারণ ক্যাশ থেকে অন্য ব্যবহারকারীদের দেওয়া হয় না।",
            ],
          },
          {
            heading: "তৃতীয় পক্ষের সেবা",
            body: [
              "আমরা আপনার তথ্য বিক্রি করি না এবং তৃতীয় পক্ষের নিজস্ব উদ্দেশ্যে তাদের কাছে হস্তান্তর করি না। সেবাটি পরিচালনার জন্য নিম্নলিখিত সরবরাহকারীদের ব্যবহার করা হয়, যাদের প্রত্যেকে নিজ নিজ নিয়ম অনুযায়ী তথ্য প্রক্রিয়া করে:",
            ],
            bullets: [
              `Telegram — ${BOT} বট পরিচালনা।`,
              "Cloudflare — বট থেকে সুরক্ষা (Turnstile), সাইট সরবরাহ এবং ইমেইল রাউটিং।",
              "Google Analytics এবং Google Tag Manager — ভিজিটের পরিসংখ্যান।",
              "Yandex Metrica — ভিজিটের পরিসংখ্যান, ক্লিক ম্যাপ এবং Webvisor। Webvisor পাতায় আপনার কার্যকলাপ রেকর্ড করে: পয়েন্টারের নড়াচড়া, স্ক্রলিং এবং ক্লিক। এই রেকর্ডিং কেবল সাইটের ব্যবহারযোগ্যতা বিশ্লেষণের জন্য ব্যবহৃত হয়।",
            ],
          },
          {
            heading: "আমরা কত দিন তথ্য সংরক্ষণ করি",
            bullets: [
              "ডাউনলোড করা ফাইল তৈরির প্রায় এক ঘণ্টা পর সার্ভার থেকে স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়। আমরা আপনার ভিডিওর কোনো আর্কাইভ রাখি না।",
              "ডাউনলোড প্রচেষ্টার রেকর্ড ততদিন সংরক্ষিত থাকে, যতদিন অপব্যবহার প্রতিরোধ এবং আবেদন নিষ্পত্তির জন্য তা প্রয়োজন।",
              "অ্যাকাউন্টের তথ্য আপনি সেবাটি ব্যবহার করা পর্যন্ত সংরক্ষিত থাকে এবং আপনার অনুরোধে মুছে ফেলা হয়।",
              "সার্ভারের লগ সীমিত সময়ের জন্য সংরক্ষিত থাকে এবং রোটেশনের সঙ্গে সঙ্গে নতুন লগ দিয়ে প্রতিস্থাপিত হয়।",
            ],
          },
          {
            heading: "তথ্য কোথায় প্রক্রিয়া করা হয়",
            body: [
              "সেবার সার্ভারগুলো ইউরোপীয় ইউনিয়নের ভূখণ্ডে অবস্থিত একটি ডেটা সেন্টারে রয়েছে। উপরে উল্লিখিত কিছু সরবরাহকারী নিজ নিজ নীতি অনুযায়ী এর বাইরেও তথ্য প্রক্রিয়া করতে পারে।",
            ],
          },
          {
            heading: "আপনার অধিকার",
            body: [
              `আপনার তথ্য প্রক্রিয়াকরণ সম্পর্কে জানার, তা সংশোধন বা মুছে ফেলার দাবি করার, সম্মতি প্রত্যাহার করার এবং প্রক্রিয়াকরণে আপত্তি জানানোর অধিকার আপনার রয়েছে। এ জন্য সংশ্লিষ্ট ইমেইল ঠিকানা বা Telegram অ্যাকাউন্ট থেকে ${MAIL} ঠিকানায় লিখুন।`,
              "আমরা যুক্তিসঙ্গত সময়ের মধ্যে, সাধারণত ত্রিশ পঞ্জিকা দিবসের মধ্যে, উত্তর দিই। অ্যাকাউন্ট মুছে ফেললে তার সঙ্গে যুক্ত ডাউনলোডের ইতিহাসও মুছে যায়।",
            ],
          },
          {
            heading: "অপ্রাপ্তবয়স্ক",
            body: [
              "সেবাটি 16 বছরের কম বয়সী শিশুদের জন্য তৈরি নয় এবং তাদের উদ্দেশ্য করেও নয়। আমরা সচেতনভাবে তাদের তথ্য সংগ্রহ করি না; ভুলবশত এমন হয়ে থাকলে আমাদের লিখুন, তথ্য মুছে ফেলা হবে।",
            ],
          },
          {
            heading: "পরিবর্তন",
            body: [
              "আমরা এই নীতি হালনাগাদ করতে পারি। বর্তমান সংস্করণের তারিখ পাতার শুরুতে দেওয়া আছে; গুরুত্বপূর্ণ পরিবর্তনগুলো আমরা সেবার মধ্যে জানিয়ে দেব।",
            ],
          },
        ],
      },
      terms: {
        title: "ব্যবহারের শর্তাবলি",
        summary: `${operator.site} ব্যবহারের নিয়ম: কী করা যাবে, কী করা যাবে না এবং কোন শর্তে সেবাটি পরিচালিত হয়।`,
        sections: [
          {
            heading: "সাধারণ বিধান",
            body: [
              `এই শর্তাবলি ${operator.site} ওয়েবসাইট এবং ${BOT} Telegram বটের ব্যবহার নিয়ন্ত্রণ করে। সেবার মালিক ও পরিচালনাকারী হলেন ${operator.nameBn}।`,
              "সেবাটি ব্যবহার শুরু করার মাধ্যমে আপনি নিশ্চিত করছেন যে আপনি এই শর্তাবলি পড়েছেন এবং গ্রহণ করেছেন। কোনো শর্ত আপনার কাছে গ্রহণযোগ্য না হলে সেবাটি ব্যবহার করবেন না।",
            ],
          },
          {
            heading: "সেবাটি বিনামূল্যে",
            body: [
              "সেবার সব সুবিধা বিনামূল্যে প্রদান করা হয়। আমাদের কোনো সাবস্ক্রিপশন, পেইড প্ল্যান, অর্থের বিনিময়ে ভিডিওর মান বা সেবার ভেতরে কেনাকাটা নেই।",
              "আমরা কোনো বিজ্ঞাপন দেখাই না এবং কোনো অ্যাফিলিয়েট লিংক রাখি না।",
            ],
          },
          {
            heading: "ব্যবহারের শর্ত",
            bullets: [
              "ওয়েবসাইটে ডাউনলোড করতে কোনো অ্যাকাউন্ট বা লগ-ইনের প্রয়োজন নেই। বট ব্যবহারকারীদের তাদের Telegram অ্যাকাউন্টের মাধ্যমে আলাদা করে।",
              "অনুরোধের হারের ওপর প্রযুক্তিগত সীমা সেবাকে অতিরিক্ত চাপ এবং স্বয়ংক্রিয় অপব্যবহার থেকে রক্ষা করে।",
              "YouTube থেকে ডাউনলোডের জন্য দৈনিক ট্রাফিক সীমা রয়েছে: ওয়েবসাইট ও এক্সটেনশনে প্রতি নেটওয়ার্কে 24 ঘণ্টায় 10 GB, এবং বটে প্রতি Telegram অ্যাকাউন্টে 24 ঘণ্টায় 25 GB। অন্যান্য প্ল্যাটফর্মে এই সীমা প্রযোজ্য নয়।",
              "বটের মাধ্যমে ডাউনলোড করতে আমাদের চ্যানেলে সাবস্ক্রাইব করার প্রয়োজন নেই। বট ফাইলের ক্যাপশনে প্রকল্পের সংবাদ চ্যানেলের লিংক যোগ করে; তাতে সাবস্ক্রাইব করা ঐচ্ছিক।",
            ],
          },
          {
            heading: "সেবাটি কী করে",
            body: [
              "সেবাটি একটি প্রযুক্তিগত মধ্যস্থতাকারী (technical intermediary) হিসেবে কাজ করে: আপনার দেওয়া লিংক অনুযায়ী এটি একটি সর্বসাধারণের জন্য উন্মুক্ত পাতায় যায়, মিডিয়া ফাইলটি সংগ্রহ করে এবং আপনাকে তা পৌঁছে দেয়।",
              "আমরা কোনো ভিডিও ক্যাটালগ রাখি না, অন্যদের কনটেন্টে অনুসন্ধান চালাই না এবং ডাউনলোড করা ফাইল পৌঁছে দেওয়ার জন্য প্রয়োজনীয় সময়ের — প্রায় এক ঘণ্টার — বেশি সংরক্ষণ করি না।",
              "কোনো নির্দিষ্ট প্ল্যাটফর্ম কাজ করবে কি না, তা সেই প্ল্যাটফর্মের প্রযুক্তিগত সিদ্ধান্তের ওপর নির্ভর করে এবং পূর্ব সতর্কতা ছাড়াই পরিবর্তিত হতে পারে।",
            ],
          },
          {
            heading: "ব্যবহারকারীর দায়িত্ব",
            body: [
              "প্রাপ্ত ফাইল আপনি কীভাবে ব্যবহার করবেন, তার দায় সম্পূর্ণ আপনার, এবং আপনি নিশ্চিত করছেন যে এমন ব্যবহারের অধিকার আপনার আছে।",
            ],
            bullets: [
              "কেবল সেই উপাদানই ডাউনলোড করুন, যার স্বত্ব আপনার, অথবা যার ব্যবহার কপিরাইট ধারক বা আইন অনুমোদন করে।",
              "কপিরাইট ও সংশ্লিষ্ট অধিকার (related rights) লঙ্ঘন, নিষিদ্ধ কনটেন্ট বিতরণ বা অন্যদের অধিকার লঙ্ঘনের জন্য সেবাটি ব্যবহার করবেন না।",
              "সেবার প্রযুক্তিগত সীমা, যেমন অনুরোধের হারের সীমা এবং বট যাচাই, এড়িয়ে যাওয়ার চেষ্টা করবেন না।",
              "স্বয়ংক্রিয় চাপ সৃষ্টি করবেন না: গণ-অনুরোধ, স্ক্রিপ্ট এবং পার্সার ব্যবহার অনুমোদিত নয়।",
            ],
          },
          {
            heading: "চ্যানেলে লিংক প্রকাশ",
            body: [
              "বটের মাধ্যমে ভিডিও ডাউনলোড করে আপনি সম্মতি দিচ্ছেন যে মূল পোস্টের লিংক আমাদের Telegram চ্যানেলে প্রকাশ করা হবে। এ বিষয়ে একটি সতর্কবার্তা বটে মান নির্বাচনের আগেই দেখানো হয় — অর্থাৎ ডাউনলোড করার সিদ্ধান্ত নেওয়ার আগেই।",
              "প্রকাশনা বেনামি: চ্যানেলে যায় সর্বসাধারণের জন্য উন্মুক্ত পাতার লিংক, ভিডিওর শিরোনাম এবং তার কভার — ঠিক সেই ফ্রেম, যা প্ল্যাটফর্ম নিজেই পোস্টের প্রিভিউতে দেখায়। কে ভিডিওটি ডাউনলোড করেছেন, তা উল্লেখ করা হয় না। ভিডিও ফাইলটি নিজে কখনো কোথাও প্রকাশ করা হয় না: ছড়িয়ে দেওয়া হয় কেবল লিংক, যা প্ল্যাটফর্মগুলো নিজেরাই প্রতিটি পোস্টের নিচে «শেয়ার» বোতামের মাধ্যমে ছড়িয়ে দিতে আহ্বান জানায়।",
              "একই লিংক একবারের বেশি প্রকাশ করা হয় না। আপনি যদি না চান যে কোনো লিংক চ্যানেলে যাক, তবে সেই ভিডিওটি আমাদের সেবার মাধ্যমে ডাউনলোড করবেন না।",
              "গ্রুপ থেকে আসা লিংক এবং সংযুক্ত অ্যাকাউন্টের মাধ্যমে ডাউনলোড করা পোস্ট চ্যানেলে কখনো প্রকাশ করা হয় না।"
            ],
          },
          {
            heading: "আপনার অ্যাকাউন্ট সংযুক্ত করা",
            body: [
              "কোনো প্ল্যাটফর্মে আপনার অ্যাকাউন্ট বটের সঙ্গে সংযুক্ত করে আপনি নিশ্চিত করছেন যে অ্যাকাউন্টটি আপনার এবং এভাবে তা ব্যবহারের অধিকার আপনার আছে।",
              "প্ল্যাটফর্মগুলো স্বয়ংক্রিয় ডাউনলোড অনুমোদন করে না এবং সংযুক্ত অ্যাকাউন্ট সীমিত বা ব্লক করতে পারে। এই ঝুঁকি আপনি নিজে গ্রহণ করছেন; আমরা মূল অ্যাকাউন্টের বদলে একটি আলাদা, দ্বিতীয় অ্যাকাউন্ট সংযুক্ত করার পরামর্শ দিই। প্ল্যাটফর্ম আপনার অ্যাকাউন্টে যে বিধিনিষেধ আরোপ করে, তার জন্য আমরা দায়ী নই।",
              "কোনো গ্রুপে সংযুক্ত অ্যাকাউন্ট সেই গ্রুপের সব সদস্যের ডাউনলোডের জন্য ব্যবহৃত হয়। কে অ্যাকাউন্ট সংযুক্ত করতে পারবেন, তা গ্রুপের অ্যাডমিনরা ঠিক করেন এবং তাঁরা যেকোনো অ্যাকাউন্ট মুছে ফেলতে পারেন।",
            ],
          },
          {
            heading: "দায়বদ্ধতার সীমাবদ্ধতা",
            body: [
              "সেবাটি «যেমন আছে» (as is) ভিত্তিতে প্রদান করা হয়। আমরা নিরবচ্ছিন্ন কার্যক্রম, কোনো নির্দিষ্ট প্ল্যাটফর্মের প্রাপ্যতা বা কোনো ফাইল আপনার উদ্দেশ্যের জন্য উপযুক্ত হবে কি না, তার নিশ্চয়তা দিই না।",
              "ডাউনলোড করা উপাদান নিয়ে আপনি কী করেন, তার জন্য এবং আপনার দ্বারা অন্যদের অধিকার লঙ্ঘনের পরিণতির জন্য আমরা দায়ী নই।",
              "আমরা সেবার সুবিধাসমূহ পরিবর্তন করার, রক্ষণাবেক্ষণের জন্য সেবা সাময়িকভাবে স্থগিত করার এবং সেবা বন্ধ করে দেওয়ার অধিকার রাখি।",
            ],
          },
          {
            heading: "প্রবেশাধিকার সীমিতকরণ",
            body: [
              "এই শর্তাবলি লঙ্ঘিত হলে, সীমা এড়ানোর চেষ্টা করা হলে, অথবা কোনো কপিরাইট ধারকের কাছ থেকে যুক্তিসংগত অভিযোগ পাওয়া গেলে আমরা সেবায় প্রবেশাধিকার সীমিত বা বন্ধ করতে পারি।",
            ],
          },
          {
            heading: "পরিবর্তন ও প্রযোজ্য আইন",
            body: [
              "আমরা এই শর্তাবলি পরিবর্তন করতে পারি; কার্যকর সংস্করণের তারিখ পাতার শুরুতে দেওয়া আছে। পরিবর্তনের পরও সেবাটি ব্যবহার চালিয়ে গেলে আপনি নতুন সংস্করণ গ্রহণ করেছেন বলে গণ্য হবে।",
              "পক্ষগুলোর মধ্যকার সম্পর্কের ক্ষেত্রে কাজাখস্তান প্রজাতন্ত্রের আইন প্রযোজ্য (governing law)। পক্ষগুলো বিরোধ পত্রালাপের মাধ্যমে নিষ্পত্তির চেষ্টা করবে, এবং সমঝোতায় পৌঁছানো না গেলে কাজাখস্তান প্রজাতন্ত্রের আইনে নির্ধারিত পদ্ধতিতে নিষ্পত্তি করা হবে।",
            ],
          },
        ],
      },
      cookies: {
        title: "কুকি নীতি",
        summary: `${operator.site} কোন কুকি ব্যবহার করে, সেগুলো কেন প্রয়োজন এবং কীভাবে সেগুলো প্রত্যাখ্যান করা যায়।`,
        sections: [
          {
            heading: "কুকি কী",
            body: [
              "কুকি হলো ছোট টেক্সট ফাইল, যা একটি সাইট আপনার ব্রাউজারে সংরক্ষণ করে। এগুলোর মাধ্যমে আপনার সেটিংস মনে রাখা যায় এবং ভিজিটের বেনামি পরিসংখ্যান সংগ্রহ করা যায়।",
              "কুকির পাশাপাশি এই নথিতে সংশ্লিষ্ট প্রযুক্তিগুলোরও বর্ণনা দেওয়া হয়েছে — ব্রাউজারের লোকাল স্টোরেজ এবং ট্র্যাকিং পিক্সেল।",
            ],
          },
          {
            heading: "অত্যাবশ্যক",
            body: [
              "এগুলো ছাড়া সেবাটি কাজ করে না, তাই এগুলো সবসময় সেট করা হয়।",
            ],
            bullets: [
              "Cloudflare Turnstile — যাচাই করে যে লিংকটি কোনো মানুষ পাঠাচ্ছেন, স্ক্রিপ্ট নয়।",
              "ইন্টারফেসের সেটিংস — আপনার নির্বাচিত ভাষা ও রঙের থিম।",
            ],
          },
          {
            heading: "অ্যানালিটিক্স",
            body: [
              "এগুলো আমাদের বুঝতে সাহায্য করে কোন পাতাগুলো ব্যবহৃত হয় এবং কোথায় ত্রুটি দেখা দেয়। এগুলো আপনার সম্মতিতে সেট করা হয় এবং সেবা চালানোর জন্য বাধ্যতামূলক নয়।",
            ],
            bullets: [
              "Google Analytics এবং Google Tag Manager — বেনামি আকারে ভিজিটের সংখ্যা ও সাইটে আচরণ।",
              "Yandex Metrica — ভিজিটের সংখ্যা, ক্লিক ম্যাপ এবং Webvisor।",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica-র Webvisor পাতায় কার্যকলাপ রেকর্ড করে: পয়েন্টারের নড়াচড়া, স্ক্রলিং, ক্লিক এবং লিংকের ঘরে টাইপ করা লেখা। এর উদ্দেশ্য হলো দেখা, ইন্টারফেসের কোন জায়গায় মানুষ বিভ্রান্ত হন।",
              "নির্দিষ্ট কোনো ব্যক্তিকে অনুসরণ করতে আমরা এই রেকর্ডিং ব্যবহার করি না। অনুগ্রহ করে সাইটের ঘরগুলোতে এমন কিছু লিখবেন না, যা আপনি সংরক্ষিত হোক বলে চান না।",
            ],
          },
          {
            heading: "কীভাবে প্রত্যাখ্যান করবেন",
            bullets: [
              "আপনার ব্রাউজারের সেটিংসে কুকি ব্লক বা মুছে ফেলার ব্যবস্থা করুন — এই পদ্ধতি এখানে উল্লিখিত সব ব্যবস্থার ক্ষেত্রে কাজ করে।",
              "Google Analytics: তথ্য সংগ্রহ বন্ধ করার জন্য অফিশিয়াল ব্রাউজার অ্যাড-অন Google-এর সাইটে পাওয়া যায়।",
              "Yandex Metrica: Yandex-এর অফিশিয়াল অ্যাড-অনের মাধ্যমে প্রত্যাখ্যান করা যায়।",
              "অত্যাবশ্যক কুকি বন্ধ করলে ডাউনলোড করা সম্ভব হবে না।",
            ],
          },
          {
            heading: "সংরক্ষণের মেয়াদ",
            body: [
              "সেশন কুকি ব্রাউজার বন্ধ করলে বা সেশনের মেয়াদ শেষ হলে মুছে যায়। অ্যানালিটিক্স ব্যবস্থাগুলো তাদের শনাক্তকারী সংশ্লিষ্ট সরবরাহকারীর নির্ধারিত মেয়াদ পর্যন্ত সংরক্ষণ করে।",
            ],
          },
        ],
      },
      copyright: {
        title: "কপিরাইট ধারকদের জন্য",
        summary: "কপিরাইট বিষয়ে সেবার অবস্থান এবং লঙ্ঘনের অভিযোগ দাখিলের পদ্ধতি।",
        sections: [
          {
            heading: "সেবার অবস্থান",
            body: [
              "সেবাটি নিজের কাছে কোনো ভিডিও রাখে না এবং কোনো ক্যাটালগ পরিচালনা করে না। এটি একটি প্রযুক্তিগত মধ্যস্থতাকারী হিসেবে কাজ করে: ব্যবহারকারীর দেওয়া লিংক অনুযায়ী একটি সর্বসাধারণের জন্য উন্মুক্ত পাতায় যায় এবং ফাইলটি সেই ব্যবহারকারীকে পৌঁছে দেয়।",
              "ডাউনলোড করা ফাইল সার্ভারে প্রায় এক ঘণ্টা থাকে এবং তারপর স্বয়ংক্রিয়ভাবে মুছে যায়। অন্যের কনটেন্টের কোনো স্থায়ী কপি আমাদের কাছে থাকে না।",
              "ডাউনলোড করা উপাদান ব্যবহারের দায় ব্যবহারকারীর — ব্যবহারের শর্তাবলিতে এটি স্পষ্টভাবে উল্লেখ করা আছে।",
            ],
          },
          {
            heading: "আপনার অধিকার লঙ্ঘিত হলে",
            body: [
              `আপনি যদি কপিরাইট ধারক বা তাঁর প্রতিনিধি হন এবং মনে করেন যে সেবাটি আপনার অধিকার লঙ্ঘনের জন্য ব্যবহৃত হচ্ছে, তবে ${MAIL} ঠিকানায় লিখুন। আমরা এ ধরনের অভিযোগ পর্যালোচনা করি এবং ব্যবস্থা গ্রহণ করি।`,
            ],
          },
          {
            heading: "অভিযোগে কী উল্লেখ করবেন",
            bullets: [
              "কোন রচনাকর্ম (work) এর সঙ্গে সংশ্লিষ্ট এবং কিসের ভিত্তিতে আপনি এর স্বত্বাধিকারী।",
              "উপাদানটির লিংক এবং, জানা থাকলে, লঙ্ঘনের পরিস্থিতি।",
              "আপনার যোগাযোগের তথ্য: নাম বা প্রতিষ্ঠানের নাম, ঠিকানা এবং ইমেইল ঠিকানা।",
              "আপনি কপিরাইট ধারকের পক্ষে কাজ করলে — আপনার ক্ষমতার প্রমাণ।",
              "এই মর্মে একটি বিবৃতি যে অভিযোগে দেওয়া তথ্য সঠিক এবং উপাদানটির ব্যবহার কপিরাইট ধারক বা আইন দ্বারা অনুমোদিত নয়।",
            ],
          },
          {
            heading: "আমরা কী করব",
            body: [
              "আমরা যুক্তিসঙ্গত সময়ের মধ্যে, সাধারণত ত্রিশ পঞ্জিকা দিবসের মধ্যে, অভিযোগ পর্যালোচনা করি এবং লঙ্ঘন নিশ্চিত হলে সেবার মাধ্যমে উপাদানটিতে প্রবেশাধিকার সীমিত করি, এবং প্রয়োজনে লঙ্ঘনকারীর সেবায় প্রবেশাধিকারও সীমিত করি।",
              "পর্যালোচনার ফলাফল আমরা আপনার দেওয়া ইমেইল ঠিকানায় জানাব।",
            ],
          },
          {
            heading: "অসৎ উদ্দেশ্যে করা অভিযোগ",
            body: [
              "জেনেশুনে মিথ্যা তথ্য সংবলিত অভিযোগের ক্ষেত্রে প্রযোজ্য আইন অনুযায়ী অভিযোগকারী দায়ী হতে পারেন। কোনো অভিযোগ থেকে যদি কপিরাইট ধারক বা বিতর্কিত উপাদান — কোনোটিই শনাক্ত করা না যায়, তবে আমরা সেটি পর্যালোচনা করতে অস্বীকার করার অধিকার রাখি।",
            ],
          },
        ],
      },
    },
  },
  ur: {
    ui: {
      updated: "آخری ترمیم",
      back: "مرکزی صفحے پر واپس",
      operatorHeading: "سروس کا آپریٹر",
      navHeading: "دیگر دستاویزات",
      labels: {
        privacy: "رازداری کی پالیسی",
        terms: "شرائطِ استعمال",
        cookies: "کوکی پالیسی",
        copyright: "حقوق کے مالکان کے لیے",
      },
    },
    docs: {
      privacy: {
        title: "رازداری کی پالیسی",
        summary: `${operator.site} کون سا ڈیٹا جمع کرتا ہے، اس کی ضرورت کیوں ہے، اسے کتنی مدت تک رکھا جاتا ہے اور اسے کیسے حذف کروایا جا سکتا ہے۔`,
        sections: [
          {
            heading: "عمومی دفعات",
            body: [
              `یہ پالیسی بیان کرتی ہے کہ ${operator.site} سروس کون سا ذاتی ڈیٹا اور کس مقصد کے لیے پراسیس کرتی ہے۔ ڈیٹا کا ذمہ دار (data controller) ${operator.nameUr} ہے۔`,
              "سروس استعمال کر کے آپ یہاں بیان کردہ طریقۂ پراسیسنگ سے اتفاق کرتے ہیں۔ اگر آپ اس سے متفق نہیں ہیں تو براہِ کرم سروس استعمال نہ کریں۔",
              "ڈیٹا کی پراسیسنگ جمہوریہ قازقستان کے قانون “ذاتی ڈیٹا اور اس کے تحفظ کے بارے میں” کے مطابق کی جاتی ہے، اور یورپی اقتصادی علاقے (European Economic Area) سے آنے والے صارفین کے حوالے سے GDPR کے تقاضوں کو بھی ملحوظ رکھا جاتا ہے۔",
            ],
          },
          {
            heading: "ہم کون سا ڈیٹا پراسیس کرتے ہیں",
            body: [
              "ہم دانستہ طور پر سروس چلانے کے لیے ضروری ڈیٹا سے زیادہ کچھ جمع نہیں کرتے، اور نہ ہی شناختی دستاویزات، ادائیگی کی تفصیلات یا پتہ طلب کرتے ہیں۔",
            ],
            bullets: [
              "Telegram اکاؤنٹ کا ڈیٹا جو بوٹ کو اس وقت موصول ہوتا ہے جب آپ اسے پیغام بھیجتے ہیں: عددی شناخت (id)، صارف نام (username)، نام اور زبان کا کوڈ۔",
              "وہ لنکس جو آپ ڈاؤن لوڈ کے لیے بھیجتے ہیں، اور خود کوشش کی تفصیلات: پلیٹ فارم، تاریخ اور وقت، منتخب کردہ کوالٹی، اور نتیجہ (کامیابی یا خرابی)۔",
              "کنکشن کا تکنیکی ڈیٹا: IP ایڈریس، براؤزر کی قسم اور ورژن، زبان، اور وہ صفحہ جہاں سے آپ آئے۔ یہ ڈیٹا سرور لاگز اور ویب اینالیٹکس کے نظاموں میں درج ہوتا ہے۔",
              "کوکیز اور اینالیٹکس کے شناخت کنندگان — تفصیلات کوکی پالیسی میں دیکھیں۔",
            ],
          },
          {
            heading: "اس ڈیٹا کی ضرورت کیوں ہے",
            bullets: [
              "خود سروس فراہم کرنا: آپ کے لنک سے ویڈیو حاصل کرنا اور فائل آپ کے حوالے کرنا۔",
              "آپ کے اکاؤنٹ کو دوسروں کے اکاؤنٹس سے ممتاز کرنا اور غلط استعمال کی روک تھام کرنا۔",
              "لنک بھیجنے سے پہلے Cloudflare Turnstile کی جانچ کے ذریعے سروس کو خودکار غلط استعمال سے محفوظ رکھنا۔",
              "یہ سمجھنا کہ سائٹ کیسے استعمال ہوتی ہے اور خرابیاں دور کرنا — گمنام (anonymised) اور مجموعی اعداد و شمار کے ذریعے۔",
              "آپ کی اور حقوق کے مالکان کی درخواستوں کا جواب دینا۔",
              "کبھی کبھار Telegram پر آپ کو پیغام بھیج کر سروس کے بارے میں آپ کی رائے معلوم کرنا — مثلاً اگر آپ نے اسے استعمال کرنا چھوڑ دیا ہو۔ جواب دینا لازمی نہیں؛ اگر آپ ایسے پیغامات نہیں چاہتے تو بس ہمیں بتا دیں، ہم دوبارہ نہیں لکھیں گے۔",
            ],
          },
          {
            heading: "پراسیسنگ کی قانونی بنیادیں",
            body: [
              "Telegram اکاؤنٹ کا ڈیٹا اور ڈاؤن لوڈز کی تفصیلات شرائطِ استعمال کی تعمیل کے لیے پراسیس کی جاتی ہیں، جنہیں آپ سروس استعمال کرنا شروع کرتے ہی قبول کرتے ہیں۔",
              "اینالیٹکس کوکیز اور سائٹ پر سرگرمی کی ریکارڈنگ آپ کی رضامندی کی بنیاد پر پراسیس کی جاتی ہیں، جسے آپ کسی بھی وقت واپس لے سکتے ہیں — طریقے کوکی پالیسی میں بیان کیے گئے ہیں۔",
              "سرور لاگز اور بوٹس سے تحفظ سروس کو فعال اور محفوظ رکھنے میں ہمارے جائز مفاد (legitimate interest) کی بنیاد پر پراسیس کیے جاتے ہیں۔",
              "سروس کے بارے میں آپ کی رائے پوچھنا اسے بہتر بنانے میں ہمارے جائز مفاد کی بنیاد پر ہے؛ آپ کسی بھی وقت اس سے انکار کر سکتے ہیں۔",
            ],
          },
          {
            heading: "منسلک اکاؤنٹس",
            body: [
              "آپ چاہیں تو کسی پلیٹ فارم (Instagram، Facebook، YouTube، X، VK، TikTok) پر اپنا اکاؤنٹ بوٹ سے منسلک کر سکتے ہیں، تاکہ بوٹ وہ پوسٹس ڈاؤن لوڈ کر سکے جو صرف لاگ اِن صارفین کو نظر آتی ہیں: اسٹوریز اور نجی پوسٹس۔ اس کے لیے بوٹ اس اکاؤنٹ کی کوکیز حاصل کرتا ہے — Videoner ایکسٹینشن سے ایک بار استعمال ہونے والے کوڈ کے ذریعے، یا اس فائل سے جو آپ نے بھیجی ہو۔",
              "ہم صرف منتخب پلیٹ فارم کی کوکیز محفوظ رکھتے ہیں اور باقی فوراً ضائع کر دیتے ہیں۔ انہیں خفیہ کاری (encryption) کے ساتھ محفوظ کیا جاتا ہے اور صرف وہیں ڈاؤن لوڈز کے لیے استعمال کیا جاتا ہے جہاں آپ نے انہیں منسلک کیا ہو۔ نجی چیٹ میں منسلک کی گئی کوکیز آپ کے ڈاؤن لوڈز کے لیے استعمال ہوتی ہیں، بشمول ان گروپس میں آپ کے اپنے لنکس کے جن میں اپنا کوئی اکاؤنٹ منسلک نہیں؛ دوسروں کے لنکس کے لیے یہ کبھی استعمال نہیں ہوتیں۔ کسی گروپ سے منسلک کوکیز صرف اس کے اراکین کے ڈاؤن لوڈز کے لیے استعمال ہوتی ہیں اور کہیں نہیں۔",
              "قانونی بنیاد آپ کی رضامندی ہے: آپ اکاؤنٹ خود منسلک کرتے ہیں اور کسی بھی وقت ‎/accounts کمانڈ کے ذریعے اسے ہٹا سکتے ہیں۔ ہٹائے جانے پر کوکیز مستقل طور پر مٹا دی جاتی ہیں۔ اگر پلیٹ فارم لاگ اِن قبول کرنا بند کر دے تو بوٹ آپ کو اس کی اطلاع دیتا ہے۔",
              "منسلک اکاؤنٹ کے ذریعے ڈاؤن لوڈ کی گئی پوسٹس ہمارے چینل میں شائع نہیں کی جاتیں اور مشترکہ کیش (cache) سے دوسرے صارفین کو فراہم نہیں کی جاتیں۔",
            ],
          },
          {
            heading: "فریقِ ثالث کی خدمات",
            body: [
              "ہم آپ کا ڈیٹا نہ فروخت کرتے ہیں اور نہ ہی فریقِ ثالث کو ان کے اپنے مقاصد کے لیے منتقل کرتے ہیں۔ سروس چلانے کے لیے درج ذیل فراہم کنندگان کی خدمات لی جاتی ہیں، جن میں سے ہر ایک ڈیٹا کو اپنے قواعد کے مطابق پراسیس کرتا ہے:",
            ],
            bullets: [
              `Telegram — ‎${BOT} بوٹ کا چلنا۔`,
              "Cloudflare — بوٹس سے تحفظ (Turnstile)، سائٹ کی ترسیل اور ای میل کی روٹنگ۔",
              "Google Analytics اور Google Tag Manager — وزٹس کے اعداد و شمار۔",
              "Yandex Metrica — وزٹس کے اعداد و شمار، کلک میپ اور Webvisor۔ Webvisor صفحے پر سرگرمی ریکارڈ کرتا ہے: پوائنٹر کی حرکت، اسکرولنگ اور کلکس۔ یہ ریکارڈنگز صرف سائٹ کی سہولتِ استعمال کے تجزیے کے لیے استعمال ہوتی ہیں۔",
            ],
          },
          {
            heading: "ہم ڈیٹا کتنی مدت تک رکھتے ہیں",
            bullets: [
              "ڈاؤن لوڈ کی گئی فائلیں بننے کے تقریباً ایک گھنٹے بعد سرور سے خودکار طور پر حذف ہو جاتی ہیں۔ ہم آپ کی ویڈیوز کا کوئی آرکائیو نہیں رکھتے۔",
              "ڈاؤن لوڈ کی کوششوں کے ریکارڈ اس وقت تک رکھے جاتے ہیں جب تک غلط استعمال کی روک تھام اور درخواستوں کے جائزے کے لیے ضروری ہو۔",
              "اکاؤنٹ کا ڈیٹا اس وقت تک رکھا جاتا ہے جب تک آپ سروس استعمال کرتے ہیں، اور آپ کی درخواست پر حذف کر دیا جاتا ہے۔",
              "سرور لاگز محدود مدت تک رکھے جاتے ہیں اور روٹیشن کے ساتھ ان پر نیا ڈیٹا لکھ دیا جاتا ہے۔",
            ],
          },
          {
            heading: "ڈیٹا کہاں پراسیس ہوتا ہے",
            body: [
              "سروس کے سرورز یورپی یونین کی حدود میں واقع ایک ڈیٹا سینٹر میں ہیں۔ اوپر درج فراہم کنندگان میں سے بعض اپنی پالیسیوں کے مطابق اس کی حدود سے باہر بھی ڈیٹا پراسیس کر سکتے ہیں۔",
            ],
          },
          {
            heading: "آپ کے حقوق",
            body: [
              `آپ کو حق حاصل ہے کہ اپنے ڈیٹا کی پراسیسنگ کے بارے میں معلومات حاصل کریں، اس کی درستی یا حذف کرنے کا مطالبہ کریں، اپنی رضامندی واپس لیں اور پراسیسنگ پر اعتراض کریں۔ اس کے لیے ${MAIL} پر اسی ای میل یا اسی Telegram اکاؤنٹ سے لکھیں جس سے درخواست کا تعلق ہو۔`,
              "ہم مناسب مدت کے اندر، عام طور پر تیس کیلنڈر دنوں کے اندر جواب دیتے ہیں۔ اکاؤنٹ حذف کرنے سے اس سے منسلک ڈاؤن لوڈز کی تاریخ بھی حذف ہو جاتی ہے۔",
            ],
          },
          {
            heading: "نابالغ",
            body: [
              "یہ سروس 16 سال سے کم عمر بچوں کے لیے نہیں ہے اور نہ ہی ان کو مخاطب کرتی ہے۔ ہم دانستہ طور پر ایسے صارفین کا ڈیٹا جمع نہیں کرتے؛ اگر غلطی سے ایسا ہو گیا ہو تو ہمیں لکھیں، ڈیٹا حذف کر دیا جائے گا۔",
            ],
          },
          {
            heading: "تبدیلیاں",
            body: [
              "ہم اس پالیسی کو اپ ڈیٹ کر سکتے ہیں۔ موجودہ ترمیم کی تاریخ صفحے کے شروع میں درج ہے؛ اہم تبدیلیوں کی نشاندہی ہم سروس میں کریں گے۔",
            ],
          },
        ],
      },
      terms: {
        title: "شرائطِ استعمال",
        summary: `${operator.site} کے استعمال کے قواعد: کیا جائز ہے، کیا ناجائز ہے اور سروس کن شرائط پر کام کرتی ہے۔`,
        sections: [
          {
            heading: "عمومی دفعات",
            body: [
              `یہ شرائط ${operator.site} ویب سائٹ اور Telegram بوٹ ‎${BOT} کے استعمال کو منضبط کرتی ہیں۔ سروس کا مالک اور منتظم ${operator.nameUr} ہے۔`,
              "سروس استعمال کرنا شروع کر کے آپ تصدیق کرتے ہیں کہ آپ نے یہ شرائط پڑھ لی ہیں اور انہیں قبول کرتے ہیں۔ اگر کوئی شرط آپ کے لیے قابلِ قبول نہیں تو سروس استعمال نہ کریں۔",
            ],
          },
          {
            heading: "سروس مفت ہے",
            body: [
              "سروس کی تمام سہولیات مفت فراہم کی جاتی ہیں۔ ہمارے ہاں نہ سبسکرپشنز ہیں، نہ ادائیگی والے پلان، نہ ادائیگی والی ویڈیو کوالٹیز اور نہ ہی سروس کے اندر خریداریاں۔",
              "ہم نہ اشتہارات دکھاتے ہیں اور نہ ہی ملحقہ (affiliate) لنکس لگاتے ہیں۔",
            ],
          },
          {
            heading: "رسائی کی شرائط",
            bullets: [
              "ویب سائٹ پر ڈاؤن لوڈ کے لیے نہ اکاؤنٹ درکار ہے اور نہ لاگ اِن۔ بوٹ صارفین کو ان کے Telegram اکاؤنٹ سے پہچانتا ہے۔",
              "درخواستوں کی تعداد پر تکنیکی حدود سروس کو زیادہ بوجھ اور خودکار غلط استعمال سے محفوظ رکھتی ہیں۔",
              "YouTube کے لیے روزانہ ٹریفک کی حد مقرر ہے: ویب سائٹ اور ایکسٹینشن پر ایک نیٹ ورک کے لیے 24 گھنٹوں میں 10 GB، اور بوٹ میں ایک Telegram اکاؤنٹ کے لیے 24 گھنٹوں میں 25 GB۔ دیگر پلیٹ فارمز اس سے متاثر نہیں ہوتے۔",
              "بوٹ کے ذریعے ڈاؤن لوڈ کے لیے ہمارے چینل کو سبسکرائب کرنا ضروری نہیں۔ بوٹ فائلوں کی کیپشن میں پروجیکٹ کے نیوز چینل کا لنک شامل کرتا ہے؛ اسے سبسکرائب کرنا اختیاری ہے۔",
            ],
          },
          {
            heading: "سروس کیا کرتی ہے",
            body: [
              "سروس ایک تکنیکی ثالث (technical intermediary) ہے: آپ کے فراہم کردہ لنک پر یہ ایک عوامی طور پر قابلِ رسائی صفحے تک پہنچتی ہے، میڈیا فائل حاصل کرتی ہے اور اسے آپ تک منتقل کرتی ہے۔",
              "ہم اپنے ہاں ویڈیوز کا کوئی کیٹلاگ نہیں رکھتے، دوسروں کے مواد میں تلاش نہیں چلاتے، اور ڈاؤن لوڈ کی گئی فائلوں کو منتقلی کے لیے ضروری وقت — تقریباً ایک گھنٹے — سے زیادہ محفوظ نہیں رکھتے۔",
              "کسی مخصوص پلیٹ فارم کی دستیابی اس پلیٹ فارم کے تکنیکی فیصلوں پر منحصر ہے اور بغیر پیشگی اطلاع کے بدل سکتی ہے۔",
            ],
          },
          {
            heading: "صارف کی ذمہ داریاں",
            body: [
              "حاصل کردہ فائلوں کو آپ کس طرح استعمال کرتے ہیں، اس کی ذمہ داری صرف آپ پر ہے، اور آپ تصدیق کرتے ہیں کہ آپ کو ایسا کرنے کا حق حاصل ہے۔",
            ],
            bullets: [
              "صرف وہی مواد ڈاؤن لوڈ کریں جس کے حقوق آپ کے پاس ہوں، یا جس کے استعمال کی اجازت حقوق کے مالک یا قانون نے دی ہو۔",
              "سروس کو کاپی رائٹ اور متعلقہ حقوق (related rights) کی خلاف ورزی، ممنوعہ مواد کی تقسیم یا فریقِ ثالث کے حقوق کی خلاف ورزی کے لیے استعمال نہ کریں۔",
              "سروس کی تکنیکی حدود کو، بشمول درخواستوں کی تعداد کی حدود اور بوٹ کی جانچ کے، بائی پاس کرنے کی کوشش نہ کریں۔",
              "خودکار بوجھ پیدا نہ کریں: بڑی تعداد میں درخواستیں، اسکرپٹس اور اسکریپرز (parsers) کی اجازت نہیں ہے۔",
            ],
          },
          {
            heading: "چینل میں لنکس کی اشاعت",
            body: [
              "بوٹ کے ذریعے ویڈیو ڈاؤن لوڈ کر کے آپ اس بات سے اتفاق کرتے ہیں کہ اصل پوسٹ کا لنک ہمارے Telegram چینل میں شائع کیا جائے گا۔ اس کی اطلاع بوٹ میں کوالٹی منتخب کرنے سے پہلے دکھائی جاتی ہے — یعنی اس سے پہلے کہ آپ ڈاؤن لوڈ کرنے کا فیصلہ کریں۔",
              "اشاعت گمنام ہوتی ہے: چینل میں عوامی طور پر قابلِ رسائی صفحے کا لنک، ویڈیو کا عنوان اور اس کا کور جاتا ہے — وہی فریم جو پلیٹ فارم اپنی پوسٹ کے پری ویو میں دکھاتا ہے۔ ویڈیو کس نے ڈاؤن لوڈ کی، یہ ظاہر نہیں کیا جاتا۔ خود ویڈیو فائل کبھی اور کہیں شائع نہیں کی جاتی: صرف لنک آگے بڑھایا جاتا ہے، جسے آگے بڑھانے کی دعوت پلیٹ فارمز خود ہر پوسٹ کے نیچے “شیئر” بٹن کے ذریعے دیتے ہیں۔",
              "ایک ہی لنک ایک سے زیادہ بار شائع نہیں کیا جاتا۔ اگر آپ نہیں چاہتے کہ کوئی لنک چینل تک پہنچے تو وہ ویڈیو ہماری سروس کے ذریعے ڈاؤن لوڈ نہ کریں۔",
              "گروپس سے آنے والے لنکس اور منسلک اکاؤنٹ کے ذریعے ڈاؤن لوڈ کی گئی پوسٹس چینل میں شائع نہیں کی جاتیں۔",
            ],
          },
          {
            heading: "اپنا اکاؤنٹ منسلک کرنا",
            body: [
              "کسی پلیٹ فارم پر اپنا اکاؤنٹ بوٹ سے منسلک کر کے آپ تصدیق کرتے ہیں کہ یہ آپ کا اکاؤنٹ ہے اور آپ کو اسے اس طرح استعمال کرنے کا حق حاصل ہے۔",
              "پلیٹ فارمز خودکار ڈاؤن لوڈز کو پسند نہیں کرتے اور منسلک اکاؤنٹ کو محدود یا بلاک کر سکتے ہیں۔ یہ خطرہ آپ اپنے ذمے لیتے ہیں؛ ہمارا مشورہ ہے کہ اپنے بنیادی اکاؤنٹ کے بجائے کوئی الگ اکاؤنٹ منسلک کریں۔ پلیٹ فارم کی جانب سے آپ کے اکاؤنٹ پر عائد کی گئی پابندیوں کے ہم ذمہ دار نہیں ہیں۔",
              "کسی گروپ سے منسلک اکاؤنٹ اس کے تمام اراکین کے ڈاؤن لوڈز کے لیے استعمال ہوتا ہے۔ گروپ کے ایڈمنز طے کرتے ہیں کہ کون اکاؤنٹس منسلک کر سکتا ہے، اور وہ ان میں سے کسی کو بھی ہٹا سکتے ہیں۔",
            ],
          },
          {
            heading: "ذمہ داری کی حد بندی",
            body: [
              "سروس “جیسی ہے” (as is) کی بنیاد پر فراہم کی جاتی ہے۔ ہم بلا تعطل کام، کسی مخصوص پلیٹ فارم کی دستیابی یا فائل کے آپ کے مقاصد کے لیے موزوں ہونے کی ضمانت نہیں دیتے۔",
              "ڈاؤن لوڈ کیے گئے مواد کے ساتھ آپ جو کچھ کرتے ہیں، اور آپ کی جانب سے فریقِ ثالث کے حقوق کی خلاف ورزی کے نتائج کے ہم ذمہ دار نہیں ہیں۔",
              "ہمیں حق حاصل ہے کہ سروس کی سہولیات میں تبدیلی کریں، دیکھ بھال کے لیے اس کا کام معطل کریں اور اسے بند کر دیں۔",
            ],
          },
          {
            heading: "رسائی کی پابندی",
            body: [
              "ان شرائط کی خلاف ورزی، حدود کو بائی پاس کرنے کی کوشش، یا حقوق کے مالک کی جانب سے مدلل شکایت موصول ہونے کی صورت میں ہم سروس تک رسائی محدود یا ختم کر سکتے ہیں۔",
            ],
          },
          {
            heading: "تبدیلیاں اور قابلِ اطلاق قانون",
            body: [
              "ہم ان شرائط میں ترمیم کر سکتے ہیں؛ نافذ ترمیم کی تاریخ صفحے کے شروع میں درج ہے۔ تبدیلیوں کے بعد سروس کا استعمال جاری رکھنے کا مطلب ہے کہ آپ نئی ترمیم کو قبول کرتے ہیں۔",
              "فریقین کے تعلقات پر جمہوریہ قازقستان کا قانون لاگو ہوتا ہے۔ فریقین تنازعات کو خط و کتابت کے ذریعے حل کرنے کی کوشش کریں گے، اور اتفاق نہ ہونے کی صورت میں جمہوریہ قازقستان کے قانون میں مقررہ طریقۂ کار کے مطابق۔",
            ],
          },
        ],
      },
      cookies: {
        title: "کوکی پالیسی",
        summary: `${operator.site} کون سی کوکیز استعمال کرتا ہے، ان کی ضرورت کیوں ہے اور ان سے انکار کیسے کیا جائے۔`,
        sections: [
          {
            heading: "کوکیز کیا ہیں",
            body: [
              "کوکیز چھوٹی ٹیکسٹ فائلیں ہیں جو ویب سائٹ آپ کے براؤزر میں محفوظ کرتی ہے۔ ان کی مدد سے آپ کی ترتیبات یاد رکھی جاتی ہیں اور وزٹس کے گمنام اعداد و شمار جمع کیے جاتے ہیں۔",
              "کوکیز کے ساتھ ساتھ اس دستاویز میں ہم ان سے ملتی جلتی ٹیکنالوجیز کو بھی بیان کرتے ہیں — براؤزر کا لوکل اسٹوریج اور ٹریکنگ پکسلز۔",
            ],
          },
          {
            heading: "لازمی کوکیز",
            body: [
              "ان کے بغیر سروس کام نہیں کرتی، اس لیے یہ ہمیشہ سیٹ کی جاتی ہیں۔",
            ],
            bullets: [
              "Cloudflare Turnstile — یہ جانچ کہ لنک کوئی انسان بھیج رہا ہے، اسکرپٹ نہیں۔",
              "انٹرفیس کی ترتیبات — منتخب کردہ زبان اور رنگوں کی تھیم۔",
            ],
          },
          {
            heading: "اینالیٹکس کوکیز",
            body: [
              "یہ ہمیں سمجھنے میں مدد دیتی ہیں کہ کون سے صفحات استعمال ہوتے ہیں اور خرابیاں کہاں پیش آتی ہیں۔ یہ آپ کی رضامندی سے سیٹ کی جاتی ہیں اور سروس کے کام کرنے کے لیے لازمی نہیں ہیں۔",
            ],
            bullets: [
              "Google Analytics اور Google Tag Manager — گمنام شکل میں وزٹس اور سائٹ پر رویہ۔",
              "Yandex Metrica — وزٹس، کلک میپ اور Webvisor۔",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica کا Webvisor صفحے پر سرگرمی ریکارڈ کرتا ہے: پوائنٹر کی حرکت، اسکرولنگ، کلکس اور لنک کے خانے میں ٹائپنگ۔ اس کا مقصد یہ دیکھنا ہے کہ انٹرفیس کہاں صارفین کو الجھن میں ڈالتا ہے۔",
              "ہم ان ریکارڈنگز کو مخصوص افراد کی نگرانی کے لیے استعمال نہیں کرتے۔ سائٹ کے خانوں میں ایسی معلومات درج نہ کریں جنہیں آپ محفوظ کیا جانا پسند نہ کریں۔",
            ],
          },
          {
            heading: "انکار کیسے کریں",
            bullets: [
              "اپنے براؤزر کی ترتیبات میں کوکیز کو بلاک یا حذف کریں — یہ طریقہ یہاں درج تمام نظاموں کے لیے کارآمد ہے۔",
              "Google Analytics: ڈیٹا جمع کرنا بند کرنے والا براؤزر کا آفیشل ایڈ آن Google کی ویب سائٹ پر دستیاب ہے۔",
              "Yandex Metrica: انکار Yandex کے آفیشل ایڈ آن کے ذریعے ممکن ہے۔",
              "لازمی کوکیز کو غیر فعال کرنے سے ڈاؤن لوڈ کرنا ناممکن ہو جائے گا۔",
            ],
          },
          {
            heading: "مدتِ محفوظگی",
            body: [
              "سیشن کوکیز براؤزر بند کرنے پر یا سیشن کی مدت ختم ہونے پر حذف ہو جاتی ہیں۔ اینالیٹکس کے نظام اپنے شناخت کنندگان کو ان کے فراہم کنندگان کی مقرر کردہ مدت تک محفوظ رکھتے ہیں۔",
            ],
          },
        ],
      },
      copyright: {
        title: "حقوق کے مالکان کے لیے",
        summary: "کاپی رائٹ کے بارے میں سروس کا مؤقف اور خلاف ورزی کی شکایت درج کرانے کا طریقۂ کار۔",
        sections: [
          {
            heading: "سروس کا مؤقف",
            body: [
              "سروس اپنے ہاں ویڈیوز نہیں رکھتی اور نہ ہی ان کا کوئی کیٹلاگ چلاتی ہے۔ یہ ایک تکنیکی ثالث کے طور پر کام کرتی ہے: صارف کے درج کردہ لنک پر یہ عوامی طور پر قابلِ رسائی صفحے تک پہنچتی ہے اور فائل اسی صارف کو منتقل کرتی ہے۔",
              "ڈاؤن لوڈ کی گئی فائلیں تقریباً ایک گھنٹہ سرور پر رہتی ہیں اور پھر خودکار طور پر حذف ہو جاتی ہیں۔ دوسروں کے مواد کی کوئی مستقل نقل ہمارے پاس باقی نہیں رہتی۔",
              "ڈاؤن لوڈ کیے گئے مواد کے استعمال کی ذمہ داری صارف پر ہے — یہ بات شرائطِ استعمال میں صراحت کے ساتھ درج ہے۔",
            ],
          },
          {
            heading: "اگر آپ کے حقوق کی خلاف ورزی ہوئی ہے",
            body: [
              `اگر آپ حقوق کے مالک یا ان کے نمائندے ہیں اور سمجھتے ہیں کہ سروس آپ کے حقوق کی خلاف ورزی کے لیے استعمال ہو رہی ہے تو ${MAIL} پر لکھیں۔ ہم ایسی شکایات کا جائزہ لیتے ہیں اور کارروائی کرتے ہیں۔`,
            ],
          },
          {
            heading: "شکایت میں کیا شامل کریں",
            bullets: [
              "کون سی تخلیق (work) متاثر ہوئی ہے اور آپ کس بنیاد پر اس کے حقوق کے مالک ہیں۔",
              "مواد کا لنک اور، اگر معلوم ہوں، خلاف ورزی کے حالات۔",
              "آپ کی رابطہ معلومات: نام یا ادارے کا نام، پتہ اور ای میل ایڈریس۔",
              "اگر آپ حقوق کے مالک کی جانب سے کارروائی کر رہے ہیں تو اختیار کا ثبوت۔",
              "یہ بیان کہ شکایت میں دی گئی معلومات درست ہیں اور مواد کے استعمال کی اجازت نہ حقوق کے مالک نے دی ہے اور نہ قانون نے۔",
            ],
          },
          {
            heading: "ہم کیا کریں گے",
            body: [
              "ہم شکایت کا جائزہ مناسب مدت کے اندر، عام طور پر تیس کیلنڈر دنوں کے اندر لیتے ہیں، اور خلاف ورزی کی تصدیق ہونے پر سروس کے ذریعے مواد تک رسائی محدود کر دیتے ہیں اور ضرورت پڑنے پر خلاف ورزی کرنے والے کی سروس تک رسائی بھی۔",
              "جائزے کے نتائج سے ہم آپ کو آپ کے فراہم کردہ ای میل ایڈریس پر آگاہ کریں گے۔",
            ],
          },
          {
            heading: "بدنیتی پر مبنی شکایات",
            body: [
              "دانستہ طور پر غلط معلومات پر مشتمل شکایت قابلِ اطلاق قانون کے تحت شکایت کنندہ کی ذمہ داری کا باعث بن سکتی ہے۔ اگر کسی شکایت سے نہ حقوق کے مالک کی شناخت ہو سکے اور نہ متنازعہ مواد کی، تو ہمیں اس کا جائزہ لینے سے انکار کا حق حاصل ہے۔",
            ],
          },
        ],
      },
    },
  },

  pl: {
    ui: {
      updated: "Wersja z dnia",
      back: "Strona główna",
      operatorHeading: "Operator serwisu",
      navHeading: "Inne dokumenty",
      labels: {
        privacy: "Polityka prywatności",
        terms: "Regulamin",
        cookies: "Polityka cookies",
        copyright: "Dla uprawnionych",
      },
    },
    docs: {
      privacy: {
        title: "Polityka prywatności",
        summary: `Jakie dane zbiera ${operator.site}, w jakim celu, jak długo są przechowywane i jak je usunąć.`,
        sections: [
          {
            heading: "Postanowienia ogólne",
            body: [
              `Niniejsza Polityka określa, jakie dane osobowe przetwarza serwis ${operator.site} i w jakim celu. Administratorem danych jest ${operator.namePl}.`,
              "Korzystając z serwisu, akceptujesz opisane tu zasady przetwarzania. Jeżeli się z nimi nie zgadzasz, prosimy nie korzystać z serwisu.",
              "Przetwarzanie odbywa się zgodnie z Ustawą Republiki Kazachstanu „O danych osobowych i ich ochronie”, a w odniesieniu do osób odwiedzających z Europejskiego Obszaru Gospodarczego — z uwzględnieniem wymogów RODO.",
            ],
          },
          {
            heading: "Jakie dane przetwarzamy",
            body: [
              "Świadomie nie zbieramy niczego ponad to, co jest niezbędne do działania serwisu, i nie żądamy dokumentów tożsamości, danych płatniczych ani adresu.",
            ],
            bullets: [
              "Dane konta Telegram, które bot otrzymuje, gdy do niego piszesz: identyfikator liczbowy, nazwa użytkownika, imię i kod języka.",
              "Linki, które przesyłasz do pobrania, oraz informacje o samej próbie pobrania: platforma, data i godzina, wybrana jakość, wynik (powodzenie lub błąd).",
              "Techniczne dane połączenia: adres IP, typ i wersja przeglądarki, język, strona odsyłająca. Trafiają one do dzienników serwera oraz do narzędzi analityki internetowej.",
              "Pliki cookie i identyfikatory analityczne — szczegóły w Polityce cookies.",
            ],
          },
          {
            heading: "W jakim celu przetwarzamy dane",
            bullets: [
              "Aby świadczyć samą usługę: pobrać film spod podanego przez Ciebie linku i przekazać Ci plik.",
              "Aby odróżnić Twoje konto od kont innych osób i przeciwdziałać nadużyciom.",
              "Aby chronić serwis przed zautomatyzowanymi nadużyciami: weryfikacja Cloudflare Turnstile przed przesłaniem linku.",
              "Aby rozumieć, w jaki sposób korzysta się ze strony, i usuwać błędy — na podstawie zanonimizowanych i zagregowanych statystyk.",
              "Aby odpowiadać na Twoje zgłoszenia oraz zgłoszenia uprawnionych z tytułu praw autorskich.",
              "Aby sporadycznie napisać do Ciebie w Telegramie i zapytać o Twoją opinię o serwisie — na przykład gdy przestałeś z niego korzystać. Odpowiedź nie jest obowiązkowa; jeżeli nie chcesz otrzymywać takich wiadomości, wystarczy, że nam o tym napiszesz, a więcej się nie odezwiemy.",
            ],
          },
          {
            heading: "Podstawy przetwarzania",
            body: [
              "Dane konta Telegram oraz informacje o pobraniach są przetwarzane w celu wykonania Regulaminu, który akceptujesz, rozpoczynając korzystanie z serwisu.",
              "Analityczne pliki cookie oraz nagrywanie działań na stronie są przetwarzane na podstawie Twojej zgody, którą możesz w każdej chwili wycofać — sposoby opisano w Polityce cookies.",
              "Dzienniki serwera i ochrona przed botami są przetwarzane w ramach naszego prawnie uzasadnionego interesu, polegającego na utrzymaniu sprawności i bezpieczeństwa serwisu.",
              "Pytania o Twoją opinię o serwisie — w ramach naszego prawnie uzasadnionego interesu, polegającego na ulepszaniu serwisu; możesz z nich zrezygnować w każdej chwili.",
            ],
          },
          {
            heading: "Podłączone konta",
            body: [
              "Jeżeli chcesz, możesz podłączyć do bota swoje konto na platformie (Instagram, Facebook, YouTube, X, VK, TikTok), aby bot pobierał treści widoczne wyłącznie dla zalogowanych użytkowników: relacje (stories), posty prywatne. W tym celu bot otrzymuje pliki cookie tego konta — z rozszerzenia Videoner za pomocą jednorazowego kodu albo z przesłanego przez Ciebie pliku.",
              "Zachowujemy wyłącznie pliki cookie wybranej platformy, pozostałe odrzucamy natychmiast. Są one przechowywane w postaci zaszyfrowanej i wykorzystywane wyłącznie do pobierania tam, gdzie je podłączyłeś. Pliki cookie podłączone w czacie prywatnym służą Twoim pobraniom, w tym Twoim własnym linkom w grupach, w których nie podłączono własnego konta; nie są używane do linków innych osób. Pliki cookie podłączone do grupy służą pobraniom jej członków i nigdzie poza tym.",
              "Podstawą jest Twoja zgoda: samodzielnie podłączasz konto i możesz je w każdej chwili usunąć poleceniem /accounts. Po usunięciu pliki cookie są trwale kasowane. Jeżeli platforma przestanie akceptować logowanie, bot Cię o tym poinformuje.",
              "Treści pobrane za pośrednictwem podłączonego konta nie są publikowane na naszym kanale ani udostępniane innym użytkownikom ze wspólnej pamięci podręcznej.",
            ],
          },
          {
            heading: "Usługi podmiotów trzecich",
            body: [
              "Nie sprzedajemy Twoich danych i nie przekazujemy ich podmiotom trzecim do ich własnych celów. Do działania serwisu wykorzystujemy następujących dostawców, z których każdy przetwarza dane według własnych zasad:",
            ],
            bullets: [
              `Telegram — działanie bota ${BOT}.`,
              "Cloudflare — ochrona przed botami (Turnstile), dostarczanie strony i przekierowywanie poczty.",
              "Google Analytics i Google Tag Manager — statystyki odwiedzin.",
              "Yandex Metrica — statystyki odwiedzin, mapa kliknięć i Webvisor. Webvisor rejestruje działania na stronie: ruchy kursora, przewijanie i kliknięcia. Nagrania są wykorzystywane wyłącznie do analizy użyteczności strony.",
            ],
          },
          {
            heading: "Jak długo przechowujemy dane",
            bullets: [
              "Pobrane pliki są automatycznie usuwane z serwera po około godzinie od ich utworzenia. Nie przechowujemy archiwum Twoich filmów.",
              "Zapisy prób pobrania są przechowywane tak długo, jak jest to potrzebne do przeciwdziałania nadużyciom i rozpatrywania zgłoszeń.",
              "Dane konta są przechowywane przez okres korzystania z serwisu i usuwane na Twoje żądanie.",
              "Dzienniki serwera są przechowywane przez ograniczony czas i nadpisywane w ramach rotacji.",
            ],
          },
          {
            heading: "Gdzie przetwarzane są dane",
            body: [
              "Serwery serwisu znajdują się w centrum danych na terytorium Unii Europejskiej. Część wymienionych wyżej dostawców może przetwarzać dane poza jej granicami zgodnie z własnymi politykami.",
            ],
          },
          {
            heading: "Twoje prawa",
            body: [
              `Masz prawo uzyskać informacje o przetwarzaniu Twoich danych, żądać ich sprostowania lub usunięcia, wycofać zgodę oraz wnieść sprzeciw wobec przetwarzania. W tym celu napisz na adres ${MAIL} z tego adresu e-mail lub tego konta Telegram, którego dotyczy zgłoszenie.`,
              "Odpowiadamy w rozsądnym terminie, z reguły w ciągu trzydziestu dni kalendarzowych. Usunięcie konta pociąga za sobą usunięcie powiązanej z nim historii pobrań.",
            ],
          },
          {
            heading: "Osoby niepełnoletnie",
            body: [
              "Serwis nie jest przeznaczony dla dzieci poniżej 16. roku życia ani do nich skierowany. Świadomie nie zbieramy danych takich użytkowników; jeżeli stało się to przez pomyłkę, napisz do nas, a dane zostaną usunięte.",
            ],
          },
          {
            heading: "Zmiany",
            body: [
              "Możemy aktualizować niniejszą Politykę. Data obowiązującej wersji jest podana na początku strony; o istotnych zmianach będziemy informować w serwisie.",
            ],
          },
        ],
      },
      terms: {
        title: "Regulamin",
        summary: `Zasady korzystania z ${operator.site}: co jest dozwolone, co jest zabronione i na jakich warunkach działa serwis.`,
        sections: [
          {
            heading: "Postanowienia ogólne",
            body: [
              `Regulamin określa zasady korzystania ze strony ${operator.site} oraz bota Telegram ${BOT}. Właścicielem i administratorem serwisu jest ${operator.namePl}.`,
              "Rozpoczynając korzystanie z serwisu, potwierdzasz, że zapoznałeś się z warunkami i je akceptujesz. Jeżeli którykolwiek z warunków Ci nie odpowiada, nie należy korzystać z serwisu.",
            ],
          },
          {
            heading: "Serwis jest bezpłatny",
            body: [
              "Wszystkie funkcje serwisu są udostępniane bezpłatnie. Nie mamy subskrypcji, płatnych planów, płatnych jakości wideo ani zakupów wewnątrz serwisu.",
              "Nie wyświetlamy reklam i nie zamieszczamy linków partnerskich.",
            ],
          },
          {
            heading: "Warunki dostępu",
            bullets: [
              "Pobieranie na stronie nie wymaga ani konta, ani logowania. Bot rozróżnia użytkowników na podstawie ich kont Telegram.",
              "Przed przeciążeniem i zautomatyzowanymi nadużyciami serwis chronią techniczne ograniczenia częstotliwości zapytań.",
              "Dla YouTube obowiązuje dobowy limit transferu: 10 GB na 24 godziny z jednej sieci na stronie i w rozszerzeniu oraz 25 GB na 24 godziny na jedno konto Telegram w bocie. Limit ten nie dotyczy pozostałych platform.",
              "Subskrypcja naszego kanału nie jest wymagana do pobierania przez bota. W podpisie do plików bot dodaje link do kanału z aktualnościami projektu; subskrybowanie go jest dobrowolne.",
            ],
          },
          {
            heading: "Co robi serwis",
            body: [
              "Serwis jest pośrednikiem technicznym: korzystając z podanego przez Ciebie linku, łączy się z ogólnodostępną stroną, pobiera plik multimedialny i przekazuje go Tobie.",
              "Nie udostępniamy u siebie katalogu filmów, nie prowadzimy wyszukiwania w cudzych treściach i nie przechowujemy pobranych plików dłużej, niż jest to niezbędne do ich przekazania — około godziny.",
              "Dostępność danej platformy zależy od jej rozwiązań technicznych i może ulec zmianie bez uprzedzenia.",
            ],
          },
          {
            heading: "Obowiązki użytkownika",
            body: [
              "Ponosisz wyłączną odpowiedzialność za sposób wykorzystania otrzymanych plików i potwierdzasz, że masz do tego prawo.",
            ],
            bullets: [
              "Pobieraj wyłącznie materiały, do których przysługują Ci prawa, albo na których wykorzystanie zezwala uprawniony lub prawo.",
              "Nie wykorzystuj serwisu do naruszania praw autorskich i praw pokrewnych, rozpowszechniania treści zabronionych ani naruszania praw osób trzecich.",
              "Nie próbuj obchodzić technicznych ograniczeń serwisu, w tym limitów częstotliwości zapytań i weryfikacji antybotowej.",
              "Nie generuj zautomatyzowanego obciążenia: masowe zapytania, skrypty i parsery są niedozwolone.",
            ],
          },
          {
            heading: "Publikowanie linków na kanale",
            body: [
              "Pobierając film przez bota, wyrażasz zgodę na opublikowanie linku do oryginalnego posta na naszym kanale Telegram. Informacja o tym jest wyświetlana w bocie przed wyborem jakości — czyli zanim podejmiesz decyzję o pobraniu.",
              "Publikacja jest anonimowa: na kanał trafiają link do ogólnodostępnej strony, tytuł filmu i jego okładka — ta sama klatka, którą platforma pokazuje w podglądzie posta. Nie podaje się, kto pobrał film. Sam plik wideo nie jest nigdy i nigdzie publikowany: rozpowszechniany jest link, który same platformy proponują udostępniać za pomocą przycisku „Udostępnij” pod każdym postem.",
              "Ten sam link jest publikowany nie więcej niż jeden raz. Jeżeli nie chcesz, aby link trafił na kanał, nie pobieraj tego filmu za pośrednictwem naszego serwisu.",
              "Linki z grup oraz treści pobrane za pośrednictwem podłączonego konta nie są publikowane na kanale."
            ],
          },
          {
            heading: "Podłączenie własnego konta",
            body: [
              "Podłączając do bota swoje konto na platformie, potwierdzasz, że jest to Twoje konto i masz prawo nim dysponować.",
              "Platformy nie akceptują automatycznego pobierania i mogą ograniczyć lub zablokować podłączone konto. Ryzyko to przyjmujesz na siebie; zalecamy podłączenie osobnego konta, a nie głównego. Nie ponosimy odpowiedzialności za ograniczenia nałożone przez platformę na Twoje konto.",
              "Konto podłączone do grupy jest wykorzystywane do pobierania przez wszystkich jej członków. Administratorzy grupy decydują, kto może podłączać konta, i mogą usunąć każde z nich.",
            ],
          },
          {
            heading: "Ograniczenie odpowiedzialności",
            body: [
              "Serwis jest udostępniany w stanie „takim, jaki jest”. Nie gwarantujemy nieprzerwanego działania, dostępności konkretnej platformy ani przydatności pliku do Twoich celów.",
              "Nie ponosimy odpowiedzialności za to, w jaki sposób rozporządzasz pobranym materiałem, ani za skutki naruszenia przez Ciebie praw osób trzecich.",
              "Mamy prawo zmieniać zakres funkcji, zawieszać działanie serwisu w celu konserwacji oraz zakończyć jego działanie.",
            ],
          },
          {
            heading: "Ograniczenie dostępu",
            body: [
              "Możemy ograniczyć lub zakończyć dostęp do serwisu w przypadku naruszenia niniejszych warunków, prób obejścia ograniczeń, a także po otrzymaniu uzasadnionej skargi uprawnionego.",
            ],
          },
          {
            heading: "Zmiany i prawo właściwe",
            body: [
              "Możemy zmieniać warunki; data obowiązującej wersji jest podana na początku strony. Dalsze korzystanie z serwisu po wprowadzeniu zmian oznacza akceptację nowej wersji.",
              "Do stosunków między stronami stosuje się prawo Republiki Kazachstanu. Strony dążą do rozstrzygania sporów w drodze korespondencji, a w razie nieosiągnięcia porozumienia — w trybie przewidzianym przez przepisy prawa Republiki Kazachstanu.",
            ],
          },
        ],
      },
      cookies: {
        title: "Polityka cookies",
        summary: `Jakich plików cookie używa ${operator.site}, do czego służą i jak z nich zrezygnować.`,
        sections: [
          {
            heading: "Czym są pliki cookie",
            body: [
              "Pliki cookie to niewielkie pliki tekstowe, które strona zapisuje w Twojej przeglądarce. Pozwalają zapamiętać Twoje ustawienia i zbierać zanonimizowane statystyki odwiedzin.",
              "Oprócz plików cookie niniejszy dokument opisuje również pokrewne technologie — pamięć lokalną przeglądarki i piksele śledzące.",
            ],
          },
          {
            heading: "Niezbędne",
            body: [
              "Bez nich serwis nie działa, dlatego są one zawsze instalowane.",
            ],
            bullets: [
              "Cloudflare Turnstile — sprawdzenie, czy link przesyła człowiek, a nie skrypt.",
              "Ustawienia interfejsu — wybrany język i motyw kolorystyczny.",
            ],
          },
          {
            heading: "Analityczne",
            body: [
              "Pomagają zrozumieć, z których stron się korzysta i gdzie występują błędy. Są instalowane za Twoją zgodą i nie są niezbędne do działania serwisu.",
            ],
            bullets: [
              "Google Analytics i Google Tag Manager — odwiedzalność i zachowanie na stronie w formie zanonimizowanej.",
              "Yandex Metrica — odwiedzalność, mapa kliknięć i Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor narzędzia Yandex Metrica rejestruje działania na stronie: ruchy kursora, przewijanie, kliknięcia i wpisywanie tekstu w polu linku. Jest to potrzebne, aby widzieć, w których miejscach interfejs wprowadza w błąd.",
              "Nie wykorzystujemy tych nagrań do śledzenia konkretnych osób. Nie wpisuj w pola strony informacji, których nie chciałbyś zachowywać.",
            ],
          },
          {
            heading: "Jak zrezygnować",
            bullets: [
              "Skonfiguruj blokowanie lub usuwanie plików cookie w swojej przeglądarce — ten sposób działa w przypadku wszystkich wymienionych systemów.",
              "Google Analytics: oficjalny dodatek do przeglądarki wyłączający zbieranie danych jest dostępny na stronie Google.",
              "Yandex Metrica: rezygnacja jest możliwa za pomocą oficjalnego dodatku Yandex.",
              "Wyłączenie niezbędnych plików cookie uniemożliwi pobieranie.",
            ],
          },
          {
            heading: "Okres przechowywania",
            body: [
              "Sesyjne pliki cookie są usuwane po zamknięciu przeglądarki lub po wygaśnięciu sesji. Liczniki analityczne przechowują identyfikatory przez okresy określone przez ich dostawców.",
            ],
          },
        ],
      },
      copyright: {
        title: "Dla uprawnionych",
        summary: "Stanowisko serwisu w sprawie praw autorskich i tryb zgłaszania naruszeń.",
        sections: [
          {
            heading: "Stanowisko serwisu",
            body: [
              "Serwis nie udostępnia u siebie filmów i nie prowadzi ich katalogu. Działa jako pośrednik techniczny: korzystając z linku wprowadzonego przez użytkownika, łączy się z ogólnodostępną stroną i przekazuje plik użytkownikowi.",
              "Pobrane pliki są przechowywane na serwerze przez około godzinę i automatycznie usuwane. Nie pozostaje u nas żadna trwała kopia cudzych treści.",
              "Odpowiedzialność za wykorzystanie pobranego materiału ponosi użytkownik — jest to wprost zapisane w Regulaminie.",
            ],
          },
          {
            heading: "Jeżeli Twoje prawa zostały naruszone",
            body: [
              `Jeżeli jesteś podmiotem praw autorskich (uprawnionym) lub jego przedstawicielem i uważasz, że serwis jest wykorzystywany do naruszania Twoich praw, napisz na adres ${MAIL}. Rozpatrujemy takie zgłoszenia i podejmujemy odpowiednie działania.`,
            ],
          },
          {
            heading: "Co należy podać w zgłoszeniu",
            bullets: [
              "Którego utworu dotyczy zgłoszenie i na jakiej podstawie przysługują Ci do niego prawa.",
              "Link do materiału oraz, jeżeli są znane, okoliczności naruszenia.",
              "Twoje dane kontaktowe: imię i nazwisko lub nazwa, adres oraz adres e-mail.",
              "Jeżeli działasz w imieniu uprawnionego — dokument potwierdzający umocowanie.",
              "Oświadczenie, że informacje zawarte w zgłoszeniu są prawdziwe, a wykorzystanie materiału nie jest dozwolone przez uprawnionego ani przez prawo.",
            ],
          },
          {
            heading: "Co zrobimy",
            body: [
              "Rozpatrujemy zgłoszenie w rozsądnym terminie, z reguły w ciągu trzydziestu dni kalendarzowych, a w razie potwierdzenia naruszenia ograniczamy dostęp do materiału za pośrednictwem serwisu oraz, w razie potrzeby, dostęp naruszającego do serwisu.",
              "O wyniku rozpatrzenia poinformujemy na wskazany przez Ciebie adres e-mail.",
            ],
          },
          {
            heading: "Zgłoszenia w złej wierze",
            body: [
              "Zgłoszenie zawierające informacje świadomie nieprawdziwe może skutkować odpowiedzialnością zgłaszającego zgodnie z przepisami prawa. Możemy odmówić rozpatrzenia zgłoszenia, jeżeli nie pozwala ono ustalić ani uprawnionego, ani spornego materiału.",
            ],
          },
        ],
      },
    },
  },
  ja: {
    ui: {
      updated: "最終更新日",
      back: "ホームに戻る",
      operatorHeading: "サービス運営者",
      navHeading: "その他の文書",
      labels: {
        privacy: "プライバシーポリシー",
        terms: "利用規約",
        cookies: "Cookieポリシー",
        copyright: "権利者の皆様へ",
      },
    },
    docs: {
      privacy: {
        title: "プライバシーポリシー",
        summary: `${operator.site} が収集するデータ、その必要性、保存期間および削除の方法について説明します。`,
        sections: [
          {
            heading: "総則",
            body: [
              `本ポリシーは、${operator.site} サービスがどのような個人データをどのような目的で取り扱うかを定めるものです。データの管理者（データ管理者）は${operator.nameJa}です。`,
              "本サービスを利用することにより、利用者はここに定める取扱いに同意したものとみなされます。同意いただけない場合は、本サービスを利用しないでください。",
              "個人データの取扱いは、カザフスタン共和国「個人データおよびその保護に関する法律」に従って行い、欧州経済領域からの訪問者については、一般データ保護規則（GDPR）の要件も考慮します。",
            ],
          },
          {
            heading: "取り扱うデータ",
            body: [
              "当方は、本サービスの運営に必要な範囲を超えるデータを意図的に収集することはなく、身分証明書、支払情報または住所の提出を求めることもありません。",
            ],
            bullets: [
              "利用者がボットにメッセージを送信した際にボットが受け取るTelegramアカウントのデータ：数値ID、ユーザー名、名前および言語コード。",
              "ダウンロードのために送信されたリンクおよびダウンロード試行に関する情報：プラットフォーム、日時、選択した画質、結果（成功またはエラー）。",
              "接続に関する技術データ：IPアドレス、ブラウザの種類およびバージョン、言語、参照元ページ。これらはサーバーログおよびウェブ解析ツールに記録されます。",
              "Cookieおよび解析用識別子。詳細はCookieポリシーをご覧ください。",
            ],
          },
          {
            heading: "利用目的",
            bullets: [
              "本サービスそのものを提供するため：利用者のリンクから動画を取得し、ファイルを利用者に引き渡します。",
              "利用者のアカウントを他者のアカウントと区別し、不正利用を防止するため。",
              "リンク送信前のCloudflare Turnstileによる確認を通じて、自動化された不正利用から本サービスを保護するため。",
              "匿名化・集計された統計により、サイトの利用状況を把握し、不具合を修正するため。",
              "利用者および権利者からのお問い合わせに対応するため。",
              "本サービスに関するご意見を伺うため、まれにTelegramでメッセージをお送りすることがあります（例えば、利用者が本サービスの利用をやめた場合など）。返信は任意です。このようなメッセージが不要な場合はその旨をお伝えいただければ、以後お送りしません。",
            ],
          },
          {
            heading: "取扱いの法的根拠",
            body: [
              "Telegramアカウントのデータおよびダウンロードに関する情報は、利用者が本サービスの利用開始時に承諾する利用規約を履行するために取り扱います。",
              "解析用Cookieおよびサイト上の操作の記録は、利用者の同意に基づいて取り扱います。同意はいつでも撤回することができ、その方法はCookieポリシーに記載しています。",
              "サーバーログおよびボット対策は、本サービスの稼働と安全を維持するという当方の正当な利益に基づいて取り扱います。",
              "本サービスに関するご意見の照会は、本サービスを改善するという当方の正当な利益に基づいて行います。利用者はいつでもこれを拒否することができます。",
            ],
          },
          {
            heading: "連携アカウント",
            body: [
              "利用者は、希望により、プラットフォーム（Instagram、Facebook、YouTube、X、VK、TikTok）上の自身のアカウントをボットに連携させ、ログインしたユーザーのみが閲覧できる投稿（ストーリーズ、非公開の投稿）をボットにダウンロードさせることができます。このため、ボットは当該アカウントのCookieを、Videoner拡張機能からワンタイムコードを介して、または利用者が送信したファイルから受け取ります。",
              "当方は、選択されたプラットフォームのCookieのみを保存し、それ以外は直ちに破棄します。Cookieは暗号化して保存され、利用者が連携させた場所でのダウンロードにのみ使用されます。個人チャットで連携されたCookieは、利用者自身のダウンロード（独自のアカウントが連携されていないグループにおける利用者自身のリンクを含みます）に使用され、他者のリンクには使用されません。グループに連携されたCookieは、当該グループのメンバーによるダウンロードにのみ使用され、それ以外には使用されません。",
              "法的根拠は利用者の同意です。利用者は自らアカウントを連携させ、/accounts コマンドによりいつでも削除することができます。削除されたCookieは完全に消去されます。プラットフォームがログインを受け付けなくなった場合は、ボットがその旨を利用者に通知します。",
              "連携アカウントを介してダウンロードされた投稿は、当方のチャンネルで公開されることはなく、共有キャッシュから他の利用者に提供されることもありません。",
            ],
          },
          {
            heading: "第三者サービス",
            body: [
              "当方は、利用者のデータを販売することはなく、第三者が独自の目的で利用するために提供することもありません。本サービスの運営には以下の事業者が関与しており、各事業者はそれぞれの規定に従ってデータを取り扱います。",
            ],
            bullets: [
              `Telegram：${BOT} ボットの運用。`,
              "Cloudflare：ボット対策（Turnstile）、サイトの配信およびメールのルーティング。",
              "Google AnalyticsおよびGoogle Tag Manager：訪問統計。",
              "Yandex Metrica：訪問統計、クリックマップおよびWebvisor。Webvisorはページ上の操作（ポインターの移動、スクロール、クリック）を記録します。記録はサイトの使いやすさの分析にのみ使用されます。",
            ],
          },
          {
            heading: "保存期間",
            bullets: [
              "ダウンロードされたファイルは、作成から約1時間後にサーバーから自動的に削除されます。当方は利用者の動画のアーカイブを保持しません。",
              "ダウンロード試行の記録は、不正利用の防止およびお問い合わせへの対応に必要な期間保存されます。",
              "アカウントのデータは、利用者が本サービスを利用している間保存され、利用者の請求により削除されます。",
              "サーバーログは限られた期間保存され、ローテーションに伴い上書きされます。",
            ],
          },
          {
            heading: "データの取扱場所",
            body: [
              "本サービスのサーバーは欧州連合域内のデータセンターに設置されています。上記の事業者の一部は、それぞれのポリシーに従い、欧州連合域外でデータを取り扱う場合があります。",
            ],
          },
          {
            heading: "利用者の権利",
            body: [
              `利用者は、自身のデータの取扱いに関する情報の提供を受け、その訂正または削除を請求し、同意を撤回し、取扱いに異議を申し立てる権利を有します。その場合は、請求に関係するメールアドレスまたはTelegramアカウントから ${MAIL} までご連絡ください。`,
              "当方は合理的な期間内、原則として30暦日以内に回答します。アカウントを削除すると、それに紐づくダウンロード履歴も削除されます。",
            ],
          },
          {
            heading: "未成年者",
            body: [
              "本サービスは16歳未満の児童を対象としたものではなく、児童に向けて提供されるものでもありません。当方は、そのような利用者のデータを意図的に収集することはありません。誤って収集された場合はご連絡いただければ、当該データを削除します。",
            ],
          },
          {
            heading: "変更",
            body: [
              "当方は本ポリシーを更新することがあります。現行版の日付はページ冒頭に表示されており、重要な変更については本サービス内でお知らせします。",
            ],
          },
        ],
      },
      terms: {
        title: "利用規約",
        summary: `${operator.site} の利用に関するルール：許可されること、禁止されること、および本サービスの提供条件について定めます。`,
        sections: [
          {
            heading: "総則",
            body: [
              `本規約は、${operator.site} ウェブサイトおよびTelegramボット ${BOT} の利用について定めるものです。本サービスの所有者および管理者は${operator.nameJa}です。`,
              "本サービスの利用を開始することにより、利用者は本規約を読み、これを承諾したことを確認するものとします。いずれかの条件に同意いただけない場合は、本サービスを利用しないでください。",
            ],
          },
          {
            heading: "無料のサービス",
            body: [
              "本サービスのすべての機能は無料で提供されます。サブスクリプション、有料プラン、有料の動画画質およびサービス内課金はありません。",
              "当方は広告を表示せず、アフィリエイトリンクも掲載しません。",
            ],
          },
          {
            heading: "利用条件",
            bullets: [
              "ウェブサイトでのダウンロードには、アカウントもログインも必要ありません。ボットは利用者をTelegramアカウントによって識別します。",
              "リクエスト頻度に関する技術的な制限により、本サービスを過負荷および自動化された不正利用から保護しています。",
              "YouTubeのダウンロードには1日あたりのトラフィック制限があります：ウェブサイトおよび拡張機能では1つのネットワークにつき24時間あたり10 GB、ボットでは1つのTelegramアカウントにつき24時間あたり25 GBです。その他のプラットフォームには適用されません。",
              "ボットでダウンロードするために当方のチャンネルを購読する必要はありません。ボットはファイルのキャプションにプロジェクトのニュースチャンネルへのリンクを付加しますが、その購読は任意です。",
            ],
          },
          {
            heading: "本サービスの機能",
            body: [
              "本サービスは技術的な仲介者として機能します。利用者が提供したリンクに基づいて一般に公開されているページにアクセスし、メディアファイルを取得して利用者に引き渡します。",
              "当方は動画のカタログを保有せず、他者のコンテンツの検索を行わず、ダウンロードされたファイルを引き渡しに必要な時間（約1時間）を超えて保存しません。",
              "特定のプラットフォームが利用できるかどうかは、当該プラットフォームの技術的な判断に左右され、予告なく変更されることがあります。",
            ],
          },
          {
            heading: "利用者の義務",
            body: [
              "利用者は、取得したファイルの使用方法について自ら責任を負い、そのような使用を行う権利を有することを確認するものとします。",
            ],
            bullets: [
              "自らが権利を有する素材、または権利者もしくは法令により使用が認められている素材のみをダウンロードしてください。",
              "著作権もしくは著作隣接権の侵害、禁止されたコンテンツの頒布、または第三者の権利の侵害のために本サービスを利用しないでください。",
              "リクエスト頻度の制限やボット確認を含む、本サービスの技術的な制限を回避しようとしないでください。",
              "自動化された負荷をかけないでください。大量のリクエスト、スクリプトおよびスクレイパーの使用は認められません。",
            ],
          },
          {
            heading: "チャンネルでのリンクの公開",
            body: [
              "ボットを通じて動画をダウンロードすることにより、利用者は、元の投稿へのリンクが当方のTelegramチャンネルで公開されることに同意するものとします。この旨の通知は、画質を選択する前、すなわちダウンロードするかどうかを決定する前にボット内で表示されます。",
              "公開は匿名で行われます。チャンネルに掲載されるのは、一般に公開されているページへのリンク、動画のタイトルおよびカバー画像（プラットフォームが自ら投稿のプレビューに表示するものと同じ画像）です。誰がダウンロードしたかは表示されません。動画ファイル自体がいかなる場所においても公開されることはありません。共有されるのはリンクであり、これは各プラットフォーム自身がすべての投稿の下にある「共有」ボタンによって共有を促しているものです。",
              "同一のリンクが公開されるのは1回限りです。リンクがチャンネルに掲載されることを望まない場合は、当該動画を本サービスでダウンロードしないでください。",
              "グループからのリンクおよび連携アカウントを介してダウンロードされた投稿は、チャンネルで公開されることはありません。"
            ],
          },
          {
            heading: "自身のアカウントの連携",
            body: [
              "プラットフォーム上の自身のアカウントをボットに連携させることにより、利用者は、当該アカウントが自身のものであり、これをこのように使用する権利を有することを確認するものとします。",
              "プラットフォームは自動ダウンロードを認めておらず、連携されたアカウントを制限または停止する場合があります。利用者はこのリスクを自ら負うものとします。メインのアカウントではなく、別のサブアカウントを連携させることをお勧めします。当方は、プラットフォームが利用者のアカウントに課す制限について責任を負いません。",
              "グループに連携されたアカウントは、当該グループのすべてのメンバーのダウンロードに使用されます。誰がアカウントを連携できるかはグループの管理者が決定し、管理者はいずれのアカウントも削除することができます。",
            ],
          },
          {
            heading: "責任の制限",
            body: [
              "本サービスは「現状有姿」で提供されます。当方は、本サービスが中断なく稼働すること、特定のプラットフォームが利用可能であること、またはファイルが利用者の目的に適合することを保証しません。",
              "当方は、利用者がダウンロードした素材をどのように取り扱ったか、および利用者による第三者の権利侵害の結果について責任を負いません。",
              "当方は、本サービスの機能構成を変更し、保守のために本サービスを一時停止し、また本サービスの提供を終了することができます。",
            ],
          },
          {
            heading: "利用の制限",
            body: [
              "当方は、本規約に違反した場合、制限を回避しようとした場合、または権利者から正当な根拠のある申立てがあった場合、本サービスへのアクセスを制限または終了することができます。",
            ],
          },
          {
            heading: "変更および準拠法",
            body: [
              "当方は本規約を変更することがあります。現行版の日付はページ冒頭に表示されています。変更後も本サービスの利用を継続した場合、利用者は新しい版を承諾したものとみなされます。",
              "当事者間の関係にはカザフスタン共和国法が適用されます。当事者は紛争を書面のやり取りにより解決するよう努め、合意に至らない場合は、カザフスタン共和国の法令に定める手続により解決するものとします。",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookieポリシー",
        summary: `${operator.site} が使用するCookie、その目的および拒否する方法について説明します。`,
        sections: [
          {
            heading: "Cookieとは",
            body: [
              "Cookieとは、ウェブサイトが利用者のブラウザに保存する小さなテキストファイルです。Cookieにより、利用者の設定を記憶し、匿名化された訪問統計を収集することができます。",
              "本書では、Cookieとあわせて、関連する技術であるブラウザのローカルストレージおよびトラッキングピクセルについても説明します。",
            ],
          },
          {
            heading: "必須Cookie",
            body: [
              "これらがなければ本サービスは機能しないため、常に設定されます。",
            ],
            bullets: [
              "Cloudflare Turnstile：リンクを送信しているのがスクリプトではなく人間であることを確認します。",
              "インターフェース設定：選択された言語およびカラーテーマ。",
            ],
          },
          {
            heading: "解析用Cookie",
            body: [
              "これらは、どのページが利用され、どこでエラーが発生しているかを把握するのに役立ちます。利用者の同意を得て設定され、本サービスの動作には必須ではありません。",
            ],
            bullets: [
              "Google AnalyticsおよびGoogle Tag Manager：匿名化された形でのアクセス数およびサイト上の行動。",
              "Yandex Metrica：アクセス数、クリックマップおよびWebvisor。",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex MetricaのWebvisorは、ページ上の操作（ポインターの移動、スクロール、クリックおよびリンク入力欄への入力）を記録します。これは、インターフェースのどこで利用者が戸惑っているかを把握するためのものです。",
              "当方は、これらの記録を特定の個人の追跡には使用しません。保存されたくない情報はサイトの入力欄に入力しないでください。",
            ],
          },
          {
            heading: "拒否の方法",
            bullets: [
              "ブラウザの設定でCookieをブロックまたは削除してください。この方法は、ここに記載したすべてのツールに有効です。",
              "Google Analytics：データ収集を無効にする公式のブラウザアドオンがGoogleから提供されています。",
              "Yandex Metrica：Yandexの公式アドオンによりオプトアウトすることができます。",
              "必須Cookieを無効にすると、ダウンロードができなくなります。",
            ],
          },
          {
            heading: "保存期間",
            body: [
              "セッションCookieは、ブラウザを閉じたとき、またはセッションの有効期限が切れたときに削除されます。解析ツールは、各提供事業者が定める期間、識別子を保存します。",
            ],
          },
        ],
      },
      copyright: {
        title: "権利者の皆様へ",
        summary: "著作権に関する本サービスの立場および権利侵害の申立ての手続について説明します。",
        sections: [
          {
            heading: "本サービスの立場",
            body: [
              "本サービスは動画を掲載せず、そのカタログも保有していません。本サービスは技術的な仲介者として機能し、利用者が入力したリンクに基づいて一般に公開されているページにアクセスし、ファイルを当該利用者に引き渡します。",
              "ダウンロードされたファイルはサーバー上に約1時間保存された後、自動的に削除されます。他者のコンテンツの恒久的な複製が当方の手元に残ることはありません。",
              "ダウンロードされた素材の使用に関する責任は利用者が負います。このことは利用規約に明記されています。",
            ],
          },
          {
            heading: "権利が侵害されている場合",
            body: [
              `権利者またはその代理人の方で、本サービスが自らの権利の侵害に利用されているとお考えの場合は、${MAIL} までご連絡ください。当方はこのような申立てを検討し、必要な措置を講じます。`,
            ],
          },
          {
            heading: "申立てに記載すべき事項",
            bullets: [
              "対象となる著作物、およびその権利を有する根拠。",
              "当該素材へのリンク、および判明している場合は侵害の状況。",
              "申立人の連絡先：氏名または名称、住所およびメールアドレス。",
              "権利者に代わって申立てを行う場合は、その権限を証する資料。",
              "申立ての内容が真実であり、当該素材の使用が権利者または法令によって許諾されていない旨の陳述。",
            ],
          },
          {
            heading: "当方の対応",
            body: [
              "当方は申立てを合理的な期間内、原則として30暦日以内に検討し、侵害が確認された場合は、本サービスを通じた当該素材へのアクセスを制限し、必要に応じて侵害者による本サービスへのアクセスを制限します。",
              "検討の結果は、申立人が指定したメールアドレスにお知らせします。",
            ],
          },
          {
            heading: "不誠実な申立て",
            body: [
              "故意に虚偽の情報を含む申立てを行った場合、申立人は適用法令に基づき責任を問われることがあります。権利者も対象の素材も特定できない申立てについては、当方は検討を拒否することがあります。",
            ],
          },
        ],
      },
    },
  },
  ko: {
    ui: {
      updated: "최종 개정일",
      back: "홈으로 돌아가기",
      operatorHeading: "서비스 운영자",
      navHeading: "기타 문서",
      labels: {
        privacy: "개인정보 처리방침",
        terms: "이용약관",
        cookies: "쿠키 정책",
        copyright: "권리자 안내",
      },
    },
    docs: {
      privacy: {
        title: "개인정보 처리방침",
        summary: `${operator.site}이(가) 수집하는 정보, 그 필요성, 보관 기간 및 삭제 방법을 안내합니다.`,
        sections: [
          {
            heading: "총칙",
            body: [
              `본 방침은 ${operator.site} 서비스가 어떤 개인정보를 어떤 목적으로 처리하는지를 설명합니다. 개인정보처리자는 ${operator.nameKo}입니다.`,
              "서비스를 이용함으로써 귀하는 본 방침에 기재된 처리 방식에 동의하게 됩니다. 이에 동의하지 않으시는 경우 서비스를 이용하지 마시기 바랍니다.",
              "개인정보는 카자흐스탄 공화국「개인정보 및 그 보호에 관한 법률」에 따라 처리되며, 유럽경제지역(EEA)의 방문자에 대해서는 일반 개인정보 보호법(GDPR)의 요건을 함께 고려합니다.",
            ],
          },
          {
            heading: "처리하는 개인정보",
            body: [
              "당사는 서비스 운영에 필요한 범위를 넘어서는 정보를 의도적으로 수집하지 않으며, 신분증명서, 결제 정보 또는 주소를 요구하지 않습니다.",
            ],
            bullets: [
              "귀하가 봇에 메시지를 보낼 때 봇이 수신하는 Telegram 계정 정보: 숫자 식별자, 사용자 이름, 이름 및 언어 코드.",
              "귀하가 다운로드를 위해 보내는 링크와 다운로드 시도에 관한 정보: 플랫폼, 일시, 선택한 화질, 결과(성공 또는 오류).",
              "접속에 관한 기술 정보: IP 주소, 브라우저 종류 및 버전, 언어, 유입 페이지. 이 정보는 서버 로그 및 웹 분석 시스템에 기록됩니다.",
              "쿠키 및 분석 식별자 — 자세한 내용은 쿠키 정책을 참조하십시오.",
            ],
          },
          {
            heading: "처리 목적",
            bullets: [
              "서비스 자체의 제공: 귀하의 링크에 해당하는 동영상을 가져와 파일을 전달합니다.",
              "귀하의 계정을 다른 사람의 계정과 구별하고 남용을 방지합니다.",
              "링크 전송 전 Cloudflare Turnstile 확인을 통해 자동화된 남용으로부터 서비스를 보호합니다.",
              "비식별화되고 집계된 통계를 통해 사이트 이용 현황을 파악하고 오류를 수정합니다.",
              "귀하 및 권리자의 문의에 답변합니다.",
              "서비스에 대한 의견을 여쭙기 위해 가끔 Telegram으로 메시지를 보냅니다(예: 서비스 이용을 중단하신 경우). 답변은 선택 사항이며, 이러한 메시지를 원하지 않으시면 그 뜻을 알려 주시면 더 이상 연락드리지 않습니다.",
            ],
          },
          {
            heading: "처리의 법적 근거",
            body: [
              "Telegram 계정 정보와 다운로드 기록은 귀하가 서비스 이용을 시작함으로써 수락하는 이용약관의 이행을 위하여 처리됩니다.",
              "분석 쿠키와 사이트 내 행동 기록은 귀하의 동의에 근거하여 처리되며, 귀하는 언제든지 동의를 철회할 수 있습니다. 철회 방법은 쿠키 정책에 안내되어 있습니다.",
              "서버 로그와 봇 방지는 서비스의 정상적인 운영과 보안을 유지하려는 당사의 정당한 이익에 근거하여 처리됩니다.",
              "서비스에 대한 의견 문의는 서비스를 개선하려는 당사의 정당한 이익에 근거하며, 귀하는 언제든지 이를 거부할 수 있습니다.",
            ],
          },
          {
            heading: "연결된 계정",
            body: [
              "귀하는 원하는 경우 플랫폼(Instagram, Facebook, YouTube, X, VK, TikTok)의 본인 계정을 봇에 연결하여, 로그인한 사용자에게만 보이는 게시물(스토리, 비공개 게시물)을 봇이 다운로드하도록 할 수 있습니다. 이를 위해 봇은 해당 계정의 쿠키를 Videoner 확장 프로그램으로부터 일회용 코드를 통해 받거나, 귀하가 보낸 파일로부터 받습니다.",
              "당사는 선택된 플랫폼의 쿠키만 저장하고 나머지는 즉시 폐기합니다. 쿠키는 암호화된 형태로 보관되며, 귀하가 연결한 곳에서의 다운로드에만 사용됩니다. 개인 채팅에서 연결한 쿠키는 귀하의 다운로드에 사용되며, 자체 계정이 연결되지 않은 그룹에서 귀하가 직접 보낸 링크도 이에 포함됩니다. 다른 사람의 링크에는 사용되지 않습니다. 그룹에 연결한 쿠키는 해당 그룹 구성원의 다운로드에만 사용되며 그 밖의 용도로는 사용되지 않습니다.",
              "법적 근거는 귀하의 동의입니다. 귀하가 직접 계정을 연결하며, /accounts 명령으로 언제든지 이를 삭제할 수 있습니다. 삭제된 쿠키는 복구할 수 없도록 영구 삭제됩니다. 플랫폼이 로그인을 더 이상 허용하지 않는 경우 봇이 귀하에게 알려 드립니다.",
              "연결된 계정을 통해 다운로드한 게시물은 당사 채널에 게시되지 않으며, 공용 캐시를 통해 다른 사용자에게 제공되지 않습니다.",
            ],
          },
          {
            heading: "제3자 서비스",
            body: [
              "당사는 귀하의 개인정보를 판매하지 않으며, 제3자의 자체 목적을 위하여 제공하지 않습니다. 서비스 운영에는 다음 제공업체가 이용되며, 각 제공업체는 자체 규정에 따라 정보를 처리합니다.",
            ],
            bullets: [
              `Telegram — ${BOT} 봇의 운영.`,
              "Cloudflare — 봇 방지(Turnstile), 사이트 전송 및 메일 라우팅.",
              "Google Analytics 및 Google Tag Manager — 방문 통계.",
              "Yandex Metrica — 방문 통계, 클릭 맵 및 Webvisor. Webvisor는 페이지 내 행동(포인터 이동, 스크롤, 클릭)을 기록합니다. 기록은 사이트의 사용성 분석에만 사용됩니다.",
            ],
          },
          {
            heading: "보관 기간",
            bullets: [
              "다운로드된 파일은 생성 후 약 1시간이 지나면 서버에서 자동으로 삭제됩니다. 당사는 귀하의 동영상 아카이브를 보관하지 않습니다.",
              "다운로드 시도 기록은 남용 방지 및 문의 처리에 필요한 기간 동안 보관됩니다.",
              "계정 정보는 귀하가 서비스를 이용하는 동안 보관되며, 귀하의 요청에 따라 삭제됩니다.",
              "서버 로그는 제한된 기간 동안 보관되며, 로테이션에 따라 덮어쓰기됩니다.",
            ],
          },
          {
            heading: "개인정보의 처리 장소",
            body: [
              "서비스의 서버는 유럽연합 역내의 데이터 센터에 위치합니다. 위에 열거된 제공업체 중 일부는 자체 정책에 따라 역외에서 정보를 처리할 수 있습니다.",
            ],
          },
          {
            heading: "귀하의 권리",
            body: [
              `귀하는 본인 개인정보의 처리에 관한 정보를 제공받고, 그 정정 또는 삭제를 요구하며, 동의를 철회하고, 처리에 이의를 제기할 권리가 있습니다. 이를 위해서는 해당 요청과 관련된 이메일 주소 또는 Telegram 계정으로 ${MAIL}에 연락해 주십시오.`,
              "당사는 합리적인 기간 내에, 원칙적으로 30일(역일) 이내에 답변합니다. 계정을 삭제하면 해당 계정과 연결된 다운로드 기록도 함께 삭제됩니다.",
            ],
          },
          {
            heading: "아동",
            body: [
              "본 서비스는 16세 미만의 아동을 위한 것이 아니며, 아동을 대상으로 하지 않습니다. 당사는 아동의 개인정보를 의도적으로 수집하지 않으며, 착오로 수집된 경우 당사에 연락해 주시면 해당 정보를 삭제합니다.",
            ],
          },
          {
            heading: "변경",
            body: [
              "당사는 본 방침을 개정할 수 있습니다. 현행 버전의 날짜는 페이지 상단에 표시되며, 중요한 변경 사항은 서비스 내에서 고지합니다.",
            ],
          },
        ],
      },
      terms: {
        title: "이용약관",
        summary: `${operator.site} 이용 규칙: 허용되는 행위, 금지되는 행위 및 서비스 제공 조건을 안내합니다.`,
        sections: [
          {
            heading: "총칙",
            body: [
              `본 약관은 ${operator.site} 웹사이트 및 Telegram 봇 ${BOT}의 이용에 관하여 규정합니다. 서비스의 소유자 및 관리자는 ${operator.nameKo}입니다.`,
              "서비스 이용을 시작함으로써 귀하는 본 약관을 읽고 이를 수락하였음을 확인합니다. 약관의 어느 조건이라도 동의하기 어려운 경우 서비스를 이용하지 마시기 바랍니다.",
            ],
          },
          {
            heading: "무료 서비스",
            body: [
              "서비스의 모든 기능은 무료로 제공됩니다. 구독, 유료 요금제, 유료 화질 및 서비스 내 구매는 없습니다.",
              "당사는 광고를 표시하지 않으며 제휴 링크를 게재하지 않습니다.",
            ],
          },
          {
            heading: "이용 조건",
            bullets: [
              "웹사이트에서 다운로드할 때는 계정이나 로그인이 필요하지 않습니다. 봇은 Telegram 계정으로 사용자를 구별합니다.",
              "요청 빈도에 대한 기술적 제한이 과부하 및 자동화된 남용으로부터 서비스를 보호합니다.",
              "YouTube에는 일일 트래픽 한도가 적용됩니다. 웹사이트 및 확장 프로그램에서는 네트워크당 24시간에 10 GB, 봇에서는 Telegram 계정당 24시간에 25 GB입니다. 다른 플랫폼에는 이 한도가 적용되지 않습니다.",
              "봇을 통한 다운로드에는 당사 채널 구독이 필요하지 않습니다. 봇은 파일 설명에 프로젝트 뉴스 채널 링크를 추가하며, 해당 채널의 구독은 선택 사항입니다.",
            ],
          },
          {
            heading: "서비스의 기능",
            body: [
              "본 서비스는 기술적 중개자입니다. 귀하가 제공한 링크에 따라 공개적으로 접근 가능한 페이지에 접속하여 미디어 파일을 가져와 귀하에게 전달합니다.",
              "당사는 동영상 카탈로그를 게시하지 않고, 타인의 콘텐츠를 검색하지 않으며, 다운로드된 파일을 전달에 필요한 시간(약 1시간)보다 오래 보관하지 않습니다.",
              "특정 플랫폼의 이용 가능 여부는 해당 플랫폼의 기술적 결정에 달려 있으며, 사전 통지 없이 변경될 수 있습니다.",
            ],
          },
          {
            heading: "이용자의 의무",
            body: [
              "귀하는 취득한 파일의 이용 방법에 대하여 단독으로 책임을 지며, 그러한 이용에 대한 권한이 있음을 확인합니다.",
            ],
            bullets: [
              "귀하가 권리를 보유하고 있거나, 권리자 또는 법령이 이용을 허락한 자료만 다운로드하십시오.",
              "저작권 및 저작인접권의 침해, 금지된 콘텐츠의 배포 또는 제3자의 권리 침해를 위하여 서비스를 이용하지 마십시오.",
              "요청 빈도 제한 및 봇 확인을 포함하여 서비스의 기술적 제한을 우회하려고 시도하지 마십시오.",
              "자동화된 부하를 발생시키지 마십시오. 대량 요청, 스크립트 및 파서(스크레이퍼)는 허용되지 않습니다.",
            ],
          },
          {
            heading: "채널 내 링크 게시",
            body: [
              "봇을 통해 동영상을 다운로드함으로써 귀하는 원본 게시물의 링크가 당사 Telegram 채널에 게시되는 것에 동의합니다. 이에 관한 안내는 화질을 선택하기 전, 즉 다운로드 여부를 결정하기 전에 봇에 표시됩니다.",
              "게시는 익명으로 이루어집니다. 채널에는 공개적으로 접근 가능한 페이지의 링크, 동영상 제목 및 표지 이미지(플랫폼이 게시물 미리보기에 표시하는 것과 동일한 장면)가 게시됩니다. 누가 동영상을 다운로드했는지는 표시되지 않습니다. 동영상 파일 자체는 어디에도, 어떠한 경우에도 게시되지 않습니다. 공유되는 것은 링크이며, 플랫폼 스스로도 모든 게시물 아래의 「공유」 버튼을 통해 링크 공유를 권장하고 있습니다.",
              "동일한 링크는 한 번만 게시됩니다. 링크가 채널에 게시되기를 원하지 않으시면 해당 동영상을 당사 서비스를 통해 다운로드하지 마십시오.",
              "그룹에서 보낸 링크와 연결된 계정을 통해 다운로드한 게시물은 채널에 게시되지 않습니다."
            ],
          },
          {
            heading: "본인 계정의 연결",
            body: [
              "플랫폼의 본인 계정을 봇에 연결함으로써 귀하는 해당 계정이 귀하의 계정이며 이를 이와 같이 이용할 권한이 있음을 확인합니다.",
              "플랫폼은 자동 다운로드를 승인하지 않으며, 연결된 계정을 제한하거나 차단할 수 있습니다. 귀하는 이러한 위험을 스스로 부담합니다. 당사는 주 계정이 아닌 별도의 계정을 연결할 것을 권장합니다. 당사는 플랫폼이 귀하의 계정에 가하는 제한에 대하여 책임을 지지 않습니다.",
              "그룹에 연결된 계정은 해당 그룹의 모든 구성원의 다운로드에 사용됩니다. 그룹 관리자는 누가 계정을 연결할 수 있는지 결정하며, 연결된 계정 중 어느 것이든 삭제할 수 있습니다.",
            ],
          },
          {
            heading: "책임의 제한",
            body: [
              "서비스는 「있는 그대로」 제공됩니다. 당사는 중단 없는 운영, 특정 플랫폼의 이용 가능성 또는 파일이 귀하의 목적에 적합함을 보증하지 않습니다.",
              "당사는 귀하가 다운로드한 자료를 어떻게 이용하였는지, 그리고 귀하가 제3자의 권리를 침해함으로써 발생한 결과에 대하여 책임을 지지 않습니다.",
              "당사는 서비스의 기능 구성을 변경하고, 유지보수를 위하여 서비스를 일시 중단하며, 서비스 제공을 종료할 수 있습니다.",
            ],
          },
          {
            heading: "이용 제한",
            body: [
              "당사는 본 약관을 위반한 경우, 제한을 우회하려고 시도한 경우 또는 권리자로부터 정당한 근거가 있는 신고가 접수된 경우 서비스 이용을 제한하거나 종료할 수 있습니다.",
            ],
          },
          {
            heading: "약관의 변경 및 준거법",
            body: [
              "당사는 본 약관을 변경할 수 있으며, 현행 버전의 날짜는 페이지 상단에 표시됩니다. 변경 후에도 서비스를 계속 이용하는 경우 귀하는 새로운 버전을 수락한 것으로 봅니다.",
              "당사자 간의 관계에는 카자흐스탄 공화국 법률이 적용됩니다. 당사자는 분쟁을 서신 교환을 통해 해결하도록 노력하며, 합의에 이르지 못한 경우 카자흐스탄 공화국 법령이 정하는 절차에 따라 해결합니다.",
            ],
          },
        ],
      },
      cookies: {
        title: "쿠키 정책",
        summary: `${operator.site}이(가) 사용하는 쿠키, 그 목적 및 거부 방법을 안내합니다.`,
        sections: [
          {
            heading: "쿠키란 무엇인가",
            body: [
              "쿠키는 웹사이트가 귀하의 브라우저에 저장하는 작은 텍스트 파일입니다. 쿠키를 통해 귀하의 설정을 기억하고 비식별화된 방문 통계를 수집할 수 있습니다.",
              "본 문서에서는 쿠키와 함께 이와 유사한 기술인 브라우저 로컬 스토리지와 추적 픽셀에 대해서도 설명합니다.",
            ],
          },
          {
            heading: "필수 쿠키",
            body: [
              "이 쿠키가 없으면 서비스가 작동하지 않으므로 항상 설정됩니다.",
            ],
            bullets: [
              "Cloudflare Turnstile — 링크를 보내는 주체가 스크립트가 아닌 사람인지 확인합니다.",
              "인터페이스 설정 — 선택한 언어 및 테마.",
            ],
          },
          {
            heading: "분석 쿠키",
            body: [
              "이 쿠키는 어떤 페이지가 이용되고 어디에서 오류가 발생하는지 파악하는 데 도움이 됩니다. 귀하의 동의를 받아 설정되며, 서비스 작동에 필수적이지 않습니다.",
            ],
            bullets: [
              "Google Analytics 및 Google Tag Manager — 비식별화된 형태의 방문 현황 및 사이트 내 행동.",
              "Yandex Metrica — 방문 현황, 클릭 맵 및 Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica의 Webvisor는 페이지 내 행동(포인터 이동, 스크롤, 클릭 및 링크 입력란에 대한 입력)을 기록합니다. 이는 인터페이스의 어느 부분이 혼란을 주는지 파악하기 위한 것입니다.",
              "당사는 이 기록을 특정 개인을 추적하는 데 사용하지 않습니다. 저장되기를 원하지 않는 정보는 사이트의 입력란에 입력하지 마십시오.",
            ],
          },
          {
            heading: "거부 방법",
            bullets: [
              "브라우저 설정에서 쿠키를 차단하거나 삭제하십시오. 이 방법은 위에 열거된 모든 시스템에 적용됩니다.",
              "Google Analytics: 수집을 비활성화하는 공식 브라우저 부가 기능을 Google 웹사이트에서 이용할 수 있습니다.",
              "Yandex Metrica: Yandex의 공식 부가 기능을 통해 거부할 수 있습니다.",
              "필수 쿠키를 비활성화하면 다운로드를 할 수 없게 됩니다.",
            ],
          },
          {
            heading: "보관 기간",
            body: [
              "세션 쿠키는 브라우저를 닫거나 세션이 만료되면 삭제됩니다. 분석 도구는 각 제공업체가 정한 기간 동안 식별자를 보관합니다.",
            ],
          },
        ],
      },
      copyright: {
        title: "권리자 안내",
        summary: "저작권에 관한 서비스의 입장과 권리 침해 신고 절차를 안내합니다.",
        sections: [
          {
            heading: "서비스의 입장",
            body: [
              "본 서비스는 동영상을 게시하지 않으며 동영상 카탈로그를 운영하지 않습니다. 본 서비스는 기술적 중개자로서, 이용자가 입력한 링크에 따라 공개적으로 접근 가능한 페이지에 접속하여 해당 이용자에게 파일을 전달합니다.",
              "다운로드된 파일은 서버에 약 1시간 동안 보관된 후 자동으로 삭제됩니다. 당사에는 타인의 콘텐츠에 대한 영구적인 사본이 남지 않습니다.",
              "다운로드한 자료의 이용에 대한 책임은 이용자에게 있으며, 이는 이용약관에 명시적으로 규정되어 있습니다.",
            ],
          },
          {
            heading: "귀하의 권리가 침해된 경우",
            body: [
              `귀하가 권리자 또는 그 대리인으로서 서비스가 귀하의 권리를 침해하는 데 이용되고 있다고 판단하시는 경우 ${MAIL}로 연락해 주십시오. 당사는 이러한 신고를 검토하고 필요한 조치를 취합니다.`,
            ],
          },
          {
            heading: "신고 시 기재 사항",
            bullets: [
              "침해 대상 저작물 및 귀하가 해당 저작물에 대한 권리를 보유하는 근거.",
              "해당 자료의 링크 및 알고 있는 경우 침해 경위.",
              "귀하의 연락처: 성명 또는 명칭, 주소 및 이메일 주소.",
              "권리자를 대리하는 경우 그 권한을 증명하는 자료.",
              "신고 내용이 사실이며 해당 자료의 이용이 권리자 또는 법령에 의해 허락되지 않았다는 진술.",
            ],
          },
          {
            heading: "당사의 조치",
            body: [
              "당사는 합리적인 기간 내에, 원칙적으로 30일(역일) 이내에 신고를 검토하며, 침해가 확인된 경우 서비스를 통한 해당 자료에 대한 접근을 제한하고, 필요한 경우 침해자의 서비스 이용을 제한합니다.",
              "검토 결과는 귀하가 기재한 이메일 주소로 알려 드립니다.",
            ],
          },
          {
            heading: "부당한 신고",
            body: [
              "고의로 허위 정보를 기재한 신고는 관련 법령에 따라 신고인의 책임을 발생시킬 수 있습니다. 권리자나 분쟁 대상 자료를 특정할 수 없는 신고에 대해서는 당사가 검토를 거부할 수 있습니다.",
            ],
          },
        ],
      },
    },
  },

  th: {
    ui: {
      updated: "ปรับปรุงล่าสุดเมื่อ",
      back: "กลับสู่หน้าหลัก",
      operatorHeading: "ผู้ให้บริการ",
      navHeading: "เอกสารอื่น ๆ",
      labels: {
        privacy: "นโยบายความเป็นส่วนตัว",
        terms: "ข้อกำหนดการใช้งาน",
        cookies: "นโยบายคุกกี้",
        copyright: "สำหรับเจ้าของสิทธิ์",
      },
    },
    docs: {
      privacy: {
        title: "นโยบายความเป็นส่วนตัว",
        summary: `ข้อมูลที่ ${operator.site} เก็บรวบรวม เหตุผลที่จำเป็นต้องใช้ ระยะเวลาการเก็บรักษา และวิธีการขอให้ลบข้อมูล`,
        sections: [
          {
            heading: "บททั่วไป",
            body: [
              `นโยบายฉบับนี้อธิบายว่าบริการ ${operator.site} ประมวลผลข้อมูลส่วนบุคคลใดบ้างและเพื่อวัตถุประสงค์ใด ผู้ควบคุมข้อมูลส่วนบุคคลคือ ${operator.nameTh}`,
              "การใช้บริการถือว่าท่านยินยอมต่อการประมวลผลข้อมูลตามที่ระบุไว้ในนโยบายฉบับนี้ หากท่านไม่ยินยอม โปรดงดใช้บริการ",
              "การประมวลผลข้อมูลดำเนินการตามกฎหมายของสาธารณรัฐคาซัคสถาน \"ว่าด้วยข้อมูลส่วนบุคคลและการคุ้มครองข้อมูลส่วนบุคคล\" และสำหรับผู้เข้าชมจากเขตเศรษฐกิจยุโรป จะคำนึงถึงข้อกำหนดของ GDPR ด้วย",
            ],
          },
          {
            heading: "ข้อมูลที่เราประมวลผล",
            body: [
              "เราจงใจไม่เก็บรวบรวมข้อมูลใดเกินกว่าที่จำเป็นต่อการให้บริการ และไม่ขอเอกสารแสดงตน ข้อมูลการชำระเงิน หรือที่อยู่",
            ],
            bullets: [
              "ข้อมูลบัญชี Telegram ที่บอตได้รับเมื่อท่านส่งข้อความถึงบอต ได้แก่ ตัวระบุที่เป็นตัวเลข ชื่อผู้ใช้ ชื่อ และรหัสภาษา",
              "ลิงก์ที่ท่านส่งเพื่อดาวน์โหลดและข้อมูลเกี่ยวกับความพยายามดาวน์โหลดนั้น ได้แก่ แพลตฟอร์ม วันและเวลา คุณภาพที่เลือก และผลลัพธ์ (สำเร็จหรือเกิดข้อผิดพลาด)",
              "ข้อมูลทางเทคนิคของการเชื่อมต่อ ได้แก่ หมายเลข IP ประเภทและเวอร์ชันของเบราว์เซอร์ ภาษา และหน้าที่อ้างอิงมา ข้อมูลเหล่านี้จะถูกบันทึกไว้ในล็อกของเซิร์ฟเวอร์และในระบบวิเคราะห์เว็บไซต์",
              "คุกกี้และตัวระบุสำหรับการวิเคราะห์ — รายละเอียดเพิ่มเติมดูได้ในนโยบายคุกกี้",
            ],
          },
          {
            heading: "วัตถุประสงค์ของการใช้ข้อมูล",
            bullets: [
              "เพื่อให้บริการ ได้แก่ การดึงวิดีโอตามลิงก์ของท่านและส่งไฟล์ให้แก่ท่าน",
              "เพื่อแยกแยะบัญชีของท่านออกจากบัญชีของผู้อื่นและป้องกันการใช้บริการในทางที่ผิด",
              "เพื่อปกป้องบริการจากการใช้งานในทางที่ผิดโดยระบบอัตโนมัติ ผ่านการตรวจสอบ Cloudflare Turnstile ก่อนส่งลิงก์",
              "เพื่อทำความเข้าใจวิธีการใช้งานเว็บไซต์และแก้ไขข้อผิดพลาด โดยใช้สถิติที่ไม่ระบุตัวตนและเป็นข้อมูลรวม",
              "เพื่อตอบคำร้องของท่านและของเจ้าของสิทธิ์",
              "เพื่อส่งข้อความถึงท่านทาง Telegram เป็นครั้งคราวเพื่อสอบถามความคิดเห็นเกี่ยวกับบริการ เช่น ในกรณีที่ท่านหยุดใช้บริการ การตอบกลับเป็นไปโดยสมัครใจ หากท่านไม่ประสงค์จะรับข้อความดังกล่าว เพียงแจ้งให้เราทราบ แล้วเราจะไม่ติดต่อไปอีก",
            ],
          },
          {
            heading: "ฐานทางกฎหมายในการประมวลผล",
            body: [
              "ข้อมูลบัญชี Telegram และข้อมูลการดาวน์โหลดได้รับการประมวลผลเพื่อการปฏิบัติตามข้อกำหนดการใช้งาน ซึ่งท่านยอมรับเมื่อเริ่มใช้บริการ",
              "คุกกี้สำหรับการวิเคราะห์และการบันทึกการกระทำบนเว็บไซต์ได้รับการประมวลผลโดยอาศัยความยินยอมของท่าน ซึ่งท่านสามารถถอนได้ทุกเมื่อ — วิธีการถอนความยินยอมระบุไว้ในนโยบายคุกกี้",
              "ล็อกของเซิร์ฟเวอร์และการป้องกันบอตได้รับการประมวลผลโดยอาศัยประโยชน์โดยชอบด้วยกฎหมายของเราในการรักษาให้บริการทำงานได้และมีความปลอดภัย",
              "การสอบถามความคิดเห็นของท่านเกี่ยวกับบริการอาศัยประโยชน์โดยชอบด้วยกฎหมายของเราในการปรับปรุงบริการ ท่านสามารถปฏิเสธได้ทุกเมื่อ",
            ],
          },
          {
            heading: "บัญชีที่เชื่อมต่อ",
            body: [
              "หากท่านประสงค์ ท่านสามารถเชื่อมต่อบัญชีของท่านบนแพลตฟอร์ม (Instagram, Facebook, YouTube, X, VK, TikTok) เข้ากับบอต เพื่อให้บอตดาวน์โหลดโพสต์ที่มองเห็นได้เฉพาะผู้ที่เข้าสู่ระบบแล้ว เช่น สตอรี่ และโพสต์ส่วนตัว เพื่อการนี้ บอตจะได้รับคุกกี้ของบัญชีดังกล่าวจากส่วนขยาย Videoner ผ่านรหัสแบบใช้ครั้งเดียว หรือจากไฟล์ที่ท่านส่งมา",
              "เราเก็บรักษาเฉพาะคุกกี้ของแพลตฟอร์มที่ท่านเลือก และทิ้งคุกกี้อื่นทั้งหมดทันที คุกกี้ดังกล่าวจัดเก็บในรูปแบบที่เข้ารหัส และใช้เฉพาะสำหรับการดาวน์โหลดในที่ที่ท่านเชื่อมต่อไว้เท่านั้น คุกกี้ที่เชื่อมต่อในแชตส่วนตัวใช้สำหรับการดาวน์โหลดของท่าน รวมถึงลิงก์ของท่านเองในกลุ่มที่ไม่ได้เชื่อมต่อบัญชีของกลุ่มไว้ และจะไม่ถูกใช้กับลิงก์ของผู้อื่น คุกกี้ที่เชื่อมต่อกับกลุ่มใช้สำหรับการดาวน์โหลดของสมาชิกในกลุ่มนั้นเท่านั้นและไม่ใช้ในที่อื่นใด",
              "ฐานทางกฎหมายคือความยินยอมของท่าน: ท่านเป็นผู้เชื่อมต่อบัญชีด้วยตนเองและสามารถลบบัญชีออกได้ทุกเมื่อด้วยคำสั่ง /accounts เมื่อลบแล้ว คุกกี้จะถูกลบอย่างถาวรโดยไม่สามารถกู้คืนได้ หากแพลตฟอร์มไม่ยอมรับการเข้าสู่ระบบอีกต่อไป บอตจะแจ้งให้ท่านทราบ",
              "โพสต์ที่ดาวน์โหลดผ่านบัญชีที่เชื่อมต่อจะไม่ถูกเผยแพร่ในช่องของเรา และจะไม่ถูกส่งให้ผู้ใช้รายอื่นจากแคชส่วนกลาง",
            ],
          },
          {
            heading: "บริการของบุคคลภายนอก",
            body: [
              "เราไม่ขายและไม่ส่งต่อข้อมูลของท่านให้แก่บุคคลภายนอกเพื่อวัตถุประสงค์ของบุคคลภายนอกนั้นเอง การให้บริการอาศัยผู้ให้บริการดังต่อไปนี้ ซึ่งแต่ละรายประมวลผลข้อมูลตามกฎเกณฑ์ของตนเอง:",
            ],
            bullets: [
              `Telegram — การทำงานของบอต ${BOT}`,
              "Cloudflare — การป้องกันบอต (Turnstile) การส่งมอบเว็บไซต์ และการกำหนดเส้นทางอีเมล",
              "Google Analytics และ Google Tag Manager — สถิติการเข้าชม",
              "Yandex Metrica — สถิติการเข้าชม แผนที่การคลิก และ Webvisor ทั้งนี้ Webvisor บันทึกการกระทำบนหน้าเว็บ ได้แก่ การเคลื่อนที่ของตัวชี้ การเลื่อนหน้า และการคลิก บันทึกดังกล่าวใช้เพื่อวิเคราะห์ความสะดวกในการใช้งานเว็บไซต์เท่านั้น",
            ],
          },
          {
            heading: "ระยะเวลาการเก็บรักษาข้อมูล",
            bullets: [
              "ไฟล์ที่ดาวน์โหลดจะถูกลบออกจากเซิร์ฟเวอร์โดยอัตโนมัติภายในประมาณหนึ่งชั่วโมงหลังจากสร้างขึ้น เราไม่เก็บคลังวิดีโอของท่าน",
              "บันทึกความพยายามดาวน์โหลดจะเก็บรักษาไว้ตราบเท่าที่จำเป็นต่อการป้องกันการใช้บริการในทางที่ผิดและการพิจารณาคำร้อง",
              "ข้อมูลบัญชีจะเก็บรักษาไว้ตราบเท่าที่ท่านใช้บริการ และจะถูกลบเมื่อท่านร้องขอ",
              "ล็อกของเซิร์ฟเวอร์จะเก็บรักษาไว้เป็นระยะเวลาจำกัดและจะถูกเขียนทับตามรอบการหมุนเวียน",
            ],
          },
          {
            heading: "สถานที่ประมวลผลข้อมูล",
            body: [
              "เซิร์ฟเวอร์ของบริการตั้งอยู่ในศูนย์ข้อมูลภายในสหภาพยุโรป ผู้ให้บริการบางรายที่ระบุไว้ข้างต้นอาจประมวลผลข้อมูลนอกสหภาพยุโรปตามนโยบายของตนเอง",
            ],
          },
          {
            heading: "สิทธิของท่าน",
            body: [
              `ท่านมีสิทธิขอรับข้อมูลเกี่ยวกับการประมวลผลข้อมูลของท่าน ขอให้แก้ไขหรือลบข้อมูล ถอนความยินยอม และคัดค้านการประมวลผล โดยส่งอีเมลถึง ${MAIL} จากอีเมลหรือบัญชี Telegram ที่เกี่ยวข้องกับคำร้อง`,
              "เราจะตอบกลับภายในระยะเวลาอันสมควร โดยปกติภายในสามสิบวันตามปฏิทิน การลบบัญชีจะส่งผลให้ประวัติการดาวน์โหลดที่เกี่ยวข้องกับบัญชีนั้นถูกลบด้วย",
            ],
          },
          {
            heading: "ผู้เยาว์",
            body: [
              "บริการนี้ไม่ได้มีไว้สำหรับและไม่ได้มุ่งเป้าไปยังเด็กที่มีอายุต่ำกว่า 16 ปี เราไม่จงใจเก็บรวบรวมข้อมูลของผู้ใช้ดังกล่าว หากเกิดขึ้นโดยความผิดพลาด โปรดแจ้งให้เราทราบ แล้วข้อมูลจะถูกลบ",
            ],
          },
          {
            heading: "การเปลี่ยนแปลง",
            body: [
              "เราอาจปรับปรุงนโยบายฉบับนี้ วันที่ของฉบับปัจจุบันระบุไว้ที่ด้านบนของหน้า และเราจะแจ้งการเปลี่ยนแปลงที่มีนัยสำคัญไว้ในบริการ",
            ],
          },
        ],
      },
      terms: {
        title: "ข้อกำหนดการใช้งาน",
        summary: `กฎการใช้งาน ${operator.site}: สิ่งที่ทำได้ สิ่งที่ห้ามทำ และเงื่อนไขในการให้บริการ`,
        sections: [
          {
            heading: "บททั่วไป",
            body: [
              `ข้อกำหนดฉบับนี้ใช้บังคับกับการใช้งานเว็บไซต์ ${operator.site} และบอต Telegram ${BOT} เจ้าของและผู้ดูแลบริการคือ ${operator.nameTh}`,
              "การเริ่มใช้บริการถือว่าท่านยืนยันว่าได้อ่านและยอมรับข้อกำหนดฉบับนี้แล้ว หากเงื่อนไขข้อใดไม่เหมาะสมกับท่าน ท่านไม่ควรใช้บริการ",
            ],
          },
          {
            heading: "บริการไม่มีค่าใช้จ่าย",
            body: [
              "ความสามารถทั้งหมดของบริการให้บริการโดยไม่มีค่าใช้จ่าย เราไม่มีการสมัครสมาชิกแบบรายเดือน แผนบริการแบบชำระเงิน คุณภาพวิดีโอแบบชำระเงิน หรือการซื้อภายในบริการ",
              "เราไม่แสดงโฆษณาและไม่วางลิงก์พันธมิตร (affiliate)",
            ],
          },
          {
            heading: "เงื่อนไขการเข้าถึง",
            bullets: [
              "การดาวน์โหลดบนเว็บไซต์ไม่จำเป็นต้องมีบัญชีหรือเข้าสู่ระบบ บอตแยกแยะผู้ใช้จากบัญชี Telegram ของผู้ใช้",
              "ข้อจำกัดทางเทคนิคเกี่ยวกับความถี่ของคำขอช่วยปกป้องบริการจากการทำงานเกินกำลังและการใช้งานในทางที่ผิดโดยระบบอัตโนมัติ",
              "การดาวน์โหลดจาก YouTube มีขีดจำกัดปริมาณข้อมูลรายวัน: 10 GB ต่อ 24 ชั่วโมงต่อหนึ่งเครือข่ายบนเว็บไซต์และในส่วนขยาย และ 25 GB ต่อ 24 ชั่วโมงต่อหนึ่งบัญชี Telegram ในบอต ขีดจำกัดนี้ไม่มีผลกับแพลตฟอร์มอื่น",
              "การดาวน์โหลดผ่านบอตไม่จำเป็นต้องติดตามช่องของเรา บอตจะเพิ่มลิงก์ไปยังช่องข่าวของโครงการไว้ในคำบรรยายไฟล์ การติดตามช่องดังกล่าวเป็นไปโดยสมัครใจ",
            ],
          },
          {
            heading: "สิ่งที่บริการทำ",
            body: [
              "บริการทำหน้าที่เป็นตัวกลางทางเทคนิค: เมื่อได้รับลิงก์จากท่าน บริการจะเข้าถึงหน้าที่เปิดเผยต่อสาธารณะ ดึงไฟล์สื่อ และส่งต่อไฟล์นั้นให้แก่ท่าน",
              "เราไม่จัดเก็บแคตตาล็อกวิดีโอ ไม่ให้บริการค้นหาเนื้อหาของผู้อื่น และไม่เก็บไฟล์ที่ดาวน์โหลดไว้นานเกินกว่าเวลาที่จำเป็นต่อการส่งมอบ ซึ่งประมาณหนึ่งชั่วโมง",
              "การใช้งานได้ของแพลตฟอร์มใดแพลตฟอร์มหนึ่งขึ้นอยู่กับการตัดสินใจทางเทคนิคของแพลตฟอร์มนั้น และอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า",
            ],
          },
          {
            heading: "หน้าที่ของผู้ใช้",
            body: [
              "ท่านเป็นผู้รับผิดชอบแต่เพียงผู้เดียวต่อวิธีการใช้ไฟล์ที่ได้รับ และท่านยืนยันว่าท่านมีสิทธิกระทำเช่นนั้น",
            ],
            bullets: [
              "ดาวน์โหลดเฉพาะเนื้อหาที่ท่านเป็นเจ้าของสิทธิ์ หรือเนื้อหาที่เจ้าของสิทธิ์หรือกฎหมายอนุญาตให้ใช้ได้",
              "ห้ามใช้บริการเพื่อละเมิดลิขสิทธิ์และสิทธิข้างเคียง เผยแพร่เนื้อหาต้องห้าม หรือละเมิดสิทธิของบุคคลภายนอก",
              "ห้ามพยายามหลีกเลี่ยงข้อจำกัดทางเทคนิคของบริการ รวมถึงข้อจำกัดความถี่ของคำขอและการตรวจสอบบอต",
              "ห้ามสร้างภาระงานโดยระบบอัตโนมัติ ไม่อนุญาตให้ส่งคำขอจำนวนมาก ใช้สคริปต์ หรือโปรแกรมดึงข้อมูล (scraper)",
            ],
          },
          {
            heading: "การเผยแพร่ลิงก์ในช่อง",
            body: [
              "การดาวน์โหลดวิดีโอผ่านบอตถือว่าท่านยินยอมให้ลิงก์ไปยังโพสต์ต้นฉบับถูกเผยแพร่ในช่อง Telegram ของเรา บอตจะแสดงคำเตือนเรื่องนี้ก่อนที่ท่านจะเลือกคุณภาพ กล่าวคือ ก่อนที่ท่านจะตัดสินใจดาวน์โหลด",
              "การเผยแพร่เป็นแบบไม่ระบุตัวตน: ช่องจะได้รับลิงก์ไปยังหน้าที่เปิดเผยต่อสาธารณะ ชื่อวิดีโอ และภาพปก ซึ่งเป็นภาพเดียวกับที่แพลตฟอร์มแสดงในตัวอย่างของโพสต์ โดยไม่ระบุว่าผู้ใดเป็นผู้ดาวน์โหลด ตัวไฟล์วิดีโอจะไม่ถูกเผยแพร่ในที่ใดและไม่ว่าเวลาใด สิ่งที่ถูกเผยแพร่คือลิงก์ ซึ่งแพลตฟอร์มเองก็เชิญชวนให้เผยแพร่ผ่านปุ่ม \"แชร์\" ใต้ทุกโพสต์",
              "ลิงก์เดียวกันจะถูกเผยแพร่ไม่เกินหนึ่งครั้ง หากท่านไม่ประสงค์ให้ลิงก์ปรากฏในช่อง โปรดอย่าดาวน์โหลดวิดีโอนั้นผ่านบริการของเรา",
              "ลิงก์จากกลุ่มและโพสต์ที่ดาวน์โหลดผ่านบัญชีที่เชื่อมต่อจะไม่ถูกเผยแพร่ในช่อง",
            ],
          },
          {
            heading: "การเชื่อมต่อบัญชีของท่าน",
            body: [
              "การเชื่อมต่อบัญชีของท่านบนแพลตฟอร์มเข้ากับบอตถือว่าท่านยืนยันว่าบัญชีดังกล่าวเป็นของท่านและท่านมีสิทธิจัดการบัญชีนั้น",
              "แพลตฟอร์มต่าง ๆ ไม่สนับสนุนการดาวน์โหลดโดยอัตโนมัติ และอาจจำกัดหรือระงับบัญชีที่เชื่อมต่อ ท่านยอมรับความเสี่ยงนี้เอง เราแนะนำให้เชื่อมต่อบัญชีสำรองแทนบัญชีหลัก เราไม่รับผิดชอบต่อข้อจำกัดที่แพลตฟอร์มกำหนดต่อบัญชีของท่าน",
              "บัญชีที่เชื่อมต่อกับกลุ่มจะถูกใช้สำหรับการดาวน์โหลดของสมาชิกทุกคนในกลุ่ม ผู้ดูแลกลุ่มเป็นผู้กำหนดว่าผู้ใดสามารถเชื่อมต่อบัญชีได้ และสามารถลบบัญชีใดก็ได้",
            ],
          },
          {
            heading: "การจำกัดความรับผิด",
            body: [
              "บริการนี้ให้บริการ \"ตามสภาพที่เป็นอยู่\" เราไม่รับประกันว่าบริการจะทำงานได้อย่างต่อเนื่องไม่หยุดชะงัก ว่าแพลตฟอร์มใดแพลตฟอร์มหนึ่งจะใช้งานได้ หรือว่าไฟล์จะเหมาะสมกับวัตถุประสงค์ของท่าน",
              "เราไม่รับผิดต่อวิธีที่ท่านใช้เนื้อหาที่ดาวน์โหลด และต่อผลที่เกิดจากการที่ท่านละเมิดสิทธิของบุคคลภายนอก",
              "เราสงวนสิทธิในการเปลี่ยนแปลงความสามารถของบริการ ระงับการให้บริการชั่วคราวเพื่อการบำรุงรักษา และยุติการให้บริการ",
            ],
          },
          {
            heading: "การจำกัดการเข้าถึง",
            body: [
              "เราอาจจำกัดหรือยุติการเข้าถึงบริการในกรณีที่มีการละเมิดข้อกำหนดฉบับนี้ มีความพยายามหลีกเลี่ยงข้อจำกัด หรือได้รับคำร้องเรียนที่มีมูลจากเจ้าของสิทธิ์",
            ],
          },
          {
            heading: "การเปลี่ยนแปลงและกฎหมายที่ใช้บังคับ",
            body: [
              "เราอาจแก้ไขข้อกำหนดฉบับนี้ วันที่ของฉบับที่มีผลใช้บังคับระบุไว้ที่ด้านบนของหน้า การใช้บริการต่อไปหลังการเปลี่ยนแปลงถือว่าท่านยอมรับฉบับใหม่",
              "ความสัมพันธ์ระหว่างคู่สัญญาอยู่ภายใต้บังคับของกฎหมายแห่งสาธารณรัฐคาซัคสถาน คู่สัญญาจะพยายามระงับข้อพิพาทโดยการติดต่อทางหนังสือ และหากไม่อาจตกลงกันได้ ให้ดำเนินการตามวิธีการที่กฎหมายของสาธารณรัฐคาซัคสถานกำหนด",
            ],
          },
        ],
      },
      cookies: {
        title: "นโยบายคุกกี้",
        summary: `คุกกี้ที่ ${operator.site} ใช้ วัตถุประสงค์ของคุกกี้ และวิธีการปฏิเสธคุกกี้`,
        sections: [
          {
            heading: "คุกกี้คืออะไร",
            body: [
              "คุกกี้คือไฟล์ข้อความขนาดเล็กที่เว็บไซต์จัดเก็บไว้ในเบราว์เซอร์ของท่าน คุกกี้ช่วยให้จดจำการตั้งค่าของท่านและเก็บรวบรวมสถิติการเข้าชมแบบไม่ระบุตัวตนได้",
              "นอกจากคุกกี้แล้ว เอกสารฉบับนี้ยังครอบคลุมถึงเทคโนโลยีที่คล้ายคลึงกัน ได้แก่ พื้นที่จัดเก็บข้อมูลภายในของเบราว์เซอร์ (local storage) และพิกเซลติดตาม",
            ],
          },
          {
            heading: "คุกกี้ที่จำเป็น",
            body: [
              "บริการไม่สามารถทำงานได้หากไม่มีคุกกี้เหล่านี้ จึงมีการตั้งค่าคุกกี้ประเภทนี้ไว้เสมอ",
            ],
            bullets: [
              "Cloudflare Turnstile — ตรวจสอบว่าผู้ส่งลิงก์เป็นมนุษย์ ไม่ใช่สคริปต์",
              "การตั้งค่าอินเทอร์เฟซ — ภาษาและธีมที่ท่านเลือก",
            ],
          },
          {
            heading: "คุกกี้เพื่อการวิเคราะห์",
            body: [
              "คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าหน้าใดถูกใช้งานและเกิดข้อผิดพลาดที่ใด คุกกี้ประเภทนี้จะตั้งค่าเมื่อได้รับความยินยอมจากท่าน และไม่จำเป็นต่อการทำงานของบริการ",
            ],
            bullets: [
              "Google Analytics และ Google Tag Manager — จำนวนผู้เข้าชมและพฤติกรรมบนเว็บไซต์แบบไม่ระบุตัวตน",
              "Yandex Metrica — จำนวนผู้เข้าชม แผนที่การคลิก และ Webvisor",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor ของ Yandex Metrica บันทึกการกระทำบนหน้าเว็บ ได้แก่ การเคลื่อนที่ของตัวชี้ การเลื่อนหน้า การคลิก และการพิมพ์ในช่องลิงก์ เพื่อให้เราเห็นว่าส่วนใดของอินเทอร์เฟซทำให้ผู้ใช้สับสน",
              "เราไม่ใช้บันทึกเหล่านี้เพื่อติดตามบุคคลใดบุคคลหนึ่งโดยเฉพาะ โปรดอย่ากรอกข้อมูลที่ท่านไม่ประสงค์ให้จัดเก็บลงในช่องต่าง ๆ ของเว็บไซต์",
            ],
          },
          {
            heading: "วิธีการปฏิเสธคุกกี้",
            bullets: [
              "ตั้งค่าการบล็อกหรือการลบคุกกี้ในเบราว์เซอร์ของท่าน — วิธีนี้ใช้ได้กับทุกระบบที่ระบุไว้ข้างต้น",
              "Google Analytics: ส่วนเสริมเบราว์เซอร์อย่างเป็นทางการสำหรับปิดการเก็บข้อมูลมีให้บริการบนเว็บไซต์ของ Google",
              "Yandex Metrica: สามารถปฏิเสธได้ผ่านส่วนเสริมอย่างเป็นทางการของ Yandex",
              "การปิดใช้งานคุกกี้ที่จำเป็นจะทำให้ไม่สามารถดาวน์โหลดได้",
            ],
          },
          {
            heading: "ระยะเวลาการเก็บรักษา",
            body: [
              "คุกกี้เซสชันจะถูกลบเมื่อท่านปิดเบราว์เซอร์หรือเมื่อเซสชันหมดอายุ เครื่องมือวิเคราะห์จะเก็บตัวระบุไว้ตามระยะเวลาที่ผู้ให้บริการของเครื่องมือนั้นกำหนด",
            ],
          },
        ],
      },
      copyright: {
        title: "สำหรับเจ้าของสิทธิ์",
        summary: "จุดยืนของบริการเกี่ยวกับลิขสิทธิ์และขั้นตอนการยื่นคำร้องเรียนการละเมิด",
        sections: [
          {
            heading: "จุดยืนของบริการ",
            body: [
              "บริการไม่ได้จัดเก็บวิดีโอและไม่มีแคตตาล็อกวิดีโอ บริการทำหน้าที่เป็นตัวกลางทางเทคนิค: เมื่อได้รับลิงก์ที่ผู้ใช้ป้อน บริการจะเข้าถึงหน้าที่เปิดเผยต่อสาธารณะและส่งไฟล์ให้แก่ผู้ใช้รายนั้น",
              "ไฟล์ที่ดาวน์โหลดจะอยู่บนเซิร์ฟเวอร์ประมาณหนึ่งชั่วโมงแล้วถูกลบโดยอัตโนมัติ เราไม่มีสำเนาถาวรของเนื้อหาของผู้อื่น",
              "ความรับผิดชอบในการใช้เนื้อหาที่ดาวน์โหลดตกอยู่กับผู้ใช้ ดังที่ระบุไว้อย่างชัดแจ้งในข้อกำหนดการใช้งาน",
            ],
          },
          {
            heading: "หากสิทธิของท่านถูกละเมิด",
            body: [
              `หากท่านเป็นเจ้าของสิทธิ์หรือผู้แทนของเจ้าของสิทธิ์ และเห็นว่าบริการถูกใช้เพื่อละเมิดสิทธิของท่าน โปรดส่งอีเมลถึง ${MAIL} เราจะพิจารณาคำร้องเรียนดังกล่าวและดำเนินมาตรการที่เหมาะสม`,
            ],
          },
          {
            heading: "ข้อมูลที่ต้องระบุในคำร้องเรียน",
            bullets: [
              "งานใดที่ได้รับผลกระทบ และท่านมีสิทธิในงานนั้นโดยอาศัยเหตุใด",
              "ลิงก์ไปยังเนื้อหา และพฤติการณ์ของการละเมิด หากทราบ",
              "ข้อมูลติดต่อของท่าน ได้แก่ ชื่อหรือชื่อนิติบุคคล ที่อยู่ และที่อยู่อีเมล",
              "หากท่านดำเนินการในนามของเจ้าของสิทธิ์ ให้แนบหลักฐานแสดงอำนาจ",
              "คำยืนยันว่าข้อมูลในคำร้องเรียนเป็นความจริง และการใช้เนื้อหาดังกล่าวไม่ได้รับอนุญาตจากเจ้าของสิทธิ์หรือตามกฎหมาย",
            ],
          },
          {
            heading: "สิ่งที่เราจะดำเนินการ",
            body: [
              "เราจะพิจารณาคำร้องเรียนภายในระยะเวลาอันสมควร โดยปกติภายในสามสิบวันตามปฏิทิน และเมื่อยืนยันได้ว่ามีการละเมิด เราจะจำกัดการเข้าถึงเนื้อหาดังกล่าวผ่านบริการ และจำกัดการเข้าถึงบริการของผู้ละเมิดเมื่อจำเป็น",
              "เราจะแจ้งผลการพิจารณาไปยังที่อยู่อีเมลที่ท่านระบุ",
            ],
          },
          {
            heading: "คำร้องเรียนโดยไม่สุจริต",
            body: [
              "คำร้องเรียนที่มีข้อมูลซึ่งผู้ร้องรู้อยู่แล้วว่าเป็นเท็จอาจทำให้ผู้ร้องต้องรับผิดตามกฎหมาย เราอาจปฏิเสธที่จะพิจารณาคำร้องเรียนที่ไม่สามารถระบุตัวเจ้าของสิทธิ์หรือเนื้อหาที่เป็นข้อพิพาทได้",
            ],
          },
        ],
      },
    },
  },
  am: {
    ui: {
      updated: "የተሻሻለበት ቀን",
      back: "ወደ ዋናው ገጽ",
      operatorHeading: "የአገልግሎቱ ኦፕሬተር",
      navHeading: "ሌሎች ሰነዶች",
      labels: {
        privacy: "የግላዊነት ፖሊሲ",
        terms: "የተጠቃሚ ስምምነት",
        cookies: "የኩኪ ፖሊሲ",
        copyright: "ለመብት ባለቤቶች",
      },
    },
    docs: {
      privacy: {
        title: "የግላዊነት ፖሊሲ",
        summary: `${operator.site} ምን ዓይነት መረጃ እንደሚሰበስብ፣ ለምን እንደሚያስፈልገው፣ ለምን ያህል ጊዜ እንደሚያቆየው እና እንዴት ሊሰረዝ እንደሚችል።`,
        sections: [
          {
            heading: "ጠቅላላ ድንጋጌዎች",
            body: [
              `ይህ ፖሊሲ የ${operator.site} አገልግሎት የትኞቹን የግል መረጃዎች (personal data) እንደሚያቀናብር (processing) እና ለምን ዓላማ እንደሆነ ይገልጻል። የግል መረጃ ተቆጣጣሪው (data controller) ${operator.nameAm} ነው።`,
              "አገልግሎቱን በመጠቀም እዚህ በተገለጸው የአቀናበር ሥርዓት ይስማማሉ። በዚህ ሥርዓት ካልተስማሙ እባክዎ አገልግሎቱን አይጠቀሙ።",
              "ማቀናበሩ የሚከናወነው በካዛክስታን ሪፐብሊክ «ስለ ግል መረጃ እና ስለ ጥበቃው» ሕግ መሠረት ሲሆን፣ ከአውሮፓ ኢኮኖሚያዊ ቀጣና (European Economic Area) የሚመጡ ጎብኚዎችን በተመለከተ ደግሞ የGDPR መስፈርቶችም ግምት ውስጥ ይገባሉ።",
            ],
          },
          {
            heading: "የምናቀናብራቸው መረጃዎች",
            body: [
              "ለአገልግሎቱ ሥራ ከሚያስፈልገው በላይ ምንም ነገር ሆን ብለን አንሰበስብም፤ ሰነዶችን፣ የክፍያ መረጃን ወይም አድራሻን አንጠይቅም።",
            ],
            bullets: [
              "ለቦቱ ሲጽፉ ቦቱ የሚቀበላቸው የTelegram አካውንት መረጃዎች፦ የቁጥር መለያ (numeric ID)፣ የተጠቃሚ ስም (username)፣ ስም እና የቋንቋ ኮድ።",
              "ለማውረድ የሚልኳቸው ሊንኮች እና ስለ ሙከራው ራሱ የሚገልጹ መረጃዎች፦ መድረክ (platform)፣ ቀን እና ሰዓት፣ የተመረጠው ጥራት እና ውጤቱ (ስኬት ወይም ስሕተት)።",
              "የግንኙነቱ ቴክኒካዊ መረጃዎች፦ IP አድራሻ፣ የአሳሹ (browser) ዓይነት እና ስሪት፣ ቋንቋ እና የመጡበት ገጽ (referring page)። እነዚህ በሰርቨር መዝገቦች (logs) እና በድረ-ገጽ ትንታኔ (web analytics) ሥርዓቶች ውስጥ ይመዘገባሉ።",
              "ኩኪዎች (cookies) እና የትንታኔ መለያዎች — ዝርዝሩ በኩኪ ፖሊሲው ውስጥ ይገኛል።",
            ],
          },
          {
            heading: "እነዚህ መረጃዎች ለምን ያስፈልጋሉ",
            bullets: [
              "አገልግሎቱን ራሱን ለመስጠት፦ በሊንክዎ ያለውን ቪዲዮ አግኝቶ ፋይሉን ለእርስዎ ለማስረከብ።",
              "የእርስዎን አካውንት ከሌሎች ለመለየት እና አላግባብ መጠቀምን ለመከላከል።",
              "አገልግሎቱን ከአውቶማቲክ አላግባብ አጠቃቀም ለመጠበቅ፦ ሊንክ ከመላኩ በፊት የሚደረግ የCloudflare Turnstile ማረጋገጫ።",
              "ድረ-ገጹ እንዴት ጥቅም ላይ እንደሚውል ለመረዳት እና ስሕተቶችን ለማስተካከል — ማንነትን የማይገልጽ (anonymised) እና የተጠቃለለ ስታቲስቲክስ።",
              "ለእርስዎ እና ለመብት ባለቤቶች ጥያቄዎች ምላሽ ለመስጠት።",
              "ስለ አገልግሎቱ ያለዎትን አስተያየት ለማወቅ አልፎ አልፎ በTelegram ለመጻፍልዎ — ለምሳሌ አገልግሎቱን መጠቀም ካቆሙ። መልስ መስጠት ግዴታ አይደለም፤ እንደዚህ ያሉ መልዕክቶች የማያስፈልጉዎት ከሆነ ይህንኑ ብቻ ይንገሩን፣ ዳግመኛ አንጽፍልዎትም።",
            ],
          },
          {
            heading: "የማቀናበር ሕጋዊ መሠረቶች",
            body: [
              "የTelegram አካውንት መረጃዎች እና ስለ ማውረዶች የሚገልጹ መረጃዎች የሚቀናበሩት አገልግሎቱን መጠቀም ሲጀምሩ የሚቀበሉትን የተጠቃሚ ስምምነት ለመፈጸም ነው።",
              "የትንታኔ ኩኪዎች እና በድረ-ገጹ ላይ የሚደረጉ ድርጊቶች ቀረጻ የሚቀናበሩት በእርስዎ ፈቃድ (consent) መሠረት ሲሆን፣ ይህንን ፈቃድ በማንኛውም ጊዜ መሻር ይችላሉ — መንገዶቹ በኩኪ ፖሊሲው ውስጥ ተገልጸዋል።",
              "የሰርቨር መዝገቦች እና ከቦቶች የሚደረገው ጥበቃ የሚቀናበሩት አገልግሎቱ እንዲሠራ እና ደኅንነቱ እንዲጠበቅ ባለን ሕጋዊ ጥቅም (legitimate interest) ማዕቀፍ ውስጥ ነው።",
              "ስለ አገልግሎቱ ያለዎትን አስተያየት የሚመለከቱ ጥያቄዎች የሚቀርቡት አገልግሎቱን ለማሻሻል ባለን ሕጋዊ ጥቅም ማዕቀፍ ውስጥ ነው፤ በማንኛውም ጊዜ እነሱን ላለመቀበል መምረጥ ይችላሉ።",
            ],
          },
          {
            heading: "የተገናኙ አካውንቶች",
            body: [
              "ከፈለጉ፣ ቦቱ ለገቡ (signed-in) ተጠቃሚዎች ብቻ የሚታዩ ልጥፎችን — ስቶሪዎችን (stories) እና የግል ልጥፎችን — እንዲያወርድ፣ በአንድ መድረክ (Instagram, Facebook, YouTube, X, VK, TikTok) ላይ ያለዎትን አካውንት ከቦቱ ጋር ማገናኘት ይችላሉ። ለዚህም ቦቱ የዚያን አካውንት ኩኪዎች ይቀበላል — ከVideoner ቅጥያ (extension) በአንድ ጊዜ ብቻ በሚያገለግል ኮድ አማካይነት ወይም እርስዎ ከላኩት ፋይል።",
              "የተመረጠውን መድረክ ኩኪዎች ብቻ እናስቀምጣለን፤ የቀሩትን ወዲያውኑ እናስወግዳለን። ኩኪዎቹ ተመስጥረው (encrypted) ይቀመጣሉ፤ ጥቅም ላይ የሚውሉትም እርስዎ ባገናኟቸው ቦታ ለሚደረጉ ማውረዶች ብቻ ነው። በግል ውይይት (private chat) የተገናኙት ለእርስዎ ማውረዶች ያገለግላሉ፤ ይህም የራሳቸው አካውንት ባልተገናኘባቸው ቡድኖች ውስጥ የሚልኳቸውን የራስዎን ሊንኮች ይጨምራል፤ ለሌሎች ሰዎች ሊንኮች ግን ጥቅም ላይ አይውሉም። ከቡድን ጋር የተገናኙት ለቡድኑ አባላት ማውረዶች ብቻ ያገለግላሉ፤ ሌላ ቦታ ጥቅም ላይ አይውሉም።",
              "ሕጋዊ መሠረቱ የእርስዎ ፈቃድ ነው፦ አካውንቱን የሚያገናኙት እርስዎ ራስዎ ሲሆኑ፣ በማንኛውም ጊዜ በ/accounts ትእዛዝ ሊያስወግዱት ይችላሉ። ሲወገዱ ኩኪዎቹ ሊመለሱ በማይችሉበት ሁኔታ ይደመሰሳሉ። መድረኩ መግቢያውን መቀበል ካቆመ ቦቱ ያሳውቅዎታል።",
              "በተገናኘ አካውንት አማካይነት የወረዱ ልጥፎች በቻናላችን ላይ አይታተሙም፤ ከጋራ ማከማቻ (cache) ለሌሎች ተጠቃሚዎችም አይሰጡም።",
            ],
          },
          {
            heading: "የሦስተኛ ወገን አገልግሎቶች",
            body: [
              "የእርስዎን መረጃ አንሸጥም፤ ለሦስተኛ ወገኖች ለራሳቸው ዓላማም አናስተላልፍም። አገልግሎቱ የሚከተሉትን አቅራቢዎች ይጠቀማል፤ እያንዳንዳቸውም መረጃን በራሳቸው ደንብ መሠረት ያቀናብራሉ፦",
            ],
            bullets: [
              `Telegram — የቦቱ ${BOT} አሠራር።`,
              "Cloudflare — ከቦቶች ጥበቃ (Turnstile)፣ የድረ-ገጹ ማድረስ እና የኢሜይል ማስተላለፍ (mail routing)።",
              "Google Analytics እና Google Tag Manager — የጉብኝት ስታቲስቲክስ።",
              "Yandex Metrica — የጉብኝት ስታቲስቲክስ፣ የጠቅታ ካርታ (click map) እና Webvisor። Webvisor በገጹ ላይ የሚደረጉ ድርጊቶችን ይቀርጻል፦ የጠቋሚ (pointer) እንቅስቃሴን፣ ማሸብለልን (scrolling) እና ጠቅታዎችን። ቀረጻዎቹ ጥቅም ላይ የሚውሉት የድረ-ገጹን የአጠቃቀም ምቹነት ለመተንተን ብቻ ነው።",
            ],
          },
          {
            heading: "መረጃን ለምን ያህል ጊዜ እናቆያለን",
            bullets: [
              "የወረዱ ፋይሎች ከተፈጠሩ ከአንድ ሰዓት ገደማ በኋላ ከሰርቨሩ በራስ-ሰር ይሰረዛሉ። የቪዲዮዎችዎን ማኅደር (archive) አናስቀምጥም።",
              "የማውረድ ሙከራዎች መዝገቦች አላግባብ አጠቃቀምን ለመከላከል እና ጥያቄዎችን ለመመርመር እስካስፈለገ ድረስ ይቆያሉ።",
              "የአካውንት መረጃዎች አገልግሎቱን እስከሚጠቀሙበት ጊዜ ድረስ ይቆያሉ፤ በጥያቄዎም ይሰረዛሉ።",
              "የሰርቨር መዝገቦች ለተወሰነ ጊዜ ይቆያሉ፤ በዙር ቅደም ተከተል (rotation) መሠረትም በአዲስ ይተካሉ።",
            ],
          },
          {
            heading: "መረጃው የሚቀናበርበት ቦታ",
            body: [
              "የአገልግሎቱ ሰርቨሮች በአውሮፓ ኅብረት ግዛት ውስጥ በሚገኝ የዳታ ማዕከል (data centre) ውስጥ ይገኛሉ። ከላይ ከተዘረዘሩት አቅራቢዎች መካከል አንዳንዶቹ በራሳቸው ፖሊሲዎች መሠረት መረጃን ከኅብረቱ ክልል ውጭ ሊያቀናብሩ ይችላሉ።",
            ],
          },
          {
            heading: "የእርስዎ መብቶች",
            body: [
              `ስለ መረጃዎ አቀናበር መረጃ የማግኘት፣ መረጃው እንዲታረም ወይም እንዲሰረዝ የመጠየቅ፣ ፈቃድዎን የመሻር እና ማቀናበሩን የመቃወም መብት አለዎት። ለዚህም ከጥያቄው ጋር ከተያያዘው ኢሜይል ወይም የTelegram አካውንት ወደ ${MAIL} ይጻፉ።`,
              "በተመጣጣኝ ጊዜ ውስጥ፣ በአብዛኛው በሠላሳ የቀን መቁጠሪያ ቀናት ውስጥ፣ ምላሽ እንሰጣለን። አካውንቱ ሲሰረዝ ከእሱ ጋር የተያያዘው የማውረድ ታሪክም ይሰረዛል።",
            ],
          },
          {
            heading: "ለአካለ መጠን ያልደረሱ ሰዎች",
            body: [
              "አገልግሎቱ ዕድሜያቸው ከ16 ዓመት በታች ለሆኑ ልጆች የታሰበ አይደለም፤ ለእነሱም ያነጣጠረ አይደለም። የእንደዚህ ያሉ ተጠቃሚዎችን መረጃ እያወቅን አንሰበስብም፤ ይህ በስሕተት ከተከሰተ ይጻፉልን፣ መረጃውም ይሰረዛል።",
            ],
          },
          {
            heading: "ለውጦች",
            body: [
              "ይህንን ፖሊሲ ልናሻሽለው እንችላለን። ሥራ ላይ ያለው እትም ቀን በገጹ መጀመሪያ ላይ ተገልጿል፤ ጉልህ ለውጦችን በአገልግሎቱ ውስጥ እናሳውቃለን።",
            ],
          },
        ],
      },
      terms: {
        title: "የተጠቃሚ ስምምነት",
        summary: `የ${operator.site} አጠቃቀም ደንቦች፦ የተፈቀደው፣ የተከለከለው እና አገልግሎቱ የሚሠራባቸው ሁኔታዎች።`,
        sections: [
          {
            heading: "ጠቅላላ ድንጋጌዎች",
            body: [
              `ይህ ስምምነት የ${operator.site} ድረ-ገጽን እና የTelegram ቦቱን ${BOT} አጠቃቀም ይገዛል። የአገልግሎቱ ባለቤት እና አስተዳዳሪ ${operator.nameAm} ነው።`,
              "አገልግሎቱን መጠቀም በመጀመር ደንቦቹን እንዳነበቡ እና እንደተቀበሏቸው ያረጋግጣሉ። ከሁኔታዎቹ ውስጥ ማንኛውም የማይስማማዎት ከሆነ አገልግሎቱን መጠቀም የለብዎትም።",
            ],
          },
          {
            heading: "አገልግሎቱ ከክፍያ ነፃ ነው",
            body: [
              "ሁሉም የአገልግሎቱ ተግባራት ያለ ክፍያ ይሰጣሉ። የደንበኝነት ምዝገባዎች (subscriptions)፣ የሚከፈልባቸው ታሪፎች፣ የሚከፈልባቸው የቪዲዮ ጥራቶች ወይም በአገልግሎቱ ውስጥ የሚደረጉ ግዢዎች የሉንም።",
              "ማስታወቂያ አናሳይም፤ የአጋርነት (affiliate) ሊንኮችንም አናስቀምጥም።",
            ],
          },
          {
            heading: "የተደራሽነት ሁኔታዎች",
            bullets: [
              "በድረ-ገጹ ላይ ለማውረድ አካውንትም ሆነ መግባት (sign-in) አያስፈልግም። ቦቱ ተጠቃሚዎችን የሚለየው በTelegram አካውንታቸው ነው።",
              "በጥያቄዎች ድግግሞሽ ላይ የተጣሉ ቴክኒካዊ ገደቦች አገልግሎቱን ከመጨናነቅ እና ከአውቶማቲክ አላግባብ አጠቃቀም ይጠብቁታል።",
              "ለYouTube ዕለታዊ የትራፊክ ገደብ ተፈጻሚ ይሆናል፦ በድረ-ገጹ እና በቅጥያው ላይ ለአንድ ኔትወርክ በ24 ሰዓት 10 GB፣ በቦቱ ውስጥ ደግሞ ለአንድ የTelegram አካውንት በ24 ሰዓት 25 GB። ይህ ገደብ ሌሎች መድረኮችን አይመለከትም።",
              "በቦቱ በኩል ለማውረድ ቻናላችንን መቀላቀል (subscribe) አያስፈልግም። ቦቱ በፋይሎቹ መግለጫ (caption) ላይ ወደ ፕሮጀክቱ የዜና ቻናል የሚወስድ ሊንክ ያክላል፤ ቻናሉን መቀላቀል ግዴታ አይደለም።",
            ],
          },
          {
            heading: "አገልግሎቱ ምን ይሠራል",
            body: [
              "አገልግሎቱ ቴክኒካዊ መካከለኛ (technical intermediary) ነው፦ በእርስዎ ሊንክ መሠረት ለሕዝብ ክፍት ወደሆነ ገጽ ይሄዳል፣ የሚዲያ ፋይሉን ያገኛል እና ለእርስዎ ያስተላልፋል።",
              "የቪዲዮ ካታሎግ አናስተናግድም፣ በሌሎች ሰዎች ይዘት ላይ ፍለጋ አናካሂድም፣ የወረዱ ፋይሎችንም ለማስተላለፍ ከሚያስፈልገው ጊዜ — አንድ ሰዓት ገደማ — በላይ አናቆይም።",
              "የአንድ የተወሰነ መድረክ ተደራሽነት በዚያው መድረክ ቴክኒካዊ ውሳኔዎች ላይ የተመሠረተ ሲሆን ያለ ማስጠንቀቂያ ሊለወጥ ይችላል።",
            ],
          },
          {
            heading: "የተጠቃሚው ግዴታዎች",
            body: [
              "ያገኟቸውን ፋይሎች እንዴት እንደሚጠቀሙባቸው ኃላፊነቱ የእርስዎ ብቻ ነው፤ ይህንንም ለማድረግ መብት እንዳለዎት ያረጋግጣሉ።",
            ],
            bullets: [
              "መብቱ የእርስዎ የሆነውን፣ ወይም አጠቃቀሙ በመብት ባለቤቱ ወይም በሕግ የተፈቀደውን ይዘት ብቻ ያውርዱ።",
              "አገልግሎቱን የቅጂ መብትን እና ተዛማጅ መብቶችን ለመጣስ፣ የተከለከለ ይዘትን ለማሰራጨት ወይም የሦስተኛ ወገኖችን መብቶች ለመጣስ አይጠቀሙበት።",
              "የጥያቄ ድግግሞሽ ገደቦችን እና የቦት ማረጋገጫን ጨምሮ የአገልግሎቱን ቴክኒካዊ ገደቦች ለማለፍ አይሞክሩ።",
              "አውቶማቲክ ጫና አይፍጠሩ፦ የጅምላ ጥያቄዎች፣ ስክሪፕቶች እና መረጃ ሰብሳቢ ፕሮግራሞች (scrapers) አይፈቀዱም።",
            ],
          },
          {
            heading: "በቻናሉ ላይ ሊንኮችን ማተም",
            body: [
              "ቪዲዮን በቦቱ በኩል በማውረድ፣ የዋናው ልጥፍ ሊንክ በTelegram ቻናላችን ላይ እንደሚታተም ይስማማሉ። ስለዚህ የሚገልጽ ማስጠንቀቂያ በቦቱ ውስጥ ጥራት ከመምረጥዎ በፊት — ማለትም ለማውረድ ከመወሰንዎ በፊት — ይታያል።",
              "ማተሙ ማንነትን አይገልጽም፦ ወደ ቻናሉ የሚላኩት ለሕዝብ ክፍት የሆነው ገጽ ሊንክ፣ የቪዲዮው ርዕስ እና የሽፋን ምስሉ — መድረኩ ራሱ በልጥፉ ቅድመ-ዕይታ (preview) ላይ የሚያሳየው ያው ፍሬም — ናቸው። ቪዲዮውን ማን እንዳወረደው አይገለጽም። የቪዲዮ ፋይሉ ራሱ በየትኛውም ቦታ በምንም ጊዜ አይታተምም፦ የሚሰራጨው መድረኮቹ ራሳቸው በእያንዳንዱ ልጥፍ ሥር ባለው «አጋራ» (Share) ቁልፍ እንዲሰራጭ የሚጋብዙት ሊንክ ነው።",
              "አንድ ዓይነት ሊንክ ከአንድ ጊዜ በላይ አይታተምም። ሊንኩ ወደ ቻናሉ እንዲደርስ ካልፈለጉ ያንን ቪዲዮ በአገልግሎታችን በኩል አያውርዱ።",
              "ከቡድኖች የመጡ ሊንኮች እና በተገናኘ አካውንት አማካይነት የወረዱ ልጥፎች በቻናሉ ላይ አይታተሙም።",
            ],
          },
          {
            heading: "የራስዎን አካውንት ማገናኘት",
            body: [
              "በአንድ መድረክ ላይ ያለዎትን አካውንት ከቦቱ ጋር በማገናኘት፣ አካውንቱ የእርስዎ መሆኑን እና በእሱ የመጠቀም መብት እንዳለዎት ያረጋግጣሉ።",
              "መድረኮች አውቶማቲክ ማውረድን አይደግፉም፤ የተገናኘውን አካውንት ሊገድቡ ወይም ሊያግዱ ይችላሉ። ይህንን ስጋት በራስዎ ኃላፊነት ይቀበላሉ፤ ዋናውን ሳይሆን የተለየ ሁለተኛ አካውንት እንዲያገናኙ እንመክራለን። መድረኩ በአካውንትዎ ላይ ለሚጥላቸው ገደቦች ኃላፊነት አንወስድም።",
              "ከቡድን ጋር የተገናኘ አካውንት ለሁሉም የቡድኑ አባላት ማውረዶች ጥቅም ላይ ይውላል። አካውንቶችን ማን ማገናኘት እንደሚችል የሚወስኑት የቡድኑ አስተዳዳሪዎች ሲሆኑ፣ ማንኛቸውንም ማስወገድ ይችላሉ።",
            ],
          },
          {
            heading: "የኃላፊነት ገደብ",
            body: [
              "አገልግሎቱ የሚሰጠው «እንዳለ» (as is) በሚለው ሁኔታ ነው። ያልተቋረጠ አሠራርን፣ የአንድ የተወሰነ መድረክ ተደራሽነትን ወይም ፋይሉ ለዓላማዎ ተስማሚ መሆኑን ዋስትና አንሰጥም።",
              "የወረደውን ይዘት እንዴት እንደተጠቀሙበት እና እርስዎ የሦስተኛ ወገኖችን መብቶች በመጣስዎ ለሚመጡ መዘዞች ኃላፊነት አንወስድም።",
              "የአገልግሎቱን ተግባራት የመለወጥ፣ ለጥገና ሥራውን ለጊዜው የማቋረጥ እና ሥራውን የማቆም መብት አለን።",
            ],
          },
          {
            heading: "ተደራሽነትን መገደብ",
            body: [
              "እነዚህ ደንቦች ሲጣሱ፣ ገደቦችን ለማለፍ ሙከራ ሲደረግ፣ እንዲሁም ከመብት ባለቤት በቂ ምክንያት ያለው ቅሬታ ሲደርስ የአገልግሎቱን ተደራሽነት ልንገድብ ወይም ልናቋርጥ እንችላለን።",
            ],
          },
          {
            heading: "ለውጦች እና ተፈጻሚነት ያለው ሕግ",
            body: [
              "ደንቦቹን ልንለውጥ እንችላለን፤ ሥራ ላይ ያለው እትም ቀን በገጹ መጀመሪያ ላይ ተገልጿል። ከለውጦቹ በኋላ አገልግሎቱን መጠቀም በመቀጠል አዲሱን እትም ይቀበላሉ።",
              "በተዋዋይ ወገኖች ግንኙነት ላይ የካዛክስታን ሪፐብሊክ ሕግ ተፈጻሚ ይሆናል። ተዋዋይ ወገኖች አለመግባባቶችን በደብዳቤ ልውውጥ ለመፍታት ይጥራሉ፤ ስምምነት ላይ ካልደረሱ ደግሞ አለመግባባቶቹ በካዛክስታን ሪፐብሊክ ሕግ በተደነገገው ሥርዓት መሠረት ይፈታሉ።",
            ],
          },
        ],
      },
      cookies: {
        title: "የኩኪ ፖሊሲ",
        summary: `${operator.site} የትኞቹን ኩኪዎች እንደሚጠቀም፣ ለምን እንደሚያስፈልጉ እና እንዴት እነሱን አለመቀበል እንደሚቻል።`,
        sections: [
          {
            heading: "ኩኪዎች ምንድን ናቸው",
            body: [
              "ኩኪዎች (cookies) አንድ ድረ-ገጽ በአሳሽዎ ውስጥ የሚያስቀምጣቸው ትናንሽ የጽሑፍ ፋይሎች ናቸው። ቅንብሮችዎን ለማስታወስ እና ማንነትን የማይገልጽ የጉብኝት ስታቲስቲክስ ለመሰብሰብ ያስችላሉ።",
              "በዚህ ሰነድ ውስጥ ከኩኪዎች ጋር ተዛማጅ ቴክኖሎጂዎችንም እንገልጻለን — የአሳሹን የአካባቢ ማከማቻ (local storage) እና የመከታተያ ፒክሰሎችን (tracking pixels)።",
            ],
          },
          {
            heading: "አስፈላጊ ኩኪዎች",
            body: [
              "ያለ እነሱ አገልግሎቱ አይሠራም፤ ስለዚህ ሁልጊዜ ይቀመጣሉ።",
            ],
            bullets: [
              "Cloudflare Turnstile — ሊንኩን የሚልከው ስክሪፕት ሳይሆን ሰው መሆኑን ማረጋገጥ።",
              "የበይነገጽ (interface) ቅንብሮች — የተመረጠው ቋንቋ እና የገጽታ ቀለም (theme)።",
            ],
          },
          {
            heading: "የትንታኔ ኩኪዎች",
            body: [
              "የትኞቹ ገጾች ጥቅም ላይ እንደሚውሉ እና ስሕተቶች የት እንደሚከሰቱ ለመረዳት ይረዱናል። የሚቀመጡት በእርስዎ ፈቃድ ሲሆን ለአገልግሎቱ ሥራ አስፈላጊ አይደሉም።",
            ],
            bullets: [
              "Google Analytics እና Google Tag Manager — የጉብኝት መጠን እና በድረ-ገጹ ላይ ያለ ባህሪ፣ ማንነትን በማይገልጽ መልኩ።",
              "Yandex Metrica — የጉብኝት መጠን፣ የጠቅታ ካርታ እና Webvisor።",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "የYandex Metrica Webvisor በገጹ ላይ የሚደረጉ ድርጊቶችን ይቀርጻል፦ የጠቋሚ እንቅስቃሴን፣ ማሸብለልን፣ ጠቅታዎችን እና በሊንክ መስኩ ውስጥ የሚጻፈውን። ይህ የሚያስፈልገው በይነገጹ ሰዎችን የት እንደሚያደናግር ለማየት ነው።",
              "እነዚህን ቀረጻዎች የተወሰኑ ሰዎችን ለመከታተል አንጠቀምባቸውም። እንዲቀመጥ የማይፈልጉትን መረጃ በድረ-ገጹ መስኮች ውስጥ አያስገቡ።",
            ],
          },
          {
            heading: "ኩኪዎችን እንዴት አለመቀበል እንደሚቻል",
            bullets: [
              "በአሳሽዎ ቅንብሮች ውስጥ ኩኪዎችን ማገድን ወይም መሰረዝን ያዋቅሩ — ይህ ዘዴ ለሁሉም ከላይ ለተዘረዘሩት ሥርዓቶች ይሠራል።",
              "Google Analytics፦ መረጃ መሰብሰብን የሚያሰናክለው ይፋዊ የአሳሽ ተጨማሪ (add-on) በGoogle ድረ-ገጽ ላይ ይገኛል።",
              "Yandex Metrica፦ ከመረጃ መሰብሰቡ መውጣት የሚቻለው በYandex ይፋዊ ተጨማሪ አማካይነት ነው።",
              "አስፈላጊ ኩኪዎችን ማሰናከል ማውረድን የማይቻል ያደርገዋል።",
            ],
          },
          {
            heading: "የማቆያ ጊዜ",
            body: [
              "የክፍለ-ጊዜ ኩኪዎች (session cookies) አሳሹ ሲዘጋ ወይም የክፍለ-ጊዜው ጊዜ ሲያበቃ ይሰረዛሉ። የትንታኔ መሣሪያዎች መለያዎቻቸውን አቅራቢዎቻቸው ለወሰኑት ጊዜ ያቆያሉ።",
            ],
          },
        ],
      },
      copyright: {
        title: "ለመብት ባለቤቶች",
        summary: "የአገልግሎቱ አቋም በቅጂ መብት ጉዳይ እና ስለ ጥሰት ቅሬታ የማቅረቢያ ሥርዓት።",
        sections: [
          {
            heading: "የአገልግሎቱ አቋም",
            body: [
              "አገልግሎቱ ቪዲዮዎችን አያስተናግድም፤ ካታሎጋቸውንም አይዝም። እንደ ቴክኒካዊ መካከለኛ ሆኖ ይሠራል፦ ተጠቃሚው ባስገባው ሊንክ መሠረት ለሕዝብ ክፍት ወደሆነ ገጽ ይሄዳል፣ ፋይሉንም ለተጠቃሚው ያስተላልፋል።",
              "የወረዱ ፋይሎች በሰርቨሩ ላይ ለአንድ ሰዓት ገደማ ይቆያሉ፤ ከዚያም በራስ-ሰር ይሰረዛሉ። የሌሎች ሰዎች ይዘት ቋሚ ቅጂ በእኛ ዘንድ አይቀርም።",
              "የወረደውን ይዘት የመጠቀም ኃላፊነት የተጠቃሚው ነው — ይህም በተጠቃሚ ስምምነቱ ውስጥ በግልጽ ተደንግጓል።",
            ],
          },
          {
            heading: "መብትዎ ከተጣሰ",
            body: [
              `የመብት ባለቤት ወይም የእሱ ተወካይ ከሆኑ እና አገልግሎቱ መብትዎን ለመጣስ ጥቅም ላይ እየዋለ ነው ብለው ካመኑ ወደ ${MAIL} ይጻፉ። እንደዚህ ያሉ ቅሬታዎችን እንመረምራለን፤ እርምጃም እንወስዳለን።`,
            ],
          },
          {
            heading: "በቅሬታው ውስጥ መገለጽ ያለበት",
            bullets: [
              "የትኛው ሥራ እንደተነካ እና በምን መሠረት በእሱ ላይ መብት እንዳለዎት።",
              "የይዘቱ ሊንክ እና፣ የሚታወቅ ከሆነ፣ የጥሰቱ ሁኔታዎች።",
              "የእርስዎ የመገናኛ ዝርዝሮች፦ ስም ወይም የድርጅት ስም፣ አድራሻ እና የኢሜይል አድራሻ።",
              "በመብት ባለቤቱ ስም የሚሠሩ ከሆነ — የውክልና ሥልጣንዎን የሚያረጋግጥ ማስረጃ።",
              "በቅሬታው ውስጥ ያሉት መረጃዎች ትክክለኛ መሆናቸውን እና የይዘቱ አጠቃቀም በመብት ባለቤቱ ወይም በሕግ ያልተፈቀደ መሆኑን የሚገልጽ መግለጫ።",
            ],
          },
          {
            heading: "ምን እናደርጋለን",
            body: [
              "ቅሬታውን በተመጣጣኝ ጊዜ ውስጥ፣ በአብዛኛው በሠላሳ የቀን መቁጠሪያ ቀናት ውስጥ፣ እንመረምራለን፤ ጥሰቱ ከተረጋገጠ በአገልግሎቱ በኩል ይዘቱን የማግኘት ዕድልን እንገድባለን፣ አስፈላጊ ሲሆንም የጣሹን የአገልግሎት ተደራሽነት እንገድባለን።",
              "የምርመራውን ውጤት ባቀረቡት የኢሜይል አድራሻ እናሳውቅዎታለን።",
            ],
          },
          {
            heading: "በቅን ልቦና ያልቀረቡ ቅሬታዎች",
            body: [
              "ሆን ተብሎ የተሳሳተ መረጃ የያዘ ቅሬታ በሕጉ መሠረት በአመልካቹ ላይ ኃላፊነት ሊያስከትል ይችላል። ቅሬታው የመብት ባለቤቱንም ሆነ አከራካሪውን ይዘት ለመለየት የማያስችል ከሆነ ቅሬታውን ላለመመርመር መብት አለን።",
            ],
          },
        ],
      },
    },
  },
  om: {
    ui: {
      updated: "Kan haaromfame",
      back: "Gara fuula jalqabaatti",
      operatorHeading: "Bulchaa tajaajilaa",
      navHeading: "Sanadoota biroo",
      labels: {
        privacy: "Imaammata Dhuunfaa",
        terms: "Waliigaltee Fayyadamaa",
        cookies: "Imaammata Cookie",
        copyright: "Abbootii Mirgaatiif",
      },
    },
    docs: {
      privacy: {
        title: "Imaammata Dhuunfaa",
        summary: `${operator.site} odeeffannoo akkamii akka sassaabu, maaliif akka barbaachisu, hammam akka turfamu fi akkamitti akka haqamu.`,
        sections: [
          {
            heading: "Qajeelfamoota waliigalaa",
            body: [
              `Imaammanni kun tajaajilli ${operator.site} odeeffannoo dhuunfaa (personal data) akkamii fi kaayyoo maaliif akka adeemsisu (processing) ibsa. To'ataan odeeffannoo (data controller) ${operator.nameOm} dha.`,
              "Tajaajila kana fayyadamuudhaan, akkaataa adeemsa odeeffannoo asitti ibsame ni fudhattu. Yoo isa hin fudhanne, maaloo tajaajila kana hin fayyadaminaa.",
              "Adeemsi kun Seera Rippaablika Kaazaakistaan “Waa'ee Odeeffannoo Dhuunfaa fi Eegumsa Isaanii” jedhuun, akkasumas daawwattoota Naannoo Diinagdee Awurooppaa (European Economic Area) irraa dhufaniif ulaagaalee GDPR tilmaama keessa galchuudhaan raawwatama.",
            ],
          },
          {
            heading: "Odeeffannoo maal adeemsifna",
            body: [
              "Waan hojii tajaajilaatiif barbaachisu ol homaa beekaa hin sassaabnu; sanadoota eenyummaa, odeeffannoo kaffaltii ykn teessoo hin gaafannu.",
            ],
            bullets: [
              "Odeeffannoo herrega Telegram kan bootiin yeroo isin isaaf barreessitan argatu: eenyummeessaa lakkoofsaa (numeric id), maqaa fayyadamaa (username), maqaa fi koodii afaanii.",
              "Liinkiiwwan buusuuf ergitan fi odeeffannoo yaalii sanaa: waltajjii, guyyaa fi sa'aatii, qulqullina filatame, fi bu'aa (milkaa'ina ykn dogoggora).",
              "Odeeffannoo teeknikaa walqunnamtii: teessoo IP, gosaa fi fooyya'iinsa (version) biraawuzarii, afaan, fi fuula irraa dhuftan. Kunniin galmee sarvarii (server logs) fi meeshaalee xiinxala marsariitii keessa galu.",
              "Cookie fi eenyummeessitoota xiinxalaa — bal'inaan Imaammata Cookie keessatti ilaalaa.",
            ],
          },
          {
            heading: "Odeeffannoon kun maaliif barbaachisa",
            bullets: [
              "Tajaajila mataa isaa kennuuf: viidiyoo liinkii keessan irraa argachuu fi faayilicha isiniif kennuu.",
              "Herrega keessan kan namoota biroo irraa adda baasuu fi itti fayyadama sirrii hin taane ittisuuf.",
              "Tajaajila itti fayyadama sirrii hin taane kan ofumaan (automated) raawwatamu irraa eeguuf: liinkiin osoo hin ergamin dura mirkaneessa Cloudflare Turnstile.",
              "Marsariitiin akkamitti akka itti fayyadamamu hubachuu fi dogoggoroota sirreessuuf — istaatiksii eenyummaa hin agarsiifne fi walitti qabame fayyadamuun.",
              "Gaaffiiwwan keessanii fi kan abbootii mirgaa deebisuuf.",
              "Yeroo tokko tokko Telegram irratti ilaalcha tajaajila irratti qabdan gaafachuuf isinii barreessuuf — fakkeenyaaf, yoo itti fayyadamuu dhaabdan. Deebii kennuun dirqama miti; ergaawwan akkasii yoo hin barbaanne, nutti himaa qofa, lammata isinii hin barreessinu.",
            ],
          },
          {
            heading: "Bu'uura seeraa adeemsaa",
            body: [
              "Odeeffannoon herrega Telegram fi galmeewwan buusuu Waliigaltee Fayyadamaa, isa yeroo tajaajila fayyadamuu jalqabdan fudhattan, raawwachuuf adeemsifamu.",
              "Cookie xiinxalaa fi galmeessi sochii marsariitii irratti godhamu eeyyama keessan irratti hundaa'uun adeemsifamu; eeyyama kana yeroo kamiyyuu deebifachuu dandeessu — karaaleen isaa Imaammata Cookie keessatti ibsamaniiru.",
              "Galmeen sarvarii fi eegumsi bootii irraa fedhii seera qabeessa (legitimate interest) keenya tajaajila hojjetaa fi nageenya qabu taasisuu irratti hundaa'u.",
              "Ilaalcha keessan tajaajila irratti gaafachuun fedhii seera qabeessa keenya tajaajila fooyyessuu irratti hundaa'a; yeroo kamiyyuu didachuu dandeessu.",
            ],
          },
          {
            heading: "Herregoota walqabsiifaman",
            body: [
              "Yoo barbaaddan, herrega keessan waltajjii tokko irratti (Instagram, Facebook, YouTube, X, VK, TikTok) bootii wajjin walqabsiisuu dandeessu, akka bootiin barreeffamoota warra seenaniif qofa mul'atan — stories, maxxansoota dhuunfaa — buusuuf. Kanaaf bootiin cookie herrega sanaa ni argata — dabalata biraawuzarii Videoner irraa koodii yeroo tokkoo fayyadamuun, ykn faayila isin ergitan irraa.",
              "Cookie waltajjii filatamee qofa kuufna; kanneen hafan battaluma gatna. Haala koodiin eegame (encrypted) ta'een kuufamu, buusuu iddoo isin itti walqabsiiftan qofaaf itti fayyadamna. Kanneen chaatii dhuunfaa keessatti walqabsiifaman buusuu keessaniif — liinkiiwwan keessan ofii garee herregni mataa isaa hin walqabsiifamne keessattis dabalatee — oolu; liinkiiwwan namoota biroof hin fayyadan. Kanneen garee tokkotti walqabsiifaman buusuu miseensota isaatiif qofa oolu, iddoo biraatti hin fayyadan.",
              "Bu'uurri seeraa eeyyama keessan: herrega ofumaan walqabsiiftu, yeroo kamiyyuu ajaja /accounts fayyadamuun haquu dandeessu. Yeroo haqamu cookie deebi'ee hin argamnetti balleeffama. Yoo waltajjiin seensa fudhachuu dhiise, bootiin isinitti beeksisa.",
              "Barreeffamoonni herrega walqabsiifame fayyadamuun buufaman chaanaalii keenya irratti hin maxxanfaman, kuusaa waliinii (shared cache) irraas fayyadamtoota biroof hin kennaman.",
            ],
          },
          {
            heading: "Tajaajiloota qaama sadaffaa",
            body: [
              "Odeeffannoo keessan hin gurgurru, qaamota sadaffaatiif kaayyoo isaanii ofiitiif hin dabarsinu. Hojii tajaajilaatiif dhiyeessitoonni armaan gadii hirmaatu; tokkoon tokkoon isaanii odeeffannoo seera mataa isaatiin adeemsisa:",
            ],
            bullets: [
              `Telegram — hojii bootii ${BOT}.`,
              "Cloudflare — eegumsa bootii irraa (Turnstile), dhiyeessa marsariitii fi qajeelcha imeelii.",
              "Google Analytics fi Google Tag Manager — istaatiksii daawwannaa.",
              "Yandex Metrica — istaatiksii daawwannaa, kaartaa cuqaasaa (click map) fi Webvisor. Webvisor sochii fuula irratti godhamu galmeessa: sochii akeektuu (pointer), gadi-ol sochoosuu (scrolling) fi cuqaasa. Galmeewwan kun mijataa ta'uu marsariitii xiinxaluuf qofa oolu.",
            ],
          },
          {
            heading: "Odeeffannoon hammam turfama",
            bullets: [
              "Faayiloonni buufaman erga uumamanii gara sa'aatii tokkoo booda ofumaan sarvarii irraa haqamu. Kuusaa viidiyoo keessanii hin qabnu.",
              "Galmeewwan yaalii buusuu hamma itti fayyadama sirrii hin taane ittisuu fi gaaffiiwwan qorachuuf barbaachisutti turfamu.",
              "Odeeffannoon herregaa hamma tajaajila fayyadamtanitti turfama, gaaffii keessaniin ni haqama.",
              "Galmeen sarvarii yeroo murtaa'eef turfamee, akkaataa naanna'iinsa (rotation) isaatiin irra deebi'amee barreeffama.",
            ],
          },
          {
            heading: "Odeeffannoon eessatti adeemsifama",
            body: [
              "Sarvaroonni tajaajilaa giddugala daataa (data centre) Gamtaa Awurooppaa keessatti argamu keessa jiru. Dhiyeessitoota olitti tarreeffaman keessaa tokko tokko akkaataa imaammata mataa isaaniitiin odeeffannoo daangaa isaatiin alatti adeemsisuu danda'u.",
            ],
          },
          {
            heading: "Mirgoota keessan",
            body: [
              `Waa'ee adeemsa odeeffannoo keessanii odeeffannoo argachuu, akka sirreeffamu ykn haqamu gaafachuu, eeyyama deebifachuu fi adeemsa mormuuf mirga qabdu. Kanaaf, imeelii ykn herrega Telegram gaaffichaan walqabatu irraa teessoo ${MAIL} irratti nuuf barreessaa.`,
              "Yeroo madaalawaa keessatti, yeroo baay'ee guyyoota kaalaandarii soddoma keessatti, deebii kennina. Herregni yoo haqame, seenaan buusuu isaan walqabatus ni haqama.",
            ],
          },
          {
            heading: "Daa'imman",
            body: [
              "Tajaajilli kun daa'imman umuriin isaanii 16 gadiitiif hin qophoofne, isaan irrattis hin xiyyeeffanne. Odeeffannoo isaanii beekaa hin sassaabnu; yoo dogoggoraan kun ta'e, nuuf barreessaa, odeeffannoon sun ni haqama.",
            ],
          },
          {
            heading: "Jijjiiramoota",
            body: [
              "Imaammata kana haaromsuu dandeenya. Guyyaan fooyya'iinsa ammaa fuula jalqaba irratti ibsameera; jijjiiramoota ijoo tajaajila keessatti ni beeksifna.",
            ],
          },
        ],
      },
      terms: {
        title: "Waliigaltee Fayyadamaa",
        summary: `Seerota itti fayyadama ${operator.site}: maaltu hayyamame, maaltu dhorkame, fi tajaajilli haala akkamii irratti hojjeta.`,
        sections: [
          {
            heading: "Qajeelfamoota waliigalaa",
            body: [
              `Waliigalteen kun itti fayyadama marsariitii ${operator.site} fi bootii Telegram ${BOT} ni bulcha. Abbaan qabeenyaa fi bulchaan tajaajilaa ${operator.nameOm} dha.`,
              "Tajaajila fayyadamuu jalqabuudhaan, haalawwan kana dubbistanii akka fudhattan ni mirkaneessitu. Yoo haalli kamiyyuu isiniif hin mijanne, tajaajila kana fayyadamuu hin qabdan.",
            ],
          },
          {
            heading: "Tajaajilli kun bilisa",
            body: [
              "Dandeettiiwwan tajaajilaa hundi bilisaan kennamu. Galmee kaffaltii (subscription), karoora kaffaltii, qulqullina viidiyoo kaffaltiin argamu ykn bittaa tajaajila keessaa hin qabnu.",
              "Beeksisa hin agarsiifnu, liinkiiwwan michummaa (affiliate links) hin kaa'innu.",
            ],
          },
          {
            heading: "Haalawwan seensaa",
            bullets: [
              "Marsariitii irratti buusuuf herregni ykn seensi hin barbaachisu. Bootiin fayyadamtoota herrega isaanii Telegram irratti hundaa'uun adda baasa.",
              "Daangaawwan teeknikaa baay'ina gaaffii irratti kaa'aman tajaajila ba'aa garmalee fi itti fayyadama sirrii hin taane kan ofumaan raawwatamu irraa eegu.",
              "YouTube irratti daangaan tiraafikii guyyaa ni hojjeta: marsariitii fi dabalata biraawuzarii irratti neetworkii tokko irraa sa'aatii 24 keessatti 10 GB, bootii keessatti immoo herrega Telegram tokkoof sa'aatii 24 keessatti 25 GB. Waltajjiiwwan biroo hin tuqu.",
              "Bootii fayyadamuun buusuuf chaanaalii keenya hordofuun (subscribe) hin barbaachisu. Bootiin ibsa faayilootaa keessatti liinkii chaanaalii oduu pirojektichaa ni dabala; isa hordofuun dirqama miti.",
            ],
          },
          {
            heading: "Tajaajilli maal hojjeta",
            body: [
              "Tajaajilli kun giddu-galeessa teeknikaa ti: liinkii isin kennitan hordofee fuula uummataaf banaa ta'e irraa faayila miidiyaa argatee isinii dabarsa.",
              "Kuusaa (catalogue) viidiyoo hin qabnu, qabiyyee namoota biroo keessa barbaacha hin geggeessinu, faayilota buufaman yeroo dabarsuuf barbaachisu — gara sa'aatii tokkoo — ol hin kuufnu.",
              "Argamuun waltajjii tokkoo murtee teeknikaa waltajjii sanaa irratti hundaa'a, beeksisa malee jijjiiramuu danda'a.",
            ],
          },
          {
            heading: "Dirqama fayyadamaa",
            body: [
              "Akkaataa faayilota argattan itti fayyadamtaniif itti gaafatamummaan kan keessan qofa, kanaafis mirga akka qabdan ni mirkaneessitu.",
            ],
            bullets: [
              "Meeshaa mirgi isaa kan keessan ta'e, ykn itti fayyadamni isaa abbaa mirgaatiin ykn seeraan hayyamame qofa buusaa.",
              "Tajaajila kana mirga abbummaa (copyright) fi mirgoota walqabatan (related rights) cabsuuf, qabiyyee dhorkame raabsuuf ykn mirga qaamota sadaffaa cabsuuf hin fayyadaminaa.",
              "Daangaawwan teeknikaa tajaajilaa, daangaa baay'ina gaaffii fi mirkaneessa bootii dabalatee, darbuuf hin yaalinaa.",
              "Ba'aa ofumaan raawwatamu hin uuminaa: gaaffiiwwan bal'aa (bulk requests), iskiriptiiwwan fi parsaroonni (scrapers) hin hayyamaman.",
            ],
          },
          {
            heading: "Liinkiiwwan chaanaalii irratti maxxansuu",
            body: [
              "Bootii fayyadamuun viidiyoo buusuudhaan, liinkiin barreeffama madda isaa chaanaalii Telegram keenya irratti akka maxxanfamu ni walii galtu. Akeekkachiisni kanaa bootii keessatti osoo qulqullina hin filatin dura — jechuunis osoo buusuuf hin murteessin dura — ni mul'ata.",
              "Maxxansi kun maqaa malee: chaanaaliitti kan ergamu liinkii fuula uummataaf banaa ta'ee, mata-duree viidiyoo fi suuraa isaa isa duraa (cover) — fakkii waltajjiin sun mul'isa duraa (preview) barreeffamichaa keessatti agarsiisu sana — dha. Eenyu akka buuse hin ibsamu. Faayilli viidiyoo mataan isaa yoomiyyuu eessayyuu hin maxxanfamu: kan raabsamu liinkii qofa, isa waltajjiiwwan ofii isaaniitiin furtuu “Qooduu” (Share) barreeffama hunda jalatti argamuun akka raabsamu affeeran.",
              "Liinkiin tokko al tokko caalaa hin maxxanfamu. Yoo liinkiin tokko chaanaalii irra akka ga'u hin barbaanne, viidiyoo sana tajaajila keenyaan hin buusinaa.",
              "Liinkiiwwan garee irraa fi barreeffamoonni herrega walqabsiifame fayyadamuun buufaman chaanaalii irratti hin maxxanfaman."
            ],
          },
          {
            heading: "Herrega keessan walqabsiisuu",
            body: [
              "Herrega keessan waltajjii irratti jiru bootii wajjin walqabsiisuudhaan, herregni sun kan keessan ta'uu fi akkasitti itti fayyadamuuf mirga akka qabdan ni mirkaneessitu.",
              "Waltajjiiwwan buusuu ofumaan raawwatamu hin deeggaran, herrega walqabsiifame daangessuu ykn cufuu danda'u. Balaa kana isin ofitti fudhattu; herrega ijoo keessan osoo hin taane herrega addaa biraa akka walqabsiiftan isin gorsina. Daangaa waltajjiin herrega keessan irra kaa'uuf itti gaafatamummaa hin qabnu.",
              "Herregni garee tokkotti walqabsiifame buusuu miseensota isaa hundaatiif itti fayyadama. Bulchitoonni garee eenyu herrega walqabsiisuu akka danda'u murteessu, isaan keessaa kamiyyuu haquus danda'u.",
            ],
          },
          {
            heading: "Daangaa itti gaafatamummaa",
            body: [
              "Tajaajilli kun haala “akkuma jiruutti” (as is) kennama. Hojii addaan hin cinne, argamuu waltajjii murtaa'e tokkoo ykn faayilli kaayyoo keessaniif mijaa'aa ta'uu hin wabeeffannu.",
              "Akkaataa meeshaa buufattan itti fayyadamtaniif, akkasumas bu'aa mirga qaamota sadaffaa cabsuu keessan irraa dhufuuf itti gaafatamummaa hin qabnu.",
              "Dandeettiiwwan tajaajilaa jijjiiruu, tajaajila suphaaf (maintenance) yeroof dhaabuu fi hojii isaa guutummaatti dhaabuuf mirga qabna.",
            ],
          },
          {
            heading: "Seensa daangessuu",
            body: [
              "Haalawwan kun yoo cabaman, daangaawwan darbuuf yaaliin yoo godhame, akkasumas komiin abbaa mirgaa bu'uura qabu yoo dhufe, seensa tajaajilaa daangessuu ykn addaan kutuu dandeenya.",
            ],
          },
          {
            heading: "Jijjiiramoota fi seera hojiirra oolu",
            body: [
              "Haalawwan kana jijjiiruu dandeenya; guyyaan fooyya'iinsa hojiirra jiruu fuula jalqaba irratti ibsameera. Erga jijjiiramni godhamee booda tajaajila fayyadamuu itti fufuun fooyya'iinsa haaraa akka fudhattan agarsiisa.",
              "Walitti dhufeenya qaamotaa irratti seerri Rippaablika Kaazaakistaan hojiirra oola. Qaamonni falmii ergaa wal-jijjiiruudhaan furuuf carraaqu; walii galuun yoo hin danda'amne, akkaataa seerri Rippaablika Kaazaakistaan kaa'een furama.",
            ],
          },
        ],
      },
      cookies: {
        title: "Imaammata Cookie",
        summary: `${operator.site} cookie akkamii akka fayyadamu, maaliif akka barbaachisan fi akkamitti didachuu akka dandeessan.`,
        sections: [
          {
            heading: "Cookie jechuun maal jechuu dha",
            body: [
              "Cookie faayilota barruu xixiqqaa marsariitiin biraawuzarii keessan keessatti kuusu dha. Isaan qindaa'ina (settings) keessan yaadachuu fi istaatiksii daawwannaa eenyummaa hin agarsiifne sassaabuuf gargaaru.",
              "Sanadni kun cookie wajjin teeknoolojiiwwan walfakkaatan — kuusaa naannoo biraawuzarii (local storage) fi piksaloota hordoffii (tracking pixels) — ni ibsa.",
            ],
          },
          {
            heading: "Kanneen dirqama barbaachisan",
            body: [
              "Isaan malee tajaajilli hin hojjetu, kanaaf yeroo hunda ni kaa'amu.",
            ],
            bullets: [
              "Cloudflare Turnstile — liinkii kan ergu nama malee iskiriptii akka hin taane mirkaneessa.",
              "Qindaa'ina fuula fayyadamaa (interface) — afaan fi bifa (theme) filattan.",
            ],
          },
          {
            heading: "Kanneen xiinxalaa",
            body: [
              "Isaan fuulota kamtu akka itti fayyadamamu fi dogoggoroonni eessatti akka uumaman hubachuuf nu gargaaru. Eeyyama keessaniin kaa'amu, hojii tajaajilaatiif dirqama miti.",
            ],
            bullets: [
              "Google Analytics fi Google Tag Manager — baay'ina daawwattootaa fi amala marsariitii irratti, eenyummaa osoo hin agarsiisin.",
              "Yandex Metrica — baay'ina daawwattootaa, kaartaa cuqaasaa (click map) fi Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor kan Yandex Metrica sochii fuula irratti godhamu galmeessa: sochii akeektuu, gadi-ol sochoosuu, cuqaasa fi waan bakka liinkii keessatti barreeffamu. Kunis fuulli fayyadamaa iddoo itti namoota burjaajessu ilaaluuf barbaachisa.",
              "Galmeewwan kana namoota dhuunfaa hordofuuf hin fayyadamnu. Maaloo, bakkeewwan marsariitii keessatti odeeffannoo akka kuufamu hin barbaanne hin galchinaa.",
            ],
          },
          {
            heading: "Akkamitti didachuu dandeessu",
            bullets: [
              "Qindaa'ina biraawuzarii keessanii keessatti cookie cufuu ykn haquu qopheessaa — karaan kun sirnoota asitti tarreeffaman hundaaf ni hojjeta.",
              "Google Analytics: dabalataan (add-on) biraawuzarii ofiisiyaalaa sassaabbii dhaabu marsariitii Google irraa ni argama.",
              "Yandex Metrica: didachuun dabalata (add-on) ofiisiyaalaa Yandex fayyadamuun ni danda'ama.",
              "Cookie dirqama barbaachisan dhaabuun buusuu hin danda'amne taasisa.",
            ],
          },
          {
            heading: "Yeroo kuufamaa",
            body: [
              "Cookie seshinii (session cookies) yeroo biraawuzarii cuftan ykn yeroon seshinii yoo xumurame ni haqamu. Meeshaaleen xiinxalaa eenyummeessitoota isaanii yeroo dhiyeessitoonni isaanii murteessaniif kuusu.",
            ],
          },
        ],
      },
      copyright: {
        title: "Abbootii Mirgaatiif",
        summary: "Ejjennoo tajaajilaa mirga abbummaa (copyright) irratti fi akkaataa komii cabiinsaa dhiyeessuu.",
        sections: [
          {
            heading: "Ejjennoo tajaajilaa",
            body: [
              "Tajaajilli kun viidiyoo of biratti hin kuusu, kuusaa (catalogue) isaaniis hin qabu. Giddu-galeessa teeknikaa ta'ee hojjeta: liinkii fayyadamaan galche hordofee, fuula uummataaf banaa ta'e bira ga'ee faayilicha fayyadamaa sanaaf dabarsa.",
              "Faayiloonni buufaman sarvarii irratti gara sa'aatii tokkoo turanii ofumaan haqamu. Garagalchi qabiyyee namoota biroo dhaabbataan nu bira hin hafu.",
              "Itti fayyadama meeshaa buufamee irratti itti gaafatamummaan kan fayyadamaa ti — kunis Waliigaltee Fayyadamaa keessatti ifatti kaa'ameera.",
            ],
          },
          {
            heading: "Yoo mirgi keessan cabe",
            body: [
              `Yoo isin abbaa mirgaa ykn bakka bu'aa isaa taatanii fi tajaajilli kun mirga keessan cabsuuf itti fayyadamamaa jira jettanii yaaddan, teessoo ${MAIL} irratti nuuf barreessaa. Komii akkasii ni qorannee tarkaanfii ni fudhanna.`,
            ],
          },
          {
            heading: "Komii keessatti maal ibsuu qabdu",
            bullets: [
              "Hojiin kam akka tuqame fi bu'uura maaliin mirga isa irratti akka qabdan.",
              "Liinkii meeshichaa fi, yoo beekamu, haala cabiinsichaa.",
              "Odeeffannoo quunnamtii keessan: maqaa ykn maqaa dhaabbataa, teessoo fi teessoo imeelii.",
              "Yoo abbaa mirgaa bakka bu'uun hojjettan — ragaa aangoo keessanii.",
              "Ibsa odeeffannoon komii keessa jiru sirrii ta'uu fi itti fayyadamni meeshichaa abbaa mirgaatiin ykn seeraan hin hayyamamne ta'uu mirkaneessu.",
            ],
          },
          {
            heading: "Maal goona",
            body: [
              "Komii yeroo madaalawaa keessatti, yeroo baay'ee guyyoota kaalaandarii soddoma keessatti, ni qorranna; cabiinsi yoo mirkanaa'e, tajaajila keenyaan seensa meeshichaa ni daangessina, yoo barbaachise immoo seensa nama mirga cabsee tajaajilaatti qabu ni daangessina.",
              "Bu'aa qorannichaa teessoo imeelii isin kennitan irratti isinitti ni beeksifna.",
            ],
          },
          {
            heading: "Komii amanamummaa hin qabne",
            body: [
              "Komiin odeeffannoo sobaa beekamaa of keessaa qabu, akkaataa seera hojiirra jiruun itti gaafatamummaa dhiyeessaa irratti fiduu danda'a. Komiin abbaa mirgaas ta'e meeshaa falmisiisaa adda baasuu hin dandeessifne yoo ta'e, qorachuu diduuf mirga qabna.",
            ],
          },
        ],
      },
    },
  },
  ha: {
    ui: {
      updated: "An sabunta a",
      back: "Koma shafin farko",
      operatorHeading: "Mai gudanar da sabis",
      navHeading: "Sauran takardu",
      labels: {
        privacy: "Manufar Sirri",
        terms: "Sharuɗɗan Amfani",
        cookies: "Manufar Cookie",
        copyright: "Ga Masu Haƙƙin Mallaka",
      },
    },
    docs: {
      privacy: {
        title: "Manufar Sirri",
        summary: `Waɗanne bayanai ${operator.site} ke tattarawa, dalilin da ake buƙatarsu, tsawon lokacin da ake adana su da yadda za a share su.`,
        sections: [
          {
            heading: "Gabaɗaya",
            body: [
              `Wannan Manufa tana bayyana irin bayanan sirri (personal data) da sabis ɗin ${operator.site} ke sarrafawa da kuma dalilin hakan. Mai kula da bayanai (data controller) shi ne ${operator.nameHa}.`,
              "Ta hanyar amfani da sabis ɗin, kun amince da tsarin sarrafa bayanai da aka bayyana a nan. Idan ba ku amince da shi ba, don Allah kada ku yi amfani da sabis ɗin.",
              "Ana sarrafa bayanai bisa ga Dokar Jamhuriyar Kazakhstan “Game da Bayanan Sirri da Kariyarsu”, kuma, game da maziyarta daga Yankin Tattalin Arzikin Turai (European Economic Area), tare da la'akari da buƙatun GDPR.",
            ],
          },
          {
            heading: "Bayanan da muke sarrafawa",
            body: [
              "Da gangan ba ma tattara wani abu fiye da abin da sabis ɗin ke buƙata don aiki, kuma ba ma neman takardun shaida, bayanan biyan kuɗi ko adireshi.",
            ],
            bullets: [
              "Bayanan asusun Telegram da bot ke samu idan kuka aika masa saƙo: lambar shaida (id), sunan mai amfani (username), suna da lambar harshe.",
              "Hanyoyin haɗin da kuke aikawa don saukewa da bayanai game da ƙoƙarin saukewar kansa: dandali, kwanan wata da lokaci, ingancin da aka zaɓa, da sakamako (nasara ko kuskure).",
              "Bayanan fasaha na haɗin intanet: adireshin IP, nau'i da sigar burauza, harshe da shafin da kuka fito. Waɗannan suna shiga cikin bayanan ayyukan uwar garke (server logs) da kayan aikin nazarin yanar gizo.",
              "Cookies da masu gano nazari (analytics identifiers) — ƙarin bayani a cikin Manufar Cookie.",
            ],
          },
          {
            heading: "Dalilin da muke buƙatar bayanan",
            bullets: [
              "Don samar da sabis ɗin kansa: samo bidiyo ta hanyar haɗinku da kuma ba ku fayil ɗin.",
              "Don bambanta asusunku da na wasu da kuma hana cin zarafi.",
              "Don kare sabis ɗin daga cin zarafi na atomatik: binciken Cloudflare Turnstile kafin aika hanyar haɗi.",
              "Don fahimtar yadda ake amfani da shafin da gyara kurakurai, ta amfani da ƙididdigar da aka cire sunaye (anonymised) kuma aka haɗa wuri ɗaya (aggregated).",
              "Don amsa tambayoyinku da na masu haƙƙin mallaka.",
              "Don aiko muku da saƙo a Telegram lokaci-lokaci domin jin ra'ayinku game da sabis ɗin — misali, idan kun daina amfani da shi. Ba dole ba ne ku amsa; idan ba ku son irin waɗannan saƙonni, kawai ku faɗa mana, kuma ba za mu sake rubuto muku ba.",
            ],
          },
          {
            heading: "Tushen doka na sarrafa bayanai",
            body: [
              "Ana sarrafa bayanan asusun Telegram da bayanan saukewa domin aiwatar da Sharuɗɗan Amfani, waɗanda kuke amincewa da su lokacin da kuka fara amfani da sabis ɗin.",
              "Ana sarrafa cookies na nazari da naɗar ayyuka a shafin bisa yardarku, wadda za ku iya janyewa a kowane lokaci — an bayyana hanyoyin a cikin Manufar Cookie.",
              "Bayanan ayyukan uwar garke da kariya daga bot sun dogara ne a kan halattaccen muradinmu (legitimate interest) na ci gaba da gudanar da sabis ɗin cikin aminci.",
              "Tambayoyi game da ra'ayinku kan sabis ɗin sun dogara ne a kan halattaccen muradinmu na inganta sabis ɗin; za ku iya ƙin karɓar su a kowane lokaci.",
            ],
          },
          {
            heading: "Asusun da aka haɗa",
            body: [
              "Idan kuna so, za ku iya haɗa asusunku na wani dandali (Instagram, Facebook, YouTube, X, VK, TikTok) da bot domin ya sauke wallafe-wallafen da masu shiga asusu kaɗai ke iya gani: labarai (stories) da wallafe-wallafe na sirri. Don haka bot yana karɓar cookies na wannan asusun — daga ƙarin burauza na Videoner ta hanyar lambar amfani sau ɗaya, ko daga fayil da kuka aiko.",
              "Muna adana cookies na dandalin da aka zaɓa kaɗai, sauran kuma muna watsar da su nan take. Ana adana su a rufaffen tsari (encrypted) kuma ana amfani da su ne kawai don saukewa a inda kuka haɗa su. Waɗanda aka haɗa a cikin hirarku ta sirri suna aiki ne don saukewarku, har da hanyoyin haɗinku na kanku a cikin rukunonin da ba su da nasu asusun; ba a taɓa amfani da su don hanyoyin haɗin wasu mutane ba. Waɗanda aka haɗa da rukuni suna aiki ne don saukewar membobinsa kaɗai, ba a wani wuri ba.",
              "Tushen doka shi ne yardarku: ku da kanku kuke haɗa asusun, kuma za ku iya cire shi a kowane lokaci ta umarnin /accounts. Idan aka cire su, ana goge cookies ɗin har abada. Idan dandalin ya daina karɓar shigarku, bot zai sanar da ku.",
              "Wallafe-wallafen da aka sauke ta asusun da aka haɗa ba a wallafa su a tasharmu, kuma ba a ba wa sauran masu amfani su daga ma'ajiyar gama-gari (shared cache).",
            ],
          },
          {
            heading: "Sabis na ɓangare na uku",
            body: [
              "Ba ma sayar da bayananku kuma ba ma miƙa su ga ɓangare na uku don manufofinsu na kansu. Sabis ɗin yana amfani da masu samar da sabis masu zuwa, kowannensu yana sarrafa bayanai bisa ga ƙa'idojinsa:",
            ],
            bullets: [
              `Telegram — gudanar da bot ɗin ${BOT}.`,
              "Cloudflare — kariya daga bot (Turnstile), isar da shafin yanar gizo da tura saƙonnin imel.",
              "Google Analytics da Google Tag Manager — ƙididdigar ziyara.",
              "Yandex Metrica — ƙididdigar ziyara, taswirar dannawa da Webvisor. Webvisor yana naɗar ayyuka a shafi: motsin alamar linzami (pointer), gungurawa da dannawa. Ana amfani da naɗaɗɗun ne kawai don nazarin sauƙin amfani da shafin.",
            ],
          },
          {
            heading: "Tsawon lokacin adanawa",
            bullets: [
              "Ana share fayilolin da aka sauke daga uwar garke ta atomatik kusan awa ɗaya bayan an ƙirƙire su. Ba ma adana tarin bidiyonku.",
              "Ana adana bayanan ƙoƙarin saukewa muddin ana buƙatarsu don hana cin zarafi da duba tambayoyi.",
              "Ana adana bayanan asusu muddin kuna amfani da sabis ɗin, kuma ana share su idan kuka nema.",
              "Ana adana bayanan ayyukan uwar garke na ƙayyadadden lokaci, kuma ana sake rubuta su yayin juyawarsu (rotation).",
            ],
          },
          {
            heading: "Inda ake sarrafa bayanai",
            body: [
              "Uwar garken sabis ɗin suna cikin cibiyar bayanai (data centre) a cikin Tarayyar Turai. Wasu daga cikin masu samar da sabis da aka lissafa a sama na iya sarrafa bayanai a wajenta bisa ga manufofinsu.",
            ],
          },
          {
            heading: "Haƙƙoƙinku",
            body: [
              `Kuna da haƙƙin samun bayani game da sarrafa bayananku, neman a gyara su ko a share su, janye yardarku da kuma ƙin amincewa da sarrafa su. Don yin haka, ku rubuto zuwa ${MAIL} daga adireshin imel ko asusun Telegram da buƙatar ta shafa.`,
              "Muna amsawa cikin lokaci mai ma'ana, yawanci cikin kwanaki talatin na kalanda. Share asusu yana haɗawa da share tarihin saukewa da ke da alaƙa da shi.",
            ],
          },
          {
            heading: "Ƙananan yara",
            body: [
              "Ba a tsara sabis ɗin don yara 'yan ƙasa da shekara 16 ba, kuma ba a kansu aka nufa shi ba. Ba ma tattara bayanansu da gangan; idan hakan ya faru bisa kuskure, ku rubuto mana, za a share bayanan.",
            ],
          },
          {
            heading: "Canje-canje",
            body: [
              "Za mu iya sabunta wannan Manufa. Ana nuna kwanan watan sigar da ke aiki a saman shafin, kuma za mu sanar da muhimman canje-canje a cikin sabis ɗin.",
            ],
          },
        ],
      },
      terms: {
        title: "Sharuɗɗan Amfani",
        summary: `Ƙa'idojin amfani da ${operator.site}: abin da aka yarda, abin da aka hana, da sharuɗɗan da sabis ɗin ke aiki a kansu.`,
        sections: [
          {
            heading: "Gabaɗaya",
            body: [
              `Waɗannan Sharuɗɗa suna tsara amfani da shafin yanar gizo na ${operator.site} da bot na Telegram ${BOT}. Mamallaki kuma mai gudanar da sabis ɗin shi ne ${operator.nameHa}.`,
              "Ta hanyar fara amfani da sabis ɗin, kuna tabbatar da cewa kun karanta waɗannan Sharuɗɗa kuma kun amince da su. Idan wani sharaɗi bai dace da ku ba, kada ku yi amfani da sabis ɗin.",
            ],
          },
          {
            heading: "Sabis ɗin kyauta ne",
            body: [
              "Duk abin da sabis ɗin ke bayarwa kyauta ne. Babu kuɗin rajista na lokaci-lokaci (subscription), babu tsare-tsaren biya, babu ingancin bidiyo na biya, kuma babu sayayya a cikin sabis ɗin.",
              "Ba ma nuna tallace-tallace kuma ba ma sanya hanyoyin haɗi na haɗin gwiwa (affiliate links).",
            ],
          },
          {
            heading: "Sharuɗɗan samun dama",
            bullets: [
              "Saukewa a shafin yanar gizo ba ya buƙatar asusu ko shiga. Bot yana bambanta masu amfani ta asusunsu na Telegram.",
              "Ƙayyadaddun iyakoki na fasaha kan yawan buƙatu suna kare sabis ɗin daga cunkoso da cin zarafi na atomatik.",
              "Saukewa daga YouTube yana da iyakar zirga-zirgar bayanai (traffic) ta yini: 10 GB a cikin awa 24 ga kowace hanyar sadarwa a shafin yanar gizo da kuma a cikin ƙarin burauza, da 25 GB a cikin awa 24 ga kowane asusun Telegram a cikin bot. Wannan bai shafi sauran dandaloli ba.",
              "Ba sai kun shiga (subscribe) tasharmu ba don saukewa ta bot. Bot yana ƙara hanyar haɗi zuwa tashar labarai ta aikin a cikin bayanin fayiloli; shiga cikinta ba dole ba ne.",
            ],
          },
          {
            heading: "Abin da sabis ɗin ke yi",
            body: [
              "Sabis ɗin mai shiga tsakani ne na fasaha: yana bin hanyar haɗin da kuka bayar, yana samo fayil ɗin kafofin watsa labarai (media) daga shafin da kowa zai iya gani, sannan ya miƙa muku shi.",
              "Ba ma ajiye tarin bidiyo a wurinmu, ba ma gudanar da bincike a cikin abubuwan wasu, kuma ba ma adana fayilolin da aka sauke fiye da lokacin da ake buƙata don isar da su — kusan awa ɗaya.",
              "Ko wani dandali zai yi aiki ya dogara ne da shawarwarin fasaha na wannan dandalin, kuma hakan na iya canzawa ba tare da sanarwa ba.",
            ],
          },
          {
            heading: "Wajiban mai amfani",
            body: [
              "Ku kaɗai ke da alhakin yadda kuke amfani da fayilolin da kuka samu, kuma kuna tabbatar da cewa kuna da haƙƙin yin hakan.",
            ],
            bullets: [
              "Ku sauke abin da kuke da haƙƙin mallakarsa kaɗai, ko wanda mai haƙƙin mallaka ko doka ta ba da izinin amfani da shi.",
              "Kada ku yi amfani da sabis ɗin don keta haƙƙin mallaka ko haƙƙoƙi masu alaƙa (related rights), yaɗa abubuwan da aka haramta ko keta haƙƙoƙin wasu.",
              "Kada ku yi ƙoƙarin kauce wa ƙayyadaddun iyakokin fasaha na sabis ɗin, ciki har da iyakokin yawan buƙatu da binciken bot.",
              "Kada ku haifar da nauyi na atomatik: ba a yarda da buƙatu masu yawa a lokaci guda, rubutattun shirye-shirye (scripts) da masu tattara bayanai (scrapers) ba.",
            ],
          },
          {
            heading: "Wallafa hanyoyin haɗi a tasha",
            body: [
              "Ta hanyar sauke bidiyo ta bot, kun amince cewa za a wallafa hanyar haɗi zuwa ainihin wallafar a tasharmu ta Telegram. Ana nuna sanarwa game da hakan a cikin bot kafin ku zaɓi inganci — wato, kafin ku yanke shawarar saukewa.",
              "Wallafawar ba ta bayyana suna: tashar tana karɓar hanyar haɗi zuwa shafin da kowa zai iya gani, taken bidiyon da hoton murfinsa — hoton da dandalin ke nunawa a samfoti na wallafarsa. Ba a bayyana wanda ya sauke shi ba. Ba a taɓa wallafa fayil ɗin bidiyon kansa a ko'ina ba: abin da ake yaɗawa shi ne hanyar haɗin, wadda dandalolin da kansu ke gayyatar mutane su yaɗa ta maɓallin “Raba” (Share) da ke ƙarƙashin kowace wallafa.",
              "Ana wallafa hanyar haɗi ɗaya sau ɗaya kawai. Idan ba ku son hanyar haɗi ta isa tashar, kada ku sauke wannan bidiyon ta sabis ɗinmu.",
              "Hanyoyin haɗi daga rukunoni da wallafe-wallafen da aka sauke ta asusun da aka haɗa ba a taɓa wallafa su a tashar ba."
            ],
          },
          {
            heading: "Haɗa asusunku",
            body: [
              "Ta hanyar haɗa asusunku na wani dandali da bot, kuna tabbatar da cewa asusun naku ne kuma kuna da haƙƙin amfani da shi ta wannan hanya.",
              "Dandaloli ba sa goyon bayan saukewa ta atomatik kuma suna iya taƙaita ko dakatar da asusun da aka haɗa. Kuna ɗaukar wannan haɗari a kanku; muna ba da shawarar ku haɗa wani asusu na daban maimakon babban asusunku. Ba mu da alhakin taƙaitawar da dandali zai sanya wa asusunku.",
              "Ana amfani da asusun da aka haɗa da rukuni don saukewar duk membobinsa. Masu gudanar da rukuni (admins) ne ke yanke shawarar wanda zai iya haɗa asusu, kuma za su iya cire kowanne daga cikinsu.",
            ],
          },
          {
            heading: "Iyakance alhaki",
            body: [
              "Ana samar da sabis ɗin “yadda yake” (as is). Ba mu ba da tabbacin aiki ba tare da katsewa ba, samuwar wani dandali na musamman, ko dacewar fayil da manufarku.",
              "Ba mu da alhakin abin da kuke yi da abubuwan da kuka sauke, haka kuma ba mu da alhakin sakamakon keta haƙƙoƙin wasu da kuka yi.",
              "Muna da haƙƙin canza abubuwan da sabis ɗin ke bayarwa, dakatar da shi na ɗan lokaci don gyara, da kuma kawo ƙarshen aikinsa.",
            ],
          },
          {
            heading: "Taƙaita samun dama",
            body: [
              "Za mu iya taƙaita ko dakatar da damar amfani da sabis ɗin idan aka keta waɗannan Sharuɗɗa, idan aka yi ƙoƙarin kauce wa iyakoki, ko kuma idan aka sami ƙorafi mai tushe daga mai haƙƙin mallaka.",
            ],
          },
          {
            heading: "Canje-canje da dokar da ke aiki",
            body: [
              "Za mu iya gyara waɗannan Sharuɗɗa; ana nuna kwanan watan sigar da ke aiki a saman shafin. Ci gaba da amfani da sabis ɗin bayan canji yana nufin kun amince da sabuwar sigar.",
              "Dokar Jamhuriyar Kazakhstan ce ke tsara dangantakar ɓangarorin. Ɓangarorin za su yi ƙoƙarin sasanta saɓani ta hanyar wasiƙu, idan kuma ba a cimma yarjejeniya ba, ta hanyar da dokokin Jamhuriyar Kazakhstan suka tanada.",
            ],
          },
        ],
      },
      cookies: {
        title: "Manufar Cookie",
        summary: `Waɗanne cookies ne ${operator.site} ke amfani da su, dalilin da ake buƙatarsu da yadda za a ƙi su.`,
        sections: [
          {
            heading: "Menene cookies",
            body: [
              "Cookies ƙananan fayilolin rubutu ne da shafin yanar gizo ke adanawa a cikin burauzarku. Suna ba da damar tuna saitunanku da tattara ƙididdigar ziyara ba tare da bayyana sunaye ba.",
              "Tare da cookies, wannan takarda tana bayyana fasahohi masu kama da su: ma'ajiyar gida ta burauza (local storage) da pixels na bin diddigi (tracking pixels).",
            ],
          },
          {
            heading: "Waɗanda suka zama dole",
            body: [
              "Idan babu su sabis ɗin ba ya aiki, don haka ana saita su koyaushe.",
            ],
            bullets: [
              "Cloudflare Turnstile — yana tabbatar da cewa mutum ne ke aika hanyar haɗi, ba rubutaccen shiri (script) ba.",
              "Saitunan fuskar sadarwa (interface) — harshen da kuka zaɓa da jigon launi.",
            ],
          },
          {
            heading: "Na nazari",
            body: [
              "Suna taimaka mana mu ga waɗanne shafuka ake amfani da su da kuma inda kurakurai ke faruwa. Ana saita su da yardarku kuma ba dole ba ne don aikin sabis ɗin.",
            ],
            bullets: [
              "Google Analytics da Google Tag Manager — yawan ziyara da halayya a shafin, ba tare da bayyana sunaye ba.",
              "Yandex Metrica — yawan ziyara, taswirar dannawa da Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor na Yandex Metrica yana naɗar ayyuka a shafi: motsin alamar linzami, gungurawa, dannawa da rubutu a filin hanyar haɗi. Manufarsa ita ce mu ga inda fuskar sadarwa ke rikitar da mutane.",
              "Ba ma amfani da waɗannan naɗaɗɗun don bin diddigin wasu takamaiman mutane. Don Allah kada ku shigar da wani abu a cikin filayen shafin wanda ba za ku so a adana ba.",
            ],
          },
          {
            heading: "Yadda ake ƙin su",
            bullets: [
              "Ku toshe ko share cookies a cikin saitunan burauzarku — wannan hanya tana aiki ga dukkan tsarin da aka lissafa a nan.",
              "Google Analytics: ana samun ƙarin burauza na hukuma daga Google wanda ke dakatar da tattara bayanai.",
              "Yandex Metrica: ana iya ƙin amincewa ta hanyar ƙarin burauza na hukuma na Yandex.",
              "Kashe cookies da suka zama dole zai sa saukewa ta gagara.",
            ],
          },
          {
            heading: "Tsawon lokacin adanawa",
            body: [
              "Ana share cookies na zama (session cookies) idan kuka rufe burauza ko idan zaman ya ƙare. Kayan aikin nazari suna adana masu gano su na tsawon lokacin da masu samar da su suka ƙayyade.",
            ],
          },
        ],
      },
      copyright: {
        title: "Ga Masu Haƙƙin Mallaka",
        summary: "Matsayin sabis ɗin game da haƙƙin mallaka da yadda ake shigar da ƙorafi game da keta haƙƙi.",
        sections: [
          {
            heading: "Matsayin sabis ɗin",
            body: [
              "Sabis ɗin ba ya ajiye bidiyo a wurinsa kuma ba shi da tarin bidiyo. Yana aiki a matsayin mai shiga tsakani na fasaha: yana bin hanyar haɗin da mai amfani ya shigar, yana kai wa ga shafin da kowa zai iya gani, sannan ya miƙa fayil ɗin ga wannan mai amfani.",
              "Fayilolin da aka sauke suna kasancewa a uwar garke na kusan awa ɗaya, sannan a share su ta atomatik. Babu wani kwafi na dindindin na abubuwan wani da ke saura a wurinmu.",
              "Alhakin amfani da abubuwan da aka sauke yana kan mai amfani — kamar yadda Sharuɗɗan Amfani suka bayyana a fili.",
            ],
          },
          {
            heading: "Idan an keta haƙƙoƙinku",
            body: [
              `Idan ku masu haƙƙin mallaka ne ko wakilinsu kuma kuna ganin ana amfani da sabis ɗin don keta haƙƙoƙinku, ku rubuto zuwa ${MAIL}. Muna duba irin waɗannan ƙorafe-ƙorafe kuma muna ɗaukar mataki.`,
            ],
          },
          {
            heading: "Abin da za a haɗa a cikin ƙorafi",
            bullets: [
              "Wane aiki abin ya shafa da kuma bisa wane tushe kuke da haƙƙi a kansa.",
              "Hanyar haɗi zuwa abin da ake magana a kai kuma, idan an sani, yanayin da keta haƙƙin ya faru.",
              "Bayanan tuntuɓarku: suna ko sunan ƙungiya, adireshi da adireshin imel.",
              "Idan kuna aiki a madadin mai haƙƙin mallaka — shaidar ikonku na yin hakan.",
              "Sanarwa cewa bayanan da ke cikin ƙorafin gaskiya ne, kuma mai haƙƙin mallaka ko doka ba su ba da izinin amfani da abin ba.",
            ],
          },
          {
            heading: "Abin da za mu yi",
            body: [
              "Muna duba ƙorafi cikin lokaci mai ma'ana, yawanci cikin kwanaki talatin na kalanda, kuma idan aka tabbatar da keta haƙƙi, muna toshe damar samun abin ta sabis ɗin, kuma idan ya zama dole, damar mai keta haƙƙin ta amfani da sabis ɗin.",
              "Za mu sanar da sakamakon dubawa zuwa adireshin imel da kuka bayar.",
            ],
          },
          {
            heading: "Ƙorafe-ƙorafe na mugun nufi",
            body: [
              "Ƙorafin da ke ɗauke da bayanan ƙarya da gangan na iya jawo wa mai ƙorafin alhaki bisa ga dokokin da ke aiki. Muna da haƙƙin ƙin duba ƙorafin da bai bayyana mai haƙƙin mallaka ko abin da ake jayayya a kai ba.",
            ],
          },
        ],
      },
    },
  },
  so: {
    ui: {
      updated: "La cusboonaysiiyay",
      back: "Ku noqo bogga hore",
      operatorHeading: "Maamulaha adeegga",
      navHeading: "Dukumentiyo kale",
      labels: {
        privacy: "Siyaasadda Asturnaanta",
        terms: "Shuruudaha Isticmaalka",
        cookies: "Siyaasadda Cookie-ga",
        copyright: "Milkiilayaasha Xuquuqda",
      },
    },
    docs: {
      privacy: {
        title: "Siyaasadda Asturnaanta",
        summary: `Xogta uu ${operator.site} uruuriyo, sababta loogu baahan yahay, muddada la kaydiyo iyo sida loo tirtiri karo.`,
        sections: [
          {
            heading: "Qodobbo guud",
            body: [
              `Siyaasaddan waxay qeexaysaa xogta shakhsiga ah ee uu adeegga ${operator.site} habeeyo iyo ujeeddada loo habeeyo. Maamulaha xogta (data controller) waa ${operator.nameSo}.`,
              "Markaad isticmaasho adeegga, waxaad oggolaanaysaa habka habaynta xogta ee halkan lagu sharraxay. Haddii aadan ku raacsanayn, fadlan ha isticmaalin adeegga.",
              "Habaynta xogta waxaa loo sameeyaa si waafaqsan Sharciga Jamhuuriyadda Kazakhstan “Ku saabsan Xogta Shakhsiga ah iyo Ilaalinteeda”, iyo, marka ay khusayso booqdayaasha ka yimaada Aagga Dhaqaalaha Yurub (European Economic Area), iyadoo la tixgelinayo shuruudaha GDPR.",
            ],
          },
          {
            heading: "Xogta aan habayno",
            body: [
              "Si ula kac ah uma uruurinno wax ka badan inta adeeggu u baahan yahay, kama codsanno dukumentiyo, xog lacag-bixin ama cinwaan.",
            ],
            bullets: [
              "Xogta akoonka Telegram ee bot-ku helo markaad u qorto: aqoonsiga tirada ah (numeric id), magaca isticmaalaha (username), magaca iyo koodka luqadda.",
              "Link-yada aad u soo dirto soo dejinta iyo faahfaahinta isku daygaas laftiisa: madasha, taariikhda iyo waqtiga, tayada la doortay iyo natiijada (guul ama khalad).",
              "Xogta farsamo ee isku xirka: cinwaanka IP, nooca iyo nuqulka biraawsarka, luqadda iyo bogga laga yimid. Xogtani waxay gashaa diiwaannada server-ka (server logs) iyo qalabka falanqaynta website-ka (web analytics).",
              "Cookie-yada iyo aqoonsiyada falanqaynta — faahfaahin ka eeg Siyaasadda Cookie-ga.",
            ],
          },
          {
            heading: "Sababta aan xogtan ugu baahannahay",
            bullets: [
              "Si aan u bixinno adeegga laftiisa: inaan ka soo qaadno muuqaalka link-gaaga oo aan kuu dhiibno faylka.",
              "Si aan akoonkaaga uga kala saarno akoonnada dadka kale oo aan uga hortagno ku-takri-falka (abuse).",
              "Si aan adeegga uga ilaalinno ku-takri-falka iskiis u shaqeeya (automated): hubinta Cloudflare Turnstile ka hor inta aan link-ga la soo dirin.",
              "Si aan u fahanno sida loo isticmaalo website-ka oo aan u saxno khaladaadka — iyadoo la adeegsanayo tirakoob aan qofka lagu aqoonsan karin (anonymised) oo la isku daray.",
              "Si aan uga jawaabno codsiyadaada iyo codsiyada milkiilayaasha xuquuqda.",
              "Si aan mararka qaarkood kuugu soo qorno Telegram si aan u ogaanno fikirkaaga ku saabsan adeegga — tusaale ahaan, haddii aad joojisay isticmaalkiisa. Ka jawaabiddu waa ikhtiyaar; haddii aadan rabin fariimahan oo kale, si fudud noo sheeg, mar dambena kuuma soo qori doonno.",
            ],
          },
          {
            heading: "Saldhigga sharci ee habaynta",
            body: [
              "Xogta akoonka Telegram iyo diiwaannada soo dejinta waxaa loo habeeyaa si loo fuliyo Shuruudaha Isticmaalka, kuwaas oo aad aqbasho markaad bilowdo isticmaalka adeegga.",
              "Cookie-yada falanqaynta iyo duubista ficillada website-ka waxaa loo habeeyaa iyadoo lagu salaynayo oggolaanshahaaga, kaas oo aad dib ula noqon karto wakhti kasta — hababka waxaa lagu sharraxay Siyaasadda Cookie-ga.",
              "Diiwaannada server-ka iyo ka ilaalinta bot-yada waxay ku salaysan yihiin danteenna sharciga ah (legitimate interest) ee ah in adeeggu sii shaqeeyo oo uu ammaan ahaado.",
              "Weydiinta fikirkaaga ku saabsan adeegga waxay ku salaysan tahay danteenna sharciga ah ee ah horumarinta adeegga; wakhti kasta waad diidi kartaa.",
            ],
          },
          {
            heading: "Akoonnada ku xiran",
            body: [
              "Haddii aad doorato, waxaad bot-ka ku xiri kartaa akoonkaaga madal (Instagram, Facebook, YouTube, X, VK, TikTok) si uu u soo dejiyo boostooyinka ay arki karaan oo keliya isticmaalayaasha soo galay: sheekooyinka (stories) iyo boostooyinka gaarka ah. Si tan loo sameeyo, bot-ku wuxuu helaa cookie-yada akoonkaas — kordhiyaha Videoner iyadoo loo marayo kood hal mar la isticmaalo, ama fayl aad soo dirtay.",
              "Waxaan kaydinnaa oo keliya cookie-yada madasha la doortay, inta kalena isla markiiba waan tuurnaa. Waxaa loo kaydiyaa qaab sir ah (encrypted), waxaana loo isticmaalaa oo keliya soo dejinta meesha aad ku xirtay. Cookie-yada lagu xiray wada-sheekaysigaaga gaarka ah waxay u adeegaan soo dejintaada, oo ay ku jiraan link-yadaada gaarka ah ee kooxaha aan akoon u gaar ah lagu xirin; marna looma isticmaalo link-yada dadka kale. Cookie-yada koox lagu xiray waxay u adeegaan oo keliya soo dejinta xubnaheeda, meel kalena looma isticmaalo.",
              "Saldhigga sharci waa oggolaanshahaaga: adiga ayaa akoonka ku xira, waxaadna ka saari kartaa wakhti kasta adigoo adeegsanaya amarka /accounts. Marka la saaro, cookie-yada si joogto ah ayaa loo tirtiraa. Haddii madashu joojiso aqbalaadda soo galitaanka, bot-ku wuu kuu sheegayaa.",
              "Boostooyinka lagu soo dejiyo akoon ku xiran laguma daabaco kanaalkeenna, lagamana siiyo isticmaalayaasha kale kaydka guud (shared cache).",
            ],
          },
          {
            heading: "Adeegyada dhinac saddexaad",
            body: [
              "Xogtaada ma iibinno, umana gudbinno dhinacyo saddexaad si ay ugu isticmaalaan ujeeddooyinkooda. Adeeggu wuxuu ku tiirsan yahay bixiyeyaashan soo socda, mid walbana xogta wuxuu u habeeyaa sida xeerarkiisa gaarka ah:",
            ],
            bullets: [
              `Telegram — shaqaynta bot-ka ${BOT}.`,
              "Cloudflare — ka ilaalinta bot-yada (Turnstile), gaarsiinta website-ka iyo marinta iimaylka.",
              "Google Analytics iyo Google Tag Manager — tirakoobka booqashooyinka.",
              "Yandex Metrica — tirakoobka booqashooyinka, khariidadda gujinta (click map) iyo Webvisor. Webvisor wuxuu duubaa ficillada bogga: dhaqdhaqaaqa tilmaamaha (pointer), hoos-u-dhaqaajinta (scrolling) iyo gujinta. Duubitaannada waxaa loo isticmaalaa oo keliya falanqaynta fududaanta isticmaalka website-ka.",
            ],
          },
          {
            heading: "Muddada aan xogta kaydinno",
            bullets: [
              "Faylasha la soo dejiyay si toos ah ayaa server-ka looga tirtiraa qiyaastii hal saac kadib markii la abuuray. Kayd (archive) muuqaalladaada ah ma hayno.",
              "Diiwaannada isku dayada soo dejinta waxaa la kaydiyaa inta looga baahan yahay ka hortagga ku-takri-falka iyo baaritaanka codsiyada.",
              "Xogta akoonka waxaa la kaydiyaa inta aad isticmaalayso adeegga, waxaana la tirtiraa markaad codsato.",
              "Diiwaannada server-ka waxaa la kaydiyaa muddo xaddidan, waxaana lagu beddelaa xog cusub marka ay wareegaan (rotation).",
            ],
          },
          {
            heading: "Meesha xogta lagu habeeyo",
            body: [
              "Server-yada adeeggu waxay ku yaallaan xarun xog (data centre) oo ku taal gudaha Midowga Yurub. Qaar ka mid ah bixiyeyaasha kor ku xusan waxay xogta ku habayn karaan meel ka baxsan, iyagoo raacaya siyaasadahooda gaarka ah.",
            ],
          },
          {
            heading: "Xuquuqdaada",
            body: [
              `Waxaad xaq u leedahay inaad hesho macluumaad ku saabsan habaynta xogtaada, inaad codsato in la saxo ama la tirtiro, inaad dib ula noqoto oggolaanshaha oo aad diido habaynta. Si tan loo sameeyo, noogu soo qor ${MAIL} adigoo ka soo diraya iimaylka ama akoonka Telegram ee codsigu khuseeyo.`,
              "Waxaan ku jawaabnaa muddo macquul ah, sida caadiga ah gudaha soddon maalmood oo kalandar ah. Tirtiridda akoonka waxay sidoo kale keentaa tirtiridda taariikhda soo dejinta ee ku xiran.",
            ],
          },
          {
            heading: "Carruurta",
            body: [
              "Adeeggu looguma talagalin, lamana beegsanayo carruurta ka yar 16 sano. Si ula kac ah uma uruurinno xogtooda; haddii tani si qalad ah u dhacday, noo soo qor, xogtana waa la tirtiri doonaa.",
            ],
          },
          {
            heading: "Isbeddellada",
            body: [
              "Waxaan cusboonaysiin karnaa Siyaasaddan. Taariikhda nuqulka hadda jira waxaa lagu muujiyay bogga korkiisa; isbeddellada muhiimka ah waxaan ku tilmaami doonnaa gudaha adeegga.",
            ],
          },
        ],
      },
      terms: {
        title: "Shuruudaha Isticmaalka",
        summary: `Xeerarka isticmaalka ${operator.site}: waxa la oggol yahay, waxa aan la oggolayn iyo shuruudaha uu adeeggu ku shaqeeyo.`,
        sections: [
          {
            heading: "Qodobbo guud",
            body: [
              `Shuruudahan waxay nidaamiyaan isticmaalka website-ka ${operator.site} iyo bot-ka Telegram ee ${BOT}. Milkiilaha iyo maamulaha adeeggu waa ${operator.nameSo}.`,
              "Markaad bilowdo isticmaalka adeegga, waxaad xaqiijinaysaa inaad akhriday Shuruudahan oo aad aqbashay. Haddii ay jirto shuruud aan kugu habboonayn, fadlan ha isticmaalin adeegga.",
            ],
          },
          {
            heading: "Adeeggu waa bilaash",
            body: [
              "Dhammaan waxa adeeggu bixiyo waa bilaash. Ma jiraan rukummo (subscriptions), qorshayaal lacag leh, tayooyin muuqaal oo lacag leh ama iibsasho gudaha adeegga ah.",
              "Xayeysiis ma soo bandhigno, mana dhigno link-yo iskaashi (affiliate links).",
            ],
          },
          {
            heading: "Shuruudaha helitaanka",
            bullets: [
              "Soo dejinta website-ka uma baahna akoon ama soo galid. Bot-ku isticmaalayaasha wuxuu ku kala saaraa akoonkooda Telegram.",
              "Xaddidaadyo farsamo oo saaran inta jeer ee codsiyada la soo diro ayaa adeegga ka ilaaliya culays xad-dhaaf ah iyo ku-takri-fal iskiis u shaqeeya.",
              "Soo dejinta YouTube waxay leedahay xad maalinle ah oo xogta la gudbiyo (traffic): 10 GB 24 saacadood gudahood shabakad kasta marka la isticmaalo website-ka iyo kordhiyaha, iyo 25 GB 24 saacadood gudahood akoon kasta oo Telegram ah marka la isticmaalo bot-ka. Xadkani ma khuseeyo madallada kale.",
              "Si aad wax ugu soo dejiso bot-ka uma baahnid inaad ku biirto kanaalkeenna. Bot-ku wuxuu qoraalka faylasha ku daraa link-ga kanaalka wararka ee mashruuca; ku biiristiisu waa ikhtiyaar.",
            ],
          },
          {
            heading: "Waxa adeeggu qabto",
            body: [
              "Adeeggu wuxuu u shaqeeyaa sidii dhexdhexaadiye farsamo: wuxuu raacaa link-ga aad bixiso, wuxuu faylka warbaahinta (media) ka soo qaadaa bog si guud loo heli karo, kadibna wuu kuu gudbiyaa.",
              "Ma haysanno buug-tusmeed (catalogue) muuqaallo ah, ma samayno raadin ku saabsan nuxurka (content) dadka kale, faylasha la soo dejiyayna kama kaydinno wax ka badan inta gudbintu u baahan tahay — qiyaastii hal saac.",
              "Shaqaynta madal gaar ah waxay ku xiran tahay go'aannada farsamo ee madashaas, waxayna isbeddeli kartaa ogeysiis la'aan.",
            ],
          },
          {
            heading: "Waajibaadkaaga",
            body: [
              "Adiga keligaa ayaa mas'uul ka ah sida aad u isticmaasho faylasha aad hesho, waxaadna xaqiijinaysaa inaad xaq u leedahay inaad sidaas samayso.",
            ],
            bullets: [
              "Soo deji oo keliya waxyaabaha aad leedahay xuquuqdooda, ama kuwa uu milkiilaha xuquuqdu ama sharcigu oggol yahay isticmaalkooda.",
              "Ha u isticmaalin adeegga ku xadgudubka xuquuqda qoraaga (copyright) ama xuquuqda la xiriirta (related rights), faafinta nuxur mamnuuc ah ama ku xadgudubka xuquuqda dadka kale.",
              "Ha isku dayin inaad ka gudubto xaddidaadyada farsamo ee adeegga, oo ay ku jiraan xaddidaadda inta jeer ee codsiyada iyo hubinta bot-yada.",
              "Ha abuurin culays iskiis u shaqeeya: codsiyo tiro badan, script-yo iyo scraper-yo lama oggola.",
            ],
          },
          {
            heading: "Wadaagista link-yada kanaalka",
            body: [
              "Markaad muuqaal ku soo dejiso bot-ka, waxaad oggolaanaysaa in link-ga boostada asalka ah lagu daabaco kanaalkeenna Telegram. Ogeysiis arrintan ku saabsan ayaa bot-ka lagu muujiyaa ka hor inta aadan dooran tayada — taasoo ah, ka hor inta aadan go'aansan inaad soo dejiso.",
              "Daabacaaddu waa mid qarsoodi ah (anonymous): kanaalka waxaa la geeyaa link-ga bogga si guud loo heli karo, cinwaanka muuqaalka iyo sawirka daboolka — isla sawirka ay madashu ku muujiso horudhaca (preview) boostadeeda. Lama sheego cidda soo dejisay. Faylka muuqaalka laftiisa marna meelna laguma daabaco: waxa la gudbiyo waa link-ga, kaas oo madallada laftoodu dadka ku dhiirrigeliyaan inay gudbiyaan iyagoo adeegsanaya badhanka “Wadaag” (Share) ee ka hooseeya boost kasta.",
              "Isla link-ga hal mar wax ka badan lama daabaco. Haddii aadan doonayn in link uu gaaro kanaalka, muuqaalkaas ha ku soo dejin adeeggeenna.",
              "Link-yada kooxaha iyo boostooyinka lagu soo dejiyo akoon ku xiran marna laguma daabaco kanaalka."
            ],
          },
          {
            heading: "Ku xiridda akoonkaaga",
            body: [
              "Markaad bot-ka ku xirto akoonkaaga madal, waxaad xaqiijinaysaa inuu yahay akoonkaaga oo aad xaq u leedahay inaad sidan u isticmaasho.",
              "Madalladu ma oggola soo dejinta iskiis u shaqaysa, waxayna xaddidi karaan ama xannibi karaan akoonka ku xiran. Khatartan adiga ayaa qaadanaya; waxaan kugula talinaynaa inaad ku xirto akoon labaad halkii aad ka xiri lahayd akoonkaaga ugu muhiimsan. Mas'uul kama nihin xaddidaadyada ay madashu saarto akoonkaaga.",
              "Akoonka koox lagu xiray waxaa loo isticmaalaa soo dejinta dhammaan xubnaheeda. Maamulayaasha kooxda (admins) ayaa go'aamiya cidda ku xiri karta akoonnada, waxayna ka saari karaan mid kasta oo ka mid ah.",
            ],
          },
          {
            heading: "Xaddidaadda mas'uuliyadda",
            body: [
              "Adeegga waxaa loo bixiyaa sida uu yahay (as is). Ma dammaanad qaadno shaqayn aan hakad lahayn, helitaanka madal gaar ah, ama in fayl uu ku habboonaado ujeeddadaada.",
              "Mas'uul kama nihin waxa aad ku samayso waxyaabaha aad soo dejiso, iyo cawaaqibka ka dhasha ku xadgudubkaaga xuquuqda dadka kale.",
              "Waxaan xaq u leenahay inaan beddelno waxa adeeggu bixiyo, inaan u hakinno dayactir, iyo inaan joojinno shaqayntiisa.",
            ],
          },
          {
            heading: "Xaddidaadda helitaanka",
            body: [
              "Waxaan xaddidi karnaa ama joojin karnaa helitaanka adeegga marka lagu xadgudbo Shuruudahan, marka la isku dayo in laga gudbo xaddidaadyada, ama marka la helo cabasho sabab leh oo ka timid milkiilaha xuquuqda.",
            ],
          },
          {
            heading: "Isbeddellada iyo sharciga lagu dabaqayo",
            body: [
              "Waxaan wax ka beddeli karnaa Shuruudahan; taariikhda nuqulka hadda dhaqan galka ah waxaa lagu muujiyay bogga korkiisa. Sii wadidda isticmaalka adeegga kadib isbeddel waxay ka dhigan tahay inaad aqbashay nuqulka cusub.",
              "Xiriirka dhinacyada waxaa lagu dabaqayaa sharciga Jamhuuriyadda Kazakhstan. Dhinacyadu waxay isku dayi doonaan inay khilaafaadka ku xalliyaan wada-xiriir qoraal ah, haddii aan heshiis la gaarinna, habka uu dejiyay sharciga Jamhuuriyadda Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Siyaasadda Cookie-ga",
        summary: `Cookie-yada uu ${operator.site} isticmaalo, waxa loogu talagalay iyo sida loo diido.`,
        sections: [
          {
            heading: "Waa maxay cookie-yadu",
            body: [
              "Cookie-yadu waa faylal qoraal ah oo yaryar oo website-ku ku kaydiyo biraawsarkaaga. Waxay u oggolaadaan adeegga inuu xasuusto dejintaada, waxayna suurtagelinayaan in la uruuriyo tirakoob booqasho oo aan qofka lagu aqoonsan karin.",
              "Cookie-yada ka sokow, dukumentigan wuxuu sidoo kale sharraxayaa tignoolajiyada la xiriirta: kaydka gudaha ee biraawsarka (local storage) iyo pixel-yada raad-raaca (tracking pixels).",
            ],
          },
          {
            heading: "Kuwa lagama maarmaanka ah",
            body: ["Iyaga la'aantood adeeggu ma shaqeeyo, sidaas darteed had iyo jeer waa la dejiyaa."],
            bullets: [
              "Cloudflare Turnstile — wuxuu hubiyaa in link-ga uu soo diray qof, ee uusan ahayn script.",
              "Dejinta interface-ka — luqadda iyo midabka muuqaalka (theme) ee aad dooratay.",
            ],
          },
          {
            heading: "Falanqaynta",
            body: [
              "Waxay naga caawiyaan inaan ogaanno boggaga la isticmaalo iyo meelaha khaladaadku ka dhacaan. Waxaa la dejiyaa oggolaanshahaaga, umana baahna adeeggu si uu u shaqeeyo.",
            ],
            bullets: [
              "Google Analytics iyo Google Tag Manager — booqashooyinka iyo dhaqanka website-ka, qaab aan qofka lagu aqoonsan karin.",
              "Yandex Metrica — booqashooyinka, khariidadda gujinta iyo Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor-ka Yandex Metrica wuxuu duubaa ficillada bogga: dhaqdhaqaaqa tilmaamaha, hoos-u-dhaqaajinta, gujinta iyo qorista goobta link-ga. Ujeeddadu waa inaan aragno meelaha interface-ku dadka ku jahwareeriyo.",
              "Duubitaannadan uma isticmaalno raad-raaca shakhsiyaad gaar ah. Fadlan ha gelin goobaha website-ka wax aadan rabin in la kaydiyo.",
            ],
          },
          {
            heading: "Sida loo diido",
            bullets: [
              "Ka xannib ama ka tirtir cookie-yada dejinta biraawsarkaaga — habkani wuxuu u shaqeeyaa dhammaan nidaamyada halkan ku xusan.",
              "Google Analytics: kordhiyaha biraawsarka ee rasmiga ah ee joojiya uruurinta waxaa laga heli karaa Google.",
              "Yandex Metrica: ka bixitaanku waa suurtagal iyadoo loo marayo kordhiyaha rasmiga ah ee Yandex.",
              "Joojinta cookie-yada lagama maarmaanka ah waxay soo dejinta ka dhigaysaa mid aan suurtagal ahayn.",
            ],
          },
          {
            heading: "Muddada kaydinta",
            body: [
              "Cookie-yada fadhiga (session cookies) waa la tirtiraa marka aad xirto biraawsarka ama marka muddada fadhigu dhammaato. Qalabka falanqaynta waxay aqoonsiyadooda kaydiyaan muddooyinka ay dejiyeen bixiyeyaashoodu.",
            ],
          },
        ],
      },
      copyright: {
        title: "Milkiilayaasha Xuquuqda",
        summary: "Mowqifka adeegga ee ku saabsan xuquuqda qoraaga iyo habka loo gudbiyo cabasho ku saabsan ku xadgudub.",
        sections: [
          {
            heading: "Mowqifkeenna",
            body: [
              "Adeeggu ma martigeliyo muuqaallo, mana hayo buug-tusmeed. Wuxuu u shaqeeyaa sidii dhexdhexaadiye farsamo: wuxuu raacaa link-ga uu isticmaaluhu geliyo, wuxuu gaaraa bog si guud loo heli karo, kadibna faylka wuxuu u gudbiyaa isticmaalahaas.",
              "Faylasha la soo dejiyay waxay server-ka ku jiraan qiyaastii hal saac, kadibna si toos ah ayaa loo tirtiraa. Nuqul joogto ah oo nuxurka dadka kale ah nagama hadho.",
              "Mas'uuliyadda isticmaalka waxyaabaha la soo dejiyay waxaa leh isticmaalaha, sida si cad loogu qoray Shuruudaha Isticmaalka.",
            ],
          },
          {
            heading: "Haddii xuquuqdaada lagu xadgudbo",
            body: [
              `Haddii aad tahay milkiilaha xuquuqda ama wakiilkiisa oo aad aaminsan tahay in adeegga loo isticmaalayo ku xadgudubka xuquuqdaada, noogu soo qor ${MAIL}. Cabashooyinka noocaas ah waan eegnaa, tallaabana waan ka qaadnaa.`,
            ],
          },
          {
            heading: "Waxa lagu daro cabashada",
            bullets: [
              "Shaqada ay khusayso iyo saldhigga aad ku leedahay xuquuqdeeda.",
              "Link-ga waxyaabaha la xiriira iyo, haddii la ogyahay, xaaladaha ku xadgudubka.",
              "Xogtaada xiriirka: magaca ama magaca hay'adda, cinwaanka iyo cinwaanka iimaylka.",
              "Haddii aad ku matalayso milkiilaha xuquuqda, caddaynta awooddaada matalaadda.",
              "Bayaan sheegaya in macluumaadka cabashadu sax yihiin, iyo in isticmaalka waxyaabaha aanu oggolaan milkiilaha xuquuqdu ama sharcigu.",
            ],
          },
          {
            heading: "Waxa aan samayn doonno",
            body: [
              "Cabashada waxaan dib u eegnaa muddo macquul ah, sida caadiga ah gudaha soddon maalmood oo kalandar ah, haddii ku xadgudubka la xaqiijiyana waxaan xannibnaa helitaanka waxyaabaha iyadoo loo marayo adeegga iyo, haddii loo baahdo, helitaanka adeegga ee ku xadgudbaha.",
              "Natiijada waxaan kuu soo sheegi doonnaa cinwaanka iimaylka aad bixisay.",
            ],
          },
          {
            heading: "Cabashooyinka niyad-xumada ah",
            body: [
              "Cabasho ay ku jiraan macluumaad been ah oo si ula kac ah loo bixiyay waxay cabashada gudbiyaha ka dhigi kartaa mid mas'uul ka ah sida uu dhigayo sharciga khuseeya. Waxaan diidi karnaa inaan eegno cabasho aan aqoonsanayn milkiilaha xuquuqda iyo waxyaabaha lagu muransan yahay midkoodna.",
            ],
          },
        ],
      },
    },
  },
  az: {
    ui: {
      updated: "Redaksiya tarixi",
      back: "Ana səhifəyə",
      operatorHeading: "Xidmətin operatoru",
      navHeading: "Digər sənədlər",
      labels: {
        privacy: "Məxfilik siyasəti",
        terms: "İstifadəçi razılaşması",
        cookies: "Cookie siyasəti",
        copyright: "Hüquq sahiblərinə",
      },
    },
    docs: {
      privacy: {
        title: "Məxfilik siyasəti",
        summary: `${operator.site} hansı məlumatları toplayır, onlar nə üçün lazımdır, nə qədər saxlanılır və onları necə silmək olar.`,
        sections: [
          {
            heading: "Ümumi müddəalar",
            body: [
              `Bu Siyasət ${operator.site} xidmətinin hansı fərdi məlumatları və hansı məqsədlə emal etdiyini təsvir edir. Məlumatların operatoru qismində ${operator.nameAz} çıxış edir.`,
              "Xidmətdən istifadə etməklə siz burada təsvir olunan emal qaydası ilə razılaşırsınız. Əgər onunla razı deyilsinizsə, lütfən, xidmətdən istifadə etməyin.",
              "Emal Qazaxıstan Respublikasının «Fərdi məlumatlar və onların qorunması haqqında» Qanununa uyğun olaraq, Avropa İqtisadi Zonasından olan ziyarətçilərə münasibətdə isə GDPR tələbləri nəzərə alınmaqla həyata keçirilir.",
            ],
          },
          {
            heading: "Hansı məlumatları emal edirik",
            body: [
              "Biz bilərəkdən xidmətin işləməsi üçün zəruri olandan artıq heç nə toplamırıq və sənədləri, ödəniş məlumatlarını və ya ünvanı tələb etmirik.",
            ],
            bullets: [
              "Bota yazdığınız zaman onun aldığı Telegram hesabı məlumatları: rəqəmsal identifikator, istifadəçi adı, ad və dil kodu.",
              "Yükləmək üçün göndərdiyiniz linklər və cəhdin özü haqqında məlumatlar: platforma, tarix və vaxt, seçilmiş keyfiyyət, nəticə (uğur və ya xəta).",
              "Qoşulmanın texniki məlumatları: IP ünvanı, brauzerin növü və versiyası, dil, keçidin edildiyi səhifə. Bu məlumatlar server jurnallarına və veb-analitika sistemlərinə düşür.",
              "Cookie faylları və analitika identifikatorları — ətraflı məlumat Cookie siyasətindədir.",
            ],
          },
          {
            heading: "Bu məlumatlar nə üçün lazımdır",
            bullets: [
              "Xidmətin özünü göstərmək: linkiniz üzrə videonu əldə etmək və faylı sizə vermək.",
              "Hesabınızı başqalarının hesabından fərqləndirmək və sui-istifadələrin qarşısını almaq.",
              "Xidməti avtomatlaşdırılmış sui-istifadələrdən qorumaq: link göndərilməzdən əvvəl Cloudflare Turnstile yoxlaması.",
              "Saytdan necə istifadə olunduğunu anlamaq və xətaları aradan qaldırmaq — anonimləşdirilmiş və ümumiləşdirilmiş statistika.",
              "Sizin müraciətlərinizə və hüquq sahiblərinin müraciətlərinə cavab vermək.",
              "Xidmət haqqında fikrinizi öyrənmək üçün arabir sizə Telegram-da yazmaq — məsələn, ondan istifadəni dayandırmısınızsa. Cavab vermək məcburi deyil; belə mesajlar sizə lazım deyilsə, sadəcə bunu bildirin və biz daha yazmayacağıq.",
            ],
          },
          {
            heading: "Emalın əsasları",
            body: [
              "Telegram hesabı məlumatları və yükləmələr haqqında məlumatlar xidmətdən istifadəyə başlamaqla qəbul etdiyiniz İstifadəçi razılaşmasının icrası üçün emal olunur.",
              "Analitika cookie faylları və saytdakı hərəkətlərin qeydə alınması istənilən vaxt geri götürə biləcəyiniz razılığınız əsasında emal olunur — bunun üsulları Cookie siyasətində təsvir edilib.",
              "Server jurnalları və botlardan qorunma xidməti işlək və təhlükəsiz saxlamaqda qanuni marağımız çərçivəsində emal olunur.",
              "Xidmət haqqında fikrinizlə bağlı suallar xidməti təkmilləşdirməkdə qanuni marağımız çərçivəsində verilir; siz istənilən vaxt onlardan imtina edə bilərsiniz.",
            ],
          },
          {
            heading: "Qoşulmuş hesablar",
            body: [
              "İstəsəniz, platformadakı hesabınızı (Instagram, Facebook, YouTube, X, VK, TikTok) bota qoşa bilərsiniz ki, bot yalnız daxil olmuş istifadəçilərə görünən paylaşımları — hekayələri (stories), qapalı paylaşımları yükləsin. Bunun üçün bot həmin hesabın cookie fayllarını alır — Videoner genişlənməsindən birdəfəlik kod vasitəsilə və ya sizin göndərdiyiniz fayldan.",
              "Biz yalnız seçilmiş platformanın cookie fayllarını saxlayırıq, qalanlarını dərhal silirik. Onlar şifrələnmiş şəkildə saxlanılır və yalnız onları qoşduğunuz yerdəki yükləmələr üçün istifadə olunur. Şəxsi çatda qoşulanlar sizin yükləmələriniz üçün, o cümlədən öz hesabı qoşulmamış qruplarda sizin öz linkləriniz üçün istifadə olunur; başqalarının linkləri üçün onlardan istifadə edilmir. Qrupa qoşulanlar yalnız həmin qrupun üzvlərinin yükləmələri üçün istifadə olunur və başqa heç yerdə tətbiq edilmir.",
              "Əsas sizin razılığınızdır: hesabı özünüz qoşursunuz və istənilən vaxt /accounts əmri ilə onu silə bilərsiniz. Silindikdə cookie faylları geri qaytarılmaz şəkildə məhv edilir. Platforma girişi qəbul etməyi dayandırarsa, bot bu barədə sizə bildirir.",
              "Qoşulmuş hesab vasitəsilə yüklənmiş paylaşımlar kanalımızda dərc olunmur və ümumi keşdən digər istifadəçilərə verilmir.",
            ],
          },
          {
            heading: "Üçüncü tərəf xidmətləri",
            body: [
              "Biz məlumatlarınızı satmırıq və onları üçüncü şəxslərə onların öz məqsədləri üçün ötürmürük. Xidmətin işləməsi üçün aşağıdakı təchizatçılar cəlb olunub və onların hər biri məlumatları öz qaydalarına uyğun emal edir:",
            ],
            bullets: [
              `Telegram — ${BOT} botunun işləməsi.`,
              "Cloudflare — botlardan qorunma (Turnstile), saytın çatdırılması və poçtun marşrutlaşdırılması.",
              "Google Analytics və Google Tag Manager — ziyarət statistikası.",
              "Yandex Metrica — ziyarət statistikası, klik xəritəsi və Webvisor. Webvisor səhifədəki hərəkətləri qeydə alır: göstəricinin hərəkəti, səhifənin sürüşdürülməsi və kliklər. Qeydlər yalnız saytın istifadə rahatlığını təhlil etmək üçün istifadə olunur.",
            ],
          },
          {
            heading: "Məlumatları nə qədər saxlayırıq",
            bullets: [
              "Yüklənmiş fayllar yaradıldıqdan təxminən bir saat sonra serverdən avtomatik silinir. Biz videolarınızın arxivini saxlamırıq.",
              "Yükləmə cəhdləri haqqında qeydlər sui-istifadələrin qarşısını almaq və müraciətlərə baxmaq üçün lazım olduğu müddətdə saxlanılır.",
              "Hesab məlumatları siz xidmətdən istifadə etdiyiniz müddətdə saxlanılır və sorğunuz əsasında silinir.",
              "Server jurnalları məhdud müddət ərzində saxlanılır və rotasiya getdikcə üzərinə yenidən yazılır.",
            ],
          },
          {
            heading: "Məlumatlar harada emal olunur",
            body: [
              "Xidmətin serverləri Avropa İttifaqı ərazisindəki data-mərkəzdə yerləşir. Yuxarıda sadalanan təchizatçıların bir qismi öz siyasətlərinə uyğun olaraq məlumatları onun hüdudlarından kənarda emal edə bilər.",
            ],
          },
          {
            heading: "Hüquqlarınız",
            body: [
              `Siz məlumatlarınızın emalı haqqında məlumat almaq, onların düzəldilməsini və ya silinməsini tələb etmək, razılığınızı geri götürmək və emala etiraz etmək hüququna maliksiniz. Bunun üçün müraciətlə əlaqəli olan e-poçt ünvanından və ya Telegram hesabından ${MAIL} ünvanına yazın.`,
              "Biz ağlabatan müddətdə, bir qayda olaraq otuz təqvim günü ərzində cavab veririk. Hesabın silinməsi onunla əlaqəli yükləmə tarixçəsinin də silinməsinə səbəb olur.",
            ],
          },
          {
            heading: "Yetkinlik yaşına çatmayanlar",
            body: [
              "Xidmət 16 yaşından kiçik uşaqlar üçün nəzərdə tutulmayıb və onlara ünvanlanmayıb. Biz bilərəkdən belə istifadəçilərin məlumatlarını toplamırıq; əgər bu, səhvən baş veribsə, bizə yazın və məlumatlar silinəcək.",
            ],
          },
          {
            heading: "Dəyişikliklər",
            body: [
              "Biz bu Siyasəti yeniləyə bilərik. Qüvvədə olan redaksiyanın tarixi səhifənin əvvəlində göstərilib; əhəmiyyətli dəyişiklikləri xidmətdə qeyd edəcəyik.",
            ],
          },
        ],
      },
      terms: {
        title: "İstifadəçi razılaşması",
        summary: `${operator.site} xidmətindən istifadə qaydaları: nəyə icazə verilir, nə qadağandır və xidmət hansı şərtlərlə işləyir.`,
        sections: [
          {
            heading: "Ümumi müddəalar",
            body: [
              `Bu Razılaşma ${operator.site} saytından və ${BOT} Telegram botundan istifadəni tənzimləyir. Xidmətin sahibi və administratoru — ${operator.nameAz}.`,
              "Xidmətdən istifadəyə başlamaqla siz şərtləri oxuduğunuzu və onları qəbul etdiyinizi təsdiq edirsiniz. Hər hansı şərt sizə uyğun deyilsə, xidmətdən istifadə etməməlisiniz.",
            ],
          },
          {
            heading: "Xidmət pulsuzdur",
            body: [
              "Xidmətin bütün imkanları pulsuz təqdim olunur. Bizdə abunəliklər, ödənişli tariflər, ödənişli video keyfiyyətləri və daxili alışlar yoxdur.",
              "Biz reklam göstərmirik və tərəfdaş linkləri yerləşdirmirik.",
            ],
          },
          {
            heading: "Giriş şərtləri",
            bullets: [
              "Saytda yükləmək üçün nə hesab, nə də giriş tələb olunur. Bot istifadəçiləri onların Telegram hesabına görə fərqləndirir.",
              "Xidməti həddən artıq yüklənmədən və avtomatlaşdırılmış sui-istifadələrdən sorğu tezliyinə dair texniki məhdudiyyətlər qoruyur.",
              "YouTube üçün gündəlik trafik limiti qüvvədədir: saytda və genişlənmədə bir şəbəkədən 24 saat ərzində 10 GB, botda isə bir Telegram hesabına 24 saat ərzində 25 GB. Bu limit digər platformalara şamil edilmir.",
              "Bot vasitəsilə yükləmək üçün kanalımıza abunə olmaq tələb olunmur. Bot faylların mətninə layihənin xəbər kanalının linkini əlavə edir; ona abunə olmaq məcburi deyil.",
            ],
          },
          {
            heading: "Xidmət nə edir",
            body: [
              "Xidmət texniki vasitəçidir: linkiniz üzrə ictimaiyyət üçün əlçatan səhifəyə müraciət edir, media faylı əldə edir və onu sizə ötürür.",
              "Biz özümüzdə video kataloqu yerləşdirmirik, başqalarının kontenti üzrə axtarış aparmırıq və yüklənmiş faylları ötürülmə üçün zəruri olan vaxtdan — təxminən bir saatdan artıq saxlamırıq.",
              "Konkret platformanın əlçatanlığı onun texniki qərarlarından asılıdır və xəbərdarlıq edilmədən dəyişə bilər.",
            ],
          },
          {
            heading: "İstifadəçinin öhdəlikləri",
            body: [
              "Əldə etdiyiniz fayllardan necə istifadə etdiyinizə görə yalnız siz cavabdehsiniz və buna hüququnuz olduğunu təsdiq edirsiniz.",
            ],
            bullets: [
              "Yalnız hüquqları sizə məxsus olan və ya istifadəsinə hüquq sahibi yaxud qanun tərəfindən icazə verilən materialı yükləyin.",
              "Xidmətdən müəllif hüququnu və əlaqəli hüquqları pozmaq, qadağan olunmuş kontenti yaymaq və üçüncü şəxslərin hüquqlarını pozmaq üçün istifadə etməyin.",
              "Xidmətin texniki məhdudiyyətlərindən, o cümlədən sorğu tezliyi məhdudiyyətlərindən və bot yoxlamasından yan keçməyə cəhd etməyin.",
              "Avtomatlaşdırılmış yük yaratmayın: kütləvi sorğulara, skriptlərə və parserlərə yol verilmir.",
            ],
          },
          {
            heading: "Linklərin kanalda dərc edilməsi",
            body: [
              "Bot vasitəsilə video yükləməklə siz orijinal paylaşımın linkinin Telegram kanalımızda dərc ediləcəyi ilə razılaşırsınız. Bu barədə xəbərdarlıq botda keyfiyyəti seçməzdən əvvəl — yəni yükləmək qərarını verməzdən əvvəl göstərilir.",
              "Dərc anonimdir: kanala ictimaiyyət üçün əlçatan səhifənin linki, videonun adı və onun örtüyü — platformanın paylaşımın önizləməsində göstərdiyi həmin kadr göndərilir. Videonu kimin yüklədiyi göstərilmir. Video faylın özü heç yerdə və heç vaxt dərc olunmur: yayılan yalnız linkdir — platformaların özlərinin hər paylaşımın altındakı «Paylaş» düyməsi ilə yaymağı təklif etdiyi link.",
              "Eyni link bir dəfədən artıq dərc olunmur. Linkin kanala düşməsini istəmirsinizsə, həmin videonu xidmətimiz vasitəsilə yükləməyin.",
              "Qruplardan olan linklər və qoşulmuş hesab vasitəsilə yüklənmiş paylaşımlar kanalda dərc olunmur."
            ],
          },
          {
            heading: "Öz hesabınızın qoşulması",
            body: [
              "Platformadakı hesabınızı bota qoşmaqla siz bunun sizin hesabınız olduğunu və onun barəsində sərəncam vermək hüququnuz olduğunu təsdiq edirsiniz.",
              "Platformalar avtomatik yükləmələri bəyənmir və qoşulmuş hesabı məhdudlaşdıra və ya bloklaya bilər. Bu riski siz öz üzərinizə götürürsünüz; əsas hesabınızı deyil, ayrıca hesab qoşmağı tövsiyə edirik. Platformanın hesabınıza tətbiq edəcəyi məhdudiyyətlərə görə biz məsuliyyət daşımırıq.",
              "Qrupa qoşulmuş hesab onun bütün üzvlərinin yükləmələri üçün istifadə olunur. Hesabları kimin qoşa biləcəyinə qrupun administratorları qərar verir və onlar istənilən hesabı silə bilər.",
            ],
          },
          {
            heading: "Məsuliyyətin məhdudlaşdırılması",
            body: [
              "Xidmət «olduğu kimi» şərti ilə təqdim olunur. Biz fasiləsiz işə, konkret platformanın əlçatanlığına və ya faylın məqsədləriniz üçün yararlılığına zəmanət vermirik.",
              "Yüklənmiş materialdan necə istifadə etdiyinizə və üçüncü şəxslərin hüquqlarını pozmağınızın nəticələrinə görə biz məsuliyyət daşımırıq.",
              "Biz imkanların tərkibini dəyişmək, texniki xidmət üçün xidmətin işini dayandırmaq və onun fəaliyyətinə xitam vermək hüququna malikik.",
            ],
          },
          {
            heading: "Girişin məhdudlaşdırılması",
            body: [
              "Bu şərtlər pozulduqda, məhdudiyyətlərdən yan keçməyə cəhd edildikdə, habelə hüquq sahibindən əsaslandırılmış şikayət daxil olduqda biz xidmətə girişi məhdudlaşdıra və ya dayandıra bilərik.",
            ],
          },
          {
            heading: "Dəyişikliklər və tətbiq olunan hüquq",
            body: [
              "Biz şərtləri dəyişə bilərik; qüvvədə olan redaksiyanın tarixi səhifənin əvvəlində göstərilib. Dəyişikliklərdən sonra xidmətdən istifadəni davam etdirməklə siz yeni redaksiyanı qəbul edirsiniz.",
              "Tərəflər arasındakı münasibətlərə Qazaxıstan Respublikasının hüququ tətbiq edilir. Tərəflər mübahisələri yazışma yolu ilə həll etməyə çalışırlar, razılığa gəlinmədikdə isə — Qazaxıstan Respublikasının qanunvericiliyi ilə müəyyən edilmiş qaydada.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie siyasəti",
        summary: `${operator.site} hansı cookie fayllarından istifadə edir, onlar nə üçün lazımdır və onlardan necə imtina etmək olar.`,
        sections: [
          {
            heading: "Cookie nədir",
            body: [
              "Cookie — saytın brauzerinizdə saxladığı kiçik mətn fayllarıdır. Onlar parametrlərinizi yadda saxlamağa və anonimləşdirilmiş ziyarət statistikasını toplamağa imkan verir.",
              "Bu sənəddə cookie ilə yanaşı oxşar texnologiyaları da — brauzerin lokal yaddaşını və piksel sayğaclarını təsvir edirik.",
            ],
          },
          {
            heading: "Zəruri",
            body: [
              "Onlarsız xidmət işləmir, buna görə də onlar həmişə quraşdırılır.",
            ],
            bullets: [
              "Cloudflare Turnstile — linki skriptin deyil, insanın göndərdiyinin yoxlanılması.",
              "İnterfeys parametrləri — seçilmiş dil və tərtibat mövzusu.",
            ],
          },
          {
            heading: "Analitik",
            body: [
              "Onlar hansı səhifələrdən istifadə olunduğunu və xətaların harada yarandığını anlamağa kömək edir. Razılığınızla quraşdırılır və xidmətin işləməsi üçün məcburi deyil.",
            ],
            bullets: [
              "Google Analytics və Google Tag Manager — anonimləşdirilmiş şəkildə ziyarətçi sayı və saytdakı davranış.",
              "Yandex Metrica — ziyarətçi sayı, klik xəritəsi və Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica-nın Webvisor aləti səhifədəki hərəkətləri qeydə alır: göstəricinin hərəkəti, səhifənin sürüşdürülməsi, kliklər və link sahəsinə daxil edilən mətn. Bu, interfeysin harada çaşqınlıq yaratdığını görmək üçün lazımdır.",
              "Biz bu qeydlərdən konkret insanları izləmək üçün istifadə etmirik. Saytın sahələrinə saxlanılmasını istəmədiyiniz məlumatları daxil etməyin.",
            ],
          },
          {
            heading: "Necə imtina etmək olar",
            bullets: [
              "Brauzerinizdə cookie fayllarının bloklanmasını və ya silinməsini tənzimləyin — bu üsul sadalanan bütün sistemlər üçün işləyir.",
              "Google Analytics: məlumat toplanmasını söndürən rəsmi brauzer əlavəsi Google saytında mövcuddur.",
              "Yandex Metrica: imtina Yandex-in rəsmi əlavəsi vasitəsilə mümkündür.",
              "Zəruri cookie fayllarının söndürülməsi yükləməni qeyri-mümkün edəcək.",
            ],
          },
          {
            heading: "Saxlama müddətləri",
            body: [
              "Sessiya cookie faylları brauzer bağlandıqda və ya sessiyanın müddəti başa çatdıqda silinir. Analitik sayğaclar identifikatorları öz təchizatçılarının müəyyən etdiyi müddətlər ərzində saxlayır.",
            ],
          },
        ],
      },
      copyright: {
        title: "Hüquq sahiblərinə",
        summary: "Xidmətin müəllif hüququ ilə bağlı mövqeyi və pozuntu barədə şikayətin verilməsi qaydası.",
        sections: [
          {
            heading: "Xidmətin mövqeyi",
            body: [
              "Xidmət özündə video yerləşdirmir və onların kataloqunu aparmır. O, texniki vasitəçi kimi çıxış edir: istifadəçinin daxil etdiyi link üzrə ictimaiyyət üçün əlçatan səhifəyə müraciət edir və faylı istifadəçiyə ötürür.",
              "Yüklənmiş fayllar serverdə təxminən bir saat saxlanılır və avtomatik silinir. Bizdə başqalarının kontentinin daimi surəti qalmır.",
              "Yüklənmiş materialın istifadəsinə görə məsuliyyəti istifadəçi daşıyır — bu, İstifadəçi razılaşmasında birbaşa təsbit olunub.",
            ],
          },
          {
            heading: "Hüquqlarınız pozulubsa",
            body: [
              `Əgər siz hüquq sahibi və ya onun nümayəndəsisinizsə və xidmətin hüquqlarınızı pozmaq üçün istifadə olunduğunu hesab edirsinizsə, ${MAIL} ünvanına yazın. Biz belə müraciətlərə baxırıq və tədbirlər görürük.`,
            ],
          },
          {
            heading: "Müraciətdə nə göstərilməlidir",
            bullets: [
              "Hansı əsərə toxunulduğu və hansı əsasla ona hüquqlarınızın olduğu.",
              "Materialın linki və məlumdursa, pozuntunun halları.",
              "Əlaqə məlumatlarınız: ad və ya təşkilatın adı, ünvan və e-poçt ünvanı.",
              "Hüquq sahibinin adından çıxış edirsinizsə — səlahiyyətlərinizin təsdiqi.",
              "Müraciətdəki məlumatların doğru olduğu və materialın istifadəsinə hüquq sahibi və ya qanun tərəfindən icazə verilmədiyi barədə bəyanat.",
            ],
          },
          {
            heading: "Biz nə edəcəyik",
            body: [
              "Biz müraciətə ağlabatan müddətdə, bir qayda olaraq otuz təqvim günü ərzində baxırıq və pozuntu təsdiqləndikdə xidmət vasitəsilə materiala girişi, zəruri hallarda isə pozuntuya yol verən şəxsin xidmətə girişini məhdudlaşdırırıq.",
              "Baxılmanın nəticələri barədə göstərdiyiniz e-poçt ünvanına məlumat verəcəyik.",
            ],
          },
          {
            heading: "Vicdansız müraciətlər",
            body: [
              "Bilərəkdən yanlış məlumatlar ehtiva edən müraciət qanunvericiliyə uyğun olaraq müraciət edənin məsuliyyətinə səbəb ola bilər. Müraciət nə hüquq sahibini, nə də mübahisəli materialı müəyyən etməyə imkan vermirsə, biz ona baxmaqdan imtina etmək hüququna malikik.",
            ],
          },
        ],
      },
    },
  },
  ky: {
    ui: {
      updated: "Редакциянын күнү",
      back: "Башкы бетке",
      operatorHeading: "Сервистин оператору",
      navHeading: "Башка документтер",
      labels: {
        privacy: "Купуялуулук саясаты",
        terms: "Колдонуучу келишими",
        cookies: "Cookie саясаты",
        copyright: "Укук ээлерине",
      },
    },
    docs: {
      privacy: {
        title: "Купуялуулук саясаты",
        summary: `${operator.site} кандай маалыматтарды чогултат, алар эмне үчүн керек, канча убакыт сакталат жана аларды кантип өчүрүүгө болот.`,
        sections: [
          {
            heading: "Жалпы жоболор",
            body: [
              `Бул Саясат ${operator.site} сервиси кандай жеке маалыматтарды жана кандай максатта иштетээрин сүрөттөйт. Маалыматтардын оператору — ${operator.nameKy}.`,
              "Сервисти колдонуу менен Сиз бул жерде сүрөттөлгөн иштетүү тартибине макулдугуңузду бересиз. Эгер Сиз аны менен макул болбосоңуз, сураныч, сервисти колдонбоңуз.",
              "Иштетүү Казакстан Республикасынын «Жеке маалыматтар жана аларды коргоо жөнүндө» Мыйзамына ылайык, ал эми Европа экономикалык аймагынан келген зыяратчыларга карата GDPR талаптарын эске алуу менен жүргүзүлөт.",
            ],
          },
          {
            heading: "Биз кандай маалыматтарды иштетебиз",
            body: [
              "Биз атайылап сервистин иштеши үчүн зарыл болгондон ашыкча эч нерсе чогултпайбыз жана документтерди, төлөм маалыматтарын же даректи сурабайбыз.",
            ],
            bullets: [
              "Сиз ботко жазганда ал ала турган Telegram эсептик жазуусунун маалыматтары: сандык идентификатор, колдонуучунун аты, аты жана тил коду.",
              "Сиз жүктөп алуу үчүн жөнөткөн шилтемелер жана аракеттин өзү тууралуу маалыматтар: аянтча, күнү жана убактысы, тандалган сапат, натыйжа (ийгиликтүү же ката).",
              "Туташуунун техникалык маалыматтары: IP дарек, браузердин түрү жана версиясы, тил, өтүү жасалган барак. Алар сервердин журналдарына жана веб-аналитика системаларына түшөт.",
              "Cookie файлдары жана аналитика идентификаторлору — кененирээк Cookie саясатында.",
            ],
          },
          {
            heading: "Бул маалыматтар эмне үчүн керек",
            bullets: [
              "Кызматтын өзүн көрсөтүү: Сиздин шилтемеңиз боюнча видеону алуу жана файлды Сизге берүү.",
              "Сиздин эсептик жазууңузду башкалардыкынан айырмалоо жана кыянаттык менен пайдаланууга каршы аракет кылуу.",
              "Сервисти автоматташтырылган кыянаттык менен пайдалануудан коргоо: шилтеме жөнөтүлгөнгө чейин Cloudflare Turnstile текшерүүсү.",
              "Сайт кантип колдонуларын түшүнүү жана каталарды оңдоо — жеке мүнөздөн ажыратылган жана жалпыланган статистика.",
              "Сиздин жана укук ээлеринин кайрылууларына жооп берүү.",
              "Сервис тууралуу пикириңизди билүү үчүн Сизге Telegram аркылуу анда-санда жазуу — мисалы, эгер Сиз аны колдонбой калсаңыз. Жооп берүү милдеттүү эмес; эгер мындай билдирүүлөр Сизге керек болбосо, жөн гана бул тууралуу айтыңыз, биз мындан ары жазбайбыз.",
            ],
          },
          {
            heading: "Иштетүүнүн негиздери",
            body: [
              "Telegram эсептик жазуусунун маалыматтары жана жүктөп алуулар тууралуу маалыматтар Сиз сервисти колдоно баштаганда кабыл ала турган Колдонуучу келишимин аткаруу үчүн иштетилет.",
              "Аналитикалык cookie файлдары жана сайттагы аракеттерди жазуу Сиздин макулдугуңуздун негизинде иштетилет, аны Сиз каалаган убакта кайра чакырып ала аласыз — жолдору Cookie саясатында сүрөттөлгөн.",
              "Сервердин журналдары жана боттордон коргоо сервисти иштөөгө жөндөмдүү жана корголгон абалда кармоодогу биздин мыйзамдуу кызыкчылыгыбыздын алкагында иштетилет.",
              "Сервис тууралуу пикириңизди сураган суроолор — сервисти жакшыртуудагы биздин мыйзамдуу кызыкчылыгыбыздын алкагында; Сиз алардан каалаган убакта баш тарта аласыз.",
            ],
          },
          {
            heading: "Туташтырылган аккаунттар",
            body: [
              "Каалооңуз боюнча Сиз ботко аянтчадагы (Instagram, Facebook, YouTube, X, VK, TikTok) өз аккаунтуңузду туташтыра аласыз, ошондо бот кирген колдонуучуларга гана көрүнгөн жазууларды жүктөп ала алат: сторис, жабык жарыялоолор. Бул үчүн бот ошол аккаунттун куки файлдарын алат — Videoner кеңейтүүсүнөн бир жолку код аркылуу же Сиз жөнөткөн файлдан.",
              "Биз тандалган аянтчанын гана куки файлдарын сактайбыз, калгандарын дароо жок кылабыз. Алар шифрленген түрдө сакталат жана Сиз аларды туташтырган жерде жүктөп алуулар үчүн гана колдонулат. Жеке жазышууда туташтырылгандары — Сиздин жүктөп алууларыңыз үчүн, анын ичинде өз аккаунту туташтырылбаган топтордогу Сиздин өз шилтемелериңиз үчүн; башкалардын шилтемелери үчүн алар колдонулбайт. Топко туташтырылгандары — анын катышуучуларынын жүктөп алуулары үчүн гана, башка эч жерде колдонулбайт.",
              "Негиз — Сиздин макулдугуңуз: аккаунтту Сиз өзүңүз туташтырасыз жана аны каалаган убакта /accounts буйругу менен өчүрө аласыз. Өчүрүлгөндө куки файлдары кайтарылгыс түрдө жок кылынат. Эгер аянтча кирүүнү кабыл албай калса, бот бул тууралуу Сизге билдирет.",
              "Туташтырылган аккаунт аркылуу жүктөлүп алынган жазуулар биздин каналда жарыяланбайт жана жалпы кештен башка колдонуучуларга берилбейт.",
            ],
          },
          {
            heading: "Үчүнчү тараптын сервистери",
            body: [
              "Биз Сиздин маалыматтарыңызды үчүнчү жактарга алардын өз максаттары үчүн сатпайбыз жана бербейбиз. Сервистин иштеши үчүн төмөнкү жеткирүүчүлөр тартылган, алардын ар бири маалыматтарды өз эрежелери боюнча иштетет:",
            ],
            bullets: [
              "Telegram — " + BOT + " ботунун иштеши.",
              "Cloudflare — боттордон коргоо (Turnstile), сайтты жеткирүү жана почтаны багыттоо.",
              "Google Analytics жана Google Tag Manager — кирүүлөрдүн статистикасы.",
              "Яндекс.Метрика — кирүүлөрдүн статистикасы, чыкылдатуулар картасы жана Вебвизор. Вебвизор барактагы аракеттерди жазат: көрсөткүчтүн жылышын, жылдырууну жана чыкылдатууларды. Жазуулар сайттын ыңгайлуулугун талдоо үчүн гана колдонулат.",
            ],
          },
          {
            heading: "Биз маалыматтарды канча убакыт сактайбыз",
            bullets: [
              "Жүктөлүп алынган файлдар түзүлгөндөн болжол менен бир сааттан кийин серверден автоматтык түрдө өчүрүлөт. Биз Сиздин видеолоруңуздун архивин сактабайбыз.",
              "Жүктөп алуу аракеттери тууралуу жазуулар кыянаттык менен пайдаланууга каршы аракет кылуу жана кайрылууларды кароо үчүн керек болгонго чейин сакталат.",
              "Эсептик жазуунун маалыматтары Сиз сервисти колдонуп жүргөн убакта сакталат жана Сиздин сурооңуз боюнча өчүрүлөт.",
              "Сервердин журналдары чектелген убакытка сакталат жана ротацияга жараша кайра жазылат.",
            ],
          },
          {
            heading: "Маалыматтар кайда иштетилет",
            body: [
              "Сервистин серверлери Европа Биримдигинин аймагындагы маалымат борборунда жайгашкан. Жогоруда саналган жеткирүүчүлөрдүн бир бөлүгү маалыматтарды өз саясаттарына ылайык анын чегинен тышкары иштетиши мүмкүн.",
            ],
          },
          {
            heading: "Сиздин укуктарыңыз",
            body: [
              `Сиз өз маалыматтарыңызды иштетүү тууралуу маалымат алууга, аларды оңдоону же өчүрүүнү талап кылууга, макулдугуңузду кайра чакырып алууга жана иштетүүгө каршы чыгууга укуктуусуз. Бул үчүн кайрылууга байланыштуу почтадан же Telegram аккаунтунан ${MAIL} дарегине жазыңыз.`,
              "Биз акылга сыярлык мөөнөттө, эреже катары отуз календардык күндүн ичинде жооп беребиз. Эсептик жазууну өчүрүү ага байланыштуу жүктөп алуулар тарыхынын өчүрүлүшүнө алып келет.",
            ],
          },
          {
            heading: "Жашы жете электер",
            body: [
              "Сервис 16 жашка чейинки балдар үчүн арналган эмес жана аларга багытталган эмес. Биз мындай колдонуучулардын маалыматтарын атайылап чогултпайбыз; эгер бул жаңылыштык менен болуп калса, бизге жазыңыз, маалыматтар өчүрүлөт.",
            ],
          },
          {
            heading: "Өзгөртүүлөр",
            body: [
              "Биз бул Саясатты жаңыртып турушубуз мүмкүн. Учурдагы редакциянын күнү барактын башында көрсөтүлгөн; олуттуу өзгөртүүлөрдү биз сервисте белгилеп турабыз.",
            ],
          },
        ],
      },
      terms: {
        title: "Колдонуучу келишими",
        summary: `${operator.site} колдонуу эрежелери: эмне кылууга болот, эмне кылууга болбойт жана сервис кандай шарттарда иштейт.`,
        sections: [
          {
            heading: "Жалпы жоболор",
            body: [
              `Келишим ${operator.site} сайтын жана ${BOT} Telegram-ботун колдонууну жөнгө салат. Сервистин ээси жана администратору — ${operator.nameKy}.`,
              "Сервисти колдоно баштоо менен Сиз шарттарды окуп чыкканыңызды жана аларды кабыл алганыңызды тастыктайсыз. Эгер кайсы бир шарт Сизге туура келбесе, сервисти колдонбошуңуз керек.",
            ],
          },
          {
            heading: "Сервис акысыз",
            body: [
              "Сервистин бардык мүмкүнчүлүктөрү акысыз берилет. Бизде жазылуулар, акы төлөнүүчү тарифтер, видеонун акы төлөнүүчү сапаттары жана ички сатып алуулар жок.",
              "Биз жарнама көрсөтпөйбүз жана өнөктөштүк шилтемелерди жайгаштырбайбыз.",
            ],
          },
          {
            heading: "Жеткиликтүүлүк шарттары",
            bullets: [
              "Сайтта жүктөп алуу үчүн эсептик жазуу да, кирүү да талап кылынбайт. Бот колдонуучуларды алардын Telegram аккаунту боюнча айырмалайт.",
              "Сервисти ашыкча жүктөмдөн жана автоматташтырылган кыянаттык менен пайдалануудан суроо-талаптардын жыштыгына коюлган техникалык чектөөлөр коргойт.",
              "YouTube үчүн суткалык трафик лимити колдонулат: сайтта жана кеңейтүүдө бир тармактан 24 саатта 10 ГБ жана ботто бир Telegram аккаунтуна 24 саатта 25 ГБ. Башка аянтчаларга ал тийиштүү эмес.",
              "Бот аркылуу жүктөп алуу үчүн биздин каналга жазылуу талап кылынбайт. Бот файлдардын текстине долбоордун жаңылыктар каналына шилтеме кошот; ага жазылуу милдеттүү эмес.",
            ],
          },
          {
            heading: "Сервис эмне кылат",
            body: [
              "Сервис техникалык ортомчу болуп саналат: Сиздин шилтемеңиз боюнча ал жалпыга жеткиликтүү баракка кайрылат, медиафайлды алат жана аны Сизге өткөрүп берет.",
              "Биз өзүбүздө видеолордун каталогун жайгаштырбайбыз, башкалардын контенти боюнча издөө жүргүзбөйбүз жана жүктөлүп алынган файлдарды өткөрүп берүү үчүн зарыл болгон убакыттан — болжол менен бир сааттан — узак сактабайбыз.",
              "Белгилүү бир аянтчанын жеткиликтүүлүгү анын техникалык чечимдерине жараша болот жана эскертүүсүз өзгөрүшү мүмкүн.",
            ],
          },
          {
            heading: "Колдонуучунун милдеттери",
            body: [
              "Алынган файлдарды кантип колдонооруңуз үчүн Сиз өзүңүз жооп бересиз жана буга укугуңуз бар экенин тастыктайсыз.",
            ],
            bullets: [
              "Укуктары Сизге таандык болгон же аны колдонууга укук ээси же мыйзам уруксат берген материалды гана жүктөп алыңыз.",
              "Сервисти автордук жана чектеш укуктарды бузуу, тыюу салынган контентти таратуу жана үчүнчү жактардын укуктарын бузуу үчүн колдонбоңуз.",
              "Сервистин техникалык чектөөлөрүн, анын ичинде суроо-талаптардын жыштыгына коюлган чектөөлөрдү жана боттордон текшерүүнү айланып өтүүгө аракет кылбаңыз.",
              "Автоматташтырылган жүктөм түзбөңүз: массалык суроо-талаптарга, скрипттерге жана парсерлерге жол берилбейт.",
            ],
          },
          {
            heading: "Шилтемелерди каналда жарыялоо",
            body: [
              "Бот аркылуу видеону жүктөп алуу менен Сиз баштапкы посттун шилтемеси биздин Telegram-каналда жарыяланышына макул болосуз. Бул тууралуу эскертүү ботто сапатты тандоого чейин — башкача айтканда, Сиз жүктөп алуу чечимин кабыл алганга чейин көрсөтүлөт.",
              "Жарыялоо аноним: каналга жалпыга жеткиликтүү барактын шилтемеси, роликтин аталышы жана анын мукабасы — аянтча посттун превьюсунда көрсөткөн ошол эле кадр жиберилет. Видеону ким жүктөп алганы көрсөтүлбөйт. Видеофайлдын өзү эч качан жана эч жерде жарыяланбайт: аянтчалар өздөрү ар бир посттун астындагы «Бөлүшүү» баскычы менен таратууну сунуштаган шилтеме гана таратылат.",
              "Бир эле шилтеме бир жолудан ашык жарыяланбайт. Эгер шилтеме каналга түшүшүн каалабасаңыз, бул видеону биздин сервис аркылуу жүктөп албаңыз.",
              "Топтордогу шилтемелер жана туташтырылган аккаунт аркылуу жүктөлүп алынган жазуулар каналда жарыяланбайт."
            ],
          },
          {
            heading: "Өз аккаунтуңузду туташтыруу",
            body: [
              "Аянтчадагы өз аккаунтуңузду ботко туташтыруу менен Сиз бул Сиздин аккаунтуңуз экенин жана аны тескөөгө укугуңуз бар экенин тастыктайсыз.",
              "Аянтчалар автоматтык жүктөп алууларды жактырбайт жана туташтырылган аккаунтту чектеши же бөгөттөшү мүмкүн. Бул тобокелдикти Сиз өз мойнуңузга аласыз; биз негизги эмес, өзүнчө аккаунтту туташтырууну сунуштайбыз. Аянтча Сиздин аккаунтуңузга салган чектөөлөр үчүн биз жооп бербейбиз.",
              "Топко туташтырылган аккаунт анын бардык катышуучуларынын жүктөп алуулары үчүн колдонулат. Ким аккаунттарды туташтыра аларын топтун администраторлору чечет жана алардын каалаганын өчүрө алышат.",
            ],
          },
          {
            heading: "Жоопкерчиликти чектөө",
            body: [
              "Сервис «кандай болсо, ошондой» шартында берилет. Биз үзгүлтүксүз иштөөгө, белгилүү бир аянтчанын жеткиликтүүлүгүнө же файлдын Сиздин максаттарыңызга ылайыктуулугуна кепилдик бербейбиз.",
              "Жүктөлүп алынган материалды кантип тескегениңиз үчүн жана Сиз үчүнчү жактардын укуктарын бузгандыгыңыздын кесепеттери үчүн биз жоопкерчилик тартпайбыз.",
              "Биз мүмкүнчүлүктөрдүн курамын өзгөртүүгө, тейлөө үчүн сервистин ишин убактылуу токтотууга жана анын ишин токтотууга укуктуубуз.",
            ],
          },
          {
            heading: "Жеткиликтүүлүктү чектөө",
            body: [
              "Бул шарттар бузулганда, чектөөлөрдү айланып өтүүгө аракет кылынганда, ошондой эле укук ээсинен негиздүү даттануу келип түшкөндө биз сервиске жеткиликтүүлүктү чектеп же токтотуп коюшубуз мүмкүн.",
            ],
          },
          {
            heading: "Өзгөртүүлөр жана колдонулуучу укук",
            body: [
              "Биз шарттарды өзгөртүшүбүз мүмкүн; күчүндөгү редакциянын күнү барактын башында көрсөтүлгөн. Өзгөртүүлөрдөн кийин сервисти колдонууну улантуу менен Сиз жаңы редакцияны кабыл аласыз.",
              "Тараптардын мамилелерине Казакстан Республикасынын укугу колдонулат. Тараптар талаш-тартыштарды кат алышуу аркылуу жөнгө салууга умтулушат, ал эми макулдашууга жетишилбесе — Казакстан Республикасынын мыйзамдарында белгиленген тартипте.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie саясаты",
        summary: `${operator.site} кандай cookie файлдарын колдонот, алар эмне үчүн керек жана алардан кантип баш тартууга болот.`,
        sections: [
          {
            heading: "Cookie деген эмне",
            body: [
              "Cookie — сайт Сиздин браузериңизде сактаган чакан текст файлдары. Алар Сиздин жөндөөлөрүңүздү эстеп калууга жана кирүүлөрдүн жеке мүнөздөн ажыратылган статистикасын чогултууга мүмкүндүк берет.",
              "Бул документте cookie менен бирге жакын технологияларды да — браузердин жергиликтүү сактагычын жана пиксель-эсептегичтерди сүрөттөйбүз.",
            ],
          },
          {
            heading: "Зарыл",
            body: [
              "Аларсыз сервис иштебейт, ошондуктан алар дайыма орнотулат.",
            ],
            bullets: [
              "Cloudflare Turnstile — шилтемени скрипт эмес, адам жөнөтүп жатканын текшерүү.",
              "Интерфейстин жөндөөлөрү — тандалган тил жана жасалгалоо темасы.",
            ],
          },
          {
            heading: "Аналитикалык",
            body: [
              "Алар кайсы барактар колдонуларын жана каталар кайда пайда болорун түшүнүүгө жардам берет. Сиздин макулдугуңуз менен орнотулат жана сервистин иштеши үчүн милдеттүү эмес.",
            ],
            bullets: [
              "Google Analytics жана Google Tag Manager — сайтка кирүүлөр жана сайттагы жүрүм-турум жеке мүнөздөн ажыратылган түрдө.",
              "Яндекс.Метрика — кирүүлөр, чыкылдатуулар картасы жана Вебвизор.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Яндекс.Метриканын Вебвизору барактагы аракеттерди жазат: көрсөткүчтүн жылышын, жылдырууну, чыкылдатууларды жана шилтеме талаасына киргизүүнү. Бул интерфейс кайсы жерде адаштырарын көрүү үчүн керек.",
              "Биз бул жазууларды белгилүү бир адамдарга көз салуу үчүн колдонбойбуз. Сайттын талааларына сакталышын каалабаган маалыматтарды киргизбеңиз.",
            ],
          },
          {
            heading: "Кантип баш тартууга болот",
            bullets: [
              "Браузериңизде cookie файлдарын бөгөттөөнү же өчүрүүнү жөндөңүз — бул жол саналган бардык системалар үчүн иштейт.",
              "Google Analytics: чогултууну өчүрүүчү браузер үчүн расмий кошумча Google сайтында жеткиликтүү.",
              "Яндекс.Метрика: Яндекстин расмий кошумчасы аркылуу баш тартууга болот.",
              "Зарыл cookie файлдарын өчүрүү жүктөп алууну мүмкүн эмес кылат.",
            ],
          },
          {
            heading: "Мөөнөттөр",
            body: [
              "Сеанстык cookie файлдары браузер жабылганда же сеанстын мөөнөтү бүткөндө өчүрүлөт. Аналитикалык эсептегичтер идентификаторлорду алардын жеткирүүчүлөрү белгилеген мөөнөттөрдүн ичинде сактайт.",
            ],
          },
        ],
      },
      copyright: {
        title: "Укук ээлерине",
        summary: "Сервистин автордук укук боюнча позициясы жана бузуу тууралуу даттануу берүү тартиби.",
        sections: [
          {
            heading: "Сервистин позициясы",
            body: [
              "Сервис өзүндө видеолорду жайгаштырбайт жана алардын каталогун жүргүзбөйт. Ал техникалык ортомчу катары иштейт: колдонуучу киргизген шилтеме боюнча жалпыга жеткиликтүү баракка кайрылат жана колдонуучуга файлды өткөрүп берет.",
              "Жүктөлүп алынган файлдар серверде болжол менен бир саат сакталат жана автоматтык түрдө өчүрүлөт. Башкалардын контентинин туруктуу көчүрмөсү бизде калбайт.",
              "Жүктөлүп алынган материалды колдонуу үчүн жоопкерчиликти колдонуучу тартат — бул Колдонуучу келишиминде түздөн-түз бекитилген.",
            ],
          },
          {
            heading: "Эгер Сиздин укуктарыңыз бузулса",
            body: [
              `Эгер Сиз укук ээси же анын өкүлү болсоңуз жана сервис Сиздин укуктарыңызды бузуу үчүн колдонулуп жатат деп эсептесеңиз, ${MAIL} дарегине жазыңыз. Биз мындай кайрылууларды карап чыгабыз жана чара көрөбүз.`,
            ],
          },
          {
            heading: "Кайрылууда эмнени көрсөтүү керек",
            bullets: [
              "Кайсы чыгарма тийиштүү жана Сиз ага кандай негизде укукка ээ экениңиз.",
              "Материалдын шилтемеси жана, эгер белгилүү болсо, бузуунун жагдайлары.",
              "Сиздин байланыш маалыматтарыңыз: аты-жөнүңүз же аталышыңыз, дарегиңиз жана электрондук почтаңыздын дареги.",
              "Эгер Сиз укук ээсинин атынан аракеттенсеңиз — ыйгарым укуктардын тастыктамасы.",
              "Кайрылуудагы маалыматтар анык экени, ал эми материалды колдонууга укук ээси же мыйзам уруксат бербегени тууралуу арыз.",
            ],
          },
          {
            heading: "Биз эмне кылабыз",
            body: [
              "Биз кайрылууну акылга сыярлык мөөнөттө, эреже катары отуз календардык күндүн ичинде карап чыгабыз жана бузуу тастыкталганда сервис аркылуу материалга жеткиликтүүлүктү, ал эми зарыл болсо — бузуучунун сервиске жеткиликтүүлүгүн чектейбиз.",
              "Кароонун жыйынтыктары тууралуу Сиз көрсөткөн электрондук почта дарегине билдиребиз.",
            ],
          },
          {
            heading: "Абийирсиз кайрылуулар",
            body: [
              "Атайылап жалган маалыматтарды камтыган кайрылуу мыйзамдарга ылайык арыз ээсинин жоопкерчилигине алып келиши мүмкүн. Эгер кайрылуу укук ээсин да, талаштуу материалды да аныктоого мүмкүндүк бербесе, биз аны кароодон баш тартууга укуктуубуз.",
            ],
          },
        ],
      },
    },
  },
  tg: {
    ui: {
      updated: "Таҳрир аз",
      back: "Ба саҳифаи асосӣ",
      operatorHeading: "Оператори сервис",
      navHeading: "Ҳуҷҷатҳои дигар",
      labels: {
        privacy: "Сиёсати махфият",
        terms: "Созишномаи корбар",
        cookies: "Сиёсати cookie",
        copyright: "Ба соҳибони ҳуқуқ",
      },
    },
    docs: {
      privacy: {
        title: "Сиёсати махфият",
        summary: `${operator.site} кадом маълумотро ҷамъ меорад, он барои чӣ лозим аст, то кай нигоҳ дошта мешавад ва онро чӣ тавр нест кардан мумкин аст.`,
        sections: [
          {
            heading: "Муқаррароти умумӣ",
            body: [
              `Сиёсати мазкур тавсиф медиҳад, ки сервиси ${operator.site} кадом маълумоти шахсиро ва бо кадом мақсад коркард мекунад. Оператори маълумот ${operator.nameTg} мебошад.`,
              "Бо истифодаи сервис Шумо ба тартиби коркарде, ки дар ин ҷо тавсиф шудааст, розӣ мешавед. Агар Шумо бо он розӣ набошед, лутфан сервисро истифода набаред.",
              "Коркард мутобиқи Қонуни Ҷумҳурии Қазоқистон «Дар бораи маълумоти шахсӣ ва ҳифзи он», нисбат ба боздидкунандагон аз Минтақаи иқтисодии Аврупо бошад, бо назардошти талаботи GDPR анҷом дода мешавад.",
            ],
          },
          {
            heading: "Мо кадом маълумотро коркард мекунем",
            body: [
              "Мо дидаю дониста ҳеҷ чизеро аз он чи барои кори сервис зарур аст зиёдтар ҷамъ намеорем ва ҳуҷҷатҳо, маълумоти пардохт ё суроғаро талаб намекунем.",
            ],
            bullets: [
              "Маълумоти аккаунти Telegram, ки бот ҳангоми ба он навиштани Шумо мегирад: идентификатори рақамӣ, номи корбар, ном ва рамзи забон.",
              "Пайвандҳое, ки Шумо барои боргирӣ мефиристед, ва маълумот дар бораи худи кӯшиш: платформа, сана ва вақт, сифати интихобшуда, натиҷа (муваффақият ё хато).",
              "Маълумоти техникии пайвастшавӣ: суроғаи IP, навъ ва версияи браузер, забон, саҳифае, ки аз он гузариш сурат гирифтааст. Онҳо ба журналҳои сервер ва ба системаҳои веб-таҳлил ворид мешаванд.",
              "Файлҳои cookie ва идентификаторҳои таҳлилӣ — муфассалтар дар Сиёсати cookie.",
            ],
          },
          {
            heading: "Ин маълумот барои чӣ лозим аст",
            bullets: [
              "Расонидани худи хизматрасонӣ: гирифтани видео аз рӯи пайванди Шумо ва ба Шумо супоридани файл.",
              "Фарқ кардани аккаунти Шумо аз аккаунти дигарон ва муқовимат ба сӯиистифода.",
              "Ҳифзи сервис аз сӯиистифодаи автоматикунонидашуда: санҷиши Cloudflare Turnstile пеш аз фиристодани пайванд.",
              "Фаҳмидани он ки сомона чӣ тавр истифода мешавад ва бартараф кардани хатоҳо — омори ғайришахсишуда ва ҷамъбастӣ.",
              "Ҷавоб додан ба муроҷиатҳои Шумо ва муроҷиатҳои соҳибони ҳуқуқ.",
              "Гоҳ-гоҳ ба Шумо дар Telegram навиштан, то андешаи Шуморо дар бораи сервис бифаҳмем — масалан, агар Шумо истифодаи онро қатъ карда бошед. Ҷавоб додан ҳатмӣ нест; агар чунин паёмҳо ба Шумо лозим набошанд, танҳо дар ин бора гӯед ва мо дигар наменависем.",
            ],
          },
          {
            heading: "Асосҳои коркард",
            body: [
              "Маълумоти аккаунти Telegram ва маълумот дар бораи боргириҳо барои иҷрои Созишномаи корбар коркард мешаванд, ки Шумо онро бо оғози истифодаи сервис қабул мекунед.",
              "Файлҳои cookie-и таҳлилӣ ва сабти амалҳо дар сомона дар асоси розигии Шумо коркард мешаванд, ки Шумо онро дар ҳар лаҳза бозхонд карда метавонед — тарзҳои он дар Сиёсати cookie тавсиф шудаанд.",
              "Журналҳои сервер ва ҳифз аз ботҳо дар доираи манфиати қонунии мо оид ба нигоҳ доштани сервис дар ҳолати корӣ ва ҳифзшуда коркард мешаванд.",
              "Саволҳо дар бораи андешаи Шумо оид ба сервис — дар доираи манфиати қонунии мо оид ба беҳтар кардани сервис; Шумо метавонед дар ҳар лаҳза аз онҳо даст кашед.",
            ],
          },
          {
            heading: "Аккаунтҳои пайвастшуда",
            body: [
              "Бо хоҳиши худ Шумо метавонед аккаунти худро дар платформа (Instagram, Facebook, YouTube, X, VK, TikTok) ба бот пайваст кунед, то бот сабтҳоеро боргирӣ кунад, ки танҳо ба корбарони воридшуда намоёнанд: сторис, нашрияҳои пӯшида. Барои ин бот кукиҳои ҳамин аккаунтро мегирад — аз васеъкунандаи Videoner тавассути рамзи яккарата ё аз файле, ки Шумо фиристодаед.",
              "Мо танҳо кукиҳои платформаи интихобшударо нигоҳ медорем, боқимондаро фавран мепартоем. Онҳо дар шакли рамзгузоришуда нигоҳ дошта мешаванд ва танҳо барои боргириҳо дар ҳамон ҷое истифода мешаванд, ки Шумо онҳоро пайваст кардаед. Кукиҳое, ки дар чати шахсӣ пайваст шудаанд, — барои боргириҳои Шумо, аз ҷумла пайвандҳои худи Шумо дар гурӯҳҳое, ки дар онҳо аккаунти худ пайваст нашудааст; барои пайвандҳои дигарон онҳо истифода намешаванд. Кукиҳое, ки ба гурӯҳ пайваст шудаанд, — барои боргириҳои аъзои он ва дигар ҳеҷ ҷо.",
              "Асос — розигии Шумо: Шумо аккаунтро худатон пайваст мекунед ва метавонед онро дар ҳар лаҳза бо фармони /accounts нест кунед. Ҳангоми нест кардан кукиҳо бебозгашт тоза карда мешаванд. Агар платформа воридшавиро қабул накунад, бот дар ин бора ба Шумо хабар медиҳад.",
              "Сабтҳое, ки тавассути аккаунти пайвастшуда боргирӣ шудаанд, дар канали мо нашр намешаванд ва аз кеши умумӣ ба корбарони дигар дода намешаванд.",
            ],
          },
          {
            heading: "Сервисҳои тарафи сеюм",
            body: [
              "Мо маълумоти Шуморо ба шахсони сеюм барои мақсадҳои худи онҳо намефурӯшем ва намесупорем. Барои кори сервис таъминкунандагони зерин ҷалб шудаанд, ки ҳар яки онҳо маълумотро тибқи қоидаҳои худ коркард мекунад:",
            ],
            bullets: [
              "Telegram — кори боти " + BOT + ".",
              "Cloudflare — ҳифз аз ботҳо (Turnstile), расонидани сомона ва масиргузории почта.",
              "Google Analytics ва Google Tag Manager — омори боздидҳо.",
              "Яндекс.Метрика — омори боздидҳо, харитаи кликҳо ва Вебвизор. Вебвизор амалҳоро дар саҳифа сабт мекунад: ҳаракатҳои курсор, ҳаракат додани саҳифа (прокрутка) ва кликҳо. Сабтҳо танҳо барои таҳлили қулайии сомона истифода мешаванд.",
            ],
          },
          {
            heading: "Мо маълумотро то кай нигоҳ медорем",
            bullets: [
              "Файлҳои боргиришуда тақрибан як соат пас аз эҷод шуданашон ба таври худкор аз сервер нест карда мешаванд. Мо бойгонии видеоҳои Шуморо нигоҳ намедорем.",
              "Сабтҳо дар бораи кӯшишҳои боргирӣ то он даме нигоҳ дошта мешаванд, ки барои муқовимат ба сӯиистифода ва баррасии муроҷиатҳо лозим бошад.",
              "Маълумоти аккаунт то он даме нигоҳ дошта мешавад, ки Шумо сервисро истифода мебаред, ва бо дархости Шумо нест карда мешавад.",
              "Журналҳои сервер дар давоми мӯҳлати маҳдуд нигоҳ дошта мешаванд ва бо гардиши навбатӣ (ротатсия) аз нав навишта мешаванд.",
            ],
          },
          {
            heading: "Маълумот дар куҷо коркард мешавад",
            body: [
              "Серверҳои сервис дар маркази коркарди маълумот дар қаламрави Иттиҳоди Аврупо ҷойгиранд. Қисме аз таъминкунандагоне, ки дар боло номбар шудаанд, метавонанд маълумотро берун аз ҳудуди он мутобиқи сиёсатҳои худ коркард кунанд.",
            ],
          },
          {
            heading: "Ҳуқуқҳои Шумо",
            body: [
              `Шумо ҳуқуқ доред дар бораи коркарди маълумоти худ маълумот гиред, ислоҳ ё нест кардани онро талаб кунед, розигии худро бозхонд кунед ва ба коркард эътироз намоед. Барои ин аз ҳамон почта ё ҳамон аккаунти Telegram, ки ба муроҷиат алоқаманданд, ба ${MAIL} нависед.`,
              "Мо дар мӯҳлати оқилона, чун қоида дар давоми сӣ рӯзи тақвимӣ, ҷавоб медиҳем. Нест кардани аккаунт боиси нест кардани таърихи боргириҳои ба он алоқаманд мегардад.",
            ],
          },
          {
            heading: "Ноболиғон",
            body: [
              "Сервис барои кӯдакони то 16-сола пешбинӣ нашудааст ва ба онҳо равона нашудааст. Мо дидаю дониста маълумоти чунин корбаронро ҷамъ намеорем; агар ин тасодуфан рух дода бошад, ба мо нависед ва маълумот нест карда мешавад.",
            ],
          },
          {
            heading: "Тағйирот",
            body: [
              "Мо метавонем ин Сиёсатро нав кунем. Санаи таҳрири амалкунанда дар аввали саҳифа нишон дода шудааст; дар бораи тағйироти муҳим мо дар сервис қайд хоҳем кард.",
            ],
          },
        ],
      },
      terms: {
        title: "Созишномаи корбар",
        summary: `Қоидаҳои истифодаи ${operator.site}: чӣ мумкин аст, чӣ мумкин нест ва сервис бо кадом шартҳо кор мекунад.`,
        sections: [
          {
            heading: "Муқаррароти умумӣ",
            body: [
              `Созишнома истифодаи сомонаи ${operator.site} ва Telegram-боти ${BOT}-ро танзим мекунад. Соҳиб ва маъмури сервис — ${operator.nameTg}.`,
              "Бо оғози истифодаи сервис Шумо тасдиқ мекунед, ки шартҳоро хондаед ва онҳоро қабул мекунед. Агар ягон шарт ба Шумо мувофиқ набошад, сервисро истифода набаред.",
            ],
          },
          {
            heading: "Сервис ройгон аст",
            body: [
              "Ҳамаи имкониятҳои сервис ройгон пешниҳод карда мешаванд. Мо обунаҳо, тарифҳои пулакӣ, сифатҳои пулакии видео ва харидҳои дохилӣ надорем.",
              "Мо реклама нишон намедиҳем ва пайвандҳои шарикӣ ҷойгир намекунем.",
            ],
          },
          {
            heading: "Шартҳои дастрасӣ",
            bullets: [
              "Барои боргирӣ дар сомона на аккаунт лозим аст ва на воридшавӣ. Бот корбаронро аз рӯи аккаунти Telegram-и онҳо фарқ мекунад.",
              "Сервисро аз сарбории аз ҳад зиёд ва сӯиистифодаи автоматикунонидашуда маҳдудиятҳои техникӣ оид ба басомади дархостҳо ҳифз мекунанд.",
              "Барои YouTube лимити шабонарӯзии трафик амал мекунад: дар сомона ва васеъкунанда 10 ГБ дар 24 соат аз як шабака ва дар бот 25 ГБ дар 24 соат барои як аккаунти Telegram. Ба платформаҳои дигар он дахл надорад.",
              "Барои боргирӣ тавассути бот обуна шудан ба канали мо талаб карда намешавад. Бот ба матни файлҳо пайванди канали хабарии лоиҳаро илова мекунад; обуна шудан ба он ҳатмӣ нест.",
            ],
          },
          {
            heading: "Сервис чӣ кор мекунад",
            body: [
              "Сервис миёнарави техникӣ мебошад: аз рӯи пайванди Шумо он ба саҳифаи барои умум дастрас муроҷиат мекунад, медиафайлро мегирад ва онро ба Шумо месупорад.",
              "Мо дар назди худ каталоги видеоҳо ҷойгир намекунем, дар байни мундариҷаи дигарон ҷустуҷӯ намебарем ва файлҳои боргиришударо зиёдтар аз вақти барои супоридан зарур — тақрибан як соат — нигоҳ намедорем.",
              "Дастрасии платформаи мушаххас аз қарорҳои техникии он вобаста аст ва метавонад бе огоҳӣ тағйир ёбад.",
            ],
          },
          {
            heading: "Ӯҳдадориҳои корбар",
            body: [
              "Шумо барои он ки файлҳои гирифташударо чӣ тавр истифода мебаред, мустақилона масъул ҳастед ва тасдиқ мекунед, ки ба ин ҳуқуқ доред.",
            ],
            bullets: [
              "Танҳо маводеро боргирӣ кунед, ки ҳуқуқҳо ба он ба Шумо тааллуқ доранд ё истифодаи он аз ҷониби соҳиби ҳуқуқ ё қонун иҷозат дода шудааст.",
              "Сервисро барои вайрон кардани ҳуқуқи муаллиф ва ҳуқуқҳои вобаста, паҳн кардани мундариҷаи манъшуда ва вайрон кардани ҳуқуқҳои шахсони сеюм истифода набаред.",
              "Кӯшиш накунед, ки маҳдудиятҳои техникии сервисро, аз ҷумла маҳдудиятҳои басомади дархостҳо ва санҷиш ба бот буданро, давр занед.",
              "Сарбории автоматикунонидашуда эҷод накунед: дархостҳои оммавӣ, скриптҳо ва парсерҳо иҷозат дода намешаванд.",
            ],
          },
          {
            heading: "Нашри пайвандҳо дар канал",
            body: [
              "Бо боргирии видео тавассути бот Шумо розӣ мешавед, ки пайванд ба пости аслӣ дар Telegram-канали мо нашр карда мешавад. Огоҳӣ дар ин бора дар бот пеш аз интихоби сифат — яъне пеш аз он ки Шумо дар бораи боргирӣ қарор қабул кунед — нишон дода мешавад.",
              "Нашр беном аст: ба канал пайванд ба саҳифаи барои умум дастрас, номи ролик ва муқоваи он — ҳамон кадре, ки платформа дар пешнамоиши пост нишон медиҳад, — фиристода мешавад. Кӣ видеоро боргирӣ кардааст, нишон дода намешавад. Худи видеофайл ҳеҷ гоҳ ва дар ҳеҷ ҷо нашр намешавад: пайванде паҳн карда мешавад, ки платформаҳо худашон паҳн карданашро бо тугмаи «Поделиться» («Мубодила кардан») дар зери ҳар пост пешниҳод мекунанд.",
              "Ҳамон як пайванд на зиёдтар аз як маротиба нашр карда мешавад. Агар Шумо нахоҳед, ки пайванд ба канал ворид шавад, ин видеоро тавассути сервиси мо боргирӣ накунед.",
              "Пайвандҳо аз гурӯҳҳо ва сабтҳое, ки тавассути аккаунти пайвастшуда боргирӣ шудаанд, дар канал нашр намешаванд."
            ],
          },
          {
            heading: "Пайваст кардани аккаунти худ",
            body: [
              "Бо пайваст кардани аккаунти худ дар платформа ба бот Шумо тасдиқ мекунед, ки ин аккаунти Шумост ва Шумо ҳуқуқи ихтиёрдорӣ кардани онро доред.",
              "Платформаҳо боргириҳои автоматиро ҷонибдорӣ намекунанд ва метавонанд аккаунти пайвастшударо маҳдуд ё баста кунанд. Ин хатарро Шумо ба зиммаи худ мегиред; мо тавсия медиҳем, ки аккаунти алоҳида, на асосиро пайваст кунед. Мо барои маҳдудиятҳое, ки платформа ба аккаунти Шумо ҷорӣ мекунад, ҷавобгар нестем.",
              "Аккаунте, ки ба гурӯҳ пайваст шудааст, барои боргириҳои ҳамаи аъзои он истифода мешавад. Маъмурони гурӯҳ ҳал мекунанд, ки кӣ метавонад аккаунтҳоро пайваст кунад, ва метавонанд ҳар яки онҳоро нест кунанд.",
            ],
          },
          {
            heading: "Маҳдуд кардани ҷавобгарӣ",
            body: [
              "Сервис бо шарти «тавре ки ҳаст» пешниҳод карда мешавад. Мо кори бефосила, дастрасии платформаи мушаххас ё мувофиқ будани файлро ба мақсадҳои Шумо кафолат намедиҳем.",
              "Мо барои он ки Шумо бо маводи боргиришуда чӣ гуна рафтор кардед ва барои оқибатҳои аз ҷониби Шумо вайрон кардани ҳуқуқҳои шахсони сеюм ҷавобгар нестем.",
              "Мо ҳуқуқ дорем таркиби имкониятҳоро тағйир диҳем, кори сервисро барои хизматрасонии техникӣ боздорем ва кори онро қатъ кунем.",
            ],
          },
          {
            heading: "Маҳдуд кардани дастрасӣ",
            body: [
              "Мо метавонем дастрасӣ ба сервисро ҳангоми вайрон кардани шартҳои мазкур, ҳангоми кӯшиши давр задани маҳдудиятҳо, инчунин ҳангоми ворид шудани шикояти асосноки соҳиби ҳуқуқ маҳдуд ё қатъ кунем.",
            ],
          },
          {
            heading: "Тағйирот ва ҳуқуқи татбиқшаванда",
            body: [
              "Мо метавонем шартҳоро тағйир диҳем; санаи таҳрири амалкунанда дар аввали саҳифа нишон дода шудааст. Бо идомаи истифодаи сервис пас аз тағйирот Шумо таҳрири навро қабул мекунед.",
              "Ба муносибатҳои тарафҳо ҳуқуқи Ҷумҳурии Қазоқистон татбиқ карда мешавад. Тарафҳо мекӯшанд баҳсҳоро бо роҳи мукотиба танзим кунанд, ва дар сурати ба мувофиқа нарасидан — бо тартиби муқаррарнамудаи қонунгузории Ҷумҳурии Қазоқистон.",
            ],
          },
        ],
      },
      cookies: {
        title: "Сиёсати cookie",
        summary: `${operator.site} кадом файлҳои cookie-ро истифода мебарад, онҳо барои чӣ лозиманд ва чӣ тавр аз онҳо даст кашидан мумкин аст.`,
        sections: [
          {
            heading: "Cookie чист",
            body: [
              "Cookie — файлҳои хурди матнӣ мебошанд, ки сомона дар браузери Шумо нигоҳ медорад. Онҳо имкон медиҳанд, ки танзимоти Шумо дар хотир нигоҳ дошта шаванд ва омори ғайришахсишудаи боздидҳо ҷамъ оварда шавад.",
              "Дар баробари cookie дар ин ҳуҷҷат мо технологияҳои ба онҳо наздикро низ тавсиф мекунем — анбори маҳаллии браузер ва ҳисобкунакҳо-пикселҳо.",
            ],
          },
          {
            heading: "Зарурӣ",
            body: [
              "Бе онҳо сервис кор намекунад, бинобар ин онҳо ҳамеша насб карда мешаванд.",
            ],
            bullets: [
              "Cloudflare Turnstile — санҷиши он ки пайвандро одам мефиристад, на скрипт.",
              "Танзимоти интерфейс — забони интихобшуда ва мавзӯи ороиш.",
            ],
          },
          {
            heading: "Таҳлилӣ",
            body: [
              "Онҳо ба фаҳмидани он кӯмак мекунанд, ки кадом саҳифаҳо истифода мешаванд ва хатоҳо дар куҷо ба миён меоянд. Онҳо бо розигии Шумо насб карда мешаванд ва барои кори сервис ҳатмӣ нестанд.",
            ],
            bullets: [
              "Google Analytics ва Google Tag Manager — боздидшавандагӣ ва рафтор дар сомона дар шакли ғайришахсишуда.",
              "Яндекс.Метрика — боздидшавандагӣ, харитаи кликҳо ва Вебвизор.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Вебвизори Яндекс.Метрика амалҳоро дар саҳифа сабт мекунад: ҳаракатҳои курсор, ҳаракат додани саҳифа (прокрутка), кликҳо ва ворид кардан ба майдони пайванд. Ин барои он лозим аст, ки бубинем интерфейс дар куҷо корбарро ба иштибоҳ меандозад.",
              "Мо ин сабтҳоро барои пайгирии одамони мушаххас истифода намебарем. Ба майдонҳои сомона маълумотеро ворид накунед, ки намехоҳед нигоҳ дошта шавад.",
            ],
          },
          {
            heading: "Чӣ тавр даст кашидан мумкин аст",
            bullets: [
              "Дар браузери худ манъ кардан ё нест кардани cookie-ро танзим кунед — ин тарз барои ҳамаи системаҳои номбаршуда кор мекунад.",
              "Google Analytics: иловаи расмии браузер, ки ҷамъоварии маълумотро хомӯш мекунад, дар сомонаи Google дастрас аст.",
              "Яндекс.Метрика: даст кашидан тавассути иловаи расмии Яндекс дастрас аст.",
              "Хомӯш кардани cookie-ҳои зарурӣ боргириро ғайриимкон мегардонад.",
            ],
          },
          {
            heading: "Мӯҳлатҳо",
            body: [
              "Cookie-ҳои сессионӣ ҳангоми бастани браузер ё пас аз гузаштани мӯҳлати сессия нест карда мешаванд. Ҳисобкунакҳои таҳлилӣ идентификаторҳоро дар давоми мӯҳлатҳое, ки таъминкунандагони онҳо муқаррар кардаанд, нигоҳ медоранд.",
            ],
          },
        ],
      },
      copyright: {
        title: "Ба соҳибони ҳуқуқ",
        summary: "Мавқеи сервис оид ба ҳуқуқи муаллиф ва тартиби пешниҳоди шикоят дар бораи вайронкунӣ.",
        sections: [
          {
            heading: "Мавқеи сервис",
            body: [
              "Сервис дар назди худ видео ҷойгир намекунад ва каталоги онҳоро намебарад. Он ҳамчун миёнарави техникӣ баромад мекунад: аз рӯи пайванде, ки корбар ворид кардааст, ба саҳифаи барои умум дастрас муроҷиат мекунад ва файлро ба корбар месупорад.",
              "Файлҳои боргиришуда дар сервер тақрибан як соат нигоҳ дошта мешаванд ва ба таври худкор нест карда мешаванд. Нусхаи доимии мундариҷаи дигарон дар назди мо боқӣ намемонад.",
              "Ҷавобгариро барои истифодаи маводи боргиришуда корбар бар дӯш дорад — ин дар Созишномаи корбар бевосита муқаррар шудааст.",
            ],
          },
          {
            heading: "Агар ҳуқуқҳои Шумо вайрон шуда бошанд",
            body: [
              `Агар Шумо соҳиби ҳуқуқ ё намояндаи ӯ бошед ва ҳисоб кунед, ки сервис барои вайрон кардани ҳуқуқҳои Шумо истифода мешавад, ба ${MAIL} нависед. Мо чунин муроҷиатҳоро баррасӣ мекунем ва чораҳо меандешем.`,
            ],
          },
          {
            heading: "Дар муроҷиат чиро нишон додан лозим аст",
            bullets: [
              "Кадом асар дахл дорад ва Шумо дар кадом асос ба он ҳуқуқ доред.",
              "Пайванд ба мавод ва, агар маълум бошад, ҳолатҳои вайронкунӣ.",
              "Маълумоти тамоси Шумо: ном ё номи ташкилот, суроға ва суроғаи почтаи электронӣ.",
              "Агар Шумо аз номи соҳиби ҳуқуқ амал кунед — тасдиқи ваколатҳо.",
              "Изҳорот дар бораи он ки маълумоти дар муроҷиат овардашуда саҳеҳ аст ва истифодаи мавод аз ҷониби соҳиби ҳуқуқ ё қонун иҷозат дода нашудааст.",
            ],
          },
          {
            heading: "Мо чӣ кор мекунем",
            body: [
              "Мо муроҷиатро дар мӯҳлати оқилона, чун қоида дар давоми сӣ рӯзи тақвимӣ, баррасӣ мекунем ва ҳангоми тасдиқ шудани вайронкунӣ дастрасӣ ба маводро тавассути сервис ва дар ҳолати зарурӣ дастрасии вайронкунандаро ба сервис маҳдуд мекунем.",
              "Дар бораи натиҷаҳои баррасӣ мо ба суроғаи почтаи электронии нишондодаи Шумо хабар медиҳем.",
            ],
          },
          {
            heading: "Муроҷиатҳои беинсофона",
            body: [
              "Муроҷиате, ки маълумоти қасдан бардурӯғ дорад, метавонад мутобиқи қонунгузорӣ боиси ҷавобгарии аризадиҳанда гардад. Мо ҳуқуқ дорем аз баррасии муроҷиат даст кашем, агар он имкон надиҳад, ки на соҳиби ҳуқуқ ва на маводи баҳсталаб муайян карда шавад.",
            ],
          },
        ],
      },
    },
  },
  ms: {
    ui: {
      updated: "Kemas kini terakhir",
      back: "Kembali ke laman utama",
      operatorHeading: "Pengendali perkhidmatan",
      navHeading: "Dokumen lain",
      labels: {
        privacy: "Dasar Privasi",
        terms: "Terma Penggunaan",
        cookies: "Dasar Kuki",
        copyright: "Hak Cipta",
      },
    },
    docs: {
      privacy: {
        title: "Dasar Privasi",
        summary: `Data yang dikumpulkan oleh ${operator.site}, sebab ia diperlukan, tempoh ia disimpan dan cara untuk memadamkannya.`,
        sections: [
          {
            heading: "Peruntukan am",
            body: [
              `Dasar ini menerangkan data peribadi yang diproses oleh perkhidmatan ${operator.site} dan bagi tujuan apa. Pengawal data ialah ${operator.nameMs}.`,
              "Dengan menggunakan perkhidmatan ini, anda bersetuju dengan pemprosesan yang diterangkan di sini. Jika anda tidak bersetuju, sila jangan gunakan perkhidmatan ini.",
              "Pemprosesan dijalankan menurut Undang-undang Republik Kazakhstan “Mengenai Data Peribadi dan Perlindungannya” dan, bagi pelawat dari Kawasan Ekonomi Eropah, dengan mengambil kira keperluan GDPR.",
            ],
          },
          {
            heading: "Data yang kami proses",
            body: [
              "Kami dengan sengaja tidak mengumpul apa-apa melebihi yang diperlukan untuk perkhidmatan ini berfungsi, dan kami tidak sekali-kali meminta dokumen pengenalan diri, butiran pembayaran atau alamat.",
            ],
            bullets: [
              "Data akaun Telegram yang diterima oleh bot apabila anda menghantar mesej kepadanya: ID berangka, nama pengguna, nama pertama dan kod bahasa.",
              "Pautan yang anda hantar untuk dimuat turun dan butiran percubaan itu sendiri: platform, tarikh dan masa, kualiti yang dipilih serta hasilnya (berjaya atau ralat).",
              "Data teknikal sambungan: alamat IP, jenis dan versi pelayar, bahasa dan halaman perujuk. Data ini direkodkan dalam log pelayan dan dalam alat analitik web.",
              "Kuki dan pengecam analitik — butiran lanjut dalam Dasar Kuki.",
            ],
          },
          {
            heading: "Sebab data ini diperlukan",
            bullets: [
              "Untuk menyediakan perkhidmatan itu sendiri: mendapatkan video daripada pautan anda dan menyerahkan fail kepada anda.",
              "Untuk membezakan akaun anda daripada akaun orang lain dan mencegah penyalahgunaan.",
              "Untuk melindungi perkhidmatan daripada penyalahgunaan automatik melalui semakan Cloudflare Turnstile sebelum pautan dihantar.",
              "Untuk memahami cara laman web digunakan dan membetulkan ralat, dengan menggunakan statistik yang dinyahnamakan dan diagregatkan.",
              "Untuk menjawab pertanyaan anda dan pertanyaan pemegang hak.",
              "Untuk sekali-sekala menghantar mesej kepada anda di Telegram bagi mengetahui pendapat anda tentang perkhidmatan ini — contohnya, jika anda telah berhenti menggunakannya. Membalas adalah tidak wajib; jika anda tidak mahu menerima mesej sedemikian, beritahu sahaja kami dan kami tidak akan menghubungi anda lagi.",
            ],
          },
          {
            heading: "Asas undang-undang",
            body: [
              "Data akaun Telegram dan rekod muat turun diproses untuk melaksanakan Terma Penggunaan, yang anda terima apabila anda mula menggunakan perkhidmatan ini.",
              "Kuki analitik dan rakaman aktiviti di laman web diproses berdasarkan persetujuan anda, yang boleh anda tarik balik pada bila-bila masa — caranya diterangkan dalam Dasar Kuki.",
              "Log pelayan dan perlindungan daripada bot berasaskan kepentingan sah kami untuk memastikan perkhidmatan terus berfungsi dan selamat.",
              "Pertanyaan tentang pendapat anda mengenai perkhidmatan ini berasaskan kepentingan sah kami untuk menambah baik perkhidmatan; anda boleh menolaknya pada bila-bila masa.",
            ],
          },
          {
            heading: "Akaun yang disambungkan",
            body: [
              "Jika anda mahu, anda boleh menyambungkan akaun anda di sesuatu platform (Instagram, Facebook, YouTube, X, VK, TikTok) ke bot supaya bot dapat memuat turun hantaran yang hanya boleh dilihat oleh pengguna yang log masuk: stories dan hantaran peribadi. Untuk tujuan ini, bot menerima kuki akaun tersebut — daripada sambungan Videoner melalui kod sekali guna, atau daripada fail yang anda hantar.",
              "Kami hanya menyimpan kuki platform yang dipilih dan membuang selebihnya dengan serta-merta. Kuki tersebut disimpan dalam bentuk yang disulitkan dan digunakan hanya untuk muat turun di tempat anda menyambungkannya. Kuki yang disambungkan dalam sembang peribadi anda digunakan untuk muat turun anda, termasuk pautan anda sendiri dalam kumpulan yang tidak mempunyai akaun tersendiri; kuki itu tidak sekali-kali digunakan untuk pautan orang lain. Kuki yang disambungkan ke sesuatu kumpulan digunakan untuk muat turun ahli kumpulan itu sahaja dan tidak di tempat lain.",
              "Asas undang-undangnya ialah persetujuan anda: anda sendiri yang menyambungkan akaun dan boleh mengalih keluarnya pada bila-bila masa dengan arahan /accounts. Kuki yang dialih keluar dipadamkan secara kekal. Jika platform tidak lagi menerima log masuk tersebut, bot akan memaklumkan anda.",
              "Hantaran yang dimuat turun melalui akaun yang disambungkan tidak diterbitkan dalam saluran kami dan tidak diberikan kepada pengguna lain daripada cache bersama.",
            ],
          },
          {
            heading: "Perkhidmatan pihak ketiga",
            body: [
              "Kami tidak menjual data anda dan tidak memindahkannya kepada pihak ketiga untuk tujuan mereka sendiri. Perkhidmatan ini bergantung pada penyedia berikut, yang masing-masing memproses data menurut peraturan mereka sendiri:",
            ],
            bullets: [
              `Telegram — pengendalian bot ${BOT}.`,
              "Cloudflare — perlindungan daripada bot (Turnstile), penyampaian laman web dan penghalaan e-mel.",
              "Google Analytics dan Google Tag Manager — statistik lawatan.",
              "Yandex Metrica — statistik lawatan, peta klik dan Webvisor. Webvisor merakam aktiviti di halaman: pergerakan penuding, penatalan dan klik. Rakaman digunakan hanya untuk menganalisis kebolehgunaan laman web.",
            ],
          },
          {
            heading: "Tempoh penyimpanan data",
            bullets: [
              "Fail yang dimuat turun dipadamkan secara automatik daripada pelayan kira-kira satu jam selepas ia dicipta. Kami tidak menyimpan arkib video anda.",
              "Rekod percubaan muat turun disimpan selama yang diperlukan untuk mencegah penyalahgunaan dan mengendalikan pertanyaan.",
              "Data akaun disimpan selagi anda menggunakan perkhidmatan ini dan dipadamkan atas permintaan anda.",
              "Log pelayan disimpan untuk tempoh yang terhad dan ditulis ganti semasa putaran log.",
            ],
          },
          {
            heading: "Tempat data diproses",
            body: [
              "Pelayan perkhidmatan ini terletak di pusat data dalam wilayah Kesatuan Eropah. Sebahagian daripada penyedia yang disenaraikan di atas mungkin memproses data di luar wilayah itu menurut dasar mereka sendiri.",
            ],
          },
          {
            heading: "Hak anda",
            body: [
              `Anda berhak mendapatkan maklumat tentang pemprosesan data anda, meminta data itu dibetulkan atau dipadamkan, menarik balik persetujuan dan membantah pemprosesan. Untuk berbuat demikian, hantarkan e-mel ke ${MAIL} daripada alamat e-mel atau akaun Telegram yang berkaitan dengan permintaan tersebut.`,
              "Kami akan membalas dalam tempoh yang munasabah, lazimnya dalam tempoh tiga puluh hari kalendar. Pemadaman akaun turut memadamkan sejarah muat turun yang berkaitan dengannya.",
            ],
          },
          {
            heading: "Kanak-kanak",
            body: [
              "Perkhidmatan ini tidak bertujuan untuk dan tidak ditujukan kepada kanak-kanak di bawah umur 16 tahun. Kami tidak mengumpul data mereka secara sedar; jika perkara ini berlaku secara tidak sengaja, hubungi kami dan data tersebut akan dipadamkan.",
            ],
          },
          {
            heading: "Perubahan",
            body: [
              "Kami boleh mengemas kini Dasar ini. Tarikh versi semasa dinyatakan di bahagian atas halaman, dan kami akan memaklumkan perubahan penting dalam perkhidmatan.",
            ],
          },
        ],
      },
      terms: {
        title: "Terma Penggunaan",
        summary: `Peraturan penggunaan ${operator.site}: apa yang dibenarkan, apa yang tidak dibenarkan dan syarat perkhidmatan ini beroperasi.`,
        sections: [
          {
            heading: "Peruntukan am",
            body: [
              `Terma ini mengawal penggunaan laman web ${operator.site} dan bot Telegram ${BOT}. Pemilik dan pentadbir perkhidmatan ini ialah ${operator.nameMs}.`,
              "Dengan mula menggunakan perkhidmatan ini, anda mengesahkan bahawa anda telah membaca Terma ini dan menerimanya. Jika mana-mana syarat tidak sesuai bagi anda, sila jangan gunakan perkhidmatan ini.",
            ],
          },
          {
            heading: "Perkhidmatan ini percuma",
            body: [
              "Semua ciri perkhidmatan ini disediakan secara percuma. Tiada langganan, pelan berbayar, kualiti video berbayar atau pembelian dalam perkhidmatan.",
              "Kami tidak memaparkan iklan dan tidak meletakkan pautan afiliasi.",
            ],
          },
          {
            heading: "Syarat akses",
            bullets: [
              "Muat turun di laman web tidak memerlukan akaun atau log masuk. Bot membezakan pengguna melalui akaun Telegram mereka.",
              "Had teknikal terhadap kekerapan permintaan melindungi perkhidmatan daripada beban berlebihan dan penyalahgunaan automatik.",
              "Muat turun YouTube tertakluk pada had trafik harian: 10 GB setiap 24 jam bagi setiap rangkaian di laman web dan dalam sambungan, dan 25 GB setiap 24 jam bagi setiap akaun Telegram dalam bot. Platform lain tidak terjejas.",
              "Langganan saluran kami tidak diperlukan untuk memuat turun melalui bot. Bot menambahkan pautan ke saluran berita projek dalam teks fail; melanggan saluran itu adalah tidak wajib.",
            ],
          },
          {
            heading: "Fungsi perkhidmatan",
            body: [
              "Perkhidmatan ini bertindak sebagai perantara teknikal: ia mengikuti pautan yang anda berikan, mendapatkan fail media daripada halaman yang boleh diakses secara umum dan menyerahkannya kepada anda.",
              "Kami tidak menempatkan katalog video, tidak menjalankan carian ke atas kandungan orang lain dan tidak menyimpan fail yang dimuat turun lebih lama daripada yang diperlukan untuk penyerahan — kira-kira satu jam.",
              "Ketersediaan sesuatu platform bergantung pada keputusan teknikal platform tersebut dan boleh berubah tanpa notis.",
            ],
          },
          {
            heading: "Kewajipan anda",
            body: [
              "Anda sendiri bertanggungjawab atas cara anda menggunakan fail yang anda peroleh, dan anda mengesahkan bahawa anda berhak berbuat demikian.",
            ],
            bullets: [
              "Muat turun hanya bahan yang haknya dimiliki oleh anda, atau yang penggunaannya dibenarkan oleh pemegang hak atau oleh undang-undang.",
              "Jangan gunakan perkhidmatan ini untuk melanggar hak cipta atau hak berkaitan, mengedarkan kandungan terlarang atau melanggar hak pihak ketiga.",
              "Jangan cuba memintas had teknikal perkhidmatan ini, termasuk had kekerapan permintaan dan semakan bot.",
              "Jangan menjana beban automatik: permintaan pukal, skrip dan pengikis data tidak dibenarkan.",
            ],
          },
          {
            heading: "Penerbitan pautan dalam saluran",
            body: [
              "Dengan memuat turun video melalui bot, anda bersetuju bahawa pautan ke hantaran asal akan diterbitkan dalam saluran Telegram kami. Notis mengenai perkara ini dipaparkan dalam bot sebelum anda memilih kualiti — iaitu sebelum anda memutuskan untuk memuat turun.",
              "Penerbitan dibuat tanpa nama: saluran menerima pautan ke halaman yang boleh diakses secara umum, tajuk video dan bingkai kulitnya — imej pegun yang sama yang dipaparkan oleh platform dalam pratonton hantarannya sendiri. Identiti orang yang memuat turun tidak dinyatakan. Fail video itu sendiri tidak sekali-kali diterbitkan di mana-mana: yang diedarkan ialah pautan, yang platform sendiri menggalakkan orang ramai untuk mengedarkannya melalui butang “Kongsi” di bawah setiap hantaran.",
              "Pautan yang sama diterbitkan tidak lebih daripada sekali. Jika anda tidak mahu sesuatu pautan masuk ke saluran, jangan muat turun video itu melalui perkhidmatan kami.",
              "Pautan daripada kumpulan dan hantaran yang dimuat turun melalui akaun yang disambungkan tidak sekali-kali diterbitkan dalam saluran."
            ],
          },
          {
            heading: "Menyambungkan akaun anda",
            body: [
              "Dengan menyambungkan akaun anda di sesuatu platform ke bot, anda mengesahkan bahawa akaun itu milik anda dan anda berhak menggunakannya dengan cara ini.",
              "Platform tidak merestui muat turun automatik dan boleh menyekat atau mengharamkan akaun yang disambungkan. Anda menanggung risiko ini; kami mengesyorkan agar anda menyambungkan akaun sampingan dan bukan akaun utama anda. Kami tidak bertanggungjawab atas sekatan yang dikenakan oleh platform ke atas akaun anda.",
              "Akaun yang disambungkan ke sesuatu kumpulan digunakan untuk muat turun oleh semua ahlinya. Pentadbir kumpulan menentukan siapa yang boleh menyambungkan akaun dan boleh mengalih keluar mana-mana akaun tersebut.",
            ],
          },
          {
            heading: "Had liabiliti",
            body: [
              "Perkhidmatan ini disediakan “sebagaimana adanya”. Kami tidak menjamin operasi tanpa gangguan, ketersediaan mana-mana platform tertentu, atau kesesuaian sesuatu fail untuk tujuan anda.",
              "Kami tidak bertanggungjawab atas apa yang anda lakukan dengan bahan yang anda muat turun, dan juga atas akibat pelanggaran hak pihak ketiga oleh anda.",
              "Kami berhak mengubah ciri yang ditawarkan, menggantung perkhidmatan untuk penyelenggaraan dan menamatkannya.",
            ],
          },
          {
            heading: "Sekatan akses",
            body: [
              "Kami boleh menyekat atau menamatkan akses kepada perkhidmatan ini sekiranya Terma ini dilanggar, sekiranya terdapat percubaan untuk memintas had, atau apabila menerima aduan yang berasas daripada pemegang hak.",
            ],
          },
          {
            heading: "Perubahan dan undang-undang yang terpakai",
            body: [
              "Kami boleh meminda Terma ini; tarikh versi yang berkuat kuasa dinyatakan di bahagian atas halaman. Dengan terus menggunakan perkhidmatan ini selepas sesuatu perubahan, anda menerima versi baharu tersebut.",
              "Hubungan antara pihak-pihak tertakluk pada undang-undang Republik Kazakhstan. Pihak-pihak akan berusaha menyelesaikan pertikaian melalui surat-menyurat dan, jika persetujuan tidak dicapai, mengikut tatacara yang ditetapkan oleh perundangan Republik Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Dasar Kuki",
        summary: `Kuki yang digunakan oleh ${operator.site}, kegunaannya dan cara untuk menolaknya.`,
        sections: [
          {
            heading: "Apakah kuki",
            body: [
              "Kuki ialah fail teks kecil yang disimpan oleh laman web dalam pelayar anda. Kuki membolehkan perkhidmatan mengingati tetapan anda dan mengumpul statistik lawatan yang dinyahnamakan.",
              "Selain kuki, dokumen ini turut meliputi teknologi berkaitan: storan setempat pelayar dan piksel penjejakan.",
            ],
          },
          {
            heading: "Kuki yang sangat diperlukan",
            body: ["Tanpa kuki ini perkhidmatan tidak dapat berfungsi, oleh itu ia sentiasa ditetapkan."],
            bullets: [
              "Cloudflare Turnstile — menyemak bahawa pautan dihantar oleh manusia dan bukan oleh skrip.",
              "Tetapan antara muka — bahasa dan tema warna yang anda pilih.",
            ],
          },
          {
            heading: "Kuki analitik",
            body: [
              "Kuki ini membantu kami melihat halaman yang digunakan dan tempat ralat berlaku. Ia ditetapkan dengan persetujuan anda dan tidak diperlukan untuk perkhidmatan ini berfungsi.",
            ],
            bullets: [
              "Google Analytics dan Google Tag Manager — trafik dan tingkah laku di laman web dalam bentuk yang dinyahnamakan.",
              "Yandex Metrica — trafik, peta klik dan Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor daripada Yandex Metrica merakam aktiviti di halaman: pergerakan penuding, penatalan, klik dan input dalam medan pautan. Tujuannya adalah supaya kami dapat melihat bahagian antara muka yang mengelirukan pengguna.",
              "Kami tidak menggunakan rakaman ini untuk menjejaki individu tertentu. Sila jangan masukkan ke dalam medan laman web apa-apa maklumat yang anda tidak mahu disimpan.",
            ],
          },
          {
            heading: "Cara menolak",
            bullets: [
              "Sekat atau padamkan kuki dalam tetapan pelayar anda — cara ini berkesan untuk semua sistem yang disenaraikan di sini.",
              "Google Analytics: alat tambah pelayar rasmi yang melumpuhkan pengumpulan data boleh didapati daripada Google.",
              "Yandex Metrica: penolakan boleh dibuat melalui alat tambah rasmi Yandex.",
              "Melumpuhkan kuki yang sangat diperlukan akan menyebabkan muat turun tidak dapat dilakukan.",
            ],
          },
          {
            heading: "Tempoh penyimpanan",
            body: [
              "Kuki sesi dipadamkan apabila anda menutup pelayar atau apabila sesi tamat tempoh. Alat analitik menyimpan pengecamnya untuk tempoh yang ditetapkan oleh penyedianya.",
            ],
          },
        ],
      },
      copyright: {
        title: "Hak Cipta",
        summary: "Pendirian perkhidmatan ini terhadap hak cipta dan cara mengemukakan aduan pelanggaran.",
        sections: [
          {
            heading: "Pendirian kami",
            body: [
              "Perkhidmatan ini tidak menempatkan video dan tidak menyimpan katalog video. Ia bertindak sebagai perantara teknikal: ia mengikuti pautan yang dimasukkan oleh pengguna, mengakses halaman yang boleh diakses secara umum dan menyerahkan fail kepada pengguna tersebut.",
              "Fail yang dimuat turun disimpan di pelayan selama kira-kira satu jam dan kemudian dipadamkan secara automatik. Tiada salinan kekal kandungan orang lain yang kekal pada kami.",
              "Tanggungjawab atas penggunaan bahan yang dimuat turun terletak pada pengguna, sebagaimana yang dinyatakan secara jelas dalam Terma Penggunaan.",
            ],
          },
          {
            heading: "Jika hak anda dilanggar",
            body: [
              `Jika anda pemegang hak atau wakilnya dan berpendapat bahawa perkhidmatan ini digunakan untuk melanggar hak anda, hantarkan e-mel ke ${MAIL}. Kami menyemak aduan sedemikian dan mengambil tindakan.`,
            ],
          },
          {
            heading: "Perkara yang perlu dinyatakan",
            bullets: [
              "Karya yang terjejas dan atas dasar apa anda memegang hak ke atasnya.",
              "Pautan ke bahan tersebut dan, jika diketahui, keadaan pelanggaran.",
              "Butiran hubungan anda: nama individu atau nama entiti, alamat dan alamat e-mel.",
              "Jika anda bertindak bagi pihak pemegang hak, bukti kuasa anda.",
              "Pernyataan bahawa maklumat dalam aduan adalah tepat dan bahawa penggunaan bahan tersebut tidak dibenarkan oleh pemegang hak atau oleh undang-undang.",
            ],
          },
          {
            heading: "Tindakan kami",
            body: [
              "Kami menyemak aduan dalam tempoh yang munasabah, lazimnya dalam tempoh tiga puluh hari kalendar, dan jika pelanggaran disahkan, kami menyekat akses kepada bahan tersebut melalui perkhidmatan ini dan, jika perlu, akses pelanggar kepada perkhidmatan ini.",
              "Kami akan memaklumkan hasil semakan ke alamat e-mel yang anda berikan.",
            ],
          },
          {
            heading: "Aduan berniat jahat",
            body: [
              "Aduan yang mengandungi maklumat yang diketahui palsu boleh menyebabkan pengadu bertanggungjawab di bawah undang-undang yang terpakai. Kami berhak menolak untuk menimbangkan aduan yang tidak membolehkan pemegang hak mahupun bahan yang dipertikaikan dikenal pasti.",
            ],
          },
        ],
      },
    },
  },
  nl: {
    ui: {
      updated: "Versie van",
      back: "Naar de startpagina",
      operatorHeading: "Exploitant van de dienst",
      navHeading: "Andere documenten",
      labels: {
        privacy: "Privacyverklaring",
        terms: "Gebruiksvoorwaarden",
        cookies: "Cookiebeleid",
        copyright: "Voor rechthebbenden",
      },
    },
    docs: {
      privacy: {
        title: "Privacyverklaring",
        summary: `Welke gegevens ${operator.site} verzamelt, waarvoor ze nodig zijn, hoe lang ze worden bewaard en hoe u ze kunt laten verwijderen.`,
        sections: [
          {
            heading: "Algemeen",
            body: [
              `Deze privacyverklaring beschrijft welke persoonsgegevens de dienst ${operator.site} verwerkt en met welk doel. Verwerkingsverantwoordelijke is ${operator.nameNl}.`,
              "Door de dienst te gebruiken, stemt u in met de hier beschreven verwerking. Als u daarmee niet instemt, gebruik de dienst dan niet.",
              "De verwerking vindt plaats in overeenstemming met de Wet van de Republiek Kazachstan “Inzake persoonsgegevens en de bescherming daarvan” en, voor bezoekers uit de Europese Economische Ruimte, met inachtneming van de vereisten van de AVG (GDPR).",
            ],
          },
          {
            heading: "Welke gegevens wij verwerken",
            body: [
              "Wij verzamelen bewust niets meer dan wat nodig is voor de werking van de dienst en vragen niet om identiteitsdocumenten, betaalgegevens of een adres.",
            ],
            bullets: [
              "Gegevens van uw Telegram-account die de bot ontvangt wanneer u hem een bericht stuurt: numerieke ID, gebruikersnaam, voornaam en taalcode.",
              "De links die u ter download indient en gegevens over de downloadpoging zelf: platform, datum en tijd, gekozen kwaliteit en resultaat (gelukt of fout).",
              "Technische verbindingsgegevens: IP-adres, type en versie van de browser, taal en verwijzende pagina. Deze komen terecht in de serverlogboeken en in de webanalysediensten.",
              "Cookies en analyse-ID's — zie het Cookiebeleid voor meer informatie.",
            ],
          },
          {
            heading: "Waarvoor deze gegevens nodig zijn",
            bullets: [
              "Om de dienst zelf te leveren: de video via uw link ophalen en het bestand aan u verstrekken.",
              "Om uw account van dat van anderen te onderscheiden en misbruik tegen te gaan.",
              "Om de dienst te beschermen tegen geautomatiseerd misbruik: de Cloudflare Turnstile-controle voordat een link wordt ingediend.",
              "Om te begrijpen hoe de website wordt gebruikt en fouten te verhelpen — aan de hand van geanonimiseerde en geaggregeerde statistieken.",
              "Om uw verzoeken en die van rechthebbenden te beantwoorden.",
              "Om u af en toe via Telegram te benaderen en naar uw mening over de dienst te vragen — bijvoorbeeld als u ermee bent gestopt. Antwoorden is niet verplicht; wilt u zulke berichten niet ontvangen, laat het ons dan gewoon weten en wij schrijven u niet meer.",
            ],
          },
          {
            heading: "Rechtsgronden voor de verwerking",
            body: [
              "Gegevens van uw Telegram-account en gegevens over downloads worden verwerkt ter uitvoering van de Gebruiksvoorwaarden, die u aanvaardt zodra u de dienst gaat gebruiken.",
              "Analysecookies en de registratie van handelingen op de website worden verwerkt op basis van uw toestemming, die u op elk moment kunt intrekken — hoe, staat beschreven in het Cookiebeleid.",
              "Serverlogboeken en de bescherming tegen bots berusten op ons gerechtvaardigd belang om de dienst werkend en beveiligd te houden.",
              "Het vragen naar uw mening over de dienst berust op ons gerechtvaardigd belang om de dienst te verbeteren; u kunt zich daar op elk moment voor afmelden.",
            ],
          },
          {
            heading: "Gekoppelde accounts",
            body: [
              "Desgewenst kunt u uw account op een platform (Instagram, Facebook, YouTube, X, VK, TikTok) aan de bot koppelen, zodat de bot posts kan downloaden die alleen voor ingelogde gebruikers zichtbaar zijn: stories, besloten posts. Daarvoor ontvangt de bot de cookies van dat account — van de Videoner-extensie via een eenmalige code, of uit een bestand dat u hebt gestuurd.",
              "Wij bewaren alleen de cookies van het gekozen platform en verwijderen de overige onmiddellijk. Ze worden versleuteld opgeslagen en uitsluitend gebruikt voor downloads op de plek waar u ze hebt gekoppeld. Cookies die in uw privéchat zijn gekoppeld, dienen voor uw downloads, inclusief uw eigen links in groepen waaraan geen eigen account is gekoppeld; voor links van anderen worden ze niet gebruikt. Cookies die aan een groep zijn gekoppeld, dienen uitsluitend voor downloads door de leden van die groep.",
              "De rechtsgrond is uw toestemming: u koppelt het account zelf en kunt het op elk moment verwijderen met /accounts. Bij verwijdering worden de cookies onherroepelijk gewist. Als het platform de inlog niet meer accepteert, laat de bot u dat weten.",
              "Posts die via een gekoppeld account zijn gedownload, worden niet in ons kanaal gepubliceerd en niet vanuit de gedeelde cache aan andere gebruikers verstrekt.",
            ],
          },
          {
            heading: "Diensten van derden",
            body: [
              "Wij verkopen uw gegevens niet en verstrekken ze niet aan derden voor hun eigen doeleinden. Voor de werking van de dienst worden de volgende aanbieders ingeschakeld, die elk gegevens volgens hun eigen regels verwerken:",
            ],
            bullets: [
              `Telegram — werking van de bot ${BOT}.`,
              "Cloudflare — bescherming tegen bots (Turnstile), levering van de website en routering van e-mail.",
              "Google Analytics en Google Tag Manager — bezoekstatistieken.",
              "Yandex Metrica — bezoekstatistieken, klikkaart en Webvisor. Webvisor registreert handelingen op de pagina: bewegingen van de aanwijzer, scrollen en klikken. De opnamen worden uitsluitend gebruikt om de gebruiksvriendelijkheid van de website te analyseren.",
            ],
          },
          {
            heading: "Hoe lang wij gegevens bewaren",
            bullets: [
              "Gedownloade bestanden worden ongeveer een uur na aanmaak automatisch van de server verwijderd. Wij houden geen archief van uw video's bij.",
              "Gegevens over downloadpogingen worden bewaard zolang dat nodig is om misbruik tegen te gaan en verzoeken af te handelen.",
              "Accountgegevens worden bewaard zolang u de dienst gebruikt en op uw verzoek verwijderd.",
              "Serverlogboeken worden gedurende een beperkte tijd bewaard en bij rotatie overschreven.",
            ],
          },
          {
            heading: "Waar gegevens worden verwerkt",
            body: [
              "De servers van de dienst staan in een datacenter binnen de Europese Unie. Sommige van de hierboven genoemde aanbieders kunnen gegevens daarbuiten verwerken in overeenstemming met hun eigen beleid.",
            ],
          },
          {
            heading: "Uw rechten",
            body: [
              `U hebt het recht informatie te verkrijgen over de verwerking van uw gegevens, rectificatie of wissing daarvan te verlangen, uw toestemming in te trekken en bezwaar te maken tegen de verwerking. Schrijf daarvoor naar ${MAIL} vanaf het e-mailadres of het Telegram-account waarop het verzoek betrekking heeft.`,
              "Wij antwoorden binnen een redelijke termijn, in de regel binnen dertig kalenderdagen. Verwijdering van een account houdt ook verwijdering in van de daaraan gekoppelde downloadgeschiedenis.",
            ],
          },
          {
            heading: "Minderjarigen",
            body: [
              "De dienst is niet bedoeld voor en niet gericht op kinderen jonger dan 16 jaar. Wij verzamelen niet bewust gegevens van zulke gebruikers; als dat per vergissing toch is gebeurd, neem dan contact met ons op en de gegevens worden verwijderd.",
            ],
          },
          {
            heading: "Wijzigingen",
            body: [
              "Wij kunnen deze privacyverklaring bijwerken. De datum van de geldende versie staat bovenaan de pagina; wezenlijke wijzigingen maken wij in de dienst kenbaar.",
            ],
          },
        ],
      },
      terms: {
        title: "Gebruiksvoorwaarden",
        summary: `De regels voor het gebruik van ${operator.site}: wat wel mag, wat niet mag en onder welke voorwaarden de dienst werkt.`,
        sections: [
          {
            heading: "Algemeen",
            body: [
              `Deze voorwaarden regelen het gebruik van de website ${operator.site} en de Telegram-bot ${BOT}. Eigenaar en beheerder van de dienst is ${operator.nameNl}.`,
              "Door de dienst te gaan gebruiken, bevestigt u dat u deze voorwaarden hebt gelezen en aanvaardt. Als een van de voorwaarden u niet past, gebruik de dienst dan niet.",
            ],
          },
          {
            heading: "De dienst is gratis",
            body: [
              "Alle mogelijkheden van de dienst worden kosteloos aangeboden. Er zijn geen abonnementen, betaalde pakketten, betaalde videokwaliteiten of aankopen binnen de dienst.",
              "Wij tonen geen advertenties en plaatsen geen affiliatelinks.",
            ],
          },
          {
            heading: "Toegangsvoorwaarden",
            bullets: [
              "Voor downloaden op de website is geen account en geen inlog nodig. De bot onderscheidt gebruikers aan de hand van hun Telegram-account.",
              "Technische beperkingen op de frequentie van verzoeken beschermen de dienst tegen overbelasting en geautomatiseerd misbruik.",
              "Voor YouTube geldt een dagelijkse datalimiet: 10 GB per 24 uur per netwerk op de website en in de extensie, en 25 GB per 24 uur per Telegram-account in de bot. Andere platforms vallen hier niet onder.",
              "Voor downloaden via de bot is een abonnement op ons kanaal niet vereist. De bot voegt in de tekst bij bestanden een link toe naar het nieuwskanaal van het project; abonneren daarop is niet verplicht.",
            ],
          },
          {
            heading: "Wat de dienst doet",
            body: [
              "De dienst treedt op als technische tussenpersoon: via de link die u opgeeft, benadert hij een openbaar toegankelijke pagina, haalt het mediabestand op en geeft het aan u door.",
              "Wij hosten geen videocatalogus, zoeken niet in de content van anderen en bewaren gedownloade bestanden niet langer dan nodig is voor de overdracht — ongeveer een uur.",
              "Of een bepaald platform beschikbaar is, hangt af van de technische keuzes van dat platform en kan zonder voorafgaande kennisgeving veranderen.",
            ],
          },
          {
            heading: "Verplichtingen van de gebruiker",
            body: [
              "U bent zelf verantwoordelijk voor de manier waarop u de verkregen bestanden gebruikt, en u bevestigt dat u daartoe gerechtigd bent.",
            ],
            bullets: [
              "Download uitsluitend materiaal waarvan de rechten bij u berusten of waarvan het gebruik door de rechthebbende of de wet is toegestaan.",
              "Gebruik de dienst niet om inbreuk te maken op auteursrecht of naburige rechten, om verboden content te verspreiden of om inbreuk te maken op de rechten van derden.",
              "Probeer de technische beperkingen van de dienst niet te omzeilen, waaronder de beperkingen op de frequentie van verzoeken en de botcontrole.",
              "Veroorzaak geen geautomatiseerde belasting: massale verzoeken, scripts en scrapers zijn niet toegestaan.",
            ],
          },
          {
            heading: "Publicatie van links in het kanaal",
            body: [
              "Door een video via de bot te downloaden, stemt u ermee in dat de link naar de oorspronkelijke post in ons Telegram-kanaal wordt gepubliceerd. Een melding hierover wordt in de bot getoond voordat u een kwaliteit kiest — dus voordat u besluit te downloaden.",
              "De publicatie is anoniem: naar het kanaal gaan de link naar een openbaar toegankelijke pagina, de titel van de video en de omslagafbeelding — hetzelfde beeld dat het platform zelf toont in de preview van de post. Wie de video heeft gedownload, wordt niet vermeld. Het videobestand zelf wordt nooit en nergens gepubliceerd: wat wordt verspreid is de link, die de platforms zelf aanbieden om te verspreiden via de knop “Delen” onder elke post.",
              "Dezelfde link wordt niet meer dan één keer gepubliceerd. Als u niet wilt dat een link in het kanaal terechtkomt, download die video dan niet via onze dienst.",
              "Links uit groepen en posts die via een gekoppeld account zijn gedownload, worden niet in het kanaal gepubliceerd."
            ],
          },
          {
            heading: "Uw eigen account koppelen",
            body: [
              "Door uw account op een platform aan de bot te koppelen, bevestigt u dat het uw account is en dat u gerechtigd bent het op deze manier te gebruiken.",
              "Platforms keuren geautomatiseerde downloads niet goed en kunnen een gekoppeld account beperken of blokkeren. Dit risico neemt u voor eigen rekening; wij raden aan een apart account te koppelen in plaats van uw hoofdaccount. Wij zijn niet aansprakelijk voor beperkingen die een platform aan uw account oplegt.",
              "Een aan een groep gekoppeld account wordt gebruikt voor downloads door alle leden van die groep. De beheerders van de groep bepalen wie accounts mag koppelen en kunnen elk daarvan verwijderen.",
            ],
          },
          {
            heading: "Beperking van aansprakelijkheid",
            body: [
              "De dienst wordt geleverd “in de huidige staat”. Wij garanderen geen ononderbroken werking, geen beschikbaarheid van een bepaald platform en niet dat een bestand geschikt is voor uw doeleinden.",
              "Wij zijn niet aansprakelijk voor wat u met het gedownloade materiaal doet, noch voor de gevolgen van inbreuken die u maakt op de rechten van derden.",
              "Wij hebben het recht het aanbod van de dienst te wijzigen, de dienst voor onderhoud op te schorten en de dienst te beëindigen.",
            ],
          },
          {
            heading: "Beperking van de toegang",
            body: [
              "Wij kunnen de toegang tot de dienst beperken of beëindigen bij schending van deze voorwaarden, bij pogingen om beperkingen te omzeilen en bij een gegronde klacht van een rechthebbende.",
            ],
          },
          {
            heading: "Wijzigingen en toepasselijk recht",
            body: [
              "Wij kunnen deze voorwaarden wijzigen; de datum van de geldende versie staat bovenaan de pagina. Door de dienst na een wijziging te blijven gebruiken, aanvaardt u de nieuwe versie.",
              "Op de rechtsverhouding tussen de partijen is het recht van de Republiek Kazachstan van toepassing. De partijen streven ernaar geschillen via correspondentie te beslechten en, bij gebreke van overeenstemming, op de wijze die is vastgelegd in de wetgeving van de Republiek Kazachstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookiebeleid",
        summary: `Welke cookies ${operator.site} gebruikt, waarvoor ze dienen en hoe u ze kunt weigeren.`,
        sections: [
          {
            heading: "Wat cookies zijn",
            body: [
              "Cookies zijn kleine tekstbestanden die een website in uw browser opslaat. Ze maken het mogelijk uw instellingen te onthouden en geanonimiseerde bezoekstatistieken te verzamelen.",
              "Naast cookies beschrijven wij in dit document ook verwante technologieën: de lokale opslag van de browser en trackingpixels.",
            ],
          },
          {
            heading: "Strikt noodzakelijke cookies",
            body: [
              "Zonder deze cookies werkt de dienst niet, daarom worden ze altijd geplaatst.",
            ],
            bullets: [
              "Cloudflare Turnstile — controleert of een link door een mens wordt ingediend en niet door een script.",
              "Interface-instellingen — de door u gekozen taal en het kleurthema.",
            ],
          },
          {
            heading: "Analytische cookies",
            body: [
              "Deze helpen ons te begrijpen welke pagina's worden gebruikt en waar fouten optreden. Ze worden geplaatst met uw toestemming en zijn niet vereist voor de werking van de dienst.",
            ],
            bullets: [
              "Google Analytics en Google Tag Manager — bezoekersaantallen en gedrag op de website, in geanonimiseerde vorm.",
              "Yandex Metrica — bezoekersaantallen, klikkaart en Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor van Yandex Metrica registreert handelingen op de pagina: bewegingen van de aanwijzer, scrollen, klikken en invoer in het linkveld. Dit dient om te zien waar de interface gebruikers in verwarring brengt.",
              "Wij gebruiken deze opnamen niet om individuele personen te volgen. Voer in de velden van de website geen informatie in die u niet opgeslagen wilt zien.",
            ],
          },
          {
            heading: "Hoe u cookies weigert",
            bullets: [
              "Stel in uw browser in dat cookies worden geblokkeerd of verwijderd — dit werkt voor alle hier genoemde systemen.",
              "Google Analytics: de officiële browser-add-on waarmee de gegevensverzameling wordt uitgeschakeld, is verkrijgbaar op de website van Google.",
              "Yandex Metrica: afmelden is mogelijk via de officiële add-on van Yandex.",
              "Als u strikt noodzakelijke cookies uitschakelt, is downloaden niet meer mogelijk.",
            ],
          },
          {
            heading: "Bewaartermijnen",
            body: [
              "Sessiecookies worden verwijderd wanneer u de browser sluit of wanneer de sessie verloopt. Analysediensten bewaren hun ID's gedurende de termijnen die door hun aanbieders zijn vastgesteld.",
            ],
          },
        ],
      },
      copyright: {
        title: "Voor rechthebbenden",
        summary: "Het standpunt van de dienst ten aanzien van auteursrecht en de procedure voor het indienen van een klacht over inbreuk.",
        sections: [
          {
            heading: "Standpunt van de dienst",
            body: [
              "De dienst host geen video's en houdt geen catalogus daarvan bij. Hij treedt op als technische tussenpersoon: via de link die een gebruiker heeft ingevoerd, benadert hij een openbaar toegankelijke pagina en geeft het bestand door aan die gebruiker.",
              "Gedownloade bestanden blijven ongeveer een uur op de server staan en worden daarna automatisch verwijderd. Er blijft bij ons geen blijvende kopie van content van anderen achter.",
              "De verantwoordelijkheid voor het gebruik van gedownload materiaal ligt bij de gebruiker — dit is uitdrukkelijk vastgelegd in de Gebruiksvoorwaarden.",
            ],
          },
          {
            heading: "Als inbreuk wordt gemaakt op uw rechten",
            body: [
              `Als u rechthebbende of diens vertegenwoordiger bent en meent dat de dienst wordt gebruikt om inbreuk te maken op uw rechten, schrijf dan naar ${MAIL}. Wij beoordelen zulke klachten en nemen maatregelen.`,
            ],
          },
          {
            heading: "Wat u in de klacht vermeldt",
            bullets: [
              "Om welk werk het gaat en op grond waarvan u de rechten daarop bezit.",
              "Een link naar het materiaal en, voor zover bekend, de omstandigheden van de inbreuk.",
              "Uw contactgegevens: naam of bedrijfsnaam, adres en e-mailadres.",
              "Als u namens een rechthebbende optreedt — een bewijs van uw vertegenwoordigingsbevoegdheid.",
              "Een verklaring dat de informatie in de klacht juist is en dat het gebruik van het materiaal niet door de rechthebbende of de wet is toegestaan.",
            ],
          },
          {
            heading: "Wat wij doen",
            body: [
              "Wij beoordelen een klacht binnen een redelijke termijn, in de regel binnen dertig kalenderdagen, en blokkeren bij bevestiging van de inbreuk de toegang tot het materiaal via de dienst en zo nodig de toegang van de inbreukmaker tot de dienst.",
              "Over de uitkomst van de beoordeling informeren wij u via het door u opgegeven e-mailadres.",
            ],
          },
          {
            heading: "Klachten te kwader trouw",
            body: [
              "Een klacht die willens en wetens onjuiste informatie bevat, kan leiden tot aansprakelijkheid van de indiener op grond van het toepasselijke recht. Wij kunnen weigeren een klacht in behandeling te nemen als daaruit noch de rechthebbende noch het betwiste materiaal kan worden vastgesteld.",
            ],
          },
        ],
      },
    },
  },
  ro: {
    ui: {
      updated: "Versiunea din",
      back: "Înapoi la pagina principală",
      operatorHeading: "Operatorul serviciului",
      navHeading: "Alte documente",
      labels: {
        privacy: "Politica de confidențialitate",
        terms: "Termeni de utilizare",
        cookies: "Politica privind cookie-urile",
        copyright: "Pentru titularii de drepturi",
      },
    },
    docs: {
      privacy: {
        title: "Politica de confidențialitate",
        summary: `Ce date colectează ${operator.site}, de ce sunt necesare, cât timp sunt păstrate și cum puteți solicita ștergerea lor.`,
        sections: [
          {
            heading: "Dispoziții generale",
            body: [
              `Prezenta Politică descrie ce date cu caracter personal prelucrează serviciul ${operator.site} și în ce scop. Operatorul de date este ${operator.nameRo}.`,
              "Prin utilizarea serviciului, sunteți de acord cu modul de prelucrare descris aici. Dacă nu sunteți de acord cu acesta, vă rugăm să nu utilizați serviciul.",
              "Prelucrarea se efectuează în conformitate cu Legea Republicii Kazahstan „Cu privire la datele cu caracter personal și protecția acestora”, iar în cazul vizitatorilor din Spațiul Economic European — ținând seama de cerințele RGPD (GDPR).",
            ],
          },
          {
            heading: "Ce date prelucrăm",
            body: [
              "În mod deliberat, nu colectăm nimic în plus față de ceea ce este necesar pentru funcționarea serviciului și nu solicităm acte de identitate, date de plată sau adresa poștală.",
            ],
            bullets: [
              "Datele contului Telegram pe care botul le primește atunci când îi scrieți: identificatorul numeric, numele de utilizator, prenumele și codul limbii.",
              "Linkurile pe care le trimiteți pentru descărcare și informațiile despre încercarea propriu-zisă: platforma, data și ora, calitatea aleasă, rezultatul (reușită sau eroare).",
              "Datele tehnice ale conexiunii: adresa IP, tipul și versiunea browserului, limba, pagina de proveniență. Acestea ajung în jurnalele serverului și în sistemele de analiză web.",
              "Cookie-uri și identificatori de analiză — detalii în Politica privind cookie-urile.",
            ],
          },
          {
            heading: "De ce sunt necesare aceste date",
            bullets: [
              "Pentru a furniza serviciul propriu-zis: a obține videoclipul de la linkul dumneavoastră și a vă transmite fișierul.",
              "Pentru a deosebi contul dumneavoastră de alte conturi și a preveni abuzurile.",
              "Pentru a proteja serviciul împotriva abuzurilor automatizate: verificarea Cloudflare Turnstile înainte de trimiterea linkului.",
              "Pentru a înțelege cum este utilizat site-ul și a remedia erorile — statistici anonimizate și agregate.",
              "Pentru a răspunde solicitărilor dumneavoastră și ale titularilor de drepturi.",
              "Pentru a vă scrie ocazional pe Telegram, ca să aflăm părerea dumneavoastră despre serviciu — de exemplu, dacă ați încetat să îl utilizați. Răspunsul este opțional; dacă nu doriți astfel de mesaje, spuneți-ne pur și simplu și nu vă vom mai scrie.",
            ],
          },
          {
            heading: "Temeiurile prelucrării",
            body: [
              "Datele contului Telegram și informațiile despre descărcări sunt prelucrate în vederea executării Termenilor de utilizare, pe care îi acceptați atunci când începeți să utilizați serviciul.",
              "Cookie-urile de analiză și înregistrarea acțiunilor pe site sunt prelucrate pe baza consimțământului dumneavoastră, pe care îl puteți retrage în orice moment — modalitățile sunt descrise în Politica privind cookie-urile.",
              "Jurnalele serverului și protecția împotriva boților se întemeiază pe interesul nostru legitim de a menține serviciul funcțional și securizat.",
              "Solicitarea părerii dumneavoastră despre serviciu se întemeiază pe interesul nostru legitim de a îmbunătăți serviciul; puteți renunța la aceste solicitări în orice moment.",
            ],
          },
          {
            heading: "Conturi conectate",
            body: [
              "Dacă doriți, puteți conecta la bot contul dumneavoastră de pe o platformă (Instagram, Facebook, YouTube, X, VK, TikTok), astfel încât botul să descarce postări vizibile doar utilizatorilor autentificați: stories, postări private. În acest scop, botul primește cookie-urile acelui cont — de la extensia Videoner, printr-un cod de unică folosință, sau dintr-un fișier pe care l-ați trimis.",
              "Păstrăm doar cookie-urile platformei alese, iar pe celelalte le eliminăm imediat. Acestea sunt stocate în formă criptată și sunt utilizate doar pentru descărcări acolo unde le-ați conectat. Cookie-urile conectate în conversația privată servesc descărcărilor dumneavoastră, inclusiv propriilor linkuri în grupurile care nu au un cont conectat; nu sunt utilizate niciodată pentru linkurile altor persoane. Cookie-urile conectate la un grup servesc descărcărilor membrilor acestuia și nimic altceva.",
              "Temeiul este consimțământul dumneavoastră: contul îl conectați chiar dumneavoastră și îl puteți elimina în orice moment cu comanda /accounts. La eliminare, cookie-urile sunt șterse definitiv. Dacă platforma nu mai acceptă autentificarea, botul vă anunță.",
              "Postările descărcate prin intermediul unui cont conectat nu sunt publicate în canalul nostru și nu sunt furnizate altor utilizatori din memoria cache comună.",
            ],
          },
          {
            heading: "Servicii terțe",
            body: [
              "Nu vindem datele dumneavoastră și nu le transmitem terților în scopurile proprii ale acestora. Pentru funcționarea serviciului folosim următorii furnizori, fiecare dintre ei prelucrând datele conform propriilor reguli:",
            ],
            bullets: [
              `Telegram — funcționarea botului ${BOT}.`,
              "Cloudflare — protecția împotriva boților (Turnstile), livrarea site-ului și rutarea e-mailurilor.",
              "Google Analytics și Google Tag Manager — statistici privind vizitele.",
              "Yandex Metrica — statistici privind vizitele, harta clicurilor și Webvisor. Webvisor înregistrează acțiunile de pe pagină: mișcările cursorului, derularea și clicurile. Înregistrările sunt utilizate exclusiv pentru a analiza ușurința de utilizare a site-ului.",
            ],
          },
          {
            heading: "Cât timp păstrăm datele",
            bullets: [
              "Fișierele descărcate sunt șterse automat de pe server la aproximativ o oră după crearea lor. Nu păstrăm o arhivă a videoclipurilor dumneavoastră.",
              "Înregistrările privind încercările de descărcare sunt păstrate atât timp cât este necesar pentru prevenirea abuzurilor și soluționarea solicitărilor.",
              "Datele contului sunt păstrate cât timp utilizați serviciul și sunt șterse la cererea dumneavoastră.",
              "Jurnalele serverului sunt păstrate o perioadă limitată și sunt suprascrise pe măsura rotației lor.",
            ],
          },
          {
            heading: "Unde sunt prelucrate datele",
            body: [
              "Serverele serviciului se află într-un centru de date pe teritoriul Uniunii Europene. Unii dintre furnizorii enumerați mai sus pot prelucra date în afara acesteia, în conformitate cu propriile politici.",
            ],
          },
          {
            heading: "Drepturile dumneavoastră",
            body: [
              `Aveți dreptul să obțineți informații despre prelucrarea datelor dumneavoastră, să solicitați rectificarea sau ștergerea acestora, să vă retrageți consimțământul și să vă opuneți prelucrării. Pentru aceasta, scrieți la ${MAIL} de pe adresa de e-mail sau din contul Telegram la care se referă solicitarea.`,
              "Răspundem într-un termen rezonabil, de regulă în cel mult treizeci de zile calendaristice. Ștergerea contului atrage ștergerea istoricului de descărcări asociat acestuia.",
            ],
          },
          {
            heading: "Minori",
            body: [
              "Serviciul nu este destinat copiilor cu vârsta sub 16 ani și nu se adresează acestora. Nu colectăm în mod intenționat datele acestor utilizatori; dacă acest lucru s-a întâmplat din eroare, scrieți-ne, iar datele vor fi șterse.",
            ],
          },
          {
            heading: "Modificări",
            body: [
              "Putem actualiza prezenta Politică. Data versiunii în vigoare este indicată în partea de sus a paginii; modificările esențiale le vom semnala în cadrul serviciului.",
            ],
          },
        ],
      },
      terms: {
        title: "Termeni de utilizare",
        summary: `Regulile de utilizare a ${operator.site}: ce este permis, ce nu este permis și în ce condiții funcționează serviciul.`,
        sections: [
          {
            heading: "Dispoziții generale",
            body: [
              `Prezenții Termeni reglementează utilizarea site-ului ${operator.site} și a botului Telegram ${BOT}. Proprietarul și administratorul serviciului este ${operator.nameRo}.`,
              "Începând să utilizați serviciul, confirmați că ați citit prezenții Termeni și că îi acceptați. Dacă vreuna dintre condiții nu vă convine, vă rugăm să nu utilizați serviciul.",
            ],
          },
          {
            heading: "Serviciul este gratuit",
            body: [
              "Toate funcționalitățile serviciului sunt oferite gratuit. Nu există abonamente, planuri plătite, calități video plătite sau achiziții în cadrul serviciului.",
              "Nu afișăm publicitate și nu plasăm linkuri de afiliere.",
            ],
          },
          {
            heading: "Condiții de acces",
            bullets: [
              "Pentru descărcarea pe site nu este nevoie nici de cont, nici de autentificare. Botul deosebește utilizatorii după contul lor Telegram.",
              "Limitele tehnice privind frecvența solicitărilor protejează serviciul împotriva supraîncărcării și a abuzurilor automatizate.",
              "Pentru YouTube se aplică o limită zilnică de trafic: 10 GB în 24 de ore per rețea pe site și în extensie și 25 GB în 24 de ore per cont Telegram în bot. Celelalte platforme nu sunt afectate.",
              "Pentru a descărca prin bot nu este necesar abonamentul la canalul nostru. În textul care însoțește fișierele, botul adaugă un link către canalul de știri al proiectului; abonarea la acesta este opțională.",
            ],
          },
          {
            heading: "Ce face serviciul",
            body: [
              "Serviciul acționează ca intermediar tehnic: pe baza linkului furnizat de dumneavoastră, accesează o pagină publică, obține fișierul media și vi-l transmite.",
              "Nu găzduim un catalog de videoclipuri, nu efectuăm căutări în conținutul altor persoane și nu păstrăm fișierele descărcate mai mult decât este necesar pentru transmitere — aproximativ o oră.",
              "Disponibilitatea unei anumite platforme depinde de deciziile tehnice ale acesteia și se poate modifica fără preaviz.",
            ],
          },
          {
            heading: "Obligațiile utilizatorului",
            body: [
              "Sunteți singurul responsabil pentru modul în care utilizați fișierele obținute și confirmați că aveți dreptul să o faceți.",
            ],
            bullets: [
              "Descărcați doar materiale asupra cărora dețineți drepturile sau a căror utilizare este permisă de titularul drepturilor ori de lege.",
              "Nu utilizați serviciul pentru a încălca dreptul de autor sau drepturile conexe, pentru a distribui conținut interzis ori pentru a încălca drepturile terților.",
              "Nu încercați să ocoliți limitele tehnice ale serviciului, inclusiv limitele privind frecvența solicitărilor și verificarea anti-bot.",
              "Nu generați încărcare automatizată: solicitările în masă, scripturile și parserele nu sunt permise.",
            ],
          },
          {
            heading: "Publicarea linkurilor în canal",
            body: [
              "Descărcând un videoclip prin bot, sunteți de acord ca linkul către postarea originală să fie publicat în canalul nostru de Telegram. O notificare în acest sens este afișată în bot înainte de alegerea calității — adică înainte să decideți să descărcați.",
              "Publicarea este anonimă: în canal ajung linkul către pagina publică, titlul videoclipului și coperta acestuia — chiar cadrul pe care platforma îl afișează în previzualizarea postării. Cine a descărcat videoclipul nu se menționează. Fișierul video propriu-zis nu este publicat niciodată, nicăieri: se distribuie linkul, pe care înseși platformele invită la distribuire prin butonul „Distribuie” de sub fiecare postare.",
              "Același link este publicat cel mult o dată. Dacă nu doriți ca un link să ajungă în canal, nu descărcați acel videoclip prin serviciul nostru.",
              "Linkurile din grupuri și postările descărcate prin intermediul unui cont conectat nu sunt publicate niciodată în canal."
            ],
          },
          {
            heading: "Conectarea contului dumneavoastră",
            body: [
              "Conectând la bot contul dumneavoastră de pe o platformă, confirmați că este contul dumneavoastră și că aveți dreptul să îl utilizați în acest mod.",
              "Platformele nu aprobă descărcările automatizate și pot restricționa sau bloca un cont conectat. Vă asumați acest risc; vă recomandăm să conectați un cont secundar, nu pe cel principal. Nu răspundem pentru restricțiile pe care o platformă le impune contului dumneavoastră.",
              "Un cont conectat la un grup este utilizat pentru descărcările tuturor membrilor acestuia. Administratorii grupului decid cine poate conecta conturi și pot elimina oricare dintre ele.",
            ],
          },
          {
            heading: "Limitarea răspunderii",
            body: [
              "Serviciul este furnizat „ca atare”. Nu garantăm funcționarea neîntreruptă, disponibilitatea unei anumite platforme sau adecvarea unui fișier scopurilor dumneavoastră.",
              "Nu răspundem pentru modul în care ați utilizat materialele descărcate și nici pentru consecințele încălcării de către dumneavoastră a drepturilor terților.",
              "Avem dreptul să modificăm funcționalitățile serviciului, să suspendăm funcționarea acestuia pentru mentenanță și să încetăm funcționarea acestuia.",
            ],
          },
          {
            heading: "Restricționarea accesului",
            body: [
              "Putem restricționa sau înceta accesul la serviciu în cazul încălcării prezenților Termeni, al încercărilor de a ocoli limitele, precum și la primirea unei plângeri întemeiate din partea unui titular de drepturi.",
            ],
          },
          {
            heading: "Modificări și legea aplicabilă",
            body: [
              "Putem modifica prezenții Termeni; data versiunii în vigoare este indicată în partea de sus a paginii. Continuarea utilizării serviciului după modificări înseamnă că acceptați noua versiune.",
              "Raporturilor dintre părți li se aplică legislația Republicii Kazahstan. Părțile vor încerca să soluționeze litigiile prin corespondență, iar în lipsa unui acord — în modul stabilit de legislația Republicii Kazahstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Politica privind cookie-urile",
        summary: `Ce cookie-uri utilizează ${operator.site}, la ce servesc și cum le puteți refuza.`,
        sections: [
          {
            heading: "Ce sunt cookie-urile",
            body: [
              "Cookie-urile sunt fișiere text de mici dimensiuni pe care un site le stochează în browserul dumneavoastră. Ele permit memorarea setărilor dumneavoastră și colectarea de statistici anonimizate privind vizitele.",
              "Pe lângă cookie-uri, în acest document descriem și tehnologii similare — stocarea locală a browserului și pixelii de urmărire.",
            ],
          },
          {
            heading: "Strict necesare",
            body: [
              "Fără acestea serviciul nu funcționează, de aceea ele sunt plasate întotdeauna.",
            ],
            bullets: [
              "Cloudflare Turnstile — verifică faptul că linkul este trimis de o persoană, nu de un script.",
              "Setările interfeței — limba și tema de culori alese.",
            ],
          },
          {
            heading: "De analiză",
            body: [
              "Acestea ne ajută să înțelegem ce pagini sunt utilizate și unde apar erori. Sunt plasate cu consimțământul dumneavoastră și nu sunt necesare pentru funcționarea serviciului.",
            ],
            bullets: [
              "Google Analytics și Google Tag Manager — traficul și comportamentul pe site, în formă anonimizată.",
              "Yandex Metrica — traficul, harta clicurilor și Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor din Yandex Metrica înregistrează acțiunile de pe pagină: mișcările cursorului, derularea, clicurile și textul introdus în câmpul pentru link. Acest lucru ne permite să vedem unde interfața îi derutează pe utilizatori.",
              "Nu folosim aceste înregistrări pentru a urmări persoane anume. Vă rugăm să nu introduceți în câmpurile site-ului informații pe care nu ați dori să fie stocate.",
            ],
          },
          {
            heading: "Cum puteți refuza",
            bullets: [
              "Configurați blocarea sau ștergerea cookie-urilor în setările browserului dumneavoastră — această metodă funcționează pentru toate sistemele enumerate aici.",
              "Google Analytics: suplimentul oficial de browser care dezactivează colectarea este disponibil pe site-ul Google.",
              "Yandex Metrica: refuzul este posibil prin suplimentul oficial Yandex.",
              "Dezactivarea cookie-urilor strict necesare va face imposibilă descărcarea.",
            ],
          },
          {
            heading: "Durata de stocare",
            body: [
              "Cookie-urile de sesiune sunt șterse la închiderea browserului sau la expirarea sesiunii. Instrumentele de analiză își păstrează identificatorii pe durata stabilită de furnizorii lor.",
            ],
          },
        ],
      },
      copyright: {
        title: "Pentru titularii de drepturi",
        summary: "Poziția serviciului privind dreptul de autor și procedura de depunere a unei plângeri privind o încălcare.",
        sections: [
          {
            heading: "Poziția serviciului",
            body: [
              "Serviciul nu găzduiește videoclipuri și nu ține un catalog al acestora. Acționează ca intermediar tehnic: pe baza linkului introdus de utilizator, accesează o pagină publică și îi transmite utilizatorului fișierul.",
              "Fișierele descărcate sunt păstrate pe server aproximativ o oră și apoi sunt șterse automat. Nu rămâne la noi nicio copie permanentă a conținutului altor persoane.",
              "Răspunderea pentru utilizarea materialelor descărcate revine utilizatorului — acest lucru este prevăzut în mod expres în Termenii de utilizare.",
            ],
          },
          {
            heading: "Dacă drepturile dumneavoastră sunt încălcate",
            body: [
              `Dacă sunteți titular de drepturi sau reprezentantul acestuia și considerați că serviciul este utilizat pentru a vă încălca drepturile, scrieți la ${MAIL}. Examinăm astfel de solicitări și luăm măsuri.`,
            ],
          },
          {
            heading: "Ce trebuie să conțină solicitarea",
            bullets: [
              "Ce operă este vizată și în temeiul cărui drept dețineți drepturi asupra acesteia.",
              "Linkul către material și, dacă sunt cunoscute, împrejurările încălcării.",
              "Datele dumneavoastră de contact: numele sau denumirea, adresa și adresa de e-mail.",
              "Dacă acționați în numele titularului de drepturi — dovada împuternicirii.",
              "O declarație că informațiile din solicitare sunt exacte, iar utilizarea materialului nu este autorizată de titularul drepturilor sau de lege.",
            ],
          },
          {
            heading: "Ce vom face",
            body: [
              "Examinăm solicitarea într-un termen rezonabil, de regulă în cel mult treizeci de zile calendaristice, iar dacă încălcarea se confirmă, restricționăm accesul la material prin intermediul serviciului și, dacă este necesar, accesul autorului încălcării la serviciu.",
              "Vă vom comunica rezultatul examinării la adresa de e-mail indicată de dumneavoastră.",
            ],
          },
          {
            heading: "Solicitări de rea-credință",
            body: [
              "O solicitare care conține informații cu bună știință false poate atrage răspunderea solicitantului în conformitate cu legislația aplicabilă. Putem refuza examinarea unei solicitări care nu permite identificarea nici a titularului de drepturi, nici a materialului în litigiu.",
            ],
          },
        ],
      },
    },
  },
  ps: {
    ui: {
      updated: "د نسخې نېټه",
      back: "اصلي پاڼې ته ستنېدل",
      operatorHeading: "د خدمت چلوونکی",
      navHeading: "نور اسناد",
      labels: {
        privacy: "د محرمیت پالیسي",
        terms: "د کارونې شرطونه",
        cookies: "د کوکيز پالیسي",
        copyright: "د حق لرونکو لپاره",
      },
    },
    docs: {
      privacy: {
        title: "د محرمیت پالیسي",
        summary: `${operator.site} کوم معلومات راټولوي، دا معلومات ولې اړین دي، څومره موده ساتل کېږي او څنګه یې ړنګول کېدای شي.`,
        sections: [
          {
            heading: "عمومي احکام",
            body: [
              `دا پالیسي بیانوي چې د ${operator.site} خدمت کوم شخصي معلومات او په کوم هدف پروسس کوي. د معلوماتو چلوونکی (data controller) ${operator.namePs} دی.`,
              "د خدمت په کارولو سره تاسو دلته د بیان شوي پروسس له طریقې سره موافقه کوئ. که له دې سره موافق نه یاست، مهرباني وکړئ له خدمت څخه کار مه اخلئ.",
              "پروسس د قزاقستان جمهوریت د «شخصي معلوماتو او د هغو د ساتنې په اړه» قانون سره سم ترسره کېږي، او د اروپايي اقتصادي سیمې د لیدونکو په اړه د GDPR د غوښتنو په پام کې نیولو سره.",
            ],
          },
          {
            heading: "موږ کوم معلومات پروسس کوو",
            body: [
              "موږ په قصدي ډول د خدمت د کار له اړتیا څخه زیات هېڅ نه راټولوو او د هویت اسناد، د تادیې معلومات یا پته نه غواړو.",
            ],
            bullets: [
              "د Telegram د حساب معلومات چې بوټ یې هغه وخت ترلاسه کوي کله چې تاسو ورته لیکئ: شمېري پېژندګڼه (ID)، کارن نوم (username)، نوم او د ژبې کوډ.",
              "هغه لینکونه چې تاسو یې د ښکته کولو لپاره لېږئ، او پخپله د هڅې په اړه معلومات: پلاتفورم، نېټه او وخت، ټاکل شوی کیفیت او پایله (بریا یا تېروتنه).",
              "د اتصال تخنیکي معلومات: IP پته، د براوزر ډول او نسخه، ژبه او هغه پاڼه چې له هغې راغلي یاست. دا معلومات د سرور په لاګونو (logs) او د وېب تحلیل په سیستمونو کې ثبتېږي.",
              "کوکيز او د تحلیل پېژندګڼې — تفصیل یې د کوکيز په پالیسۍ کې دی.",
            ],
          },
          {
            heading: "دا معلومات ولې اړین دي",
            bullets: [
              "پخپله خدمت وړاندې کول: ستاسو د لینک له مخې ویډیو ترلاسه کول او تاسو ته د فایل سپارل.",
              "ستاسو د حساب له نورو حسابونو څخه توپیر کول او د ناوړه ګټې اخیستنې مخنیوی.",
              "خدمت له اتومات ناوړه ګټې اخیستنې څخه ساتل: د لینک له لېږلو مخکې د Cloudflare Turnstile ازموینه.",
              "پوهېدل چې سایټ څنګه کارول کېږي، او د تېروتنو سمول — د بې نومه او راټولې شوې (aggregated) احصایې په مرسته.",
              "ستاسو او د حق لرونکو غوښتنو ته ځواب ورکول.",
              "کله ناکله تاسو ته په Telegram کې لیکل، ترڅو د خدمت په اړه ستاسو نظر معلوم کړو — د بېلګې په توګه، که تاسو له هغه کار اخیستل پرېښي وي. ځواب ورکول اړین نه دي؛ که دا ډول پیغامونه نه غواړئ، یوازې یې ووایاست، او موږ به بیا درته ونه لیکو.",
            ],
          },
          {
            heading: "د پروسس حقوقي بنسټونه",
            body: [
              "د Telegram د حساب معلومات او د ښکته کولو په اړه معلومات د کارونې د شرطونو د پلي کولو لپاره پروسس کېږي، چې تاسو یې د خدمت د کارولو په پیل سره منئ.",
              "د تحلیل کوکيز او په سایټ کې د کړنو ثبت ستاسو د رضایت پر بنسټ پروسس کېږي، چې تاسو یې هر وخت بېرته اخیستلای شئ — طریقې یې د کوکيز په پالیسۍ کې بیان شوې دي.",
              "د سرور لاګونه او د بوټونو پر وړاندې ساتنه زموږ د دې مشروع ګټې په چوکاټ کې پروسس کېږي چې خدمت فعال او خوندي وساتو.",
              "د خدمت په اړه ستاسو د نظر پوښتل زموږ د دې مشروع ګټې په چوکاټ کې دي چې خدمت ښه کړو؛ تاسو هر وخت له دې پوښتنو انکار کولای شئ.",
            ],
          },
          {
            heading: "وصل شوي حسابونه",
            body: [
              "که وغواړئ، کولای شئ په یوه پلاتفورم (Instagram، Facebook، YouTube، X، VK، TikTok) کې خپل حساب له بوټ سره وصل کړئ، ترڅو بوټ هغه پوسټونه ښکته کړي چې یوازې ننوتلو کاروونکو ته ښکاري: سټوریګانې (stories) او خصوصي پوسټونه. د دې لپاره بوټ د هغه حساب کوکيز ترلاسه کوي — د Videoner له توسیع څخه د یو ځلي کوډ له لارې، یا له هغه فایل څخه چې تاسو لېږلی وي.",
              "موږ یوازې د ټاکل شوي پلاتفورم کوکيز ساتو او پاتې نور سمدستي لرې کوو. دا کوکيز په کوډ شوې (encrypted) بڼه ساتل کېږي او یوازې هلته د ښکته کولو لپاره کارول کېږي چېرې چې تاسو وصل کړي دي. هغه کوکيز چې په شخصي چټ کې وصل شوي وي، ستاسو د ښکته کولو لپاره کارول کېږي، په شمول د هغو ګروپونو کې ستاسو د خپلو لینکونو چې خپل حساب یې نه دی وصل شوی؛ د نورو کسانو د لینکونو لپاره نه کارول کېږي. هغه کوکيز چې له ګروپ سره وصل شوي وي، یوازې د هغه ګروپ د غړو د ښکته کولو لپاره کارول کېږي او بل هېڅ ځای کې نه.",
              "حقوقي بنسټ ستاسو رضایت دی: تاسو حساب پخپله وصل کوئ او کولای شئ هر وخت یې د ‎/accounts کمانډ په مرسته لرې کړئ. د لرې کولو پر مهال کوکيز د تل لپاره ړنګېږي. که پلاتفورم ننوتل نور ونه مني، بوټ تاسو ته خبر درکوي.",
              "هغه پوسټونه چې د وصل شوي حساب له لارې ښکته شوي وي، زموږ په چینل کې نه خپرېږي او له ګډ کېش (cache) څخه نورو کاروونکو ته نه ورکول کېږي.",
            ],
          },
          {
            heading: "د دریمګړو خدمتونه",
            body: [
              "موږ ستاسو معلومات نه پلورو او نه یې دریمګړو ته د هغوی د خپلو موخو لپاره ورکوو. د خدمت د کار لپاره لاندې چمتو کوونکي کارول کېږي، چې هر یو یې معلومات د خپلو قواعدو سره سم پروسس کوي:",
            ],
            bullets: [
              `Telegram — د ‎${BOT} بوټ چلول.`,
              "Cloudflare — د بوټونو پر وړاندې ساتنه (Turnstile)، د سایټ رسول او د برېښنالیک لارښوونه (routing).",
              "Google Analytics او Google Tag Manager — د لیدنو احصایه.",
              "Yandex Metrica — د لیدنو احصایه، د کلیکونو نقشه او Webvisor. Webvisor په پاڼه کې کړنې ثبتوي: د نښه ګر (pointer) خوځښت، سکرول او کلیکونه. دا ثبتونه یوازې د سایټ د اسانتیا د تحلیل لپاره کارول کېږي.",
            ],
          },
          {
            heading: "معلومات څومره موده ساتو",
            bullets: [
              "ښکته شوي فایلونه د جوړېدو نږدې یو ساعت وروسته په اتومات ډول له سرور څخه ړنګېږي. موږ ستاسو د ویډیوګانو آرشیف نه ساتو.",
              "د ښکته کولو د هڅو ثبتونه تر هغه وخته ساتل کېږي چې د ناوړه ګټې اخیستنې د مخنیوي او د غوښتنو د څېړلو لپاره اړین وي.",
              "د حساب معلومات تر هغه وخته ساتل کېږي چې تاسو له خدمت څخه کار اخلئ، او ستاسو په غوښتنه ړنګېږي.",
              "د سرور لاګونه د محدودې مودې لپاره ساتل کېږي او د څرخېدو (rotation) په بهیر کې له سره لیکل کېږي.",
            ],
          },
          {
            heading: "معلومات چېرې پروسس کېږي",
            body: [
              "د خدمت سرورونه د اروپايي اتحادیې په خاوره کې په یوه ډېټا سنټر کې دي. پورته یاد شوي ځینې چمتو کوونکي ښايي معلومات له هغې بهر د خپلو پالیسیو سره سم پروسس کړي.",
            ],
          },
          {
            heading: "ستاسو حقونه",
            body: [
              `تاسو حق لرئ د خپلو معلوماتو د پروسس په اړه معلومات ترلاسه کړئ، د هغو د سمولو یا ړنګولو غوښتنه وکړئ، خپل رضایت بېرته واخلئ او د پروسس پر وړاندې اعتراض وکړئ. د دې لپاره ${MAIL} ته له هغه برېښنالیک یا Telegram حساب څخه ولیکئ چې غوښتنه ورپورې اړه لري.`,
              "موږ په مناسبه موده کې ځواب ورکوو، معمولاً د دېرشو تقویمي ورځو په ترڅ کې. د حساب ړنګول له هغه سره تړلې د ښکته کولو تاریخچه هم ړنګوي.",
            ],
          },
          {
            heading: "کم عمره کسان",
            body: [
              "دا خدمت له 16 کلونو څخه د کم عمر لرونکو ماشومانو لپاره نه دی جوړ شوی او هغوی ته نه دی متوجه. موږ په قصدي ډول د داسې کاروونکو معلومات نه راټولوو؛ که دا په تېروتنه پېښ شوي وي، موږ ته ولیکئ، او معلومات به ړنګ شي.",
            ],
          },
          {
            heading: "بدلونونه",
            body: [
              "موږ کولای شو دا پالیسي تازه کړو. د اوسنۍ نسخې نېټه د پاڼې په سر کې ښودل شوې ده؛ مهم بدلونونه به په خدمت کې په ګوته کړو.",
            ],
          },
        ],
      },
      terms: {
        title: "د کارونې شرطونه",
        summary: `د ${operator.site} د کارولو قواعد: څه جواز لري، څه جواز نه لري او خدمت په کومو شرطونو کار کوي.`,
        sections: [
          {
            heading: "عمومي احکام",
            body: [
              `دا شرطونه د ${operator.site} وېبسایټ او د Telegram بوټ ‎${BOT} کارول تنظیموي. د خدمت مالک او اداره کوونکی ${operator.namePs} دی.`,
              "د خدمت په کارولو پیل سره تاسو تاییدوئ چې دا شرطونه مو لوستي او منئ یې. که کوم شرط تاسو ته مناسب نه وي، له خدمت څخه کار مه اخلئ.",
            ],
          },
          {
            heading: "خدمت وړیا دی",
            body: [
              "د خدمت ټولې اسانتیاوې وړیا وړاندې کېږي. موږ ګډون (subscription)، پیسه لرونکي پلانونه، د ویډیو پیسه لرونکي کیفیتونه او دننني پېرودونه نه لرو.",
              "موږ اعلانونه نه ښیو او د همکارۍ (affiliate) لینکونه نه ځای پر ځای کوو.",
            ],
          },
          {
            heading: "د لاسرسي شرطونه",
            bullets: [
              "په سایټ کې د ښکته کولو لپاره نه حساب ته اړتیا شته او نه ننوتلو ته. بوټ کاروونکي د هغوی د Telegram حساب له مخې سره بېلوي.",
              "د غوښتنو پر شمېر تخنیکي محدودیتونه خدمت له زیات بار او اتومات ناوړه ګټې اخیستنې څخه ساتي.",
              "د YouTube لپاره د ترافیک ورځنی حد شته: په سایټ او توسیع کې د هرې شبکې لپاره په 24 ساعتونو کې 10 GB، او په بوټ کې د هر Telegram حساب لپاره په 24 ساعتونو کې 25 GB. نور پلاتفورمونه پرې اغېزمن نه دي.",
              "د بوټ له لارې د ښکته کولو لپاره زموږ په چینل کې ګډون اړین نه دی. بوټ د فایلونو په متن کې د پروژې د خبرونو چینل ته لینک زیاتوي؛ په هغه کې ګډون اختیاري دی.",
            ],
          },
          {
            heading: "خدمت څه کوي",
            body: [
              "خدمت یو تخنیکي منځګړی دی: ستاسو د لینک له مخې یوې عامه لاسرسي وړ پاڼې ته مراجعه کوي، د میډیا فایل ترلاسه کوي او تاسو ته یې سپاري.",
              "موږ د ویډیوګانو کتلاګ نه ساتو، د نورو په منځپانګه کې لټون نه کوو او ښکته شوي فایلونه د سپارلو له اړین وخت څخه زیات نه ساتو — نږدې یو ساعت.",
              "د یو ټاکلي پلاتفورم شتون د هغه په تخنیکي پرېکړو پورې اړه لري او ښايي پرته له خبرتیا بدل شي.",
            ],
          },
          {
            heading: "د کاروونکي مکلفیتونه",
            body: [
              "تاسو پخپله د ترلاسه شویو فایلونو د کارولو مسؤل یاست او تاییدوئ چې د دې کار حق لرئ.",
            ],
            bullets: [
              "یوازې هغه مواد ښکته کړئ چې حقونه یې ستاسو دي، یا یې کارول د حق لرونکي یا قانون له خوا اجازه لري.",
              "له خدمت څخه د کاپي حق او اړوندو حقونو د سرغړونې، د منع شوې منځپانګې د خپرولو او د دریمګړو د حقونو د سرغړونې لپاره کار مه اخلئ.",
              "د خدمت له تخنیکي محدودیتونو، په شمول د غوښتنو د شمېر محدودیتونو او د بوټ ازموینې، د تېرېدو هڅه مه کوئ.",
              "اتومات بار مه جوړوئ: ډله ییزې غوښتنې، سکرېپټونه او پارسرونه (scrapers) اجازه نه لري.",
            ],
          },
          {
            heading: "په چینل کې د لینکونو خپرول",
            body: [
              "د بوټ له لارې د ویډیو په ښکته کولو سره تاسو موافقه کوئ چې اصلي پوسټ ته لینک به زموږ په Telegram چینل کې خپور شي. د دې په اړه خبرتیا په بوټ کې د کیفیت له ټاکلو مخکې ښودل کېږي — یعنې مخکې له دې چې د ښکته کولو پرېکړه وکړئ.",
              "خپرول بې نومه دي: چینل ته د عامه لاسرسي وړ پاڼې لینک، د ویډیو سرلیک او د هغې پوښ ځي — هماغه چوکاټ (frame) چې پلاتفورم یې د پوسټ په مخکتنه کې ښيي. دا نه ویل کېږي چې ویډیو چا ښکته کړې. پخپله د ویډیو فایل هېڅکله او هېڅ ځای کې نه خپرېږي: هغه څه چې خپرېږي لینک دی، چې پلاتفورمونه پخپله د هر پوسټ لاندې د «شریکول» (Share) تڼۍ په مرسته د هغه خپرولو ته بلنه ورکوي.",
              "یو لینک له یو ځل څخه زیات نه خپرېږي. که نه غواړئ یو لینک چینل ته ورسېږي، هغه ویډیو زموږ د خدمت له لارې مه ښکته کوئ.",
              "د ګروپونو لینکونه او هغه پوسټونه چې د وصل شوي حساب له لارې ښکته شوي وي، په چینل کې نه خپرېږي."
            ],
          },
          {
            heading: "د خپل حساب وصلول",
            body: [
              "کله چې په یوه پلاتفورم کې خپل حساب له بوټ سره وصل کوئ، تاسو تاییدوئ چې دا ستاسو خپل حساب دی او د هغه د کارولو حق لرئ.",
              "پلاتفورمونه اتومات ښکته کول نه خوښوي او ښايي وصل شوی حساب محدود یا بند کړي. دا خطر تاسو په غاړه اخلئ؛ موږ سپارښتنه کوو چې یو جلا، نه اصلي، حساب وصل کړئ. موږ د هغو محدودیتونو مسؤل نه یو چې پلاتفورم یې ستاسو پر حساب لګوي.",
              "هغه حساب چې له ګروپ سره وصل شوی وي، د هغه ګروپ د ټولو غړو د ښکته کولو لپاره کارول کېږي. د ګروپ مدیران پرېکړه کوي چې څوک حسابونه وصل کولای شي، او کولای شي هر یو یې لرې کړي.",
            ],
          },
          {
            heading: "د مسؤلیت محدودیت",
            body: [
              "خدمت په «لکه څنګه چې دی» (as is) شرط وړاندې کېږي. موږ د خدمت د پرله پسې کار، د یو ټاکلي پلاتفورم د شتون یا ستاسو موخو ته د فایل د وړتیا تضمین نه کوو.",
              "موږ د دې مسؤل نه یو چې تاسو له ښکته شویو موادو سره څه کوئ، او نه ستاسو له خوا د دریمګړو د حقونو د سرغړونې د پایلو مسؤل یو.",
              "موږ حق لرو د خدمت اسانتیاوې بدلې کړو، د ساتنې (maintenance) لپاره د خدمت کار وځنډوو او د هغه کار پای ته ورسوو.",
            ],
          },
          {
            heading: "د لاسرسي محدودول",
            body: [
              "موږ کولای شو د دې شرطونو د سرغړونې، د محدودیتونو څخه د تېرېدو د هڅو، او همدارنګه د حق لرونکي د مستدل شکایت د ترلاسه کېدو په صورت کې خدمت ته لاسرسی محدود یا پای ته ورسوو.",
            ],
          },
          {
            heading: "بدلونونه او د تطبیق وړ قانون",
            body: [
              "موږ کولای شو دا شرطونه بدل کړو؛ د اوسنۍ نسخې نېټه د پاڼې په سر کې ښودل شوې ده. د بدلونونو وروسته د خدمت په کارولو ادامه ورکولو سره تاسو نوې نسخه منئ.",
              "د اړخونو پر اړیکو د قزاقستان جمهوریت قانون پلي کېږي. اړخونه هڅه کوي چې شخړې د لیکونو د تبادلې له لارې حل کړي، او د موافقې نه حاصلېدو په صورت کې — د قزاقستان جمهوریت د قوانینو له مخې ټاکل شوې طریقې سره سم.",
            ],
          },
        ],
      },
      cookies: {
        title: "د کوکيز پالیسي",
        summary: `${operator.site} کوم کوکيز کاروي، ولې اړین دي او څنګه ترې انکار کېدای شي.`,
        sections: [
          {
            heading: "کوکيز څه دي",
            body: [
              "کوکيز (cookies) کوچني متني فایلونه دي چې سایټ یې ستاسو په براوزر کې ساتي. دوی دا ممکنه کوي چې ستاسو تنظیمات په یاد وساتل شي او د لیدنو بې نومه احصایه راټوله شي.",
              "د کوکيز ترڅنګ، په دې سند کې ورته ټکنالوژۍ هم بیانوو — د براوزر محلي زېرمه (local storage) او د تعقیب پکسلونه (tracking pixels).",
            ],
          },
          {
            heading: "اړین کوکيز",
            body: [
              "پرته له دوی خدمت کار نه کوي، نو تل ځای پر ځای کېږي.",
            ],
            bullets: [
              "Cloudflare Turnstile — دا ازموینه چې لینک یو انسان لېږي، نه سکرېپټ.",
              "د انټرفیس تنظیمات — ټاکل شوې ژبه او د رنګ بڼه (theme).",
            ],
          },
          {
            heading: "تحلیلي کوکيز",
            body: [
              "دوی له موږ سره مرسته کوي چې پوه شو کومې پاڼې کارول کېږي او تېروتنې چېرې پېښېږي. ستاسو په رضایت ځای پر ځای کېږي او د خدمت د کار لپاره اړین نه دي.",
            ],
            bullets: [
              "Google Analytics او Google Tag Manager — په بې نومه بڼه د سایټ لیدنې او په سایټ کې چلند.",
              "Yandex Metrica — لیدنې، د کلیکونو نقشه او Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "د Yandex Metrica Webvisor په پاڼه کې کړنې ثبتوي: د نښه ګر خوځښت، سکرول، کلیکونه او د لینک په ساحه کې لیکل. دا د دې لپاره اړین دی چې ووینو انټرفیس چېرته خلک سرګردانه کوي.",
              "موږ دا ثبتونه د ځانګړو کسانو د تعقیب لپاره نه کاروو. د سایټ په ساحو کې هغه معلومات مه لیکئ چې نه غواړئ وساتل شي.",
            ],
          },
          {
            heading: "د انکار طریقه",
            bullets: [
              "په خپل براوزر کې د کوکيز بندول یا ړنګول تنظیم کړئ — دا طریقه د ټولو یادو شویو سیستمونو لپاره کار کوي.",
              "Google Analytics: د براوزر رسمي ضمیمه (add-on) چې د معلوماتو راټولول غیرفعالوي، د Google په سایټ کې شته.",
              "Yandex Metrica: انکار د Yandex د رسمي ضمیمې له لارې ممکن دی.",
              "د اړینو کوکيز غیرفعالول به ښکته کول ناممکن کړي.",
            ],
          },
          {
            heading: "د ساتنې موده",
            body: [
              "د ناستې (session) کوکيز د براوزر په تړلو یا د ناستې د مودې په پای ته رسېدو ړنګېږي. تحلیلي سیستمونه خپلې پېژندګڼې د هغې مودې لپاره ساتي چې د هغوی چمتو کوونکو ټاکلې ده.",
            ],
          },
        ],
      },
      copyright: {
        title: "د حق لرونکو لپاره",
        summary: "د کاپي حق په اړه د خدمت دریځ او د سرغړونې په اړه د شکایت د سپارلو طریقه.",
        sections: [
          {
            heading: "د خدمت دریځ",
            body: [
              "خدمت ویډیوګانې پخپله نه ځای پر ځای کوي او د هغو کتلاګ نه ساتي. دا د یو تخنیکي منځګړي په توګه کار کوي: د هغه لینک له مخې چې کاروونکي ورکړی، یوې عامه لاسرسي وړ پاڼې ته مراجعه کوي او کاروونکي ته فایل سپاري.",
              "ښکته شوي فایلونه نږدې یو ساعت په سرور کې ساتل کېږي او بیا په اتومات ډول ړنګېږي. له موږ سره د نورو د منځپانګې هېڅ دایمي کاپي نه پاتې کېږي.",
              "د ښکته شویو موادو د کارولو مسؤلیت د کاروونکي په غاړه دی — دا په څرګنده توګه د کارونې په شرطونو کې ثبت شوی دی.",
            ],
          },
          {
            heading: "که ستاسو حقونه تر پښو لاندې شوي وي",
            body: [
              `که تاسو حق لرونکی یا د هغه استازی یاست او فکر کوئ چې خدمت ستاسو د حقونو د سرغړونې لپاره کارول کېږي، ${MAIL} ته ولیکئ. موږ دا ډول غوښتنې څېړو او اقدام کوو.`,
            ],
          },
          {
            heading: "په غوښتنه کې څه ولیکئ",
            bullets: [
              "کوم اثر اغېزمن شوی دی او تاسو د کوم بنسټ له مخې پر هغه حقونه لرئ.",
              "موادو ته لینک او، که معلوم وي، د سرغړونې شرایط.",
              "ستاسو د اړیکې معلومات: نوم یا د سازمان نوم، پته او برېښنالیک پته.",
              "که تاسو د حق لرونکي په استازیتوب عمل کوئ — د واک ثبوت.",
              "دا اعلامیه چې په غوښتنه کې معلومات سم دي، او د موادو کارول د حق لرونکي یا قانون له خوا اجازه نه لري.",
            ],
          },
          {
            heading: "موږ به څه وکړو",
            body: [
              "موږ غوښتنه په مناسبه موده کې، معمولاً د دېرشو تقویمي ورځو په ترڅ کې، څېړو، او د سرغړونې د تایید په صورت کې د خدمت له لارې موادو ته لاسرسی محدودوو او، که اړتیا وي، خدمت ته د سرغړوونکي لاسرسی هم محدودوو.",
              "د څېړنې د پایلو په اړه به تاسو ته هغه برېښنالیک پتې ته خبر درکړو چې تاسو ورکړې ده.",
            ],
          },
          {
            heading: "بدنیته غوښتنې",
            body: [
              "هغه غوښتنه چې په قصدي ډول ناسم معلومات ولري، ښايي د قانون سره سم د غوښتونکي مسؤلیت رامنځته کړي. موږ حق لرو د هغې غوښتنې له څېړلو انکار وکړو چې نه حق لرونکی پکې پېژندل کېدای شي او نه شخړه ییز مواد.",
            ],
          },
        ],
      },
    },
  },
  ckb: {
    ui: {
      updated: "ڕێکەوتی وەشان",
      back: "گەڕانەوە بۆ پەڕەی سەرەکی",
      operatorHeading: "بەڕێوەبەری خزمەتگوزاری",
      navHeading: "بەڵگەنامەکانی تر",
      labels: {
        privacy: "سیاسەتی تایبەتمەندی",
        terms: "مەرجەکانی بەکارهێنان",
        cookies: "سیاسەتی کووکی",
        copyright: "بۆ خاوەن مافەکان",
      },
    },
    docs: {
      privacy: {
        title: "سیاسەتی تایبەتمەندی",
        summary: `${operator.site} چ داتایەک کۆدەکاتەوە، بۆچی پێویستە، تا کەی هەڵدەگیرێت و چۆن دەسڕدرێتەوە.`,
        sections: [
          {
            heading: "بڕگە گشتییەکان",
            body: [
              `ئەم سیاسەتە ڕوونی دەکاتەوە کە خزمەتگوزاریی ${operator.site} چ داتایەکی کەسی و بۆ چ مەبەستێک پرۆسێس دەکات. کۆنترۆڵکەری داتا (data controller) بریتییە لە ${operator.nameCkb}.`,
              "بە بەکارهێنانی خزمەتگوزارییەکە، ڕەزامەندی لەسەر ئەو ڕێکارەی پرۆسێسکردن دەدەیت کە لێرەدا ڕوونکراوەتەوە. ئەگەر لەگەڵیدا ڕازی نیت، تکایە خزمەتگوزارییەکە بەکارمەهێنە.",
              "پرۆسێسکردن بەپێی یاسای کۆماری کازاخستان «دەربارەی داتا کەسییەکان و پاراستنیان» ئەنجام دەدرێت، و سەبارەت بە سەردانکەرانی ناوچەی ئابووریی ئەورووپا، داواکارییەکانی GDPR لەبەرچاو دەگیرێن.",
            ],
          },
          {
            heading: "چ داتایەک پرۆسێس دەکەین",
            body: [
              "بە ئەنقەست هیچ شتێک زیاتر لەوەی بۆ کارکردنی خزمەتگوزارییەکە پێویستە کۆناکەینەوە، و داوای بەڵگەنامەی ناسنامە، زانیاریی پارەدان یان ناونیشان ناکەین.",
            ],
            bullets: [
              "داتای هەژماری Telegram کە بۆتەکە وەریدەگرێت کاتێک نامەی بۆ دەنێریت: ناسێنەری ژمارەیی، ناوی بەکارهێنەر (username)، ناو و کۆدی زمان.",
              "ئەو بەستەرانەی بۆ داگرتن دەینێریت و زانیاری دەربارەی خودی هەوڵەکە: پلاتفۆرم، ڕێکەوت و کات، کوالیتیی هەڵبژێردراو، و ئەنجام (سەرکەوتن یان هەڵە).",
              "داتا تەکنیکییەکانی پەیوەندی: ناونیشانی IP، جۆر و وەشانی وێبگەڕ، زمان، و ئەو پەڕەیەی لێیەوە هاتوویت. ئەمانە دەچنە ناو تۆمارەکانی سێرڤەر و سیستەمەکانی شیکاریی وێبەوە.",
              "کووکییەکان و ناسێنەرەکانی شیکاری — وردەکاری لە سیاسەتی کووکیدا.",
            ],
          },
          {
            heading: "بۆچی ئەم داتایانە پێویستن",
            bullets: [
              "پێشکەشکردنی خودی خزمەتگوزارییەکە: وەرگرتنی ڤیدیۆکە بەپێی بەستەرەکەت و پێدانی فایلەکە بە تۆ.",
              "جیاکردنەوەی هەژمارەکەت لە هەژماری کەسانی تر و ڕووبەڕووبوونەوەی خراپ بەکارهێنان.",
              "پاراستنی خزمەتگوزارییەکە لە خراپ بەکارهێنانی ئۆتۆماتیکی: پشکنینی Cloudflare Turnstile پێش ناردنی بەستەر.",
              "تێگەیشتن لەوەی ماڵپەڕەکە چۆن بەکاردەهێنرێت و چاککردنی هەڵەکان — بە ئامارێکی بێناسنامە و کۆکراوە.",
              "وەڵامدانەوەی داواکارییەکانی تۆ و داواکارییەکانی خاوەن مافەکان.",
              "جارجارە لە Telegram نامەت بۆ بنێرین بۆ ئەوەی ڕای تۆ دەربارەی خزمەتگوزارییەکە بزانین — بۆ نموونە، ئەگەر وازت لە بەکارهێنانی هێنابێت. وەڵامدانەوە ناچاری نییە؛ ئەگەر ئەم جۆرە نامانەت ناوێت، تەنها پێمان بڵێ و ئیتر نامەت بۆ نانێرین.",
            ],
          },
          {
            heading: "بنەما یاساییەکانی پرۆسێسکردن",
            body: [
              "داتای هەژماری Telegram و زانیارییەکانی داگرتن بۆ جێبەجێکردنی مەرجەکانی بەکارهێنان پرۆسێس دەکرێن، کە کاتێک دەست بە بەکارهێنانی خزمەتگوزارییەکە دەکەیت قبوڵیان دەکەیت.",
              "کووکییەکانی شیکاری و تۆمارکردنی چالاکییەکان لە ماڵپەڕەکەدا لەسەر بنەمای ڕەزامەندیی تۆ پرۆسێس دەکرێن، کە دەتوانیت لە هەر کاتێکدا بیکشێنیتەوە — ڕێگاکانی لە سیاسەتی کووکیدا ڕوونکراونەتەوە.",
              "تۆمارەکانی سێرڤەر و پاراستن لە بۆتەکان لە چوارچێوەی بەرژەوەندیی ڕەوای (legitimate interest) ئێمەدا پرۆسێس دەکرێن بۆ ئەوەی خزمەتگوزارییەکە کارا و پارێزراو بمێنێتەوە.",
              "پرسیارکردن دەربارەی ڕای تۆ لەسەر خزمەتگوزارییەکە لە چوارچێوەی بەرژەوەندیی ڕەوای ئێمەدایە بۆ باشترکردنی خزمەتگوزارییەکە؛ دەتوانیت لە هەر کاتێکدا ڕەتی بکەیتەوە.",
            ],
          },
          {
            heading: "هەژمارە بەستراوەکان",
            body: [
              "ئەگەر بتەوێت، دەتوانیت هەژمارەکەت لە پلاتفۆرمێکدا (Instagram، Facebook، YouTube، X، VK، TikTok) بە بۆتەوە ببەستیتەوە، بۆ ئەوەی بۆتەکە ئەو پۆستانە دابگرێت کە تەنها بۆ بەکارهێنەرانی چووەژوورەوە دیارن: ستۆرییەکان و پۆستە داخراوەکان. بۆ ئەم مەبەستە بۆتەکە کووکییەکانی ئەو هەژمارە وەردەگرێت — لە پێوەکراوی Videoner بە کۆدێکی یەکجاری، یان لەو فایلەی کە ناردووتە.",
              "تەنها کووکییەکانی پلاتفۆرمی هەڵبژێردراو هەڵدەگرین و ئەوانی تر یەکسەر فڕێدەدەین. بە شێوەی شفرەکراو هەڵدەگیرێن و تەنها بۆ داگرتن لەو شوێنەدا بەکاردەهێنرێن کە تێیدا بەستووتنەتەوە. ئەوانەی لە چاتی تایبەتدا بەستراونەتەوە بۆ داگرتنەکانی خۆتن، لەوانەش بەستەرەکانی خۆت لەو گرووپانەدا کە هەژماری تایبەتی خۆیان نەبەستراوەتەوە؛ بۆ بەستەری کەسانی تر بەکارناهێنرێن. ئەوانەی بە گرووپێکەوە بەستراونەتەوە تەنها بۆ داگرتنەکانی ئەندامانی ئەو گرووپەن و لە هیچ شوێنێکی تر بەکارناهێنرێن.",
              "بنەماکەی ڕەزامەندیی تۆیە: خۆت هەژمارەکە دەبەستیتەوە و دەتوانیت لە هەر کاتێکدا بە فەرمانی ‎/accounts لایبەریت. لە کاتی لابردندا کووکییەکان بە شێوەیەکی گەڕانەوەنەکراو دەسڕدرێنەوە. ئەگەر پلاتفۆرمەکە چیتر چوونەژوورەوە قبوڵ نەکات، بۆتەکە ئاگادارت دەکاتەوە.",
              "ئەو پۆستانەی لە ڕێگەی هەژمارێکی بەستراوەوە دادەگیرێن، لە کەناڵەکەماندا بڵاوناکرێنەوە و لە کاشی هاوبەشەوە نادرێن بە بەکارهێنەرانی تر.",
            ],
          },
          {
            heading: "خزمەتگوزارییەکانی لایەنی سێیەم",
            body: [
              "داتاکانت نافرۆشین و نایدەین بە لایەنی سێیەم بۆ مەبەستەکانی خۆیان. بۆ کارکردنی خزمەتگوزارییەکە، ئەم دابینکەرانەی خوارەوە بەکاردەهێنرێن، کە هەریەکەیان بەپێی ڕێساکانی خۆی داتا پرۆسێس دەکات:",
            ],
            bullets: [
              `Telegram — کارکردنی بۆتی ‎${BOT}.`,
              "Cloudflare — پاراستن لە بۆتەکان (Turnstile)، گەیاندنی ماڵپەڕ و ئاڕاستەکردنی ئیمەیڵ.",
              "Google Analytics و Google Tag Manager — ئاماری سەردانەکان.",
              "Yandex Metrica — ئاماری سەردانەکان، نەخشەی کلیکەکان و Webvisor. Webvisor چالاکییەکان لە پەڕەکەدا تۆمار دەکات: جووڵەی نیشاندەر، سکڕۆڵکردن و کلیکەکان. تۆمارەکان تەنها بۆ شیکردنەوەی ئاسانیی بەکارهێنانی ماڵپەڕەکە بەکاردەهێنرێن.",
            ],
          },
          {
            heading: "ماوەی هەڵگرتنی داتا",
            bullets: [
              "فایلە داگیراوەکان نزیکەی کاتژمێرێک دوای دروستبوونیان بە شێوەی ئۆتۆماتیکی لە سێرڤەر دەسڕدرێنەوە. ئەرشیفی ڤیدیۆکانت هەڵناگرین.",
              "تۆمارەکانی هەوڵەکانی داگرتن تا ئەو کاتە هەڵدەگیرێن کە بۆ ڕووبەڕووبوونەوەی خراپ بەکارهێنان و لێکۆڵینەوە لە داواکارییەکان پێویستن.",
              "داتای هەژمار تا ئەو کاتەی خزمەتگوزارییەکە بەکاردەهێنیت هەڵدەگیرێت، و بە داوای تۆ دەسڕدرێتەوە.",
              "تۆمارەکانی سێرڤەر بۆ ماوەیەکی سنووردار هەڵدەگیرێن و لەگەڵ خولانەوەیاندا (rotation) سەرلەنوێ دەنووسرێنەوە.",
            ],
          },
          {
            heading: "شوێنی پرۆسێسکردنی داتا",
            body: [
              "سێرڤەرەکانی خزمەتگوزارییەکە لە سەنتەرێکی داتادا لە خاکی یەکێتیی ئەورووپا دانراون. هەندێک لەو دابینکەرانەی سەرەوە باسکران لەوانەیە بەپێی سیاسەتەکانی خۆیان داتا لە دەرەوەی ئەو خاکە پرۆسێس بکەن.",
            ],
          },
          {
            heading: "مافەکانی تۆ",
            body: [
              `مافی ئەوەت هەیە زانیاری دەربارەی پرۆسێسکردنی داتاکانت وەربگریت، داوای ڕاستکردنەوە یان سڕینەوەیان بکەیت، ڕەزامەندییەکەت بکشێنیتەوە و ناڕەزایی دژی پرۆسێسکردن دەرببڕیت. بۆ ئەم مەبەستە، بە بەکارهێنانی ئەو ئیمەیڵە یان ئەو هەژمارەی Telegram کە پەیوەستن بە داواکارییەکەوە، نامە بۆ ${MAIL} بنێرە.`,
              "لە ماوەیەکی گونجاودا وەڵام دەدەینەوە، بە گشتی لە ماوەی سی ڕۆژی ساڵنامەییدا. سڕینەوەی هەژمار دەبێتە هۆی سڕینەوەی ئەو مێژووی داگرتنانەی پەیوەستن پێیەوە.",
            ],
          },
          {
            heading: "کەمتەمەنان",
            body: [
              "خزمەتگوزارییەکە بۆ منداڵانی خوار تەمەنی 16 ساڵ نییە و ئاراستەی ئەوان ناکرێت. بە ئەنقەست داتای ئەم جۆرە بەکارهێنەرانە کۆناکەینەوە؛ ئەگەر بە هەڵە ڕوویدابێت، بۆمان بنووسە و داتاکان دەسڕدرێنەوە.",
            ],
          },
          {
            heading: "گۆڕانکارییەکان",
            body: [
              "لەوانەیە ئەم سیاسەتە نوێ بکەینەوە. ڕێکەوتی وەشانی کارپێکراو لە سەرەتای پەڕەکەدا نووسراوە؛ گۆڕانکارییە گرنگەکان لە ناو خزمەتگوزارییەکەدا ئاماژەیان پێدەدەین.",
            ],
          },
        ],
      },
      terms: {
        title: "مەرجەکانی بەکارهێنان",
        summary: `ڕێساکانی بەکارهێنانی ${operator.site}: چی ڕێگەپێدراوە، چی ڕێگەپێنەدراوە، و خزمەتگوزارییەکە بە چ مەرجێک کار دەکات.`,
        sections: [
          {
            heading: "بڕگە گشتییەکان",
            body: [
              `ئەم مەرجانە بەکارهێنانی ماڵپەڕی ${operator.site} و بۆتی Telegram ‎${BOT} ڕێکدەخەن. خاوەن و بەڕێوەبەری خزمەتگوزارییەکە بریتییە لە ${operator.nameCkb}.`,
              "بە دەستپێکردنی بەکارهێنانی خزمەتگوزارییەکە، دووپاتی دەکەیتەوە کە مەرجەکانت خوێندووەتەوە و قبوڵیان دەکەیت. ئەگەر هەر مەرجێکیان گونجاو نییە بۆت، نابێت خزمەتگوزارییەکە بەکاربهێنیت.",
            ],
          },
          {
            heading: "خزمەتگوزارییەکە بێبەرامبەرە",
            body: [
              "هەموو تواناکانی خزمەتگوزارییەکە بە خۆڕایی پێشکەش دەکرێن. هیچ ئابوونەیەک، پلانی پارەدار، کوالیتیی ڤیدیۆی پارەدار یان کڕینی ناوەکیمان نییە.",
              "ڕیکلام نیشان نادەین و بەستەری هاوبەشی (affiliate links) دانانێین.",
            ],
          },
          {
            heading: "مەرجەکانی دەستگەیشتن",
            bullets: [
              "بۆ داگرتن لە ماڵپەڕەکەدا نە هەژمار پێویستە و نە چوونەژوورەوە. بۆتەکە بەکارهێنەران بەپێی هەژمارەکانیان لە Telegram لێک جیا دەکاتەوە.",
              "سنووردارکردنە تەکنیکییەکانی سەر چڕیی داواکارییەکان خزمەتگوزارییەکە لە قورسایی زیادە و خراپ بەکارهێنانی ئۆتۆماتیکی دەپارێزن.",
              "بۆ YouTube سنووری ڕۆژانەی ترافیک هەیە: 10 GB لە ماوەی 24 کاتژمێردا بۆ هەر تۆڕێک لە ماڵپەڕ و پێوەکراوەکەدا، و 25 GB لە ماوەی 24 کاتژمێردا بۆ هەر هەژمارێکی Telegram لە بۆتەکەدا. ئەم سنوورە کاریگەریی لەسەر پلاتفۆرمەکانی تر نییە.",
              "بۆ داگرتن لە ڕێگەی بۆتەکەوە، ئابوونەبوون لە کەناڵەکەمان پێویست نییە. بۆتەکە لە دەقی فایلەکاندا بەستەری کەناڵی هەواڵەکانی پڕۆژەکە زیاد دەکات؛ ئابوونەبوون لەو کەناڵەدا ناچاری نییە.",
            ],
          },
          {
            heading: "خزمەتگوزارییەکە چی دەکات",
            body: [
              "خزمەتگوزارییەکە ناوەندگیرێکی تەکنیکییە: بەپێی بەستەرەکەت سەردانی پەڕەیەکی گشتی دەکات، فایلی میدیاکە وەردەگرێت و دەیگەیەنێتە تۆ.",
              "کاتالۆگی ڤیدیۆ لای خۆمان دانانێین، لە ناوەڕۆکی کەسانی تردا گەڕان ناکەین، و فایلە داگیراوەکان زیاتر لەو ماوەیەی بۆ گەیاندن پێویستە هەڵناگرین — نزیکەی کاتژمێرێک.",
              "بەردەستبوونی هەر پلاتفۆرمێک پشت بە بڕیارە تەکنیکییەکانی خۆی دەبەستێت و لەوانەیە بێ ئاگادارکردنەوە بگۆڕێت.",
            ],
          },
          {
            heading: "ئەرکەکانی بەکارهێنەر",
            body: [
              "تۆ بە تەنها بەرپرسیت لەوەی چۆن فایلە وەرگیراوەکان بەکاردەهێنیت، و دووپاتی دەکەیتەوە کە مافی ئەم کارەت هەیە.",
            ],
            bullets: [
              "تەنها ئەو ماددانە دابگرە کە مافەکانیان هی تۆن، یان خاوەن ماف یان یاسا ڕێگەی بەکارهێنانیانی داوە.",
              "خزمەتگوزارییەکە بۆ پێشێلکردنی مافی دانەر و مافە پەیوەستەکان (related rights)، بڵاوکردنەوەی ناوەڕۆکی قەدەغەکراو و پێشێلکردنی مافی لایەنی سێیەم بەکارمەهێنە.",
              "هەوڵ مەدە سنووردارکردنە تەکنیکییەکانی خزمەتگوزارییەکە تێپەڕێنیت، لەوانەش سنووری چڕیی داواکارییەکان و پشکنینی بۆت.",
              "باری ئۆتۆماتیکی دروست مەکە: داواکاریی بەکۆمەڵ، سکریپت و پارسەر (scrapers) ڕێگەپێنەدراون.",
            ],
          },
          {
            heading: "بڵاوکردنەوەی بەستەرەکان لە کەناڵدا",
            body: [
              "بە داگرتنی ڤیدیۆ لە ڕێگەی بۆتەکەوە، ڕەزامەندی دەدەیت کە بەستەری پۆستە ڕەسەنەکە لە کەناڵەکەمان لە Telegram بڵاوبکرێتەوە. ئاگادارکردنەوەیەک دەربارەی ئەمە لە بۆتەکەدا پیشان دەدرێت پێش هەڵبژاردنی کوالیتی — واتە پێش ئەوەی بڕیاری داگرتن بدەیت.",
              "بڵاوکردنەوەکە بێناوە: ئەوەی دەچێتە کەناڵەکەوە بەستەری پەڕە گشتییەکە، ناونیشانی ڤیدیۆکە و وێنەی بەرگەکەیەتی — هەمان ئەو فرەیمەی کە پلاتفۆرمەکە لە پێشبینینی پۆستەکەدا پیشانی دەدات. ئاماژە بەوە ناکرێت کە کێ ڤیدیۆکەی داگرتووە. خودی فایلی ڤیدیۆکە هەرگیز و لە هیچ شوێنێکدا بڵاوناکرێتەوە: ئەوەی بڵاودەکرێتەوە بەستەرەکەیە، کە پلاتفۆرمەکان خۆیان بە دوگمەی «هاوبەشکردن» (Share) لە ژێر هەر پۆستێکدا داوای بڵاوکردنەوەی دەکەن.",
              "هەمان بەستەر زیاتر لە یەک جار بڵاوناکرێتەوە. ئەگەر ناتەوێت بەستەرێک بگاتە کەناڵەکە، ئەو ڤیدیۆیە لە ڕێگەی خزمەتگوزارییەکەمانەوە دامەگرە.",
              "بەستەرەکانی ناو گرووپەکان و ئەو پۆستانەی لە ڕێگەی هەژمارێکی بەستراوەوە دادەگیرێن، لە کەناڵەکەدا بڵاوناکرێنەوە."
            ],
          },
          {
            heading: "بەستنەوەی هەژمارەکەت",
            body: [
              "بە بەستنەوەی هەژمارەکەت لە پلاتفۆرمێکدا بە بۆتەکەوە، دووپاتی دەکەیتەوە کە ئەو هەژمارە هی خۆتە و مافی ئەوەت هەیە بەکاری بهێنیت.",
              "پلاتفۆرمەکان ڕازی نین بە داگرتنی ئۆتۆماتیکی و لەوانەیە هەژماری بەستراو سنووردار بکەن یان بلۆکی بکەن. ئەم مەترسییە خۆت دەیگریتە ئەستۆ؛ پێشنیار دەکەین هەژمارێکی جیاواز ببەستیتەوە، نەک هەژمارە سەرەکییەکەت. ئێمە بەرپرس نین لەو سنووردارکردنانەی پلاتفۆرمەکە لەسەر هەژمارەکەتی دادەنێت.",
              "هەژمارێک کە بە گرووپێکەوە بەستراوەتەوە بۆ داگرتنەکانی هەموو ئەندامانی ئەو گرووپە بەکاردەهێنرێت. ئەدمینەکانی گرووپ بڕیار دەدەن کێ دەتوانێت هەژمار ببەستێتەوە، و دەتوانن هەر یەکێک لەو هەژمارانە لابەرن.",
            ],
          },
          {
            heading: "سنووردارکردنی بەرپرسیارێتی",
            body: [
              "خزمەتگوزارییەکە «وەک خۆی» (as is) پێشکەش دەکرێت. گەرەنتیی کارکردنی بێ پچڕان، بەردەستبوونی پلاتفۆرمێکی دیاریکراو یان گونجانی فایلەکە بۆ مەبەستەکانت ناکەین.",
              "ئێمە بەرپرس نین لەوەی چۆن مامەڵە لەگەڵ ماددە داگیراوەکاندا دەکەیت، و نە لە دەرئەنجامەکانی پێشێلکردنی مافی لایەنی سێیەم لەلایەن تۆوە.",
              "مافی ئەوەمان هەیە تواناکانی خزمەتگوزارییەکە بگۆڕین، کارکردنی بۆ چاکسازی ڕابگرین و کۆتایی بە کارکردنی بهێنین.",
            ],
          },
          {
            heading: "سنووردارکردنی دەستگەیشتن",
            body: [
              "دەتوانین دەستگەیشتن بە خزمەتگوزارییەکە سنووردار بکەین یان کۆتایی پێبهێنین لە کاتی پێشێلکردنی ئەم مەرجانە، لە کاتی هەوڵدان بۆ تێپەڕاندنی سنووردارکردنەکان، و هەروەها لە کاتی گەیشتنی سکاڵایەکی بەڵگەدار لە خاوەن مافێکەوە.",
            ],
          },
          {
            heading: "گۆڕانکارییەکان و یاسای کارپێکراو",
            body: [
              "دەتوانین ئەم مەرجانە بگۆڕین؛ ڕێکەوتی وەشانی کارپێکراو لە سەرەتای پەڕەکەدا نووسراوە. بەردەوامبوون لە بەکارهێنانی خزمەتگوزارییەکە دوای گۆڕانکارییەکان واتای قبوڵکردنی وەشانە نوێیەکەیە.",
              "یاسای کۆماری کازاخستان بەسەر پەیوەندییەکانی نێوان لایەنەکاندا جێبەجێ دەکرێت. لایەنەکان هەوڵ دەدەن ناکۆکییەکان لە ڕێگەی نامەگۆڕینەوە چارەسەر بکەن، و ئەگەر نەگەیشتنە ڕێککەوتن، بەو ڕێکارەی کە یاسادانانی کۆماری کازاخستان دیاری کردووە.",
            ],
          },
        ],
      },
      cookies: {
        title: "سیاسەتی کووکی",
        summary: `${operator.site} چ کووکییەک بەکاردەهێنێت، بۆچی پێویستن و چۆن ڕەتیان بکەیتەوە.`,
        sections: [
          {
            heading: "کووکی چییە",
            body: [
              "کووکییەکان فایلی دەقیی بچووکن کە ماڵپەڕ لە وێبگەڕەکەتدا هەڵیاندەگرێت. ڕێگە دەدەن ڕێکخستنەکانت لەبیر بمێنن و ئاماری بێناسنامەی سەردانەکان کۆبکرێتەوە.",
              "لەگەڵ کووکییەکاندا، لەم بەڵگەنامەیەدا تەکنەلۆژیا نزیکەکانیش ڕوون دەکەینەوە — بیرگەی ناوخۆیی وێبگەڕ (local storage) و پیکسڵە ژمێرەرەکان (tracking pixels).",
            ],
          },
          {
            heading: "پێویستەکان",
            body: [
              "بەبێ ئەمانە خزمەتگوزارییەکە کار ناکات، بۆیە هەمیشە دادەنرێن.",
            ],
            bullets: [
              "Cloudflare Turnstile — پشکنینی ئەوەی کە بەستەرەکە مرۆڤێک دەینێرێت، نەک سکریپتێک.",
              "ڕێکخستنەکانی ڕووکار — زمانی هەڵبژێردراو و شێوازی ڕەنگ.",
            ],
          },
          {
            heading: "شیکارییەکان",
            body: [
              "یارمەتیمان دەدەن تێبگەین کام پەڕانە بەکاردەهێنرێن و هەڵەکان لە کوێ ڕوودەدەن. بە ڕەزامەندیی تۆ دادەنرێن و بۆ کارکردنی خزمەتگوزارییەکە پێویست نین.",
            ],
            bullets: [
              "Google Analytics و Google Tag Manager — ژمارەی سەردانەکان و ڕەفتار لە ماڵپەڕەکەدا بە شێوەیەکی بێناسنامە.",
              "Yandex Metrica — ژمارەی سەردانەکان، نەخشەی کلیکەکان و Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor لە Yandex Metrica چالاکییەکان لە پەڕەکەدا تۆمار دەکات: جووڵەی نیشاندەر، سکڕۆڵکردن، کلیکەکان و نووسین لە خانەی بەستەردا. ئەمە پێویستە بۆ ئەوەی ببینین ڕووکارەکە لە کوێدا بەکارهێنەران سەرلێشێواو دەکات.",
              "ئەم تۆمارانە بۆ چاودێریکردنی کەسانی دیاریکراو بەکارناهێنین. ئەو زانیارییانەی ناتەوێت هەڵبگیرێن لە خانەکانی ماڵپەڕەکەدا مەنووسە.",
            ],
          },
          {
            heading: "چۆن ڕەتیان بکەیتەوە",
            bullets: [
              "لە ڕێکخستنەکانی وێبگەڕەکەتدا بلۆککردن یان سڕینەوەی کووکییەکان ڕێکبخە — ئەم ڕێگایە بۆ هەموو ئەو سیستەمانەی باسکران کار دەکات.",
              "Google Analytics: پێوەکراوی فەرمیی وێبگەڕ کە کۆکردنەوەی داتا ناچالاک دەکات، لە ماڵپەڕی Google بەردەستە.",
              "Yandex Metrica: ڕەتکردنەوە لە ڕێگەی پێوەکراوی فەرمیی Yandex دەکرێت.",
              "ناچالاککردنی کووکییە پێویستەکان وا دەکات داگرتن مەحاڵ بێت.",
            ],
          },
          {
            heading: "ماوەکان",
            body: [
              "کووکییەکانی دانیشتن (session cookies) لە کاتی داخستنی وێبگەڕ یان بە بەسەرچوونی ماوەی دانیشتن دەسڕدرێنەوە. ژمێرەرە شیکارییەکان ناسێنەرەکان بۆ ئەو ماوانە هەڵدەگرن کە دابینکەرەکانیان دیاریان کردووە.",
            ],
          },
        ],
      },
      copyright: {
        title: "بۆ خاوەن مافەکان",
        summary: "هەڵوێستی خزمەتگوزارییەکە سەبارەت بە مافی دانەر و ڕێکاری پێشکەشکردنی سکاڵا لەسەر پێشێلکاری.",
        sections: [
          {
            heading: "هەڵوێستی خزمەتگوزارییەکە",
            body: [
              "خزمەتگوزارییەکە ڤیدیۆ لای خۆی دانانێت و کاتالۆگیان ڕاناگرێت. وەک ناوەندگیرێکی تەکنیکی کار دەکات: بەپێی ئەو بەستەرەی بەکارهێنەر نووسیویەتی، سەردانی پەڕەیەکی گشتی دەکات و فایلەکە دەگەیەنێتە بەکارهێنەر.",
              "فایلە داگیراوەکان نزیکەی کاتژمێرێک لەسەر سێرڤەر دەمێننەوە و پاشان بە شێوەی ئۆتۆماتیکی دەسڕدرێنەوە. هیچ کۆپییەکی هەمیشەیی لە ناوەڕۆکی کەسانی تر لای ئێمە نامێنێتەوە.",
              "بەرپرسیارێتیی بەکارهێنانی ماددە داگیراوەکان دەکەوێتە ئەستۆی بەکارهێنەر — ئەمە بە ڕوونی لە مەرجەکانی بەکارهێناندا جێگیر کراوە.",
            ],
          },
          {
            heading: "ئەگەر مافەکانت پێشێل کرابن",
            body: [
              `ئەگەر خاوەن ماف یان نوێنەری ئەو بیت و پێتوایە خزمەتگوزارییەکە بۆ پێشێلکردنی مافەکانت بەکاردەهێنرێت، بۆ ${MAIL} بنووسە. ئێمە لەم جۆرە داواکارییانە دەکۆڵینەوە و ڕێوشوێن دەگرینەبەر.`,
            ],
          },
          {
            heading: "چی لە داواکارییەکەدا بنووسیت",
            bullets: [
              "کام بەرهەم کاریگەریی لەسەر بووە و بە چ بنەمایەک خاوەنی مافەکانیتی.",
              "بەستەری ماددەکە و، ئەگەر زانراو بێت، بارودۆخی پێشێلکارییەکە.",
              "زانیارییەکانی پەیوەندیکردنت: ناو یان ناوی دامەزراوە، ناونیشان و ناونیشانی ئیمەیڵ.",
              "ئەگەر بە ناوی خاوەن مافەوە مامەڵە دەکەیت — بەڵگەی دەسەڵاتەکانت.",
              "ڕاگەیەندراوێک کە زانیارییەکانی ناو داواکارییەکە ڕاستن و بەکارهێنانی ماددەکە لەلایەن خاوەن ماف یان یاساوە ڕێگەی پێنەدراوە.",
            ],
          },
          {
            heading: "چی دەکەین",
            body: [
              "لە ماوەیەکی گونجاودا لە داواکارییەکە دەکۆڵینەوە، بە گشتی لە ماوەی سی ڕۆژی ساڵنامەییدا، و ئەگەر پێشێلکارییەکە پشتڕاست بکرێتەوە، دەستگەیشتن بە ماددەکە لە ڕێگەی خزمەتگوزارییەکەوە سنووردار دەکەین و، لە کاتی پێویستدا، دەستگەیشتنی پێشێلکارەکە بە خزمەتگوزارییەکە.",
              "ئەنجامی لێکۆڵینەوەکە بەو ناونیشانی ئیمەیڵەی دیاریت کردووە ڕادەگەیەنین.",
            ],
          },
          {
            heading: "داواکارییە بەدنیەتەکان",
            body: [
              "داواکارییەک کە بە زانینەوە زانیاریی هەڵەی تێدابێت، لەوانەیە بەپێی یاسا بەرپرسیارێتی بۆ پێشکەشکەرەکەی دروست بکات. مافی ئەوەمان هەیە لێکۆڵینەوە لە داواکارییەک ڕەت بکەینەوە ئەگەر نە خاوەن ماف و نە ماددە ناکۆکلەسەرەکە دیاری نەکات.",
            ],
          },
        ],
      },
    },
  },
  ku: {
    ui: {
      updated: "Nûkirina dawî",
      back: "Vegere rûpela sereke",
      operatorHeading: "Operatorê xizmetê",
      navHeading: "Belgeyên din",
      labels: {
        privacy: "Polîtîkaya Nepeniyê",
        terms: "Peymana Bikarhêner",
        cookies: "Polîtîkaya Cookie",
        copyright: "Ji bo Xwediyên Mafan",
      },
    },
    docs: {
      privacy: {
        title: "Polîtîkaya Nepeniyê",
        summary: `${operator.site} kîjan daneyan berhev dike, ew çima pêwîst in, çiqas tên hilanîn û tu çawa dikarî wan jê bibî.`,
        sections: [
          {
            heading: "Hukmên giştî",
            body: [
              `Ev Polîtîka diyar dike ku xizmeta ${operator.site} kîjan daneyên kesane û bi kîjan armancê pêvajo dike. Operatorê daneyan (data controller) ${operator.nameKu} e.`,
              "Bi bikaranîna xizmetê, tu rêbaza pêvajoyê ya li vir hatiye diyarkirin dipejirînî. Heke tu pê re ne razî yî, ji kerema xwe xizmetê bi kar neyne.",
              "Pêvajo li gorî Qanûna Komara Qazaxistanê “Li ser Daneyên Kesane û Parastina Wan” tê kirin, û di derbarê serdanvanên ji Herêma Aborî ya Ewropayê de, bi berçavgirtina pêdiviyên GDPR.",
            ],
          },
          {
            heading: "Em kîjan daneyan pêvajo dikin",
            body: [
              "Em bi zanebûn ji bilî tiştên ku ji bo xebata xizmetê pêwîst in tiştekî berhev nakin û belge, daneyên dravdanê an navnîşanê ji te naxwazin.",
            ],
            bullets: [
              "Daneyên hesabê Telegramê yên ku bot dema tu jê re dinivîsî distîne: nasnameya hejmarî (id), navê bikarhêner (username), nav û koda ziman.",
              "Lînkên ku tu ji bo daxistinê dişînî û agahiyên li ser hewldanê bi xwe: platform, dîrok û dem, kalîteya hilbijartî, encam (serkeftin an çewtî).",
              "Daneyên teknîkî yên girêdanê: navnîşana IP, cure û guhertoya gerokê, ziman, rûpela ku tu jê hatî. Ev dane dikevin tomarên serverê (log) û pergalên analîtîka webê.",
              "Pelên cookie û nasnameyên analîtîkê — hûrgulî di Polîtîkaya Cookie de ne.",
            ],
          },
          {
            heading: "Ev dane çima pêwîst in",
            bullets: [
              "Pêşkêşkirina xizmetê bi xwe: wergirtina vîdyoyê bi lînka te û radestkirina pelê ji te re.",
              "Ji hev cudakirina hesabê te ji yên kesên din û pêşîgirtina li îstîsmarê.",
              "Parastina xizmetê ji îstîsmara otomatîk: kontrola Cloudflare Turnstile berî şandina lînkê.",
              "Têgihîştina ka malper çawa tê bikaranîn û rakirina çewtiyan — bi statîstîkên bênavkirî û giştî.",
              "Bersivdana daxwazên te û yên xwediyên mafan.",
              "Carinan li Telegramê ji te re nivîsandin, da ku em nêrîna te ya li ser xizmetê bizanin — bo nimûne, heke te dev ji bikaranîna wê berdabe. Bersivdan ne mecbûrî ye; heke tu van peyaman naxwazî, tenê vê bibêje û em êdî ji te re nanivîsin.",
            ],
          },
          {
            heading: "Bingehên pêvajoyê",
            body: [
              "Daneyên hesabê Telegramê û agahiyên li ser daxistinan ji bo bicîhanîna Peymana Bikarhêner tên pêvajokirin, ku tu bi destpêkirina bikaranîna xizmetê dipejirînî.",
              "Pelên cookie yên analîtîkê û tomarkirina çalakiyan li ser malperê li ser bingeha razîbûna te tên pêvajokirin, ku tu dikarî her dem paşve bistînî — rê di Polîtîkaya Cookie de hatine diyarkirin.",
              "Tomarên serverê û parastina ji botan di çarçoveya berjewendiya me ya rewa (legitimate interest) de tên pêvajokirin, da ku xizmet bixebite û parastî bimîne.",
              "Pirsên li ser nêrîna te ya derbarê xizmetê de di çarçoveya berjewendiya me ya rewa (legitimate interest) a baştirkirina xizmetê de ne; tu dikarî her dem wan red bikî.",
            ],
          },
          {
            heading: "Hesabên girêdayî",
            body: [
              "Heke tu bixwazî, tu dikarî hesabê xwe yê li ser platformekê (Instagram, Facebook, YouTube, X, VK, TikTok) bi botê ve girê bidî, da ku bot postên ku tenê ji bikarhênerên têketî re xuya dibin daxîne: story û postên taybet. Ji bo vê, bot cookie yên wî hesabî distîne — ji pêveka Videoner bi kodeke yekcarî an ji pelekî ku te şandiye.",
              "Em tenê cookie yên platforma hilbijartî hildigirin û yên din yekser davêjin. Ew bi awayekî şîfrekirî tên hilanîn û tenê ji bo daxistinan li cihê ku te ew lê girê dane tên bikaranîn. Yên di sohbeta taybet de hatine girêdan ji bo daxistinên te ne, di nav de lînkên te bi xwe di wan koman de ku hesabekî wan ê xwe ne girêdayî ye; ji bo lînkên kesên din nayên bikaranîn. Yên bi komekê ve hatine girêdan tenê ji bo daxistinên endamên wê ne û li tu cihekî din nayên bikaranîn.",
              "Bingeh razîbûna te ye: tu hesabê xwe bi xwe girê didî û dikarî her dem bi fermana /accounts wî jê bibî. Dema hesab tê jêbirin, cookie bi awayekî bêveger tên paqijkirin. Heke platform êdî têketinê qebûl neke, bot vê ji te re dibêje.",
              "Postên ku bi hesabekî girêdayî hatine daxistin di kanala me de nayên weşandin û ji cache ya hevpar ji bikarhênerên din re nayên dayîn.",
            ],
          },
          {
            heading: "Xizmetên aliyên sêyem",
            body: [
              "Em daneyên te nafiroşin û ji bo armancên wan ên taybet radestî aliyên sêyem nakin. Ji bo xebata xizmetê ev peydakerên jêrîn tên bikaranîn, ku her yek ji wan daneyan li gorî qaîdeyên xwe pêvajo dike:",
            ],
            bullets: [
              `Telegram — xebitandina botê ${BOT}.`,
              "Cloudflare — parastina ji botan (Turnstile), gihandina malperê û rêkirina e-nameyan.",
              "Google Analytics û Google Tag Manager — statîstîkên serdanan.",
              "Yandex Metrica — statîstîkên serdanan, nexşeya klîkan û Webvisor. Webvisor çalakiyên li ser rûpelê tomar dike: tevgera nîşanderê, gerandin (scroll) û klîk. Tomar tenê ji bo analîzkirina hêsaniya bikaranîna malperê tên bikaranîn.",
            ],
          },
          {
            heading: "Em daneyan çiqas hildigirin",
            bullets: [
              "Pelên daxistî bi qasî saetekê piştî çêbûna xwe bi awayekî otomatîk ji serverê tên jêbirin. Em arşîveke vîdyoyên te hilnagirin.",
              "Tomarên hewldanên daxistinê heta ku ji bo pêşîgirtina li îstîsmarê û lêkolîna daxwazan pêwîst be tên hilanîn.",
              "Daneyên hesabê heta ku tu xizmetê bi kar tînî tên hilanîn û li ser daxwaza te tên jêbirin.",
              "Tomarên serverê ji bo demeke sînorkirî tên hilanîn û bi zivirandina wan (rotation) re tên ser hev nivîsandin.",
            ],
          },
          {
            heading: "Dane li ku tên pêvajokirin",
            body: [
              "Serverên xizmetê li navendeke daneyan (data center) li ser axa Yekîtiya Ewropayê ne. Hin ji peydakerên li jor hatine rêzkirin dikarin li gorî polîtîkayên xwe daneyan li derveyî wê pêvajo bikin.",
            ],
          },
          {
            heading: "Mafên te",
            body: [
              `Mafê te heye ku agahiyan li ser pêvajokirina daneyên xwe bistînî, rastkirin an jêbirina wan bixwazî, razîbûna xwe paşve bistînî û li dijî pêvajoyê îtiraz bikî. Ji bo vê, ji wê navnîşana e-nameyê an ji wî hesabê Telegramê yê ku bi daxwazê ve girêdayî ye ji ${MAIL} re binivîse.`,
              "Em di demeke maqûl de bersiv didin, bi gelemperî di nav sî rojên salnameyê de. Jêbirina hesabê dibe sedema jêbirina dîroka daxistinan a bi wî ve girêdayî.",
            ],
          },
          {
            heading: "Kesên temenbiçûk",
            body: [
              "Xizmet ne ji bo zarokên di bin 16 saliyê de ye û ne ji wan re tê arastekirin. Em bi zanebûn daneyên bikarhênerên wiha berhev nakin; heke ev bi şaşî qewimîbe, ji me re binivîse û dane dê bên jêbirin.",
            ],
          },
          {
            heading: "Guhertin",
            body: [
              "Em dikarin vê Polîtîkayê nû bikin. Dîroka guhertoya heyî li destpêka rûpelê hatiye nîşandan; em ê guhertinên girîng di xizmetê de diyar bikin.",
            ],
          },
        ],
      },
      terms: {
        title: "Peymana Bikarhêner",
        summary: `Qaîdeyên bikaranîna ${operator.site}: çi dibe, çi nabe û xizmet bi kîjan şertan dixebite.`,
        sections: [
          {
            heading: "Hukmên giştî",
            body: [
              `Ev Peyman bikaranîna malpera ${operator.site} û bota Telegramê ${BOT} birêkûpêk dike. Xwedî û rêveberê xizmetê ${operator.nameKu} e.`,
              "Bi destpêkirina bikaranîna xizmetê, tu piştrast dikî ku te şert xwendine û tu wan dipejirînî. Heke şertek ji te re ne guncav be, divê tu xizmetê bi kar neynî.",
            ],
          },
          {
            heading: "Xizmet belaş e",
            body: [
              "Hemû derfetên xizmetê belaş tên pêşkêşkirin. Abonetî, tarîfeyên bi pere, kalîteyên vîdyoyê yên bi pere û kirînên navxweyî tune ne.",
              "Em reklaman nîşan nadin û lînkên hevkariyê (affiliate) bi cih nakin.",
            ],
          },
          {
            heading: "Şertên gihîştinê",
            bullets: [
              "Ji bo daxistinê li ser malperê ne hesab ne jî têketin pêwîst e. Bot bikarhêneran li gorî hesabê wan ê Telegramê ji hev cuda dike.",
              "Sînorên teknîkî yên li ser frekansa daxwazan xizmetê ji barê zêde û îstîsmara otomatîk diparêzin.",
              "Ji bo YouTube sînorekî trafîkê yê rojane heye: li ser malperê û di pêvekê de 10 GB di 24 saetan de ji bo torekê, û di botê de 25 GB di 24 saetan de ji bo hesabekî Telegramê. Ev sînor bandorê li platformên din nake.",
              "Ji bo daxistinê bi botê abonetiya kanala me ne pêwîst e. Bot di nivîsa pelan de lînka kanala nûçeyan a projeyê zêde dike; abonebûna wê ne mecbûrî ye.",
            ],
          },
          {
            heading: "Xizmet çi dike",
            body: [
              "Xizmet navbeynkarekî teknîkî ye: bi lînka te ew xwe digihîne rûpeleke ku ji her kesî re vekirî ye, pelê medyayê werdigire û radestî te dike.",
              "Em katalogeke vîdyoyan li cem xwe bi cih nakin, li naveroka kesên din lêgerînê nakin û pelên daxistî ji dema ku ji bo radestkirinê pêwîst e — bi qasî saetekê — dirêjtir hilnagirin.",
              "Berdestbûna platformeke diyar bi biryarên wê yên teknîkî ve girêdayî ye û dikare bêyî hişyariyê biguhere.",
            ],
          },
          {
            heading: "Erkên bikarhêner",
            body: [
              "Tu bi xwe berpirsyarê awayê bikaranîna pelên ku te wergirtine yî û tu piştrast dikî ku mafê te yê vê yekê heye.",
            ],
            bullets: [
              "Tenê wî materyalî daxîne ku mafên wî yên te ne, an jî bikaranîna wî ji aliyê xwediyê mafan an qanûnê ve hatiye destûrdan.",
              "Xizmetê ji bo binpêkirina mafên nivîskariyê (copyright) û mafên girêdayî (related rights), belavkirina naveroka qedexe û binpêkirina mafên aliyên sêyem bi kar neyne.",
              "Hewl nede ku sînorên teknîkî yên xizmetê derbas bikî, di nav de sînorên frekansa daxwazan û kontrola botan.",
              "Barê otomatîk çênebike: daxwazên girseyî, skrîpt û parser (scraper) nayên qebûlkirin.",
            ],
          },
          {
            heading: "Weşandina lînkan di kanalê de",
            body: [
              "Bi daxistina vîdyoyê bi botê, tu dipejirînî ku lînka posta orîjînal dê di kanala me ya Telegramê de bê weşandin. Hişyariya li ser vê di botê de berî hilbijartina kalîteyê tê nîşandan — ango berî ku tu biryara daxistinê bidî.",
              "Weşandin bênav e: lînka rûpeleke ku ji her kesî re vekirî ye, navê vîdyoyê û berga wê — heman wêneyê ku platform di pêşdîtina postê de nîşan dide — diçin kanalê. Kê vîdyo daxistiye nayê gotin. Pelê vîdyoyê bi xwe tu carî li tu derê nayê weşandin: tiştê ku tê belavkirin lînk e, ku platform bi xwe jî bi bişkoka “Parve bike” ya di bin her postê de belavkirina wê pêşniyar dikin.",
              "Heman lînk ji carekê zêdetir nayê weşandin. Heke tu naxwazî lînk bigihîje kanalê, wê vîdyoyê bi xizmeta me danexîne.",
              "Lînkên ji koman û postên ku bi hesabekî girêdayî hatine daxistin di kanalê de nayên weşandin."
            ],
          },
          {
            heading: "Girêdana hesabê xwe",
            body: [
              "Bi girêdana hesabê xwe yê li ser platformekê bi botê ve, tu piştrast dikî ku ev hesab yê te ye û mafê te heye ku wî bi kar bînî.",
              "Platform daxistinên otomatîk napejirînin û dikarin hesabê girêdayî sînordar bikin an bloke bikin. Tu vê rîskê digirî ser xwe; em pêşniyar dikin ku tu hesabekî cuda, ne yê xwe yê sereke, girê bidî. Em ne berpirsyar in ji sînordarkirinên ku platform dê li ser hesabê te deynin.",
              "Hesabê ku bi komekê ve hatiye girêdan ji bo daxistinên hemû endamên wê tê bikaranîn. Rêveberên komê biryar didin ka kî dikare hesaban girê bide, û dikarin her yek ji wan jê bibin.",
            ],
          },
          {
            heading: "Sînordarkirina berpirsyariyê",
            body: [
              "Xizmet li gorî prensîba “wek xwe” (as is) tê pêşkêşkirin. Em garantî nadin ku xizmet bê navber bixebite, ku platformeke diyar berdest be an ku pel ji bo armancên te guncav be.",
              "Em ne berpirsyar in ji awayê ku te materyalê daxistî bi kar aniye, û ne jî ji encamên binpêkirina mafên aliyên sêyem ji aliyê te ve.",
              "Mafê me heye ku derfetên xizmetê biguherînin, xebata wê ji bo lênêrînê rawestînin û xebata wê bi dawî bikin.",
            ],
          },
          {
            heading: "Sînordarkirina gihîştinê",
            body: [
              "Em dikarin gihîştina xizmetê sînordar bikin an bi dawî bikin heke ev şert bên binpêkirin, heke hewl were dayîn ku sînor bên derbaskirin, û herwiha dema ku giliyeke bi bingeh ji xwediyê mafan were.",
            ],
          },
          {
            heading: "Guhertin û qanûna derbasdar",
            body: [
              "Em dikarin şertan biguherînin; dîroka guhertoya derbasdar li destpêka rûpelê hatiye nîşandan. Heke tu piştî guhertinan bikaranîna xizmetê bidomînî, tu guhertoya nû dipejirînî.",
              "Li ser têkiliyên aliyan qanûnên Komara Qazaxistanê tên sepandin. Alî hewl didin nakokiyan bi nameguhertinê çareser bikin, û heke li hev nekin — bi rêbaza ku qanûnên Komara Qazaxistanê destnîşan kirine.",
            ],
          },
        ],
      },
      cookies: {
        title: "Polîtîkaya Cookie",
        summary: `${operator.site} kîjan pelên cookie bi kar tîne, ew ji bo çi ne û tu çawa dikarî wan red bikî.`,
        sections: [
          {
            heading: "Cookie çi ne",
            body: [
              "Cookie pelên nivîsê yên piçûk in ku malper di geroka te de hildigire. Ew rê didin ku mîhengên te bên bîrbirin û statîstîkên serdanan ên bênavkirî bên berhevkirin.",
              "Ligel cookie, di vê belgeyê de em teknolojiyên nêzîk jî vedibêjin — depoya herêmî ya gerokê (local storage) û pîkselên şopandinê.",
            ],
          },
          {
            heading: "Cookie yên pêwîst",
            body: [
              "Bêyî wan xizmet naxebite, ji ber vê yekê ew her tim tên danîn.",
            ],
            bullets: [
              "Cloudflare Turnstile — kontrol dike ku lînk ji aliyê mirovekî ve tê şandin, ne ji aliyê skrîptekê ve.",
              "Mîhengên navrûyê — ziman û temaya xuyangê ya ku te hilbijartiye.",
            ],
          },
          {
            heading: "Cookie yên analîtîkê",
            body: [
              "Ew alîkariya me dikin ku em fêm bikin kîjan rûpel tên bikaranîn û çewtî li ku derdikevin. Bi razîbûna te tên danîn û ji bo xebata xizmetê ne mecbûrî ne.",
            ],
            bullets: [
              "Google Analytics û Google Tag Manager — hejmara serdanan û tevgera li ser malperê bi awayekî bênavkirî.",
              "Yandex Metrica — hejmara serdanan, nexşeya klîkan û Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor a Yandex Metrica çalakiyên li ser rûpelê tomar dike: tevgera nîşanderê, gerandin (scroll), klîk û nivîsandina di qada lînkê de. Ev ji bo wê ye ku em bibînin navrû li ku derê mirovan tevlihev dike.",
              "Em van tomaran ji bo şopandina kesên diyar bi kar naynin. Agahiyên ku tu naxwazî bên hilanîn di qadên malperê de nenivîse.",
            ],
          },
          {
            heading: "Çawa red bikî",
            bullets: [
              "Di geroka xwe de astengkirin an jêbirina cookie mîheng bike — ev rê ji bo hemû pergalên li vir hatine rêzkirin dixebite.",
              "Google Analytics: pêveka fermî ya gerokê ku berhevkirinê neçalak dike li ser malpera Google heye.",
              "Yandex Metrica: redkirin bi pêveka fermî ya Yandex gengaz e.",
              "Neçalakkirina cookie yên pêwîst dê daxistinê ne gengaz bike.",
            ],
          },
          {
            heading: "Demên hilanînê",
            body: [
              "Cookie yên danişînê (session) bi girtina gerokê an bi qedandina dema danişînê tên jêbirin. Amûrên analîtîkê nasnameyên xwe di wan deman de hildigirin ku peydakerên wan diyar kirine.",
            ],
          },
        ],
      },
      copyright: {
        title: "Ji bo Xwediyên Mafan",
        summary: "Helwesta xizmetê li ser mafên nivîskariyê (copyright) û rêbaza şandina giliyê li ser binpêkirinê.",
        sections: [
          {
            heading: "Helwesta xizmetê",
            body: [
              "Xizmet vîdyoyan li cem xwe bi cih nake û katalogeke wan nahêle. Ew wekî navbeynkarekî teknîkî tevdigere: bi lînka ku bikarhêner nivîsandiye, xwe digihîne rûpeleke ku ji her kesî re vekirî ye û pelê radestî bikarhêner dike.",
              "Pelên daxistî bi qasî saetekê li ser serverê dimînin û bi awayekî otomatîk tên jêbirin. Kopiyeke mayînde ya naveroka kesên din li cem me namîne.",
              "Berpirsyariya bikaranîna materyalê daxistî li ser bikarhêner e — ev bi eşkereyî di Peymana Bikarhêner de hatiye destnîşankirin.",
            ],
          },
          {
            heading: "Heke mafên te hatibin binpêkirin",
            body: [
              `Heke tu xwediyê mafan an nûnerê wî yî û tu difikirî ku xizmet ji bo binpêkirina mafên te tê bikaranîn, ji ${MAIL} re binivîse. Em van daxwazan dinirxînin û tedbîran digirin.`,
            ],
          },
          {
            heading: "Di daxwazê de çi divê bê nivîsandin",
            bullets: [
              "Kîjan berhem bandor lê bûye û tu li ser kîjan bingehê xwediyê mafên wê yî.",
              "Lînka materyalê û, heke tê zanîn, rewşa binpêkirinê.",
              "Agahiyên te yên têkiliyê: nav an navê rêxistinê, navnîşan û navnîşana e-nameyê.",
              "Heke tu li ser navê xwediyê mafan tevdigerî — belgeya ku desthilatdariya te piştrast dike.",
              "Daxuyaniyek ku agahiyên di daxwazê de rast in û bikaranîna materyalê ji aliyê xwediyê mafan an qanûnê ve nehatiye destûrdan.",
            ],
          },
          {
            heading: "Em ê çi bikin",
            body: [
              "Em daxwazê di demeke maqûl de dinirxînin, bi gelemperî di nav sî rojên salnameyê de, û heke binpêkirin were piştrastkirin, em gihîştina materyalê bi rêya xizmetê sînordar dikin û, heke pêwîst be, gihîştina binpêker a xizmetê jî.",
              "Em ê encama nirxandinê ji navnîşana e-nameyê ya ku te daye re ragihînin.",
            ],
          },
          {
            heading: "Daxwazên bi niyeta xerab",
            body: [
              "Daxwazeke ku bi zanebûn agahiyên nerast tê de hebin, dikare li gorî qanûnê berpirsyariyê ji bo daxwazkar çêbike. Mafê me heye ku nirxandina daxwazekê red bikin, heke bi wê ne xwediyê mafan ne jî materyalê nakok were destnîşankirin.",
            ],
          },
        ],
      },
    },
  },
  ug: {
    ui: {
      updated: "ئاخىرقى قېتىم يېڭىلانغان ۋاقتى",
      back: "باش بەتكە قايتىش",
      operatorHeading: "مۇلازىمەت باشقۇرغۇچىسى",
      navHeading: "باشقا ھۆججەتلەر",
      labels: {
        privacy: "مەخپىيەتلىك سىياسىتى",
        terms: "ئىشلەتكۈچى كېلىشىمى",
        cookies: "كۇكى سىياسىتى",
        copyright: "ھوقۇق ئىگىلىرى ئۈچۈن",
      },
    },
    docs: {
      privacy: {
        title: "مەخپىيەتلىك سىياسىتى",
        summary: `${operator.site} قايسى ئۇچۇرلارنى توپلايدۇ، ئۇلار نېمە ئۈچۈن كېرەك، قانچىلىك ۋاقىت ساقلىنىدۇ ۋە ئۇلارنى قانداق ئۆچۈرگىلى بولىدۇ.`,
        sections: [
          {
            heading: "ئومۇمىي بەلگىلىمىلەر",
            body: [
              `بۇ سىياسەت ${operator.site} مۇلازىمىتىنىڭ قايسى شەخسىي ئۇچۇرلارنى قايسى مەقسەتتە بىر تەرەپ قىلىدىغانلىقىنى بايان قىلىدۇ. ئۇچۇر باشقۇرغۇچى (data controller) — ${operator.nameUg}.`,
              "مۇلازىمەتنى ئىشلىتىش ئارقىلىق سىز بۇ يەردە بايان قىلىنغان بىر تەرەپ قىلىش تەرتىپىگە قوشۇلغان بولىسىز. ئەگەر قوشۇلمىسىڭىز، مۇلازىمەتنى ئىشلەتمەڭ.",
              "ئۇچۇرلار قازاقىستان جۇمھۇرىيىتىنىڭ «شەخسىي ئۇچۇرلار ۋە ئۇلارنى قوغداش توغرىسىدا»كى قانۇنىغا ئاساسەن، ياۋروپا ئىقتىسادىي رايونىدىن كەلگەن زىيارەتچىلەرگە نىسبەتەن بولسا GDPR تەلەپلىرىنى نەزەردە تۇتۇپ بىر تەرەپ قىلىنىدۇ.",
            ],
          },
          {
            heading: "بىز قايسى ئۇچۇرلارنى بىر تەرەپ قىلىمىز",
            body: [
              "بىز مۇلازىمەتنىڭ ئىشلىشى ئۈچۈن زۆرۈر بولغاندىن ئارتۇق ھېچنېمە توپلىمايمىز، شۇنداقلا كىملىك ھۆججەتلىرى، پۇل تۆلەش ئۇچۇرلىرى ياكى ئادرېس سورىمايمىز.",
            ],
            bullets: [
              "سىز بوتقا يازغىنىڭىزدا بوت تاپشۇرۇۋالىدىغان Telegram ھېسابات ئۇچۇرلىرى: سانلىق ID، ئىشلەتكۈچى نامى، ئىسىم ۋە تىل كودى.",
              "سىز چۈشۈرۈش ئۈچۈن يوللىغان ئۇلانمىلار ۋە چۈشۈرۈش ئۇرۇنۇشىنىڭ ئۆزىگە دائىر ئۇچۇرلار: سۇپا، چېسلا ۋە ۋاقىت، تاللانغان سۈپەت، نەتىجە (مۇۋەپپەقىيەتلىك ياكى خاتالىق).",
              "ئۇلىنىشقا دائىر تېخنىكىلىق ئۇچۇرلار: IP ئادرېسى، توركۆرگۈ تۈرى ۋە نەشرى، تىل، كېلىش بېتى. بۇ ئۇچۇرلار مۇلازىمېتىر خاتىرىلىرىگە ۋە تور تەھلىل سىستېمىلىرىغا كىرىدۇ.",
              "كۇكىلار ۋە تەھلىل پەرقلەندۈرگۈچلىرى — تەپسىلاتى كۇكى سىياسىتىدە بايان قىلىنغان.",
            ],
          },
          {
            heading: "بۇ ئۇچۇرلار نېمە ئۈچۈن كېرەك",
            bullets: [
              "مۇلازىمەتنىڭ ئۆزىنى تەمىنلەش: سىزنىڭ ئۇلانمىڭىز بويىچە ۋىدىيونى ئېلىپ، ھۆججەتنى سىزگە تاپشۇرۇش.",
              "سىزنىڭ ھېساباتىڭىزنى باشقىلارنىڭكىدىن پەرقلەندۈرۈش ۋە سۇيىئىستېمال قىلىشنىڭ ئالدىنى ئېلىش.",
              "مۇلازىمەتنى ئاپتوماتىك سۇيىئىستېمال قىلىشتىن قوغداش: ئۇلانما يوللاشتىن بۇرۇن Cloudflare Turnstile تەكشۈرۈشى.",
              "تور بېكەتنىڭ قانداق ئىشلىتىلىدىغانلىقىنى چۈشىنىش ۋە خاتالىقلارنى تۈزىتىش — نامسىزلاشتۇرۇلغان ۋە يىغىنچاقلانغان ستاتىستىكا ئارقىلىق.",
              "سىزنىڭ ۋە ھوقۇق ئىگىلىرىنىڭ مۇراجىئەتلىرىگە جاۋاب بېرىش.",
              "مۇلازىمەت توغرىسىدىكى پىكرىڭىزنى بىلىش ئۈچۈن ئاندا-ساندا Telegram ئارقىلىق سىزگە يېزىش — مەسىلەن، ئەگەر سىز ئۇنى ئىشلىتىشنى توختاتقان بولسىڭىز. جاۋاب بېرىش مەجبۇرىي ئەمەس؛ ئەگەر بۇنداق ئۇچۇرلارنى تاپشۇرۇۋېلىشنى خالىمىسىڭىز، بۇنى بىزگە ئېيتسىڭىزلا كۇپايە، بىز قايتا يازمايمىز.",
            ],
          },
          {
            heading: "بىر تەرەپ قىلىشنىڭ قانۇنىي ئاساسلىرى",
            body: [
              "Telegram ھېسابات ئۇچۇرلىرى ۋە چۈشۈرۈش خاتىرىلىرى سىز مۇلازىمەتنى ئىشلىتىشكە باشلىغان ۋاقتىڭىزدا قوبۇل قىلىدىغان ئىشلەتكۈچى كېلىشىمىنى ئىجرا قىلىش ئۈچۈن بىر تەرەپ قىلىنىدۇ.",
              "تەھلىل كۇكىلىرى ۋە تور بېكەتتىكى ھەرىكەتلەرنى خاتىرىلەش سىزنىڭ رازىلىقىڭىز ئاساسىدا بىر تەرەپ قىلىنىدۇ؛ بۇ رازىلىقنى خالىغان ۋاقىتتا قايتۇرۇۋالالايسىز — ئۇسۇللىرى كۇكى سىياسىتىدە بايان قىلىنغان.",
              "مۇلازىمېتىر خاتىرىلىرى ۋە بوتلاردىن قوغداش مۇلازىمەتنىڭ نورمال ۋە بىخەتەر ئىشلىشىنى ساقلاشتىكى قانۇنلۇق مەنپەئىتىمىز (legitimate interest) دائىرىسىدە بىر تەرەپ قىلىنىدۇ.",
              "مۇلازىمەت توغرىسىدىكى پىكرىڭىزنى سوراش مۇلازىمەتنى ياخشىلاشتىكى قانۇنلۇق مەنپەئىتىمىز دائىرىسىدە ئېلىپ بېرىلىدۇ؛ سىز خالىغان ۋاقىتتا ئۇنىڭدىن ۋاز كېچەلەيسىز.",
            ],
          },
          {
            heading: "باغلانغان ھېساباتلار",
            body: [
              "خالىسىڭىز، سۇپىدىكى ھېساباتىڭىزنى (Instagram، Facebook، YouTube، X، VK، TikTok) بوتقا باغلىيالايسىز، شۇنداق بولغاندا بوت پەقەت كىرگەن ئىشلەتكۈچىلەرلا كۆرەلەيدىغان يوللانمىلارنى چۈشۈرەلەيدۇ: ھېكايىلەر (stories)، يېپىق يوللانمىلار. بۇنىڭ ئۈچۈن بوت شۇ ھېساباتنىڭ كۇكىلىرىنى تاپشۇرۇۋالىدۇ — Videoner قىستۇرمىسىدىن بىر قېتىملىق كود ئارقىلىق ياكى سىز ئەۋەتكەن ھۆججەتتىن.",
              "بىز پەقەت تاللانغان سۇپىنىڭ كۇكىلىرىنىلا ساقلايمىز، قالغانلىرىنى دەرھال تاشلىۋېتىمىز. ئۇلار شىفىرلانغان ھالەتتە ساقلىنىدۇ ۋە پەقەت سىز ئۇلارنى باغلىغان جايدىكى چۈشۈرۈشلەر ئۈچۈنلا ئىشلىتىلىدۇ. شەخسىي سۆھبەتتە باغلانغانلىرى سىزنىڭ چۈشۈرۈشلىرىڭىز ئۈچۈن ئىشلىتىلىدۇ، جۈملىدىن ئۆز ھېساباتى باغلانمىغان گۇرۇپپىلاردىكى ئۆزىڭىزنىڭ ئۇلانمىلىرى ئۈچۈنمۇ؛ باشقىلارنىڭ ئۇلانمىلىرى ئۈچۈن ئىشلىتىلمەيدۇ. گۇرۇپپىغا باغلانغانلىرى پەقەت شۇ گۇرۇپپا ئەزالىرىنىڭ چۈشۈرۈشلىرى ئۈچۈنلا ئىشلىتىلىدۇ، باشقا ھېچ يەردە ئىشلىتىلمەيدۇ.",
              "قانۇنىي ئاساسى — سىزنىڭ رازىلىقىڭىز: ھېساباتنى سىز ئۆزىڭىز باغلايسىز ۋە ئۇنى خالىغان ۋاقىتتا ‎/accounts بۇيرۇقى ئارقىلىق ئۆچۈرەلەيسىز. ئۆچۈرۈلگەندە كۇكىلار قايتۇرغۇسىز ئۆچۈرۈلىدۇ. ئەگەر سۇپا كىرىشنى قوبۇل قىلمايدىغان بولۇپ قالسا، بوت بۇ توغرۇلۇق سىزگە خەۋەر قىلىدۇ.",
              "باغلانغان ھېسابات ئارقىلىق چۈشۈرۈلگەن يوللانمىلار قانىلىمىزدا ئېلان قىلىنمايدۇ ۋە ئورتاق غەملەكتىن (cache) باشقا ئىشلەتكۈچىلەرگە بېرىلمەيدۇ.",
            ],
          },
          {
            heading: "ئۈچىنچى تەرەپ مۇلازىمەتلىرى",
            body: [
              "بىز ئۇچۇرلىرىڭىزنى ساتمايمىز ۋە ئۈچىنچى تەرەپلەرگە ئۇلارنىڭ ئۆز مەقسىتى ئۈچۈن بەرمەيمىز. مۇلازىمەتنىڭ ئىشلىشى ئۈچۈن تۆۋەندىكى تەمىنلىگۈچىلەر ئىشلىتىلىدۇ، ئۇلارنىڭ ھەر بىرى ئۇچۇرلارنى ئۆز قائىدىلىرى بويىچە بىر تەرەپ قىلىدۇ:",
            ],
            bullets: [
              `Telegram — ‎${BOT} بوتىنىڭ ئىشلىشى.`,
              "Cloudflare — بوتلاردىن قوغداش (Turnstile)، تور بېكەتنى يەتكۈزۈش ۋە ئېلخەت يۆنىلىشىنى بەلگىلەش.",
              "Google Analytics ۋە Google Tag Manager — زىيارەت ستاتىستىكىسى.",
              "Yandex Metrica — زىيارەت ستاتىستىكىسى، چېكىش خەرىتىسى ۋە Webvisor. Webvisor بەتتىكى ھەرىكەتلەرنى خاتىرىلەيدۇ: كۆرسەتكۈچنىڭ يۆتكىلىشى، سىيرىلدۇرۇش ۋە چېكىشلەر. خاتىرىلەر پەقەت تور بېكەتنىڭ قولايلىقلىقىنى تەھلىل قىلىش ئۈچۈنلا ئىشلىتىلىدۇ.",
            ],
          },
          {
            heading: "ئۇچۇرلارنى قانچىلىك ۋاقىت ساقلايمىز",
            bullets: [
              "چۈشۈرۈلگەن ھۆججەتلەر قۇرۇلغاندىن تەخمىنەن بىر سائەت كېيىن مۇلازىمېتىردىن ئاپتوماتىك ئۆچۈرۈلىدۇ. بىز ۋىدىيولىرىڭىزنىڭ ئارخىپىنى ساقلىمايمىز.",
              "چۈشۈرۈش ئۇرۇنۇشلىرىنىڭ خاتىرىلىرى سۇيىئىستېمال قىلىشنىڭ ئالدىنى ئېلىش ۋە مۇراجىئەتلەرنى بىر تەرەپ قىلىش ئۈچۈن قانچىلىك ۋاقىت كېرەك بولسا، شۇنچىلىك ساقلىنىدۇ.",
              "ھېسابات ئۇچۇرلىرى سىز مۇلازىمەتنى ئىشلىتىۋاتقان مەزگىلدە ساقلىنىدۇ ۋە تەلىپىڭىز بويىچە ئۆچۈرۈلىدۇ.",
              "مۇلازىمېتىر خاتىرىلىرى چەكلىك مۇددەت ساقلىنىدۇ ۋە نۆۋەتلىشىش (rotation) جەريانىدا قايتا يېزىلىدۇ.",
            ],
          },
          {
            heading: "ئۇچۇرلار قەيەردە بىر تەرەپ قىلىنىدۇ",
            body: [
              "مۇلازىمەتنىڭ مۇلازىمېتىرلىرى ياۋروپا ئىتتىپاقى زېمىنىدىكى سانلىق مەلۇمات مەركىزىدە جايلاشقان. يۇقىرىدا تىلغا ئېلىنغان تەمىنلىگۈچىلەرنىڭ بەزىلىرى ئۆز سىياسەتلىرىگە ئاساسەن ئۇچۇرلارنى ئۇنىڭ سىرتىدا بىر تەرەپ قىلىشى مۇمكىن.",
            ],
          },
          {
            heading: "سىزنىڭ ھوقۇقلىرىڭىز",
            body: [
              `سىز ئۇچۇرلىرىڭىزنىڭ بىر تەرەپ قىلىنىشى توغرىسىدا مەلۇمات ئېلىش، ئۇلارنى تۈزىتىش ياكى ئۆچۈرۈشنى تەلەپ قىلىش، رازىلىقىڭىزنى قايتۇرۇۋېلىش ۋە بىر تەرەپ قىلىشقا ئېتىراز بىلدۈرۈش ھوقۇقىغا ئىگە. بۇنىڭ ئۈچۈن مۇراجىئەتكە مۇناسىۋەتلىك ئېلخەت ئادرېسى ياكى Telegram ھېساباتىدىن ${MAIL} ئادرېسىغا خەت يېزىڭ.`,
              "بىز مۇۋاپىق مۇددەت ئىچىدە، ئادەتتە ئوتتۇز كالېندار كۈن ئىچىدە جاۋاب بېرىمىز. ھېسابات ئۆچۈرۈلسە، ئۇنىڭغا باغلانغان چۈشۈرۈش تارىخىمۇ ئۆچۈرۈلىدۇ.",
            ],
          },
          {
            heading: "قۇرامىغا يەتمىگەنلەر",
            body: [
              "مۇلازىمەت 16 ياشقا توشمىغان بالىلار ئۈچۈن مۆلچەرلەنمىگەن ۋە ئۇلارغا قارىتىلمىغان. بىز بۇنداق ئىشلەتكۈچىلەرنىڭ ئۇچۇرلىرىنى قەستەن توپلىمايمىز؛ ئەگەر بۇ خاتالىق بىلەن يۈز بەرگەن بولسا، بىزگە يېزىڭ، ئۇچۇرلار ئۆچۈرۈلىدۇ.",
            ],
          },
          {
            heading: "ئۆزگەرتىشلەر",
            body: [
              "بىز بۇ سىياسەتنى يېڭىلىشىمىز مۇمكىن. نۆۋەتتىكى نۇسخىنىڭ چېسلاسى بەتنىڭ بېشىدا كۆرسىتىلگەن؛ مۇھىم ئۆزگەرتىشلەرنى مۇلازىمەت ئىچىدە ئەسكەرتىمىز.",
            ],
          },
        ],
      },
      terms: {
        title: "ئىشلەتكۈچى كېلىشىمى",
        summary: `${operator.site} مۇلازىمىتىنى ئىشلىتىش قائىدىلىرى: نېمىگە رۇخسەت، نېمىگە رۇخسەت يوق ۋە مۇلازىمەت قانداق شەرتلەر ئاستىدا ئىشلەيدۇ.`,
        sections: [
          {
            heading: "ئومۇمىي بەلگىلىمىلەر",
            body: [
              `بۇ كېلىشىم ${operator.site} تور بېكىتى ۋە ‎${BOT} Telegram بوتىنىڭ ئىشلىتىلىشىنى تەڭشەيدۇ. مۇلازىمەتنىڭ ئىگىسى ۋە باشقۇرغۇچىسى — ${operator.nameUg}.`,
              "مۇلازىمەتنى ئىشلىتىشكە باشلاش ئارقىلىق سىز بۇ شەرتلەرنى ئوقۇپ چىققانلىقىڭىزنى ۋە ئۇلارنى قوبۇل قىلىدىغانلىقىڭىزنى جەزملەشتۈرىسىز. ئەگەر بىرەر شەرت سىزگە ماس كەلمىسە، مۇلازىمەتنى ئىشلەتمەڭ.",
            ],
          },
          {
            heading: "مۇلازىمەت ھەقسىز",
            body: [
              "مۇلازىمەتنىڭ بارلىق ئىقتىدارلىرى ھەقسىز تەمىنلىنىدۇ. بىزدە مۇشتەرىلىك، ھەقلىق تارىفلار، ھەقلىق ۋىدىيو سۈپەتلىرى ۋە مۇلازىمەت ئىچىدىكى سېتىۋېلىشلار يوق.",
              "بىز ئېلان كۆرسەتمەيمىز ۋە ھەمكارلىق (affiliate) ئۇلانمىلىرىنى قويمايمىز.",
            ],
          },
          {
            heading: "ئىشلىتىش شەرتلىرى",
            bullets: [
              "تور بېكەتتە چۈشۈرۈش ئۈچۈن ھېسابات ياكى كىرىش تەلەپ قىلىنمايدۇ. بوت ئىشلەتكۈچىلەرنى ئۇلارنىڭ Telegram ھېساباتى ئارقىلىق پەرقلەندۈرىدۇ.",
              "تەلەپ چاستوتىسىغا قويۇلغان تېخنىكىلىق چەكلىمىلەر مۇلازىمەتنى ھەددىدىن زىيادە يۈكلىنىش ۋە ئاپتوماتىك سۇيىئىستېمال قىلىشتىن قوغدايدۇ.",
              "YouTube ئۈچۈن كۈندىلىك ترافىك چەكلىمىسى بار: تور بېكەت ۋە قىستۇرمىدا ھەر بىر تور ئۈچۈن 24 سائەتتە 10 GB، بوتتا ھەر بىر Telegram ھېساباتى ئۈچۈن 24 سائەتتە 25 GB. باشقا سۇپىلارغا بۇ چەكلىمە تەسىر كۆرسەتمەيدۇ.",
              "بوت ئارقىلىق چۈشۈرۈش ئۈچۈن قانىلىمىزغا مۇشتەرى بولۇش تەلەپ قىلىنمايدۇ. بوت ھۆججەتلەرنىڭ تېكىستىگە تۈرنىڭ خەۋەر قانىلىنىڭ ئۇلانمىسىنى قوشىدۇ؛ ئۇنىڭغا مۇشتەرى بولۇش مەجبۇرىي ئەمەس.",
            ],
          },
          {
            heading: "مۇلازىمەت نېمە قىلىدۇ",
            body: [
              "مۇلازىمەت تېخنىكىلىق ۋاسىتىچى سۈپىتىدە ئىشلەيدۇ: سىز بەرگەن ئۇلانما بويىچە ئاممىغا ئوچۇق بەتكە مۇراجىئەت قىلىپ، مېدىيا ھۆججىتىنى ئالىدۇ ۋە ئۇنى سىزگە يەتكۈزىدۇ.",
              "بىز ۋىدىيو كاتالوگى تۇرغۇزمايمىز، باشقىلارنىڭ مەزمۇنى ئىچىدىن ئىزدەش ئېلىپ بارمايمىز ۋە چۈشۈرۈلگەن ھۆججەتلەرنى يەتكۈزۈش ئۈچۈن زۆرۈر بولغان ۋاقىتتىن — تەخمىنەن بىر سائەتتىن — ئارتۇق ساقلىمايمىز.",
              "مەلۇم بىر سۇپىنىڭ ئىشلەش-ئىشلىمەسلىكى شۇ سۇپىنىڭ تېخنىكىلىق قارارلىرىغا باغلىق بولۇپ، ئالدىن ئۇقتۇرۇشسىز ئۆزگىرىشى مۇمكىن.",
            ],
          },
          {
            heading: "ئىشلەتكۈچىنىڭ مەجبۇرىيەتلىرى",
            body: [
              "ئېرىشكەن ھۆججەتلەرنى قانداق ئىشلىتىشىڭىزگە ئۆزىڭىز مەسئۇل بولىسىز ۋە بۇنىڭغا ھوقۇقىڭىز بارلىقىنى جەزملەشتۈرىسىز.",
            ],
            bullets: [
              "پەقەت ھوقۇقى ئۆزىڭىزگە تەۋە بولغان ياكى ئىشلىتىلىشىگە ھوقۇق ئىگىسى ياكى قانۇن رۇخسەت قىلغان ماتېرىياللارنىلا چۈشۈرۈڭ.",
              "مۇلازىمەتنى ئاپتورلۇق ھوقۇقى ۋە يانداش ھوقۇقلارنى (related rights) دەپسەندە قىلىش، چەكلەنگەن مەزمۇنلارنى تارقىتىش ۋە ئۈچىنچى شەخسلەرنىڭ ھوقۇقلىرىغا دەخلى-تەرۇز قىلىش ئۈچۈن ئىشلەتمەڭ.",
              "مۇلازىمەتنىڭ تېخنىكىلىق چەكلىمىلىرىنى، جۈملىدىن تەلەپ چاستوتىسى چەكلىمىسى ۋە بوت تەكشۈرۈشىنى ئايلىنىپ ئۆتۈشكە ئۇرۇنماڭ.",
              "ئاپتوماتىك يۈك پەيدا قىلماڭ: كۆپلەپ تەلەپ يوللاش، سكرىپتلار ۋە پارسېرلار (scrapers) رۇخسەت قىلىنمايدۇ.",
            ],
          },
          {
            heading: "قانالدا ئۇلانمىلارنى ئېلان قىلىش",
            body: [
              "بوت ئارقىلىق ۋىدىيو چۈشۈرگىنىڭىزدە، ئەسلى يوللانمىنىڭ ئۇلانمىسىنىڭ Telegram قانىلىمىزدا ئېلان قىلىنىشىغا قوشۇلغان بولىسىز. بۇ ھەقتىكى ئاگاھلاندۇرۇش بوتتا سۈپەت تاللاشتىن بۇرۇن — يەنى چۈشۈرۈش-چۈشۈرمەسلىكنى قارار قىلىشىڭىزدىن بۇرۇن كۆرسىتىلىدۇ.",
              "ئېلان قىلىش نامسىز بولىدۇ: قانالغا ئاممىغا ئوچۇق بەتنىڭ ئۇلانمىسى، ۋىدىيونىڭ ماۋزۇسى ۋە مۇقاۋىسى — يەنى سۇپا ئۆز يوللانمىسىنىڭ ئالدىن كۆرۈنۈشىدە كۆرسىتىدىغان ئاشۇ كادىر يوللىنىدۇ. ۋىدىيونى كىمنىڭ چۈشۈرگەنلىكى كۆرسىتىلمەيدۇ. ۋىدىيو ھۆججىتىنىڭ ئۆزى ھېچقاچان ھېچ يەردە ئېلان قىلىنمايدۇ: تارقىتىلىدىغىنى پەقەت ئۇلانما بولۇپ، سۇپىلارنىڭ ئۆزىمۇ ھەر بىر يوللانمىنىڭ ئاستىدىكى «ھەمبەھىرلەش» كۇنۇپكىسى ئارقىلىق ئۇنى تارقىتىشنى تەۋسىيە قىلىدۇ.",
              "ئوخشاش بىر ئۇلانما بىر قېتىمدىن ئارتۇق ئېلان قىلىنمايدۇ. ئەگەر ئۇلانمىنىڭ قانالغا چىقىشىنى خالىمىسىڭىز، ئۇ ۋىدىيونى مۇلازىمىتىمىز ئارقىلىق چۈشۈرمەڭ.",
              "گۇرۇپپىلاردىكى ئۇلانمىلار ۋە باغلانغان ھېسابات ئارقىلىق چۈشۈرۈلگەن يوللانمىلار قانالدا ئېلان قىلىنمايدۇ."
            ],
          },
          {
            heading: "ئۆز ھېساباتىڭىزنى باغلاش",
            body: [
              "سۇپىدىكى ھېساباتىڭىزنى بوتقا باغلاش ئارقىلىق، ئۇنىڭ سىزنىڭ ھېساباتىڭىز ئىكەنلىكىنى ۋە ئۇنى بۇ شەكىلدە ئىشلىتىشكە ھوقۇقىڭىز بارلىقىنى جەزملەشتۈرىسىز.",
              "سۇپىلار ئاپتوماتىك چۈشۈرۈشنى ماقۇللىمايدۇ ۋە باغلانغان ھېساباتنى چەكلىشى ياكى توسۇۋېتىشى مۇمكىن. بۇ خەتەرنى ئۆزىڭىز ئۈستىڭىزگە ئالىسىز؛ ئاساسلىق ھېساباتىڭىزنى ئەمەس، ئايرىم بىر ھېساباتنى باغلىشىڭىزنى تەۋسىيە قىلىمىز. سۇپا ھېساباتىڭىزغا قويغان چەكلىمىلەرگە بىز مەسئۇل ئەمەس.",
              "گۇرۇپپىغا باغلانغان ھېسابات شۇ گۇرۇپپىنىڭ بارلىق ئەزالىرىنىڭ چۈشۈرۈشلىرى ئۈچۈن ئىشلىتىلىدۇ. كىمنىڭ ھېسابات باغلىيالايدىغانلىقىنى گۇرۇپپا باشقۇرغۇچىلىرى بەلگىلەيدۇ ۋە ئۇلار خالىغان ھېساباتنى ئۆچۈرەلەيدۇ.",
            ],
          },
          {
            heading: "مەسئۇلىيەتنى چەكلەش",
            body: [
              "مۇلازىمەت «قانداق بولسا شۇنداق» (as is) شەرتى بىلەن تەمىنلىنىدۇ. بىز ئۈزلۈكسىز ئىشلەشكە، مەلۇم بىر سۇپىنىڭ ئىشلىتىشكە بولىدىغانلىقىغا ياكى ھۆججەتنىڭ مەقسىتىڭىزگە ماس كېلىدىغانلىقىغا كاپالەتلىك قىلمايمىز.",
              "چۈشۈرۈلگەن ماتېرىيالنى قانداق ئىشلەتكەنلىكىڭىزگە ۋە ئۈچىنچى شەخسلەرنىڭ ھوقۇقلىرىنى دەپسەندە قىلىشىڭىزنىڭ ئاقىۋەتلىرىگە بىز مەسئۇل ئەمەس.",
              "بىز مۇلازىمەتنىڭ ئىقتىدارلىرىنى ئۆزگەرتىش، ئاسراش ئۈچۈن ئۇنىڭ ئىشلىشىنى ۋاقىتلىق توختىتىش ۋە ئۇنىڭ ئىشلىشىنى ئاخىرلاشتۇرۇش ھوقۇقىغا ئىگە.",
            ],
          },
          {
            heading: "ئىشلىتىش ھوقۇقىنى چەكلەش",
            body: [
              "بۇ كېلىشىم شەرتلىرى بۇزۇلغاندا، چەكلىمىلەرنى ئايلىنىپ ئۆتۈشكە ئۇرۇنۇلغاندا، شۇنداقلا ھوقۇق ئىگىسىدىن دەلىل-ئىسپاتلىق شىكايەت كەلگەندە، بىز مۇلازىمەتنى ئىشلىتىش ھوقۇقىنى چەكلىشىمىز ياكى ئاخىرلاشتۇرۇشىمىز مۇمكىن.",
            ],
          },
          {
            heading: "ئۆزگەرتىشلەر ۋە قوللىنىلىدىغان قانۇن",
            body: [
              "بىز بۇ شەرتلەرنى ئۆزگەرتىشىمىز مۇمكىن؛ كۈچكە ئىگە نۇسخىنىڭ چېسلاسى بەتنىڭ بېشىدا كۆرسىتىلگەن. ئۆزگەرتىشتىن كېيىن مۇلازىمەتنى داۋاملىق ئىشلىتىش ئارقىلىق سىز يېڭى نۇسخىنى قوبۇل قىلغان بولىسىز.",
              "تەرەپلەر ئوتتۇرىسىدىكى مۇناسىۋەتلەرگە قازاقىستان جۇمھۇرىيىتىنىڭ قانۇنى قوللىنىلىدۇ. تەرەپلەر ماجىرالارنى خەت ئالاقىسى ئارقىلىق ھەل قىلىشقا تىرىشىدۇ، كېلىشىمگە كېلەلمىگەندە بولسا، قازاقىستان جۇمھۇرىيىتىنىڭ قانۇنلىرىدا بەلگىلەنگەن تەرتىپ بويىچە ھەل قىلىدۇ.",
            ],
          },
        ],
      },
      cookies: {
        title: "كۇكى سىياسىتى",
        summary: `${operator.site} قايسى كۇكىلارنى ئىشلىتىدۇ، ئۇلار نېمە ئۈچۈن كېرەك ۋە ئۇلاردىن قانداق ۋاز كېچىش مۇمكىن.`,
        sections: [
          {
            heading: "كۇكى دېگەن نېمە",
            body: [
              "كۇكى (cookie) — تور بېكەت توركۆرگۈڭىزدە ساقلايدىغان كىچىك تېكىست ھۆججەتلىرى. ئۇلار تەڭشەكلىرىڭىزنى ئېسىدە ساقلاش ۋە زىيارەتلەرنىڭ نامسىزلاشتۇرۇلغان ستاتىستىكىسىنى توپلاش ئىمكانىيىتىنى بېرىدۇ.",
              "بۇ ھۆججەتتە كۇكىلار بىلەن بىللە ئۇلارغا يېقىن تېخنىكىلارنى — توركۆرگۈنىڭ يەرلىك ساقلىغۇچى (local storage) ۋە ئىز قوغلاش پىكسېللىرىنىمۇ بايان قىلىمىز.",
            ],
          },
          {
            heading: "زۆرۈر كۇكىلار",
            body: ["ئۇلارسىز مۇلازىمەت ئىشلىمەيدۇ، شۇڭا ئۇلار ھەمىشە ئورنىتىلىدۇ."],
            bullets: [
              "Cloudflare Turnstile — ئۇلانمىنى سكرىپت ئەمەس، ئادەم يوللاۋاتقانلىقىنى تەكشۈرىدۇ.",
              "ئارايۈز تەڭشەكلىرى — تاللانغان تىل ۋە رەڭ ئۇسلۇبى.",
            ],
          },
          {
            heading: "تەھلىل كۇكىلىرى",
            body: [
              "ئۇلار قايسى بەتلەرنىڭ ئىشلىتىلىدىغانلىقىنى ۋە خاتالىقلارنىڭ قەيەردە يۈز بېرىدىغانلىقىنى چۈشىنىشىمىزگە ياردەم بېرىدۇ. ئۇلار سىزنىڭ رازىلىقىڭىز بىلەن ئورنىتىلىدۇ ۋە مۇلازىمەتنىڭ ئىشلىشى ئۈچۈن مەجبۇرىي ئەمەس.",
            ],
            bullets: [
              "Google Analytics ۋە Google Tag Manager — نامسىزلاشتۇرۇلغان شەكىلدىكى زىيارەت مىقدارى ۋە تور بېكەتتىكى ھەرىكەتلەر.",
              "Yandex Metrica — زىيارەت مىقدارى، چېكىش خەرىتىسى ۋە Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica نىڭ Webvisor قورالى بەتتىكى ھەرىكەتلەرنى خاتىرىلەيدۇ: كۆرسەتكۈچنىڭ يۆتكىلىشى، سىيرىلدۇرۇش، چېكىشلەر ۋە ئۇلانما رامكىسىغا كىرگۈزۈلگەن مەزمۇن. بۇ ئارايۈزنىڭ قەيەردە كىشىلەرنى قايمۇقتۇرىدىغانلىقىنى كۆرۈش ئۈچۈن كېرەك.",
              "بىز بۇ خاتىرىلەرنى ئايرىم كىشىلەرنى ئىز قوغلاش ئۈچۈن ئىشلەتمەيمىز. تور بېكەتنىڭ رامكىلىرىغا ساقلىنىشىنى خالىمايدىغان ئۇچۇرلارنى كىرگۈزمەڭ.",
            ],
          },
          {
            heading: "قانداق ۋاز كېچىش",
            bullets: [
              "توركۆرگۈڭىزنىڭ تەڭشەكلىرىدە كۇكىلارنى توسۇش ياكى ئۆچۈرۈشنى تەڭشەڭ — بۇ ئۇسۇل يۇقىرىدا تىلغا ئېلىنغان بارلىق سىستېمىلار ئۈچۈن كۈچكە ئىگە.",
              "Google Analytics: توپلاشنى چەكلەيدىغان رەسمىي توركۆرگۈ قىستۇرمىسىنى Google تور بېكىتىدىن ئالغىلى بولىدۇ.",
              "Yandex Metrica: Yandex نىڭ رەسمىي قىستۇرمىسى ئارقىلىق ۋاز كەچكىلى بولىدۇ.",
              "زۆرۈر كۇكىلارنى چەكلىسىڭىز، چۈشۈرۈش مۇمكىن بولماي قالىدۇ.",
            ],
          },
          {
            heading: "ساقلاش مۇددىتى",
            body: [
              "سېئانس كۇكىلىرى توركۆرگۈ تاقالغاندا ياكى سېئانس مۇددىتى توشقاندا ئۆچۈرۈلىدۇ. تەھلىل قوراللىرى ئۆز پەرقلەندۈرگۈچلىرىنى ئۇلارنىڭ تەمىنلىگۈچىلىرى بەلگىلىگەن مۇددەت ئىچىدە ساقلايدۇ.",
            ],
          },
        ],
      },
      copyright: {
        title: "ھوقۇق ئىگىلىرى ئۈچۈن",
        summary: "مۇلازىمەتنىڭ ئاپتورلۇق ھوقۇقى مەسىلىسىدىكى مەيدانى ۋە ھوقۇق دەپسەندە قىلىنغانلىقى توغرىسىدا شىكايەت سۇنۇش تەرتىپى.",
        sections: [
          {
            heading: "مۇلازىمەتنىڭ مەيدانى",
            body: [
              "مۇلازىمەت ۋىدىيولارنى ئۆزىدە ساقلىمايدۇ ۋە ئۇلارنىڭ كاتالوگىنى تۇرغۇزمايدۇ. ئۇ تېخنىكىلىق ۋاسىتىچى سۈپىتىدە ئىشلەيدۇ: ئىشلەتكۈچى كىرگۈزگەن ئۇلانما بويىچە ئاممىغا ئوچۇق بەتكە مۇراجىئەت قىلىپ، ھۆججەتنى ئىشلەتكۈچىگە يەتكۈزىدۇ.",
              "چۈشۈرۈلگەن ھۆججەتلەر مۇلازىمېتىردا تەخمىنەن بىر سائەت ساقلىنىدۇ، ئاندىن ئاپتوماتىك ئۆچۈرۈلىدۇ. بىزدە باشقىلارنىڭ مەزمۇنىنىڭ دائىملىق كۆپەيتىلمىسى قالمايدۇ.",
              "چۈشۈرۈلگەن ماتېرىيالنىڭ ئىشلىتىلىشىگە ئىشلەتكۈچى مەسئۇل بولىدۇ — بۇ ئىشلەتكۈچى كېلىشىمىدە ئېنىق بەلگىلەنگەن.",
            ],
          },
          {
            heading: "ئەگەر ھوقۇقىڭىز دەپسەندە قىلىنغان بولسا",
            body: [
              `ئەگەر سىز ھوقۇق ئىگىسى ياكى ئۇنىڭ ۋەكىلى بولسىڭىز ۋە مۇلازىمەتنىڭ ھوقۇقىڭىزنى دەپسەندە قىلىش ئۈچۈن ئىشلىتىلىۋاتقانلىقىنى ئويلىسىڭىز، ${MAIL} ئادرېسىغا خەت يېزىڭ. بىز بۇنداق مۇراجىئەتلەرنى كۆرۈپ چىقىمىز ۋە تەدبىر قوللىنىمىز.`,
            ],
          },
          {
            heading: "مۇراجىئەتتە نېمىلەرنى كۆرسىتىش كېرەك",
            bullets: [
              "قايسى ئەسەرگە دەخلى يەتكەنلىكى ۋە سىزنىڭ ئۇنىڭغا قانداق ئاساستا ھوقۇقلۇق ئىكەنلىكىڭىز.",
              "ماتېرىيالنىڭ ئۇلانمىسى ۋە، ئەگەر مەلۇم بولسا، دەپسەندىچىلىكنىڭ ئەھۋالى.",
              "ئالاقىلىشىش ئۇچۇرلىرىڭىز: ئىسمىڭىز ياكى تەشكىلات نامى، ئادرېس ۋە ئېلخەت ئادرېسى.",
              "ئەگەر ھوقۇق ئىگىسىنىڭ نامىدىن ھەرىكەت قىلسىڭىز — ۋەكالەت ھوقۇقىڭىزنى ئىسپاتلايدىغان ھۆججەت.",
              "مۇراجىئەتتىكى ئۇچۇرلارنىڭ توغرا ئىكەنلىكى ۋە ماتېرىيالنىڭ ئىشلىتىلىشىگە ھوقۇق ئىگىسى ياكى قانۇن رۇخسەت قىلمىغانلىقى توغرىسىدىكى بايانات.",
            ],
          },
          {
            heading: "بىز نېمە قىلىمىز",
            body: [
              "بىز مۇراجىئەتنى مۇۋاپىق مۇددەت ئىچىدە، ئادەتتە ئوتتۇز كالېندار كۈن ئىچىدە كۆرۈپ چىقىمىز؛ دەپسەندىچىلىك ئىسپاتلانسا، مۇلازىمەت ئارقىلىق ماتېرىيالغا ئېرىشىشنى چەكلەيمىز، زۆرۈر تېپىلغاندا دەپسەندە قىلغۇچىنىڭ مۇلازىمەتنى ئىشلىتىش ھوقۇقىنىمۇ چەكلەيمىز.",
              "كۆرۈپ چىقىش نەتىجىسىنى سىز كۆرسەتكەن ئېلخەت ئادرېسىغا ئۇقتۇرىمىز.",
            ],
          },
          {
            heading: "سەمىمىيەتسىز مۇراجىئەتلەر",
            body: [
              "قەستەن يالغان ئۇچۇر كىرگۈزۈلگەن مۇراجىئەت قانۇنغا ئاساسەن ئەرز قىلغۇچىنىڭ جاۋابكارلىقىنى كەلتۈرۈپ چىقىرىشى مۇمكىن. ئەگەر مۇراجىئەتتىن ھوقۇق ئىگىسىنىمۇ، تالاش-تارتىشلىق ماتېرىيالنىمۇ ئېنىقلىغىلى بولمىسا، بىز ئۇنى كۆرۈپ چىقىشنى رەت قىلىش ھوقۇقىغا ئىگە.",
            ],
          },
        ],
      },
    },
  },
  tk: {
    ui: {
      updated: "Redaksiýanyň senesi",
      back: "Baş sahypa",
      operatorHeading: "Hyzmatyň operatory",
      navHeading: "Beýleki resminamalar",
      labels: {
        privacy: "Gizlinlik syýasaty",
        terms: "Ulanyjy ylalaşygy",
        cookies: "Cookie syýasaty",
        copyright: "Hukuk eýelerine",
      },
    },
    docs: {
      privacy: {
        title: "Gizlinlik syýasaty",
        summary: `${operator.site} haýsy maglumatlary ýygnaýar, olar näme üçin gerek, näçe wagt saklanýar we olary nädip pozmaly.`,
        sections: [
          {
            heading: "Umumy düzgünler",
            body: [
              `Şu Syýasat ${operator.site} hyzmatynyň haýsy şahsy maglumatlary we haýsy maksat bilen işläp taýýarlaýandygyny beýan edýär. Maglumatlaryň operatory hökmünde ${operator.nameTk} çykyş edýär.`,
              "Hyzmatdan peýdalanmak bilen, Siz şu ýerde beýan edilen işläp taýýarlamak tertibine razylyk berýärsiňiz. Eger Siz onuň bilen razy bolmasaňyz, haýyş edýäris, hyzmatdan peýdalanmaň.",
              "Işläp taýýarlamak Gazagystan Respublikasynyň «Şahsy maglumatlar we olary goramak hakynda» Kanunyna laýyklykda, Ýewropa ykdysady zolagyndan gelýän myhmanlara degişlilikde bolsa GDPR-iň talaplary göz öňünde tutulyp amala aşyrylýar.",
            ],
          },
          {
            heading: "Haýsy maglumatlary işläp taýýarlaýarys",
            body: [
              "Biz hyzmatyň işlemegi üçin zerur bolanyndan artyk hiç zady bilkastlaýyn ýygnamaýarys we resminamalary, töleg maglumatlaryny ýa-da ýaşaýyş salgysyny soramaýarys.",
            ],
            bullets: [
              "Siz bota ýazanyňyzda onuň alýan Telegram hasabynyň maglumatlary: san görnüşindäki identifikator, ulanyjy ady, ady we dil kody.",
              "Ýüklemek üçin iberýän salgylaryňyz we synanyşygyň özi barada maglumatlar: platforma, senesi we wagty, saýlanan hil, netijesi (üstünlik ýa-da ýalňyşlyk).",
              "Birikmäniň tehniki maglumatlary: IP-salgy, brauzeriň görnüşi we wersiýasy, dil, Siziň geçip gelen sahypaňyz. Olar serweriň žurnallaryna we web-analitika ulgamlaryna düşýär.",
              "Cookie faýllary we analitika identifikatorlary — jikme-jiklikler Cookie syýasatynda.",
            ],
          },
          {
            heading: "Bu maglumatlar näme üçin gerek",
            bullets: [
              "Hyzmatyň özüni bermek: Siziň salgyňyz boýunça wideony almak we faýly Size bermek.",
              "Siziň hasabyňyzy başgalaryňkydan tapawutlandyrmak we hyýanatçylykly peýdalanmaga garşy durmak.",
              "Hyzmaty awtomatlaşdyrylan hyýanatçylykly peýdalanmakdan goramak: salgy iberilmezden öň Cloudflare Turnstile barlagy.",
              "Saýtyň nähili ulanylýandygyna düşünmek we ýalňyşlyklary düzetmek — şahsyýetsizleşdirilen we jemlenen statistika.",
              "Siziň ýüzlenmeleriňize we hukuk eýeleriniň ýüzlenmelerine jogap bermek.",
              "Hyzmat barada pikiriňizi bilmek üçin wagtal-wagtal Size Telegram-da ýazmak — meselem, eger Siz ondan peýdalanmagy bes eden bolsaňyz. Jogap bermek hökman däl; eger şeýle habarlar Size gerek bolmasa, diňe şony aýdyň, biz mundan beýläk ýazmarys.",
            ],
          },
          {
            heading: "Işläp taýýarlamagyň esaslary",
            body: [
              "Telegram hasabynyň maglumatlary we ýüklemeler barada maglumatlar hyzmatdan peýdalanyp başlamak bilen Siziň kabul edýän Ulanyjy ylalaşygyňyzy ýerine ýetirmek üçin işlenip taýýarlanylýar.",
              "Analitika cookie faýllary we saýtdaky hereketleriň ýazga alynmagy Siziň razylygyňyzyň esasynda işlenip taýýarlanylýar, ony Siz islendik wagt yzyna alyp bilersiňiz — muňuň usullary Cookie syýasatynda beýan edilýär.",
              "Serweriň žurnallary we botlardan goramak hyzmaty işe ukyply we goragly saklamakdaky kanuny gyzyklanmamyzyň çäginde işlenip taýýarlanylýar.",
              "Hyzmat barada pikiriňiz bilen bagly soraglar — hyzmaty kämilleşdirmekdäki kanuny gyzyklanmamyzyň çäginde; Siz olardan islendik wagt ýüz öwrüp bilersiňiz.",
            ],
          },
          {
            heading: "Birikdirilen hasaplar",
            body: [
              "Isleseňiz, platformadaky öz hasabyňyzy (Instagram, Facebook, YouTube, X, VK, TikTok) bota birikdirip bilersiňiz, şonda bot diňe ulgama giren ulanyjylara görünýän ýazgylary — storisleri, ýapyk ýazgylary ýükläp biler. Munuň üçin bot şol hasabyň cookie faýllaryny alýar — Videoner giňeltmesinden bir gezeklik kod arkaly ýa-da Siziň iberen faýlyňyzdan.",
              "Biz diňe saýlanan platformanyň cookie faýllaryny saklaýarys, galanlaryny derrew taşlaýarys. Olar şifrlenen görnüşde saklanýar we diňe Siziň olary birikdiren ýeriňizdäki ýüklemeler üçin ulanylýar. Şahsy ýazyşmada birikdirilenler — Siziň ýüklemeleriňiz üçin, şol sanda öz hasaby birikdirilmedik toparlardaky Siziň öz salgylaryňyz üçin; başgalaryň salgylary üçin olar ulanylmaýar. Topara birikdirilenler — onuň agzalarynyň ýüklemeleri üçin we başga hiç ýerde ulanylmaýar.",
              "Esas — Siziň razylygyňyz: hasaby Siz özüňiz birikdirýärsiňiz we ony islendik wagt /accounts buýrugy bilen pozup bilersiňiz. Pozulanda cookie faýllary yzyna dikeldip bolmaýan görnüşde öçürilýär. Eger platforma girişi kabul etmegini bes etse, bot bu barada Size habar berýär.",
              "Birikdirilen hasap arkaly ýüklenen ýazgylar kanalymyzda çap edilmeýär we umumy keşden beýleki ulanyjylara berilmeýär.",
            ],
          },
          {
            heading: "Üçünji tarapyň hyzmatlary",
            body: [
              "Biz Siziň maglumatlaryňyzy satmaýarys we olary üçünji şahslara olaryň öz maksatlary üçin bermeýäris. Hyzmatyň işlemegi üçin aşakdaky üpjün edijiler çekilen, olaryň her biri maglumatlary öz düzgünlerine laýyklykda işläp taýýarlaýar:",
            ],
            bullets: [
              "Telegram — " + BOT + " botunyň işi.",
              "Cloudflare — botlardan goramak (Turnstile), saýty eltip bermek we poçtany ugrukdyrmak.",
              "Google Analytics we Google Tag Manager — saparlaryň statistikasy.",
              "Yandex Metrica — saparlaryň statistikasy, basyşlar kartasy we Webvisor. Webvisor sahypadaky hereketleri ýazga alýar: kursoryň hereketlerini, sahypany aýlamagy we basyşlary. Ýazga alnan maglumatlar diňe saýtyň amatlylygyny seljermek üçin ulanylýar.",
            ],
          },
          {
            heading: "Maglumatlary näçe wagt saklaýarys",
            bullets: [
              "Ýüklenen faýllar döredilenden takmynan bir sagat soň serwerden awtomatik usulda pozulýar. Biz Siziň wideolaryňyzyň arhiwini saklamaýarys.",
              "Ýükleme synanyşyklary baradaky bellikler hyýanatçylykly peýdalanmaga garşy durmak we ýüzlenmelere seretmek üçin gerek bolýança saklanýar.",
              "Hasabyň maglumatlary Siz hyzmatdan peýdalanýançaňyz saklanýar we Siziň haýyşyňyz boýunça pozulýar.",
              "Serweriň žurnallary çäkli wagtyň dowamynda saklanýar we rotasiýa boýunça täzeden ýazylýar.",
            ],
          },
          {
            heading: "Maglumatlar nirede işlenip taýýarlanylýar",
            body: [
              "Hyzmatyň serwerleri Ýewropa Bileleşiginiň çägindäki maglumat merkezinde ýerleşýär. Ýokarda sanalan üpjün edijileriň bir bölegi maglumatlary öz syýasatlaryna laýyklykda onuň çäklerinden daşarda işläp taýýarlap biler.",
            ],
          },
          {
            heading: "Siziň hukuklaryňyz",
            body: [
              `Siz öz maglumatlaryňyzyň işlenip taýýarlanylyşy barada maglumat almaga, olary düzetmegi ýa-da pozmagy talap etmäge, razylygyňyzy yzyna almaga we işläp taýýarlamaga garşy çykmaga haklysyňyz. Munuň üçin ýüzlenme bilen baglanyşykly elektron poçtadan ýa-da Telegram hasabyndan ${MAIL} salgysyna ýazyň.`,
              "Biz paýhasly möhletde, adatça otuz senenama gününiň dowamynda jogap berýäris. Hasabyň pozulmagy onuň bilen baglanyşykly ýükleme taryhynyň pozulmagyna getirýär.",
            ],
          },
          {
            heading: "Kämillik ýaşyna ýetmedikler",
            body: [
              "Hyzmat 16 ýaşdan kiçi çagalar üçin niýetlenmedik we olara gönükdirilmedik. Biz şeýle ulanyjylaryň maglumatlaryny bilkastlaýyn ýygnamaýarys; eger bu ýalňyşlyk bilen bolan bolsa, bize ýazyň, maglumatlar pozular.",
            ],
          },
          {
            heading: "Üýtgeşmeler",
            body: [
              "Biz şu Syýasaty täzeläp bileris. Hereket edýän redaksiýanyň senesi sahypanyň başynda görkezilýär; düýpli üýtgeşmeleri biz hyzmatda belläris.",
            ],
          },
        ],
      },
      terms: {
        title: "Ulanyjy ylalaşygy",
        summary: `${operator.site} hyzmatyndan peýdalanmagyň düzgünleri: näme etmek bolýar, näme bolmaýar we hyzmat haýsy şertlerde işleýär.`,
        sections: [
          {
            heading: "Umumy düzgünler",
            body: [
              `Ylalaşyk ${operator.site} saýtyndan we ${BOT} Telegram-botundan peýdalanmagy düzgünleşdirýär. Hyzmatyň eýesi we administratory — ${operator.nameTk}.`,
              "Hyzmatdan peýdalanyp başlamak bilen, Siz şertleri okandygyňyzy we olary kabul edýändigiňizi tassyklaýarsyňyz. Eger haýsydyr bir şert Size laýyk gelmeýän bolsa, hyzmatdan peýdalanmaly däl.",
            ],
          },
          {
            heading: "Hyzmat mugt",
            body: [
              "Hyzmatyň ähli mümkinçilikleri mugt berilýär. Bizde abunalyklar, tölegli tarifler, wideonyň tölegli hilleri we içerki satyn almalar ýok.",
              "Biz mahabat görkezmeýäris we partnýorlyk salgylaryny ýerleşdirmeýäris.",
            ],
          },
          {
            heading: "Elýeterlilik şertleri",
            bullets: [
              "Saýtda ýüklemek üçin ne hasap, ne-de ulgama girmek gerek däl. Bot ulanyjylary olaryň Telegram hasaby boýunça tapawutlandyrýar.",
              "Hyzmaty aşa ýüklenmekden we awtomatlaşdyrylan hyýanatçylykly peýdalanmakdan soraglaryň ýygylygyna bolan tehniki çäklendirmeler goraýar.",
              "YouTube üçin gündelik trafik çägi hereket edýär: saýtda we giňeltmede bir tordan 24 sagatda 10 GB we botda bir Telegram hasaby üçin 24 sagatda 25 GB. Beýleki platformalara ol degişli däl.",
              "Bot arkaly ýüklemek üçin kanalymyza ýazylmak talap edilmeýär. Bot faýllaryň tekstine taslamanyň habarlar kanalynyň salgysyny goşýar; oňa ýazylmak hökman däl.",
            ],
          },
          {
            heading: "Hyzmat näme edýär",
            body: [
              "Hyzmat tehniki araçy bolup durýar: Siziň salgyňyz boýunça ol köpçülige açyk sahypa ýüzlenýär, media faýly alýar we ony Size berýär.",
              "Biz özümizde wideo katalogyny ýerleşdirmeýäris, başgalaryň kontenti boýunça gözleg geçirmeýäris we ýüklenen faýllary bermek üçin zerur bolan wagtdan — takmynan bir sagatdan — uzak saklamaýarys.",
              "Belli bir platformanyň elýeterliligi onuň tehniki çözgütlerine bagly we duýduryşsyz üýtgäp biler.",
            ],
          },
          {
            heading: "Ulanyjynyň borçlary",
            body: [
              "Alnan faýllary nähili ulanýandygyňyz üçin Siz özbaşdak jogap berýärsiňiz we munuň üçin hukugyňyzyň bardygyny tassyklaýarsyňyz.",
            ],
            bullets: [
              "Diňe hukuklary Size degişli bolan ýa-da ulanylmagyna hukuk eýesi ýa-da kanun tarapyndan rugsat berlen materialy ýükläň.",
              "Hyzmaty awtorlyk we baglanyşykly hukuklary bozmak, gadagan edilen kontenti ýaýratmak we üçünji şahslaryň hukuklaryny bozmak üçin ulanmaň.",
              "Hyzmatyň tehniki çäklendirmelerini, şol sanda soraglaryň ýygylygyna bolan çäklendirmeleri we botlara garşy barlagy aýlanyp geçmäge synanyşmaň.",
              "Awtomatlaşdyrylan ýük döretmäň: köpçülikleýin soraglara, skriptlere we parserlere ýol berilmeýär.",
            ],
          },
          {
            heading: "Salgylaryň kanalda çap edilmegi",
            body: [
              "Bot arkaly wideo ýükläp, Siz asyl ýazgynyň salgysynyň biziň Telegram-kanalymyzda çap ediljekdigine razylyk berýärsiňiz. Bu barada duýduryş botda hil saýlanmazdan öň — ýagny Siz ýüklemek barada karar kabul etmezden öň görkezilýär.",
              "Çap etmek anonim: kanala köpçülige açyk sahypanyň salgysy, roligiň ady we onuň örtügi — platformanyň ýazgynyň prewýusynda görkezýän şol kadr — iberilýär. Wideony kimiň ýükländigi görkezilmeýär. Wideo faýlyň özi hiç ýerde we hiç haçan çap edilmeýär: platformalaryň özleriniň her ýazgynyň aşagyndaky «Paýlaş» düwmesi arkaly ýaýratmagy teklip edýän salgysy ýaýradylýar.",
              "Bir salgy bir gezekden köp çap edilmeýär. Eger Siz salgynyň kanala düşmegini islemeýän bolsaňyz, bu wideony biziň hyzmatymyz arkaly ýüklemäň.",
              "Toparlardan gelen salgylar we birikdirilen hasap arkaly ýüklenen ýazgylar kanalda çap edilmeýär."
            ],
          },
          {
            heading: "Öz hasabyňyzy birikdirmek",
            body: [
              "Platformadaky öz hasabyňyzy bota birikdirmek bilen, Siz munuň Siziň hasabyňyzdygyny we ony dolandyrmaga hukugyňyzyň bardygyny tassyklaýarsyňyz.",
              "Platformalar awtomatik ýüklemeleri makullamaýar we birikdirilen hasaby çäklendirip ýa-da petikläp biler. Bu töwekgelçiligi Siz öz üstüňize alýarsyňyz; biz aýratyn, esasy däl hasaby birikdirmegi maslahat berýäris. Platformanyň Siziň hasabyňyza girizjek çäklendirmeleri üçin biz jogapkär däl.",
              "Topara birikdirilen hasap onuň ähli agzalarynyň ýüklemeleri üçin ulanylýar. Kimiň hasap birikdirip biljekdigini toparyň administratorlary çözýär we olar islendik hasaby pozup bilerler.",
            ],
          },
          {
            heading: "Jogapkärçiligiň çäklendirilmegi",
            body: [
              "Hyzmat «bolşy ýaly» şertlerinde berilýär. Biz bökdençsiz işlemegi, belli bir platformanyň elýeterliligini ýa-da faýlyň Siziň maksatlaryňyz üçin ýaramlydygyny kepillendirmeýäris.",
              "Ýüklenen materialy nähili ulanandygyňyz we Siziň üçünji şahslaryň hukuklaryny bozmagyňyzyň netijeleri üçin biz jogapkärçilik çekmeýäris.",
              "Biz mümkinçilikleriň düzümini üýtgetmäge, hyzmatyň işini tehniki hyzmat üçin togtatmaga we onuň işini bes etmäge haklydyrys.",
            ],
          },
          {
            heading: "Elýeterliligiň çäklendirilmegi",
            body: [
              "Şu şertler bozulanda, çäklendirmeleri aýlanyp geçmäge synanyşylanda, şeýle hem hukuk eýesinden esaslandyrylan şikaýat gelip gowuşanda, biz hyzmata elýeterliligi çäklendirip ýa-da bes edip bileris.",
            ],
          },
          {
            heading: "Üýtgeşmeler we ulanylýan hukuk",
            body: [
              "Biz şertleri üýtgedip bileris; hereket edýän redaksiýanyň senesi sahypanyň başynda görkezilýär. Üýtgeşmelerden soň hyzmatdan peýdalanmagy dowam etmek bilen, Siz täze redaksiýany kabul edýärsiňiz.",
              "Taraplaryň arasyndaky gatnaşyklara Gazagystan Respublikasynyň hukugy ulanylýar. Taraplar jedelleri hat alyşmak arkaly çözmäge çalyşýarlar, ylalaşyk gazanylmadyk ýagdaýynda bolsa — Gazagystan Respublikasynyň kanunçylygynda bellenen tertipde.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie syýasaty",
        summary: `${operator.site} haýsy cookie faýllaryny ulanýar, olar näme üçin gerek we olardan nädip ýüz öwürmeli.`,
        sections: [
          {
            heading: "Cookie näme",
            body: [
              "Cookie — saýtyň Siziň brauzeriňizde saklaýan kiçijik tekst faýllary. Olar Siziň sazlamalaryňyzy ýatda saklamaga we saparlaryň şahsyýetsizleşdirilen statistikasyny ýygnamaga mümkinçilik berýär.",
              "Bu resminamada cookie bilen bilelikde ýakyn tehnologiýalary hem — brauzeriň ýerli ammaryny we hasaplaýjy-pikselleri beýan edýäris.",
            ],
          },
          {
            heading: "Zerur bolanlar",
            body: [
              "Olarsyz hyzmat işlemeýär, şonuň üçin olar hemişe gurnalýar.",
            ],
            bullets: [
              "Cloudflare Turnstile — salgyny skriptiň däl-de, adamyň iberýändigini barlamak.",
              "Interfeýsiň sazlamalary — saýlanan dil we bezeg temasy.",
            ],
          },
          {
            heading: "Analitik",
            body: [
              "Olar haýsy sahypalaryň ulanylýandygyna we ýalňyşlyklaryň nirede ýüze çykýandygyna düşünmäge kömek edýär. Olar Siziň razylygyňyz bilen gurnalýar we hyzmatyň işlemegi üçin hökman däl.",
            ],
            bullets: [
              "Google Analytics we Google Tag Manager — saýta gelýänleriň sany we saýtdaky hereketler şahsyýetsizleşdirilen görnüşde.",
              "Yandex Metrica — saýta gelýänleriň sany, basyşlar kartasy we Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Yandex Metrica-nyň Webvisor guraly sahypadaky hereketleri ýazga alýar: kursoryň hereketlerini, sahypany aýlamagy, basyşlary we salgy meýdançasyna girizilýän maglumatlary. Bu interfeýsiň nirede ulanyjyny bulaşdyrýandygyny görmek üçin gerek.",
              "Biz bu ýazga alnan maglumatlary belli bir adamlary yzarlamak üçin ulanmaýarys. Saýtyň meýdançalaryna saklanmagyny islemeýän maglumatlaryňyzy girizmäň.",
            ],
          },
          {
            heading: "Nädip ýüz öwürmeli",
            bullets: [
              "Brauzeriňizde cookie faýllaryny petiklemegi ýa-da pozmagy sazlaň — bu usul sanalan ähli ulgamlar üçin işleýär.",
              "Google Analytics: ýygnamagy öçürýän resmi brauzer goşmaçasy Google-yň saýtynda elýeterli.",
              "Yandex Metrica: ýüz öwürmek Yandex-iň resmi goşmaçasy arkaly elýeterli.",
              "Zerur cookie faýllarynyň öçürilmegi ýüklemegi mümkin däl eder.",
            ],
          },
          {
            heading: "Möhletler",
            body: [
              "Sessiýa cookie faýllary brauzer ýapylanda ýa-da sessiýanyň möhleti gutaranda pozulýar. Analitik hasaplaýjylar identifikatorlary olaryň üpjün edijileri tarapyndan bellenen möhletleriň dowamynda saklaýar.",
            ],
          },
        ],
      },
      copyright: {
        title: "Hukuk eýelerine",
        summary: "Hyzmatyň awtorlyk hukuklary babatdaky garaýşy we hukuk bozulmasy barada şikaýat bermegiň tertibi.",
        sections: [
          {
            heading: "Hyzmatyň garaýşy",
            body: [
              "Hyzmat özünde wideo ýerleşdirmeýär we olaryň katalogyny alyp barmaýar. Ol tehniki araçy hökmünde çykyş edýär: ulanyjynyň girizen salgysy boýunça köpçülige açyk sahypa ýüzlenýär we faýly ulanyja berýär.",
              "Ýüklenen faýllar serwerde takmynan bir sagat saklanýar we awtomatik usulda pozulýar. Bizde başgalaryň kontentiniň hemişelik nusgasy galmaýar.",
              "Ýüklenen materialyň ulanylmagy üçin jogapkärçiligi ulanyjy çekýär — bu Ulanyjy ylalaşygynda göni berkidilen.",
            ],
          },
          {
            heading: "Eger Siziň hukuklaryňyz bozulan bolsa",
            body: [
              `Eger Siz hukuk eýesi ýa-da onuň wekili bolsaňyz we hyzmatyň Siziň hukuklaryňyzy bozmak üçin ulanylýandygyny hasaplaýan bolsaňyz, ${MAIL} salgysyna ýazyň. Biz şeýle ýüzlenmelere seredýäris we çäreler görýäris.`,
            ],
          },
          {
            heading: "Ýüzlenmede näme görkezmeli",
            bullets: [
              "Haýsy eseriň meselesi gozgalýandygy we Siziň oňa haýsy esasda hukugyňyzyň bardygy.",
              "Materialyň salgysy we, eger mälim bolsa, hukuk bozulmasynyň ýagdaýlary.",
              "Siziň habarlaşmak üçin maglumatlaryňyz: ady ýa-da atlandyrylyşy, salgysy we elektron poçta salgysy.",
              "Eger Siz hukuk eýesiniň adyndan hereket edýän bolsaňyz — ygtyýarlyklaryňyzyň tassyklamasy.",
              "Ýüzlenmedäki maglumatlaryň hakykydygy we materialyň ulanylmagyna hukuk eýesi ýa-da kanun tarapyndan rugsat berilmändigi barada beýanat.",
            ],
          },
          {
            heading: "Biz näme ederis",
            body: [
              "Biz ýüzlenmä paýhasly möhletde, adatça otuz senenama gününiň dowamynda seredýäris we hukuk bozulmasy tassyklanan ýagdaýynda hyzmat arkaly materiala elýeterliligi, zerur bolanda bolsa hukuk bozujynyň hyzmata elýeterliligini çäklendirýäris.",
              "Seredilişiň netijeleri barada Siziň görkezen elektron poçta salgyňyza habar bereris.",
            ],
          },
          {
            heading: "Ynsapsyz ýüzlenmeler",
            body: [
              "Bilkastlaýyn nädogry maglumatlary öz içine alýan ýüzlenme kanunçylyga laýyklykda arza berijiniň jogapkärçiligine getirip biler. Eger ýüzlenme hukuk eýesini-de, jedelli materialy-da anyklamaga mümkinçilik bermese, biz oňa seretmekden ýüz öwürmäge haklydyrys.",
            ],
          },
        ],
      },
    },
  },
  tt: {
    ui: {
      updated: "Редакция датасы",
      back: "Төп биткә",
      operatorHeading: "Сервис операторы",
      navHeading: "Башка документлар",
      labels: {
        privacy: "Конфиденциальлек сәясәте",
        terms: "Кулланучы килешүе",
        cookies: "Cookie сәясәте",
        copyright: "Хокук ияләренә",
      },
    },
    docs: {
      privacy: {
        title: "Конфиденциальлек сәясәте",
        summary: `${operator.site} нинди мәгълүматлар җыя, алар ни өчен кирәк, күпме вакыт саклана һәм аларны ничек бетерергә.`,
        sections: [
          {
            heading: "Гомуми нигезләмәләр",
            body: [
              `Әлеге Сәясәт ${operator.site} сервисы нинди шәхси мәгълүматларны һәм нинди максат белән эшкәртүен тасвирлый. Мәгълүматлар операторы — ${operator.nameTt}.`,
              "Сервистан файдаланып, Сез монда тасвирланган эшкәртү тәртибе белән риза буласыз. Әгәр Сез аның белән риза булмасагыз, зинһар, сервистан файдаланмагыз.",
              "Эшкәртү Казахстан Республикасының «Шәхси мәгълүматлар һәм аларны саклау турында» Законына туры китереп, ә Европа икътисади зонасыннан килүчеләргә карата GDPR таләпләрен исәпкә алып башкарыла.",
            ],
          },
          {
            heading: "Без нинди мәгълүматларны эшкәртәбез",
            body: [
              "Без сервис эше өчен кирәкле булганнан артык бернәрсә дә аңлы рәвештә җыймыйбыз һәм документлар, түләү мәгълүматлары яки адрес сорамыйбыз.",
            ],
            bullets: [
              "Сез ботка язганда ул ала торган Telegram хисап язмасы мәгълүматлары: сан идентификаторы, кулланучы исеме, исем һәм тел коды.",
              "Сез йөкләп алу өчен җибәргән сылтамалар һәм омтылышның үзе турында белешмәләр: платформа, дата һәм вакыт, сайланган сыйфат, нәтиҗә (уңыш яки хата).",
              "Тоташуның техник мәгълүматлары: IP-адрес, браузерның төре һәм версиясе, тел, күчү бите. Алар сервер журналларына һәм веб-аналитика системаларына эләгә.",
              "Cookie файллары һәм аналитика идентификаторлары — тулырак Cookie сәясәтендә.",
            ],
          },
          {
            heading: "Бу мәгълүматлар ни өчен кирәк",
            bullets: [
              "Хезмәтнең үзен күрсәтү: Сезнең сылтама буенча видеоны алу һәм Сезгә файлны бирү.",
              "Сезнең хисап язмасын башкаларныкыннан аеру һәм тиешсез файдалануга каршы тору.",
              "Сервисны автоматлаштырылган тиешсез файдаланудан саклау: сылтама җибәрү алдыннан Cloudflare Turnstile тикшерүе.",
              "Сайттан ничек файдаланылуын аңлау һәм хаталарны бетерү — шәхессезләштерелгән һәм агрегатланган статистика.",
              "Сезнең мөрәҗәгатьләргә һәм хокук ияләренең мөрәҗәгатьләренә җавап бирү.",
              "Сервис турында фикерегезне белү өчен, вакыт-вакыт Сезгә Telegram'да язу — мәсәлән, Сез аннан файдалануны туктатсагыз. Җавап бирү мәҗбүри түгел; әгәр мондый хәбәрләр Сезгә кирәкмәсә, бу хакта әйтү генә җитә, һәм без башка язмаячакбыз.",
            ],
          },
          {
            heading: "Эшкәртү нигезләре",
            body: [
              "Telegram хисап язмасы мәгълүматлары һәм йөкләп алулар турында белешмәләр Сез сервистан файдалана башлагач кабул итә торган Кулланучы килешүен үтәү өчен эшкәртелә.",
              "Аналитика cookie файллары һәм сайттагы гамәлләрне язып алу Сезнең ризалыгыгыз нигезендә эшкәртелә, аны Сез теләсә кайсы вакытта кире ала аласыз — ысуллары Cookie сәясәтендә тасвирланган.",
              "Сервер журналлары һәм ботлардан саклау сервисны эшкә яраклы һәм сакланган хәлдә тотуга безнең законлы кызыксынуыбыз кысаларында эшкәртелә.",
              "Сервис турында фикерегезне сорашу — сервисны яхшыртуга безнең законлы кызыксынуыбыз кысаларында; Сез алардан теләсә кайсы вакытта баш тарта аласыз.",
            ],
          },
          {
            heading: "Тоташтырылган аккаунтлар",
            body: [
              "Теләгегез буенча Сез ботка платформадагы үз аккаунтыгызны (Instagram, Facebook, YouTube, X, VK, TikTok) тоташтыра аласыз, бот кергән кулланучыларга гына күренгән язмаларны — сторисларны, ябык публикацияләрне йөкләп ала алсын өчен. Моның өчен бот әлеге аккаунтның кукиларын ала — Videoner киңәйтмәсеннән бер тапкырлык код буенча яки Сез җибәргән файлдан.",
              "Без сайланган платформаның гына кукиларын саклыйбыз, калганнарын шунда ук ташлыйбыз. Алар шифрланган рәвештә саклана һәм Сез аларны тоташтырган урында йөкләп алулар өчен генә кулланыла. Шәхси хәбәрләрдә тоташтырылганнары — Сезнең йөкләп алуларыгыз өчен, шул исәптән үз аккаунты тоташтырылмаган төркемнәрдәге Сезнең үз сылтамаларыгыз өчен; башкаларның сылтамалары өчен алар кулланылмый. Төркемгә тоташтырылганнары — аның әгъзаларының йөкләп алулары өчен һәм башка беркайда да түгел.",
              "Нигез — Сезнең ризалыгыгыз: Сез аккаунтны үзегез тоташтырасыз һәм аны теләсә кайсы вакытта /accounts командасы белән бетерә аласыз. Бетергәндә кукилар кайтармаслык итеп юк ителә. Әгәр платформа керүне кабул итүдән туктаса, бот Сезгә бу хакта хәбәр итә.",
              "Тоташтырылган аккаунт аша йөкләп алынган язмалар безнең каналда бастырылмый һәм гомуми кештән башка кулланучыларга бирелми.",
            ],
          },
          {
            heading: "Өченче як сервислары",
            body: [
              "Без Сезнең мәгълүматларны өченче затларга аларның үз максатлары өчен сатмыйбыз һәм тапшырмыйбыз. Сервис эше өчен түбәндәге тәэмин итүчеләр җәлеп ителгән, аларның һәрберсе мәгълүматларны үз кагыйдәләре буенча эшкәртә:",
            ],
            bullets: [
              "Telegram — " + BOT + " ботының эше.",
              "Cloudflare — ботлардан саклау (Turnstile), сайтны җиткерү һәм почта маршрутлаштыру.",
              "Google Analytics һәм Google Tag Manager — керүләр статистикасы.",
              "Яндекс.Метрика — керүләр статистикасы, басулар картасы һәм Вебвизор. Вебвизор биттәге гамәлләрне яздырып ала: күрсәткечнең күчүләрен, әйләндерүне һәм басуларны. Язмалар сайтның уңайлылыгын анализлау өчен генә кулланыла.",
            ],
          },
          {
            heading: "Без мәгълүматларны күпме саклыйбыз",
            bullets: [
              "Йөкләп алынган файллар булдырылганнан соң якынча бер сәгатьтән сервердан автоматик рәвештә бетерелә. Без Сезнең видеоларның архивын сакламыйбыз.",
              "Йөкләп алу омтылышлары турында язмалар тиешсез файдалануга каршы тору һәм мөрәҗәгатьләрне карау өчен кирәк булганчы саклана.",
              "Хисап язмасы мәгълүматлары Сез сервистан файдаланганда саклана һәм Сезнең соравыгыз буенча бетерелә.",
              "Сервер журналлары чикле вакыт саклана һәм ротация барышында яңадан языла.",
            ],
          },
          {
            heading: "Мәгълүматлар кайда эшкәртелә",
            body: [
              "Сервис серверлары Европа Берлеге территориясендәге мәгълүматлар үзәгендә урнашкан. Югарыда санап кителгән тәэмин итүчеләрнең бер өлеше мәгълүматларны үз сәясәтләренә туры китереп аның чикләреннән читтә эшкәртә ала.",
            ],
          },
          {
            heading: "Сезнең хокукларыгыз",
            body: [
              `Сез үз мәгълүматларыгызны эшкәртү турында белешмәләр алырга, аларны төзәтүне яки бетерүне таләп итәргә, ризалыгыгызны кире алырга һәм эшкәртүгә каршы чыгарга хокуклы. Моның өчен мөрәҗәгать белән бәйле булган почтадан яки Telegram аккаунтыннан ${MAIL} адресына языгыз.`,
              "Без акылга сыешлы срокта, кагыйдә буларак, утыз календарь көн эчендә җавап бирәбез. Хисап язмасын бетерү аның белән бәйле йөкләп алулар тарихын бетерүгә китерә.",
            ],
          },
          {
            heading: "Балигъ булмаганнар",
            body: [
              "Сервис 16 яшькә кадәрге балалар өчен билгеләнмәгән һәм аларга юнәлтелмәгән. Без мондый кулланучыларның мәгълүматларын аңлы рәвештә җыймыйбыз; әгәр бу ялгыш килеп чыкса, безгә языгыз, һәм мәгълүматлар бетереләчәк.",
            ],
          },
          {
            heading: "Үзгәрешләр",
            body: [
              "Без бу Сәясәтне яңартып тора алабыз. Гамәлдәге редакциянең датасы бит башында күрсәтелгән; әһәмиятле үзгәрешләрне без сервиста билгеләп барачакбыз.",
            ],
          },
        ],
      },
      terms: {
        title: "Кулланучы килешүе",
        summary: `${operator.site} куллану кагыйдәләре: нәрсә ярый, нәрсә ярамый һәм сервис нинди шартларда эшли.`,
        sections: [
          {
            heading: "Гомуми нигезләмәләр",
            body: [
              `Килешү ${operator.site} сайтыннан һәм ${BOT} Telegram-ботыннан файдалануны җайга сала. Сервисның хуҗасы һәм администраторы — ${operator.nameTt}.`,
              "Сервистан файдалана башлап, Сез шартларны укыганыгызны һәм аларны кабул итүегезне раслыйсыз. Әгәр берәр шарт Сезгә туры килмәсә, сервистан файдаланырга ярамый.",
            ],
          },
          {
            heading: "Сервис түләүсез",
            body: [
              "Сервисның барлык мөмкинлекләре түләүсез бирелә. Бездә язылулар, түләүле тарифлар, видеоның түләүле сыйфатлары һәм эчке сатып алулар юк.",
              "Без реклама күрсәтмибез һәм партнерлык сылтамалары урнаштырмыйбыз.",
            ],
          },
          {
            heading: "Керү шартлары",
            bullets: [
              "Сайтта йөкләп алу өчен хисап язмасы да, керү дә кирәкми. Бот кулланучыларны аларның Telegram аккаунты буенча аера.",
              "Сервисны артык йөкләнештән һәм автоматлаштырылган тиешсез файдаланудан сораулар ешлыгына куелган техник чикләүләр саклый.",
              "YouTube өчен тәүлеклек трафик лимиты гамәлдә: сайтта һәм киңәйтмәдә бер челтәрдән 24 сәгатькә 10 ГБ һәм ботта бер Telegram аккаунтына 24 сәгатькә 25 ГБ. Башка платформаларга ул кагылмый.",
              "Бот аша йөкләп алу өчен безнең каналга язылу таләп ителми. Файлларга язуда бот проектның яңалыклар каналына сылтама өсти; аңа язылу мәҗбүри түгел.",
            ],
          },
          {
            heading: "Сервис нәрсә эшли",
            body: [
              "Сервис техник арадашчы булып тора: Сезнең сылтама буенча ул гомуми файдаланудагы биткә мөрәҗәгать итә, медиафайлны ала һәм аны Сезгә тапшыра.",
              "Без үзебездә видеолар каталогын урнаштырмыйбыз, башкаларның контенты буенча эзләү алып бармыйбыз һәм йөкләп алынган файлларны тапшыру өчен кирәкле вакыттан — якынча бер сәгатьтән озаграк сакламыйбыз.",
              "Конкрет платформаның мөмкинлеге аның техник карарларына бәйле һәм кисәтүсез үзгәрергә мөмкин.",
            ],
          },
          {
            heading: "Кулланучының бурычлары",
            body: [
              "Алынган файлларны ничек куллануыгыз өчен Сез мөстәкыйль җавап бирәсез һәм моңа хокукыгыз барлыгын раслыйсыз.",
            ],
            bullets: [
              "Хокуклары Сезгә караган яки куллануны хокук иясе яисә закон рөхсәт иткән материалны гына йөкләп алыгыз.",
              "Сервисны автор хокукын һәм бәйле хокукларны бозу, тыелган контентны тарату һәм өченче затларның хокукларын бозу өчен кулланмагыз.",
              "Сервисның техник чикләүләрен, шул исәптән сораулар ешлыгы чикләүләрен һәм ботларга тикшерүне әйләнеп узарга тырышмагыз.",
              "Автоматлаштырылган йөкләнеш булдырмагыз: күпләп сораулар, скриптлар һәм парсерлар рөхсәт ителми.",
            ],
          },
          {
            heading: "Каналда сылтамалар бастыру",
            body: [
              "Бот аша видео йөкләп алып, Сез чыганак постка сылтаманың безнең Telegram-каналда бастырылуы белән риза буласыз. Бу хакта кисәтү ботта сыйфат сайлаганчы — ягъни Сез йөкләп алу турында карар кабул иткәнче күрсәтелә.",
              "Бастыру аноним: каналга гомуми файдаланудагы биткә сылтама, роликның исеме һәм аның тышлыгы — платформа пост превьюсында күрсәтә торган нәкъ шул кадр җибәрелә. Видеоны кем йөкләп алганы күрсәтелми. Видеофайлның үзе беркайчан да һәм беркайда да бастырылмый: платформалар үзләре дә һәр пост астындагы «Уртаклашу» төймәсе белән таратырга тәкъдим итә торган сылтама гына тарала.",
              "Бер үк сылтама бер тапкырдан артык бастырылмый. Әгәр сылтаманың каналга эләгүен теләмәсәгез, бу видеоны безнең сервис аша йөкләп алмагыз.",
              "Төркемнәрдәге сылтамалар һәм тоташтырылган аккаунт аша йөкләп алынган язмалар каналда бастырылмый."
            ],
          },
          {
            heading: "Үз аккаунтыгызны тоташтыру",
            body: [
              "Ботка платформадагы үз аккаунтыгызны тоташтырып, Сез бу Сезнең аккаунт булуын һәм Сезнең аның белән эш итәргә хокукыгыз барлыгын раслыйсыз.",
              "Платформалар автоматик йөкләп алуларны хупламый һәм тоташтырылган аккаунтны чикли яки блоклый ала. Бу куркынычны Сез үз өстегезгә аласыз; без төп булмаган, аерым аккаунтны тоташтырырга киңәш итәбез. Платформа Сезнең аккаунтка салачак чикләүләр өчен без җавап бирмибез.",
              "Төркемгә тоташтырылган аккаунт аның барлык әгъзаларының йөкләп алулары өчен кулланыла. Аккаунтларны кем тоташтыра алуын төркем администраторлары хәл итә һәм алар аларның теләсә кайсысын бетерә ала.",
            ],
          },
          {
            heading: "Җаваплылыкны чикләү",
            body: [
              "Сервис «ничек бар, шулай» шартларында бирелә. Без өзлексез эшкә, конкрет платформаның мөмкинлегенә яки файлның Сезнең максатларга яраклылыгына гарантия бирмибез.",
              "Йөкләп алынган материал белән ничек эш иткәнегез өчен һәм Сезнең өченче затларның хокукларын бозуыгыз нәтиҗәләре өчен без җаваплылык тотмыйбыз.",
              "Без мөмкинлекләр составын үзгәртергә, хезмәт күрсәтү өчен сервис эшен туктатып торырга һәм аның эшен туктатырга хокуклы.",
            ],
          },
          {
            heading: "Керүне чикләү",
            body: [
              "Әлеге шартлар бозылганда, чикләүләрне әйләнеп узарга омтылганда, шулай ук хокук иясеннән нигезле шикаять кергәндә, без сервиска керүне чикли яки туктата алабыз.",
            ],
          },
          {
            heading: "Үзгәрешләр һәм кулланыла торган хокук",
            body: [
              "Без шартларны үзгәртә алабыз; гамәлдәге редакциянең датасы бит башында күрсәтелгән. Үзгәрешләрдән соң сервистан файдалануны дәвам итеп, Сез яңа редакцияне кабул итәсез.",
              "Якларның мөнәсәбәтләренә Казахстан Республикасы хокукы кулланыла. Бәхәсләрне яклар хат алышу юлы белән җайга салырга омтыла, ә килешүгә ирешелмәгән очракта — Казахстан Республикасы законнары белән билгеләнгән тәртиптә.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie сәясәте",
        summary: `${operator.site} нинди cookie файлларын куллана, алар ни өчен кирәк һәм алардан ничек баш тартырга.`,
        sections: [
          {
            heading: "Cookie нәрсә ул",
            body: [
              "Cookie — сайт Сезнең браузерда саклый торган кечкенә текст файллары. Алар Сезнең көйләүләрегезне истә калдырырга һәм керүләрнең шәхессезләштерелгән статистикасын җыярга мөмкинлек бирә.",
              "Бу документта cookie белән бергә без якын технологияләрне дә — браузерның җирле саклагычын һәм пиксель-счетчикларны да тасвирлыйбыз.",
            ],
          },
          {
            heading: "Кирәклеләр",
            body: [
              "Алардан башка сервис эшләми, шуңа күрә алар һәрвакыт урнаштырыла.",
            ],
            bullets: [
              "Cloudflare Turnstile — сылтаманы скрипт түгел, ә кеше җибәрүен тикшерү.",
              "Интерфейс көйләүләре — сайланган тел һәм бизәлеш темасы.",
            ],
          },
          {
            heading: "Аналитик",
            body: [
              "Алар нинди битләрдән файдаланылуын һәм кайда хаталар килеп чыгуын аңларга ярдәм итә. Сезнең ризалыгыгыз белән урнаштырыла һәм сервис эше өчен мәҗбүри түгел.",
            ],
            bullets: [
              "Google Analytics һәм Google Tag Manager — шәхессезләштерелгән рәвештә керүчәнлек һәм сайттагы гамәлләр.",
              "Яндекс.Метрика — керүчәнлек, басулар картасы һәм Вебвизор.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Яндекс.Метриканың Вебвизоры биттәге гамәлләрне яздырып ала: күрсәткечнең күчүләрен, әйләндерүне, басуларны һәм сылтама кырына кертүне. Бу интерфейсның кайда буташтыруын күрер өчен кирәк.",
              "Без бу язмаларны конкрет кешеләрне күзәтү өчен кулланмыйбыз. Сайт кырларына Сез сакларга теләмәгән белешмәләрне кертмәгез.",
            ],
          },
          {
            heading: "Ничек баш тартырга",
            bullets: [
              "Браузерыгызда cookie файлларын блоклауны яки бетерүне көйләгез — бу ысул санап кителгән барлык системалар өчен дә эшли.",
              "Google Analytics: җыюны сүндерә торган рәсми браузер өстәмәсе Google сайтында бар.",
              "Яндекс.Метрика: баш тарту Яндексның рәсми өстәмәсе аша мөмкин.",
              "Кирәкле cookie файлларын сүндерү йөкләп алуны мөмкин булмаслык итәчәк.",
            ],
          },
          {
            heading: "Сроклар",
            body: [
              "Сессия cookie файллары браузер ябылганда яки сессия вакыты чыкканда бетерелә. Аналитик счетчиклар идентификаторларны аларның тәэмин итүчеләре билгеләгән срокларда саклый.",
            ],
          },
        ],
      },
      copyright: {
        title: "Хокук ияләренә",
        summary: "Сервисның автор хокукы буенча позициясе һәм хокук бозу турында шикаять бирү тәртибе.",
        sections: [
          {
            heading: "Сервисның позициясе",
            body: [
              "Сервис үзендә видеолар урнаштырмый һәм аларның каталогын алып бармый. Ул техник арадашчы булып тора: кулланучы керткән сылтама буенча гомуми файдаланудагы биткә мөрәҗәгать итә һәм кулланучыга файлны тапшыра.",
              "Йөкләп алынган файллар серверда бер сәгать чамасы саклана һәм автоматик рәвештә бетерелә. Бездә башкаларның контентының даими күчермәсе калмый.",
              "Йөкләп алынган материалны куллану өчен җаваплылыкны кулланучы тота — бу Кулланучы килешүендә турыдан-туры беркетелгән.",
            ],
          },
          {
            heading: "Әгәр Сезнең хокукларыгыз бозылса",
            body: [
              `Әгәр Сез хокук иясе яки аның вәкиле булсагыз һәм сервис Сезнең хокукларыгызны бозу өчен кулланыла дип санасагыз, ${MAIL} адресына языгыз. Без мондый мөрәҗәгатьләрне карыйбыз һәм чаралар күрәбез.`,
            ],
          },
          {
            heading: "Мөрәҗәгатьтә нәрсә күрсәтергә",
            bullets: [
              "Нинди әсәр кагылган һәм Сез аңа нинди нигездә хокуклы.",
              "Материалга сылтама һәм, билгеле булса, хокук бозу хәлләре.",
              "Сезнең элемтә мәгълүматларыгыз: исем яки атама, адрес һәм электрон почта адресы.",
              "Әгәр Сез хокук иясе исеменнән эш итсәгез — вәкаләтләрне раслау.",
              "Мөрәҗәгатьтәге белешмәләрнең дөрес булуы, ә материалны куллануның хокук иясе яки закон тарафыннан рөхсәт ителмәгәнлеге турында белдерү.",
            ],
          },
          {
            heading: "Без нәрсә эшләячәкбез",
            body: [
              "Без мөрәҗәгатьне акылга сыешлы срокта, кагыйдә буларак, утыз календарь көн эчендә карыйбыз һәм хокук бозу расланган очракта сервис аша материалга керүне, ә кирәк булганда хокук бозучының сервиска керүен дә чиклибез.",
              "Карау нәтиҗәләре турында Сез күрсәткән электрон почта адресына хәбәр итәрбез.",
            ],
          },
          {
            heading: "Намуссыз мөрәҗәгатьләр",
            body: [
              "Белә торып дөрес булмаган белешмәләр булган мөрәҗәгать законнарга туры китереп мөрәҗәгать итүченең җаваплылыгына китерергә мөмкин. Әгәр мөрәҗәгать хокук иясен дә, бәхәсле материалны да билгеләргә мөмкинлек бирмәсә, без аны караудан баш тартырга хокуклы.",
            ],
          },
        ],
      },
    },
  },
  sq: {
    ui: {
      updated: "Përditësuar më",
      back: "Në faqen kryesore",
      operatorHeading: "Operatori i shërbimit",
      navHeading: "Dokumente të tjera",
      labels: {
        privacy: "Politika e privatësisë",
        terms: "Marrëveshja e përdoruesit",
        cookies: "Politika e cookie-ve",
        copyright: "Për mbajtësit e të drejtave",
      },
    },
    docs: {
      privacy: {
        title: "Politika e privatësisë",
        summary: `Cilat të dhëna mbledh ${operator.site}, pse nevojiten, sa kohë ruhen dhe si mund t’i fshini.`,
        sections: [
          {
            heading: "Dispozita të përgjithshme",
            body: [
              `Kjo Politikë përshkruan cilat të dhëna personale përpunon shërbimi ${operator.site} dhe për çfarë qëllimi. Kontrollues i të dhënave është ${operator.nameSq}.`,
              "Duke përdorur shërbimin, ju pranoni mënyrën e përpunimit të përshkruar këtu. Nëse nuk jeni dakord me të, ju lutemi mos e përdorni shërbimin.",
              "Përpunimi kryhet në përputhje me Ligjin e Republikës së Kazakistanit “Për të dhënat personale dhe mbrojtjen e tyre”, ndërsa për vizitorët nga Zona Ekonomike Evropiane — duke marrë parasysh kërkesat e GDPR.",
            ],
          },
          {
            heading: "Cilat të dhëna përpunojmë",
            body: [
              "Ne me vetëdije nuk mbledhim asgjë përtej asaj që është e nevojshme për funksionimin e shërbimit dhe nuk kërkojmë dokumente identifikimi, të dhëna pagese apo adresë.",
            ],
            bullets: [
              "Të dhënat e llogarisë Telegram që boti merr kur i shkruani: identifikuesi numerik, emri i përdoruesit, emri dhe kodi i gjuhës.",
              "Lidhjet që dërgoni për shkarkim dhe informacioni për vetë përpjekjen: platforma, data dhe ora, cilësia e zgjedhur dhe rezultati (sukses ose gabim).",
              "Të dhënat teknike të lidhjes: adresa IP, lloji dhe versioni i shfletuesit, gjuha dhe faqja nga e cila keni ardhur. Këto ruhen në regjistrat e serverit dhe në sistemet e analitikës së uebit.",
              "Cookie-t dhe identifikuesit e analitikës — për më shumë, shihni Politikën e cookie-ve.",
            ],
          },
          {
            heading: "Pse na nevojiten këto të dhëna",
            bullets: [
              "Për të ofruar vetë shërbimin: për të marrë videon nga lidhja juaj dhe për t’ju dorëzuar skedarin.",
              "Për të dalluar llogarinë tuaj nga ajo e të tjerëve dhe për të parandaluar abuzimet.",
              "Për të mbrojtur shërbimin nga abuzimet e automatizuara: verifikimi Cloudflare Turnstile para dërgimit të lidhjes.",
              "Për të kuptuar si përdoret faqja dhe për të rregulluar gabimet — me statistika të anonimizuara dhe të agreguara.",
              "Për t’iu përgjigjur kërkesave tuaja dhe kërkesave të mbajtësve të të drejtave.",
              "Për t’ju shkruar herë pas here në Telegram për të mësuar mendimin tuaj për shërbimin — për shembull, nëse keni ndaluar së përdoruri atë. Përgjigjja nuk është e detyrueshme; nëse nuk dëshironi mesazhe të tilla, thjesht na e thoni dhe nuk do t’ju shkruajmë më.",
            ],
          },
          {
            heading: "Bazat ligjore të përpunimit",
            body: [
              "Të dhënat e llogarisë Telegram dhe informacioni për shkarkimet përpunohen për zbatimin e Marrëveshjes së përdoruesit, të cilën ju e pranoni kur filloni të përdorni shërbimin.",
              "Cookie-t e analitikës dhe regjistrimi i veprimeve në faqe përpunohen mbi bazën e pëlqimit tuaj, të cilin mund ta tërhiqni në çdo kohë — mënyrat përshkruhen në Politikën e cookie-ve.",
              "Regjistrat e serverit dhe mbrojtja nga botët përpunohen në kuadër të interesit tonë të ligjshëm për ta mbajtur shërbimin funksional dhe të sigurt.",
              "Pyetjet për mendimin tuaj mbi shërbimin bëhen në kuadër të interesit tonë të ligjshëm për ta përmirësuar shërbimin; mund të hiqni dorë prej tyre në çdo kohë.",
            ],
          },
          {
            heading: "Llogaritë e lidhura",
            body: [
              "Nëse dëshironi, mund ta lidhni me botin llogarinë tuaj në një platformë (Instagram, Facebook, YouTube, X, VK, TikTok), që boti të shkarkojë postime të dukshme vetëm për përdoruesit e identifikuar: stories, postime private. Për këtë, boti merr cookie-t e asaj llogarie — nga shtesa Videoner me një kod njëpërdorimësh ose nga një skedar që na dërgoni.",
              "Ne ruajmë vetëm cookie-t e platformës së zgjedhur dhe të tjerat i hedhim menjëherë. Ato ruhen të enkriptuara dhe përdoren vetëm për shkarkime aty ku i keni lidhur. Cookie-t e lidhura në bisedën private shërbejnë për shkarkimet tuaja, përfshirë lidhjet tuaja në grupet që nuk kanë llogari të vetën të lidhur; ato nuk përdoren kurrë për lidhjet e të tjerëve. Cookie-t e lidhura me një grup shërbejnë vetëm për shkarkimet e anëtarëve të tij dhe për asgjë tjetër.",
              "Baza ligjore është pëlqimi juaj: ju e lidhni llogarinë vetë dhe mund ta hiqni në çdo kohë me komandën /accounts. Pas heqjes, cookie-t fshihen përfundimisht. Nëse platforma nuk e pranon më hyrjen, boti ju njofton.",
              "Postimet e shkarkuara përmes një llogarie të lidhur nuk publikohen në kanalin tonë dhe nuk u jepen përdoruesve të tjerë nga memoria e përbashkët (cache).",
            ],
          },
          {
            heading: "Shërbimet e palëve të treta",
            body: [
              "Ne nuk i shesim dhe nuk ua kalojmë të dhënat tuaja palëve të treta për qëllimet e tyre. Për funksionimin e shërbimit përdoren ofruesit e mëposhtëm, secili prej të cilëve i përpunon të dhënat sipas rregullave të veta:",
            ],
            bullets: [
              `Telegram — funksionimi i botit ${BOT}.`,
              "Cloudflare — mbrojtja nga botët (Turnstile), shpërndarja e faqes dhe drejtimi i postës elektronike.",
              "Google Analytics dhe Google Tag Manager — statistikat e vizitave.",
              "Yandex Metrica — statistikat e vizitave, harta e klikimeve dhe Webvisor. Webvisor regjistron veprimet në faqe: lëvizjet e kursorit, lëvizjen nëpër faqe (scroll) dhe klikimet. Regjistrimet përdoren vetëm për të analizuar lehtësinë e përdorimit të faqes.",
            ],
          },
          {
            heading: "Sa kohë i ruajmë të dhënat",
            bullets: [
              "Skedarët e shkarkuar fshihen automatikisht nga serveri rreth një orë pas krijimit. Ne nuk mbajmë arkiv të videove tuaja.",
              "Të dhënat për përpjekjet e shkarkimit ruhen për aq kohë sa nevojitet për parandalimin e abuzimeve dhe shqyrtimin e kërkesave.",
              "Të dhënat e llogarisë ruhen për sa kohë që përdorni shërbimin dhe fshihen me kërkesën tuaj.",
              "Regjistrat e serverit ruhen për një kohë të kufizuar dhe mbishkruhen gjatë rotacionit.",
            ],
          },
          {
            heading: "Ku përpunohen të dhënat",
            body: [
              "Serverët e shërbimit ndodhen në një qendër të dhënash brenda territorit të Bashkimit Evropian. Disa nga ofruesit e listuar më sipër mund t’i përpunojnë të dhënat jashtë tij, në përputhje me politikat e tyre.",
            ],
          },
          {
            heading: "Të drejtat tuaja",
            body: [
              `Ju keni të drejtë të merrni informacion për përpunimin e të dhënave tuaja, të kërkoni korrigjimin ose fshirjen e tyre, të tërhiqni pëlqimin dhe të kundërshtoni përpunimin. Për këtë, na shkruani në ${MAIL} nga adresa e postës elektronike ose llogaria Telegram me të cilën lidhet kërkesa.`,
              "Ne përgjigjemi brenda një afati të arsyeshëm, zakonisht brenda tridhjetë ditëve kalendarike. Fshirja e llogarisë sjell edhe fshirjen e historikut të shkarkimeve që lidhet me të.",
            ],
          },
          {
            heading: "Të miturit",
            body: [
              "Shërbimi nuk është i destinuar dhe nuk u drejtohet fëmijëve nën 16 vjeç. Ne me vetëdije nuk mbledhim të dhëna të përdoruesve të tillë; nëse kjo ka ndodhur gabimisht, na shkruani dhe të dhënat do të fshihen.",
            ],
          },
          {
            heading: "Ndryshimet",
            body: [
              "Ne mund ta përditësojmë këtë Politikë. Data e versionit në fuqi tregohet në krye të faqes; ndryshimet thelbësore do t’i sinjalizojmë në shërbim.",
            ],
          },
        ],
      },
      terms: {
        title: "Marrëveshja e përdoruesit",
        summary: `Rregullat e përdorimit të ${operator.site}: çfarë lejohet, çfarë nuk lejohet dhe me cilat kushte funksionon shërbimi.`,
        sections: [
          {
            heading: "Dispozita të përgjithshme",
            body: [
              `Kjo Marrëveshje rregullon përdorimin e faqes ${operator.site} dhe të botit të Telegram-it ${BOT}. Pronar dhe administrator i shërbimit është ${operator.nameSq}.`,
              "Duke filluar të përdorni shërbimin, ju konfirmoni se i keni lexuar kushtet dhe i pranoni ato. Nëse ndonjë kusht nuk ju përshtatet, nuk duhet ta përdorni shërbimin.",
            ],
          },
          {
            heading: "Shërbimi është falas",
            body: [
              "Të gjitha mundësitë e shërbimit ofrohen falas. Nuk ka abonime, plane me pagesë, cilësi videoje me pagesë apo blerje brenda shërbimit.",
              "Ne nuk shfaqim reklama dhe nuk vendosim lidhje partnere (affiliate).",
            ],
          },
          {
            heading: "Kushtet e qasjes",
            bullets: [
              "Për të shkarkuar në faqe nuk nevojitet as llogari, as hyrje. Boti i dallon përdoruesit sipas llogarisë së tyre Telegram.",
              "Kufizimet teknike të shpeshtësisë së kërkesave e mbrojnë shërbimin nga mbingarkesa dhe abuzimet e automatizuara.",
              "Për YouTube vlen një kufi ditor trafiku: 10 GB për 24 orë për një rrjet në faqe dhe në shtesë, dhe 25 GB për 24 orë për një llogari Telegram në bot. Platformat e tjera nuk preken.",
              "Për të shkarkuar përmes botit nuk kërkohet abonimi në kanalin tonë. Në tekstin shoqërues të skedarëve boti shton një lidhje për kanalin e lajmeve të projektit; abonimi në të nuk është i detyrueshëm.",
            ],
          },
          {
            heading: "Çfarë bën shërbimi",
            body: [
              "Shërbimi vepron si ndërmjetës teknik: sipas lidhjes që jepni, ai i drejtohet një faqeje të aksesueshme publikisht, merr skedarin multimedial dhe jua kalon juve.",
              "Ne nuk mbajmë katalog videosh, nuk kryejmë kërkime në përmbajtjen e të tjerëve dhe nuk i ruajmë skedarët e shkarkuar më gjatë se koha e nevojshme për dorëzimin — rreth një orë.",
              "Disponueshmëria e një platforme të caktuar varet nga vendimet e saj teknike dhe mund të ndryshojë pa paralajmërim.",
            ],
          },
          {
            heading: "Detyrimet e përdoruesit",
            body: [
              "Ju jeni vetë përgjegjës për mënyrën se si i përdorni skedarët e marrë dhe konfirmoni se keni të drejtë ta bëni këtë.",
            ],
            bullets: [
              "Shkarkoni vetëm materiale të drejtat mbi të cilat ju përkasin juve, ose përdorimi i të cilave lejohet nga mbajtësi i të drejtave ose nga ligji.",
              "Mos e përdorni shërbimin për të shkelur të drejtat e autorit dhe të drejtat e përafërta, për të shpërndarë përmbajtje të ndaluar ose për të shkelur të drejtat e palëve të treta.",
              "Mos u përpiqni t’i anashkaloni kufizimet teknike të shërbimit, përfshirë kufizimet e shpeshtësisë së kërkesave dhe verifikimin kundër botëve.",
              "Mos krijoni ngarkesë të automatizuar: kërkesat masive, skriptet dhe parserët (scrapers) nuk lejohen.",
            ],
          },
          {
            heading: "Publikimi i lidhjeve në kanal",
            body: [
              "Duke shkarkuar një video përmes botit, ju pranoni që lidhja për postimin origjinal të publikohet në kanalin tonë në Telegram. Njoftimi për këtë shfaqet në bot para zgjedhjes së cilësisë — pra, para se të vendosni ta shkarkoni.",
              "Publikimi është anonim: në kanal dërgohen lidhja për faqen e aksesueshme publikisht, titulli i videos dhe kopertina e saj — e njëjta pamje që platforma shfaq në parapamjen e postimit. Nuk tregohet se kush e ka shkarkuar videon. Vetë skedari i videos nuk publikohet askund dhe kurrë: shpërndahet lidhja, të cilën vetë platformat ftojnë ta shpërndani përmes butonit “Ndaj” nën çdo postim.",
              "E njëjta lidhje publikohet jo më shumë se një herë. Nëse nuk dëshironi që lidhja të shfaqet në kanal, mos e shkarkoni atë video përmes shërbimit tonë.",
              "Lidhjet nga grupet dhe postimet e shkarkuara përmes një llogarie të lidhur nuk publikohen në kanal."
            ],
          },
          {
            heading: "Lidhja e llogarisë suaj",
            body: [
              "Duke lidhur me botin llogarinë tuaj në një platformë, ju konfirmoni se kjo është llogaria juaj dhe se keni të drejtë ta përdorni në këtë mënyrë.",
              "Platformat nuk i miratojnë shkarkimet e automatizuara dhe mund ta kufizojnë ose ta bllokojnë llogarinë e lidhur. Këtë rrezik e merrni përsipër ju; ju këshillojmë të lidhni një llogari të veçantë, jo atë kryesore. Ne nuk mbajmë përgjegjësi për kufizimet që platforma mund t’i vendosë llogarisë suaj.",
              "Llogaria e lidhur me një grup përdoret për shkarkimet e të gjithë anëtarëve të tij. Administratorët e grupit vendosin se kush mund të lidhë llogari dhe mund të heqin cilëndo prej tyre.",
            ],
          },
          {
            heading: "Kufizimi i përgjegjësisë",
            body: [
              "Shërbimi ofrohet “siç është”. Ne nuk garantojmë funksionim të pandërprerë, disponueshmërinë e një platforme të caktuar apo përshtatshmërinë e skedarit për qëllimet tuaja.",
              "Ne nuk mbajmë përgjegjësi për mënyrën se si e keni përdorur materialin e shkarkuar, as për pasojat e shkeljes nga ana juaj të të drejtave të palëve të treta.",
              "Ne kemi të drejtë të ndryshojmë mundësitë e shërbimit, të pezullojmë funksionimin e tij për mirëmbajtje dhe ta ndërpresim atë.",
            ],
          },
          {
            heading: "Kufizimi i qasjes",
            body: [
              "Ne mund ta kufizojmë ose ta ndërpresim qasjen në shërbim në rast shkeljeje të këtyre kushteve, përpjekjesh për të anashkaluar kufizimet, si dhe me marrjen e një ankese të bazuar nga mbajtësi i të drejtave.",
            ],
          },
          {
            heading: "Ndryshimet dhe ligji i zbatueshëm",
            body: [
              "Ne mund t’i ndryshojmë kushtet; data e versionit në fuqi tregohet në krye të faqes. Duke vazhduar të përdorni shërbimin pas ndryshimeve, ju pranoni versionin e ri.",
              "Marrëdhëniet ndërmjet palëve rregullohen nga ligji i Republikës së Kazakistanit. Palët përpiqen t’i zgjidhin mosmarrëveshjet me korrespondencë dhe, nëse nuk arrihet marrëveshje, sipas procedurës së përcaktuar nga legjislacioni i Republikës së Kazakistanit.",
            ],
          },
        ],
      },
      cookies: {
        title: "Politika e cookie-ve",
        summary: `Cilat cookie përdor ${operator.site}, pse nevojiten dhe si mund t’i refuzoni.`,
        sections: [
          {
            heading: "Çfarë janë cookie-t",
            body: [
              "Cookie-t janë skedarë të vegjël teksti që një faqe i ruan në shfletuesin tuaj. Ato bëjnë të mundur ruajtjen e cilësimeve tuaja dhe mbledhjen e statistikave të anonimizuara të vizitave.",
              "Krahas cookie-ve, në këtë dokument përshkruajmë edhe teknologjitë e ngjashme — hapësirën lokale të ruajtjes së shfletuesit dhe pikselët gjurmues.",
            ],
          },
          {
            heading: "Të domosdoshme",
            body: [
              "Pa to shërbimi nuk funksionon, prandaj vendosen gjithmonë.",
            ],
            bullets: [
              "Cloudflare Turnstile — verifikon që lidhja dërgohet nga një njeri dhe jo nga një skript.",
              "Cilësimet e ndërfaqes — gjuha dhe tema e zgjedhur e pamjes.",
            ],
          },
          {
            heading: "Analitike",
            body: [
              "Ato na ndihmojnë të kuptojmë cilat faqe përdoren dhe ku ndodhin gabime. Vendosen me pëlqimin tuaj dhe nuk janë të domosdoshme për funksionimin e shërbimit.",
            ],
            bullets: [
              "Google Analytics dhe Google Tag Manager — frekuentimi dhe sjellja në faqe në formë të anonimizuar.",
              "Yandex Metrica — frekuentimi, harta e klikimeve dhe Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor i Yandex Metrica regjistron veprimet në faqe: lëvizjet e kursorit, lëvizjen nëpër faqe (scroll), klikimet dhe shkrimin në fushën e lidhjes. Kjo na nevojitet për të parë se ku ndërfaqja i ngatërron njerëzit.",
              "Ne nuk i përdorim këto regjistrime për të gjurmuar persona konkretë. Mos vendosni në fushat e faqes informacion që nuk do të dëshironit të ruhej.",
            ],
          },
          {
            heading: "Si t’i refuzoni",
            bullets: [
              "Konfiguroni bllokimin ose fshirjen e cookie-ve në shfletuesin tuaj — kjo mënyrë funksionon për të gjitha sistemet e listuara.",
              "Google Analytics: shtesa zyrtare e shfletuesit që çaktivizon mbledhjen e të dhënave ofrohet në faqen e Google.",
              "Yandex Metrica: refuzimi është i mundur përmes shtesës zyrtare të Yandex.",
              "Çaktivizimi i cookie-ve të domosdoshme e bën shkarkimin të pamundur.",
            ],
          },
          {
            heading: "Afatet e ruajtjes",
            body: [
              "Cookie-t e sesionit fshihen kur mbyllni shfletuesin ose kur skadon sesioni. Mjetet e analitikës i ruajnë identifikuesit e tyre për afatet e përcaktuara nga ofruesit e tyre.",
            ],
          },
        ],
      },
      copyright: {
        title: "Për mbajtësit e të drejtave",
        summary: "Qëndrimi i shërbimit për të drejtat e autorit dhe procedura e paraqitjes së ankesës për shkelje.",
        sections: [
          {
            heading: "Qëndrimi i shërbimit",
            body: [
              "Shërbimi nuk ruan video tek vetja dhe nuk mban katalog të tyre. Ai vepron si ndërmjetës teknik: sipas lidhjes që ka futur përdoruesi, i drejtohet një faqeje të aksesueshme publikisht dhe i kalon përdoruesit skedarin.",
              "Skedarët e shkarkuar ruhen në server rreth një orë dhe fshihen automatikisht. Tek ne nuk mbetet asnjë kopje e përhershme e përmbajtjes së të tjerëve.",
              "Përgjegjësia për përdorimin e materialit të shkarkuar bie mbi përdoruesin — kjo parashikohet shprehimisht në Marrëveshjen e përdoruesit.",
            ],
          },
          {
            heading: "Nëse ju shkelen të drejtat",
            body: [
              `Nëse jeni mbajtës i të drejtave ose përfaqësues i tij dhe mendoni se shërbimi përdoret për të shkelur të drejtat tuaja, na shkruani në ${MAIL}. Ne i shqyrtojmë kërkesa të tilla dhe marrim masa.`,
            ],
          },
          {
            heading: "Çfarë duhet të përmbajë kërkesa",
            bullets: [
              "Cila vepër preket dhe mbi çfarë baze i keni të drejtat mbi të.",
              "Lidhjen për materialin dhe, nëse dihen, rrethanat e shkeljes.",
              "Të dhënat tuaja të kontaktit: emrin ose emërtimin, adresën dhe adresën e postës elektronike.",
              "Nëse veproni në emër të mbajtësit të të drejtave — dëshminë e autorizimit.",
              "Deklaratën se informacioni në kërkesë është i vërtetë dhe se përdorimi i materialit nuk është i lejuar nga mbajtësi i të drejtave ose nga ligji.",
            ],
          },
          {
            heading: "Çfarë do të bëjmë",
            body: [
              "Ne e shqyrtojmë kërkesën brenda një afati të arsyeshëm, zakonisht brenda tridhjetë ditëve kalendarike, dhe nëse shkelja konfirmohet, kufizojmë qasjen në material përmes shërbimit dhe, kur është e nevojshme, qasjen e shkelësit në shërbim.",
              "Për rezultatin e shqyrtimit do t’ju njoftojmë në adresën e postës elektronike që keni dhënë.",
            ],
          },
          {
            heading: "Kërkesat në keqbesim",
            body: [
              "Një kërkesë që përmban informacion qëllimisht të rremë mund të sjellë përgjegjësi për paraqitësin e saj në përputhje me legjislacionin. Ne kemi të drejtë të refuzojmë shqyrtimin e një kërkese nëse ajo nuk lejon të identifikohet as mbajtësi i të drejtave, as materiali i kontestuar.",
            ],
          },
        ],
      },
    },
  },
  bs: {
    ui: {
      updated: "Verzija od",
      back: "Na početnu stranicu",
      operatorHeading: "Operator usluge",
      navHeading: "Ostali dokumenti",
      labels: {
        privacy: "Politika privatnosti",
        terms: "Uslovi korištenja",
        cookies: "Politika kolačića",
        copyright: "Nosiocima prava",
      },
    },
    docs: {
      privacy: {
        title: "Politika privatnosti",
        summary: `Koje podatke prikuplja ${operator.site}, zašto su potrebni, koliko dugo se čuvaju i kako ih izbrisati.`,
        sections: [
          {
            heading: "Opće odredbe",
            body: [
              `Ova Politika opisuje koje lične podatke obrađuje usluga ${operator.site} i u koju svrhu. Kontrolor podataka je ${operator.nameBs}.`,
              "Korištenjem usluge pristajete na ovdje opisani način obrade. Ako se s njim ne slažete, molimo vas da ne koristite uslugu.",
              "Obrada se vrši u skladu sa Zakonom Republike Kazahstan „O ličnim podacima i njihovoj zaštiti“, a u pogledu posjetilaca iz Evropskog ekonomskog prostora — uz uvažavanje zahtjeva GDPR-a.",
            ],
          },
          {
            heading: "Koje podatke obrađujemo",
            body: [
              "Svjesno ne prikupljamo ništa izvan onoga što je neophodno za rad usluge i ne tražimo lične dokumente, podatke o plaćanju niti adresu.",
            ],
            bullets: [
              "Podaci Telegram računa koje bot dobija kada mu pišete: numerički identifikator, korisničko ime, ime i kod jezika.",
              "Linkovi koje šaljete za preuzimanje i podaci o samom pokušaju: platforma, datum i vrijeme, odabrani kvalitet, ishod (uspjeh ili greška).",
              "Tehnički podaci o konekciji: IP adresa, vrsta i verzija preglednika, jezik, stranica s koje ste došli. Oni se bilježe u serverskim zapisima (logovima) i u sistemima web-analitike.",
              "Kolačići i identifikatori analitike — više o tome u Politici kolačića.",
            ],
          },
          {
            heading: "Zašto su nam ti podaci potrebni",
            bullets: [
              "Da bismo pružili samu uslugu: preuzeli video s vašeg linka i predali vam fajl.",
              "Da bismo razlikovali vaš račun od tuđeg i suzbijali zloupotrebe.",
              "Da bismo zaštitili uslugu od automatizovanih zloupotreba: provjera Cloudflare Turnstile prije slanja linka.",
              "Da bismo razumjeli kako se stranica koristi i otklanjali greške — putem anonimizovane i zbirne statistike.",
              "Da bismo odgovarali na vaše upite i upite nosilaca prava.",
              "Da bismo vam povremeno pisali na Telegramu i pitali za vaše mišljenje o usluzi — naprimjer, ako ste je prestali koristiti. Odgovor nije obavezan; ako ne želite takve poruke, samo nam to recite i više vam nećemo pisati.",
            ],
          },
          {
            heading: "Pravni osnovi obrade",
            body: [
              "Podaci Telegram računa i podaci o preuzimanjima obrađuju se radi izvršenja Uslova korištenja, koje prihvatate kada počnete koristiti uslugu.",
              "Analitički kolačići i snimanje radnji na stranici obrađuju se na osnovu vašeg pristanka, koji možete povući u bilo kojem trenutku — načini su opisani u Politici kolačića.",
              "Serverski zapisi i zaštita od botova obrađuju se u okviru našeg legitimnog interesa da usluga ostane funkcionalna i zaštićena.",
              "Pitanja o vašem mišljenju o usluzi — u okviru našeg legitimnog interesa da unapređujemo uslugu; od njih možete odustati u bilo kojem trenutku.",
            ],
          },
          {
            heading: "Povezani računi",
            body: [
              "Po želji možete s botom povezati svoj račun na platformi (Instagram, Facebook, YouTube, X, VK, TikTok) kako bi bot preuzimao sadržaj vidljiv samo prijavljenim korisnicima: priče (stories), privatne objave. U tu svrhu bot dobija kolačiće tog računa — od proširenja Videoner putem jednokratnog koda ili iz fajla koji ste poslali.",
              "Čuvamo samo kolačiće odabrane platforme, a ostale odmah odbacujemo. Čuvaju se u šifrovanom obliku i koriste se samo za preuzimanja tamo gdje ste ih povezali. Kolačići povezani u privatnom razgovoru služe za vaša preuzimanja, uključujući vaše vlastite linkove u grupama u kojima nije povezan njihov račun; za tuđe linkove se ne koriste. Kolačići povezani s grupom služe za preuzimanja njenih članova i nigdje drugdje.",
              "Pravni osnov je vaš pristanak: račun povezujete sami i možete ga ukloniti u bilo kojem trenutku komandom /accounts. Prilikom uklanjanja kolačići se trajno brišu. Ako platforma prestane prihvatati prijavu, bot će vas o tome obavijestiti.",
              "Sadržaj preuzet putem povezanog računa ne objavljuje se na našem kanalu i ne isporučuje se drugim korisnicima iz zajedničke keš-memorije.",
            ],
          },
          {
            heading: "Usluge trećih strana",
            body: [
              "Ne prodajemo vaše podatke niti ih prenosimo trećim licima za njihove vlastite svrhe. Za rad usluge angažovani su sljedeći pružaoci usluga, od kojih svaki obrađuje podatke po vlastitim pravilima:",
            ],
            bullets: [
              `Telegram — rad bota ${BOT}.`,
              "Cloudflare — zaštita od botova (Turnstile), isporuka stranice i usmjeravanje e-pošte.",
              "Google Analytics i Google Tag Manager — statistika posjeta.",
              "Yandex Metrica — statistika posjeta, mapa klikova i Webvisor. Webvisor snima radnje na stranici: pomjeranje pokazivača, pomicanje stranice (scroll) i klikove. Snimci se koriste isključivo za analizu jednostavnosti korištenja stranice.",
            ],
          },
          {
            heading: "Koliko dugo čuvamo podatke",
            bullets: [
              "Preuzeti fajlovi automatski se brišu sa servera otprilike sat vremena nakon nastanka. Ne čuvamo arhivu vaših videozapisa.",
              "Zapisi o pokušajima preuzimanja čuvaju se onoliko dugo koliko je potrebno za suzbijanje zloupotreba i rješavanje upita.",
              "Podaci računa čuvaju se dok koristite uslugu i brišu se na vaš zahtjev.",
              "Serverski zapisi čuvaju se ograničeno vrijeme i prepisuju se u toku rotacije.",
            ],
          },
          {
            heading: "Gdje se podaci obrađuju",
            body: [
              "Serveri usluge nalaze se u data centru na teritoriji Evropske unije. Neki od gore navedenih pružalaca usluga mogu obrađivati podatke izvan nje u skladu sa svojim politikama.",
            ],
          },
          {
            heading: "Vaša prava",
            body: [
              `Imate pravo dobiti informacije o obradi vaših podataka, zahtijevati njihovu ispravku ili brisanje, povući pristanak i uložiti prigovor na obradu. U tu svrhu pišite na ${MAIL} s adrese e-pošte ili Telegram računa koji su povezani sa zahtjevom.`,
              "Odgovaramo u razumnom roku, u pravilu u roku od trideset kalendarskih dana. Brisanje računa povlači i brisanje historije preuzimanja povezane s njim.",
            ],
          },
          {
            heading: "Maloljetnici",
            body: [
              "Usluga nije namijenjena niti usmjerena djeci mlađoj od 16 godina. Svjesno ne prikupljamo podatke takvih korisnika; ako se to desilo greškom, pišite nam i podaci će biti izbrisani.",
            ],
          },
          {
            heading: "Izmjene",
            body: [
              "Ovu Politiku možemo ažurirati. Datum važeće verzije naveden je na početku stranice; o bitnim izmjenama obavještavat ćemo u okviru usluge.",
            ],
          },
        ],
      },
      terms: {
        title: "Uslovi korištenja",
        summary: `Pravila korištenja ${operator.site}: šta je dozvoljeno, šta nije i pod kojim uslovima usluga radi.`,
        sections: [
          {
            heading: "Opće odredbe",
            body: [
              `Ovi Uslovi uređuju korištenje stranice ${operator.site} i Telegram bota ${BOT}. Vlasnik i administrator usluge je ${operator.nameBs}.`,
              "Time što počinjete koristiti uslugu potvrđujete da ste pročitali uslove i da ih prihvatate. Ako vam neki od uslova ne odgovara, ne biste trebali koristiti uslugu.",
            ],
          },
          {
            heading: "Usluga je besplatna",
            body: [
              "Sve mogućnosti usluge pružaju se besplatno. Nemamo pretplate, plaćene pakete, plaćeni kvalitet videa niti kupovine unutar usluge.",
              "Ne prikazujemo reklame i ne postavljamo partnerske (affiliate) linkove.",
            ],
          },
          {
            heading: "Uslovi pristupa",
            bullets: [
              "Za preuzimanje na stranici nisu potrebni ni korisnički račun ni prijava. Bot razlikuje korisnike po njihovom Telegram računu.",
              "Uslugu od preopterećenja i automatizovanih zloupotreba štite tehnička ograničenja učestalosti zahtjeva.",
              "Za YouTube važi dnevno ograničenje saobraćaja: 10 GB u 24 sata po jednoj mreži na stranici i u proširenju te 25 GB u 24 sata po jednom Telegram računu u botu. Ostale platforme to ograničenje ne obuhvata.",
              "Za preuzimanje putem bota nije potrebna pretplata na naš kanal. U tekst uz fajlove bot dodaje link na kanal s novostima projekta; pretplata na njega nije obavezna.",
            ],
          },
          {
            heading: "Šta usluga radi",
            body: [
              "Usluga je tehnički posrednik: putem vašeg linka pristupa javno dostupnoj stranici, preuzima medijski fajl i prosljeđuje ga vama.",
              "Ne držimo katalog videozapisa, ne pretražujemo tuđi sadržaj i ne čuvamo preuzete fajlove duže od vremena potrebnog za prijenos — otprilike sat vremena.",
              "Dostupnost pojedine platforme zavisi od njenih tehničkih rješenja i može se promijeniti bez prethodne najave.",
            ],
          },
          {
            heading: "Obaveze korisnika",
            body: [
              "Sami snosite odgovornost za način na koji koristite dobijene fajlove i potvrđujete da na to imate pravo.",
            ],
            bullets: [
              "Preuzimajte samo materijal na koji imate prava ili čije je korištenje dozvoljeno od strane nosioca prava ili zakonom.",
              "Ne koristite uslugu za povredu autorskih i srodnih prava, širenje zabranjenog sadržaja niti za povredu prava trećih lica.",
              "Ne pokušavajte zaobići tehnička ograničenja usluge, uključujući ograničenja učestalosti zahtjeva i provjeru na botove.",
              "Ne stvarajte automatizovano opterećenje: masovni zahtjevi, skripte i parseri nisu dozvoljeni.",
            ],
          },
          {
            heading: "Objavljivanje linkova na kanalu",
            body: [
              "Preuzimanjem videa putem bota pristajete da link na izvornu objavu bude objavljen na našem Telegram kanalu. Upozorenje o tome prikazuje se u botu prije odabira kvaliteta — dakle prije nego što odlučite da preuzmete video.",
              "Objavljivanje je anonimno: na kanal se šalju link na javno dostupnu stranicu, naziv videa i njegova naslovna slika — isti onaj kadar koji platforma prikazuje u pregledu objave. Ko je preuzeo video, ne navodi se. Sam video fajl ne objavljuje se nigdje i nikada: dijeli se link, koji i same platforme nude da se dijeli dugmetom „Podijeli“ ispod svake objave.",
              "Isti link objavljuje se najviše jednom. Ako ne želite da link dospije na kanal, nemojte preuzimati taj video putem naše usluge.",
              "Linkovi iz grupa i sadržaj preuzet putem povezanog računa ne objavljuju se na kanalu."
            ],
          },
          {
            heading: "Povezivanje vlastitog računa",
            body: [
              "Povezivanjem svog računa na platformi s botom potvrđujete da je to vaš račun i da imate pravo njime raspolagati.",
              "Platforme ne odobravaju automatska preuzimanja i mogu ograničiti ili blokirati povezani račun. Taj rizik preuzimate na sebe; savjetujemo vam da povežete zaseban, a ne svoj glavni račun. Ne odgovaramo za ograničenja koja platforma nametne vašem računu.",
              "Račun povezan s grupom koristi se za preuzimanja svih njenih članova. Administratori grupe odlučuju ko može povezivati račune i mogu ukloniti bilo koji od njih.",
            ],
          },
          {
            heading: "Ograničenje odgovornosti",
            body: [
              "Usluga se pruža po principu „kakva jeste“. Ne garantujemo neprekidan rad, dostupnost pojedine platforme niti podobnost fajla za vaše svrhe.",
              "Ne snosimo odgovornost za to kako ste raspolagali preuzetim materijalom niti za posljedice povrede prava trećih lica s vaše strane.",
              "Zadržavamo pravo da mijenjamo skup mogućnosti, privremeno obustavimo rad usluge radi održavanja i da prekinemo njen rad.",
            ],
          },
          {
            heading: "Ograničenje pristupa",
            body: [
              "Možemo ograničiti ili ukinuti pristup usluzi u slučaju kršenja ovih uslova, pokušaja zaobilaženja ograničenja, kao i po prijemu osnovane pritužbe nosioca prava.",
            ],
          },
          {
            heading: "Izmjene i mjerodavno pravo",
            body: [
              "Uslove možemo mijenjati; datum važeće verzije naveden je na početku stranice. Nastavkom korištenja usluge nakon izmjena prihvatate novu verziju.",
              "Na odnose između strana primjenjuje se pravo Republike Kazahstan. Strane nastoje sporove riješiti prepiskom, a ako ne postignu dogovor — na način utvrđen zakonodavstvom Republike Kazahstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Politika kolačića",
        summary: `Koje kolačiće koristi ${operator.site}, zašto su potrebni i kako ih odbiti.`,
        sections: [
          {
            heading: "Šta su kolačići",
            body: [
              "Kolačići (cookies) su male tekstualne datoteke koje stranica pohranjuje u vašem pregledniku. Omogućavaju pamćenje vaših postavki i prikupljanje anonimizovane statistike posjeta.",
              "Pored kolačića, u ovom dokumentu opisujemo i srodne tehnologije — lokalnu pohranu preglednika i brojače-piksele.",
            ],
          },
          {
            heading: "Neophodni",
            body: [
              "Bez njih usluga ne radi, pa se uvijek postavljaju.",
            ],
            bullets: [
              "Cloudflare Turnstile — provjera da link šalje čovjek, a ne skripta.",
              "Postavke interfejsa — odabrani jezik i tema prikaza.",
            ],
          },
          {
            heading: "Analitički",
            body: [
              "Pomažu nam da razumijemo koje se stranice koriste i gdje nastaju greške. Postavljaju se uz vaš pristanak i nisu neophodni za rad usluge.",
            ],
            bullets: [
              "Google Analytics i Google Tag Manager — posjećenost i ponašanje na stranici u anonimizovanom obliku.",
              "Yandex Metrica — posjećenost, mapa klikova i Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Webvisor servisa Yandex Metrica snima radnje na stranici: pomjeranje pokazivača, pomicanje stranice (scroll), klikove i unos u polje za link. To nam je potrebno da vidimo gdje interfejs zbunjuje korisnike.",
              "Ove snimke ne koristimo za praćenje konkretnih osoba. Ne unosite u polja stranice podatke koje ne biste željeli da budu sačuvani.",
            ],
          },
          {
            heading: "Kako odbiti",
            bullets: [
              "Podesite blokiranje ili brisanje kolačića u svom pregledniku — ovaj način djeluje za sve navedene sisteme.",
              "Google Analytics: zvanični dodatak za preglednik koji isključuje prikupljanje podataka dostupan je na Googleovoj stranici.",
              "Yandex Metrica: odbijanje je moguće putem zvaničnog Yandexovog dodatka.",
              "Isključivanje neophodnih kolačića onemogućit će preuzimanje.",
            ],
          },
          {
            heading: "Rokovi",
            body: [
              "Sesijski kolačići brišu se kada zatvorite preglednik ili kada istekne sesija. Analitički brojači čuvaju identifikatore tokom rokova koje su utvrdili njihovi pružaoci.",
            ],
          },
        ],
      },
      copyright: {
        title: "Nosiocima prava",
        summary: "Stav usluge o autorskim pravima i postupak podnošenja pritužbe zbog povrede.",
        sections: [
          {
            heading: "Stav usluge",
            body: [
              "Usluga ne pohranjuje videozapise i ne vodi njihov katalog. Ona djeluje kao tehnički posrednik: putem linka koji je unio korisnik pristupa javno dostupnoj stranici i prosljeđuje fajl korisniku.",
              "Preuzeti fajlovi čuvaju se na serveru oko sat vremena i automatski se brišu. Kod nas ne ostaje trajna kopija tuđeg sadržaja.",
              "Odgovornost za korištenje preuzetog materijala snosi korisnik — to je izričito utvrđeno u Uslovima korištenja.",
            ],
          },
          {
            heading: "Ako su vaša prava povrijeđena",
            body: [
              `Ako ste nosilac prava ili njegov zastupnik i smatrate da se usluga koristi za povredu vaših prava, pišite na ${MAIL}. Takve pritužbe razmatramo i preduzimamo mjere.`,
            ],
          },
          {
            heading: "Šta navesti u pritužbi",
            bullets: [
              "Koje je djelo pogođeno i na osnovu čega imate prava na njega.",
              "Link na materijal i, ako su poznate, okolnosti povrede.",
              "Vaše kontakt podatke: ime ili naziv, adresu i adresu e-pošte.",
              "Ako djelujete u ime nosioca prava — dokaz o ovlaštenju.",
              "Izjavu da su podaci u pritužbi tačni i da korištenje materijala nije dozvoljeno od strane nosioca prava niti zakonom.",
            ],
          },
          {
            heading: "Šta ćemo preduzeti",
            body: [
              "Pritužbu razmatramo u razumnom roku, u pravilu u roku od trideset kalendarskih dana, i ako se povreda potvrdi, ograničavamo pristup materijalu putem usluge, a po potrebi i pristup prekršioca usluzi.",
              "O ishodu razmatranja obavijestit ćemo vas na adresu e-pošte koju ste naveli.",
            ],
          },
          {
            heading: "Nesavjesne pritužbe",
            body: [
              "Pritužba koja sadrži svjesno netačne podatke može povući odgovornost podnosioca u skladu sa zakonodavstvom. Zadržavamo pravo da odbijemo razmatranje pritužbe ako se na osnovu nje ne može utvrditi ni nosilac prava ni sporni materijal.",
            ],
          },
        ],
      },
    },
  },
  ce: {
    ui: {
      updated: "Редакцин терахь",
      back: "Коьрта агӀоне",
      operatorHeading: "Сервисан оператор",
      navHeading: "Кхин документаш",
      labels: {
        privacy: "Конфиденциальностан политика",
        terms: "Пайдаэцархочун барт",
        cookies: "Cookie политика",
        copyright: "Бакъонан дайшна",
      },
    },
    docs: {
      privacy: {
        title: "Конфиденциальностан политика",
        summary: `${operator.site} муьлха хаамаш гулбо, уьш стенна оьшу, мел хенна Ӏалашбо а, уьш муха дӀабаха мега а.`,
        sections: [
          {
            heading: "Йукъара дебарш",
            body: [
              `ХӀокху Политико гойту ${operator.site} сервиса муьлха персональни хаамаш (персональные данные) кечбо а, муьлха Ӏалашонца кечбо а. Хаамийн оператор — ${operator.nameCe}.`,
              "Сервисах пайда оьцуш, Шу кхузахь дийцинчу кечдаран кепаца реза хуьлу. Шу цуьнца реза дацахь, дехар ду, сервисах пайда ма эцалаш.",
              "Хаамаш кечбар Казахстан Республикин «Персональни хаамех а, уьш ларбарх а лаьцна» Законца (Закон Республики Казахстан «О персональных данных и их защите») догӀуш дӀадоьду, Европин экономикин зонера сайте хьовсархошна дуьхьал — GDPR-н тӀедахкарш а тидаме лоцуш.",
            ],
          },
          {
            heading: "Оха муьлха хаамаш кечбо",
            body: [
              "Сервисан болх бан оьшучул сов хӀумма а оха хууш гулдеш дац, документаш, ахча дӀаларан хаамаш я адрес а ца йоьху оха.",
            ],
            bullets: [
              "Шу ботна йаздечу хенахь цо схьаоьцу Telegram аккаунтан хаамаш: терахьийн идентификатор, пайдаэцархочун цӀе, цӀе а, меттан код а.",
              "Чуяккха Шу дахьийтина хьажоргаш а, гӀоертарх лаьцна хаамаш а: платформа, терахь а, хан а, харжина дикалла, жамӀ (кхиам я гӀалат).",
              "ЗӀенан (соединение) технически хаамаш: IP-адрес, браузеран тайпа а, верси а, мотт, хьалхарчу агӀонан адрес (страница перехода). Уьш серверан журналашка а, веб-аналитикин системашка а кхочу.",
              "Cookie-файлаш а, аналитикин идентификаторш а — кхин а дуккха Cookie политикехь.",
            ],
          },
          {
            heading: "Хаамаш стенна оьшу",
            bullets: [
              "Сервис йалар: Шун хьажоргца видео схьаэцар а, файл Шуьга дӀайалар а.",
              "Шун аккаунт кхечеран аккаунтах къастор а, зуламе пайдаэцарна (злоупотребления) дуьхьал латтар а.",
              "Автоматически зуламе пайдаэцарх сервис ларйар: хьажорг дахьийтале Cloudflare Turnstile таллам.",
              "Сайтах муха пайда оьцу кхетар а, гӀалаташ нисдар а — цӀераш йоцу (обезличенная), цхьаьнатоьхна статистика.",
              "Шун а, бакъонан дайн а дехаршна жоп далар.",
              "Цкъа-цкъа Telegram-ехь Шуьга йаздар, сервисах лаьцна Шун ойла хаа — масала, Шу цунах пайда эцар сецча. Жоп дала дезаш дац; иштта хаамаш Шуна ца оьшуш хилча, цунах лаьцна алийша, тӀаккха оха кхин йаздийр дац.",
            ],
          },
          {
            heading: "Кечдаран бухаш",
            body: [
              "Telegram аккаунтан хаамаш а, чуяккхарх лаьцна хаамаш а кечбо Пайдаэцархочун барт кхочушбан, иза Шу сервисах пайда эца долийча тӀеоьцу.",
              "Аналитикин cookie-файлаш а, сайтехь дечу гӀуллакхийн йаздар а кечдо Шун резахиларан бух тӀехь, иза Шуна муьлххачу хенахь юхаэца мега — некъаш Cookie политикехь дийцина ду.",
              "Серверан журналаш а, ботех ларвалар а кечдо сервис болх беш а, ларйина а латто тхан болчу законан интересан (законный интерес) гурашкахь.",
              "Сервисах лаьцна Шун ойланах хаттарш — сервис тойан тхан болчу законан интересан гурашкахь; Шу муьлххачу хенахь царах дӀадала мега.",
            ],
          },
          {
            heading: "ТӀетесна аккаунташ",
            body: [
              "Шайна лаахь, Шайн платформан аккаунт (Instagram, Facebook, YouTube, X, VK, TikTok) ботна тӀетаса мега, чувеанчарна бен ца гуш йолу посташ бото чуйаха: сторис, дӀакъевлина публикацеш. Цунна бото схьаоьцу оцу аккаунтан куки — Videoner расширених цкъа бен ца лелочу кодаца я Шу дахьийтинчу файлах.",
              "Оха харжинчу платформан куки бен Ӏалаш ца до, вуьйш сихха дӀатосу. Уьш шифровка йина Ӏалашдо, тӀетесначу меттехь чуяккхарна бен лелош дац. Ботаца долчу шен чатехь (личка) тӀетесна куки — Шун чуяккхарна, шайн аккаунт тӀетесна йоцчу тобанашкахь Шаьш дахьийтина хьажоргаш а йукъа лоцуш; кхечара дахьийтинчу хьажоргашна уьш лелош дац. Тобане тӀетесна куки — цуьнан декъашхойн чуяккхарна, кхечахь цхьанхьа а дац.",
              "Бух — Шун резахилар: аккаунт Шаьш тӀетосу, иза муьлххачу хенахь /accounts командица дӀайаккха а мега. ДӀайаьккхича куки юхаметтахӀотто йиш йоцуш дӀадоху. Платформано чувалар тӀеэцар сацийча, бото цунах лаьцна хаам бо Шуна.",
              "ТӀетесначу аккаунтца чуйаьхна посташ тхан каналехь зорбане ца йоху, йукъара кешера (кеш) кхечу пайдаэцархошна дӀа а ца ло.",
            ],
          },
          {
            heading: "Арахьара сервисаш",
            body: [
              "Оха Шун хаамаш ца бохку, кхечу нахана шайн Ӏалашонашна дӀа а ца ло. Сервисо болх барехь хӀара поставщикаш дакъалоцуш бу, церах хӀораммо шен бакъонашца хаамаш кечбо:",
            ],
            bullets: [
              "Telegram — " + BOT + " ботан болх.",
              "Cloudflare — ботех ларвалар (Turnstile), сайт дӀакхачор а, поштан маршрутизаци а.",
              "Google Analytics а, Google Tag Manager а — сайте хьовсаран статистика.",
              "Яндекс.Метрика — сайте хьовсаран статистика, кликийн карта а, Вебвизор а. Вебвизоро агӀонехь дечу гӀуллакхийн йаздар до: курсор дӀасахьахьор, прокрутка, кликаш. Йаздарш сайтах пайда эца атта дуй талла бен ца леладо.",
            ],
          },
          {
            heading: "Хаамаш мел хенна Ӏалашбо",
            bullets: [
              "Чуйаьхна файлаш, уьш кхоьллина цхьа сахьт гергга даьлча, серверах автоматически дӀадоху. Шун видеойн архив оха Ӏалаш ца йо.",
              "Чуяккха гӀоертарх лаьцна йаздарш Ӏалашдо, зуламе пайдаэцарна дуьхьал латта а, дехарш талла а оьшучул.",
              "Аккаунтан хаамаш Ӏалашбо Шу сервисах пайда оьцучу хенахь, Шун дехарца дӀабоху.",
              "Серверан журналаш доза долчу хенахь Ӏалашдо, ротаци хуьлуш шайна тӀехула керла йаздо.",
            ],
          },
          {
            heading: "Хаамаш мичахь кечбо",
            body: [
              "Сервисан серверш Европин Союзан латта тӀехь йолчу дата-центрехь ду. Лакхахь дӀагайтинчу поставщикийн цхьаболчара хаамаш цуьнан дозанал арахь а кечбан мега шайн политикашца догӀуш.",
            ],
          },
          {
            heading: "Шун бакъонаш",
            body: [
              `Шун бакъо йу Шун хаамаш кечбарх лаьцна хаамаш схьаэца, уьш нисбар я дӀабахар тӀедожо, резахилар юхаэца, кечдарна дуьхьало йан. Цунна, дехарца доьзна йолчу поштера я Telegram аккаунтера ${MAIL} адресе йаздийша.`,
              "Оха маьӀна долчу хенахь (разумный срок) жоп ло, дукха хьолахь — ткъе итт календарни дийнахь. Аккаунт дӀайаккхича, цуьнца йоьзна чуяккхаран истори а дӀайоккху.",
            ],
          },
          {
            heading: "Кхиазхой",
            body: [
              "Сервис 16 шо кхачаза берашна лерина йац, царна тӀехьажийна а йац. Иштта пайдаэцархойн хаамаш оха хууш гулбеш бац; гӀалатонца иза хилла хилча, тхуна йаздийша, тӀаккха хаамаш дӀабоккхур бу.",
            ],
          },
          {
            heading: "Хийцамаш",
            body: [
              "ХӀара Политика оха керлайаккха мега. Карарчу редакцин терахь агӀонан йуьххьехь ду; мехала хийцамаш оха сервисехь билгалбоккхур бу.",
            ],
          },
        ],
      },
      terms: {
        title: "Пайдаэцархочун барт",
        summary: `${operator.site} пайдаэцаран низам: хӀун мега, хӀун ца мега, сервисо муьлхачу билламашца болх бо.`,
        sections: [
          {
            heading: "Йукъара дебарш",
            body: [
              `Барто ${operator.site} сайтах а, ${BOT} Telegram-ботах а пайдаэцар нисдо. Сервисан да а, администратор а — ${operator.nameCe}.`,
              "Сервисах пайда эца долош, Шу тӀечӀагӀдо билламаш Шаьш дешна а, тӀеэцна а хилар. Цхьа биллам Шуна ца богӀуш белахь, сервисах пайда эца ца оьшу.",
            ],
          },
          {
            heading: "Сервис мехза йу",
            body: [
              "Сервисан массо а таронаш мехза ло. Тхан подпискаш, мах болу тарифаш, видеон мах болу дикаллаш, чоьхьара эцарш (внутренние покупки) дац.",
              "Оха реклама ца гойту, партнёрийн хьажоргаш а ца йуьллу.",
            ],
          },
          {
            heading: "ТӀекхачаран билламаш",
            bullets: [
              "Сайтехь чуяккха аккаунт а, чувалар а ца оьшу. Бото пайдаэцархой къастабо церан Telegram аккаунтехула.",
              "Сервис дозалла тӀехдаларх а, автоматически зуламе пайдаэцарх а ларйо дехарийн сихаллина техникин дозанаша.",
              "YouTube-на дийнахь-буьйсанна трафикан лимит ду: сайтехь а, расширенехь а цхьана сетера (сеть) 24 сахьтехь 10 ГБ, ботехь цхьана Telegram аккаунтана 24 сахьтехь 25 ГБ. Кхечу платформашна иза хьакхалуш дац.",
              "Ботехула чуяккха тхан каналан подписка ца оьшу. Файлашна тӀейазйечу текстехь бото проектан керла хаамийн каналан хьажорг тӀетуху; цунна подписка йан декхар дац.",
            ],
          },
          {
            heading: "Сервисо хӀун до",
            body: [
              "Сервис техникин йуккъерниг (посредник) йу: Шун хьажоргца иза массарна а тӀекхочуш йолчу агӀоне йолу, медиафайл схьаоьцу, Шуьга дӀайало.",
              "Оха тхайгахь видеон каталог ца латтайо, кхечеран контентехула лахар ца до, чуйаьхна файлаш дӀакхачо оьшучул сов Ӏалаш ца до — цхьа сахьт гергга.",
              "Цхьа платформа тӀекхачаме хилар цуьнан техникин сацамех доьзна ду, хьалххе хаам ца беш хийцалур ду.",
            ],
          },
          {
            heading: "Пайдаэцархочун декхарш",
            body: [
              "Схьаэцначу файлех Шу муха пайда оьцу, цунна Шаьш жоп ло, цунна Шун бакъо хилар а тӀечӀагӀдо.",
            ],
            bullets: [
              "Чуяккха Шайна бакъонаш йолу я бакъонан дас я законо пайдаэца пурба делла материал бен.",
              "Сервисах пайда ма эцалаш авторан а, цуьнца йоьзна (смежные) бакъонаш йохо, дихкина контент даржо, кхечу нехан бакъонаш йохо.",
              "Сервисан техникин дозанаш гонах довла ма гӀертийша, дехарийн сихаллин дозанаш а, ботех таллар а йукъа лоцуш.",
              "Автоматически дозалла ма кхолийша: дукха дехарш (массовые запросы), скрипташ а, парсераш а пурба дац.",
            ],
          },
          {
            heading: "Каналехь хьажоргаш зорбане йахар",
            body: [
              "Ботехула видео чуйоккхуш, Шу реза ду хьалхарчу постан хьажорг тхан Telegram-каналехь зорбане йаккхарна. Цунах лаьцна дӀахьедар ботехь гойту дикалла харжале — кхин аьлча, чуяккха сацам Шаьш бале.",
              "Зорбане йаккхар анонимни ду: канале кхочу массарна а тӀекхочуш йолчу агӀонан хьажорг, роликан цӀе а, цуьнан мужалт (обложка) а — платформано постан превьюхь гойту и кадр. Видео мила чуйаьккхина билгалдоккхуш дац. Видеофайл ша цхьанхьа а цкъа а зорбане ца йоккху: даржош йерг хьажорг йу, платформаша шаьш а хӀора постана кӀел «Поделиться» кнопкаца даржо хьоьхуш йолу.",
              "Цхьа хьажорг цкъа сов зорбане ца йоккху. Хьажорг каналан ца кхача Шуна лаахь, и видео тхан сервисехула чу ма йаккхалаш.",
              "Тобанашкара хьажоргаш а, тӀетесначу аккаунтца чуйаьхна посташ а каналехь зорбане ца йоху.",
            ],
          },
          {
            heading: "Шайн аккаунт тӀетасар",
            body: [
              "Шайн платформан аккаунт ботна тӀетосуш, Шу тӀечӀагӀдо иза Шун аккаунт хилар а, цуьнан урхалла дан Шун бакъо хилар а.",
              "Платформаша автоматически чуяккхар магош дац, тӀетесна аккаунт доза дахка я блокировка йан тарло. И кхерам Шаьш тӀелоцу; оха хьехам бо къаьсттина, коьрта йоцу аккаунт тӀетаса. Платформано Шун аккаунтана тӀедиллинчу дозанашна оха жоп ца ло.",
              "Тобане тӀетесна аккаунт цуьнан массо а декъашхойн чуяккхарна лелайо. Тобанан администраторша къастадо аккаунташ мила тӀетаса мега, царах муьлхха а дӀайаккха а мега царна.",
            ],
          },
          {
            heading: "Жоьпаллин доза",
            body: [
              "Сервис «муха йу, иштта» (как есть) билламашца ло. Оха гаранти ца ло сервисо сацам боцуш болх барна, цхьа платформа тӀекхачаме хиларна я файл Шун Ӏалашонашна йогӀуш хиларна.",
              "Чуйаьккхинчу материалах Шу муха пайда эцна цунна а, Шу кхечу нехан бакъонаш йохорна тӀехьа даьхначу тӀаьхьалонашна а оха жоп ца ло.",
              "Таронийн хӀоттам хийца, Ӏалашдарна (обслуживание) сервисан болх саца, цуьнан болх чекхбаккха а тхан бакъо йу.",
            ],
          },
          {
            heading: "ТӀекхачаран доза",
            body: [
              "ХӀокху билламаш бохийча, дозанаш гонах довла гӀоьртича, иштта бакъонан дера бух болу латкъам (обоснованная жалоба) кхаьчча, оха сервисе тӀекхачар доза дахка я сацо мега.",
            ],
          },
          {
            heading: "Хийцамаш а, лелочу бакъо а",
            body: [
              "Оха билламаш хийца мега; карарчу редакцин терахь агӀонан йуьххьехь ду. Хийцамаш хилчахьана сервисах пайда эцар Шаьш дӀа а дахча, Шу керла редакци тӀеоьцу.",
              "АгӀонийн йукъаметтигашна Казахстан Республикин бакъо лелайо. Къовсамаш агӀонаш кехаташ йаздарца нисбан гӀерта, барт ца хилча — Казахстан Республикин законаша билгалйинчу кепаца.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie политика",
        summary: `${operator.site} муьлха cookie-файлаш лелайо, уьш стенна оьшу, царах муха дӀадала мега.`,
        sections: [
          {
            heading: "Cookie — хӀун ду",
            body: [
              "Cookie — сайто Шун браузерехь Ӏалашдо жима текстан файлаш ду. Цара Шун нисдарш дагахь латто а, цӀераш йоцу хьовсаран статистика гулйан а таро ло.",
              "Cookie-ца цхьаьна хӀокху документехь оха гергара технологеш а йуьйцу — браузеран локальни Ӏалашдарг (локальное хранилище) а, пиксел-счётчикаш а.",
            ],
          },
          {
            heading: "Оьшуш долу",
            body: [
              "Уьш доцуш сервисо болх ца бо, цундела уьш даим а дуьллу.",
            ],
            bullets: [
              "Cloudflare Turnstile — хьажорг скрипто доцуш, адамо дахьийтина хилар таллар.",
              "Интерфейсан нисдарш — харжина мотт а, кечдаран тема а.",
            ],
          },
          {
            heading: "Аналитикин",
            body: [
              "Цара гӀо до муьлхачу агӀонех пайда оьцу а, гӀалаташ мичахь хуьлу а кхета. Уьш Шун резахиларца дуьллу, сервисан болхна оьшуш дац.",
            ],
            bullets: [
              "Google Analytics а, Google Tag Manager а — сайте хьовсархойн дукхалла а, сайтехь лелар а цӀераш йоцуш.",
              "Яндекс.Метрика — сайте хьовсархойн дукхалла, кликийн карта а, Вебвизор а.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Яндекс.Метрикин Вебвизоро агӀонехь дечу гӀуллакхийн йаздар до: курсор дӀасахьахьор, прокрутка, кликаш, хьажорган меттиге йаздар. Интерфейс мичахь тило до гуш хилийта оьшу иза.",
              "Оха и йаздарш билгалчу нехан тӀаьхьа хьовса лелош дац. Ӏалашдан ца лууш болу хаамаш сайтан меттигашка ма йаздийша.",
            ],
          },
          {
            heading: "Муха дӀадала",
            bullets: [
              "Шайн браузерехь cookie блокировка йан я дӀадаха нисдийша — и некъ лакхахь дийцинчу массо а системашна болх беш бу.",
              "Google Analytics: гулдар дӀадоккху браузеран официальни тӀетохар (дополнение) Google-ан сайтехь ду.",
              "Яндекс.Метрика: дӀадалар Яндексан официальни тӀетохарца таро йу.",
              "Оьшуш долу cookie дӀадахча, чуяккха йиш хир йац.",
            ],
          },
          {
            heading: "Ханаш",
            body: [
              "Сессин cookie браузер дӀакъевлича я сессин хан чекхйаьлча дӀадовлу. Аналитикин счётчикаша идентификаторш Ӏалашдо церан поставщикаша билгалйинчу ханна.",
            ],
          },
        ],
      },
      copyright: {
        title: "Бакъонан дайшна",
        summary: "Авторан бакъонашна сервисан позици а, бохорна латкъам беран кеп а.",
        sections: [
          {
            heading: "Сервисан позици",
            body: [
              "Сервисо шегахь видео ца йуьллу, церан каталог а ца лелайо. Иза техникин йуккъерниг йу: пайдаэцархочо йазйинчу хьажоргца массарна а тӀекхочуш йолчу агӀоне йолу, файл пайдаэцархочуьнга дӀайало.",
              "Чуйаьхна файлаш серверехь сахьт гергга Ӏалашдо, автоматически дӀадоху. Кхечеран контентан даиман йолу копи тхоьгахь ца йуьсу.",
              "Чуйаьккхинчу материалах пайдаэцарна жоп пайдаэцархочо ло — иза Пайдаэцархочун бартехь нийсса чӀагӀдина ду.",
            ],
          },
          {
            heading: "Шун бакъонаш йохийнехь",
            body: [
              `Шу бакъонан да я цуьнан векал а делахь, Шун бакъонаш йохо сервисах пайда оьцу аьлла хеташ делахь, ${MAIL} адресе йаздийша. Оха иштта дехарш толлу а, гӀуллакх до а.`,
            ],
          },
          {
            heading: "Дехарехь хӀун билгалдаккха деза",
            bullets: [
              "Муьлха произведени хьакхалуш ду а, цунна бакъонаш Шун муьлхачу бух тӀехь йу а.",
              "Материалан хьажорг а, хууш делахь, бохаран хьелаш а.",
              "Шун контактни хаамаш: цӀе я цӀерзахӀоттам (наименование), адрес а, электронни поштан адрес а.",
              "Шу бакъонан ден цӀарах лелаш делахь — Шун полномочеш (полномочия) тӀечӀагӀдар.",
              "Дехарехь болу хаамаш бакъ хилар а, материалах пайдаэца бакъонан дас я законо пурба ца делла хилар а лаьцна дӀахьедар.",
            ],
          },
          {
            heading: "Оха хӀун дийр ду",
            body: [
              "Оха дехар маьӀна долчу хенахь толлу, дукха хьолахь — ткъе итт календарни дийнахь, бохар тӀечӀагӀделча сервисехула материале тӀекхачар доза до, оьшуш хилча — бохархочун сервисе тӀекхачар а.",
              "Таллам жамӀах лаьцна Шуна Шаьш билгалйинчу электронни поштан адресе хаам бийр бу оха.",
            ],
          },
          {
            heading: "Тешаме доцу дехарш",
            body: [
              "Хууш харц хаамаш болчу дехаро законашца догӀуш дехар динчун жоьпалла тӀехьадаккха тарло. Дехаро бакъонан да а, къовсаме материал а билгалдаккха таро ца лахь, иза талла дуьхьало йан бакъо йу тхан.",
            ],
          },
        ],
      },
    },
  },
  inh: {
    ui: {
      updated: "Редакци терахь",
      back: "Кертера оагӀона",
      operatorHeading: "Сервиса оператор",
      navHeading: "Кхыдола документаш",
      labels: {
        privacy: "Конфиденциальностан политика",
        terms: "Пайдаэцархочун барт",
        cookies: "Cookie политика",
        copyright: "Бокъон дайшта",
      },
    },
    docs: {
      privacy: {
        title: "Конфиденциальностан политика",
        summary: `${operator.site} малагӀа хоамаш гулбу, уж фуна эш, мел ханна Ӏалашбу, уж мишта дӀабаккха мегаш да.`,
        sections: [
          {
            heading: "Юкъара положенеш",
            body: [
              `Укх Политике чу дийцад ${operator.site} сервисо малагӀа персональни хоамашца (персональные данные) болх бу (обработка) а, из фу Ӏалашонца бу а. Хоамий оператор — ${operator.nameInh}.`,
              "Сервисах пайда эцаш, Шо кхаьза дийцача хоамашца болх бара кепаца реза хул. Шо цунца реза дацахь, дехар да, сервисах пайда ма эцал.",
              "Хоамашца болх Казахстан Республикан «Персональни хоамаш а, уж лорабар а лаьца» Законаца (Закон Республики Казахстан «О персональных данных и их защите») догӀаш бу, Европейски экономически зонера хьежархошта — GDPR тӀадиллараш а тидаме лаьца.",
            ],
          },
          {
            heading: "Тхо малагӀа хоамашца болх бу",
            body: [
              "Сервиса болх бе эшачул совгӀа хӀама а тхо хоаш гулде ца ду; документаш, ахча дӀадалара хоамаш (платёжные данные) е адрес тхо дийха ца ду.",
            ],
            bullets: [
              "Шо ботага яздеча хана цо хьаэц Telegram аккаунта хоамаш: терахьий идентификатор, пайдаэцархочун цӀи, цӀи а меттан код а.",
              "Шо чуяккха дахийта ссылкаш, чуяккха гӀоертарах лаьца хоамаш а: платформа, терахь а ха а, хьаржа качество, жамӀ (дика хилар е гӀалат).",
              "ЗӀенан (соединение) технически хоамаш: IP-адрес, браузера тайпа а верси а, мотт, хьалхарча оагӀон адрес (страница перехода). Уж сервера журналашка а веб-аналитика системашка а кхоач.",
              "Cookie-файлаш а аналитика идентификатораш а — дукхагӀа Cookie политике чу.",
            ],
          },
          {
            heading: "Фуна эш ер хоамаш",
            bullets: [
              "Услуга ше яла: Шун ссылкаца видео хьаэца, файл Шоана дӀаяла.",
              "Шун аккаунт кхычарех къаьстае а, зулам долча кепара пайда эцара (злоупотребления) духьал латта а.",
              "Автоматически злоупотреблениех сервис лорае: ссылка дахийтале Cloudflare Turnstile тохкам.",
              "Сайтах мишта пайда эц кхета а, гӀалаташ нийсде а — цӀераш йоаца (обезличенная), цхьаьнатоха (агрегированная) статистика.",
              "Шун дехарашта а бокъон дай дехарашта а жоп дала.",
              "ХӀанз-хӀанз Telegram-чу Шоана яздаь, сервисах лаьца Шун хетар довза — масала, Шо цох пайда эца сацадаьлча. Жоп дала дезаш дац; иштта хоамаш Шоана эшаш дацахь, цох лаьца алал, тӀаккха тхо кхы Шоана яздергдац.",
            ],
          },
          {
            heading: "Хоамашца болх бара бухаш (основания)",
            body: [
              "Telegram аккаунта хоамашца а чуяккхарах лаьца хоамашца а болх бу Пайдаэцархочун барт кхоачашбе (исполнение); из Шо сервисах пайда эца доладеча тӀаэц.",
              "Аналитика cookie-файлашца а сайта тӀа деш дола гӀулакхаш яздарца а болх бу Шун резахилара бух тӀа; из Шоана малагӀча хана а юха эца йиш я — некъаш Cookie политике чу дийцад.",
              "Сервера журналашца а боташта духьал лорадарца а болх бу сервис болх беш а лораяь а латтае тха законни интерес (законный интерес) бахьан долаш.",
              "Сервисах лаьца Шун хетар хаттар — сервис тоае тха законни интерес бахьан долаш; Шоана малагӀча хана а царех дӀакъаста йиш я.",
            ],
          },
          {
            heading: "ТӀатеха аккаунташ",
            body: [
              "Шоана лаьахь, шоай платформа тӀа (Instagram, Facebook, YouTube, X, VK, TikTok) йола аккаунт ботага тӀатоха мегаш да, чувеннача наха мара гуш йоаца посташ бото чуяккха таро хургйолаш: сторис, дӀакъовла публикацеш. Цунна бото хьаэц цу аккаунта куки — Videoner расширенера цхьаккхазза мара лелаеш доаца кодаца е Шо дахийта файлах.",
              "Тхо хьаржача платформа куки мара Ӏалаш ца ду, кхыдараш сихха дӀакхоссу. Уж шифровка яь Ӏалашду, Шо уж тӀатеха метте чуяккхара мара лелаеш дац. Ботаца Шун чата (личка) тӀатеха куки — Шун чуяккхарашта, шоай аккаунт тӀатоха йоаца тоабашка Шо шоаш дахийта ссылкаш а юкъе лаьца; кхычар дахийта ссылкашта уж лелаеш дац. Тоабага тӀатеха куки — цун декъашхой чуяккхарашта, кхы цхьаннахьа а дац.",
              "Бух — Шун резахилар: аккаунт Шо шоаш тӀатох, из малагӀча хана а /accounts командаца дӀаяккха а мегаш да. ДӀаяьккхача куки юха метте отталургйоацаш дӀадаккх. Платформас чувалар тӀаэцар сацадича, бото цох лаьца Шоана хоам бу.",
              "ТӀатеха аккаунтаца чуяьха посташ тха канале зорбаяхаш яц, юкъара кеш чура кхыча пайдаэцархошта дӀалуш а яц.",
            ],
          },
          {
            heading: "Арахьара сервисаш",
            body: [
              "Тхо Шун хоамаш ца дохку, кхоалагӀча сагашта (третьим лицам) шоай Ӏалашонашта дӀа а ца лу. Сервиса болх бара укх поставщикаш дакъа лоац, уж хӀара шоай низамашца хоамашца болх беш ба:",
            ],
            bullets: [
              "Telegram — " + BOT + " бота болх.",
              "Cloudflare — боташта духьал лорадар (Turnstile), сайт дӀакхачадар а поштан маршрутизаци а.",
              "Google Analytics а Google Tag Manager а — сайта хьежарий статистика.",
              "Яндекс.Метрика — хьежарий статистика, кликий карта а Вебвизор а. Вебвизорас оагӀон тӀа деш дола гӀулакхаш яздеш да: курсор (указатель) дӀа-хьа хьахар, прокрутка, кликаш. Уж яздараш сайтах пайда эца атта дий тохка мара лелаеш дац.",
            ],
          },
          {
            heading: "Хоамаш мел ханна Ӏалашбу",
            bullets: [
              "Чуяьха файлаш, уж кхелла сахьат гаргга ха яьлча, сервера тӀара автоматически дӀаяхаш я. Шун видеош архив тхо Ӏалаш ца ю.",
              "Чуяккха гӀоертарех лаьца яздараш Ӏалашду, злоупотреблениешта духьал латта а дехараш тохка а эшаш мел да.",
              "Аккаунта хоамаш Шо сервисах пайда эцаш латтача хана Ӏалашбу, Шун дехарах дӀабоаккх.",
              "Сервера журналаш доазув долча ханна Ӏалашду, ротаци хулаш царна тӀехьа керда яздеш.",
            ],
          },
          {
            heading: "Хоамашца мичахь болх бу",
            body: [
              "Сервиса серверш Европейски союза латта тӀа йола дата-центре да. Лакхе хьахийча поставщикашта юкъера цхьаболчарна хоамашца цу доазонал арахьа а болх бе мегаш да, шоай политикашца догӀаш.",
            ],
          },
          {
            heading: "Шун бокъонаш",
            body: [
              `Шун хоамашца болх барах лаьца хоамаш хьаэца, уж нийсбе е дӀабаккха тӀадоаладе (потребовать), резахилар юха эца, хоамашца болх барна духьале е (возразить) Шун бокъо я. Цунна, дехарца хоттаяь йола поштера е Telegram аккаунтера ${MAIL} адреса яздел.`,
              "Тхо нийса ханна (разумный срок) жоп лу, дукхагӀча даькъе — ткъаь итт календарни дийнахьа. Аккаунт дӀаяьккхача, цунца хоттаяь йола чуяккхара истори а дӀаяккх.",
            ],
          },
          {
            heading: "Кхийнабоацараш (несовершеннолетние)",
            body: [
              "Сервис 16 шу кхачаза берашта лерха яц, царга хьежаяь а яц. Иштта пайдаэцархой хоамаш тхо хоаш гулбеш бац; гӀалатах из хиннадалахь, тхона яздел, тӀаккха хоамаш дӀабаккхаргба.",
            ],
          },
          {
            heading: "Хувцамаш",
            body: [
              "Ер Политика тхо керда е мегаш да. Лелача редакци терахь оагӀон хьалхе язъяь да; мехала хувцамаш тхо сервисе билгалдоаккхаргда.",
            ],
          },
        ],
      },
      terms: {
        title: "Пайдаэцархочун барт",
        summary: `${operator.site} лелае низам: фу мегаш да, фу мегаш дац, сервисо малагӀа условешца болх бу.`,
        sections: [
          {
            heading: "Юкъара положенеш",
            body: [
              `Барто ${operator.site} сайтах а ${BOT} Telegram-ботах а пайда эцар нийсду (регулирует). Сервиса да а администратор а — ${operator.nameInh}.`,
              "Сервисах пайда эца доладеш, Шо тӀачӀоагӀду условеш (условия) Шо дийша а тӀаэца а хилар. Цхьа услови Шоана ца тоалуш хилча, сервисах пайда эца ца деза.",
            ],
          },
          {
            heading: "Сервис махьа я",
            body: [
              "Сервиса еррига таронаш махьа лу. Тхоаге подпискаш, мах бола тарифаш, видео мах бола качествош, чура эцараш (внутренние покупки) дац.",
              "Тхо реклама ца хьахьокх, партнёрий ссылкаш а ца оттаю.",
            ],
          },
          {
            heading: "ТӀакхачара условеш",
            bullets: [
              "Сайта тӀа чуяккха аккаунт а чувалар а ца эш. Бото пайдаэцархой къоастаду Telegram аккаунтаца.",
              "Перегрузкех (перегрузка) а автоматически злоупотреблениех а сервис лорае дехарий сехьалла (частота запросов) технически доазонаш да.",
              "YouTube-ана сутках трафика лимит да: сайта тӀа а расширене а цхьа сетера (сеть) 24 сахьата чухьа 10 ГБ, ботаца цхьа Telegram аккаунтана 24 сахьата чухьа 25 ГБ. Кхыдола платформашта из хьакхалуш дац.",
              "Ботаца чуяккха тха канала подписка ца эш. Файлашта тӀаяздеча текста чу бото проекта керда хоамий канала ссылка тӀаоттаю; цу тӀа подписка е декхар дац.",
            ],
          },
          {
            heading: "Сервисо фу ду",
            body: [
              "Сервис технически юкъерлелархо (посредник) я: Шун ссылкаца из массанена тӀакхача йола оагӀоне йоал, медиафайл хьаэц, Шоана дӀалу.",
              "Тхоаге видео каталог латтаеш яц, кхычара контентаца лахар деш дац, чуяьха файлаш дӀакхачае эшачул совгӀа Ӏалаш ца ду — сахьат гаргга.",
              "Цхьа платформа тӀакхачаме хилар цун технически сацамех дола хӀама да, хьалха хоам ца беш хувцалуш хила мега.",
            ],
          },
          {
            heading: "Пайдаэцархочун декхараш",
            body: [
              "Хьаэца файлаш Шо мишта лелаеш да, цунна жоп Шо шоаш лу, иштта де Шун бокъо хилар а тӀачӀоагӀду.",
            ],
            bullets: [
              "Чуяккхал Шун бокъонаш йола материал мара, е бокъон дас е законо лелае бокъо еннача материал мара.",
              "Авторски а цунца хоттаяь (смежные) бокъонаш йохае, дихкаь контент даржае, кхоалагӀча сагий бокъонаш йохае сервис ма лелаел.",
              "Сервиса технически доазонаш гоннахьа довла ма гӀертал, дехарий сехьаллий доазонаш а боташта тохкам а юкъе лаьца.",
              "Автоматически доаллал (нагрузка) ма кхоллал: массови дехараш (массовые запросы), скрипташ а парсераш а мегаш дац.",
            ],
          },
          {
            heading: "Канале ссылкаш зорбаяхар",
            body: [
              "Ботаца видео чуяккхаш, Шо реза хул хьалхара постан (исходный пост) ссылка тха Telegram-канале зорбаяккхарга. Цох лаьца дӀахьедар ботаца хьахьокх качество хьаржале — кхы аьлча, чуяккха сацам Шо баллалехьа.",
              "Зорбаяккхар анонимни да: канале кхоач массанена тӀакхача йола оагӀон ссылка, роликан цӀи а цун обложка а — платформас постан превью чу хьахьокх кадр. Видео хьан чуяьккхай билгалдаккхаш дац. Видеофайл ше цхьаннахьа а цкъаа а зорбаяккхаш яц: даржаду ссылка я, платформаш шоаш хӀара пост кӀал «Поделиться» кнопкаца даржае хьехаш йола.",
              "Цхьа ссылка цкъа мара зорбаяккхаш яц. Ссылка канале ца кхоача Шоана лаьахь, из видео тха сервисаца чу ма яккхал.",
              "Тоабашкара ссылкаш а тӀатеха аккаунтаца чуяьха посташ а канале зорбаяхаш яц.",
            ],
          },
          {
            heading: "Шоай аккаунт тӀатохар",
            body: [
              "Шоай платформа тӀа йола аккаунт ботага тӀатохаш, Шо тӀачӀоагӀду из Шун аккаунт хилар а, из урхалде Шун бокъо хилар а.",
              "Платформаша автоматически чуяккхар магаш дац, тӀатеха аккаунтах доазув даккха е блокировка е мегаш да. Из кхерам Шо шоай тӀа лоац; тхо хьехам бу къаьстта, кертера йоаца аккаунт тӀатоха. Платформас Шун аккаунтага тӀадилла доазонашта тхо жоп ца лу.",
              "Тоабага тӀатеха аккаунт цун еррига декъашхой чуяккхарашта лелаю. Тоаба администраторашас сацам бу хьанна аккаунташ тӀатоха мегаш да; царех малагӀа а дӀаяккха йиш я царна.",
            ],
          },
          {
            heading: "Жоп дала декхара доазув (ограничение ответственности)",
            body: [
              "Сервис «мишта я, иштта» (как есть) условешца лу. Тхо гарантеш ца лу сервисо сацар доацаш болх барна, цхьа платформа тӀакхачаме хиларна е файл Шун Ӏалашонашта тоалуш хиларна.",
              "Чуяьккха материал Шо мишта лелаяь, цунна а, Шо кхоалагӀча сагий бокъонаш йохаяр бахьан долаш хиннача тӀехьалонашта а тхо жоп ца лу.",
              "Таронаш хувца, обслуживани (обслуживание) бахьан долаш сервиса болх сацабе, цун болх чакхбаккха а тха бокъо я.",
            ],
          },
          {
            heading: "ТӀакхачар доазув даккхар",
            body: [
              "Укх условеш йохаяьча, доазонаш гоннахьа довла гӀертача, иштта бокъон дас бакъдола латкъам (обоснованная жалоба) беннача, сервисага тӀакхачар тхо доазув даккха е сацаде мегаш да.",
            ],
          },
          {
            heading: "Хувцамаш а лелаю бокъо а (применимое право)",
            body: [
              "Тхо условеш хувца мегаш да; лелача редакци терахь оагӀон хьалхе язъяь да. Хувцамаш хиннача денз сервисах пайда эцар дӀахо даьхьача, Шо керда редакци тӀаэц.",
              "ОагӀонашта (стороны) юкъера юкъаметтигашта Казахстан Республикан бокъо лелаю. Къовсамаш оагӀонаш кехаташ яздарца (переписка) нийсде гӀерт, барт ца хилча — Казахстан Республикан законашца (законодательство) билгалдаь кепаца.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie политика",
        summary: `${operator.site} малагӀа cookie-файлаш лелаю, уж фуна эш, царех мишта дӀакъаста мегаш да.`,
        sections: [
          {
            heading: "Cookie — фу да",
            body: [
              "Cookie — сайто Шун браузере Ӏалашду жима текстови файлаш да. Царца Шун настройкаш дагалаца а, цӀераш йоаца хьежарий статистика гулъе а таро я.",
              "Cookie-ца цхьаьна укх документе чу тхо уж тайпара технологеш а йийц — браузера локальни Ӏалашдарг (локальное хранилище) а пиксел-счётчикаш а.",
            ],
          },
          {
            heading: "Эшаш дараш",
            body: [
              "Уж доацаш сервисо болх ца бу, цудухьа уж даиман оттаду.",
            ],
            bullets: [
              "Cloudflare Turnstile — ссылка скрипто йоаца, сага дахийтай тохкам.",
              "Интерфейса настройкаш — хьаржа мотт а оформлени тема а.",
            ],
          },
          {
            heading: "Аналитика",
            body: [
              "Уж гӀо ду малагӀа оагӀонаш лелаю а, гӀалаташ мичахь хул а кхета. Уж Шун резахиларца оттаду, сервиса болхага эшаш дац.",
            ],
            bullets: [
              "Google Analytics а Google Tag Manager а — хьежархой дукхал а сайта тӀа лелар а цӀераш йоацаш.",
              "Яндекс.Метрика — хьежархой дукхал, кликий карта а Вебвизор а.",
            ],
          },
          {
            heading: "Вебвизор",
            body: [
              "Яндекс.Метрика Вебвизорас оагӀон тӀа деш дола гӀулакхаш яздеш да: курсор (указатель) дӀа-хьа хьахар, прокрутка, кликаш, ссылка яздеча метте яздар. Интерфейс мичахь тилабу гуш хилийта эш из.",
              "Тхо уж яздараш билгалча наха тӀехьа хьежа лелаеш дац. Ӏалашде ца лаъа хоамаш сайта меттигашка (поля) ма яздел.",
            ],
          },
          {
            heading: "Мишта дӀакъаста",
            bullets: [
              "Шоай браузере cookie блокировка е дӀаяккхар оттадел — из некъ лакхе хьахийча еррига системашта болх беш ба.",
              "Google Analytics: гулдар дӀадоаккха браузера официальни тӀатохам (дополнение) Google сайта тӀа да.",
              "Яндекс.Метрика: дӀакъастар Яндекса официальни тӀатохамаца йиш я.",
              "Эшаш дола cookie дӀадаьхача, чуяккха йиш хургъяц.",
            ],
          },
          {
            heading: "Ханаш",
            body: [
              "Сесси cookie браузер дӀакъовлача е сесси ха чакхъяьлча дӀадовл. Аналитика счётчикаша идентификаторш Ӏалашду цар поставщикаша билгалъяь ханна.",
            ],
          },
        ],
      },
      copyright: {
        title: "Бокъон дайшта",
        summary: "Авторски бокъонашта сервиса позици а, йохаяра латкъам бара кеп а.",
        sections: [
          {
            heading: "Сервиса позици",
            body: [
              "Сервисо шийга видео ца оттаю, цар каталог а ца латтаю. Из технически юкъерлелархо (посредник) я: пайдаэцархочо язъяь ссылкаца массанена тӀакхача йола оагӀоне йоал, файл пайдаэцархочунна дӀалу.",
              "Чуяьха файлаш сервера тӀа сахьат гаргга Ӏалашду, автоматически дӀаяхаш я. Кхычара контента даиман йола копи тхоаге ца йис.",
              "Чуяьккха материал лелаярах жоп пайдаэцархочо лу — из Пайдаэцархочун барта чу нийсса чӀоагӀдаь да.",
            ],
          },
          {
            heading: "Шун бокъонаш йохаяьдале",
            body: [
              `Шо бокъон да е цун векал (представитель) долахь, Шун бокъонаш йохае сервис лелаю аьнна хеташ долахь, ${MAIL} адреса яздел. Тхо иштта дехараш тохку, гӀулакхаш (меры) ду.`,
            ],
          },
          {
            heading: "Дехаре фу билгалдаккха деза",
            bullets: [
              "МалагӀа произведени хьакхалуш да а, цунна бокъонаш Шун малагӀча бух тӀа я а.",
              "Материала ссылка а, хоаш долахь, йохаяра хьал (обстоятельства) а.",
              "Шун контактни хоамаш: цӀи е цӀи-оттам (наименование), адрес а электронни поштан адрес а.",
              "Шо бокъон дай цӀерах лелаш долахь — Шун полномочеш (полномочия) тӀачӀоагӀдар.",
              "Дехаре бола хоамаш бакъ хилар а, материал лелае бокъон дас е законо бокъо ца еннай хилар а лаьца дӀахьедар (заявление).",
            ],
          },
          {
            heading: "Тхо фу дергда",
            body: [
              "Тхо дехар нийса ханна (разумный срок) тохку, дукхагӀча даькъе — ткъаь итт календарни дийнахьа, йохаяр тӀачӀоагӀделча сервисаца материалага тӀакхачар доазув ду, эшаш хилча — йохархочун (нарушитель) сервисага тӀакхачар а.",
              "Тохкама жамӀах лаьца Шо билгалъяь электронни поштан адреса тхо Шоана хоам бергба.",
            ],
          },
          {
            heading: "Тешаме доаца дехараш (недобросовестные обращения)",
            body: [
              "Хоаш харц хоамаш бола дехаро законашца (законодательство) догӀаш дехар даьчунна жоп дала декхар (ответственность) тӀадожаде мега. Дехаро бокъон да а къовсаме материал а билгалдаккха таро ца лахь, из тохка духьале е тха бокъо я.",
            ],
          },
        ],
      },
    },
  },
  tl: {
    ui: {
      updated: "Huling binago noong",
      back: "Bumalik sa pangunahing pahina",
      operatorHeading: "Operator ng serbisyo",
      navHeading: "Iba pang mga dokumento",
      labels: {
        privacy: "Patakaran sa Privacy",
        terms: "Mga Tuntunin ng Paggamit",
        cookies: "Patakaran sa Cookie",
        copyright: "Para sa mga May-ari ng Karapatan",
      },
    },
    docs: {
      privacy: {
        title: "Patakaran sa Privacy",
        summary: `Anong datos ang kinokolekta ng ${operator.site}, bakit ito kailangan, gaano katagal ito iniimbak at paano ito ipabubura.`,
        sections: [
          {
            heading: "Pangkalahatang mga probisyon",
            body: [
              `Inilalarawan ng Patakarang ito kung anong personal na datos (personal data) ang pinoproseso ng serbisyong ${operator.site} at para sa anong layunin. Ang data controller ay si ${operator.nameTl}.`,
              "Sa paggamit ng serbisyo, sumasang-ayon ka sa paraan ng pagproseso na inilalarawan dito. Kung hindi ka sumasang-ayon dito, mangyaring huwag gamitin ang serbisyo.",
              "Isinasagawa ang pagproseso alinsunod sa Batas ng Republika ng Kazakhstan \"Tungkol sa Personal na Datos at sa Proteksyon Nito\", at, kaugnay ng mga bisita mula sa European Economic Area, alinsunod din sa mga kinakailangan ng GDPR.",
            ],
          },
          {
            heading: "Anong datos ang aming pinoproseso",
            body: [
              "Sadyang hindi kami nangongolekta ng anumang higit sa kinakailangan para gumana ang serbisyo, at hindi kami humihingi ng mga dokumento ng pagkakakilanlan, datos ng pagbabayad o address.",
            ],
            bullets: [
              "Datos ng Telegram account na natatanggap ng bot kapag nagpadala ka ng mensahe rito: numerikong identifier, username, pangalan at code ng wika.",
              "Ang mga link na ipinapadala mo para i-download at ang mga detalye ng mismong pagtatangka: platform, petsa at oras, napiling kalidad, at ang resulta (tagumpay o error).",
              "Teknikal na datos ng koneksyon: IP address, uri at bersyon ng browser, wika at pinanggalingang pahina (referring page). Napupunta ang mga ito sa mga log ng server at sa mga sistema ng web analytics.",
              "Mga cookie at analytics identifier — para sa mga detalye, tingnan ang Patakaran sa Cookie.",
            ],
          },
          {
            heading: "Bakit kailangan ang datos na ito",
            bullets: [
              "Upang maibigay ang mismong serbisyo: kunin ang video mula sa iyong link at ibigay sa iyo ang file.",
              "Upang makilala ang iyong account mula sa account ng iba at maiwasan ang pang-aabuso.",
              "Upang maprotektahan ang serbisyo laban sa awtomatikong pang-aabuso sa pamamagitan ng pagsusuri ng Cloudflare Turnstile bago ipadala ang link.",
              "Upang maunawaan kung paano ginagamit ang site at maitama ang mga error, gamit ang anonimisado at pinagsama-samang (aggregated) estadistika.",
              "Upang tumugon sa iyong mga katanungan at sa mga katanungan ng mga may-ari ng karapatan.",
              "Upang paminsan-minsang padalhan ka ng mensahe sa Telegram para alamin ang iyong opinyon tungkol sa serbisyo — halimbawa, kung tumigil ka na sa paggamit nito. Hindi sapilitan ang pagtugon; kung ayaw mong makatanggap ng ganitong mga mensahe, sabihin lamang ito at hindi na kami magpapadala muli.",
            ],
          },
          {
            heading: "Mga legal na batayan ng pagproseso",
            body: [
              "Ang datos ng Telegram account at ang mga tala ng pag-download ay pinoproseso upang maisakatuparan ang Mga Tuntunin ng Paggamit, na tinatanggap mo sa sandaling simulan mong gamitin ang serbisyo.",
              "Ang mga analytics cookie at ang pagre-record ng mga aksyon sa site ay pinoproseso batay sa iyong pahintulot (consent), na maaari mong bawiin anumang oras — ang mga paraan ay inilalarawan sa Patakaran sa Cookie.",
              "Ang mga log ng server at ang proteksyon laban sa mga bot ay nakabatay sa aming lehitimong interes (legitimate interest) na mapanatiling gumagana at ligtas ang serbisyo.",
              "Ang pagtatanong tungkol sa iyong opinyon sa serbisyo ay nakabatay sa aming lehitimong interes na mapabuti ang serbisyo; maaari kang tumanggi rito anumang oras.",
            ],
          },
          {
            heading: "Mga nakakonektang account",
            body: [
              "Kung nais mo, maaari mong ikonekta sa bot ang iyong account sa isang platform (Instagram, Facebook, YouTube, X, VK, TikTok) upang ma-download ng bot ang mga post na nakikita lamang ng mga naka-sign in: mga story at mga pribadong post. Para dito, natatanggap ng bot ang mga cookie ng account na iyon — mula sa Videoner extension sa pamamagitan ng isang beses na code, o mula sa file na ipinadala mo.",
              "Iniimbak lamang namin ang mga cookie ng napiling platform at agad na itinatapon ang iba. Iniimbak ang mga ito nang naka-encrypt at ginagamit lamang para sa mga pag-download kung saan mo ikinonekta ang mga ito. Ang mga cookie na ikinonekta sa iyong pribadong chat ay para sa iyong mga pag-download, kabilang ang iyong sariling mga link sa mga grupong walang sariling nakakonektang account; hindi kailanman ginagamit ang mga ito para sa mga link ng ibang tao. Ang mga cookie na ikinonekta sa isang grupo ay para lamang sa mga pag-download ng mga miyembro nito at wala nang iba.",
              "Ang legal na batayan ay ang iyong pahintulot: ikaw mismo ang nagkokonekta ng account at maaari mo itong alisin anumang oras gamit ang command na /accounts. Kapag inalis, permanenteng binubura ang mga cookie. Kung huminto ang platform sa pagtanggap ng pag-login, ipaaalam ito sa iyo ng bot.",
              "Ang mga post na na-download sa pamamagitan ng nakakonektang account ay hindi inilalathala sa aming channel at hindi ibinibigay sa ibang mga user mula sa pinagsasaluhang cache.",
            ],
          },
          {
            heading: "Mga serbisyo ng ikatlong partido",
            body: [
              "Hindi namin ibinebenta ang iyong datos at hindi namin ito ipinapasa sa mga ikatlong partido para sa kanilang sariling layunin. Gumagamit ang serbisyo ng mga sumusunod na provider, na bawat isa ay nagpoproseso ng datos ayon sa sarili nitong mga patakaran:",
            ],
            bullets: [
              `Telegram — pagpapatakbo ng bot na ${BOT}.`,
              "Cloudflare — proteksyon laban sa mga bot (Turnstile), paghahatid ng site at pagruruta ng email.",
              "Google Analytics at Google Tag Manager — estadistika ng mga pagbisita.",
              "Yandex Metrica — estadistika ng mga pagbisita, click map at Webvisor. Nire-record ng Webvisor ang mga aksyon sa pahina: paggalaw ng pointer, pag-scroll at mga pag-click. Ginagamit lamang ang mga recording upang suriin ang kadalian ng paggamit ng site.",
            ],
          },
          {
            heading: "Gaano katagal namin iniimbak ang datos",
            bullets: [
              "Awtomatikong binubura sa server ang mga na-download na file humigit-kumulang isang oras matapos itong malikha. Hindi kami nag-iingat ng archive ng iyong mga video.",
              "Iniimbak ang mga tala ng mga pagtatangkang mag-download hangga't kinakailangan ito para maiwasan ang pang-aabuso at para masuri ang mga katanungan.",
              "Iniimbak ang datos ng account habang ginagamit mo ang serbisyo at binubura ito kapag hiniling mo.",
              "Iniimbak ang mga log ng server sa limitadong panahon at pinapatungan habang umiikot (rotation) ang mga ito.",
            ],
          },
          {
            heading: "Saan pinoproseso ang datos",
            body: [
              "Ang mga server ng serbisyo ay matatagpuan sa isang data center sa loob ng European Union. Maaaring iproseso ng ilan sa mga provider na nakalista sa itaas ang datos sa labas nito alinsunod sa kanilang sariling mga patakaran.",
            ],
          },
          {
            heading: "Ang iyong mga karapatan",
            body: [
              `May karapatan kang humingi ng impormasyon tungkol sa pagproseso ng iyong datos, hilingin na itama o burahin ito, bawiin ang iyong pahintulot at tumutol sa pagproseso. Para dito, sumulat sa ${MAIL} mula sa email address o Telegram account na kaugnay ng kahilingan.`,
              "Tumutugon kami sa loob ng makatwirang panahon, karaniwang sa loob ng tatlumpung araw ng kalendaryo. Kapag binura ang isang account, binubura rin ang kasaysayan ng pag-download na nakaugnay rito.",
            ],
          },
          {
            heading: "Mga menor de edad",
            body: [
              "Ang serbisyo ay hindi nilalayon para sa mga batang wala pang 16 na taong gulang at hindi nakatuon sa kanila. Hindi namin sadyang kinokolekta ang kanilang datos; kung nangyari ito nang hindi sinasadya, sumulat sa amin at buburahin ang datos.",
            ],
          },
          {
            heading: "Mga pagbabago",
            body: [
              "Maaari naming i-update ang Patakarang ito. Nakasaad sa itaas ng pahina ang petsa ng kasalukuyang bersyon; ipapaalam namin sa loob ng serbisyo ang mahahalagang pagbabago.",
            ],
          },
        ],
      },
      terms: {
        title: "Mga Tuntunin ng Paggamit",
        summary: `Ang mga tuntunin sa paggamit ng ${operator.site}: kung ano ang pinapayagan, kung ano ang hindi, at sa anong mga kondisyon gumagana ang serbisyo.`,
        sections: [
          {
            heading: "Pangkalahatang mga probisyon",
            body: [
              `Pinamamahalaan ng mga Tuntuning ito ang paggamit ng website na ${operator.site} at ng Telegram bot na ${BOT}. Ang may-ari at tagapangasiwa ng serbisyo ay si ${operator.nameTl}.`,
              "Sa pagsisimulang gamitin ang serbisyo, kinukumpirma mo na nabasa mo ang mga Tuntuning ito at tinatanggap mo ang mga ito. Kung may anumang kondisyon na hindi angkop sa iyo, huwag gamitin ang serbisyo.",
            ],
          },
          {
            heading: "Libre ang serbisyo",
            body: [
              "Ibinibigay nang libre ang lahat ng tampok ng serbisyo. Wala kaming mga subscription, bayad na plano, bayad na kalidad ng video o mga pagbili sa loob ng serbisyo.",
              "Hindi kami nagpapakita ng advertisement at hindi kami naglalagay ng mga affiliate link.",
            ],
          },
          {
            heading: "Mga kondisyon ng pag-access",
            bullets: [
              "Hindi kailangan ng account o pag-sign in para mag-download sa website. Kinikilala ng bot ang mga user batay sa kanilang Telegram account.",
              "Pinoprotektahan ang serbisyo laban sa labis na karga (overload) at awtomatikong pang-aabuso ng mga teknikal na limitasyon sa dalas ng mga kahilingan.",
              "May pang-araw-araw na limitasyon sa trapiko para sa YouTube: 10 GB bawat 24 oras bawat network sa website at sa extension, at 25 GB bawat 24 oras bawat Telegram account sa bot. Hindi nito sakop ang ibang mga platform.",
              "Hindi kailangang mag-subscribe sa aming channel para makapag-download sa pamamagitan ng bot. Nagdaragdag ang bot ng link sa news channel ng proyekto sa caption ng mga file; hindi sapilitan ang pag-subscribe dito.",
            ],
          },
          {
            heading: "Ano ang ginagawa ng serbisyo",
            body: [
              "Ang serbisyo ay isang teknikal na tagapamagitan (technical intermediary): sa pamamagitan ng link na ibinigay mo, ina-access nito ang isang pahinang bukas sa publiko, kinukuha ang media file at ipinapasa ito sa iyo.",
              "Hindi kami nagho-host ng katalogo ng mga video, hindi kami naghahanap sa nilalaman ng iba, at hindi namin iniimbak ang mga na-download na file nang mas matagal kaysa sa kinakailangan para maihatid ang mga ito — humigit-kumulang isang oras.",
              "Ang pagiging available ng isang partikular na platform ay nakadepende sa mga teknikal na desisyon ng platform na iyon at maaaring magbago nang walang paunang abiso.",
            ],
          },
          {
            heading: "Mga obligasyon ng user",
            body: [
              "Ikaw lamang ang may pananagutan sa kung paano mo ginagamit ang mga file na nakuha mo, at kinukumpirma mo na may karapatan kang gawin ito.",
            ],
            bullets: [
              "I-download lamang ang materyal na ikaw ang may-ari ng karapatan, o ang paggamit nito ay pinahihintulutan ng may-ari ng karapatan o ng batas.",
              "Huwag gamitin ang serbisyo upang labagin ang karapatang-ari (copyright) o ang mga kaugnay na karapatan (related rights), upang magpakalat ng ipinagbabawal na nilalaman o upang labagin ang mga karapatan ng ikatlong partido.",
              "Huwag subukang lampasan ang mga teknikal na limitasyon ng serbisyo, kabilang ang mga limitasyon sa dalas ng mga kahilingan at ang pagsusuri laban sa mga bot.",
              "Huwag lumikha ng awtomatikong karga: hindi pinapayagan ang maramihang kahilingan, mga script at mga scraper.",
            ],
          },
          {
            heading: "Paglalathala ng mga link sa channel",
            body: [
              "Sa pag-download ng video sa pamamagitan ng bot, sumasang-ayon ka na ilalathala sa aming Telegram channel ang link sa orihinal na post. Ipinapakita sa bot ang abiso tungkol dito bago ka pumili ng kalidad — ibig sabihin, bago ka magpasya na mag-download.",
              "Anonimo ang paglalathala: ang ipinapadala sa channel ay ang link sa pahinang bukas sa publiko, ang pamagat ng video at ang cover nito — ang mismong frame na ipinapakita ng platform sa preview ng post. Hindi isinasaad kung sino ang nag-download ng video. Ang mismong video file ay hindi kailanman inilalathala kahit saan: ang ipinapakalat ay ang link, na ang mga platform mismo ang nag-aanyayang ipakalat sa pamamagitan ng button na \"Ibahagi\" (Share) sa ilalim ng bawat post.",
              "Ang iisang link ay inilalathala nang hindi hihigit sa isang beses. Kung ayaw mong mapunta sa channel ang isang link, huwag i-download ang video na iyon sa pamamagitan ng aming serbisyo.",
              "Ang mga link mula sa mga grupo at ang mga post na na-download sa pamamagitan ng nakakonektang account ay hindi inilalathala sa channel."
            ],
          },
          {
            heading: "Pagkonekta ng iyong account",
            body: [
              "Sa pagkonekta sa bot ng iyong account sa isang platform, kinukumpirma mo na iyo ang account na ito at may karapatan kang gamitin ito sa ganitong paraan.",
              "Hindi sinasang-ayunan ng mga platform ang mga awtomatikong pag-download at maaari nilang limitahan o i-block ang nakakonektang account. Ikaw ang tumatanggap ng panganib na ito; inirerekomenda naming magkonekta ng hiwalay na account sa halip na ang iyong pangunahing account. Hindi kami mananagot sa mga limitasyong ipapataw ng platform sa iyong account.",
              "Ang account na nakakonekta sa isang grupo ay ginagamit para sa mga pag-download ng lahat ng miyembro nito. Ang mga admin ng grupo ang nagpapasya kung sino ang maaaring magkonekta ng mga account, at maaari nilang alisin ang alinman sa mga ito.",
            ],
          },
          {
            heading: "Limitasyon ng pananagutan",
            body: [
              "Ibinibigay ang serbisyo nang \"as is\" (kung ano ito). Hindi namin ginagarantiya ang tuloy-tuloy na paggana, ang pagiging available ng isang partikular na platform o ang pagiging angkop ng file sa iyong layunin.",
              "Hindi kami mananagot sa kung paano mo ginamit ang na-download na materyal, o sa mga kahihinatnan ng iyong paglabag sa mga karapatan ng ikatlong partido.",
              "May karapatan kaming baguhin ang mga tampok ng serbisyo, pansamantalang ihinto ang serbisyo para sa maintenance, at wakasan ang operasyon nito.",
            ],
          },
          {
            heading: "Paghihigpit sa pag-access",
            body: [
              "Maaari naming limitahan o wakasan ang pag-access sa serbisyo kapag nilabag ang mga Tuntuning ito, kapag may pagtatangkang lampasan ang mga limitasyon, o kapag nakatanggap kami ng makatwirang reklamo mula sa may-ari ng karapatan.",
            ],
          },
          {
            heading: "Mga pagbabago at naaangkop na batas",
            body: [
              "Maaari naming baguhin ang mga Tuntuning ito; nakasaad sa itaas ng pahina ang petsa ng kasalukuyang bersyon. Ang patuloy na paggamit ng serbisyo matapos ang mga pagbabago ay nangangahulugang tinatanggap mo ang bagong bersyon.",
              "Ang ugnayan ng mga partido ay pinamamahalaan ng batas ng Republika ng Kazakhstan. Sisikapin ng mga partido na lutasin ang mga hindi pagkakaunawaan sa pamamagitan ng sulatan, at kung hindi magkasundo, sa paraang itinakda ng batas ng Republika ng Kazakhstan.",
            ],
          },
        ],
      },
      cookies: {
        title: "Patakaran sa Cookie",
        summary: `Anong mga cookie ang ginagamit ng ${operator.site}, para saan ang mga ito at paano tanggihan ang mga ito.`,
        sections: [
          {
            heading: "Ano ang cookie",
            body: [
              "Ang mga cookie ay maliliit na text file na iniimbak ng isang site sa iyong browser. Pinahihintulutan ng mga ito na matandaan ang iyong mga setting at makakolekta ng anonimisadong estadistika ng mga pagbisita.",
              "Bukod sa mga cookie, inilalarawan din ng dokumentong ito ang mga kaugnay na teknolohiya — ang local storage ng browser at mga tracking pixel.",
            ],
          },
          {
            heading: "Mahigpit na kinakailangan",
            body: [
              "Hindi gumagana ang serbisyo kung wala ang mga ito, kaya palagi itong itinatakda.",
            ],
            bullets: [
              "Cloudflare Turnstile — sinusuri kung ang link ay ipinapadala ng isang tao at hindi ng isang script.",
              "Mga setting ng interface — ang napiling wika at tema ng disenyo.",
            ],
          },
          {
            heading: "Para sa analytics",
            body: [
              "Tinutulungan kami ng mga ito na maunawaan kung aling mga pahina ang ginagamit at kung saan nagkakaroon ng mga error. Itinatakda ang mga ito nang may iyong pahintulot at hindi kinakailangan para gumana ang serbisyo.",
            ],
            bullets: [
              "Google Analytics at Google Tag Manager — dami ng bisita at gawi sa site sa anonimisadong anyo.",
              "Yandex Metrica — dami ng bisita, click map at Webvisor.",
            ],
          },
          {
            heading: "Webvisor",
            body: [
              "Nire-record ng Webvisor ng Yandex Metrica ang mga aksyon sa pahina: paggalaw ng pointer, pag-scroll, mga pag-click at pag-type sa field ng link. Kailangan ito upang makita kung saan nakalilito ang interface.",
              "Hindi namin ginagamit ang mga recording na ito upang subaybayan ang mga partikular na tao. Huwag maglagay sa mga field ng site ng impormasyong ayaw mong maiimbak.",
            ],
          },
          {
            heading: "Paano tumanggi",
            bullets: [
              "I-block o burahin ang mga cookie sa mga setting ng iyong browser — gumagana ang paraang ito para sa lahat ng sistemang nakalista rito.",
              "Google Analytics: makukuha sa site ng Google ang opisyal na browser add-on na nagdi-disable ng pagkolekta ng datos.",
              "Yandex Metrica: maaaring tumanggi sa pamamagitan ng opisyal na add-on ng Yandex.",
              "Kapag in-disable ang mahigpit na kinakailangang mga cookie, hindi na posible ang pag-download.",
            ],
          },
          {
            heading: "Mga panahon ng pag-iimbak",
            body: [
              "Binubura ang mga session cookie kapag isinara ang browser o kapag nag-expire ang session. Iniimbak ng mga analytics tool ang kanilang mga identifier sa loob ng mga panahong itinakda ng kanilang mga provider.",
            ],
          },
        ],
      },
      copyright: {
        title: "Para sa mga May-ari ng Karapatan",
        summary: "Ang posisyon ng serbisyo tungkol sa karapatang-ari (copyright) at ang paraan ng paghahain ng reklamo tungkol sa paglabag.",
        sections: [
          {
            heading: "Ang posisyon ng serbisyo",
            body: [
              "Hindi nagho-host ng mga video ang serbisyo at hindi ito nag-iingat ng katalogo ng mga ito. Gumaganap ito bilang teknikal na tagapamagitan: sa pamamagitan ng link na inilagay ng user, ina-access nito ang isang pahinang bukas sa publiko at ipinapasa ang file sa user na iyon.",
              "Iniimbak ang mga na-download na file sa server nang humigit-kumulang isang oras at awtomatikong binubura pagkatapos. Walang permanenteng kopya ng nilalaman ng iba na nananatili sa amin.",
              "Ang pananagutan sa paggamit ng na-download na materyal ay nasa user — tahasan itong nakasaad sa Mga Tuntunin ng Paggamit.",
            ],
          },
          {
            heading: "Kung nilabag ang iyong mga karapatan",
            body: [
              `Kung ikaw ay may-ari ng karapatan o kinatawan nito at naniniwala kang ginagamit ang serbisyo upang labagin ang iyong mga karapatan, sumulat sa ${MAIL}. Sinusuri namin ang ganitong mga reklamo at gumagawa ng kaukulang hakbang.`,
            ],
          },
          {
            heading: "Ano ang dapat isama sa reklamo",
            bullets: [
              "Kung aling akda ang apektado at sa anong batayan mo hawak ang mga karapatan dito.",
              "Ang link sa materyal at, kung alam, ang mga pangyayari ng paglabag.",
              "Ang iyong mga detalye sa pakikipag-ugnayan: pangalan o pangalan ng organisasyon, address at email address.",
              "Kung kumikilos ka sa ngalan ng may-ari ng karapatan — patunay ng iyong awtoridad.",
              "Isang pahayag na tumpak ang impormasyon sa reklamo at na ang paggamit ng materyal ay hindi pinahihintulutan ng may-ari ng karapatan o ng batas.",
            ],
          },
          {
            heading: "Ano ang aming gagawin",
            body: [
              "Sinusuri namin ang reklamo sa loob ng makatwirang panahon, karaniwang sa loob ng tatlumpung araw ng kalendaryo, at kapag nakumpirma ang paglabag, nililimitahan namin ang pag-access sa materyal sa pamamagitan ng serbisyo at, kung kinakailangan, ang pag-access ng lumabag sa serbisyo.",
              "Ipapaalam namin ang resulta ng pagsusuri sa email address na ibinigay mo.",
            ],
          },
          {
            heading: "Mga reklamong may masamang intensyon",
            body: [
              "Ang reklamong naglalaman ng impormasyong alam na hindi totoo ay maaaring magdulot ng pananagutan sa nagrereklamo alinsunod sa naaangkop na batas. May karapatan kaming tumangging suriin ang reklamo kung hindi nito matutukoy ang may-ari ng karapatan o ang pinagtatalunang materyal.",
            ],
          },
        ],
      },
    },
  },
};
