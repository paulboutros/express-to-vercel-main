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
         
       
     } from "./apiClient.js";
      import { generateAllTraitSheet, functionState } from "./Mainfunctions/mainFunctions.js";
import startLayoutEngine from "./LayoutEngine.js";

      

 
 export default async function initDemo(){

console.log("initDemo()");
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
    
     
 const layoutEngine = startLayoutEngine({mode:"demo"});


      setTraitUIHandlers({
      onRemoveTrait(traitType, value, uiResult) {
     
  
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

 
let ResultToClient={}; // result/response from api engine.
 
//=================================================================================
const uiRegistry={};
const row1 = document.getElementById("row1");
const buttonSet2 = document.getElementById("buttonSet2") ;

   
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

                //    commenting out the input re-write no longer needed
                //   comment rem. actually needed when select trait from panel, write to input
                 raw = result.queryResult.normalizedQuery;
                  queryBox.input.setValue( result.queryResult.normalizedQuery );

                 queryBox.input.setCaret(result.queryResult.updatedCaret   );
  
                 //===========================================================
                 result.raw = raw;
                 result.containsInvalidBlocks = containsInvalidBlocks;
               
                 result.queryResult.raw = raw;
                 queryBox.updateAssistant(result.queryResult);

                  const actionTrigger = result.queryResult.actionTrigger ;

                  if (!actionTrigger){ 
                         update_activeFilterMap(result); 
                  }
                 
                 
                   
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

                     //   dropdown.openValueList(
                           // result.actionTrigger.payload.trait
                      //  );

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
      
     const queryStore = new QueryStore();
     await queryStore.initialize(api_getQueryExample)  ;
 

    const queryBox = new QueryBox(
        document.getElementById("queryBox"),
        queryStore,
        refreshQueryResult
    );
  
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

  
      onChange:   (values) => {
        
      //  console.log("   onChange:   (values) =>  "  , values  );
        get_UIstate().filterModeABS = values;
       
 
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
 
    }
});
//======================================================================================
    const filterModeView = new ElementView( '[class="filterModeToggleBtn"]');
   viewManager.register("filterModeBTN", filterModeView);
   viewManager.hide("filterModeBTN");
//===============================================================

 
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
             
             
                const result = await  api_addTraitSelection  (  traitKey, value , ids , objArg )  ;       
                   
                       
                update_activeFilterMap(result);                   
              
                
        
          viewManager.show("filterModeBTN");
 
 
}
 

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
//initDemo();
  
 