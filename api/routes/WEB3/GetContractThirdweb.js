
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import {  TOOLS_ADDRESS } from '../../../const/addresses.js'; 

import {GetThirdWebSDK, GetThirdWebSDK_fromPrivateKey, GetThirdWebSDK_fromSigner } from "../../../utils/thirdwebSdk.js";



import dotenv from 'dotenv';
dotenv.config()

 
  
 

const router = express.Router();
 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/GetContractThirdweb", async (req, response) => {
    try {
     
      const sdk = GetThirdWebSDK_fromSigner();
      const contract = await sdk.getContract(TOOLS_ADDRESS);
 


      response.status(200).json( contract );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 
  }
  
  );
 
    export default router;

 