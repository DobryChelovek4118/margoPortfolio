# Changelog — улучшения проекта

Файл фиксирует изменения, сделанные в проекте во время итераций улучшений.
Если меняется структура, типографика, медиа или процессы сборки — добавлять запись сюда и обновлять `.cursor/rules/README.md`.

## 2026-05 — главная, навигация, герой

### Навигация и секции
- Шапка (главная и кейсы): **B2C** → `#work-1`, **B2E** → `#directions` (вместо E-com / «Другие направления»).
- Секция B2E на главной: заголовок **«Внутренние продукты и инструменты»**; в сетке **CRM · Дизайн-система · ERM** (3 карточки).
- **Публикатор** (mini-app) убран с главной; страница `projects/project-mini-app.html` сохранена (комментарий в `work.html`).

### Первые 3 кейса (B2C, cover)
- Ширина в контейнере, сетка как в шапке: текст слева (`--layout-aside`), медиа справа.
- Карточки: дата в одну строку; блок **Результаты** (список со страниц кейсов) вместо «Клиент» / «Метрики».
- Заголовки синхронизированы со страницами кейсов (e-comm, marketplace, providers).
- Десктоп: `initWorkCoverMediaHeights()` — одинаковая высота превью по самому высокому текстовому блоку.
- Мобилка: превью сверху, текст снизу; full-bleed + `background-size: cover`; отступ между кейсами больше, чем между текстом и картинкой.

### Герой
- Три строки: **UI/UX-дизайн** + подпись (2 строки, меньший курсив); flex + `gap`, без лишних `<br />` между подстроками.
- `hero__location`: UI/UX · B2C · B2E.

### Кейсы (контент)
- E-comm: заголовок и OG без «партнёра МТС»; результаты на главной и в `project-e-comm-results.html` обновлены.
- Providers: заголовок **«Сайты партнёрских провайдеров»**.

## 2026-05 — тесты и проверки

### Тесты
- `npm test` — unit-тесты (`node:test`) для `check-assets`, `check-includes`, `check-legacy-paths`.
- `npm run check:includes`, `npm run check:paths`, `npm run check:all`.
- `npm run test:ci` — тесты + все проверки + `vite build`.
- Логика в `scripts/lib/`; CLI: `scripts/check-*.mjs`.

### Правила Cursor
- Удалены `copywriting-*.mdc` (CRM, e-comm, mini-app).

## 2026-05 — структура, ассеты, SEO

### Оптимизация структуры
- Удалены мёртвые стили `.experience*`, `.tool-timeline*` и связанные CSS‑переменные.
- Шрифты: оставлены только используемые файлы (VelaSans Regular, ZT Neue Ralewe Regular + Italic).
- Единый домен OG: `https://margarita-product.ru`; абсолютные пути `/css/`, `/img/`, favicon в head.
- У каждого кейса свои `og:title` и `og:url` в `projects/project-*.html`.
- `public/mts-2-1-drawio.html` удалён; `.DS_Store` в `.gitignore`.
- `npm run compress:images`, `npm run check:unused`; миграции перенесены в `scripts/archive/`.
- Vite: автоматический `rollupOptions.input` для `projects/project-*.html`.
- Медиа в `public/img/` и `public/resource/` — без дубля в `dist/assets/`; пути `/img/`, `/resource/` в HTML/CSS.

## 2026-05 — JS, кейсы, медиа, шрифты, документация

### Изображения (WebP-only)
- В `img/` только `.webp` + `arrow.svg`; PNG/JPG удалены.
- Все пути в HTML/CSS переведены на `.webp` (включая hero и loop-фоны в `css/base.css`).
- Сборка: вместо автоконвертации — копирование `img/` и `resource/` в `dist/`.
- Скрипты: `to-webp-only.mjs`, `replace-img-paths-webp.mjs`; `compress-images.mjs` работает только с WebP.

### Партиалы кейсов
- Контент marketplace, providers и ERM вынесен в `src/partials/projects/{marketplace,providers,erm}/`.
- E-comm: блок «Этапы работы» → `project-e-comm-process-stages.html`.
- Страницы `projects/project-*.html` — только каркас с `<include>` (как CRM).

### JavaScript
- Один источник: `js/script.js` (слит с `public/js/script.js`, включая `initLoader`).
- Удалён дубликат `public/js/script.js`.
- Подключение: `<script type="module" src="/js/script.js">` в футерах главной и кейсов.
- HMR: изменения в `js/script.js` вызывают full reload в dev.

### Новые страницы и контент
- Добавлены кейсы: маркетплейс тарифов (`project-marketplace.html`), провайдеры (`project-providers.html`), ERM, дизайн-система.
- Главная: три карточки work (МТС, маркетплейс, провайдеры), секция `blog.html`; блоки `about` / `experience` сняты.
- Из шапки убран пункт «Соц. сети»; контент кейсов выровнен по орфографии и подписям к медиа.

