 
const { getALL_NFTIDS, build_PART_GROUP_for_JSX, getFirstInSet, 
         getFirstInSetList, getMetaDataPathFromID } =
 require("../metadata/MetaDataAPI.js");

const { getData, getPath, scriptType } = require("../PATH_REGISTRY/PATH.js");
let traitCounter_Data = getData(getPath("traitCounter.json", scriptType.JSONDATA));
//let traitCounter_Data = getData(getPath("traitCounter.json", scriptType.JSONDATA));

const {  canonicalizeQuery, decomposeBlockInside, getIdsByTraitValueContains } = require("./canonicalQuery.js");
 


 let parserResult = {
         valid:true,
         blocks:[]
     };
 let suggestedTrait=[];
 let key_TraitIncludeFilters;

 let key_ValueIncludeFilters;
 let key_exclusiveRuleSets;

 
let key_excludedIdsSet

 


  //========================= api response interface =========================================================
  let APIresponse={
      queryEngine:"response was not set"
  }
  function set_APIresponse(arg){
        APIresponse = arg;
     //   console.log  (  "set_APIresponse: " ,    APIresponse );
  }
  function get_APIresponse(){
      return APIresponse;
  }
  //====================================================================================


 
 function get_featState() { 
  // return featState
 }
  
 function set_featState( featState_ARG) { 
    // featState = featState_ARG;
  }
     

 //============================ function handlers ================================================
 //======================================================================================= 
 let rebuildActiveFilterMapHandler = null;
  function set_rebuildActiveFilterMap(functionArg ) { 
       rebuildActiveFilterMapHandler = functionArg;
  }
 function run_rebuildActiveFilterMap() {

     
  if (!rebuildActiveFilterMapHandler) {
  //  console.log("addTraitUIHandler not set");
    return;
  }

  return rebuildActiveFilterMapHandler();
}

//=======================================================================================
//=======================================================================================
 







let valid_DSL_found = false;

const queryMode = { 
      NFT_SEARCH  :"NFT_SEARCH",
      TRAIT_SEARCH:"TRAIT_SEARCH",
      DSL:"DSL"
}
  


let NFTSearchMode = false;

 
function extractTraitKey(block) {

     const start = block.indexOf("[") + 1;

    if (start === 0) return null;

    const end = block.indexOf(":");

    if (end !== -1)
        return block.slice(start, end);

    const close = block.indexOf("]", start);

    if (close !== -1)
        return block.slice(start, close);

    return null;
}




