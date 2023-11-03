
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 // Calculate the total number of milliseconds for the duration
const millisecondsInADay = 24 * 60 * 60 * 1000; // 1 day
const millisecondsInAnHour = 60 * 60 * 1000; // 1 hour
const millisecondsInAMinute = 60 * 1000; // 1 minute

const duration = {
  days: 1,
  hours: 3,
  minutes: 20
};

/*

*/
const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
  router.post("/SetRewardNextTime", async (req, response) => {

   try{ 


    const timeResponse=  SetRewardNextTime(req, response);
     
    response.status(200).json( { time: timeResponse }  );
 
      
  } catch (e) {
     console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }






  }
  
  );
  
  
  export default router;


  export async function SetRewardNextTime(req, response  ){
/*
    
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("users");

      const ID = req.body.ID ;
 
      const currentTime = new Date();
  
      
      let timeResponse;

        

// Format nextTime as a UTC date string
let  totalMilliseconds  =   req.totalMilliseconds; 
const nextTimeUTCString =   req.nextExecution;  


console.log(">>>  nextTimeUTCString   "  , nextTimeUTCString);

 
const durationInMilliseconds = 30000; 

// Calculate the future time
const futureTime = new Date(currentTime.getTime() + durationInMilliseconds);
 


const projection = {"_id": false,
     "ID": true, 
    "discord": true, 
     "giveAwayTiming.NextGiveAway": true, 
     "giveAwayTiming.lastGiveAway": true,
     "giveAwayTiming.frequency": true,
      "giveAways":true// we do not really need this but this of for debugging,
     // to make sure it adds all the giveaway to all
    };
     
      const allUsers = await collection.find({}).project( projection ).toArray();

     // console.log("allUsers", allUsers);
console.log( "server: SetRewardNextTime function is called at" , new Date() );
const bulkUpdateOperations =[];
allUsers.forEach(element => {

  if (element.ID == "423608837900206091"){

     console.log( "  >>   currentTime",   currentTime  ,
      "  NextGiveAway = "   , element.giveAwayTiming.NextGiveAway,
      "time left before giveaway =",( element.giveAwayTiming.NextGiveAway - currentTime) 
      );
  }


   bulkUpdateOperations.push(
    {
      updateOne: {
        filter: { "ID": element.ID },
        update: {
          $set: {
           // 'giveAwayTiming.lastGiveAway': currentTime,
            'giveAwayTiming.frequency': element.giveAwayTiming.frequency,// totalMilliseconds, dfrequancy is update individual by user buying, or action
           }
        }
      }
    }


   )
});
await collection.bulkWrite(bulkUpdateOperations);

 

            timeResponse = {
              currentTime:currentTime,
              frequency: totalMilliseconds,
              NextGiveAway:nextTimeUTCString

            };
        
       
     return timeResponse;
*/
  }

 