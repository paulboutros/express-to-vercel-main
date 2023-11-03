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
 
 



router.post('/update_real_discord_userXXX', async (request, response) => {
    
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
             
             
            
            
             
             
              let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
               
                newUserDocument =  CreateNewUserDocument(
                newUserDocument,
                  minimalData.ID,
                  minimalData.discord ,
                  minimalData.wallet, 
               );
 
               const discordUserData =  request.body.user;
               console.log("discordUserData" ,   discordUserData );
               newUserDocument.discordUserData = discordUserData;
               
              
            
            
              // const uploadUser = await collection.updateOne(newUserDocument);
               const uploadUser = await collection.updateOne(
                 {ID: discordUserData.id } ,
                 { discordUserData
                 } ,
                 { upsert: true }
               );
          
      
             //  collection.insertMany(documentsToInsert);
  
 
              response.status(200).json( uploadUser  ); // result
 
           // response.status(200).json( documentsToInsert ); // result
     }catch(e){
            console.error(e);
            response.status(500).json(e);
 
 
     }
 })
 
router.post('/update_real_discord_user', async (request, response) => {
    


  const discordUserData = request.body.userlist;
 
  console.log("userList" ,   discordUserData );
     //   return;
     const documentsToInsert = [];
       try {
         
        const {mongoClient} = await connectToDataBase();
       
        const db = mongoClient.db("wudb");
       const collection = db.collection("users");
         
                
                  for (let i = 0; i < discordUserData.length ; i++) {
            
                    let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
                     
                      newUserDocument =  CreateNewUserDocument(
                       
                      newUserDocument,
                      discordUserData[i].id,    
                      discordUserData[i].username ,
                      "wallet_not_provided", //  ,  // discordUserData[i].wallet
                  
                      discordUserData[i]
       
       
                    );
                     
                    // Add more properties or modify values as needed for each instance
        
                    //newUserDocument.bo = [0, 1, 2, 3, 4, 5];
                    documentsToInsert.push(newUserDocument);
                    
                  }
                   
                 
                
                
               
               /*
                 // const uploadUser = await collection.updateOne(newUserDocument);
                  const uploadUser = await collection.updateOne(
                    {ID: discordUserData.id } ,
                    { discordUserData
                    } ,
                    { upsert: true }
                  );
             */
         console.log( "ready to >>>  collection.insertMany(documentsToInsert); ");
                 collection.insertMany(documentsToInsert);
     
    
                 response.status(200).json(    { firstEleemt:  documentsToInsert[0] }   ); // result
    
              // response.status(200).json( documentsToInsert ); // result
        }catch(e){
               console.error(e);
               response.status(500).json(e);
    
    
        }
    })
 export default router;
 

 