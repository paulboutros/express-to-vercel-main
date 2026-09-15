 
import { getDOMregistry } from "../public/JS/Mainfunctions/DOMregistry.js";
import { setPageDataset } from "../public/JS/Mainfunctions/pageDataset.js";
import GuideComponent from "../public/JS/UI/GuideComponent.js";
  


let guideComponent = null;
 

function createWidgetRoot(container) {

    if (container.shadowRoot) {
        return container.shadowRoot;
    }

    return container.attachShadow({
        mode: "open"
    });

}

/**
 * Render a Wulirocks architecture component.
 */
function render({
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

    const architectureWidget = document.getElementById("architecture-widget"); 

   if (!architectureWidget ||
     !architectureWidget.dataset.src
   ){
      return;
     }

   const jsonFile = architectureWidget.dataset.src; 

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

            container: architectureWidget,
              
             pageData,

            collection: "reference",
             slug: "widget-test",
             componentId: 0

        });

 
 
    console.log(
    "Wulirocks Architecture widget ready"
    );

 }
