export function renderNavigationTree(tree, container, options = {}) {

    const {
        currentPageId = null,
        onNavigate = null
    } = options;

    container.innerHTML = "";

    const root = document.createElement("nav");
    root.classList.add("navigationTree");

    function renderNodes(nodes, parent, depth = 0, inheritedCollection =  null ) {

        const list = document.createElement("ul");
        list.classList.add("navigationTreeList");

        for (const node of nodes) {

            const item = document.createElement("li");
            item.classList.add("navigationTreeItem");

            item.dataset.pageId = node.id;
            item.dataset.depth = depth;

            //--------------------------------------------------
            // Label
            //--------------------------------------------------

            const row = document.createElement("div");
            row.classList.add("navigationTreeRow");

            //--------------------------------------------------
            // Expand/collapse
            //--------------------------------------------------

            if (node.children?.length) {

                const toggle = document.createElement("button");

                toggle.classList.add("navigationTreeToggle");
                toggle.textContent = "›";

                toggle.addEventListener("click", () => {

                    item.classList.toggle("expanded");

                });

                row.appendChild(toggle);

            } else {

                const spacer = document.createElement("span");

                spacer.classList.add("navigationTreeToggleSpacer");

                row.appendChild(spacer);
            }

            //--------------------------------------------------
            // Page link
            //--------------------------------------------------

            const label = document.createElement(
                node.path ? "button" : "div"
            );

            label.classList.add("navigationTreeLabel");
            label.textContent = node.title;

             const collection = node.collection || inheritedCollection;
           

            if (node.path) {

                label.addEventListener("click", () => {

                    if (onNavigate) {
                        onNavigate( {
                                ...node,
                                collection
                            });


                        
                    }

                });

            }

            if (node.id === currentPageId) {
                item.classList.add("current");
            }

            row.appendChild(label);
            item.appendChild(row);

            //--------------------------------------------------
            // Children
            //--------------------------------------------------

            if (node.children?.length) {

                const childrenContainer =
                    document.createElement("div");

                childrenContainer.classList.add(
                    "navigationTreeChildren"
                );

                renderNodes(
                    node.children,
                    childrenContainer,
                    depth + 1,
                    collection
                );

                item.appendChild(childrenContainer);
            }

            list.appendChild(item);
        }

        parent.appendChild(list);
    }

    renderNodes(tree, root);

    container.appendChild(root);

    return root;
}

 