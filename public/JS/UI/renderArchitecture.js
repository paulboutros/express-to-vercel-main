
/*
const node = event.target.closest("[data-architecture-node]");

const implementation = node.nextElementSibling;

implementation.classList.toggle("isOpen");
*/

import ArchitectureNodeInstance from "../wuli-ui/ArchitectureNodeInstance.js";
import { draw_connector_forkStart, draw_connector_forkMiddle,  getForkNode, getForkNodeEnd, getForkNodeMiddle } from "../wuli-ui/connectorManager.js";
import {   clearConnectors, drawConnector, getRequiredHorizontalWidth, getRequiredHorizontalWidth_gen, layoutNodesHorizontal_gen, pt } from "../wuli-ui/pipelineFunction.js";
import { renderTree } from "./renderTree.js";
 
 
 let architectureLayout =null;
const forkNode = {

   // element: mainElement,
  //  branchStartElements: []

};

let MaxNodeStackHeight = 0;

const nodeHeight = 30;
let mainContainer;
let layoutOptions;
let container_branchLayout;
let container_guideComponent = document.getElementById("guideTextBlock");

let updateImplementationRect; // function callback


export function renderArchitecture(container, section ) {
       mainContainer = container;
       
      
       return `

        <div
            class="guideSection guideArchitecture"
            data-architecture-section
            data-architecture-index="${section.architectureIndex}"
         >

            ${section.title ? `
                <div class="guideArchitectureTitle">
                    ${section.title}
                </div>
            ` : ""}
 
            <div class="guideArchitectureFlow">


                <!-- Root -->

                <div class="guideArchitectureNode guideArchitectureRoot">
                    ${section.root}
                </div> 


                <!-- Main vertical flow -->
                ${mainVerticalFlow(section)}

                  <!-- Continuation after branches -->


                 ${renderArchitectureContinuation(section)}
                
                
                  

            </div>

        </div>

    `;
}

 
function renderArchitectureImplementation(data) {

    if (!data) return "";

    return `

        <div class="guideArchitectureImplementationInner">

            ${data.script
                ? `<div class="guideArchitectureImplementationScript">
                    ${data.script}
                   </div>`
                : ""
            }
             ${renderImplementationGroup(
                "Trigger",
                data.trigger,
                "trigger"
            )}
            
              
      
            ${renderImplementationGroup(
                "Functions",
                data.functions,
                "function"
            )}

              ${renderImplementationGroup(
                "Purpose" ,
                data.purpose,
                "purpose"
            )}
             
             ${renderImplementationGroup(
                "Functions Group: " + data.functionsGroupName,
                data.functionsGroup,
                "functionsGroup"
            )}

            ${renderImplementationGroup(
                "Accessors",
                data.accessors,
                "accessors"
            )}
             ${renderImplementationGroup(
                "Callbacks",
                data.callbacks,
                "callbacks"
            )} 
             ${renderImplementationGroup(
                "ArchitectureSketch",
                data.architectureSketchXXX,
                "guideArchitectureSketch_XXXX"
            )} 
            
            ${renderArchitectureSketch(data.architectureSketch)}
            
           ${renderImplementationGroup(
                "Note",
                data.note_SketchSecondary,
                "note_SketchSecondary"
           )}
       

           ${renderArchitectureSketch(data.architectureSketchSecondary)}
           
            

            ${renderImplementationGroup(
                "Objects",
                data.objects,
                "object"
            )}
             ${renderImplementationGroup(
                "Routes",
                data.routes,
                "routes"
            )}
               ${renderImplementationGroup(
                "Outcome",
                data.outcome,
                "outcome"
                )}

              ${renderImplementationGroup(
                "Note",
                data.note,
                "notes"
                )}

               ${data.tree
                ? renderTree(
                    data.tree.root,
                    data.tree.children,
                    data.tree.title
                )
                : ""
             }

        </div>

    `;
}
 
function renderImplementationGroup(title, items, type) {

    if (!items?.length) return "";

    if (!Array.isArray(items)) {
        items = [items];
    }

    return `

        <div class="guideArchitectureImplementationGroup">

            <div class="guideArchitectureImplementationGroupTitle">
                ${title}
            </div>

            <div class="guideArchitectureImplementationItems">

       ${items.map(item => `<div class="guideArchitectureImplementationItem
                   guideArchitectureImplementationItem-${type}"
                     > ${item} </div>
                  `).join("")}

            </div>

        </div>

    `;
}


