 
 

 /*
const { IGNORED_TRAITS , IGNORED_ID ,
  
    ignoreID_under, 
  Get_value_from_attribute, get_attirbute 
} = require("../metadata/MetaDataAPI.js");
const { nodeRunThis, scriptObj } = require("../services/nodeRunScript");
const { buildNftTraitMap, call_invertObject } = require("../DATA_TRANSFORM/dataTransform");

const {getAllJsonFiles , filemanager }  =
      require("../services/writeServices.js");
 

const traitOverrideNames_invers = call_invertObject();//    JSON.parse(fs.readFileSync( traitOverrideNames_inversPATH )); 
let weaponDistribution = filemanager.weaponDistribution.load();
  */




 

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


// a copy exist  in metadataAPI.js
// Recursively walk root folder and return all JSON file paths
 
const saveFile =  true;
 const saveConfig ={
        tierCount:  false,
        nftTraitMap:  false,
        nftGenotype: false,
        generateCards:  false,

        weaponDistrib :false,

        computeClan : false,

 }




export function rebuildRarityCount( metadataCollection ){
 
     // weapon distribution  ======================
       const weapon_trait  = traitCounter ["WEAPON"];

     //  weaponDistribution["WEAPON"]={ };
     //  weaponDistribution["SHIELD"]={ };

     //===========================================
  
     traitCounter = {};
     traitCounterLength ={};
     undedefinedNFT=[];
     skippedFoWrongTrait=[];
     nft_checked_count = 0;
     attr_checked_count =0; 
 
 


 //===================================================================================
   //===
 
  //console.log( "jsonFiles :  ", jsonFiles );
   
   Object.entries(metadataCollection).forEach(([idString, data]) => {

     const id = parseInt(idString, 10);

      if (!data.attributes) return;
 
      /*
    var COLORSQN   =   get_attirbute(data.attributes,  "COLORSQN"  );
   if ( !COLORSQN) return;
   if (  COLORSQN.value === Undefined ) {

      undedefinedNFT.push(id);
      return;
   }*/ 
   



 //===================================================================================

var META_TYPE = get_attirbute(data.attributes,  "SHOULDER"  );
    if (META_TYPE)  { 
          if (  META_TYPE.value     ===  "Gray Warfur" ){   
             
               META_TYPE.value     = "Black Warfur";
        }
     }
      if (META_TYPE)  { 
         if (  META_TYPE.value     ===  "Blueish Warfur" ){    
            //   META_TYPE.value     = "Black Warfur";
        }
     }  
//===================================================================================

var META_TYPE = get_attirbute(data.attributes,  "LEGWEAR"  );
    if (  META_TYPE)  { 
         if (  
               META_TYPE.value     === "Blueish Boots"
           ){ 
             ignored_nft.push(id);
             return; 
        }
    }  

    

//=========================================================================================

     nft_checked_count++;
  
   /*
     if (  IGNORED_ID.indexOf(id) !== -1 ){ 
         ignored_nft.push(id);
        return;
     }*/
     

     //===============================================================================
      if ( !saveFile ) return;
     //===============================================================================

      data.attributes.forEach(attr => {
        const type = attr.trait_type;
        const value = attr.value;

          attr_checked_count++;

      
        
         let clan_defined = false;

  

         if (!traitCounter[type]) { traitCounter[type] = {};}
         if (!traitCounter[type][value]) { traitCounter[type][value] = [];}

         if (!traitCounterLength[type]) {  traitCounterLength[type] = {};}
         
         if (!traitCounterLength[type][value]) { traitCounterLength[type][value] = 0;}
          
         
          traitCounterLength[type][value] ++;
          traitCounter[type][value].push(id);


          if (saveConfig.computeClan ){ 
               computeCLANDistributionFor(  data, type, value );
         }



      });
    });


if(!saveFile)return;

// create traitoverride trait INVERSE map;
  // call_invertObject();  //call_invertObject
  /*  ========================================
                        TIERS COUNT 
      ====================================================
  */
 if (  saveConfig.tierCount){ 
  run_tiersCount( traitCounterLength , traitOverrideNames_invers );
  }
 
//=================     ===============================================
/* 
      end of tiers count

*/
//====================================================================================
 
 
 
//====================================================================================

if (  saveConfig.weaponDistrib    ){ 


var weapShieldCombo = filemanager.weaponShieldcombo.load();   //  JSON.parse(fs.readFileSync(weaponShieldcomboPATH, "utf8") )   ;
 var nftMap = weapShieldCombo.nftMap ;
const patternToNfts = invertNftMap( nftMap  );

// ensure traitCounterLength slot exists
//  if (!traitCounterLength["WEAPON_PAT"]) {  traitCounterLength[ "WEAPON_PAT"] = {};}
 traitCounter["WEAPON_PAT"] = patternToNfts;
  
// add to count file
const patternCounts = {};
 for (const nftId in nftMap) {
  const patname = nftMap[nftId].patname;
  patternCounts[patname] = ( patternCounts[patname]  || 0) + 5; //we add 5 for each occurence

  
}
traitCounterLength["WEAPON_PAT"] = patternCounts;



}
//====================================================================================

//====================================================================================
 if (  saveConfig.weaponDistrib    ){ 
    var nftMaskMap = weapShieldCombo.nftMaskMap ;
    const maskPat_ToNfts = invertNftMap( nftMaskMap  );

    // ensure traitCounterLength slot exists
    //  if (!traitCounterLength["WEAPON_PAT"]) {  traitCounterLength[ "WEAPON_PAT"] = {};}
    traitCounter["MASK_PAT"] = maskPat_ToNfts;
      
    // add to count file
    const msk_patternCounts = {};
    for (const nftId in nftMaskMap) {
      const patname = nftMaskMap[nftId].patname;
      msk_patternCounts[patname] = ( msk_patternCounts[patname]  || 0) + 5; //we add 5 for each occurence

      
    }
    traitCounterLength["MASK_PAT"] = msk_patternCounts;
}


     /*
     filemanager.traitCounter.save(traitCounter)
     filemanager.traitCounterLength.save(traitCounterLength)
     */
    /*
    //=================== weapon distribution ======================================
    if (saveConfig.weaponDistribution) {
        filemanager.weaponDistribution.save(weaponDistribution);
       
    }*/

    //======================================================
    //========================= UPDATE DISTRIBUTION CARD =============================
if (saveConfig.generateCards) {
    nodeRunThis(scriptObj.chartGeneration.script,["clear_then_regenerate_cards"]);
}

   
    
    if (saveConfig.nftGenotype) {
      const nftTraitMap =  buildNftTraitMap(traitCounter);
        filemanager.nftGenotype.save(nftTraitMap);
     
    }

    console.log("✔ traitCounter.json created successfully!");
   // console.log(`Processed ${jsonFiles.length} JSON files.`);
  let msg;
    msg =(`✅✔ traitCounter.json created successfully! \n

         Processed ${nft_checked_count} NFTs. \n
          undedefinedNFT count: ${undedefinedNFT.length }  . \n
          not included(Wrong Trait) count: ${skippedFoWrongTrait.length }  . \n
           
           ignored_nft: ${ignored_nft.length }  . \n
         
           checked ${attr_checked_count} attributes
       `);

   //   if (window){
           notify(msg);
         //alert(msg);
     // }else{ 
        // console.log(msg);
     //  }
 
// Processed ${jsonFiles.length} JSON files. \n
    return  { 
               traitCounter
            }
}
    
 

