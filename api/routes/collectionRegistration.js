 

const crypto = require("crypto");

    //================================
const activeCollections =
    new Map();

const MAX_ANONYMOUS_COLLECTIONS =
    10;

    //==========================



  function registerCollection(
    projectId,
    collectionData
) {

    // Basic validation
    if (!collectionData || !projectId) {

        return {

            ok: false,
             status: 400,
             error:
                "INVALID_COLLECTION",
             message:
                "Collection data is required."

        };

    }


    // Server capacity check
    if (
        activeCollections.size >=
        MAX_ANONYMOUS_COLLECTIONS
    ) {

        return {

            ok: false,
             status: 429,

            error:
                "SESSION_LIMIT_REACHED",

            message:
                "Temporary collection capacity is full. Account registration is required."

        };

    }


    // Create session ID
   // const collectionId = crypto.randomUUID();
  
    // Store collection
    activeCollections.set(

        projectId,{
             data: collectionData,
             createdAt: Date.now(),
             lastAccessedAt:  Date.now()
         
        }

    );
 
    return {
         ok: true,
         status: 200,
         projectId
     };

}



  function getCollection(
    collectionId
) {

    const session =
        activeCollections.get(
            collectionId
        );


    if (!session) {

        return null;

    }


    // Keep track of activity
    session.lastAccessedAt =
        Date.now();


    return session.data;

}


module.exports ={ registerCollection , getCollection}