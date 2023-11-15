
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 

const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/GetTempGiveAway", async (req, response) => {
    try {

        
      const ID =  req.query.ID;
      if (!req.body.ID){
        const error = new Error(" param:ID need to be set in Body");
      // Set the HTTP status code for the response to indicate an error (e.g., 400 Bad Request)
       response.status(400);
      // Send the error message in the response
       response.json({ success: false, error: error.message });
          return; // Stop further execution
     }


      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const user_collection = await db.collection("users");

      
      
    const result =   await user_collection      
     .findOne({ ID: ID }, { projection: { "giveAwayTiming.giveAways": 1, _id: 0 } }); // Include only the specified fields
         



      response.status(200).json( result );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }







  }
  
  );
  
  
  export default router;
 

  