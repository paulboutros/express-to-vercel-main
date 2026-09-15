 




import { loadUserPreferences } from "../UserPreferences.js";
console.log( "loaded: loadUserPreferences  ");

  

 import { applyTraitSearchBlock  } from "../wuli-ui/displayBlocksFromSearch.js";
//import {  } from "../apiClient.js";
import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample ,
          api_generateAllTraitSheet,
          api_saveSheet,
          api_collection_register,
          api_getTraitData
        
     } from "../apiClient.js"; 

import { drawConnector,pt ,clearConnectors, layoutNodes,
        getRequiredHorizontalWidth
 } from "../wuli-ui/pipelineFunction.js";

import RunButton     from "../wuli-ui/runButton.js";
import QueryDropdown from "../wuli-ui/QueryBox/QueryDropdown.js";
     

   import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "../wuli-ui/filterPills.js";
import { appendTokenInfo } from "../wuli-ui/dataRepresentation/tokenDataToNode.js";
import { getProject, getProjectStore, initLocalStorage } from "./localStorageAccess.js";
//import { getElement } from "./DOMregistry.js";
import InfoCard from "../UI/infoCard.js";
import { uploadJSON } from "../copyEmbed.js";
  //import { get } from "lodash";
 

   initLocalStorage();
 let projectId = null;
  const project = getProject(); 
   if (  project ) { 
         projectId = project.id
    }  

    console.log(  "project =========== " , project );

 let traitData = await api_getTraitData( {collectionId: projectId });

  if (traitCounter_Data  ){ 

     //console.log(  "main F 1) api_collection_registerExistingData  " ,   );
   await  api_collection_registerExistingData( traitCounter_Data);
  //  console.log(  "main F 2) api_getdata  " ,   );
   traitData = await api_getTraitData( {collectionId: projectId });
  }


export function getTraiDataResult(){
     return traitData;
}

const maxDepthByTokenType = {

    COMPLETE_PRODUCER: 1,
    PARTIAL_PRODUCER: 1,
    TRAIT: 2,
    VALUE: 3 
     

};


export const functionState={
    batchIndex:0
}

 const DOM = {
    root:null, 
    layoutEngine: null,
    activeCollection: null,

    sheetCard: null,

    viewManager: null,

    gridView: null,

    filterCard: null,

    foundCard: null,

    queryBox: null,


   traitPanel:null,
   traitpanel_widget: null,


    queryInput:null,
    queryAssistant:null,

    dropDownExample:null,

     
};   
export function getUIelements(){
    return DOM;
}


 const pipelineState = new Map();

 let uploadBtn;
let nodeGraph     ; 
let nodeGraphScroll ; 
let nodeGraphCanvas ; 

let queryAssistantContent; 
let previewImg ; 
 let resultInfo;
 

 




/*
//====================================================================
    
   */
const userPreferences =  loadUserPreferences();

  function getElement(id) {
        return DOM.root.querySelector(`#${id}`);
    }
export function setAllElement( 
    {   root = document,
        createInfoResult = false
    } = {} ){ 
 
     setDOM({root});

    uploadBtn  = getElement("uploadBtn"); 
    uploadBtn?.addEventListener("click", (e) => {
         
        uploadBtn_rarity_function(); 

   });
  

  nodeGraph        = getElement("nodeGraph"); 
  nodeGraphScroll   = getElement("nodeGraphScroll"); 
  nodeGraphCanvas  = getElement("nodeGraphCanvas"); 

  queryAssistantContent  = getElement("queryAssistantContent"); 

  previewImg = getElement("previewImg");
 
  resultInfo = getElement("resultInfo");

 DOM.queryInput       = getElement("queryInput");
 DOM.queryAssistant  = getElement("queryAssistant");   

 
 //console.log("  DOM.queryAssistant  =========   "  ,   DOM.queryAssistant   );

 
 
    if (createInfoResult ){ 
       const filterCard = new InfoCard(resultInfo,"FILTER","DSL");
       const sheetCard = new InfoCard( resultInfo,"SHEETS","0");
       const foundCard = new InfoCard(  resultInfo,"FOUND","0 NFTs");
       setDOM({ filterCard, sheetCard,foundCard });
   }

}

