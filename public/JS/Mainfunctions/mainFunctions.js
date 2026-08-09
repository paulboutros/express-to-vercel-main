 


//import {  } from "../apiClient.js";
import {  api_addTraitSelection ,api_rebuildActiveFilterMap,
          api_set_filterModeABS, api_runQueryInputHandler , api_getQueryExample ,
         api_generateAllTraitSheet
        //   api_generateAllTraitSheet
     } from "../apiClient.js"; 

import { drawConnector,pt , layoutNodes } from "/wuli-ui/pipelineFunction.js";

import RunButton     from "/wuli-ui/runButton.js";
import QueryDropdown from "/wuli-ui/QueryBox/QueryDropdown.js";
     

   import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "/wuli-ui/filterPills.js";
  //import { get } from "lodash";
 


export const functionState={
    batchIndex:0
}


 const pipelineState = new Map();

const nodeGraph        = document.getElementById("nodeGraph"); 
const nodeGraphScroll   = document.getElementById("nodeGraphScroll"); 


const previewImg = document.getElementById("previewImg");
 

   
  // let activeCollection;// the collection data this page is dispaying
   let sheetTimer = null;
  // let sheetCard;
   //let viewManager;
   //let gridView ;
  // let filterCard ;
 //  let foundCard ;  
  // let queryBox;


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
                    result.queryResult.blocks.some(  block => block.editingValue?.editingIncomplete
                );

                if (editingIncomplete) {

                    console.log( "editingIncomplete   "  , editingIncomplete  );
                    return result;// we do not need result here, but this is in case the call was made by something
                                  // that needs result so it does not return null
                }else{ 
                     console.log( "update editingIncomplete   "  , editingIncomplete  );
                }


                 raw                    = result.queryResult.normalizedQuery;
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
                                    //return;
                                

                            
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
                     const visibleTokens = block.tokens.filter(t => t.type !== "RAW");
                    
                    const count = visibleTokens.length;
                    const nodes = []; 
                       
                          const column = [];
                          visibleTokens.forEach((token, index) => {
      
                          

                           
    
                      
                                        let tokenNode  = buildNodeAndDOM(token, block,  result, 0);
                                        let lexerNode  = buildNodeAndDOM(token, block, result , 1 );
                                        let parsertNode = buildNodeAndDOM(token, block, result , 2 );
                                        let resultNode = buildNodeAndDOM(token, block, result , 3 );
                                        let responsetNode = buildNodeAndDOM(token, block, result , 4 );

                                         nodeColumns.push(
                                             [tokenNode,lexerNode,parsertNode, resultNode ,responsetNode ] 
                                            ); 
                                         
                                      
                                 
                          });
                 
                        
 

                   
                 }

                   nodeGraphCanvas.style.minHeight = "0px"; 
                   //  nodeGraph.style.minHeight = "0px"; 
                    let layoutOptions=
                            {
                                container: nodeGraph,
                                mode: "horizontal",
                                containerMaxHeight:800
                            }
                 
                      

             for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {
                     const column = nodeColumns[tokenIndex];
                     for (let depth = 0; depth < column.length; depth++) {



                    const node = nodeColumns[tokenIndex][depth];
                     const currentHeight =  node.instance.getRect().height;
                    node.height = currentHeight;


                    console.log( 
                        "el:",   node.instance.el,
                        "tok id: " ,   node.token.id , "depth", depth,
                        " node.height  :" , node.height)
                    //====================
                     
                      //  DOM.queryBox.
                            layoutNodes(
                            nodeColumns,
                            tokenIndex,
                            depth,
                            layoutOptions
                            
                        );
                    }
                }
                nodeGraphCanvas.style.height = `${ layoutOptions.containerMaxHeight}px`;
                console.log("layoutOptions.requiredHeight " ,  layoutOptions.containerMaxHeight  );
                //nodeGraphCanvas.style.height = `${requiredHeight}px`;
             //  nodeGraph.style.minHeight =`${layoutOptions.containerMaxHeight}px`;
     //============================================  connector =================================

                  for (let tokenIndex = 0; tokenIndex < nodeColumns.length; tokenIndex++) {

    const column = nodeColumns[tokenIndex];

    for (let depth = 0; depth < column.length; depth++) {

        const node = column[depth];

        if (!node) continue;

        const offx =
            node.instance.getRect().width / 2;

        drawConnector(
            nodeGraphScroll,//  nodeGraph,// document.body,
            [
                pt(
                    node.anchorPos.x,
                    node.anchorPos.y
                ),

                pt(
                    node.anchorPos.x,
                    node.anchorPos.y + 15
                ),

                pt(
                    node.x + offx,
                    node.anchorPos.y + 15
                ),

                pt(
                    node.x + offx,
                    node.y
                )
            ]
        );
    }
             }


  }

  function buildNodeAndDOM(token, block, result, depth ){ 
                       const div = document.createElement("div");
                            div.classList.add("correctionAssistant");
                           div.classList.add("pipelineWidget");  

                           nodeGraphScroll.appendChild(div);   
                         //  nodeGraph.appendChild(div);   
                          //  DOM.queryBox.container.appendChild(div);  

                            const nodeInstance = new QueryDropdown(div);

                           
                            // create fresh node
                            const node =  DOM.queryBox.buildPipelineNodes(token, block, nodeInstance,
                                ()=>{ return DOM.queryBox.getRenderList_tokens(token);},

                                  nodeGraphScroll
                                 // nodeGraph
                             );
                              
                              
                            
                             
                                 //====================================================   
                              const spanValues = token.start +"-"+ token.end;
                              node.type = "Producer";
                              node.raw  = "+";
                              node.normalized = "+v";
                              node.details = [
                                        { key:"Raw", value:"+" },
                                        { key:"Canonical", value:"+v" },
                                        { key:"Span", value:spanValues }  //"0-2"
                               ];
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
                             

                              //====================================================





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