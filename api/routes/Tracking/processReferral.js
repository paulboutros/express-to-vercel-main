
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
  // this will trigger when the url is passed
  router.get("/processReferral", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("user_tracking");
  
      const referralCode = req.query.referralCode;
  
     // console.log("referralCode =", referralCode);
  
      /*
      const referrer_user = await collection.findOne({
        "referralCodes": {
          $elemMatch: {
            $eq: referralCode
          }
        }
      });
   */
      const referrer_user = await collection.findOne({
        "referralCodes.code": referralCode
      });
 
      if (referrer_user) {
  

     //   console.log("  >>>>>   process referral =",   referrer_user.ID   + "referralCode="  + referralCode  );

        const referralData = {
          referralCode: referralCode,  
          reward: '5 crypto tokens'  
        };
 
 
     /*
        response.cookie('referralData', referralData, {
          maxAge: 7200000, // 2 hours
          httpOnly: false,
          sameSite: 'None',
          secure: true,
          domain: process.env.COOKIE_DOMAIN,
           path: '/'
          //path: '/?referralCode=7Aps9yoW'
       //   http://localhost:3000/?referralCode=7Aps9yoW
        });
        */
   
        const baseurl = process.env.REACT_APP_URL;


       // console.log("referralData      =", referralData);
      //  response.redirect(baseurl);
        response.status(200).json( referralData );
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



  