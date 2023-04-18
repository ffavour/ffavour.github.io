class Bottone {

    constructor(posX, posY, img, dimX, dimY, stringa) {
        this.posX = posX;
        this.posY = posY;
        this.img = img;
        this.dimX = dimX;
        this.dimY = dimY;
        this.stringa = stringa;
    }

    draw() {
        image(this.img, this.posX, this.posY, this.dimX, this.dimY);
    }

    //passa alla schermata successiva se il bottone è premuto
    premuto(staSuccessivo, schermata) {  //SCHERMATA NON E UNA STRINGA
        var obj = drawKeypoints();
        var x1 = obj.x1;
        var y1 = obj.y1;
        x1 = width - x1;
        var premuto = obj.premuto;

        if (schermata.cerca(this.stringa)) { //qui controlla se il tasto si puo premere
            if (premuto) {
                var d1 = dist(x1, y1, this.posX + this.dimX / 2, this.posY + this.dimY / 2);
                if (debug) {
                    rect(this.posX + this.dimX / 2, this.posY + this.dimY / 2, 50, 50);
                    console.log(d1 + this.stringa);
                }
                if (d1 < 150) {
                    console.log("lo stato all'interno del bottone prima" + stato + "stato in imput:" + staSuccessivo);
                    console.log("bottone: " + this.stringa);
                    stato = staSuccessivo;
                    return true;


                } else {
                    return false;
                }
            }

            if (debug)
                if (mouseIsPressed) {

                    var d = dist(mouseX, mouseY, this.posX + 100, this.posY - 50);

                    if (d < 100) {

                        stato = staSuccessivo;
                    }
                }
            console.log("lo stato all'interno del bottone dopo" + stato);
        }


    }

}



