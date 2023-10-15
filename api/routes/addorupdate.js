import { connectToDataBase } from "../../lib/connectToDataBase.js";
import { newUserDocumentTemplate , globalTemplate , CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
import _ from 'lodash'
 
//api/addorupdate
//export default async function hanfler(request , response){
  const router = express.Router();
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
            const id = request.body.id;
            const wallet = request.body.wallet;
           const discord = request.body.discord;

           let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
         // to do : load from template
             newUserDocument = // {
            CreateNewUserDocument( newUserDocument, request.body.ID, request.body.discord, request.body.wallet );
  
 
        const userExist  = await
        collection.updateOne(
          { "ID":  ID   },
           {   $set: { "ID":  ID }  } ,
          { upsert: false } // if it does not exist DO NOT create one at this stage
        )
        console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  } `); 
     
      if (     userExist.matchedCount === 0  ){
          
        //  newUserDocument.ID =    ID;
       //   newUserDocument.wallet =    wallet;
        //  newUserDocument.discord =   discord;
          result =  " >> >> user does not exist insert one "
          user =  newUserDocument;
          collection.insertOne( newUserDocument );
      }else{
        result = " >> >> user DOES exist  UPDATE one ";
         // 423608837900206091
        user = await collection.findOne({ "ID": ID });
            collection.updateOne( { "ID": ID },   
            {   $set: { "wallet": wallet,  "discord": discord } } );
            
        
      }
      result  += " userExist.matchedCount " +  userExist.matchedCount;
      console.log(  result   ); 



       result  += " ID  " +  ID;
        result  += " wallet  " +  wallet;
        
       const responseObj={
             user:user,
             message: result,
             userExist : userExist.matchedCount === 1  //userExist.matchedCount
       }
       console.log(  "responseObj   user  "   + responseObj.user   );

       console.log(  "responseObj   user  "   + responseObj.user.ID   );
       console.log(  "responseObj   wallet  "   + responseObj.user.wallet   );
       console.log(  "responseObj   discord  "   + responseObj.user.discord   );

           response.status(200).json( responseObj ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})

export default router;