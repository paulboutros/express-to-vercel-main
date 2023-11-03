
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 

const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.get("/GetReward", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("comboreward");




     // reward is based on layer supply:    
     // so we need these info 
     
     const layerSupplyCollection = await db.collection("layer_supply");

      const he_number = req.query.he;
      const sh_number = req.query.sh;
      const we_number = req.query.we;
      const be_number = req.query.be;
      const kn_number = req.query.kn;
       

      const layerResult = [];
      const cursor = await layerSupplyCollection.find({})
       

      // layer supply for that reward
      let reward_layerSupplies;
      for await (const doc of cursor) {
        // layerResult.push(doc);

        const he_supply = doc.layers.he[he_number];
        const sh_supply = doc.layers.sh[sh_number];
        const we_supply = doc.layers.we[we_number];
        const be_supply = doc.layers.be[be_number];
        const kn_supply = doc.layers.kn[kn_number];


       

        reward_layerSupplies = { kn: kn_supply, be : be_supply,  we : we_supply, he : he_supply,sh : sh_supply}
        layerResult.push(reward_layerSupplies);
      }
    
      

      const rewardInfo={
/*
        categoryinfo :[
             { Weights:0,
               Supplies:0
            }
        ]*/
      };


      const categoryWeights = {};

      for (const category in reward_layerSupplies) {
        if (reward_layerSupplies[category] > 0) {
          // Use an inverse relationship: weight = 1 / supply
          categoryWeights[category] = 1 / reward_layerSupplies[category];
        } else {
          // Assign a default weight for categories with zero supply
          categoryWeights[category] = 10; // Adjust this value as needed
        }

        rewardInfo[category] = { 
            supply: reward_layerSupplies[category],
            weights: categoryWeights[category] 
        
        }  
      }
      
     // console.log("rewardInfo = "     , rewardInfo);
    //  console.log("categoryWeights = "     , categoryWeights);
    //  console.log("reward_layerSupplies = " , reward_layerSupplies);


//================================================================
  // Calculate the total weight of all categories
const totalWeight = Object.values(categoryWeights).reduce((total, weight) => total + weight, 0);

// Calculate the percentage for each category
const categoryPercentages = {};
for (const category in categoryWeights) {
  const weight = categoryWeights[category];
  const percentage = (weight / totalWeight) * 100; // Scaling to a percentage
  categoryPercentages[category] = percentage;
}

//console.log( "categoryPercentages = "  , categoryPercentages);
 


//================================================







    // Example combination
const combination = {
    kn: kn_number,
    be: be_number,
    we: we_number,
    he: he_number,
    sh: sh_number,
  };
   


    // Calculate the total score
const totalScore = calculateScore(combination , categoryWeights);



//================== partial reward and final price  reward


const totalCategoryPercentage = 20; // Total percentage allocated for all categories
const rewardPool = 300; // Total reward pool amount

// Initialize the object to store partial rewards for each category
const partialRewards = {};

// Calculate the partial reward for each category
for (const category in categoryWeights) {
  const weight = categoryWeights[category];

  // Calculate the percentage of the reward pool that this category contributes
  const categoryPercentage = (weight / totalCategoryPercentage) * 100;

  // Calculate the partial reward for this category
   const partialReward = (categoryPercentage / 100) * (rewardPool * (totalCategoryPercentage / 100));

  partialRewards[category] = partialReward;

  rewardInfo[category].partialReward = partialReward;
}

// Sum up the partial rewards to get the final reward price
const finalRewardPrice = Object.values(partialRewards).reduce((sum, partialReward) => sum + partialReward, 0);

//console.log('Partial Rewards:', partialRewards);
//console.log('Final Reward Price:', finalRewardPrice);

rewardInfo.finalRewardPrice = finalRewardPrice
//console.log("rewardInfo = "     , rewardInfo);




// partial reward ends

















// Determine the reward price based on the total score
//const rewardPrice = determineRewardPrice(totalScore);

//console.log("Total Score:", totalScore);
//console.log("Reward Price:", rewardPrice);





      response.status(200).json( rewardInfo );
 
      
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

     // console.log("calcul:"   + category   + "  catScore  " + catScore   );
    }
    return totalScore;
  }
  
  // Determine the reward price based on the total score
   



  