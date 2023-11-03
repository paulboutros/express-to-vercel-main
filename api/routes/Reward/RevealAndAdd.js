
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 
const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.post("/RevealAndAdd", async (req, response) => {

    //https://www.mongodb.com/docs/manual/reference/operator/aggregation/arrayElemAt/
    try {



      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");

      const ID = req.body.ID ;
      const index = req.body.index ;
      const time   = req.body.time; 
      const currentTime = new Date();

      const filter = {ID:ID}; 
     // const result = await collection.find({ "ID": ID }, { "giveAwayTiming": 1})
 // an other projection format:
 //const allUsers = await collection.find({}).project( projection ).toArray();
      //================================
      const pipeline = [
        
        {
          $match: {
            ID: ID // Replace with the desired user's ID
          }
        },
        {
          $project: {
            _id: 0,
            discord: 1,
            wallet: 1,
            clickedCard: { $arrayElemAt: [ "$giveAwayTiming.giveAways", index ] },
          
          } 

        },
      ];
  
      
      //const allUsers = await collection.updateOne( filter ).project( pipeline ).toArray();

     const result = await collection.aggregate(pipeline).toArray();
      

     const updateCl = { $set: {  [`giveAwayTiming.giveAways.${index}.claimed`]: true, },  };
     const resultClaim =  await collection.updateOne( filter, updateCl  );
     
     
      

      const update = {
        //$addToSet   // push or add ONLY if element does not exist, (so element are unique)
        $push: {
          [`layers.${    result[0].clickedCard.category   }`]:   result[0].clickedCard.layer  ,
        },
      };
 
       console.log(  " card to category  " ,  result[0].clickedCard.category   ,
                      " card to layer  " ,     result[0].clickedCard.layer,
                      "modif index " , index 
                      );
       // add the layer that was stored in the unrevealed giveaway card
      const addCard = await collection.updateOne(filter , update);
      
     // did not added    
 //{acknowledged: true, modifiedCount: 0, upsertedId: null, upsertedCount: 0, matchedCount: 1}
 // did worked
//  acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1}

    // remove pull card from giveaway list
    /*
    const pullFilter = {  time:time };
      const pullUpdate = {
        $pull: {
          "giveAwayTiming.giveAways": pullFilter , // The specific element to be removed
        },
      };
 
      const removeGiveAwayCard = await collection.updateOne(filter, pullUpdate);
      
       
      const pullUpdate = {
        $pull: {
          "giveAwayTiming.giveAways": pullFilter , // The specific element to be removed
        },
      };
 
      const removeGiveAwayCard = await collection.updateOne(filter, pullUpdate);
*/

      response.status(200).json( { time:{result:result, addCard:addCard  }  }  );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 
  }
  );
  
  
  export default router;

 