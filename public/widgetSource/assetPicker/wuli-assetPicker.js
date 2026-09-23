 
 import { getAssetPicker, getTiersTab } from "./buildAsssetPicker.js";
 

export function initAssetPicker( { 
      widgetContent,
      options = {
             assetType,
              instanceName  ,
             getTiersTab_instanceName 
      }
 }){
 

      
     
 const rootContainer =  widgetContent.querySelector("#assetPickerGrid");

      window.WuliComposer.actions[ options.instanceName] = defaultOnSelect;
    
 

       const type =  weaponShieldSession.slot.last_picked.type;     // options.assetType || "weapon";
        const argObj = {
                 root: widgetContent,
                 container : "assetPickerGrid",
                 selectorContainer: "horizSelector",
                 instanceName: options.instanceName,
 
       }

  
        getAssetPicker(argObj).render(type);
      //  getTiersTab(type , argObj);

       
     
     window.WuliComposer.instance[ options.instanceName]  = 
      (type) =>{  
           console.log( "========== widget: getAssetPicker  :",{ 
                  type,
                  argObj
              });
         getAssetPicker(argObj).render(type);
      }
     ;
     window.WuliComposer.instance[ options.getTiersTab_instanceName]  =
      (type) =>{
              console.log( "========== widget: getTiersTab  :",{ 
                  type,
                  argObj
              });
             getTiersTab(type , argObj);
      }  
     


  return rootContainer;
}

function defaultOnSelect (){ 

       console.log("picker on select ");
}