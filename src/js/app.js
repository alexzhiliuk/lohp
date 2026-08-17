// import * as flsFunctions from './modules/functions.js';

// import * as mask from '../libs/phoneMask.js'

// flsFunctions.isWebp()

import '../libs/header/scroll.js';

$('.header__burger').on('click', function() {
    $('.header').toggleClass('header_open');
    $('body').toggleClass('lock');
});
