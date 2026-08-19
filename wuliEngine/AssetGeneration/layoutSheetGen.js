const fs = require("fs");
//const { spawn } = require("child_process");
const path = require("path");
const {NFTBASEPROJECT, traitCounterPATH,// buildImagePath,  buildImagePathFromNFTID,
   getReviewSheetData, 
   getRarityDoc,
   saveReviewSheetData} = require("../PATH_REGISTRY/PATH.js");
 
  
const { shared_state } = require("../STATE/engineState.js");
const { calculateSheetLayout } = require("./calculateSheetLayout");
const { pad /*, seededShuffle, buildTraitSeed */ } = require("../UTILITY/generalUtil2");
 
const { renderLayout } = require("../AssetGeneration/renderGridLayout.js"); 
const { get_UI_DEFAULT_CONFIG , get_rarityTraitCount } = require("../storage/writeServices");
 
 
//const PROJECT_ROOT = NFTBASEPROJECT;
 
  const DEFAULT_CONFIG   =  get_UI_DEFAULT_CONFIG();  //    get_UI_DEFAULT_CONFIG(); 
//======================================
  const traitCounter = get_rarityTraitCount();//    JSON.parse(fs.readFileSync(traitCounterPATH));

  let reviewSheetData;
  let rarityDocData;

  const allTraitMap = traitCounter;

  let render_fullTrait;
/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */

// Escape text safely for FFmpeg drawtext
function escapeDrawText(text) {
    return text
        .replace(/\\/g, "\\\\")   // escape backslashes first
        .replace(/:/g, "\\:")     // escape colon
        .replace(/\|/g, "\\|")    // escape pipe
        .replace(/'/g, "\\'");    // escape single quote
}

// Make safe filename  replace " " by _
function safeFileName(str) {
    return str
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]/g, "");
}

function sanitizeText(str) {
    return str
        .replace(/\r?\n/g, " ")  // remove line breaks
        .trim();
}
/* ----------------------------- */
/* Main Generator                */
/* ----------------------------- */
 
async function createLayoutObject(
    nftIDs,
    sheetTitle_arg,// traitType,    // "no title";// `${traitType}:${traitValue} ${sheetInfo}`; 
    traitValue,
    outputFolder,
    options = {}
) {
    
 const  {batchNumber, activeFilterMap_IDS_length, 
         activeTraits_stringArray,
         queryMode, filterModeABS , overrideConfig, cardToDisplay,assetRoot
  } =  options;
  
      
     const nftListLength  =  nftIDs.length;
 
     const layoutData     =  calculateSheetLayout( 
             nftListLength, activeFilterMap_IDS_length ,
              {

                maxPerSheet : 6,//8,
                minLastSheet : 4,
                columns : 4
             } 
            
            
            );
      

     //  console.log(  "======layoutData======= \n  "   ,  layoutData   );
       //totalSheetCount is all sheet that can be generate from current ids full search list result
     // sheetCount is sheet in batch. batch = ids to show for ex 18. divided by items per sheet
      for (let index = 0; index <  layoutData.sheetCount    ; index++) {
         let fileNumber =  pad(index , 3 ) + ".png";
         let fileName = "random_" +fileNumber;//`${safeTraitType}_${safeTraitValue}_${fileNumber}`; 


              let pagination =  (batchNumber+1)+"/"+layoutData.totalSheetCount+" ("+ activeFilterMap_IDS_length  + ")";
         
           //  let sheetInfo =  (index+1)+"/"+layoutData.sheetCount+" ("+ activeFilterMap_IDS_length  + ")";
          // let sheetTitle = sheetTitle_arg;// "no title";// `${traitType}:${traitValue} ${sheetInfo}`; 
            let sheetTitle = `${sheetTitle_arg}`; // ${sheetInfo}
           

              reviewSheetData[ fileName ] = layoutData; 


                let includedIDS =[];

                let startIndex = layoutData.sheets[index].from;
                let endIndex = layoutData.sheets[index].to;
                for (let index = startIndex;  index < endIndex+1; index++) {
                  const element = nftIDs[index];
                  includedIDS.push( element );
                  
                }
               
               let argObj={
                 nftIDS : includedIDS,
                 outputFile:null,//outputFile,
                 fileName:fileName ,
                 sheetTitle:sheetTitle ,
                 pagination:pagination,
                 queryMode:queryMode,
                 filterModeABS:filterModeABS,

                 activeTraits_stringArray:activeTraits_stringArray,
                 
                 rows :layoutData.sheets[index].rows,

                 cardToDisplay,
                 assetRoot
                 
                };
             

               var propsObj = { 
                        
                        ...( DEFAULT_CONFIG.preset.layoutGrid_4X2 || {}),
                          ...overrideConfig //DEFAULT_CONFIG.nftThumb500,// layoutGrid,
              }
              await renderLayout(propsObj, argObj , reviewSheetData   ); 
              // at this point, list of object url are created and pushed in shared_state.currentPreviewURL[]
             

      }
    
      
     /*
   saveReviewSheetData (reviewSheetData);
*/

   //   console.log(  "layoutData   "   , layoutData   );

      

    /* ----------------------------- */
    /* Build Filter Chain            */
    /* ----------------------------- */
/*
   const cleanTraitType  = sanitizeText(traitType);
   const cleanTraitValue = sanitizeText(traitValue);
*/

    

      

     
}

 

