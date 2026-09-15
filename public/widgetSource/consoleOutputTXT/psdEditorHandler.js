 
//const { save_activeDocData, save_activeDocDataPATH } = require("../services/writeServices");
function save_activeDocDataPATH (){ 

    console.log("replace with online save_activeDocDataPATH ");
}
function setSessionValue (){ 

    console.log("replace with online setSessionValue ");
}

//const { payloadActions } = require("../ui_actions/payloadActions");
//const { setSessionValue, getCache } = require("../UI_/buttonActionRegistry");
 
import { payloadActions } from "./payloadActions.js";
//import { setSessionValue } from "./buttonActionRegistry.js";

export function initPayloadClickHandler(root) {

        //button
        root.addEventListener("click", function (e) {
            const target = e.target.closest(".clickable-payload");
            if (!target) return;

            const action = target.dataset.action;
            const value  = target.dataset.value;

            const fn = payloadActions[action];
             if (typeof fn === "function") {  fn(value);  }
              
            
        });

        
         root.addEventListener("change", function(e) {

                const target = e.target.closest(".payload-input");
                if (!target) return;

                save_activeDocDataPATH(
                    sharedState.getActiveDoc(),
                    {
                        path: ["config", target.dataset.configGroup],
                        value: {
                            [target.dataset.configKey]: target.value
                        }
                    }
                );

                setSessionValue(
                    target.dataset.sessionKey,
                    target.value //  getConfigValue("layoutGrid", target.dataset.configKey )  //
                );

            });


 

}

  