const fs = require("fs");
const path = require("path");
const { 
  getPath,
  scriptType

 } = require("../BOOTSTRAP/PATH");
 const { nodeRunThis, scriptObj } = require("../services/nodeRunScript");
 
   
 
const saveFile =   true;
const Undefined = "undefined";
let ignored_nft =[];
//let file_not_upToData=[];
let undedefinedNFT =[];
let skippedFoWrongTrait=[];

let nft_checked_count = 0;
let attr_checked_count =0; 
 
//let totaltaitCount =0;
// Final output structure
let traitCounter = {};
let traitCounterLength ={};
 

function rebuildRarityDocCount(){


      

 
     traitCounter = {};
     traitCounterLength ={};
     
     skippedFoWrongTrait=[];
     nft_checked_count = 0;
     attr_checked_count =0; 

     
     
     const folderPath =  getPath( "", scriptType.PSDDATA)
     const jsonFiles  =  getAllJsonFiles(folderPath);
 
 

   //  console.log  ( " keysWithDocDNA  = " ,  keysWithDocDNA);
    
 
  if (    detectAndFIX_BOM_UTF8(jsonFiles)  >  0 ) {  return;};
  

   // return;
    jsonFiles.forEach(filePath => {
      const filename = path.basename(filePath);
      let raw, json;
 
      const data = JSON.parse(fs.readFileSync(filePath));

      if (!data.config) return;
 
       if (!data.config.traitsUI) return;
       if (!data.config.traitsUI.pills) return;
  

     nft_checked_count++;
       
      data.config.traitsUI.pills.forEach (attr => {
        const type = attr.traitKey;//trait_type;
        const value = attr.value;

          attr_checked_count++;
 
          if (!traitCounter[type]) { traitCounter[type] = {};}
          if (!traitCounter[type][value]) { traitCounter[type][value] = [];}
          if (!traitCounterLength[type]) {  traitCounterLength[type] = {};}
          if (!traitCounterLength[type][value]) { traitCounterLength[type][value] = 0;}
          traitCounterLength[type][value] ++;
          traitCounter[type][value].push( filename );
 
      });
    });


if(!saveFile)return;
 
  // rarityDoc.json
     const rarityDocPath = getPath("rarityDoc.json", scriptType.JSONDATA );
    // Save output file
    fs.writeFileSync(
          rarityDocPath,    
          JSON.stringify(traitCounter, null, 2), 
          "utf8"
    );
 
    /*
    // Save output file
    fs.writeFileSync(v
          traitCounterLengthPATH,    
      JSON.stringify(traitCounterLength, null, 2)
    );
*/
      

      console.log("✔ traitCounter.json created successfully! nft_checked_count = " , nft_checked_count);
   
  

}
 
module.exports = { rebuildRarityDocCount }


/*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/TRAITCOUNT/countTraits.js').rebuildRarityCount()"
*/

 
   
function detectAndFIX_BOM_UTF8(jsonFiles){ 
    let nonUTFList = [];
   //===
   jsonFiles.forEach(filePath => {
    const filename = path.basename(filePath);
    const id = parseInt(filename.replace(".json", ""));

    let raw;
    let json;
    let needsRewrite = false;

    try {
        // read raw file
        raw = fs.readFileSync(filePath, "utf8");

        // detect BOM (this is your real known issue)
        if (raw.charCodeAt(0) === 0xFEFF) {

          nonUTFList.push(id);
             needsRewrite = true;
            raw = raw.replace(/^\uFEFF/, "");


        }

        if (!raw || raw.trim() === "") {
            throw new Error("Empty JSON file");
        }

        json = JSON.parse(raw);

    } catch (err) {
        console.error("\n==============================");
        console.error("🚨 INVALID JSON FILE:");
        console.error(filePath);
        console.error("Error:", err.message);
        console.error("==============================\n");
        process.exit(1);
    }

    // OPTIONAL: detect encoding/format drift indirectly
    // (if BOM was found OR we decide to normalize format)
    if (needsRewrite) {
        fs.writeFileSync(
            filePath,
            JSON.stringify(json, null, 2),
            "utf8"
        );

        console.log(`🔧 Fixed + rewritten: ${filename}`);
    }
  });



   console.log("Normalization complete nonUTFList length: ", nonUTFList.length , " nonUTFList:" , nonUTFList,
      " \n total json tested: ", jsonFiles.length  );


    return nonUTFList.length 

  
}

  