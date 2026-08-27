 const API_BASE = "";

async function request(url, options = {}) {

    const response = await fetch(API_BASE + url, {

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
export async function getTraitData() {

    return post("/api/getTraitData");

}

export async function api_generateAllTraitSheet(query) {

    return post("/api/generateAllTraitSheet", query);

}
export async function api_saveSheet(query) {

    return post("/api/saveSheet", query);

}



export async function searchCharacters(query) {

    return post("/api/searchCharacters", query);

}


export async function api_addTraitSelection(traitKey, value, ids, objArg) {
  const res = await fetch("/api/traitFilter/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      traitKey,
      value,
      ids,
      objArg
    })
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
     return await res.json();
} 
 

 
export async function api_getQueryExample(dataArg) {
   const res = await fetch("/api/getQueryExample", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( dataArg )
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 



export async function api_rebuildActiveFilterMap(dataArg) {
   const res = await fetch("/api/traitFilter/rebuildActiveFilterMap", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( dataArg )
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 

 
export async function api_runQueryInputHandler(obj) {


console.log( "obj   == "   ,obj )

   const res = await fetch("/api/query/runQueryInputHandler", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
     body: JSON.stringify(  obj ) //    {raw:raw}   )
          
    
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 
export async function api_set_filterModeABS( dataArg ) {
   const res = await fetch("/api/traitFilter/set_filterModeABS", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
     body: JSON.stringify( dataArg )
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 