import { loadUserPreferences } from "../UserPreferences.js";
import { getProject, getProjectStore, initLocalStorage } from "./localStorageAccess.js";
import {  
          api_getTraitData,
          
          api_getUser,
          
          api_getUserProject
        
     } from "../apiClient.js"; 
import { api_collection_registerExistingData } from "./collectionResolver.js";
import { set_userResolveResult } from "./userResult.js";



let userResolveResult;
//=======
let userPreferences;
let traitData;
let project;
let projectId;
let userId;

//====




export async function getUserResolve(){
    const user = null;// await api_getUser("test_001");

    if (user) {

        

        // Load user's project from DB
        project = await api_getUserProject(user.userId);
        userPreferences = user.preferences;


            userId = user.userId;


    if (  project ) { 
            projectId = project.projectId;
        }  


    console.log( "project and user:",  {
    project,
    user,
        userPreferences,
        projectId
        });

        traitData = await api_getTraitData( {collectionId: project.projectId , userId });

    

    if (traitCounter_Data  ){ 

        //console.log(  "main F 1) api_collection_registerExistingData  " ,   );
    await  api_collection_registerExistingData( traitCounter_Data  );
     
        traitData = await api_getTraitData( {collectionId: projectId, userId });
    }


    // SessionState.project = project;

    } else {

    initLocalStorage();
    projectId = null;
        project = getProject(); 
    if (  project ) { 
            projectId = project.id
        }  

        console.log(  "project =========== " , project );

    traitData = await api_getTraitData( {collectionId: projectId });

    if (traitCounter_Data  ){ 

        //console.log(  "main F 1) api_collection_registerExistingData  " ,   );
    await  api_collection_registerExistingData( traitCounter_Data);
    //  console.log(  "main F 2) api_getdata  " ,   );
    traitData = await api_getTraitData( {collectionId: projectId });
    }

    userPreferences =  loadUserPreferences();

    }


    userResolveResult ={ 
        userPreferences,
        traitData,
      //  project,
        projectId,
        userId,


  }


    set_userResolveResult( userResolveResult);




   return userResolveResult;

 }