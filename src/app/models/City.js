export function City(idVar, nameVar, areaVar, termVar, xVar, yVar) {
    this.Id = idVar;
    this.Name = nameVar;
    this.Area = areaVar;
    this.Term = termVar;
    this.Location = {
        X: xVar,
        Y: yVar
    };
}