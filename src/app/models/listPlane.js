export function ListPlane() {
    this.DSPL = [];
    // GET PLANE BY TRIP
    this.GetPlaneByTrip = function (trip) {
        for (var i = 0; i < this.DSPL.length; i++) {
            if (this.DSPL[i].Trip == trip) {
                return this.DSPL[i]
            }
        }
    }
}