import { MongoClient } from 'mongodb'
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI
const options = {}
 
let mongoClient; // this becomes our cached connection
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  export async function connectToDataBase() {
    try {
      if (mongoClient) {
        return { mongoClient }; // Wrap the mongoClient in an object
      }
  
      mongoClient = await new MongoClient(uri, options).connect();
      console.log("Just Connected!");
      return { mongoClient }; // Wrap the mongoClient in an object
    } catch (e) {
      console.error(e);
      throw e; // Re-throw the error to handle it in the caller
     }
  }