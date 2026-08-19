// lexer.js
 
//==========================================================
// TOKENS
//==========================================================

const TOKEN = {

    //--------------------------------------------------
    // Lexer
    //--------------------------------------------------

    COMPLETE_PRODUCER: "COMPLETE_PRODUCER",
    PARTIAL_PRODUCER:  "PARTIAL_PRODUCER",

    //--------------------------------------------------
    // Grammar
    //--------------------------------------------------

    TRAIT:             "TRAIT",
    VALUE:             "VALUE",
    SEPARATOR:         "SEPARATOR",

    //--------------------------------------------------
    // Future
    //--------------------------------------------------

    MODIFIER:          "MODIFIER",
    OPEN_BRACKET:      "OPEN_BRACKET",
    CLOSE_BRACKET:     "CLOSE_BRACKET",

    //--------------------------------------------------
    // Generic
    //--------------------------------------------------
    RAW:               "RAW",
    SPACE:             "SPACE",
    UNKNOWN:           "UNKNOWN",
    EOF:               "EOF"

};


//==========================================================
// TOKEN FACTORY
//==========================================================

function createToken({

    id = 0,

    type,

    raw = "",
    normalized = "",

    start = 0,
    end = 0,

    localStart = null,
    localEnd = null,

    valid = true,

    meta = {}

}){

    return {

        id,

        type,

        raw,
        normalized,

        start,
        end,

     
        length: end - start,

        localStart,
        localEnd,

        valid,

        meta

    };

}


//==========================================================
// HELPERS
//==========================================================

function createProducerToken(operatorToken, id = 0){

    return createToken({

        id,

        type: operatorToken.type,

        raw: operatorToken.raw,

        normalized: operatorToken.normalized ?? operatorToken.canonical,

        start: operatorToken.start,
        end: operatorToken.end,

        localStart: operatorToken.localStart ?? 0,
        localEnd: operatorToken.localEnd ?? operatorToken.length,

        valid: true,

        meta: {

            operator: operatorToken.operator,
            modifier: operatorToken.modifier,
            canonical: operatorToken.canonical

        }

    });

}


function createTraitToken({
    
    id = 0,
     blockRaw,
     startBlock,
     valid = true,


        localStart,  
        localEnd  ,

       start,
       end,

       raw
       
 
}){

     //--------------------------------------------------
    // Local positions
    //--------------------------------------------------

   // const localStart = blockRaw.indexOf("[") + 1;
   // const localEnd   = blockRaw.indexOf(":[");
   // startBlock = blockRaw.indexOf("[") + 1;
    //--------------------------------------------------
    // Text
    //--------------------------------------------------
  

   // const localStart = blockRaw.indexOf("[") + 1;

    console.log( "createToken  localStart  ============  " , localStart   )
          


    //const raw =  blockRaw.slice(startBlock + localStart, localEnd);
 
    const normalized = raw.trim();
 
    //--------------------------------------------------
    // Absolute positions
    //--------------------------------------------------

  //  const start = startBlock + localStart;
  //  const end   = startBlock + localEnd;

    //--------------------------------------------------
    // Token
    //--------------------------------------------------
 
    return createToken({

        id,

        type: TOKEN.TRAIT,
        raw,
        normalized,
        start  ,
        end ,
        localStart,
        localEnd,

        valid

    });

}


function createValueToken({

     id = 0,

    raw,

    normalized,

    start,
    end,
    localStart,
    localEnd,
    valid = true,

    editing = false

}){
    /* set abs start/end with local so length can be set right away
     when the parser promotes the token to absolute positions, it updates only start & end
    */

    return createToken({

        id,
        type: TOKEN.VALUE,
        raw,
        normalized,
        start ,
        end ,
        localStart,
        localEnd,

        valid,

        meta:{

            editing

        }

    });

}


function createSeparatorToken({

    id = 0,

    raw = ",",

    start,
    end

}){

    return createToken({

        id,

        type: TOKEN.SEPARATOR,

        raw,

        normalized:",",

        start,
        end

    });

}


