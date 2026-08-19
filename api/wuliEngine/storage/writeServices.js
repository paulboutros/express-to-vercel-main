 //const fs = require("fs-extra");

const { get } = require("http");
 
const { scriptType, getData, getPath, psdEditorPath, weaponShieldcomboPATH, savedLiveUpdatePATH } = require("../PATH_REGISTRY/PATH.js");
 
const fs = require("fs");
 
 
const savedLiveUpdatePath = getPath("savedLiveUpdate.json",scriptType.JSONDATA );

const SaveContext  = Object.freeze({
  UI: "UI",
  AUTO: "AUTO",
  IMPORT: "IMPORT",
  DEBUG: "DEBUG"
});

 
function rewriteJSON( dataPath){ 

   const jsonData = JSON.parse(fs.readFileSync( dataPath , "utf8")  );
    
   fs.writeFileSync( dataPath , JSON.stringify( jsonData, null, 2)   , "utf8"   );
 
}
// stateless data handling

function get_PSDData() {

  const psdDataPath = getPath("psdData.json", scriptType.PSDDATA) ;
 //let psdData = getData( psdDataPath ); 
  return JSON.parse(
    fs.readFileSync( psdDataPath , "utf8")
  );
}
function save_PSDData ( data ){ 
    const psdDataPath = getPath("psdData.json",  scriptType.PSDDATA) ;
 //const data = get_PSDData();//     JSON.parse(fs.readFileSync( psdEditorPath  , "utf8"   ));
 fs.writeFileSync(
    psdDataPath,
    JSON.stringify( data, null, 2)
 );

 
}

 

//   export session data ====================================


function get_exportSession(){ 
    return getData(  getPath("exportSession.json",scriptType.JSONDATA)  );
}
function save_exportSession( finalID , obj ){ 
   const exportData = get_exportSession();
   exportData[finalID] = {
    
     rerendered: obj.rerendered ,
     atTime : Date.now(),
     exportMatchLastRender:obj.exportMatchLastRender 
   };

   fs.writeFileSync(
      getPath("exportSession.json",scriptType.JSONDATA)  ,
      JSON.stringify( exportData, null, 2 ) 
       ,"utf8"
  );
     

}
   
 
function get_traitGrouping2(){ 
    return getData( getPath("traitGrouping2.json", scriptType.JSONDATA )); 
    
}
function save_traitGrouping2(dataArg){ 
     const savePath =   getPath("traitGrouping2.json", scriptType.JSONDATA )

     fs.writeFileSync(
         savePath  ,
         JSON.stringify( dataArg, null, 2 ) 
       ,"utf8"
  );
       
}


function get_activeTraits(){ 

      return getData( getPath("activeTraits.json", scriptType.JSONDATA )); 
}
function save_activeTraits(dataArg){ 
     const savePath =   getPath("activeTraits.json", scriptType.JSONDATA )

     fs.writeFileSync(
         savePath  ,
         JSON.stringify( dataArg, null, 2 ) 
       ,"utf8"
  );
       
}
 
function save_savedFilters(dataArg){ 

       

      const savePath =  getPath("savedFilters.json", scriptType.JSONDATA ) ;
      fs.writeFileSync( savePath , JSON.stringify(  dataArg , null, 2), 'utf8');

}
function get_savedFilters(){ 

      return getData( getPath("savedFilters.json", scriptType.JSONDATA )); 
}
//===================  helper function ============================
function get_gridSessionData(){ 
   
   return getData( getPath("sessionData.json", scriptType.JSONDATA )); 
   
   // return nftListToRender;
}
function save_gridSessionData(dataArg){
    const sessionPath = getPath("sessionData.json", scriptType.JSONDATA );
    fs.writeFileSync(sessionPath, JSON.stringify(  dataArg , null, 2), 'utf8');

   

}


 function get_UI_DEFAULT_CONFIG(){

     return  getData( getPath("inputConfig.json" , "CONFIG") ); 
 }

