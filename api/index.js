 /*
 
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
if (process.env.VERCEL !== "1") {
    app.use(express.static(path.join(__dirname, "../public")));
}
     //app.use(express.static(publicPath));
 
// Guide / SPA entry
app.get("/guide", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});
 
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
 
module.exports = app;
 

 */


const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const globalData = require("./routes/globalData");

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


// --------------------------------------------------
// Static files
// --------------------------------------------------

// Wuli UI package
app.use("/wuli-ui", express.static(uiPath));

// Main public/static files
app.use(express.static(publicPath));


// --------------------------------------------------
// Frontend / SPA entry
// --------------------------------------------------

// Root
app.get("/", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});

// Guide
app.get("/guide", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});

// SPA routes
app.get("/:collection/:slug?", (req, res, next) => {

    // Don't treat files/assets as SPA routes
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
// Export for Vercel
// --------------------------------------------------

module.exports = app;