function createUnknownToken({

    id = 0,

    raw,

    start,
    end

}){

    return createToken({

        id,

        type:TOKEN.UNKNOWN,

        raw,

        normalized:raw,

        start,
        end,

        valid:false

    });

}


//==========================================================
// QUERY HELPERS
//==========================================================

function getFirstToken(tokens, type){

    return tokens.find(

        token => token.type === type

    );

}


function getTokens(tokens, type){

    return tokens.filter(

        token => token.type === type

    );

}


function hasToken(tokens, type){

    return tokens.some(

        token => token.type === type

    );

}

 



//=========================================

  function detectTokenStart(raw, index = 0) {
   let canonical="";
    //--------------------------------------------------
    // End of input
    //--------------------------------------------------

    if (index >= raw.length) {

        return {

            type: TOKEN.EOF,

            index,

            operator: null,
            modifier: null,
            canonical: null

        };

    }

    const ch = raw[index];
    const next = raw[index + 1] ?? "";

    //--------------------------------------------------
    // ++v
    //--------------------------------------------------

    if (ch === "+" && next === "+") {
         canonical = "++v";
        return {

            type: TOKEN.COMPLETE_PRODUCER,

            index,

            operator: "++",
            modifier: "v",
            canonical ,

            raw: "++v",

            
             normalized: canonical + "[",
             localStart: index,
             localEnd: index + canonical.length,
              start:0,
              end:0,

             length: canonical.length

        };

    }

    //--------------------------------------------------
    // +v
    //--------------------------------------------------

    if (ch === "+" && (next === "v" || next === "V")) {
        canonical = "+v";
        return {

            type: TOKEN.COMPLETE_PRODUCER,

            index,

            operator: "+",
            modifier: "v",
            canonical: "+v",

            raw: raw.slice(index, index + 2),

            localStart:index,
            localEnd:index + canonical.length,
            start:0,
            end:0,

            
            length: canonical.length,

        };

    }

    //--------------------------------------------------
    // -v
    //--------------------------------------------------

    if (ch === "-" && (next === "v" || next === "V")) {
         canonical ="-v";
        return {

            type: TOKEN.COMPLETE_PRODUCER,

            index,

            operator: "-",
            modifier: "v",
            canonical: "-v",

            raw: raw.slice(index, index + 2),

            localStart:index,
            localEnd:index + canonical.length,
             start:0,
            end:0,

            length:  canonical.length,

        };

    }

    //--------------------------------------------------
        // Partial producer
        //--------------------------------------------------

        if (ch === "+" || ch === "-") {
            canonical = ch;
            return {

                 //read only
                type: TOKEN.PARTIAL_PRODUCER,
                index,
                operator: ch,
                modifier: null,
                canonical: ch,
                raw: ch,
                normalized:ch, 
                localStart: index,//0,s
                localEnd:   index + canonical.length,
                length: canonical.length,
                
                // read/write
                 start:0,
                 end:0,
                

            };

        }

 
    //--------------------------------------------------
    // Default
    //--------------------------------------------------

    return {

        type: TOKEN.UNKNOWN,

        index,

        operator: null,
        modifier: null,
        canonical: null,

        raw: ch

    };

}

 function isProducerToken(token){

  console.log( "======== ===============isProducerToken  " ,          token );


    return token.type === TOKEN.COMPLETE_PRODUCER ||
            token.type === TOKEN.PARTIAL_PRODUCER;

}

  function isProducerBoundary(token){

     return token.type === TOKEN.PARTIAL_PRODUCER ||
            token.type === TOKEN.COMPLETE_PRODUCER;

}

module.exports={  
    // TOKEN,
     
     detectTokenStart ,isProducerToken, isProducerBoundary,


      TOKEN,

    createToken,

    createProducerToken,

    createTraitToken,

    createValueToken,

    createSeparatorToken,

    createUnknownToken,

    getFirstToken,

    getTokens,

    hasToken

}