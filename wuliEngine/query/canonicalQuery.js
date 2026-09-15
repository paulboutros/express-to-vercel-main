   

const {
    isCompleteProducerAt,
    processOperator3,
    processUnknown,
    write, 
    findEditingValue,
    decomposeBlockInside,
     finalizeProducerOnlyBlock,
 applyCommand,
 processValueSeparator , readProducerPrefix
} = require("./helperFunction.js");

 const {    TOKEN,  createTraitToken, createValueToken } = require("./lexer.js");

   let traitCounter_Data ;//= getData(getPath("traitCounter.json", scriptType.JSONDATA));
    



function canonicalizeQuery({ raw = "", caret = 0, action = null,  command = null , traitCounter_DataArg }) {
      
     traitCounter_Data = traitCounter_DataArg;
    console.log(  "=========  canonicalize trait data:", 
        traitCounter_Data["TYPE"]
     );

    const blocks =[];
    const ctx = {
         raw,
         index: 0,
         out: "",
         caret,
         blockId:0,
         action,
         command,
         actionTrigger:null,
         state: STATE.NORMAL,
         lastOutput: ""
     };
    const startIndex = ctx.index;
    
      applyCommand(ctx, command);
     
    let block_id =-1;
    while (ctx.index < ctx.raw.length) {
        
        //  console.log("MAIN LOOP START", ctx.index);
          // Try parsing a DSL block
          const block = processBlock(ctx );

            if (block) { 
                if (block && ctx.index <= startIndex) {
                    throw new Error( "processBlock returned without advancing ctx.index");
               }
               analyzeBlock(block, caret);
               block_id++; block.blockId = block_id;
               console.log( "block ====", block );  
              insertRawTokens(block);

              blocks.push(block);
              continue;
            }
  
         // Nothing recognized → consume unknown text
            const unknown = processUnknown(ctx);

            if (ctx.index <= startIndex) {
                 throw new Error("processUnknown returned without advancing ctx.index");
            }
        
            analyzeBlock(unknown, caret);
 
            block_id++; unknown.blockId = block_id;
            blocks.push(unknown); 
            
         
        
    }
                 
                const END_OF_QUERY_raw ="                                   "; 
                block_id++;
                blocks.push({
                type: "END_OF_QUERY",
                valid: true,
                raw: END_OF_QUERY_raw,
                start: ctx.index,
                end: ctx.index+ END_OF_QUERY_raw.length,
                blockId:block_id,

                tokens: [{
                    id: 0,
                    type: "END_OF_QUERY",
                    raw: END_OF_QUERY_raw
                }]
            });

 
   
    return {

      normalizedQuery: ctx.out,
      actionTrigger: ctx.actionTrigger, 
      updatedCaret: ctx.caret ,
      blocks
   };


}
 
 function processBlock(ctx) {


    let BLOCKTYPE ="NORMAL"
   const tokens = []; 
    
    const producer = processOperator3(ctx   );
 if (!producer) return null;
 
const {
    operatorToken,
    operator,// can be now found in  operatorToken.canonical
    consumed,
    rawStart,
    rawEnd,
    updatedCaret,
    actionTrigger,

    traitBracket
} = producer;

//========================== a partial + is actually a full block...  a partial block===================================
 const startIndex = ctx.index;
  
//--------------------------------------------------
// Partial producer
//--------------------------------------------------

if (producer.operatorToken.type === TOKEN.PARTIAL_PRODUCER) {

    return finalizeProducerOnlyBlock(ctx, producer,startIndex, actionTrigger, tokens,addToken, {
    //    blockType: BLOCK.PARTIAL_PRODUCER,
        reason: "PARTIAL_PRODUCER"
    });
  
}

//--------------------------------------------------
// Missing '[' after complete producer
//--------------------------------------------------

if (traitBracket === -1) {

    return finalizeProducerOnlyBlock(ctx, producer, startIndex, actionTrigger, tokens,addToken, {
      //  blockType: BLOCK.PRODUCER_ONLY,
        reason: "MISSING_TRAIT_BRACKET"
    });

}
 
//======================================== end of partial block creation ============

ctx.caret = updatedCaret;
if ( actionTrigger) { ctx.actionTrigger = actionTrigger;  }
  
    //------------------------------------------------------
    // Find matching closing ]
    //------------------------------------------------------

    let missingBracketChar =0;
    let depth = 0;
    let end = -1;

    
    for (let i = ctx.index; i < ctx.raw.length; i++) {

        const ch = ctx.raw[i];
         if (ch === "[") depth++;
         if (ch === "]") {

            depth--;
   
            if (depth === 0 ) {
 
                end = i;
                break;

            }

        }
        if (   depth > 0 &&   (ch === "+" || ch === "-") ) { 
                missingBracketChar = 1;
                end = i-1;
                BLOCKTYPE = "PARTIAL";
                break;
        }
     //======

            // A new complete producer at the current level
    // terminates the unfinished block.
      
  // depth === 0 &&  (ch === "+" || ch === "-")

    } 
   
 
 /*
 
    if (
        depth === 0 &&
        (ch === "+" || ch === "-") &&
        isCompleteProducerAt(ctx.raw, i, ctx)
    ) {
       
   */


    // User is still typing
    if (end === -1  ) // return null;
      { 
    
     const partialText = ctx.raw.slice(rawStart);

        write(ctx, partialText);

        ctx.index = ctx.raw.length ;

        return {

            type: "PARTIAL",
            operatorToken,
            operator, // operatorToken.canonical
            start: rawStart,
            end: ctx.raw.length  ,
 

            raw: partialText,
            normalized: partialText,
            trait: "",
            values: [],
            editingValue: null,
            

        };
 
    } 
    
    //------------------------------------------------------
    // Extract raw block
    //------------------------------------------------------
    const blockStart = ctx.index;
    const blockEnd   = end + 1      ;
    let rawBlock = ctx.raw.slice(blockStart, blockEnd);
    console.log("RAW BLOCK:", JSON.stringify(rawBlock));
 //------------------------------------------------------
// 4. Normalize THIS block
//------------------------------------------------------
  const separator = processValueSeparator(rawBlock);
 if (separator.changed) {

     rawBlock = separator.normalizedBlock;

}
 
    //------------------------------------------------------
    // Parse grammar
    //------------------------------------------------------
    const inside = rawBlock.slice(consumed + 1, -1);//.trim();
    console.log("INSIDE:", JSON.stringify(inside));
    const data = decomposeBlockInside(inside, blockStart);

    if (!data) return null;

    const blockValueStart =
      blockStart +
      operatorToken.canonical.length +
    
    1 +                 // skip '[' after operator
    data.splitIndex +   // index of :[ 
    2;                  // skip ":["
    

     
   const insideStart =
    blockStart +
    rawBlock.indexOf("[") + 1;
 
    const traitStart =
       insideStart + data.traitLocalStart;
   const traitEnd =
       insideStart + data.traitLocalEnd;


    operatorToken.start =   blockStart  + operatorToken.localStart;
    operatorToken.end   =  blockStart + operatorToken.localEnd;
    addToken(operatorToken);
      // set abs position of trair token
 
     const traitToken = createTraitToken({
        
        blockRaw:rawBlock,
        startBlock: blockStart ,
        valid : true,
       
         localStart: data.traitLocalStart,  
         localEnd:   data.traitLocalEnd,
         
           start: traitStart,  
           end:  traitEnd  ,
           
           raw: data.trait
     });  
     
     addToken(  traitToken);
     

    //------------------------------------------------------
    // building and pushing token
    //------------------------------------------------------
 
    

  // for (const token of data.valueTokens){
        // addToken(token);
   // }
    function addToken(token){

            token.id =  tokens.length;
             
            tokens.push(token);
    }
//======================================
 

    const editingValue = findEditingValue(
    data.rawValues,
    ctx.caret,
     blockValueStart
     );
 

//=========================================
if (editingValue && editingValue.editingIncomplete) {

    // User is still creating the next value.
    // Leave the block exactly as typed.

     write(ctx, rawBlock);
     ctx.index = blockEnd;
 
     /*
  console.log("========= editingValue  RETURN", {
     ctxIndex: ctx.index,
     blockStart,
     blockEnd
  });
 */
   /* 
   returns block for editingValue.editingIncomplete case
   */

  

    return {
        tokens,
         operatorToken , 
         operator, // get it in  operatorToken.canonical,
         raw: rawBlock,
         start: blockStart,
         end: blockEnd,
         trait: data.trait,
         values: data.values,
         editingValue//,
     };

}
      
     //================================================
     const rebuiltValues = data.values.map((value, i) => {
     if (
         editingValue && editingValue.index === i
         
     ) {
         return editingValue.raw.trimStart();
     }
         return value.trim();
     });
 
 
 


     //------------------------------------------------------
    // Rebuild canonical block
    //------------------------------------------------------

    
    const normalizedBlock = rawBlock;
          
         // `${operator}[${data.trait}:[${rebuiltValues.join(", ")}]]`;
        
    ctx.raw =
    ctx.raw.slice(0, blockStart) +
    normalizedBlock +
    ctx.raw.slice(blockEnd);
 
    //------------------------------------------------------
    // Preserve caret (simple version)
    //------------------------------------------------------

    const delta = normalizedBlock.length - rawBlock.length;

    if (ctx.caret > end) {

        ctx.caret += delta;

    }
   
    //------------------------------------------------------
    // Write block
    //------------------------------------------------------
    
    write(ctx, normalizedBlock);

   // ctx.index = end + 1; // store position to scan next block
    ctx.index = blockStart + normalizedBlock.length;
     
 


  // console.log(" data.trait ==========["  ,data.trait, "]"  );
    return  { 

               type: BLOCKTYPE,

               tokens,
               operatorToken ,
               operator,
               raw: normalizedBlock,
               start:blockStart,// ctx.index,
               end: blockEnd,
               trait: data.trait,
               values: data.values ,

               editingValue:editingValue 
              
          }

}

 

