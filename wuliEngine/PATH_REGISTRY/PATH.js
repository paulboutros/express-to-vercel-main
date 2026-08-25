const fs = require("fs-extra");
const path = require("path");
const { appendFileSync } = require("fs");
 

const { getFirstInSet } = require("../metadata/MetaDataAPI");

const { pad } = require("../UTILITY/generalUtil2");

 
 

const NFTBASEPROJECT = "D:/GIT/hashLipsWuli/hashlips_art_engine/";
 

 const registryDir = __dirname;
const JSON_FOLDER =   path.join(__dirname, "..", "JSONDATA");



const basePath1 = "D:/GIT/hashLipsWuli/hashlips_art_engine/utils/WEAPON_ANGLE_MODIFICATION/";

const weaponShieldcomboPATH =    JSON_FOLDER + "weaponShieldcombo.json";
const phenotype_PATH =    JSON_FOLDER +"phenotype.json";
 // folders
const pathWeapons = NFTBASEPROJECT + "PSD/COLOR_FILTER/ALPHAMASK/MIXER/WEAPON_PSD/WEAPON/OPTIMIZED";
const pathShields = NFTBASEPROJECT + "PSD/COLOR_FILTER/ALPHAMASK/MIXER/SHIELD/SM_OBJ/OPTIMIZED";
const pathMask    = NFTBASEPROJECT + "PSD/COLOR_FILTER/ALPHAMASK/MIXER/MASK_PSD/OPTIMIZED";

//===================  PSD EDITOR ==============================

 const psdEditorPath ="D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/PSDEDITOR/psdEditorSession.json";

//const psdEditorPath = JSON_FOLDER + "psdEditorSession.json";

//=======================================
 

const actviteNFTList_PATH = JSON_FOLDER +"JSONDATA/actviteNFTList.json"; 
 const colorSequencePATH  =JSON_FOLDER +"JSONDATA/colorSequence.json"; 
 const savedLiveUpdatePATH = JSON_FOLDER +"JSONDATA/savedLiveUpdate.json";




const  imageBatchPath = "D:/GIT/hashLipsWuli/hashlips_art_engine/image_batch/";
const pathBaseNFTPASS1 =  imageBatchPath;
const pathBaseNFTPASS2 =  imageBatchPath + "Full_NFT_Collection/";

const Full_NFT_noWeapon_PATH  =  imageBatchPath + "Full_NFT_noWeapon/";



const tierCountPATH =    JSON_FOLDER +"tiersCount.json";
const propListPath =     JSON_FOLDER +"propList.json";
  
const traitFinalPass1 = JSON_FOLDER + "TRAIT_PASS1/traitFinalPass1.json";

const configurationsListPath = basePath1 +  "utils/configurationsList.json";



  const  ALL_PATH = path.join( JSON_FOLDER, "ALL_PATH.json" )    ; 
 
const scriptType={
  jsxService:"jsxService",
 jsxUtility:"jsxUtility",
 PSDDATA:"PSDDATA",
 JSONDATA:"JSONDATA",
 CONFIG:"CONFIG" 

}
 

function createSafePath ( patharg){
 
    return   patharg.replace(/\\/g, "/"); 
}
//=========================  getPath   ================
 

 //eval(fs.readFileSync("D:/GIT/hashLipsWuli/hashlips_art_engine/utils/JS_JSX/JSJSX.js", "utf8"));
//===================================================
 //const packageRoot = path.resolve(__dirname, ".."); 

 
const registry =  JSON.parse(fs.readFileSync( ALL_PATH , 'utf8'));
function getPath(key, scriptTypeArg) {

  
  //console.log( " ======ALL_PATH       "   ,ALL_PATH   );
   if ( scriptTypeArg ){ 
       
     let pathResolved;
      if (
          scriptTypeArg === scriptType.CONFIG ||
          scriptTypeArg === scriptType.JSONDATA ){
            
           
           pathResolved = path.join(
            registryDir,
            registry.pathRoot[scriptTypeArg],
            key
          );

        // console.log( " getPath  === "  , pathResolved );
         return pathResolved;
       }

     pathResolved = registry.pathRoot[scriptTypeArg] + key;
     console.log( " getPath  === "  , pathResolved );
    // return path.resolve(registry.pathRoot[scriptTypeArg], key)
     return pathResolved ; 
   }

    return registry[key].path;
}

 const traitOverrideNames_invers = getData(   getPath("traitOverrideNames_invers.json",scriptType.JSONDATA)  );

 // currently returns noraml path, but could be ised to resolve more ocmplexe path, or resolving various  names issues
function getCardPath(traitType, name  ){ 
    const cardpath = getPath("","CARDS");

   // const traitOverrideNames_invers = getData(   getPath("traitOverrideNames_invers.json",scriptType.JSONDATA)  );
  

    return `url("${ cardpath }${name}.png")`;

}
function getCardFile(cardType, name  ){ 
   
    // if (traitType === "CHARA"){ 
          const cardpath = getPath("",cardType);
          return cardpath+ name +".png";
   // }


    return `"${cardpath }${name}.png")`
}

 
function writeLog(path, text) {
   var path = "D:/GIT/hashLipsWuli/hashlips_art_engine/utils/WEAPON_ANGLE_MODIFICATION/utils/JSX/photoshop_log.txt";
    appendFileSync(path, text + "\n");
}