// duplicated.. to ./pageDataset.js // todo: ajust all script import 
export function setPageDataset(){ 
 const path = window.location.pathname;


 
const pathSegments = path.split("/").filter(Boolean);
 if (pathSegments.includes("embed")) {
     document.body.dataset.page = "embed"; 
     return;
} 
  
 document.body.dataset.page = "demo";
   
    
 if ( path.startsWith("/guide") ||
      path.startsWith("/introduction") || 
      path.startsWith("/reference")  || 
      path.startsWith("/purpose") 
     

){ 
     document.body.dataset.page = "guide";

}  
if ( path.startsWith("/apiPipeline")   ){ 
      document.body.dataset.page = "apiPipeline";
}
  

}


export async function saveSheet(batchNumber, incr , options={}){ 
     
    
           const maxPerSheet = 6;
          const totalSheetCount = Math.ceil(      get_UIstate().activeFilterMap_IDS.length   / maxPerSheet);


                get_UIstate().totalSheetCount = totalSheetCount;
           
                 functionState.batchIndex =  functionState.batchIndex % totalSheetCount; //reseting it first
                functionState.batchIndex = (functionState.batchIndex + incr) % totalSheetCount;
                 if(functionState.batchIndex <0 )  { functionState.batchIndex = totalSheetCount-1 }
 


                  var vidFilter = get_VideoFilterObject(); // get_featState().get_VideoFilterObject();
                  vidFilter.batchNumber = functionState.batchIndex;
                  vidFilter.userPreferences = userPreferences;
                  vidFilter.options = options;
                  if (batchNumber ){ 
                      vidFilter.batchNumber = batchNumber;
                  }

              
             

                 let result = await api_saveSheet({
                     videoFilterObject : vidFilter 
                 
                 });

}

export async function generateAllTraitSheet(batchNumber, incr , options={}){ 
                

    
           const maxPerSheet = 6;
          const totalSheetCount = Math.ceil(      get_UIstate().activeFilterMap_IDS.length   / maxPerSheet);


                get_UIstate().totalSheetCount = totalSheetCount;
           
                 functionState.batchIndex =  functionState.batchIndex % totalSheetCount; //reseting it first
                functionState.batchIndex = (functionState.batchIndex + incr) % totalSheetCount;
                 if(functionState.batchIndex <0 )  { functionState.batchIndex = totalSheetCount-1 }
 


                  var vidFilter = get_VideoFilterObject(); // get_featState().get_VideoFilterObject();
                
                
                  vidFilter.collectionId = project.id;// collectionId;
                  vidFilter.batchNumber = functionState.batchIndex;
                  vidFilter.userPreferences = userPreferences;
                  vidFilter.options = options;
                  if (batchNumber ){ 
                      vidFilter.batchNumber = batchNumber;
                  }

              
             

                 let result = await api_generateAllTraitSheet({
                     videoFilterObject : vidFilter 
                 
                 });
                 
                  
                  
              //   previewImg.innerHTML = "";
                 
              for (let index = 0; index <  result.currentPreviewURLList.length; index++) {
  
               
                 //  const img = document.createElement("img");
                   const  img = previewImg.querySelector(".previewImg") ; 

 
                     const bufferData =   result.currentPreviewURLList[index].data;
                        

                       const byteArray = new Uint8Array(bufferData);
                       const blob = new Blob([byteArray], { type: "image/jpeg" });
 
                     let objUrl = URL.createObjectURL(blob);
                      img.src = objUrl;
                   

                   //  previewImg.appendChild(img); 
              }
 
            



}
 

