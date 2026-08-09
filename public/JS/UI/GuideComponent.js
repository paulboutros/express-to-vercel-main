 

 export default class GuideComponent {

    constructor({container = null  }){

        this.container = container;
 
    }

    show(guide){

        let html = `

            <div class="guideContent">

                <div class="guideTitle">
                    ${guide.title}
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