function renderArchitectureSketch(lines) {

    if (!lines?.length) return "";

    if (!Array.isArray(lines)) {
        lines = [lines];
    }

    return `
         <div class="guideArchitectureSketch">

            ${lines.map(line => `<div class="guideArchitectureSketchLine"> ${line}</div>`).join("")}
 
        </div>
     `;
}
 

 function renderArchitectureContinuation(section) {
 
  

    if (!section.continuation?.length) {
        return "";
    }

     console. log(" section.continuation  "  ,section.continuation );

    return `

        <div class="guideArchitectureContinuation">

            ${section.continuation.map(item => `

                <div class="guideArchitectureConnector">

                    <div class="guideArchitectureLine"></div>

                    <div class="guideArchitectureArrow">
                        ▼
                    </div>

                </div>

                <div class="guideArchitectureNode">
                    ${item}
                </div>

            `).join("")}

        </div>

    `;
}
 
function renderArchitectureBranchMerge(node) {

    if (!node.branchesReturn || !node.branches?.length) {
        return "";
    }

    return `

        <div
            class="guideArchitectureMerge"
            style="--branch-count: ${node.branches.length};"
        >

            <div class="guideArchitectureMergeLines">

                ${node.branches.map(() => `
                    <div class="guideArchitectureMergeLine"></div>
                `).join("")}

            </div>

            <div class="guideArchitectureMergeHorizontal"></div>

            <div class="guideArchitectureMergeArrow">
                ▼
            </div>

        </div>

    `;
}

function mainVerticalFlow(section) {

    //So .map() collects those individual returns. <div class="guide....
    return section.flow?.map(item => {

        const node = typeof item === "string"
            ? {
                label: item,
                canOpen: false
            }
            : item;

        return `

            <div class="guideArchitectureConnector">

                <div class="guideArchitectureLine"></div>

                <div class="guideArchitectureArrow">
                    ▼
                </div>

            </div>
             
                ${renderArchitectureNode(node)}
               
 
        `;

    }).join("") || "";
}

 

