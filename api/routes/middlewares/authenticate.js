

const { connectToDataBase } = require ( "../../../lib/connectToDataBase.js");
const jwt = require ( 'jsonwebtoken');
 



const getAuthenticatedUser = async (request) => {

    const token = request.cookies.token;

    if (!token) {
        return null;
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    const userId = decoded.sub;

    const { mongoClient } = await connectToDataBase();

    

    const db = mongoClient.db("wulirocks_test");
    const collection = db.collection("users");

    const currentUser = await collection.findOne({
        userId: userId
    });

    console.log("AUTH USER:", currentUser);

    return currentUser || null;
};




const authenticate = async (request, response, next) => {

    try {

        const currentUser =
            await getAuthenticatedUser(request);

        if (!currentUser) {

            return response.status(401).json({
                message: "Authentication required"
            });
        }

        request.state = {
            user: currentUser
        };

        console.log("AUTH STATE:", request.state);

        return next();

    } catch (error) {

        console.log("authenticate: error", error);

        request.state = {
            user: null
        };

        return response.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const authenticateOptional = async (request, response, next) => {

   console.log("=== authenticateOptional ===");
    console.log("Origin:", request.headers.origin);

    const token =  request.cookies?.token;
    console.log("Cookie:", token ? "TOKEN PRESENT" : "NO TOKEN");
    try {


       // Anonymous request:
        // no database required.
        if (!token) {

            request.state = {
                user: null
            };

            return next();
        }

 

        const currentUser =
            await getAuthenticatedUser(request);

        request.state = {
            user: currentUser
        };
 
        return next();

    } catch (error) {

        console.log("authenticateOptional: error", error);

        request.state = {
            user: null
        };

        return next();
    }
};

const allowPlaygroundOrAuth = (request, response, next) => {


   console.log("=== allowPlaygroundOrAuth ===");

    const origin = request.headers.origin;
    const serverUrl = process.env.SERVER_URL?.replace(/\/$/, "");

    console.log("REQUEST ORIGIN:", origin);
    console.log("SERVER_URL:", serverUrl);
    console.log("ORIGIN MATCH:", origin === serverUrl);
    console.log("USER:", request.state?.user?.userId || "NONE");
    // Authenticated user → normal access
    if (request.state?.user) {
        return next();
    }

    // Unauthenticated → must come from official Wuli site
   // const origin = request.headers.origin;

    if (origin === serverUrl) {

        request.state = {
            ...request.state,
             access: "public",
             collection: "playground"
              /* 
                 access: "authenticated",
                 collection: "user"
               */
        };

        return next();
    }

    return response.status(401).json({
        message: "Authentication required"
    });
};



/*
const authenticate = async (request, response, next) => {

    try {
     

        const token = request.cookies.token;

        if (!token) {
            return response.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userId = decoded.sub;

        const { mongoClient } = await connectToDataBase();

        const db = mongoClient.db("wulirocks_test");
        const collection = db.collection("users");

        const currentUser = await collection.findOne({
            userId: userId
        });

        console.log("AUTH USER:", currentUser);

        if (!currentUser) {
            return response.status(401).json({
                message: "User not found"
            });
        }

        request.state = {
            user: currentUser
        };

        console.log("AUTH STATE:", request.state);

        return next();

    } catch (error) {

        console.log("authenticate: error", error);

        request.state = {
            user: null
        };

        return response.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
*/

  

module.exports ={ 
   authenticate, authenticateOptional,allowPlaygroundOrAuth
}
  