function dslInterpreter(query , blocksData ) {
    // query is  canonicalResult 

     suggestedTrait=[];
     // parserResult.blocks =   new Array(blocks_arg.length); //[  blocks_arg.length   ]
        parserResult={
         valid:true,
        // blocks :[]
           blocks :new Array( blocksData.blocks.length)  //[  blocks_arg.length   ]
     };
 

    const include = new Set();
    const exclude = new Set();

    const excludeValues = [];
    const includeValues = [];
    const includeExclusiveValues = [];
 

    // -------------------------
    // 1️⃣ Match value exclusion blocks: -v[TRAIT:[value1,value2]]
    // -------------------------
  // console.log ( " blocksData.blocks   ===============   "  , blocksData.blocks   );
 
     const valueExcludeMatches = blocksData.blocks;
         valueExcludeMatches.forEach(block => {
            
           if (block.operatorToken?.canonical === "-v" || 
               block.operatorToken?.canonical === "-"
             ){ 
            // if (block.operator !== "-v") return;

            const traitKey = block.trait;
            getParserResult(traitKey, null, block.raw, blocksData.normalizedQuery, block, blocksData.blocks );
        
             if (!traitCounter_Data[traitKey]) return;
             excludeValues.push({ trait: traitKey, values: block.values });


            }
        });
 
        // -------------------------
    // 2️⃣A Match value exclusive inclusion blocks: ++v[TRAIT:[value1,value2]]
    // -------------------------

     
     const valueExclusiveMatches = blocksData.blocks;
     valueExclusiveMatches.forEach(block => {
            if (block.operatorToken?.canonical !== "++v") return;
           // if (block.operator !== "++v") return;

            const traitKey = block.trait;
            getParserResult(traitKey, null, block.raw,blocksData.normalizedQuery, block, blocksData.blocks );
        
            if (!traitCounter_Data[traitKey]) return;

             
            includeExclusiveValues.push({

                trait: traitKey,
                values: block.values

            });


            

    
        });
 
    // -------------------------
    // 2️⃣B Match value inclusion blocks: +v[TRAIT:[value1,value2]]
    // -------------------------
     let impliesIncludeList = false; // include list to start from for -v, ++v
 
    if (blocksData.blocks[0] && 
        
           blocksData.blocks[0].operatorToken?.canonical !== "+v"
        // blocksData.blocks[0].operator !== "+v" 
    ){
       
         let block = blocksData.blocks[0];
 
          const traitKey = block.trait;
          if ( traitCounter_Data[traitKey]) {  
           const {  valueNameList  } = getIdsByTraitValueContains( traitKey,["*"],null);
 
            
         
            includeValues.push({trait: traitKey,values: valueNameList });
          }

 
    }
 
   
   // const valueIncludeMatches = blocksData.blocks; 
      blocksData.blocks.forEach(block => {

        if (block.type === "UNKNOWN" || 
            block.type === "END_OF_QUERY"
         ){ 

             parserResult.blocks[  block.blockId  ] = block;    
        } 

       if (block.operatorToken?.canonical === "+v" || block.operatorToken?.canonical   === "+" )  { 
      //  if (block.operator === "+v" || block.operator === "+" ){ 

            const traitKey = block.trait;
            getParserResult(traitKey, null, block.raw,blocksData.normalizedQuery, block , blocksData.blocks);
        
            if (!traitCounter_Data[traitKey]) return;
              
            includeValues.push({

                trait: traitKey,
                values: block.values

            });
           }


     });
 
    
    // -------------------------
    // 3️⃣ Remove +/-v blocks before normal parsing
    // -------------------------
  /*
    const cleanedQuery = query
    .replace(/\+\+v\[[^\]]+\]/g, "")
    .replace(/\-v\[[^\]]+\]/g, "")
    .replace(/\+v\[[^\]]+\]/g, ""); 

    // -------------------------
    // 4️⃣ Match include lists: +[...]
    // -------------------------

    const includeMatches = cleanedQuery.match(/\+\[([^\]]+)\]/g) || [];

    includeMatches.forEach(list => {
        const traits = list
            .replace(/\+\[|\]/g, "")
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length > 0);

        traits.forEach(t => include.add(t));
    });
   

    // -------------------------
    // 5️⃣ Match exclude lists: -[...]
    // -------------------------

    const excludeMatches = cleanedQuery.match(/\-\[([^\]]+)\]/g) || [];

    excludeMatches.forEach(list => {
        const traits = list
            .replace(/\-\[|\]/g, "")
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length > 0);

        traits.forEach(t => exclude.add(t));

    });
*/
  
 
   return {
    valid:      parserResult.valid,
    blocks:     parserResult.blocks,

    include: Array.from(include),
    exclude: Array.from(exclude),
    
    excludeValues,
    includeValues,
    includeExclusiveValues
};
 
}
 



  function resolveQueryMode(raw) {
/*
    if (/^#?\d+(,\s*\d+)*$/.test(raw)) {
        return { type: "NFT_SEARCH" };
    }*/

    if (/^#?\d+(,\s*\d+)*$/.test(raw)) {
        if (  raw.includes("#") ) { 

        return { type: queryMode.NFT_SEARCH };
       

    }
   }
 

    if ( 
        raw.includes("+")    ||
        raw.includes("+v")   ||

        raw.includes("-")    ||
        raw.includes("-v")   ||
        
        raw.includes("+v[")  ||
        raw.includes("-v[")  ||

        raw.includes("++v[") ||
        raw.includes("+[")   ||
        raw.includes("-[")   ) {
        return { type:  queryMode.DSL  };
    }

       return { type: queryMode.TRAIT_SEARCH  };
}


