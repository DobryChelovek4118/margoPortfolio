# Портфолио — Маргарита

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
| Работы | `src/partials/index/work.html` |
| Блог / соцсети | `src/partials/index/blog.html` |
| Контакты (футер) | `src/partials/footer-main.html` |

**Навигация:** B2C → `#work-1` (три cover-кейса), B2E → `#directions`.

**`work.html`:**
- **B2C** — `#work-1` … `#work-3`: cover-карточки (текст слева, превью справа; на мобилке — картинка сверху). Мета: дата + результаты (список).
- **B2E** — `#work-4` CRM, `#work-5` дизайн-система, `#work-6` ERM. Mini App (`project-mini-app.html`) на главной **не показывается**, проект в репозитории есть.

### Страницы проектов

Файлы страниц — в `projects/`. Контент — в партиалах `src/partials/projects/<кейс>/`.

| Страница | Файл | Партиалы |
|----------|------|----------|
| Сайт МТС (work-1) | `projects/project-e-comm.html` | `src/partials/projects/e-comm/` |
| Маркетплейс (work-2) | `projects/project-marketplace.html` | `src/partials/projects/marketplace/` |
| Провайдеры (work-3) | `projects/project-providers.html` | `src/partials/projects/providers/` |
| CRM | `projects/project-crm.html` | `src/partials/projects/crm/` |
| Mini App (не на главной) | `projects/project-mini-app.html` | `src/partials/projects/mini-app/` |
| ERM | `projects/project-erm.html` | `src/partials/projects/erm/` |
| Дизайн-система | `projects/project-design-system.html` | `src/partials/projects/design-system/` |

Файл `projects/project-*.html` — только каркас (`head`, `header`, цепочка `<include>`, `footer`). Контент кейса — в партиалах.

**E-com**: hero, process-stages, intro, analysis, research, design-and-ui, tariff-and-modals, results.

**Marketplace**: hero, intro, process-stages, research, design, results, next.

**Providers**: hero, intro, process-stages, solution, gallery, results, next.

**ERM**: hero, intro, process-stages, solution, changes, results, next.

**CRM**: hero, intro, flow, case-page, widgets, schedule, gamification, other-sections, design-system, results, next.

**Mini App**: hero, intro, metrics-and-analysis, onboarding, main-screen-and-editor, channels-profile-and-ui, next.

### Добавить новый проект

1. Скопировать любой файл из `projects/`, переименовать
2. Заменить содержимое `<main>` на контент нового проекта
3. Добавить карточку в `src/partials/index/work.html`
4. Добавить `og:title` и `og:url` в `<head>` новой страницы (см. другие `projects/project-*.html`)

Новые `projects/project-*.html` подхватываются Vite автоматически (`getRollupInputs()` в `vite.config.js`).

---

## Структура папок

```
src/partials/                ← HTML-фрагменты
  head-meta.html             ← <head> главной
  head-meta-project.html     ← <head> страниц кейсов
  header-main.html / header-project.html
  footer-main.html / footer-project.html
  loader.html
  index/                     ← hero, work, blog
  projects/
    e-comm/                  ← партиалы кейса МТС
    crm/
    mini-app/
    marketplace/
    providers/
    erm/
    design-system/

projects/                    ← HTML страниц кейсов (7 штук)
css/                         ← reset, fonts, variables, base, project-page, responsive-*
js/script.js                 ← единственный JS (ES module)

public/                      ← статика с корня сайта (/…)
  favicon, og-image.jpg
  img/                       ← WebP + arrow.svg (пути в HTML: /img/…)
  resource/                  ← .mp4 (пути: /resource/…)

fonts/                       ← VelaSans-Regular, ZT Neue Ralewe Regular + Italic

scripts/
  check-assets.mjs / check-includes.mjs / check-paths.mjs
  lib/                       ← общая логика для CLI и тестов
  compress-images.mjs
  find-unused-assets.mjs
  archive/                   ← разовые миграции

tests/
  *.test.mjs                 ← npm test
```

---

## Шрифты

Подключение — в `css/fonts.css`. В стилях:

- **VelaSans** (`fonts/VelaSans-Regular.ttf`) — основной текст: параграфы, списки, мета, навигация, лоадер.
- **ZT Neue Ralewe** (`fonts/ZT Neue Ralewe - OT/`, Regular + Italic) — заголовки и акценты: `.hero__title`, `.project__title`, `.project-page__title`, `.project-page__heading`, `.project-page__subheading`, футер.

