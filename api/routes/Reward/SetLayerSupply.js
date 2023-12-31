
import url from 'url';
import express from "express";
 
import { connectToDataBase } from "../../../lib/connectToDataBase.js";
 
 

const router = express.Router();

 
  // do not forget to use the endpoint in index.js
  // this is just to display a referral for specific user
router.post("/SetLayerSupply", async (req, response) => {
    try {
      const { mongoClient } = await connectToDataBase();
      const db = mongoClient.db("wudb");
      const layerSupplyCollection = await db.collection("layer_supply");

 
       

      const layerResult = [];
      const cursor = await layerSupplyCollection.find({})
       

      // layer supply for that reward
      let reward_layerSupplies;
      for await (const doc of cursor) {
        layerResult.push(doc);
 
      }
    
       



      response.status(200).json( layerResult );
 
      
    } catch (e) {
       console.error(e);
      response.status(500).json({ error: "An error occurred" });
    }
 
  }
  
  );
  
  
  export default router;


 

  