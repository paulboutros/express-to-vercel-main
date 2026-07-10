//D:\GIT\hashLipsWuli\hashlips_art_engine\utils\NFT_ELECTRON\UI_element

 

 
// browser use this only no require
//import wuliData from '@wulirocks/collection-engine/storage/writeServices.js';
 

     import * as api from "./apiClient.js";

     const traitData = await api.getTraitData();
   
  
    
     import TraitSelectorPanel from "/wuli-ui/traitSelectorPanel.js";
     import  ToggleButton   from "/wuli-ui/ToggleButton.js";
     import  RunButton from "/wuli-ui/runButton.js";
     

   import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "/wuli-ui/filterPills.js";
    import { applyTraitSearchBlock  } from "/wuli-ui/displayBlocksFromSearch.js";
   


const panel_ignored_traits = [ "NECKSTYLE","DNA","_BODY_","_HEAD_","COLORSQN","HELMCREST","WEAPON_PAT","MASK_PAT"] ;

      setTraitUIHandlers({
      onRemoveTrait(traitType, value, uiResult) {
      console.log("web: pill removed", traitType, value, uiResult);
 
      // api_rebuildActiveFilterMap(uiResult.pills);
      
             const apiCall =  async () => { 
                 console.log(  "  async () => uiResult.pills "   ,   uiResult.pills   );
                      const api_result = await api_rebuildActiveFilterMap(  traitType, value, uiResult  );

                       const idsToRemove = api_result.idsToRemove;
                        const idsToRemoveSet = new Set(idsToRemove);
                         get_UIstate().activeFilterMap_IDS = get_UIstate().activeFilterMap_IDS.filter(
                         id => !idsToRemoveSet.has(id)
                        );
                        selectionIDS.textContent =  JSON.stringify(  get_UIstate().activeFilterMap_IDS )  ;
                        
                     //  console.log(  "api_rebuildActiveFilterMap:  pillDaapi_result "   , api_result   );

             }
            apiCall();

       
        // selectionIDS.textContent =  JSON.stringify(  result['IDS#'] )  ; 
    // redraw result grid
  }
});



//import TraitSelectorPanel from '../../../hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/UI_element/traitSelectorPanel.js' ;

import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
         api_set_filterModeABS, api_runQueryInputHandler
         
          , api_generateAllTraitSheet
     } from "./apiClient.js";
  import { generateAllTraitSheet, functionState } from "./Mainfunctions/mainFunctions.js";
//import { queryEngine } from "@wulirocks/collection-engine";
 
const selectionIDS = document.getElementById( "selectionIDS");
let ResultToClient={}; // result/response from api engine.
//const testarray = [1255,45665,4745,1245];
//selectionIDS.textContent = JSON.stringify(testarray) ;


console.log( "call_addTrait_inUI   ======= " , call_addTrait_inUI);
 // console.log( "updateActiveTraitBar   ======= " , updateActiveTraitBar);
 //==============================================================================================
 const traitPanel = new TraitSelectorPanel({

    container: document.getElementById("final_traitFILTERListContainer"),

    panel_ignored_traits: panel_ignored_traits,
    onAdd: ({ traitKey, value, ids }) => {
           onTraitAdd(traitKey, value, ids) ;
 
    }

});
    
 traitPanel.render(traitData);
//=================================================================================

const traitSearch = document.getElementById("traitSearch");
    traitSearch.addEventListener("input",async () => {

            const raw = traitSearch.value.trim();
            const result = await runQueryInputHandler(raw);

           //  ResultToClient ={ 
                //   IDS_Match_Count: Number( result["IDS Match Count"] ) 
           // };
            get_UIstate().IDS_Match_Count =  Number( result["IDS Match Count"] ) ;


             if ( result && result.queryMode === 'TRAIT_SEARCH'){ 
                applyTraitSearchBlock(raw);
                console.log( "trait search result ", result );
             }
 });

  //===================================================== 
 const prevBatchButton = new RunButton({
        container:  document.getElementById("row1") ,
        label :"<",
        onClick: async () => {
             console.log(  "prev BatchButton clicked ");
               
  
                 generateAllTraitSheet( functionState.batchIndex, -1       );
        }
    });
    //nextBatchButton.button.dataset.tool = "sheetPreview";
    prevBatchButton.button.classList.add("regularButton");
    prevBatchButton.button.style.width = "20px";
//======================================================== 
 //===================================================== 
 const nextBatchButton = new RunButton({
        container:  document.getElementById("row1") ,
        label :">",
         onClick: async () => {


            // currentIndex = (currentIndex + 1) % nftListToRender.length;
             console.log(  "nextBatchButton clicked ");
                

             generateAllTraitSheet( functionState.batchIndex, 1  );
        }
    });
    //nextBatchButton.button.dataset.tool = "sheetPreview";
    nextBatchButton.button.classList.add("regularButton");
    nextBatchButton.button.style.width = "20px";
