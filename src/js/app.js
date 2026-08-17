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
