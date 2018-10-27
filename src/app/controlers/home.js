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
    });
    // CALL TIME
    // var timeCurrent = new Date(2018, 11, 5, 9, 0, 0, 0);
    // var timeFlight = new Date(2018, 11, 5, 9 + 17, 0, 0, 0);
    // var timeString = timeFlight.toString();
    // var timeParse = new Date(timeString);
    // var timeBack = new Date(2018, 11, 9, 9 + 17, 0, 0, 0);
    // console.log(timeString);
    // console.log(timeParse);
    // console.log(timeBack);

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
    setTimeout(() => {
        $('.map').css({
            'transform': 'translateY(0)'
        });
    }, 500);
});
// EVENT MOVEMOUSE
$('.full-views').mousemove(function (e) {
    var valueX = (e.pageX * -1 / 12);
    var valueY = (e.pageY * -1 / 12);
    $('.full-views__background--airplane').css({
        'transform': 'translate3d(' + valueX + 'px,' + valueY + 'px,0)'
    });
});
$(window).ready(function () {
    setTimeout(() => {
        $(".loader-views").css({
            "display": "none"
        });
        $(".full-views").css({
            "display": "block"
        });
        $(".header").css({
            "display": "block"
        });
    }, 2000);
});