

 import { getDOMregistry } from "../JS/Mainfunctions/DOMregistry.js";
import { setDOM } from "../JS/Mainfunctions/mainFunctions.js";
 
import InfoCard from "../JS/UI/infoCard.js";
 
  
export function initinfoResult 
    ({
     widgetContent,
    destinationContainer = null,
    options = {}

}) {
//========================================
 

      const resultInfo = widgetContent.querySelector("#resultInfo");
   
       const filterCard = new InfoCard(resultInfo,"FILTER","DSL");
       const sheetCard = new InfoCard( resultInfo,"SHEETS","0");
       const foundCard = new InfoCard(  resultInfo,"FOUND","0 NFTs");
    setDOM({ filterCard, sheetCard,foundCard });
      
   
  

     return resultInfo;

      

}