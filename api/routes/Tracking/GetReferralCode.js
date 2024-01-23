
import url from 'url';
import express from "express";
import axios from "axios";
import fetch  from 'node-fetch';
import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
//import{ sign } from 'jsonwebtoken'
import jwt from 'jsonwebtoken';
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { connectToDiscord } from '../../../lib/connectToBotClient.js';
import { customEvent1 } from '../../index.js';
  

const router = express.Router();

  

  router.get("/GetReferralCode", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("user_tracking");
  
      const userID = req.query.ID;
   
     // check if referral code exist for this user

     let referralCode;
      const referrer_user = await collection.findOne(
        { ID: userID }, // look for this user
        { projection: { referralCodes: 1 } } // get the referral code
      );
   
      if (referrer_user &&  referrer_user.referralCodes ) { 
             // add or construct the full link to the response (quick and dirty solution)
            referrer_user.referralCodes.shareableLink =
             `${process.env.REACT_APP_URL}?referralCode=${referrer_user.referralCodes.code}`;
       
             referralCode = referrer_user.referralCodes;
       // response.status(200).json( {referralCode: referrer_user.referralCodes }  );
      } else {
         

         // referral code does not exist so we create/generate one
        const dataToSend= { ID: userID ,one_referral_Code: "xxxTempxx"}
   
       const endpoint = `${process.env.SERVER_URL}generateReferralCode`;  
       const resultsPostJson = await axios.post(endpoint, dataToSend);
  
        console.log("referralData :" ,   resultsPostJson.data );
        console.log("referal :" ,   resultsPostJson.data.shareableLink);
          
              referralCode =  resultsPostJson.data;
       
       
    }
       

     // it should NOT be called referralCodes, but "referralData"
    response.status(200).json(   referralCode    );

 




    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
   
 
  router.get("/getServerMember", async (req, response) => {
 
    const { discordClient } = await connectToDiscord();
    const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );

    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("discord_invites");
  
      const ID = req.query.ID;
   
       const inviteData = await collection.findOne( { ID: ID }  );
       
       const ServerMembers = await guild.members.fetch();
       const members = ServerMembers.filter(member => !member.user.bot);
        
      
         // No referrer_user with the referral code was found
         response.status(200).json(  members   );
     
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 

  });

  //few things need to be updated, name, avatar
  // this is done in bulk here, but part of the function should be
  //done on individually when user login
  router.get("/updateMongoUserWithDiscordLatestInfo", async (req, response) => {

    const { discordClient } = await connectToDiscord();
    const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );

    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");
  
     // const ID = req.query.ID;
   
     /*
      const inviteData = await collection.findOne(
        { ID: ID } // look for this user
       // ,{ projection: { invite: 1 } } // get the invite/referral code
      );
*/

       const ServerMembers = await guild.members.fetch();
       const members = ServerMembers.filter(member => !member.user.bot);
     
       
       const updates =[]; 
      for (const member of members.values() ) {
           const user = member.user;
         // Now you can access properties of the 'user' object
           const username = user.username;
           const userID = user.id;
           const avatarURL = user.avatarURL;
           const displayAvatarURL = user.displayAvatarURL;
           updates.push (
                
                   {
                     userID:userID,
                     username:username,
    
                      avatar : user.displayAvatarURL().match(/\/([^\/]+)\.[^\/]+$/)[1] ,//user.displayAvatarURL().match(/\/([^\/]+)$/)[1],
               
                   }
                 

           );
           
       }
 
      
       for (const update of updates) {
        try {
          await collection.updateOne( { ID: update.userID },
             { $set: {'discordUserData.avatar': update.avatar,} }
             
          );
          console.log(`Updated avatar for user with ID: ${update.username}`);
        } catch (error) {
          console.error(`Error updating avatar for user with ID: ${update.userID}`, error);
          // Handle error as needed
        }
      }
          
  


          // console.log( updates );

       response.status(200).json(  updates   );
     
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }


  });

  
  router.get("/GetDiscordInviteCode", async (req, response) => {

    const currentTime = new Date();
    console.log("GetDiscordInviteCode  time:  " , currentTime  )

    const { discordClient } = await connectToDiscord();
    const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );

    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("discord_invites");
  
      const ID = req.query.ID;
   
      const inviteData = await collection.findOne(
        { ID: ID } // look for this user
       // ,{ projection: { invite: 1 } } // get the invite/referral code
      );
     if (inviteData ) { 
        
       
     

         console.log(  " >>>>>   inviteData   inviteCode  =  "  ,  inviteData.invite   );
        
          try {
            const inviteCode =  inviteData.invite;
            const invite = await  guild.invites.fetch(inviteCode); 
            console.log(  " inviteData.invite  =  "  ,   inviteData.invite , " is an invite on Discord "   );
          } catch (error) {
          //  console.error('Error fetching invite:', error.message);
            // Handle the case where the invite is not found
            const missingMatchingDiscordInviteCode = await collection.deleteOne({ ID: ID });
            inviteData=null;
            console.log(  " inviteData.invite  =  "  ,   inviteData.invite , " is not a invite on Discord "   );
          }
      
     }
 

    //if invidata doesnt exist or we deleted if because it contains a Discord invite that id
    //no longer valid or listed....
   if  (!inviteData){
      const endpoint = `${process.env.SERVER_URL}discord_invite_create?ID=${ID}`; // make it specific (filter to twitter fields)
      const resultsPostJson = await fetch(endpoint);
      const resultsJson = await resultsPostJson.json();
       console.log( " created invite  " , resultsJson );
     // const resultsJson = await resultsPostJson.json();
     // responseToClient.inviteData = inviteData ;/
     // inviteData = resultsJson.inviteData = inviteData 
      //client.emit(customEvent1, guild,'these params', 'will be logged', 'via the listener.');

   }
        //



   
      if (inviteData  ) { 
        
        response.status(200).json( {inviteData: inviteData } );
    } else {
      // No referrer_user with the referral code was found
      response.status(200).json(   {inviteData: null }  );
        
    }
       
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });


  router.get("/GettDiscordInviteCodeMany", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("discord_invites");
  
      const ID = req.query.ID;
   
      const inviteData = await collection.find({}).toArray();
       
   
      if (inviteData  ) { 
        
        response.status(200).json( {inviteData: inviteData } );
    } else {
      // No referrer_user with the referral code was found
      response.status(200).json(   {inviteData: null }  );
       
    }
       
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
  
  
  export default router;



  