function renderArchitectureNode(node, options = {}) {

    const nodeId =
        options.mainNodeIndex !== undefined &&
        options.branchIndex !== undefined &&
        options.flowIndex !== undefined
            ? `${options.mainNodeIndex}-${options.branchIndex}-${options.flowIndex}`
            : "";

       node.id = nodeId;  

    if ( options.branchFlow   ){  
        /*
           console.log( "   branchFlow   >>>    node.id    = "  ,{ 
             
                nodeId :  node.id, 
                 mainNodeIndex :    options.mainNodeIndex ,
                 branchIndex : options.branchIndex,
                 flowIndex  : options. flowIndex

           } );*/


    } 



  
    return `
         <div class="guideArchitectureNode ${node.branchStart ? "branchStartHidden" : "guideArchitectureNode"} ${node.canOpen ? "isOpenable" : ""}"
            ${node.canOpen ? "data-architecture-node" : ""}
            ${options.branchIndex !== undefined
                ? `data-architecture-branch-index="${options.branchIndex}"`: ""}
                
            ${options.mainNodeIndex !== undefined
                ? `data-architecture-main-node-index="${options.mainNodeIndex}"`
                : ""}
            ${options.flowIndex !== undefined ? `data-architecture-flow-index="${options.flowIndex}"`: ""}
                 
            ${nodeId ? `data-architecture-node-id="${nodeId}"`: ""}
                
                
            ${options.flowIndex     !== undefined && options.flowIndex === 0 ? "data-fork-branch-head" : ""}
            ${node.branches?.length !== undefined  ? "data-fork-initiator" : ""}

            ${options.isEndOfFlow   !== undefined && options.isEndOfFlow ? "data-end-of-flow" : ""}
            ${node.branchMerge      !== undefined  ? "data-fork-merge" : ""}

       
    
            >
            ${node.label}
        </div>

        ${node.canOpen && !options.skipImplementation ? `
            <div class="guideArchitectureImplementation ${options.branchFlow ? "guideArchitectureBranchFlowImplementation" : ""}"
                data-architecture-implementation
                ${nodeId ? `data-architecture-node-id="${nodeId}"`: ""}
            >
                ${renderArchitectureImplementation(
                    node.implementation
                )}
            </div>
        ` : ""}

        ${renderArchitectureNodeBranches(node)}
    `;
}

 



 function renderArchitectureNodeBranches(node) {

    if (!node.branches?.length) return "";

    return `
        <div class="guideArchitectureBranchLayout">

            ${node.branches.map((branch, index) => `

                ${renderArchitectureNode(branch, {
                    skipImplementation: true,
                    mainNodeIndex: node.mainNodeIndex,
                    branchIndex: index
                })}

                ${renderArchitectureBranchFlow(
                    branch,
                    index,
                    node.mainNodeIndex
                )}

            `).join("")}

        </div>
    `;
}

 
export function setupArchitectureInteractions(container, guide ,  do_layoutArchitectureBranchFlows  ) {

    const nodes = container.querySelectorAll("[data-architecture-node]");
       
    nodes.forEach(node => {

        node.addEventListener("click", () => {

            // =========================================================
            // Branch flow node
            // =========================================================

            const flowIndex = node.dataset.architectureFlowIndex;

            if (flowIndex !== undefined) {

                const implementation = node.nextElementSibling;
                   

                if (!implementation?.matches(
                    "[data-architecture-implementation]"
                )) {
                    return;
                }

                // -----------------------------------------------------
                // Find architecture data
                // -----------------------------------------------------

                const branchIndex = node.dataset.architectureBranchIndex;
                const mainNodeIndex = node.dataset.architectureMainNodeIndex;

                const architecture =node.closest("[data-architecture-section]");
 
                const architectureIndex =architecture?.dataset.architectureIndex;
 
                const architectureSection =
                    guide.sections.find(
                        section =>
                            section.type === "architecture" &&
                            section.architectureIndex === Number(architectureIndex)
                   );

                 const mainNode = architectureSection?.flow?.[Number(mainNodeIndex)];
                 const branch =  mainNode?.branches?.[Number(branchIndex)];
                 const flowNode =branch?.flow?.[Number(flowIndex)];
                  
                if (!flowNode) {
                    console.log(
                        "STOP: missing architecture flow node",
                        {
                            architectureIndex, mainNodeIndex, branchIndex,flowIndex
                         
                        }
                    );

                    return;
                }

                // -----------------------------------------------------
                // Toggle implementation
                // -----------------------------------------------------

                const isOpen = implementation.classList.toggle("isOpen");
               const branches = mainNode.branches;

                 const clickInfo ={ 
                        branchIndex ,
                        mainNode,
                        branches 
                    }
               showBranchInclusive( Number(branchIndex), clickInfo );
               
                   flowNode.implementation = flowNode.implementation || {};
                    
                    updateImplementationRect = () => {
   
                        flowNode.implementation.height =
                            isOpen
                                ? implementation.getBoundingClientRect().height
                                : 0;
                      }; 

                  
                   
 
                 
                   
                // -----------------------------------------------------
                // Node visual state
                // -----------------------------------------------------

                node.classList.toggle("isOpen",isOpen);

                timeout_refreshArchitectureLayout(
                     branches,
                     do_layoutArchitectureBranchFlows,
                     null,//  updateImplementationRect ,
                   
                       clickInfo,

                       100
                    );
                     
                
                 return;
            }


            // =========================================================
            // Branch node
            // =========================================================

            const branchIndex = node.dataset.architectureBranchIndex;
            const mainNodeIndex = node.dataset.architectureMainNodeIndex;

            const nodeRect =
                node.getBoundingClientRect();

            if (branchIndex !== undefined) {

                const architecture = node.closest("[data-architecture-section]");
                 const architectureRect = architecture?.getBoundingClientRect();
                 const architectureIndex =  architecture?.dataset.architectureIndex;
 
                const architectureSection =
                    guide.sections.find(
                        section =>
                            section.type === "architecture" &&
                            section.architectureIndex ===
                                Number(architectureIndex)
                    );

                const mainNode =
                    architectureSection.flow[
                        Number(mainNodeIndex)
                    ];

                const branch =
                    mainNode?.branches[
                        Number(branchIndex)
                    ];

                const implementation =
                    architecture?.querySelector(
                        "[data-architecture-branch-implementation]"
                    );

                if (!branch || !implementation) {
                    console.log(
                        "STOP: missing branch or implementation DOM"
                    );

                    return;
                }

                // =====================================================
                // Closing mechanism for implementation box
                // =====================================================

                const isOpen =implementation.classList.contains("isOpen");
                    

                const currentBranchIndex =
                    implementation.dataset.activeBranchIndex;

                if (
                    isOpen &&
                    currentBranchIndex === branchIndex
                ) {

                    implementation.classList.remove("isOpen");
                    implementation.removeAttribute(
                        "data-active-branch-index"
                    );

                    node.classList.remove("isOpen");

                    return;
                }

                // =====================================================
                // Open implementation
                // =====================================================

                const rendered =
                    renderArchitectureImplementation(
                        branch.implementation
                    );

                implementation.innerHTML = rendered;
                implementation.dataset.activeBranchIndex =
                    branchIndex;

                implementation.classList.add("isOpen");

                return;
            }


            // =========================================================
            // Normal node
            // =========================================================

            const implementation = node.nextElementSibling;
               

            if (!implementation?.matches(
                "[data-architecture-implementation]"
            )) {
                return;
            }

            const isOpen =
                implementation.classList.toggle("isOpen");

            node.classList.toggle("isOpen",isOpen  );
                
                
          




                

        });

    });

}

 

