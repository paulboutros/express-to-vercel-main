 
import initDemo from  "./demo.js";
import { setPageDataset } from "./Mainfunctions/mainFunctions.js";
 import initEmbed from "./pageEmbed.js";
import initGuide from "./pageGuide.js";
   
console.log( "main loaded    "    );
     setPageDataset(); 
  
console.log( "document.body.dataset.page   =", document.body.dataset.page   );
 switch (document.body.dataset.page) {
     
    case "demo":
         initDemo();
        break;


    case "guide":  case "apiPipeline":
 
         initGuide();
      
       
        break;

        
  case "embed":  
 
      initEmbed();
        
        break;
 
}
        

 