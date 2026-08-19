// import * as flsFunctions from './modules/functions.js';

// import * as mask from '../libs/phoneMask.js'

// flsFunctions.isWebp()

import '../libs/header/scroll.js';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

$('.header__burger').on('click', function() {
    $('.header').toggleClass('header_open');
    $('html').toggleClass('lock');
});

$('.header__overlay').on('click', function() {
    $('.header').removeClass('header_open');
    $('html').removeClass('lock');
});

// Fade-in animation for titles/subtitles
document.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                el.classList.add('fade-in_visible');
                observer.unobserve(el);
            }
        });
    }, { rootMargin: '0px 0px -30% 0px' });
    observer.observe(el);
});

// Questions section — card spread / swiper
const questionsSection = document.querySelector('.questions');
if (questionsSection) {
    const MOBILE_BP = 576;
    let questionsSwiper = null;

    function initQuestionsSwiper() {
        if (window.innerWidth < MOBILE_BP && !questionsSwiper) {
            questionsSwiper = new Swiper('.questions__slider', {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: -100,
                initialSlide: 2,
                on: {
                    slideChangeTransitionStart: function () {
                        $('.questions__slide_flipped').removeClass('questions__slide_flipped');
                    },
                },
            });
        } else if (window.innerWidth >= MOBILE_BP && questionsSwiper) {
            questionsSwiper.destroy(true, true);
            questionsSwiper = null;
        }
    }

    const cards = questionsSection.querySelector('.questions__cards');

    if (cards && window.innerWidth >= MOBILE_BP) {
        const cardsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.classList.add('questions__cards_spread');
                    cardsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        cardsObserver.observe(cards);
    }
    initQuestionsSwiper();
    window.addEventListener('resize', initQuestionsSwiper);

    // Desktop cards — click to flip (only one at a time)
    $('.questions__card').on('click', function() {
        const wasFlipped = $(this).hasClass('questions__card_flipped');
        $('.questions__card_flipped').removeClass('questions__card_flipped');
        if (!wasFlipped) $(this).addClass('questions__card_flipped');
    });

    // Mobile slides — click to flip (active only, one at a time)
    $('.questions__slide').on('click', function() {
        if ($(this).hasClass('swiper-slide-active')) {
            const wasFlipped = $(this).hasClass('questions__slide_flipped');
            $('.questions__slide_flipped').removeClass('questions__slide_flipped');
            if (!wasFlipped) $(this).addClass('questions__slide_flipped');
        }
    });
}

// Practitioners slider
const VISUAL_GAP = 20;
const DESKTOP_SCALES = [1, 0.85, 0.73, 0.63, 0.55];
const MOBILE_SCALES = [1, 0.77, 0.59, 0.45, 0.35];
const MOBILE_BP_PRACT = 576;
let practitionersSwiper = null;

function getSlideW() {
    return window.innerWidth < MOBILE_BP_PRACT ? window.innerWidth * 0.75 : 354;
}

function getScales() {
    return window.innerWidth < MOBILE_BP_PRACT ? MOBILE_SCALES : DESKTOP_SCALES;
}

function getScaleForProgress(p) {
    const scales = getScales();
    const abs = Math.min(Math.abs(p), scales.length - 1);
    const low = Math.floor(abs);
    const high = Math.ceil(abs);
    if (low === high) return scales[low];
    const t = abs - low;
    return scales[low] + (scales[high] - scales[low]) * t;
}

function applyPractitionersTransforms(swiper) {
    const slideW = getSlideW();
    const swiperCenter = -swiper.translate + swiper.width / 2;

    swiper.slides.forEach((slide, i) => {
        const slideCenter = slide.swiperSlideOffset + slideW / 2;
        const p = (slideCenter - swiperCenter) / slideW;
        const abs = Math.abs(p);
        const scale = getScaleForProgress(p);
        const scales = getScales();

        let offsetX = 0;
        if (abs > 0) {
            const sign = p > 0 ? -1 : 1;
            const wholePart = Math.floor(abs);
            for (let d = 1; d <= wholePart; d++) {
                const s = scales[Math.min(d, scales.length - 1)];
                const sPrev = scales[Math.min(d - 1, scales.length - 1)];
                const extraGap = slideW * (1 - s) / 2 + slideW * (1 - sPrev) / 2;
                offsetX += extraGap - VISUAL_GAP;
            }
            const frac = abs - wholePart;
            if (frac > 0) {
                const s = getScaleForProgress(abs);
                const sPrev = getScaleForProgress(wholePart);
                const extraGap = slideW * (1 - s) / 2 + slideW * (1 - sPrev) / 2;
                offsetX += frac * (extraGap - VISUAL_GAP);
            }
            offsetX *= sign;
        }

        slide.style.transform = `translateX(${offsetX}px) scale(${scale})`;
        slide.style.pointerEvents = abs <= 3.5 ? 'auto' : 'none';
        slide.style.zIndex = abs < 0.5 ? 3 : abs < 1.5 ? 2 : 1;
    });
}

