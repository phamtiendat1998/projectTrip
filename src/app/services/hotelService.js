import $ from 'jquery';
export function HotelService() {
    // GET LIST CITY
    this.getListHotel = function () {
        var url = "./../data/Hotel.json";
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url
        });
    };
}