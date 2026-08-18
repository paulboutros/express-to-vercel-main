/*
import initDemo from  "./demo.js";
import { setPageDataset } from "./Mainfunctions/mainFunctions.js";
import initGuide from "./pageGuide.js";
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

 