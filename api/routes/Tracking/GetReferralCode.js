
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

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user

  router.get("/GetReferralCode", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("user_tracking");
  
      const userID = req.query.ID;
   
  
      const referrer_user = await collection.findOne(
        { ID: userID }, // look for this user
        { projection: { referralCodes: 1 } } // get the referral code
      );
   
      if (referrer_user &&  referrer_user.referralCodes ) { 
             // add or construct the full link to the response (quick and dirty solution)
            referrer_user.referralCodes.shareableLink =
             `${process.env.REACT_APP_URL}?referralCode=${referrer_user.referralCodes.code}`;
       
        response.status(200).json( {referralCode: referrer_user.referralCodes }  );
    } else {
      // No referrer_user with the referral code was found
     
        response.status(404).json({ error: "Referral code not found" });
    }
       
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
  

  
  router.get("/GetDiscordInviteCode", async (req, response) => {

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
        
       
      
          try {
            const inviteCode =  inviteData.invite;
            const invite = await  guild.invites.fetch(inviteCode); 
            console.log(  " inviteData.invite  =  "  ,   inviteData.invite , " is a invite on Discord "   );
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
      const endpoint = `${process.env.SERVER_URL}discord_invite_create?ID=${user_ID}`; // make it specific (filter to twitter fields)
      const resultsPostJson = await fetch(endpoint);
       resultsJson = await resultsPostJson.json();
     // responseToClient.inviteData = inviteData ;/
      inviteData = resultsJson.inviteData = inviteData 
      client.emit(customEvent1, guild,'these params', 'will be logged', 'via the listener.');

   }
        //



   
      if (inviteData  ) { 
        
        response.status(200).json( {inviteData: inviteData } );
    } else {
      // No referrer_user with the referral code was found
      response.status(200).json(   {inviteData: null }  );
       // response.status(404).json({ error: "Referral code not found" });
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
       // response.status(404).json({ error: "Referral code not found" });
    }
       
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
  
  
  export default router;



  