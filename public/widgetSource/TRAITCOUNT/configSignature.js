

  const fs = require('fs');
  
  const fsp = require("fs").promises;
  
   
  const path = require('path');
  const { exec } = require('child_process');
  const { shell } = require('electron');

  const Undefined = "Undefined";
  

SLOT_CODES = {
      "TYPE" :"TP",
      "LEGWEAR" :"LW",
       "HANDGEAR" :"HW",
      "TORSO" :"TS",
      "SHOULDER"  :"SH",
      "CAPE" :"CP",
     "HIPGEAR" :"HG",
     "WEAPON" :"WP",
      "SHIELD" :"SH", 
      "HEAD" :"HD",
      "HELMCREST" :"HC",
      "HORNS" :"HR",
       "FACEGEAR" :"MK" 
 }

 BODY_LOADOUT_CODES = {

    "NAKED_BAREFEET_WRAPS_AND_GLOVES": "NBFWG",//  # no boots, wraps + gloves
    "NAKED_NOBOOT_AND_BALTEA": "NNBB",          // # naked, baltea only
    "NAKED_BOOT_AND_BALTEA": "NBBA",
    "NAKED_BOOT_WRAPS_AND_GLOVES": "NBWG",
    "PANT_BOOT_AND_NO_BALTEA": "PB0B",
    "NO_SHIRT_PANT_BOOT_AND_BALTEA": "NSPBB",
    "FULL_PANT_AND_SHIRT_NO_HIPGEAR": "FPS0H",

    //# Torso override variants
    "NAKED_BOOT_WRAPS_AND_GLOVES_TORSOALL": "NBWG+T",
    "FULL_PANT_AND_SHIRT_NO_HIPGEAR_TORSOALL": "FPS0H+T"
}

  const WEAPON_CODES = {
  "saber": "W_SAB01",
  "spear": "W_SPE01",
  "sword": "W_SWD01",
  "hammer": "W_HAM01",
  "axe"  : "W_AXE01",
  "staff": "W_STF01",
  "Wyrmbone Scythe": "W_SCY01",
  "Spineharrow": "W_SCY02",
  "undefined": "W_NONE"
};

 const SHIELD_CODES = {
  "01": "S_RND01",
  "02": "S_RND02",
  "04": "S_RND04",
  "05": "S_RND05",

  "undefined": "S_NONE"
};
const TORSO_CODES = {
  " Fur": "T_FUR",
  "Shark Teeths": "T_SHT",
  "skull corde": "T_SKC",
  " Wildroot Carapace": "T_WRC",
  "Single Baldric": "T_SBA",
  "Bare": "T_BAR",
  
  "undefined": "T_NONE"
};

const HEAD_CODES = {
  "Hood": "H_HO",
   "Hood Down": "H_HOD",
 
  "Dragon Helm": "H_DRH",
  "Helm": "H_HLM",
  "Wolf Helm": "H_WHE",
  "Wolf Hood": "H_WHO",
  
  "undefined": "H_NONE"
};

const MASK_CODES = {
  "msk01": "M_MSK1",
   "msk02": "M_MSK2",
   "msk03": "M_MSK3",
  "MM_SEL02_UNDER": "M_MS2U",
  "eyevis": "M_EVI",
  "Slitted": "M_SLIT",
 "maskUnderHoodie": "M_MUH",
"MMaskRoot": "M_MR",
"MMaskRoot_UNDER": "M_MRU",

"mechaskull": "M_MCSK",
 
  
  
  "undefined": "M_NONE"
};

const HORN_CODES = {/*
    "Abyssal Horns":"A_ABY",
    "Dragon Scale Horns":"A_DGS",
    "Elderwood Horns":"A_ELD",
    "fenecShapeEar":"A_FNC",
    "Occult Sentinel Horns":"A_OSH",
    "Worned Sentinel Horns":"A_WSH",
    "soft wood horns":"A_SWH" ,

    "Skyward":"A_SKW" ,
    "Celest":"A_CLS" ,
  */
  "basicHorn": "A_BH",
  "cellHorn_A_color": "A_CHA",
  "cellHorn_B": "A_CHB",
  "cellHorn_C": "A_CHC",
     "hocel": "A_HOC",
     "bear_ear": "A_BEA",
  
  "undefined": "A_NONE"
};

const TYPE_CODES = {
  "Orc": "TY_ORC",
  "Skeleton": "TY_SKE",
     
};
const CAPE_CODES = {
"capeAroundNeck":"CP_AN",
"capeHide":"CP_HID",
"capeAroundNeck2":"CP_AN2",
"hoodie_wolfHead":"CP_WH",
"hoodie_cape":"CP_HC",

"hoodCapeDown":"CP_HCD",
"capeShort_Halo1":"CP_SH1",

"undefined":"CP_NONE" 
}


/*
function run(){

const finalTraitPass1_Data =  JSON.parse(fs.readFileSync( jsonPath , 'utf8'));

 
 
  //================================================================
// sorting display Order


const orderedKeys = getOrderedKeys();  
   
//let dispOrder = 0;
for (var key in configurationdata ){   
    const nft = configurationdata[key];
    if (!nft || !nft.NFToutput) return;


 } ;




}
run();
*/


function processDNAData( attrResult ){ 
    
  //const nftID = Number(key);
 
   const bodyConfig  =  attrResult.bodyConfig;
   const weapon      =  attrResult.weapon;
   const shield      =  attrResult.shield;
   const torso        = attrResult.torso; 
   const head         = attrResult.head;
   const mask          = attrResult.mask; 
   const horn         =  attrResult.horn; 
   const charaType    =  attrResult.charaType;

      const cape         =  attrResult.cape; 

   //============================
   const bodyCode = BODY_LOADOUT_CODES[bodyConfig] || "B_UNK";
   const torsoCode = TORSO_CODES[torso] || "T_UNK";
   const headCode =  HEAD_CODES[head] || "H_UNK";
   const maskCode =  MASK_CODES[mask] || "M_UNK";
   const hornCode =  HORN_CODES[horn] || "HO_UNK";
   const capeCode =  CAPE_CODES[cape] || "CP_UNK";
 
   const charaTypeCode =  TYPE_CODES[charaType] || "TY_UNK";

   const weaponCode = WEAPON_CODES[weapon] || "W_UNK";
   const shieldCode = SHIELD_CODES[shield] || "S_UNK";
  
  return `${bodyCode}|${charaTypeCode}|${headCode}|${hornCode}|${capeCode}|${maskCode}|${torsoCode}|${weaponCode}|${shieldCode}`;


} 

function  generateDNA( prop,  val ) {

   return prop + ":"+ val  ;
}



module.exports ={

    SLOT_CODES  , BODY_LOADOUT_CODES , generateDNA, processDNAData
}