export async function refreshQueryResult ( obj ) { //raw

             let {raw,caret} = obj;
            
              obj.collectionId = project.id;// collectionId;
            
             const result =  await runQueryInputHandler(obj); // raw

  
 
           if (result && result.queryMode === "query cleared"){ result.queryMode = "NFT_SEARCH"; }

           if (  result && result.queryMode === "NFT_SEARCH" ){
             
                 result.raw = raw;
                 propagateQueryResult(result);   
              
                 // #2415,2416,2515,2423,2305,2110 
                 DOM.queryAssistant.classList.add("queryAssistantHidden");
                 DOM.queryInput.classList.remove("queryInputHidden");     
                 // DOM.queryBox.updateAssistant(result.queryResult);
           }
             
             if ( result && result.queryMode === 'DSL'){ 

                  let containsInvalidBlocks = false;
                    if ( result.queryResult.blocks.some(  block => !block.valid) ||
                         result.queryResult.blocks.length === 0     ) { 

                         containsInvalidBlocks = true; // will not save.
                    }

               DOM.queryAssistant.classList.remove("queryAssistantHidden");
               DOM.queryInput.classList.add("queryInputHidden");     
                  

                 // editingIncomplete
                const editingIncomplete =
                    result.queryResult.blocks.some(  block => block?.editingValue?.editingIncomplete
                );


                /*// this is possibly obsolete.. maybe an old safe guards..
                if (editingIncomplete) {

                    console.log( "editingIncomplete   "  , editingIncomplete  );
                    return result;// we do not need result here, but this is in case the call was made by something
                                  // that needs result so it does not return null
                }else{ 
                     console.log( "update editingIncomplete   "  , editingIncomplete  );
                }*/



                 raw = result.queryResult.normalizedQuery;
                
                 DOM.queryBox.input.setValue( result.queryResult.normalizedQuery );
                 DOM.queryBox.input.setCaret( result.queryResult.updatedCaret   );
  
                 //===========================================================
                   result.raw = raw;
                   result.containsInvalidBlocks = containsInvalidBlocks;
                   propagateQueryResult(result); 
                 //===================================================================  
             
                 result.queryResult.raw = raw;
                 DOM.queryBox.updateAssistant(result.queryResult);
 
                    const actionTrigger = result.queryResult.actionTrigger ;
                     
                    if ( actionTrigger){ 
             
                                const blocks =       result.queryResult.blocks;
                                const updatedCaret = result.queryResult.updatedCaret;
                                const block = DOM.queryBox.getBlockFromCaret( blocks, actionTrigger.anchorPosition );
 
                                switch ( actionTrigger.type ) {
                                 
                                case "CREATE_PRODUCER":
                                    
                                    DOM.queryBox.showProducerOption(block);
            
                                break; 
                                case "SELECT_TRAIT":   
                                    DOM.queryBox.showCorrections(block);
            
                                break;
                                 

                                case "CLOSE_DROPDOWN":

                                    dropdown.close();

                                    break;
                                }
                     }

               //  });
                
 
     
             }



            
            if ( result && result.queryMode === 'TRAIT_SEARCH'){ 
                // here NO update activeFilterMap(). because there is no selection result, it is only adrop down filtering.
                   applyTraitSearchBlock(raw);

                   propagateQueryResult(result)

                     DOM.queryAssistant.classList.add("queryAssistantHidden");
                    DOM.queryInput.classList.remove("queryInputHidden");  
               // console.log( "trait search result ", result );
              }
  
 
         
    // make sure we always reach here... some ui documentation needs it
     return result;
 }
 


export function setDOM(config = {}) {

    Object.assign(DOM, config);

}


 export async function onTraitAdd(traitKey, value, ids) {
       console.log( " result  ===    "   ,  traitKey  );     
    // activeTraitUI_result add the pills and serialize. make sure you run this before api_addtrait engine loi
        const activeTraitUI_result = call_addTrait_inUI( traitKey, value , ids );
       
            const objArg =   {  filterModeABS:         get_UIstate().filterModeABS,
                                serializeActivePills:  get_UIstate().serializeActivePills,

                                collectionId : project.id 
                            };
              
                const result = await  api_addTraitSelection  (  traitKey, value , ids , objArg )  ;       
                        
                propagateQueryResult(result);                   
           DOM.viewManager.show("filterModeBTN");
 
 
}


