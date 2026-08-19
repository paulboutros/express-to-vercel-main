

 
/*==============================================================
==============================================================
      headBodyMixMAP_PATH
 ==============================================================
=============================================================*/
const fs = require("fs");
const allPath = require("../PATH_REGISTRY/PATH.js");
const  {get_rarityTraitCount , get_rarityTraitLength} = require("../storage/writeServices.js");

const { isBaseOfFive } = require("./dataTransform.js");

let MetaDataAPI;
 
 

 /*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/headBodyMixMAP.js').getSpecificCollarMerge()"
 */
 
 let mixeMap = JSON.parse(fs.readFileSync(  allPath.headBodyMixMAP_PATH));
 //const mixDataMap =  mixeMap;// = JSON.parse(fs.readFileSync(  allPath.headBodyMixMAP_PATH));

const traitCounterLength = get_rarityTraitLength();


function getSpecificCollarMerge(){

    



    let H_NoHood_B_HoodList =[];
    let stringQuery ="";
   // const mixeMap = JSON.parse(fs.readFileSync(  allPath.headBodyMixMAP_PATH));
   let incr =0;
    Object.entries(mixeMap).forEach(([key, val]) => {

        let nftIDX =0
        Object.entries(val.mergeWithBodies ).forEach(([mergeBodyKey, mergeBodyVal]) => {
  

            
            if (   mergeBodyVal.headBodyDNA === "H_NoHood_B_Hood"  ) { 
                  nftIDX++;
             //if( nftIDX > 20 )return;
             

                   val.bodies.forEach(el => {

                     if ( isBaseOfFive( el.nftID)    ){
                    //    console.log(  "   el.body   " +  el.body  +  "mergeBodyKey    " +  mergeBodyKey ) ; 
                      if ( String(el.body) === mergeBodyKey  ){ 

                       // const nftID = Number(key) + nftIDX; 
                        const nftID = el.nftID;
                       // if ( H_NoHood_B_HoodList.indexOf( nftID ) === -1  ){ 
                            H_NoHood_B_HoodList.push( nftID );
                            stringQuery += nftID + ","
                        // }

                      }
                    }

                   });

                 




               // }
             }
           //  nftIDX++;
        });
         

    });

    console.log( "stringQuery= (" , H_NoHood_B_HoodList.length , ")",
              stringQuery );
    /*
      #2786,3381,3526,3521,3536,3646,3656,3666,3676,3696,3706,3741,3746,3756,3751,3766,3761,3831,3841,3911,3936,3931,3976,4001,4121,4126,4131,4136,4141,4146,4156,4171,4176,4181,4186,4196,4191,4221,4226,4231,4236,4246,4241,4271,4276,4281,4286,4296,4291,4336 
    
    */
} 

 /*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/headBodyMixMAP.js').create_or_updateHeadMergeInfo()"
 */

function create_or_updateHeadMergeInfo(){ 

 const { getMetaDataFromID,  getValue_in_trait_type,   getFirstInSet } = require("../metadata/MetaDataAPI.js");
 const { set_hoodie_mergeState, setMergeData } = require("./setHeadBodyMerge.js");
   
  //const 
  mixeMap = JSON.parse(fs.readFileSync( allPath.headBodyMixMAP_PATH  ));


   


  const { getActiveFilterMap, get_rarityTraitLength, get_rarityTraitCount } = require("../storage/writeServices.js");
   // getActiveFilterMap
    const activeFilterMap_ID =  getActiveFilterMap().activeFilterMap_ID ;


    let activeBaseIDList =[];
    activeFilterMap_ID.forEach(element => {
      if (  activeBaseIDList.indexOf(element) === -1 ){ 

           const baseID =  getFirstInSet(element); 
          activeBaseIDList.push(baseID);
      }
      
    });

  //   console.log( " =============  activeBaseIDList:"  , activeBaseIDList   );
  //  MetaDataAPI.getFirstInSet(NFTID);
  

    

  let mergeMissingList =[];

 let iter = 0;
 Object.entries(mixeMap).forEach(([key, val]) => {

     // if ( key !== "2121")return;
     if ( activeBaseIDList.indexOf(Number(key))  === -1  ){ 

      return;
     }

   console.log( " =============  nft id:"  , key  , "  val   "  , val );
      // return;


      let testbody =[];
 
       let mergeType="";// headhood_bodyhood,  headhelm_bodyhood  
       let  MERGE_with = "";
       var mixData = val;


      var  headData =  getMetaDataFromID (   val.head  );  // bodyID
          val.horns =  getValue_in_trait_type ( headData.attributes, "HORNS"  ) || "Empty";

           for (let index = 0; index < val.bodies.length; index++) {
                
                const element =  val.bodies[index];
                let bodyNumber = element.body;
                 
                var nftID = Number(key) + index; 
                val.bodies[index] ={ 
                      nftID: nftID,
                      body: bodyNumber

                };


                if (testbody.indexOf(bodyNumber) === -1 ){ 
                    testbody.push(bodyNumber); 

                 var  bodyData =  getMetaDataFromID (   bodyNumber  );  // bodyID

                // var mergeObject =set_hoodie_mergeState( bodyNumber, val.head, bodyData  );
                  //  MERGE_PATH =  
                   const { MERGE_PATH,bodyHood,headHood,
                          head_color  ,cape_color
 
                   } = set_hoodie_mergeState( bodyNumber, val.head, bodyData  );   
              

                    MERGE_with  =  setMergeData ( bodyNumber,  bodyData  );
 
                   // final data object

  
                  if( !mixData.mergeWithBodies ){ 
                        mixData.mergeWithBodies = {};
                    }
                   // if( !mixData.mergeWithBodies[bodyNumber]){   
                      mixData.mergeWithBodies[bodyNumber] = {};
                   // }
                    mixData.mergeWithBodies[bodyNumber].MERGE_with = MERGE_with;
                    mixData.mergeWithBodies[bodyNumber].colorMatch = MERGE_PATH == "MERGE/"? false:true ;// ? false:true ;
                    
                   
                    mixData.mergeWithBodies[bodyNumber].headHood = headHood;
                    mixData.mergeWithBodies[bodyNumber].bodyHood = bodyHood; 

                    mixData.mergeWithBodies[bodyNumber].head_color = head_color;
                    mixData.mergeWithBodies[bodyNumber].cape_color = cape_color; 
                    

                   let headBit = headHood? "H_Hood":"H_NoHood";
                   let bodyBit = bodyHood? "B_Hood":"B_NoHood";

                   mixData.mergeWithBodies[bodyNumber].headBodyDNA =headBit +"_"+ bodyBit;
                        
 
    
                 //  console.log( "nft id:"  , key  ,  "mixData :" , mixData );
 

 


             }
 
           }
       //  if (testbody.indexOf(  valbodies))

     if (  !val.mergeWithBodies ){ 

           
              //set_hoodie_mergeState( )
           //    mergeMissingList.push( key );
     }

     mixeMap[key] = mixData ;
});


     let writeToFile = true;
  if(!writeToFile)return; 

  fs.writeFileSync(  allPath.headBodyMixMAP_PATH  , JSON.stringify(  mixeMap  , null, 2));
console.log(  mergeMissingList.length , " merge info are missing. List:", mergeMissingList  )
}


