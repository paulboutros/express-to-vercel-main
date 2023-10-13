 

import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/getSocialData", async (req, response) => {

    //const sources = req.query.source.split(',');
    const sources = req.query.source;
  const limit = req.query.limit;
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
    const db = mongoClient.db("wudb");
   const collection = db.collection("users");

   const sortOptions = { "scoreData.socialScore": -1 };

    let jsonData = await collection .
    find({}, { }).
    sort(sortOptions).
    limit(Number(limit)).
    toArray();
    
    let combinedData = [];

    if (  sources.includes('discord')  && sources.includes('twitter')   ) {
       // discord_json= await collection .find().sort().toArray();
       const dataJson = discord_twitter_data (jsonData)
        
  
        

       combinedData = [...dataJson];
    } else if ( sources.includes('twitter') ) {

        
        //twitter_json= await collection .find().sort().toArray();
        const flattenedData = twitterData(jsonData);

      combinedData = [...flattenedData];
    } else 
    
    if (sources.includes('discord')  ) { // && sources.includes('twitter') 
        const flattenedData = discord_data(jsonData);

      combinedData = [...flattenedData];
       //  const jsonData = await collection .find().sort().toArray();
       // const disc_twit_flat = discord_twitter_data(jsonData);
      
    }
    
    // Add the "id" property to each element with an incrementing value
    // Add the "id" property to each element with an incrementing value
combinedData = combinedData.map((element, index) => ({
    ...element,
    id: index + 1
    
  }));
 
  response.status(200).json(combinedData ); //combinedData

  //response.status(200).json(source ); //combinedData
    
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;


function discordBlock  (item) {
    

    const jjj = {
      //  wallet : item.wallet,
        wallet : item.wallet,
        walletShort :item.walletShort,
        discord: item.discord,

        socialScore: item.scoreData.socialScore, // need for chart bar max length
    
        total: item.scoreData.discord.total,
        invite_code: item.scoreData.discord.invite_code,
        message: item.scoreData.discord.message,
        invite_sent: item.scoreData.discord.invite_sent,
        invite_use: item.scoreData.discord.invite_use,
        fake_invite: item.scoreData.discord.fake_invite,
        discord_score: item.scoreData.discord.discord_score 
    }
   return jjj;
}

function twitterblock  (item) {
    

    const jjj = {
    wallet : item.wallet,
    walletShort :item.walletShort,
    discord: item.discord,

    socialScore: item.scoreData.socialScore, // need for chart bar max length

    like :item.scoreData.twitter.like , 
    retweet: item.scoreData.twitter.retweet   
    }
   return jjj;
}
function combine_twitter_discord(item) {
    const discordData = discordBlock(item);
    const twitterData = twitterblock(item);

    return {
        ...discordData,
        ...twitterData
 
    };
}




 function discord_twitter_data(resultsJson){
    const flattenedData = resultsJson.map((item) => ( 
        
        combine_twitter_discord(item)
        
        
        ));
  
       return flattenedData;

 }

 function twitterData(resultsJson){
    const flattenedData = resultsJson.map((item) => (
        twitterblock(item)
        // Add more flattened properties as needed
      ));

     return flattenedData;
 }
function discord_data(resultsJson){
   // let i = 0;
    const flattenedData = resultsJson.map((item) => ( 

        discordBlock(item)
    ));

 return flattenedData;

}
 