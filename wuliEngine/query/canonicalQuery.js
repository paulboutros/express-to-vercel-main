  const { getData, getPath, scriptType } = require("../PATH_REGISTRY/PATH.js");

 const {  detectTokenStart, TOKEN, isProducerToken, createTraitToken, createValueToken } = require("./lexer.js");

   let traitCounter_Data = getData(getPath("traitCounter.json", scriptType.JSONDATA));
   let traitCounterLength_Data  = getData(getPath("traitCounterLength.json", scriptType.JSONDATA));
   //const traitTypeValueCount = Object.keys( traitCounter_Data[trait] ).length ;
  
 


  function decomposeBlockInside(inside, blockStart) {

    const splitIndex = inside.indexOf(":[");

    if (splitIndex === -1) return null;

 // console.log( "======== inside===================|", inside,"|");
//======================================================
const traitRaw = inside.slice(0, splitIndex);


const leading =
    traitRaw.length - traitRaw.trimStart().length;

///console.log( "======== leading===================|", leading ,"|");


  const trailing =
    traitRaw.length - traitRaw.trimEnd().length;
 const trait =
    traitRaw.trim();
 const traitLocalStart = leading;
 const traitLocalEnd =
    traitRaw.length - trailing;


    
   
    /*
 const traitToken = createTraitToken({
    blockStart: blockStart,
    raw: trait,
    normalized: trait,

    localStart: traitLocalStart,
    localEnd: traitLocalEnd

});*/


//============================================

  //  const trait = inside.slice(0, splitIndex).trim();

    const valuesPart = inside
        .slice(splitIndex + 2)
        .replace(/\]$/, "");

    const values = valuesPart
        .split(",")  // "Wolf, Hood, Helmet" make 1 element = " Hood"; (empy space before)
        .map(v => v.trim())   // "   brown root   "=>"brown root"  // each value have no space now (good it used as key)
        .filter(v => v.length > 0);

    const rawValues = valuesPart.split(",");

    return {

         traitLocalStart,
         traitLocalEnd,

      //  traitToken,
        trait,
        values,
        rawValues,
        valuesPart,
        splitIndex

    };

}
 