function evaluateQueryToActiveFilterMap(featStateArg) {

     const state = featStateArg.QueryState;

    const includedIdsSet      = state.includedIdsSet;
    const includedValueIdsSet = state.includedValueIdsSet;
    const excludedIdsSet      = state.excludedIdsSet;
    const exclusiveRuleSets   = state.exclusiveRuleSets;


    // console.log
     let workingSet = null;
     //  ALL_NFTIDS = getALL_NFTIDS();

      
    // console.log(    " QueryState.Mode  =======================   "    ,   queryMode.DSL   );  
     if (    
          featStateArg.QueryState.Mode  === queryMode.DSL ){ 
         
     }


    // ----------------------------------------
    // 1️⃣ Build base working set (OR + intersection logic)
    // ----------------------------------------

    if (includedIdsSet.size > 0 && includedValueIdsSet.size > 0) {

        workingSet = new Set(
            [...includedIdsSet].filter(id =>
                includedValueIdsSet.has(id)
            )
        );

    } else if (includedIdsSet.size > 0) {

        workingSet = new Set(includedIdsSet);

    } else if (includedValueIdsSet.size > 0) {

        workingSet = new Set(includedValueIdsSet);
    }

    // ----------------------------------------
    // 2️⃣ Build ++v exclusive intersection set
    // ----------------------------------------

    let exclusiveSet = null;

    if (exclusiveRuleSets.length > 0) {

      //  console.log("exclusiveRuleSets =====" ,  exclusiveRuleSets);
        exclusiveRuleSets.forEach(set => {

            if (!exclusiveSet) {

                exclusiveSet = new Set(set);

            } else {

                exclusiveSet = new Set(
                    [...exclusiveSet].filter(id =>
                        set.has(id)
                    )
                );
            }
        });
    }

    // ----------------------------------------
    // 3️⃣ Apply exclusive constraint to working set
    // ----------------------------------------

    

    if (exclusiveSet !== null) {
    //if (exclusiveSet && exclusiveSet.size > 0) {

        if (workingSet) {

            workingSet = new Set(
                [...workingSet].filter(id =>
                    exclusiveSet.has(id)
                )
            );

        } else {

            // only ++v rules exist
            workingSet = exclusiveSet;
        }
    }

    // ----------------------------------------
    // 4️⃣ Build final active filter map
    // ----------------------------------------
 
    if (workingSet && workingSet.size > 0) {

        featStateArg.activeFilterMap.clear();

        workingSet.forEach(function (id) {

            // hard exclusion always wins
            if (excludedIdsSet.has(id)) return;

            var idBase = getFirstInSet(id);

            featStateArg.activeFilterMap.set(id, {
                id: id,
                idBase: idBase
            });
        });

        featStateArg.rebuildactiveFilterMap_IDBASE_fromMap();
        featStateArg.rebuildactiveFilterMap_IDS_fromMap();


        set_APIresponse({
             responseFromFN: "evaluateQueryToActiveFilterMap", 
             activeTraitUI_result_pills:featStateArg.activeTraitUI_result_pills,
             activeFilterMap_IDS_length:featStateArg.activeFilterMap_IDS.length,
             queryMode: featStateArg.QueryState.Mode,
             activeFilterMap_IDS: featStateArg.activeFilterMap_IDS
         }); 

         

        return true;
     }

     
   

    return false;
} 


 
function applyNFTSearchMode(featStateArg){ 


   

     if (  
         featStateArg.QueryState.Mode === queryMode.NFT_SEARCH
        && Array.isArray(featStateArg.NFTSearchResults)) {

        featStateArg.NFTSearchResults.forEach(function (id) {
            var idBase = getFirstInSet(id);

            featStateArg.activeFilterMap.set(id, { id: id, idBase: idBase });
 
        });

          featStateArg.rebuildactiveFilterMap_IDBASE_fromMap();
          featStateArg.rebuildactiveFilterMap_IDS_fromMap();
            // console.log  (  "response: ", featStateArg.QueryState.Mode , get_APIresponse() );
           set_APIresponse({

                responseFromFN: "applyNFTSearchMode",
              
                 QueryMode: featStateArg.QueryState.Mode,
                 activeFilterMap_IDS: featStateArg.activeFilterMap_IDS

                 
            });
 

        return true; // ⛔ stop here, do NOT run trait logic
    }

     return false;

} 




function resetSets(featStateArg){ 

      key_TraitIncludeFilters=[];
      key_ValueIncludeFilters=[];
      key_exclusiveRuleSets=[];
      key_excludedIdsSet=[];
      suggestedTrait=[];

    
     featStateArg.QueryState.excludedIdsSet = new Set();
     featStateArg.QueryState.includedIdsSet = new Set();
     featStateArg.QueryState.includedValueIdsSet = new Set();
     featStateArg.QueryState.exclusiveValueIdsSet = new Set();
     featStateArg.QueryState.exclusiveRuleSets.length = 0;
}

