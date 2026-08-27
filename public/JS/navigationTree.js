
let siteNavigationData = null;
let siteNavigationDOM_created = false;
  let navigationPaths =  null;

 const final_traitList = document.getElementById("final_traitList");
 const navig_container = document.getElementById("navig_container");

 let updatePage = null;
 export function setupdatePage( updatePageArg){ 
      updatePage = updatePageArg;
 }

export function getNavigationPaths(){

     return navigationPaths
}
export function setNavigationPaths( value ){
   navigationPaths =  value;
}

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


export function buildNavigationPaths(  siteNavigationDataArg   ) {
   
      siteNavigationData   = siteNavigationDataArg;
      navigationPaths = {};
  
    function collect(nodes, collection = null) {

        for (const node of nodes) {

            const currentCollection =
                 node.collection || collection;

            if (node.path && currentCollection) {

                if (!navigationPaths[currentCollection]) {
                    navigationPaths[currentCollection] = [];
                }

                navigationPaths[currentCollection].push(
                    node.path
                );
            }

            if (node.children?.length) {

                collect(
                    node.children,
                    currentCollection
                );
            }
        }
    }

    collect(siteNavigationData);

       return navigationPaths;
}



export async function create_SiteNavigation(){

  if (siteNavigationDOM_created ){ return; }
      siteNavigationDOM_created = true;
      

    
     console.log( "navigationPaths =" , navigationPaths  );

                  renderNavigationTree(  
                    siteNavigationData,
                       document.querySelector("#navig_content"),
                  
                     {
                        currentPageId: "pipeline-search",
                        onNavigate(node) {
                             const collection = node.collection; 
                             const slug = node.path;
                            
                              console.log("NAVIGATE:", node);
                             let fullPath = `/${ collection}/${ slug}`;
                             if (collection === "demos"){ 
                                fullPath ="/";
                             }


                             history.pushState({},"",fullPath);
 
                             console.log("fullPath:", fullPath);

                             const currentDatasetPage = document.body.dataset.page;
                              // defines inititator
                             if ( currentDatasetPage === "demo"){ 
                               window.location.href = fullPath;
                                return;
                             }
 
                             if (collection === "demos"){   // defines destination
                               
                                   window.location.href = "/";// fullPath;
                             }else{ 
                                  updatePage({ collection, slug });
                             }
 
                            
                        
                        }
                     });

     
                 navig_container.classList.remove("panel-hidden");
                 final_traitList.classList.remove("panel-hidden");


} 
export function getCurrentRoute() {

    const parts = window.location.pathname
        .split("/")
        .filter(Boolean);

    return {

        collection: parts[0] || "guide",

        slug: parts[1] || "include-operator"

    };

}
 