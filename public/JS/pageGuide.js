//D:\GIT\hashLipsWuli\hashlips_art_engine\utils\NFT_ELECTRON\UI_element

 /* SPA:
 That's an excellent question, and the answer is actually one of the key concepts behind SPAs.
 Express is no longer involved because the browser never makes a new HTTP request.
 */

 
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
     import QueryAssistant from "/wuli-ui/QueryBox/QueryAssistant.js";
    
    

      import HorizontalSelector from "/wuli-ui/HorizontalSelector.js";

      // ui webapp specific
     //==================================================================================
      import  viewManager  from "./UI/ViewManager.js";
     
    import  GridView  from "./UI/GridView.js";
    import  SheetView  from "./UI/SheetView.js";
    import PanelToggle from "./UI/PanelToggle.js";
    import { ElementView } from "./UI/elementView.js";
    import InfoCard from "./UI/infoCard.js";
    import GuideComponent from "./UI/guideComponent.js";
  
    //======================================================================================
      import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "/wuli-ui/filterPills.js";
     import { applyTraitSearchBlock  } from "/wuli-ui/displayBlocksFromSearch.js";
   
     import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample//,
         
        //   api_generateAllTraitSheet
     } from "./apiClient.js";
      import { generateAllTraitSheet, functionState,
            refreshQueryResult, setDOM,
             refreshPipeline
        
           } from "./Mainfunctions/mainFunctions.js";
import startLayoutEngine from "./LayoutEngine.js";
import PayloadWidget from "./UI/widget/payloadWidget.js";
 
 
 
 //import guide_include_operator from "./guideContent/guide_include_operator.js";
 let pathIndex =0;
let guideComponent = null;
let queryBox = null;
let sheetCard = null;
let traitPanelView = null;
let payloadWidget =null;
let gridView= null;
 let  sheetView = null;

let uiComponentLoaded = false;
async function loadUIcomponent( objArg ){   // const raw = pageData.query;//    

if ( uiComponentLoaded) return;
if (!uiComponentLoaded){uiComponentLoaded = true;}



   
     sheetCard = new InfoCard( resultInfo,"SHEETS","0");
 
     traitPanelView = new ElementView( '[data-toggle="traits"]');
   viewManager.register("TRAITS", traitPanelView);
   viewManager.hide("TRAITS");




   gridView = new GridView({ 
        container:document.getElementById("grid-container"),
         nftGrid: document.getElementById("nft-grid"),
         onSheetSelected : (page) => { 
                     timeout_generateAllTraitSheet( page, 0 );
             } 
         }
     );
     sheetView = new SheetView(
             document.getElementById("mainSlotA")
      );





const queryStore = new QueryStore();
 await queryStore.initialize(api_getQueryExample);

const  {collection, pageData} = objArg;
const raw = pageData.query;//    

 switch (collection) {
        case "guide":
            
          //  if (!queryBox){
                queryBox = new QueryBox(
                document.getElementById("queryBox"),
                queryStore,
                refreshQueryResult
              );
           // }
             queryBox.input.setValue(raw);
             refreshQueryResult({raw: raw, caret: raw.length,  action: null,  command:null });
       break;
       case "apiPipeline":
           
           
                   
                  
                      queryBox = new QueryBox(
                      document.getElementById("queryBox"),
                      queryStore,
                      refreshQueryResult
                    );
       
                  setDOM({queryBox, activeCollection:collection });


                  
                  //============================================================================
                  
                   



       
       break;
       case "reference":
       break;
     
        default:
            break;
     }

}




 
function getCurrentRoute() {

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return {

        collection: parts[0] || "guide",

        slug: parts[1] || "include-operator"

    };

}
 



 /*
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
 */

window.addEventListener("popstate", () => {
    //const { collection, slug } = getCurrentRoute();
          updatePage(getCurrentRoute());
  });


