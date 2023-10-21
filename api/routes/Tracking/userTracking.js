import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";

const router = express.Router();

router.post("/sendTracking", async (req, response) => {
  try {
    const { mongoClient } = await connectToDataBase();
    const db = mongoClient.db("wudb");
    const collection = db.collection("user_tracking");

   // const ID = req.body.ID;
    //const interractions = req.body.interractions;
    
    const temporaryID = req.ipAddress; // Use IP address as the temporary ID  (from middleware added in index)
    // Store the temporaryID and interaction data in your database

    const userIDAuthStatus = req.body.ID === "" ? temporaryID  : req.body.ID;

     console.log(  "userIDAuthStatus   =  "   +  userIDAuthStatus)

    const ID = userIDAuthStatus ;
    const userType  = req.body.userType; 
    const one_Click = req.body.oneClick;
 

         //   console.log(  "ID"  , ID  ,  "temporaryID  = "   +   temporaryID  );
        
         let result = await collection.updateOne(
    { "ID": ID },
    {
      $set: { "ID": ID },
       $set: { "userType": userType },
      
      $push: { "pageInteraction": one_Click  }
    },
    { upsert: true }
  );
       // layer interaction









    response.status(200).json(result);
  } catch (e) {
    console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }
});

export default router;
