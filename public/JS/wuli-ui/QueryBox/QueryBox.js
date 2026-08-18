 import QueryInput from "./QueryInput.js";
import QueryDropdown from "./QueryDropdown.js";
import QueryAssistant from "./QueryAssistant.js";
import { drawConnector,pt } from "../pipelineFunction.js";
import { getRenderList_traitSuggestion, getRenderList_valueEvaluation } from "../dataRepresentation/tokenDataToNode.js";

 

 
 

export default class QueryBox {

    constructor(container, store, refreshQueryResult) {

        this.queryState = {
            rawQuery:"",
            queryResult:null
        }; 
  
        this.container = container;
        this.nodeGraph;
        this.collection;
        this.layoutOptions;
        this.store = store;
        this.refreshQueryResult = refreshQueryResult;
        this.nodeGraphScroll   = document.getElementById("nodeGraphScroll");

         
        this.queryCaret = container.querySelector(".queryCaret");

         this.caretBar       =  this.queryCaret.querySelector(".caretBar");
         this.queryCaretText =  this.queryCaret.querySelector(".queryCaretText");
   



        this.input = new QueryInput(
            {  inputElement: container.querySelector(".queryInput") , 
               readQueryState: ()=> this.queryState
            }
        );

        this.dropdown = new QueryDropdown(
            container.querySelector(".queryDropdown")
        );

        this.correctionDropdown =new QueryDropdown(

             document.getElementById("correctionAssistant")
           
        );
 
        this.assistant = new QueryAssistant(
              container.querySelector(".queryAssistant")//    queryDropdown
        );
 
       this.assistant.onErrorClicked = ({block, anchor }) => {
 
                  //  this.showCorrections(block, anchor);
         
       };

        document.addEventListener("pointerdown", (e)=>{

        if(this.container.contains(e.target))
            return;

           this.assistant.hide();
           this.dropdown.hide();
           this.correctionDropdown.hide();
         });


        this.#bind();

    }

 
   getRenderList_producer(){ 
 
      let renderList =[];
      const producersList = [ "+v","++v","-v" ];
         
       producersList.forEach((item ) => {
                 renderList.push({ label:item, select:item  });
       });
        return renderList;

   }

  getRenderList_tokens( token ){
       let renderList = [];
 
        
       const displayKey =["type","normalized","start","end"];

        Object.entries(token).forEach(([key, val]) => {
        if (  displayKey.indexOf(key) === -1  ){return;} 
        
            let edited_val = val;
             if ( String(val).startsWith("COMPLETE_")){ 
                edited_val = val.replace("COMPLETE_",""); // COMPLETE_producers
             }  
             renderList.push({  label: ( key +":"+edited_val),
                                              select  :{ 
                                               // traitValueSelected:  element, 
                                                // start: item.start,
                                               //  end: item.end
                                               }   
                 });
        });
        
        
        return renderList;
  }

  /*
  getRenderList_valueEvaluation( block ){
       let renderList = [];
 
        block.valueEvaluation.forEach((item, index) => {

                   for (let idx = 0; idx < item.matches.length; idx++) {
                        const element = item.matches[idx];
                            renderList.push({ label:  element,
                                              select  :{ 
                                                 traitValueSelected:  element, 
                                                 start: item.start,
                                                 end: item.end
                                               }   
                            });
                   }
  
       });

        return renderList;
  }
        
  */

