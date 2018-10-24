import $ from 'jquery';
export function PlaneService() {
    // GET LIST CITY
    this.getListPlane = function () {
        var url = "./../data/Plane.json";
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url
        });
    };
}