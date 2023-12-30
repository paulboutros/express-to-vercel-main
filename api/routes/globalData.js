import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 import {ObjectId} from "mongodb";

const router = express.Router();


router.post("/globalData_setDebugMode", async (req, response) => {
   

  const value = req.body.value;
  try {
 const {mongoClient} = await connectToDataBase();
   
 const db = mongoClient.db("wudb");
 const collection = db.collection("global");
 const result = await collection.find({}).toArray(); 
 

 //var ObjectId = require('mongodb').ObjectId; 
var id = "6532fa1109bc430bfa14a43d" ; //req.params.gonderi_id;       
var o_id = new ObjectId(id);

 const filter = { _id: o_id  }; // Replace with the actual _id value
 const update = {
   $set: { debugMode: value } // Replace "new_value" with the updated value for debugMode
 };
 
 collection.updateOne(filter, update);
 
 response.status(200).json(result);

     
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

 