function canonicalizeQuery({ raw = "", caret = 0, action = null,  command = null }) {
      
    
   // console.log(  "=========  canonicalize action arg:", action );

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
 
  

function processUnknown(ctx) {

      const start = ctx.index;

    while (ctx.index < ctx.raw.length) {

        const token =  detectTokenStart (ctx.raw, ctx.index);
        /*
        console.log(
            "const token =  detectTokenStart",
            ctx.index,
            ctx.raw[ctx.index],
            token
           );*/


        if(isProducerToken(token) ){ 
            break;
        }
 
        ctx.index++;
      }
      
      /*
        console.log({
            start,
            index: ctx.index,
            char: ctx.raw[start],
            remaining: ctx.raw.slice(start)
        });*/
   

  if (ctx.index <= start) {
                 throw new Error("processUnknown returned without advancing ctx.index");
    }

    const raw = ctx.raw.slice(start, ctx.index);

    write(ctx, raw);

    return {
        tokens: [{

            id :0,
            type : "RAW",
            raw
        }],
        type: "UNKNOWN",

        valid: false,

        raw,

        start,
     
        end: ctx.index

    };

}


 

 function processBlock(ctx) {
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
 
 //  console.log( " before: TOKEN.PARTIAL_PRODUCER condition  =======",   ctx.index );

   /*
if ( producer.operatorToken.type === TOKEN.PARTIAL_PRODUCER ){ 
 
    write(ctx,  producer.operatorToken.raw);

    // ctx update /advance
    ctx.index = startIndex + producer.operatorToken.localEnd;
    if ( actionTrigger) { ctx.actionTrigger = actionTrigger;  }

   // avoid mutating the lexer object directly and instead create a parser copy:
    const operatorToken = {
      ...producer.operatorToken,
        start: startIndex ,
        end:   startIndex + producer.operatorToken.localEnd
    };

      addToken(operatorToken);

  

    if (ctx.index <= startIndex) {

    throw new Error(
        `Parser stalled at index ${ctx.index}`
    );

}
    
    return {
         tokens,
         operatorToken  ,
         raw:           operatorToken.raw,
         start:         operatorToken.start,// abs
         end:           operatorToken.end,// abs
         status: "PARTIAL",
 
         normalized:    operatorToken.raw,
         trait: "",
         values: [],
         editingValue: null,
         
    };

}
  */

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
 

    //console.log( "    producer =======",  producer);
 
    //------------------------------------------------------
    // Find matching closing ]
    //------------------------------------------------------

    let depth = 0;
    let end = -1;

    for (let i = ctx.index; i < ctx.raw.length; i++) {

        const ch = ctx.raw[i];

        if (ch === "[") depth++;

        if (ch === "]") {

            depth--;

            if (depth === 0) {

                end = i;
                break;

            }

        }

    }

    // User is still typing
    if (end === -1) // return null;
      { 
    
     const partialText = ctx.raw.slice(rawStart);

        write(ctx, partialText);
        ctx.index = ctx.raw.length;

        return {

            type: "PARTIAL",
            operatorToken,
            operator, // operatorToken.canonical
            start: rawStart,
            end: ctx.raw.length,
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
    const blockEnd   = end + 1;
    let rawBlock   = ctx.raw.slice(blockStart, blockEnd);
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
         editingValue && 
         editingValue.index === i
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
               tokens,
               operatorToken ,
               operator,
               raw: normalizedBlock,
               start:blockStart,// ctx.index,
               end: blockEnd,
               trait: data.trait,
               values: data.values ,

               editingValue:editingValue//,
              //  editingIncomplete: editingValue?.editingIncomplete
          }

}

 

//==========================================================

const STATE = {

    NORMAL : 0,
    TRAIT  : 1,
    VALUE  : 2

};


//==========================================================

function current(ctx){

    return ctx.raw[ctx.index];

}

function next(ctx){

    return ctx.raw[ctx.index + 1];

}

function write(ctx, ch){

    ctx.out += ch;
    ctx.lastOutput = ch;

}
  


//==========================================================

 

function processOperator3(ctx /*, caret*/) {

    let caret = ctx.caret;
    const rawStart = ctx.index;
  
   const ctxBefore = ctx; 

    const info = readProducerPrefix(
        ctx.raw.slice(rawStart),
        ctx
    );


  //   console.log("info  =============================="  ,info  ) ;  

    if (!info) return null;

    const ctxAfter = ctx; 

   

   // const canonicalLength = info.operator.length + 1; // +1 for '['
      const canonicalLength = info.operatorToken.canonical.length + 1; // +1 for '['
    

    let updatedCaret = caret;

     
     if ( caret >= rawStart &&  caret <= rawStart + info.consumed + 1){
       
     

      if (ctx.action === "backspace") {
       
      } 
    if( ctx.action === "insert"   ){
  
        updatedCaret = rawStart + canonicalLength;

       }
    }

    return {
        operatorToken:info.operatorToken,
        operator: info.operator,// should be no more use
        consumed: info.consumed,
         traitBracket: info.traitBracket,


        rawStart,
        rawEnd: rawStart + info.consumed + 1,

        canonicalLength,
        updatedCaret ,
        actionTrigger:  info.actionTrigger

    };

}

 
 
function processValueSeparator(rawBlock) {

    // Match:
    // :[
    // : [
    // :    [
    // :abc[
    // :foo[
    const match = rawBlock.match(/:\s*[^\[]*\[/);

    if (!match) {

        return {

            changed: false,
            rawBlock,
            normalizedBlock: rawBlock

        };

    }

    const normalizedBlock =
        rawBlock.replace(match[0], ":[");

    return {

        changed: normalizedBlock !== rawBlock,

        rawBlock,

        normalizedBlock,

        start: match.index,
        consumed: match[0].length,
        replacement: ":["

    };

}


 function readProducerPrefix(text, ctx) {
                                      // 0 here is index local to block.. not abs in full raw
    const token = detectTokenStart(text,  0);

    switch (token.type) {

        //--------------------------------------------------
        // Not a producer
        //--------------------------------------------------

        case TOKEN.UNKNOWN:
        case TOKEN.EOF:

            return null;

        //--------------------------------------------------
        // "+"  "-"
        //--------------------------------------------------

        case TOKEN.PARTIAL_PRODUCER:

            return {

                status: "PARTIAL",

                operatorToken:token,
 
               // normalized: token.canonical,

                consumed: token.raw.length,

                stage: "PRODUCER",

                actionTrigger: {

                    type: "CREATE_PRODUCER",

                    anchorPosition: ctx.caret

                }

            };

        //--------------------------------------------------
        // +v  -v  ++v
        //--------------------------------------------------
       //let bracketIndex =-1;
        case TOKEN.COMPLETE_PRODUCER:
             {

                const operator = token.canonical;

                //--------------------------------------------------
                // Missing '['
                //--------------------------------------------------
 
                 let bracketIndex = findNext( text, token.canonical.length,"[");
             if (bracketIndex === -1) {
                // const bracketIndex = text.indexOf("[");

               // if (bracketIndex === -1) {

              
             //  const expectedBracket = token.canonical.length;
                  // if (text[expectedBracket] !== "[") {
                  const missingBracketObj ={
                                  status:  "COMPLETE",//"COMPLETE",
                                operatorToken: token,
                                consumed: token.canonical.length,
                                traitBracket:-1
                                     
                  };
                 // console.log( "missingBracketObj", missingBracketObj );

                 
                    return missingBracketObj; //{
                       /*
                        status:   "PARTIAL",
                         operatorToken:token,
                         consumed: token.canonical.length,
                         stage: "PRODUCER",
                         actionTrigger: "EXPECT_PRODUCER_END"
*/
                     /*
                            status:  "COMPLETE",//"COMPLETE",
                                operatorToken: token,
                                consumed: token.canonical.length,
                                hasOpeningBracket:
                                    text[token.canonical.length] === "["
                         */
 
                  //  };

                }

                //--------------------------------------------------
                // Complete producer
                //--------------------------------------------------
              // const bracketIndex = text.indexOf("[");
                bracketIndex = findNext( text, token.canonical.length,"[");
                return {

                    status: "COMPLETE",

                    operatorToken:token,

                   // operator: token.canonical,
                   // normalized: token.canonical + "[",

                    consumed:    bracketIndex,
                    traitBracket: bracketIndex

                };

            }

        default:

            return null;

    }

}
 


//==========================================================
 

 


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
                     val: ids.length, //    traitCounterLength_Data[traitKey][valueName],
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



function analyzeBlock_insideBlock(block, caret) {
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

        value.editing =
            caret >= value.start &&
            caret <= value.end;

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

 
function findEditingValue(rawValues, caret, blockValueStart) {

    let cursor = blockValueStart;

    for (let i = 0; i < rawValues.length; i++) {

        const raw = rawValues[i];

        const start = cursor;
        const end = start + raw.length;   // exclusive

        if (caret >= start && caret <= end) {
            const editingResult = {

                 index: i,
                 raw,
                 start,
                 end,
                 // User hasn't typed anything yet in this value
                 empty: raw.trim().length === 0,
                 // Caret is in the last empty value created by a trailing comma
                 editingIncomplete: i === rawValues.length - 1 && raw.trim().length === 0
   
   

            };
          //  console.log( " editingResult = "  , editingResult ); 
            return editingResult;

        }

        // Move past current value
        cursor = end;

        // Skip the separating comma
        if (i < rawValues.length - 1) {
            cursor++;
        }

    }

    return null;

}



function normalizeProducerPrefix(text) {

    // ++...
    if (text.startsWith("++")) {

        const i = text.indexOf("[");
        if (i === -1) return text;

        return "++v[" + text.slice(i + 1);
    }

    // +...
    if (text.startsWith("+")) {

        const i = text.indexOf("[");
        if (i === -1) return text;

        return "+v[" + text.slice(i + 1);
    }

    // -...
    if (text.startsWith("-")) {

        const i = text.indexOf("[");
        if (i === -1) return text;

        return "-v[" + text.slice(i + 1);
    }

    return text;
}

 

 function applyCommand(ctx, command) {

    if (!command) return;

    switch (command.type) {
 
       

       case "INSERT_OPERATOR": {

    const before = ctx.raw.slice(0, ctx.caret);
    const after  = ctx.raw.slice(ctx.caret);

    // Replace the "+" or "-" immediately before the caret
    const start = Math.max(0, ctx.caret - 1);

    const skeleton =
        command.operator +
        "[?:[]]";// "[?:[]]";

    ctx.raw =
        before.slice(0, -1) +
        skeleton +
        after;

    // Place caret on the placeholder trait
    //
    // +v[?:[]]
    //     ^
    //
    ctx.caret =
        start +
        command.operator.length +
        1;

       ctx.actionTrigger = {
                     type: "SELECT_TRAIT",
                     anchorPosition: ctx.caret
        }  

    break;
       }
 

        case "REPLACE_TRAIT":{

                const before = ctx.raw.slice(0, command.traitStart);
                const after = ctx.raw.slice(command.traitEnd);

                ctx.raw =
                    before +
                    command.traitSelected +
                    after;
                 // Put caret immediately after inserted trait
                  ctx.caret = command.traitStart + command.traitSelected.length;
               

            ctx.actionTrigger = {
                     type: "REPLACE_TRAIT_SUCCESS",
                     anchorPosition: ctx.caret
             }  
        break;}

        //REPLACE_TRAITVALUE
       case "REPLACE_TRAITVALUE":{ 

                const before = ctx.raw.slice(0, command.start);
                const after = ctx.raw.slice(command.end);

                ctx.raw =
                    before +
                    command.traitValueSelected +
                    after;
                 // Put caret immediately after inserted trait
                  ctx.caret = command.start + command.traitValueSelected.length;
               

            ctx.actionTrigger = {
                    type: "REPLACE_TRAITVALUE_SUCCESS",
                     anchorPosition: ctx.caret
             }  
         break;}
      
        

    }

}

function finalizeProducerOnlyBlock(ctx, producer, startIndex, actionTrigger, tokens, addToken, options) {

    write(ctx,  producer.operatorToken.raw);

    // ctx update /advance
    ctx.index = startIndex + producer.operatorToken.localEnd;
    if ( actionTrigger) { ctx.actionTrigger = actionTrigger;  }

   // avoid mutating the lexer object directly and instead create a parser copy:
    const operatorToken = {
      ...producer.operatorToken,
        start: startIndex ,
        end:   startIndex + producer.operatorToken.localEnd
    };

      addToken(operatorToken);
 
    if (ctx.index <= startIndex) {

    throw new Error(
        `Parser stalled at index ${ctx.index}`
    );

}
    
  return {
         tokens,
         operatorToken  ,
         raw:           operatorToken.raw,
         start:         operatorToken.start,// abs
         end:           operatorToken.end,// abs
         status: "PARTIAL",
 
         normalized:    operatorToken.raw,
         trait: "",
         values: [],
         editingValue: null,
         
    };


}



function insertRawTokens(block) {

    const newTokens = [];

    let lastEnd = block.start;

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

          //  localStart: lastEnd - block.start,
          //  localEnd: block.end - block.start,

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

function findNext(text, start, expectedChar) {

    let i = start;

    while (i < text.length) {

        const c = text[i];

        // Ignore formatting whitespace
        if (c === " ") {
            i++;
            continue;
        }

        // Found expected token
        if (c === expectedChar) {
            return i;
        }

        // Any other visible character = failure
        return -1;//false;
    }

    return -1;//false;
}


module.exports ={ 
    
    canonicalizeQuery,

decomposeBlockInside,


getIdsByTraitValueContains//,
  

}