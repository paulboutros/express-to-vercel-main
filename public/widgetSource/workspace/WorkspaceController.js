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


         
        let layout;

       
 
       if ( ratio >= 1.4 ) {
 
               layout = "desktop";

               viewManager.show("TRAITS");
        }
        else if (  ratio >= 0.85 ) {
       

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
  

}

function cssInt(name){

    return parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue(name)
    );

}

export default WorkspaceController;