 /*
 
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

 const { connectToDataBase } = require("../lib/connectToDataBase");
 const globalData = require("./routes/globalData");
  
const allowCors = require("./routes/middlewares/allowOrigins");

const { spawn, ChildProcess } = require("child_process");
 

dotenv.config();

const app = express();
const router = express.Router();
  
app.use(express.json());
 
app.use(express.urlencoded({ extended: true }));
   
 
const uiPath = path.join(__dirname, "../node_modules/@wulirocks/ui/src");
    app.use("/wuli-ui", express.static(uiPath));
 
    const publicPath = path.join(__dirname, "..", "public");
     app.use(express.static(publicPath));
    
   
    app.get("/", (request, response) => {
  
    app.use(allowCors);
     response.send(
          "login with discord:"+ "<a href="+process.env.YOUROAUTH2URL+">login</a>" )
    
})
 
      app.get("/guide", (req, res) => {
          res.sendFile(path.join(__dirname,'..',"public","index.html")); // guide
      });
      
      app.get("/:collection/:slug?", (req, res) => {
          res.sendFile(
              path.join(__dirname, "..", "public", "index.html")
          );
      });
  
 
 app.use('/', globalData);
 // Middleware to extract IP address
app.use((req, res, next) => {
   req.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
});
 
 // keep these as they show the direfferents ways of settting up route and enddpoint
app.get('/', (req, res) => res.send('Home Page Route'));
 
 

module.exports =   app  ;


*/

 
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectToDataBase } = require("../lib/connectToDataBase");
const globalData = require("./routes/globalData");
const allowCors = require("./routes/middlewares/allowOrigins");

dotenv.config();

const app = express();


// --------------------------------------------------
// Paths
// --------------------------------------------------

const publicPath = path.join(__dirname, "..", "public");

const uiPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "@wulirocks",
    "ui",
    "src"
);


// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Wuli UI package
app.use("/wuli-ui", express.static(uiPath));

// Main public/static files
app.use(express.static(publicPath));


// --------------------------------------------------
// Routes
// --------------------------------------------------

// Root / login
app.get("/", (req, res) => {

    app.use(allowCors);

    res.send(
        "login with discord: " +
        `<a href="${process.env.YOUROAUTH2URL}">login</a>`
    );
});


// Guide / SPA entry
app.get("/guide", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});

/*
// Collection / SPA routes
app.get("/:collection/:slug?", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});*/
app.get("/:collection/:slug?", (req, res, next) => {

    // Never use the SPA fallback for files/assets.
    if (path.extname(req.path)) {
        return next();
    }

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});






// --------------------------------------------------
// API routes
// --------------------------------------------------

app.use("/", globalData);


// --------------------------------------------------
// Request metadata
// --------------------------------------------------

// Middleware to extract IP address
app.use((req, res, next) => {

    req.ipAddress =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;

    next();

});


// --------------------------------------------------
// Local / experimental routes
// --------------------------------------------------

// Old test route removed:
// app.get("/", (req, res) => res.send("Home Page Route"));


// --------------------------------------------------
// Vercel entry point
// --------------------------------------------------

// IMPORTANT:
// Do NOT call app.listen() here.
// Vercel manages the HTTP server.

module.exports = app;
 

 