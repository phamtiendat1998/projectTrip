export function ListHotel() {
    this.DSHT = [];
    // ADD HOTEL
    this.AddHotel = function (hotel) {
        this.DSHT.push(hotel);
    }
    // GET HOTEL
    this.GetHotel = function (hotel) {
        for (var i = 0; i < this.DSHT.length; i++) {
            if (this.DSHT[i].Id == hotel) {
                return this.DSHT[i];
            }
        }
    }
    // GET HOTEL BY COUNTRY
    this.GetHotelByCountry = function (country) {
        var searchList = new ListHotel();
        for (var i = 0; i < this.DSHT.length; i++) {
            if (this.DSHT[i].Country == country) {
                searchList.DSHT.push(this.DSHT[i]);
            }
        }
        return searchList.DSHT;
    }
}