  tokenTypeToClass(tokenType, blockId,tokenId){ 

     switch (tokenType) {
        case "COMPLETE_PRODUCER":return "producerToken";
 
        case "TRAIT":
            const traitValid = this.container.querySelector(
                `.traitValid[data-block-id="${blockId}"][data-token-id="${tokenId}"]`
            );
            return traitValid ? "traitValid":"traitError";
 
        case "VALUE":
              const traitValueValid = this.container.querySelector(`.traitValue[data-block-id="${blockId}"][data-token-id="${tokenId}"]`);
            //);
            return traitValueValid ?"traitValue":"traitValueError";
                    
      
        default:
            break;
     }
  }

buildPipelineNodes(token, block, dropdownArg, getRenderList  , nodeContainer  , nodeGraphScroll   ){ 
 
       const cssClass =  this.tokenTypeToClass( token.type, block.blockId, token.id );
  
          const anchor   = this.assistant.getAnchorBytokenID(block.blockId, token.id , cssClass);       //   getAnchor(block.blockId, cssClass);
            if(!anchor ){  console.log( " anchor is null == node will return null" , 
                      {  blockId: block.blockId, id: token.id ,  cssClass});
                       return null;
            }
    

               let anchorData ={};
               let anchor_left  ;
               let anchor_top ;
               let queryRect;

               
           if(anchor){ 
                    queryRect =  anchor.getBoundingClientRect();
                      anchor_left = queryRect.left  ;
                     anchor_top =  queryRect.bottom;
             } 
 
           //  const graphRect = nodeContainer.getBoundingClientRect();
            //====================================================
            // mahe sure you show first or rect is 0,0
             dropdownArg.show();
            const dropRect =  dropdownArg.getRect();
           //===============================================
 

       // gets the visible rect (not the longer graphScroll variable we get with scrollLeft)
        
            const graphRect = nodeGraphScroll.getBoundingClientRect();

        const anchorX =
            queryRect.left +
            queryRect.width / 2 -
            graphRect.left +
            nodeGraphScroll.scrollLeft;
 
            return {
                 
                token,
                el: dropdownArg.el,
                instance: dropdownArg,
                anchor,
                anchorPos:{ 
                  // x:  queryRect.left    + queryRect.width/2 -  graphRect.left, 
                    x: anchorX,
                    y:  queryRect.bottom  -  graphRect.top

                },

                x: 0, // will be written in layoutNode()
                y:0,  // will be written in layoutNode()
                
                width :  dropRect.width, 
                height : dropRect.height,
                level: 0,
                desiredX: 0 
   

            }

            
    }
                                 
     

    showProducterOption(block){ 
     

        let renderList = this.getRenderList_producer();
       
         

      // producter dropdown
      this.correctionDropdown.onSelect = selectedItem => {    
                 
                 console.log( "this.correctionDropdown.onSelect: (producer) :" , selectedItem )
                 this.correctionDropdown.hide();

                  
                  this.input.focus();

                 const raw   = this.input.getValue();
                 const caret = this.input.getCaret();


                 this.refreshQueryResult({
                              raw: raw,
                              caret,
                              action: null,
                              command: { type: "INSERT_OPERATOR",operator: selectedItem }
                 }); 
                    
               
                  
       };
 
       // console.log( "showProducterOption  block.blockId: " , block.blockId  );
                const anchor  = this.assistant.getProducerAnchor(block.blockId);
                    if(!anchor){ 
                      console.log( "showProducterOption   anchor is null ");
                      return null;
                   }
                
                this.correctionDropdown.setItems(null,{
                    anchor,
                    type:"renderProducersList",
                    renderList,//: producersList,
                    infoList:null,//block.infoList,
                });
   
              
 
                this.correctionDropdown.show();

                 //currentAnchor
            return { anchor }
     }
//========================================================================================================
//                              show traits Value
//======================================================================================================== 

    showTraitValues(block ){ 


                    console.log( "  ==============    showTraitValues  block.blockId: "    );

          const anchor  = this.assistant.getValueAnchor(block.blockId);
            if(!anchor){  console.log( "blockValues   anchor is null ");
                     return  null;
            }

    //================ adapt data to list ================================
           let renderList =  getRenderList_valueEvaluation(block);
           
    //==========================================================
         
          this.correctionDropdown.setItems(null,{
                anchor,
                type:"renderAvailableValue",
             
                renderList,        //   valueEvaluation : block.valueEvaluation,
                idsLength:block.idsLength,
                infoList:block.infoList,
             });
 

            
 
           this.correctionDropdown.show();

            //currentAnchor
            return { anchor }
 
            
    }
//========================================================================================================
//                              show traits Corrections
//========================================================================================================

  // todo: showTraitSuggestion
    showCorrections(block){

     //  throw new Error("trait on click")

       const anchor = this.assistant.getTraitAnchor(block.blockId);  
        if(!anchor){
              console.log( "getTraitAnchor  is null "); return null;
            }
               
        let renderList = getRenderList_traitSuggestion(block);  
            
 
         this.correctionDropdown.setItems(null,{
                anchor,
                type:"renderAvailableTrait",
                renderList,//this is argument for onSelect
                infoList:block.infoList,
             });
  
       this.correctionDropdown.onSelect = correction => {   
                
                  this.onSelect_traitType(correction, this.input);
                  this.correctionDropdown.hide();
       };
 
        this.correctionDropdown.show();

         //currentAnchor
            return { anchor }
 
    }
    
   //+v[he] +v[HE] +v[sh]
    updateAssistant(queryResult){

         this.queryState.queryResult = queryResult;

         this.assistant.show(queryResult)
      //   console.log( " updateAssistant  queryResult  ," , queryResult   ); // errors[0]?.suggestions
        
    }

