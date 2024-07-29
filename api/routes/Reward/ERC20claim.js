
import url from 'url';
import express from "express";
import axios from "axios";

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 import { ethers } from "ethers";
 import {  TOOLS_ADDRESS,//   REWARDS_ADDRESS,  BURN_TO_CLAIM,
   OWNER, Discord_invite_stake_token, 
   Discord_stake_contract, OWNER2,
   Discord_tokenLess_stakinContract,
   PACK_ADDRESS
   
  
  } from "../../../const/addresses.js";
 import {GetThirdWebSDK_fromSigner , GetThirdWebSDK_fromPrivateKey  } from "../../../utils/thirdwebSdk.js"

import {ABI} from "../../../public/ABI/burnToClaim.js"
  
import {ABIBASE} from "../../../public/ABI/burnToClaimBase.js"   
 
  
import {   createPacksWEB2, generateData } from './CreateBundlePack.js';

const router =  express.Router();

     
    //const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  );
    //const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY, provider); // Replace with the private key

    router.get("/getBlock", async (req, res) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.rpc.thirdweb.com');
        const blockNumber = parseInt(req.query.blockNumber, 10); 4978822;// parseInt(req.query.blockNumber) ;//  4978822;
    
        console.log( "blockNumber  :" , blockNumber)
        // Get the block information using await
        const block = await provider.getBlock(blockNumber);
    
        if (block) {
          const timestamp = block.timestamp;
          console.log(`Block ${blockNumber} was mined at timestamp: ${timestamp}`);
          res.json({ blockNumber, timestamp });
        } else {
          console.log(`Block ${blockNumber} not found`);
          res.status(404).json({ error: `Block ${blockNumber} not found` });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
     
    }
    
    );



    

    const mintNFT = async (packToOpen, openerAddress) => {
      return new Promise(resolve => {
        // Simulate minting process with a delay
        setTimeout(  async  () => {
            
          const sdk = GetThirdWebSDK_fromSigner();
          const contract = await sdk.getContract(TOOLS_ADDRESS);
              
           for ( let i = 0 ; i < packToOpen.length; i++  ){
             const nft_amount = 1; // one of each in the pack
             const tokenID = packToOpen[i];
             await contract.erc1155.mintAdditionalSupplyTo( openerAddress, tokenID  ,  nft_amount, );
             
           }        
  
              
          console.log('NFT Minted!');
          resolve();
        }, 5000); // Simulated 5 seconds delay
      });
    };

    router.post("/openPack", async (req, response) => {
      try {
          
         
        
         
     const openerAddress =  req.body.openerAddress; 
     const userID = req.body.userID;
    // low let's send this the mongo
      
      const {mongoClient} = await connectToDataBase();
      
      const db = mongoClient.db("wudb");
      const collection = db.collection("packs");


       /* currently there is only 1 pack contract with a supply of 55 packs
             each contains 5 cards 
        */
       const packID = 0;


      // array length 55 
      //this is inclusive, that means max mumber to be selected will be  54
      
      const allPacks = await collection.findOne({ "packID": packID });
     

      // the pack length start at 55, but will decrease, as we open pack packs , and remove them form the list
      const allPacksLength =  allPacks.packs.length;
      const randomPackIndex = Math.floor(Math.random() * allPacksLength);

      const packToOpen = allPacks.packs[randomPackIndex];

      console.log(  "BEFORE OPENING: allPacks   "  , allPacks ); 
      console.log(  "randomPackIndex   "  ,  randomPackIndex );    
      console.log(  "packToOpen   "  , packToOpen  );       
     

     // Update the document to remove the element at the specified index
    await collection.updateOne(
      { "packID": packID },
      { $pull: { "packs": { $in: [allPacks.packs[randomPackIndex]] } } }
    );
    const allPacksAfterOpen = await collection.findOne({ "packID": packID }) ;
    console.log(  "AFTER OPENING: allPacks   "  , allPacksAfterOpen ); 
         
    
    
    const opened_packsCol = db.collection("opened_packs");
    const filter = { "ID": userID };
      const update = {
      $push: {
        "openedPack": packToOpen
      }
    };
     // Use updateOne with upsert: true to insert or update the document
    opened_packsCol.updateOne(filter, update, { upsert: true });
   // db.opened_packs.updateOne(filter, update, { upsert: true });
    


    
    // to simplify testing, we mint to the winner.
    // later we may pre-mint to pack .. so the pack transfert teh reward from its own supply
    // and there will be no supply imcrementaion when someone open a pack

    // burn a 1 pack from the 55 
         const sdk = GetThirdWebSDK_fromSigner();  
         const packContract = await sdk.getContract(PACK_ADDRESS);
         await packContract.erc1155.burn(0, 1);

       // PackRewardTransfer( packToOpen );
     // Start minting process asynchronously
        mintNFT( packToOpen, openerAddress );
    
    
         response.status(200).json(  packToOpen );
    
        
      } catch (e) {
         console.error(e);
        response.status(500).json({ error: "An error occurred" });
      }
     
    }
    
    );


    router.post("/getOpenedPack", async (req, response) => {
      try {
          
        
         
     const openerAddress =  req.body.openerAddress; 
     const userID = req.body.userID;
    // low let's send this the mongo
      
      const {mongoClient} = await connectToDataBase();
      
      const db = mongoClient.db("wudb");
      const collection = db.collection("opened_packs");
     
     const openedPackForThatUser = await collection.findOne({ "ID": userID });
     if (openedPackForThatUser) {
      // Document found
      console.log("Document found:", openedPackForThatUser);
    } else {
      // Document not found
      console.log("Document not found for ID:", userID);
    
      // You may choose to handle this case accordingly
    }
    
    
         response.status(200).json(  openedPackForThatUser );
    
        
      } catch (e) {
         console.error(e);
        response.status(500).json({ error: "An error occurred" });
      }
     
    }
    
    );



  // web 2 custom pack   
