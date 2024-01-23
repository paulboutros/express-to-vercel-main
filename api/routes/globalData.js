import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 import {ObjectId} from "mongodb";

const router = express.Router();


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


router.post("/SetSimulatedWuUSDTpriceAPI", async (req, response) => {
  
  const value = req.body.value;
  const ID  = req.body.ID;

  console.log( "value"  , value );
  try {
 const {mongoClient} = await connectToDataBase();
   
 const db = mongoClient.db("wudb");
 const collection = db.collection("users");
  
  
 const filter = { "ID": ID  }; // Replace with the actual _id value
 const update = {
   $set: { simulatedWuUSDT: value }, // Replace "new_value" with the updated value for debugMode
   
 };
 
 collection.updateOne(filter, update,  { upsert: true }  );
 
 response.status(200).json( {msg:"value modified to: "+ value  });

     
 } catch(e){  console.error(e); response.status(500).json(e);}
    
 
});




  // do not forget to use the endpoint in index.js
  router.get("/globalData", async (req, response) => {
   
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
      
   const db = mongoClient.db("wudb");
   const collection = db.collection("global");
    const result = await collection
   .find({})  // discord": "Wulirocks"
   .toArray();

  response.status(200).json(result);
   
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;

 