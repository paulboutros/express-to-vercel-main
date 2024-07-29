import { connectToDataBase } from "../../lib/connectToDataBase.js";
import { newUserDocumentTemplate ,   CreateNewUserDocument} from "../../lib/documentTemplate.js";
import express from "express";
import _ from 'lodash'
import { GetThirdWebSDK_fromSigner } from "../../utils/thirdwebSdk.js";
import { Discord_tokenLess_stakinContract } from "../../const/addresses.js";
import { ethers } from "ethers";
 

 
//export default async function hanfler(request , response){
  const router = express.Router();


 
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



// I suppose any request with ID should send the token within header
router.post("/setWallet", async (request, response) => {


  try {
 
 const {mongoClient} = await connectToDataBase();
 
 const db = mongoClient.db("wudb");
 const collection = db.collection("users");
  
        
          const ID = request.body.ID;
           let wallet =request.body.wallet ; 
 


    /*
         // let's FIRST get the wallet  currently used/saved on server
          
         */
       const userCurrentInfo = 
       await collection      
      .findOne(  {"ID": ID },   { projection: { wallet: 1, _id: 0 } });




        if ( userCurrentInfo  ){ 
    
          const walletOnServer = userCurrentInfo.wallet;

        /* this scenario is:
        if Wallet submitted and wallet on server exist already
        but they are different.
        meaning, the user it switching and saving an other wallet, so we are transferring the rewards
        */
        if (( wallet  &&  walletOnServer) &&  ( wallet  !==  walletOnServer) ){

          const sdk = GetThirdWebSDK_fromSigner()   // GetThirdWebSDK_fromSigner
          const dist_tokenLessContract = await sdk.getContract(   Discord_tokenLess_stakinContract  );
          const getStakeInfo = await dist_tokenLessContract.call("getStakeInfo",[ walletOnServer ]);
 
          const _tokensStaked =   parseInt(getStakeInfo._tokensStaked._hex,16);
          const _rewards =   parseInt(getStakeInfo._rewards._hex,16)

            

       const deleteStakeInfo = await dist_tokenLessContract.call("deleteStakeInfo", [ walletOnServer]);
        

       const tokensStakedBigN =  ethers.BigNumber.from( _tokensStaked.toString() );
       const rewardsBigN = ethers.BigNumber.from(_rewards.toString());

        const reassignStakeInfo =
         await dist_tokenLessContract.call("reassignStakeInfo", [ wallet, tokensStakedBigN, rewardsBigN  ]);
        
        }      
       }
      


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
 
           const discord         = request.body.discord;
           const discordUserData =  request.body.discordUserData;
 
           
           console.log(` >>>  discordUserData =${    discordUserData } `); 

        const userExist  = await collection.updateOne(
           { "ID":  ID   },
           {   $set: { "ID":  ID }  } ,
          { upsert: false } // if it does not exist DO NOT create one at this stage
        )
        console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  } `); 
     
      if ( userExist.matchedCount === 0 ){
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

       
           response.status(200).json( responseObj ); // result
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})


//=====================================================================================

 router.post("/updateChain", async (request, response) => {
 
  try {
  
 const {mongoClient} = await connectToDataBase();
 
 const db = mongoClient.db("wudb");
 const collection = db.collection("walletUsers");
           
           let walletUsers = request.body.wallet; 
           let chain       = request.body.chain;

           const currentTimestamp = new Date().toISOString();  // Example of ISO string format

      const userExist  = await collection.updateOne(
         { "walletUsers":  walletUsers },
         {  
               $set: { 
                   "walletUsers": walletUsers,
                    "chain": chain // Set the chain property
                  }   
          
          } ,
      

        { upsert: true } // if it does not exist DO NOT create one at this stage
      )
      console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  }   ${chain}`); 
       
     const responseObj={
           user: userExist,
           wallet : walletUsers,
           userExist : userExist.matchedCount === 1  //userExist.matchedCount
     }

     
         response.status(200).json( responseObj ); // result
  }catch(e){
         console.error(e);
         response.status(500).json(e);


  }
})

//========================================================


  router.get("/GetChain", async (req, response) => {
 
 
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("walletUsers");
  
       const wallet = req.query.wallet;
   
       const userData = await collection.findOne( { walletUsers: wallet }  );
 
       if (!userData) {
         // No user found with the specified wallet
          return response.status(404).json({ error: "User not found" });
       }
   
       // Extract the chain value from the retrieved document
       const chain = userData.chain;
   
       // Include chain value in the response
       const responseObj = {
         wallet: wallet,
         chain: chain 
        };




         // No referrer_user with the referral code was found
         response.status(200).json(  responseObj   );
     
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 

  });






router.post("/addorupdateWalletuser", async (request, response) => {


  try {
  
 const {mongoClient} = await connectToDataBase();
 
 const db = mongoClient.db("wudb");
 const collection = db.collection("walletUsers");
           
           let walletUsers =request.body.wallet ; 
           const currentTimestamp = new Date().toISOString();  // Example of ISO string format

      const userExist  = await collection.updateOne(
         { "walletUsers":  walletUsers   },
         {  
          
          $set: { 
            "walletUsers": walletUsers
          },
          $push: {
            "timestamps": currentTimestamp  // Push the formatted timestamp to the timestamps array
          }
       
          
          } ,
      

        { upsert: true } // if it does not exist DO NOT create one at this stage
      )
      console.log(`  >> >> userExist.matchedCount=${     userExist.matchedCount  } `); 
   
    
      
     const responseObj={
           user: userExist,
           wallet : walletUsers,
           userExist : userExist.matchedCount === 1  //userExist.matchedCount
     }

     
         response.status(200).json( responseObj ); // result
  }catch(e){
         console.error(e);
         response.status(500).json(e);


  }
})






 

export default router;