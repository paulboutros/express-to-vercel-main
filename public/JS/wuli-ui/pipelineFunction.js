  const architectNodeHeight =30;
  let ini_anchorTop =null;
  
  export function clearConnectors(parent) {
    const svg = parent.querySelector(".pipelineConnectors");

    if (svg) {
        svg.replaceChildren();
    }
}
  
  export function drawConnector(parent, points) {

    const SVG_NS = "http://www.w3.org/2000/svg";

    let svg = parent.querySelector(".pipelineConnectors");
    

    if (!svg) {

        svg = document.createElementNS(
            SVG_NS,
            "svg"
        );

        svg.classList.add("pipelineConnectors");

        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        parent.appendChild(svg);
    }

    for (let i = 0; i < points.length - 1; i++) {

        const a = points[i];
        const b = points[i + 1];

        const path = document.createElementNS(
            SVG_NS,
            "path"
        );

        path.setAttribute(
            "d",
            `M ${a.x} ${a.y} L ${b.x} ${b.y}`
        );
        /*
      console.log("CONNECTOR POINTS", {
    a,
    b,
    aX: a.x,
    aY: a.y,
    bX: b.x,
    bY: b.y
});*/



        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#5fa8ff");
        path.setAttribute("stroke-width", "2");

        svg.appendChild(path);
    }

    return svg;
}
 

 

export function pt(x,y){

    return {x,y};

}

 
export function layoutNodes(nodeColumns, tokenIndex, depth, layoutOptions  ){ 

    if ( layoutOptions.mode === "vertical"){ 
         layoutNodesVertical(nodeColumns, tokenIndex, depth, layoutOptions);
    }else{ 
         layoutNodesHorizontal(nodeColumns, tokenIndex, depth, layoutOptions)
    }
 
}

