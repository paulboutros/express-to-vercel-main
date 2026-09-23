 
 
import { api_collection_registerExistingData } from "../JS/Mainfunctions/collectionResolver.js";
import {   getDOMregistry } from "../JS/Mainfunctions/DOMregistry.js";
import { refreshQueryResult, setDOM,
        
         getUIelements

} from "../JS/Mainfunctions/mainFunctions.js";
import { setPageDataset } from "../JS/Mainfunctions/pageDataset.js";
 import { UIActionRegistry } from "./consoleOutputTXT/buttonActionRegistry.js"; 
 
 
 
 const eventBus = window.eventBus;

function createWidgetRoot(container) {

    if (container.shadowRoot) {
        return container.shadowRoot;
    }

    return container.attachShadow({
        mode: "open"
    });

}
  
async function render({
    initCompose,
    container,
    pageData,

   // collection = "guide",
   // slug,
    componentId = 0,

    html,
    style,
    shadowName,
    className = "wulirocks",
  //  width = null,
    pageSetup
}) {

    if (!container)
        throw new Error(
            "WuliArchitecture.render() requires a container."
        );


  

    const widgetContent =
        createWidgetContent(container, {
            className,
            style
          // , width
        });

    getDOMregistry()[shadowName] =
        widgetContent;

    if (pageSetup)
        pageSetup({ });
          
       

    widgetContent.innerHTML =
        typeof html === "function"
            ? html({
              //  pageData,
                //collection,
              //  slug,
                componentId
              })
            : html;
            //=================================================================
                const styleConfig =  style?.element;
                

                console.log(" styleConfig   === " ,
                        {styleConfig,
                              style } );

                if (styleConfig) {

                    const { id, ...styles } = styleConfig;

                    const element = id
                        ? widgetContent.querySelector(`#${id}`)
                        : widgetContent.firstElementChild;

                      
                    if (element) {
                        for (const [property, value] of Object.entries(styles)) {
                            element.style[property] = value;
                        }
                    }
                }
            //=================================================================



     


    await initCompose(
        widgetContent,
        [

                WuliComposer.traitPanel ,
               
                WuliComposer.queryBox,
                WuliComposer.infoResult,
                WuliComposer.consoleTXT,
                WuliComposer.assetPicker,
                WuliComposer.tiersTab ,
                WuliComposer.initBTNrarity,
                WuliComposer.imageGrid
            /*
            initTraitWidget,
            initQueryBox,
            initinfoResult,
            initconsoleTXT,
            initAssetPicker,
            initTiersTab
            */

        ]
    );

    return widgetContent;
}

// this access various container after the html has been render....
 
async function initCompose(widgetContent, widgets = []){ 
     

console.log(   "intcompose:  widgets " , widgets   )


     for (const config of widgets) {


         // Load the widget initializer
        const initWidget = await config.widget();

        // Execute the widget initializer
        const component = await initWidget({
 
      //  const component= await config.widget({
            
             widgetContent,
            // destinationContainer: config.destinationContainer,
             options:  config.options,
          //   style: config.style
         });
     
        if (config.destinationContainer) {
            config.destinationContainer.prepend(component);
          }
 
    }

 

 
}
 