var renderPresetModePATH =  path.join( JSON_FOLDER , "renderPresetMode.json" );  
const weaponShieldSessionPATH =  path.join( JSON_FOLDER , "weaponShieldSession.json");


const segmentsToRenderPATH =   path.join( JSON_FOLDER ,"segmentsToRender.json");
const pipeLine_status_PATH =   path.join( JSON_FOLDER ,"pipelineStatus.json");

const  traitOverrideNamesPATH  =   path.join( JSON_FOLDER ,"traitOverrideNames.json"); 
const  traitOverrideNames_inversPATH  =  path.join(  JSON_FOLDER ,"traitOverrideNames_invers.json"); 


const psResponsePATH  = path.join(  JSON_FOLDER ,"psResponse.json"); 
const traitCounterPATH  =     path.join( JSON_FOLDER ,"traitCounter.json"); 
const weaponDistributionPATH =  path.join( JSON_FOLDER , "weaponDistribution.json");
const traitCounterLengthPATH  = path.join(  JSON_FOLDER ,"traitCounterLength.json"); 
const nftGenotype_PATH =  path.join(  JSON_FOLDER ,"nftGenotype.json"); 


const globalPat_PATH   = path.join(  JSON_FOLDER ,"global_wp_pat.json");
const traitRestructResulthPATH  = path.join(  JSON_FOLDER ,"traitRestructResult.json");

const  headBodyMixRenderDataPATH  =  path.join(  JSON_FOLDER, "headBodyMixRenderData.json");
const headBodyMixMAP_PATH  = path.join( JSON_FOLDER, "headBodyMixMAP.json") ;

const headBodyComboControl_PATH  =  path.join(  JSON_FOLDER , "headBodyComboControl.json");

const weaponShieldOverride_PATH =  path.join(  JSON_FOLDER , "weaponShieldOverride.json");
const weaponShieldPass_PATH =   path.join( JSON_FOLDER , "weaponShieldPass.json");

const MixedToSourceMap_PATH  =   path.join( JSON_FOLDER , "MixedToSourceMap.json"); 

const NFT_Group_pattern_PATH  =  path.join(  JSON_FOLDER , "NFT_Group_pattern.json"); 
const clan_class_PATH  =    path.join( JSON_FOLDER , "clan_class.json"); 




//====================================================================================
// moved from general utility:

function build_NFT_output_folderName(NFToutput){

    return ("seg_"+pad( NFToutput[0])+"_" +pad( NFToutput[1]))
}
function build_NFT_output_folderNameFrom_NFT_IDBASE(nft_IDBASE){

   const NFToutput = [ nft_IDBASE, nft_IDBASE +9 ];
    return  build_NFT_output_folderName(NFToutput);
}

function buildImagePathFromNFTID(  imageNumber) {

 const  nft_IDBASE = getFirstInSet(imageNumber);
    return `${pathBaseNFTPASS2 + build_NFT_output_folderNameFrom_NFT_IDBASE(nft_IDBASE)}/images/${imageNumber}.png`;
}



 function buildImagePath(  NFToutput, imageNumber) {

    return `${pathBaseNFTPASS2 + build_NFT_output_folderName(NFToutput)}/images/${imageNumber}.png`;
}


function buildImageWithCache(  base ) {
    
    return `${base}?cb=${Date.now()}`;
}

function buildImagePathWithCache(  NFToutput, imageNumber) {
    const base = buildImagePath( NFToutput, imageNumber );
    return `${base}?cb=${Date.now()}`;
}





//================================================================
/*
function get_FINAL_PASS_NFT_METADATA_PATH( NFToutput , nftNumber ){  

     const path_result =   path.join( pathBaseNFTPASS2, 
     build_NFT_output_folderName( NFToutput),
      "json/"+ nftNumber+".json");
   
    // --- SAFETY CHECK ---
  if (!fs.existsSync(path_result)) {
    console.warn("⚠️ NFT metadata folder does not exist:", path_result);
    return null;  // or throw new Error(...) if you prefer
  }
 
     return path_result;
}
*/
function get_FINAL_PASS_NFT_METADATA_PATH(NFToutput, nftNumber) {

  const dirPath = path.join(
    pathBaseNFTPASS2,
    build_NFT_output_folderName(NFToutput),
    "json"
  );
  const dirPathImages = path.join(
    pathBaseNFTPASS2,
    build_NFT_output_folderName(NFToutput),
    "images"
  );

const filePath = path.join(dirPath, `${nftNumber}.json`);

  // --- Ensure directory exists ---
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.mkdirSync(dirPathImages, { recursive: true });

    // add images path as well

  }

  // --- Ensure file exists ---
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2), "utf8");
  }

  return filePath;
}
 function getDataFromFileName( fileName ){ 

   const dataPath = getPath(fileName);//
    return JSON.parse(fs.readFileSync( dataPath  , 'utf8'));

 }

 

 function getData (dataPath){ 

  return JSON.parse(fs.readFileSync( dataPath  , 'utf8'));
 }
 function saveData (data, dataPath) { 

   fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  // fs.writeFileSync(filePath, JSON.stringify({}, null, 2), "utf8");
  // fs.writeFileSync(dataPath, JSON.stringify(data)    , "utf8");
 }