export function layoutNodesHorizontal_gen(
    nodeColumns,
    columnIndex,
    flowIndex,
    layoutOptions
) {

    const {
        depthSpacing,
        columnWidths
    } = layoutOptions;

    const xgap = 5;

    const node =
        nodeColumns[columnIndex]?.[flowIndex];

    if (!node) return;


    // --------------------------------------------------
    // Horizontal position
    // --------------------------------------------------

    let columnOffset = 0;

    for (let i = 0; i < columnIndex; i++) {

        columnOffset +=
            columnWidths[i] + xgap;
    }

    const columnWidth =
        columnWidths[columnIndex];


    node.x = columnOffset + (columnWidth - node.width) / 2;
       
       


    // --------------------------------------------------
    // Vertical position
    // --------------------------------------------------

   // let depthSpacing = 40;

    if (flowIndex === 0) {

        const anchorRect =
            node.element.getBoundingClientRect();

        const containerRect =
            layoutOptions.container
                .getBoundingClientRect();

         if(ini_anchorTop === null ){ 
               ini_anchorTop =  anchorRect.bottom - containerRect.top;
           
           
         }

        // console.log( " containerRect   == "   ,containerRect  );

    // the node graph contain use its own height open/closed
    // to set this valriable, not its parent container, doing so
    // will create problems.. as parent height may increase and never decrease
    // creating a never ending height increase....
        const anchorTop = ini_anchorTop;
           // anchorRect.bottom -
           // containerRect.top;

           

        node.y =
            anchorTop +
            depthSpacing;

    } else {

       // depthSpacing = 30 ;

        const previousNode =
            nodeColumns[columnIndex]?.[
                flowIndex - 1
            ];

        if (!previousNode) return;

       console.log( "gen implementation height " , 
          { 
           node_Id: previousNode.source.id,
           node_impHeight: previousNode.implementation.height

          } );
     
        node.y =
            previousNode.y +
            previousNode.height + 
            previousNode.implementation.height +
            depthSpacing;
    }

     /*
      const position ={

        position: "absolute",
         left: `${node.x}px`,
         top: `${node.y}px`,
         right: "auto"

    }
    
        node.element.style.position = "absolute";

        
            node.element.style.left =
                position.left;
       

        if (position.top !== undefined) {
           node.element.style.top =
                position.top;
        }

        if (position.right !== undefined) {
            node.element.style.right =
                position.right;
        }
    
    
    

*/
    // --------------------------------------------------
    // Apply position
    // --------------------------------------------------

     

     node.implementationInstance.setPosition({

        position: "absolute",
         left: `0px`, // so it is always centered relative to coantainer
         top: `${node.y + architectNodeHeight}px`,
         right: "auto"

    });

    node.instance.setPosition({

        position: "absolute",

        left: `${node.x}px`,

        top: `${node.y}px`,

        right: "auto"

    });
 

}
export function layoutNodesHorizontal_gen_v1(
    nodeColumns,
    columnIndex,
    flowIndex,
    layoutOptions
) {

    const {
        columnWidths
    } = layoutOptions;

    const xgap = 10;

    // --------------------------------------------------
    // Get node
    // --------------------------------------------------

    const node =
        nodeColumns[columnIndex]?.[flowIndex];

    if (!node) return;


    // --------------------------------------------------
    // Horizontal position
    // --------------------------------------------------

    let columnOffset = 0;

    for (let i = 0; i < columnIndex; i++) {

        columnOffset +=
            columnWidths[i] + xgap;
    }


    const columnWidth =
        columnWidths[columnIndex];


    node.x =
        columnOffset +
        (columnWidth - node.width) / 2;


    // --------------------------------------------------
    // Vertical position
    // --------------------------------------------------

console.log( "layoutOptions     "   ,layoutOptions  )

    let depthSpacing = 40;

    if (flowIndex === 0) {

        // First node in the flow.
        //
        // Generic version does not assume
        // anything about what the anchor represents.

        const anchorRect =
            node.element.getBoundingClientRect();

        const containerRect =
            layoutOptions.container
                .getBoundingClientRect();

        const anchorTop =
            anchorRect.bottom -
            containerRect.top;

        node.y =
            anchorTop + depthSpacing;

    } else {

        depthSpacing = 30;

        const previousNode =
            nodeColumns[columnIndex]?.[
                flowIndex - 1
            ];

        if (!previousNode) return;

        node.y =
            previousNode.y +
            previousNode.height +
            depthSpacing;
    }


    // --------------------------------------------------
    // Apply position
    // --------------------------------------------------

    node.instance.setPosition({

        position: "absolute",

        left: `${node.x}px`,

        top: `${node.y}px`,

        right: "auto"

    });
}


function layoutNodesHorizontal(nodeColumns, tokenIndex, depth, layoutOptions){
     
    const {container, mode, rawQuery, updatedCaret, assistant_width ,
        assistant_scroll_width,

         columnWidths ,
     } = layoutOptions;
    const containerRect =  container.getBoundingClientRect();
 
     let containerRect_width =assistant_scroll_width; 
     containerRect.width  =  assistant_scroll_width; 
 
  
    const xgap = 10;//5 * nodeColumns.length;
   // const spacing = ( containerRect_width + xgap ) / (nodeColumns.length  );
 
    const node = nodeColumns[tokenIndex][depth];
 
    if (!node) return;
 
       let columnOffset = 0;
         for (let i = 0; i < tokenIndex; i++) {
            columnOffset += columnWidths[i]  + xgap;
        }
         const columnWidth = columnWidths[tokenIndex];
         node.x =  columnOffset + (columnWidth - node.width) / 2;
        
 

    let depthSpacing =  40;//80;

    if (depth === 0) {
         // First node starts from query anchor
         const queryRect = node.anchor.getBoundingClientRect();
 
        const anchorTop =  queryRect.bottom - containerRect.top;
 
        node.y =  anchorTop + depthSpacing;
 
    } else {
        depthSpacing = 30;
        const previousNode =   nodeColumns[tokenIndex][depth - 1];
         if (!previousNode) return;
 
        node.y = previousNode.y + previousNode.height + depthSpacing;
         
           
    }
 
    //--------------------------------------------------
    // Apply position
    //--------------------------------------------------

   


    const anchorData = {
        position: "absolute",
          left: node.x + "px",
         top: node.y + "px",
         right: "auto"

    };

    node.instance.setPosition(anchorData);
  
 
     
}

