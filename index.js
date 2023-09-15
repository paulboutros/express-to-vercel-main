const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // Import the cors middleware
app.use(express.static('public'))


app.use(cors());
const {MongoClient} = require('mongodb');


async function main() {
    const uri = "mongodb+srv://gfulpak:(pX_19081908)@cluster0.xrarco9.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
      
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  
}
main().catch(console.error);
// added from an other tutorial

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 

// Define a route that returns the list of databases
app.get('/databases', async (req, res) => {
    try {
      const databases = await listDatabases();
      res.json({ databases });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching databases.' });
    }
  });



app.get('/', (req, res) => res.send('Home Page Route'));

app.get('/about', (req, res) => res.send('About Page Route'));

app.get('/portfolio', (req, res) => res.send('Portfolio Page Route'));

app.get('/contact', (req, res) => res.send('Contact Page Route'));
// end of adding
 

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
})

console.log(`Server is running on port: ${process.env.PORT}`);

app.listen(process.env.PORT || 3000);

module.exports = app;


/*

import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
   
   const client = new MongoClient(connectionString);
    console.log(  `client    = ${  client   }  `  );
 

let conn;
try {
    conn = await client.connect();
} catch(e) {
    console.error(e);
}

  let db = conn.db("sample_training");

export default db;
*/