
 //import { FeatureState } from "../../JS/Features/featureState.js";
 //let featState = new FeatureState();
 
 
 

let TRAIT_MODE =  "FILTER_BASKET";//"FOLLOW_NFT"; 

let NFT_BASE ;
 let NFT_HEAD ;
  let NFT_WEAPON ;
   let NFT_SHIELD ;




let sessionData = {};
let liveEditData = {}; 

let selectedNFTFirstNumber = []; 
let ModuloDisplayMode;
//===========================
/*
 const gridControl= document.getElementById("grid-control");
 const buttonSet3= document.getElementById("buttonSet3");
 const reorderPanel= document.getElementById("reorderPanel");
*/
 //============================



eventBus.on(eventBus.eventNames.EVENT_loadSessionData, 
     (eventObj) => {
 
       console.log( "eventbus: EVENT_loadSessionData  block01.js  ");
      
 
    }
  );

  