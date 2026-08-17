$(window).scroll(function(event){

    var st = $(this).scrollTop();
    if (st > 100){
        $(".header").addClass("header_scrolled")
    } else {
        $(".header").removeClass("header_scrolled")
    }

});