//==========================================================

const STATE = {

    NORMAL : 0,
    TRAIT  : 1,
    VALUE  : 2

};
 
//==========================================================
  

function getIdsByTraitValueContains(traitKey, valueFragments, block ) {
   
    if (!traitCounter_Data[traitKey]) {

        return {

            ids: [],
            valueNameList: [],
            traitValid: null,
            valueEvaluation: []

        };

    }
   
   let ranges =null;
   if( block ){ 
        ranges = buildValueRanges(
        block.raw,
        block.start,// startBlock,
        valueFragments
      ); 
   }
 
    const valuesObj = traitCounter_Data[traitKey];

    const result = [];
    const valueNameList = [];
    const valueEvaluation = [];
        
    // framents are: re, red, gre, brow etc..
    valueFragments.forEach((fragment, i) => {
         
         const lowerFragment = fragment.toLowerCase();
         const matches = [];
         let matchesCount=0;

        Object.keys(valuesObj).forEach(valueName => {

            if (
                (valueFragments.length ===1 && fragment === "*") || // select
                valueName.toLowerCase().includes(lowerFragment)
             ){

                  const ids = traitCounter_Data[traitKey][valueName];
                  matchesCount+=ids.length;
                  matches.push({
                     label:valueName,
                     val: ids.length,  
                     ids 
                  });

                const valWithCount = valueName;// + "(" + valuesObj[valueName].length + ")";
                valueNameList.push(valWithCount);//valueName

                result.push(...valuesObj[valueName]);

            }

        });
   
        
       valueEvaluation.push({
        
        input: fragment,

        start: ranges?.[i].start,

        end: ranges?.[i].end,

        valid: matches.length > 0,
        matchesCount,
        matches

    });

   
 
    });

    return {

        ids: [...new Set(result)],

        valueNameList: [...new Set(valueNameList)],

        traitValid: traitKey,

        valueEvaluation

    };

}

 
function buildValueRanges(block, startBlock, valueFragments) {

    const valueEvaluation = [];

    // Beginning of the value section (after ":[")
    let searchPos = block.indexOf(":[") + 2;

    valueFragments.forEach(fragment => {

        const localStart = block.indexOf(fragment, searchPos);

        const localEnd = localStart + fragment.length; // exclusive

        valueEvaluation.push({

            input: fragment,

            start: startBlock + localStart,

            end: startBlock + localEnd

        });

      
        searchPos = localEnd;

    });

    return valueEvaluation;

}
 