function renderArchitectureBranchFlow( 
       branch,
    branchIndex,
    mainNodeIndex

) {

    if (!branch.flow?.length) {
        return "";
    }
    

    return `

        <div class="guideArchitectureBranchFlow">

            ${branch.flow.map((item, flowIndex) => {

                const node = typeof item === "string"
                    ? {
                        label: item,
                        canOpen: false
                    }
                    : item;

               const isEndOfFlow =  flowIndex === branch.flow.length-1;


                return `
                    

                   ${renderArchitectureNode(node, {
                    
                        branchFlow: true,
                        mainNodeIndex,
                        branchIndex,
                        flowIndex,
                        isEndOfFlow
                    
                    
                    })}
    


                `;

            }).join("")}

        </div>

    `;
}

 

/*
purpose
    = responsibility

trigger
    = what starts this step

functions
    = important functions involved

callbacks
    = callback relationships

objects
    = important state/data objects

routes
    = conditional hand-offs

outcome
    = what this step produces / hands to the next step

note
    = implementation detail worth remembering

trigger	What causes this process to start
purpose	Why this process exists
functions	Important functions performing the process
objects	Important data/state involved
accessors	Data obtained through getters/setters
callbacks	Control handed to another function/component in response to an event
routes	Conditional routing between possible functions/paths
outcome	What this process produces or leaves available to the next step
note	Implementation fact worth remembering
*/




  export function layoutArchitectureBranchFlows(  container  ,  branches, mainNode ){
    
    
   if (!container ){ container = container_guideComponent;}
    
    setLayoutOptions();
    
    console.log("layoutArchitectureBranchFlows", { layoutOptions,container  });
 
     const nodeColumns = getArchitectureNodeColumns(branches);
     
    // ------------------------------------------
    // Existing horizontal width engine
    // ------------------------------------------

    const { requiredWidth, columnWidths } =
   getRequiredHorizontalWidth_gen( nodeColumns, layoutOptions);
     
   //  getRequiredHorizontalWidth  ( nodeColumns, layoutOptions);  
    // ------------------------------------------
    // Horizontal layout state
    // ------------------------------------------

      architectureLayout = {
        ...layoutOptions,  columnWidths,requiredWidth};
      

    // ------------------------------------------
    // Position branch-flow nodes
    // ------------------------------------------
    //call_layoutNodesHorizontal_gen( nodeColumns );
     

     if (mainNode.branches?.length){ 
        
         refreshArchitectureLayout(mainNode.branches);
     }
         
      call_layoutNodesHorizontal_gen( nodeColumns );

 


     clearConnectors(container_branchLayout);

     const architectureContainer = document.querySelector("[data-architecture-index]");
     const forkNode = getForkNode(architectureContainer);
     const forkEnd  = getForkNodeEnd(architectureContainer);
     const forkmiddle  = getForkNodeMiddle(architectureContainer);


     draw_connector_forkStart(forkNode);

     draw_connector_forkMiddle(forkmiddle);

     draw_connector_forkStart(forkEnd);
     
  
    return {
        requiredWidth,
        columnWidths,
        nodeColumns
    };
}

function call_layoutNodesHorizontal_gen(nodeColumns){ 
   for ( let columnIndex = 0; columnIndex < nodeColumns.length;columnIndex++ ) {
         const column =nodeColumns[columnIndex];
 
        for ( let flowIndex = 0; flowIndex < column.length;  flowIndex++ ) {
        
        layoutNodesHorizontal_gen(
                nodeColumns,
                columnIndex,
                flowIndex,
                architectureLayout
            );
 
        }

 

    }

}
 
