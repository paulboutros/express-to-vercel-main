import initDemo from  "./demo.js";
import { setPageDataset } from "./Mainfunctions/mainFunctions.js";
import initGuide from "./pageGuide.js";
  


/*
const path = window.location.pathname;

 document.body.dataset.page = "demo";
if (path.startsWith("/guide") ||
     path.startsWith("/reference") || 
     path.startsWith("/apiPipeline")

){ 
     document.body.dataset.page = "guide";

}  
if ( path.startsWith("/apiPipeline")   ){ 
      document.body.dataset.page = "apiPipeline";
}
      
*/
 
   setPageDataset(); 
 
 
console.log( "document.body.dataset.page   =", document.body.dataset.page   );
 switch (document.body.dataset.page) {
     
    case "demo":
         initDemo();
        break;

    case "guide":case "reference": case "apiPipeline":
 
         initGuide();
      
       
        break;

}

 