function get_activeDocData ( activeDocName ){ 

 const dataPath = getPath(  activeDocName + ".json",scriptType.PSDDATA ) ; 
 if ( !fs.existsSync(dataPath)) { 
      console.warn  (    dataPath, " file does has not been created" );
     return null;
  
 }
   
   
   const data = getData( dataPath );

   console.log(  "data = "  , data.config );
  // if (!data) {  return null; }
   return data;
 
}

function save_activeDocDataPATH( activeDocName,   inputArg ){ 
   
  const dataPath = getPath(  activeDocName + ".json",scriptType.PSDDATA ) ; 
  const data = getData( dataPath );
  // console.log( inputArg )
  

  let target = data;
// recu
for (const key of inputArg.path) {
    target[key] ??= {};
    target = target[key];
}

Object.assign(target, inputArg.value);


   
  
  fs.writeFileSync(
    dataPath,
    JSON.stringify( data, null, 2), "utf8" 
  );
 
}


function get_backup_log (){ 

   const dataPath = getPath(   "backup_log.json",scriptType.JSONDATA ) ; 
   return getData(dataPath);
}
function save_backup_log ( dataArg  ){ 
   const dataPath = getPath(   "backup_log.json",scriptType.JSONDATA ) ; 
  
  fs.writeFileSync(
    dataPath,
    JSON.stringify( dataArg, null, 2), "utf8" 
  );

}

function save_activeDocData ( activeDocName,   inputArg ){ 
   
  const dataPath = getPath(  activeDocName + ".json",scriptType.PSDDATA ) ; 
  const data = getData( dataPath );
  // console.log( inputArg )
  
  data[inputArg.key] = inputArg.value;
  
  
  //console.log( data );
 
  fs.writeFileSync(
    dataPath,
    JSON.stringify( data, null, 2), "utf8" 
  );
 
}

function save_psdEditorSessionData ( inputArg ){ 
   
 const data = get_psdEditorSessionData();//     JSON.parse(fs.readFileSync( psdEditorPath  , "utf8"   ));
   console.log( inputArg )
  
  // data[inputArg.key] = inputArg.value;
 // shallow merge for vector2 for example, save x props only or y only
data[inputArg.key] = {
    ...data[inputArg.key],
    ...inputArg.value
};
  
  console.log( data );
 
  fs.writeFileSync(
    psdEditorPath,
    JSON.stringify( data, null, 2)
  );
 
}

//=========================================================

function save_pickedAsOverride(  prop ,  pickedItem  , context  ){ 

  if (!context) { context = "saving "+ prop; }
    save_weaponShieldSessionData({
            context: context,
            modifierFn: (data) => {
              //cancel all next use before setting a new one:
             for (var key in data.patterns.useinNextrender ){
                 data.patterns.useinNextrender[key]= false;
             }
              data.patterns.last_picked[prop] = pickedItem ;
              data.patterns.useinNextrender[prop]= true;
            }
          });
    
}

 
function getSiteNavigationData(){
  
   return  getData( getPath("siteNavigationData.json",scriptType.JSONDATA) ) ; 
}
function get_PageData(){
  
   return  getData( getPath("webPageData.json",scriptType.JSONDATA) ) ; 
}

function get_rarityTraitCount( ){ 

   return  getData( getPath("traitCounter.json",scriptType.JSONDATA) ) ; 
}

function get_rarityTraitLength( ){ 

   return  getData( getPath("traitCounterLength.json",scriptType.JSONDATA) ) ; 
}


function save_weaponShieldSessionData(  input ) {
 
validateWriteInput(input);
  
  

 const { base = null, modifierFn, context } = input;

   
 const data = get_weaponShieldSession(); // fresh read
  // merge base context into state
 // Object.assign(data, base);
 // ✅ apply base only if provided
  if (base && typeof base === "object") {
    deepMerge(data, base);
  }

  // ✅ apply modifier (required)




  // apply custom logic
  modifierFn(data);

   
  // modifierFn(data); // apply change
   logStack(  context );
 
  fs.writeFileSync(
    getPath("weaponShieldSession.json",scriptType.JSONDATA), 
    JSON.stringify( data, null, 2)
  );
}


