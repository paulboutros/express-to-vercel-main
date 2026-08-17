
       
       import viewManager         from "./UI/ViewManager.js"; 
       import LayoutManager       from "./UI/LayoutManager.js";
       import WorkspaceController from "./UI/WorkspaceController.js";

  export default function startLayoutEngine({mode="demo"}){


    const mainMiddle ="mainMiddle";// was "sheet"
     
//============================ layout manager and workspace controller ======================================
const layoutManager = new LayoutManager();

layoutManager.registerSlot( mainMiddle,document.getElementById("mainLayoutA"));//was sheettraitslot
layoutManager.registerSlot( "panel", document.getElementById("mainLayoutC"));
layoutManager.registerSlot( "top", document.getElementById("topTraitSlot"));
layoutManager.registerSlot( "grid", document.getElementById("mainSlotB"));
 
 

layoutManager.registerComponent("traitPills",      document.getElementById("trait-pill-container"));
layoutManager.registerComponent("previewImg", document.getElementById("previewImg"));  
layoutManager.registerComponent("final_traitList", document.getElementById("final_traitList")); 
layoutManager.registerComponent("siteNavigation", document.getElementById("siteNavigation")); 

layoutManager.registerComponent("buttonSet2", document.getElementById("buttonSet2")); 
layoutManager.registerComponent("queryBox", document.getElementById("queryBox")); 
layoutManager.registerComponent("mainSlotB", document.getElementById("mainSlotB"));
layoutManager.registerComponent("guideTextBlock", document.getElementById("guideTextBlock")); 
layoutManager.registerComponent("navigButton", document.getElementById("navigButton"));
 
 layoutManager.registerComponent("nodeGraph", document.getElementById("nodeGraph"));
 layoutManager.registerComponent("lexerWidget", document.getElementById("lexerWidget"));
   
 
// register layout

switch ( mode ) {
     case "demo":
        layoutManager.registerLayout( "squareDesktop", { 
         
          traitPills: mainMiddle, 
          previewImg:mainMiddle ,
          final_traitList:mainMiddle ,
           queryBox:"top"
         
     });
 
  layoutManager.registerLayout("desktop",
      {  traitPills: mainMiddle, 
         buttonSet2:"panel", 
         previewImg:mainMiddle ,

         final_traitList:"panel" ,
         queryBox:"top"
     });

 layoutManager.registerLayout("largeDesktop", 
         { traitPills: "panel", 
           buttonSet2:"panel", 

            previewImg:mainMiddle ,
           final_traitList:"panel" ,
           queryBox:"top"
         });
  
 layoutManager.registerLayout("mobile",{ 
          traitPills:mainMiddle, previewImg:mainMiddle,buttonSet2:"panel", final_traitList:"panel" , queryBox:"top"
  });
 
  layoutManager.registerLayout("compactDesktop", { traitPills: mainMiddle  });
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
           final_traitList:"grid" ,
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
             final_traitList:"grid" ,
         
     });

     /*
     layoutManager.registerLayout("largeDesktop", 
         {
            
           guideTextBlock:  mainMiddle,//  mainMiddle,
           queryBox:        mainMiddle ,
             nodeGraph:   mainMiddle,
            lexerWidget :mainMiddle,

           previewImg:      mainMiddle ,
          
     });
  */
   
 
 // layoutManager.registerLayout("compactDesktop", { traitPills: mainMiddle  });
        break;


    default:
        break;
}

  


const workspace = new WorkspaceController( { layoutManager:layoutManager });

workspace.start();

  return workspace;
//==========================================================================
}

