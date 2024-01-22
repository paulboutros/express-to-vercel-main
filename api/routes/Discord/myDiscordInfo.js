 

import axios from "axios";
import { Client, Events, GatewayIntentBits } from 'discord.js' ;

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
import { connectToDiscord } from '../../../lib/connectToBotClient.js';
//import { discordClient } from "../../index.js";
 
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
 

     //console.log( ">>> getUserGuild   initiated " );
     const { discordClient } = await connectToDiscord();
 

     const guild  =    discordClient.guilds.cache.get(guildId);
         
         const ServerMembers = await guild.members.fetch();

          let result={   status:false, joinedAt:"" };
        
           const member =   guild.members.cache.get(ID) ;

           
          if ( member )  {  

            const userJoinTime = member.joinedAt; 
            result  = {  status :true, joinedAt: userJoinTime  };
           
            console.log( ">>> getUserGuild :member is defined " , result );
            // console.log( result.message );
           }else{
              result  = {  status :true, joinedAt: userJoinTime  };
             
          }
  
          console.log( ">>>  response.status(200) result= " , result );
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
         const error = new Error("'IDlist' should be set in you rerquest body");
         response.status(400);
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
                discordUserData:1, // warning, this information are not up to date
              
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


 
// Go through a list of all collection related to the user and delete it
router.get("/deleteAccount", async (req, res) => {
 
 

  try {

    const ID = req.query.ID;
 
    let endpoint = `${process.env.SERVER_URL}discord_invite_delete?ID=${ID}`;
    let reward_res = await fetch(endpoint);
     

  let result;
    const { mongoClient } = await connectToDataBase();
     const db = mongoClient.db("wudb");
     

    const opened_packs = db.collection("opened_packs");
    result = await opened_packs.deleteOne({ ID: ID });

    if (result.deletedCount === 1) {
      // Deletion was successful
      console.log(`opened_packs with ID ${ID} deleted successfully`);
    } else {
      // No document was deleted (document with given ID not found)
      console.log(`opened_packs with ID ${ID} not found`);
    }



    const user_tracking = db.collection("user_tracking");
    result = await user_tracking.deleteOne({ ID: ID });
    
    if (result.deletedCount === 1) {
      // Deletion was successful
      console.log(`user_tracking with ID ${ID} deleted successfully`);
    } else {
      // No document was deleted (document with given ID not found)
      console.log(`user_tracking with ID ${ID} not found`);
    }



    const users = db.collection("users");
    result = await users.deleteOne({ ID: ID });
    
    if (result.deletedCount === 1) {
      // Deletion was successful
      console.log(`users with ID ${ID} deleted successfully`);
    } else {
      // No document was deleted (document with given ID not found)
      console.log(`users with ID ${ID} not found`);
    }


   
     
    res.status(200).json(   {message :"account deleted" }  );
    
  
     
    
  } catch (e) {
     console.error(e);
     res.status(500).json({ error: "An error occurred" });
  }

  


})




export default router;
 