router.post("/CreateBundlePack", async (req, response) => {
  try {
      
     // const sdk = await GetThirdWebSDK_fromSigner();// GetThirdWebSDK_fromPrivateKey();  //ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");
      // console.log( sdk);
      // GetThirdWebSDK_fromSigner();
    
      const generatedData =  await generateData();
       // for WEB2 pack geenration
      const cardList = generatedData.flatMap((card) =>
      Array.from({ length: card.totalRewards }, () => card.tokenId)
      );
      console.log( "cardList" , cardList );
      const packSize = 5;
      const packs = createPacksWEB2(cardList, packSize );
      const packID = 0;
      console.log( "packs" , packs );

      console.log( "packs length" , packs.length );
      const newdoc ={
        packID: packID,
        packs:packs 
      
       }

// low let's send this the mongo
  
  const {mongoClient} = await connectToDataBase();
  
  const db = mongoClient.db("wudb");
  const collection = db.collection("packs");
  const userTask = await collection.findOne({ "packID": packID });
          
          if (!userTask){
              collection.insertOne( newdoc );
          }else{
            
             await collection.replaceOne({ "packID": packID }, newdoc);
           //  await collection.updateOne({ "ID": ID }, updateQuery);
           
          }
 

      response.status(200).json( { res: packs }  );

    
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
    const contract = await sdk.getContract( TOOLS_ADDRESS);

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


async function GiveBurToClaimApprovalToSpendFromRewardToken( burnContract, wucoin ){

 
  const sdk = GetThirdWebSDK_fromSigner();
  const contract = await sdk.getContract(wucoin);

   
 
  const allowanceAmount = await contract.erc20.allowanceOf(OWNER, burnContract);
  console.log( "allowanceAmount" , allowanceAmount );
   if ( allowanceAmount &&  allowanceAmount.displayValue  > 0) {
 
      console.log( " " ,  burnContract , "is approved already " );
      // The contract is already approved
      // You can choose to skip the approval step
  } else {
    // i think this code was written for the case where the contract is deploy and used for the first time
      // The contract is not approved, proceed with the approval
     // contract.approve( OWNER, BURN_ TO_CLAIM );
     // approve and set allowance at the same time for that amount of token in WEI
     await contract.call("approve",  [burnContract, "5000000000000000000"]);
     await contract.call("transfer", [burnContract, "5000000000000000000"]);




  }
 
}


// i think this is claled from Post man
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
   

   let burnContract = req.body.burnContract;
   let wucoin = req.body.wucoin;
   let chain = req.body.chain;
   let wuLayersAddress =  req.body.wuLayersAddress;
   

   console.log( "burnContract  >>>>>"  , burnContract );
   console.log( "wucoin  >>>>>"  , wucoin );
   console.log( "chain  >>>>>"  , chain );
   console.log( "wuLayerAddress  >>>>>"  , wuLayersAddress );


   if ( filteredImages === null || address === null) {
    throw new Error('One or more required parameters are null.');
  }

 // compare combo layers that are about to be used to claim, with the layers that the user actually own
  const ownedNfts = await getOwned( address, wuLayersAddress, chain );
 
// this is the sets of token requiered to get the reward the user is attempting to get

 const he_id = filteredImages.he[0].tokenID;
 const sh_id = filteredImages.sh[0].tokenID;
 const we_id = filteredImages.we[0].tokenID;
 const be_id = filteredImages.be[0].tokenID;
 const kn_id = filteredImages.kn[0].tokenID;

const reward_claim_for_tokenIDs=[ he_id.toString(),sh_id.toString(), we_id.toString(), be_id.toString(),kn_id.toString() ];

 console.log( "reward_claim_for_tokenIDs =",  reward_claim_for_tokenIDs );

// 1a) now we compare them with what this adress own
const owned_tokenIDs=[];
ownedNfts.forEach(element => {
  const id =  element.metadata.id;
  owned_tokenIDs.push(  id.toString()  );
   
}); 
console.log( " owned_tokenIDs =",   owned_tokenIDs );
const matchResult=[];
 


reward_claim_for_tokenIDs.forEach(id => {     // user 5 tokenIDs submitted from client
  const res =  owned_tokenIDs.includes( id ); // does user really owns these TokenIDs
  console.log( " test ID  " , id   ,  "   res  =", res );
  matchResult.push( { id_required:id , result:res   });
});



console.log( " containsMissingTokenID >>>>>>>>>>>>>>  "  );
const containsMissingTokenID = matchResult.some(item => item.result === false);
/* some token ID are missing we can not go further

*/


console.log( "containsMissingTokenID  >>>>>"  , containsMissingTokenID );
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
   he : {tokenID: he_id},
   sh :{tokenID: sh_id},
   we : {tokenID: we_id},
   be : {tokenID: be_id},
   kn : {tokenID: kn_id}, 
   chain : chain
}



let endpoint = `${process.env.SERVER_URL}GetRewardPrice`;// GetReward`;
let reward_res = await axios.post(endpoint, dataToSend);
 let reward_result = reward_res.data;

// 3) we send the reward to wallet 
// We make sure we burn the token used to get this reward
//check thirdweb video tutorial. BORED YATCH APE CLUB , for burn to claim
//const burn_he = await contract.erc1155.burn(tokenId, amount);



//await transfert(address , reward_result.finalRewardPrice   );
 
  
//=======================================================================================================
// SMART CONTRACT / BLOCKCHAIN INTERACTION
//================================================================================================================

//================================================================================================================
    //============================================================================================================

    let contractABI;; // Replace with your contract's ABI

    if ( chain === "sepolia" ){ 
      contractABI = ABI;
    }else{

      contractABI = ABIBASE;
    }


  //  const contractAddress = BURN _TO_CLAIM; // Replace with your contract's address
    
     const provider = new ethers.providers.JsonRpcProvider("https://sepolia.rpc.thirdweb.com"); // Replace with your Ethereum node URL
    
   
    const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY, provider); // Replace with the private key
    
    const contract = new ethers.Contract(  burnContract  , contractABI, signer);

/*========================================================================================================
   CHECK FOR APPROVE FROM REWARD TOKEN CONTACT  or BURN TO CLAIM (BURN TO GET REWARD) WILL FAILS
  =======================================================================================================*/
 /*
  Make sure the Burn And Claim contract is approved by token contract, since
 its spends money from it.
 Note, this appoval transaction must be signed by owner, so it can be done on this server with private key

*/
    // Assuming `owner` is the owner's address and `spender` is the contract's address
    //const contract = await sdk.getContract(REWARDS_ADDRESS); 
    //to do: this function should be shared by multiple contract.. add arguments etc..
      await GiveBurToClaimApprovalToSpendFromRewardToken( burnContract, wucoin );
       
/*================================================================================================
                     END OF APPROVE  CHECK
==============================================================================================*/



    const rewardAmountInEther = reward_result.finalRewardPrice; 
    const rewardAmountInWei = ethers.utils.parseUnits(rewardAmountInEther.toString(), "ether");
    const rewardAmountInInteger = parseInt(rewardAmountInWei.toString());
    
    console.log( " >>>>>>   rewardAmountInInteger",  rewardAmountInInteger   );
    

   // response.status(200).json( {res: " ok " });


  //  return;

    console.log( " >>>>>>   rewardAmountInWei", rewardAmountInWei  );

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
//[29,2,40,19,33]
 let tokenIdsToBurn = [he_id, sh_id, we_id, be_id, kn_id];
// let tokenIdsToBurn = [0, 12, 21, 34, 40];

     const tx2 = await contract.burnAndClaim(address, tokenIdsToBurn  , {gasLimit: 300000  } );
 
        const receipt2 = await tx2.wait();
     
       if (receipt2.status === 1) {
             console.log("Transaction succeeded");
        // Your logic for a successful transaction
         } else {
             console.error("Transaction failed");
        // Your logic for a failed transaction
         }
 
     response.status(200).json( {res: " ok " });
  
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


}

);
 

