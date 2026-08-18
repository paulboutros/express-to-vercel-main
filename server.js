// server.js
const app = require("./api/index");
 const PORT = process.env.PORT || 1999;

 
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
}); 
/*
 console.log(`Server is running on port: ${process.env.PORT}`);
  app.listen(process.env.PORT || 1999 );
  */