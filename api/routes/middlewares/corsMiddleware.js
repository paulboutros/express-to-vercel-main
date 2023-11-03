function corsMiddleware(req, res, next) {
    const origine = process.env.REACT_APP_URL; // Replace with your allowed origin
    res.header('Access-Control-Allow-Origin', origine);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    next();
  }
  
  export default corsMiddleware;