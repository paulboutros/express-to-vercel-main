//import { getProject, getProjectStore } from "../Mainfunctions/mainFunctions.js";
import {     layoutArchitectureBranchFlows, renderArchitecture,
     setupArchitectureInteractions, 
     updateLayoutContainerHeight
    } from "./renderArchitecture.js";
import { renderTree } from "./renderTree.js";

 

 
 
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


          /*
        for(const section of guide.sections){
             html += this.renderSection(section);
         }*/
         
         let architectureIndex =0;
          for (const section of guide.sections) {
            
              if (section.type === "architecture" && section.flow) {


                section.architectureIndex = architectureIndex;

                section.flow.filter(el => typeof el !== "string").forEach((flow, index) => {
                    flow.mainNodeIndex = index;
               });

               architectureIndex++;
            }

            html += this.renderSection(section);
        }



        html += `</div>`;

        this.container.innerHTML = html;

         setupArchitectureInteractions(this.container , guide ,
             () => { 
                  this.do_layoutArchitectureBranchFlows( guide ) 
             }
         )
        
         this.do_layoutArchitectureBranchFlows( guide );
        
        
        /* setupArchitectureInteractions(this.container , guide);*/

    }

    do_layoutArchitectureBranchFlows(  guide ){ 
       
         for (const section of guide.sections) {

          if (section.type === "architecture" && section.flow) {
           
              section.flow.filter(el => typeof el !== "string").forEach((node, index) => {
 
                 
              if (!node.branches?.length) {return;}

                         
                layoutArchitectureBranchFlows ( this.container, node.branches, node );

              

         });
     
                
           }
           
          
         }




        
        
    }


    renderSection(section, index){

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
        
        /*
         if ( section.id === "archi_01" ){ 
             const project = getProject();
              project.architecture = section;
             getProjectStore().save( project );
         }*/

             return renderArchitecture(this.container, section );

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

 
