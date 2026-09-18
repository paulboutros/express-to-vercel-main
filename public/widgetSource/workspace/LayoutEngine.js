
       
       import viewManager         from "./ViewManager.js"; 
       import LayoutManager       from "./LayoutManager.js";
       import WorkspaceController from "./WorkspaceController.js";

const mainMiddle ="mainMiddle";// was "sheet"

  export default function startLayoutEngine({mode="demo", client="webApp"}){


    
     
//============================ layout manager and workspace controller ======================================
const layoutManager = new LayoutManager();

layoutManager.registerSlot( mainMiddle,document.getElementById("mainLayoutA"));//was sheettraitslot
layoutManager.registerSlot( "panel", document.getElementById("mainLayoutC"));
layoutManager.registerSlot( "top", document.getElementById("topTraitSlot"));
layoutManager.registerSlot( "grid", document.getElementById("mainSlotB"));
 
 

layoutManager.registerComponent("traitPills",      document.getElementById("trait-pill-container"));
layoutManager.registerComponent("previewImg", document.getElementById("previewImg"));  


layoutManager.registerComponent("navig_container", document.getElementById("navig_container")); 
layoutManager.registerComponent("final_traitList", document.getElementById("final_traitList"));
 

 
//layoutManager.registerComponent("siteNavigation", document.getElementById("siteNavigation")); 




layoutManager.registerComponent("buttonSet2", document.getElementById("buttonSet2")); 

//if ( client === "webApp" ){ 
layoutManager.registerComponent("queryBox", document.getElementById("queryBox")); 
//}

layoutManager.registerComponent("mainSlotB", document.getElementById("mainSlotB"));
layoutManager.registerComponent("guideTextBlock", document.getElementById("guideTextBlock")); 
layoutManager.registerComponent("navigButton", document.getElementById("navigButton"));
 
 layoutManager.registerComponent("nodeGraph", document.getElementById("nodeGraph"));
 layoutManager.registerComponent("lexerWidget", document.getElementById("lexerWidget"));
   
 // use mostly in desktop app
 layoutManager.registerComponent("nftGrid", document.getElementById("nft-grid"));
layoutManager.registerComponent("gridHeader", document.getElementById("grid-header"));

 
 
 
 
 
// register widget (as layout element)
if ( client === "desktopApp" ){ 
  layoutManager.registerComponent("queryBox", document.getElementById("wuli-query-widget"));
  //layoutManager.registerComponent("previewImg", document.getElementById("grid-container")); 
    layoutManager.registerComponent("previewImg", document.getElementById("previewImg")); 
  
 layoutManager.registerComponent("navig_container", document.getElementById("wuli-result-widget"));
layoutManager.registerComponent("workspaceControls", document.getElementById("workspaceControls"));
 

 layoutManager.registerComponent("final_traitList", document.getElementById("all-traits-container")); 
  
 layoutManager.registerComponent("horizSelector", document.getElementById("horizSelector"));
layoutManager.registerComponent("assetPickerGridContainer", document.getElementById("assetPickerGrid-container"));
layoutManager.registerComponent("tiersTabContainer", document.getElementById("tiersTab-container"));



  //"all-traits-container"
}
 

 setLayoutRules( {mode, client, layoutManager} );
 
 
const workspace = new WorkspaceController( { layoutManager:layoutManager });

workspace.start();

  return workspace;
//==========================================================================
}


function setLayoutRules(  {mode, client, layoutManager}  ){ 
     
   switch (client) {
    case "webApp":
        setLayoutRules_webApp({mode, client, layoutManager});
      break;
   
     case "desktopApp":
        setLayoutRules_desktopApp({mode, client, layoutManager});
      break;    
    
   }

   
}

