# Портфолио — Тишкина Маргарита

## Запуск

```bash
npm install        # один раз после клонирования
npm run dev        # локальный сервер → http://localhost:5173
npm run build      # сборка в папку dist/ для деплоя
npm run preview    # предпросмотр собранной версии
```

---

## Как редактировать контент

### Главная страница

Каждая секция — отдельный файл в `src/partials/index/`. Редактировать нужно их, а не `index.html`:

| Секция | Файл |
|--------|------|
| Заголовок | `src/partials/index/hero.html` |
| Карточки проектов | `src/partials/index/work.html` |
| Обо мне | `src/partials/index/about.html` |
| Опыт работы | `src/partials/index/experience.html` |
| Контакты (футер) | `src/partials/footer-main.html` |

### Страницы проектов

Файлы страниц лежат в `projects/`, а контент внутри `<main class="project-page">` вынесен в партиалы по папкам:

- `projects/project-crm.html` — CRM для колл-центра  
  - Контент: `src/partials/projects/crm/`  
    - `project-crm-hero.html` — герой + первое медиа  
    - `project-crm-intro.html` — аудитория, цель, задачи  
    - `project-crm-flow.html` — флоу работы с клиентом + медиа  
    - `project-crm-case-page.html` — страница обращения  
    - `project-crm-widgets.html` — виджеты и мотивация  
    - `project-crm-schedule.html` — управление графиком  
    - `project-crm-gamification.html` — геймификация  
    - `project-crm-other-sections.html` — дополнительные разделы  
    - `project-crm-design-system.html` — дизайн-система  
    - `project-crm-results.html` — итоги  
    - `project-crm-next.html` — что дальше  
    - `project-crm-other-projects.html` — навигация к другим кейсам

- `projects/project-e-comm.html` — Сайт МТС  
  - Контент: `src/partials/projects/e-comm/`  
    - `project-e-comm-hero.html` — герой + главное видео  
    - `project-e-comm-intro.html` — аудитория, цель, задачи  
    - `project-e-comm-analysis.html` — предпроектная аналитика  
    - `project-e-comm-research.html` — ресерч и сценарии  
    - `project-e-comm-design-and-ui.html` — дизайн-система и главный экран  
    - `project-e-comm-tariff-and-modals.html` — карточка тарифа и модальные окна  
    - `project-e-comm-results.html` — результаты, «что дальше» и навигация к другим кейсам

- `projects/project-mini-app.html` — Публикатор  
  - Контент: `src/partials/projects/mini-app/`  
    - `project-mini-app-hero.html` — герой + главное медиа  
    - `project-mini-app-intro.html` — аудитория, цель, задачи  
    - `project-mini-app-metrics-and-analysis.html` — метрики MVP и предпроектная аналитика  
    - `project-mini-app-onboarding-and-subscriptions.html` — онбординг и подписки  
    - `project-mini-app-main-screen-and-editor.html` — главный экран и редактор публикаций  
    - `project-mini-app-channels-profile-and-ui.html` — каналы, профиль, темы и UI-kit  
    - `project-mini-app-next.html` — что дальше и навигация к другим кейсам

### Добавить новый проект

1. Скопировать любой файл из `projects/`, переименовать
2. Заменить содержимое `<main>` на контент нового проекта
3. Добавить карточку в `src/partials/work.html`
4. Зарегистрировать в `vite.config.js` в секции `rollupOptions.input`

---

## Структура папок

