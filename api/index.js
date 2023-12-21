//discord + saving and accessing token
//https://www.youtube.com/watch?v=hnk2-Fs8JVI&t=9s
//mern full stack:
/*
https://www.youtube.com/watch?v=K8YELRmUb5o&list=PL08VAKnhpM86qszK0uKZ-FXQpVy3fv_dg&index=7
*/


 import express from 'express';
 import cors from 'cors';
import dotenv from 'dotenv';
import {connectToDataBase} from '../lib/connectToDataBase.js';
import { connectToDiscord } from '../lib/connectToBotClient.js';
 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import globalData from './routes/globalData.js';
import findUsersWithNonZeroProperties from './routes/findUsersWithNonZeroProperties.js';

import updateinvite from './routes/updateinvite.js';
import updateAllInvite from './routes/updateAllInvite.js';
 

//import botTest from './routes/Discord/botTest.js';
import getDiscordScore from './routes/Discord/getDiscordScore.js';
import myDiscordInfo from './routes/Discord/myDiscordInfo.js';


import bestInviteScore from './routes/bestInviteScore.js';
import earnings from './routes/earnings.js';


import getLayers from './routes/getLayers.js';
import getData from './routes/getData.js';
import testToken from './routes/testToken.js';
import userMe from './routes/userMe.js';
 
import {spawn} from "child_process"
 
 import getSocialData from './routes/getSocialData.js';

 
//registration
import addorupdate from './routes/addorupdate.js';

 //discord oauth endpoint
import authorize from './routes/discordOauth/authorize.js';
import callback from './routes/discordOauth/callback.js';


import cookieParser from 'cookie-parser' ;

import corsMiddleware from "./routes/middlewares/corsMiddleware.js";
import authenticate from "./routes/middlewares/authenticate.js";
import processClientReferralToken from "./routes/middlewares/processClientReferralToken.js";
 

import sendTracking from "./routes/Tracking/sendTracking.js";
import generateReferralCode from "./routes/Tracking/generateReferralCode.js";
import processReferral from "./routes/Tracking/processReferral.js";
import GetReferralCode from "./routes/Tracking/GetReferralCode.js";

 
import setClaimConditions from       "./routes/Reward/setClaimConditions.js"
import ERC20claim from       "./routes/Reward/ERC20claim.js"
import GetReward from       "./routes/Reward/GetReward.js"
import GetLayerSupply from  "./routes/Reward/GetLayerSupply.js"
import SetLayerSupply from  "./routes/Reward/SetLayerSupply.js"



import GetRewardNextTime from  "./routes/Reward/GetRewardNextTime.js"
import SetRewardLastTiming from  "./routes/Reward/SetRewardLastTiming.js"
import RevealAndAdd from  "./routes/Reward/RevealAndAdd.js"
 
 import SetRewardNextTime from  "./routes/Reward/SetRewardNextTime.js"


//give away api:
 import GiveAwayLayers from  "./routes/GiveAway/GiveAwayLayers.js"
 import GetTempGiveAway from  "./routes/GiveAway/GetTempGiveAway.js"

 import StartGiveAwayShedule from  "./routes/GiveAway/StartGiveAwayShedule.js"
 import {functionStartGiveAwayShedule } from  "./routes/GiveAway/StartGiveAwayShedule.js"

 import update_real_discord_user from  "./routes/update_real_discord_user.js"

 import getTokenDetails from  "./routes/getTokenDetails.js"
  

 import GetEthToUsdRate from "./routes/CryptoUtil/GetEthToUsdRate.js"  

import allowCors from "./routes/middlewares/allowOrigins.js";
import { ChildProcess } from 'child_process';


import GetAllNFTs from "./routes/WEB3/GetAllNFTs.js";
import GetContractThirdweb from "./routes/WEB3/GetContractThirdweb.js";
//==============================================

//import Discord from "discord.js";
import { Client, Events, GatewayIntentBits } from 'discord.js' ;
const targetChannelID = '947487867658199071';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now you can use __dirname as you would in CommonJS modules



dotenv.config();

const app = express();
const router = express.Router();
  
app.use(express.json());
// Use the cookie-parser middleware
app.use(cookieParser());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
// Enable CORS for all routes
const baseurl =   process.env.REACT_APP_URL;// "http://localhost:3000" ;// process.env.REACT_APP_URL;// 'http://localhost:3000';
console.log('REACT_APP_URL:', process.env.REACT_APP_URL);
app.use( // cors(  {credentials: true }  )
   
  cors({
    credentials: true,
    origin: baseurl, 
  })
   
);
 

 
/*
this is just for test. remove it later when connectToDiscord is used by other part of server.
Next:
create an end point, so app client,  call and ask if user is part of server
 */



