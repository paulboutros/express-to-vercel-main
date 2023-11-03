import  { connectToDataBase } from "../../lib/connectToDataBase.js";

   import { newUserDocumentTemplate,
     globalTemplate,
      CreateNewUserDocument,
      calculateEarning
    } from 
      "../../lib/documentTemplate.js"// "../lib/documentTemplate.js";
 
 

      import _ from 'lodash'

import express from 'express';


 


const reward_pool = 500;
let maxSupply = 20;
//http://localhost:3000/api/dev/uploading_fake_participant
 /* 
    USE POSTMAN TO TEST
 */
//export default async function hanfler(request , response){
// Define your endpoints

 
const router = express.Router();
 
 
router.post('/update_real_discord_user', async (request, response) => {
    
 //   return;
 const documentsToInsert = [];
   try {
     
    const {mongoClient} = await connectToDataBase();
   
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");
    
  
   
        
        await connectToDataBase(); // this was recently added  to make sure we wait for the database to update after deletion
      
        // then we can add some data...  otherwise.. the data adds up

           const minimalData =  
              {  ID : "account_1", discord : "joeCrazy#4500",  wallet :  "0x4eba90B4124DA2240C7Cd36A9EEE7Ff9F81Cf601" , id  : "account_1"  };
            
            
           const discordUserData = null; // we do create mock discord user at this point
            
            
             let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
              
               newUserDocument =  CreateNewUserDocument(
                
              newUserDocument,
                 minimalData.ID,
                 minimalData.discord ,
                 minimalData.wallet, 
              );
              
           /*
             documentsToInsert.push(newUserDocument);
           
  
              collection_global.insertOne( globalTemplate)
         
     
              collection.insertMany(documentsToInsert);

              const finalDoc={
                 globalTemplate,
                 documentsToInsert

              };*/

             response.status(200).json( { message:"Discord Mongo"}  ); // result

          // response.status(200).json( documentsToInsert ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
 
export default router;
 