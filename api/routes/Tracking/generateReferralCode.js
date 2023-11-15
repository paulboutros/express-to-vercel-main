import cryptoRandomString  from "crypto-random-string";
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js

  //this is triggered when user click  on button create referral link
  router.post("/generateReferralCode", async (req, response) => {

    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("user_tracking");
    
       if (!req.body.ID){
           const error = new Error(" param:ID need to be set in Body");
      
        // Set the HTTP status code for the response to indicate an error (e.g., 400 Bad Request)
        response.status(400);
        
        // Send the error message in the response
        response.json({ success: false, error: error.message });
        
        return; // Stop further execution

       }
       const ID = req.body.ID ;
      // const one_referral_Code = req.body.one_referral_Code;
   
       const one_referral_Code = cryptoRandomString({ length: 16, type: 'alphanumeric' });

       // Create a shareable link
       const shareableLink = `${process.env.REACT_APP_URL}?referralCode=${one_referral_Code}`;

      // console.log(  "one_referral_Code   =  "   +  one_referral_Code);
  

       const referralData ={
         code: one_referral_Code,
         referredUser:[] // people hwo have accepted


       }

          
       let result = await collection.updateOne(
      { "ID": ID },
      {
        //uncomment this later if you want to push multiple ref link
        // $push: { "referralCodes": one_referral_Code  },
        // override the full array with one element to limit to one ref code
        // $set: { "referralCodes": [one_referral_Code] }
         $set: { "referralCodes": referralData }
      }
       
    );







    
         // layer interaction
   
      const responeToClient = {
         shareableLink :shareableLink
      };


      
  
  
      response.status(200).json(responeToClient);
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
  
  export default router;
  