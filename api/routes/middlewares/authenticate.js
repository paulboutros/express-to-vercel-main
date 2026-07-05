

const { connectToDataBase } = require ( "../../../lib/connectToDataBase.js");
const jwt = require ( 'jsonwebtoken');
const authenticate = async (request, response, next) => {

  

    try {

      const SKIP_AUTH = process.env.SKIP_AUTH === "true";

    if (SKIP_AUTH) {
        console.log("[DEV] Authentication skipped");
        return next();
    }

    //================================================================================
    //===================================================================================
        // Get the token from the cookie
        const token = request.cookies.token;
    
        if (!token) {
          return response.status(401).json({ message: 'Authentication required !!' });
        }
    
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        const stringToken = JSON.stringify(decoded, null, 2);
        
        const jwt_ID = decoded.sub;
       
   
        const {mongoClient} = await connectToDataBase();
        const db = mongoClient.db("wudb");
         const collection = db.collection("users");
         let currentUser = await collection.findOne({ "ID": jwt_ID });
       
        request.state = {
            can_delete_referral_cookie: false,
            user:  currentUser ,
           
          };


           

        // Continue to the next middleware or route handler
        next();
      } catch (error) {
        request.state = {
            can_delete_referral_cookie: false,
            user: null ,
            
          };

          console.log( "authenticate: error "  + error);

         return response.status(401).json({ message: ' Invalid or expired token' });
      }

     await next();
} 
 

module.exports ={ 
   authenticate
}
  //export default authenticate;