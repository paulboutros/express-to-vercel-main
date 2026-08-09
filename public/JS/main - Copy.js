//D:\GIT\hashLipsWuli\hashlips_art_engine\utils\NFT_ELECTRON\UI_element

 

 
// browser use this only no require
//import wuliData from '@wulirocks/collection-engine/storage/writeServices.js';
 
 
     import * as api from "./apiClient.js";

     const traitData = await api.getTraitData();
   
     // wuli ui oackage
     import TraitSelectorPanel from "/wuli-ui/traitSelectorPanel.js";
     import  ToggleButton   from "/wuli-ui/ToggleButton.js";
     import  RunButton from "/wuli-ui/runButton.js";
     import QueryBox from "/wuli-ui/QueryBox/QueryBox.js";
     import QueryStore from "/wuli-ui/QueryBox/QueryStore.js";
     import QueryDropdown from "/wuli-ui/QueryBox/QueryDropdown.js";
    

      import HorizontalSelector from "/wuli-ui/HorizontalSelector.js";

      // ui webapp specific
     //==================================================================================
      import  viewManager  from "./UI/ViewManager.js";
    // import {/*registerView ,showView, setInitialView, show, toggle*/   viewManager }  from "./UI/ViewManager.js";
     import LayoutManager from "./UI/LayoutManager.js";
    import  GridView  from "./UI/GridView.js";
    import  SheetView  from "./UI/SheetView.js";
    import PanelToggle from "./UI/PanelToggle.js";
    import { ElementView } from "./UI/elementView.js";
    import InfoCard from "./UI/infoCard.js";
  
    //======================================================================================
      import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "/wuli-ui/filterPills.js";
     import { applyTraitSearchBlock  } from "/wuli-ui/displayBlocksFromSearch.js";
   
     import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample//,
         
        //   api_generateAllTraitSheet
     } from "./apiClient.js";
      import { generateAllTraitSheet, functionState } from "./Mainfunctions/mainFunctions.js";
import WorkspaceController from "./UI/WorkspaceController.js";