function layoutNodesVertical(
    nodeColumns,
    tokenIndex,
    depth,
    layoutOptions
) {

    const { container, baseX  } = layoutOptions;

    const containerRect =
        container.getBoundingClientRect();

    const node =
        nodeColumns[tokenIndex][depth];

    if (!node) return;

    console_log(
        node,
        tokenIndex,
        depth,
        "VERTICAL NODE GEOMETRY"
    );


    //--------------------------------------------------
    // Position
    //--------------------------------------------------

    const depthSpacing = 20;
    const tokenSpacing = 20;


    //--------------------------------------------------
    // Horizontal = depth
    //--------------------------------------------------
 
 
    if (depth === 0) {

        // First node starts from query anchor
        const queryRect =
            node.anchor.getBoundingClientRect();

        const anchorLeft =
            queryRect.left - containerRect.left;

       // node.x =
        //    anchorLeft;

          node.x = baseX;

    } else {

        const previousNode =
            nodeColumns[tokenIndex][depth - 1];

        if (!previousNode) return;

        node.x =
         
            previousNode.x +
            previousNode.instance.getRect().width +
            depthSpacing;
    }
 
    /*
if (depth === 0) {
    node.x = baseX;
} else {
    const previousNode = nodeColumns[tokenIndex][depth - 1];

    node.x =
        previousNode.x +
        previousNode.width +
        depthSpacing;
}*/

    //--------------------------------------------------
    // Vertical = token
    //--------------------------------------------------

    if (tokenIndex === 0) {

        const queryRect =
            node.anchor.getBoundingClientRect();

        const anchorTop =
            queryRect.bottom - containerRect.top;

        node.y =
            anchorTop + tokenSpacing;

    } else {

        const previousTokenNodes =
            nodeColumns[tokenIndex - 1];

        const previousRowNodes =
            previousTokenNodes.filter(Boolean);

        const rowBottom =
            Math.max(
                ...previousRowNodes.map(
                    n => n.y + n.height
                )
            );

        node.y =
            rowBottom + tokenSpacing;
    }


    //--------------------------------------------------
    // Apply position
    //--------------------------------------------------

    const anchorData = {

        position: "absolute",

        left: node.x + "px",

        top: node.y + "px",

        right: "auto"

    };

    node.instance.setPosition(anchorData);


    //--------------------------------------------------
    // Update container height
    //--------------------------------------------------

    const nodeBottom =
        node.y + node.height;

    const requiredHeight =
        nodeBottom - containerRect.top + 40;

    const currentHeight =
        parseFloat(container.style.minHeight) || 0;

    if (requiredHeight > currentHeight) {

        container.style.minHeight =
            requiredHeight + "px";

    }

}

 export function getRequiredHorizontalWidth (nodeColumns, layoutOptions) {

    const { assistant_scroll_width } = layoutOptions;

    const xgap = 5;

    const columnWidths = [];

    let minWidthRequired = 0;

    //--------------------------------------------------
    // Find widest node in each column
    //--------------------------------------------------

    for (const column of nodeColumns) {

        if (!column) {
            columnWidths.push(0);
            continue;
        }

        let columnMaxWidth = 0;

        for (const node of column) {

            if (!node) continue;

            columnMaxWidth = Math.max(
                columnMaxWidth,
                node.width
            );
        }

        columnWidths.push(columnMaxWidth);

        minWidthRequired += columnMaxWidth  ;
    }

    //--------------------------------------------------
    // Gaps
    //--------------------------------------------------

    if (columnWidths.length > 1) {
        minWidthRequired +=
            xgap * (columnWidths.length - 1);
    }

    //--------------------------------------------------
    // Don't shrink below assistant width
    //--------------------------------------------------

    const requiredWidth = Math.max(
        assistant_scroll_width,
        minWidthRequired
    );

    return {
        requiredWidth,
        columnWidths
    };
}




