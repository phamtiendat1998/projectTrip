import $ from 'jquery';
export function CountryService() {
    // GET LIST Country
    this.getListCountry = function () {
        var url = "./../data/Country.json";
        return $.ajax({
            type: 'GET',
            dataType: 'json',
            url: url
        });
    };
}