 
 import { getTiersTab } from "./buildAsssetPicker.js";
 

export function initTiersTab( { 
      widgetContent,
      options = {
             assetType,
              instanceName  ,
             getTiersTab_instanceName ,
             getTiersTab_instanceName_2
      }
 }){
 

      
     const rootContainer =  widgetContent.querySelector("#tiersTab");
 //const rootContainer =  widgetContent.querySelector("#tiersTab");

      window.WuliComposer.actions[ options.instanceName] = defaultOnSelect;
    

     console.log( "==========  weaponShieldSession.slot.last_picked.type  :",{
         weaponShieldSession:  weaponShieldSession.slot.last_picked.type
     });


       const type =  weaponShieldSession.slot.last_picked.type;     // options.assetType || "weapon";
        const argObj = {
                 root: widgetContent,
                 container : "assetPickerGrid",
                 selectorContainer: "tiersTab",
                 instanceName: options.instanceName,
 
       }

      getTiersTab(type , argObj);
     
     window.WuliComposer.instance[ options.getTiersTab_instanceName_2]  =
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