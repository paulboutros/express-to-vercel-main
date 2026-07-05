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



export async function getTraitData() {

    return post("/api/getTraitData");

}

export async function generateTraitSheets(query) {

    return post("/api/generateTraitSheets", query);

}

export async function searchCharacters(query) {

    return post("/api/searchCharacters", query);

}


export async function api_addTraitSelection(traitKey, value, ids, traitFilterData) {
  const res = await fetch("/api/traitFilter/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      traitKey,
      value,
      ids,
      traitFilterData
    })
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
     return await res.json();
} 
 
export async function api_rebuildActiveFilterMap( pillData ) {
   const res = await fetch("/api/traitFilter/rebuildActiveFilterMap", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
         pillData
    })
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 

 
export async function api_runQueryInputHandler(raw) {
   const res = await fetch("/api/query/runQueryInputHandler", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
          raw:raw
    })
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 
export async function api_set_filterModeABS( filterModeABS ) {
   const res = await fetch("/api/traitFilter/set_filterModeABS", {
     method: "POST",
    headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
          filterModeABS
    })
  });

  if (!res.ok) throw new Error("Failed to add trait selection");
  return await res.json();
} 