```
src/partials/                ← HTML-фрагменты
  head-meta.html             ← <head> c мета и стилями
  header-main.html           ← шапка главной
  header-project.html        ← шапка страниц проектов
  footer-main.html           ← футер главной (контакты)
  footer-project.html        ← футер страниц проектов
  index/                     ← секции главной страницы
    hero.html
    work.html
    about.html
    experience.html
  projects/
    crm/                     ← секции кейса CRM
      project-crm-*.html
    e-comm/                  ← секции кейса МТС
      project-e-comm-*.html
    mini-app/                ← секции кейса Публикатор
      project-mini-app-*.html

css/                         ← стили
  reset.css                  ← CSS reset
  fonts.css                  ← @font-face и подключение шрифтов
  variables.css              ← все дизайн‑токены (цвета, типографика, отступы, размеры)
  base.css                   ← базовая верстка, сетка, общие компоненты, курсор
  project-page.css           ← общие стили страниц кейсов (`.project-page__*`)
  responsive-tablet.css      ← адаптив для планшетов (≤1024px)
  responsive-mobile.css      ← адаптив для мобильных (≤768px и ≤480px)
img/                         ← изображения
  crm/                       ← медиа CRM (keys-1-*.png)
  e-comm/                    ← медиа МТС (keys-2-*.png)
  mini-app/                  ← медиа Публикатора (keys-3-*.png)
  picture.png                ← фото для блока «Обо мне»
resource/                    ← видеофайлы .mp4
  crm/                       ← видео CRM (keys-1.mp4, progect-keys-1-video-*.mp4)
  e-comm/                    ← видео МТС (keys-2.mp4, progect-keys-2-video-*.mp4)
  mini-app/                  ← видео Публикатора (keys-3.mp4, progect-keys-3-video-*.mp4)
projects/                    ← страницы кейсов
fonts/
```

---

## Шрифты

- `Involve-Regular.otf` (`font-family: 'Involve'; font-weight: 400`) — основной текст (все параграфы, списки и мета без явного `font-family`).  
- `Involve-Medium.otf` (`font-weight: 500`) — заголовки и акценты: хедер, `hero`, `.project__title`, `.experience__title`, `.experience-card__position`, `.project-page__title`, `.project-page__heading`, `.project-page__subheading`, ссылки вида «Открыть макет в Figma» и т.п.  
- `Involve-Oblique.otf` (`font-style: italic`) — **подписи под фото и видео** (`.project-page__caption`).

### Типографика

- Базовый текст:
  - размер: `--font-body` (14px),
  - интерлиньяж: `line-height: 145%`,
  - кернинг (трекинг): `letter-spacing: 0.05em`.
- Заголовки (карточки проектов, секции, страницы кейсов):
  - `line-height: 128%`,
  - `letter-spacing: 0.05em`,
  - шрифт: `Involve Medium`.
- Метаданные (списки «Годы / Роль / Область» в кейсах) используют те же параметры, что основной текст (14px, 145%, 0.05em).
- Подписи под медиа (`.project-page__caption`) — 12px, `line-height: 130%`, `letter-spacing: 0.05em`, курсив `Involve-Oblique`.

### CSS‑переменные и «магические» числа

- Все ключевые размеры и отступы собраны в `css/variables.css`. Там хранятся:
  - базовая типографическая шкала и семантические токены (`--font-body`, `--font-heading-md`, `--font-display-lg`),
  - отступы и размеры контейнеров (`--space-*`, `--container-*`, `--layout-*`),
  - размеры блоков и карточек (`--project-content-max`, `--project-content-max-wide`, `--experience-item-max-width`),
  - геометрия курсора (`--cursor-size`), бургер‑меню и навигации (`--header-burger-*`, `--header-nav-padding-y-md`),
  - размеры изображений в блоке «Обо мне» (`--about-img-*`),
  - ширина элементов футера (`--footer-title-max-width`, `--footer-item-max-width`) и отступы декоративных элементов.
- Новые числовые значения в `css/*.css` не добавляем «вручную». Сначала заводим читаемую переменную в `variables.css`, потом используем её в стилях.

---

## Процессы и документация

- Любое изменение структуры файлов (новая папка, перенос медиа, добавление партиалов) **обязательно** нужно сразу фиксировать в этом README.
- Любые новые правила типографики, отступов, нейминга классов или подключения шрифтов тоже должны быть описаны в разделе «Типографика» или рядом по смыслу.
- При добавлении нового проекта:
  - положить медиа в соответствующие подпапки `img/<project>/` и `resource/<project>/`,
  - обновить таблицу по проектам и структуру папок в README,
  - кратко описать, как подключаются новые партиалы и какие медиа к ним привязаны.