### Медиа
- Миграция ассетов в `img/<кейс>/NN-описание.png` и `resource/<кейс>/*.mp4` (`scripts/migrate-assets.mjs`).
- Общие файлы — `img/shared/` (hero, loop-фоны карточек).
- Сжатие изображений и регенерация `.webp` (`scripts/compress-images.mjs`).
- Удалены неиспользуемые файлы (`scripts/find-unused-assets.mjs`); `npm run check:assets` проходит.
- Исправлен путь hero в `css/base.css` → `img/shared/hero.webp`.

### Шрифты
- Involve заменён на **VelaSans** (текст) и **ZT Neue Ralewe** (заголовки, курсивные подписи).

### Документация
- `.cursor/rules/README.md` приведён к актуальной структуре, неймингу медиа, шрифтам и скриптам.

## 2026-03 — типографика, структура, медиа, сборка

### HTML / партиалы
- Главная страница переведена на секции в `src/partials/index/` и подключается через `<include>`.
- Все страницы проектов (`CRM`, `МТС`, `Публикатор`) переведены на партиалы и подключаются через `<include>`:
  - `src/partials/projects/crm/`
  - `src/partials/projects/e-comm/`
  - `src/partials/projects/mini-app/`

### Медиа (img/resource)
- Изображения и видео разнесены по подпапкам проектов:
  - `img/crm/`, `img/e-comm/`, `img/mini-app/`
  - `resource/crm/`, `resource/e-comm/`, `resource/mini-app/`
- Все ссылки в HTML обновлены под новую структуру путей.

### Типографика
- Проект переведён на шрифты `Involve`:
  - `Involve Regular` — основной текст.
  - `Involve Medium` — заголовки и акценты.
  - `Involve Oblique` — подписи к медиа (`.project-page__caption`).
- Унифицированы параметры текста:
  - базовый текст: `line-height: 145%`, `letter-spacing: 0.05em`;
  - заголовки/акценты: `letter-spacing: 0.05em` (верхние регистры и интерфейсные элементы).

### Стили project-page
- Подписи к медиа `.project-page__caption` приведены к единому стилю (цвет, размер, max-width, отступ от медиа).
- На мобильных/планшетах уменьшено расстояние между текстовыми секциями и медиа за счёт паддингов.
- Заголовок кейса ограничен по ширине так же, как текст и мета (единая ширина).

### CSS: декомпозиция и переменные
- `css/style.css` разделён на логические модули:
  - `css/base.css` — базовые стили, сетка, общие компоненты, курсор.
  - `css/project-page.css` — layout и компоненты страниц кейсов.
  - `css/responsive-tablet.css` — адаптив для планшетов (≤1024px).
  - `css/responsive-mobile.css` — адаптив для мобильных (≤768px, ≤480px).
- Файл `css/responsive.css` оставлен как пустой плейсхолдер для совместимости (адаптив из него перенесён в два отдельных файла).
- «Магические» числовые значения (размеры курсора, бургер‑меню, ширины блоков, размеры изображений «Обо мне») вынесены в `css/variables.css`:
  - добавлены отдельные токены для контентной ширины кейсов (`--project-content-max-wide`), элементов футера (`--footer-title-max-width`, `--footer-item-max-width`),
  - добавлены токены для курсора (`--cursor-size`), бургер‑меню (`--header-burger-*`) и padding мобильного меню (`--header-nav-padding-y-md`),
  - добавлены токены для размеров изображений «Обо мне» (`--about-img-*`) и высоты плейсхолдера медиа (`--project-page-placeholder-min-height`).

### Vite / сборка / HMR
- В `vite.config.js` сохранён кастомный include-плагин для HTML (`<include src="...">`).
- Добавлен build-плагин автоконвертации изображений в WebP:
  - на `npm run build` генерируются `.webp` для картинок в `img/**` (через `sharp`);
  - ссылки в HTML подменяются на `.webp` при наличии файла.

### Производительность (HTML)
- Для изображений добавлены `loading="lazy"` и `decoding="async"` (где уместно) в партиалах и карточках проектов.
- Для видео выставлен `preload="metadata"` вместо `auto`, чтобы снизить сетевую нагрузку.
### Производительность (шрифты)
- В `css/fonts.css` для всех `@font-face` добавлен `font-display: swap`.

### Поддерживаемость
- Введён скрипт `npm run check:assets`, который проверяет существование путей к `img/**` и `resource/**` во всех HTML/партиалах.
- `line-height` и `letter-spacing` вынесены в токены в `css/variables.css` и используются в `css/style.css`.

### Документация
- `.cursor/rules/README.md` обновлён: структура партиалов, структура медиа по проектам, правила типографики, раздел про WebP, правило обязательного обновления документации при изменениях.

