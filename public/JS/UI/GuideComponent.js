 

 export default class GuideComponent {

    constructor({container = null  }){

        this.container = container;
 
    }

    show(guide){
      
      let html = `

             <div class="guideContent">

               
              <div class="guideTitleRow">
                <div class="guideTitle">
                    ${guide.title}
                </div>

                <div id="guideNavigation" class="guideNavigation">
                    <div class="guideNavButton"></div>
                    <div class="guideNavButton"></div>
                </div>
            </div>



                <div class="guideSummary">
                    ${guide.summary}
                </div>

        `;



        for(const section of guide.sections){

            html += this.renderSection(section);

        }

        html += `</div>`;

        this.container.innerHTML = html;

    }

    renderSection(section){

        switch(section.type){

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

                            ${section.items.map(item => `

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

    return `

        <div
            class="guideSection guideArchitecture"
            style="--branch-count: ${section.branches?.length || 0};"
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

                ${section.flow?.map(item => `

                    <div class="guideArchitectureConnector">

                        <div class="guideArchitectureLine"></div>

                        <div class="guideArchitectureArrow">
                            ▼
                        </div>

                    </div>

                    <div class="guideArchitectureNode">
                        ${item}
                    </div>

                `).join("") || ""}


                <!-- Branches -->

                ${section.branches?.length ? `

                    <div class="guideArchitectureBranchConnector">

                        <div class="guideArchitectureBranchConnectorGrid">

                            ${section.branches.map(() => `
                                <div class="guideArchitectureBranchConnectorCell">
                                    <div class="guideArchitectureBranchLine"></div>
                                </div>
                            `).join("")}

                        </div>

                    </div>


                    <div class="guideArchitectureBranches">

                        ${section.branches.map(branch => `

                            <div class="guideArchitectureBranch">

                                <div class="guideArchitectureNode">
                                    ${branch}
                                </div>

                            </div>

                          `).join("")}

                    </div>


                    <!-- Optional branch merge -->

                   ${section.branchesReturn ? `

    <div class="guideArchitectureMerge">

        <div class="guideArchitectureMergeLines">

            ${section.branches.map(() => `
                <div class="guideArchitectureMergeLine"></div>
            `).join("")}

        </div>

        <div class="guideArchitectureMergeHorizontal"></div>

        <div class="guideArchitectureMergeArrow">
            ▼
        </div>

    </div>

` : ""}

                ` : ""}


                <!-- Continuation after branches -->

                ${section.continuation?.length ? `

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

                ` : ""}


            </div>

        </div>

    `;
     
          case "tree": {

          const renderTreeNode = (node, prefix = "", isLast = true) => {

        const label =
            typeof node === "string"
                ? node
                : node.label;

        const children =
            typeof node === "string"
                ? []
                : node.children || [];

       return `

    <div class="guideTreeNode">

        <div class="guideTreeRow">

            <span class="guideTreeConnector">${prefix}${isLast ? "└── " : "├── "}</span>

            <span class="guideTreeItem">${label}</span>

        </div>


        ${children.length ? `

            <div class="guideTreeChildren">

                ${children.map((child, index) => {

                    const childIsLast =
                        index === children.length - 1;

                    const childPrefix =
                        prefix +
                        (isLast ? "    " : "│   ");

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
            };


    return `

        <div class="guideSection guideTree">

            ${section.title ? `
                <div class="guideTreeTitle">
                    ${section.title}
                </div>
            ` : ""}

            <div class="guideTreeContent">

                <div class="guideTreeRoot">
                    ${section.root}
                </div>

                <div class="guideTreeNodes">

                    ${section.children.map((child, index) => {

                        const isLast =
                            index === section.children.length - 1;

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


            case "spacer":
               return `<div class="guideSpacer"></div>`;
 
             case "diagram":

                const steps = section.text
                    .split("\n")
                    .map(step => step.trim())
                    .filter(step => step && step !== "↓");

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
                                            ↓
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

}

