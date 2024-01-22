

 
 import { connectToDataBase } from "../../../lib/connectToDataBase.js";
//import { newUserDocumentTemplate , globalTemplate , CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
  import _ from 'lodash'
 

 
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
   
     
    
  }


 export async function Push_giveaway_toListMANYUSERS(userIDs, numLayers ) {
 
  }