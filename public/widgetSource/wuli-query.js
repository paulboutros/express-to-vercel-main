 
 
import { api_getQueryExample } from "../JS/apiClient.js";
import { getDOMregistry } from "../JS/Mainfunctions/DOMregistry.js";
import { refreshQueryResult, setDOM,
         setAllElement

} from "../JS/Mainfunctions/mainFunctions.js";
import { setPageDataset } from "../JS/Mainfunctions/pageDataset.js";
import GuideComponent from "../JS/UI/GuideComponent.js";
import QueryBox from "../JS/wuli-ui/QueryBox/QueryBox.js";
import QueryStore from "../JS/wuli-ui/QueryBox/QueryStore.js";
  


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

         <button id="uploadBtn">upload</button>
         <button id="querySave">s</button>
         <button id="queryReset">re</button>
    </div>
     
 <div id="mainSlotB">
        
     <div id="resultInfo">  </div> 
      <div id="resultTitle" class="infoCard-title" >search result </div> 
       
     <div id="grid-container">
             <div id="nft-grid"></div>
     </div>
  </div>


 <div id="mainSlotA">
    <div id="mainLayoutA"></div>
   <div id="trait-pill-container" class="active-Trait-Bar"> </div>
   <div id="previewImg">
       
       <img class="previewImg" alt="">
        
   </div>
  </div>

 <div id="mainSlotC" data-toggle="traits" >
 
          <div id="mainLayoutC"></div> 


       <div id ="activeTraitBar"> </div>

        <div id="buttonSet2" data-toggle="traits" class="infoCard-title">traits list</div>
       
        <div id ="navig_container" data-toggle="navigation">
            <div id="navig_content"></div>
        </div>

        <div id ="final_traitList" data-toggle="traits">
              <div id="final_traitFILTERListContainer"></div>
         </div> 
         <button id="panelToggle">Traits</button>
</div>  <button id="navigToggle">Navigation</button>

  <div id="guideTextBlock"> </div>
  <div id="navigButton" class="guideNav" > </div>
 
 <div  id="nodeGraph" class="nodeGraph">
    <div id="nodeGraphScroll"> 
       <div id="nodeGraphCanvas" > </div>
     </div>
      
</div>

 <div id="lexerWidget" class="lexerWidget"></div>

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




     initCompose(widgetContent);
   





        
        

   }
  return guideComponent;
 
}


async function initCompose(widgetContent){ 

       
      const domQuerybox =  widgetContent.querySelector("#queryBox");
   
    
      const queryStore = new QueryStore();
      await queryStore.initialize(api_getQueryExample)  ;


      
      setAllElement({ root:widgetContent, createInfoResult:true});

     const queryBox = new QueryBox(
        /*
          domQuerybox,
           queryStore,
          refreshQueryResult
          */
           {
            root: widgetContent,
            container: domQuerybox, 
            store: queryStore,
            refreshQueryResult: refreshQueryResult 
            }
     );



          setDOM({queryBox});

}
 
/*
uploadBtn_rarity_function = ()=>{
     const jsonResult =  await  uploadJSON();
    guideComponent.refresh(jsonResult);
}*/
 /*
   
 
 
 */

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