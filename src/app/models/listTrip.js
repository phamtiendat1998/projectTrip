export function ListTrip() {
    this.DSTRIP = [];
    // GET TRIP BY FROM
    this.GetTripByFrom = function (countryFrom) {
        var searchList = new ListTrip();
        for (var i = 0; i < this.DSTRIP.length; i++) {
            if (this.DSTRIP[i].From == countryFrom) {
                searchList.DSTRIP.push(this.DSTRIP[i]);
            }
        }
        return searchList.DSTRIP;
    }
    // GET TRIP BY (FROM + TO)
    this.GetTripByFromAndTo = function (countryFrom, countryTo) {
        for (var i = 0; i < this.DSTRIP.length; i++) {
            if (this.DSTRIP[i].From == countryFrom && this.DSTRIP[i].To == countryTo) {
                return this.DSTRIP[i];
            }
        }
    }
}