export function Trip(idVar, fromVar, toVar, priceVar, fromTimeStartVar, dayVar, nightVar, timeFlightVar) {
    this.Id = idVar;
    this.From = fromVar;
    this.To = toVar;
    this.Price = priceVar;
    this.Departure = {
        FromStart: fromTimeStartVar,
        ToStart,
        FromEnd,
        ToEnd,
    };
    this.Time = {
        Day: dayVar,
        Night: nightVar
    };
    this.TimeFlight = timeFlightVar
    // this.CalTime = function () {
    // }
}