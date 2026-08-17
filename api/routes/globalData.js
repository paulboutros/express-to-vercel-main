 
 
 
 const express = require("express");
const { connectToDataBase } = require("../../lib/connectToDataBase");
// const { connectToDataBase } = require("../lib/connectToDataBase");
const crypto = require("crypto");


 

    const engine =   require("@wulirocks/collection-engine");
    const {rebuildActiveFilterMap} = engine.features_traitFilters; 

   const QueryEngine = require("@wulirocks/collection-engine/query/QueryEngine");
   const rarityCount =  engine.writeServices.get_rarityTraitCount();

   const {getFirstInSet, getALL_NFTIDS } =    engine.metaDataAPI;

  const { FeatureState } = require("@wulirocks/collection-engine/features/FeatureState/featureState.js"); 
  
 

//=======================================================================================
 

const router = express.Router();
   

 
router.post("/api/traitFilter/rebuildActiveFilterMap", (req, res) => {

   const {filterModeABS, serializeActivePills} = req.body;

       console.log(  "api rebuildActiveFilterMap arg "     , filterModeABS  ,"serializeActivePills  "  , serializeActivePills   )

      const result = run_rebuildActiveFilterMap( filterModeABS, serializeActivePills );
   
    
           res.json(result);
});

router.post("/api/traitFilter/set_filterModeABS", (req, res) => {
     const {filterModeABS, serializeActivePills} = req.body;
 
      
  const result = run_rebuildActiveFilterMap( filterModeABS, serializeActivePills );
  
        
    
       
          res.json(result);
});



   router.post("/api/traitFilter/add", (req, res) => {
    const { traitKey, value, ids, objArg } = req.body;
     
      const featState =  new FeatureState({ nameArg: "=======traitFilter/add"});
       const { /*set_featState,*/ rebuildActiveFilterMap} = engine.features_traitFilters; 
    
  
      
        featState.set_filterModeABS(objArg.filterModeABS);
    
    
      rebuildActiveFilterMap(  {  featStateArg:featState,  serializeActivePills: objArg.serializeActivePills});

         const result ={};
             result.filterModeABS = objArg.filterModeABS;
             result.queryMode     = "TRAIT_SEARCH"; 
             result.raw           = "no_raw_input"; 

       // log from API
           
             const suffleIDS = buildDisplayOrder(featState.activeFilterMap_IDS);
            
            result.activeFilterMap_suffleIDS  = suffleIDS;
            result.activeFilterMap_IDS        = featState.activeFilterMap_IDS;
            result.activeFilterMap_IDS_length = featState.activeFilterMap_IDS.length;
           

             console.log( "add trait .activeFilterMap_IDS " ,  suffleIDS  );
        
          res.json(result);
  
 
  // res.json(result);
});

