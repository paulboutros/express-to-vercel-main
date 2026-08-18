//It's becoming a live parser visualization.
/*
I think that's where the time spent polishing this component pays off.
 Every improvement here simultaneously reduces documentation,
  reduces user confusion, increases trust, and makes the system feel intelligent—all
   without adding another dialog or help page.
    That's an unusually high return on refinement effort.
*/

const TOKEN = {

    //--------------------------------------------------
    // Lexer
    //--------------------------------------------------

    COMPLETE_PRODUCER: "COMPLETE_PRODUCER",
    PARTIAL_PRODUCER:  "PARTIAL_PRODUCER",

    //--------------------------------------------------
    // Grammar
    //--------------------------------------------------

    TRAIT:             "TRAIT",
    VALUE:             "VALUE",
    SEPARATOR:         "SEPARATOR",

    //--------------------------------------------------
    // Future
    //--------------------------------------------------

    MODIFIER:          "MODIFIER",
    OPEN_BRACKET:      "OPEN_BRACKET",
    CLOSE_BRACKET:     "CLOSE_BRACKET",

    //--------------------------------------------------
    // Generic
    //--------------------------------------------------

    SPACE:             "SPACE",
    UNKNOWN:           "UNKNOWN",
    EOF:               "EOF"

};



 
export default class QueryAssistant {
 /*
    constructor(container){
 
        this.container = container;

        this.onErrorClicked = null
        this.onCorrection = null;
  
 
        this.container.addEventListener("click", (e) => {
        const node = e.target.closest(".assistantPreview");

        if (!node) return;
         
           this.onErrorClicked({
              block: this.blocks[Number(node.dataset.blockId)],
              anchor: node
           });

       });
 
        
    }
  */

     
  constructor(container){

        // Outer wrapper supplied by QueryBox
        this.root = container;

        // Create scrolling content layer
        this.container = document.createElement("div");
        this.container.className = "queryAssistantContent";
        this.container.id = "queryAssistantContent";

        

        this.root.innerHTML = "";
        this.root.appendChild(this.container);

        this.onErrorClicked = null;
        this.onCorrection = null;

        this.container.addEventListener("click", (e) => {

            const node = e.target.closest(".assistantPreview");

            if (!node) return;

            const blockId = Number(node.dataset.blockId);
            const block = this.blocks.find(b => b.blockId === blockId);
                
 
            if (!block) return;

            if (this.onErrorClicked) {
                 this.onErrorClicked({ block, anchor: node});
             }

        });

    }
  



    show(queryResult){
 
        let valid = true;
         for (let index = 0; index < queryResult.blocks.length; index++) {
             const block = queryResult.blocks[index];

            // if (!error.valid){ valid = false }
        }
     

     this.renderBlocks(queryResult.blocks);
        console.log("================================== "  );

    }

    hide(){

         this.container.innerHTML = "";
         this.container.classList.remove("visible");

    }
 
      
renderBlocks(blocks){

    this.blocks = blocks;

    this.container.innerHTML = "";

    blocks.forEach((block) => {

        this.container.appendChild(

            this.renderBlock(block)

        );

    });

}
renderBlock(block){

    const div = document.createElement("div");

    div.className = "assistantError";
    div.innerHTML = `<div class="assistantPreview" data-block-id="${block.blockId}">${this.formatBlock(block)}</div>`;
     
    return div;

}
     
 
 //+v[      HEAD    :[  Wolf ,   red    ]]-v[HEAD:[re]] e
formatBlock (block) {

    let html = "";

    for (const token of block.tokens) {

        let cssClass = "";

        switch (token.type) {

            //--------------------------------------------------
            // Producer
            //--------------------------------------------------

            case TOKEN.COMPLETE_PRODUCER:
            case TOKEN.PARTIAL_PRODUCER:

                cssClass = "producerToken";
                break;

            //--------------------------------------------------
            // Trait
            //--------------------------------------------------

            case TOKEN.TRAIT:

                cssClass =
                     block.valid //  token.valid
                        ? "traitValid"
                        : "traitError";

                         

                break;

            //--------------------------------------------------
            // Value
            //--------------------------------------------------

            case TOKEN.VALUE:

                cssClass =
                    token.valid
                        ? "traitValue"
                        : "traitValueError";

                        


                break;

            //--------------------------------------------------
            // Raw / spaces / punctuation
            //--------------------------------------------------

            case TOKEN.RAW:

                html += token.raw;
                continue;

            //--------------------------------------------------
            // Unknown future token
            //--------------------------------------------------

            default:

                html += token.raw;
                continue;

        }
       /*
            html +=
            `<span class="${cssClass}" data-block-id="${block.blockId}" data-token-id="${token.id}">${token.raw}</span>`; 
            */


  html += 
   `<span class="${cssClass}"data-block-id="${block.blockId}"data-token-id="${token.id}"><span class="pipelineAnchor"></span>${token.raw}</span>`;
  }

    return html;

}





getProducerAnchor(blockId){

    return this.container.querySelector(
         `.producerToken[data-block-id="${blockId}"]` 
     );

}

getTraitAnchor(blockId){

    return this.container.querySelector(
         `.traitValid[data-block-id="${blockId}"],
         .traitError[data-block-id="${blockId}"]`

    );

}
getValueAnchor(blockId){
     return this.container.querySelector(
         `.traitValue[data-block-id="${blockId}"]`

    );

}

// traitValue
/*
getAnchor(blockId, cssClass){

    return this.container.querySelector(

        `.${cssClass}[data-block-id="${blockId}"]`

    );
}
*/

getAnchorBytokenID( blockId, tokenId , cssClass){ 

     const token = this.container.querySelector(`.${cssClass}[data-block-id="${blockId}"][data-token-id="${tokenId}"]`);
 
     if (!token) return null;
     return token;
}
getAnchor(blockId, cssClass) {

    const token = this.container.querySelector(`.${cssClass}[data-block-id="${blockId}"]`);
 
     if (!token) return null;
     return token;
   //  return token.querySelector(".pipelineAnchor");

}
 


 
    renderTraitSuggestions(){}
     renderValueSuggestions(){}
     renderWarnings(){}
    renderStatistics(){}

}