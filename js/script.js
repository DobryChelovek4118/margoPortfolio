// ==================== СТРАНИЦЫ ПРОЕКТОВ: ОТКЛЮЧЕНИЕ КАСТОМНОГО СКРОЛЛА ====================
const isProjectPage = document.body.classList.contains('page--project');

if (isProjectPage) {
    // На страницах проектов отключаем стандартное восстановление скролла
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
}

const mail = document.querySelector('.footer__email');
if (mail) {
    function revealEmail() {
        const user = mail.dataset.user;
        const domain = mail.dataset.domain;
        mail.href = `mailto:${user}@${domain}`;
        mail.textContent = `${user}@${domain}`;
    }
    mail.addEventListener('mouseenter', revealEmail);
    mail.addEventListener('focus', revealEmail);
    mail.addEventListener('click', revealEmail);
}

// ==================== ОПРЕДЕЛЕНИЕ МОБИЛЬНОГО УСТРОЙСТВА ====================

function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'android',
        'webos',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone',
        'mobile',
    ];

    return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

// Флаг для отключения кастомного скролла на малых экранах (мобильная/планшет)
let isSmallScreen = window.innerWidth <= 1024;
window.addEventListener('resize', () => {
    isSmallScreen = window.innerWidth <= 1024;
});

// ==================== ПРОСТОЙ И НАДЕЖНЫЙ ПОДХОД ====================

// Все секции в порядке (только для главной страницы)
const sections = isProjectPage ? [] : [
    document.getElementById('hero'),
    document.getElementById('work-1'),
    document.getElementById('work-2'),
    document.getElementById('work-3'),
    document.getElementById('about'),
    document.querySelector('.experience'),
    document.querySelector('.footer'),
].filter(Boolean);

let currentIndex = 0; // Индекс текущей секции
let isScrolling = false;
let isInSlideMode = true; // true для hero и work, false для остальных
let lastScrollTime = 0;

// ==================== БАЗОВЫЕ ФУНКЦИИ ====================

function setScrollLock(locked) {
    if (isProjectPage) return;
    if (locked) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
}

// Найти, какая секция сейчас в области видимости
function getCurrentSectionIndex() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const sectionBottom = sectionTop + rect.height;

        // Если середина экрана находится в пределах секции
        const viewportCenter = scrollTop + viewportHeight / 2;
        if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            return i;
        }
    }
    return 0;
}

// Прокрутить к секции
function scrollToSection(index, instant = false) {
    if (index < 0 || index >= sections.length || isScrolling) return;

    isScrolling = true;
    currentIndex = index;
    const target = sections[index];
    if (!target) {
        isScrolling = false;
        return;
    }

    // Определяем режим (hero + три работы = индексы 0–3)
    if (index < 4) {
        isInSlideMode = true;
        setScrollLock(true);
    } else {
        // about, experience, footer
        isInSlideMode = false;
        setScrollLock(false);
    }

    target.scrollIntoView({
        behavior: instant ? 'auto' : 'smooth',
        block: 'start',
    });

    setTimeout(
        () => {
            isScrolling = false;
        },
        instant ? 100 : 700,
    );
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

if (sections.length > 0 && !isSmallScreen && !isProjectPage) {
    window.addEventListener('load', () => {
        // Проверяем, есть ли якорь в URL
        const hash = window.location.hash.replace('#', '');
        let targetIndex = 0;
        
        if (hash === 'work' || hash === 'work-1') targetIndex = 1;
        else if (hash === 'work-2') targetIndex = 2;
        else if (hash === 'work-3') targetIndex = 3;
        else if (hash === 'about') targetIndex = 4;
        else {
            targetIndex = getCurrentSectionIndex();
        }
        
        currentIndex = targetIndex;
        isInSlideMode = currentIndex < 4;
        setScrollLock(isInSlideMode);
        
        // Если есть якорь, прокручиваем к нужной секции
        if (hash && sections[targetIndex]) {
            sections[targetIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    });
}

// ==================== ОБРАБОТКА НАВИГАЦИИ ====================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').replace('#', '');

        let targetIndex = -1;
        if (targetId === 'work' || targetId === 'work-1') targetIndex = 1;
        else if (targetId === 'work-2') targetIndex = 2;
        else if (targetId === 'work-3') targetIndex = 3;
        else {
            sections.forEach((section, index) => {
                if (
                    section.id === targetId ||
                    section.classList.contains(targetId) ||
                    (targetId === 'contact' && section.classList.contains('footer'))
                ) {
                    targetIndex = index;
                }
            });
        }

        if (targetIndex !== -1) {
            isScrolling = false;
            scrollToSection(targetIndex);
        }
    });
});