function notify(message) {
    if (typeof alert !== "undefined") {
        alert(message);           // Electron / JSX / browser
    } else {
        console.log(message);     // Node / CLI
    }
}

// create weapon/shield distribution per clan
function computeCLANDistributionFor(   data, type, value ){ 

     let clan;
     if ( type === "WEAPON" || type === "SHIELD"  ){ 

       clan = Get_value_from_attribute( data.attributes, "CLAN");
     }

    if ( type === "WEAPON" || type === "SHIELD"  ){ 
            if ( !weaponDistribution[type][ value ] ){ 
                  weaponDistribution[type][ value] = {  }
             } 
               
               
                 if (  !weaponDistribution[type][value][clan] ){ 
                        weaponDistribution[type][value][clan] = 0
                 }  
                 weaponDistribution[type][value][clan]++;


             
         }

}
 
function invertNftMap(nftMap) {
  const result = {};

  for (const nftId in nftMap) {
    const patname = nftMap[nftId].patname;

    if (!result[patname]) {
      result[patname] = [];
    }
 
      result[patname].push(Number(nftId)  );
      result[patname].push(Number(nftId)+1)
      result[patname].push(Number(nftId)+2)
      result[patname].push(Number(nftId)+3)
      result[patname].push(Number(nftId)+4)

  }

  return result;
}
 
