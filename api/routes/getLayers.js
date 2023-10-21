
import { connectToDataBase } from "../../lib/connectToDataBase.js";
import express from "express";
 

const router = express.Router();


router.get("/getLayersFull", async (req, response) => {

    try {
        //const mongoClient = await ( new MongoClient(uri, options)).connect();
         const {mongoClient} = await connectToDataBase();
      
          

        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        
        const result = await collection.aggregate([
            {
              $project: {
                _id: 0,
                ID:1,
                layers: 1,
                wallet: 1,
                discord: 1,
                id: 1,
              },
            },
          ]).toArray();


        console.log(result);
            
     
               response.status(200).json(result);
          }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})










  // do not forget to use the endpoint in index.js
  router.get("/getLayers", async (req, response) => {

    try {
        //const mongoClient = await ( new MongoClient(uri, options)).connect();
         const {mongoClient} = await connectToDataBase();
      
         const category ="he";

         
         const pipeline = [
            {
              $project: {
                _id: 0,
                discord: 1,
                wallet: 1,
                layers: {
                  [category]: {
                    $filter: {
                      input: `$layers.${category}`,
                      as: 'item',
                      cond: { $ne: ['$$item', null] },
                    },
                  },
                },
              },
            },
          ];
      
          





        const db = mongoClient.db("wudb");
        const collection = db.collection("users");
        const result = await collection.aggregate(pipeline).toArray();
            
     
               response.status(200).json(result);
         }catch(e){
                console.error(e);
                response.status(500).json(e);
     
     
         }
})
export default router;

 