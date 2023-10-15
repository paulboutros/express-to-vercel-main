

import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import jwt from 'jsonwebtoken';
const authenticate = async (request, response, next) => {

    try {
        // Get the token from the cookie
        const token = request.cookies.token;
    
        if (!token) {
          return response.status(401).json({ message: 'Authentication required' });
        }
    
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

        const stringToken = JSON.stringify(decoded, null, 2);
        
       
        const jwt_ID = decoded.sub;
        console.log( "stringToken decoded "  + stringToken);
        console.log( " jwt_ID "  + jwt_ID);
   
        const {mongoClient} = await connectToDataBase();
        const db = mongoClient.db("wudb");
         const collection = db.collection("users");
         let currentUser = await collection.findOne({ "ID": "423608837900206091" });
                        // await collection.findOne({ "ID": ID });
         console.log( " currentUser "  + currentUser);
        // You can attach the decoded user data to the request for use in other route handlers
        //request.user = decoded;
        request.state = {
            user:  currentUser ,
          };
        // Continue to the next middleware or route handler
        next();
      } catch (error) {
        request.state = {
            user: null ,
          };

          console.log( " error "  + error);

         return response.status(401).json({ message: ' Invalid or expired token' });
      }

     await next();
} 
 

  export default authenticate;