export function filterModeToggleAction( /*values*/){
       //move outside
     //  get_UIstate().filterModeABS = values;
  
        const apiCall =  async () => { 
         const result = await api_set_filterModeABS(
                             { filterModeABS:        get_UIstate().filterModeABS,
                               serializeActivePills:  get_UIstate().serializeActivePills,
                               collectionId:  project.id
                             });
        
         propagateQueryResult(result);        
 
    }
    apiCall();
    //===========================================================================
 
 }
 


    
// make sure all variables are up to date after api response/result
 export function propagateQueryResult(result){ 
          //============================== Client UI display ==============================  
                  let queryModeTEXT = result.queryMode;
               
                                        
                if (result.queryMode.includes("TRAIT_SEARCH") ){ 
                    queryModeTEXT = "TRAIT SEARCH";
                    DOM.filterCard?.setValue(queryModeTEXT);
                    // return;

                }
               

                //=================
                // trait panel filter
               // if (result.queryMode.includes("TRAIT") ){ 
                 //  queryModeTEXT = "TRAITS";
              //  }
                DOM.filterCard?.setValue(queryModeTEXT);
               

              //======================================================================             
            
               //==============================  Client Data/ session memory  ==============================   
           
          
              // if ( result.queryMode !== "TRAIT" ){       
                    DOM.foundCard?.setValue(result?.activeFilterMap_IDS?.length);
              // }
                    get_UIstate().activeFilterMap_IDS = result.activeFilterMap_IDS;
                    get_UIstate().activeFilterMap_suffleIDS = result.activeFilterMap_suffleIDS;
                    get_UIstate().IDS_Match_Count     = result?.activeFilterMap_IDS?.length;
                    get_UIstate().queryMode = queryModeTEXT;// queryMode;
                    get_UIstate().raw = result.raw;
                    get_UIstate().dna = result.dna;
                    get_UIstate().queryData = result.queryData;
                    get_UIstate().containsInvalidBlocks = result.containsInvalidBlocks;
                   // update grid IDS result for dislpay
                    DOM.gridView?.setNFTIds(get_UIstate().activeFilterMap_suffleIDS);
          //   }

             //===========================================================================

           // different  action on query update based on collection or page.....

             if (nodeGraphCanvas){
                nodeGraphCanvas.innerHTML = "";
             }
             /*   previewImg.innerHTML = "";*/
 
      
          
          if(  window.eventBus ){ 
                 console.log( " event before sending  result " ,  result );
                 window.eventBus.emit(
                 window.eventBus.eventNames.EVENT_active_filter_update,
                   result
                 ); 

            }else{ 

                 console.log( " NO GRID EVENT "   );
            }

 
               switch (DOM.activeCollection) {
                  case "apiPipeline":
                       refreshPipeline(result)
                    break;

                    case "nothing":
                       
                    break;
               
                   default:

                     timeout_generateAllTraitSheet( null ,0 );
                    break;
               }
               
   

  }


  let saveSheetTimer = null;
export function timeout_saveSheet(batchNumber,incr, options ={} ){ 
                    clearTimeout(saveSheetTimer);
                    saveSheetTimer = setTimeout(() => {
                      
                        saveSheet( batchNumber,incr, options );
                        
 
                    //   console.log( "sheetTimer   =",  sheetTimer);
                     
                    }, 1050);
  }
  let sheetTimer = null;
 export function timeout_generateAllTraitSheet(batchNumber,incr, options ={} ){ 
                    clearTimeout(sheetTimer);
                    sheetTimer = setTimeout(() => {
                        DOM.viewManager?.show("SEARCH RESULT");
                         generateAllTraitSheet( batchNumber,incr, options );
                        DOM.sheetCard.setValue(get_UIstate().totalSheetCount); 
 
                         console.log( "sheetTimer   =",  sheetTimer);
                     
                    }, 1050);
  }
