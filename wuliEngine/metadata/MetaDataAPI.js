// MetaDataAPI
// Depends on: PATH, pure utils
// Must NOT depend on Electron main or UI
const fs = require("fs");
const path = require("path");

const TRAIT_SLOT = { 
     "weapon": "WEAPON",
     "shield": "SHIELD",
     "mask": "FACEGEAR",
     
      "clan": "CLAN",
      "class": "CLASS" 
 
}
const TRAIT_ORDER = [
  "TYPE",
  "LEGWEAR",
  "HANDGEAR",
  "TORSO",
  "SHOULDER",
  
  "CAPE",

  "HIPGEAR",
  "WEAPON",
  "SHIELD",

// "HOODIE",
  "HEAD",
//  "HELMCREST",
   "HORNS",
   "FACEGEAR",//"MASK",
   "NECKSTYLE",
  
  "CLAN",
  "CLASS",
  "DNA",
  "COLORSQN"
];

const TRAIT_REMOVE_FOR_EXPORT =[
     "COLORSQN", "DNA", "__META_TYPE__","_BODY_","_HEAD_" , "NECKSTYLE" , "HELMCREST"
]

const IGNORED_TRAITS = [
 "Background", "Cheek Pieces", "Face Gear", "Shoulder Gear", 
 "Headgear","Cape","Boots","Hip Gear",
 "Weapon","Necklaces","Knee","Race","Gloves",
  "Pants","Torso Gear","Shield","Neck Guard","Add-on decorations",
  "__META_TYPE__"
];
 
const ignoreID_under = 2111;
const IGNORED_ID = [1,2,6,7,8,9 ,
     181,182, 184 ,185  ,186, 187, 188, 189, 190 , 
     
     212,217,218,220,
     
     221,222,223,224,225,226,227, 228, 229,230,
     
     
     271,272,273, 274, 275, 276, 277,278,279, 280,
     
     443,444, 448, 449,450,  529, 445, 446, 447,
  601,602,603, 604,605, 606,607, 608, 609,610, 

  741,742,743, 744,745, 746,747, 748, 749,750, 
  
  611,612,613,614,615,616,  617,  618, 619, 620,
  1693,1694,1697, 1698,1699, 1700,1791,
  1793, 1794, 1795, 1796, 1797, 1798, 1799,1800
    ];

// Root folder containing all your seg_xxx_xxx folders
const ROOT =

"D:/GIT/hashLipsWuli/hashlips_art_engine/image_batch/Full_NFT_Collection/";


const projectPath ={
    internal:"internal",
    export:"export"
}
 
function getALL_NFTIDS (){ 
   
     const  allPath = require("../PATH_REGISTRY/PATH");
 
 
  const traitCounter  = JSON.parse(fs.readFileSync(    allPath.traitCounterPATH ));
   
   const body_trait  = traitCounter ["_BODY_"];

   const bodyKeys = Object.keys(body_trait);
     
   const allNFTIDS =[];
   for (let index = 0; index < bodyKeys.length; index++) {
        const bodyID = bodyKeys[index];
 
        allNFTIDS.push( ...body_trait[bodyID] ); 
 

   }

 //    console.log( "All NFTs length:" , allNFTIDS.length , allNFTIDS );

      return allNFTIDS;
}




  
  function Get_value_from_attribute(NFTattributes, keyword) {


    var tempAttr = get_attirbute(NFTattributes, keyword);
    if (tempAttr) {

        //  log("get_from_attribute : " +  tempAttr.value);
        return tempAttr.value;

    }

    //return Undefined;
    return null;

}

function get_Value(attributes, keyword) {
    if (!attributes || attributes.length === 0) return null;

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        if (attr.value && attr.value.indexOf(keyword) !== -1) {
            return attr.value ;
        }
    }

    return null; // not found
}

function get_attirbute( attributes, keyword ) {
    if (!attributes || attributes.length === 0) return null;

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i];
        if (attr.trait_type && attr.trait_type.indexOf(keyword) !== -1) {
            return attr ;
        }
    }

    return null; // not found
}



function getIMGPathFromID( nftID  ) { 

    const  allPath = require("../PATH_REGISTRY/PATH");

   var body_firstNumber  =  getFirstInSet(   nftID   );
     var segFolder = allPath.getSegmentName (  body_firstNumber  );
     var source_body_Path      =
     allPath.pathBaseNFTPASS2 + segFolder + "/" + "images" + "/" + nftID + ".png";

      return source_body_Path;

}

