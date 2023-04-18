class Schermata{
    constructor(string) {
        this.stringhe = string;
    }


    cerca(stringa){
        var k = 0, tro = false;

        while (k < this.stringhe.length && tro === false){
            if(this.stringhe[k] === stringa){
                tro = true;
            }
            k++;
        }
        return tro;
    }

}