//=====================================================

router.post("/setRewardStatusAndaddDist", async (request, response) => {
 
  try {
 
          const {mongoClient} = await connectToDataBase();
          const db = mongoClient.db("wudb");
          const collection = db.collection("app_tasks");
   
          const ID = request.body.ID;
          const taskID = request.body.taskID;
           
          console.log(" ================= task taskID    = " , taskID);
          if (ID === null  || taskID === null ) {
              throw new Error('/setUserTask :One or more required parameters are null.');
          }
 

          const userTask = await collection.findOne({ "ID": ID });
          
          if (!userTask){

            const newdoc ={
              ID: ID,
             tasksData:[ 
               {completed:false , rewarded:false},
               {completed:false , rewarded:false},
               {completed:false , rewarded:false},
               {completed:false , rewarded:false},
               {completed:false , rewarded:false}
             ]  
            }
            collection.insertOne( newdoc );
          }else{
               // Update the existing document
             
              const updateQuery = {
              $set: {
                  [`tasksData.${taskID}`]: { completed: true, rewarded: true }
              }
              };
              await collection.updateOne({ "ID": ID }, updateQuery);
           
          }
          
         
          const userTaskModified = await collection.findOne({ "ID": ID }) ;
    




         response.status(200).json(  userTaskModified  ); // result
  }catch(e){
         console.error(e);
         response.status(500).json(e);


  }
})




