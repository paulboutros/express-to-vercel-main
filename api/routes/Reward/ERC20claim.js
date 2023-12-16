
import url from 'url';
import express from "express";
import axios from "axios";

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 import { ethers } from "ethers";
 import {  REWARDS_ADDRESS, TOOLS_ADDRESS, BURN_TO_CLAIM, OWNER  } from "../../../const/addresses.js";
 import {GetThirdWebSDK_fromSigner , GetThirdWebSDK_fromPrivateKey  } from "../../../utils/thirdwebSdk.js"

import {ABI} from "./abi.js"
 import { Sepolia } from "@thirdweb-dev/chains";
import { createBundle } from './CreateBundlePack.js';

const router =  express.Router();



router.post("/CreateBundlePack", async (req, response) => {
  try {
      
     // const sdk = await GetThirdWebSDK_fromSigner();// GetThirdWebSDK_fromPrivateKey();  //ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");
      // console.log( sdk);
      // GetThirdWebSDK_fromSigner();

      const bundelCreated =  await createBundle(   );
      response.status(200).json( { res: bundelCreated }  );

    
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }
 
}

);
 
//==============================================================
 
/*
https://portal.thirdweb.com/typescript/sdk.erc1155mintable
*/
  
  
// later we should move all this to a WEB3 DEV api folder


// good old thirdweb video for minitng all required for pack (warning some sdk not up to date)
//https://www.youtube.com/watch?v=MBmQtpNLmgg 
https://portal.thirdweb.com/typescript/sdk.erc1155mintable
router.post("/generateAllSupplyforCardpack", async (req, response) => {
  try {
    const sdk = GetThirdWebSDK_fromSigner();
    const contract = await sdk.getContract( "0xdA637F0BAA8CB69e7e23926915F6Cec5b248B3B4");

    const nfts = await contract.erc1155.getAll();

    const cardAmountInPack = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
     ];
    async function createSupplyAvaialbleForPackCreation() {
 
      const maxLayer =   50
         for (let i = 0; i < maxLayer; i++) {

         const supply = parseInt(nfts[i].supply) ;
                
           const dif =    cardAmountInPack[i] -  supply;
          const absDif = Math.abs( dif );

           console.log( " i  " ,  i  ,  " absDif  " , absDif  ,  "nfts[i].supply   =  "  , nfts[i].supply  );
  
         
           if ( dif < 0 ){
            //  await  contract.erc1155.burn(i, absDif);
 
            }
            if ( dif > 0 ){
              /* 
              const tx = await contract.erc1155.mint({
                   metadata: metadata,
                 supply: 1000, // The number of this NFT you want to mint
               });
              */

               // supply is important for the pack, but the most important it to make the address
               // who create the pack owns even of it since ERC1155upgradable.sol will transfert from pack creator to pack contract
             await contract.erc1155.mintAdditionalSupplyTo( OWNER, i ,   cardAmountInPack[i] );
           //  await contract.erc1155.mintAdditionalSupply(i, absDif);
 
            }
            
 

        
      }
    }
    
    // Call the async function
    await createSupplyAvaialbleForPackCreation();


    response.status(200).json( { res: nfts }  );
     return;


         const tokenId    = req.body.tokenId;
         const toAddress  = req.body.toAddress;
         const additionalSupply = 1;

    
 
    
    
    
 // 0, 12, 21, 34, 40
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 0,  additionalSupply, );
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 12,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 21,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 34,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 40,  additionalSupply, ); 
  
 

 
 
      response.status(200).json( { res:"ok"}  );

    
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


}

);


https://portal.thirdweb.com/typescript/sdk.erc1155mintable
router.post("/MintNftToLayerCollection", async (req, response) => {
  try {
    const sdk = GetThirdWebSDK_fromSigner();
    const contract = await sdk.getContract("0xdA637F0BAA8CB69e7e23926915F6Cec5b248B3B4");

    
    async function mint() {
 
   let maxLayer = 10;// 50;
      for (let i = 0; i < maxLayer; i++) {
             
        const metadata = {
          name: "Cool NFT #1",
          description: "This is a cool NFT",
          image: "https://roarblogs.s3.amazonaws.com/mgm/casino/en/blog/wp-content/uploads/2020/04/28093620/SlotSymbols.jpg", // URL, IPFS URI, or File object
          // ... Any other metadata you want to include
        };
                
              const tx = await contract.erc1155.mint({
                   metadata: metadata,
                 supply: i+1, // The number of this NFT you want to mint
               });
               
 

        
      }
    }
    
    // Call the async function
    await mint();


    response.status(200).json( { res: nfts }  );
      
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


}

);



/*
https://portal.thirdweb.com/typescript/sdk.erc1155mintable
*/
router.post("/mintAdditionalSupplyTo", async (req, response) => {
  try {

         const tokenId    = req.body.tokenId;
         const toAddress  = req.body.toAddress;
         const additionalSupply = 1;

     const sdk = GetThirdWebSDK_fromSigner();
 
    const contract = await sdk.getContract(TOOLS_ADDRESS);
    
    
 // 0, 12, 21, 34, 40
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 0,  additionalSupply, );
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 12,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 21,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 34,  additionalSupply, ); 
  await contract.erc1155.mintAdditionalSupplyTo( toAddress, 40,  additionalSupply, ); 
  
 

 
 
      response.status(200).json( { res:"ok"}  );

    
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


}

);


