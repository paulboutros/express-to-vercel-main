 const { detectTokenStart,  
      findNext,
    isProducerToken, TOKEN } = require("./lexer");

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
        "[?:[]]"; 

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

function isCompleteProducerAt(raw, index, ctx) {

    const info = readProducerPrefix(
        raw.slice(index),
        ctx
    );

    return info?.operatorToken?.type === TOKEN.COMPLETE_PRODUCER;
}





  function decomposeBlockInside(inside, blockStart) {

    const splitIndex = inside.indexOf(":[");

    if (splitIndex === -1) return null;

  console.log( "======== inside===================|", inside,"|");
//======================================================
const traitRaw = inside.slice(0, splitIndex);


const leading =
    traitRaw.length - traitRaw.trimStart().length;

 //console.log( "======== leading===================|", leading ,"|");


  const trailing =
    traitRaw.length - traitRaw.trimEnd().length;
 const trait =
    traitRaw.trim();
 const traitLocalStart = leading;
 const traitLocalEnd =
    traitRaw.length - trailing;
 
//============================================

  //  const trait = inside.slice(0, splitIndex).trim();

    const valuesPart = inside
        .slice(splitIndex + 2)
       // .replace(/\]$/, "");
       .replace(/\]\s*$/, "");

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
 function write(ctx, ch){

    ctx.out += ch;
    ctx.lastOutput = ch;

}


