  
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
        

    //--------------------------------------------------
    // Horizontal position
    //--------------------------------------------------
      //node.x += columnWidths[ tokenIndex];
      //node.x = spacing * (tokenIndex + 1);
    //  node.x -=spacing;
       
    //--------------------------------------------------
    // Vertical position
    //--------------------------------------------------

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

 export function getRequiredHorizontalWidth(nodeColumns, layoutOptions) {

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
    