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
             refreshPipeline,
             setPageDataset
        
           } from "./Mainfunctions/mainFunctions.js";
import startLayoutEngine from "./LayoutEngine.js";
import PayloadWidget from "./UI/widget/payloadWidget.js";
import { renderNavigationTree } from "./navigationTree.js";
 
 
 
 //import guide_include_operator from "./guideContent/guide_include_operator.js";
 let layoutEngine = null;
 let pathIndex =0;
let guideComponent = null;
let queryBox = null;
let sheetCard = null;
let foundCard = null;
let traitPanelView = null;
let payloadWidget =null;
let gridView= null;
let sheetView = null;
let siteNavigationDOM_created = false;

 let navigationPaths =  null;
let siteNavigationData = null;
 let currentCollection;
let uiComponentLoaded = false;


 const final_traitList = document.getElementById("final_traitList");
  const queryStore = new QueryStore();
   queryBox = new QueryBox(
                document.getElementById("queryBox"),
                queryStore,
                refreshQueryResult
               );


async function loadUIcomponent( objArg ){   // const raw = pageData.query;//    

const  {collection, pageData} = objArg;

 
if ( uiComponentLoaded) return;
if (!uiComponentLoaded){uiComponentLoaded = true;}
 


     


  currentCollection = collection;

   
     sheetCard = new InfoCard( resultInfo,"SHEETS","0");
     foundCard = new InfoCard(  resultInfo,"FOUND","0 NFTs");
      
        
        
    
  

 
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
 


 await queryStore.initialize(api_getQueryExample);


const raw = pageData.query;//    

 switch (collection) {
        case "guide":
            
           /*
                queryBox = new QueryBox(
                document.getElementById("queryBox"),
                queryStore,
                refreshQueryResult
               );*/
            
             queryBox.input.setValue(raw);

             
             refreshQueryResult({raw: raw, caret: raw.length,  action: null,  command:null });
               create_SiteNavigation();

               setDOM(  {queryBox, activeCollection:collection, layoutEngine });
 
             break;
       case "apiPipeline":
                   
                      
                     queryBox.collection = collection;
                  
        
 
                   create_SiteNavigation();
              


       
       break;

        case "purpose":
        case "introduction":
        case "reference":
           create_SiteNavigation();
        break;
     
        default:
            break;
     }

}



 async function create_SiteNavigation(){

  if (siteNavigationDOM_created ){ return; }
      siteNavigationDOM_created = true;
      

    
     console.log( "navigationPaths =" , navigationPaths  );

                  renderNavigationTree(  
                    siteNavigationData,
                
                    document.querySelector("#final_traitFILTERListContainer"),
                     {
                        currentPageId: "pipeline-search",
                         onNavigate(node) {
                             const collection = node.collection; 
                             const slug = node.path;
                             console.log("NAVIGATE:", node);

                             const fullPath = `/${ collection}/${ slug}`;
                             history.pushState({},"",fullPath);


                           // console.log( "  currentCollection =   "  , currentCollection );

         
                             if (currentCollection === collection){

                                 updatePage({ collection, slug });
                             }else{ 
                               
                                updatePage({ collection, slug });
                                //window.location.href = fullPath;
                             } 
                            


                            
                        
                        }
                 });
                 final_traitList.classList.remove("panel-hidden");


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
 
     setPageDataset();
  
     const allPageData    = await api.getPageData();
     const pageData       = allPageData[collection].pages[slug];
     const path           = navigationPaths[collection];// allPageData.paths[collection];
           pathIndex      = Number( path.indexOf(slug) );

      // default 
    get_UIstate().cardToDisplay = "nft_id";
                //vidFilter.cardToDisplay = "weapon_and_shield";  
                  //vidFilter.cardToDisplay = "nft_id";
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
         /*
                queryBox = new QueryBox(
                document.getElementById("queryBox"),
                queryStore,
                refreshQueryResult
              );*/
            
             setDOM({ activeCollection:collection, sheetCard,foundCard, viewManager, queryBox});
             queryBox.input.setValue(raw);
              
             refreshQueryResult({raw: raw, caret: raw.length, action: null, command:null});
        
       break;
        case "purpose":

           //to do: replace by id page id = "games"
            if (raw){
               setDOM({ activeCollection:collection, sheetCard,foundCard, viewManager, queryBox});
               queryBox.input.setValue(raw);

                get_UIstate().cardToDisplay = "weapon_and_shield";
                //vidFilter.cardToDisplay = "weapon_and_shield";  
                  //vidFilter.cardToDisplay = "nft_id";
               refreshQueryResult({raw: raw, caret: raw.length, action: null, command:null});
            }

        break;
       case "reference":



       break;
       
       case "apiPipeline":
               
             const testquery = {raw: raw, caret: raw.length,  action: null,  command:null }
             
             setDOM({ activeCollection:collection, sheetCard,foundCard, viewManager, queryBox});
             const result = await refreshQueryResult(testquery);
                   
            
            refreshPipeline(result);
 
       
       break;

       default:
       break;
     }
     

     addNavigationButton(  path, pathIndex, collection );
     
      
     return { allPageData, pageData, path  }
}