//======================================================== 
//=====================================================
//===================================================== 
 const runButton = new RunButton({
        container:  document.getElementById("buttonSet2") ,
        label :"sheetPreview",
        onClick: async () => {

                //   generateAllTraitSheet(0);
                // const batchNumber =0;
             
                 generateAllTraitSheet( functionState.batchIndex,0 );
               /*
                 let result = await api_generateAllTraitSheet({ 
               //  batchNumber: batchNumber,
                // queryMode: "TRAIT_SEARCH",
              //   ids: get_UIstate().activeFilterMap_IDS,
                // renderTraitObject:renderTraitObject 
                 });
              

                 // console.log(" renderTraitObject  =====",  renderTraitObject);
                 const preview = document.getElementById("sheetPreview");
                    preview.innerHTML = "";
              for (let index = 0; index <  result.currentPreviewURLList.length; index++) {
  
               // const element = result.currentPreviewURLList[index];
                  const img = document.createElement("img");

                     const bufferData =   result.currentPreviewURLList[index].data;
                    //  console.log( "jpegBuffer data = " , bufferData  );

                      console.log("jpegBuffer bytes =", bufferData.length);
                      console.log("jpegBuffer MB =", (bufferData.length / 1024 / 1024).toFixed(2));                
                       
                      // const jpegBuffer = Buffer.from(bufferData);
                     //  const blob = new Blob([jpegBuffer], { type: "image/jpeg" });
                       

                       const byteArray = new Uint8Array(bufferData);
                       const blob = new Blob([byteArray], { type: "image/jpeg" });




                     let objUrl = URL.createObjectURL(blob);
                      img.src = objUrl;
                     preview.appendChild(img); 
              }
 */
             
        }
    });
    runButton.button.dataset.tool = "sheetPreview";
    runButton.button.classList.add("regularButton");
    runButton.button.style.width = "100%";
//======================================================== 
//======================================================== 

const Show_Trait_Inputs_Toggle = new ToggleButton({
    containerId: "buttonSet2",
    label: "Show Trait Inputs",
    initialState: false,
    onChange: (state) => {

       // Show_Trait_Inputs_Mode = state;
    
      
      if (state){ 
           
          Show_Trait_Inputs_Toggle.label =  get_UIstate().filterModeABS = "AND";
           //  api_set_filterModeABS("AND")
         //  buildTraitPanelFromClass();
       
      }else{ 
           // api_set_filterModeABS("OR")
           //final_traitFILTERListContainer.innerHTML = '';
         Show_Trait_Inputs_Toggle.label =
          get_UIstate().filterModeABS = "OR";
      }
         //get_UIstate().filterModeABS = state;
        console.log("Watcher state:", state);
    }
});

//======================================================================================================

//=====================================================================
  //=======================================================================================
   
  async function runQueryInputHandler(raw) {
  const result = await api_runQueryInputHandler(raw);
       
      
      // console.log ( "query result " , result )  ;
       console.log ( "query result " ,  result['IDS#']  )  ;
        
        selectionIDS.textContent =  JSON.stringify(  result['IDS#'] )  ;  
       
    return result;
}


 //=====================================================================
  //=======================================================================================

  async function onTraitAdd(traitKey, value, ids) {

    const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
        console.log( "activeTraitUI_result.pills = =========== \n" , activeTraitUI_result.pills  );

  const result = await api_addTraitSelection( traitKey, value, ids ,  activeTraitUI_result.pills    );
   
   
   

      
        const traitType = String(result.traitKey);
        /*
        const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
        console.log( "activeTraitUI_result.pills = =========== \n" , activeTraitUI_result.pills  );
      */
         const resultids = result.activeFilterMap_IDS;
          console.log( " add on trait result = =========== \n" , result  );

          get_UIstate().activeFilterMap_IDS = result.activeFilterMap_IDS;
           get_UIstate().IDS_Match_Count = result.activeFilterMap_IDS.length;
          get_UIstate().queryMode = "TRAIT_SEARCH";
        // ResultToClient ={ 
            //  IDS_Match_Count: resultids.length,
             //  queryMode : "TRAIT_SEARCH"//,
              // activeTraitUI_pills     : activeTraitUI_result.pills   
       // };

        /* 
                 vidFilter.queryMode = runQueryInputHandler_result.queryMode ;
                vidFilter.raw =       runQueryInputHandler_result.queryDNAObj.raw ;
        */
 

       // const pillsData = {  pills: activeTraitUI_result.pills}
      //  const api_result = await api_rebuildActiveFilterMap(   activeTraitUI_result.pills  );

       
         get_UIstate().activeFilterMap_IDS  = resultids;
          let IDSText = "";
       for (let index = 0; index < resultids.length; index++) {
             const ID = resultids[index];
             IDSText += ID+","
        
       }
        selectionIDS.textContent =IDSText;
         console.log( " onTraitAdd result = =========== \n" , result  );
 
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

  
 