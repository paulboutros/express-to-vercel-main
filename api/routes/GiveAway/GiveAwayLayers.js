

 
 import { connectToDataBase } from "../../../lib/connectToDataBase.js";
//import { newUserDocumentTemplate , globalTemplate , CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
  import _ from 'lodash'
 

 //import ValidateUserBody from "./middlewares/ValidateUserBody.js"
//api/addorupdate
//export default async function hanfler(request , response){
  const router = express.Router();

  //router.use(ValidateUserBody);
  // do not forget to use the endpoint in index.js
  //make sure post body in postman is set to JSON
   router.post("/GiveAwayLayers", async (request, response) => {

  
    try {
    
          const user_ID = request.body.ID
          const numLayers = request.body.numLayers

        const responseObj = await GiveAwayLayers(user_ID, numLayers)

           response.status(200).json( {reward: responseObj} ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})

export default router; 


// some give are given once, as part of a specific event, other are scheduled (every X time see StartGivenAwaySchedule)
export async function Push_giveaway_toList(user_ID, numLayers ) {
    // Ensure numLayers is within a valid range
    if (numLayers < 1 || numLayers > 10) {
      throw new Error("Invalid number of layers.");
    }
  

    const {mongoClient} = await connectToDataBase();
   
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");

    const availableCategories = ["he", "sh", "we","be","kn"];
    const referrerDoc = await collection.findOne({ ID: user_ID });
  
    if (!referrerDoc) {
      throw new Error("Referrer not found.");
    }
  
    const promises = [];
  
    const total_rewardGivenAway=[];
    for (let i = 0; i < numLayers; i++) {
      const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      const randomValue = Math.floor(Math.random() * 10) + 1;
  
      const give_away_content ={ 
        
          
          time: new Date(), 
          given : false,  // may be given only when user login on the app
          claimed: false, // it will first be a back card, and will need to be claime d by the user
          category:randomCategory,
          layer:randomValue    
      }
      
      


      total_rewardGivenAway.push(give_away_content);

      const filter = { ID: user_ID };
       
      const update = {
       
        $push: { "giveAwayTiming.giveAways": give_away_content }
      };
      
          console.log(" push give away");

      const promise = collection.updateOne(filter, update);
      promises.push(promise);



    }

  
     
    return total_rewardGivenAway;
  }


  export async function Push_giveaway_toListMANYUSERS(userIDs, numLayers ) {

 const { mongoClient } = await connectToDataBase();
  const db = mongoClient.db("wudb");
  const collection = db.collection("users");

 // const projection = {"_id": false,  "ID": true,  };
 const projection = {"_id": false,
 "ID": true, 
"discord": true, 
 "giveAwayTiming.NextGiveAway": true, 
 "giveAwayTiming.lastGiveAway": true,
 "giveAwayTiming.frequency": true,
  "giveAways":true// we do not really need this but this of for debugging,
 // to make sure it adds all the giveaway to all
};
 
  




  const currentTime = new Date();
// find all user how are ready to recieve their give away
const allUsers = await collection.find({}).project( projection ).toArray();

 

const user_how_are_ready_for_giveaway =[]; 
console.log( "server: SetRewardNextTime function is called at" , new Date() );
 
        allUsers.forEach(element => {

     //   if (element.ID == "423608837900206091"){

        console.log( element.ID ,   "    >>   currentTime",   currentTime  ,
        "  NextGiveAway = "   , element.giveAwayTiming.NextGiveAway,
        "time left before giveaway =",( element.giveAwayTiming.NextGiveAway - currentTime) 
        );
        // there is no more waiting time, so it is ready
        //alternative could be to send one a bit before timeleft == 0 (with tag, advanced)
        //client could pick the advanced give away without needing to wait for the derver
        if (  element.giveAwayTiming.NextGiveAway - currentTime <= 0 ){ //  currentTime <=  ((cron/server time)

          user_how_are_ready_for_giveaway.push( 
             { ID: element.ID ,  frequency: element.giveAwayTiming.frequency   }
             
             );

          console.log( element.ID ,   "  is ready for give away " ) ;
        }
      //  }

       });

       
       console.log(  "   user_how_are_ready_for_giveaway.length  ",     user_how_are_ready_for_giveaway.length     );
      
///=========================================================================
user_how_are_ready_for_giveaway.forEach(obj => {
  console.log(obj.ID  , obj.frequency  );
});
 

      // Ensure numLayers is within a valid range
  if (numLayers < 1 || numLayers > 10) {
    throw new Error("Invalid number of layers.");
  }
  
 
    



  const availableCategories = ["he", "sh", "we", "be", "kn"];

  const bulkUpdates = [];

  for (const obj of user_how_are_ready_for_giveaway) {
    const referrerDoc = await collection.findOne({ ID: obj.ID });   // obj.ID


    if (!referrerDoc) {

      console.log(  " >>>   userIDs   " , obj.ID );
      throw new Error("Referrer not found." , obj.ID);
    }

    const total_rewardGivenAway = [];

    for (let i = 0; i < numLayers; i++) {
      const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      const randomValue = Math.floor(Math.random() * 10) + 1;

      const give_away_content = {
        time: new Date(),
        given: false,
        claimed: false,
        category: randomCategory,
        layer: randomValue,
      };

      total_rewardGivenAway.push(give_away_content);
    }


    const nextGiveDatae = new Date();
    nextGiveDatae.setTime(nextGiveDatae.getTime() + obj.frequency  );
      
 // here we send the give away, and we reset the date
    const filter = { ID: obj.ID };
    const update = {
      $push: { "giveAwayTiming.giveAways": { $each: total_rewardGivenAway } },
      $set: {
         "giveAwayTiming.NextGiveAway": ( nextGiveDatae )  ,  
        "giveAwayTiming.lastGiveAway": new Date(), 
      }

    };
    // "giveAwayTiming.NextGiveAway": new Date(),  
    // "giveAwayTiming.lastGiveAway": new Date(), 
    // "giveAwayTiming.frequency": 30000,  



    bulkUpdates.push({ updateMany: { filter, update } });
  }

  // Execute bulk updates
  if (bulkUpdates.length > 0) {
    await collection.bulkWrite(bulkUpdates);
  }
  }