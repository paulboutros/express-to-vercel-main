import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}



const uri = process.env.MONGODB_URI


const options = {}

let client
let clientPromise: Promise<MongoClient>
console.log("  >>>>>>>>>>>>>..  process.env.NODE_ENV "  + process.env.NODE_ENV    );
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  
 // clientPromise = globalWithMongo._mongoClientPromise
  clientPromise  = globalWithMongo._mongoClientPromise ?? Promise.reject('_mongoClientPromise is undefined');
  console.log("  >>>>>>>>>>>>>..  clientPromise"  + clientPromise   );
} else {

  
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()

  console.log("  >>>>>>>>>>>>>..  client"  + client   );
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