export const WuliComposer = {
    runWidget,
    initCompose,
    widgets: {

        infoResult: async () => {
            const { initinfoResult } =
                await import(
                    `${API_BASE_URL}/widgetSource/wuli-infoResult.js`
                );

            return initinfoResult;
        }, 
        queryBox    :  async () => {const { initQueryBox } = await import(`${API_BASE_URL}/widgetSource/wuli-QueryBox.js`); return initQueryBox; },
        traitPanel  :  async () => {const { initTraitWidget } = await import(`${API_BASE_URL}/widgetSource/trait-panel.js`); return initTraitWidget; },
        consoleTXT  :  async () => {const { initconsoleTXT } = await import(`${API_BASE_URL}/widgetSource/consoleOutputTXT/wuli-consoleOutputTXT.js`); return initconsoleTXT; },
        assetPicker  :  async () => {const { initAssetPicker } = await import(`${API_BASE_URL}/widgetSource/assetPicker/wuli-assetPicker.js`); return initAssetPicker; },
        tiersTab  :  async () => {const { initTiersTab } = await import(`${API_BASE_URL}/widgetSource/assetPicker/wuli-tiersTab.js`); return initTiersTab; },
        rarityCountBtn  :  async () => {const { initBTNrarity } = await import(`${API_BASE_URL}/widgetSource/TRAITCOUNT/rarityCountBtnWidget.js`); return initBTNrarity; } ,

        imageGrid  :  async () => {const { widgetInit } = await import(`${API_BASE_URL}/widgetSource/imageGridWidget/imageGridWidget.js`); return widgetInit; } 

        
 
        /*
        
        tiersTab   : initTiersTab
      */

        /*
       import { UIActionRegistry } from  `${API_BASE_URL}/widgetSource/consoleOutputTXT/buttonActionRegistry.js`;
    
         
        */
      
    },
    actions: {
        updateConsole : () => {} ,
        refreshQueryResult,
        registerExistingData: api_collection_registerExistingData
            
    },
    instance:{ 
       // class instance 
    },
    getUIelements,

    refreshQueryResult
};
 
window.WuliComposer = WuliComposer;
  
setDOM({activeCollection:"nothing"});
//--------------------------------------------------
// Public Widget API
//--------------------------------------------------
 
  //window.WuliArchitecture = { render };
    
 //  runWidget( initCompose );
  async function runWidget(
     {   container = document.getElementById("wuli-query-widget"),
         shadowName= "widgetContent",
         style ={

         }

      }={},
    initCompose 
 ){ 

    const wuliQueryWidget = container;// document.getElementById("wuli-query-widget"); 


  

   if (!wuliQueryWidget   ){  return;   }
     
   let pageData;
   // this is for diagram only 
   if (  wuliQueryWidget.dataset.src ){
       const jsonFile = wuliQueryWidget.dataset.src; 
       const response =  await fetch( jsonFile );
         
        if (!response.ok) {

            throw new Error(
                `Failed to load diagram.json: ${response.status}`
            );

        }
          pageData =await response.json();
          
      }

       
        //--------------------------------------------------
        // Render widget
        //--------------------------------------------------
       

    await render({
    initCompose,
      container ,//: document.getElementById("wuli-query-widget"),
       pageData,
       componentId: 0,
      shadowName , //: "widgetContent",
      style,

    className: "wulirocks",
 
   /* width: "300px",*/

    html: getHtml( shadowName ) ,

    pageSetup: () => {
          setPageDataset();
        
    }
});
  
 }


/*
function updateConsole({type, selectedKeys}){ 
        getConsoleBtnDescriptiontxt().refreshBTNdescription(
       getBtnDescription() ,
      { callBack:  ()=>{ 
         window.WuliComposer.actions.setSessionState ( { selectedKeys   }  );
        }
     }
     );
 
     
    function getBtnDescription(){ 
        return window.WuliComposer.instance.buttonHoverMessages["activeSelection"] ;
    }
    function getConsoleBtnDescriptiontxt(){ 
    return window.WuliComposer.instance.consoleBtnDescriptiontxt;
    }
}
    */

 
//=======================================================================================
     const API_BASE_URL =   globalThis.WULI_API_URL || "..";
export function createWidgetContent(
    container,
    {
        css = "/widgetSource/wuli-architecture.css",
        className = "wulirocks",
        style = {}
     //  , width = null
    } = {}
) {

     
  /*
    for (const [property, value] of Object.entries(style || {})) {
        widgetContent.style[property] = value;
    }
*/

    const shadowRoot = createWidgetRoot(container);
 
    const cssLinkref = document.createElement("link");
 
    cssLinkref.rel = "stylesheet";
    cssLinkref.href = API_BASE_URL + css;
       

    shadowRoot.appendChild(cssLinkref);

    const widgetContent = document.createElement("div");
       

    widgetContent.className =className;


    //  added fo grid
     //Every WuliComposer widget starts with a full-height, shrinkable content area.
    container.style. height= "100%"; 
    container.style. minHeight= 0;

    widgetContent.style. height= "100%"; 
    widgetContent.style. minHeight= 0;
   //==================================================================

         

    shadowRoot.appendChild(widgetContent);

    return widgetContent;
}
 
 
 
