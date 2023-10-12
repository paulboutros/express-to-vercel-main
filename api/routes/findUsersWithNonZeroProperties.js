import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  
  router.get("/findUsersWithNonZeroProperties", async (req, response) => {

   //http://localhost:3000/api/findsss
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
   const layerPart = req.query.layerPart;
    // same code as in  api/wrong
   //const db = mongoClient.db("sample_restaurants");
   //const collection = db.collection("restaurants");
   const db = mongoClient.db("wudb");
   const collection = db.collection("users");
   const collection_result = await collection;
    const usersWithNonZeroProperties = await findUsersWithNonZeroProperties( collection_result , response , layerPart) ;

   //console.log("ccccccccccccccccccccccccccccccccccccccccccccc");
           //const jjjj ={cccc: layerPart };
           // response.status(200).json(  jjjj );
           response.status(200).json(  usersWithNonZeroProperties );
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})




function flattenTwoDimArray(twoDArray) {

 const flatArray=[];
  const flattenedArray = twoDArray.map(obj => {
      
   
       obj.map(bo => {
        const values = Object.values(bo);
        const layerCount =  values[2];  // how many of that layer the owner has
     for(let i =0; i< layerCount ;i++ ){
        const keys = Object.keys(bo);
         bo["layerName"] = keys[2].toString()
         const shortWallet = getShortAddress(bo["wallet"]);  
         bo["walletshort"] = shortWallet ;// getShortAddress("ssssssssssssssssssssss");
         flatArray.push(bo);
       }
    });
  });

   return flatArray;
}

  function getShortAddress(inputString){ 

   
  if (inputString.length <= 8) {
    // If the input string is 8 characters or less, return it as is
    return inputString;
  } else {
    // If the input string is longer than 8 characters, format it
    const firstFour = inputString.slice(0, 4); // Get the first 4 characters
    const lastFour = inputString.slice(-4); // Get the last 4 characters
    return  `${firstFour}...${lastFour}`;
  }
}


async function findUsersWithNonZeroProperties( collection  , response , layerPart ) {
  
    const usersWithNonZeroProperties = [];

   // layerPart ="he","we","bo","be",
const promises = [];
for (let i = 1; i < 10 ; i++) {

    const layerName = `${layerPart}${i.toString().padStart(2, '0')}`; 

    const filter = {[layerName]: { $ne: 0 }};
    const projection = {"_id": false, "wallet": true, "discord": true };
    
    projection[layerName] = true; // Add the dynamic key to projection

    const ppCursor = collection.find(filter).project(projection);
    
    const ppArray =   ppCursor.toArray();

    promises.push(ppArray);
}

const results = await Promise.all(promises);
  

 const flatten = flattenTwoDimArray ( results);
     
    // response.status(200).json(  flatten );
 
     

    return flatten ;// usersWithNonZeroProperties;
   
}
export default router;