async function initDemo() {


 let sheetTimer = null;
const panel_ignored_traits = [ "NECKSTYLE","DNA","_BODY_","_HEAD_","COLORSQN","HELMCREST","WEAPON_PAT","MASK_PAT"] ;

   //==============================================================================================
 const traitPanel = new TraitSelectorPanel({

    container: document.getElementById("final_traitFILTERListContainer"),

    panel_ignored_traits: panel_ignored_traits,
    onAdd: ({ traitKey, value, ids }) => {
           onTraitAdd(traitKey, value, ids) ;
 
    }

});
    
 traitPanel.render(traitData);

//===========================================================================


 
   

    //======================================================================================
  const traitPanelView = new ElementView( '[data-toggle="traits"]');
   viewManager.register("TRAITS", traitPanelView);
   viewManager.hide("TRAITS");
//===============================================================

const filterCard = new InfoCard(
    resultInfo,
    "FILTER",
    "DSL"
);

const foundCard = new InfoCard(
    resultInfo,
    "FOUND",
    "0 NFTs"
);

const sheetCard = new InfoCard(
    resultInfo,
    "SHEETS",
    "0"
);
      


      
 const gridView = new GridView({ 
        container:document.getElementById("grid-container"),
         nftGrid: document.getElementById("nft-grid"),
         onSheetSelected : (page) => { 
                     timeout_generateAllTraitSheet( page, 0 );
             } 
         }
     );
      const sheetView = new SheetView(
             document.getElementById("mainSlotA")
      );

    viewManager.register("SHEET GENERATION", sheetView);
    viewManager.register("SEARCH RESULT", gridView);
    viewManager.setInitialView("SHEET GENERATION");
    
     
  

//============================ layout manager and workspace controller ======================================
const layoutManager = new LayoutManager();

 layoutManager.registerSlot( "sheet",document.getElementById("mainLayoutA"));
 layoutManager.registerSlot( "panel", document.getElementById("panelTraitSlot"));
 layoutManager.registerSlot( "top", document.getElementById("topTraitSlot"));
// layoutManager.registerSlot( "pill", document.getElementById("trait-pill-container"));
 

   layoutManager.registerComponent("traitPills",      document.getElementById("trait-pill-container"));
   layoutManager.registerComponent("previewImg", document.getElementById("previewImg"));  
   layoutManager.registerComponent("final_traitList", document.getElementById("final_traitList")); 
   layoutManager.registerComponent("buttonSet2", document.getElementById("buttonSet2")); 
   layoutManager.registerComponent("queryBox", document.getElementById("queryBox")); 
  // layoutManager.registerComponent("toggleButton", document.getElementById("toggleButton")); 
  

   layoutManager.registerLayout( "squareDesktop", { 
         
          traitPills: "sheet", 
          previewImg:"sheet" ,
         final_traitList:"sheet" 
    
       /* , buttonSet2:"top"*/
        , queryBox:"top"
     });
 


  layoutManager.registerLayout("desktop",
      {  traitPills: "sheet", 
         buttonSet2:"panel", 
         previewImg:"sheet" ,

         final_traitList:"panel" ,
         queryBox:"top"
     });

     layoutManager.registerLayout("largeDesktop", 
         { traitPills: "panel", 
           buttonSet2:"panel", 

            previewImg:"sheet" ,
           final_traitList:"panel" ,
           queryBox:"top"
         });


/*
   layoutManager.registerLayout("desktop", { traitPills: "panel",
     buttonSet2:"panel", 
      final_traitList:"panel" 
     });
     */
 

layoutManager.registerLayout("mobile", 
     { 
        //traitPills: "top"
         traitPills: "sheet", 
          previewImg:"sheet" ,

        
           buttonSet2:"panel",
          final_traitList:"panel" ,

          queryBox:"top"
     });




 
  layoutManager.registerLayout("compactDesktop", { traitPills: "sheet"  });
 
 
 
 
    



const workspace = new WorkspaceController( { layoutManager:layoutManager });

workspace.start();


//==========================================================================


      setTraitUIHandlers({
      onRemoveTrait(traitType, value, uiResult) {
     // console.log("web: pill removed", traitType, value, uiResult);
 
      //      console.log(  " uiResult.pills: " ,   uiResult.pills );
  
                     if (  uiResult.pills.length === 0 ){ 
                        viewManager.hide("filterModeBTN");
                     } 
                    
          
          const apiCall =  async () => { 
                    const result = await api_rebuildActiveFilterMap(
                                    { filterModeABS:        get_UIstate().filterModeABS,
                                     serializeActivePills:  get_UIstate().serializeActivePills
                                    });
               
                     update_activeFilterMap(result);               
            }
            apiCall();
 
    // redraw result grid
  }
});



//import TraitSelectorPanel from '../../../hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/UI_element/traitSelectorPanel.js' ;


//import { renderAbsoluteGrid, setGridVisibility , hideGrid} from "./Render/GridView.js";

//import { queryEngine } from "@wulirocks/collection-engine";
 
//const selectionIDS = document.getElementById( "selectionIDS");
   // selectionIDS.style.width = "100px";
let ResultToClient={}; // result/response from api engine.
//const testarray = [1255,45665,4745,1245];
//selectionIDS.textContent = JSON.stringify(testarray) ;


//console.log( "call_addTrait_inUI   ======= " , call_addTrait_inUI);
 
/*
 //==============================================================================================
 const traitPanel = new TraitSelectorPanel({

    container: document.getElementById("final_traitFILTERListContainer"),

    panel_ignored_traits: panel_ignored_traits,
    onAdd: ({ traitKey, value, ids }) => {
           onTraitAdd(traitKey, value, ids) ;
 
    }

});
    
 traitPanel.render(traitData);
 */
//=================================================================================
const uiRegistry={};
const row1 = document.getElementById("row1");
const buttonSet2 = document.getElementById("buttonSet2") ;

  /*
 uiRegistry.searchTypeResult = document.createElement("div" );
 uiRegistry.searchTypeResult.id = "searchTypeResult";
 uiRegistry.searchTypeResult.textContent = "TRAIT SEARCH";
*/
 //===================================================================
//============================   QUERY BOX =======================================
 
 async function refreshQueryResult ( obj ) { //raw

             let {raw,caret} = obj;
            
            
             const result = await runQueryInputHandler( obj  ); // raw

  
 
           if (result && result.queryMode === "query cleared"){ result.queryMode = "NFT_SEARCH"; }

           if (  result && result.queryMode === "NFT_SEARCH" ){
             
                 result.raw = raw;
                 update_activeFilterMap(result);   
               //  console.log( "nft search result. to  get_UIstate() : "  , result  );
           }
             
             if ( result && result.queryMode === 'DSL'){ 

                  let containsInvalidBlocks = false;
                    if ( result.queryResult.blocks.some(  block => !block.valid) ||
                         result.queryResult.blocks.length === 0     ) { 

                         containsInvalidBlocks = true; // will not save.
                    }
                  

                 // editingIncomplete
                  const editingIncomplete =
                    result.queryResult.blocks.some(  block => block.editingValue?.editingIncomplete
                  );

                if (editingIncomplete) {

                    console.log( "editingIncomplete   "  , editingIncomplete  );
                    return;
                }else{ 
                     console.log( "update editingIncomplete   "  , editingIncomplete  );
                }


                 raw = result.queryResult.normalizedQuery;
                 queryBox.input.setValue( result.queryResult.normalizedQuery );
                 queryBox.input.setCaret(result.queryResult.updatedCaret   );
  
                 //===========================================================
                 result.raw = raw;
                 result.containsInvalidBlocks = containsInvalidBlocks;
                 update_activeFilterMap(result); 
                 //===================================================================  
             
                 result.queryResult.raw = raw;
                 queryBox.updateAssistant(result.queryResult);

                
                 //==========================
              //   result.queryResult.blocks.forEach(block => {

                    const actionTrigger = result.queryResult.actionTrigger ;
                     console.log( " actionTrigger  =" ,   actionTrigger );
                    if (!actionTrigger){ 
                           return;
                    }

                   
                     console.log( "actionTrigger.anchorPosition  =" ,   actionTrigger.anchorPosition );
                    


                    const blocks = result.queryResult.blocks;
                    const updatedCaret = result.queryResult.updatedCaret;
                    const block = queryBox.getBlockFromCaret( blocks, actionTrigger.anchorPosition );

                       console.log( " blocks =" ,   blocks );
                  

                     switch ( actionTrigger.type ) {

                    
                    case "CREATE_PRODUCER":
                         
                          queryBox.showProducterOption(block);
 
                     break; 
                     case "SELECT_TRAIT":   
                           queryBox.showCorrections(block);
 
                     break;
                     

                    case "OPEN_VALUE_DROPDOWN":

                        dropdown.openValueList(
                            result.actionTrigger.payload.trait
                        );

                        break;

                    case "CLOSE_DROPDOWN":

                        dropdown.close();

                        break;
                  }
               //  });
                
 

             }

            if ( result && result.queryMode === 'TRAIT_SEARCH'){ 
                // here NO update activeFilterMap(). because there is no selection result, it is only adrop down filtering.
                applyTraitSearchBlock(raw);
               // console.log( "trait search result ", result );
              }


            
         
 

 }



    //console.log( " queryInput   =====   " , document.getElementById("queryInput"));
    const queryStore = new QueryStore();

    await queryStore.initialize(api_getQueryExample)  ;
 

    const queryBox = new QueryBox(
        document.getElementById("queryBox"),
        queryStore,
        refreshQueryResult
    );

    
    /*
   const Call_api_getQueryExample =  async () => { 
             const queryMap = await api_getQueryExample({} );

             console.log("queryMap   ===== " ,  queryMap  );
             queryStore.setQueries(queryMap);
               
    }
    Call_api_getQueryExample();
*/



//=====================================================
 //=================================================================
 


 //   uiRegistry.loadQueryBtn.id = "loadQueryBtn";
 //===========================

  

  //===================================================== 
  const prevBatchButton = new RunButton({
        container:  row1  ,
        label :"<",
        onClick: async () => {
           //   console.log(  "prev BatchButton clicked ");
   
              timeout_generateAllTraitSheet( functionState.batchIndex, -1 );
        }
    });
    //nextBatchButton.button.dataset.tool = "mainSlotA";
    prevBatchButton.button.classList.add("btn_navGuide");
    prevBatchButton.button.style.width = "20px";
    
//======================================================== 
 //===================================================== 
 const nextBatchButton = new RunButton({
        container:  document.getElementById("row1") ,
        label :">",
         onClick: async () => {
 
           
 
            // generate All TraitSheet( functionState.batchIndex, 1  );
        }
    });
   
    nextBatchButton.button.classList.add("btn_navGuide");
    nextBatchButton.button.style.width = "20px";  
   
//======================================================== 
//=====================================================
//=====================================================
   document.getElementById("panelToggle").addEventListener("click", (e) => {
             viewManager.toggle("TRAITS");
    });
 
//======================================================== 
//======================================================== 
const filterModeToggle = new ToggleButton({

    containerId: "trait-pill-container", 
     id:"toggleButton",
     label: "Filter",
     className : "filterModeToggleBtn",
    values: ["OR","AND"],

   // onChange: (value) => {

     //   console.log(value); // "AND" or "OR"
 
    //}});
 
/*

const Show_Trait_Inputs_Toggle = new ToggleButton({
    containerId: "buttonSet2",
    label: "Show Trait Inputs",
    initialState: false,*/
      onChange:   (values) => {
        
      //  console.log("   onChange:   (values) =>  "  , values  );
        get_UIstate().filterModeABS = values;
        /*
      if (values){ 
            get_UIstate().filterModeABS = "AND";
        }else{ 
            get_UIstate().filterModeABS = "OR";
          
      }*/
 
    const apiCall =  async () => { 
             const result = await api_set_filterModeABS(
                             { filterModeABS:        get_UIstate().filterModeABS,
                               serializeActivePills:  get_UIstate().serializeActivePills
                             });
   

       // console.log( "filterModeABS toggle   result:",  result );

         update_activeFilterMap(result);        
 
    }
    apiCall();
    //===========================================================================


             
        //console.log("Watcher state:", state);
    }
});
//======================================================================================
    const filterModeView = new ElementView( '[class="filterModeToggleBtn"]');
   viewManager.register("filterModeBTN", filterModeView);
   viewManager.hide("filterModeBTN");
//===============================================================

//Show_Trait_Inputs_Toggle.id = "toggleButton";
 
//================================================================================================

const tierOptions = [
      { id: "SHEET GENERATION", label: "SHEET GENERATION" },
      { id: "SEARCH RESULT", label: "SEARCH RESULT" },
  ];

   



//======================================================================================================

//=====================================================================
  //=======================================================================================
   
    async function runQueryInputHandler( obj   ) { //raw
     const result = await api_runQueryInputHandler( obj  ); //raw
       
       

    return result;
}


 //=====================================================================
  //=======================================================================================

  async function onTraitAdd(traitKey, value, ids) {
      
    // activeTraitUI_result add the pills and serialize. make sure you run this before api_addtrait engine loi
        const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
        //   console.log( "activeTraitUI_result.pills = =========== \n" , activeTraitUI_result.pills  );
       //    console.log( " get_UIstate().serializeActivePills = =========== \n" , get_UIstate().serializeActivePills );
     
            const objArg =   {  filterModeABS:         get_UIstate().filterModeABS,
                                serializeActivePills:  get_UIstate().serializeActivePills
                            };
        //    console.log( " onTraitAdd objArg = =========== \n" , objArg  );  
             
              // const result = await api_rebuildActiveFilterMap( objArg);
                  const result = await  api_addTraitSelection  (  traitKey, value , ids , objArg )  ;       
                   
                 // console.log( " onTraitAdd result = =========== \n" , result  );             
                update_activeFilterMap(result);                   
               // get_UIstate().queryMode = "TRAIT_SEARCH";
       
                
        
          viewManager.show("filterModeBTN");
 
 
}

/*
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
    
  }
*/





// make sure all variables are up to date after api response/result
  function update_activeFilterMap(result){ 
          //============================== Client UI display ==============================  
              
               
                if (result.queryMode.includes("TRAIT") ){ 
                   result.queryMode = "TRAITS";
                }
                filterCard.setValue(result.queryMode);
                foundCard.setValue(result?.activeFilterMap_IDS.length);

              //======================================================================             
            
               //==============================  Client Data/ session memory  ==============================   
           
                get_UIstate().activeFilterMap_IDS = result.activeFilterMap_IDS;

                get_UIstate().activeFilterMap_suffleIDS = result.activeFilterMap_suffleIDS;

                get_UIstate().IDS_Match_Count     = result.activeFilterMap_IDS.length;
                get_UIstate().queryMode = result.queryMode;
                get_UIstate().raw = result.raw;
                get_UIstate().dna = result.dna;
                get_UIstate().queryData = result.queryData;
                get_UIstate().containsInvalidBlocks = result.containsInvalidBlocks;

           // update grid IDS result for dislpay
                gridView.setNFTIds(get_UIstate().activeFilterMap_suffleIDS);
           

             //===========================================================================


                timeout_generateAllTraitSheet( null ,0 );
  
                   





  }


  function timeout_generateAllTraitSheet(batchNumber,incr ){ 
                    clearTimeout(sheetTimer);
                    sheetTimer = setTimeout(() => {
                        viewManager.show("SEARCH RESULT");
                         generateAllTraitSheet( batchNumber,incr );
                        sheetCard.setValue(get_UIstate().totalSheetCount); 


                         console.log( "sheetTimer   =",  sheetTimer);
                      //  generateAllTraitSheet(queryResult);
                    }, 1050);
  }

}
initDemo();
  
 