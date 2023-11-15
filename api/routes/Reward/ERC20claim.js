
import url from 'url';
import express from "express";
import axios from "axios";

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 import { ethers } from "ethers";
 import {  REWARDS_ADDRESS  } from "../../../const/addresses.js";
 import {GetThirdWebSDK_fromSigner } from "../../../utils/thirdwebSdk.js"

const router =  express.Router();

  
  router.post("/ERC20claim", async (req, response) => {
    try {


      

      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");

        const ID                = req.body.ID;
        const filteredImages    = req.body.filteredImages;
        const recipientAddress  = req.body.address;

         if (ID === null || filteredImages === null || recipientAddress === null) {
          throw new Error('One or more required parameters are null.');
        }

        console.log( "ERC20claim recipientAddress   = "  + recipientAddress );
      //to do 
      /*
        request must contains the combo this request is for, 
        1) =>  then check on server if the user own the requiered layer
        2) =>  recheck the price for update... also because we do not accept this information from the client for security reason
        3) =>  call web3 contract claim function to reward with the amount
      */
     /*
        const referrer_user = db.user_tracking.findOne({
            "referralCodes": {
              $elemMatch: {
                $eq: "LXc7v98j"
              }
            }
          })
*/



       const he = filteredImages.he[0].layerName;
       const we = filteredImages.we[0].layerName;
       const sh = filteredImages.sh[0].layerName;
       const kn = filteredImages.kn[0].layerName;
       const be = filteredImages.be[0].layerName;

       const result = await collection.findOne(
        { ID: ID },
        { projection: { _id: 0, layers: 1 } }
      );
      
      const categories = ["he", "we", "sh", "kn", "be"];
      const missingCategories = [];
      
      categories.forEach(category => {
        const test_value = filteredImages[category][0].layerName;
        if (!result.layers[category].includes(test_value)) {
          missingCategories.push( {inCategory: category, missinLayer: test_value });
        }
      });


      let checkedResult ={};
        
      

 

         // if we passed the check
         let priceConfirmation;
        if (missingCategories.length === 0 ){
            const apiUrl = `${process.env.SERVER_URL}GetReward?he=${he}&sh=${sh}&we=${we}&be=${be}&kn=${kn}`;
            priceConfirmation = await axios.get(apiUrl);

            checkedResult ={
              missingLayers : missingCategories,
              layerOnDataBase: result,
              priceConfirmation: priceConfirmation.data,
              message: "OK"
      
          }
        }else{
          
          checkedResult ={
            missingLayers : missingCategories,
            layerOnDataBase: result,
            priceConfirmation: "not available",
            message: "client combo does not match dataBase. see missingCategories. rejected"
    
            }

          response.status(200).json( checkedResult );
          return;
        }
         
           
        
     // all web 3 reward erc20 claim        
 
      
     

          await transfert(recipientAddress , checkedResult.priceConfirmation.finalRewardPrice   );
        response.status(200).json( checkedResult );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
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
   

//web3
  async function transfert( recipientAddress , priceConfirmation  ){
  /*
    const sdk = new ThirdwebSDK("goerli", {
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });
    
    const contract = await sdk.getContract("0x4cD80F954357613E8cd0063410d60083CF3DCdfD");
*/



// If used on the BACKEND pass your 'secretKey'
/*
const sdk = new ThirdwebSDK("goerli", {
  secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY,
});
*/

 /*
    const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  ); // "{{private_key}}"
     const sdk = await ThirdwebSDK.fromSigner(signer, "goerli", {
     // clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID , // Use client id if using on the client side, get it from dashboard settings
      secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
    });
    */
   
    const sdk = GetThirdWebSDK_fromSigner();
   
  const contract = await sdk.getContract(REWARDS_ADDRESS);
  
 // priceConfirmation =  "57.78";

 console.log( "priceConfirmation" , priceConfirmation  );
   const amount = parseFloat(priceConfirmation);

   console.log( "amount" , amount  );
  // Address of the wallet you want to send the tokens to
  const toAddress =  recipientAddress;
  // The amount of tokens you want to send
  
  await contract.erc20.transfer(toAddress,  amount );
  
  }
  

  