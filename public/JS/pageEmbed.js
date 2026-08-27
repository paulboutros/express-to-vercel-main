import { setPageDataset } from "./Mainfunctions/mainFunctions.js";
import GuideComponent from "./UI/GuideComponent.js";
import * as api from "./apiClient.js";
import { getCurrentRoute } from "./navigationTree.js";
 
let guideComponent = null;
export default async function initEmbed(
    {slug, collection} = getCurrentRoute() 
) {

    /*
     * Example target:
     *
     * /website/reference/from-dsl-selection-to-corrected-query/embed/dsl-selection-architecture
     *
     * currentRoute should give us enough information to identify:
     * - collection
     * - slug
     * - componentId
     */

    console.log("INIT EMBED");
    


     setPageDataset();
    // ---------------------------------------------------------
    // 1. Get the page data
    // ---------------------------------------------------------
     const allPageData    = await api.getPageData();
    
    
    
    
         const pageData       = allPageData[collection].pages[slug];
        // const path           = getNavigationPaths()[collection];// allPageData.paths[collection];
              // pathIndex      = Number( path.indexOf(slug) );
    
          console.log( " pageData  =======" , { 
            collection,
            slug,
            pageData
    
        });
        
        if (!guideComponent){ 
               guideComponent = new GuideComponent({
               container: document.getElementById("guideTextBlock"),
           }); 
        }
      
      //   guideComponent.show(pageData);  

    

    // ---------------------------------------------------------
    // 2. Find the requested component
    // ---------------------------------------------------------
/*
    const componentId =
        currentRoute.componentId;


    const section =
        page.sections?.find(
            section => section.id === componentId
        );


    if (!section) {
        console.error(
            "Embed component not found:",
            componentId
        );
        return;
    }


    // ---------------------------------------------------------
    // 3. Get the embed container
    // ---------------------------------------------------------

    const container =
        document.querySelector(
            "[data-embed-container]"
        );


    if (!container) {
        console.error(
            "Embed container not found"
        );
        return;
    }
*/

    // ---------------------------------------------------------
    // 4. Render ONLY the requested component
    // ---------------------------------------------------------
   const section = { 
     type:"fffffffffff"
   }
    switch (section.type) {

        case "architecture":

            renderArchitecture(
                container,
                section
            );

            break;


        // later:
        //
        // case "diagram":
        // case "code":
        // case "dataset":
        // ...
 

        default:

            console.warn(
                "Unsupported embed component:",
                section.type
            );
    }
}
 