   onSelect_traitValue(correction, input){ 
        console.log( "this.correctionDropdown.onSelect: (Trait VALUE) :" , correction );
                
                 this.correctionDropdown.hide();

                 const raw =    input.getValue();
                 const caret =  input.getCaret();
                 this.refreshQueryResult( {raw: raw, caret, 
                     action:null,
                     command: {   type:"REPLACE_TRAITVALUE",
                                  traitValueSelected:  correction.traitValueSelected,//      "TRAIT_TYPE",
                                  start: correction.start,
                                  end:   correction.end
                                   
                                  }
 
                    }); 
                  

   }

    onSelect_traitType(correction, input){
        
              console.log( "this.correctionDropdown.onSelect: (correction) :" , correction );


               //  this.applyCorrection(correction);
                

                 const raw =    input.getValue();
                 const caret =  input.getCaret();
                 this.refreshQueryResult( {raw: raw, caret, 
                     action:null,
                     command: {   type:"REPLACE_TRAIT",
                                  traitSelected:  correction.traitSelected,//      "TRAIT_TYPE",
                                  traitStart:     correction.traitStart,
                                  traitEnd:       correction.traitEnd,
                                   caret
                                  }
 
                    }); 



    }

    

    #bind() {

        this.input.onFocus = () => {
                  
            const getValue =  this.input.getValue() ;
            console.log( " getValue   === ", getValue);  
            if (  this.input.getValue() === "" ){
                  this.showRecent();

                   this.dropdown.show();
                 // return;
            } 

            if ( this.queryState.queryResult 
              //  && !this.queryState.queryResult.success
            ){ 
 
                
                 this.updateAssistant(this.queryState.queryResult);
            }
 
        };

        this.input.onBlur = () => {

            this.close();

        };


         this.input.refreshQueryResult = obj => { 
               this.refreshQueryResult( obj);
         }
    

        this.input.onChange = text => {
 
                 //this.filter(text);
                this.setAndRefreshQuery(text);

        };

        this.input.onArrowDown = () => {

            this.dropdown.selectNext();

        };

        this.input.onArrowUp = () => {

            this.dropdown.selectPrevious();

        };

        this.input.onEnter = () => {

            const item = this.dropdown.selectedItem;

            if (!item) return;

            this.input.setValue(item.raw);
           const caret = this.input.getCaret();
            this.refreshQueryResult( {raw: item.raw, caret}); 
            
             this.dropdown.hide();
           

        };

        this.input.onEscape = () => {
              this.dropdown.hide(); 
            //this.close();

        };


 
         this.input.setupInputScrollSync = () => {

                    const input = this.input.el;
                   // const assistantEl = this.assistant.root;

                  //  if (!input || !assistant) return;

                   // input.addEventListener("scroll", () => {

                        this.assistant.root.scrollLeft = input.scrollLeft;
                        this.nodeGraphScroll.scrollLeft = input.scrollLeft;
                        

                   // });
         }
        

