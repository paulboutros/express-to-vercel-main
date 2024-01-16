
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
 
  }

 