// ==================== ОБРАБОТЧИК СКРОЛЛА ====================

if (sections.length > 0 && !isSmallScreen && !isProjectPage) {
    window.addEventListener(
        'wheel',
        function (e) {
            const now = Date.now();
            if (now - lastScrollTime < 100) return;
            lastScrollTime = now;

            if (isScrolling) return;

            currentIndex = getCurrentSectionIndex();

            // Слайд-режим (hero и работы)
            if (isInSlideMode) {
                e.preventDefault();
                const direction = e.deltaY > 0 ? 1 : -1;
                const nextIndex = currentIndex + direction;
                if (nextIndex >= 0 && nextIndex < sections.length) {
                    if (nextIndex === 4 && direction === 1) {
                        isInSlideMode = false;
                        setScrollLock(false);
                    }
                    scrollToSection(nextIndex);
                }
                return;
            }

            // Обычный режим (about, experience, footer)
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            if (direction === 1) {
                if (currentIndex < sections.length - 1) {
                    scrollToSection(currentIndex + 1);
                }
            } else {
                if (currentIndex > 0) {
                    if (currentIndex === 4) {
                        isInSlideMode = true;
                        setScrollLock(true);
                        scrollToSection(3);
                    } else {
                        scrollToSection(currentIndex - 1);
                    }
                }
            }
        },
        { passive: false },
    );
}

// ==================== ОБНОВЛЕНИЕ СОСТОЯНИЯ ====================

let scrollTimeout;

if (sections.length > 0 && !isSmallScreen && !isProjectPage) {
    window.addEventListener('scroll', function () {
        if (isScrolling) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const newIndex = getCurrentSectionIndex();
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                if (currentIndex < 3 && !isInSlideMode) {
                    isInSlideMode = true;
                    setScrollLock(true);
                } else if (currentIndex >= 4 && isInSlideMode) {
                    isInSlideMode = false;
                    setScrollLock(false);
                }
            }
        }, 50);
    });
}

// ==================== TOUCH ====================

let touchStartY = 0;

if (sections.length > 0 && !isSmallScreen && !isProjectPage) {
    window.addEventListener(
        'touchstart',
        function (e) {
            touchStartY = e.touches[0].clientY;
        },
        { passive: true },
    );

    window.addEventListener(
        'touchend',
        function (e) {
            if (isScrolling) return;

            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaY) < 30) return;

            const fakeEvent = new WheelEvent('wheel', {
                deltaY: deltaY * 2,
                bubbles: true,
            });

            window.dispatchEvent(fakeEvent);
        },
        { passive: false },
    );
}

// ==================== CURSOR ====================

let cursorInitialized = false;

function initCursor() {
    const cursor = document.querySelector('.cursor');

    if (isMobileDevice()) {
        if (cursor) cursor.style.display = 'none';

        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.style.cursor = 'pointer';
        });
        document.body.style.cursor = 'auto';
        return;
    }

    if (cursorInitialized) return;
    cursorInitialized = true;

    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--link');
                if (el.querySelector('video')) {
                    cursor.classList.add('cursor--video');
                }
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--link', 'cursor--video');
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.add('cursor--hidden');
        });

        document.addEventListener('mouseenter', () => {
            cursor.classList.remove('cursor--hidden');
        });
    }
}

initCursor();

// ==================== БУРГЕР ====================

const header = document.querySelector('.header');
const burger = document.querySelector('.header__burger');
const navLinks = document.querySelectorAll('.header__nav .nav__link, .header__nav .header__contact');

