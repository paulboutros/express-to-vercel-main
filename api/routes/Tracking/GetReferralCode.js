
import url from 'url';
import express from "express";
import axios from "axios";
import fetch  from 'node-fetch';
import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
//import{ sign } from 'jsonwebtoken'
import jwt from 'jsonwebtoken';
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 

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
   
      if (referrer_user && 
        referrer_user.referralCodes// && 
 
        ) {

            // add the full link to the response   (quick and dirty solution)
            referrer_user.referralCodes.shareableLink =
             `${process.env.REACT_APP_URL}?referralCode=${referrer_user.referralCodes.code}`;
       // const firstReferralCode = referrer_user.referralCodes[0];
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
  
  
  export default router;



  