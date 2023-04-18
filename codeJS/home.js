//cose per il canvas
let height = 700
let width = 1300
//cose per la videocamera
let height_init = 480
let widht_init = 640

let primo = true // mi serve per gestire il brano durante il gioco nella funzione gestisciBraniNelGioco()
let stopDraw = false;




//immagini di sfondo
let sfondoPricipale
let sfondoSecondario
let sfondoCanzone
let sfondoInfo;
let sfondoSettings
let sfondoGioco

let immagineSpartito;
let immagineSfumaturaSpartito;
let vettoreQbase;

//immagini dei bottoni
let bottoneImpostazini_image
let bottoneRepImg
let bottoneHomeImg
let bottoneinfoImg
let bottonePlayImg
let bottonePauseImg
let scorreDxImg
let scorreSxImg
let bottoneStartImg
let bottoneAvantiImg
let bottoneIndietroImg

//immagini quadratini
let quadratinoImg
let quadratinoPremutoImg

//immagini dei cursori
let cursorePremuto;
let cursoreRilasciato;
let cursoreGiocoRilasciato;
let cursoreGiocoPremuto;
let rettangoloLateralePremuto;
let rettangoloLateraleRilasciato;

//bottoni nelle varie schermate (oggetti)
let bottoneSettings
let bottoneStart  //o play sono la stessa cosa
let bottonePause
let bottoneHome
let bottoneReplay
let bottoneInfo
let bottoneScorreDX
let bottoneScorreSX
let bottoneIndietro
let bottoneAvanti

//oggetti schermate (servono per controllare
// che i bottoni siano premibili nelle varia schermate)
let sStart
let sGioco
let sGameOver
let sPause
let sInfo
let sSettings
let sCanzone

//varibili per gestione della videocamera
let video;
let handpose; //<-- per la mano
let predictions = []
let debug = 0;
let flippedVideoM //per specchiare la sorgente video

//vettori per il caricamento di suono/brani
let nomeBrani = ["Cant-Hold-Us","famy","Grazie-A-Dio","bloody-Mary","hall-Of-Fame","fuoco-e-benzina","cenere","Replay","stereo-Hearts","waka-Waka","quevedo"];
let autori = ["Macklemore","Ava","Thasupreme","Lady Gaga","The Script","Emis Killa","Lazza","Iyaz","Gim Class Heroes","Shakira","BZRP"];
let fontBrani;  //font utilizzato
let vettoreBrani = []; // vettore contenente oggetti di tipo Brano (ovvero canzone, copertina, autore)

let frecciaPremuta = false; //controlla preccia di scorrimento nella schermata canzone

let game; //gestisce i brani del gioco

//enumerazione degli stati:
const States = {
    Start: 0, //start
    Gioco: 1, //gioco
    GameOver: 2, //game over
    Pause: 3,
    Info: 4,
    Settings: 5,
    Canzone: 7,
    Win:8,
}

let stato = States.Start //variabile che gestisce gli stati/schermate

//variabili per l'animazione del caricamento
let caricamento = true;
let immaginiCaricamento = [];
let immagineCaricamentoAttuale = 0;

let varianza = 70
let vettoreVarianze = [];
let vettoreQuadratini = [];

/*
*NOTA:
* pulsante scorreSx da guardare
* Da fare:
*   - schermata pausa
*   - game over
*   - impostazioni(?)
*   - info
**/


