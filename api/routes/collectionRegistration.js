 

const crypto = require("crypto");
const { connectToDataBase } = require("../../lib/connectToDataBase");

    //================================
const activeCollections =
    new Map();

const MAX_ANONYMOUS_COLLECTIONS =
    10;

    //==========================



  function registerCollection(
   {userId, projectId , collectionData}
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

 

     const dataObj = {
             data: collectionData,
             createdAt: Date.now(),
             lastAccessedAt:  Date.now()
         
        } ;
    activeCollections.set(

        projectId, dataObj

    );

     const dataFirstKey = Object.keys(dataObj.data)[0]; 
     const dataFirstKeyLength = Object.values(dataObj.data[dataFirstKey] ).length; 

      const resultSumary = {
             projectId, 
             dataFirstKey, 
             dataFirstKeyLength,
             createdAt: dataObj.createdAt,
             lastAccessedAt: dataObj.lastAccessedAt
     } ;

 
    return {
         ok: true,
         status: 200,
         resultSumary
     };

}



  function getCollection(
    collectionId
) {


    console.log( "access guest collectionId:",collectionId );
    const session =
        activeCollections.get(
            collectionId
        );


    if (!session) {

        return null;

    }

     const dataFirstKey = Object.keys(session.data)[0]; 

     const dataFirstKeyLength = Object.values(session.data[dataFirstKey] ).length; 

     console.log( "  guest found session:", { 
             dataFirstKey, 
             dataFirstKeyLength,
             created: session.createdAt,
             lastAccessedAt: session.lastAccessedAt
     });

    // Keep track of activity
    session.lastAccessedAt =
        Date.now();


    return session.data;

}


async function registerCollection_db(
  userId, projectId , collectionData
) {

    // Basic validation
    if (!collectionData || !projectId || !userId) {

        return {
            ok: false,
            status: 400,
            error: "INVALID_COLLECTION",
            message: "Collection data is required."
        };

    }

    try {

        const { mongoClient } =
            await connectToDataBase();

        const db =
            mongoClient.db("wulirocks_test");

        const collection =
            db.collection("collections");


        await collection.updateOne(

            { projectId },

            {
                $set: {
                    userId,
                    projectId,
                    data: collectionData,
                    updatedAt: Date.now()
                },

                $setOnInsert: {
                    createdAt: Date.now()
                }
            },

            { upsert: true }

        );


    console.log("  added  collectionData  to  project  " , collectionData ) ;


        return {
            ok: true,
            status: 200,
            projectId
        };


    } catch (e) {

        console.error(e);

        return {
            ok: false,
            status: 500,
            error: "DATABASE_ERROR",
            message: e.message
        };

    }

}


async function getCollection_db(
    projectId
) {

    if (!projectId) {
        return null;
    }


    try {

        const { mongoClient } =
            await connectToDataBase();

        const db = mongoClient.db("wulirocks_test");
           

        const collection =db.collection("collections");
            


        const document =
            await collection.findOne({
                projectId
            });


        if (!document) {

            console.log( " no collection found for:" , projectId   );
            return null;
        }


        return document.data;


    } catch (e) {

        console.error(e);

        return null;

    }

}



module.exports ={ 
     registerCollection,     getCollection,
     registerCollection_db , getCollection_db
}