function setLayoutRules_webApp(  {mode, client, layoutManager}  ){  

  switch ( mode ) {
     case "demo":
        layoutManager.registerLayout( "squareDesktop", { 
         
          traitPills: mainMiddle, 
          previewImg:mainMiddle ,
          final_traitList:mainMiddle ,
          queryBox:"top",
          navig_container:"grid"  // name it: leftpanel
         
     });
 
  layoutManager.registerLayout("desktop",
      {  traitPills: mainMiddle, 
         buttonSet2:"panel", 
         previewImg:mainMiddle ,

         final_traitList:"panel" ,
         queryBox:"top",


          navig_container:"grid",
     });

 layoutManager.registerLayout("largeDesktop", 
         { traitPills: "panel", 
           buttonSet2:"panel", 

            previewImg:mainMiddle ,
           final_traitList:"panel" ,
           queryBox:"top"
         });
  
 layoutManager.registerLayout("mobile",{ 
          traitPills:mainMiddle,
           previewImg:mainMiddle,
           buttonSet2:"panel",
            final_traitList:"panel" ,
             queryBox:"top"
  });
 
  //layoutManager.registerLayout("compactDesktop", { traitPills: mainMiddle  });
        break;

      case "guide":
      case "reference":  
      case "apiPipeline":  
        
         layoutManager.registerLayout("mobile", 
         { 
            //   traitPills:mainMiddle,
                guideTextBlock:  mainMiddle,//  mainMiddle,
                queryBox:        mainMiddle,
                previewImg:      mainMiddle,
                nodeGraph:       mainMiddle,
                lexerWidget:     mainMiddle,
                
                buttonSet2:"panel" ,
                navig_container:"panel",
                //siteNavigation:"panel" ,
                final_traitList:"panel" ,

               //  navigButton:     mainMiddle,
                
         });

        layoutManager.registerLayout( "squareDesktop", { 

           guideTextBlock:  mainMiddle, 
           queryBox:        mainMiddle ,
          
           nodeGraph:   mainMiddle,
           lexerWidget :mainMiddle,
           previewImg:      mainMiddle  ,
           //navigButton:     mainMiddle,
           final_traitList:"grid" ,// name it: leftpanel
           navig_container:"grid", // name it: leftpanel
       });
     

 
     layoutManager.registerLayout("desktop",
      {   
        
            guideTextBlock:  mainMiddle,//  mainMiddle,
            queryBox:        mainMiddle ,
             nodeGraph:   mainMiddle,
            lexerWidget :mainMiddle,
            previewImg:      mainMiddle , 
             
           // navigButton:     mainMiddle,
            //final_traitList:"panel" ,
             final_traitList:"grid" ,// name it: leftpanel
             navig_container:"grid" // name it: leftpanel
         
     });

     
 
        break;


    default:
        break;
   }
}


function setLayoutRules_desktopApp(  {mode, client, layoutManager}  ){  

  switch ( mode ) {
     case "demo":
      
 
  layoutManager.registerLayout("desktop",
      {  traitPills: mainMiddle, 
         buttonSet2:"panel", 

         gridHeader      :mainMiddle ,
         nftGrid         :mainMiddle ,
         horizSelector   :mainMiddle ,
  

         
         tiersTabContainer  :mainMiddle ,
         assetPickerGridContainer :mainMiddle ,
 


         previewImg  :mainMiddle ,

         final_traitList:"panel" ,
         queryBox:"top",


          navig_container:"grid",
          workspaceControls:"grid" ,
          //tiersTabContainer :"grid" ,
     });
  
        break;

      case "guide":
      case "reference":  
      case "apiPipeline":  
        
         layoutManager.registerLayout("mobile", 
         { 
            //   traitPills:mainMiddle,
                guideTextBlock:  mainMiddle,//  mainMiddle,
                queryBox:        mainMiddle,
                previewImg:      mainMiddle,
                nodeGraph:       mainMiddle,
                lexerWidget:     mainMiddle,
                
                buttonSet2:"panel" ,
                navig_container:"panel",
                //siteNavigation:"panel" ,
                final_traitList:"panel" ,

               //  navigButton:     mainMiddle,
                
         });

        layoutManager.registerLayout( "squareDesktop", { 

           guideTextBlock:  mainMiddle, 
           queryBox:        mainMiddle ,
          
           nodeGraph:   mainMiddle,
           lexerWidget :mainMiddle,
           previewImg:      mainMiddle  ,
           //navigButton:     mainMiddle,
           final_traitList:"grid" ,// name it: leftpanel
           navig_container:"grid", // name it: leftpanel
       });
     

 
     layoutManager.registerLayout("desktop",
      {   
        
            guideTextBlock:  mainMiddle,//  mainMiddle,
            queryBox:        mainMiddle ,
             nodeGraph:   mainMiddle,
            lexerWidget :mainMiddle,
            previewImg:      mainMiddle , 
             
           // navigButton:     mainMiddle,
            //final_traitList:"panel" ,
             final_traitList:"grid" ,// name it: leftpanel
             navig_container:"grid" // name it: leftpanel
         
     });

     
   
 
 // layoutManager.registerLayout("compactDesktop", { traitPills: mainMiddle  });
        break;


    default:
        break;
   }
}