Старый **Involve** из проекта удалён; в `project-page.css` может остаться fallback `'Involve'` в `font-family` — на рендер не влияет.

### Типографика

- Базовый текст: `--font-body` (14px), `line-height: 145%`, `letter-spacing: 0.05em`, **VelaSans**.
- Заголовки: `line-height: 128%`, `letter-spacing: 0.05em`, **ZT Neue Ralewe**.
- Подписи (`.project-page__caption`): 12px, `line-height: 130%`, **ZT Neue Ralewe Italic** (не отдельный Oblique).

### CSS‑переменные и «магические» числа

- Все ключевые размеры и отступы собраны в `css/variables.css`. Там хранятся:
  - базовая типографическая шкала и семантические токены (`--font-body`, `--font-heading-md`, `--font-display-lg`),
  - отступы и размеры контейнеров (`--space-*`, `--container-*`, `--layout-*`),
  - размеры блоков и карточек (`--project-content-max`, `--project-content-max-wide`),
  - геометрия курсора (`--cursor-size`), бургер‑меню и навигации (`--header-burger-*`, `--header-nav-padding-y-md`),
  - ширина элементов футера (`--footer-title-max-width`, `--footer-item-max-width`) и отступы декоративных элементов.
- Новые числовые значения в `css/*.css` не добавляем «вручную». Сначала заводим читаемую переменную в `variables.css`, потом используем её в стилях.

---

## Процессы и документация

- Любое изменение структуры файлов (новая папка, перенос медиа, добавление партиалов) **обязательно** нужно сразу фиксировать в этом README.
- Любые новые правила типографики, отступов, нейминга классов или подключения шрифтов тоже должны быть описаны в разделе «Типографика» или рядом по смыслу.
- При добавлении нового проекта:
  - положить медиа в `public/img/<project>/` и `public/resource/<project>/`,
  - обновить таблицу по проектам и структуру папок в README,
  - кратко описать, как подключаются новые партиалы и какие медиа к ним привязаны.

---

## Изображения (WebP-only)

Медиа лежат в **`public/img/`** и **`public/resource/`**. В HTML/CSS — абсолютные пути `/img/…`, `/resource/…` (и `.webp` в разметке).

- **Dev и build**: Vite отдаёт `public/` с корня; картинки **не** дублируются в `dist/assets/` (только шрифты из CSS попадают в assets).
- **Сжатие**: `npm run compress:images`
- **Иконки / OG**: `public/favicon*`, `public/og-image.jpg`; канонический домен — `https://margarita-product.ru`

---

## Проверки и тесты

```bash
npm test              # unit-тесты (node:test) для scripts/lib/*
npm run check:all     # ассеты + include + пути /img/
npm run test:ci       # test + check:all + build (для CI)
```

| Команда | Что делает |
|---------|------------|
| `npm run check:assets` | Все `/img/`, `/resource/` в HTML/CSS существуют в `public/` |
| `npm run check:includes` | Все `<include src="...">` резолвятся, нет циклов |
| `npm run check:paths` | Нет `../img/`, `img/` без `/`, `.png`/`.jpg` в путях |
| `npm run check:unused` | Неиспользуемые файлы в `public/img`, `public/resource` |
| `npm run compress:images` | Сжатие `.webp` в `public/img/` |

Логика проверок вынесена в `scripts/lib/` и покрыта тестами в `tests/*.test.mjs`.

---

## Стек

Vanilla HTML/CSS/JS + **Vite** как сборщик. Нет фреймворков. Нет препроцессоров.

---

## JavaScript (`js/script.js`)

- **Один файл** в корне `js/script.js` — дубликата в `public/js/` нет (иначе Vite и prod отдают разные версии).
- Подключение в `footer-main.html` и `footer-project.html`:

```html
<script type="module" src="/js/script.js"></script>
```

Абсолютный путь `/js/...` — чтобы Vite видел модуль на всех страницах (`/` и `/projects/...`) одинаково.

- В dev/build Vite обрабатывает скрипт как ES‑модуль (граф сборки, попадание в `dist/`).
- При сохранении `js/script.js` срабатывает full reload (см. `handleHotUpdate` в `vite.config.js`).
- Логика лоадера: `initLoader()` в начале файла, разметка — `src/partials/loader.html`.
- Главная: `initWorkCoverMediaHeights()` — на десктопе (≥1025px) выравнивает высоту превью трёх B2C-кейсов по самому высокому текстовому блоку.

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

