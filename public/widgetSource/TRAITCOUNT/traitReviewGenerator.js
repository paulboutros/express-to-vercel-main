const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const {NFTBASEPROJECT,  buildImagePath, buildImagePathFromNFTID,
   getReviewSheetData, 
   getRarityDoc
   } = require("../BOOTSTRAP/PATH");
   
 
const { getAllMP4Files } = require("../UTILITY/generalUtils");
const { openWithProgram, openFolder } = require("../services/fileAccessibility");
const scriptPath = require("../BOOTSTRAP/scriptPath");
const { shared_state } = scriptPath.sharedState;
 
const { pad } = require("../UTILITY/generalUtil2");
 
const { get_UI_DEFAULT_CONFIG,   filemanager } = require("../services/writeServices");


 

const PROJECT_ROOT = NFTBASEPROJECT;
 
  const DEFAULT_CONFIG   =  get_UI_DEFAULT_CONFIG();  //    get_UI_DEFAULT_CONFIG(); 
//======================================
  const traitCounter =  filemanager.traitCounter.load();// get_rarityTraitCount();  

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

async function generateTraitReviewVideo(
    nftIDs,
    traitType,
    traitValue,
    outputFolder,
    options = {}
) {
    const {
        fpsDuration = 0.04,     // 25fps feel
        scaleSize = 512,        // lower resolution for speed
        crf = 32,               // compression (higher = smaller file)
        preset = "ultrafast"    // speed boost
    } = options;

    fs.mkdirSync(outputFolder, { recursive: true });

    const listFile = path.join(outputFolder, "ffmpeg_list.txt"); 

    /* ----------------------------- */
    /* Build concat list             */
    /* ----------------------------- */

    let content = "";

    nftIDs.forEach(id => {
        const imgPath = buildImagePathFromNFTID(id).replace(/\\/g, "/");
        content += `file '${imgPath}'\n`;
        
        content += `duration ${fpsDuration}\n`;
    });

    fs.writeFileSync(listFile, content);

    /* ----------------------------- */
    /* Build Output Path             */
    /* ----------------------------- */

    const safeTraitType = safeFileName(traitType);
    const safeTraitValue = safeFileName(traitValue);

    const outputFile = path.join(
        outputFolder,
        `${safeTraitType}_${safeTraitValue}.mp4`
    );

    const ffmpegPath = path.join(
        NFTBASEPROJECT,
        "TOOLS/ffmpeg/bin/ffmpeg.exe"
    );

    /* ----------------------------- */
    /* Build Filter Chain            */
    /* ----------------------------- */

   const cleanTraitType  = sanitizeText(traitType);
   const cleanTraitValue = sanitizeText(traitValue);


    const rawText = `ID %{frame_num} | ${cleanTraitType}: ${cleanTraitValue}`;
    const safeText = escapeDrawText(rawText);
 //render_fullTrait

    
    const drawTextFilter =
  `drawtext=` +
  `fontfile='C\\:/Windows/Fonts/arial.ttf':` +   // wrapped in quotes
  `text='${safeText}':` +
  `x=(w-text_w)/2:` +
  `y=h-160:` +
  `fontsize=112:` +
  `fontcolor=white:` +
  `box=1:` +
  `boxcolor=black@0.6`;



    console.log(" =======================   FILTER:\n", drawTextFilter);


    const vfChain = `${drawTextFilter},scale=${scaleSize}:${scaleSize}`;

    /* ----------------------------- */
    /* FFmpeg Args                   */
    /* ----------------------------- */

    const args = [
        "-f", "concat",
        "-safe", "0",
        "-i", listFile,
        "-vf", vfChain,
        "-pix_fmt", "yuv420p",
        "-preset", preset,
        "-crf", String(crf),
        "-y",
        outputFile
    ];

    /* ----------------------------- */
    /* Execute FFmpeg                */
    /* ----------------------------- */

    return new Promise((resolve, reject) => {
        const ffmpeg = spawn(ffmpegPath, args);

        ffmpeg.stdout.on("data", data => console.log(data.toString()));
        ffmpeg.stderr.on("data", data => console.log(data.toString()));

        ffmpeg.on("close", code => {
            if (code === 0) {
                console.log(`✅ Generated: ${outputFile}`);
 
                 resolve(outputFile);

        
                  if ( !render_fullTrait  ){ 
                      readVideo( outputFile );
                  }
                      

            } else {
                reject(new Error(`FFmpeg exited with code ${code}`));
            }
        });
    });
}

