 


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
     //  discordClient.once( Events.ClientReady, async () => {

          const guild  =   discordClient.guilds.cache.get(guildId);
          const member =   guild.members.cache.get(ID);

          if (guild.member(ID)) {
             console.log(  " memnber exist  ");
          }else{

            console.log(  " memnber DOES NOT  exist  ");
          }
             //========================================================================
             const allMembers=[];
           //  const ServerMembers = await guild.members.fetch();

           
             // Filter out the bots
         //    const members = ServerMembers.filter(member => !member.user.bot);
  
           //  const members = ServerMembers.filter(memb => !memb.user.bot);
    
                /*
                  for (const member of members.values()) {
                    const user = member.user;
                    // Now you can access properties of the 'user' object
                    const username = user.username;
                    const userID = user.id;
                    // const avatarURL = user.avatarURL();

                    // Use the 'user' properties as needed
                    // console.log(`Username: ${username}, UserID: ${userID}, Avatar URL: ${avatarURL}`);
                    // console.log(`>>  member: ${member}`);
                    console.log(`>>  user:`, user);
                  }
    */ 


        
          let result={ message:"" };
          if (member) {
          //  result.message  += `${ID} is a member of ${guild.name}   |  ` ;
          //  const joinTimestamp = member.joinedAt;
          //  result.message  += `${ID} joined the guild on: ${joinTimestamp}` ;
          } else {
           // result.message   +=`${ID} is not a member of ${guild.name}` ;
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
        const result = await collection.aggregate([
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
              
           //     "scoreData.discord.invite_code": 1  ,
             //   "scoreData.discord.invite_use": 1 
                
               
              },
            },
          ]).toArray();

 
     
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
 