async function someFunction() {
  try {
    const { discordClient } = await connectToDiscord();
  
    discordClient.on("ready", async () => {
    //discordClient.once( Events.ClientReady, () => {
      
         const channel = discordClient.channels.cache.get(targetChannelID);  
         channel.send('>>>>>>>>>  Hello, this is a message from the bot!');
         const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );

         const ServerMembers = await guild.members.fetch();

      //    console.log( " >>>>>   channel   =" ,  channel  );

          const member =   guild.members.cache.get("928290103367958528") ;
       if ( member       )  {  
      console.log(` members found  uer=  : ${  member   }` );

        }else{

          console.log(`NOT   members   ` );
        }
       
            //========================================================================
          //  const allMembers=[];
        
         const members = ServerMembers.filter(member => !member.user.bot);
   
    //     console.log(` members  : ${members  }`);     
                  for (const member of members.values()) {
                    const user = member.user;
                    // Now you can access properties of the 'user' object
                    const username = user.username;
                    const userID = user.id;
                    // const avatarURL = user.avatarURL();

                    // Use the 'user' properties as needed
                    // console.log(`Username: ${username}, UserID: ${userID}, Avatar URL: ${avatarURL}`);
                    // console.log(`>>  member: ${member}`);

                     if (   userID === "535766913834418179" ){
                      console.log(`>>  FOUND :` );
                      console.log(`>>  user:`, user);
                     }
                       

                  
                  }
    




          if (guild) {
               console.log(`Bot is a member of the guild: ${guild  }`);
          } else {
              console.log(`Bot is not a member of the specified guild.`);
          }
   
  
        });
    
 
        console.log(' >> Ready!');


  } catch (error) {
    console.error(error);
  }
}

 someFunction();



/*
app.get('/token/:contractAddress/:tokenId', (req, res) => {
  const { contractAddress, tokenId } = req.params;

  // Now you can use contractAddress and tokenId to fetch data or render the page
  // For example, you might render a template or send JSON data based on these parameters

  res.send(`Contract Address: ${contractAddress}, Token ID: ${tokenId}`);
});
*/

// Serve static files (React app)
//app.use(express.static(path.join(__dirname, '..', 'public')));
app.get("/", (request, response) => {
  
  app.use(allowCors);
 
   
    response.send(
        "  login with discord:"+ "<a href="+process.env.YOUROAUTH2URL+">login</a>" )
    
   
})


//WEB 3 test

app.use("/",GetAllNFTs);
app.use("/",GetContractThirdweb);


app.get("/pythonTest", (request, res) => {
   // Get the integers from the request body
  // const { num1, num2 } = req.body;
   const   num1 = 4;
   const   num2 = 5;


  // Spawn a Python process and pass the integers as arguments
  const pythonProcess = spawn('python', ['test.py', num1.toString(), num2.toString()]);
  console.log('Python script path:', pythonProcess.spawnargs[1]);
  let result = '';

  // Capture the standard output of the Python script
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  // Handle Python script exit
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      // Successfully executed
      res.json({ result: parseFloat(result) }); // Parse the result to a float and send it in the response
    } else {
      res.status(500).json({ error: 'Python script execution failed', code });
    }
  });

})



app.use("/", setClaimConditions);

app.use("/", ERC20claim);
app.use("/", GetReward);
app.use("/", GetLayerSupply);
app.use("/", SetLayerSupply);
app.use("/", getTokenDetails);

app.use("/", GetEthToUsdRate);



//GiveAway
app.use("/",GiveAwayLayers);
app.use("/",GetTempGiveAway);
app.use("/",StartGiveAwayShedule);
app.use("/",update_real_discord_user);



app.use("/",SetRewardLastTiming);
app.use("/",SetRewardNextTime);



  app.use("/",GetRewardNextTime);
  app.use("/",RevealAndAdd);






// discord Oauth
app.use('/', authorize);  
app.use('/', callback);  
app.use('/', processReferral);  
app.use('/', GetReferralCode);     

app.use('/', globalData);    
app.use('/', findUsersWithNonZeroProperties); // Mount the exampleRouter at /api


// Middleware to extract IP address
app.use((req, res, next) => {
  req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});
//Tracking

//app.use('/',botTest);

app.use('/', generateReferralCode);  
app.use('/', sendTracking);   


 app.use('/', myDiscordInfo);
 app.use('/', getDiscordScore);
app.use('/', updateAllInvite);
app.use('/', updateinvite);
app.use('/', bestInviteScore);
app.use('/', earnings); // Mount the exampleRouter at /api
app.use('/', getData); // Mount the exampleRouter at /api
app.use('/', getLayers); // Mount the exampleRouter at /api

 //app.use('/', getDiscordData); // Mount the exampleRouter at /api
 //app.use('/', getTwitterData); // Mount the exampleRouter at /api
 app.use('/', getSocialData); // Mount the exampleRouter at /api

 app.use('/', addorupdate); // Mount the exampleRouter at /api

 //test
////app.use(allowOrigins);
//apply middlewares
 
 app.use(authenticate);
 
 app.use('/', testToken); // Mount the exampleRouter at /api
 app.use(processClientReferralToken);
 
 app.use('/', userMe); // Mount the exampleRouter at /api
  

 
 
//router.use(authenticate);
  // do not forget to use the endpoint in index.js
 

 
 // keep these as they show the direfferents ways of settting up route and enddpoint
app.get('/', (req, res) => res.send('Home Page Route'));

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', async (req, response) =>{  

    try {
       
         const {mongoClient} = await connectToDataBase();
      
        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        const result = await collection
             .find({})
           
                .toArray();
     
               response.status(200).json(result);
      }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
    }

});
// end of adding
 
 

 console.log(`Server is running on port: ${process.env.PORT}`);

 app.listen(process.env.PORT || 1999 );


  


const data = { 
   ID : "423608837900206091",
   duration : 
    {
       days :  0 ,
       hours :  1 ,
       minutes :  1 ,
       seconds :  1 
    }
  
}
let request={
  body:""
}
let response;


request.body= { 
  ID : "423608837900206091",
  duration : 
   {
      days :  0 ,
      hours :  1 ,
      minutes :  1 ,
      seconds :  1 
   }
 
}

// we handle these things usign the smart contract.. see stacking contract
 //functionStartGiveAwayShedule( request , response );






 