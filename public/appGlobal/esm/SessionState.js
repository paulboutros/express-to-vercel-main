
let sessionState = {};
var jsonDirty = true;
var cache = {};
 
  function getSessionValue(key, fallbackFn) {
    if (!(key in sessionState)) {
        sessionState[key] = fallbackFn();
    }
 
    
    return sessionState[key];
}
  
  function setSessionValue(key, value) {
    sessionState[key] = value;
}
 


  function cacheInit(){
    console.log(" cache init testSS")
    /*
    const jsonFolder =  getPath("",scriptType.JSONDATA)
    fs.watch(jsonFolder, function () {
        jsonDirty = true;
    });*/
}
 

 //cacheInit(); // widget is client agnostic.. let's not use the cache for now...


 
  function setCacheToDirty(){
    jsonDirty = true;
}

  function ensureJsonFresh() {

    
    if (!jsonDirty && cache) return cache;

    cache = loadAllJsonFiles();
    jsonDirty = false;
    return cache;
}

function getCache( dataKey ){

   const finalCache = ensureJsonFresh();
   return finalCache[dataKey];
}
 

function getDocConfigValue(group, key) {

    const docData = getCache("get_activeDocData")();

    return (
        docData?.config?.[group]?.[key]
        ?? DEFAULT_CONFIG[group]?.[key]
    );
}


 let dataProviders ={};
   function get_dataProviders(){ 
       return dataProviders;
 }
function loadAllJsonFiles() {
    try {
          const obj = {
         
           get_weaponShieldSession:
                dataProviders.get_weaponShieldSession?.(),

            get_gridSessionData:
                dataProviders.get_gridSessionData?.(),

            get_psdEditorSession:
                dataProviders.get_psdEditorSession?.(),

            // Important: this remains a function because the data
            // must be retrieved dynamically when requested.
            get_activeDocData:
                dataProviders.get_activeDocData
         
        };
          console.log("JSON data providers:", obj);
        // console.log( " obj.get_activeDocData  = " , obj.get_activeDocData );
          return obj;
 
    } catch (err) {
        console.log("Cache load error:", err);
        return cache || {};
    }
}
 
 
   function setSessionState( value ){ 
     sessionState = value;
 } 
 
 