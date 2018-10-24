import $ from 'jquery';
import { loadListCountryLocationNone, mapClick, mapReset } from './map';
import { saveLocalStorage, getDataFromLocal, delDataFromLocal } from './../controlers/localStorage';
// MODEL
import {
    ListCountry
} from '../models/listCountry';
import {
    ListTrip
} from '../models/listTrip';
import {
    ListHotel
} from './../models/listHotel'
// SERVICE
import {
    CountryService
} from '../services/countryService';
import {
    TripService
} from '../services/tripService';
import {
    HotelService
}
    from './../services/hotelService';
// ----------
// DECLARE
var listCountry = new ListCountry();
var listTrip = new ListTrip();
var listHotel = new ListHotel();
var countrySV = new CountryService();
var tripSV = new TripService();
var hotelSV = new HotelService();
var countryCurrent;
var countryCurrentFrom;
var tripCurrent;
var listHotelCurrrent = [];
var ageAdults = 0;
var ageChildren = 0;
var ageInfants = 0;
var indexHotel = 0;
// ----------
// EVENT
$('.btn-pick-trip').click(function () {
    clickPickTrip();
    showEventDetailBook();
});
$('body').delegate('.btn-detail-trip-map', 'click', function () {
    var countryTo = $(this).attr('data-idtripto');
    $('#txtTo').val(countryTo);
    clickPickTrip();
    showEventDetailBook();
})
$('.btn-out-pick-detail').click(function () {
    clickOutPickTrip();
    hideViewDetailBook();
    loadListCountryLocationNone(listCountry);
    resetAge();
})
$('.btn-hotel-detail').click(function () {
    showContentDetailBookHotel(listHotelCurrrent);
});
$('.btn-country-detail').click(function () {
    loadCarouselCountry(countryCurrent);
});
$('.event-people__plus--adults').click(function () {
    ageAdults = plusPeople(ageAdults, ".num-people-adults");
    saveAge();
});
$('.event-people__minus--adults').click(function () {
    ageAdults = minusPeople(ageAdults, ".num-people-adults");
    saveAge();
});
$('.event-people__plus--children').click(function () {
    ageChildren = plusPeople(ageChildren, ".num-people-children");
    saveAge();
});
$('.event-people__minus--children').click(function () {
    ageChildren = minusPeople(ageChildren, ".num-people-children");
    saveAge();
});
$('.event-people__plus--infants').click(function () {
    ageInfants = plusPeople(ageInfants, ".num-people-infants");
    saveAge();
});
$('.event-people__minus--infants').click(function () {
    ageInfants = minusPeople(ageInfants, ".num-people-infants");
    saveAge();
});
$('.hotel-box--next').click(function () {
    nextHotel();
    saveLocalStorage("hotelCurrent", indexHotel);

});
$('.hotel-box--prev').click(function () {
    prevHotel();
    saveLocalStorage("hotelCurrent", indexHotel);
});
$('.hotel-box--pick').click(function () {
    pickHotel();
});
// FUNTION
function clickPickTrip() {
    $('.detail-trip').css({
        'z-index': '101'
    });
    $('#carouselHomeFly').css({
        'z-index': '100'
    });
    $('.map').css({
        'z-index': '100'
    });
    $('.detail-trip__right').css({
        'transform': 'translateX(0)'
    });
    $('.detail-trip__left').css({
        'transform': 'translateX(0)'
    });
    setTimeout(() => {
        $('#carouselHomeFly').css({
            'display': 'none'
        });
        // RESET EVENT CLICK MAP
        $('.map').click(function () {
            mapClick();
        });
        mapReset();
    }, 1500);
    getData();
};
function clickOutPickTrip() {
    $('#carouselHomeFly').css({
        'display': 'block'
    });
    $('.map').css({
        'z-index': '101'
    });
    $('.detail-trip__right').css({
        'transform': 'translateX(100%)'
    });
    $('.detail-trip__left').css({
        'transform': 'translateX(150%)'
    });
    setTimeout(() => {
        $('.detail-trip').css({
            'z-index': '100'
        });
        $('#carouselHomeFly').css({
            'z-index': '101'
        });
        $('.map').css({
            'transform': 'translateY(0)'
        });
    }, 1000);
}
function getData() {
    listCountry.ResetCountry();
    // GET LIST COUNTRY
    countrySV.getListCountry()
        .done(function (result) {
            listCountry.DSCT = result;
            showContentDetailBookCountry(listCountry);
            showViewDetailBook();
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
    // GET LIST TRIP
    tripSV.getListTrip()
        .done(function (result) {
            listTrip.DSTRIP = result;
            showContentDetailBookTrip(listTrip);
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
    // GET LIST HOTEL
    hotelSV.getListHotel()
        .done(function (result) {
            listHotel.DSHT = result;
            var country = countryCurrent.Id;
            listHotelCurrrent = listHotel.GetHotelByCountry(country);
            loadHotelBox(listHotelCurrrent[indexHotel]);
            saveLocalStorage("hotelCurrent", indexHotel);
        })
        .fail(function (errro) {
            console.log("404 Error Service!!!");
        })
};

function showViewDetailBook() {
    // VIEW
    $('.title-welcome').removeClass('animated fadeIn').addClass('animated fadeOut');
    $('.btn-pick-trip').removeClass('animated fadeIn').addClass('animated fadeOut');
    $('.title-booking').css({
        'color': 'white'
    });
    setTimeout(() => {
        $('.title-welcome').css({
            'display': 'none'
        });
        $('.btn-pick-trip').css({
            'display': 'none'
        });
        $('.home-fly__right--title').css({
            'height': '0px'
        });
        $('.home-fly__right--content').css({
            'height': '100%'
        });
    }, 500);
};
function hideViewDetailBook() {
    $('.title-welcome').removeClass('animated fadeOut').addClass('animated fadeIn');
    $('.btn-pick-trip').removeClass('animated fadeOut').addClass('animated fadeIn');
    $('.title-booking').css({
        'color': 'black'
    });
    $('.home-fly__right--title').css({
        'height': '30%'
    });
    $('.home-fly__right--content').css({
        'height': '70%'
    });
    $('.info-trip-book').css({
        "display": "none"
    });
    $('.btn-out-pick-detail').css({
        "display": "none"
    });
    $('.btn-book-seat').css({
        "display": "none"
    });
    setTimeout(() => {
        $('.title-welcome').css({
            'display': 'block'
        });
        $('#txtFrom').val("");
        $('#txtFrom').prop('disabled', false);
        $('#txtTo').val("");
        $('#txtTo').prop('disabled', false);
    }, 500);
}
function showContentDetailBookCountry(list) {
    // GET INPUT
    var inputFrom = $('#txtFrom').val();
    var inputTo = $('#txtTo').val();
    // GET COUTRY
    countryCurrent = list.GetCountry(inputTo);
    countryCurrentFrom = list.GetCountry(inputFrom);
    // CAROUSEL
    loadCarouselCountry(countryCurrent);
    // INFO COUTRY
    loadInfoCountryTo(countryCurrent);
    loadInfoCountryFrom(countryCurrentFrom);
};

function showContentDetailBookTrip(list) {
    // GET INPUT
    var inputFrom = $('#txtFrom').val();
    $('#txtFrom').prop('disabled', true);
    var inputTo = $('#txtTo').val();
    $('#txtTo').prop('disabled', true);
    // GET TRIP
    tripCurrent = list.GetTripByFromAndTo(inputFrom, inputTo);
    // INFO TRIP
    loadInfoTrip(tripCurrent);
    saveLocalStorage("tripCurrent", tripCurrent);
};

function showContentDetailBookHotel(list) {
    var hotelCurrrent = listHotelCurrrent[indexHotel];
    loadCarouselHotel(hotelCurrrent);
    loadInfoHotel(hotelCurrrent);
};

function showEventDetailBook() {
    loadInfoPeople();
    setTimeout(() => {
        $('.info-trip-book').css({
            "display": "block"
        });
        $('.btn-out-pick-detail').css({
            "display": "block"
        })
    }, 500);
};

function loadCarouselCountry(country) {
    $('.carousel-detail').html("");
    var content = "";
    for (var i = 0; i < country.Image.length; i++) {
        if (i == 0) {
            content += `<div class="carousel-item animated fadeIn active">
                                            <img class="d-block" src="${country.Image[i]}" alt="First slide">
                                        </div>`;
        } else {
            content += `<div class="carousel-item animated fadeIn">
                                            <img class="d-block" src="${country.Image[i]}" alt="First slide">
                                        </div>`;
        }
    };
    $('.carousel-detail').html(content);
};

function loadCarouselHotel(hotel) {
    $('.carousel-detail').html("");
    var content = "";
    for (var i = 0; i < hotel.ImageDesc.length; i++) {
        if (i == 0) {
            content += `<div class="carousel-item animated fadeIn active">
                                            <img class="d-block" src="${hotel.ImageDesc[i]}" alt="First slide">
                                        </div>`;
        } else {
            content += `<div class="carousel-item animated fadeIn">
                                            <img class="d-block" src="${hotel.ImageDesc[i]}" alt="First slide">
                                        </div>`;
        }
    };
    $('.carousel-detail').html(content);
};

function loadInfoCountryTo(country) {
    $('.country-detail__title--name').html(country.Name);
    $('.country-detail__content').html(country.Intro);
    $('.title--name').html(country.Name);
    $('.trip-to-country').html(country.Name);

};
function loadInfoCountryFrom(country) {
    $('.trip-from-country').html(country.Name);
}
function loadInfoHotel(hotel) {
    $('.hotel-detail__name').html(hotel.Name);
    $('.hotel-detail__location').html(hotel.Location);
    $('.hotel-detail__intro').html(hotel.Intro);
};

function loadInfoTrip(trip) {
    $('.title--day').html(trip.Time.Day);
    $('.title--night').html(trip.Time.Night);
    $('.price').html(trip.Price);
    $('.flight-hour').html(trip.TimeFlight);
    // LOAD TIME
    loadTime(trip);
};

function loadInfoPeople() {
    $('.num-people-adults').html(ageAdults);
    $('.num-people-children').html(ageChildren);
    $('.num-people-infants').html(ageInfants);
};

function loadHotelBox(hotel) {
    var content = `<img src="${hotel.ImageIcon}" alt="" class="animated flipInY">`;
    $('.hotel-box__img').html(content);
    $('.hotel-box__content--nameTxt').html(hotel.Name);
    $('.hotel-box__content--nameTxt').fadeIn();
}

function plusPeople(ageType, element) {
    ageType++;
    showBtnBookSeat(ageType, element);
    if (element == ".num-people-infants") {
        if (ageType > ageAdults) {
            ageType = ageAdults;
            return ageType;
        };
    } else if (element == ".num-people-children") {
        if (ageAdults == 0) {
            ageType = 0;
            $('.num-people-children').html(ageType);
            return ageType;
        };
    };
    $(element).html(ageType);
    return ageType;
};

function minusPeople(ageType, element) {
    ageType--;
    if (ageType <= 0) {
        ageType = 0;
        if (element == ".num-people-adults") {
            ageInfants = ageType;
            ageChildren = ageType;
            $('.num-people-infants').html(ageType);
            $('.num-people-children').html(ageType);
        };
        showBtnBookSeat(ageType, element);
        $(element).html(ageType);
        return ageType;
    } else {
        $(element).html(ageType);
        showBtnBookSeat(ageType, element);
        if (element == ".num-people-adults") {
            if (ageType < ageInfants) {
                ageInfants = ageType;
                $('.num-people-infants').html(ageInfants);
            };
        };
        return ageType;
    };
};

function nextHotel() {
    if (indexHotel == listHotelCurrrent.length - 1) {
        indexHotel = 0;
    } else {
        indexHotel++;
    };
    loadHotelBox(listHotelCurrrent[indexHotel]);
};

function prevHotel() {
    if (indexHotel == 0) {
        indexHotel = listHotelCurrrent.length - 1;
    } else {
        indexHotel--;
    };
    loadHotelBox(listHotelCurrrent[indexHotel]);
};

function pickHotel() {
    showContentDetailBookHotel(listHotelCurrrent);
    $('.nav-link-detail').removeClass('active');
    $('.tab-pane-detail').removeClass('show').removeClass('active');
    $(".btn-hotel-detail").addClass('active');
    $(".tab-pane-hotel").addClass('show active');
};
function loadTime(trip) {
    var fromStart = new Date(trip.Departure.FromStart);
    var fromEnd = new Date(trip.Departure.FromEnd);
    var toStart = new Date(trip.Departure.ToStart);
    var toEnd = new Date(trip.Departure.ToEnd);
    loadTimeGo(fromStart);
    loadTimeBack(toEnd);
    loadTimeDetailTrip(fromStart, fromEnd, toStart, toEnd);
};
function loadTimeGo(time) {
    var day = time.getDate();
    var month = time.getMonth();
    var year = time.getFullYear();
    $('.day-go').html(day);
    $('.month-go').html(month);
    $('.year-go').html(year);
};
function loadTimeBack(time) {
    var day = time.getDate();
    var month = time.getMonth();
    var year = time.getFullYear();
    $('.day-back').html(day);
    $('.month-back').html(month);
    $('.year-back').html(year);
};
function loadTimeDetailTrip(timeGoStart, timeGoEnd, timeBackStart, timeBackEnd) {
    // TIME GO START
    $('.trip-box__go--start-hour').html(timeGoStart.getHours());
    $('.trip-box__go--start-minute').html(timeGoStart.getMinutes());
    $('.trip-box__go--start-day').html(timeGoStart.getDate());
    $('.trip-box__go--start-month').html(timeGoStart.getMonth());
    $('.trip-box__go--start-year').html(timeGoStart.getFullYear());
    // TIME GO END
    $('.trip-box__go--end-hour').html(timeGoEnd.getHours());
    $('.trip-box__go--end-minute').html(timeGoEnd.getMinutes());
    $('.trip-box__go--end-day').html(timeGoEnd.getDate());
    $('.trip-box__go--end-month').html(timeGoEnd.getMonth());
    $('.trip-box__go--end-year').html(timeGoEnd.getFullYear());
    // TIME BACK START
    $('.trip-box__back--start-hour').html(timeBackStart.getHours());
    $('.trip-box__back--start-minute').html(timeBackStart.getMinutes());
    $('.trip-box__back--start-day').html(timeBackStart.getDate());
    $('.trip-box__back--start-month').html(timeBackStart.getMonth());
    $('.trip-box__back--start-year').html(timeBackStart.getFullYear());
    // TIME BACK END
    $('.trip-box__back--end-hour').html(timeBackEnd.getHours());
    $('.trip-box__back--end-minute').html(timeBackEnd.getMinutes());
    $('.trip-box__back--end-day').html(timeBackEnd.getDate());
    $('.trip-box__back--end-month').html(timeBackEnd.getMonth());
    $('.trip-box__back--end-year').html(timeBackEnd.getFullYear());
};
function showBtnBookSeat(age, element) {
    if (element == ".num-people-adults") {
        if (age >= 1) {
            $('.btn-book-seat').css({
                'display': 'block'
            });
        } else {
            $('.btn-book-seat').css({
                'display': 'none'
            });
        };
    };
};
function resetAge() {
    ageAdults = 0;
    ageChildren = 0;
    ageInfants = 0;
    $('.num-people-adults').html(ageAdults);
    $('.num-people-children').html(ageChildren);
    $('.num-people-infants').html(ageInfants);
}
function saveAge() {
    saveLocalStorage("adults", ageAdults);
    saveLocalStorage("children", ageChildren);
    saveLocalStorage("infants", ageInfants);
}