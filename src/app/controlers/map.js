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
$('.map').mousemove(function (e) {
    var offsetTop = $(this).offset().top;
    var offsetLeft = $(this).offset().left;
    // console.log(e.pageX);
    // console.log(e.pageY);
    var width = $(this).width();
    var height = $(this).height();
    var possX = width - (e.pageX - offsetLeft);
    var possY = height - (e.pageY - offsetTop);
    // console.log(possX / width * 100);
    // console.log(possY / height * 100);
});
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
        'opacity': '0'
    });
});
$('body').delegate('.location-icon', 'mouseleave', function () {
    $(this).parent().css({
        'z-index': '100'
    });
    $(this).parent().find('.location-content').css({
        'opacity': '1'
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
$('body').delegate('.location-country-child', 'mouseenter', function () {
    showFlightLine(this);
});
$('body').delegate('.location-country-child', 'mouseleave', function () {
    $(".svgMap").remove();
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
export function offSugFromInput() {
    $('.input-from__suggest').css({
        "display": "none"
    });
};

function onSugFromInput() {
    $('.input-from__suggest').css({
        "display": "block"
    });
};

export function offSugToInput() {
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
        $('.input-range').css({
            'display': 'flex'
        });
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
function showFlightLine(ele) {
    // GET WIDTH HEIGHT MAP
    var witdhBG = $(".map").width();
    var heightBG = $(".map").height();


    // POSITION POINT MAIN
    var topMain = $(".location-country-main").position().top;
    var leftMain = $(".location-country-main").position().left;
    // POSITION POINT CHILD
    var topChild = $(ele).position().top;
    var leftChild = $(ele).position().left;

    // TÍNH CẠNH GÓC VUÔNG
    var canhGocVuongLon = Math.abs(leftMain - leftChild);
    var canhGocVuongNho = Math.abs(topMain - topChild);

    // TÍNH CẠNHH HUYỀN
    var canhHuyen = Math.sqrt(Math.pow(canhGocVuongLon, 2) + Math.pow(canhGocVuongNho, 2));

    // TÍNH VỊ TRÍ CỦA SVG
    var widthTop = Math.abs((topMain - topChild) / 2);
    var widthLeft = Math.abs((leftMain - leftChild) / 2);
    var possTopSVG;
    var possLeftSVG;
    var gocGanTam;
    var gocRotate;
    // SET POSSITION SVG
    if (topMain - topChild > 0) {
        if (leftMain - leftChild > 0) {
            possTopSVG = widthTop + topChild;
            possLeftSVG = widthLeft + leftChild;
            gocGanTam = (possTopSVG - topMain) / (canhHuyen / 2);
            gocRotate = Math.asin(gocGanTam) * 180 / Math.PI;
            createSVG(canhHuyen, possTopSVG, possLeftSVG, gocRotate);
        } else if (leftMain - leftChild < 0) {
            possTopSVG = widthTop + topChild;
            possLeftSVG = widthLeft + leftMain;
            gocGanTam = (possTopSVG - topChild) / (canhHuyen / 2);
            gocRotate = Math.asin(gocGanTam) * 180 / Math.PI + 180;
            createSVG(canhHuyen, possTopSVG, possLeftSVG, gocRotate);
        }
    } else if (topMain - topChild < 0) {
        if (leftMain - leftChild > 0) {
            possTopSVG = widthTop + topMain;
            possLeftSVG = widthLeft + leftChild;
            gocGanTam = (possTopSVG - topMain) / (canhHuyen / 2);
            gocRotate = Math.asin(gocGanTam) * 180 / Math.PI;
            createSVG(canhHuyen, possTopSVG, possLeftSVG, gocRotate);
        } else if (leftMain - leftChild < 0) {
            possTopSVG = widthTop + topMain;
            possLeftSVG = widthLeft + leftMain;
            gocGanTam = (possTopSVG - topChild) / (canhHuyen / 2);
            gocRotate = Math.asin(gocGanTam) * 180 / Math.PI + 180;
            createSVG(canhHuyen, possTopSVG, possLeftSVG, gocRotate);
        }
    }
}
function createSVG(canhHuyen, possTopSVG, possLeftSVG, gocRotate) {
    var content = `<svg style="width:${canhHuyen}px;top:${possTopSVG}px;left:${possLeftSVG}px" class="svgMap" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 653.99 165.3">
            <defs>
                <style> 
                    .cls-1 {
                        fill: none;
                        stroke: #231f20;
                        stroke-miterlimit: 10;
                        stroke-width: 4px;
                    }
                </style>
            </defs>
            <title>Untitled-1</title>
            <image width="512" height="512" transform="translate(280.21 86.12) rotate(-50.31) scale(0.13)" xlink:href="data:image/png;base64,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" />
            <path class="cls-1 path-1" d="M739.7,302.06c-24.8,21.46-79.82,62.21-153.94,60.9-70.14-1.25-122.22-39.53-146.91-60.9"
                transform="translate(-87.02 -199.69)" />
            <path class="cls-1 path-2" d="M88.33,262.9c24.8-21.56,79.82-62.5,154-61.18,70.13,1.25,122.22,39.71,146.9,61.18"
                transform="translate(-87.02 -199.69)" />
        </svg>`;
    $(".map__content").append(content);
    var heightSVG = $(".svgMap").height();
    $(".svgMap").css({
        "transform": `translate(${-canhHuyen / 2}px,${-heightSVG / 2}px) rotate(${-gocRotate}deg)`
    });
}