function getHtml(shadowName){ 

      switch (shadowName) {
        
  // grid-header
        case "imageGrid":
           
         return `   
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/imageGridwidget/css/style2.css">
                <div id="baseContainer"> 
                    <div id="grid-controls">
                        <button id="openNFTMETA">open NFT</button>
                        <button id="openNFTfolder">op NFT img</button>
                        <button id="openNFTMETA_PS2">op NFT MT</button>
                        <button id="openIMAGES">openIMAGES</button>
                        
                        <button id="prevFrame">◀</button>
                        <div id="curFrame"> 0 </div>
                        
                        <button id="nextFrame">▶</button>
                        <button id="frameUpdate">⟳</button>
                    
                        <button id="zoomOut">-</button>
                        <button id="zoomIn">+</button>
                    </div>
                    <div id="nft-grid"> </div>
                   </div>
                  
             `;

        case "tiersTab":
         return `
           
          
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/weapPatternStyle.css">
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/horizontalSelector.css">
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/contextMenu.css">
  
              <div id="horizSelector" ></div>
               <div id="tiersTab" ></div>
                 <div id="assetPickerGrid" ></div>
            
              `;
       case "assetPicker":
         return `
           
          
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/weapPatternStyle.css">
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/horizontalSelector.css">
                <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/assetPicker/css/contextMenu.css">
 
                <div id="myUIContainer"></div>

             
               <div id="horizSelector" ></div>
                <div id="assetPickerGrid" ></div>
            
              `;


      case "rarityCountBtn":
             
             return `
               <div id="rarityBtn">  </div> 
             
             `;  

        case "consoleTXT":
         return `
           <div id="consoleTXTcontainer">  
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/psdEditorStyle.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/warning.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/outputConsole.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/logFormatter.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/layoutA.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/glutter.css">
              <link rel="stylesheet" href="${API_BASE_URL}/widgetSource/consoleOutputTXT/css/consoleBTNdescription.css"></link>
           </div">  
             `;

        case "infoResult":
             
             return `
               <div id="resultInfo">  </div> 
               <div id="resultTitle" class="infoCard-title" >search result </div> 
             `;  
      
       case "traitPanel":
                return `
          
        <div id="trait-pill-container" class="active-Trait-Bar"> </div>
             <div id ="activeTraitBar"> </div>
              

            <div id="buttonSet2" data-toggle="traits" class="infoCard-title">traits list</div> 
              <div id="final_traitList" data-responsive="false" data-toggle="traits" class=""> 
                 <div id="final_traitFILTERListContainer"></div>  
               </div>  
          </div>  
 
            `;  
        case "queryBox":
                return `
         
  <!-- <div id="row1">
         <div id="topTraitSlot"> -->
           <div id="queryBox">   
                     <input class="queryInput" id="queryInput">
                     <div id="queryDropdown" class="queryDropdown" hidden></div>
                    <div id="queryAssistant" class="queryAssistant"  ></div>
                    <div id="correctionAssistant" class="correctionAssistant"  ></div>
             </div>
           </div>
  <!-- </div>
     </div>    -->
            `;  
      }
    

}



 //EVENT_allwidgetLoaded

 if(eventBus ){ 
    eventBus.on( eventBus.eventNames.EVENT_widgetLoaded , 
    ({ name, consoleInstance , uIActionRegistry_actions  }) => {

  
     if (name !== "add_consoleTXT_to_WuliComposer" ){
         
         return; 
      } 

       

       const uIActionRegistry = new UIActionRegistry();
       if(uIActionRegistry_actions ){
               Object.entries(uIActionRegistry.actions).forEach(([id, config]) => {
               // moving in widget
               var element = createToolControl(id, config , consoleInstance);
               appendToolToContainer(element, config , consoleInstance);
            });
        }
//=======================================================
    
                eventBus.emit(
                eventBus.eventNames.EVENT_widgetLoaded,
                    {
                        name: "register_UIActionRegistry_to_client",
                        uIActionRegistry,
                        consoleInstance 
                        
                    }
                 ); 
 
           



    // window.WuliComposer.instance.consoleBtnDescriptiontxt ; 

    // client-specific customization
   // widget.registerAction(...);
    });
 }