if (burger && header) {
    burger.addEventListener('click', () => {
        header.classList.toggle('header--menu-open');
        burger.setAttribute('aria-expanded', header.classList.contains('header--menu-open'));
        document.body.style.overflow = header.classList.contains('header--menu-open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('header--menu-open');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('header--menu-open')) {
            header.classList.remove('header--menu-open');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ==================== АВАРИЙНОЕ ВОССТАНОВЛЕНИЕ СКРОЛЛА ====================

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        setScrollLock(false);
        isScrolling = false;
    }
});

document.addEventListener('dblclick', function () {
    setScrollLock(false);
    isScrolling = false;
});

// ==================== MEDIA FALLBACK ====================

function initProjectMediaFallback() {
    if (!isProjectPage) return;

    function showPlaceholderFor(mediaEl) {
        const wrapper = mediaEl.closest('.project-page__media-inner');
        if (!wrapper) return;

        if (wrapper.querySelector('.project-page__media-placeholder')) {
            mediaEl.style.display = 'none';
            return;
        }

        mediaEl.style.display = 'none';

        const placeholder = document.createElement('div');
        placeholder.className = 'project-page__media-placeholder';

        const title = document.createElement('p');
        title.className = 'project-page__placeholder';
        title.textContent = 'Медиа недоступно';

        const note = document.createElement('p');
        note.className = 'project-page__placeholder-note';
        note.textContent = 'Проверьте подключение к интернету или попробуйте обновить страницу.';

        placeholder.appendChild(title);
        placeholder.appendChild(note);

        wrapper.appendChild(placeholder);
    }

    const images = document.querySelectorAll('.project-page__media-inner img');
    images.forEach(img => {
        img.addEventListener('error', () => showPlaceholderFor(img));
    });

    const videos = document.querySelectorAll('.project-page__media-inner video');
    videos.forEach(video => {
        const onError = () => showPlaceholderFor(video);
        video.addEventListener('error', onError);
        video.addEventListener('stalled', onError);
        video.addEventListener('abort', onError);
    });
}

function initHomeMediaFallback() {
    if (isProjectPage) return;

    function showHomePlaceholder(mediaEl) {
        const wrapper =
            mediaEl.closest('.project__media') ||
            mediaEl.closest('.about__media') ||
            mediaEl.parentElement;
        if (!wrapper) return;

        if (wrapper.querySelector('.home-media-placeholder')) {
            mediaEl.style.display = 'none';
            return;
        }

        mediaEl.style.display = 'none';

        const placeholder = document.createElement('div');
        placeholder.className = 'home-media-placeholder';

        const title = document.createElement('p');
        title.className = 'home-media-placeholder__title';
        title.textContent = 'Медиа недоступно';

        const note = document.createElement('p');
        note.className = 'home-media-placeholder__note';
        note.textContent = 'Проверьте подключение к интернету или попробуйте обновить страницу.';

        placeholder.appendChild(title);
        placeholder.appendChild(note);

        wrapper.appendChild(placeholder);
    }

    const images = document.querySelectorAll('.work .project__media img, .about__media .about__img');
    images.forEach(img => {
        img.addEventListener('error', () => showHomePlaceholder(img));
    });

    const videos = document.querySelectorAll('.work .project__media video');
    videos.forEach(video => {
        const onError = () => showHomePlaceholder(video);
        video.addEventListener('error', onError);
        video.addEventListener('stalled', onError);
        video.addEventListener('abort', onError);
    });
}

// ==================== MEDIA MODAL ====================

function initProjectMediaModal() {
    if (!isProjectPage) return;
    if (!isMobileDevice()) return;

    const mediaElements = document.querySelectorAll('.project-page__media-inner img, .project-page__media-inner video');
    if (!mediaElements.length) return;

    const modal = document.createElement('div');
    modal.className = 'project-media-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Просмотр медиа');

    const inner = document.createElement('div');
    inner.className = 'project-media-modal__inner';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'project-media-modal__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.innerHTML = '×';

    const captionEl = document.createElement('div');
    captionEl.className = 'project-media-modal__caption';

    inner.appendChild(closeBtn);
    modal.appendChild(inner);
    modal.appendChild(captionEl);
    document.body.appendChild(modal);

    let currentMedia = null;
    let scale = 1;
    let startScale = 1;
    let translateX = 0;
    let translateY = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let pinchStartDistance = 0;

    function applyTransform() {
        if (!currentMedia) return;
        currentMedia.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    }

    function resetTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    }

    function closeModal() {
        modal.classList.remove('project-media-modal--open');
        document.body.style.overflow = '';
        if (currentMedia && currentMedia.tagName === 'VIDEO') {
            currentMedia.pause();
        }
        if (currentMedia && currentMedia.parentNode === inner) {
            inner.removeChild(currentMedia);
        }
        currentMedia = null;
        captionEl.textContent = '';
        resetTransform();
    }

    function openModal(sourceEl) {
        // очистить предыдущее содержимое медиа, если было
        if (currentMedia && currentMedia.parentNode === inner) {
            inner.removeChild(currentMedia);
        }

        if (sourceEl.tagName === 'IMG') {
            const img = document.createElement('img');
            img.src = sourceEl.currentSrc || sourceEl.src;
            img.alt = sourceEl.alt || '';
            img.className = 'project-media-modal__media';
            currentMedia = img;
        } else if (sourceEl.tagName === 'VIDEO') {
            const video = document.createElement('video');
            video.className = 'project-media-modal__media';
            video.controls = true;
            video.playsInline = true;
            const source = sourceEl.querySelector('source');
            if (source) {
                const newSource = document.createElement('source');
                newSource.src = source.src;
                if (source.type) newSource.type = source.type;
                video.appendChild(newSource);
            }
            if (sourceEl.poster) video.poster = sourceEl.poster;
            currentMedia = video;
        } else {
            return;
        }

        inner.insertBefore(currentMedia, closeBtn);

        // подпись берём из соседнего .project-page__caption, если есть
        let captionText = '';
        const section = sourceEl.closest('.project-page__media');
        if (section) {
            const caption = section.querySelector('.project-page__caption');
            if (caption) captionText = caption.textContent.trim();
        }
        captionEl.textContent = captionText;
        captionEl.style.display = captionText ? 'block' : 'none';

        resetTransform();
        modal.classList.add('project-media-modal--open');
        document.body.style.overflow = 'hidden';

        if (currentMedia.tagName === 'VIDEO') {
            currentMedia.play().catch(() => {});
        }
    }

    // Клик по медиa на странице проекта (только на мобильных)
    if (isMobileDevice()) {
        mediaElements.forEach(el => {
            el.style.cursor = 'zoom-in';
            el.addEventListener('click', e => {
                e.preventDefault();
                openModal(el);
            });
        });
    }

    // Закрытие по крестику и клику по фону
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('project-media-modal--open')) {
            closeModal();
        }
    });

    // Жесты и зум
    function onTouchStart(e) {
        if (!currentMedia) return;
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
            isDragging = true;
        } else if (e.touches.length === 2) {
            const [t1, t2] = e.touches;
            const dx = t2.clientX - t1.clientX;
            const dy = t2.clientY - t1.clientY;
            pinchStartDistance = Math.hypot(dx, dy);
            startScale = scale;
        }
    }

    function onTouchMove(e) {
        if (!currentMedia) return;
        if (e.touches.length === 1 && isDragging && scale > 1) {
            e.preventDefault();
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            applyTransform();
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const [t1, t2] = e.touches;
            const dx = t2.clientX - t1.clientX;
            const dy = t2.clientY - t1.clientY;
            const dist = Math.hypot(dx, dy);
            if (pinchStartDistance > 0) {
                const nextScale = (startScale * dist) / pinchStartDistance;
                scale = Math.max(1, Math.min(4, nextScale));
                applyTransform();
            }
        }
    }

    function onTouchEnd(e) {
        if (e.touches.length === 0) {
            isDragging = false;
            pinchStartDistance = 0;
        }
    }

    function onWheel(e) {
        if (!currentMedia) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const nextScale = scale + delta;
        scale = Math.max(1, Math.min(4, nextScale));
        applyTransform();
    }

    function onMouseDown(e) {
        if (!currentMedia || e.button !== 0) return;
        if (scale <= 1) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    }

    function onMouseMove(e) {
        if (!currentMedia || !isDragging || scale <= 1) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    }

    function onMouseUp() {
        isDragging = false;
    }

    inner.addEventListener('touchstart', onTouchStart, { passive: true });
    inner.addEventListener('touchmove', onTouchMove, { passive: false });
    inner.addEventListener('touchend', onTouchEnd);
    inner.addEventListener('touchcancel', onTouchEnd);

    inner.addEventListener('wheel', onWheel, { passive: false });
    inner.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

// ==================== ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА ====================

let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initCursor();
        currentIndex = getCurrentSectionIndex();
    }, 250);
});


initProjectMediaFallback();
initHomeMediaFallback();
initProjectMediaModal();
