

const cors = require("cors");
const cookieParser = require("cookie-parser");




const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

 const { connectToDataBase } = require("../lib/connectToDataBase");
const globalData = require("./routes/globalData");

dotenv.config();
 const app = express();



  /*
 app.use((req, res, next) => {

    console.log(
        "REQUEST:",
        req.method,
        req.url,
        "ORIGIN:",
        req.headers.origin
    );

    next();
});
 */

 

app.use(cors({
    origin: true, 
    credentials: true
}));



app.use(cookieParser());



 


// --------------------------------------------------
// Paths
// --------------------------------------------------

const publicPath = path.join(__dirname, "..", "public");
 
 // --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(express.json({ limit: "2mb"}));
 app.use(express.urlencoded({ extended: true, limit: "2mb" }));
 // --------------------------------------------------
// Static files
// --------------------------------------------------
 // Local development only where express serve index.html
// current vercel express, trigger frontend ESM to be rewritten in CJS..(not ok)
// so In Vercel, public/ should be served directly by Vercel.(public has own mode:module package)
if (process.env.VERCEL !== "1") {
    app.use(express.static(publicPath));
}


// --------------------------------------------------
// Frontend / SPA
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


// --------------------------------------------------
// Embed SPA route
// --------------------------------------------------
 
 app.get("/:collection/:slug/embed/:componentId", (req, res) => {

    res.sendFile(
         path.join(publicPath, "index.html")
    );
 });



 
// Other SPA routes
app.get("/:collection/:slug?", (req, res, next) => {

    // Don't treat files/assets as SPA routes.
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

app.get("/api-test", (req, res) => {
    res.send("EXPRESS INDEX IS RUNNING");
});
// --------------------------------------------------
// Vercel export
// --------------------------------------------------

module.exports = app;