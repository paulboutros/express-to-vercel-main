

 
import {  setDOM,
    
    getUIelements} from "../../JS/Mainfunctions/mainFunctions.js";
  

   import { setGridDOM } from    "./gridRenderer.js";   
 
export function widgetInit 
    ({
      widgetContent,
     destinationContainer = null,
     options = {}

}) {



   console.log( "  widgetInit  widgetInit widgetInit  ")
//========================================

 /* */   
const baseContainer =  widgetContent.querySelector("#baseContainer");
 
  
     
      setGridDOM({ root: baseContainer })
     
    


const  rootContainer = document.getElementById("imageGrid") ;
 setDOM({ imageGrid: widgetContent });

// const root = getUIelements().traitpanel_widget;
    
  
//buttonSet2
    //======================================
     window.populateGrid = populateGrid ;
   
    // setDOM({viewManager, traitPanel });

    return rootContainer; 
   

      

}


 function getElement(id) {

        const root = getUIelements().traitpanel_widget;

        

        return  root.querySelector(`#${id}`);
    }