/*
async function generateTraitReviewSHEET(
    nftIDs,
    traitType,
    traitValue,
    outputFolder,
    options = {}
) {
    
      

    const safeTraitType = safeFileName(traitType);
    const safeTraitValue = safeFileName(traitValue);

    
     const nftListLength =  nftIDs.length;
    const layoutData = calculateSheetLayout( nftListLength);
      

      for (let index = 0; index <  layoutData.sheetCount    ; index++) {
        let fileNumber =  pad(index , 3 ) + ".png";
           let fileName = `${safeTraitType}_${safeTraitValue}_${fileNumber}`; 


           let sheetInfo =  (index+1)+"/"+layoutData.sheetCount+" ("+ nftListLength + ")";
           let sheetTitle = `${traitType}:${traitValue} ${sheetInfo}`; 
         
             const outputFile = path.join( outputFolder, fileName);
              console.log(  "outputFile  "   , outputFile   );

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
                 outputFile:outputFile,
                 fileName:fileName ,
                 sheetTitle:sheetTitle ,
                 rows :layoutData.sheets[index].rows
                };
             

               var propsObj = { 
                        ...DEFAULT_CONFIG.layoutGrid,
                        ...( DEFAULT_CONFIG.preset.layoutGrid_4X2 || {})
              }
              await renderLayout(propsObj, argObj ); 



      }
    
      
    
   saveReviewSheetData (reviewSheetData);

     console.log(  "layoutData   "   , layoutData   );

      
 

    

      

     
}
*/









//=============================


function removeUnusedTraitVideo ( videoFilter){
   
//  render_fullTrait = fullTrait;
  console.log( "generateAllTraitVideos" ,    videoFilter);
 

 // const maxTest =2;
  //let incr =0;
 
 // let frameincr = 0;
 // let  maxFrameTest = 5;
  
 //  let totalVideos = 0;
 
    for (const [traitType, values] of Object.entries(allTraitMap)) {
    // if ( !includeTrait.includes(traitType)) continue; // skip internal traits
       // frameincr=0;

        if (!videoFilter[traitType]) continue;
 
          const outputFolder     = path.join(PROJECT_ROOT, "REVIEW", traitType);      
          const traitTypeVideos  = getAllMP4Files( outputFolder ,{p0:traitType,p1:".mp4", traitValues:values }  );

          console.log("traitType: " , traitType , "\n ", traitTypeVideos );

      //  fs.unlinkSync(donFile);

           //for (const [traitValue, nftIDs] of Object.entries(values)) {
           //}
    }



}

