 //const API_BASE = "";
 const API_BASE_URL =
    globalThis.WULI_API_URL
    || "";


console.log("API_BASE_URL ",  API_BASE_URL);


async function request(url, options = {}) {

    const response = await fetch(API_BASE_URL + url, {

        headers: {
            "Content-Type": "application/json"
        },

        ...options

    });

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }

    return response.json();

}

export async function get(path) {

    return request(path);

}

export async function post(path, data) {

    return request(path, {

        method: "POST",

        body: JSON.stringify(data)

    });

}


export async function getSiteNavigationData() {

    return post("/api/getSiteNavigationData" );

}


export async function getPageData() {

    return post("/api/getPageData" );

}
export async function api_getTraitData( query ) {
     
      return post("/api/getTraitData", query);
     
}
 
export async function api_generateAllTraitSheet(query) {

    return post("/api/generateAllTraitSheet", query);

}
export async function api_saveSheet(query) {

    return post("/api/saveSheet", query);

}

/*
const result = await (await fetch("/api/collection/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collectionId, query })
})).json();
*/
export async function api_collection_query(query) {

    return post("/api/searchCharacters", query);

}


export async function api_collection_register_db( collectionData, projectId) {
  
  return post("/api/collection_db/register", {collectionData, projectId} );
  
} 

export async function api_collection_register( collectionData, projectId, userId) {
  
  return post("/api/collection/register", {collectionData, projectId, userId} );
  
}

 

export async function searchCharacters(query) {

    return post("/api/searchCharacters", query);

}


export async function api_user_set(obj) {

 return post("/api/user_set", obj);
 
} 
export async function api_getUserProject(uerdID) {
   return get(`/api/user/${uerdID}/project` );
} 
export async function api_getUser( uerdID) {

 return get(`/api/user/${uerdID}` );
 
} 

 
export async function globalData_setDebugMode(traitKey, value, ids, objArg) {

 return post("/api/globalData_setDebugMode", {traitKey, value, ids, objArg});
 
} 
 


export async function api_addTraitSelection(traitKey, value, ids, objArg) {

 return post("/api/traitFilter/add", {traitKey, value, ids, objArg});
 
} 
 

 
export async function api_getQueryExample(dataArg) {

    return post("/api/getQueryExample", dataArg);
     
} 



export async function api_rebuildActiveFilterMap(dataArg) {

     return post("/api/traitFilter/rebuildActiveFilterMap", dataArg);
     

} 

 
export async function api_runQueryInputHandler(query) {

  return post("/api/query/runQueryInputHandler", query);
  
} 
export async function api_set_filterModeABS( dataArg ) {

return post("/api/traitFilter/set_filterModeABS", dataArg);
 
} 