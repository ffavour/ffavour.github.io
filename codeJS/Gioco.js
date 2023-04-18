class Gioco {
    static numeroQuadradini = 2;

    constructor(brano) { //bitchess (tesio mi sa che il costruttore è da rifare)
        this.brano = brano;
        this.velocità = 0;
        this.punteggio = 0;
        this.errori = 0;

        this.quadratini = [];



        /*
        this.posInSorteggio è un attributo che contiene il punto un cui
        verra fatto un ulteriore sorteggio della posizione di un "quadratino"
        assieme alla velocità di movimento questo incide sulla
        difficoltà di gioco
         */
    }





    //disegna il cursore magik nella schermata di gioco
    drawKeypointsGioco() { // la punta dell'indice ha valore 12 ed è quindi il dito indice per il limite sotto invece è 0

        if (debug) { //fino alla 74 solo per fare i vari calcoli della mano
            var posYmin = 100000; //--> corrisponde al dito piu altro (solo in fase di test)
            var posYmax = 0; //--> corrisponde alla parte piu bassa del palmo
            var valueMax;
            var valueMin;
        } else {

            noStroke();

            for (let i = 0; i < predictions.length; i += 1) {
                const prediction = predictions[i];
                //i valori importanti sono quelli del 12 e del 0
                //occore fare una media tra i due per trovare un punto centrale
                //e poi disegnare il cursore
                const keypoint1 = prediction.landmarks[0];
                const keypoint2 = prediction.landmarks[12];
                var premuto = false;

                var midd = puntoMedio(keypoint1[0] * (1300 / 640), keypoint1[1] * (700 / 480), keypoint2[0] * (1300 / 640), keypoint2[1] * (700 / 480));

                var d  = dist(keypoint1[0] * (1300 / 640), keypoint1[1] * (700 / 480), keypoint2[0] * (1300 / 640), keypoint2[1] * (700 / 480));
                if(d < 100){
                    premuto = true;
                }


                //console.log(midd);
                if(premuto){
                    image(cursoreGiocoPremuto,0, midd.y, 1300, 70);
                }else{
                    image(cursoreGiocoRilasciato,0, midd.y, 1300, 70)
                }

                console.log(midd);

                var x1 = midd.x = width - midd.x;
                var y1 = midd.y;

                if (debug) {
                    for (let j = 0; j < prediction.landmarks.length; j += 1) {
                        const keypoint = prediction.landmarks[j];
                        fill(0, 255, 0);

                        // Adatta le coordinate dei punti chiave alla scala della finestra
                        const x = keypoint[0] * (1300 / 640);
                        const y = keypoint[1] * (700 / 480);
                        const x_magica = width - x;
                        if (debug) {

                            if (y < posYmin) {
                                posYmin = y;
                                valueMin = j;
                                console.log(y);
                            } else if (y > posYmax) {
                                valueMax = j;
                                posYmax = y
                                console.log(y);
                            }
                        }
                        if (j == 12) {
                            fill(255, 0, 0);
                            ellipse(x_magica, y, 10, 10);
                        } else if (j == 0) {
                            fill(200, 50, 255);
                            ellipse(x_magica, y, 10, 10);
                        } else {
                            ellipse(x_magica, y, 10, 10);
                        }
                    }
                }


            }
        }
        if (debug) {
            console.log("posizione dell'indice (piu in alto) " + valueMin);
            console.log("posizione del palmo (piu in basso)" + valueMin);
        }
        return ({x1, y1, premuto});
    }
}
