//const express = require('express');
//const app = express();

// Custom middleware to validate the request body
function validateRequestBody(req, res, next) {
  const { ID, wallet, discord } = req.body;

  if (!ID || !wallet || !discord) {
    // If any of the required properties are missing, respond with an error
    return res.status(400).json({ error: 'Missing required properties in the request body' });
  }

  // If all required properties are present, continue to the next middleware or route
  next();
}

export default validateRequestBody;
