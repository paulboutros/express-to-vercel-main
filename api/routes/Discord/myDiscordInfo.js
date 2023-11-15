 

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/myDiscordInfo", async (req, response) => {


    const ID = req.query.ID;
    if (!req.query.ID) {
        // Create an error object with your custom error message
        const error = new Error(" query ID should be set in your parameters query");
        
        // Set the HTTP status code for the response to indicate an error (e.g., 400 Bad Request)
        response.status(400);
        
        // Send the error message in the response
        response.json({ success: false, error: error.message });
        
        return; // Stop further execution
      }





    try {
        //const mongoClient = await ( new MongoClient(uri, options)).connect();
          const {mongoClient} = await connectToDataBase();
      
          

        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        
        const result = await collection.aggregate([
            {
                $match: {
                    ID: ID 
                }
              },
            {
               $project: {
                _id: 0,
                ID:1,
                discord:1,
              
                "scoreData.discord.invite_code": 1  ,
                "scoreData.discord.invite_use": 1 
                
               
              },
            },
          ]).toArray();

 
     
               response.status(200).json(result);
          }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})

export default router;
 