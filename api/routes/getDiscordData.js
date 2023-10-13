 

import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/getDiscordData", async (req, response) => {

   //http://localhost:3000/api/findsss
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
    const db = mongoClient.db("wudb");
   const collection = db.collection("users");

    const user_result = 
     await collection
    .find()//{}, { projection: { walletShort: 1, discord: 1, scoreShare: 1, _id: 0 } }) // Include only the specified fields
    .sort() // Sort in ascending order based on scoreShare
    .toArray();
 


  response.status(200).json(resultWithEarnings);
    
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;

 