export function getRequiredHorizontalWidth_gen(
    nodeColumns,
    layoutOptions
) {

    const { assistant_scroll_width } =
        layoutOptions;

    const xgap = 5;

    const columnWidths = [];

    let minWidthRequired = 0;


    //--------------------------------------------------
    // Find widest node in each column
    //--------------------------------------------------

    for (const column of nodeColumns) {

        if (!column) {
            columnWidths.push(0);
            continue;
        }

        let columnMaxWidth = 0;

        for (const node of column) {

            if (!node) continue;

            columnMaxWidth = Math.max(
                columnMaxWidth,
                node.width
            );

            
        }

        columnWidths.push(columnMaxWidth);

        minWidthRequired += columnMaxWidth;
    }

   
    //--------------------------------------------------
    // Gaps
    //--------------------------------------------------

    const gapCount =
        Math.max(0, columnWidths.length - 1);

    const totalGapWidth =
        xgap * gapCount;

    minWidthRequired += totalGapWidth;


    //--------------------------------------------------
    // Required width
    //--------------------------------------------------

    const requiredWidth = Math.max(
        assistant_scroll_width,
        minWidthRequired
    );


    //--------------------------------------------------
    // Horizontal distribution diagnostic
    //--------------------------------------------------

    const totalColumnWidth =
        columnWidths.reduce(
            (sum, width) => sum + width,
            0
        );

    const availableColumnSpace =
        requiredWidth - totalGapWidth;

    const extraSpace =
        Math.max(
            0,
            availableColumnSpace - totalColumnWidth
        );

    const extraSpacePerColumn =
        columnWidths.length
            ? extraSpace / columnWidths.length
            : 0;


    //--------------------------------------------------
    // Calculate theoretical column positions
    //--------------------------------------------------

    let columnOffset = 0;

    const distribution = [];

    for (
        let index = 0;
        index < columnWidths.length;
        index++
    ) {

        const width =
            columnWidths[index];

        const distributedWidth =
            width + extraSpacePerColumn;

        distribution.push({
            column: index,
            intrinsicWidth: width,
            distributedWidth,
            left: columnOffset,
            right:
                columnOffset +
                distributedWidth
        });

        columnOffset +=
            distributedWidth +
            xgap;
    }


    //--------------------------------------------------
    // DEBUG
    //--------------------------------------------------
 /*
    console.log(
        "========== HORIZONTAL WIDTH =========="
    );

    console.log(
        "available width:",
        assistant_scroll_width
    );

    console.log(
        "column widths:",
        columnWidths
    );

    console.log(
        "intrinsic column width:",
        totalColumnWidth
    );

    console.log(
        "total gaps:",
        totalGapWidth
    );

    console.log(
        "minimum required width:",
        minWidthRequired
    );

    console.log(
        "required width:",
        requiredWidth
    );

    console.log(
        "extra horizontal space:",
        extraSpace
    );

    console.log(
        "extra space per column:",
        extraSpacePerColumn
    );

    console.table(distribution);

    console.log(
        "======================================="
    );
 */
     

const distributedColumnWidths =
    columnWidths.map(width =>
        width + extraSpacePerColumn
    );


    return {
        requiredWidth,
        columnWidths : distributedColumnWidths
    };
}







function  console_log( node, tokenIndex, depth,  logType  ) {


  if (tokenIndex !== 3 || depth !== 1)return;

      switch (logType) {
        case "NODE GEOMETRY":
            console.log(logType, {
            tokenIndex, 
            depth,
            nodeHeight: node.height,
            nodeY: node.y,
            nodeElement: node.instance?.el
        });
        break;
         default:
            break;
      }
       
        
   }
    