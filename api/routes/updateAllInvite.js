import { connectToDataBase } from "../../lib/connectToDataBase.js";

//http://localhost:3000/api/addorupdate
//api/addorupdate
//export default async function hanfler(request , response){

import express from "express";
//import authenticate from "./middlewares/authenticate.js";



const router = express.Router();
 router.post("/updateAllInvite", async (req, response) => {
    try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
   
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");


    if (!req.body.discordScoredData) {
        // Create an error object with your custom error message
        const error = new Error("discordScoredData not defined in the body");
        // Set the HTTP status code for the response to indicate an error (e.g., 400 Bad Request)
        response.status(400);
        // Send the error message in the response
        response.json({ success: false, error: error.message });
        return; // Stop further execution
    }
   //===
   let discordScoredData = req.body.discordScoredData; // Assuming you receive an array of invite data
 

   const updates = discordScoredData.map(({ userID, invitesSent, invitesAccepted, invite_code , fake_invite, message }) => ({
     updateOne: {
       filter: { ID: userID }, // Assuming "_id" is the unique identifier for users
       update: {
         $set: { 
             
             "scoreData.discord.invite_use": invitesAccepted ,
             "scoreData.discord.invite_code": invite_code ,

             "scoreData.discord.fake_invite": fake_invite ,
             "scoreData.discord.message": message 
             
             
             

            }
       }
     }
   }));

   const results = await db.collection('users').bulkWrite(updates);
   
 

           response.json({ success: true, message: 'Invite scores updated successfully' });
          // response.status(200).json( responseObj ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
});

export default router;