async function  GiveBurToClaimApprovalToSpendFromRewardToken(){

 
  const sdk = GetThirdWebSDK_fromSigner();
  const contract = await sdk.getContract(REWARDS_ADDRESS);

  //const burnAndClaimContract = await sdk.getContract(BURN_TO_CLAIM);
 
  const allowanceAmount = await contract.erc20.allowanceOf(OWNER, BURN_TO_CLAIM);
  console.log( "allowanceAmount" , allowanceAmount );
   if ( allowanceAmount &&  allowanceAmount.displayValue  > 0) {
   // const isApproved = await burnAndClaimContract.erc1155.isApproved(
   //   OWNER, // Address of the wallet to check
   //   BURN_TO_CLAIM // Address of the operator to check
   // );
   // if (isApproved) {


      console.log( " " ,  BURN_TO_CLAIM , "is approved already " );
      // The contract is already approved
      // You can choose to skip the approval step
  } else {
      // The contract is not approved, proceed with the approval
     // contract.approve( OWNER, BURN_TO_CLAIM );
     // approve and set allowance at the same time for that amount of token in WEI
     await contract.call("approve",  [BURN_TO_CLAIM, "5000000000000000000"]);
     await contract.call("transfer", [BURN_TO_CLAIM, "5000000000000000000"]);




  }
 
}