//let pageAlreadyRendered = false;
async function updatePage({collection, slug}= getCurrentRoute() ){ 

    

 
     const allPageData     = await api.getPageData();
     const pageData     = allPageData[collection].pages[slug];
     const path         = allPageData.paths[collection];
           pathIndex    = Number( path.indexOf(slug) );

           console.log( "path ====   " , path  )
    //================================================================

    
    if (!guideComponent){ 
           guideComponent = new GuideComponent({
           container: document.getElementById("guideTextBlock"),
       }); 
    }
    console.log( " pageData  =======" , { 
        collection,
        slug,
        pageData

    });
    guideComponent.show(pageData);  
    const raw = pageData.query;//    

     await loadUIcomponent( {collection, pageData}); // const raw = pageData.query;//    
 
     switch (collection) {
        case "guide":
            
       break;
      
       case "reference":
       break;
       
       case "apiPipeline":
               
                     const testquery = {raw: raw, caret: raw.length,  action: null,  command:null } 
                     const result = await refreshQueryResult(testquery);
                   
                 
                    refreshPipeline(result);


                 
                 

       
       break;

       default:
       break;
     }
     

     setDOM({ activeCollection:collection, sheetCard,viewManager,queryBox}); 
     return { allPageData, pageData, path  }
}





export default async function initGuide({slug, collection} = getCurrentRoute()) {
 
    viewManager.register("SHEET GENERATION", sheetView);
    viewManager.register("SEARCH RESULT", gridView);
    viewManager.setInitialView("SHEET GENERATION");
    const layoutEngine = startLayoutEngine({mode:"guide"});
 
     
  
  const { allPageData, pageData, path} = await updatePage({collection, slug});
 
  console.log(" init Guide  () = " );
      

let sheetTimer = null;
const panel_ignored_traits = [ "NECKSTYLE","DNA","_BODY_","_HEAD_","COLORSQN","HELMCREST","WEAPON_PAT","MASK_PAT"] ;
 
 //======================================================================================
/*
  const traitPanelView = new ElementView( '[data-toggle="traits"]');
   viewManager.register("TRAITS", traitPanelView);
   viewManager.hide("TRAITS");
   */
//===============================================================
  
      /*
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
      */
     /*
    viewManager.register("SHEET GENERATION", sheetView);
    viewManager.register("SEARCH RESULT", gridView);
    viewManager.setInitialView("SHEET GENERATION");
    
     
 const layoutEngine = startLayoutEngine({mode:"guide"});
*/

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
//const buttonSet2 = document.getElementById("buttonSet2") ;

const navigButton = document.getElementById("navigButton");
   
 //===================================================================
//============================   QUERY BOX =======================================
        
 
   
   //============================================================
     console.log("slug=============" , slug )
    

         const pills = document.getElementById("trait-pill-container");pills?.classList.add("hidden");
         const final_traitList = document.getElementById("final_traitList"); final_traitList?.classList.add("hidden"); 
         const activeTraitBar  = document.getElementById("activeTraitBar"); activeTraitBar?.classList.add("hidden"); 
         const panelTraitSlot  = document.getElementById("panelTraitSlot"); panelTraitSlot?.classList.add("hidden"); 
         const panelToggle     = document.getElementById("panelToggle"); panelToggle?.classList.add("hidden"); 
        // const result_area     = document.getElementById("result-area"); result_area?.classList.add("hidden"); 
         const buttonSet2     = document.getElementById("buttonSet2"); buttonSet2?.classList.add("hidden"); 
 
          
    
    //===================================================== 
  const prevBatchButton = new RunButton({
        container:  navigButton  ,
        label :"<",
        onClick: async () => {
             const previousPage = path[pathIndex - 1] ?? null;
             if (previousPage) {
             //  location.href =`/guide/${previousPage}`;
               //initGuide(previousPage);
                 // spa style
                 history.pushState({},"",`/${collection}/${previousPage}`);
                 updatePage({collection, slug:previousPage});
            }
        }
    });
    
    prevBatchButton.button.classList.add("btn");
  
 //===================================================== 
 const nextBatchButton = new RunButton({
        container:  navigButton,
        label :">",
         onClick: async () => {
   
             const nextPage = path[pathIndex + 1] ?? null;
             if (nextPage) {
              
                    // spa style
                    history.pushState({},"",`/${collection}/${nextPage}`);
                    updatePage({collection, slug:nextPage});
             }
 
        }
    });
   
    nextBatchButton.button.classList.add("btn");
 
   
  
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
 
 
  //=======================================================================================

  async function onTraitAdd(traitKey, value, ids) {
      
    // activeTraitUI_result add the pills and serialize. make sure you run this before api_addtrait engine loi
        const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
      
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


  


 

}
 
  
 