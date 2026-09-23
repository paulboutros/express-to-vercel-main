

 
import { api_collection_registerExistingData } from "../../JS/Mainfunctions/collectionResolver.js";
import { setDOM } from "../../JS/Mainfunctions/mainFunctions.js";
 
import InfoCard from "../../JS/UI/infoCard.js";
 
   
import RunButton from "../../JS/wuli-ui/runButton.js";
import { rebuildRarityCount } from "./countTraits.js";

export function initBTNrarity 
    ({
     widgetContent,
    destinationContainer = null,
    options = {
        
    }

}) {
//========================================
 
 

//const jsonData = JSON.parse(fs.readFileSync( dataPath , "utf8")  );

    const rarityBtnContainer = widgetContent.querySelector("#rarityBtn");
 //const navigButton = document.getElementById("guideNavigation");
   const rarityBtn = new RunButton({
        container:  rarityBtnContainer  ,
        label :"run rarity count",
        onClick: async () => {
            
            const {traitCounter:rarityCount} = rebuildRarityCount( window.metadataCollection);
           console.log(" ========= rarityCount "   , rarityCount);

             window.rarityCountResult = rarityCount;

           //  api_collection_registerExistingData(rarityCount);
        }
    });
    
    //prevBatchButton.button.classList.add("btn");
 

  window.WuliComposer.actions.rebuildRarityCount = (metadataCollection)=>{ 
      const {traitCounter:rarityCount} = rebuildRarityCount( metadataCollection);
       window.rarityCountResult = rarityCount;
       
       return  rarityCount;
  }
/*
      const resultInfo = widgetContent.querySelector("#resultInfo");
   
       const filterCard = new InfoCard(resultInfo,"FILTER","DSL");
       const sheetCard = new InfoCard( resultInfo,"SHEETS","0");
       const foundCard = new InfoCard(  resultInfo,"FOUND","0 NFTs");
*/

   // setDOM({ filterCard, sheetCard,foundCard });
      
   
  

     return rarityBtn;

      

}