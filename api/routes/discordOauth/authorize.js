import express from "express";
import fetch  from 'node-fetch';
var config = {
  "clientId": process.env.DISCORD_CLIENT_ID,
  "clientSecret": process.env.DISCORD_CLIENT_SECRET,
  "redirectUri":process.env.CALLBACK_URL 
}


const router = express.Router();
  // do not forget to use the endpoint in index.js
  router.get("/authorize", async (request, response) => {

   
  
     try {
    
        var code = request.query["code"]
        var params = new URLSearchParams()
        params.append("client_id", config["clientId"] )  //config["clientId"]
        params.append("client_secret", config["clientSecret"])
        params.append("grant_type", "authorization_code")
        params.append("code", code)
        params.append("redirect_uri", config["redirectUri"])
        fetch(`https://discord.com/api/oauth2/token`, {
          method: "POST",
          body: params
        })
        .then(res => res.json())
        .then(json => {
          response.send("logged in")
        })

         // response.status(200).json(resultWithEarnings);
    
        
    }catch(e){
           console.error(e);
           response.status(500).json(e);


    }
})
export default router;  