function getMetaDataPathFromID( nftID, projectPathArg = null  ) { 

    const  allPath = require("../PATH_REGISTRY/PATH");

   

    let pathResult=null;



     switch (projectPathArg) {
        case projectPath.export   :

            pathResult  =  allPath.getPath("json/" + nftID + ".json"    , "Full_NFT_export")
            return pathResult;
         break;
     
        default:
            break;
     }

  //  if (!projectPath){
     var body_firstNumber  =  getFirstInSet(   nftID   );
     var segFolder = allPath.getSegmentName (  body_firstNumber  );
     
      pathResult      =
     allPath.pathBaseNFTPASS2 + segFolder + "/" + "json" + "/" + nftID + ".json";
  //  }else{ 

        // pathResult      =  allPath.getPath("json/" + nftID + ".json"    , "Full_NFT_export")
       
   // }


      return pathResult;

}

 



function getMetaDataFromID ( nftID  ) { 

  
  const  allPath = require("../PATH_REGISTRY/PATH");

       var body_firstNumber  =  getFirstInSet(   nftID   );
     var segFolder = allPath.getSegmentName (  body_firstNumber  );
     var source_body_Path      =
     allPath.pathBaseNFTPASS2 + segFolder + "/" + "json" + "/" + nftID + ".json";


    // console.log( " path = "  , source_body_Path  ); 

 
const metaData =
  JSON.parse(fs.readFileSync(source_body_Path, "utf8"));
         return  metaData;

}

function getFirstInSet(currentNum) {

  //  alert('dddddddddd');
    if (currentNum % 10 === 0) {
        // If ends in 0, it's the last frame of a batch
        return currentNum - 9;
    } else {
        // Otherwise, floor to previous multiple of 10, then add 1
        return Math.floor(currentNum / 10) * 10 + 1;
    }
}
 


/*
get all idbase from a list of abs nft numbers
*/
function getFirstInSetList(absNumberList) {
   // activeFilterMap_IDBASE.length = 0;
   const IDBASE_list = [];
    /*
    activeFilterMap.forEach(function (entry) {
        var idBase = entry.idBase;

        if (activeFilterMap_IDBASE.indexOf(idBase) === -1) {
            activeFilterMap_IDBASE.push(idBase);
        }
    });
*/

   for (let index = 0; index < absNumberList.length; index++) {
        const idBase = getFirstInSet (absNumberList[index] ) ;

         if ( IDBASE_list.indexOf(idBase) === -1) {
              IDBASE_list.push(idBase);
        }
        
      }

      return IDBASE_list;
 
}


 // copied from pattern.jsx
function build_PART_GROUP_for_JSX(patternGroups , groupProps) {
    
     var PART_GROUP = {};
    var source = patternGroups[ groupProps ];
    if (!source) return PART_GROUP;

    var patternNames =   Object.keys(source);

 

    for (var i = 0; i < patternNames.length; i++) {
        var patternName = patternNames[i];
        var bodyIds = source[patternName];
        if (!(bodyIds instanceof Array)) continue;

        for (var j = 0; j < bodyIds.length; j++) {
            var bodyId = bodyIds[j];
            PART_GROUP[bodyId] = patternName;
        }
    }

    return PART_GROUP;
}

function build_HEAD_BASED_ON_BODY_GROUP_for_JSX(patternGroups , BASED_ON) {
    var RESULT = {};

    var source = patternGroups[BASED_ON];
    if (!source) return RESULT;

    var bodyIds =    Object.keys(source); // getObjectKeys(source);//
    for (var i = 0; i < bodyIds.length; i++) {
        var bodyId = bodyIds[i];
        var headGroups = source[bodyId];

        RESULT[bodyId] = {};

        var patternNames =  Object.keys(headGroups); // getObjectKeys(headGroups);//
        for (var j = 0; j < patternNames.length; j++) {
            var patternName = patternNames[j];
            var headIds = headGroups[patternName];

            if (!(headIds instanceof Array)) continue;

            for (var k = 0; k < headIds.length; k++) {
                var headId = headIds[k];
                RESULT[bodyId][headId] = patternName;
            }
        }
    }

    return RESULT;
}





// Recursively walk root folder and return all JSON file paths
function getAllJsonFiles(dir) {
  let results = [];
  // const fs = require("fs");

  const list = fs.readdirSync(dir);

  list.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(fullPath)); // recursion
    } else if (item.endsWith(".json") && item !== "_metadata.json") {
      results.push(fullPath);
    }
  });

  return results;
}




