import {  UIActionRegistry  } from "./buttonActionRegistry.js";
import { OutputConsoleTXT }  from "./outPutConsoleTXT.js" ;
import { initPayloadClickHandler } from "./psdEditorHandler.js";

 

 

const psdLog ="D:/GIT/hashLipsWuli/hashlips_art_engine/utils/WEAPON_ANGLE_MODIFICATION/utils/JSX/photoshop_log.txt";
 

export function initconsoleTXT( { 
      widgetContent,
      options = {
        
      }
 }){
 
const rootContainer =  widgetContent.querySelector("#consoleTXTcontainer");

const consoleBtnDescriptiontxt = new OutputConsoleTXT({
     root: widgetContent,
    containerId : "consoleTXTcontainer" ,// layoutConfig.panels.top [layMode],
    autoRefresh :false,
    defaultMsg:"Button Description appears here",
    jsonPath:  psdLog,
    editable: false,
    consoleClassName : "output-console"// "output-console-descriptor"
});

   
    const instanceName = options?.instanceName;
  
 // shared_state.selectedKeys = [2415,2214,1264];
 const uIActionRegistry = new UIActionRegistry();
    
    window.WuliComposer.instance.uIActionRegistry = uIActionRegistry;
   
   
  // window.WuliComposer.instance.consoleBtnDescriptiontxt = consoleBtnDescriptiontxt; 
   window.WuliComposer.instance[instanceName]  = consoleBtnDescriptiontxt;
 

   window.WuliComposer.instance.buttonHoverMessages =
        uIActionRegistry.messages;
   
     //buttonHoverMessages;


   window.WuliComposer.actions.setSessionState = (state) =>{ 
                           setSessionState(state);
        } 
      
 
   const btnDescription =    uIActionRegistry.messages["activeSelection"] ;



 
  consoleBtnDescriptiontxt.refreshBTNdescription(
      btnDescription ,
      { callBack:  ()=>{ 

        
          window.WuliComposer.actions.setSessionState ( { selectedKeys : [2415555,2214,1264]}  );
          
       }
     }
    
    );




     initPayloadClickHandler( rootContainer);





  return rootContainer;
}

/*
function getRegisterSessionState(){ 
     return window.WuliComposer.actions.setSessionState ;
 }

function getBtnDescription(){ 
   //  return window.WuliComposer.instance.uIActionRegistry.buttonHoverMessages["activeSelection"] ;
 }

function getConsoleBtnDescriptiontxt(){ 
   return window.WuliComposer.instance.consoleBtnDescriptiontxt;
}
*/
 