function setLayoutOptions(){ 
  
     
    const nodeContainer = document.querySelector(".guideArchitectureBranchLayout");
 
     container_branchLayout = nodeContainer;
    layoutOptions = {
        depthSpacing:40,
        container_branchLayout:  nodeContainer,
        container:nodeContainer,

        assistant_scroll_width:nodeContainer.getBoundingClientRect().width
              
    };
  
}
   
  
function showBranchInclusive(visibleIndex, clickInfo) {

    const { branches } = clickInfo;

    const nodeColumns =
        getArchitectureNodeColumns(branches);

    // --------------------------------------------
    // Show only the selected branch
    // --------------------------------------------

    for (let columnIndex = 0; columnIndex < nodeColumns.length; columnIndex++) {

        const column = nodeColumns[columnIndex];

        for (let flowIndex = 0; flowIndex < column.length; flowIndex++) {

            const node = column[flowIndex];

            if (flowIndex !== 0) {
                node.element.classList.toggle(
                    "nodeHidden",
                    columnIndex !== visibleIndex
                );
            }

            node.implementationElement.classList.toggle(
                "nodeHidden",
                columnIndex !== visibleIndex
            );
        }
    }

    // --------------------------------------------
    // Check open state after DOM update
    // --------------------------------------------

     requestAnimationFrame(() => {

         let nodeStillopen=[];
        let atLeastOneIsOpen = false;

        const currentColumn =
            nodeColumns[visibleIndex];

        for (const node of currentColumn || []) {

            if (node.element.classList.contains("isOpen")) {
                atLeastOneIsOpen = true;
                break;
            }
        }

        console.log(
            "atLeastOneIsOpen =",
            atLeastOneIsOpen
        );

        if (!atLeastOneIsOpen) {
             for (const column of nodeColumns) {
                 for (const node of column) {

                     
                      node.element.classList.remove("nodeHidden");

                  const isStillOpen =  node.element.classList.contains("isOpen");

                   console.log( " isStillOpen " ,  node.source.id );
                   if ( isStillOpen  ) {
                           nodeStillopen.push(node);
 
                    }
                    node.element.classList.remove("isOpen");
          
                    node.implementationElement.classList.remove("isOpen");
                }
            }

                 console.log( " nodeStillopen" ,   nodeStillopen   );
                nodeStillopen.forEach( nodeOpen => { 

                console.log( "node still open " ,  nodeOpen.source.id );
                      //   object modify
                   // nodeOpen.implementation.height = 0;
                      nodeOpen.source.implementation =
                        nodeOpen.source.implementation || {};
                        nodeOpen.source.implementation.height = 0;


                       // DOM mutation + layout mutation
                       // nodeOpen.implementationElement.getBoundingClientRect().height
 
             }); 


                   /*
                  updateImplementationRect = () => {
                      nodeStillopen.forEach( nodeOpen => { 
                       // nodeOpen.implementation.height = 0;
                       // nodeOpen.implementationElement.getBoundingClientRect().height
 
                     }); 
                 };
                */


        }
    });
}


function getRequiredArchitectureBranchHeight(container) {

    let requiredHeight = 0;

    container
        //.querySelectorAll(".guideArchitectureImplementation")
        .querySelectorAll(".guideArchitectureBranchFlowImplementation")
         .forEach(implementation => {
            // closed implementation have dimensio width, heigh 0,0,0....
            const rect =   implementation.getBoundingClientRect();
             

            requiredHeight += ( rect.height + layoutOptions.depthSpacing + ( layoutOptions.depthSpacing *0.25 ) );
        });

     if ( requiredHeight >  MaxNodeStackHeight ) {  

            requiredHeight -= MaxNodeStackHeight;
     }


    return requiredHeight;
}

export function updateLayoutContainerHeight(container, requiredHeight ) {

     container.style.height = `${requiredHeight}px`;
      
}


