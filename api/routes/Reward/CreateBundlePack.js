//pack tuto:
//https://www.youtube.com/watch?v=apyHxCppmbI&t=4971s
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
//import {GetThirdWebSDK, GetThirdWebSDK_fromPrivateKey, GetThirdWebSDK_fromSigner } from "../../../utils/thirdwebSdk.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk"

import dotenv from "dotenv";
import { TOOLS_ADDRESS } from "../../../const/addresses.js";
 
dotenv.config();

//node CreateBundlePack.js
  
  
 // if need run this code to geenrate the data instead
 

 export function generateData(  ){

     
  const cardData = [];
  
  let totalRewards = 1;
  
  for (let tokenId = 0; tokenId < 50; tokenId++) {
  
  
    // const totalRewards = NFTs[ tokenId ].supply;
  
    cardData.push({
      contractAddress: TOOLS_ADDRESS,
      tokenId: tokenId,
      quantityPerReward: 1,
      totalRewards: totalRewards,
    });
  
    totalRewards++;
  
    if (totalRewards > 10) {
      totalRewards = 1;
    }
  }
  
  //console.log(cardData);

    return cardData;


}

 // this is for our web2 pack ceration
 export function createPacksWEB2(cardList, packSize) {
  const numberOfPacks = Math.floor(cardList.length / packSize);
  const packs = [];

  for (let i = 0; i < numberOfPacks; i++) {
    const pack = [];
    
    // Randomly pick cards for the pack
    for (let j = 0; j < packSize; j++) {
      const randomIndex = Math.floor(Math.random() * cardList.length);
      const selectedCard = cardList.splice(randomIndex, 1)[0];
      pack.push(selectedCard);
    }
    // packIdx for debugging mostlt
 //   packs.push(  { content:pack , packIdx : i } );
    packs.push(  pack   ); 
       
  }

  return packs;
}




 