---

## WebP (автоконвертация изображений)

На `npm run build` изображения из `img/**` автоматически конвертируются в `.webp`, и ссылки в HTML подменяются на WebP-версии **если файл `.webp` существует**.

- **Как работает**:
  - генерация: для каждого `.png/.jpg/.jpeg` в `img/**` создаётся соседний файл `.webp` (через `sharp`);
  - подмена ссылок: в HTML во время билда заменяются `...png/jpg/jpeg` → `...webp` (работает для абсолютных `/img/...` и относительных `../img/...` путей).
- **Важно**:
  - в dev (`npm run dev`) ничего не конвертируется и ссылки не подменяются;
  - исходники `.png/.jpg` остаются (fallback и исходный материал);
  - WebP генерируется только для картинок в `img/**` (видео и `resource/**` не трогаются).

---

## Проверка ассетов (пути к img/resource)

Перед билдом можно прогнать проверку, что все пути к медиа в HTML реально существуют:

```bash
npm run check:assets
```

Скрипт проверяет ссылки на локальные ассеты в:
- `src/partials/**/*.html`
- `projects/*.html`
- `index.html`

Проверяются только пути вида `/img/...`, `/resource/...`, `../img/...`, `../resource/...`.

---

## Стек

Vanilla HTML/CSS/JS + **Vite** как сборщик. Нет фреймворков. Нет препроцессоров.

---

## Как работают партиалы

В `vite.config.js` написан кастомный плагин `htmlIncludePlugin` — он на этапе dev/build находит в HTML теги вида:

```html
<include src="src/partials/hero.html" />
```

и **подставляет содержимое файла** вместо тега.  
Пути в атрибуте `src` **всегда** считаются от корня проекта (не от текущего файла).

**Важно:**
- не использовать `posthtml-include` — у него баг: всё содержимое после первого `<include>` теряется;
- правки контента вносятся в партиалы в `src/partials/**`, а не в собранные HTML.

---

## Медиафайлы проектов

### CRM (project-crm.html)

| Секция | Видео | Постер |
|--------|-------|--------|
| Главное изображение | `progect-keys-1-video-1.mp4` | `keys-1-img-1.png` |
| Новый флоу работы с клиентом | `progect-keys-1-video-3.mp4` | `keys-1-img-3.png` |
| Виджеты и мотивация | `keys-1.mp4` | `keys-1-img.png` |
| Управление графиком | `progect-keys-1-video-2.mp4` | `keys-1-img-2.png` |
| Геймификация | `progect-keys-1-video-4.mp4` | `keys-1-img-4.png` |
| Главная (карточка) | `progect-keys-1-video-1.mp4` | `keys-1-img-1.png` |

### Публикатор (project-mini-app.html)

| Секция | Видео | Постер |
|--------|-------|--------|
| Управление подписками и тарифами | `progect-keys-3-video-1.mp4` | `keys-3-img-1.png` |
| Главный экран и навигация | `progect-keys-3-video-2.mp4` | `keys-3-img-2.png` |
| Остальные разделы (каналы) | `progect-keys-3-video-3.mp4` | `keys-3-img-3.png` |
| Редактор публикаций | `progect-keys-3-video-4.mp4` | `keys-3-img-4.png` |
| Поддержка темной и светлой темы | `keys-3.mp4` | `keys-3-img-5.png` |
| Календарь и планирование | `progect-keys-3-video-5.mp4` | `keys-3-img-6.png` |

### МТС (project-e-comm.html)

| Секция | Видео | Постер |
|--------|-------|--------|
| Главное изображение | `keys-2.mp4` | `keys-2-img.png` |
| Карточка тарифа | `progect-keys-2-video-1.mp4` | `keys-2-img-1.png` |
| Модальные окна | `progect-keys-2-video-2.mp4` | `keys-2-img-2.png` |
| Главная (карточка) | `keys-2.mp4` | `keys-2-img.png` |

