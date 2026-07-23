import viewManager from "./ViewManager.js";

const DESKTOP  =769;// cssInt("--desktop-min-width");
const LARGE = 1100;//cssInt("--large-desktop-min-width");

 
 
class WorkspaceController {

    constructor( {layoutManager =null } = {} ) {

        this.layoutManager = layoutManager;
      

        this.currentLayout = null;

    }

    start() {

        window.addEventListener(
            "resize",
            () => this.update()
        );

        this.update();

    }


    
    update() {

        const width  = window.innerWidth;
        const height = window.innerHeight;
        const ratio  = width / height;


         console.log( "ratio   =========   "  ,ratio  );
        let layout;

      //  if (window.innerWidth >= LARGE) { layout = "largeDesktop";}else
 
       if ( ratio >= 1.4 ) {
 
               layout = "desktop";

               viewManager.show("TRAITS");
        }
         else if (  ratio >= 0.85 ) {
       /* else if (window.innerWidth >= DESKTOP && ratio >= 0.9 ) {*/

              layout = "squareDesktop";

               viewManager.show("TRAITS");
        }
        else {

            layout = "mobile";

             viewManager.hide("TRAITS");

        }

        if (layout === this.currentLayout)
            return;

        this.currentLayout = layout;

         console.log("apply :  layout" , layout);

        document.body.dataset.workspace = layout; 
        this.layoutManager.apply(layout);

    }
 
    /*
  update() {

    const width  = window.innerWidth;
    const height = window.innerHeight;
    const ratio  = width / height;

    const isMobile      =  width < DESKTOP &&   ratio < 0.9;
    const isSquare      =  width < DESKTOP && ratio >= 0.9 && ratio <= 1.25;

    const isLargeDesktop = width >= LARGE;
   
   
   
    const isShort       = height < 750;

    let layout = "desktop";

    if (isMobile) {

        layout = "mobile";

    }
    else if (isLargeDesktop) {

        layout = "largeDesktop";

    }
    else if (isSquare) {

        layout = "squareDesktop";

    }
    else if (isShort) {

        layout = "compactDesktop";

    }


console.log  (   "ratio : ", ratio);

    if (layout === this.currentLayout)
        return;

    this.currentLayout = layout;



    
    switch (layout) {

        case "mobile":

            viewManager.hide("TRAITS");
            break;

            

        default:

            viewManager.show("TRAITS");
            break;

    }

    console.log("apply layout:", layout);

    this.layoutManager.apply(layout);

}
*/






}

function cssInt(name){

    return parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
    );

}

export default WorkspaceController;