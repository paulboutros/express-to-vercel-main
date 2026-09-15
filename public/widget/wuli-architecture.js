// public/JS/Mainfunctions/DOMregistry.js
var buttonRegistry = {};
function getButtonRegistry() {
  return buttonRegistry;
}
var widgetContent = {};
function getDOMregistry() {
  return widgetContent;
}

// public/JS/Mainfunctions/pageDataset.js
function setPageDataset() {
  const path = window.location.pathname;
  const pathSegments = path.split("/").filter(Boolean);
  if (pathSegments.includes("embed")) {
    document.body.dataset.page = "embed";
    return;
  }
  document.body.dataset.page = "demo";
  if (path.startsWith("/guide") || path.startsWith("/introduction") || path.startsWith("/reference") || path.startsWith("/purpose")) {
    document.body.dataset.page = "guide";
  }
  if (path.startsWith("/apiPipeline")) {
    document.body.dataset.page = "apiPipeline";
  }
}

// public/JS/Mainfunctions/localStorageAccess.js
var project = null;
var projectStore = null;
function getProject() {
  return project;
}
function getProjectStore() {
  return projectStore;
}

// public/JS/copyEmbed.js
async function copyEmbedCode(embedUrl) {
  const embedCode = `
<iframe
    src="${embedUrl}"
    title="Wulirocks architecture diagram"
    loading="lazy"
    style="display:block; width:100%; height:100vh; border:none;">
</iframe>`.trim();
  try {
    await navigator.clipboard.writeText(embedCode);
    console.log("Embed code copied:", embedCode);
    return true;
  } catch (error) {
    console.error("Failed to copy embed code:", error);
    return false;
  }
}
function copyEmbed(data) {
  const embedUrl = `${window.location.origin}/${data.collection}/${data.slug}/embed/${data.componentId}`;
  console.log(embedUrl);
  copyEmbedCode(embedUrl);
}
async function uploadJSON() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener(
      "change",
      async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        try {
          const text = await file.text();
          const json = JSON.parse(text);
          console.log(
            "JSON uploaded:",
            json
          );
          resolve(json);
        } catch (error) {
          console.error(
            "Failed to load JSON:",
            error
          );
          reject(error);
        }
      }
    );
    input.click();
  });
}
function downloadJSON(data, filename = "diagram.json") {
  const json = JSON.stringify(
    data,
    null,
    2
  );
  const blob = new Blob(
    [json],
    {
      type: "application/json"
    }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// public/JS/wuli-ui/ArchitectureNodeInstance.js
var ArchitectureNodeInstance = class {
  constructor(element) {
    this.element = element;
  }
  setPosition(position) {
    this.element.style.position = "absolute";
    if (position.left !== void 0) {
      this.element.style.left = position.left;
    }
    if (position.top !== void 0) {
      this.element.style.top = position.top;
    }
    if (position.right !== void 0) {
      this.element.style.right = position.right;
    }
  }
};

// public/JS/wuli-ui/pipelineFunction.js
var architectNodeHeight = 30;
var ini_anchorTop = null;
function clearConnectors(parent) {
  const svg = parent.querySelector(".pipelineConnectors");
  if (svg) {
    svg.replaceChildren();
  }
}
function drawConnector(parent, points) {
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
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#5fa8ff");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  }
  return svg;
}
function pt(x, y) {
  return { x, y };
}
function layoutNodesHorizontal_gen(nodeColumns, columnIndex, flowIndex, layoutOptions2) {
  const {
    depthSpacing,
    columnWidths
  } = layoutOptions2;
  const xgap = 5;
  const node = nodeColumns[columnIndex]?.[flowIndex];
  if (!node) return;
  let columnOffset = 0;
  for (let i = 0; i < columnIndex; i++) {
    columnOffset += columnWidths[i] + xgap;
  }
  const columnWidth = columnWidths[columnIndex];
  node.x = columnOffset + (columnWidth - node.width) / 2;
  if (flowIndex === 0) {
    const anchorRect = node.element.getBoundingClientRect();
    const containerRect = layoutOptions2.container.getBoundingClientRect();
    if (ini_anchorTop === null) {
      ini_anchorTop = anchorRect.bottom - containerRect.top;
    }
    const anchorTop = ini_anchorTop;
    node.y = anchorTop + depthSpacing;
  } else {
    const previousNode = nodeColumns[columnIndex]?.[flowIndex - 1];
    if (!previousNode) return;
    console.log(
      "gen implementation height ",
      {
        node_Id: previousNode.source.id,
        node_impHeight: previousNode.implementation.height
      }
    );
    node.y = previousNode.y + previousNode.height + previousNode.implementation.height + depthSpacing;
  }
  node.implementationInstance.setPosition({
    position: "absolute",
    left: `0px`,
    // so it is always centered relative to coantainer
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
function getRequiredHorizontalWidth_gen(nodeColumns, layoutOptions2) {
  const { assistant_scroll_width } = layoutOptions2;
  const xgap = 5;
  const columnWidths = [];
  let minWidthRequired = 0;
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
  const gapCount = Math.max(0, columnWidths.length - 1);
  const totalGapWidth = xgap * gapCount;
  minWidthRequired += totalGapWidth;
  const requiredWidth = Math.max(
    assistant_scroll_width,
    minWidthRequired
  );
  const totalColumnWidth = columnWidths.reduce(
    (sum, width) => sum + width,
    0
  );
  const availableColumnSpace = requiredWidth - totalGapWidth;
  const extraSpace = Math.max(
    0,
    availableColumnSpace - totalColumnWidth
  );
  const extraSpacePerColumn = columnWidths.length ? extraSpace / columnWidths.length : 0;
  let columnOffset = 0;
  const distribution = [];
  for (let index = 0; index < columnWidths.length; index++) {
    const width = columnWidths[index];
    const distributedWidth = width + extraSpacePerColumn;
    distribution.push({
      column: index,
      intrinsicWidth: width,
      distributedWidth,
      left: columnOffset,
      right: columnOffset + distributedWidth
    });
    columnOffset += distributedWidth + xgap;
  }
  const distributedColumnWidths = columnWidths.map(
    (width) => width + extraSpacePerColumn
  );
  return {
    requiredWidth,
    columnWidths: distributedColumnWidths
  };
}

// public/JS/wuli-ui/connectorManager.js
var nodeHeight = 30;
var container_branchLayout = null;
function draw_connector_forkMiddle(forkNode, containerArg) {
  let container_branchLayout3 = containerArg.querySelector(".guideArchitectureBranchLayout");
  forkNode.segmentList.forEach((segEl) => {
    drawConnector(
      container_branchLayout3,
      [segEl.start, segEl.end]
    );
  });
}
function draw_connector_forkStart(forkNode, containerArg) {
  container_branchLayout = containerArg.querySelector(".guideArchitectureBranchLayout");
  const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();
  const fromRect = forkNode.element?.getBoundingClientRect();
  let from;
  if (fromRect) {
    from = pt(
      fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
      fromRect.bottom - container_branchLayout_Rect.top
    );
  }
  if (forkNode.element_pt) {
    from = forkNode.element_pt;
  }
  let toPoints = [];
  for (const branchHead of forkNode.branchHeadElements) {
    const rect = branchHead.getBoundingClientRect();
    const to = pt(
      rect.left + rect.width / 2 - container_branchLayout_Rect.left,
      rect.top - container_branchLayout_Rect.top
    );
    toPoints.push(to);
  }
  if (forkNode.branchHeadElements_pts) {
    toPoints = forkNode.branchHeadElements_pts;
  }
  for (const to of toPoints) {
    const midY = from.y + (to.y - from.y) / 2;
    drawConnector(
      container_branchLayout,
      [
        from,
        pt(from.x, midY),
        pt(to.x, midY),
        to
      ]
    );
  }
}
function getForkNodeMiddle(containerArg) {
  container_branchLayout = containerArg.querySelector(".guideArchitectureBranchLayout");
  const container = container_branchLayout;
  const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();
  let forkElement_pt;
  let startPoint;
  let fromRect;
  let endconnectorPoints = [];
  let segmentList = [];
  const endOfFlowList = containerArg.querySelectorAll("[data-architecture-branch-index]");
  const branchHeadElements = [...endOfFlowList].filter((el) => !el.classList.contains("branchStartHidden"));
  console.log("middle: base list  ", {
    endOfFlowList,
    branchHeadElements
  });
  for (const elmacth of branchHeadElements) {
    const flowIndex = Number(elmacth.dataset.architectureFlowIndex);
    if (flowIndex === 0) continue;
    fromRect = elmacth.getBoundingClientRect();
    let start = pt(
      fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
      fromRect.bottom - container_branchLayout_Rect.top - nodeHeight
    );
    let end = pt(start.x, start.y - 40);
    let seg = { start, end };
    segmentList.push(seg);
  }
  console.log(" segmentList ", segmentList);
  return {
    // element: forkElement,
    branchHeadElements,
    // element_pt: forkElement_pt,
    //  branchHeadElements_pts: endconnectorPoints,
    segmentList
  };
}
function getForkNodeEnd(containerArg) {
  container_branchLayout = containerArg.querySelector(".guideArchitectureBranchLayout");
  const container = container_branchLayout;
  const container_branchLayout_Rect = container_branchLayout.getBoundingClientRect();
  let forkElement_pt;
  let startPoint;
  let fromRect;
  let endconnectorPoints = [];
  const forkElement = containerArg.querySelector("[data-fork-merge]");
  fromRect = forkElement.getBoundingClientRect();
  forkElement_pt = pt(
    fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
    fromRect.bottom - container_branchLayout_Rect.top - nodeHeight
  );
  console.log(
    "forkElement_pt",
    forkElement_pt
  );
  const endOfFlowList = containerArg.querySelectorAll("[data-end-of-flow]");
  const branchHeadElements = [...endOfFlowList].filter((el) => !el.classList.contains("nodeHidden"));
  for (const elmacth of branchHeadElements) {
    fromRect = elmacth.getBoundingClientRect();
    let ptc = pt(
      fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
      fromRect.bottom - container_branchLayout_Rect.top
    );
    const nodeId = elmacth.dataset.architectureNodeId;
    const elmacthImpl = containerArg.querySelector(`.isOpen[data-architecture-implementation][data-architecture-node-id="${nodeId}"]`);
    if (elmacthImpl) {
      const fromImpRect = elmacthImpl.getBoundingClientRect();
      ptc = pt(
        fromRect.left + fromRect.width / 2 - container_branchLayout_Rect.left,
        fromImpRect.bottom - container_branchLayout_Rect.top
      );
    }
    endconnectorPoints.push(ptc);
  }
  endOfFlowList.forEach((el) => {
    const nodeId = el.dataset.architectureNodeId;
    const elmacth = containerArg.querySelector(`.isOpen[data-architecture-implementation][data-architecture-node-id="${nodeId}"]`);
    if (elmacth) {
      fromRect = elmacth.getBoundingClientRect();
    }
  });
  console.log(" endconnectorPoints ", endconnectorPoints);
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
function getForkNode(container) {
  const forkElement = container.querySelector("[data-fork-initiator]");
  const branchHeadElements = [...container.querySelectorAll("[data-fork-branch-head]")];
  if (!forkElement || !branchHeadElements.length) {
    return null;
  }
  return {
    element: forkElement,
    branchHeadElements
  };
}

// public/JS/UI/renderTree.js
function renderTreeNode(node, prefix = "", isLast = true) {
  const label = typeof node === "string" ? node : node.label;
  const children = typeof node === "string" ? [] : node.children || [];
  return `

        <div class="guideTreeNode">

            <div class="guideTreeRow">

                 <span class="guideTreeConnector">${prefix}${isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 "}</span>

                <span class="guideTreeItem">
                    ${label}
                </span>

            </div>

            ${children.length ? `

                <div class="guideTreeChildren">

                    ${children.map((child, index) => {
    const childIsLast = index === children.length - 1;
    const childPrefix = prefix + (isLast ? "    " : "\u2502   ");
    return renderTreeNode(
      child,
      childPrefix,
      childIsLast
    );
  }).join("")}

                </div>

            ` : ""}

        </div>

    `;
}
function renderTree(root, children = [], title = "") {
  return `

        <div class="guideSection guideTree">

            ${title ? `
                <div class="guideTreeTitle">
                    ${title}
                </div>
            ` : ""}

            <div class="guideTreeContent">

                <div class="guideTreeRoot">
                    ${root}
                </div>

                <div class="guideTreeNodes">

                    ${children.map((child, index) => {
    const isLast = index === children.length - 1;
    return renderTreeNode(
      child,
      "",
      isLast
    );
  }).join("")}

                </div>

            </div>

        </div>

    `;
}

// public/JS/UI/renderArchitecture.js
var architectureLayout = null;
var MaxNodeStackHeight = 0;
var nodeHeight2 = 30;
var mainContainer;
var layoutOptions;
var container_branchLayout2;
var container_guideComponent = document.getElementById("guideTextBlock");
var updateImplementationRect;
function renderArchitecture(container, section, options = {}) {
  mainContainer = container;
  const registry = getButtonRegistry();
  const buttonKey = `copyEmbed_${section.architectureIndex}`;
  const buttonUploadKey = `upload_${section.architectureIndex}`;
  const buttonDownloadKey = `download_${section.architectureIndex}`;
  registry[buttonKey] = {
    action: "copyEmbed",
    collection: options.collection,
    slug: options.slug,
    componentId: section.architectureIndex
  };
  registry[buttonUploadKey] = {
    action: "upload",
    collection: options.collection,
    slug: options.slug,
    componentId: section.architectureIndex
  };
  registry[buttonDownloadKey] = {
    action: "download",
    collection: options.collection,
    slug: options.slug,
    componentId: section.architectureIndex
  };
  return `

        <div
    class="guideSection guideArchitecture"
    data-architecture-section
    data-architecture-index="${section.architectureIndex}"
>

    ${section.title ? `
        <div class="guideArchitectureHeader">

            <div class="guideArchitectureTitle">
                ${section.title}
            </div>

            <button
                class="copyEmbedButton"
                type="button"
                data-button-key="copyEmbed_${section.architectureIndex}"
                data-copy-embed
            >
                Copy embed
            </button>

            <button
                class="copyEmbedButton"
                type="button"
                data-button-key="upload_${section.architectureIndex}"
                data-btn-upload
            >
                upload
            </button>
             <button
                class="copyEmbedButton"
                type="button"
                data-button-key="download_${section.architectureIndex}"
                data-btn-download
            >
                download
            </button>

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

            ${data.script ? `<div class="guideArchitectureImplementationScript">
                    ${data.script}
                   </div>` : ""}
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
    "Purpose",
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
       

           ${renderArchitectureSketch(data.architectureSketch2)}
            ${renderArchitectureSketch(data.architectureSketch3)}
           
            

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

               ${data.tree ? renderTree(
    data.tree.root,
    data.tree.children,
    data.tree.title
  ) : ""}

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

       ${items.map((item) => `<div class="guideArchitectureImplementationItem
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

            ${lines.map((line) => `<div class="guideArchitectureSketchLine"> ${line}</div>`).join("")}
 
        </div>
     `;
}
function renderArchitectureContinuation(section) {
  if (!section.continuation?.length) {
    return "";
  }
  console.log(" section.continuation  ", section.continuation);
  return `

        <div class="guideArchitectureContinuation">

            ${section.continuation.map((item) => `

                <div class="guideArchitectureConnector">

                    <div class="guideArchitectureLine"></div>

                    <div class="guideArchitectureArrow">
                        \u25BC
                    </div>

                </div>

                <div class="guideArchitectureNode">
                    ${item}
                </div>

            `).join("")}

        </div>

    `;
}
function mainVerticalFlow(section) {
  return section.flow?.map((item) => {
    const node = typeof item === "string" ? {
      label: item,
      canOpen: false
    } : item;
    return `

            <div class="guideArchitectureConnector">

                <div class="guideArchitectureLine"></div>

                <div class="guideArchitectureArrow">
                    \u25BC
                </div>

            </div>
             
                ${renderArchitectureNode(node)}
               
 
        `;
  }).join("") || "";
}
function renderArchitectureNode(node, options = {}) {
  const nodeId = options.mainNodeIndex !== void 0 && options.branchIndex !== void 0 && options.flowIndex !== void 0 ? `${options.mainNodeIndex}-${options.branchIndex}-${options.flowIndex}` : "";
  node.id = nodeId;
  if (options.branchFlow) {
  }
  return `
         <div class="guideArchitectureNode ${node.branchStart ? "branchStartHidden" : "guideArchitectureNode"} ${node.canOpen ? "isOpenable" : ""}"
            ${node.canOpen ? "data-architecture-node" : ""}
            ${options.branchIndex !== void 0 ? `data-architecture-branch-index="${options.branchIndex}"` : ""}
                
            ${options.mainNodeIndex !== void 0 ? `data-architecture-main-node-index="${options.mainNodeIndex}"` : ""}
            ${options.flowIndex !== void 0 ? `data-architecture-flow-index="${options.flowIndex}"` : ""}
                 
            ${nodeId ? `data-architecture-node-id="${nodeId}"` : ""}
                
                
            ${options.flowIndex !== void 0 && options.flowIndex === 0 ? "data-fork-branch-head" : ""}
            ${node.branches?.length !== void 0 ? "data-fork-initiator" : ""}

            ${options.isEndOfFlow !== void 0 && options.isEndOfFlow ? "data-end-of-flow" : ""}
            ${node.branchMerge !== void 0 ? "data-fork-merge" : ""}

       
    
            >
            ${node.label}
        </div>

        ${node.canOpen && !options.skipImplementation ? `
            <div class="guideArchitectureImplementation ${options.branchFlow ? "guideArchitectureBranchFlowImplementation" : ""}"
                data-architecture-implementation
                ${nodeId ? `data-architecture-node-id="${nodeId}"` : ""}
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
function setupArchitectureInteractions(container, guide, do_layoutArchitectureBranchFlows) {
  container.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-button-key]");
    if (!button) return;
    const key = button.dataset.buttonKey;
    const registry = getButtonRegistry();
    const entry = registry[key];
    console.log("button   ==== ", {
      button,
      entry,
      key
    });
    if (!entry) return;
    const guideComponent2 = getDOMregistry().guideComponent;
    if (entry.action === "copyEmbed") {
      copyEmbed(entry);
    }
    if (entry.action === "upload") {
      const jsonResult = await uploadJSON();
      guideComponent2.refresh(jsonResult);
    }
    if (entry.action === "download") {
      console.log(guideComponent2.currentPageData);
      downloadJSON(guideComponent2.currentPageData);
    }
  });
  const nodes = container.querySelectorAll("[data-architecture-node]");
  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      const flowIndex = node.dataset.architectureFlowIndex;
      if (flowIndex !== void 0) {
        const implementation2 = node.nextElementSibling;
        if (!implementation2?.matches(
          "[data-architecture-implementation]"
        )) {
          return;
        }
        const branchIndex2 = node.dataset.architectureBranchIndex;
        const mainNodeIndex2 = node.dataset.architectureMainNodeIndex;
        const architecture = node.closest("[data-architecture-section]");
        const architectureIndex = architecture?.dataset.architectureIndex;
        const architectureSection = guide.sections.find(
          (section) => section.type === "architecture" && section.architectureIndex === Number(architectureIndex)
        );
        const mainNode = architectureSection?.flow?.[Number(mainNodeIndex2)];
        const branch = mainNode?.branches?.[Number(branchIndex2)];
        const flowNode = branch?.flow?.[Number(flowIndex)];
        if (!flowNode) {
          console.log(
            "STOP: missing architecture flow node",
            {
              architectureIndex,
              mainNodeIndex: mainNodeIndex2,
              branchIndex: branchIndex2,
              flowIndex
            }
          );
          return;
        }
        const isOpen2 = implementation2.classList.toggle("isOpen");
        const branches = mainNode.branches;
        const clickInfo = {
          branchIndex: branchIndex2,
          mainNode,
          branches
        };
        showBranchInclusive(Number(branchIndex2), clickInfo);
        flowNode.implementation = flowNode.implementation || {};
        updateImplementationRect = () => {
          flowNode.implementation.height = isOpen2 ? implementation2.getBoundingClientRect().height : 0;
        };
        node.classList.toggle("isOpen", isOpen2);
        timeout_refreshArchitectureLayout(
          branches,
          do_layoutArchitectureBranchFlows,
          null,
          //  updateImplementationRect ,
          clickInfo,
          100
        );
        return;
      }
      const branchIndex = node.dataset.architectureBranchIndex;
      const mainNodeIndex = node.dataset.architectureMainNodeIndex;
      const nodeRect = node.getBoundingClientRect();
      if (branchIndex !== void 0) {
        const architecture = node.closest("[data-architecture-section]");
        const architectureRect = architecture?.getBoundingClientRect();
        const architectureIndex = architecture?.dataset.architectureIndex;
        const architectureSection = guide.sections.find(
          (section) => section.type === "architecture" && section.architectureIndex === Number(architectureIndex)
        );
        const mainNode = architectureSection.flow[Number(mainNodeIndex)];
        const branch = mainNode?.branches[Number(branchIndex)];
        const implementation2 = architecture?.querySelector(
          "[data-architecture-branch-implementation]"
        );
        if (!branch || !implementation2) {
          console.log(
            "STOP: missing branch or implementation DOM"
          );
          return;
        }
        const isOpen2 = implementation2.classList.contains("isOpen");
        const currentBranchIndex = implementation2.dataset.activeBranchIndex;
        if (isOpen2 && currentBranchIndex === branchIndex) {
          implementation2.classList.remove("isOpen");
          implementation2.removeAttribute(
            "data-active-branch-index"
          );
          node.classList.remove("isOpen");
          return;
        }
        const rendered = renderArchitectureImplementation(
          branch.implementation
        );
        implementation2.innerHTML = rendered;
        implementation2.dataset.activeBranchIndex = branchIndex;
        implementation2.classList.add("isOpen");
        return;
      }
      const implementation = node.nextElementSibling;
      if (!implementation?.matches(
        "[data-architecture-implementation]"
      )) {
        return;
      }
      const isOpen = implementation.classList.toggle("isOpen");
      node.classList.toggle("isOpen", isOpen);
    });
  });
}
function renderArchitectureBranchFlow(branch, branchIndex, mainNodeIndex) {
  if (!branch.flow?.length) {
    return "";
  }
  return `

        <div class="guideArchitectureBranchFlow">

            ${branch.flow.map((item, flowIndex) => {
    const node = typeof item === "string" ? {
      label: item,
      canOpen: false
    } : item;
    const isEndOfFlow = flowIndex === branch.flow.length - 1;
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
function layoutArchitectureBranchFlows(container, branches, mainNode) {
  if (!container) {
    container = container_guideComponent;
  }
  setLayoutOptions(container);
  console.log("layoutArchitectureBranchFlows", { layoutOptions, container });
  const nodeColumns = getArchitectureNodeColumns(branches);
  const { requiredWidth, columnWidths } = getRequiredHorizontalWidth_gen(nodeColumns, layoutOptions);
  architectureLayout = {
    ...layoutOptions,
    columnWidths,
    requiredWidth
  };
  if (mainNode.branches?.length) {
    refreshArchitectureLayout(mainNode.branches);
  }
  call_layoutNodesHorizontal_gen(nodeColumns);
  clearConnectors(container_branchLayout2);
  const architectureContainer = container.querySelector("[data-architecture-index]");
  const forkNode = getForkNode(architectureContainer);
  const forkEnd = getForkNodeEnd(architectureContainer);
  const forkmiddle = getForkNodeMiddle(architectureContainer);
  draw_connector_forkStart(forkNode, architectureContainer);
  draw_connector_forkMiddle(forkmiddle, architectureContainer);
  draw_connector_forkStart(forkEnd, architectureContainer);
  return {
    requiredWidth,
    columnWidths,
    nodeColumns
  };
}
function call_layoutNodesHorizontal_gen(nodeColumns) {
  for (let columnIndex = 0; columnIndex < nodeColumns.length; columnIndex++) {
    const column = nodeColumns[columnIndex];
    for (let flowIndex = 0; flowIndex < column.length; flowIndex++) {
      layoutNodesHorizontal_gen(
        nodeColumns,
        columnIndex,
        flowIndex,
        architectureLayout
      );
    }
  }
}
function setLayoutOptions(containerArg) {
  console.log("set layout container arg: ", containerArg);
  const nodeContainer = containerArg.querySelector(".guideArchitectureBranchLayout");
  container_branchLayout2 = nodeContainer;
  layoutOptions = {
    depthSpacing: 40,
    container_branchLayout: nodeContainer,
    container: nodeContainer,
    assistant_scroll_width: nodeContainer.getBoundingClientRect().width
  };
}
function showBranchInclusive(visibleIndex, clickInfo) {
  const { branches } = clickInfo;
  const nodeColumns = getArchitectureNodeColumns(branches);
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
  requestAnimationFrame(() => {
    let nodeStillopen = [];
    let atLeastOneIsOpen = false;
    const currentColumn = nodeColumns[visibleIndex];
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
          const isStillOpen = node.element.classList.contains("isOpen");
          console.log(" isStillOpen ", node.source.id);
          if (isStillOpen) {
            nodeStillopen.push(node);
          }
          node.element.classList.remove("isOpen");
          node.implementationElement.classList.remove("isOpen");
        }
      }
      console.log(" nodeStillopen", nodeStillopen);
      nodeStillopen.forEach((nodeOpen) => {
        console.log("node still open ", nodeOpen.source.id);
        nodeOpen.source.implementation = nodeOpen.source.implementation || {};
        nodeOpen.source.implementation.height = 0;
      });
    }
  });
}
function getRequiredArchitectureBranchHeight(container) {
  let requiredHeight = 0;
  container.querySelectorAll(".guideArchitectureBranchFlowImplementation").forEach((implementation) => {
    const rect = implementation.getBoundingClientRect();
    requiredHeight += rect.height + layoutOptions.depthSpacing + layoutOptions.depthSpacing * 0.25;
  });
  if (requiredHeight > MaxNodeStackHeight) {
    requiredHeight -= MaxNodeStackHeight;
  }
  return requiredHeight;
}
function updateLayoutContainerHeight(container, requiredHeight) {
  container.style.height = `${requiredHeight}px`;
}
function getArchitectureNodeColumns(branches) {
  const container = container_branchLayout2;
  const nodeColumns = branches.map(
    (branch) => (branch.flow || []).map((node) => {
      const element = container.querySelector(`[data-architecture-node][data-architecture-node-id="${node.id}"]`);
      const instance = new ArchitectureNodeInstance(element);
      const implementationElement = (
        //  element.nextElementSibling
        container.querySelector(`[data-architecture-implementation][data-architecture-node-id="${node.id}"]`)
      );
      const implementationInstance = new ArchitectureNodeInstance(implementationElement);
      const rect = element.getBoundingClientRect();
      const minWidth = getComputedStyle(element).minWidth;
      const minHeight = getComputedStyle(element).minHeight;
      if (!node.implementation) {
        node.implementation = {};
      }
      if (node.implementation.height === void 0) {
        node.implementation.height = 0;
      }
      const nodeDOM = {
        source: node,
        element,
        instance,
        implementationElement,
        implementationInstance,
        width: 120,
        // rect.width,
        height: 30,
        //  rect.height,
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
}
var architectureLayoutRefreshTimeout = null;
function timeout_refreshArchitectureLayout(branches, do_layoutArchitectureBranchFlows, unused_argument, clickInfo, timeVal) {
  clearTimeout(architectureLayoutRefreshTimeout);
  architectureLayoutRefreshTimeout = setTimeout(() => {
    updateImplementationRect();
    refreshArchitectureLayout(branches);
    do_layoutArchitectureBranchFlows();
  }, timeVal);
}
function refreshArchitectureLayout(branches) {
  MaxNodeStackHeight = getMaxNodeStackHeight(branches);
  const implementationHeigh = getRequiredArchitectureBranchHeight(container_branchLayout2);
  const requiredHeight = MaxNodeStackHeight + implementationHeigh;
  updateLayoutContainerHeight(container_branchLayout2, requiredHeight);
}
function getMaxNodeStackHeight(branches) {
  let maxNodeStackHeight = 0;
  for (const branch of branches || []) {
    const flow = branch.flow || [];
    const nodeStackHeight = flow.length * nodeHeight2;
    maxNodeStackHeight = Math.max(
      maxNodeStackHeight,
      nodeStackHeight
    );
  }
  return maxNodeStackHeight + nodeHeight2;
}

// public/JS/UI/GuideComponent.js
var GuideComponent = class {
  constructor({ container = null }) {
    this.container = container;
    this.currentPageData = null;
    this.options = null;
    getDOMregistry().guideComponent = this;
  }
  refresh(currentPageData) {
    this.show(currentPageData, this.options);
    const project2 = getProject();
    project2.architecture = currentPageData;
    getProjectStore().save(project2);
  }
  show(pageData, options = {}) {
    this.options = options;
    this.currentPageData = pageData;
    let html = `

             <div class="guideContent">
                  ${options.hideTopArea ? "" : this.topArea(pageData)}
 
        `;
    let architectureIndex = 0;
    for (const section of pageData.sections) {
      if (section.type === "architecture" && section.flow) {
        section.architectureIndex = architectureIndex;
        section.flow.filter((el) => typeof el !== "string").forEach((flow, index) => {
          flow.mainNodeIndex = index;
        });
        architectureIndex++;
      }
      if (options.hideTopArea && section.type === "architecture") {
        html += this.renderSection(section, options);
      } else {
      }
      if (!options.hideTopArea) {
        html += this.renderSection(section, options);
      }
    }
    html += `</div>`;
    this.container.innerHTML = html;
    setupArchitectureInteractions(
      this.container,
      pageData,
      () => {
        this.do_layoutArchitectureBranchFlows(pageData);
      }
    );
    this.do_layoutArchitectureBranchFlows(pageData);
  }
  topArea(pageData) {
    return `
             <div class="guideTitleRow">
                  <div class="guideTitle">
                    ${pageData.title}
                  </div>

                   <div id="guideNavigation" class="guideNavigation">
                         <div class="guideNavButton"></div>
                         <div class="guideNavButton"></div>
                   </div>
               </div>
 
                <div class="guideSummary">
                    ${pageData.summary}
                </div>
           `;
  }
  do_layoutArchitectureBranchFlows(pageData) {
    for (const section of pageData.sections) {
      if (section.type === "architecture" && section.flow) {
        section.flow.filter((el) => typeof el !== "string").forEach((node, index) => {
          if (!node.branches?.length) {
            return;
          }
          layoutArchitectureBranchFlows(this.container, node.branches, node);
        });
      }
    }
  }
  renderSection(section, options = {}) {
    switch (section.type) {
      case "paragraph":
        return `

                    <div class="guideSection">

                        <div class="guideParagraph">

                            ${section.text}

                        </div>

                    </div>

                `;
      case "note":
        return `

                    <div class="guideSection guideNote">

                        <div class="guideNoteTitle">

                            ${section.title}

                        </div>

                        <div class="guideParagraph">

                            ${section.text}

                        </div>

                    </div>

                `;
      case "list":
        return `

                    <div class="guideSection guideList">

                        ${section.title ? `
                            <div class="guideListTitle">
                                ${section.title}
                            </div>
                        ` : ""}

                        <ul class="guideListItems">

                            ${section.items.map((item) => `

                                <li>
                                    ${item}
                                </li>

                            `).join("")}

                        </ul>

                    </div>

                `;
      case "paragraph-title":
        return `

                    <div class="guideSection">

                        <div class="paragraph-title">

                            ${section.text}

                        </div>

                    </div>

                `;
      case "architecture":
        return renderArchitecture(this.container, section, options);
      case "tree":
        return renderTree(
          section.root,
          section.children,
          section.title
        );
      case "spacer":
        return `<div class="guideSpacer"></div>`;
      case "diagram":
        const steps = section.text.split("\n").map((step) => step.trim()).filter((step) => step && step !== "\u2193");
        return `

                    <div class="guideSection guideDiagram">

                        ${section.title ? `
                            <div class="guideDiagramTitle">
                                ${section.title}
                            </div>
                        ` : ""}

                        <div class="guideDiagramFlow">

                            ${steps.map((step, index) => `

                                <div class="guideDiagramStep">

                                    <div class="guideDiagramBox">
                                        ${step}
                                    </div>

                                    ${index < steps.length - 1 ? `
                                        <div class="guideDiagramArrow">
                                            \u2193
                                        </div>
                                    ` : ""}

                                </div>

                            `).join("")}

                        </div>

                    </div>

                `;
      case "warning":
        return `

                    <div class="guideSection guideWarning">

                        <div class="guideNoteTitle">

                            ${section.title}

                        </div>

                        <div class="guideParagraph">

                            ${section.text}

                        </div>

                    </div>

                `;
      default:
        return "";
    }
  }
};

// widget/wuli-architecture.js
var guideComponent = null;
function createWidgetRoot(container) {
  if (container.shadowRoot) {
    return container.shadowRoot;
  }
  return container.attachShadow({
    mode: "open"
  });
}
function render({
  container,
  pageData,
  collection = "guide",
  slug,
  componentId = 0
}) {
  const shadowRoot = createWidgetRoot(container);
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "../widget/wuli-architecture.css";
  shadowRoot.appendChild(style);
  const widgetContent2 = document.createElement("div");
  widgetContent2.className = "wulirocks";
  shadowRoot.appendChild(widgetContent2);
  getDOMregistry().widgetContent = widgetContent2;
  setPageDataset();
  if (!container) {
    throw new Error(
      "WuliArchitecture.render() requires a container."
    );
  }
  if (!guideComponent) {
    guideComponent = new GuideComponent({
      container: widgetContent2
    });
  }
  const options = {
    hideTopArea: true,
    collection,
    slug,
    componentId
  };
  guideComponent.show(
    pageData,
    options
  );
  return guideComponent;
}
window.WuliArchitecture = { render };
runWidget();
async function runWidget() {
  const architectureWidget = document.getElementById("architecture-widget");
  if (!architectureWidget || !architectureWidget.dataset.src) {
    return;
  }
  const jsonFile = architectureWidget.dataset.src;
  console.log("  fetch   ");
  const response = await fetch(jsonFile);
  console.log("fetch response    ", response);
  if (!response.ok) {
    throw new Error(
      `Failed to load diagram.json: ${response.status}`
    );
  }
  const pageData = await response.json();
  console.log("pageData   ", pageData);
  render({
    container: architectureWidget,
    pageData,
    collection: "reference",
    slug: "widget-test",
    componentId: 0
  });
  console.log(
    "Wulirocks Architecture widget ready"
  );
}