// caricamento d'immagini e canzoni
function preload(){
    sfondoPricipale = loadImage("images/sfondoSchermataPrincipale.png");
    sfondoSecondario = loadImage("images/sfondoBlur.jpg");
    sfondoCanzone = loadImage("images/sfondoBlurCanzone.jpg");
    sfondoSettings = loadImage("images/sfondoBlurSettings.png");
    sfondoInfo = loadImage("images/sfondoBlurInfo.png");
    sfondoGioco = loadImage("images/sfondoGioco.png");

    bottoneImpostazini_image = loadImage("images/immagineBottoneSettings.png");
    bottoneRepImg = loadImage("images/immagineButtonReplay.png");
    bottoneHomeImg = loadImage("images/immagineBottoneHome.png");
    bottoneinfoImg = loadImage("images/immagineBottoneInfo.png");
    bottonePlayImg = loadImage("images/immagineBottonePlay.png");
    bottonePauseImg = loadImage("images/immagineBottonePause.png");
    bottoneStartImg = loadImage("images/immagineBottoneStart.png");
    bottoneAvantiImg = loadImage("images/immagineBottoneAvanti.png");
    bottoneIndietroImg = loadImage("images/immagineBottoneIndietro.png");
    immagineSpartito = loadImage("images/spartitoMusicale.png");
    immagineSfumaturaSpartito = loadImage("images/ulterioreSfumatureCentroGioco.png");
    cursoreGiocoPremuto = loadImage("images/immagineCursoreInGioco.png");
    cursoreGiocoRilasciato = loadImage("images/immagineCursoreInGiocoRilasciato.png");

    scorreDxImg = loadImage("images/scorreDX.png");
    scorreSxImg = loadImage("images/scorreSX.png");

    cursorePremuto = loadImage("images/pallaCursorePremuto.png");
    cursoreRilasciato = loadImage("images/pallaCursoreRilasciato.png");

    rettangoloLateraleRilasciato = loadImage("images/rettangoloGiocoLateraleNonPremuto.png");
    rettangoloLateralePremuto = loadImage("images/rettangoloGiocoLateralePremuto.png");

    quadratinoImg = loadImage("images/rettangoloSpartito.png");
    quadratinoPremutoImg = loadImage("images/rettangoloSpartitoPremuto.png");

    soundFormats('mp3', 'ogg');

    fontBrani = loadFont("font/Wheat Smile.ttf");
    caricaImgCaricamento();
}

function setup() {

    //quadratoProva = new Quadratini(width, 117, 120, 50, 'yellow');
    createCanvas(width, height);

    //canvas per la fotocamera che riconosce la mano
    video = createCapture(VIDEO);
    video.size(width, height);
    handpose = ml5.handpose(video, modelReady);
    handpose.on("predict", results => {
        predictions = results;
    });
    video.hide();

    inizializzaBottoni();
    inizializzaSchermate();
    inizializzaBrani();

    vettoreVarianze = creaVettoreVarianze(vettoreVarianze);
    Quadratini.image = quadratinoImg;
}



/*







            DA QUI IN POI COMINCIA TUTTO











 */

function creaVettoreVarianze(vettVar){ //serve
    for (var i = 0; i < 4; i++) {
        vettVar[i] = i * varianza;
    }
    return vettVar;
}

function gestisciVettore(){
    var sor; //per sorteggiare
    if(vettoreQuadratini.length == 0){

        sor = sorteggioRange(0,vettoreVarianze.length-1);
        vettoreQuadratini.push(new Quadratini(vettoreVarianze[sor] + 117));
    }else if(vettoreQuadratini.length != 0){

        for(var k = 0; k < vettoreQuadratini.length; k++){

            if(vettoreQuadratini[k].posX <= 900 && vettoreQuadratini[k].posX > 900-Quadratini.xSpeed){

                sor = sorteggioRange(0,vettoreVarianze.length-1);
                vettoreQuadratini.push(new Quadratini(vettoreVarianze[sor]+117));
                vettoreQuadratini[k].moveAndDraw();
            }else{
                vettoreQuadratini[k].moveAndDraw();
            }
        }
    }
}

function delay(ms) {
    let start = Date.now();
    while (Date.now() < start + ms) {
        // Attendi
    }
}