---

## CSS‑переменные (variables.css)

**Правило:** все числовые значения (отступы, размеры, цвета) — **только** через переменные из `variables.css`.  
Нельзя писать «магические» `px`‑значения напрямую в `css/*.css`, если для них есть переменная.

### Типографическая система

**Правило:** в стилях использовать **семантические** переменные. Базовую шкалу (`--font-size-NN`) напрямую не использовать — только как источник для семантики.

#### Семантические переменные (менять здесь → изменится везде)

| Переменная | Ссылается на | Значение | Где используется |
|---|---|---|---|
| `--font-micro` | `--font-size-9` | 9px | курсор |
| `--font-small` | `--font-size-12` | 12px | мета, примечания |
| `--font-body` | `--font-size-14` | 14px | весь основной текст |
| `--font-heading-sm` | `--font-size-18` | 18px | подзаголовки, должности |
| `--font-heading-md` | `--font-size-24` | 24px | заголовки карточек и секций |
| `--font-heading-lg` | `--font-size-28` | 28px | about, крупные блоки |
| `--font-heading-xs` | `--font-size-20` | 20px | адаптивные заголовки на ≤1024px |
| `--font-display-xs` | `--font-size-30` | 30px | герой‑линия на ≤768px |
| `--font-display-md` | `--font-size-32` | 32px | футер на ≤1024px |
| `--font-display-lg-adapt` | `--font-size-36` | 36px | герой на ≤1024px |
| `--font-display-sm` | `--font-size-42` | 42px | футер desktop |
| `--font-display-lg` | `--font-size-48` | 48px | герой desktop |

#### Базовая шкала (только как значения для семантики выше)

`--font-size-9` `--font-size-12` `--font-size-14` `--font-size-18` `--font-size-20` `--font-size-24` `--font-size-28` `--font-size-30` `--font-size-32` `--font-size-36` `--font-size-38` `--font-size-42` `--font-size-48`

Адаптивные размеры в медиа‑запросах используют `--font-size-NN` напрямую (breakpoint‑специфичные значения).

### Актуальные переменные отступов

| Переменная | Значение | Используется в |
|---|---|---|
| `--space-xs` | 4px | мелкие gaps, margin li |
| `--space-sm` | 8px | gaps списков, мелкие отступы |
| `--space-md` | 12px | nav gap на ≤480px |
| `--space-base` | 16px | header padding, paragraph margin |
| `--space-xl` | 24px | description margin, figma‑link, subheading |
| `--space-2xl` | 32px | nav list gap, header nav gap |
| `--space-4xl` | 40px | footer wrapper gap, media placeholder |
| `--space-5xl` | 45px | footer wrapper horizontal gap |
| `--space-8xl` | 60px | work project margin, footer links |
| `--space-10xl` | 80px | work padding |
| `--space-12xl` | 100px | project‑page padding |
| `--space-hero-pt` | 242px | hero title padding‑top |

### Прочие ключевые переменные

- `--container-padding`: 36px (desktop)
- `--container-padding-md`: 32px (≤1024px)
- `--container-padding-sm`: 28px (≤480px)
- `--layout-aside`: 310px — ширина левой колонки `.layout__aside`
- `--project-content-max-md`: 400px — max-width контента на адаптиве
- `--experience-item-margin-bottom`: 48px
- `--experience-item-padding-bottom`: 48px

---

## Типографика (актуальные размеры)

| Элемент | Desktop | ≤1024px | ≤480px |
|---------|---------|---------|--------|
| `.project__title` (заголовок карточки проекта) | 24px | 20px | 18px |
| `.experience__title` («Опыт работы») | 24px | 20px | — |
| `.experience-card__position` (должность) | 24px | 20px | — |
| `.project__text` (описание проекта) | 18px | 18px | 15px |
| `.project__meta-item` (мета‑список) | 18px | 18px | 15px |
| `.project-page__heading` (заголовки секций) | — | — | — |

