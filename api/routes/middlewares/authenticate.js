


import jwt from 'jsonwebtoken';
const authenticate = async (request, response, next) => {

     const token = request.cookies.token ;//request.cookies.token("token");
      console.log(token);

     await next();
} 

const authenticateXX = async (request, response, next) => {
    try {
      // Get the token from the cookie
      const token = request.cookies.token;
  
      if (!token) {
        return response.status(401).json({ message: 'Authentication required' });
      }
  
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // You can attach the decoded user data to the request for use in other route handlers
      request.user = decoded;
  
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      return response.status(401).json({ message: 'Invalid or expired token' });
    }
  };

  export default authenticate;