function sorteggioRange(min, max) { //questo serve
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//carica il vettore dei brani (let vettoreBrani[])
function inizializzaBrani(){
    var k = 0;
    var branoTemp;
    var copertinaTemp;


    for (k = 0; k < nomeBrani.length; k++) {
        branoTemp = loadSound("canzoniNoCopyright/" + nomeBrani[k] + ".mp3");
        copertinaTemp = loadImage("images/copertineCanzoniNoCopyright/" + nomeBrani[k] + ".jpeg");
        vettoreBrani.push(new Brano(branoTemp, copertinaTemp, nomeBrani[k], autori[k], 200, width / 2 - 100, 250));
    }

}

//serve per trovare il punto centrale della mano
function puntoMedio(p1X, p1Y, p2x, p2y){
    const x = (p1X + p2x) / 2;
    const y = (p1Y + p2y) / 2;
    return { x, y};
}

function drawKeypoints() { // la punta dell'indice ha valore 12 ed è quindi il dito indice per il limite sotto invece è 0

    if (debug) { //fino alla 74 solo per fare i vari calcoli della mano
        var posYmin = 100000; //--> corrisponde al dito piu altro (solo in fase di test)
        var posYmax = 0; //--> corrisponde alla parte piu bassa del palmo
        var valueMax;
        var valueMin;
    }else {

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
                image(cursorePremuto,midd.x = width - midd.x, midd.y, 70, 70);
            }else{
                image(cursoreRilasciato,midd.x = width - midd.x, midd.y, 70, 70)
            }
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
                            //console.log(y);
                        } else if (y > posYmax) {
                            valueMax = j;
                            posYmax = y
                            //console.log(y);
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
        //console.log("posizione dell'indice (piu in alto) " + valueMin);
        //console.log("posizione del palmo (piu in basso)" + valueMin);
    }
    return ({x1,y1,premuto});
}

function modelReady() {
    //console.log("Model ready!");
    caricamento = !caricamento;
}

//inizializza i bottoni nelle posizioni
function inizializzaBottoni() {
    bottoneSettings = new Bottone(60, 70, bottoneImpostazini_image, 75, 75, "settings");
    bottoneReplay = new Bottone(50, 50, bottoneRepImg, 75, 75,"replay");
    bottoneAvanti = new Bottone(100, height-100, bottoneAvantiImg, 75,74,"avanti");
    bottonePause = new Bottone(180, 80, bottonePauseImg, 75, 75, "pause");
    bottoneInfo = new Bottone((width - 150), 70, bottoneinfoImg, 75, 75, "info");
    bottoneStart = new Bottone((width / 2 - (200 / 2)), height - 150, bottoneStartImg, 200, 80, "start");
    bottoneHome = new Bottone(width - 150, height - 100, bottoneHomeImg, 75, 75, "home");
    bottoneScorreSX = new Bottone((width / 2 - (75 / 2) - 300), (height / 2 - (75 / 2)), scorreSxImg, 75, 75, "scorreSX");
    bottoneScorreDX = new Bottone((width / 2 - (75 / 2) + 300), (height / 2 - (75 / 2)), scorreDxImg, 75, 75, "scorreDX");
}

//crea oggetti schermata con pulsanti premibili per queste
function inizializzaSchermate(){
    sStart = new Schermata(["settings", "info", "start"]);
    sGioco = new Schermata(["settings", "info"]);
    sGameOver = new Schermata(["settings", "info", "replay"]);
    sPause = new Schermata(["info", "replay"]);
    sInfo = new Schermata(["home"]); //il pulsante back non esiste
    sSettings = new Schermata(["back", "home"]); //il pulsante back non esiste
    sCanzone = new Schermata(["back", "info", "home", "settings", "avanti", "scorreDX", "scorreSX"]); //il pulsante back non esiste
}

//"animazione" di caricamento prima dell'avvio del gioco che "controlla" che il
//modello della mano (handpose) sia pronto
function caricaImgCaricamento(){
    for(var k = 1; k <= 9; k++){
        immaginiCaricamento.push(loadImage("images/caricamentoImg/"+k+".png"));
    }
}

function draw() {
    gestioneSchermate();
}

function gestioneSchermate() {
    if(!debug)
        //console.log(stato);
        if (stato === States.Gioco) {
            drawSchermataGioco();
        } else if (stato === States.Pause) {
            drawSchermataPausa();
        } else if (stato === States.Info) {
            drawSchermataInfo();
        } else if (stato === States.Start) {
            drawSchermataPrincipale();
        } else if (stato === States.GameOver) {
            drawSchermataGameOver();
        } else if (stato === States.Settings) {
            drawSchermataSettings();
        } else if (stato === States.Canzone) {
            drawschermataCanzone();
            controllaSuoni();
        }

}

