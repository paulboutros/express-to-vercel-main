
  export function appendTokenInfo({node, token, block, depth, queryBox}){ 

    let spanValues ="";

   // Default: nothing to add at this depth
    const info = {
        
        type: "Prod", // producer
        raw: "+",
        normalized: "+v",
         renderSpec: {
               title: {
                     textContent: "undefined",
                     cssClassList: ["pipelineNodeTitle"]
               },

               value: {
                     textContent: "undefined",
                     cssClassList: ["pipelineNodeValue"]
               }
         },
        details    : [
              { key:"Raw",       value: token.operator },
              { key:"Canonical", value: token.normalized },
              { key:"Span"     , value: token.start +"-"+ token.end   }  
           ] 
    };
    let tokenType = token.type;
    switch (depth) {
        case 0:
          // let tokenType = token.type;
            switch (tokenType) {
               case "COMPLETE_PRODUCER": case "PARTIAL_PRODUCER":
                  return {
                     
                    type       :  "Producer",
                    raw        :  token.operator,
                    normalized :  token.canonical, //operator use canonical not normalized
                    renderSpec: {
                        title: {
                              textContent: "Producer",
                              cssClassList: ["pipelineNodeTitle"]
                        },

                        value: {
                              textContent: token.canonical,
                              cssClassList: ["pipelineNodeValue"]
                        }
                    },
                    generalCss:["producer"],
                    details    : [
                                { key:"Raw",       value: token.operator },
                                { key:"Canonical", value: token.canonical },
                                { key:"Span"     , value:  token.start +"-"+ token.end}  
                    ] 
                 }

                 case "TRAIT":case "VALUE":
                  return {
                     
                    type       :  tokenType,
                    raw        :  token.raw,
                    normalized :  token.normalized, //operator use canonical not normalized
                    renderSpec: {
                         title: {
                              textContent: tokenType,
                              cssClassList: ["pipelineNodeTitle"]
                        },

                        value: {
                              textContent: token.normalized,
                              cssClassList: ["pipelineNodeValue"]
                        }

                     },

                    generalCss:[tokenType.toLowerCase()],

                    details    : [
                                { key:"Raw",       value: token.operator },
                                { key:"Canonical", value: token.canonical },
                                { key:"Span"     , value:  token.start +"-"+ token.end}  
                    ] 
                 }
                 
                default: return info;
                
           }
             
            
        break;
        case 1:
            
            switch (tokenType) {
                 case "TRAIT":
                  return {
                     
                   // type       : "Select" ,//"Trait",
                   // raw        :  token.raw,
                  //  normalized :  token.normalized, //operator use canonical not normalized
                     renderSpec: {
                        title: {
                              textContent: "Select",
                              cssClassList: ["pipelineNodeTitle"]
                        },
                        
                        value: {
                              textContent: token.normalized,
                              cssClassList: ["pipelineNodeValue"]
                        }
                    },
                    generalCss:[tokenType.toLowerCase()],
                    dataList : getRenderList_traitSuggestion(block),
                    onSelect: (value) => {
                         queryBox.onSelect_traitType(value, queryBox.input);
                           
                     }
                 }
            
                case "VALUE":


                   let operator = block.tokens[0].operator;
                   let typeText = operator === "+"? "Included":"Excluded";
                   let triangle = operator === "+"? "▲":"▼";

                   let value_textContent_depth1 ="";
                   let value_count_depth1="";
                   if (block.valueEvaluation){ 


                      const count = block.valueEvaluation.find(
                          el => el.input === token.normalized  ).matchesCount;

                            value_count_depth1 = triangle +" " + count;
                       // value_textContent_depth1 =
                       // token.normalized +"("+ count +")";
                   }

                  return {
                     
                    type       :  typeText,
                    raw        :  token.raw,
                    normalized :  token.normalized, //operator use canonical not normalized
                     renderSpec: {
                        title: {
                              textContent: typeText,
                              cssClassList: ["pipelineNodeTitle"]
                        },

                        value: {
                              textContent: token.normalized,
                              cssClassList: ["pipelineNodeValue"]
                        },
                        count:{
                              textContent: value_count_depth1,
                              cssClassList: ["pipelineNodeValue","pipelineNodeCountInclude"]
                        },
                    },
                    generalCss:[tokenType.toLowerCase()],
                    dataList : getRenderList_valueEvaluation( block ),
                    onSelect: (value) => {
                         // queryBox.onSelect_traitType(value, queryBox.input);
                          queryBox.onSelect_traitValue(value ,  queryBox.input);
                            
                     }
                 }
            
               default: return info;
            }
          
        case 2:
                
                switch (tokenType) {
              
                case "VALUE":

                  let value_textContent_depth2 ="";
                   let value_count_depth2="";
                   if (block.survivorEvaluation){ 
 
                      const count = block.survivorEvaluation.find(
                          el => el.input === token.normalized  ).matchesCount;
                         value_count_depth2 = count;
                      
                   }

                  return {
                     
                    type       :  "Remaining",
                    raw        :  token.raw,
                    normalized :  token.normalized, //operator use canonical not normalized
                     renderSpec: {
                        title: {
                              textContent: "Remaining",
                              cssClassList: ["pipelineNodeTitle"]
                        },
                     
                        value: {
                              textContent: value_count_depth2,
                              cssClassList: ["pipelineNodeValue"]
                        }
                    },
                    generalCss:[tokenType.toLowerCase()],
                    dataList : getRenderList_survivorEvaluation(block),
                    onSelect: (value) => {
                          console.log("survivor list can not be selected");
                        //  queryBox.onSelect_traitValue(value ,  queryBox.input);
                            
                     }
                 }
            
               default: return info;
            }
       



        
        break;
  
        
        default: return info;
         
    }
 
  }

  export function getRenderList_traitSuggestion(block){

            let renderList =[];   
            block.corrections.forEach((item, index) => {
            renderList.push({
                               label:  item.label,
                               val:  item.val,
                               select: {
                                    traitSelected  : item.label,
                                    traitStart     : block.traitStart,
                                    traitEnd       : block.traitEnd
                                  } 
                            });
             });
             return renderList;

   }

 export function getRenderList_survivorEvaluation(block){
     return getRenderList_valueList_core(block.survivorEvaluation);
 }

export function getRenderList_valueEvaluation(block){

     return getRenderList_valueList_core(block.valueEvaluation);
     /*
         let renderList = [];
            block.valueEvaluation.forEach((item, index) => {

                   for (let idx = 0; idx < item.matches.length; idx++) {
                        const element = item.matches[idx];
                            renderList.push({ //label:  element,
                                               label:  element.label,
                                               val:    element.val,

                                              select  :{ 
                                                 traitValueSelected:  element, 
                                                 start: item.start,
                                                 end: item.end
                                               }   
                            });
                   }
  
          });
          return renderList;
      */
  }

    function getRenderList_valueList_core(valueList){
          let renderList = [];
          //node with exclude list have to survivor list, valueList would be null.
          if (!valueList){ return renderList =[] }
 
           valueList.forEach((item, index) => {

                   for (let idx = 0; idx < item.matches.length; idx++) {
                        const element = item.matches[idx];
                            renderList.push({ //label:  element,
                                               label:  element.label,
                                               val:    element.val,

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