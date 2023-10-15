/*

txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95"
*/

import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/bestEarner", async (req, response) => {

    
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
    const db = mongoClient.db("wudb");
   const collection = db.collection("users");

    const user_result = 
     await collection
    .find({}, { projection: { walletShort: 1, discord: 1, scoreData: 1, _id: 0 } }) // Include only the specified fields
     .sort({ scoreShare: 1 }) // Sort in ascending order based on scoreShare
    .toArray();

    const glob_collect = db.collection("global");
    const glob_result = await glob_collect
    .find()//({}, { projection: { reward_pool: 1, _id: 0 } }))
    .toArray();
    

     

    const rewardPool = glob_result[0].reward_pool;
   const resultWithEarnings = user_result.map((document) => {
 
        const userSharePercentage = document.scoreData.scoreShare;//scoreData.scoreShare; 
        const earning = calculateEarning(rewardPool, userSharePercentage ); // Calculate the earning for each document
        return {
        ...document, // Spread the existing properties
        earning  , // Add the "earning" property
        };
  });
    


   response.status(200).json(resultWithEarnings);
    
        
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
 