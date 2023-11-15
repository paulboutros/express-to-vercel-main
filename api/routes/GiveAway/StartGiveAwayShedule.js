import schedule from 'node-schedule';
import  {Push_giveaway_toList } from "../GiveAway/GiveAwayLayers.js"
import  {Push_giveaway_toListMANYUSERS } from "../GiveAway/GiveAwayLayers.js"


import  {SetRewardNextTime } from "../Reward/SetRewardNextTime.js"

 //https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
//import { newUserDocumentTemplate , globalTemplate , CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
  import _ from 'lodash'
 

  const router = express.Router();

   
  
  router.post("/StartGiveAwayShedule", async (request, response) => {

  
    try {
     
           functionStartGiveAwayShedule(request,response) ;

           response.status(200).json( {time:"" } ); //  timeResponse
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})

export default router; 

export  async function  functionStartGiveAwayShedule(request,response){
 
 
    const {mongoClient} = await connectToDataBase();
     const db = mongoClient.db("wudb");
    const collection = await db.collection("users");
      


    const ID = request.body.ID;
     
         

    let timeLeft;
    const cronType = "repeat"
    const duration  = request.body.duration; 
    let cronExpression;
    
    if (cronType === "repeat" ){

      if (duration.minutes > 0 ){
        //  cronExpression =`*/ ${duration.minutes} * * * *`
      } 
      // warning if * or */ will override what ever if after * on minute will make every miinute and ignore day
      if (duration.days > 0 ){
           // cronExpression =`0 0 */${duration.days} * *`
      }   
          //server check all user to see if ready for give away
          //  cronExpression =`*/10 * * * * *`
            cronExpression =`*/3 * * * *`
           // cronExpression =`* * /3 * *`
     //  cronExpression =`*/${duration.minutes} */${duration.hours} */${duration.days} * *`;
    }else{
       // exact date from current tiem to duration,,  for example  today + 2 days ... executeince
      const currentDateTime = new Date();
     
       const futureDay = currentDateTime.getDate() + parseInt(duration.days); 
      const futurHours = currentDateTime.getHours() + parseInt(duration.hours);   
      const futurMinute = currentDateTime.getMinutes() + parseInt(duration.minutes);   
      const futurSeconds = currentDateTime.getSeconds() + parseInt(duration.seconds); 
      cronExpression = `${futurMinute} ${futurHours} ${futureDay} * *`;

    }
    
  // her the cronExpression  
   const job =  schedule.scheduleJob(cronExpression,async () => {

     
   
    const currentDate = new Date();
 
      console.log(` request.nextExecutio.  ${   request.nextExecution  } `);
       
      // Push_giveaway_toList( ID ,1, true);
       Push_giveaway_toListMANYUSERS( ID ,1, true);
          
       
   
    });
   
   
    Push_giveaway_toListMANYUSERS( ID ,1, true);
    
      

}

function getTimeLeftUntilNextExecution( job) {



    const nextExecution = job.nextInvocation(); // Get the next execution date.

    
    const currentTime = new Date();

    console.log(`>>>>>>>>>>>>>>>  currentTime ${  currentTime  }   `);
    console.log(`>>>>>>>>>>>>>>>  Time nextExecution ${  nextExecution  }   `);
    const timeLeft  = nextExecution.getTime() - currentTime.getTime();


    console.log(`>>>>>>>>>>>>>>>  timeLeft ${  timeLeft  }   `);
   
    
    
     return timeLeft;
  }
  
  // Usage example:
  

 