if (document.querySelector('.practitioners__slider')) {
    practitionersSwiper = new Swiper('.practitioners__slider', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 0,
        initialSlide: 3,
        slideToClickedSlide: false,
        watchSlidesProgress: true,
        allowTouchMove: true,
        on: {
            init: function () { applyPractitionersTransforms(this); },
            setTranslate: function () { applyPractitionersTransforms(this); },
            slideChange: function () {
                const activeSlide = this.slides[this.activeIndex];
                const category = activeSlide?.dataset.category;
                if (category) {
                    $('.practitioners__filter').removeClass('practitioners__filter_active');
                    $(`.practitioners__filter[data-category="${category}"]`).addClass('practitioners__filter_active');
                }
            },
            slideChangeTransitionEnd: function () {
                $('.practitioners__card_flipped').removeClass('practitioners__card_flipped');
            },
        },
    });
}

// Practitioners card click: flip on active, navigate on others
$('.practitioners__slide').on('click', function() {
    if (!practitionersSwiper) return;
    const slideIndex = $(this).index();
    const activeIndex = practitionersSwiper.activeIndex;

    if (slideIndex === activeIndex) {
        $(this).find('.practitioners__card').toggleClass('practitioners__card_flipped');
    } else if (slideIndex < activeIndex) {
        practitionersSwiper.slidePrev();
    } else {
        practitionersSwiper.slideNext();
    }
});

// Practitioners filters
$('.practitioners__filter').on('click', function() {
    $('.practitioners__filter').removeClass('practitioners__filter_active');
    $(this).addClass('practitioners__filter_active');

    const category = $(this).data('category');
    const slides = document.querySelectorAll('.practitioners__slide');
    for (let i = 0; i < slides.length; i++) {
        if (slides[i].dataset.category === category) {
            practitionersSwiper.slideTo(i);
            break;
        }
    }
});

// Testimonials slider
if (document.querySelector('.testimonials__slider')) {
    new Swiper('.testimonials__slider', {
        modules: [Pagination],
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 40,
        loop: true,
        pagination: {
            el: '.testimonials__pagination',
            clickable: true,
        },
    });
}

// Features slider
if (document.querySelector('.features__slider')) {
    new Swiper('.features__slider', {
        modules: [Pagination],
        slidesPerView: 1,
        spaceBetween: 80,
        pagination: {
            el: '.features__pagination',
            clickable: true,
        },
    });
}

// Parallax
const heroBg = document.querySelector('.hero__bg-img');
const flower = document.querySelector('.questions__flower');
const flower2 = document.querySelector('.practitioners__flower');
const flower3 = document.querySelector('.clarity__flower');
const flower4 = document.querySelector('.garden__flower');

if (heroBg || flower || flower2 || flower3 || flower4) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const viewCenter = window.innerHeight / 2;

            if (heroBg) {
                const offset = window.scrollY * 0.4;
                heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            if (flower) {
                const rect = flower.closest('.questions').getBoundingClientRect();
                const offset = (rect.top + rect.height / 2 - viewCenter) * -0.2;
                flower.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            if (flower2) {
                const rect = flower2.closest('.practitioners').getBoundingClientRect();
                const offset = (rect.top + rect.height / 2 - viewCenter) * -0.2;
                flower2.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            if (flower3) {
                const rect = flower3.closest('.clarity').getBoundingClientRect();
                const offset = (rect.top + rect.height / 2 - viewCenter) * -0.2;
                flower3.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            if (flower4) {
                const rect = flower4.closest('.garden').getBoundingClientRect();
                const offset = (rect.top + rect.height / 2 - viewCenter) * -0.2;
                flower4.style.transform = `translate3d(0, ${offset}px, 0)`;
            }

            ticking = false;
        });
    });
}

// Clarity — animated counters
const claritySection = document.querySelector('.clarity');
if (claritySection) {
    const clarityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.clarity__stat-number').forEach(el => {
                    const target = parseFloat(el.dataset.target);
                    const decimals = parseInt(el.dataset.decimals) || 0;
                    const suffix = el.dataset.suffix || '';
                    const duration = 1000;
                    const startTime = performance.now();

                    function update(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = (target * eased).toFixed(decimals);
                        el.textContent = current + suffix;
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                });
                clarityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    clarityObserver.observe(claritySection);
}

// Header: hide on scroll down, show on scroll up + light theme over testimonials
const testimonialsSection = document.querySelector('.testimonials');
const header = document.querySelector('.header');
if (header) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const isOpen = header.classList.contains('header_open');

        // Hide/show
        if (!isOpen) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('header_hidden');
            } else {
                header.classList.remove('header_hidden');
            }
        }

        // Light theme
        if (testimonialsSection) {
            const halfHeader = header.offsetHeight / 2;
            const rect = testimonialsSection.getBoundingClientRect();
            const overlaps = rect.top < halfHeader && rect.bottom > halfHeader;
            header.classList.toggle('header_light', overlaps);
        }

        lastScrollY = currentScrollY;
    });
}
