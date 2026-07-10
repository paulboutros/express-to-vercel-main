 
 
 
 const express = require("express");
const { connectToDataBase } = require("../../lib/connectToDataBase");
// const { connectToDataBase } = require("../lib/connectToDataBase");

 

const engine = require("@wulirocks/collection-engine");
 

 const QueryEngine   = require("@wulirocks/collection-engine/query/QueryEngine");


 //================================================================================================================
 //=================================================================================================================

 /*
   const { featState } = require("@wulirocks/collection-engine/features/FeatureState/featureState.js");    
   const { 
           get_featState,
           set_featState,
           createTraitFilterFeature,
           applyTraitFilter , 
           rebuildActiveFilterMap
      } = engine.features_traitFilters; 
                     // require("@wulirocks/collection-engine/features/traitFilters/createTraitFilterFeature.js");
    set_featState(featState);
  
    const traitFilterFeature = createTraitFilterFeature(  
    null,// featState,
    {   
       onTraitAdded(payload) {
       applyTraitFilter(payload.traitKey, payload.value, payload.ids);
       rebuildActiveFilterMap();
     } 
    });
*/
 //=======================================================================================
 //====================  api result/session state =====================================

 let runQueryInputHandler_result = null;

//=======================================================================================
 

const router = express.Router();
   

 router.post("/api/traitFilter/add", (req, res) => {
    const { traitKey, value, ids, traitFilterData } = req.body;
 

     //====================================  moved from global to this route========================================================
     //===============================================================================================
  
   const { FeatureState } = require("@wulirocks/collection-engine/features/FeatureState/featureState.js");    

   const featState = new FeatureState();
   const { 
    
           get_featState,
           set_featState,
           createTraitFilterFeature,
           applyTraitFilter , 
           rebuildActiveFilterMap
      } = engine.features_traitFilters; 
                     // require("@wulirocks/collection-engine/features/traitFilters/createTraitFilterFeature.js");
     set_featState(featState);
  
    const traitFilterFeature = createTraitFilterFeature(  
    null,// featState, // i used set_featState() function above instead
    {   
       onTraitAdded(payload) {
        applyTraitFilter(payload.traitKey, payload.value, payload.ids);
        rebuildActiveFilterMap(  featState.getTraitUIResult().pills );

     console.log( "==================================================== \n" ,
                  "==================================================== \n" ,
                   "================ get_featState().activeFilterMap_IDS===: \n" ,

                           featState.activeFilterMap_IDS ,   "  \n" , 
            "====================================================  "  
     )
        
      } 
    });
      //getTraitUIResult
 

      console.log( "  traitFilterData === =====   "   ,  traitFilterData  );
     //===============================================================================================
    //===============================================================================================
    //===============================================================================================
   const result = traitFilterFeature.addTraitSelection( traitKey, value, ids ,traitFilterData );
    
  
  //===================================================================================================
        result.activeFilterMap_IDS = featState .activeFilterMap_IDS;
      // const pillsData =   get_featState().serializeActiveTraitUI();
      //  console.log( "API trait/add pillsData :"  , pillsData   );











 
       result.queryMode ="TRAIT_SEARCH"; 
       result.raw="no_raw_input"; 
        
      // runQueryInputHandler_result = result;
 
  res.json(result);
});

 
router.post("/api/traitFilter/rebuildActiveFilterMap", (req, res) => {
   const { traitType, value, uiResult } = req.body;
  
  const pillData  = uiResult.pills;
     
        const {   rebuildActiveFilterMap , applyTraitFilter } = engine.features_traitFilters; 
     
         console.log(  "  req.body  pillData  =" , pillData  );

     // applyTraitFilter(payload.traitKey, payload.value, payload.ids);
    //  const result = rebuildActiveFilterMap( pillData);


       const rarityCount =  engine.writeServices.get_rarityTraitCount();

        const idsToRemove =  rarityCount[traitType][value];
     result  = { idsToRemove :  idsToRemove   }
    
     // result  = { "ready to send: pillData " : pillData   }
  res.json(result);
});

