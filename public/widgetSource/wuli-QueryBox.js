import { api_getQueryExample } from "../JS/apiClient.js";
import {/* refreshQueryResult,*/ setAllElement, setDOM } from "../JS/Mainfunctions/mainFunctions.js";
import QueryBox from "../JS/wuli-ui/QueryBox/QueryBox.js";
import QueryStore from "../JS/wuli-ui/QueryBox/QueryStore.js";



 export async function initQueryBox  ({ 
      
      widgetContent,options = {}
 }){

    const {  onResult } = options;
 
     const domQuerybox =  widgetContent.querySelector("#queryBox");
      
      const queryStore = new QueryStore();
      await queryStore.initialize(api_getQueryExample)  ;
 
    //  setAllElement({ root createInfoResult:false});
  
     const queryBox = new QueryBox({
        root: widgetContent,
        container: domQuerybox,
        store: queryStore,
        refreshQueryResult: onResult }
     );
       setDOM({queryBox ,
        
       queryAssistant :  queryBox.queryAssistantEl,
       queryInput  : queryBox.inputElementEl
       
    });


// exampke drop down
    // setDOM({dropDownExample:queryBox.dropdown});
       
      
//dropdown


  return domQuerybox;
           
}