function controllaSuoni(){
    if(stato != States.Canzone){
        vettoreBrani[Brano.branoCorrente].brano.stop();
    }
}

//cambia schermata se un certo bottone è premuto
function controllaBottoni(sche){
    bottoneStart.premuto(States.Canzone, sche);
    bottoneSettings.premuto(States.Settings, sche);
    bottoneInfo.premuto(States.Info, sche);
    bottoneHome.premuto(States.Start, sche);

    if(sche == sCanzone && bottoneAvanti.premuto(States.Gioco, sche)){
        console.log("sono entrato spopositamente nella if yay!");
        game = new Gioco(vettoreBrani[Brano.branoCorrente]);

    }
}

//start gioco
function drawSchermataPrincipale() {
    //image(sfondoPricipale, 0,0, width, height);
    //background(video);
    //mostraCaricamento();

    //mostra l'animazione di caricamento pre-gioco
    if(caricamento){
        image(immaginiCaricamento[immagineCaricamentoAttuale], 0, 0, width, height);
        immagineCaricamentoAttuale ++;
        if(immagineCaricamentoAttuale >= 9){
            immagineCaricamentoAttuale = 0;
        }
        delay(50);
    }else {
        background(sfondoPricipale);
        bottoneSettings.draw();
        bottoneInfo.draw();
        bottoneStart.draw();

        // Inverto l'immagine orizzontalmente
        flippedVideoM = cursoreMagiK();
        controllaBottoni(sStart);
        //flippedVideoM.updatePixels();


    }
}



//per il cursore
function cursoreMagiK(){
    let flippedVideo = createImage(video.width, video.height);
    flippedVideo.loadPixels();
    video.loadPixels();
    for (let y = 0; y < video.height; y++) {
        for (let x = 0; x < video.width; x++) {
            let index = (x + y * video.width) * 4;
            let flippedIndex = ((video.width - x - 1) + y * video.width) * 4;
            flippedVideo.pixels[flippedIndex] = video.pixels[index];
            flippedVideo.pixels[flippedIndex + 1] = video.pixels[index + 1];
            flippedVideo.pixels[flippedIndex + 2] = video.pixels[index + 2];
            flippedVideo.pixels[flippedIndex + 3] = video.pixels[index + 3];
        }
    }
    flippedVideo.updatePixels(); // Update the flippedVideo image with the flipped pixels
    return flippedVideo;
}




function contrllaPremitureInGioco(){
    var pos = game.drawKeypointsGioco();
    for(var k=0; k<vettoreQuadratini.length; k++){
        if(vettoreQuadratini[k].posY <= pos.y1 + 50 && pos.premuto == true && vettoreQuadratini[k].posY >= pos.y1 +5 ){
            vettoreQuadratini[k].premuto = true;
        }
    }
}


function fermaTuttiIbraniNonQuelloCorrente(){
    for(var k=0; k<vettoreBrani.length; k++){
        if(k != Brano.branoCorrente)
            vettoreBrani[k].brano.stop();
    }
}

function gestisciBraniNelGioco(){
    console.log("si è fermato? "+vettoreBrani[Brano.branoCorrente].brano.isPlaying())
    var tro;
    tro = controllaSeNonPremutiAllaFine();


    if(primo){
        vettoreBrani[Brano.branoCorrente].brano.play();
        primo = false;
        console.log("in teoria e entrato");

    }else if(tro){

        vettoreBrani[Brano.branoCorrente].brano.pause();
        stopDraw = true;

    }else if(!vettoreBrani[Brano.branoCorrente].brano.isPlaying()){
        vettoreBrani[Brano.branoCorrente].brano.play();
        stopDraw = false;
    }

    console.log("brano: "+Brano.branoCorrente);
    console.log("plaing? "+ vettoreBrani[Brano.branoCorrente].brano.isPlaying());
    console.log("primo"+ primo);
}

