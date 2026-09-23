 

/*
const { ipcRenderer } = require("electron/renderer");
const { save_psdEditorSessionData, get_gridSessionData, save_pickedAsOverride, get_activeDocData,
   save_activeDocData,save_activeDocDataPATH } = require("../services/writeServices");
const { UIRegistry } = require("../registry/UIRegistry");
const { } = require("../UI_element/buttonActionRegistry");
const { getData, getPath, scriptType } = require("../BOOTSTRAP/PATH");
const { sharedState } = require("../PSDEDITOR/psdEditorSharedState");
 */

import { 
   //  setSessionValue , setCacheToDirty, 
  //  get_dataProviders
 } from "./buttonActionRegistry.js";

 
 let traitOverrideNames_invers = null;
   
  export const clickMap = {
        nftSource : "openNFTGridorChoosePSDasSource",
        shieldSource : "openAssetGridorUseTraitValue",

         weapon: "openWeaponGridSelection",
         shield: "openWeaponGrid_shield_Selection",
         saveTargets: "openGridShowFives",
    };

   export function getClickMap(){ 
    return clickMap;
   }
   
    // use client provided data
    const DEFAULT_CONFIG   = filemanager.inputConfig.load();//    inputConfig;
    export  const inputMap =  DEFAULT_CONFIG.layoutGrid;
     


 function openAssetGridorUseTraitValue( key ){ 


    console.log(  "key   :" , key    );

       let mode = key;
       switch (key) {
        case "NFTgrid":
             mode = "AssetGrid";
        break;
        case "AssetGrid":
              mode = "NFTgrid";


           if (!traitOverrideNames_invers){ 

             traitOverrideNames_invers = 
              get_dataProviders().get_traitOverrideNames_invers();
               
              
           }
              
       
                //get_gridSessionData
            const nftGridSessionData = get_gridSessionData();
            const curTraitKey =     nftGridSessionData.traitsUI.pills[0].traitKey;
            if ( curTraitKey && curTraitKey === "SHIELD"){ 
                const overrideItem = nftGridSessionData.traitsUI.pills[0].value;

        // traitOverrideNamesPATH
              const pickedItem = traitOverrideNames_invers.shield[overrideItem];
               save_pickedAsOverride("shield",pickedItem );
               //  save_pickedAsOverride
                console.log("overrideItem = ", overrideItem , " pickedItem : " , pickedItem );

                updatePayloadValue( "openWeaponGrid_shield_Selection", overrideItem);

            }else{ 

            }






            
        break;
       
        default:
            break;
       }

        
        const inputObj =   {
                key: "shieldSource",
                value: {
                    mode: mode
                }
            };
 


      save_psdEditorSessionData( inputObj );
      setSessionValue("shieldOverride_shieldSource", mode );
      updatePayloadValue( "openAssetGridorUseTraitValue", mode );

      
    
 
 }

 function openNFTGridorChoosePSDasSource( key ){ 


    console.log(  "key   :" , key    );

       let mode = key;
       switch (key) {
        case "NFTgrid":
             mode = "PSDselectedLayer";
        break;
        case "PSDselectedLayer":
              mode = "NFTgrid";
            
        break;
       
        default:
            break;
       }

        
        const inputObj =   {
                key: "NFTsource",
                value: {
                    mode: mode
                }
            };
 
      save_psdEditorSessionData( inputObj );
 
     setSessionValue("charaXweapon_NFTsource", mode );
     updatePayloadValue( "openNFTGridorChoosePSDasSource", mode);
 
     
 
 }

 // an other way(more direct to refresh the description without calling IPC)
function updatePayloadValue(actionName, value) {
  const el = document.querySelector(`[data-action="${actionName}"]`);
  if (!el) return;

  el.dataset.value = value;
  el.textContent = value;
}
 
function update_ALL_psdGridLayout_props(){
//return;
    const activeDocData =  get_activeDocData(  sharedState.getActiveDoc() );
   if ( !activeDocData )  return; // file data has not been created yet
   if ( activeDocData.profile !==  "gr_CA_IM" && 
        activeDocData.profile !==  "gr_IM"   

   ) return;


    const config_layoutGrid = activeDocData.config.layoutGrid;

  for(key in config_layoutGrid)  {
      
        setSessionValue(
              key,
              config_layoutGrid[key] //  getConfigValue("layoutGrid", target.dataset.configKey )  //
        );


    }
    
 
}





 

//==============================================================================

function openWeaponGrid_shield_Selection(keyVal) {
      console.log("openWeaponGrid_shield_Selection: keyVal", keyVal);
      const IPC_ARG ={ 
         type:"shield",
         pickItem: keyVal

      }; 
      ipcRenderer.send("open-assetPicker" ,  IPC_ARG );
}

function openWeaponGridSelection(keyVal) {
      console.log("openWeaponGridSelection: keyVal", keyVal);
      const IPC_ARG ={ 
         type:"weapon",
         pickItem: keyVal

      }; 

     
      ipcRenderer.send("open-assetPicker" ,  IPC_ARG );
}
//======================================================================
function openGridShowFives( keyVal ){

   
   const IPC_ARG={
        command: "openNFTGrid:showFives",
        renderID: keyVal 
       
   }
   console.log( "IPC_ARG :",  IPC_ARG   );
      ipcRenderer.send("PSDeditor:toNFTgrid" ,  IPC_ARG );
      console.log("fn: openGridShowFives", keyVal);
}

export const payloadActions = {  
    openNFTGridorChoosePSDasSource, //mode
    openAssetGridorUseTraitValue,  //mode
 
    openWeaponGridSelection,
    openWeaponGrid_shield_Selection,
    openGridShowFives,
 

};

/*
module.exports = {
    

    payloadActions, 
    inputMap,
     clickMap,
    update_ALL_psdGridLayout_props

    
};

*/
 