router.get("/addto_inviteStaking", async (request, response) => {
 
  try {
 
       await addto_inviteStaking();
         response.status(200).json(  {message:"ok"}  ); // result
  }catch(e){
         console.error(e);
         response.status(500).json(e);


  }
})
export async function addto_inviteStaking( ID , acceptedUsersLength ){
    
 let recipientAddress;
 let mongoResult;
    try {
      
        const {mongoClient} = await connectToDataBase();
        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        
        mongoResult = await collection      
        .findOne({ ID: ID }, { projection: { wallet: 1, _id: 0 } }); // Include only the specified fields
            
      }catch(e){
          console.error(e);
          console.log("no address found");
      
      }
      recipientAddress = mongoResult.wallet;
 


       console.log("recipientAddress found : " , recipientAddress );

 
  
const sdk = GetThirdWebSDK_fromSigner();
const contract = await sdk.getContract( Discord_tokenLess_stakinContract );

console.log( " before: acceptedUsersLength"   ,acceptedUsersLength    ) ;
const weiValue = ethers.utils.parseUnits( acceptedUsersLength.toString(), 'ether');
 acceptedUsersLength = weiValue;

 console.log( "after: acceptedUsersLength"   ,acceptedUsersLength    ) ;
 
   const call = await contract.call("setStackedAmount",[recipientAddress, acceptedUsersLength ])
  // console.log( "DO NOT FORGET TO REACTIVATE contract SetStackAmount    ====  ", acceptedUsersLength   );
}

