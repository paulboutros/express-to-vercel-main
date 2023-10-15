 
import express from "express";
//import authenticate from "./middlewares/authenticate.js";



const router = express.Router();

// router.use(authenticate);
  // do not forget to use the endpoint in index.js
router.get("/testToken", async (req, response) => {
   
    const token =  req.cookies.token; // response.cookie.token;
  
     
    if (!token) {
      return response.status(401).json({ message: 'Token not found' });
    } 
  

    
     response.json({ message: 'Token found', token });
})
export default router;

 