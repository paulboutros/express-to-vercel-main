import cryptoRandomString  from "crypto-random-string";
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import { connectToDiscord }  from '../../../lib/connectToBotClient.js';

const guildId = process.env.SERVER_ID;
/*

video related to adding testing member joining server:
https://www.youtube.com/watch?v=gBKXmzbq2Bc&t=52s


discord.js source:
https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/structures/Invite.js#L288
*/
/*
Invites strategies */
import express from "express";
import { wullirockTestUser } from "../../../const/addresses.js";
import axios from "axios";
import { Collection } from "discord.js";
import { modify_newInvites } from "../../index.js";
 
const verificationChannel = '947487866655764556';
const router = express.Router();
  // do not forget to use the endpoint in index.js

  //this is triggered when user click  on button create referral link
  router.post("/generateReferralCode", async (req, response) => {

    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("user_tracking");
    
       if (!req.body.ID){
           const error = new Error(" param:ID need to be set in Body");
      
        // Set the HTTP status code for the response to indicate an error (e.g., 400 Bad Request)
        response.status(400);
        
        // Send the error message in the response
        response.json({ success: false, error: error.message });
        
        return; // Stop further execution

       }
       const ID = req.body.ID ;
      // const one_referral_Code = req.body.one_referral_Code;
   
       const one_referral_Code = cryptoRandomString({ length: 16, type: 'alphanumeric' });

       // Create a shareable link
       const shareableLink = `${process.env.REACT_APP_URL}?referralCode=${one_referral_Code}`;
 

       const referralData ={
          code: one_referral_Code,
          shareableLink: shareableLink,
          referredUser:[] // people hwo have accepted
        }
           
       let result = await collection.updateOne(
      { "ID": ID },
      {
        
         $set: { "referralCodes": referralData }
      },
      { upsert: true } // Add this option for upsert
       
    );
    console.log(`shareableLink ${shareableLink}`);
    if (result.upsertedCount === 1) {
      // Document was inserted (upsert occurred)
      console.log(`Document with ID ${ID} upserted successfully`);
    } else if (result.matchedCount === 1) {
      // Document was updated
      console.log(`Document with ID ${ID} updated successfully`);
    } else {
      // No document was updated or inserted
      console.log(`No document was updated or inserted for ID ${ID}`);
    }
    
      const responeToClient = {
         shareableLink :shareableLink
      };
 
      response.status(200).json(referralData);
      
      // response.status(200).json(responeToClient);
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
  });
 
 


    router.get("/discord_invite_delete", async (req, response) => {
 
       const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("discord_invites");
  
          
      
      const ID = req.query.ID; 
      if ( !ID ) {
          const error = new Error("'ID' should be set in you rerquest body");
          response.status(400);
          response.json({ success: false, error: error.message });
          
          return; // Stop further execution
      }
      try {

       let MongoDeleteResult;
        const memberInviter = await collection.findOne(
          { ID: ID }, // look for this user
          { projection: { invite: 1 } } // get the invite/referral code
        );
        let inviteCode ;
        
        if (memberInviter){

           inviteCode  = memberInviter.invite;
           
           console.log(  "memberInviter  "  , memberInviter);
         
          const { discordClient } = await connectToDiscord();
          const invite = await discordClient.fetchInvite(inviteCode);

         // Check if the invite exists
         if (invite) {
           // Delete the invite
           await invite.delete();
           console.log(`Invite ${inviteCode} deleted successfully.`);
         } else {
           console.log(`Invite ${inviteCode} not found.`);
         } 
            
           MongoDeleteResult = await collection.deleteOne({ invite: inviteCode });
          
          }
        
        response.status(200).json(  MongoDeleteResult   );
      } catch (e) {
        console.error(e);
        response.status(500).json({ error: "An error occurred" });
      }
    });

     router.post("/discord_invite_create_list", async (req, response) => {


       let result;
       const IDlist = req.body.IDlist;
      
       for (let i =0  ; i < IDlist.length; i++ ){
         req.query.ID = IDlist[ i ];
            result = await discord_invite_create( req, response );
        
       } 
       response.status( result.code ).json(  result.json  );  


      
    });
      
  router.get("/discord_invite_create", async (req, response) => {
 

    try {
        const result = await discord_invite_create( req  );
        response.status(result.code).json( result.json );  

      } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
     }
 
  });


 async function discord_invite_create( req ){
  const { mongoClient } = await connectToDataBase();
  const db = mongoClient.db("wudb");
  const collection = db.collection("discord_invites");
  
      
  const ID = req.query.ID;




  if ( !ID ) {
      const error = new Error("'userId' should be set in you rerquest body");
    //   response.status(400);
    //  response.json(  { success: false, error: error.message }    );
      
      return  { code :400 , json: { success: false, error: error.message }     }; // Stop further execution
  }
  try {
    // make sure an invite already assign to user does not exist;
       const inviteWithThisID_exist = await collection.findOne({ID:ID})
       if (inviteWithThisID_exist ) {
           return  { code :400 , json: {  msg: `invite for this ID:${ID}exist already. Invite NOT created`
             }}; // Stop further execution
          
       }

       // done including :
   // 1028006501
   
     
      const { discordClient } = await connectToDiscord();
      const channel = discordClient.channels.cache.get(  verificationChannel  );  
    

     let responseToClient = {inviteData: null}
       // cool strategy: let user once ev 3 days. create a 24 invite channel, allinvites count 1.5 weight then it expires
       let inviteData;
       const invite = await channel.createInvite( {  unique: true,   maxAge:  0 }  )    //6400, // 24 hours
       .then(inv=> 
            {
              inviteData = {
                invite:inv.code,
                shareableLink: ( "https://discord.gg/" + inv.code ),
                ID:ID,
                acceptedUsers:[]
                
              };

                responseToClient.inviteData = inviteData ;//.status = inv.code
              }
          );
        
     const result = await collection.insertOne( inviteData );
      
     return  { code :200 , json: responseToClient    }; // Stop further execution
     // response.status(200).json(  responseToClient  );
  } catch (e) {
    console.error(e);
    response.status(500).json({ error: "An error occurred" });
  }


 
 }
  
  router.get("/discord_kick", async (req, response) => {
 
     
    
    const ID = req.query.ID; 
    if ( !ID ) {
        // const error = new Error("'inviteCode' should be set in you rerquest body");
        // response.status(400);
        // response.json({ success: false, error: error.message });
        
        // return; // Stop further execution
    }
    try {
 
      const { discordClient } = await connectToDiscord();
       

        const guild  =   discordClient.guilds.cache.get(guildId);
         
       const ServerMembers = await guild.members.fetch();

        
      
         const member =   guild.members.cache.get( wullirockTestUser ) ;
        if ( member )  {   


            console.log(  "member  found   "     );
           member.kick("testing purposes");

        }else{ 
          console.log(  "member  NOT FOUND  ");
        } 
 
       
      
      response.status(200).json(  { result:"ok"}   );
    } catch (e) {
      console.error(e);
       response.status(500).json({ error: "An error occurred" });
    }
  });

  router.get("/emit/guildMemberRemove", async (req, response) => {
 
     
     
    const type = req.query.type; 
   let mock_leavingrMember_ID = req.query.mock_leavingrMember_ID; 
   let modifiedInviteCode     = req.query.modifiedInviteCode; 
 

   try {

     const { discordClient } = await connectToDiscord();
 
     // let's' pick a random member to add to the list
      const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );
       

      console.log( " >>>   mock_leavingrMember_ID    == "  ,mock_leavingrMember_ID);
      console.log( " >>>   modifiedInviteCode        == "  ,modifiedInviteCode);
      //const invite = await guild.invites.fetch({ code: modifiedInviteCode });
      
      // we change the invite.uses count of a temp list, to simulate a use change
      // so MemberRemove event can detect which invite was changed.
      // This function will not run in real scenario.. where invite use will increase for real
      const removeInvite = -1;
      modify_newInvites( guild, modifiedInviteCode, removeInvite); 
  
      
      
    simulateGuildMemberRemove( discordClient, mock_leavingrMember_ID );
     
     
     
     response.status(200).json(  { result:"ok"}   );
   } catch (e) {
     console.error(e);
      response.status(500).json({ error: "An error occurred" });
   }
 });

