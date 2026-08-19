 

 import { applyTraitSearchBlock  } from "../wuli-ui/displayBlocksFromSearch.js";
//import {  } from "../apiClient.js";
import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample ,
          api_generateAllTraitSheet
        //   api_generateAllTraitSheet
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
  //import { get } from "lodash";
 


const maxDepthByTokenType = {

    COMPLETE_PRODUCER: 1,
    PARTIAL_PRODUCER: 1,
    TRAIT: 2,
    VALUE: 3 
     

};


export const functionState={
    batchIndex:0
}


 const pipelineState = new Map();

const nodeGraph        = document.getElementById("nodeGraph"); 
const nodeGraphScroll   = document.getElementById("nodeGraphScroll"); 
const nodeGraphCanvas  = document.getElementById("nodeGraphCanvas"); 

let queryAssistantContent  = document.getElementById("queryAssistantContent"); 

const previewImg = document.getElementById("previewImg");
 

   
  // let activeCollection;// the collection data this page is dispaying
   let sheetTimer = null;
  // let sheetCard;
   //let viewManager;
   //let gridView ;
  // let filterCard ;
 //  let foundCard ;  
  // let queryBox;
export function setPageDataset(){ 
 const path = window.location.pathname;

 document.body.dataset.page = "demo";
if (path.startsWith("/guide") ||
      path.startsWith("/introduction") || 
     path.startsWith("/reference")  || 
      path.startsWith("/purpose") 
    // path.startsWith("/apiPipeline")

){ 
     document.body.dataset.page = "guide";

}  
if ( path.startsWith("/apiPipeline")   ){ 
      document.body.dataset.page = "apiPipeline";
}
  

}

export async function generateAllTraitSheet(batchNumber, incr , IDS_Match_Count){ 
                

    
           const maxPerSheet = 6;
          const totalSheetCount = Math.ceil(      get_UIstate().activeFilterMap_IDS.length   / maxPerSheet);


                get_UIstate().totalSheetCount = totalSheetCount;
           
                 functionState.batchIndex =  functionState.batchIndex % totalSheetCount; //reseting it first
                functionState.batchIndex = (functionState.batchIndex + incr) % totalSheetCount;
                 if(functionState.batchIndex <0 )  { functionState.batchIndex = totalSheetCount-1 }

              //  console.log(  "generateAllTraitSheet() batchIndex: " ,  functionState.batchIndex);
                // currentIndex = (currentIndex + 1) % nftListToRender.length;


                 
        //==========================================================================
        //===========================================================


                  var vidFilter = get_VideoFilterObject(); // get_featState().get_VideoFilterObject();
                  vidFilter.batchNumber = functionState.batchIndex;
                  if (batchNumber ){ 
                      vidFilter.batchNumber = batchNumber;
                  }

              //   console.log(  "generateAllTraitSheet() vidFilter: " ,  vidFilter);
             

                 let result = await api_generateAllTraitSheet({
                     videoFilterObject : vidFilter 
                 
                 });
                 
                  
                  
                  previewImg.innerHTML = "";
                
              for (let index = 0; index <  result.currentPreviewURLList.length; index++) {
  
               
                   const img = document.createElement("img");
                //  const img = document.getElementById("previewImg");

                     const bufferData =   result.currentPreviewURLList[index].data;
                    //  console.log( "jpegBuffer data = " , bufferData  );

                    //  console.log("jpegBuffer bytes =", bufferData.length);
                     // console.log("jpegBuffer MB =", (bufferData.length / 1024 / 1024).toFixed(2));                
                       
                      // const jpegBuffer = Buffer.from(bufferData);
                     //  const blob = new Blob([jpegBuffer], { type: "image/jpeg" });
                       

                       const byteArray = new Uint8Array(bufferData);
                       const blob = new Blob([byteArray], { type: "image/jpeg" });




                     let objUrl = URL.createObjectURL(blob);
                      img.src = objUrl;
                   //  preview.appendChild(img); 

                     previewImg.appendChild(img); 
              }
 
            



}
 

