import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import  {connectToDataBase} from '../lib/connectToDataBase.js';
 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import globalData from './routes/globalData.js';
import findUsersWithNonZeroProperties from './routes/findUsersWithNonZeroProperties.js';
import bestEarner from './routes/bestEarner.js';
import getData from './routes/getData.js';
//import getDiscordData from './routes/getDiscordData.js';
//import getTwitterData from './routes/getTwitterData.js';
import getSocialData from './routes/getSocialData.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now you can use __dirname as you would in CommonJS modules




 dotenv.config();

const app = express();
 

// Serve static files (React app)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cors());
 




 app.use('/', globalData);    
app.use('/', findUsersWithNonZeroProperties); // Mount the exampleRouter at /api
app.use('/', bestEarner); // Mount the exampleRouter at /api
app.use('/', getData); // Mount the exampleRouter at /api
 //app.use('/', getDiscordData); // Mount the exampleRouter at /api
 //app.use('/', getTwitterData); // Mount the exampleRouter at /api
 app.use('/', getSocialData); // Mount the exampleRouter at /api

 
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
 

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '..', 'public') });
})

console.log(`Server is running on port: ${process.env.PORT}`);

app.listen(process.env.PORT || 2000);

//module.exports = app;

 