function controllaSeNonPremutiAllaFine(){
    var tro = false;
    for(var k =0 ; k<vettoreQuadratini.length; k++){
        if(vettoreQuadratini[k].posX <= 700 && vettoreQuadratini[k].premuto == false){
            console.log("entrato nel if 1 ");


            game.errori ++;
            tro = true;



        }else if(vettoreQuadratini[k].posX <= 700 && vettoreQuadratini[k].premuto == true){
            console.log("entrato nel if ");
            vettoreQuadratini.splice(k,1);
            game.punteggio ++;



        }

    }
    return tro;
}

function drawschermataCanzone() {
    background(sfondoCanzone);
    controllaBottoni(sCanzone);
    vettoreBrani[Brano.branoCorrente].drawBrano();
    fermaTuttiIbraniNonQuelloCorrente();
    if(!vettoreBrani[Brano.branoCorrente].brano.isPlaying())
        vettoreBrani[Brano.branoCorrente].brano.play();

    //stoppa la canzone corrente se il bottone scorrimento è stato premuto
    if(bottoneScorreSX.premuto(States.Canzone, sCanzone)){

        if(!frecciaPremuta)
            if(Brano.branoCorrente-1 >= 0){
                vettoreBrani[Brano.branoCorrente].brano.pause();
                Brano.branoCorrente -=1;
            }else{
                Brano.branoCorrente = vettoreBrani.length-1
            }
        frecciaPremuta = true;
    }else if(bottoneScorreDX.premuto(States.Canzone, sCanzone)){

        if(!frecciaPremuta)
            if(Brano.branoCorrente+1 < vettoreBrani.length){
                vettoreBrani[Brano.branoCorrente].brano.stop();
                Brano.branoCorrente +=1;
            }else{
                Brano.branoCorrente = 0;
            }
        frecciaPremuta = true;
    }else{
        frecciaPremuta = false;
    }

    bottoneSettings.draw();
    bottoneInfo.draw();
    bottoneHome.draw();
    bottoneScorreSX.draw();
    bottoneScorreDX.draw();
    bottoneAvanti.draw();



}

function drawSchermataInfo() {
    if(debug)
        //console.log("mi trovo nella schermata info");
        background(sfondoInfo);
    bottoneHome.draw();

    controllaBottoni(sInfo);

    testo = "info"
    text(testo, 50, 50, 150);

}

function controllaVintoPerso(){
    if(game.punteggio >= 20){
        stato = States.Win;
    }else if(game.errori >= 5){
        stato = States.GameOver;
    }
}

function drawSchermataSettings() {
    background(sfondoSettings);
    bottoneHome.draw();
    testo = "settings"
    text(testo, 50, 50, 150);
    controllaBottoni(sSettings);

}

function drawSchermataGioco() {


    image(immagineSpartito, width/2, 0,750, 570);

    image(flippedVideoM, -650,0,1300,700);
    image(sfondoGioco, 0, 0,1300,700);
    flippedVideoM = cursoreMagiK();
    game.drawKeypointsGioco();
    gestisciVettore();



    contrllaPremitureInGioco();
    gestisciBraniNelGioco();
    //controllaVintoPerso();

    image(immagineSfumaturaSpartito, 0,0,1300,700);



}

function drawSchermataPausa() { //seh vabbe

}



function drawSchermataGameOver() { // oleee

}




/*

sta roba sotto serviva nella versione precedente ma adesso
non serve



function compattaVettore(vettore) {
    //console.log("La lunghezza iniziale del vettore è: " + vettore.length);
    let nuovoVettore = [];
    for (let i = 0; i < vettore.length; i++) {
        if (vettore[i] !== null && vettore[i] !== undefined && vettore[i] !== '') {
            nuovoVettore.push(vettore[i]);
        }
    }
    //console.log("La lunghezza finale del vettore è: " + nuovoVettore.length);
    return nuovoVettore;
}

 */