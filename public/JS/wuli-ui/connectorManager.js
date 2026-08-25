import { drawConnector, pt } from "./pipelineFunction.js";
 

const nodeHeight = 30;
let container_branchLayout =  document.querySelector(".guideArchitectureBranchLayout");
let container_guideComponent = document.getElementById("guideTextBlock");
 

export function draw_connector_forkMiddle (forkNode) {


          forkNode.segmentList.forEach( segEl => { 

                  drawConnector(
                    container_branchLayout,
                    [ segEl.start, segEl.end]
                    
                );

          })


}

export function draw_connector_forkStart(forkNode) {

    // const container = container_branchLayout;

    const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();
     

    const fromRect = forkNode.element?.getBoundingClientRect();
       
   let from;


   if (fromRect){
      from = pt(
        fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
         fromRect.bottom - container_branchLayout_Rect.top
       );
    }


    // use point if exist
    if (  forkNode.element_pt ){ 
          from = forkNode.element_pt;
        
    }


    let toPoints =[];
    for (const branchHead of forkNode.branchHeadElements) {

        const rect =  branchHead.getBoundingClientRect();
         const to = pt( rect.left +rect.width / 2 -container_branchLayout_Rect.left,
                         rect.top -container_branchLayout_Rect.top
         );
         toPoints.push(to);

      }


        if ( forkNode.branchHeadElements_pts ) {
             toPoints = forkNode.branchHeadElements_pts;
           //  for (const to of  forkNode.branchHeadElements_pts ) {

            // }
 
        } 


      for (const to of toPoints  ) {
          const midY = from.y + (to.y - from.y) / 2;
         
        drawConnector(
            container_branchLayout,
            [from,
             pt(from.x, midY),
             pt(to.x, midY),   
             to]
        );

      }
        
    

    //branchHeadElements_pts





}


export function getForkNodeMiddle(containerArg) {



   container_branchLayout =  document.querySelector(".guideArchitectureBranchLayout");

  const container = container_branchLayout;

   const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();

    let forkElement_pt;
  let startPoint;
    let fromRect;
    let endconnectorPoints =[];

    let segmentList =[];

    /*
    const forkElement = containerArg.querySelector("[data-fork-merge]");  
    
    fromRect = forkElement.getBoundingClientRect();
                  
          forkElement_pt= pt(  fromRect.left +
                              fromRect.width / 2 -
                              container_branchLayout_Rect.left,

                              fromRect.bottom -
                              container_branchLayout_Rect.top -  nodeHeight 
                         );
          
                         console.log(  "forkElement_pt", forkElement_pt 


                         )
       */
//===============================================
     
//====================================



            // endconnectorPoints.push( pt );

  
   //======================================================================
       const endOfFlowList = containerArg.querySelectorAll("[data-architecture-branch-index]");
       const branchHeadElements = [...endOfFlowList]
           .filter(el => !el.classList.contains("branchStartHidden"));

             console.log( "middle: base list  ", { 
                    endOfFlowList, 
                    branchHeadElements
                 }) ;

          //  let idx =  -1;
           for (const elmacth of branchHeadElements  ){
               
             const flowIndex = Number(elmacth.dataset.architectureFlowIndex);
              if (flowIndex === 0 )continue; 

             //  idx++;
              
                  fromRect = elmacth.getBoundingClientRect();
                  
                 let start =  pt(  fromRect.left +
                                   fromRect.width / 2 -
                                   container_branchLayout_Rect.left,

                                    fromRect.bottom -
                                    container_branchLayout_Rect.top - nodeHeight 
                 );

                   let end = pt(start.x , start.y - 40 );
 
                 

                  let seg = { start, end };
                   
                  segmentList.push(seg);
                 
                
              }
 


          console.log( " segmentList ",   segmentList    ) ;
  

   // if (!forkElement || !branchHeadElements.length) {
   //     return null;
   // }

    return {
       // element: forkElement,
        branchHeadElements,

       // element_pt: forkElement_pt,
      //  branchHeadElements_pts: endconnectorPoints,

        segmentList

    };
}