//=======================================================
     router.post("/api/query/runQueryInputHandler", (req, res) => {
      // const { raw } = req.body;
             const obj  = req.body;
 
          //  console.log( "req.body=",req.body   ,   "    obj=", obj  );

     //   const raw = obj.raw;
       
      
     const featState = new FeatureState( 
      {traitCounter_Data: rarityCount, 
        getFirstInSet:getFirstInSet ,
        getALL_NFTIDS:getALL_NFTIDS,
                nameArg: "========state: Inputhandle"
      
       }
    );
       const {rebuildActiveFilterMap} = engine.features_traitFilters; 
  
                          engine.queryEngine.set_rebuildActiveFilterMap(
                    () => rebuildActiveFilterMap({featStateArg: featState} )  
                   // rebuildActiveFilterMap
                  );
         let result = engine.queryEngine.runQueryInputHandler(  obj , featState); //raw

       // this works as alternative to callback above..
       //rebuildActiveFilterMap({featStateArg: featState} );
       
         const suffleIDS = buildDisplayOrder(featState.activeFilterMap_IDS);
         result.activeFilterMap_suffleIDS  = suffleIDS;

      

           if (!result || typeof result !== "object") {
                 result = { "res:raw " : raw   }
        }
      

    res.json(result);
});

 
  router.post("/api/getQueryExample", async (req, response) => {
        const sheetHistData = engine.writeServices.get_sheetGenerationHistory();
         try {
           response.status(200).json( sheetHistData );
      } catch(e){ 
           console.error(e); response.status(500).json(e);
        }

  });

   router.post("/api/generateAllTraitSheet", async (req, response) => {
  
   
             var vidFilter = req.body.videoFilterObject // get_featState().get_VideoFilterObject();
           
            const DEFAULT_CONFIG   =  engine.writeServices.get_UI_DEFAULT_CONFIG();

            //===================  vidFilter endpoint modification ===============================
                  vidFilter.overrideConfig        =  DEFAULT_CONFIG.nftThumb500;
                  vidFilter.activeFilterMap_suffleIDS  =   buildDisplayOrder(vidFilter.activeFilterMap_IDS);

              //   vidFilter.cardToDisplay = "weapon_and_shield";  
                  //vidFilter.cardToDisplay = "nft_id";


          //========================================================================
           /*
              console.log( "/api/generateAllTraitSheet========= vid filter  activeFilterMap_suffleIDS =============================\n " ,
                                     vidFilter.activeFilterMap_suffleIDS  , "\n ",
             "========================== vid filter end =============================  "
            );*/



       
          const sheetHistData = engine.writeServices.get_sheetGenerationHistory();

          let saveKey; 
          let vidFilter_queryDna = null;
          let vidFilter_DSL_search_Dna = null;
           let vidFilter_filterModeABS = "";
         if ( vidFilter.queryMode === "DSL" ){ 
           // vidFilter.dna;  this dna is build from include,inclusive & exclusive combo block trait result
           // and different combo that produce the same nft list result. we prefer dna based on ordered ids list.
             /// vidFilter_queryDna  = String(vidFilter.activeFilterMap_IDS);
                //  vidFilter_queryDna  =    
               const sorted = [...vidFilter.activeFilterMap_IDS].sort((a, b) => a - b);
              vidFilter_queryDna = sorted.join(",");

               vidFilter_DSL_search_Dna = vidFilter.dna
               //querymode does not count here
         }
         if ( vidFilter.queryMode === "TRAIT_SEARCH"){ 
               vidFilter_queryDna      = vidFilter.sheetTitle;
                vidFilter_filterModeABS = vidFilter.filterModeABS;
            
         }
         if ( vidFilter.queryMode === "NFT_SEARCH"){ 
              vidFilter_queryDna       = String(vidFilter.activeFilterMap_IDS);
         }

            vidFilter_queryDna   =  (vidFilter_queryDna +"|"+  vidFilter_filterModeABS);
         /* vidFilter_filterModeABS   = vidFilter.filterModeABS;*/
         
             saveKey =  hashString(vidFilter_queryDna);

              let keyPath = "examples";
           if(vidFilter.containsInvalidBlocks ){
                 keyPath ="containsInvalidBlocks";
           } 
 
              sheetHistData[keyPath][saveKey] ={
               dna:            vidFilter_queryDna,
               search_dna:     vidFilter_DSL_search_Dna,
               raw:            vidFilter.raw,
               queryData:       vidFilter.queryData,


                IDSMatchCount:  vidFilter.activeFilterMap_IDS.length, 
                queryMode:      vidFilter.queryMode  ,
               filterModeABS:  vidFilter.filterModeABS  
            
           }

            if ( sheetHistData[keyPath][saveKey].IDSMatchCount > 0 ){ 
                   engine.writeServices.set_sheetGenerationHistory(sheetHistData);
            }



       /*===========================================================================
                               buffer generation for image rendering  
        ========================================================================= */
         engine.engineState.shared_state.currentPreviewURLList = [];
 
        let result = await engine.layoutSheetGen.generateAllTraitSheet(vidFilter);
 
         let currentPreviewURLList = engine.engineState.shared_state.currentPreviewURLList;
         
         var bufferDataLenghts = [];
             for (let index = 0; index < currentPreviewURLList.length; index++) {
            const datalenght = currentPreviewURLList[index].length;
           
            bufferDataLenghts.push(datalenght);
        }
       try {
          response.status(200).json( {
               bufferCount : currentPreviewURLList.length,
                bufferDataLenghts: bufferDataLenghts,
              
                endpoint: "engine.layoutSheetGen.generateAllTraitSheet()",
                currentPreviewURLList: currentPreviewURLList 
          });
      } catch(e){ 
          console.error(e); response.status(500).json(e);
        }
  
});
//==================================================