function get_FIRST_PASS_NFT_METADATA( NFToutput ){

  const nft_seg_folder_name = build_NFT_output_folderName(NFToutput);//  ("seg_"+pad( NFToutput[0])+"_" +pad( NFToutput[1]))
const FIRST_PASS_NFT_METADATA = 
   path.join( imageBatchPath,  nft_seg_folder_name, "json",  "_metadata.json"   )   ;
 
// --- SAFETY CHECK ---
  if (!fs.existsSync(FIRST_PASS_NFT_METADATA)) {
    console.warn("⚠️ NFT metadata folder does not exist:", FIRST_PASS_NFT_METADATA);
    return null;  // or throw new Error(...) if you prefer
  }



    return FIRST_PASS_NFT_METADATA;

}

//===============================================================

function getReviewSheetData(){ 
  return getData(  getPath( "ReviewSheetData.json", scriptType.JSONDATA ) ); 
}
function saveReviewSheetData( dataArg ){ 
   const dataPath = getPath( "ReviewSheetData.json", scriptType.JSONDATA )  ; 

  fs.writeFileSync(
              dataPath,    //"traitCounter.json",
              JSON.stringify(dataArg, null, 2), 
              "utf8"
        );
}
/*
function pad(num) {
        var s = num.toString();
        while (s.length < 4) s = "0" + s;
        return s;
 } */
    
 
 function getRarityDoc(){ 
     return getData(  getPath("rarityDoc.json", scriptType.JSONDATA )  );
        // Save output file
     


 }
 function saveRarityDoc( dataArg){ 
  const rarityDocPath =  getPath("rarityDoc.json", scriptType.JSONDATA );
         fs.writeFileSync(
              rarityDocPath,    //"traitCounter.json",
              JSON.stringify(dataArg, null, 2), 
              "utf8"
        );
 }


function getSegmentName(startIndex) {
    var start = parseInt(startIndex, 10);
    var end = start + 9;

    

    return "seg_" + pad(start) + "_" + pad(end);
}

/*
function getFirstInSet(currentNum) {
    if (currentNum % 10 === 0) {
        // If ends in 0, it's the last frame of a batch
        return currentNum - 9;
    } else {
        // Otherwise, floor to previous multiple of 10, then add 1
        return Math.floor(currentNum / 10) * 10 + 1;
    }
}
*/



//=====================================

module.exports = {

   getPath,registry,    writeLog, scriptType, getDataFromFileName,

   build_NFT_output_folderName, buildImagePathWithCache, buildImageWithCache, buildImagePath, 

   get_FIRST_PASS_NFT_METADATA, get_FINAL_PASS_NFT_METADATA_PATH,

     getSegmentName , getData, saveData, buildImagePathFromNFTID,
   headBodyMixRenderDataPATH, headBodyMixMAP_PATH, MixedToSourceMap_PATH, NFTBASEPROJECT,
   weaponShieldPass_PATH, weaponShieldOverride_PATH,
       traitOverrideNamesPATH,
     actviteNFTList_PATH, renderPresetModePATH,

   //   sessionDataPATH, filterSavePath,  traitGrouping2,filterSavePath_ABS
   
   
   
   configurationsListPath , colorSequencePATH,
   pathBaseNFTPASS1, pathBaseNFTPASS2, propListPath , traitFinalPass1,
 
   
   savedLiveUpdatePATH , segmentsToRenderPATH, traitCounterPATH, pipeLine_status_PATH,
   traitCounterLengthPATH , traitRestructResulthPATH , NFT_Group_pattern_PATH,clan_class_PATH, tierCountPATH,

   headBodyComboControl_PATH , 
   Full_NFT_noWeapon_PATH, 

   pathWeapons, pathShields, pathMask,
   
   weaponShieldcomboPATH , globalPat_PATH ,  phenotype_PATH,
   weaponShieldSessionPATH , 
    weaponDistributionPATH , traitOverrideNames_inversPATH ,
    psdEditorPath ,
    nftGenotype_PATH, psResponsePATH,

    ALL_PATH, getCardPath , createSafePath , getCardFile ,
     getReviewSheetData , saveReviewSheetData,
     
     getRarityDoc,saveRarityDoc
 
}



//================================= kkeep these local  (no export) =======

 // =============================
// Helper function to pad numbers
// =============================
/*
function pad(num, size = 4) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}
function pad(num) {
        var s = num.toString();
        while (s.length < 4) s = "0" + s;
        return s;
 } */