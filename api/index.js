import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectToDataBase} from '../lib/connectToDataBase.js';
 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import globalData from './routes/globalData.js';
import findUsersWithNonZeroProperties from './routes/findUsersWithNonZeroProperties.js';
import bestEarner from './routes/bestEarner.js';
import getData from './routes/getData.js';
import testToken from './routes/testToken.js';
import userMe from './routes/userMe.js';



//import getDiscordData from './routes/getDiscordData.js';
//import getTwitterData from './routes/getTwitterData.js';
 import getSocialData from './routes/getSocialData.js';

 
//registration
import addorupdate from './routes/addorupdate.js';

 //discord oauth endpoint
import authorize from './routes/discordOauth/authorize.js';
import callback from './routes/discordOauth/callback.js';


import cookieParser from 'cookie-parser' ;

import authenticate from "./routes/middlewares/authenticate.js";

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
const baseurl = 'https://admin-dashboard-ed-roh.vercel.app/';// process.env.REACT_APP_URL;// 'http://localhost:3000';
console.log('REACT_APP_URL:', process.env.REACT_APP_URL);
app.use(  cors(  {credentials: true }  )
  /*
  cors({
    credentials: true,
    origin: baseurl, 
  })
  */
);
 

// Serve static files (React app)
//app.use(express.static(path.join(__dirname, '..', 'public')));
app.get("/", (request, response) => {
  
/*
 const dynamicContent = 'Hello from Express Server!';
  
  // Render your HTML template and pass the variable
  res.render('index', { dynamicContent });
*/  

   
    response.send(
        "  login with discord:"+ "<a href="+process.env.YOUROAUTH2URL+">login</a>" )
   // const dynamicContent ="ddddddddddd";
   //response.render('index', { dynamicContent });
    
   
})



// discord Oauth
app.use('/', authorize);  
app.use('/', callback);  

app.use('/', globalData);    
app.use('/', findUsersWithNonZeroProperties); // Mount the exampleRouter at /api
app.use('/', bestEarner); // Mount the exampleRouter at /api
app.use('/', getData); // Mount the exampleRouter at /api
 //app.use('/', getDiscordData); // Mount the exampleRouter at /api
 //app.use('/', getTwitterData); // Mount the exampleRouter at /api
 app.use('/', getSocialData); // Mount the exampleRouter at /api

 app.use('/', addorupdate); // Mount the exampleRouter at /api

 //test

 //app.use('/', userMe); // Mount the exampleRouter at /api
 app.use(authenticate);

// Add a middleware to set the appropriate headers
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Define an array of allowed origins
const allowedOrigins = ["http://localhost:3000", "https://www.wuli.rocks"]; // Add your client app's domain

  // Check if the requesting origin is in the allowedOrigins array
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Add more CORS-related headers as needed
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

// ... Your other middleware and route handling ...

 
 app.use('/', testToken); // Mount the exampleRouter at /api
 app.use('/', userMe); // Mount the exampleRouter at /api
  

//router.use(authenticate);
  // do not forget to use the endpoint in index.js
 

 
 // keep these as they show the direfferents ways of settting up route and enddpoint
app.get('/', (req, res) => res.send('Home Page Route'));

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', async (req, response) =>{  

    try {
        //const mongoClient = await ( new MongoClient(uri, options)).connect();
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

//module.exports = app;

 