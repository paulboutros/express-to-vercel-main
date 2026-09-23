

//import { api_addTraitSelection, api_rebuildActiveFilterMap, api_set_filterModeABS } from "../JS/apiClient.js";
//import { getDOMregistry } from "../JS/Mainfunctions/DOMregistry.js";
import { getTraiDataResult,// propagateQueryResult,
     onTraitAdd, setDOM,
    filterModeToggleAction, 
    getUIelements} from "../JS/Mainfunctions/mainFunctions.js";
import viewManager from "./workspace/ViewManager.js";
import { //call_addTrait_inUI,
     get_UIstate, setTraitUIHandlers } from "../JS/wuli-ui/filterPills.js";
import ToggleButton from "../JS/wuli-ui/toggleButton.js";
import TraitSelectorPanel from "../JS/wuli-ui/traitSelectorPanel.js";


 
const panel_ignored_traits = [ "NECKSTYLE","DNA","_BODY_","_HEAD_","COLORSQN","HELMCREST","WEAPON_PAT","MASK_PAT"] ;



export function initTraitWidget /*(
     widgetContent,
     destinationContainer = null
    ) {*/
    ({
     widgetContent,
    destinationContainer = null,
    options = {}

}) {
//========================================

 /* */ 
const domTraitFILTER =  widgetContent.querySelector("#final_traitFILTERListContainer");
//widgetContent.querySelector("#wulifinal_traitList");
      
 const traitPillsContainer =  widgetContent.querySelector("#trait-pill-container");
       
  
const  rootContainer = document.getElementById("wuli-trait-panel-widget") ;
 setDOM({ traitpanel_widget: widgetContent });

 const root = getUIelements().traitpanel_widget;
    

     const pillsContainerName ="trait-pill-container";
  let bar = getElement(pillsContainerName);   

 


//======================================================== 
const filterModeToggle = new ToggleButton({
    root: widgetContent,
    containerId: "trait-pill-container", 
     id:"toggleButton",
     label: "Filter",
     className : "filterModeToggleBtn",
    values: ["OR","AND"],

     onChange: (values) => {
        get_UIstate().filterModeABS = values;
        filterModeToggleAction();
      } 
     

});
//=============================================================
 

//buttonSet2
    //======================================

 const traitPanel = new TraitSelectorPanel({
     root: widgetContent,
     container:  domTraitFILTER,
  //  container: document.getElementById("final_traitFILTERListContainer"),
     panel_ignored_traits: panel_ignored_traits,
    onAdd: ({ traitKey, value, ids }) => {
 

           onTraitAdd(traitKey, value, ids) ;
 
    }

});
  traitPanel.render(getTraiDataResult());
 
 //=====================================
 /*
 function refreshRender( dataArg ){
     traitPanel.render( dataArg );
 }*/


 setTraitUIHandlers({
                 onRemoveTrait(traitType, value, uiResult) {
     
  
                     if (  uiResult.pills.length === 0 ){ 
                        viewManager.hide("filterModeBTN");
                     } 
                    
                  filterModeToggleAction();
          
 
    
        }
     });
     
   // pillsDestination.appendChild(traitPillsContainer);
  
    //domTraitFILTER.appendChild(panelContent);
 
 // const  rootContainer = document.getElementById("wuli-trait-panel-widget") ;
   
     setDOM({viewManager, traitPanel });

    return rootContainer; 
     return  domTraitFILTER;

      

}


 function getElement(id) {

        const root = getUIelements().traitpanel_widget;

        

        return  root.querySelector(`#${id}`);
    }