async function runQueryInputHandler( obj   ) { //raw
     const result = await api_runQueryInputHandler(obj); //raw
       
       

    return result;
}

 
export function refreshPipeline (result){ 
     // clear previous dom elements
   document.querySelectorAll(".pipelineWidget, .tokenConnector").forEach(el => el.remove());
    
    
               DOM.queryBox.updateAssistant(result.queryResult);
                
                  let xOffset = 0;
                
                  const nodeColumns = [];
                  const blocks = result.queryResult.blocks;
                   for (let index = 0; index < blocks.length; index++) {
                     const block = blocks[index];
                     const visibleTokens =
                      block.tokens.filter(t => t.type !== "RAW" && t.type !== "END_OF_QUERY" );
                    
                    const count = visibleTokens.length;
                  //  const nodes = []; 
                       
                          const column = [];
                          visibleTokens.forEach((token, index) => {
        
                                     
                                         const maxDepth =
                                            maxDepthByTokenType[token.type] ?? 1;

                                        const nodes = [];

                                        for (let depth = 0; depth < maxDepth; depth++) {

                                            const node =
                                                buildNodeAndDOM(
                                                    token,
                                                    block,
                                                    result,
                                                    depth
                                                );

                                            if (!node) break;

                                            nodes.push(node);
                                        }

                                        nodeColumns.push(nodes);
                                  
                          });
                  }

                 let layoutMode = 
                     "horizontal";
                   //"vertical";
                   nodeGraphCanvas.style.minHeight = "0px"; 
                    
                  const assistant_scroll_width = DOM.queryBox.assistant.container.scrollWidth; 
                      
                       let layoutOptions=
                            {
                                container: nodeGraph,
                                mode: layoutMode,
                                containerMaxHeight:801,
                                assistant_scroll_width ,
 
                                baseX: nodeColumns[0][0].x,
                                 rawQuery: result.raw,

                                updatedCaret: result.queryResult.updatedCaret
                            }

                             
                   


                      // layoutOptions.assistant_scroll_width = requiredWidth;
                    //   nodeGraphCanvas.style.width  =    `${ requiredWidth   }px`; 
                     
           
                      

             for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
                     const column = nodeColumns[tokenIndex];
                     for (let depth = 0; depth < column.length; depth++) {
                  
                    const node = nodeColumns[tokenIndex][depth];
                    

                    // size is set in .css (getBoundingClientRect() is for computed value)
                        const pipelineNode = node.instance.el.querySelector(".pipelineNode");
                       
                        const nodeRect = pipelineNode.getBoundingClientRect();
                        node.width  = nodeRect.width;
                        node.height = nodeRect.height;
                        
                         // node.width  = pipelineNode.style.minWidth;
                      //  node.height = pipelineNode.style.minHeight;
                      

                    }
                }
 //===================================================
                     const { requiredWidth,columnWidths} =
                      
                     getRequiredHorizontalWidth( nodeColumns,layoutOptions ); 
                      
                      layoutOptions.assistant_scroll_width =  requiredWidth;
                      layoutOptions.requiredWidth = requiredWidth;
                      layoutOptions.columnWidths = columnWidths;
 
                       nodeGraphCanvas.style.width = `${requiredWidth}px`; 
 
                     queryAssistantContent =   getElement("queryAssistantContent"); 
                    
                    console.log( " ==============  width adjustment:",  {
                           requiredWidth,
                           assistant_scroll_width
                     })
                 
             for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
                     const column = nodeColumns[tokenIndex];
                     for (let depth = 0; depth < column.length; depth++) {
 
                    const node = nodeColumns[tokenIndex][depth];
    
                            layoutNodes(
                            nodeColumns,
                            tokenIndex,
                            depth,
                            layoutOptions);
                         
                    }
                }







                  //layoutOptions
                DOM.queryBox.layoutOptions = layoutOptions;

                nodeGraphCanvas.style.height = `${ layoutOptions.containerMaxHeight}px`;
               
              
     //============================================  connector =================================
 
                     connectNodes(nodeColumns,layoutOptions);
    


  }

  /*
  message chat GPT
  yes for :
const node =     nodeColumns[tokenIndex][depth];  
tokenIndex is colomnIndec, and detpth is flowIndex.. 
 so at the moment for testing only the nodeLayout need a moreGeneric fucntion you call it name+_gen
  
  
  */
