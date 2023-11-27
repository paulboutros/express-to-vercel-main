
import url from 'url';
import express from "express";
import axios from "axios";

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 import { ethers } from "ethers";
 import {  REWARDS_ADDRESS, TOOLS_ADDRESS  } from "../../../const/addresses.js";
 import {GetThirdWebSDK_fromSigner } from "../../../utils/thirdwebSdk.js"

const router =  express.Router();

  

router.post("/ERC20claim", async (req, response) => {
  try {


    

    //const { mongoClient } = await connectToDataBase();
    //const db = mongoClient.db("wudb");
    //const collection = db.collection("users");

      
      const filteredImages    = req.body.filteredImages;
      const recipientAddress  = req.body.address;

 

       if ( filteredImages === null || recipientAddress === null) {
        throw new Error('One or more required parameters are null.');
      }

     // compare combo layers that are about to be used to claim, with the layers that the user actually own
      const ownedNfts = await getOwned( recipientAddress);

  // this is the sets of token requiered to get the reward the user is attempting to get
    const reward_claim_for_tokenIDs=[ 
      filteredImages.he[0].tokenID.toString(),
      filteredImages.sh[0].tokenID.toString(),
      filteredImages.we[0].tokenID.toString(),
      filteredImages.be[0].tokenID.toString(),
      filteredImages.kn[0].tokenID.toString() 
    ];
 
    // now we compare them with what this adress own
    const owned_tokenIDs=[];
    ownedNfts.forEach(element => {
      const id =  element.metadata.id;
      owned_tokenIDs.push(  id.toString()  );
       
   }); 

    const matchResult=[];
    owned_tokenIDs.forEach(id => {
        const res =  reward_claim_for_tokenIDs.includes( id );
        matchResult.push( { id_required:id , result:res   });
    });

    const containsMissingTokenID = matchResult.some(item => item.result === false);
    /* some token ID are missing we can not go further
    
    */
   if (containsMissingTokenID){
      response.status(200).json( {
          containsMissingTokenID:containsMissingTokenID,
          matchResult:matchResult,
          reward_claim_for_tokenIDs :reward_claim_for_tokenIDs, 
          owned_tokenIDs:owned_tokenIDs
       });
      return;

   }
//==================================================================================================
//2)   at this point we passed the test, and we have all the token ID required.
 // Now, let's recheck the rewards associated with this combo.
 const dataToSend = {
  he : {tokenID:  filteredImages.he[0].tokenID },
  sh : {tokenID:  filteredImages.sh[0].tokenID },
  we : {tokenID:  filteredImages.we[0].tokenID },  
  be : {tokenID:  filteredImages.be[0].tokenID },
  kn : {tokenID:  filteredImages.kn[0].tokenID }
   
  
}

   const endpoint = `${process.env.SERVER_URL}GetReward`;
  const reward_res = await axios.post(endpoint, dataToSend);
  const reward_result = reward_res.data;
   
 // 3) we send the reward to wallet 
 // We make sure we burn the token used to get this reward
//check thirdweb video tutorial. BORED YATCH APE CLUB , for burn to claim
 //const burn_he = await contract.erc1155.burn(tokenId, amount);



 await transfert(recipientAddress , reward_result.finalRewardPrice   );



 response.status(200).json( {
  reward_result:reward_result,
  matchResult:matchResult,
  reward_claim_for_tokenIDs :reward_claim_for_tokenIDs, 
  owned_tokenIDs:owned_tokenIDs
});


     // console.log( "ERC20claim recipientAddress   = "  + recipientAddress );
    //to do 
    /*
      request must contains the combo this request is for, 
      1) =>  then check on server if the user own the requiered layer  
      2) =>  recheck the price for update... 
      also because we do not accept this information from the client for security reason
      3) =>  call web3 contract claim function to reward with the amount
    */
    

 

      
      // response.status(200).json( {
      //    filteredImages:filteredImages, 
      //     ownedNfts:ownedNfts
      //   });
      return;



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

// from client it is called ERC20claim_discord_login_required in API.js (we may not need this anymore)
//this is the version using Mongo mock data
  router.post("/ERC20claim_MONGO_MOCK_DATA", async (req, response) => {
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
 
  

  router.post("/GetOwnedNFTs", async (req, response) => {
    try {
 
        const address                = req.body.address;
        

         if (address === null  ) {
          throw new Error('One or more required parameters are null.');
        }

       // console.log( "ERC20claim recipientAddress   = "  + recipientAddress );
       

      const ownedNfts = await getOwned(address);
 
        response.status(200).json( ownedNfts );
 
      
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
   

  async function getOwned(address){

    const sdk = GetThirdWebSDK_fromSigner();
    const contract = await sdk.getContract(TOOLS_ADDRESS);
  
    // For ERC1155
    const nfts = await contract.erc1155.getOwned(address);

    return nfts;
 
  }
//web3
  async function transfert( recipientAddress , priceConfirmation  ){
   


 
   
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
  

  