router.post("/tokenApprove", async (req, response) => {
  try {

    GiveBurToClaimApprovalToSpendFromRewardToken();
    

    response.status(200).json( {res:"ok" });
 

    
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


}

);



router.post("/ERC20claim", async (req, response) => {
  try {

   let filteredImages    = req.body.filteredImages;
   let address  = req.body.address;



   if ( filteredImages === null || address === null) {
    throw new Error('One or more required parameters are null.');
  }

 // compare combo layers that are about to be used to claim, with the layers that the user actually own
  const ownedNfts = await getOwned( address);
 
// this is the sets of token requiered to get the reward the user is attempting to get

 const he_id = filteredImages.he[0].tokenID;
 const sh_id = filteredImages.sh[0].tokenID;
 const we_id = filteredImages.we[0].tokenID;
 const be_id = filteredImages.be[0].tokenID;
 const kn_id = filteredImages.kn[0].tokenID;

const reward_claim_for_tokenIDs=[ he_id.toString(),sh_id.toString(), we_id.toString(), be_id.toString(),kn_id.toString() ];



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
console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"  );
const containsMissingTokenID = matchResult.some(item => item.result === false);
/* some token ID are missing we can not go further

*/


console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"  , containsMissingTokenID );
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
let dataToSend = {
he : {tokenID: he_id},sh :{tokenID: sh_id},we : {tokenID: we_id}, be : {tokenID: be_id}, kn : {tokenID: kn_id} }
 


let endpoint = `${process.env.SERVER_URL}GetReward`;
let reward_res = await axios.post(endpoint, dataToSend);
 let reward_result = reward_res.data;

// 3) we send the reward to wallet 
// We make sure we burn the token used to get this reward
//check thirdweb video tutorial. BORED YATCH APE CLUB , for burn to claim
//const burn_he = await contract.erc1155.burn(tokenId, amount);



//await transfert(address , reward_result.finalRewardPrice   );


/*
response.status(200).json( {
reward_result:reward_result,
matchResult:matchResult,
reward_claim_for_tokenIDs :reward_claim_for_tokenIDs, 
owned_tokenIDs:owned_tokenIDs,
finalRewardPrice : reward_result.finalRewardPrice
});

*/
  
//=======================================================================================================
// SMART CONTRACT / WRITTING BLOCkCHAIN WRITTING
//================================================================================================================

//================================================================================================================
    //============================================================================================================

    const contractABI = ABI; // Replace with your contract's ABI
    const contractAddress = BURN_TO_CLAIM; // Replace with your contract's address
    
    const provider = new ethers.providers.JsonRpcProvider("https://sepolia.rpc.thirdweb.com"); // Replace with your Ethereum node URL
   
   
   
    //const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  );
    const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY, provider); // Replace with the private key
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

/*========================================================================================================
   CHECK FOR APPROVE FROM REWARD TOKEN CONTACT  or BURN TO CLAIM (BURN TO GET REWARD) WILL FAILS
  =======================================================================================================*/
 /*
  Make sure the Bur And Claim contract is approved by token contract, since
 its spends money from it.
 Note, this appoval transaction must be signed by owner, so it can be done on this server with private key

*/
    // Assuming `owner` is the owner's address and `spender` is the contract's address
    //const contract = await sdk.getContract(REWARDS_ADDRESS); 
      await GiveBurToClaimApprovalToSpendFromRewardToken();

/*================================================================================================
                     END OF APPROVE  CHECK
==============================================================================================*/



    const rewardAmountInEther = reward_result.finalRewardPrice;// 2.1; // Replace with your desired amount in Ether
    const rewardAmountInWei = ethers.utils.parseUnits(rewardAmountInEther.toString(), "ether");
     const tx1 = await contract.setRewardAmount(rewardAmountInWei 
    , {
         gasLimit: 200000 // Replace with an appropriate gas limit
        }
      
       );
       const receipt1 = await tx1.wait();
  
       console.log( " >>>>>>   receipt1", receipt1  );
       
/*
       const tx2 = await contract.transfetRewardToUser(address, rewardAmountInWei 
             , {
              gasLimit: 200000 // Replace with an appropriate gas limit
            }
          
          );
*/
 console.log( " he_id",  he_id  );
console.log( " sh_id",  sh_id  );
console.log( " we_id",  we_id  );
console.log( " be_id",  be_id  );
console.log( " kn_id",  kn_id  );

 let tokenIdsToBurn = [he_id, sh_id, we_id, be_id, kn_id];
// let tokenIdsToBurn = [0, 12, 21, 34, 40];

     const tx2 = await contract.burnAndClaim(address, tokenIdsToBurn 
         , {
           gasLimit: 300000 // Replace with an appropriate gas limit
        }
      
         );

      //   console.log( " ??????????????????????????????????????????????????????????????   "   );
       
    //     console.log( "tx2   = "  , tx2 ); // Check events emitted
       const receipt2 = await tx2.wait();

    //   if (receipt.status === 0) {
    //    console.error("Transaction reverted. Revert reason:", receipt2.revertReason);
   // }


     //  const revertReason = receipt2.logs.find(log => log.topics[0] === "0x08c379a0df4787b3e4cf1e38ae9352e87eaff99e858bda6b71c48c7c19f99bc5");
    //   console.log("Revert Reason:", revertReason);


     //  console.log(receipt2.events); // Check events emitted
    //   console.log( ">>>>>>  receipt2  = ", receipt2  );
       if (receipt2.status === 1) {
             console.log("Transaction succeeded");
        // Your logic for a successful transaction
         } else {
             console.error("Transaction failed");
        // Your logic for a failed transaction
         }




    // Wait for the transaction to be mined
    

     response.status(200).json( {res: " ok " });
 

    
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
        const address  = req.body.address;

         if (ID === null || filteredImages === null || address === null) {
          throw new Error('One or more required parameters are null.');
        }

        console.log( "ERC20claim address   = "  + address );
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
 
      
     

          await transfert(address , checkedResult.priceConfirmation.finalRewardPrice   );
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

       // console.log( "ERC20claim address   = "  + address );
       

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
  async function transfert( address , priceConfirmation  ){
   


 
   
    const sdk = GetThirdWebSDK_fromSigner();
   
  const contract = await sdk.getContract(REWARDS_ADDRESS);
  
 // priceConfirmation =  "57.78";

 console.log( "priceConfirmation" , priceConfirmation  );
   const amount = parseFloat(priceConfirmation);

   console.log( "amount" , amount  );
  // Address of the wallet you want to send the tokens to
  const toAddress =  address;
  // The amount of tokens you want to send
  
  await contract.erc20.transfer(toAddress,  amount );
  
  }
  

  