import { operator } from "./operator";
import { LegalByLanguage } from "./types";

// Тексты документов на пяти языках. Держим отдельно от lib/i18n/translations.ts:
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
};