function getValue_in_trait_type(  NFTattributes, keyword   ){


    var tempAttr   =   get_attirbute(NFTattributes,  keyword    ); 
   if(tempAttr)  {
    
   
      return tempAttr.value ; 

    } 

    //return Undefined;
    return null;

}
 

function applyOverride(attributes, traitType, value) {
    // Remove existing trait
    attributes = attributes.filter(a => a.trait_type !== traitType);

    // Add only if value is not null
    if (value !== null && value !== undefined) {
        attributes.push({
            trait_type: traitType,
            value: value
        });
    }

    return attributes;
}


function writeTraitOnTheseNFTs( /*destPath, nftMeta,*/ nftID, traitType,  traitValue  ){ 

          if (!traitValue || !traitType ){ 
           console.log( "trait type is null. will not override");
           return;
          }

        // const destPath = getMetaDataPathFromID(nftID); 
       //  const nftMeta = JSON.parse(fs.readFileSync(destPath, "utf8"));

         const destPath = getMetaDataPathFromID(nftID); 
         const nftMeta = JSON.parse(fs.readFileSync(destPath, "utf8"));
        // nftMeta.attributes = nftMeta.attributes || [];
        // let attrs = nftMeta.attributes;




         nftMeta.attributes = nftMeta.attributes || [];
       //  let attrs = nftMeta.attributes;
           
        // var  TRAIT_TYPE = get_attirbute(nftMeta.attributes,  traitType  );
         //if (!NECKSTYLE){ 
            
              // noTaitType.push(nftID);
               let attrs = nftMeta.attributes;
        
               attrs = applyOverride(attrs, traitType,  traitValue);
  
               nftMeta.attributes = attrs;
               sortAttributes(nftMeta);
               fs.writeFileSync(destPath, JSON.stringify(nftMeta, null, 2)); 
        // }




}


function sortAttributes(nftMeta) {
    // 1️⃣ Define fixed top-level props order
    const FIXED_TOP_LEVEL = ["name", "description", "image", "dna", "edition" ];

    // Copy current keys
    const currentKeys = Object.keys(nftMeta);

    // Create a temporary object to reorder keys
    const reordered = {};

    // First, add fixed keys in order if they exist
    FIXED_TOP_LEVEL.forEach(key => {
        if (key in nftMeta) {
            reordered[key] = nftMeta[key];
        }
    });

    // Then add remaining keys
    currentKeys.forEach(key => {
        if (!(key in reordered)) {
            reordered[key] = nftMeta[key];
        }
    });

    // Replace all keys in the original object
    Object.keys(nftMeta).forEach(key => delete nftMeta[key]); // clear
    Object.keys(reordered).forEach(key => nftMeta[key] = reordered[key]); // copy back

    // 2️⃣ Sort attributes array if it exists
    if (Array.isArray(nftMeta.attributes)) {
        nftMeta.attributes.sort((a, b) => {
            const ia = TRAIT_ORDER.indexOf(a.trait_type);
            const ib = TRAIT_ORDER.indexOf(b.trait_type);

            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
    }


/*
    // 3️⃣ Remove unwanted props
    delete nftMeta.compiler;
    delete nftMeta.date;
    
    */
}
 

function live_metaData_update(  nftID,  propName ,  value  ){ 

    const nftMeta = getMetaDataFromID( nftID);

     let attrs = nftMeta.attributes;
        attrs = applyOverride(attrs,  propName ,   value);
        nftMeta.attributes = attrs;
        sortAttributes(nftMeta);
        saveMetaData(nftID, nftMeta );     

}
function saveMetaData( nftID, data ){ 

  const metaPath = getMetaDataPathFromID (nftID);
              
     console.log( ">>metaPath: " ,  metaPath );

    fs.writeFileSync( metaPath  , JSON.stringify( data, null, 2));
}


//================================================================================
//================================================================================
   

 module.exports = {
    writeTraitOnTheseNFTs,
    getALL_NFTIDS,
    Get_value_from_attribute,  get_attirbute, getMetaDataFromID, getMetaDataPathFromID,  getFirstInSet, getFirstInSetList,

    build_PART_GROUP_for_JSX , build_HEAD_BASED_ON_BODY_GROUP_for_JSX,
     getValue_in_trait_type,
     getAllJsonFiles, getIMGPathFromID,

     live_metaData_update, saveMetaData, sortAttributes, applyOverride,


     IGNORED_TRAITS  , IGNORED_ID , ROOT ,TRAIT_ORDER, ignoreID_under,  TRAIT_SLOT, TRAIT_REMOVE_FOR_EXPORT,
 
   projectPath
 
    }


 //===========================================================