export function getForkNodeEnd(containerArg) {



   container_branchLayout =  document.querySelector(".guideArchitectureBranchLayout");

  const container = container_branchLayout;

   const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();

    let forkElement_pt;
  let startPoint;
    let fromRect;
    let endconnectorPoints =[];

    const forkElement = containerArg.querySelector("[data-fork-merge]");  
    fromRect = forkElement.getBoundingClientRect();
                  
          forkElement_pt= pt(  fromRect.left +
                              fromRect.width / 2 -
                              container_branchLayout_Rect.left,

                              fromRect.bottom -
                              container_branchLayout_Rect.top -  nodeHeight 
                         );
          
                         console.log(  "forkElement_pt", forkElement_pt 


                         )

//===============================================
    
 /*
    const containerRect = container_branchLayout.getBoundingClientRect();
       

    const fromRect =
        forkNode.element.getBoundingClientRect();

    let from = pt(
        fromRect.left +
            fromRect.width / 2 -
            containerRect.left,

        fromRect.bottom -
            containerRect.top
    );
    */

//====================================



            // endconnectorPoints.push( pt );


   //======================================================================
       const endOfFlowList = containerArg.querySelectorAll("[data-end-of-flow]");
       const branchHeadElements = [...endOfFlowList]
           .filter(el => !el.classList.contains("nodeHidden"));

           for (const elmacth of branchHeadElements  ){
               
                  fromRect = elmacth.getBoundingClientRect();
                  
                 let ptc =  pt(  fromRect.left +
                                 fromRect.width / 2 -
                                 container_branchLayout_Rect.left,
                                 fromRect.bottom -
                                 container_branchLayout_Rect.top
                 );

              const nodeId = elmacth.dataset.architectureNodeId;
              const elmacthImpl = containerArg.querySelector(`.isOpen[data-architecture-implementation][data-architecture-node-id="${nodeId}"]`);
               if (elmacthImpl){  

                    const fromImpRect = elmacthImpl.getBoundingClientRect();
                   // ptc = rectToPoint(fromRect, container_branchLayout_Rect  )
                   /*
                      ptc = pt( fromRect.left + fromRect.width / 2 -container_branchLayout_Rect.left
                             , fromRect.bottom -container_branchLayout_Rect.top);
                   */   
                    ptc = pt(   fromRect.left + fromRect.width / 2 -container_branchLayout_Rect.left
                              , fromImpRect.bottom -container_branchLayout_Rect.top ); 
  
               }

                  endconnectorPoints.push( ptc );
                 
              }

          //===========================================
          // endconnectorPoints =[];
          endOfFlowList.forEach(el => { 
             const nodeId = el.dataset.architectureNodeId;
 
            const elmacth = containerArg.querySelector(`.isOpen[data-architecture-implementation][data-architecture-node-id="${nodeId}"]`);
    
                  
              if ( elmacth){ 
                    fromRect = elmacth.getBoundingClientRect();
                  
                   //const ptc = rectToPoint(fromRect,container_branchLayout_Rect  )
                   
                   /*
                   const ptc =   pt(  fromRect.left +fromRect.width / 2 -container_branchLayout_Rect.left
                            
                            , fromRect.bottom -container_branchLayout_Rect.top
                           
                            
                         );
                    
                     endconnectorPoints.push( ptc );
                  */

              }
             
           })
          





          console.log( " endconnectorPoints ", endconnectorPoints  ) ;
  

    if (!forkElement || !branchHeadElements.length) {
        return null;
    }

    return {
        element: forkElement,
        branchHeadElements,

        element_pt: forkElement_pt,
        branchHeadElements_pts: endconnectorPoints
    };
}

export function rectToPoint(rect, containerRect, side = "bottom") {

    const x =
        rect.left +
        rect.width / 2 -
        containerRect.left;

    const y =
        side === "top"
            ? rect.top - containerRect.top
            : rect.bottom - containerRect.top;

    return pt(x, y);
}


export function getForkNode(container) {

    const forkElement = container.querySelector("[data-fork-initiator]");
    const branchHeadElements = [...container.querySelectorAll("[data-fork-branch-head]")];
 
    if (!forkElement || !branchHeadElements.length) {return null;
        
    }

    return {
        element: forkElement,
        branchHeadElements
    };
}
