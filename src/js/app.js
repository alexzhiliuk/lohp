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
const GAP = 50;
const SCALES = [1, 0.85, 0.73, 0.63, 0.55];
const SLIDE_W = 354;
let practitionersSwiper = null;

function applyPractitionersTransforms(swiper) {
    const activeIndex = swiper.activeIndex;
    swiper.slides.forEach((slide, i) => {
        const dist = Math.abs(i - activeIndex);
        const scale = SCALES[Math.min(dist, SCALES.length - 1)];
        let offsetX = 0;
        if (dist > 0) {
            const sign = i > activeIndex ? -1 : 1;
            for (let d = 1; d <= dist; d++) {
                const s = SCALES[Math.min(d, SCALES.length - 1)];
                const prevS = SCALES[Math.min(d - 1, SCALES.length - 1)];
                offsetX += SLIDE_W * (1 - s) / 2 + SLIDE_W * (1 - prevS) / 2;
            }
            offsetX *= sign;
        }
        slide.style.transform = `translateX(${offsetX}px) scale(${scale})`;
        slide.style.pointerEvents = dist <= 1 ? 'auto' : 'none';
        slide.style.zIndex = dist === 0 ? 3 : dist === 1 ? 2 : 1;
    });
}

if (document.querySelector('.practitioners__slider')) {
    const gap = window.innerWidth <= 576 ? 20 : GAP;
    practitionersSwiper = new Swiper('.practitioners__slider', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: gap,
        initialSlide: 4,
        slideToClickedSlide: true,
        on: {
            init: function () { applyPractitionersTransforms(this); },
            slideChangeTransitionEnd: function () { applyPractitionersTransforms(this); },
        },
    });
}

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
