 

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();


// this is copying the real DB
router.get("/createDiscordMockData", async (req, response) => {

  let result;
  try {
       
      const {mongoClient} = await connectToDataBase();
         

      const db = mongoClient.db("wudb");
      const collection = db.collection("users");
      
        result = await collection.aggregate([
          //  {
          //       $match: {
          //          discord: { $ne: "Wulirocks" } // Exclude documents with ID "Wulirocks"
          //       }
          //   },
          {
             $project: {
              _id: 0,
              ID:1,
              discord:1,
            
              "scoreData.discord.invite_code": 1  ,
              "scoreData.discord.invite_use": 1  ,
              
              id: 1,
            },
          },
        ]).toArray();



     //===================================================
    
    
     const inv_collection = db.collection("discord_invites");
 
     const ID = req.query.ID;
  
     result = await inv_collection.find({}).toArray();

     //====================================



        // great, this is an object that the data gris will use
        // the data above can come from any source or form, as long
       // as we compile here, with that form
          const newResult = result.map(item => ({
            wallet: "wallet_not_provided",
            walletShort: "wall..ided",
            discord:  item.ID, // Preserve the 'discord' property
            socialScore: 0,
            total: 0,
            scoreShareAbsolute: 0,
            invite_code:   item.invite,//   item.scoreData.discord.invite_code, // Preserve the 'scoreData.discord.invite_code' property
            message: 50,
            invite_sent: 0,
            invite_use:   item.acceptedUsers.length,//    item.scoreData.discord.invite_use, // Preserve the 'scoreData.discord.invite_use' property
            fake_invite: 0,
            discord_score: 0,
            id: item.ID,
          }));
 



          let temp;
    let totalInvite=0;
// depending on whether we use mockdata or not
  
  let resultsJson = newResult;//.json();

  console.log(  "resultsJson"  ,resultsJson);

   const listOfID = resultsJson.map(item => item.id);
  // let referredUserListDetails  = await getManyUserData(  listOfID   );

  const useMockData = true;

  const invite_use =[];
   let ss = resultsJson.map((item, index ) => {

    const invite_use_value = Math.floor(Math.random() * 21)   ;
    invite_use.push(invite_use_value)  ;
    totalInvite += invite_use_value;
   });


    temp = resultsJson.map((item, index ) =>  {

   // const invite_use = useMockData ? Math.floor(Math.random() * 31)  : item.data.invite_use;
   const invite_share = ( (invite_use[index] / totalInvite) * 100 ).toFixed(4);

   const nextInviteMaxThreshhold =  invite_use[index]<=10 ? 10 : 20
    return {
    discord: item.discord,
    invite_code : item.invite_code,

    id: item.id,
    data: {
      
      invite_use:invite_use[index],
      nextInviteMaxThreshhold: nextInviteMaxThreshhold,
    }, 
     
  
     invite_share:invite_share,
  

    invite_share: invite_share,
    tokenClaimPerDay:  invite_use[index]<=10 ? 100 : 200
   
    };

  } );


   
  const db_mock = mongoClient.db("wudbmock");
  const collection_mock = db_mock.collection("discordScore");
 
   //const mongo = await collection_mock.replaceOne({}, { data: temp }, { upsert: true });
   const mongo = await collection_mock.insertMany(temp);
          
   
             response.status(200).json(mongo);
        }catch(e){
              console.error(e);
              response.status(500).json(e);
   
   
       }
})

router.get("/getDiscordScoreMOCK", async (req, response) => {

  let result;
  try {
       
      const {mongoClient} = await connectToDataBase();
     
      const db_mock = mongoClient.db("wudbmock");
      const collection_mock = db_mock.collection("discordScore");
      const result = await collection_mock.find({}) .toArray();


             response.status(200).json( result);
        }catch(e){
              console.error(e);
              response.status(500).json(e);
   
   
       }
})



  // do not forget to use the endpoint in index.js
  router.get("/getDiscordScore", async (req, response) => {

    let result;
    try {
         
        const {mongoClient} = await connectToDataBase();
           

        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        
        /*
          result = await collection.aggregate([
           
            {
               $project: {
                _id: 0,
                ID:1,
                discord:1,
              
                "scoreData.discord.invite_code": 1  ,
                "scoreData.discord.invite_use": 1  ,
                
                id: 1,
              },
            },
          ]).toArray();
*/
   

       //===================================================
      
      
       const inv_collection = db.collection("discord_invites");
   
       const ID = req.query.ID;
    
       const discordInvites = await inv_collection.find({}).toArray();

       //====================================

 
 // STRUCT TO MATCH
  //  list of this type of object must be provided with to the board
    /*  
       {
    "_id": "658fe3536a88802f51d2fda0",
    "discord": "481961368896143360",
    "invite_code": "AV2yEaj7cV",
    "id": "481961368896143360",
    "data": {
        "invite_use": 11,
        "nextInviteMaxThreshhold": 20
    },
    "invite_share": "1.9678",
    "tokenClaimPerDay": 200
}
     */


     console.log(   "  result    =  "  , result );

        // great, this is an object that the data grid will use
        // the data above can come from any source or form, as long
         // as we compile here, with that data structur , this should match mock data as well

         const newResult = discordInvites.map(item => ({
        
           invite_code :  item.invite ,
           data : {
              invite_use :  item.acceptedUsers.length,
              nextInviteMaxThreshhold : 20
            },
            id: item.ID 
           
           
            }));

              /*
              const newResult = result.map(item => ({
          //    wallet: "wallet_not_provided",
          //    walletShort: "wall..ided",
           //   discord:  item.ID, // Preserve the 'discord' property
             // socialScore: 0,
           //   total: 0,
           //   scoreShareAbsolute: 0,
            //  invite_code:   item.invite,//   item.scoreData.discord.invite_code, // Preserve the 'scoreData.discord.invite_code' property
             // message: 50,
           //   invite_sent: 0,
             // invite_use:   item.acceptedUsers.length,//    item.scoreData.discord.invite_use, // Preserve the 'scoreData.discord.invite_use' property
            //  fake_invite: 0,
            //  discord_score: 0,
             invite_code : "AV2yEaj7cV",
             
              data : {
                 invite_use :  discordInvites.find(el => el.ID ==) ,
                 nextInviteMaxThreshhold : 20
             },



              id: item.ID,
              }));
               */
     
               response.status(200).json(newResult);
          }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})

export default router;
 