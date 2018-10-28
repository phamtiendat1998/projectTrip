import $ from 'jquery';
// MODEL
import {
    Country
} from '../models/Country';
import {
    Trip
} from '../models/Trip';
import {
    ListCountry
} from '../models/listCountry';
import {
    ListTrip
} from '../models/listTrip';
// SERVICE
import {
    CountryService
} from '../services/countryService';
import {
    TripService
} from '../services/tripService';
// ----------
// DECLARE
var listCountry = new ListCountry();
var listTrip = new ListTrip();
var countrySV = new CountryService();
var tripSV = new TripService();
var listTripTo = [];
var listCountryTo = new ListCountry();
var fromPicked = false;
var toPicked = false;
var openMap = false;
var valZoom = 1;
var statusPressMap = false;
var startMouseX;
var startMouseY;
var scrollLeftMap;
var scrollTopMap;
// ----------
// EVENT MAP CLICK
$('.btn-open-map').click(function () {
    mapClick();
});
// $('.map').mousemove(function (e) {
//     var offsetTop = $(this).offset().top;
//     var offsetLeft = $(this).offset().left;
//     var width = $(this).width();
//     var height = $(this).height();
//     var possX = width - (e.pageX - offsetLeft);
//     var possY = height - (e.pageY - offsetTop);
//     console.log(possX / width * 100);
//     console.log(possY / height * 100);
// });
// EVENT INPUT
$('#txtFrom').keyup(function () {
    fromPicked = false;
    getInputFrom();
    showBtnPickTrip();
});
$('#txtTo').keyup(function () {
    toPicked = false;
    getInputTo(listCountryTo);
    showBtnPickTrip();
});
$('body').delegate('.sug-country-from', 'click', function () {
    var countryFromId = $(this).attr('data-countryid');
    getListToByFrom(countryFromId);
});
$('body').delegate('.pick-country-none', 'click', function () {
    var countryFromId = $(this).attr('data-from');
    getListToByFrom(countryFromId);
});
$('body').delegate('.sug-country-to', 'click', function () {
    var countryToId = $(this).attr('data-countryid');
    $('#txtTo').val(countryToId);
    offSugToInput();
    $('.input-to__suggest').html("");
    toPicked = true;
    showBtnPickTrip();
});
$('body').delegate('.location-icon', 'mouseenter', function () {
    $(this).parent().css({
        'z-index': '900'
    });
    $(this).parent().find('.location-content').css({
        'transform': 'scale(0)'
    });
});
$('body').delegate('.location-icon', 'mouseleave', function () {
    $(this).parent().css({
        'z-index': '100'
    });
    $(this).parent().find('.location-content').css({
        'transform': 'scale(1)'
    });
});
$('body').delegate('.btn-huy-country-main', 'click', function () {
    loadListCountryLocationNone(listCountry);
    $('#txtFrom').val("");
    $('#txtTo').val("");
    fromPicked = false;
    toPicked = false;
    showBtnPickTrip();
});
$('.inputRangeMap').change(function () {
    valZoom = $(this).val() / 100;
    setDivMap(valZoom);
});
$('.btn-plus-zoom-map').click(function () {
    if (valZoom < 1.5) {
        valZoom = valZoom + 0.1;
        $('.inputRangeMap').val(valZoom * 100);
        setDivMap(valZoom);
    } else {
        return;
    }
});
$('.btn-minus-zoom-map').click(function () {
    if (valZoom > 0.7) {
        valZoom = valZoom - 0.1;
        $('.inputRangeMap').val(valZoom * 100);
        setDivMap(valZoom);
    } else {
        return;
    }
});
$(document).ready(function () {
    getData();
});
// FUNTION CHILD
function offSugFromInput() {
    $('.input-from__suggest').css({
        "display": "none"
    });
};

function onSugFromInput() {
    $('.input-from__suggest').css({
        "display": "block"
    });
};

function offSugToInput() {
    $('.input-to__suggest').css({
        "display": "none"
    });
};

