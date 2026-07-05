 
 
 
 const express = require("express");
const { connectToDataBase } = require("../../lib/connectToDataBase");
// const { connectToDataBase } = require("../lib/connectToDataBase");

 

const engine = require("@wulirocks/collection-engine");
 
 const { featState } = require("@wulirocks/collection-engine/features/FeatureState/featureState.js");
 const QueryEngine   = require("@wulirocks/collection-engine/query/QueryEngine");
  
       const { 
           get_featState,
           set_featState,
           createTraitFilterFeature,
               applyTraitFilter , 
              
              rebuildActiveFilterMap
            } = engine.features_traitFilters; 
                     // require("@wulirocks/collection-engine/features/traitFilters/createTraitFilterFeature.js");
    set_featState(featState);
    //console.log( "route load createTraitFilterFeature  " , createTraitFilterFeature  );

//import {updateActiveTraitBar} from "/wuli-ui/filterPills.js";

//console.log( " api script updateActiveTraitBar  " , updateActiveTraitBar );

    const traitFilterFeature = createTraitFilterFeature(  
         null,// featState,
         {   
            onTraitAdded(payload) {

              //  console.log( " == CREATE WEB UI  PILLS =====  with data:  ["  ,  payload  )
               
                   applyTraitFilter(payload.traitKey, payload.value, payload.ids);
              
                   rebuildActiveFilterMap();
                  
             //  traitFilterController.applyTraitFilter(payload.traitKey, payload.value, payload.ids);
             //  traitFilterController.updateActiveTraitBar();// contains or full DOM
            } 
           // ,jjjj(){}
          }


);
 

const router = express.Router();
   

 router.post("/api/traitFilter/add", (req, res) => {
  const { traitKey, value, ids, traitFilterData } = req.body;
 
  const result = traitFilterFeature.addTraitSelection(
   
     traitKey,
     value,
    ids 
  );
 
 
  res.json(result);
});

 
router.post("/api/traitFilter/rebuildActiveFilterMap", (req, res) => {
   const { pillData } = req.body;
  

       // console.log(  "  req.body  pillData  =" , pillData  );
       const result = rebuildActiveFilterMap( pillData);
    
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
            console.log(  " runQueryInputHandler result  =" , result  );
        
        if (!result || typeof result !== "object") {
              result = { "res:raw " : raw   }
        }
      

  res.json(result);
});

 
 
  router.post("/api/generateAllTraitSheet", async (req, response) => {
 
     //const value = req.body.value;
    const renderTraitObject  = req.body.renderTraitObject;

     // console.log( " engine.layoutSheetGen.generateAllTraitSheet();"    );
       let result = await engine.layoutSheetGen.generateAllTraitSheet( renderTraitObject  );

        let currentPreviewURLList = engine.engineState.shared_state.currentPreviewURLList;
       try {
          response.status(200).json( {
            
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

 