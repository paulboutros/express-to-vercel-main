
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 
const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.post("/SetRewardLastTiming", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");

      const ID = req.body.ID ;
      const currentTime = new Date();


      const duration  = req.body.duration; 
      const one_Click = req.body.oneClick;

      let result;
      let  totalMilliseconds;
      let timeResponse;

       
        result = await collection.updateOne({ "ID": ID }, { $set: { 'giveAwayTiming.lastGiveAway': currentTime  }});

        timeResponse = currentTime;
     
         
         
     
      //'giveAwayTiming.frequency': totalMilliseconds
 

      response.status(200).json( { time: timeResponse }  );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 

  }
  
  );
  
  
  export default router;

 