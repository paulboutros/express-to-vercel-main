 
import { getDOMregistry } from "../Mainfunctions/DOMregistry.js";
import { getProject, getProjectStore } from "../Mainfunctions/localStorageAccess.js";
import {     layoutArchitectureBranchFlows, renderArchitecture,
             setupArchitectureInteractions, 
             updateLayoutContainerHeight
        } from "./renderArchitecture.js";
import { renderTree } from "./renderTree.js";

 

 
 
 export default class GuideComponent {

    constructor({container = null  }){

        this.container = container;
        this.currentPageData =null;
        this.options=null;


         getDOMregistry().guideComponent=this;  
 
    }

    refresh (currentPageData){
          
          this.show(currentPageData, this.options);

  
          const project = getProject();//.architecture = uploadedPageData;
           project.architecture = currentPageData;
          getProjectStore().save(project);
       

    }

    show(pageData, options={}){
      
       this.options = options;
       this.currentPageData = pageData;

      let html = `

             <div class="guideContent">
                  ${options.hideTopArea ? "": this.topArea(pageData) }
 
        `;

 
         
         let architectureIndex =0;
          for (const section of pageData.sections) {
            
              if (section.type === "architecture" && section.flow) {


                section.architectureIndex = architectureIndex;

                section.flow.filter(el => typeof el !== "string").forEach((flow, index) => {
                    flow.mainNodeIndex = index;
               });

               architectureIndex++;
            }


             if ( options.hideTopArea &&
                section.type === "architecture" ){ 

                 html += this.renderSection(section, options);
             }else{
                // html += this.renderSection(section, options);
             }
             if (!options.hideTopArea){
                  html += this.renderSection(section, options); 
             }

           
        }



        html += `</div>`;

        this.container.innerHTML = html;

 

         setupArchitectureInteractions(this.container , pageData ,
             () => { 
                  this.do_layoutArchitectureBranchFlows( pageData ) 
             }
         )
        
         this.do_layoutArchitectureBranchFlows( pageData );
        
        
        

    }

    topArea(pageData){ 
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

    do_layoutArchitectureBranchFlows(pageData){ 
       
         for (const section of pageData.sections) {

          if (section.type === "architecture" && section.flow) {
           
              section.flow.filter(el => typeof el !== "string").forEach((node, index) => {
 
                 
              if (!node.branches?.length) {return;}

                         
                layoutArchitectureBranchFlows ( this.container, node.branches, node );

              

         });
     
                
           }
           
          
         }




        
        
    }

      
   
    renderSection(section, options={}  ){

        /*
        if (options.componentId){ 
           
            if( section.id !==  options.componentId ){ 
                return ""; 
            }
       }*/


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

 
