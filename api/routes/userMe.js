 
import express from "express";
 

const router = express.Router();



//router.use(authenticate);
  // do not forget to use the endpoint in index.js
router.get("/user/me", async (req, response) => {
  
  /*
 const requestBody = req.state.user;
  response.json(  requestBody  );
 */

  res.header('Access-Control-Allow-Origin', 'https://wuli.rocks');
  // Your code to handle the "user/me" endpoint...
  const requestBody = req.state.user;
  
  // Send your response with the specified headers
  res.json(requestBody);



})
export default router;

 