export function getArchitectureNodeColumns(branches) {


      const container =  container_branchLayout;

     const nodeColumns = branches.map(branch =>(branch.flow || []).map(node => {
      
            const element = 
                container.querySelector(`[data-architecture-node][data-architecture-node-id="${node.id}"]`); 
         
            const instance = new ArchitectureNodeInstance(element);

                                    
            const implementationElement =//  element.nextElementSibling
             container.querySelector(`[data-architecture-implementation][data-architecture-node-id="${node.id}"]`);
           //  container.querySelector(`[guideArchitectureBranchFlowImplementation][data-architecture-node-id="${node.id}"]`); 
   


             const implementationInstance = new ArchitectureNodeInstance(implementationElement);
 
            const rect = element.getBoundingClientRect();
            
              const  minWidth =  getComputedStyle(element).minWidth;
              const  minHeight =  getComputedStyle(element).minHeight;

            if (!node.implementation) {  node.implementation = {}; }
             if (node.implementation.height === undefined) {node.implementation.height = 0;}
        
    
 



            const nodeDOM = {
               
                source: node,
               
                element, 
                instance ,

                implementationElement,
                implementationInstance,

                width: 120,// rect.width,
                height: 30,//  rect.height,
 
                implementation: node.implementation,
                /*
                 implementation: {
                    height: 0,
                  ...(node.implementation || {})
                  // ,height: 0 // default value
                   },*/


                x: 0,
                y: 0
            };
            

            return nodeDOM;
        })
    ); 

     return nodeColumns;

    /*
    return branches.map(branch =>
        (branch.flow || []).map(node => {

            const element =
                document.querySelector(
                    `[data-architecture-node-id="${node.id}"]`
                );
 

            return {
                ...node,
                element,
                    
                width: element?.getBoundingClientRect().width || 200,
                height: element?.getBoundingClientRect().height ||  nodeHeight   ,
                x: 0,
                y: 0,
                instance: node.instance
            };
        })
    );
*/

}


let architectureLayoutRefreshTimeout = null;

function timeout_refreshArchitectureLayout(branches, 
       do_layoutArchitectureBranchFlows,
       unused_argument, //  updateImplementationRect,

       clickInfo,

       timeVal

  //    , updateImplementationPosition
    ) {
//  layoutArchitectureBranchFlows(container, branches, mainNode
    clearTimeout(architectureLayoutRefreshTimeout);

    architectureLayoutRefreshTimeout = setTimeout(() => {
 
        updateImplementationRect();

        refreshArchitectureLayout(branches);// move node Y position based  on  updated implementation rect
  
        do_layoutArchitectureBranchFlows();  //   redraw layout


       //  showBranchInclusive( Number(clickInfo.branchIndex),  clickInfo  );
    //    updateImplementationPosition(); // position implementation to  new layout(node Y moved)

    }, timeVal);
}

 


function refreshArchitectureLayout(branches){ 
           MaxNodeStackHeight = getMaxNodeStackHeight(branches);
        const implementationHeigh =  getRequiredArchitectureBranchHeight( container_branchLayout );
        const requiredHeight  =  MaxNodeStackHeight + implementationHeigh;
        updateLayoutContainerHeight( container_branchLayout, requiredHeight );

        

}





function getMaxNodeStackHeight(branches) {

     
    let maxNodeStackHeight = 0;

    for (const branch of branches || []) {

        const flow = branch.flow || [];

        const nodeStackHeight =
            flow.length * nodeHeight; //  you can replace by node.heigh

        maxNodeStackHeight =
            Math.max(
                maxNodeStackHeight,
                nodeStackHeight
            );
    }

    return maxNodeStackHeight + nodeHeight ; //(add and extra space)
}




export function draw_connector_flow(branches){ 
    if (!branches ) return;

     const nodeColumns = getArchitectureNodeColumns(branches);
for (let columnIndex = 0; columnIndex < nodeColumns.length; columnIndex++) {

    const column = nodeColumns[columnIndex];

    for (let flowIndex = 1; flowIndex < column.length; flowIndex++) {

        const previousNode = column[flowIndex - 1];
        const node = column[flowIndex];

        const from = pt(
            previousNode.x + previousNode.width / 2,
            previousNode.y + previousNode.height
        );

        const to = pt(
            node.x + node.width / 2,
            node.y
        );

        drawConnector(
            container_branchLayout,
            [from, to]
        );
    }
}

}


function getNodeElementById(node_id){
     return document.querySelector(`[data-architecture-node-id="${node_id}"]`);
              
}
 
  
 
function setPosition(element, obj) {
         
           element.style.position =  obj.position ;

        if (obj.left !== undefined) {
           element.style.left = obj.left;
               
        }

        if (obj.top !== undefined) {
          element.style.top = obj.top;
                
        }

        if (obj.right !== undefined) {
            element.style.right = obj.right;
               
        }
    }



   

     


    function positionBranchImplementation(  implementation , top    ){ 
   
                 const impRect = implementation.getBoundingClientRect();
                    console.log(" nide    "  , top  );
                           const newTop = top + nodeHeight ; 
  
                         
                         const obj = {
                            position:  "absolute"    ,
                            left:       "0px",
                            top:        newTop  + "px",
                            right:    "auto"

                        };
                        setPosition(implementation, obj );

    }