function handleDSLQuery( inputObj  , featStateArg ) { 

     let { raw, caret, action } = inputObj;
   
    

      const blocksData  = canonicalizeQuery(inputObj);
      const normalizedQuery = blocksData.normalizedQuery;

      let updatedCaret = blocksData.updatedCaret ;
      let actionTrigger = blocksData.actionTrigger ;
      
  

      for (let index = 0; index < blocksData.blocks.length; index++) {
        /*
                 console.log(  "  blocks (", index  ,")  ==============   \n" ,
                           blocksData.blocks[ index ] , 
                         " \n ========================================"
                  );*/
        }
       
        const result = dslInterpreter(normalizedQuery , blocksData  );
   
  for (let index = 0; index < result.blocks.length; index++) {
 
            
        
       }


    if (!result) return;

 
    if (!result.valid /* || result.blocks*/ ){ 
        return {
                success: false,
                shouldRebuild: false,
                blocks: result.blocks ,

                normalizedQuery:normalizedQuery,
                updatedCaret:updatedCaret,
                 actionTrigger:actionTrigger
                 
            };

    }
   



    resetSets( featStateArg);


  


   // applyTraitIncludeFilters(result,featStateArg);
    applyValueIncludeFilters(result,featStateArg);

    applyExclusiveValueRules(result,featStateArg);
    
    applyTraitExcludeFilters(result,featStateArg);
    applyValueExcludeFilter(result,featStateArg);

    
 

  // 🚨 IMPORTANT: always build candidate list
    const hasQuery =
         featStateArg.QueryState.includedIdsSet.size > 0 ||
         featStateArg.QueryState.includedValueIdsSet.size > 0 ||
         featStateArg.QueryState.exclusiveRuleSets.length > 0 ||
         featStateArg.QueryState.excludedIdsSet.size > 0;
  

    if (hasQuery) {
       valid_DSL_found = true;
    }




    //================================================================
     
   
 
 let queryDna =
       "TI:"  + key_TraitIncludeFilters  + "|" +
       "VI:"  + key_ValueIncludeFilters  + "|" +
       "ERS:" + key_exclusiveRuleSets   + "|" +
       "EI:" +  key_excludedIdsSet;

//=====================================================================================================       
const queryData  = { 
    key_TraitIncludeFilters : key_TraitIncludeFilters,
    key_ValueIncludeFilters : key_ValueIncludeFilters,
    key_exclusiveRuleSets   : key_exclusiveRuleSets,
    key_excludedIdsSet      : key_excludedIdsSet 
  
}

//=============================================


 //======================================================================================================

 const queryDNAObj ={ 
       normalizedQuery:normalizedQuery,
       
      raw:raw,
      queryDna:queryDna,
      queryData:queryData
 };
      
      
      
 
 //================================================================
     
    if (valid_DSL_found) {
          valid_DSL_found = false;
         
         return {
           success: true,
           shouldRebuild: true,
           blocks: result.blocks ,
           queryDNAObj : queryDNAObj,
           normalizedQuery:normalizedQuery,
           updatedCaret:updatedCaret,
           actionTrigger:actionTrigger
           
        };
     }
     
    return {
        success: false,
        shouldRebuild: false,
         blocks:     result.blocks,    
         normalizedQuery:normalizedQuery,
         updatedCaret:updatedCaret,
        actionTrigger:actionTrigger
        
    };


}

 

//============================

 
function applyTraitIncludeFilters (result ,featStateArg){ 
     result.include.forEach(trait => {
        key_TraitIncludeFilters.push(trait);//for dna building
        const ids = getAllTraitIds(trait);
        ids.forEach(id =>  featStateArg.QueryState.includedIdsSet.add(id));
   });
 
}
function applyValueIncludeFilters(result, featStateArg){ 
        result.valueEvalPerTrait ={}
     if (result.includeValues && result.includeValues.length > 0) {

        result.includeValues.forEach(rule => {
           
           const block = parserResult.blocks.find(t => t.input === rule.trait /*traitValid*/ );
 
            const {ids, valueNameList, traitValid , 
                    availableTraitResult, valueEvaluation } = getIdsByTraitValueContains(
                rule.trait,
                rule.values,
                block
            );

          //===================
           // if (!result.valueEvalPerTrait[rule.trait] ){ 
                result.valueEvalPerTrait[rule.trait] = valueEvaluation;
           // }


              // do not pollule DNA with 0 value found trait
             if (traitValid && valueNameList.length > 0 ){ 
                
                  key_ValueIncludeFilters.push( (traitValid +"::"+valueNameList) );
              }else{ 
                  suggestedTrait = availableTraitResult;
              }
           
           
            ids.forEach(id =>  featStateArg.QueryState.includedValueIdsSet.add(id));
        });
    }

}

