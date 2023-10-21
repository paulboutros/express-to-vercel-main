 
import express from "express";
 

const router = express.Router();

// vercel version
/*
 res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', "https://www.wuli.rocks" ) // '*'
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
*/

/*
router.options('/user/me', (req, res) => {
  // Respond to preflight request
  res.status(200)
     .header('Access-Control-Allow-Origin', 'https://wuli.rocks')
     .header('Access-Control-Allow-Methods', 'GET, POST')
     .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
     .header('Access-Control-Allow-Credentials', 'true')
     .header('Access-Control-Max-Age', '86400')
     .end();
});*/
//router.use(authenticate);
  // do not forget to use the endpoint in index.js
router.get("/user/me", async (req, res) => {

   const origine = process.env.REACT_APP_URL;
     // Set the CORS headers
  res.header('Access-Control-Allow-Origin', origine);  // 'https://www.wuli.rocks'
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');

  // Your code to handle the "user/me" endpoint...
  const requestBody = req.state.user;

  // Send your response with the specified headers
  res.json(requestBody);



})
export default router;

 