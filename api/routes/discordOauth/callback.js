//discord + saving and accessing token
//https://www.youtube.com/watch?v=hnk2-Fs8JVI&t=9s

import url from 'url';
import express from "express";
import axios from "axios";
import fetch  from 'node-fetch';
import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
//import{ sign } from 'jsonwebtoken'
import jwt from 'jsonwebtoken';
 //import { newUserDocumentTemplate , globalTemplate } from "../../../lib/documentTemplate.js";
//import authenticate from "../middlewares/authenticate.js";

import { connectToDataBase } from "../../../lib/connectToDataBase.js";

dotenv.config()



const router = express.Router();

//router.use(authenticate);
  // do not forget to use the endpoint in index.js
  router.get("/api/auth/callback/discord", async (request, response) => { 

        // Handle the response from Discord and obtain the access token

        try {
            const { code } = request.query;
            
             if ( code ){
               const formData = new url.URLSearchParams({
                  client_id : process.env.DISCORD_CLIENT_ID,
                  client_secret: process.env.DISCORD_CLIENT_SECRET,
                  grant_type:'authorization_code',
                  code: code.toString(),
                  redirect_uri: process.env.CALLBACK_URL,
          
               });

               // get access token
               const output = await axios.post("https://discord.com/api/v10/oauth2/token",
                  formData, {
                      headers:{  
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                   
               });
           
                if ( output.data ) {
           

                     // use access token to make discord api call eget user info
                      const access = output.data.access_token;
                      const userinfo = await axios.get("https://discord.com/api/v10/users/@me",{
                         headers:{
          
                          Authorization: `Bearer ${access}`,
                         },
          
          
                      });
                /*
                   //Hc4rTLgFhg3hZDvyaUF3XMLeFTUceX
                */
                      // console.log( output.data , userinfo.data)
                     // now get refresh token  =======================================
                          const formData1 = new url.URLSearchParams({
                            client_id : process.env.DISCORD_CLIENT_ID,
                            client_secret: process.env.DISCORD_CLIENT_SECRET,
                            grant_type:'refresh_token',
                            refresh_token: output.data.refresh_token,
                           // redirect_uri: process.env.CALLBACK_URL,
                    
                        });
                        const refresh = await axios.post("https://discord.com/api/v10/oauth2/token",
                            formData1, {
                                headers:{  
                                  'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            
                        });
          
                        console.log( output.data , userinfo.data , refresh.data)
                         const  userDiscordId = userinfo.data.id;
                     //check if user exist
                     const {mongoClient} = await connectToDataBase();
      
                    const db = mongoClient.db("wudb");
                    const collection = db.collection("users");
                    //make a specific object type type here to get error if field is missing
                    const dataToSend = {
                     ID: userinfo.data.id,  // discord ID
                     id: userinfo.data.id, // discord ID for unique material UI grid
                     discord:userinfo.data.global_name ,
                     wallet: "not provided"
                   }
                 
                   
                    // no need to specify port.. will use current port the server run on
                   const apiUrl = process.env.SERVER_URL + 'addorupdate';
                   const userResponse = await axios.post(apiUrl, dataToSend);
                   if (userResponse.data.userExist) {

                   }else{


                   }
                  const token =   jwt.sign(
                     {sub: userinfo.data.id } , 
                      process.env.JWT_SECRET, 
                       {expiresIn: "2h"}  // one hour
                    
                   ); 
                  

                    
                   // 1 hour
                   //https://stackoverflow.com/questions/73723099/how-to-setup-node-to-make-different-domains-share-cookies
                   response.cookie('token',  token , 
                    // { maxAge: 3600000 , sameSite: 'None', secure: true });  
                      {
                        maxAge: 7200000, // 2 hours
                        httpOnly: false,  
                        sameSite: 'None', // other domain (client app domain can receive it, wont be filtered out my browser)
                        secure: true,
                        domain: process.env.COOKIE_DOMAIN,//'localhost',//   'wuli.rocks', // The dot indicates sharing with all subdomains
                        path: '/', // Set the path to a common path

                     }); 
                     /*
                       make the cookies accessible from JavaScript running on the client side. While this can be useful for some scenarios (like client-side authentication), "
                      */ 


                   //response.cookies.set();
                    
                  // response.redirect('/');
                  const baseurl = process.env.REACT_APP_URL;



                  console.log( " after discord callback redirect :"  + baseurl );
                   response.redirect( baseurl);
                        
                     
                      //   response.status(200).json(  refresh.data );
               // in video it explains you will need to save access token and refresh token
          
                }
           
             }
             
            // response.status(200).json(  refresh.data );
               }catch(e){
                      console.error(e);
                      response.status(500).json(e);
           
           
          }
           




})
export default router;