function applyTraitExcludeFilters(result, featStateArg ){ 
    result.exclude.forEach(trait => {

        key_excludedIdsSet.push(trait);
        const ids = getAllTraitIds(trait);
        ids.forEach(id =>  featStateArg.QueryState.excludedIdsSet.add(id));
    });
    
}
function applyValueExcludeFilter(result, featStateArg){
   if (result.excludeValues && result.excludeValues.length > 0) {

        result.excludeValues.forEach(rule => {

          
            const {ids, valueNameList, traitValid, availableTraitResult } = getIdsByTraitValueContains(  
                rule.trait, 
                rule.values
            );
            if (traitValid && valueNameList.length > 0 ){
                 key_excludedIdsSet.push(traitValid +"::"+ valueNameList ); 
            }else{ 
                suggestedTrait = availableTraitResult;
             }


           
            ids.forEach(id => featStateArg.QueryState.excludedIdsSet.add(id));




    //======================== survivor   ==================================
            //===================== build survivor list =================================
    // filter returns an array Not an object.
       const targetBlock = result.blocks.find( b=> b.tokens[0].canonical === "+v"  && b.input === rule.trait );

       // console.log(" =======targetBlock ============" , targetBlock );
        if ( targetBlock ) {   
         
            targetBlock.survivorEvaluation =
            targetBlock.valueEvaluation.map(value => {

                const matches = value.matches
                    .map(match => {

                        const survivorIds = match.ids.filter(
                            id => !featStateArg.QueryState.excludedIdsSet.has(id)
                        );

                        return {
                            ...match,
                            ids: survivorIds,
                            val: survivorIds.length
                        };

                    })
                    .filter(match => match.ids.length > 0);

                const matchesCount = matches.reduce(
                    (total, match) => total + match.ids.length,
                    0
                );

                return {
                    ...value,
                    matches,
                    matchesCount,
                    valid: matches.length > 0
                };

    });



          //  console.log (" result.survivorEvaluation  = "      ,targetBlock.survivorEvaluation   );    
           //  console.log (" targetBlock.valueEvaluation  = "   ,targetBlock.valueEvaluation   );     

      }
      
 
        });



       
 


    }
}

function applyExclusiveValueRules(result, featStateArg) {

    if (
        !result.includeExclusiveValues ||
         result.includeExclusiveValues.length === 0
    ) {
        return;
    }

    result.includeExclusiveValues.forEach(rule => {

        // key_exclusiveRuleSets.push(rule.trait+"::"+rule.values);
   
         const block = parserResult.blocks.find(t => t.input === rule.trait /*traitValid*/ );
      
          const {ids, valueNameList, traitValid ,
                   availableTraitResult, valueEvaluation } = getIdsByTraitValueContains(
                 rule.trait,
                 rule.values,
                 block
           );
              
           if ( valueNameList.length > 0 ){  
            key_exclusiveRuleSets.push(rule.trait+"::"+ valueNameList );
           }

      //=================================================================================        
  
 
        featStateArg.QueryState.exclusiveRuleSets.push( new Set(ids) );
              
        


    });
}
  
//=====================
function getAllTraitIds(traitKey) {
  if (!traitCounter_Data[traitKey]) return [];

  const valuesObj = traitCounter_Data[traitKey];

   valid_DSL_found = true;
  return Object.values(valuesObj)   // get arrays of ids
    .flat()                         // flatten into 1D
    .filter((id, index, arr) => arr.indexOf(id) === index); // remove duplicates
}

