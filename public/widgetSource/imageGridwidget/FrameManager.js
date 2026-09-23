
 
 
 export class FrameManager {
    constructor({root}) {
        this.root = root;
        this.prevFrame = this.getElement('prevFrame');
        this.nextFrame = this.getElement('nextFrame');
        this.frameUpdate = this.getElement('frameUpdate');
        this.curFrame = this.getElement('curFrame');

        
       this.imgRefs = new Map();
       this.loadingCap = [
            { start:0, end:100},
            { start:101, end:200},
            { start:201, end:300},
            { start:301, end:400},
            { start:401, end:500},
            { start:501, end:600},
            { start:601, end:700},
            { start:701, end:800},
            { start:801, end:900},
            { start:901, end:1000},
            { start:1001, end:1100},
            { start:1101, end:1200},
            { start:1201, end:1300} 

        ];
 
        this.oldlcap =0;
        this.lcap =0;
        this.isLoadingNextChunk = false;
        this.ModuloDisplayMode = true;
        this.global_imageLocalNumber =0;
    }

    
   getElement(id) {

   const el =  this.root.querySelector(`#${id}`);
 
    console.log( " ======= el ", el )
    return el;
}


    loadNextChunk( incr , fnArg ) {

 if (this.isLoadingNextChunk) return; // ignore if still rendering
        this.isLoadingNextChunk = true;
    this.lcap +=incr ;
    if (this.lcap > this.loadingCap.length - 1) {  this.lcap = 0 };// return;
    if (this.lcap < 0 ) {this.lcap = this.loadingCap.length - 1 };// return;
   
   
      curFrame.textContent  = this.lcap;
   
    fnArg();
    
 

  }

    incrementGlobalLocalImage( incr){
        console.log( " incrementGlobalLocalImage"  );
        this.global_imageLocalNumber +=incr;
       if (this.global_imageLocalNumber >  9){ this.global_imageLocalNumber  = 0;   }
       if (this.global_imageLocalNumber <  0){ this.global_imageLocalNumber  = 9;   }
    } 
}