/*
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/headBodyMixMAP.js').call_groupBodiesByHead()"
 */


function call_groupBodiesByHead(){ 

  
  const mixeMap = JSON.parse(fs.readFileSync( allPath.headBodyMixMAP_PATH  ));

 //var  comboControl = groupBodiesByHead( mixeMap );
 const counts = countHeadBodyCombos(mixeMap, 0);

Object.entries(counts).forEach(([combo, count]) => {
  if (count > 5) {
    console.log("Overused combo:", combo, "used", count, "times");
  }
});
  
 fs.writeFileSync(  allPath.headBodyComboControl_PATH  , JSON.stringify( counts , null, 2));

}

 function countHeadBodyCombos(data) {
  const comboCounts = {};

  Object.values(data).forEach(item => {
    const head = item.head;

    item.bodies.forEach(part => {
      const body = part.body;
      const key = `${head}_${body}`;

      comboCounts[key] = (comboCounts[key] || 0) + 1;
    });
  });

  return comboCounts;
}


/*  f
node -e "require('D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/headBodyMixMAP.js').call_addEntrynFT()"
 */
function call_addEntrynFT(){ 

const mixeMap = JSON.parse(fs.readFileSync( allPath.headBodyMixMAP_PATH    ));
  
 addNFTEntry(mixeMap, "4311", 1915,
    [ { value: 561, count: 5 }, { value: 584, count: 5 }]
  
 );

fs.writeFileSync(  allPath.headBodyMixMAP_PATH  , JSON.stringify( mixeMap , null, 2));
 
}

function addNFTEntry(jsonData, key, headValue, bodyConfigs) {
  const bodiesArray = [];

  bodyConfigs.forEach(config => {
    for (let i = 0; i < config.count; i++) {
      bodiesArray.push({ body: config.value });
    }
  });

  jsonData[key] = {
    destNFTID: Number(key),
    head: headValue,
    bodies: bodiesArray
  };

  return jsonData;
}


// abs ids
function getMixInfoABS(NFTID) { 

  if (!MetaDataAPI ){ 
      MetaDataAPI = require("../metadata/MetaDataAPI.js");
  }
  
     

     const idBase =  MetaDataAPI.getFirstInSet(NFTID);// selectedNFTFirstNumber[0];
     var frame = NFTID - idBase;
     


  // console.log("NFTID:" ,NFTID , " idBase:", idBase , " frame: " ,  frame  );

    // return;
     return getMixInfo(idBase, frame );
}

function getMixInfo(idBase, frame /* , mixDataMap*/ ) {

    
  idBase = String(idBase);

//  const mixeMap =  mixeMap;// = JSON.parse(fs.readFileSync(  allPath.headBodyMixMAP_PATH));
  if (mixeMap[idBase]) {

    mixInfo = {
      mainBody: mixeMap[idBase].bodies[frame].body,
      head: mixeMap[idBase].head,
    };
    mixInfo.bodyLength = traitCounterLength["_BODY_"][mixInfo.mainBody];
    mixInfo.headLength = traitCounterLength["_HEAD_"][mixInfo.head];

    return mixInfo;

  };


  return null;
}

function get_mixMsg( idBase, frame  ){
     let mixInfo;
    let mixMsg;


        mixInfo = getMixInfo( idBase , frame  , mixeMap );
    
    if( mixInfo ){ 
        mixMsg = `BODY:${mixInfo.mainBody} (${mixInfo.bodyLength}) HEAD:${mixInfo.head}(${mixInfo.headLength}) `;
      //  WEAP:${mixInfo.weapon} SHIELD:${mixInfo.shield}`;
    }else{ 
        mixMsg="";
    }

      return mixMsg;

 }


module.exports = { 
   call_addEntrynFT,
   call_groupBodiesByHead,
   create_or_updateHeadMergeInfo ,
   getSpecificCollarMerge ,


   getMixInfo, get_mixMsg,


   getMixInfoABS
}



 
     