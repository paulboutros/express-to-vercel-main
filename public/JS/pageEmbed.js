//import { setPageDataset } from "./Mainfunctions/mainFunctions.js";
import { setPageDataset } from "./Mainfunctions/pageDataset.js";
import GuideComponent from "./UI/GuideComponent.js";
//import { renderArchitecture } from "./UI/renderArchitecture.js";
import * as api from "./apiClient.js";
// temp copied locally
//import { getCurrentRoute } from "./navigationTree.js";
 
let guideComponent = null;
export default async function initEmbed(
    {slug, collection, componentId} = getCurrentRoute() 
) {
     
     setPageDataset();
    
     const allPageData    = await api.getPageData();
     
         const pageData       = allPageData[collection].pages[slug];
        
          console.log( " pageData  =======" , { 
            collection,
            slug,
            pageData,
            componentId
    
        });
        
        if (!guideComponent){ 
               guideComponent = new GuideComponent({
               container: document.getElementById("guideTextBlock"),
           }); 
        }
      
        const options={ 
 
            hideTopArea:true,
            collection,
            slug,

            componentId// renderComponentId
        }
         guideComponent.show(pageData, options );  
 
}
 

export function getCurrentRoute() {

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return {

        collection: parts[0] || "guide",

        slug: parts[1] || "include-operator",
         //[2] /embed
        componentId: parts[3]

    };

}
