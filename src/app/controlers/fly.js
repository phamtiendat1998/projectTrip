// MODEL
import $ from 'jquery';
import {
    City
} from './../models/City';
import {
    ListCity
} from './../models/listCity';
// SERVICE
import {
    CityService
} from './../services/cityService';
// ----------
// DECLARE
var listCity = new ListCity();
var citySV = new CityService();
// ----------

$('.map').click(function () {
    listCity.ResetCity();
    // GET LIST CITY
    citySV.getListCity()
        .done(function (result) {
            listCity.DSCT = result;
            console.log(listCity.DSCT);

            loadListCity(listCity);
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
    // LOAD LIST CITY
    // VIEWS
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
    $('.map__content').css({
        'display': 'block'
    });
    setTimeout(() => {
        $('#carouselHomeFly').css({
            'display': 'none'
        })
    }, 500);
});
$('.map').mousemove(function (e) {
    var offsetTop = $(this).offset().top;
    var offsetLeft = $(this).offset().left;
    var width = $(this).width();
    var height = $(this).height();
    var possX = width - (e.pageX - offsetLeft);
    var possY = height - (e.pageY - offsetTop);
    console.log(possX);
    console.log(possY);
})

function loadListCity(list) {
    var content = '';
    $('.map__content').html("");
    for (var i = 0; i < list.DSCT.length; i++) {
        content += `<div class="location-city-child" style="bottom:${list.DSCT[i].Location.Y}px;right:${list.DSCT[i].Location.X}px">
                                    <div class="location-icon">
                                        <div class="location__weather animated fadeIn">
                                            <div class="icon sunny">
                                                <div class="sun">
                                                    <div class="rays"></div>
                                                </div>
                                            </div>
                                            <div class="temperature">
                                                <p class="temperature__content">${list.DSCT[i].Term}</p>
                                            </div>
                                        </div>
                                        <div class="location__event">
                                            <div class="d-flex align-items-center animated fadeInLeft delay-1">
                                                <p class="ml-2"><i class="fa fa-eye"></i> Xem Trip</p>
                                            </div>
                                            <div class="d-flex align-items-center animated fadeInLeft delay-2">
                                                <p class="ml-2"><i class="fa fa-share-square-o"></i> Chia sẻ Trip</p>
                                            </div>
                                            <div class="d-flex align-items-center animated fadeInLeft delay-3">
                                                <p class="ml-2"><i class="fa fa-check"></i> Đặt ngay</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="location-content">
                                        <p class="location__country">${list.DSCT[i].Area}</p>
                                        <p class="location__city">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
    }
    $('.map__content').html(content);
}