//+v[he] +v[HE] +v[sh]
 function getParserResult(traitKey,  traitValue ,  blockRaw, rawQuery , block_arg , blocks_arg ){ 

    if (traitValue)return;

   
    const {availableTraitResult, info } = getAvailableTraitType(traitKey) ;
  
    const startBlock =  rawQuery.indexOf( blockRaw) ;
    const corrections = [];
    availableTraitResult.forEach(trait=>{
         

           const traitTypeValueCount = Object.keys( traitCounter_Data[trait] ).length ;  

           corrections.push({ 
               label: trait,
               val:traitTypeValueCount
 
           });
 
    } )

     let traitValid = !traitCounter_Data[traitKey] ? false:true; 
     //const trait_evaluation = corrections.length > 0 ?  "INVALID_TRAIT" : "VALID_TRAIT";
     const trait_evaluation = !traitValid ?  "INVALID_TRAIT" : "VALID_TRAIT";
    

         //  const starVal =  rawQuery.indexOf( block);

          //==================================================================        
           const valueStartLocal = blockRaw.indexOf(":[") + 2; // skip :[
           const valueEndLocal   = blockRaw.lastIndexOf("]");
           const valueStart      = startBlock + valueStartLocal;
           const valueEnd        = startBlock + valueEndLocal ;//- 1;  remove -1 for exclusive end
       //=================================================================
            const traitStartLocal = blockRaw.indexOf("[") + 1;
            const traitEndLocal   = blockRaw.indexOf(":[");
            const traitStart      = startBlock + traitStartLocal;
            const traitEnd        = startBlock + traitEndLocal;//- 1;  remove -1 for exclusive end
       //==========================================================
           
            parserResult.valid = traitValid;// corrections.length === 0;
 
            parserResult.blocks[  block_arg.blockId  ] =  {
           
             valid: traitValid,// corrections.length === 0,
             type:  trait_evaluation,
             input: traitKey,
            // blockId:-1,
             block:blockRaw,
             raw:blockRaw,
             infoList:[info],
             suggestions:availableTraitResult,
           
             traitValueAvailable:[],// traitValueAvailable,
             valueStart:valueStart,
             valueEnd:valueEnd,

             traitStart:traitStart,
             traitEnd:traitEnd,

             corrections:corrections,

              ...block_arg
            }
               

}
function getAvailableTraitType(traitKey) {

   let availableTraitResult = [];
     let info ={
         type: "noInfo",code: "NO_INFO",text: "Select from available trait"

     };
    if (!traitCounter_Data[traitKey]) {
            let matchesFound = 0 ;
             Object.keys(traitCounter_Data).forEach(keyName => {

               const lowerkeyName  =  keyName.toLowerCase();
               let lowertraitKey   =  traitKey.toLowerCase();
              
               if ( lowertraitKey.includes(" ")){ 
                  //  info = "SPACE_IN_TRAIT";
                    info={   
                        type: "warning",code: "SPACE_IN_TRAIT",text: "Trait names cannot contain spaces."
                    }


                    lowertraitKey = lowertraitKey.split(/\s+/)[0];
               }
                     
                  // here we show only trait containing fragment 
                if (lowerkeyName.includes(lowertraitKey)) {
                        matchesFound++;
                        availableTraitResult.push(keyName ); //keyName
                }
               });
            
               //find 0 and current input fully match a traittype. then show full list.
                

               if ( matchesFound === 0){   
                     availableTraitResult = Object.keys(traitCounter_Data);
               }
            
             // console.log( " availableTraitResult  == " , availableTraitResult  );
            
             return  {  availableTraitResult: availableTraitResult,
                       info:info
                     };
           
     }else{
        //if traitCounter_Data[traitKey] is already valid, we present the full list
         availableTraitResult = Object.keys(traitCounter_Data);
     }

      return {  availableTraitResult: availableTraitResult,
                info:info
              };
}
  

