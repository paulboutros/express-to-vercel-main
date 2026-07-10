 


import { api_generateAllTraitSheet } from "../apiClient.js";
 

import  RunButton from "/wuli-ui/runButton.js";
     

   import {updateActiveTraitBar , call_addTrait_inUI , setTraitUIHandlers ,get_UIstate ,
       get_VideoFilterObject
    } from "/wuli-ui/filterPills.js";
  //import { get } from "lodash";
 


export const functionState={
    batchIndex:0
}

const preview = document.getElementById("sheetPreview");



export async function generateAllTraitSheet(batchNumber, incr , IDS_Match_Count){ 
               // functionState.batchIndex++;
               //   console.log("generateAllTraitSheet: renderTraitObject  =",  renderTraitObject);
          const maxPerSheet = 6;
          const totalSheetCount = Math.ceil(      get_UIstate().activeFilterMap_IDS.length   / maxPerSheet);

                 functionState.batchIndex =  functionState.batchIndex % totalSheetCount; //reseting it first
                functionState.batchIndex = (functionState.batchIndex + incr) % totalSheetCount;
                 if(functionState.batchIndex <0 )  { functionState.batchIndex = totalSheetCount-1 }

                console.log(  " generateAllTraitSheet batchIndex: " ,  functionState.batchIndex);
                // currentIndex = (currentIndex + 1) % nftListToRender.length;


                 var vidFilter = get_VideoFilterObject(); // get_featState().get_VideoFilterObject();
                 vidFilter.batchNumber = functionState.batchIndex;
              //  vidFilter.activeFilterMap_IDS = get_UIstate().activeFilterMap_IDS ;
             //   vidFilter.queryMode = get_UIstate().queryMode ;
               //vidFilter.raw =       get_UIstate().raw ;


        //    activeTraitUI_toArray,
     //  activeFilterMap_IDS, 
    // filterModeABS,
   //  queryMode,
  //  sheetTitle,
   // batchNumber,
    // raw  



                 let result = await api_generateAllTraitSheet({
                     videoFilterObject : vidFilter 
                 
                });
                 
                 
              

                  
                 
                    preview.innerHTML = "";
              for (let index = 0; index <  result.currentPreviewURLList.length; index++) {
  
               // const element = result.currentPreviewURLList[index];
                  const img = document.createElement("img");

                     const bufferData =   result.currentPreviewURLList[index].data;
                    //  console.log( "jpegBuffer data = " , bufferData  );

                      console.log("jpegBuffer bytes =", bufferData.length);
                      console.log("jpegBuffer MB =", (bufferData.length / 1024 / 1024).toFixed(2));                
                       
                      // const jpegBuffer = Buffer.from(bufferData);
                     //  const blob = new Blob([jpegBuffer], { type: "image/jpeg" });
                       

                       const byteArray = new Uint8Array(bufferData);
                       const blob = new Blob([byteArray], { type: "image/jpeg" });




                     let objUrl = URL.createObjectURL(blob);
                      img.src = objUrl;
                     preview.appendChild(img); 
              }
 
            



}

 