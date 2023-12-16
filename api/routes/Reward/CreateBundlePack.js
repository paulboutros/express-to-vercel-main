//pack tuto:
//https://www.youtube.com/watch?v=apyHxCppmbI&t=4971s
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
//import {GetThirdWebSDK, GetThirdWebSDK_fromPrivateKey, GetThirdWebSDK_fromSigner } from "../../../utils/thirdwebSdk.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk"

import dotenv from "dotenv";
import { TOOLS_ADDRESS } from "../../../const/addresses.js";
import { GetThirdWebSDK_fromPrivateKey } from "../../../utils/thirdwebSdk.js";

dotenv.config();

//node CreateBundlePack.js
  
 export async function createBundle( sdk){
       
    

    return generateData();



    const { mongoClient } = await connectToDataBase();
    const db = mongoClient.db("wudb");
    const collection = db.collection("packs");
  
    const packAddress = "0x576540949D891f439b356411227E450aA3b62788";
    const cardAddress =  TOOLS_ADDRESS ;//"0xF810082B4FaC42d65156Da88D5212dfAA75D0117";

   //p const pack = await sdk.getContract(packAddress, "pack");

    //const card = await sdk.getContract(cardAddress, "edition");
    //await (await card).setApprovalForAll(packAddress, true);
    console.log("Approved card contract to transfer cards to pack contract");

    const packImage =  "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiffqlsjlkbibt44ahcrukz3upc7ycfwx54ziqxikfcr2ws6psh5gm/logo512.png";

    console.log("Creating pack 2");
    const createPacks = {
        packMetadata: {
          name: "Pack 1",
          description: "A new card pack",
          image: packImage,
        },
        erc1155Rewards: 
        [
            {
              contractAddress: cardAddress,
              tokenId: 0,
              quantityPerReward: 1,
              totalRewards: 1
            },
            {
              contractAddress: cardAddress,
              tokenId: 1,
              quantityPerReward: 1,
              totalRewards: 2
            },
            {
              contractAddress: cardAddress,
              tokenId: 2,
              quantityPerReward: 1,
              totalRewards: 3
            },
            {
              contractAddress: cardAddress,
              tokenId: 3,
              quantityPerReward: 1,
              totalRewards: 4
            },
            {
              contractAddress: cardAddress,
              tokenId: 4,
              quantityPerReward: 1,
              totalRewards: 5
            },
            {
              contractAddress: cardAddress,
              tokenId: 5,
              quantityPerReward: 1,
              totalRewards: 6
            },
            {
              contractAddress: cardAddress,
              tokenId: 6,
              quantityPerReward: 1,
              totalRewards: 7
            },
            {
              contractAddress: cardAddress,
              tokenId: 7,
              quantityPerReward: 1,
              totalRewards: 8
            },
            {
              contractAddress: cardAddress,
              tokenId: 8,
              quantityPerReward: 1,
              totalRewards: 9
            },
            {
              contractAddress: cardAddress,
              tokenId: 9,
              quantityPerReward: 1,
              totalRewards: 10
            },
            {
              contractAddress: cardAddress,
              tokenId: 10,
              quantityPerReward: 1,
              totalRewards: 1
            },
            {
              contractAddress: cardAddress,
              tokenId: 11,
              quantityPerReward: 1,
              totalRewards: 2
            },
            {
              contractAddress: cardAddress,
              tokenId: 12,
              quantityPerReward: 1,
              totalRewards: 3
            },
            {
              contractAddress: cardAddress,
              tokenId: 13,
              quantityPerReward: 1,
              totalRewards: 4
            },
            {
              contractAddress: cardAddress,
              tokenId: 14,
              quantityPerReward: 1,
              totalRewards: 5
            },
            {
              contractAddress: cardAddress,
              tokenId: 15,
              quantityPerReward: 1,
              totalRewards: 6
            },
            {
              contractAddress: cardAddress,
              tokenId: 16,
              quantityPerReward: 1,
              totalRewards: 7
            },
            {
              contractAddress: cardAddress,
              tokenId: 17,
              quantityPerReward: 1,
              totalRewards: 8
            },
            {
              contractAddress: cardAddress,
              tokenId: 18,
              quantityPerReward: 1,
              totalRewards: 9
            },
            {
              contractAddress: cardAddress,
              tokenId: 19,
              quantityPerReward: 1,
              totalRewards: 10
            },
            {
              contractAddress: cardAddress,
              tokenId: 20,
              quantityPerReward: 1,
              totalRewards: 1
            },
            {
              contractAddress: cardAddress,
              tokenId: 21,
              quantityPerReward: 1,
              totalRewards: 2
            },
            {
              contractAddress: cardAddress,
              tokenId: 22,
              quantityPerReward: 1,
              totalRewards: 3
            },
            {
              contractAddress: cardAddress,
              tokenId: 23,
              quantityPerReward: 1,
              totalRewards: 4
            },
            {
              contractAddress: cardAddress,
              tokenId: 24,
              quantityPerReward: 1,
              totalRewards: 5
            },
            {
              contractAddress: cardAddress,
              tokenId: 25,
              quantityPerReward: 1,
              totalRewards: 6
            },
            {
              contractAddress: cardAddress,
              tokenId: 26,
              quantityPerReward: 1,
              totalRewards: 7
            },
            {
              contractAddress: cardAddress,
              tokenId: 27,
              quantityPerReward: 1,
              totalRewards: 8
            },
            {
              contractAddress: cardAddress,
              tokenId: 28,
              quantityPerReward: 1,
              totalRewards: 9
            },
            {
              contractAddress: cardAddress,
              tokenId: 29,
              quantityPerReward: 1,
              totalRewards: 10
            },
            {
              contractAddress: cardAddress,
              tokenId: 30,
              quantityPerReward: 1,
              totalRewards: 1
            },
            {
              contractAddress: cardAddress,
              tokenId: 31,
              quantityPerReward: 1,
              totalRewards: 2
            },
            {
              contractAddress: cardAddress,
              tokenId: 32,
              quantityPerReward: 1,
              totalRewards: 3
            },
            {
              contractAddress: cardAddress,
              tokenId: 33,
              quantityPerReward: 1,
              totalRewards: 4
            },
            {
              contractAddress: cardAddress,
              tokenId: 34,
              quantityPerReward: 1,
              totalRewards: 5
            },
            {
              contractAddress: cardAddress,
              tokenId: 35,
              quantityPerReward: 1,
              totalRewards: 6
            },
            {
              contractAddress: cardAddress,
              tokenId: 36,
              quantityPerReward: 1,
              totalRewards: 7
            },
            {
              contractAddress: cardAddress,
              tokenId: 37,
              quantityPerReward: 1,
              totalRewards: 8
            },
            {
              contractAddress: cardAddress,
              tokenId: 38,
              quantityPerReward: 1,
              totalRewards: 9
            },
            {
              contractAddress: cardAddress,
              tokenId: 39,
              quantityPerReward: 1,
              totalRewards: 10
            },
            {
              contractAddress: cardAddress,
              tokenId: 40,
              quantityPerReward: 1,
              totalRewards: 1
            },
            {
              contractAddress: cardAddress,
              tokenId: 41,
              quantityPerReward: 1,
              totalRewards: 2
            },
            {
              contractAddress: cardAddress,
              tokenId: 42,
              quantityPerReward: 1,
              totalRewards: 3
            },
            {
              contractAddress: cardAddress,
              tokenId: 43,
              quantityPerReward: 1,
              totalRewards: 4
            },
            {
              contractAddress: cardAddress,
              tokenId: 44,
              quantityPerReward: 1,
              totalRewards: 5
            },
            {
              contractAddress: cardAddress,
              tokenId: 45,
              quantityPerReward: 1,
              totalRewards: 6
            },
            {
              contractAddress: cardAddress,
              tokenId: 46,
              quantityPerReward: 1,
              totalRewards: 7
            },
            {
              contractAddress: cardAddress,
              tokenId: 47,
              quantityPerReward: 1,
              totalRewards: 8
            },
            {
              contractAddress: cardAddress,
              tokenId: 48,
              quantityPerReward: 1,
              totalRewards: 9
            },
            {
              contractAddress: cardAddress,
              tokenId: 49,
              quantityPerReward: 1,
              totalRewards: 10
            }
        ]
        
        ,
        rewardsPerPack: 5,
    } ;
   
    const result = await collection.insertOne(createPacks);
    console.log("Packs created");



 }
 // if need run this code to geenrate the data instead
 
 function generateData(  ){

     
    const cardData = [];
    
    let totalRewards = 1;
   // let cardAddress = "cardAddress";
    for (let tokenId = 0; tokenId < 49; tokenId++) {
    
    
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




 