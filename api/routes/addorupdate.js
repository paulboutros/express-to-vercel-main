import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";

//http://localhost:3000/api/addorupdate
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
 // to do : load from template
           const newUserDocument = {

            ID:request.body.ID, 
            discord: request.body.discord,  
            wallet: request.body.wallet,

            shScore:0,
            sh01:0, sh02:0,sh03:0,sh04:0,sh05:0,sh06:0,sh07:0,sh08:0,sh09:0,sh10:0,
            boScore:0,
            bo01:0, bo02:0,bo03:0,bo04:0,bo05:0,bo06:0,bo07:0,bo08:0,bo09:0,bo10:0,
            heScore:0,
            he01:0, he02:0,he03:0,he04:0,he05:0,he06:0,he07:0,he08:0,he09:0,he10:0,
            weScore:0,
            we01:0, we02:0,we03:0,we04:0,we05:0,we06:0,we07:0,we08:0,we09:0,we10:0,
        
            totalPoints :0, scoreShare:0 , 
        
            airDopAmount :0,

            invite_code :"" , invite_use :0,
              
            date: new Date()
            // Other properties...
          };
         
 
 
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