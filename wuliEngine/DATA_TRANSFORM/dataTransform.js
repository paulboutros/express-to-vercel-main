
const fs = require("fs");
 


 

function invertObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[value] = key;
  }
  return result;
}

function call_invertObject(){ 
     
const { traitOverrideNamesPATH , traitOverrideNames_inversPATH} = require("D:/GIT/wuliEngine/PATH_REGISTRY/PATH.js");

    const traitOverrideNames = JSON.parse(fs.readFileSync(traitOverrideNamesPATH, "utf8"));

    let traitInvers  = { }
    for ( key in traitOverrideNames ){ 

        var obj = invertObject ( traitOverrideNames[key] );
        traitInvers[key] = obj;
    }

    fs.writeFileSync(
           traitOverrideNames_inversPATH ,    
      JSON.stringify(traitInvers, null, 2)
    );


     return traitInvers;
}


// reverse map builder
function buildNftTraitMap(traitMap) {

  const keepTraits = ["CLAN", "CLASS"];
  const nftMap = {};

  Object.entries(traitMap).forEach(([traitType, traitValues]) => {
    Object.entries(traitValues).forEach(([traitName, nftIds]) => {

      if (!keepTraits.includes(traitType)) return;
      nftIds.forEach(nftId => {
        if (!nftMap[nftId]) {
          nftMap[nftId] = {};
        }

        nftMap[nftId][traitType] = traitName;
      });
    });
  });

  return nftMap;
}

function isBaseOfFive(id) {
  return (id % 10 === 1 || id % 10 === 6);
}

module.exports = { 
  call_invertObject, buildNftTraitMap ,

  invertObject,

  isBaseOfFive

}



/*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/dataTransform.js').call_invertObject()"
*/