export async function refreshQueryResult ( obj ) { //raw

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
                    result.queryResult.blocks.some(  block => block?.editingValue?.editingIncomplete
                );

                if (editingIncomplete) {

                    console.log( "editingIncomplete   "  , editingIncomplete  );
                    return result;// we do not need result here, but this is in case the call was made by something
                                  // that needs result so it does not return null
                }else{ 
                     console.log( "update editingIncomplete   "  , editingIncomplete  );
                }


                 raw                    = result.queryResult.normalizedQuery;
                /* raw+="                                ";*/
                 DOM.queryBox.input.setValue( result.queryResult.normalizedQuery );
                 DOM.queryBox.input.setCaret( result.queryResult.updatedCaret   );
  
                 //===========================================================
                   result.raw = raw;
                   result.containsInvalidBlocks = containsInvalidBlocks;
                   update_activeFilterMap(result); 
                 //===================================================================  
             
                 result.queryResult.raw = raw;
                 DOM.queryBox.updateAssistant(result.queryResult);

                  //==========================
                  //   result.queryResult.blocks.forEach(block => {

                    const actionTrigger = result.queryResult.actionTrigger ;
                     console.log( " actionTrigger  =" ,   actionTrigger );
                    if ( actionTrigger){ 
                             
                                console.log( "actionTrigger.anchorPosition  =" ,   actionTrigger.anchorPosition );
            
                                const blocks =       result.queryResult.blocks;
                                const updatedCaret = result.queryResult.updatedCaret;
                                const block = DOM.queryBox.getBlockFromCaret( blocks, actionTrigger.anchorPosition );

                                console.log( " blocks =" ,   blocks );
            
                                switch ( actionTrigger.type ) {
                                 
                                case "CREATE_PRODUCER":
                                    
                                    DOM.queryBox.showProducterOption(block);
            
                                break; 
                                case "SELECT_TRAIT":   
                                    DOM.queryBox.showCorrections(block);
            
                                break;
                                

                                case "OPEN_VALUE_DROPDOWN":

                                  //  dropdown.openValueList(
                                      //  result.actionTrigger.payload.trait
                                   // );

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
               // console.log( "trait search result ", result );
              }


            
         
    // make sure we always reach here... some ui documentation needs it
     return result;
 }
 


export function setDOM(config = {}) {

    Object.assign(DOM, config);

}


  const DOM = {
    layoutEngine: null,
    activeCollection: null,

    sheetCard: null,

    viewManager: null,

    gridView: null,

    filterCard: null,

    foundCard: null,

    queryBox: null

};


    
// make sure all variables are up to date after api response/result
  function update_activeFilterMap(result){ 
          //============================== Client UI display ==============================  
              
               
                if (result.queryMode.includes("TRAIT") ){ 
                   result.queryMode = "TRAITS";
                }
                DOM.filterCard?.setValue(result.queryMode);
                DOM.foundCard?.setValue(result?.activeFilterMap_IDS.length);

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
                DOM.gridView?.setNFTIds(get_UIstate().activeFilterMap_suffleIDS);
           

             //===========================================================================

           // different  action on query update based on collection or page.....

                nodeGraphCanvas.innerHTML = "";
                previewImg.innerHTML = "";



      console.log(   " DOM.activeCollection   "   , DOM.activeCollection   );

               switch (DOM.activeCollection) {
                  case "apiPipeline":
                       refreshPipeline(result)
                    break;
               
                   default:

                     timeout_generateAllTraitSheet( null ,0 );
                    break;
               }
               
   

  }


  function timeout_generateAllTraitSheet(batchNumber,incr ){ 
                    clearTimeout(sheetTimer);
                    sheetTimer = setTimeout(() => {
                        DOM.viewManager.show("SEARCH RESULT");
                         generateAllTraitSheet( batchNumber,incr );
                        DOM.sheetCard.setValue(get_UIstate().totalSheetCount); 


                         console.log( "sheetTimer   =",  sheetTimer);
                      //  generateAllTraitSheet(queryResult);
                    }, 1050);
  }
async function runQueryInputHandler( obj   ) { //raw
     const result = await api_runQueryInputHandler( obj  ); //raw
       
       

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
                     const {  
                           requiredWidth,
                           columnWidths
                     } =
                     getRequiredHorizontalWidth(
                        nodeColumns,
                        layoutOptions
                      ); 

                      layoutOptions.assistant_scroll_width =  requiredWidth;
                      layoutOptions.requiredWidth = requiredWidth;
                      layoutOptions.columnWidths = columnWidths;


                       nodeGraphCanvas.style.width = `${requiredWidth}px`; 

                      
                     queryAssistantContent =   document.getElementById("queryAssistantContent"); 
                     // console.log( " queryAssistantContent   =====  "   ,  queryAssistantContent );
                    //  queryAssistantContent.style.width =`${requiredWidth}px`;
    
                     // nodeGraphScroll.style.width  =    `${requiredWidth}px`;
                    console.log( " ==============  width adjustment:",  {
                           requiredWidth,
                           assistant_scroll_width
                     })
                    //nodeGraphCanvas.style.width  =    `${ assistant_scroll_width   }px`; 


 //====================================
                
             for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
                     const column = nodeColumns[tokenIndex];
                     for (let depth = 0; depth < column.length; depth++) {
 
                    const node = nodeColumns[tokenIndex][depth];
                    // const currentHeight =  node.instance.getRect().height;
                    
   
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
                console.log("layoutOptions.requiredHeight " ,  layoutOptions.containerMaxHeight  );
              
     //============================================  connector =================================
 
                     connectNodes(nodeColumns,layoutOptions);
    


  }
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