// psd data


function save_weaponShieldcombo( weaponShieldcombo ){ 
  if ( !weaponShieldcombo ){ 
     alert ( "weapon shield combo data is null");
     return;
  } 

    fs.writeFileSync( weaponShieldcomboPATH , JSON.stringify( weaponShieldcombo , null, 2), 'utf8');
 } 
//==================================================================================================
// stateless data handling

function get_psdEditorSessionData() {
 // return getData(  getPath(".json",scriptType.JSONDATA));
  return JSON.parse(
     
    fs.readFileSync(psdEditorPath, "utf8")
  );
}


//==================================================================================================
function get_sheetGenerationHistory() {
    return getData( getPath("sheetGenerationHistory.json",scriptType.JSONDATA));
}
function set_sheetGenerationHistory(dataArg){ 
    const dataPath = getPath("sheetGenerationHistory.json",scriptType.JSONDATA);
    fs.writeFileSync(dataPath, JSON.stringify( dataArg , null, 2), 'utf8');
}
//==================================================================================

 
function get_weaponShieldSession() {
   return getData(  getPath("weaponShieldSession.json",scriptType.JSONDATA));
}
function load_weaponShieldcombo(){ 
    return  JSON.parse(fs.readFileSync(   getPath("weaponShieldcombo.json",scriptType.JSONDATA)  , 'utf8'));
}
 


 function get_traitOverrideNames_invers() { 

   return getData(  getPath("traitOverrideNames_invers.json",scriptType.JSONDATA));
 



 }

function GetWeaponShieldcombo_set() {
  const weaponShieldcombo = JSON.parse(
    fs.readFileSync(   getPath("weaponShieldcombo.json",scriptType.JSONDATA)     , "utf8")
  );

   const nftMap     = buildExpandedPatternMap(weaponShieldcombo.nftMap);
   const nftMaskMap = buildExpandedPatternMap(weaponShieldcombo.nftMaskMap);
   
   return { 
        weaponShieldcombo:weaponShieldcombo,
        nftMap:nftMap,
        nftMaskMap:nftMaskMap

   }

}
/*
function GetWeaponPat_nftMap() {
  return  buildExpandedPatternMap(weaponShieldcombo.nftMap);
}
function GetMasknPat_nftMap() {
  return  buildExpandedPatternMap(weaponShieldcombo.nftMaskMap);
}*/

/*
let weaponShieldcombo    =  JSON.parse(fs.readFileSync( weaponShieldcomboPATH , 'utf8'));
const weaponPat_nftMap   =    buildExpandedPatternMap(weaponShieldcombo.nftMap);
 const masknPat_nftMap   =   buildExpandedPatternMap(weaponShieldcombo.nftMaskMap);
*/

//===========================================================================================

  



function deconst(arg){ 

   const { weaponArray, shieldArray,maskArray , nftIDindexInArray }= getWeaponShieldPattern_array(arg   );


       console.log( "weaponArray " , weaponArray  ,
          "shieldArray  " , shieldArray  , 
           "maskArray   "   ,maskArray );

}
 
