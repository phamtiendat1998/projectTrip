import $ from 'jquery';

$('.map').click(function () {
    $('.map').css({
        'width': '100%',
        'height': '100%',
        'border-radius': '0',
        'cursor': 'auto'
    });
    $('.carousel-indicators').css({
        'z-index': 'auto'
    });
    $('.map__img').css({
        'height': '100%'
    })
    $('.map__txt').css({
        'display': 'none'
    })
    setTimeout(() => {
        $('#carouselHomeFly').css({
            'display': 'none'
        })
    }, 500);
});