export function ListCountry() {
    this.DSCT = [];
    // ADD COUNTRY
    this.AddCountry = function (country) {
        this.DSCT.push(country);
    }
    // RESET COUNTRY
    this.ResetCountry = function () {
        this.DSCT = [];
    }
    // GET COUNTRY
    this.GetCountry = function (country) {
        for (var i = 0; i < this.DSCT.length; i++) {
            if (this.DSCT[i].Id == country) {
                return this.DSCT[i];
            }
        }
    }
    // SEARCH COUNTRY (ID OR NAME)
    this.SearchCountry = function (key) {
        var searchList = new ListCountry();
        var searchKey = key.trim().toLowerCase();
        for (var i = 0; i < this.DSCT.length; i++) {
            if (this.DSCT[i].Id.trim().toLowerCase().search(searchKey) !== -1 || this.DSCT[i].Name.trim().toLowerCase().search(searchKey) !== -1) {
                searchList.DSCT.push(this.DSCT[i]);
            }
        }
        return searchList;
    }
}