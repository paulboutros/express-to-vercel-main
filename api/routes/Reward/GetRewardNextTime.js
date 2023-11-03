
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 

const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/GetRewardNextTime", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");

      // GET query , Post Body
         const ID = req.query.ID;
       console.log( "ID    = " + ID);
      const result = await collection.findOne({ "ID": ID }, {
        "giveAwayTiming.NextGiveAway": 1,
        "giveAwayTiming.lastGiveAway": 1,
        "giveAwayTiming.frequency": 1,
        _id: 0 ,
        "scoreData": 0,"layers":0,
      });
 


      response.status(200).json( result );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }







  }
  
  );
  
  
  export default router;


 