function analyzeBlock(block, caret) {
    if (   block.type && block.type ===  "UNKNOWN" ) return;
    if (   block.type && block.type ===  "PARTIAL" ) return;


    const valueAnalysis = getIdsByTraitValueContains(
        block.trait,
        block.values,
        block
    );

    block.valueNameList = valueAnalysis.valueNameList;
    block.availableTraitResult = valueAnalysis.availableTraitResult;
    block.valueEvaluation = valueAnalysis.valueEvaluation;

    block.valueEvaluation.forEach(value => {

        value.editing = caret >= value.start && caret <= value.end;
           
            
       const token = createValueToken({ 
            id:block.tokens.length,
            raw: value.input,
            normalized: value.input,
            start   :value.start,
            end     :value.end,
            valid   :value.valid,
            editing :value.editing,
            matches: value.matches
         })
         block.tokens.push(token);
         


    });

    block.activeValue =
        block.valueEvaluation.find(v => v.editing) || null;

    block.idsLength = valueAnalysis.ids.length;

    block.infoList = [

        {

            type: "count",

            code: "MATCHED_NFTS",

            value: block.idsLength,

            text: `${block.idsLength} NFTs`

        }

    ];

}

//==================================

 
 


function insertRawTokens(block) {

    const newTokens = [];

    let lastEnd = block.start;

    if (!block.tokens) return;
 
    for (const token of block.tokens) {

        //--------------------------------------------------
        // Gap before current token
        //--------------------------------------------------

        if (token.start > lastEnd) {

            const raw =    block.raw.slice( //    block.raw.slice(
                lastEnd - block.start,
                token.start - block.start
            );

            newTokens.push({

                id: 0, // reassigned later

                type: TOKEN.RAW,

                raw,
                normalized: raw,

                start: lastEnd,
                end: token.start,

               // localStart: lastEnd - block.start,
               // localEnd: token.start - block.start,

                length: token.start - lastEnd,

                valid: true,

                meta: {}

            });

        }

        //--------------------------------------------------
        // Semantic token
        //--------------------------------------------------

        newTokens.push(token);

        lastEnd = token.end;

    }

    //--------------------------------------------------
    // Remaining text after last token
    //--------------------------------------------------

    if (lastEnd < block.end) {

        const raw = block.raw.slice(
            lastEnd - block.start
        );

        newTokens.push({

            id: 0,

            type: TOKEN.RAW,

            raw,
            normalized: raw,

            start: lastEnd,
            end: block.end,
          
            length: block.end - lastEnd,

            valid: true,

            meta: {}

        });

    }

    //--------------------------------------------------
    // Reassign ids
    //--------------------------------------------------

    newTokens.forEach((token, id) => {

        token.id = id;

    });

    block.tokens = newTokens;

}



module.exports ={ 
     canonicalizeQuery,
     decomposeBlockInside,
     getIdsByTraitValueContains//,
  

}