 
 import { getAssetPicker, getTiersTab } from "./buildAsssetPicker.js";
 

export function initAssetPicker( { 
      widgetContent,
      options = {
             assetType,
              instanceName  ,
             getTiersTab_instanceName 
      }
 }){
 

      console.log( "=======   initAssetPicker  "    );
    /*
const rootContainer =  widgetContent.querySelector("#consoleTXTcontainer");
 const consoleBtnDescriptiontxt = new OutputConsoleTXT({
     root: widgetContent,
    containerId : "consoleTXTcontainer" ,// layoutConfig.panels.top [layMode],
    autoRefresh :false,
    defaultMsg:"Button Description appears here",
    jsonPath:  psdLog,
    editable: false,
    consoleClassName : "output-console"// "output-console-descriptor"
});*/
 const rootContainer =  widgetContent.querySelector("#assetPickerGrid");

      window.WuliComposer.actions[ options.instanceName] = defaultOnSelect;
    

     console.log( "==========  weaponShieldSession.slot.last_picked.type  :",{
         weaponShieldSession:  weaponShieldSession.slot.last_picked.type
     });


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
    
  //  const instanceName = options?.instanceName;
  
  
    // const uIActionRegistry = new UIActionRegistry();
    // window.WuliComposer.instance.uIActionRegistry = uIActionRegistry;
   
   //window.WuliComposer.instance[instanceName]  = consoleBtnDescriptiontxt;
 

  // window.WuliComposer.instance.buttonHoverMessages =
      //  uIActionRegistry.messages;
   
  /*
      window.WuliComposer.actions.setSessionState = (state) =>{ 
                           setSessionState(state);
        } */
      
    /*
   const btnDescription =    uIActionRegistry.messages["activeSelection"] ;
 
  consoleBtnDescriptiontxt.refreshBTNdescription(
      btnDescription ,
      { callBack:  ()=>{ 

        
          window.WuliComposer.actions.setSessionState ( { selectedKeys : [2415555,2214,1264]}  );
          
       }
     }
    
    );
 
     initPayloadClickHandler( rootContainer);

*/



  return rootContainer;
}

function defaultOnSelect (){ 

       console.log("picker on select ");
}