export async function transfertDIST( recipientAddress){

  recipientAddress = OWNER2;
 
  await setApprovalandTransfertFromRewardToken( Discord_invite_stake_token, Discord_stake_contract );
    
  transfert(   recipientAddress , 100 ,  Discord_invite_stake_token );
 
 }







//=====================================================

 


 
 async function  setApprovalandTransfertFromRewardToken(REWARDS_TOKEN, SPENDER_CONTRACT){

 
  const sdk = GetThirdWebSDK_fromSigner();
  const contract = await sdk.getContract(REWARDS_TOKEN);
  
  // ste allowance way smaller for discor contrat
  const allowanceAmount = await contract.erc20.allowanceOf(OWNER, SPENDER_CONTRACT );
  console.log( "allowanceAmount" , allowanceAmount );
   if ( allowanceAmount &&  allowanceAmount.displayValue  > 0) {
 
      console.log( " " ,  SPENDER_CONTRACT , "is approved already " );
      // The contract is already approved
      // You can choose to skip the approval step
  } else {
    // i think this code was written for the case where the contract is deploy and used for the first time
      // The contract is not approved, proceed with the approval
     
     // approve and set allowance at the same time for that amount of token in WEI
     await contract.call("approve",  [SPENDER_CONTRACT, "5000000000000000000"]);
     await contract.call("transfer", [SPENDER_CONTRACT, "5000000000000000000"]);




  }
 
}

  

  router.post("/GetOwnedNFTs", async (req, response) => {
    try {
 
        const address                = req.body.address;
        const chain                  = req.body.chain;

         if (address === null  ) {
          throw new Error('One or more required parameters are null.');
        }

        
       

      const ownedNfts = await getOwned(address, chain );
 
        response.status(200).json( ownedNfts );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 

  }
  
  );
 




  export default router;



  
   

  async function getOwned(address, wuLayerAddress, chain ){

    const sdk = GetThirdWebSDK_fromSigner( chain );
    const contract = await sdk.getContract(wuLayerAddress);
  
    // For ERC1155
    const nfts = await contract.erc1155.getOwned(address);

    return nfts;
 
  }
//web3  ERC20  we use Thridweb sdk for non custom function sicen that works
  async function transfert( toAddress , priceConfirmation ,  FromContract ){
   

 
 
   
    const sdk = GetThirdWebSDK_fromSigner();
   
  const contract = await sdk.getContract(FromContract);
  
 // priceConfirmation =  "57.78";

 console.log( "priceConfirmation" , priceConfirmation  );
   const amount =priceConfirmation ;// parseFloat(priceConfirmation);

   console.log( "amount" , amount , "toAddress    = " , toAddress );
  
   
  // The amount of tokens you want to send
  
  await contract.erc20.transfer(toAddress,  amount );
  
  }
  

  