///  button factory:


function buttonRunBase(config ){ 
     
       if (editMode){ 
            openWithProgram(
              "C:/Users/ch/AppData/Local/Programs/Microsoft VS Code/Code.exe",
              //"C:/Program Files/Sublime Text/sublime_text.exe",
               config.path
            );
         return;
       }

        if (config.getInput) {
            save_psdEditorSessionData(config.getInput());
        }

        if (config.path && config.preCheckNeeded){ 

        
              if (!config.preCheckNeeded()){
                   runJSXfn(config.path); 
               }
        }
        //psdEditor:targetNFTChanged

        if (config.path && !config.preCheckNeeded){ 
            if ( config.path.includes(".jsx") ){
               runJSXfn(config.path);  
            } 
            
        }

        if (config.afterRun) {
            config.afterRun();
        }

}

function createToolControl(id, config,  widget) {

    switch(config.ui) {

        case "vector2":
            return createVectorTool(id, config,  widget);
        case "dropDown":
            return null// createDropDown(id, config,  widget);
        case "button":default:
        
            return createButtonTool(id, config ,  widget );
    }
}


function createVectorTool(id, config) {

    return createVectorControl({

        id:id,
        label: config.label || id,
        vector: config.vector() ,//|| { x: 0, y: 0 },

        onRun: function(value) {

            config.currentValue = value;

            buttonRunBase({
                path: config.path,
                getInput:  config.getInput 
                
            });
        },

        onVectorChange: function(value) {
            config.currentValue = value;
        }
    });
}

/*
function createDropDown(id, config ){ 

   // if ( !psdData )return null;
   let keysWithDocDNA =[];
    const folderPath = getPath( "", scriptType.PSDDATA)
     const jsonFiles  =  getAllJsonFiles(folderPath);

  //  const jsonFiles = getAllJsonFiles(ROOT);

    jsonFiles.forEach(filePath => {
      const filename = path.basename(filePath);
       keysWithDocDNA.push (filename);
    });
    

    

        let dropDownFn = function(selectedValue){
            updateStringTree(selectedValue )
          //  console.log("dropDown choice"); 
        
        }
     var dropDown = createPopulatedDropDown(null, keysWithDocDNA,"PSD", dropDownFn );
     dropDown.id = id;

      return dropDown;
}*/

// Recursively walk root folder and return all JSON file paths
  

function createButtonTool(id, config ,  consoleTXTInstance ) {

    var btn = document.createElement("button");
   
    btn.id = id;
   // btn.dataset.tool = id;
     btn.dataset.profiles =  config.profiles || [] ;//JSON.stringify(config.profiles || []);
      btn.dataset.tool = id;
      btn.classList.add("regularButton");
      btn.textContent = config.label || id;

      btn.addEventListener("click", function() {
        buttonRunBase(config);

        if ( config.btnDescription ){

            consoleTXTInstance.refreshBTNdescription( config.btnDescription );
            //consoleBtnDescriptiontxt.refreshBTNdescription( config.btnDescription );
        }

     });
 
     
    btn.addEventListener("mouseenter", () => { 
      var btnDescription = config.btnDescription;

       

      if( !btnDescription)return;
        current_btnDescription = btnDescription;
        consoleTXTInstance.refreshBTNdescription( btnDescription );
       // UIRegistry.consoleBtnDescriptiontxt.refreshBTNdescription( btnDescription );
       // window.WuliComposer.instance.consoleBtnDescriptiontxt.
       
       
    });

    btn.addEventListener("mouseleave", () => {
      var btnDescription = config.btnDescription;
    
       
              // ( "leaves " + consoleBtnDescriptiontxt.defaultMsg );
       
       
    });
 
       

   
    return btn;
}
  
//handleConsoleResponse("");
function appendToolToContainer(element, config) {

    var containerId = config.container || "mainTools";
    var container = document.getElementById(containerId);

    if (!container || !element) {
        return;
    }

    container.appendChild(element);
}
 

