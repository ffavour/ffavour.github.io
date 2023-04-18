class Quadratini {

   static xSpeed = 35;
   static width1 = 150;
   static height1 = 50;


   static posXinit = width - 50;
   static limX = 600; //era 500 ma è meglio 600


   constructor(posY) {
      this.posX = Quadratini.posXinit;
      this.posY = posY;
      this.premuto = false;

   }



   move() {
      if (this.posX - Quadratini.xSpeed < Quadratini.limX) {
         return false;
      } else {
         this.posX = this.posX - Quadratini.xSpeed;
         return true;
      }
   }

   //ma serve??? non ti azzardare a toccarlo <3
   //perche e quella che chiama la home quando fa controlla

   moveAndDraw() {
      if(!stopDraw){
         if (this.move()) {
            if(!this.premuto) //anche alla riga 39 il punto esclamativo perche avevo invertito i file
               image(quadratinoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);
            else
               image(quadratinoPremutoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);
            return true;
         } else {
            if(!this.premuto)
               image(quadratinoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);
            else
               image(quadratinoPremutoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);
            return false;
         }
      }else{
         if(!this.premuto) //anche alla riga 39 il punto esclamativo perche avevo invertito i file
            image(quadratinoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);
         else
            image(quadratinoPremutoImg, this.posX, this.posY, Quadratini.width1, Quadratini.height1);

      }
   }

}