//============================================
 
/*
const TIER_RULES = [
  { name: "common",    min: 120, max: Infinity, targetCount: 6 },
  { name: "uncommon",  min: 60,  max: 119,      targetCount: 7 },
  { name: "rare",      min: 20,  max: 59,       targetCount: 5 },
  { name: "epic",      min: 7,   max: 19,       targetCount: 3 },
  { name: "legendary", min: 1,   max: 6,        targetCount: 2 }
];
*/

function categorizeWeaponsByTier(dataCount, TIER_RULES, mapKey, traitOverrideNames_invers ) {

   
 //itemType  = mask, shield, weapon

  const tiers = Object.fromEntries(
    TIER_RULES.map(rule => [
      rule.name,
      {
        targetCount: rule.targetCount,
        currentCount: 0,
        range: [rule.min, rule.max],
        content: {}
      }
    ])
  );

  Object.entries(dataCount).forEach(([itemType, count]) => {
    const tierRule = TIER_RULES.find(rule =>
      count >= rule.min && count <= rule.max
    );

    if (tierRule) {

    // we use the revert overrideNames because pattern editor use internal names
    

      var internalName = traitOverrideNames_invers[mapKey] [itemType];

       
      tiers[tierRule.name].content[internalName] = count;
     // tiers[tierRule.name].content[weapon] = count;
    }
  });

  
  Object.values(tiers).forEach(tier => {
  const sortedEntries = Object.entries(tier.content)
    .sort((a, b) => b[1] - a[1]); // highest count first

  tier.content = Object.fromEntries(sortedEntries);

  tier.currentCount = sortedEntries.length;

  if (tier.currentCount !== tier.targetCount) {
    tier.warning = `Expected ${tier.targetCount}, found ${tier.currentCount}`;
  }
   });



  return tiers;
}


function run_tiersCount( traitCounterLength , traitOverrideNames_invers  ){ 

   if (!saveConfig.tierCount)return;

   const rarityTiersData = filemanager.tiersCount.load();//  JSON.parse(fs.readFileSync(tierCountPATH, "utf8") );
 
    const rulesWP = rarityTiersData.TIER_RULES["WEAPON"];
    const rulesSH = rarityTiersData.TIER_RULES["SHIELD"];
    
    // set output
    rarityTiersData.TIER_RULES["WEAPON"] = rulesWP; // keep config in file
    rarityTiersData.TIER_RULES["SHIELD"] = rulesSH; // keep config in file

    rarityTiersData.WEAPON  =  categorizeWeaponsByTier(   traitCounterLength["WEAPON"]  , rulesWP , "weapon" , traitOverrideNames_invers);
    rarityTiersData.SHIELD  =  categorizeWeaponsByTier(   traitCounterLength["SHIELD"]  , rulesSH , "shield" ,traitOverrideNames_invers );

   filemanager.tiersCount.save(rarityTiersData);
   // fs.writeFileSync(tierCountPATH,  JSON.stringify(rarityTiersData, null, 2));
   
}

function debug_run_tiersCount(){  
 
  const traitCounterLength = filemanager.traitCounterLength.load();//   get_rarityTraitLength();
  //JSON.parse(fs.readFileSync(   traitCounterLengthPATH    )); 

     run_tiersCount( traitCounterLength , traitOverrideNames_invers );
}

if (typeof window !== "undefined") {
    window.debug = window.debug || {};
       window.debug.debug_run_tiersCount = debug_run_tiersCount;
}
/*
 debug.debug_run_tiersCount() 
*/
 
 

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