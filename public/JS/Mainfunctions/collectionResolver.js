
import { uploadJSON } from "../copyEmbed.js";
import { api_collection_register } from "../apiClient.js";
import { get_userResolveResult } from "./userResult.js";

 export async function uploadBtn_rarity_function(){
     const jsonResult =  await  uploadJSON();
 
     api_collection_register(jsonResult, projectId);
 
}
  export async function api_collection_registerExistingData(jsonResult){
    // const jsonResult =  await  uploadJSON();


 
       const {projectId, userId } = get_userResolveResult()
        

     


    console.log( " ready to upload existing data " , { 
        jsonResult, projectId, userId
    } );
   return  api_collection_register(jsonResult, projectId, userId);
     
 
}