### Нейминг

В каждой папке `img/<кейс>/` файлы именуются **`NN-описание.webp`** (двузначный номер + kebab-case). В HTML/CSS — тот же путь с `.webp`.

Общие ассеты главной: `img/shared/` — `hero.webp`, `work-*-loop.webp` (+ `-mobile` для ≤1024px).

### CRM (`img/crm/`, `resource/crm/`)

| Секция | Видео | Постер |
|--------|-------|--------|
| Герой | `hero.mp4` | `01-cover-poster.png` |
| Виджеты | `widgets-demo.mp4` | `08-widgets-video-poster.png` |
| Флоу обращения | `flow-demo.mp4` | `13-flow-video-poster.png` |
| График | `schedule-demo.mp4` | `19-schedule-video-poster.png` |
| Геймификация | `gamification-demo.mp4` | `16-gamification-video-poster.png` |

Статика: `02-flow-schema` … `22-news-client` (см. партиалы в `src/partials/projects/crm/`).

### МТС e-comm (`img/e-comm/`, `resource/e-comm/`)

| Секция | Видео | Постер |
|--------|-------|--------|
| Герой | `hero.mp4` | `01-cover-poster.png` |
| Карточка тарифа | `tariff-card.mp4` | `03-tariff-card-poster.png` |
| Модальные окна | `modals-demo.mp4` | `04-modals-poster.png` |

Статика: `02-process-stages`, `05-main-page`, `06-main-before-after`, `07-modals`, `08-scenarios-schema` и др.

### Публикатор (`img/mini-app/`, `resource/mini-app/`)

| Секция | Видео | Постер |
|--------|-------|--------|
| Каналы | `channels-demo.mp4` | `07-channels-video-poster.png` |
| Редактор | `editor-demo.mp4` | `08-editor-scenarios.png` (кадр) |
| Создание поста | `create-post-demo.mp4` | `10-create-post-poster.png` |
| Календарь | `calendar-demo.mp4` | `13-calendar-poster.png` |
| Темы UI | `hero.mp4` | `15-themes-video-poster.png` |

Статика: `01-cover` … `14-profile`, `11-post-themes-poster` и др.

### Маркетплейс (`img/marketplace/`, без видео)

`01-cover`, `02-process-stages`, `03-personas`, `04-user-stories`, `05-cjm`, `06-scenarios-table`, `07-site-before`, `08-wireframes`, `09-main-variants`, `10-main-current`, `11-providers-page`, `12-sim-card-flow`, `13-tariffs-page`, `14-modals`.

### Провайдеры (`img/providers/`)

`01-cover`, `02-process-stages`, `03-competitors-table`, `04-mts-megafon`, `05-beeline-template`, `06-domru`.

### ERM и дизайн-система

- `img/erm/` — `01-cover` … `08-themes` (контент в `project-erm.html`).
- `img/design-system/` — `01-cover-poster`, `02-showcase`.

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

---

## Типографика (актуальные размеры)

| Элемент | Desktop | ≤1024px | ≤480px |
|---------|---------|---------|--------|
| `.project__title` (заголовок карточки проекта) | 24px | 20px | 18px |
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

`reset.css` сбрасывает `font: inherit` на всех элементах, включая `<strong>`. Жирность в тексте кейсов задаётся через `<strong>` в разметке.

---

## Пути к ресурсам

- **Главная** (`src/partials/index/`, `head-meta.html`): абсолютные `/css/`, `/js/`, `/img/…` где нужно.
- **HTML партиалы и CSS**: абсолютные `/img/…`, `/resource/…` (файлы в `public/img`, `public/resource`).
- **CSS, JS, favicon**: `/css/…`, `/js/script.js`, `/favicon.svg` — работают с главной и из `projects/`.

---

## Multi-page (vite.config.js)

`rollupOptions.input` собирается автоматически: `index.html` + все `projects/project-*.html` (`getRollupInputs()`).

## OG и title (страницы кейсов)

`head-meta-project.html` — общие favicon, CSS, `og:image`, описание.  
В каждом `projects/project-*.html` после `<include>`:

```html
<title>Кейс …</title>
<meta property="og:title" content="Кейс … — Маргарита" />
<meta property="og:url" content="https://margarita-product.ru/projects/project-….html" />
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
