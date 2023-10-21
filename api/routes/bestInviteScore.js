 

import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/bestInviteScore", async (req, response) => {

    
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
    const db = mongoClient.db("wudb");
   const collection = db.collection("users");

    const user_result = 
     await collection
    .find({}, { projection: { walletShort: 1, discord: 1, scoreData: 1, _id: 0 } }) // Include only the specified fields
     .sort({ "scoreData.discord.invite_use": -1 }) // Sort in ascending order based on scoreShare
     .limit(1)
    .toArray();
 

   response.status(200).json(user_result);
    
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;


function calculateEarning(rewardPool, userSharePercentage) {
    if (rewardPool < 0 || userSharePercentage < 0) {
      // Handle invalid input, such as negative values.
      return 0;
    }
  
    // Calculate the earnings in dollars (userSharePercentage should be in the range [0, 100]).
    const earning = (userSharePercentage / 100) * rewardPool;
    return  Round2(earning);
  }
  
  function Round2(number){

    return   Math.round(number * 100) / 100;
}
 