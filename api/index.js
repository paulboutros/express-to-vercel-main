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
import ERC20claim, { addto_inviteStaking, transfertDIST } from       "./routes/Reward/ERC20claim.js"
import GetReward from       "./routes/Reward/GetReward.js"
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
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js' ;
import { Discord_invite_stake_token, Discord_stake_contract, OWNER, STAKING_ADDRESS, botChannel } from '../const/addresses.js';
import { GetThirdWebSDK_fromSigner } from '../utils/thirdwebSdk.js';
import { debug } from 'console';


 export const customEvent1="test";
const targetChannelID = botChannel;
let invitesBeforeJoin = new Collection();

 let newInvites = new Collection();
  // will be set to true, when we trigger event, so we can modify newInvites 
  // when off, it will get newInvites from the Discord server to check for real changes in invite
 let isSetBefore_due_to_debugMode = false;

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


export const { discordClient } = await connectToDiscord();
async function someFunction() {
  try {
    
  
    discordClient.on("ready", async () => {
     
      
         const channel = discordClient.channels.cache.get(targetChannelID);  
         channel.send('>>>>>>>>>  Hello, this is a message from the bot!');
         const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );


//=======================================================================
  
    
        // Fetch all Guild Invites
          //const firstInvites = await guild.invites.fetch();
      
         // invitesBeforeJoin = new Collection(firstInvites.map((invite) => [invite.code, invite.uses]));
              
            reset_invites_beforeJoin( guild );


               console.log( `invitesBeforeJoin.size   >> ${invitesBeforeJoin.size}  invitesBeforeJoin: ${ invitesBeforeJoin }`);
       
  
   
//===========================================================


         const ServerMembers = await guild.members.fetch();
 
        //  const member =   guild.members.cache.get("928290103367958528") ;
        
         
         const members = ServerMembers.filter(member => !member.user.bot);
   
       
                  for (const member of members.values()) {
                    const user = member.user;
                    // Now you can access properties of the 'user' object
                    const username = user.username;
                    const userID = user.id;

                     console.log( userID );



//1007274102727385088', '535766913834418179


                    // const avatarURL = user.avatarURL();

                    // Use the 'user' properties as needed
                     // console.log(`Username: ${username}, UserID: ${userID}, Avatar URL: ${avatarURL}`);
                     //  console.log(`>>  member: ${member}`);

                      
                       

                  
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


// modif can be positif or negatif depending on Add or remove member
export  async function modify_newInvites( guild,  inviteCodeToUpdate  , modif ){

  isSetBefore_due_to_debugMode = true;
  // const  newInvites = invitesBeforeJoin;
  const newInvReal  = await guild.invites.fetch()
    newInvites = new Collection(newInvReal.map((invite) => [invite.code, invite.uses]));
   
 // const firstElementCode = invitesBeforeJoin[inviteCodeToUpdate] ;//   .firstKey(); // Get the key (invite code) of the first element
  const currentValue = newInvites.get(inviteCodeToUpdate);
  newInvites.set(inviteCodeToUpdate, currentValue + modif);
 
    


}


export async  function reset_invites_beforeJoin( guild  ){

  const firstInvites = await guild.invites.fetch();
      
  invitesBeforeJoin = new Collection(firstInvites.map((invite) => [invite.code, invite.uses]));
              

}
// custom event
// attach a listener function
discordClient.on(customEvent1,  async ( guild ) => {   
  
    console.log("  custom emitter  arg:guild "  , guild)  
  
    reset_invites_beforeJoin(guild);

});
 //=======================================================================================================
 

 async function stepOne(guild ){

  
  //===============================================================================

  // To compare, we need to load the current invite list.
     const newInvReal  = await guild.invites.fetch()
    
    if (!isSetBefore_due_to_debugMode){ 
      newInvites = new Collection(newInvReal.map((invite) => [invite.code, invite.uses]));
      isSetBefore_due_to_debugMode = false;// turn it back to a state so it can register 
      //new invilsit // if we test with actual user
      // it will be set to true everytime we simulate an emit memberAdd/remove event
   }

    // This is the *existing* invitesBeforeJoin for the guild.
  const oldInvites = invitesBeforeJoin ;
 

 let modifiedInviteCode;
 newInvites.forEach((newUses, code) => {
  const oldUses = oldInvites.get(code);
   //console.log(  ">>> newUses  = "  , newUses  , "code  " , code );

 const inviteDifference = newUses - oldUses;
  if (oldUses !== undefined && ( inviteDifference !== 0 ) ) {
    if (inviteDifference < 0 ){
      console.log(`Invite ${code} has DECREASED uses from ${oldUses} to ${newUses}`);
    }else{
      console.log(`Invite ${code} has INCREASED uses from ${oldUses} to ${newUses}`);

    }
   
    modifiedInviteCode =  code;
  }
});


   return modifiedInviteCode;
}

 discordClient.on(Events.GuildMemberRemove, async member  => {  

  const {mongoClient} = await connectToDataBase();
  const db = mongoClient.db("wudb");
  const collection = db.collection("discord_invites");
  
  const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );
  let modifiedInviteCode = await stepOne(guild);
   
/*====================================================================================
   Time to uplaod to mongo DB invite object
==================================================================================== */
     

      const result = await collection.updateOne(
            { invite: modifiedInviteCode },
          {
            $pull: {
              acceptedUsers: member.id,
              mockMember: member.id
            }
          }
        );
     
//==========================================================================================

        let acceptedUsersLength;
        if (result.modifiedCount === 1) {
          // If the update was successful, 
         //retrieve the updated document 
         const updatedDocument = await collection.findOne({ invite: modifiedInviteCode });
   
         // Get the length of the "acceptedUsers" array in the updated document
         // so we pass it as total amount to be staked on DIST contract
           acceptedUsersLength = updatedDocument.acceptedUsers.length;
   
         console.log('Accepted Users Length:', acceptedUsersLength);
       } else {
         console.log('Update failed result=.' , result);
       }
  //=============================================================================================


  const inviterFomMongo = await collection.findOne(
    { invite: modifiedInviteCode },
    { projection: { ID: 1  } }
  );

  console.log( "inviterFomMongo   " , inviterFomMongo);


//=============================================================================
 
let invite;
try {
  invite = await guild.invites.fetch({ code: modifiedInviteCode });
} catch (error) {
console.log(  " modifiedInviteCode  =  "  ,   modifiedInviteCode , " is not a invite on Discord or the count of uses did not change "   );
return;
}

   //============================================================================

   if ( !NewMemberShouldBeAllowedInServer(member)  ){
              invite.uses -= 1; // decrencrement invite uses if member was kicked
              invite.upload();
           logChannel.send(`${ member.tag } joined and got Kicked right after because it doea not meet this server requierement.`)
          member.kick();
          }
 
   addto_inviteStaking( inviterFomMongo.ID,  acceptedUsersLength );






 });
 ///check: emit/guildMemberAdd for mocking event
 discordClient.on(Events.GuildMemberAdd, async member  => {  //memberWhoJoin
         
    const {mongoClient} = await connectToDataBase();
    const db = mongoClient.db("wudb");
    const collection = db.collection("discord_invites");
    
    /*
     const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );
    //===============================================================================
 
    // To compare, we need to load the current invite list.
       const newInvReal  = await guild.invites.fetch()
      
      if (!isSetBefore_due_to_debugMode){ 
        newInvites = new Collection(newInvReal.map((invite) => [invite.code, invite.uses]));
        isSetBefore_due_to_debugMode = false;// turn it back to a state so it can register 
        //new invilsit // if we test with actual user
        // it will be set to true everytime we simulate an emit memberAdd/remove event
     }
  
      // This is the *existing* invitesBeforeJoin for the guild.
    const oldInvites = invitesBeforeJoin ;
  

   let modifiedInviteCode;
   newInvites.forEach((newUses, code) => {
    const oldUses = oldInvites.get(code);
     //console.log(  ">>> newUses  = "  , newUses  , "code  " , code );

    if (oldUses !== undefined && newUses > oldUses) {
      console.log(`Invite ${code} has increased uses from ${oldUses} to ${newUses}`);
      modifiedInviteCode =  code;
    }
  });
  */

  const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );
  let modifiedInviteCode = await stepOne(guild);
  /*====================================================================================
     Time to uplaod to mongo DB invite object
  ==================================================================================== */


    console.log('guild ADD:modifiedInviteCode:', modifiedInviteCode);
    
     let acceptedUsersLength;
    // add th enew member to the collection
     const result = await collection.updateOne(
      { invite: modifiedInviteCode }, //< the invite that we detected has a change in uses
      { $push: { acceptedUsers: member.id } }
    );
     // Check if the update was successful
    if (result.modifiedCount === 1) {
       // If the update was successful, 
      //retrieve the updated document 
      const updatedDocument = await collection.findOne({ invite: modifiedInviteCode });

      // Get the length of the "acceptedUsers" array in the updated document
      // so we pass it as total amount to be staked on DIST contract
        acceptedUsersLength = updatedDocument.acceptedUsers.length;

      console.log('Accepted Users Length:', acceptedUsersLength);
    } else {
      console.log('Update failed result=.' , result);
    }
 
    //we want the inviter we saved in the database, to whom we
    // assigned the invite code.
    // in Discord, all invites are from one inviter.. the wulibot so we can
    // not rely on Discord here to get the inviter... let's check our database
    const inviterFomMongo = await collection.findOne(
      { invite: modifiedInviteCode },
      { projection: { ID: 1  } }
    );
  
    console.log( "inviterFomMongo   " , inviterFomMongo);
 

 //=============================
 
 /* if the invite we submitted does not exist, or for some reason no invite_uses difference
 is found, we avoid app crash/ error
 */
 let invite;
 try {
    invite = await guild.invites.fetch({ code: modifiedInviteCode });
} catch (error) {
  console.log(  " modifiedInviteCode  =  "  ,   modifiedInviteCode , " is not a invite on Discord or the count of uses did not change "   );
 return;
}
    // DO NOT USE inviter, all invites are form WuliBot.  inviter is ALWAYS wuliBot
    /* 
     const inviter = await discordClient.users.fetch(invite.inviter.id);
   */
    


    const logChannel = discordClient.channels.cache.get( botChannel );
 
      //member.guild.channels.cache.find(channel => channel.name === "join-logs");
    // A real basic message with the information we need. 
    inviterFomMongo
      ? logChannel.send(`${ member.tag } joined using invite code ${modifiedInviteCode} from ${inviterFomMongo.ID }. Invite was used ${invite.uses} times since its creation.`)
      : logChannel.send(`${ member.tag} joined but I couldn't find through which invite.`);
  
    // end from tutorial tracks invites
    
    
     if ( !NewMemberShouldBeAllowedInServer(member)  ){
             invite.uses -= 1; // decrencrement invite uses if member was kicked
             invite.upload();
       logChannel.send(`${ member.tag } joined and got Kicked right after because it doea not meet this server requierement.`)
        member.kick();
     }

// set the invites be  bsfore join to current state
/*
  this is done once whenn the bot/client login, and now
  so next time some one koin it can compare with this list of [invitecode-inviteUses] mapping
*/
//reset_invites_beforeJoin( guild );


     //BLOCKCHAIN INTERRACTION
     //to do: this function should be shared by multiple contract.. add arguments etc..

     /*
     note that $Wu token does not need to approve this contract, because this contract
     does not transfert $wu token it mint them to the claimer.
     See documentation:
     https://www.notion.so/Discord-Invite-to-get-Dist-Stake-Tokens-f8e166b7bae942cb92bdf793073332d3
     */
     //await setApprovalandTransfertFromRewardToken( Discord_invite_stake_token, Discord_stake_contract);
   
   
   
   
     addto_inviteStaking( inviterFomMongo.ID,  acceptedUsersLength );




     // we no nlonger add a Dit token
      //transfertDIST();
     // now we nee to transfert some $DIST to user,
      
  });

 
  //collection will be the real and the fake/mock one if we test
export async function updateInvitesOnMongo ( collection , filter, action ){
  const result = await collection.updateOne(
    filter,
    action
  );

}

  function NewMemberShouldBeAllowedInServer(member) {

    


    let accountAge =  getAccountAge(member);
       // is account age is > 90 days
     let accountIsOldEnough = accountAge > 90; // this could be voted
     let memberUsernameIsOk = true;// !member.username.startsWith("wulli");
   
   
      if (!accountIsOldEnough){
         console.log( `Reject account because age is    >> ${accountAge} `);
        return false;
      } 
       if ( !memberUsernameIsOk ){
         console.log( " Reject account name start with wulli  ");
        return false;
      }
      return true;  
     
   }// age in day
   function getAccountAge(member) {
     const createdAt = member.createdAt ;// member.user.createdAt;
     const now = new Date();
     const ageInMs = now - createdAt;
     const ageInDays = ageInMs / (1000 * 60 * 60 * 24); // convert milliseconds to days
     return ageInDays;
   }
   



  
   
 //-================================
 discordClient.on(Events.MessageCreate, (message) => {

  if (message.author.bot) { return };
  const channel = discordClient.channels.cache.get(botChannel);
  
  const tempMess = "reply from express server";
 

  discordClient.channels.cache.get(botChannel).send(tempMess);
 
   
  console.log(">> ", tempMess  );
  


  //TO DO:
  // bot on certain mode, could store user message if they get reactions from other
  //then repost these message ... follow by a random question and random price..must connect to //blockchain
  //   Who said that ? When was this said on the server?
  // reward automatic on the blockchain via  smart contract


  // for Shilling
  // a bot can check for specific tags, and key words in Twitter tweets.
  //=> Tweet  link submitted in a channel, the bot read the tweet look for the info 
  // use already functionnal code we cereated in Visual Studio
  // to send this to an data base  
  // 
});


//===========================


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
 app.use('/', processReferral);  //if you move it under authenticate, must include credential token 
 app.use('/', GetReferralCode);  // moved under authenticate, must include credential token      

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
 

// keep in mind that all request under
// "authenticate" middleware must contains a valid token
 app.use(authenticate);
 

 //app.use('/', processReferral); // we currently do not require auth token in it ..  
 //app.use('/', GetReferralCode);  // we currently do not require auth token in it .. 


 app.use('/', testToken); // Mount the exampleRouter at /api
 app.use(processClientReferralToken);
 

 app.use(corsMiddleware);
 app.use('/', userMe); // Mount the exampleRouter at /api
  
 
 
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






 