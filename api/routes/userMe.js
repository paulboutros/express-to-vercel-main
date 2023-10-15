 
import express from "express";
 

const router = express.Router();



//router.use(authenticate);
  // do not forget to use the endpoint in index.js
router.get("/user/me", async (req, response) => {
  
 const requestBody = req.state.user;

 
 response.json(  requestBody  );
 

})
export default router;

 