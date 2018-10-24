export function Country(idVar, nameVar, areaVar, termVar, introVar, arrayImg, xVar, yVar) {
    this.Id = idVar;
    this.Name = nameVar;
    this.Area = areaVar;
    this.Term = termVar;
    this.Intro = introVar;
    this.Image = arrayImg;
    this.Location = {
        X: xVar,
        Y: yVar
    };
}