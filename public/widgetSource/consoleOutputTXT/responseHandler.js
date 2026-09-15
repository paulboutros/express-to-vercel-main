 

//const { eventBus } = require("../eventBus");

export function handleConsoleResponse(data) {

   // suggestAction("PlaceNFTCard");
      //return;

    
     clearSuggestedActions();
 
      console.log( "handleConsoleResponse response data = "  , data)

    if (!data.suggestedAction) {
        return;
    }

    suggestAction(data.suggestedAction);
}



function suggestAction(toolName) {
 
    const element = document.querySelector(`[data-tool="${toolName}"]`);
    console.log( " toolName = "  , toolName)
    if (!element) return;

      element.classList.add("suggestedAction");

      //eventBus.on( eventBus.eventNames.EVENT_responseHander_suggest, () => {
        eventBus.emit( eventBus.eventNames.EVENT_responseHander_suggest);
      
    
}
function clearSuggestedActions() {


   
    document.querySelectorAll(".suggestedAction").forEach(function(el) {
        el.classList.remove("suggestedAction");
    });
}
 

 