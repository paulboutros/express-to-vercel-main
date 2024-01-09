 


import { Client, Events, GatewayIntentBits } from 'discord.js' ;

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
import { connectToDiscord } from '../../../lib/connectToBotClient.js';
 
const guildId = process.env.SERVER_ID;



const router = express.Router();
 

router.get("/getUserGuild", async (req, response) => {


   const ID = req.query.ID;
   if ( !ID   ) {
       const error = new Error("'userId' should be set in you rerquest body");
       response.status(400);
       response.json({ success: false, error: error.message });
      
       return; // Stop further execution
   }
   try {
 
     const { discordClient } = await connectToDiscord();
     const guild  =   discordClient.guilds.cache.get(guildId);
         
          const ServerMembers = await guild.members.fetch();

          let result={   status:false, joinedAt:"" };
        
           const member =   guild.members.cache.get(ID) ;
          if ( member )  {  

            const userJoinTime = member.joinedAt 
            result  = {  status :true, joinedAt: userJoinTime  };
           //  result.message+= ` members found  uer=  : ${  member   }  userJoinTime${  userJoinTime   }`;
            // console.log( result.message );
           }else{
              result  = {  status :true, joinedAt: userJoinTime  };
             
          }
  
          response.status(200).json(  result  );

       //  });

      }catch(e){
       console.error(e);
       response.status(500).json(e);
    
     }



   })



   


  // do not forget to use the endpoint in index.js
  router.post("/getManyUserData", async (req, response) => {


    const IDlist = req.body.IDlist;

    // 
    //return;
    if (!IDlist || IDlist.length === 0) {
        // Create an error object with your custom error message
        const error = new Error("'IDlist' should be set in you rerquest body");
        
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
      //  await yourCollection.find({ ID: { $in: ids } }).toArray();
        let result = await collection.aggregate([
            {
                $match: {
                    ID: { $in: IDlist }  
                }
              },
            {
               $project: {
                _id: 0,
                ID:1,
                discord:1,
                discordUserData:1,
              
             //   "scoreData.discord.invite_code": 1  ,
             //   "scoreData.discord.invite_use": 1 
              
              },
            },
          ]).toArray();



          /*
          const { discordClient } = await connectToDiscord();
          const userIds = IDlist;
          const tempLIst = [];
         
          for (let i = 0; i < userIds.length; i++) {

            const fetchedUser = await fetchUserById( discordClient , userIds[i]);
           
          }
*/


      
               response.status(200).json(result);
          }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})




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
                discordUserData:1,
              
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
 