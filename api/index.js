//discord + saving and accessing token
//https://www.youtube.com/watch?v=hnk2-Fs8JVI&t=9s
//mern full stack:
/*
https://www.youtube.com/watch?v=K8YELRmUb5o&list=PL08VAKnhpM86qszK0uKZ-FXQpVy3fv_dg&index=7
*/

 
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectToDataBase } = require("../lib/connectToDataBase");
 
const cookieParser = require("cookie-parser");

//const corsMiddleware = require("./routes/middlewares/corsMiddleware");
//const authenticate = require("./routes/middlewares/authenticate");
 const getTokenDetails = require("./routes/getTokenDetails");

    const globalData = require("./routes/globalData");
 

const allowCors = require("./routes/middlewares/allowOrigins");

const { spawn, ChildProcess } = require("child_process");

const { Client, Events, Collection } = require("discord.js");

const { botChannel } = require("../const/addresses");


 const customEvent1="test" ; 


const targetChannelID = botChannel;
let invitesBeforeJoin = new Collection();

 let newInvites = new Collection();
  // will be set to true, when we trigger event, so we can modify newInvites 
  // when off, it will get newInvites from the Discord server to check for real changes in invite
 let isSetBefore_due_to_debugMode = false;

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

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


async function startServer() {

    

    // rest of startup...

}

startServer();

 
// the following starts the bot. We don't need the bot at the moment
 //someFunction();
 // modif can be positif or negatif depending on Add or remove member
   async function modify_newInvites( guild,  inviteCodeToUpdate  , modif ){

  isSetBefore_due_to_debugMode = true;
  // const  newInvites = invitesBeforeJoin;
  const newInvReal  = await guild.invites.fetch()
    newInvites = new Collection(newInvReal.map((invite) => [invite.code, invite.uses]));
   
 // const firstElementCode = invitesBeforeJoin[inviteCodeToUpdate] ;//   .firstKey(); // Get the key (invite code) of the first element
  const currentValue = newInvites.get(inviteCodeToUpdate);
  newInvites.set(inviteCodeToUpdate, currentValue + modif);
  
}


  async  function set_inviteList_BeforeJoin( guild  ){

  const firstInvites = await guild.invites.fetch();
      
  invitesBeforeJoin = new Collection(firstInvites.map((invite) => [invite.code, invite.uses]));
              
 // console.log("  invitesBeforeJoin "  , invitesBeforeJoin)
}
 
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
 // console.log(  ">>> oldInvites length  = "  , oldInvites.length  );

 let modifiedInviteCode;
 newInvites.forEach((newUses, code) => {
  const oldUses = oldInvites.get(code);
  console.log(  ">>> oldUses  = "  , oldUses );
  if ( !oldUses){

     console.error(`Invite code ${code} not found in oldInvites`);
    
  }
   



   console.log(  ">>> newUses  = "  , newUses  , "code  " , code );
  
 const inviteDifference = newUses - oldUses;

 console.log(  ">>> inviteDifference  = "  ,  inviteDifference );
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
  
  

  function NewMemberShouldBeAllowedInServer(member) {
      let accountAge =  getAccountAge(member);
       // is account age is > 90 days
     let accountIsOldEnough = accountAge > 90; // this number could be voted by community
    
     if (!accountIsOldEnough){
         console.log( `Reject account because age is    >> ${accountAge} `);
         return false;
     } 
       
      return true;  
     
   }// age in day
   function getAccountAge(member) {
     const createdAt = member.createdAt ;// get age of account
     const now = new Date();
     const ageInMs = now - createdAt;
     const ageInDays = ageInMs / (1000 * 60 * 60 * 24); // convert milliseconds to days
     return ageInDays;
   }
    
    


//===========================
 /*
 app.use(
  "/wuli-ui",
  express.static(path.join(__dirname, "../node_modules/@wulirocks/ui/src"))
); */
  const uiPath = path.join(__dirname, "../node_modules/@wulirocks/ui/src");
   app.use("/wuli-ui", express.static(uiPath));
 //const queryEnginePath = path.join(__dirname, "../node_modules/@wulirocks/ui/src");
   //app.use("/wuli-ui", express.static(queryEnginePath));


// Serve static files (React app)
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, '..', 'public')));
app.get("/", (request, response) => {
  
  app.use(allowCors);
 
   
    response.send(
        "  login with discord:"+ "<a href="+process.env.YOUROAUTH2URL+">login</a>" )
    
   
})


//WEB 3 test

 
 


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
 
  
 
 
// discord Oauth
   
 //================================
 app.use('/', globalData);
app.use("/", getTokenDetails);

 //===================================

// Middleware to extract IP address
app.use((req, res, next) => {
   req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});
//Tracking

//app.use('/',botTest);
 
 

 //app.use(corsMiddleware);
 
  
 
 
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


module.exports ={ 
  customEvent1 ,
  set_inviteList_BeforeJoin,
  modify_newInvites
}



 