// type in wndow:
//debug.deconst(2183)
//debug.getWeaponShieldPattern_array(2183)
 function getWeaponShieldPattern_array(destNFTID){  
    
      
   // copied from weaponShieldSlormachine.js
   //==============================================================
     var  weaponShieldcombo =  load_weaponShieldcombo();
     
     // get the exact slot this NFT belongs to
     let baseFive = getFiveBlockFromAny(destNFTID)[0];
     let patSlotIndex = destNFTID - baseFive;

     // get current weapon and mask information to be use for override later
     var curSel_nftMap      =  weaponShieldcombo.nftMap   [    String(baseFive)   ];
     var curSel_nftMaskMap  =  weaponShieldcombo.nftMaskMap[    String(baseFive)   ];
     var wp_patname =null;
     var patNameMsk = null;
     // get weapon/shield pattern
     if ( curSel_nftMap    ){  wp_patname =  curSel_nftMap.patname;}
      //get mask pattern
     if ( curSel_nftMaskMap    ){  patNameMsk =  curSel_nftMaskMap.patname; }
        
    
     const indexOfFives = patSlotIndex;// getIndexOfFivesForID(  destNFTID  );

    console.log( "baseFive " , baseFive  ,  "indexOfFives  " , indexOfFives  ,  "wp_patname   "   ,wp_patname );
  // return ;

     const weaponArray =  weaponShieldcombo.patterns[ wp_patname].p0; //[  indexOfFives  ]; //"02_04"; // example
     const shieldArray =  weaponShieldcombo.patterns[ wp_patname].p1;//[  indexOfFives  ]; //"02_04"; // example
     const maskArray =  weaponShieldcombo.maskPattern[ patNameMsk].p0;//[  indexOfFives  ]; //"02_04"; // example
     //==================================================================================
     //===============================================================================
       
       return { weaponArray, shieldArray,maskArray,
         nftIDindexInArray: indexOfFives ,

        //   baseFive,
           wp_patname,
           patNameMsk,

           weaponShieldcombo
        
        }
         

       
 }

  

/*
 debug.writeWeaponShieldOverrides( 2231, { weapon: "dragonStaff_01", shield:null } )
*/
 /*
function writeWeaponShieldOverride(overrideType, destNFTID, newValue) {

    const {
        weaponArray,
        shieldArray,
        maskArray,
        nftIDindexInArray,
        weaponShieldcombo
    } = getWeaponShieldPattern_array(destNFTID);

    const targetMap = {
        weapon: weaponArray,
        shield: shieldArray,
        mask: maskArray
    };

    const targetArray = targetMap[overrideType];

    if (!targetArray) {
        throw new Error("Invalid override type: " + overrideType);
    }

    targetArray[nftIDindexInArray] = newValue;

    save_weaponShieldcombo(weaponShieldcombo);

    return true;
}*/


function writeWeaponShield_fromUnsavedData( weaponShieldcombo ,destNFTID  ) { 
   let baseFive = getFiveBlockFromAny(destNFTID)[0];
    

     // get current weapon and mask information to be use for override later
   //  var curSel_nftMap      =  weaponShieldcombo.nftMap   [    String(baseFive)   ];



 

  var unsaved_Pattern =  weaponShieldcombo.unsavedPattern.patterns[    String(baseFive)   ];
  if (unsaved_Pattern){ 
       weaponShieldcombo.patterns[  String(baseFive)  ] = unsaved_Pattern;
  }


  var unsaved_maskPattern=  weaponShieldcombo.unsavedPattern.maskPattern[    String(baseFive)   ];
  if (unsaved_maskPattern){ 
      weaponShieldcombo.maskPattern[  String(baseFive)  ] = unsaved_maskPattern;
  }
   
   
 
weaponShieldcombo.unsavedPattern.patterns ={ };
weaponShieldcombo.unsavedPattern.maskPattern ={ };


  console.log(   "  data in   weaponShieldcombo.patterns[  String(baseFive)  ]     : "  ,
            String(baseFive) , "   =  " ,

         weaponShieldcombo.patterns[  String(baseFive)  ] 
  )
  
}