function connectNodes(nodeColumns, layoutOptions){

     clearConnectors(nodeGraphScroll);
    
     
    if (layoutOptions.mode === "vertical"){ 
         connectNodes_vertical(nodeColumns, layoutOptions)
      }else{ 
          connectNodes_horizontal(nodeColumns, layoutOptions)
    }

}
  function connectNodes_vertical(nodeColumns, layoutOptions){ 
         for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
            const column = nodeColumns[tokenIndex];
              for (let depth = 1; depth < column.length; depth++) {

    const previousNode = column[depth - 1];
    const node = column[depth];

    if (!previousNode || !node) continue;
 
    const currentWidth = node.instance.getRect().width;
        
    //--------------------------------------------------
    // Connector
    //--------------------------------------------------
           let iniPosX =0;
            
              if (depth >= 1){ 
                 // previousNode_width = previousNode.width;
                  iniPosX = previousNode.x + previousNode.width;
             }else{
                   iniPosX = 0;
                 // previousNode_width = 0;
             }
         
             
              
                const from = pt(
                    // column[0].x ,//
                   // iniPosX,
                     previousNode.x + previousNode.width,
                    previousNode.y +  previousNode.height / 2
                );
            

                const to = pt(
                    node.x,
                    node.y  + node.height / 2
                );


               // if (depth === 1){ 
                  console.log("HORIZONTAL CONNECTOR", {
                    depth,
                    nodeTitle:  node.renderSpec.title.textContent,
                    from,
                    to,
                    dx: to.x - from.x,
                    dy: to.y - from.y
                   });
                //}
                 

               
                drawConnector(
                    nodeGraphScroll,
                    [from, to]
                );   

        

 

}
         }

  }


  function connectNodes_horizontal(nodeColumns){ 
        let yoffSet =0;
        let yoffSetIncr = 2;

        
        const anchorToNodeYspace =  nodeColumns[0][0].y -  nodeColumns[0][0].anchorPos.y- 4  ;
         
         for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
            const column = nodeColumns[tokenIndex];
             for (let depth = 0; depth < column.length; depth++) {

                const node = column[depth];

                if (!node) continue;

                
                const offx = node.instance.getRect().width / 2;
  
                 const incr =  ( anchorToNodeYspace / nodeColumns.length )
                 yoffSet =   incr * tokenIndex ;//+= yoffSetIncr;  
                if (depth === 0){ 

      
             

                     drawConnector(
                    nodeGraphScroll, 
                    [
                        pt(
                            node.anchorPos.x,
                            node.anchorPos.y  
                        ),

                        pt(
                            node.anchorPos.x,
                            node.anchorPos.y - yoffSet + anchorToNodeYspace
                        ),

                        pt(
                            node.x + offx,
                            node.anchorPos.y - yoffSet + anchorToNodeYspace
                        ),

                        pt(
                            node.x + offx,
                            node.y
                        )
                    ]
                   );
                }else{ 
                  const previousNode  = column[depth-1];      
                 const from = pt(
                            previousNode.x + previousNode.instance.getRect().width / 2,// offx,
                            previousNode.y + previousNode.height
                        );

                 const to = pt( node.x + offx, node.y );
                  
                    drawConnector(
                        nodeGraphScroll,
                        [from, to]
                    ); 
                }   
               
            }
         }

  }

  function buildNodeAndDOM(token, block, result, depth ){ 
                       const div = document.createElement("div");
                            div.classList.add("correctionAssistant");
                            div.classList.add("pipelineWidget"); 
                           // div.style.overflowY = "hidden"; 

                            nodeGraphScroll.appendChild(div);   
                         //  nodeGraph.appendChild(div);   
                          //  DOM.queryBox.container.appendChild(div);  

                            const nodeInstance = new QueryDropdown(div);
                                  nodeInstance.queryBox = DOM.queryBox;

                           
                            // create fresh node
                            let node = DOM.queryBox.buildPipelineNodes(token, block, nodeInstance,
                                
                                  null ,

                                   //nodeGraphScroll
                                  nodeGraph,
                                  nodeGraphScroll
                             );
                             // if (!node)return
                  

                                 //==================================================== 
                            const appendNodeInfo = appendTokenInfo({node, token, block, depth, queryBox:DOM.queryBox });
                               
                                   node ={ 
                                    ...node,
                                    ...appendNodeInfo
                                   };
 
                               const stateKey =`${block.blockId}:${token.id}:${depth}`;
                               let state = pipelineState.get(stateKey);
                                if (!state) {
                                         state = { detailsOpen: false};
                                         pipelineState.set(stateKey, state);
                                }
                                //========================================
                                node.state = state; 
                              
                               //=====================================================
                                nodeInstance.setItems(null,{
                                   type:"renderList_v2",
                                
                                   // renderList,        //   valueEvaluation : block.valueEvaluation,
                                    //idsLength:block.idsLength,
                                    //infoList:block.infoList,

                                    node:node
                                    });     

                              //=======  assign function and data ================
                              nodeInstance.nodeRefreshPipeline = () => {

                                    console.log(" clicked  node=:", node );
                
                                    node.state.detailsOpen =!node.state.detailsOpen;
                                  // pipelineState.set(stateKey, state);

                                 
                                 console.log(   " register state  node",   node );
                                 refreshPipeline (result);
                              };
                              


            return node;   
  }
 


