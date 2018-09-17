import $ from 'jquery';
//EVENT CLICK LET-GO
$('.btn-home').click(function () {
    $('.header__nav--top').css({
        'transform': 'translateY(0)'
    });
    $('.header__nav--bot').css({
        'transform': 'translateY(0)'
    });
    $('.content').css({
        'display': 'block'
    })
});
//EVENT CLICK FLY
$('.fly').click(function () {
    $('.fly').addClass('activeNavBot');
    $('.home-fly__left').css({
        'transform': 'translateX(0)'
    })
    $('.home-fly__right').css({
        'transform': 'translateX(0)'
    })
});
// EVENT MOVEMOUSE
$('.full-views').mousemove(function (e) {
    var valueX = (e.pageX * -1 / 12);
    var valueY = (e.pageY * -1 / 12);
    $('.full-views__background--airplane').css({
        'transform': 'translate3d(' + valueX + 'px,' + valueY + 'px,0)'
    });
});