function runQueryInputHandler(inputObj, featStateArg){ //traitSearch
  
    const { raw } = inputObj;
    if (!raw) {
        /*
         on_clearAllSearchQuery();
         set_APIresponse({QueryMode:"TRAIT_SEARCH"}) ;//default
         return get_APIresponse();
        return;*/
    }
    
   
         featStateArg.QueryState.Mode = resolveQueryMode(raw).type;
   if (!raw) {
          featStateArg.on_clearAllSearchQuery();
       
         featStateArg.QueryState.Mode =  "TRAIT_SEARCH";
        
        // return get_APIresponse();
       // return;
    }


  //  console.log("xxxxx  runQueryInputHandler   " ,   featStateArg.activeFilterMap_IDS   );

 
  switch (featStateArg.QueryState.Mode ){
         
        case "DSL":
           const queryResult = handleDSLQuery( inputObj , featStateArg); //raw
        
            if (queryResult?.shouldRebuild) {

                  query_rebuildFilter(featStateArg);
 
            }
            

             set_APIresponse({ 
                responseFromFN: "runQueryInputHandler case:DSL",
                queryMode: featStateArg.QueryState.Mode,
                resultCount: featStateArg.activeFilterMap_IDS.length,
                filterModeABS: featStateArg.filterModeABS ,
                activeFilterMap_IDS: featStateArg.activeFilterMap_IDS,

                 queryResult:queryResult,

                suggestedTrait: queryResult?.suggestedTrait,

                // does not exist if result === 0
                raw: queryResult?.queryDNAObj?.raw,
                dna: queryResult?.queryDNAObj?.queryDna,
                queryData: queryResult?.queryDNAObj?.queryData 

             });
            // console.log( "responseFromFN:  runQueryInputHandler case:DSL  ", get_APIresponse() );

            const response = get_APIresponse();
                

             return response;

            break;

         case "NFT_SEARCH":
             handleNFTSearch(raw, featStateArg);
           // set_APIresponse({queryMode:"NFT_SEARCH"})
            return get_APIresponse();
            break;

        case "TRAIT_SEARCH":

            NFTSearchMode = false;
            featStateArg.NFTSearchResults = [];

             set_APIresponse({queryMode:"TRAIT_SEARCH"})
            return get_APIresponse();

           // handleTraitSearch(raw);
            break;


           default:
  // console.log( " default    QueryState.Mode    " ,    featStateArg.QueryState.Mode   );
             break;
    }

    return get_APIresponse();
}


function handleTraitSearch(raw , featStateArg ) {
    applyTraitSearchBlock(raw.toLowerCase() , featStateArg );
}

function applyTraitSearchBlock(q, featStateArg){ 
   NFTSearchMode = false;
   featStateArg.NFTSearchResults = [];
  
   const blocks = document.querySelectorAll("#final_traitFILTERListContainer .trait-block");
 

  blocks.forEach(block => {
    const select = block.querySelector("select");
    let hasMatch = false;

    Array.from(select.options).forEach(opt => {
      if (!opt.value) {
        opt.hidden = false; // always keep "(ignore)"
        return;
      }

      const match = opt.textContent.toLowerCase().includes(q);
      opt.hidden = !match;

      if (match) hasMatch = true;
    });

    // hide whole trait group if nothing matches
    block.style.display = hasMatch || q === "" ? "" : "none";
  });



}

function handleNFTSearch(raw, featStateArg ) {
    call_NFTSearchMode(raw , featStateArg);


 //   console.log( " raw  " ,  raw );
}

function call_NFTSearchMode(raw , featStateArg) {

    // we are setting this here as well in case the function is called from
    // show fives, were nft mode is forced because there is no manual input
  
    featStateArg.QueryState.Mode =  queryMode.NFT_SEARCH;
   
   // NFTSearchMode = true;
//#4101,4102,4103,4104,4105,3156,3157,3158,3159,3160,3841,3842,3843,3844,3845
   featStateArg.NFTSearchResults = raw
      .replace("#", "")
      .split(",")
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n));
     
 

    // Rebuild ID list based on AND / OR
      query_rebuildFilter(featStateArg);

     set_APIresponse({
     
            responseFromFN: "call_NFTSearchMode",
          //  "IDS Match Count": featState.NFTSearchResults.length,
             queryMode: featStateArg.QueryState.Mode,
             activeFilterMap_IDS: featStateArg.NFTSearchResults
     }); 

  // console.log( "query_rebuildFilter: ", get_APIresponse() );

}  
  
function query_rebuildFilter(featStateArg){ 
   
    run_rebuildActiveFilterMap();
    featStateArg.set_gridRenderMode(featStateArg.gridMode.ABSOLUTE);

    // should add call back here.. web can not use this
  //  if (window.updateGrid) window.updateGrid();
 
}





function handleTraitSearch(raw , featStateArg) {
    applyTraitSearchBlock(raw.toLowerCase(), featStateArg );
}


