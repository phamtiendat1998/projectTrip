import $ from 'jquery';
import { saveLocalStorage, getDataFromLocal, delDataFromLocal } from './../controlers/localStorage';
// MODEL
import {
    ListPlane
} from './../models/listPlane'
// SERVICE
import {
    PlaneService
} from './../services/planeService';
// ----------
// DECLARE
var listPlane = new ListPlane();
var planeSV = new PlaneService();
var planeRecent;
var totalBookSeat;
var listVipSeat = [];
var listBusinessSeat = [];
var listNormalSeat = [];
var listBookedSeat = [];
// ----------
// EVENT
$(".btn-book-seat").click(function () {
    showView();
    getData();
});
$(".btn-out-pick-seat").click(function () {
    hideView();
})
$(".book-seat__right--area-info-seat").scroll(function () {
    var scrolLocation = $(this).scrollTop();
    var heightDivSeat = $(".book-seat__right--area-info-seat").prop("scrollHeight");
    var heightDivPlane = $(".img-plane-book-seat").height();
    var possionKhoang = 90 + ((scrolLocation / heightDivSeat * 100) * heightDivPlane / 100) / 2;
    $(".box-plane-book-seat").css({
        "top": possionKhoang
    });
});
$('body').delegate('.chair-empty', 'mouseenter', function () {
    var possitionLeft = $(this).position().left;
    $(this).css({
        "z-index": "1000"
    });
    var widthParrent = $(".book-seat__right--area-info-seat").width();
    if (possitionLeft < widthParrent / 3) {
        $(this).find("div.chair-describe").css({
            "left": "-80%"
        });
    } else if (possitionLeft > widthParrent / 3 && possitionLeft < widthParrent * 2 / 3) {
        // DONT ANYTHING
    } else {
        $(this).find("div.chair-describe").css({
            "right": "-80%"
        });
    };
});
$('body').delegate('.chair-empty', 'mouseleave', function () {
    $(this).css({
        "z-index": "1"
    });
});
$('body').delegate('.chair-empty', 'click', function () {
    var rowChair = $(this).attr("data-row");
    var colChair = $(this).attr("data-col");
    var imgChair = $(this).attr("data-img");
    var classChair = $(this).attr("data-class");
    var subChair = $(this).attr("data-sub");
    var bookedChair = $(this).attr("data-booked");
    var itemBookedSeat = {
        "Row": rowChair,
        "Col": colChair,
        "Class": classChair
    }
    if (bookedChair == "false") {
        console.log(listBookedSeat.length);
        console.log(totalBookSeat);

        if (listBookedSeat.length < totalBookSeat) {
            $(this).attr("data-row", rowChair);
            $(this).attr("data-col", colChair);
            $(this).attr("data-img", imgChair);
            $(this).attr("data-class", classChair);
            $(this).attr("data-sub", subChair);
            $(this).attr("data-booked", "true");
            listBookedSeat.push(itemBookedSeat);
            loadListBookedSeat(listBookedSeat);
            var check = `<p class="animated fadeIn"><i class="fa fa-check"></i></p>`;
            $(this).html(check);
        }
    } else {
        $(this).attr("data-booked", "false");
        var uncheck = `<img src="./../../assets/img/icon-chair/armchair-empty.svg" alt="">
                                            <div class="chair-describe animated zoomIn">
                                                <div class="chair-describe__img">
                                                    <img src="${imgChair}"
                                                        alt="">
                                                </div>
                                                <div class="chair-describe__content">
                                                    <p class="chair-class">${classChair}</p>
                                                    <p class="chair-pos"><span>${colChair}</span><span>${rowChair}</span></p>
                                                    <p class="chair-sub"><i class="fa fa-eye"></i> <span>${subChair}</span></p>
                                                </div>
                                            </div>`;
        $(this).html(uncheck);
        removeSeatInBookedSeat(itemBookedSeat);
        loadListBookedSeat(listBookedSeat);
    }
});
// ----------
// FUNCTION
function showView() {
    $(".book-seat__right").css({
        "transform": "translateX(0)"
    });
    setTimeout(() => {
        $(".book-seat__left").css({
            "transform": "translateX(0)"
        });
    }, 500);

    $(".book-seat").css({
        "z-index": "101"
    });
    $(".home-fly").css({
        "z-index": "100"
    });
    setTimeout(() => {
        $(".home-fly").css({
            "display": "none"
        });
    }, 1400);
}
function hideView() {
    $(".book-seat__left").css({
        "transform": "translateX(225%)"
    });
    $(".book-seat__right").css({
        "transform": "translateX(100%)"
    });
    $(".home-fly").css({
        "display": "block"
    });
    setTimeout(() => {
        $(".book-seat").css({
            "z-index": "100"
        });
        $(".home-fly").css({
            "z-index": "101"
        });
    }, 700);
}
function resetListSeat() {
    listVipSeat = [];
    listBusinessSeat = [];
    listNormalSeat = [];
    listBookedSeat = [];
    $(".booked-seat__seat").html("");
}
function getData() {
    var tripRecent = getDataFromLocal("tripCurrent");
    planeSV.getListPlane()
        .done(function (result) {
            resetListSeat();
            listPlane.DSPL = result;
            planeRecent = listPlane.GetPlaneByTrip(tripRecent.Id);
            loadInfoPlane(planeRecent);
            arrageSeat();
            loadSeatClass(listVipSeat, ".chair-vip");
            loadSeatClass(listBusinessSeat, ".chair-business");
            loadSeatClass(listNormalSeat, ".chair-normal");
        })
        .fail(function (error) {
            console.log("404 Error Service!!!");
        });
    totalBookSeat = parseInt(getDataFromLocal("adults")) + parseInt(getDataFromLocal("children"));
    loadTotalBookSeat(totalBookSeat);
};
function loadInfoPlane(plane) {
    $(".name-plane").html(plane.Id);
}
function loadTotalBookSeat(total) {
    $(".totalBookSeat").html(total);
}
function loadListBookedSeat(list) {
    var content = [];
    for (var i = 0; i < list.length; i++) {
        content += `<div class="booked-seat__seat--icon d-flex justify-content-center align-items-center">
                                        <p><span>${list[i].Col}</span><span>${list[i].Row}</span></p>
                                    </div>`;
    }
    $(".booked-seat__seat").html(content);
}
function arrageSeat() {
    for (var i = 0; i < planeRecent.ListSeat.length; i++) {
        if (planeRecent.ListSeat[i].Class == "Hạng nhất") {
            listVipSeat.push(planeRecent.ListSeat[i]);
        } else if (planeRecent.ListSeat[i].Class == "Thương gia") {
            listBusinessSeat.push(planeRecent.ListSeat[i]);
        } else if (planeRecent.ListSeat[i].Class == "Phổ thông") {
            listNormalSeat.push(planeRecent.ListSeat[i]);
        }
    };
};
function loadSeat(listSeat, element) {
    var content = "";
    for (var i = 0; i < listSeat.length; i++) {
        if (listSeat[i].Status == "Free") {
            var parse = JSON.stringify(listSeat[i]);
            content += `<div class="chair-icon chair-empty" data-row="${listSeat[i].Row}" data-col="${listSeat[i].Col}" data-img="${listSeat[i].Image}" data-class="${listSeat[i].Class}" data-sub="${listSeat[i].Sub}" data-booked="false">
                                            <img src="./../../assets/img/icon-chair/armchair-empty.svg" alt="">
                                            <div class="chair-describe animated zoomIn">
                                                <div class="chair-describe__img">
                                                    <img src="${listSeat[i].Image}"
                                                        alt="">
                                                </div>
                                                <div class="chair-describe__content">
                                                    <p class="chair-class">${listSeat[i].Class}</p>
                                                    <p class="chair-pos"><span>${listSeat[i].Col}</span><span>${listSeat[i].Row}</span></p>
                                                    <p class="chair-sub"><i class="fa fa-eye"></i> <span>${listSeat[i].Sub}</span></p>
                                                </div>
                                            </div>
                                        </div>`;
        } else {
            content += `<div class="chair-icon chair-taken">
                                            <img src="./../../assets/img/icon-chair/armchair-taken.svg" alt="">
                                        </div>`;
        };
    };
    $(element).html(content);
};
function loadSeatClass(listClass, element) {
    var listA = [];
    var listB = [];
    var listC = [];
    var listD = [];
    var listE = [];
    var listF = [];
    var listG = [];
    var listH = [];

    for (var i = 0; i < listClass.length; i++) {
        if (listClass[i].Col == "A") {
            listA.push(listClass[i]);
        } else if (listClass[i].Col == "B") {
            listB.push(listClass[i]);
        } else if (listClass[i].Col == "C") {
            listC.push(listClass[i]);
        } else if (listClass[i].Col == "D") {
            listD.push(listClass[i]);
        } else if (listClass[i].Col == "E") {
            listE.push(listClass[i]);
        } else if (listClass[i].Col == "F") {
            listF.push(listClass[i]);
        } else if (listClass[i].Col == "G") {
            listG.push(listClass[i]);
        } else if (listClass[i].Col == "H") {
            listH.push(listClass[i]);
        };
    };
    listA.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listB.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listC.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listD.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listE.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listF.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listG.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    listH.sort(function (a, b) {
        return parseInt(a.Row) - parseInt(b.Row);
    });
    loadSeat(listA, element + "-A");
    loadSeat(listB, element + "-B");
    loadSeat(listC, element + "-C");
    loadSeat(listD, element + "-D");
    loadSeat(listE, element + "-E");
    loadSeat(listF, element + "-F");
    loadSeat(listG, element + "-G");
    loadSeat(listH, element + "-H");
};
function removeSeatInBookedSeat(seat) {
    for (var i = 0; i < listBookedSeat.length; i++) {
        if (listBookedSeat[i].Row == seat.Row && listBookedSeat[i].Col == seat.Col) {
            listBookedSeat.splice(i, 1);
        }
    }
}