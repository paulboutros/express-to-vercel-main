//https://portal.thirdweb.com/typescript/sdk.thirdwebsdk
import url from 'url';
import express from "express";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
import {  REWARDS_ADDRESS , TOOLS_ADDRESS } from "../../../const/addresses.js";
 import {GetThirdWebSDK,
   GetThirdWebSDK_fromPrivateKey, 
   GetThirdWebSDK_fromSigner,
   GetThirdWebSDK_readOnly
  } from "../../../utils/thirdwebSdk.js";
 

const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/GetLayerSupply", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const layerSupplyCollection = await db.collection("layer_supply");

     const sdk =  GetThirdWebSDK_fromSigner();
   //const sdk = GetThirdWebSDK_readOnly(); // GetThirdWebSDK_fromSigner();
   const contract = await sdk.getContract(TOOLS_ADDRESS);
   const nfts = await contract.erc1155.getAll();



       const tokenId = 0;
      const nftResult = await contract.erc1155.get( tokenId );
      
     let contractMetadataResult;
    try {
   
      //console.error(' nftResult  >>>> fetching NFT:', nftResult);
      // contractMetadataResult = await contract.metadata.get();
     
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  

      const layerResult = [];
      const cursor = await layerSupplyCollection.find({})
  /*     
   const resultData={
    contract:contract,
    nftResult:nftResult 


   };  */
      // layer supply for that reward
      let reward_layerSupplies;
      for await (const doc of cursor) {  layerResult.push(doc);   }
      
      response.status(200).json(  nftResult  );
     // response.status(200).json( layerResult );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: e });
    }







  }
  
  );
  
  
  export default router;




  // Calculate the weighted score for the combination
function calculateScore(combination ,  categoryWeights) {
    let totalScore = 0;
    for (const category in combination) {

        const catScore = combination[category] * categoryWeights[category];
      totalScore += catScore; 

      console.log("calcul:"   + category   + "  catScore  " + catScore   );
    }
    return totalScore;
  }
  
  // Determine the reward price based on the total score
   



  