// 334,29:   // actual event listener "Events.GuildMemberAdd,"
  router.get("/emit/guildMemberAdd", async (req, response) => {
 
     
     
     const type = req.query.type; 
    let mock_joiningMember_ID = req.query.ID; 
    let modifiedInviteCode = req.query.modifiedInviteCode; 


    /*
    if ( !mock_joiningMember_ID ) {
          const error = new Error("'ID' should be set in you rerquest body");
          response.status(400);
          response.json({ success: false, error: error.message });
        
        
    }*/

    try {
 
      const { discordClient } = await connectToDiscord();
 

      // let's' pick a random member to add to the list
       const guild = discordClient.guilds.cache.get( process.env.SERVER_ID );
       const ServerMembers = await guild.members.fetch();
       const members = ServerMembers.filter(member => !member.user.bot);

       // Create an array to store all non-bot members
       const membersArray = Array.from(members.values());
       const randomMember =  getRandomMember(membersArray);
        

       mock_joiningMember_ID = randomMember.user.id;
 

       const newInvReal  = await guild.invites.fetch()
       const newInvites = new Collection(newInvReal.map((invite) => [invite.code, invite.uses]));

        



      // modifiedInviteCode = "6za6sZyHDC";
        console.log( "modifiedInviteCode    == "  ,modifiedInviteCode);
       //const invite = await guild.invites.fetch({ code: modifiedInviteCode });
       
       // we change the inviteuses count of a temp list, to simulate a use change
       // so addMember event can detect which invite was use.
       // This function will not run in real scenario.. where invite use will increase for real
       // WE ARE preteding this invite has changed
       const addInvite = 1;
       modify_newInvites( guild, modifiedInviteCode, addInvite); 
    
 
       

       // here we save this user to the list of FAKE/Mock user, to display the fact it was added on database
       // using this mock function
       // the actual adding invitee on Mongo database will be bone inside the discord add member function
       //and will be done after, the function has been able to detected which invite has its count changed
       //to recap;
       // 1) we save this new member in the list of mockUser (in MongoDB discord_invites.mockMember ).
      //  2) we let the addMember discord function add the user the Mongo database, but we know that this user
      //is a mock member since it is also part of the list of mockmember.
      // Note: no user is actually added on the Discord Database,
      // it is not possible  during the mocking/testing process
       
       const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const collection = db.collection("discord_invites");
      const result = await collection.updateOne(
        { invite: modifiedInviteCode },
        {
          // Add the member ID to the array of mock members so we can keep track of it and display that on the front end
          $push: { mockMember: mock_joiningMember_ID }, 
        },
        { upsert: true } // Create the document if it doesn't exist
      );
      
      if (!type){
        simulateGuildMemberAdd( discordClient, mock_joiningMember_ID );
      }else{
      // type == nultiple
        simulateGuildMemberAdd_many( discordClient, mock_joiningMember_ID );

      }
      
      
      response.status(200).json(  { result:"ok"}   );
    } catch (e) {
      console.error(e);
       response.status(500).json({ error: "An error occurred" });
    }
  });
 

  async function fetchUserById( client , userId  ) {
    try {
      const user = await client.users.fetch(userId);
      console.log('Fetched user from API:', user.tag);
      return user;
    } catch (error) {
      console.error('Error fetching user from API:', error.message);
      return null;
    }
  }