        this.input.onCaretChanged = (caret)=>{

          const queryResult = this.queryState.queryResult;
 
          /*
           this.queryCaretText.textContent = this.input.value.slice(0, caret);
       */
           



            if(!queryResult){return; }
                
            if ( queryResult.blocks && queryResult.blocks.length === 0 ){
                 
                this.correctionDropdown?.hide();
             return;}

            
               if (this.collection &&  this.collection === "apiPipeline") {
                     return;
            
            }
 
           
             const  blocks = queryResult.blocks;
              const block = this.getBlockFromCaret(blocks,caret);
               if(!block){return; }

               const blockTrait = queryResult.blocks.find(bl =>
                   caret >= bl.traitStart &&
                   caret <= bl.traitEnd
              );
             // let showBlockPart =""
             const blockValues = queryResult.blocks.find(bl =>
                   caret >= bl.valueStart &&
                   caret <= bl.valueEnd
              );
               
            /*
             console.log(
                
               "\n input" , this.queryState.queryResult?.blocks[0].input,
                "  traitStart "  ,
                               this.queryState.queryResult?.blocks[0].traitStart  ,
              "\n traitEnd" ,   this.queryState.queryResult?.blocks[0].traitEnd ,
             "\n  caret" , caret ,
              "\n blockTrait" , blockTrait  );
              */
              /*
              console.log(
                
               
                "  valueStart "  ,this.queryState.queryResult?.blocks[0].valueStart  ,
                 "\n valueEnd" ,   this.queryState.queryResult?.blocks[0].valueEnd ,
             "\n  caret" , caret ,
              "\n blockValues" , blockValues  ,  
                "\n traitValueAvailable" , this.queryState.queryResult?.blocks[0].traitValueAvailable  );
             */
              
               if(   block && block.type === "PARTIAL" || 
                     block && block.type === "UNKNOWN" 
                ){ 
                // we do not show on caret
                 return;
               }

               // hide/reset ... 
                this.correctionDropdown?.hide();
                 let show_partial ;
                 const operatorToken = block.operatorToken;  
                  if (operatorToken ){ 
                         show_partial =
                          operatorToken.type === "PARTIAL_PRODUCER"?// || operatorToken.type === "COMPLETE_PRODUCER" ?
                          true:false;
                  }
                   

                //const show_blockTrait   =  block && !block.valid  && blockTrait  ? true:false;
                const show_blockTrait   =  block && blockTrait  ? true:false;

                const show_blockValues  =  block && blockValues ? true:false;

                 console.log("  DROPDOWN TO SHOW  ===================\n"  ,
                                "show_blockTrait", show_blockTrait  ,"\n"  ,
                                "show_blockValues", show_blockValues  ,"\n" ,
                                "show_partial", show_partial  ,"\n" ,
                                " operatorToken.type",  operatorToken.type  ,"\n" ,
                               

                                "block", block  
                            
                 );
 
              
                 let currentAnchor = null ;
               if ( show_partial   ){ currentAnchor = this.showProducterOption(block);
                //  return;
              } 

              if ( show_blockTrait   ){ 
                currentAnchor =  this.showCorrections(block);

                 

               //  return;
              }

              if( // !show_partial && !show_blockTrait &&
                
                  show_blockValues  ){   currentAnchor =    this.showTraitValues(block  );
               
                  //  return;
               } 

     //  console.log( " ===================   currentAnchor :" ,  currentAnchor ) 
             
                  //  const rect = currentAnchor?.anchor .getBoundingClientRect();
  //console.log( " ===================   rect :" ,  rect ) 

                /*
                 if ( rect  ){     
                    const currentAnchorX = rect.left - this.nodeGraph.getBoundingClientRect().left;   


                    console.log( " currentAnchor  info   :" ,{ 
                        currentAnchorX,
                        initialAnchorX: this.layoutOptions.initialAnchorX,
                        containerRect_left: this.nodeGraph.getBoundingClientRect().left
                        
                    });

                     const deltaX = currentAnchorX - this.layoutOptions.initialAnchorX;
                     this.nodeGraph.style.transform =`translateX(${deltaX}px)`;
                      
   
                }
                     */
                    /*
                   const input = this.input.el;
                    const mirror = this.assistant.root; // whatever your mirror element is

                  //  mirror. style.transform =
                        //`translateX(${-input.scrollLeft}px)`;
                   mirror.scrollLeft = this.input.el.scrollLeft;
*/


         };

    }

    open() {

       //  this.dropdown.show();
        // this.container.classList.add("open");

    }

    close() {

        // this.dropdown.hide();
      //   this.container.classList.remove("open");

    }

    toggle() {
       /*
        if (this.dropdown.isOpen)
            this.close();
        else
            this.open();
          */
    }

    showRecent() {
          this.dropdown.onSelect = item => {

            this.input.setValue(item.raw);
            const caret = this.input.getCaret();
            this.refreshQueryResult( {raw:item.raw, caret } );
             this.dropdown.hide();

        };
  
        const items = this.store.getRecent();

        let renderList =[];
             items.forEach((item, index) => {
             renderList.push({ label:  item.raw,
                               select: item   
                            });
        });
 
        this.dropdown.setItems(null, {
            anchor:null,  
            type : "queryExample", 
            renderList, 
            infoList:null, 
        });

        if (items.length)
           // this.open();
           this.dropdown.show();
        else
            this.dropdown.hide();
          //  this.close();

    }

   // filter
    setAndRefreshQuery(text) {
        const caret = this.input.getCaret();
        const queryObj = { 
               raw:text,
               caret, 
               action:  this.input.consumeLastKey() 
              // command:
         }
      /*
         command: {

        type: "INSERT_OPERATOR",

        operator: "+v"

    }  

      */

         console.log("filter send raw to engine ========",  queryObj );  
         this.refreshQueryResult( queryObj );
 
     }

     getBlockFromCaret(blocks,caret){
        
       return  blocks.find(bl =>
                   caret >= bl.start &&
                   caret <= bl.end
             );

     }

}
