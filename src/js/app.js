// import * as flsFunctions from './modules/functions.js';

// import * as mask from '../libs/phoneMask.js'

// flsFunctions.isWebp()

import '../libs/header/scroll.js';
import Swiper from 'swiper';

$('.header__burger').on('click', function() {
    $('.header').toggleClass('header_open');
    $('body').toggleClass('lock');
});

// Questions section — fade in + card spread / swiper
const questionsSection = document.querySelector('.questions');
if (questionsSection) {
    const MOBILE_BP = 576;
    let questionsSwiper = null;

    function initQuestionsSwiper() {
        if (window.innerWidth < MOBILE_BP && !questionsSwiper) {
            questionsSwiper = new Swiper('.questions__slider', {
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: -20,
                initialSlide: 2,
            });
        } else if (window.innerWidth >= MOBILE_BP && questionsSwiper) {
            questionsSwiper.destroy(true, true);
            questionsSwiper = null;
        }
    }

    const questionsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const header = questionsSection.querySelector('.questions__header');
                const cards = questionsSection.querySelector('.questions__cards');

                if (header) header.classList.add('questions__header_visible');

                if (window.innerWidth >= MOBILE_BP) {
                    setTimeout(() => {
                        if (cards) cards.classList.add('questions__cards_spread');
                    }, 300);
                }

                questionsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    questionsObserver.observe(questionsSection);
    initQuestionsSwiper();
    window.addEventListener('resize', initQuestionsSwiper);
}

// Practitioners slider
const VISUAL_GAP = 20;
const SCALES = [1, 0.85, 0.73, 0.63, 0.55];
const SLIDE_W = 354;
let practitionersSwiper = null;

function getScaleForProgress(p) {
    const abs = Math.min(Math.abs(p), SCALES.length - 1);
    const low = Math.floor(abs);
    const high = Math.ceil(abs);
    if (low === high) return SCALES[low];
    const t = abs - low;
    return SCALES[low] + (SCALES[high] - SCALES[low]) * t;
}

function applyPractitionersTransforms(swiper) {
    const swiperCenter = -swiper.translate + swiper.width / 2;

    swiper.slides.forEach((slide, i) => {
        const slideCenter = slide.swiperSlideOffset + SLIDE_W / 2;
        const p = (slideCenter - swiperCenter) / SLIDE_W;
        const abs = Math.abs(p);
        const scale = getScaleForProgress(p);

        let offsetX = 0;
        if (abs > 0) {
            const sign = p > 0 ? -1 : 1;
            const wholePart = Math.floor(abs);
            for (let d = 1; d <= wholePart; d++) {
                const s = SCALES[Math.min(d, SCALES.length - 1)];
                const sPrev = SCALES[Math.min(d - 1, SCALES.length - 1)];
                const extraGap = SLIDE_W * (1 - s) / 2 + SLIDE_W * (1 - sPrev) / 2;
                offsetX += extraGap - VISUAL_GAP;
            }
            const frac = abs - wholePart;
            if (frac > 0) {
                const s = getScaleForProgress(abs);
                const sPrev = getScaleForProgress(wholePart);
                const extraGap = SLIDE_W * (1 - s) / 2 + SLIDE_W * (1 - sPrev) / 2;
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
        initialSlide: 4,
        slideToClickedSlide: false,
        watchSlidesProgress: true,
        allowTouchMove: false,
        on: {
            init: function () { applyPractitionersTransforms(this); },
            setTranslate: function () { applyPractitionersTransforms(this); },
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

// Parallax flowers
const flower = document.querySelector('.questions__flower');
const flower2 = document.querySelector('.practitioners__flower');

if (flower || flower2) {
    window.addEventListener('scroll', () => {
        const viewCenter = window.innerHeight / 2;

        if (flower) {
            const rect = flower.closest('.questions').getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - viewCenter) * -0.15;
            flower.style.transform = `translateY(${offset}px)`;
        }

        if (flower2) {
            const rect = flower2.closest('.practitioners').getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - viewCenter) * -0.15;
            flower2.style.transform = `translateY(${offset}px)`;
        }
    });
}