function onSugToInput() {
    $('.input-to__suggest').css({
        "display": "block"
    });
};
// FUNTION MAIN
function getData() {
    listCountry.ResetCountry();
    // GET LIST COUNTRY
    countrySV.getListCountry()
        .done(function (result) {
            listCountry.DSCT = result;
            loadListCountryLocationNone(listCountry);
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
    tripSV.getListTrip()
        .done(function (result) {
            listTrip.DSTRIP = result;
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
}
export function mapClick() {
    if (openMap == false) {
        openMap = true;
        // VIEWS
        $('.map').css({
            'width': '100%',
            'height': '100%',
            'border-radius': '0 0 0 0'
        });
        $('.btn-open-map').css({
            'background-color': '#757171',
            'animation': 'btnmapGray 3s linear infinite'
        });
        $(".btn-open-map__icon").html(`<i class="fa fa-times"></i>`);
        $('.carousel-indicators').css({
            'z-index': 'auto'
        });
        $('.map__content').css({
            'display': 'block'
        });
        setTimeout(() => {
            $('.input-range').css({
                'display': 'flex'
            });
        }, 1000);
    } else {
        openMap = false;
        // VIEWS
        $('#carouselHomeFly').css({
            'display': 'block'
        });
        $('.map').css({
            'width': '0',
            'height': '0',
            'border-radius': '0 0 180% 0'
        });
        $('.btn-open-map').css({
            'background-color': 'white',
            'animation': 'btnmapWhite 3s linear infinite'
        });
        $(".btn-open-map__icon").html(`<i class="fa fa-map-o"></i>`);
        $('.carousel-indicators').css({
            'z-index': '1'
        });
        $('.map__content').css({
            'display': 'none'
        });
        $('.input-range').css({
            'display': 'none'
        });
    };
};
export function offBtnMap() {
    $('.btn-open-map').css({
        'display': 'none',
    });
}
export function onBtnMap() {
    $('.btn-open-map').css({
        'display': 'flex',
    });
}
export function loadListCountryLocationNone(list) {
    var content = '';
    $('.map__content').html("");
    for (var i = 0; i < list.DSCT.length; i++) {
        var termLocation = parseInt(list.DSCT[i].Term);
        if (termLocation > 23) {
            content += `<div class="location-country-none" style="bottom:${list.DSCT[i].Location.Y}%;right:${list.DSCT[i].Location.X}%">
                                    <div class="location-icon pick-country-none" data-from="${list.DSCT[i].Id}">
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
                                            <div class="animated fadeIn d-flex justify-content-center align-items-center">
                                                <div>
                                                    <p class="text-center"><i class="fa fa-check-circle"></i></p>
                                                    <p class="text-center">Chọn</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="location-content">
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        } else if (termLocation <= 23) {
            content += `<div class="location-country-none" style="bottom:${list.DSCT[i].Location.Y}%;right:${list.DSCT[i].Location.X}%">
                                    <div class="location-icon pick-country-none" data-from="${list.DSCT[i].Id}">
                                        <div class="location__weather animated fadeIn">
                                            <div class="icon rainy">
                                                <div class="cloud"></div>
                                                <div class="rain"></div>
                                            </div>
                                            <div class="temperature">
                                                <p class="temperature__content">${list.DSCT[i].Term}</p>
                                            </div>
                                        </div>
                                        <div class="location__event">
                                              <div class="animated fadeIn d-flex justify-content-center align-items-center">
                                                <div>
                                                    <p class="text-center"><i class="fa fa-check-circle"></i></p>
                                                    <p class="text-center">Chọn</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="location-content">
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        };
    };
    $('.map__content').html(content);
};
function getListToByFrom(from) {
    $('#txtFrom').val(from);
    offSugFromInput();
    $('.input-from__suggest').html("");
    fromPicked = true;
    // RESET
    listCountryTo.ResetCountry();
    // GET COUNTRY FROM
    var countryFrom = listCountry.GetCountry(from);
    // GET LIST COUNTRY TO
    listTripTo = [];
    listTripTo = listTrip.GetTripByFrom(from);
    for (var i = 0; i < listTripTo.length; i++) {
        var countryTo = listCountry.GetCountry(listTripTo[i].To);
        listCountryTo.AddCountry(countryTo);
    };
    loadListTripFromTo(countryFrom, listCountryTo);
}
function loadListTripFromTo(countrymain, list) {
    var content = "";
    $('.map__content').html("");
    var termLocationMain = parseInt(countrymain.Term);
    if (termLocationMain > 23) {
        content += `<div class="location-country-main" style="bottom:${countrymain.Location.Y}%;right:${countrymain.Location.X}%">
                                    <div class="location-icon">
                                        <div class="location__weather animated fadeIn">
                                            <div class="icon sunny">
                                                <div class="sun">
                                                    <div class="rays"></div>
                                                </div>
                                            </div>
                                            <div class="temperature">
                                                <p class="temperature__content">${countrymain.Term}</p>
                                            </div>
                                        </div>
                                        <div class="location__event">
                                            <div class="btn-huy-country-main animated fadeIn d-flex justify-content-center align-items-center">
                                                <div>
                                                    <p class="text-center"><i class="fa fa-times"></i></p>
                                                    <p class="text-center">Hủy</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="location-content">
                                        <p class="location__area">${countrymain.Area}</p>
                                        <p class="location__country">${countrymain.Name}</p>
                                    </div>
                                </div>`;
    } else if (termLocationMain <= 23) {
        content += `<div class="location-country-main" style="bottom:${countrymain.Location.Y}%;right:${countrymain.Location.X}%">
                                    <div class="location-icon">
                                        <div class="location__weather animated fadeIn">
                                            <div class="icon rainy">
                                                <div class="cloud"></div>
                                                <div class="rain"></div>
                                            </div>
                                            <div class="temperature">
                                                <p class="temperature__content">${countrymain.Term}</p>
                                            </div>
                                        </div>
                                        <div class="location__event">
                                            <div class="btn-huy-country-main animated fadeIn d-flex justify-content-center align-items-center">
                                                <div>
                                                    <p class="text-center"><i class="fa fa-times"></i></p>
                                                    <p class="text-center">Hủy</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="location-content">
                                        <p class="location__area">${countrymain.Area}</p>
                                        <p class="location__country">${countrymain.Name}</p>
                                    </div>
                                </div>`;
    };
    for (var i = 0; i < list.DSCT.length; i++) {
        var termLocationChild = parseInt(list.DSCT[i].Term);
        if (termLocationChild > 23) {
            content += `<div class="location-country-child" style="bottom:${list.DSCT[i].Location.Y}%;right:${list.DSCT[i].Location.X}%">
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
                                            <div class="btn-detail-trip-map d-flex align-items-center animated fadeInLeft delay-1" data-idtripto="${list.DSCT[i].Id}">
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
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        } else if (termLocationChild <= 23) {
            content += `<div class="location-country-child" style="bottom:${list.DSCT[i].Location.Y}%;right:${list.DSCT[i].Location.X}%">
                                    <div class="location-icon">
                                        <div class="location__weather animated fadeIn">
                                            <div class="icon rainy">
                                                <div class="cloud"></div>
                                                <div class="rain"></div>
                                            </div>
                                            <div class="temperature">
                                                <p class="temperature__content">${list.DSCT[i].Term}</p>
                                            </div>
                                        </div>
                                        <div class="location__event">
                                            <div class="btn-detail-trip-map d-flex align-items-center animated fadeInLeft delay-1" data-idtripto="${list.DSCT[i].Id}">
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
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        };
    };
    $('.map__content').html(content);
};

function loadListCountrySearchFrom(list) {
    var content = "";
    for (var i = 0; i < list.DSCT.length; i++) {
        content += `<div class="sug-country-from animated fadeIn" data-countryid="${list.DSCT[i].Id}">
                        <p>${list.DSCT[i].Id}</p>
                        <p>${list.DSCT[i].Name}</p>
                    </div>`;
    }
    $('.input-from__suggest').html(content);
};

function loadListCountrySearchTo(list) {
    var content = "";
    for (var i = 0; i < list.DSCT.length; i++) {
        content += `<div class="sug-country-to animated fadeIn" data-countryid="${list.DSCT[i].Id}">
                        <p>${list.DSCT[i].Id}</p>
                        <p>${list.DSCT[i].Name}</p>
                    </div>`;
    }
    $('.input-to__suggest').html(content);
};

function getInputFrom() {
    var from = $('#txtFrom').val();
    if (from == "") {
        $('#txtTo').val("");
        offSugFromInput();
        loadListCountryLocationNone(listCountry);
    } else {
        onSugFromInput();
        var listSearched = listCountry.SearchCountry(from);
        loadListCountrySearchFrom(listSearched);
    };
};

function getInputTo(list) {
    var to = $('#txtTo').val();
    var from = $('#txtFrom').val();
    if (to == "" || from == "" || fromPicked == false) {
        offSugToInput();
    } else {
        onSugToInput();
        var listSearched = list.SearchCountry(to);
        loadListCountrySearchTo(listSearched);
    };
};

function showBtnPickTrip() {
    if (fromPicked && toPicked) {
        $('.btn-pick-trip').css({
            "display": "block"
        });
    } else {
        $('.btn-pick-trip').css({
            "display": "none"
        });
    };
};
function setDivMap(valZoom) {
    var widthMapParent = $('.map').width();
    var heightMapParent = $('.map').height();
    var witdhMapChild = valZoom * widthMapParent;
    var heightMapChild = valZoom * heightMapParent;
    $('.map__img').css({
        'width': witdhMapChild,
        'height': heightMapChild,
        'margin-top': Math.abs((heightMapParent - heightMapChild) / 2),
        'margin-bottom': Math.abs((heightMapParent - heightMapChild) / 2),
        'margin-left': Math.abs((widthMapParent - witdhMapChild) / 2),
        'margin-right': Math.abs((widthMapParent - witdhMapChild) / 2)
    });
    $('.map__content').css({
        'width': valZoom * widthMapParent,
        'height': valZoom * heightMapParent,
        'margin-top': Math.abs((heightMapParent - heightMapChild) / 2),
        'margin-bottom': Math.abs((heightMapParent - heightMapChild) / 2),
        'margin-left': Math.abs((widthMapParent - witdhMapChild) / 2),
        'margin-right': Math.abs((widthMapParent - witdhMapChild) / 2)
    });
};

$(".map").mousedown(function (e) {
    statusPressMap = true;
    startMouseX = e.pageX;
    startMouseY = e.pageY;
    scrollLeftMap = $('.map').scrollLeft();
    scrollTopMap = $('.map').scrollTop();
});

$(".map").mouseup(function () {
    statusPressMap = false;
});

$(".map").mouseleave(function () {
    statusPressMap = false;
});

$(".map").mousemove(function (e) {
    if (!statusPressMap) return;
    e.preventDefault();
    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;
    var walkx = (x - startMouseX);
    var walky = (y - startMouseY)
    $('.map').scrollLeft(scrollLeftMap - walkx);
    $('.map').scrollTop(scrollTopMap - walky);
});