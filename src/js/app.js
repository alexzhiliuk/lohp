// import * as flsFunctions from './modules/functions.js';

// import * as mask from '../libs/phoneMask.js'

// flsFunctions.isWebp()

import '../libs/header/scroll.js';

$('.header__burger').on('click', function() {
    $('.header').toggleClass('header_open');
    $('body').toggleClass('lock');
});

// Questions section — fade in + card spread
const questionsSection = document.querySelector('.questions');
if (questionsSection) {
    const questionsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const header = questionsSection.querySelector('.questions__header');
                const cards = questionsSection.querySelector('.questions__cards');

                if (header) header.classList.add('questions__header_visible');

                setTimeout(() => {
                    if (cards) cards.classList.add('questions__cards_spread');
                }, 300);

                questionsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    questionsObserver.observe(questionsSection);
}
