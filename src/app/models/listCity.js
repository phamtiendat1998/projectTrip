export function ListCity() {
    this.DSCT = [];
    this.AddCity = function (city) {
        this.DSCT.push(city);
    }
    this.ResetCity = function () {
        this.DSCT = [];
    }
}