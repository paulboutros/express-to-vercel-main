import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();
  
  router.get("/findUsersWithNonZeroProperties", async (req, response) => {

    
  
     try {
   //const mongoClient = await ( new MongoClient(uri, options)).connect();
   const {mongoClient} = await connectToDataBase();
     
   const layerPart = req.query.layerPart;
    const use_id =    req.query.ID;;



   const db = mongoClient.db("wudb");
   const collection = db.collection("users");
   const collection_result = await collection;
    
   const baseFilter = {
    $or: [
      { 'layers.he.0': { $exists: true, $ne: null } },
      { 'layers.sh.0': { $exists: true, $ne: null } },
      { 'layers.we.0': { $exists: true, $ne: null } }
    ]
  };
  const projection = {
    _id: false,
    wallet: true,
    discord: true,
    layers: true,
    walletshort: true
  }

    
   let usersWithNonZeroPropertiesX;


   if (use_id) {
  // Add specific user filter
  usersWithNonZeroPropertiesX = await collection.find({
    $and: [baseFilter, { ID: use_id }]
  }).project( projection   ).toArray();
} else {
  // Retrieve all users based on the base filter
  usersWithNonZeroPropertiesX = await collection.find(baseFilter).project( projection ).toArray();
}
    

  //  console.log(JSON.stringify(usersWithNonZeroPropertiesX, null, 2));

          response.status(200).json(  usersWithNonZeroPropertiesX );
          // response.status(200).json(  usersWithNonZeroProperties );
        }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;
 

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
    return  `${firstFour}..${lastFour}`;
  }
}


async function findUsersWithNonZeroProperties( collection  ,req, response , layerPart ) {
  
    const usersWithNonZeroProperties = [];

    let filter;
  
   // layerPart ="he","we","bo","be",
const promises = [];
const maxLayer = 10;// 10;
for (let i = 1; i < maxLayer ; i++) {

    const layerName = `${layerPart}${i.toString().padStart(2, '0')}`; 
     
   if ( !req.query.userId){
    filter = {
      
      [layerName]: { $ne: 0 }
    };
   }else{
    filter = {
      "ID": req.query.userId ,//"423608837900206091",//user_id,
      [layerName]: { $ne: 0 }
    };
   }
     
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
