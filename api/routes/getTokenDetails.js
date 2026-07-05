
 
const express = require("express");
 
const router = express.Router();

  

  // do not forget to use the endpoint in index.js
  router.get("/token/:contractAddress/:tokenId", async (req, res) => {
    

    res.send(`Contract Address: ${contractAddress}, Token ID: ${tokenId}`);
})
module.exports = router;

 