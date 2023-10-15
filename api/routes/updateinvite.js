import { connectToDataBase } from "../../lib/connectToDataBase";

 
//api/addorupdate
export default async function hanfler(request , response){

    try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
   
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");


   let result = "";  


 
 
          

                const ID = request.body.ID;
           //    const wallet = request.body.wallet;
          //     const discord = request.body.discord;

     //  code specifi to invites
//================================================================================
           const invite_code = request.body.invite_code;
           const invite_use = request.body.invite_use;
   //================================================================================      
 
 
        const userExist  = await
        collection.updateOne(
          { "ID":  ID   },
           {   $set: { "ID":  ID }  } ,
          { upsert: false } // if it does not exist DO NOT create one at this stage
        )
     //   console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  } `); 
     
      
         
//  code specifi to invites
//================================================================================
              collection.updateOne( { "ID": ID },   
          {   $set: { "invite_code": invite_code,  "invite_use": invite_use } } );
            //================================================================================
        
     
      result  += " userExist.matchedCount " +  userExist.matchedCount;
      console.log(  result   ); 



       result  += " ID  " +  ID;
        result  += " wallet  " +  wallet;
        
       const responseObj={
             message: result,
             userExist : userExist.matchedCount === 1  //userExist.matchedCount
       }


           response.status(200).json( responseObj ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
}