router.post("/api/getSiteNavigationData", async (req, response) => {
         let result = await engine.writeServices.getSiteNavigationData();
 
  try {
        response.status(200).json(  result  );
  } catch(e){  console.error(e); response.status(500).json(e);}
 });
 //======================================
 router.post("/api/getPageData", async (req, response) => {
           let result = await engine.writeServices.get_PageData();
 
  try {
       response.status(200).json(  result  );
  } catch(e){  console.error(e); response.status(500).json(e);}
 });
 //======================================
 router.post("/api/getTraitData", async (req, response) => {
 
      let result = await engine.writeServices.get_rarityTraitCount();
      
  try {
       response.status(200).json(   result  );
      
 } catch(e){   console.error(e); response.status(500).json(e);}
 });





router.post("/globalData_setDebugMode",   async (req, response) => {
 
  const value =  req.body.value;
  const ID  = req.body.ID;

      console.log( "value"  , value );
  try {
  const {mongoClient} =   await connectToDataBase();
   
 const db = mongoClient.db("wudb");
 const collection = db.collection("users");
 

 const  filter = {"ID":  ID  }; // Replace with the actual _id value
 const update = {
     $set: { debugMode: value }, // Replace "new_value" with the updated value for debugMode
   
 };
 
        collection.updateOne(filter, update  ); // ,  { upsert: true } it should be created already
 
 response.status(200).json(    {msg:"value modified to: "+ value  });

     
 }      catch(e){  console.error(e); response.status(500).json(e);}
    
 
});


router.post("/api/set_activeFilterMap_IDS", async (req, response) => {
 
   const value = req.body.value;
   console.log( "value"  , value );
  try {
  response.status(200).json( {msg:"value modified to: "  + value  });
      
 } catch(e){   console.error(e); response.status(500).json(e);}
    
 
});


  
 
  // do not forget to use the endpoint in index.js
  router.get("/globalData", async (req, response) => {
   
     try {
       

      const result ={ 
       message:"this all works"
         
      }

  response.status(200).json(result);
   
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})

//===========================================================

function hashString(str) {

    return crypto
        .createHash("sha256")
        .update(str)
        .digest("hex");

}
//====================================================================================


 function hashSeed(str) {

    const hash = crypto
        .createHash("sha256")
        .update(str)
        .digest("hex");

    // Use the first 32 bits
    return parseInt(hash.slice(0, 8), 16);
}
 //=========================================================================
//===============================================================================
// endpoint reusable function 
  function buildDisplayOrder(ids) {

    // console.log("===buildDisplayOrder:", ids );
 
      const seed = hashSeed(ids.join(","));

      return seededShuffle(ids, seed);

}
function seededShuffle(array, seed) {

      const result = [...array];

      const rand = mulberry32(seed);

    for (let i = result.length - 1; i > 0; i--) {

        const j = Math.floor(rand() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}
function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function run_rebuildActiveFilterMap( filterModeABS, serializeActivePills ){
        
     const featState =  new FeatureState( { nameArg: "========ebuildActiveFilterMap"}  );
  
       console.log( "API run_rebuild ActiveFilterMap ======= filterModeABS" , filterModeABS    );
       console.log( "API  serializeActivePills" , serializeActivePills    );
      
     featState.set_filterModeABS(filterModeABS);
  
     rebuildActiveFilterMap(  { featStateArg: featState ,serializeActivePills});
    // rebuildActiveFilterMap(serializeActivePills);
      const result ={};
   
       // send back parameters for conveniencce
       result.filterModeABS = filterModeABS;

       //ACTUAL RESULT from feature object
       result.queryMode =                  featState.queryMode;// just to verify nothing changed in state...      "TRAIT_SEARCH"; 
       
       result.activeFilterMap_IDS =        featState.activeFilterMap_IDS;
       result.activeFilterMap_IDS_length = featState.activeFilterMap_IDS.length;

       const suffleIDS = buildDisplayOrder(featState.activeFilterMap_IDS);
       result.activeFilterMap_suffleIDS  = suffleIDS;


  // hard coded here
       result.raw="no_raw_input"; 
        
     
 return result;
      //===========================================================
}



module.exports = router;

 