router.post("/api/traitFilter/set_filterModeABS", (req, res) => {
   const { filterModeABS } = req.body;
  
       get_featState().set_filterModeABS(filterModeABS);
      //  console.log(  "  filterModeABS  =" , filterModeABS  );
        
    
       result  = { "res:set_filterModeABS " : filterModeABS   }
  res.json(result);
});

//=======================================================
router.post("/api/query/runQueryInputHandler", (req, res) => {
    const { raw } = req.body;
  
         let result = engine.queryEngine.runQueryInputHandler(raw);

        // runQueryInputHandler_result = result;
             //  console.log(  " runQueryInputHandler result  =" , result  );
        
         if (!result || typeof result !== "object") {
               result = { "res:raw " : raw   }
        }
      

  res.json(result);
});

 
 
  router.post("/api/generateAllTraitSheet", async (req, response) => {
  
  
             // const {batchNumber}  = req.body;
             var vidFilter = req.body.videoFilterObject // get_featState().get_VideoFilterObject();
              //  vidFilter.batchNumber = batchNumber;
              //  vidFilter.queryMode = runQueryInputHandler_result.queryMode ;
              //  vidFilter.raw =       runQueryInputHandler_result.raw ;
             // vidFilter.queryDNAObj = runQueryInputHandler_result.queryDNAObj;
 


             console.log( "========================== vid filter =============================\n " ,
                                     vidFilter  , "\n ",
             "========================== vid filter end =============================  "

         );


       
         const sheetHistData = engine.writeServices.get_sheetGenerationHistory();

         let saveKey;// = runQueryInputHandler_result.queryDNAObj.queryDna;
         if ( vidFilter.queryMode === "DSL" ){ 
             saveKey =  vidFilter.queryDna;
         }else{ 
             saveKey =  vidFilter.sheetTitle   // runQueryInputHandler_result.queryDNAObj.queryDna;
         }
         /*
          result.queryDNAObj ={ 
          queryMode :"TRAIT_SEARCH",
          raw:"no_raw_input", 
          pillsData: pillsData
      }*/


          sheetHistData[saveKey] ={ 
               IDSMatchCount:  vidFilter.activeFilterMap_IDS.length,//     ["IDS Match Count"],
               queryMode:      vidFilter.queryMode ,
               raw:            vidFilter.raw //,
             //  queryDNAObj:    runQueryInputHandler_result.queryDNAObj
           }

         engine.writeServices.set_sheetGenerationHistory(sheetHistData);

         engine.engineState.shared_state.currentPreviewURLList =[];
 
         let result = await engine.layoutSheetGen.generateAllTraitSheet( 
             vidFilter//    req.body
         );

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

 router.post("/api/getTraitData", async (req, response) => {
 
      let result = await engine.writeServices.get_rarityTraitCount();
      //  console.log( " getTraitData result "   , result  );
  try {
      response.status(200).json(  result  );
      
 } catch(e){  console.error(e); response.status(500).json(e);}
    
 
});





router.post("/globalData_setDebugMode", async (req, response) => {
 
  const value = req.body.value;
  const ID  = req.body.ID;

  console.log( "value"  , value );
  try {
 const {mongoClient} = await connectToDataBase();
   
 const db = mongoClient.db("wudb");
 const collection = db.collection("users");
 

 const filter = { "ID": ID  }; // Replace with the actual _id value
 const update = {
   $set: { debugMode: value }, // Replace "new_value" with the updated value for debugMode
   
 };
 
 collection.updateOne(filter, update  ); // ,  { upsert: true } it should be created already
 
 response.status(200).json( {msg:"value modified to: "+ value  });

     
 } catch(e){  console.error(e); response.status(500).json(e);}
    
 
});


router.post("/api/set_activeFilterMap_IDS", async (req, response) => {
 
  const value = req.body.value;
   console.log( "value"  , value );
  try {
  response.status(200).json( {msg:"value modified to: "+ value  });
      
 } catch(e){  console.error(e); response.status(500).json(e);}
    
 
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
module.exports = router;

 