---

## Адаптив

- **>1024px** — двухколоночный грид `.layout` (aside + main);
- **≤1024px** — одна колонка; видео скрывается → показывается `project__media-poster` (img);
- **≤480px** — уменьшенные отступы и шрифты.

---

## Стили медиа на страницах проектов

`.project-page__media-inner` имеет:
- `border-radius: 2rem` + `overflow: hidden` — закругления (применено и в `≤1024px` медиа‑запросе, иначе перекрывается);
- `box-sizing: border-box` — обязательно, иначе padding + width:100% → переполнение.

### Как оформлять фото

- Структура:
  - `section.project-page__media > .container > .project-page__media-inner > img.project-page__img`
  - Под блоком внутри того же `section` всегда идёт подпись: `<p class="project-page__caption">…</p>`.
- `img` **всегда** с относительным путём `../img/...` и осмысленным `alt` (что показано и в контексте какого раздела).
- Если нужно фото **и** видео по одной теме, используются **два отдельных** `section.project-page__media` подряд: первое с `img`, второе с `video` (у каждого свой `project-page__caption`).

### Как оформлять видео

- Структура:
  - `section.project-page__media > .container > .project-page__media-inner > video`
  - После контейнера — подпись: `<p class="project-page__caption">…</p>`.
- Атрибуты `video`: `autoplay muted loop playsinline`.
- Постер задаётся через `poster="../img/..."` и должен соответствовать таблице медиафайлов выше.
- Сам файл видео подключается из `../resource/...` через `<source src="..." type="video/mp4" />`.

---

## Критические исправления (не откатывать)

1. `.work .container` в `@media (max-width: 1024px)` — `box-sizing: border-box`, иначе переполнение на 64px вправо.
2. `.project-page__media .container` — `box-sizing: border-box` + явный padding для каждого брейкпоинта.
3. `min-width: 0` у `.work .project .layout__main` и `.work .project__media` — иначе грид не сжимается.
4. `border-radius` у `.project-page__media-inner` прописан как в базовых стилях, так и в `@media (max-width: 1024px)` — иначе медиа‑запрос сбрасывает его.

---

## CSS reset

`reset.css` сбрасывает `font: inherit` на всех элементах, включая `<strong>`. Поэтому жирность задаётся явно:  
`.experience-card__description strong { font-weight: 700 }`.

---

## Опыт работы — структура карточек

Каждая карточка опыта работы использует `<ul class="project-page__list">` для списков внутри `.experience-card__description`.  
Заголовки «Обязанности:» и «Достижения:» обёрнуты в `<p><strong>...</strong></p>`.

---

## Пути к ресурсам в партиалах

- Внутри `src/partials/**` для CSS/JS/медиа используются **абсолютные** пути `/css/`, `/img/`, `/js/`, `/resource/` — так одинаково работает и в dev, и при деплое в корень домена.
- В `projects/*.html` пути к медиа — **относительные** `../img/`, `../resource/`.

---

## Multi-page регистрация (vite.config.js)

При добавлении новой страницы нужно зарегистрировать её во входных точках Vite:

```js
newpage: path.resolve(__dirname, 'projects/project-new.html'),
```

---

## Favicon и OG‑теги

### Статические файлы (`public/`)

Файлы из `public/` отдаются с корня домена (`/`). Туда кладутся:

- `favicon.svg` — основной favicon (приоритет в браузерах);
- `favicon.ico` — для старых браузеров;
- `favicon-32x32.png`, `favicon-16x16.png`;
- `apple-touch-icon.png` — 180×180 px, для iOS;
- `og-image.jpg` — 1200×630 px, для шаринга в соцсетях (уже лежит).

### OG‑теги (`src/partials/head-meta.html`)

Теги уже прописаны. После деплоя нужно заменить плейсхолдер:

```html
<meta property="og:url" content="https://your-domain.com/" />
<meta property="og:image" content="https://your-domain.com/og-image.jpg" />
```
