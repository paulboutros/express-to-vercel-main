 
import { getDOMregistry } from "../public/JS/Mainfunctions/DOMregistry.js";
import { setPageDataset } from "../public/JS/Mainfunctions/pageDataset.js";
import GuideComponent from "../public/JS/UI/GuideComponent.js";
import QueryBox from "../public/JS/wuli-ui/QueryBox/QueryBox.js";
  


let guideComponent = null;
 

function createWidgetRoot(container) {

    if (container.shadowRoot) {
        return container.shadowRoot;
    }

    return container.attachShadow({
        mode: "open"
    });

}
 




function render({
     container,
     pageData,
     collection = "guide",
     slug,
     componentId = 0

}) {


 const API_BASE_URL =
    globalThis.WULI_API_URL
    || "..";  

    console.log(  " API_BASE_URL    = "   , API_BASE_URL   );
// SHADOW DOW
 const shadowRoot = createWidgetRoot(container);
  const style = document.createElement("link");
 
    style.rel = "stylesheet";
     style.href = API_BASE_URL + "/widget/wuli-architecture.css" /* widget CSS location */;
   // style.href = "../widget/wuli-architecture.css" /* widget CSS location */;
   
    shadowRoot.appendChild(style);
     // Create a normal element inside Shadow DOM
     const widgetContent = document.createElement("div");
 
    widgetContent.className = "wulirocks";
     shadowRoot.appendChild(widgetContent);
 
    getDOMregistry().widgetContent = widgetContent;
 
//=============================================
    //--------------------------------------------------
    // Preserve existing page setup
    //--------------------------------------------------
     setPageDataset();
     //--------------------------------------------------
    // Container safety
    //--------------------------------------------------

    if (!container) {

        throw new Error(
            "WuliArchitecture.render() requires a container."
        );

    }
 
    //--------------------------------------------------
    // Component setup
    //--------------------------------------------------
 

      let html = `
        <div id ="row1" >  
        <div id="topTraitSlot"></div>
         <div id="queryBox">
            <div class="queryCaret">
              <span class="queryCaretText"></span><span class="caretBar"></span>

           </div> 
                  <input class="queryInput" id="queryInput">

                  <div id="queryDropdown" class="queryDropdown" hidden></div>
                  <div id="queryAssistant" class="queryAssistant"  ></div>
                  <div id="correctionAssistant" class="correctionAssistant"  ></div>
           </div>

             <button id="querySave">s</button>
            <button id="queryReset">re</button>
         </div>
    `;

     html = `
        <div id ="row1" >vvvv </div>
    `;
  
    if (!guideComponent) {


        /*
       guideComponent =
        new GuideComponent({
            container: widgetContent
        });
*/  
        const container = widgetContent;
       //container.innerHTML = html;

      guideComponent = container.innerHTML = html;
   
  


     const queryBox = new QueryBox(
        /*
         widgetContent.querySelector("#queryBox"),
           null,// queryStore,
        null,// refreshQueryResult
        */
            {
                   root: document,
                   container: widgetContent.querySelector("#queryBox") 
                   
           }
     );





        
        

   }
  return guideComponent;







    //--------------------------------------------------
    // Existing embed options
    //--------------------------------------------------

    const options = {

        hideTopArea: true,
         collection,
         slug,
         componentId 
         

    };
 
    //--------------------------------------------------
    // Render
    //--------------------------------------------------

    guideComponent.show(

        pageData,
         options

    );


    return guideComponent;

}
 



function renderXXX({
     container,
     pageData,
     collection = "guide",
     slug,
     componentId = 0

}) {

// SHADOW DOW
 const shadowRoot = createWidgetRoot(container);
       

    // widget CSS goes INSIDE shadow root

    const style = document.createElement("link");
       

    style.rel = "stylesheet";
    style.href = "../widget/wuli-architecture.css" /* widget CSS location */;
   
    shadowRoot.appendChild(style);


    // Create a normal element inside Shadow DOM

    const widgetContent = document.createElement("div");
        

    widgetContent.className = "wulirocks";

    shadowRoot.appendChild(widgetContent);


    getDOMregistry().widgetContent = widgetContent;


//=============================================
    //--------------------------------------------------
    // Preserve existing page setup
    //--------------------------------------------------

    setPageDataset();
 
    //--------------------------------------------------
    // Container safety
    //--------------------------------------------------

    if (!container) {

        throw new Error(
            "WuliArchitecture.render() requires a container."
        );

    }
 
    //--------------------------------------------------
    // Component setup
    //--------------------------------------------------

    if (!guideComponent) {


        // Your existing code now uses widgetContent
       guideComponent =
        new GuideComponent({
            container: widgetContent
        });

      //  guideComponent = new GuideComponent({ container  });
        

    }
 
    //--------------------------------------------------
    // Existing embed options
    //--------------------------------------------------

    const options = {

        hideTopArea: true,
         collection,
         slug,
         componentId 
         

    };


    //--------------------------------------------------
    // Render
    //--------------------------------------------------

    guideComponent.show(

        pageData,

        options

    );


    return guideComponent;

}
 
 

//--------------------------------------------------
// Public Widget API
//--------------------------------------------------
 
  window.WuliArchitecture = { render };
    
   runWidget();
  async function runWidget(){ 

    const wuliQueryWidget = document.getElementById("wuli-query-widget"); 

   if (!wuliQueryWidget ||
     !wuliQueryWidget.dataset.src
   ){
      return;
     }

   const jsonFile = wuliQueryWidget.dataset.src; 

  console.log(   "  fetch   "    );
const response =  await fetch( jsonFile );
         console.log(   "fetch response    "  , response  ); 
        if (!response.ok) {

            throw new Error(
                `Failed to load diagram.json: ${response.status}`
            );

        }
 
        const pageData =await response.json();
 

        console.log(   "pageData   "  , pageData  );
        //--------------------------------------------------
        // Render widget
        //--------------------------------------------------

        render({

            container: wuliQueryWidget,
              
             pageData,

            collection: "reference",
             slug: "widget-test",
             componentId: 0

        });

 
 
    console.log(
    "Wulirocks Architecture widget ready"
    );

 }


 // temp test from expoted location for testing
 export function testWidget(){  
    runWidget();
 }