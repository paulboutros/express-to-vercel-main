
 
import express from "express";
 //import {GetThirdWebSDK} from "../../utils/thirdwebSdk";
 //import {  TOOLS_ADDRESS  } from "../../const/addresses.js";
const router = express.Router();

  

  // do not forget to use the endpoint in index.js
  router.get("/token/:contractAddress/:tokenId", async (req, res) => {
    const { contractAddress, tokenId } = req.params;

    // Now you can use contractAddress and tokenId to fetch data or render the page
    // For example, you might render a template or send JSON data based on these parameters
   

    res.send(`Contract Address: ${contractAddress}, Token ID: ${tokenId}`);
})
export default router;

 