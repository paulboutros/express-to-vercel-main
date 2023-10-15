import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/globalData", async (req, response) => {

    
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
      
   const db = mongoClient.db("wudb");
   const collection = db.collection("global");
    const result = await collection
   .find({})
   .toArray();

  response.status(200).json(result);
   
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;

 