function writeWeaponShieldOverrides(destNFTID, overrideValues) {

    const {
        weaponArray,
        shieldArray,
        maskArray,
        nftIDindexInArray,
        weaponShieldcombo
    } = getWeaponShieldPattern_array(destNFTID);

    const targetMap = {
        weapon: weaponArray,
        shield: shieldArray,
        mask: maskArray
    };

    for (const [overrideType, newValue] of Object.entries(overrideValues)) {

        const targetArray = targetMap[overrideType];

        if (!targetArray) {
            $.writeln("Invalid override type: " + overrideType);
            continue;
        }

        targetArray[nftIDindexInArray] = newValue;
    }

    save_weaponShieldcombo(weaponShieldcombo);

    return {
        success: true,
        destNFTID: destNFTID,
        updated: Object.keys(overrideValues)
    };
}


 


 function logStack( callContext ) {
   // if (!callContext || !Object.values(SaveContext).includes(callContext)) {
   if( !callContext ){ 
    throw new Error("❌ Invalid or missing save context");
  }
   console.log("logStack:",callContext);
}

function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function validateWriteInput(input) {

  if (!input || typeof input !== "object") {
    throw new Error("❌ Input must be an object");
  }

  const { base, modifierFn, context } = input;

   if (typeof modifierFn !== "function") {
    throw new Error("❌ 'modifierFn' must be a function");
  }

  
  // base is optional
  if ( base !== null && base !== undefined && typeof base !== "object") {
    throw new Error("❌ 'base' must be a valid object");
  } 

  // check context
  if (!context || typeof context !== "string") {
    throw new Error("❌ 'context' must be a non-empty string");
  }

  return true;
}

//===================================================
 

//================================================

function saveLiveEditData (liveEditData) {
       
       fs.writeFileSync(  savedLiveUpdatePATH , JSON.stringify(  liveEditData   )    , "utf8");
 } 
function loadLiveEditData() {
  let liveEditData;   
  if (fs.existsSync(savedLiveUpdatePath)) {
   liveEditData  = JSON.parse(fs.readFileSync(savedLiveUpdatePath));
  } else {
    liveEditData = {};
  } 
  return;
}


 
if (typeof window !== "undefined") {
    window.debug = window.debug || {};
     
      
      window.debug.writeWeaponShieldOverrides = writeWeaponShieldOverrides;
      window.debug.getWeaponShieldPattern_array= getWeaponShieldPattern_array;
      
        
  }


//==========================  activeFilterMap_ID
function save_activeFilterMap_ID(data) {
    var activeNFT = {
      activeLength: data.length,
      activeFilterMap_ID: data
   };
   fs.writeFileSync(  getPath("actviteNFTList.json", scriptType.JSONDATA)  , JSON.stringify(activeNFT), "utf8");
 }
 
 function getActiveFilterMap (data) {
    
     const loadedData = getData( getPath("actviteNFTList.json", scriptType.JSONDATA)  );
      return loadedData ;
 }


 //=============================== helper

 function getIndexOfFivesForID(id){ 
     const nft_seq_five  = getFiveBlockFromAny( id ); 
    return   nft_seq_five.indexOf(id);
 }
//========================

module.exports = {
    
 
    SaveContext,

    save_activeFilterMap_ID, getActiveFilterMap,
    get_gridSessionData, save_gridSessionData,

    saveLiveEditData,loadLiveEditData,

    //===========================
    save_pickedAsOverride,
    save_weaponShieldSessionData, 
  //=======================

    GetWeaponShieldcombo_set,
    get_weaponShieldSession,

    save_psdEditorSessionData,get_psdEditorSessionData,


    get_PSDData, save_PSDData ,

    save_weaponShieldcombo , load_weaponShieldcombo ,

    getWeaponShieldPattern_array , writeWeaponShieldOverrides ,writeWeaponShield_fromUnsavedData,


    save_exportSession,
    rewriteJSON,
 save_activeDocData,get_activeDocData ,  get_UI_DEFAULT_CONFIG ,
 save_activeDocDataPATH,

 save_backup_log , get_backup_log,


save_savedFilters , get_savedFilters,

 save_activeTraits,get_activeTraits,

 get_traitGrouping2,save_traitGrouping2,

  get_rarityTraitCount, get_rarityTraitLength,
  get_PageData, getSiteNavigationData,

 get_sheetGenerationHistory,set_sheetGenerationHistory ,

 get_traitOverrideNames_invers

// loadConfigGridLayout


    
}


 