function processUnknown_xxxxx(ctx) {

      const start = ctx.index;
    
    let token;
    while (ctx.index < ctx.raw.length) {

          token =  detectTokenStart (ctx.raw, ctx.index);
        
        // if (token.type === TOKEN.COMPLETE_PRODUCER) {
         //  break;
       // }

         if(isProducerToken(token) ){ 
             break;
          }
 
        ctx.index++;
      }
      


 
 
  if (ctx.index <= start) {

          console.log("error info :" , {  
                     tokenType:  token.type  ,
                     token, 
                      start,
                      ctx_index : ctx.index 

                     })

                 throw new Error("processUnknown returned without advancing ctx.index" ); 
                     
                
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

/*
function processUnknown(ctx) {

    const start = ctx.index;

    let token;

    while (ctx.index < ctx.raw.length) {

        token = detectTokenStart(ctx.raw, ctx.index);

        if (isProducerToken(token)) {
            break;
        }

        ctx.index++;
    }

    // Nothing consumed: force recovery
    if (ctx.index <= start) {

        const skip = Math.min(3, ctx.raw.length - ctx.index);

        console.log("UNKNOWN recovery:", {
            start,
            index: ctx.index,
            token,
            skip,
            raw: ctx.raw.slice(ctx.index, ctx.index + skip)
        });

        ctx.index += skip;
    }

    const raw = ctx.raw.slice(start, ctx.index);

    write(ctx, raw);

    return {
        tokens: [{
            id: 0,
            type: "RAW",
            raw
        }],
        type: "UNKNOWN",
        valid: false,
        raw,
        start,
        end: ctx.index
    };
}
*/
/*
 * UNKNOWN recovery
 *
 * processUnknown() is called only after the parser has failed to recognize
 * a valid block. Normally it consumes raw text until the next producer
 * token (+, ++, -).
 *
 * A tricky malformed-input case occurs when the failed block begins exactly
 * at a producer character. In that situation the scanner is already sitting
 * on a producer, so it cannot consume even one UNKNOWN character and would
 * otherwise return without advancing ctx.index.
 *
 * This is intentional parser recovery:
 * we consume the producer marker itself (or the complete ++ marker) so the
 * parser can make forward progress and continue analyzing the malformed input.
 *
 * The recovery is deliberately limited to producer markers. It does not try
 * to understand or repair the malformed expression; its only responsibility
 * is to prevent the parser from getting stuck.
 */
function recoverUnknown(ctx, start) {

    const raw = ctx.raw;

    if (raw[start] === "+") {

        // Consume ++ as one producer marker when present.
        if (raw[start + 1] === "+") {
            ctx.index = start + 2;
        } else {
            ctx.index = start + 1;
        }

        return;
    }

    if (raw[start] === "-") {
        ctx.index = start + 1;
        return;
    }

    // Defensive fallback. This should never normally happen because
    // recoverUnknown() is called only after detecting a producer.
    ctx.index = Math.min(start + 1, raw.length);
}


/*
 * Scan ordinary UNKNOWN text.
 *
 * The caller has already determined that the current position does not
 * belong to a recognized block. This function therefore does not decide
 * whether the text is "unknown"; it only finds where the UNKNOWN region ends.
 */
function scanUnknown(ctx) {

    while (ctx.index < ctx.raw.length) {

        const token = detectTokenStart(ctx.raw, ctx.index);

        if (isProducerToken(token)) {
            break;
        }

        ctx.index++;
    }
}

//test with: +v[HEAD[   W olf]  -v[HEAD:[ho  ]]   +  +v[FACEGEAR:[ skull]]
/*
 * Consume text that was not recognized as a valid block.
 *
 * Normally scanUnknown() advances ctx.index until the next producer.
 * If it cannot advance, we have the special malformed-input case where
 * the UNKNOWN region begins directly on a producer marker.
 *
 * Rather than getting stuck at the same index, recoverUnknown() deliberately
 * consumes that producer marker and lets the main parser continue.
 */
function processUnknown(ctx) {

    const start = ctx.index;

    scanUnknown(ctx);

    // Normal case: UNKNOWN scanner consumed something.
    if (ctx.index > start) {

        const raw = ctx.raw.slice(start, ctx.index);

        write(ctx, raw);

        return {
            tokens: [{
                id: 0,
                type: "RAW",
                raw
            }],
            type: "UNKNOWN",
            valid: false,
            raw,
            start,
            end: ctx.index
        };
    }


    // Special malformed-input recovery:
    // the parser rejected the block, but the very first character is
    // itself a producer (+, ++, or -), leaving UNKNOWN with nothing to consume.
    const token = detectTokenStart(ctx.raw, ctx.index);

    console.log("UNKNOWN RECOVERY — forced advancement", {
        start,
        index: ctx.index,
        token,
        char: ctx.raw[ctx.index]
    });

    recoverUnknown(ctx, start);

    const raw = ctx.raw.slice(start, ctx.index);

    write(ctx, raw);

    return {
        tokens: [{
            id: 0,
            type: "RAW",
            raw
        }],
        type: "UNKNOWN",
        valid: false,
        raw,
        start,
        end: ctx.index
    };
}







//=============================================================================
function processOperator3(ctx /*, caret*/) {

    let caret = ctx.caret;
    const rawStart = ctx.index;
  
   

    const info = readProducerPrefix(
        ctx.raw.slice(rawStart),
        ctx
    );
 
  //   console.log("info  =============================="  ,info  ) ;  

    if (!info) return null;
  
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
               
                  const missingBracketObj ={
                                  status:  "COMPLETE",//"COMPLETE",
                                operatorToken: token,
                                consumed: token.canonical.length,
                                traitBracket:-1
                                     
                  };
                 // console.log( "missingBracketObj", missingBracketObj );

                 
                    return missingBracketObj; //{
                        

                }

                //--------------------------------------------------
                // Complete producer
                //--------------------------------------------------
              // const bracketIndex = text.indexOf("[");
                bracketIndex = findNext( text, token.canonical.length,"[");
                return {

                    status: "COMPLETE",

                    operatorToken:token,

                  
                    consumed:    bracketIndex,
                    traitBracket: bracketIndex

                };

            }

        default:

            return null;

    }

}
 
 

module.exports ={ 
    processUnknown,
    write,
decomposeBlockInside,
findEditingValue,
 

 finalizeProducerOnlyBlock,
 applyCommand,
  processValueSeparator ,
   readProducerPrefix,
   processOperator3,
   isCompleteProducerAt
}