function applyTraitBlockLogic( featStateArg){ 

        

    if (featStateArg.activeTraits.size === 0) {
 
         return;
     } 
 
    // ==========================
    // GLOBAL OR MODE
    // ==========================
   // if (traitFilterMode === "OR") {
      if (featStateArg.filterModeABS === "OR") {
        
        const resultSet = new Set();

        for (const nftSet of featStateArg.activeTraits.values()) {
            nftSet.forEach(id => resultSet.add(id));
        }

        resultSet.forEach(id => {
             
           // Skip if this id is in the excluded set
           if (featStateArg.QueryState.excludedIdsSet.has(id)) return;

              const idBase = getFirstInSet(id);
             featStateArg.activeFilterMap.set(id, { id, idBase });
 

        });
 
        featStateArg.rebuildactiveFilterMap_IDBASE_fromMap();
        featStateArg.rebuildactiveFilterMap_IDS_fromMap();
        //============================== response =======================
        set_APIresponse({ 
            resultCount: featStateArg.activeFilterMap_IDS.length,
            filterModeABS: featStateArg.filterModeABS ,
            activeFilterMap_IDS: featStateArg.activeFilterMap_IDS
        })
        return get_APIresponse() ;
    }

    // ==========================
    // DEFAULT AND MODE
    // ==========================

    const traitsByType = new Map();

    for (const [key, nftSet] of featStateArg.activeTraits.entries()) {
        const [traitType] = key.split("::");
        if (!traitsByType.has(traitType)) {  traitsByType.set(traitType, []);   }
         
        traitsByType.get(traitType).push(nftSet);
    }

    const unionPerType = new Map();

    for (const [traitType, sets] of traitsByType.entries()) {
        const unionSet = new Set();
        sets.forEach(s => s.forEach(id => unionSet.add(id)));
        unionPerType.set(traitType, unionSet);
    }

    let resultSet = null;

    for (const unionSet of unionPerType.values()) {
        if (!resultSet) {
            resultSet = new Set(unionSet);
        } else {
            resultSet = new Set(
                [...resultSet].filter(id => unionSet.has(id))
            );
        }
    }

    /*
   console.log( 
         " ==========================================  \n" ,
          "traitsByType = "   , traitsByType , " \n" ,
          "unionPerType = "   , unionPerType , " \n\n" ,
          "resultSet = "      , resultSet   
  
   );
*/
  


    if (resultSet && resultSet.size > 0) {
        resultSet.forEach(id => {

             // Skip if this id is in the excluded set
           if (featStateArg.QueryState.excludedIdsSet.has(id)) return;

            const idBase = getFirstInSet(id);
            featStateArg.activeFilterMap.set(id, { id, idBase });
  

        });
    }


 
    featStateArg.rebuildactiveFilterMap_IDBASE_fromMap();
    featStateArg.rebuildactiveFilterMap_IDS_fromMap();
 
      set_APIresponse({
           filterModeABS: featStateArg.filterModeABS ,
          // resultSet:resultSet,
           activeFilterMap_IDS: featStateArg.activeFilterMap_IDS
         });
        


} 

  

function applyTraitSearchBlock(q, featStateArg){ 
   NFTSearchMode = false;
   featStateArg.NFTSearchResults = [];
  
   const blocks = document.querySelectorAll("#final_traitFILTERListContainer .trait-block");
 

  blocks.forEach(block => {
    const select = block.querySelector("select");
    let hasMatch = false;

    Array.from(select.options).forEach(opt => {
      if (!opt.value) {
        opt.hidden = false; // always keep "(ignore)"
        return;
      }

      const match = opt.textContent.toLowerCase().includes(q);
      opt.hidden = !match;

      if (match) hasMatch = true;
    });

    // hide whole trait group if nothing matches
    block.style.display = hasMatch || q === "" ? "" : "none";
  });



}
 


//===================================== normalizer carret aware =============================
//================================================================================
   

//======================================================================
module.exports ={ 
   //dslParser: dslInterpreter, 
   resolveQueryMode,handleDSLQuery ,

   // was in engine state... we move here to make it stateless
   // get_VideoFilterObject, buildVideoFilterObject,serializeActiveTraitUI,
      
    queryMode,

    runQueryInputHandler,

     query_rebuildFilter, handleNFTSearch, handleTraitSearch  , evaluateQueryToActiveFilterMap,
     applyTraitBlockLogic , applyNFTSearchMode,
     set_rebuildActiveFilterMap,
     get_APIresponse,

     get_featState, set_featState
 // NFTSearchMode

}
     
     
