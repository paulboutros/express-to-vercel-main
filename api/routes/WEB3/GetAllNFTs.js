
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
  router.get("/GetAllNFTs", async (req, response) => {
    try {
     
      const sdk = GetThirdWebSDK_fromSigner();
      const contract = await sdk.getContract(TOOLS_ADDRESS);
      const nfts = await contract.erc1155.getAll({ start: 0, count: 10 });

    //   nfts.forEach(element => {
    //   console.log( ">>>>> nft sdk el:", element.metadata);
    //  });
 

      response.status(200).json( nfts );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 
  }
  
  );
 
        export default router;

 