function addNavigationButton( path, pathIndex, collection){ 
     const navigButton = document.getElementById("guideNavigation");
   const prevBatchButton = new RunButton({
        container:  navigButton  ,
        label :"<",
        onClick: async () => {
             const previousPage = path[pathIndex - 1] ?? null;
             if (previousPage) {
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

 }


export default async function initGuide({slug, collection} = getCurrentRoute()) {
 
    viewManager.register("SHEET GENERATION", sheetView);
    viewManager.register("SEARCH RESULT", gridView);
    viewManager.setInitialView("SHEET GENERATION");
    layoutEngine = startLayoutEngine({mode:"guide"});
      
    siteNavigationData  = await api.getSiteNavigationData();
    navigationPaths     = buildNavigationPaths( siteNavigationData);
  
    const { allPageData, pageData, path} = await updatePage({collection, slug});
  
let sheetTimer = null;
const panel_ignored_traits = [ "NECKSTYLE","DNA","_BODY_","_HEAD_","COLORSQN","HELMCREST","WEAPON_PAT","MASK_PAT"] ;
 
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
 
   
   //============================================================
     console.log("slug=============" , slug )
    

         const pills = document.getElementById("trait-pill-container");pills?.classList.add("hidden");
         //final_traitList?.classList.add("hidden"); 
         const activeTraitBar  = document.getElementById("activeTraitBar"); activeTraitBar?.classList.add("hidden"); 
         const mainLayoutC  = document.getElementById("mainLayoutC");// mainLayoutC?.classList.add("hidden"); 
         
         const panelToggle     = document.getElementById("panelToggle");
         // panelToggle?.classList.add("hidden"); 

          
         const buttonSet2     = document.getElementById("buttonSet2"); buttonSet2?.classList.add("hidden"); 
  
    panelToggle.addEventListener("click", (e) => {

       
             viewManager.toggle("TRAITS");
    });
 
//======================================================== 
/*
  const traitPanel = new TraitSelectorPanel({
       container: document.getElementById("final_traitFILTERListContainer"),
       panel_ignored_traits: panel_ignored_traits,
      onAdd: ({ traitKey, value, ids }) => {
             onTraitAdd(traitKey, value, ids) ;
   
      }
   });
    traitPanel.render(traitData);
*/

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
 


function buildNavigationPaths(siteNavigationData) {

    const navigationPaths = {};
  
    function collect(nodes, collection = null) {

        for (const node of nodes) {

            const currentCollection =
                 node.collection || collection;

            if (node.path && currentCollection) {

                if (!navigationPaths[currentCollection]) {
                    navigationPaths[currentCollection] = [];
                }

                navigationPaths[currentCollection].push(
                    node.path
                );
            }

            if (node.children?.length) {

                collect(
                    node.children,
                    currentCollection
                );
            }
        }
    }

    collect(siteNavigationData);

       return navigationPaths;
}
  