async function generateAllTraitSheet(   argObj ,  fullTrait = false  ) {

 //let sheetTitle ;//=`${traitType}:${traitValue} ${sheetInfo}`;
  reviewSheetData = {};  // getReviewSheetData();
  //reviewSheetData = getReviewSheetData();
  rarityDocData   = getRarityDoc();


  let {activeTraitUI_toArray,
     activeTraits_stringArray,
     activeFilterMap_IDS, 
     activeFilterMap_suffleIDS,

     filterModeABS,
     queryMode,
    sheetTitle,
    batchNumber,
     raw  ,
     cardToDisplay,
     assetRoot,
     overrideConfig
    
    


   } =  argObj ;//.renderTraitObject;
 

 const renderTraitObject = activeTraitUI_toArray;
let videoFilter = renderTraitObject;//  shared_state.videoFilter;

 activeFilterMap_IDS  = activeFilterMap_suffleIDS;

   

  switch (queryMode) {
      case "DSL":
         sheetTitle = raw;//  ( (queryMode +" "+ raw) );
      break;
       case "NFT_SEARCH":
         sheetTitle = "";//  ( (queryMode +" "+ raw) );
       break;
 
    default:
      //sheetTitle  =  ( (queryMode +" "+ sheetTitle) );  
      break;
   }
  
   // const seedString = sheetTitle;// buildTraitSeed(renderTraitObject);
  //  const seed = JSON.stringify(seedString); // or query string / sheet title / trait set
    const randomizedIds = activeFilterMap_IDS; 
 
 

  const batchMaxSize = 6;//18;
   let activeFilterMap_IDS_batch = [];

 //  console.log(  " randomizedIds.length:  " , randomizedIds.length  );
   if ( randomizedIds.length > batchMaxSize  ){ 
          const startIndex = 0             + (batchMaxSize * Number( batchNumber) );
          const endIndex   =  batchMaxSize + (batchMaxSize * Number( batchNumber) );

          /*
         console.log(  " ====startIndex:  " , startIndex ,
               "\n   endIndex" , endIndex ,  "\n  batchNumber :", batchNumber  );
             */ 
            
    // for (let index = 0; index <  batchMaxSize; index++) {
       for (let index = startIndex; index <    endIndex ; index++) {
            const element = randomizedIds[index];
            if ( index > randomizedIds.length-1 )continue;
              activeFilterMap_IDS_batch.push(element );
     }

          
    }
    // if trait only have 5  or less than batchMaxSize ( rare items)
    if ( randomizedIds.length <= batchMaxSize  ){ 
         activeFilterMap_IDS_batch = randomizedIds;
    }

  //========================================
  

 const ids = activeFilterMap_IDS_batch ; 
 
  render_fullTrait = fullTrait;
 
  const maxTest =2;
  let incr =0;

   
 

 let layoutObject =
         await createLayoutObject(  
             ids,// randomizedIds,// ids,
            sheetTitle,
            null,
            null ,
            { 
                batchNumber : Number(batchNumber),
                activeTraits_stringArray,//: activeTraits_stringArray,
                activeFilterMap_IDS_length:activeFilterMap_IDS.length ,
                queryMode,//:queryMode ,
                filterModeABS,// : filterModeABS,
                overrideConfig,//: overrideConfig,
                cardToDisplay,
                assetRoot

            }    
        );
        return layoutObject;

 

}
  
  

function buildVideoConfirmMessage(fullTrait, videoFilter) {




  let message = "🎬 About to Render Review Video\n\n";

  message += "Full Trait Mode: " + fullTrait + "\n\n";


  
if ( fullTrait ){ 


  for (const traitType in videoFilter) {
    const traitTypeValueCount = Object.keys( allTraitMap[traitType] ).length;

      message += "Trait Type: " + traitType ;
      message += " count: " + traitTypeValueCount  + "\n";
 
    message += "\n";
  }
}else{ 
   for (const traitType in videoFilter) {
       message += "Trait Type: " + traitType + "\n";

       for (let t = 0; t <  videoFilter[traitType].length; t++) {

 
             var traitval = videoFilter[traitType] [t] ;

             //console.log( "traitType[t] "   ,  traitval  );

             const traitValueLength =  allTraitMap[    traitType][    traitval   ].length;
             message += traitval + " count: " +  traitValueLength   + "\n";
       }

       
      //  message += " count: " + traitTypeValueCount  + "\n";
 
    message += "\n";
  }

}


  return message;
}


/*

node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/TRAITCOUNT/traitReviewGenerator.js').readVideo()"

*/
 


module.exports = {  

 
  generateAllTraitSheet

 }
    
/*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/TRAITCOUNT/traitReviewGenerator.js').call_ReviewVideo()"
*/
 