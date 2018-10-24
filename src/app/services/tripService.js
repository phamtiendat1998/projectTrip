import $ from 'jquery';
export function TripService() {
    // GET LIST CITY
    this.getListTrip = function () {
        var url = "./../data/Trip.json";
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url
        });
    };
}