import { connectToDataBase } from "../../lib/connectToDataBase.js";
import { newUserDocumentTemplate , globalTemplate , CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
import _ from 'lodash'
 

 //import ValidateUserBody from "./middlewares/ValidateUserBody.js"
//api/addorupdate
//export default async function hanfler(request , response){
  const router = express.Router();



/*
const db = db.getSiblingDB('your_database'); // Replace 'your_database' with your actual database name
const collection = db.your_collection; // Replace 'your_collection' with your actual collection name

const query = { _id: yourDocumentId }; // Specify the document you want to update
const update = {
  $set: { redirectUrl: 'your_new_redirect_url' }, // Set the new value for the redirectUrl property
};
const options = { upsert: true }; // Set the upsert option to true

// Perform the update operation
collection.updateOne(query, update, options);


*/
router.post("/setRedirectURL", async (request, response) => {


  try {

       const {mongoClient} = await connectToDataBase();
       const db = mongoClient.db("wudb");
       const collection = db.collection("users");
 
       const ID = request.body.ID;
       const redirectUrl = request.body.redirectUrl;
     
       const query = { "ID":  ID }; // Specify the document you want to update
       const update = {
         $set: { "redirectUrl":  redirectUrl }, // Set the new value for the redirectUrl property
       };
       const options = { upsert: true }; // Set the upsert option to true
       
       // Perform the update operation
       const mongoResponse = collection.updateOne(query, update, options);
  
       response.status(200).json( mongoResponse ); // result


  }catch(e){


       console.error(e);
       response.status(500).json(e);


  }
})




router.post("/setWallet", async (request, response) => {


  try {
 
 const {mongoClient} = await connectToDataBase();
 
 const db = mongoClient.db("wudb");
 const collection = db.collection("users");
  
        
          const ID = request.body.ID;
           let wallet =request.body.wallet ; 
 
         const setData = { "wallet": wallet  } 
           
         await collection.updateOne( { "ID": ID },   {   $set:  setData  } );
         
       
    
         response.status(200).json( { message:(wallet + " added successfully") }  ); // result
  }catch(e){
         console.error(e);
         response.status(500).json(e);


  }
})
  //router.use(ValidateUserBody);
  // do not forget to use the endpoint in index.js
  //make sure post body in postman is set to JSON
  router.post("/addorupdate", async (request, response) => {


    try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
   
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");


   let result = "";  

 

           let user;

          
            const ID = request.body.ID;
             let wallet =request.body.wallet ;//"000000000000"; request.body.wallet;
             if (!wallet ) {
            //  wallet  ="000000000000"

            }


    console.log(`  >> >> wallet  from body =${    wallet  } `); 

           const discord         = request.body.discord;
           const discordUserData =  request.body.discordUserData;
 
           
           console.log(` >>>  discordUserData =${    discordUserData } `); 

        const userExist  = await collection.updateOne(
           { "ID":  ID   },
           {   $set: { "ID":  ID }  } ,
          { upsert: false } // if it does not exist DO NOT create one at this stage
        )
        console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  } `); 
     
      if (     userExist.matchedCount === 0  ){
        let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
        // to do : load from template
            newUserDocument =  
               CreateNewUserDocument(
                  newUserDocument, 
                  request.body.ID, 
                  request.body.discord,
                  wallet,//  request.body.wallet,
                  discordUserData
                );
       

          result =  " >> >> user does not exist insert one "
          user =  newUserDocument;
          collection.insertOne( newUserDocument );
      }else{
        result = " >> >> user DOES exist  UPDATE one ";
         // 423608837900206091
       // user = await collection.findOne({ "ID": ID });

        // discordUserData is set again at each discord login, see oauth call functions;
        // however we should not redefined if the update is coming from the app
        // because the app should not write something on this object only dicord server

           const setData = discordUserData ?  
             {  /*"wallet": wallet,*/ "discord": discord,"discordUserData": discordUserData  } :
             {  /*"wallet": wallet,*/ "discord": discord  } 
           await collection.updateOne( { "ID": ID },   {   $set:  setData  } );
            
           // we now get the updated version of the user
           user = await collection.findOne({ "ID": ID });
              
            
        
      }
      result  += " userExist.matchedCount " +  userExist.matchedCount;
      



       result  += " ID  " +  ID;
        result  += " wallet  " +  wallet;
        
       const responseObj={
             user:user,
             message: result,
             userExist : userExist.matchedCount === 1  //userExist.matchedCount
       }

       /*
       console.log(  "================================================================================="  );
       console.log(  "responseObj.user  "   , responseObj.user   );

       console.log(  "responseObj.user.ID  "   , responseObj.user.ID   );
       console.log(  "responseObj.user.wallet  "   ,responseObj.user.wallet   );
       console.log(  "responseObj.user.discord  "   , responseObj.user.discord   );
       console.log(  "================================================================================="  );
*/
           response.status(200).json( responseObj ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})

export default router;