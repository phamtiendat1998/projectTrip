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
// ----------
// EVENT MAP CLICK
$('.map').click(function () {
    mapClick();
    $(this).off("click");
});
$('.map').mousemove(function (e) {
    var offsetTop = $(this).offset().top;
    var offsetLeft = $(this).offset().left;
    var width = $(this).width();
    var height = $(this).height();
    var possX = width - (e.pageX - offsetLeft);
    var possY = height - (e.pageY - offsetTop);
    // console.log(possX);
    // console.log(possY);
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
    $('#txtFrom').val(countryFromId);
    offSugFromInput();
    $('.input-from__suggest').html("");
    fromPicked = true;
    // RESET
    listCountryTo.ResetCountry();
    // GET COUNTRY FROM
    var countryFrom = listCountry.GetCountry(countryFromId);
    // GET LIST COUNTRY TO
    listTripTo = listTrip.GetTripByFrom(countryFromId);
    for (var i = 0; i < listTripTo.length; i++) {
        var countryTo = listCountry.GetCountry(listTripTo[i].To);
        listCountryTo.AddCountry(countryTo);
    };
    loadListTripFromTo(countryFrom, listCountryTo);
});
$('body').delegate('.sug-country-to', 'click', function () {
    var countryToId = $(this).attr('data-countryid');
    $('#txtTo').val(countryToId);
    offSugToInput();
    $('.input-to__suggest').html("");
    toPicked = true;
    showBtnPickTrip();
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
        });
    }, 2000);
};
export function mapReset() {
    $('.map').css({
        'transform': 'translateY(-100%)'
    });
    $('.map').css({
        'width': '50px',
        'height': '90px',
        'cursor': 'pointer'
    });
    $('.map__img').css({
        'height': 'auto'
    })
    $('.map__txt').css({
        'display': 'block'
    })
    $('.map__content').css({
        'display': 'none'
    });
}
export function loadListCountryLocationNone(list) {
    var content = '';
    $('.map__content').html("");
    for (var i = 0; i < list.DSCT.length; i++) {
        var termLocation = parseInt(list.DSCT[i].Term);
        if (termLocation > 23) {
            content += `<div class="location-country-none" style="bottom:${list.DSCT[i].Location.Y}px;right:${list.DSCT[i].Location.X}px">
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
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        } else if (termLocation <= 23) {
            content += `<div class="location-country-none" style="bottom:${list.DSCT[i].Location.Y}px;right:${list.DSCT[i].Location.X}px">
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
                                        <p class="location__area">${list.DSCT[i].Area}</p>
                                        <p class="location__country">${list.DSCT[i].Name}</p>
                                    </div>
                                </div>`;
        };
    };
    $('.map__content').html(content);
};

function loadListTripFromTo(countrymain, list) {
    var content = "";
    $('.map__content').html("");
    var termLocationMain = parseInt(countrymain.Term);
    if (termLocationMain > 23) {
        content += `<div class="location-country-main" style="bottom:${countrymain.Location.Y}px;right:${countrymain.Location.X}px">
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
                                    </div>
                                    <div class="location-content">
                                        <p class="location__area">${countrymain.Area}</p>
                                        <p class="location__country">${countrymain.Name}</p>
                                    </div>
                                </div>`;
    } else if (termLocationMain <= 23) {
        content += `<div class="location-country-main" style="bottom:${countrymain.Location.Y}px;right:${countrymain.Location.X}px">
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
            content += `<div class="location-country-child" style="bottom:${list.DSCT[i].Location.Y}px;right:${list.DSCT[i].Location.X}px">
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
                                            <div class="d-flex align-items-center animated fadeInLeft delay-1" data-idtripto="${list.DSCT[i].Id}">
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
            content += `<div class="location-country-child" style="bottom:${list.DSCT[i].Location.Y}px;right:${list.DSCT[i].Location.X}px">
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
    if (to == "" || from == "") {
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