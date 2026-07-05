//D:\GIT\hashLipsWuli\hashlips_art_engine\utils\NFT_ELECTRON\UI_element

 

 
// browser use this only no require
//import wuliData from '@wulirocks/collection-engine/storage/writeServices.js';
 

  import * as api from "./apiClient.js";

const traitData = await api.getTraitData();
   
  
    
     import TraitSelectorPanel from "/wuli-ui/traitSelectorPanel.js";
     import  ToggleButton   from "/wuli-ui/ToggleButton.js";

   import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate  } from "/wuli-ui/filterPills.js";
 
   



   setTraitUIHandlers({
      onRemoveTrait(traitType, value, uiResult) {
       console.log("web: pill removed", traitType, value, uiResult);
 
         api_rebuildActiveFilterMap(uiResult.pills)
    // redraw result grid
  }
});
  //import TraitSelectorPanel from '../../../hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/UI_element/traitSelectorPanel.js' ;

import { api_addTraitSelection ,api_rebuildActiveFilterMap,
         api_set_filterModeABS, api_runQueryInputHandler 
     } from "./apiClient.js";
 

console.log( "call_addTrait_inUI   ======= " , call_addTrait_inUI);
 // console.log( "updateActiveTraitBar   ======= " , updateActiveTraitBar);
 //==============================================================================================
 const traitPanel = new TraitSelectorPanel({

    container: document.getElementById("final_traitFILTERListContainer"),

    onAdd: ({ traitKey, value, ids }) => {
          onTraitAdd(traitKey, value, ids) ;
 
    }

});
    
 traitPanel.render(traitData);
//=================================================================================

const traitSearch = document.getElementById("traitSearch");
    traitSearch.addEventListener("input", () => {

            const raw = traitSearch.value.trim();
            await runQueryInputHandler(raw);
 });
//=====================================================

const Show_Trait_Inputs_Toggle = new ToggleButton({
    containerId: "buttonSet2",
    label: "Show Trait Inputs",
    initialState: false,
    onChange: (state) => {

       // Show_Trait_Inputs_Mode = state;
    

      if (state){ 
             api_set_filterModeABS("AND")
         //  buildTraitPanelFromClass();
       
      }else{ 
            api_set_filterModeABS("OR")
           //final_traitFILTERListContainer.innerHTML = '';
       
      }
       
        console.log("Watcher state:", state);
    }
});

//======================================================================================================

//=====================================================================
  //=======================================================================================
   
  async function runQueryInputHandler(raw) {
  const result = await api_runQueryInputHandler(raw);
       

      console.log ( "query result " , result )  ;
        
      //  const api_result = await api_rebuildActiveFilterMap(   activeTraitUI_result.pills  );
    return result;
}


 //=====================================================================
  //=======================================================================================

  async function onTraitAdd(traitKey, value, ids) {
  const result = await api_addTraitSelection(
    traitKey,
    value,
    ids 
  );
      
        const traitType = String(result.traitKey);
        const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
         console.log( "activeTraitUI_result.pills = =========== \n" , activeTraitUI_result.pills  );
      
       // const pillsData = {  pills: activeTraitUI_result.pills}
        const api_result = await api_rebuildActiveFilterMap(   activeTraitUI_result.pills  );
 
}


function removeActiveTrait( traitType, value ) {
   const key = `${traitType}::${value}`;


     const UIstate = get_UIstate();
  // Remove from filter map
     UIstate.activeTraits.delete(key);

  // Remove from UI memory
  if (  UIstate.activeTraitUI.has(traitType)) {
    
    const set =  UIstate.activeTraitUI.get(traitType);
    set.delete(value);           // remove only this value
    if (set.size === 0) {
       UIstate.activeTraitUI.delete(traitType); // clean up if no more values
    }
  }
  

/*
  console.log( "activeTraitUI_result.pills = =========== \n" , activeTraitUI_result.pills  );
      
       // const pillsData = {  pills: activeTraitUI_result.pills}
        const api_result = await api_rebuildActiveFilterMap(   activeTraitUI_result.pills  );
*/



   //rebuildActiveFilterMap(); Electron logic
   // if (window &&  window.updateGrid) Electron  window.updateGrid();


   // const activeTraitUI = mapSetToObject( UIstate.activeTraitUI );
    // updateActiveTraitBar(   activeTraitUI,  removeActiveTrait );  // DOM
   
   
  }

  
 