// Function to pick a random member
function getRandomMember(membersArray) {
  const randomIndex = Math.floor(Math.random() * membersArray.length);
  return membersArray[randomIndex];
}



  // actual event listener "Events.GuildMemberAdd,"
  //is in index file
// Simulate the GuildMemberAdd event
async function simulateGuildMemberAdd(client, userId ) {
 
 // client.emit('test', 'these params', 'will be logged', 'via the listener.');
 // return;
  //const guildId = 'YOUR_GUILD_ID'; // Replace with your actual guild ID
  const guild = client.guilds.cache.get(guildId);
   
 
  // it is not in the cache.. it will ne when an event ex: message or other related to this user.. happens  
  //const user = client.users.cache.get(userId);
/*
many ways to get a user:
https://stackoverflow.com/questions/64933979/discord-get-user-by-id
*/
  // const user = await fetchUser(userId);   
 
  let fetchedUser = await fetchUserById(client, userId);
   
  // console.log('User attempt to join  = '  ,fetchedUser );
 
 // fetchedUser = { ...fetchedUser, isTestMember: true };
  client.emit('guildMemberAdd', fetchedUser);
 }


 // actual event listener "Events.GuildMemberAdd,"
  //is in index file
// Simulate the GuildMemberAdd event
async function simulateGuildMemberRemove(client, userId ) {
 
  
   const guild = client.guilds.cache.get(guildId);
   
   let fetchedUser = await fetchUserById(client, userId);
    
   // console.log('User attempt to join  = '  ,fetchedUser );
  
  // fetchedUser = { ...fetchedUser, isTestMember: true };
   client.emit('guildMemberRemove', fetchedUser);
  }
 








// try will multiple add at once
async function simulateGuildMemberAdd_many(client, userId ) {
   
   const guild = client.guilds.cache.get(guildId);
   
   const userIds = ["523040251862712320","925073990656077824","964233683898867792","949424238442455070" ];
    for (let i = 0; i < userIds.length; i++) {
      const fetchedUser = await fetchUserById(client, userIds[i]);
      client.emit('guildMemberAdd', fetchedUser);
    }
  
    
   //guild.emit('guildMemberAdd', user);
 }

/*
router.get('/joindiscord/:inviteCode', (req, res) => {
  const inviteCode = req.params.inviteCode;

  // Redirect to the Discord invite link
  res.redirect(`https://discord.gg/${inviteCode}`);

  // Now, you can use 'inviteCode' as the code used for the invite
  console.log(`User used invite code: ${inviteCode}`);
});
*/














  export default router;
  