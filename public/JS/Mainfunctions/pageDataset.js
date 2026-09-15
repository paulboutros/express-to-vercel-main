export function setPageDataset(){ 
 const path = window.location.pathname;


 
const pathSegments = path.split("/").filter(Boolean);
 if (pathSegments.includes("embed")) {
     document.body.dataset.page = "embed"; 
     return;
} 
  
 document.body.dataset.page = "demo";
   
    
 if ( path.startsWith("/guide") ||
      path.startsWith("/introduction") || 
      path.startsWith("/reference")  || 
      path.startsWith("/purpose") 
     

){ 
     document.body.dataset.page = "guide";

}  
if ( path.startsWith("/apiPipeline")   ){ 
      document.body.dataset.page = "apiPipeline";
}
  

}