/*
async function generateAllTraitSheet(   fullTrait = false  ) {


  reviewSheetData = getReviewSheetData();
  rarityDocData   = getRarityDoc();

 let  videoFilter =  shared_state.videoFilter;


//=======================================================================
//=======================================================================

    const preview = document.getElementById("sheetPreview");
     if (shared_state.sheetPreviewwMode ){ 
         preview.innerHTML = "";
     }
 //=======================================================================
 //======================================================================= 



  render_fullTrait = fullTrait;
  console.log( "generateAllTraitVideos" ,    videoFilter);

 const confirmSave = confirm(
  buildVideoConfirmMessage(fullTrait, videoFilter)
);
if (!confirmSave) return;
 

  const maxTest =2;
  let incr =0;


 let frameincr = 0;
 let  maxFrameTest = 5;


 
   let totalVideos = 0;
 

       for (const [traitType, values] of Object.entries(allTraitMap)) {
    
        frameincr=0;

       if (!videoFilter[traitType]) continue;
 
        const outputFolder = path.join(PROJECT_ROOT, "SHEET_REVIEW", traitType);
        await fs.promises.mkdir(outputFolder, { recursive: true });
 
        if (fullTrait){
            // remove all existing cards first in case some trait where remove

           
         }
            //console.log(  "NFTpathPASS  = " , outputFolder );
         openFolder( outputFolder);
 
 

        for (const [traitValue, nftIDs] of Object.entries(values)) {

            if ( !fullTrait ){
                if (!videoFilter[traitType].includes(traitValue)) continue;   
        }
 
          
        incr++;
     
             
         const ids = nftIDs;

        const folder = path.join(PROJECT_ROOT, "SHEET_REVIEW", traitType);
       
           await generateTraitReviewSHEET( //   generateTraitReviewVideo(
            ids,
            traitType,
            traitValue,
            folder
        );
 


        }
    }



}*/
// Example usage:
async function generateAllTraitVideos(  videoFilter , fullTrait = false  ) {

   videoFilter =  shared_state.videoFilter;


  render_fullTrait = fullTrait;
  console.log( "generateAllTraitVideos" ,    videoFilter);

 const confirmSave = confirm(
  buildVideoConfirmMessage(fullTrait, videoFilter)
);
if (!confirmSave) return;

 // return;
 


  const maxTest =2;
  let incr =0;


 let frameincr = 0;
 let  maxFrameTest = 5;


 
   let totalVideos = 0;

 
    


    for (const [traitType, values] of Object.entries(allTraitMap)) {
    // if ( !includeTrait.includes(traitType)) continue; // skip internal traits
        frameincr=0;

       if (!videoFilter[traitType]) continue;

       
      
       
        const outputFolder = path.join(PROJECT_ROOT, "REVIEW", traitType);

        if (fullTrait){
                 // remove all existing cards first in case some trait where remove
           fs.readdirSync(outputFolder).forEach(file => {
             if (file.endsWith('.mp4')) {
                   fs.unlinkSync(path.join(outputFolder, file));
             }
           });
         }
       
           //console.log(  "NFTpathPASS  = " , outputFolder );
    
           openFolder( outputFolder);
//totalVideos++;
//if (totalVideos >0) return;



 

        for (const [traitValue, nftIDs] of Object.entries(values)) {

            if ( !fullTrait ){
                if (!videoFilter[traitType].includes(traitValue)) continue;   
            }
        

  


          //  if ( !includeTraitValue.includes(traitValue)) continue; // skip internal traits
        incr++;
     // if( incr > maxTest)return;
         
            
             
         const ids = nftIDs;

        const folder = path.join(PROJECT_ROOT, "REVIEW", traitType);
      //    frameincr++;
        // if( frameincr > maxFrameTest)return;
           await generateTraitReviewVideo(
            ids,
            traitType,
            traitValue,
            folder
        );












        }
    }



}

 

function call_ReviewVideo(){ 

  



   var videoFilter = 
    {
    "FACEGEAR": [
        "leatherMask"
    ],
    "TYPE": [
        "Gray Orc"
    ],
    "TORSO": [
        "Brown Wildroot Carapace"
    ]
    }





     generateAllTraitVideos(  videoFilter );
     

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

node -e "require('D : /GIT/NFT_ELECTRON/TRAITCOUNT/traitReviewGenerator.js').readVideo()"

*/
function readVideo( outputFile ){ 

  
    openWithProgram( "D:/GIT/hashLipsWuli/hashlips_art_engine/TOOLS/mpv/mpv.exe" , outputFile );
}


module.exports = { call_ReviewVideo ,  generateAllTraitVideos  , readVideo , 

  removeUnusedTraitVideo 
 // generateAllTraitSheet

 }
    