class Brano{
    static branoCorrente = 0;
    constructor(brano, img, titolo, autore, dim, posX, posY) {
        this.brano = brano;     //ogetto contenente il brano.mp3
        this.img = img;         //copertina brano
        this.titolo = titolo;   //titolo brano
        this.autore = autore;
        this.dim = dim;         //dimensione immagine copertina
        this.posX = posX;
        this.posY = posY;


    }



    //"disegna" la copertina del brano insieme a titolo e autore
    drawBrano(){
        image(this.img, this.posX, this.posY, this.dim, this.dim);
        textSize(50);
        textAlign(CENTER);
        fill('white');
        textFont(fontBrani);
        console.log("titolo " + this.titolo + " autore " + this.autore + " font " + fontBrani);
        text(this.titolo + "  -  " + this.autore, 650, 550);
    }

}