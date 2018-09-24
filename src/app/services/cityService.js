import $ from 'jquery';
export function CityService() {
    // GET LIST CITY
    this.getListCity = function () {
        var url = "./../data/City.json";
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url
        });
    };
}