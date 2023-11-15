 


import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from 'dotenv';
import { FARMER_ADDRESS, REWARDS_ADDRESS, 
    STAKING_ADDRESS, TOOLS_ADDRESS,
     DROP_ADDRESS } from "../../../const/addresses.js";

import express from "express";
dotenv.config();


async function test(){

  /*
  const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  ); // "{{private_key}}"
  const sdk = await ThirdwebSDK.fromSigner(signer, "goerli", {
  // clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID , // Use client id if using on the client side, get it from dashboard settings
   secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
 });
*/


}
 



const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/SetClaimConditions", async (req, response) => {
    try {
      

 console.log("  THIRDWEB_SECRET_KEY, " +  process.env.REACT_APP_THIRDWEB_SECRET_KEY );
const sdk = new ThirdwebSDK("goerli", {
  secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY,
});




const contract = await sdk.getContract(TOOLS_ADDRESS);

//const { mutateAsync, isLoading, error } = useSetClaimConditions(contract);

const txResult = await contract.erc1155.claimConditions.set(
    0, // "{{token_id}}"  // ID of the token to set the claim conditions for
    [
      {
        metadata: {
          name: "Phase 1", // The name of the phase
        },
        currencyAddress: REWARDS_ADDRESS, // The address of the currency you want users to pay in
        price: 1, // The price of the token in the currency specified above
        maxClaimablePerWallet: 1, // The maximum number of tokens a wallet can claim
        maxClaimableSupply: 100, // The total number of tokens that can be claimed in this phase
        startTime: new Date(), // When the phase starts (i.e. when users can start claiming tokens)
        waitInSeconds: 60 * 60 * 24 * 7, // The period of time users must wait between repeat claims
        snapshot: [
/*
          {
            address:  process.env.DEPLOYER_ADRESS, // The address of the wallet
            currencyAddress: "0x...", // Override the currency address this wallet pays in
            maxClaimable: 5, // Override the maximum number of tokens this wallet can claim
            price: 0.5, // Override the price this wallet pays
          },
*/
        ],
       // merkleRootHash: "0x...", // The merkle root hash of the snapshot
      },
    ],
    false, // Whether to resetClaimEligibilityForAll (i.e. reset state of claims for previous claimers)
  );



 
       response.status(200).json(  {nice: "ok" }  );
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
  export default router;

