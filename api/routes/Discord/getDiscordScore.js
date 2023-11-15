 

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/getDiscordScore", async (req, response) => {

    try {
        //const mongoClient = await ( new MongoClient(uri, options)).connect();
          const {mongoClient} = await connectToDataBase();
      
          

        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        
        const result = await collection.aggregate([
            {
                $match: {
                    discord: { $ne: "Wulirocks" } // Exclude documents with ID "Wulirocks"
                }
              },
            {
               $project: {
                _id: 0,
                ID:1,
                discord:1,
              
                "scoreData.discord.invite_code": 1  ,
                "scoreData.discord.invite_use": 1  ,
                
                id: 1,
              },
            },
          ]).toArray();


          const newResult = result.map(item => ({
            wallet: "wallet_not_provided",
            walletShort: "wall..ided",
            discord: item.discord, // Preserve the 'discord' property
            socialScore: 0,
            total: 0,
            scoreShareAbsolute: 0,
            invite_code:   item.scoreData.discord.invite_code  , // Preserve the 'scoreData.discord.invite_code' property
            message: 50,
            invite_sent: 0,
            invite_use: item.scoreData.discord.invite_use, // Preserve the 'scoreData.discord.invite_use' property
            fake_invite: 0,
            discord_score: 0,
            id: item.id,
          }));









       
            
     
               response.status(200).json(newResult);
          }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})

export default router;
 