export async function get_uploaded_collection(){ 

    // api_collection_query
}

  export async function uploadBtn_rarity_function(){
     const jsonResult =  await  uploadJSON();
 
     api_collection_register(jsonResult, projectId);
 
}
  export async function api_collection_registerExistingData(jsonResult){
    // const jsonResult =  await  uploadJSON();
    console.log( " ready to upload existing data " , { 
        projectId,
        jsonResult
    } );
     return  api_collection_register(jsonResult, projectId);
     
 
}
//window.api_collection_registerExistingData  = api_collection_registerExistingData;
 


  /*
  click
  ↓
state.detailsOpen = true
  ↓
refreshPipeline()
  ↓
nodes rebuilt
  ↓
same state retrieved
  ↓
node.rendered OPEN
  ↓
getRect()
  ↓
new node.height
  ↓
layout
  ↓
nodes underneath move down
  
  */
 /*
 node graph purpose of guide page in general:
 -Data representation — the broad technical term.
-View model / presentation model — the data structure prepared specifically for a UI.
-Projection — taking the same underlying data and exposing only the aspects relevant to a particular view.
-Information visualization — presenting relationships and state visually rather than as raw data.
-Progressive disclosure — showing the essential information first, with deeper information available on demand.
-Explainability / interpretability layer — explaining why the system produced a result, not merely showing the result.
-Multiple views of the same model — probably the simplest description of what you're actually doing.
                    SAME ENGINE
                        │
             ┌──────────┼──────────┐ 
             ▼          ▼          ▼
          Lexer       Parser     Search
           view        view       view
             │          │          │
             ▼          ▼          ▼
         "What is     "What did   "What
          this?"       it mean?"   can I
                                  choose?"
 */

/*=====================================================================
                ENGINE
                   │
                   ▼
                token
                   │
                   ▼
            buildPipelineNode()
                   │
                   ▼
                 NODE(UI)
        ┌──────────┼───────────┐
        │          │           │
       data       state       action
        │          │           │
        └──────────┼───────────┘
                   ▼
             QueryDropdown
                   │
                   ▼
                  DOM

=================================================================*/
/*======================================================================= */

/*

[✓] Query engine
[✓] Mirror / live language representation
[✓] Pipeline visualization
[✓] Survivor/exclusion explanation
[✓] Responsive layouts
[✓] Horizontal / vertical modes
[✓] Guides
[ ] Global navigation tree
[ ] Canonical page identities/routes
[ ] Complete first-time-user path
[ ] Error/empty/no-result states
[ ] Deep linking
[ ] Final visual consistency pass
[ ] Basic performance sanity check

*/