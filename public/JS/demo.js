 
 

 
// browser use this only no require
//import wuliData from '@wulirocks/collection-engine/storage/writeServices.js';
 
 
     import * as api from "./apiClient.js";

     const traitData = await api.getTraitData();
   
     // wuli ui oackage
     import TraitSelectorPanel from "./wuli-ui/traitSelectorPanel.js";
     import  ToggleButton   from "./wuli-ui/toggleButton.js";
     import  RunButton from "./wuli-ui/runButton.js";
     import QueryBox from "./wuli-ui/QueryBox/QueryBox.js";
     import QueryStore from "./wuli-ui/QueryBox/QueryStore.js";
     import QueryDropdown from "./wuli-ui/QueryBox/QueryDropdown.js";
    

      import HorizontalSelector from "./wuli-ui/horizontalSelector.js";

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
    } from "./wuli-ui/filterPills.js";
     import { applyTraitSearchBlock  } from "./wuli-ui/displayBlocksFromSearch.js";
   
     import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample//,
         
       
     } from "./apiClient.js";
      import { generateAllTraitSheet, functionState, setDOM 
                 ,propagateQueryResult
                 ,timeout_generateAllTraitSheet,

                 refreshQueryResult,
                 timeout_saveSheet

       } from "./Mainfunctions/mainFunctions.js";
import startLayoutEngine from "./LayoutEngine.js";
import { buildNavigationPaths, create_SiteNavigation, setNavigationPaths } from "./navigationTree.js";

      

 
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
 
//===============================================================
     let siteNavigationData  = await api.getSiteNavigationData();
     setNavigationPaths(  buildNavigationPaths( siteNavigationData)   );
     create_SiteNavigation();

//=============================================

 //======================================================================================
 // then go workspaceController to adjust 
 // check button id: panelToggle
 const traitPanelView = new ElementView( '[data-toggle="traits"]');
       viewManager.register("TRAITS", traitPanelView);
       viewManager.hide("TRAITS");
// check button id: navigToggle
  const navigPanelView = new ElementView( '[data-toggle="navigation"]');
       viewManager.register("NAVIGVIEW", navigPanelView);
       viewManager.hide("NAVIGVIEW");     
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
 setDOM({sheetCard , foundCard, filterCard , viewManager })    


      
 const gridView = new GridView({ 
        container:document.getElementById("grid-container"),
         nftGrid: document.getElementById("nft-grid"),
         onSheetSelected : (page) => { 
                     timeout_generateAllTraitSheet( page, 0 );
             } 
  });
  setDOM({gridView});
     
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
               
                     propagateQueryResult(result);               
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

    
     const queryStore = new QueryStore();
     await queryStore.initialize(api_getQueryExample)  ;
 

    const queryBox = new QueryBox(
        document.getElementById("queryBox"),
        queryStore,
        refreshQueryResult
    );
    setDOM({queryBox});
  
  //===================================================== 
  /*
  const prevBatchButton = new RunButton({
        container:  row1  ,
        label :"<",
        onClick: async () => {
           //   console.log(  "prev BatchButton clicked ");
   
              timeout_generateAllTraitSheet( functionState.batchIndex, -1 );
        }
    });
     
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
   */
//======================================================== 
//=====================================================
//=====================================================


   

   document.getElementById("querySave").addEventListener("click", (e) => {
               timeout_saveSheet( null ,0 );
   });
   document.getElementById("panelToggle").addEventListener("click", (e) => {
             viewManager.toggle("TRAITS");
   });
   document.getElementById("navigToggle").addEventListener("click", (e) => {
             viewManager.toggle("NAVIGVIEW");
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
   
       
         propagateQueryResult(result);        
 
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
       
            const objArg =   {  filterModeABS:         get_UIstate().filterModeABS,
                                serializeActivePills:  get_UIstate().serializeActivePills
                            };
      
             
             
                const result = await  api_addTraitSelection  (  traitKey, value , ids , objArg )  ;       
                   
                       
                propagateQueryResult(result);                   
              
                
        
          viewManager.show("filterModeBTN");
 
 
}
  
}



//initDemo();
  
 