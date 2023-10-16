 
const allowOrigins = async (req, res, next) => {
    const origin = req.headers.origin;

    // Define an array of allowed origins
     const allowedOrigins = ["http://localhost:3000", "https://www.wuli.rocks"]; // Add your client app's domain
  
    // Check if the requesting origin is in the allowedOrigins array
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  
    // Add more CORS-related headers as needed
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
  
    next();
} 
 

  export default allowOrigins;