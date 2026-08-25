export function renderTreeNode(node, prefix = "", isLast = true) {

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

                <span class="guideTreeItem">
                    ${label}
                </span>

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
}


export function renderTree(root, children = [], title = "") {

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

                        const isLast =
                            index === children.length - 1;

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