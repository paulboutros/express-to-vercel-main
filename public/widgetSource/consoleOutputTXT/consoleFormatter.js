import {   payloadActions, inputMap, clickMap } from  "./payloadActions.js" ;
 
export function formatConsoleObject(item) {
    const payload = typeof item.payload === "function"
        ? item.payload()
        : (item.payload || {});

    let html = "";

    for (const key in payload) {
        
        html += `<span class="log-tag">${formatKey(key)}:</span> ${formatPayloadValue(key, payload[key])}<br>`;
    }

    if (typeof item.validate === "function") {
        const result = item.validate();

        const icon = result.valid ? "✓" : "✕";
        const cssClass = result.valid ? "status-ok" : "status-warn";

        html += `<span class="${cssClass}">${icon} Current:</span> ${result.value}<br>`;
    }

    return html;
}
 
//see payloadAction.js to edit functionalities triggered by html element ex: weapon = openWeaponGridSelection()

/**
 * see payloadAction.js to edit functionalities triggered by html element ex:
 *  weapon = openWeaponGridSelection()

 *
 * @see {@link NFT_ELECTRON/ui_actions/payloadActions.js}
 * @see {@link openWeaponGridSelection}
 */
function formatPayloadValue(key, value) {
  
      console.log(  "formatPayloadValue", { 

         key, value  , inputMap
      }

      )

    

    if (inputMap[key]) {
        return `<input
                class="payload-input"
                   data-config-group="layoutGrid"
                   data-config-key="${key}"
                   data-session-key="${key}"
                   data-action="${key}"
                id="${key}"
                data-key="${key}"
                type= "number"
                data-value="${value}"
                value="${value}"
            >`
            ;
        
    }





    if (clickMap[key]) {

       return `<span class="clickable-payload" data-action="${clickMap[key]}" data-value="${value}">${value}</span>`;

        

    }

    return value;
}
 
function formatKey(key) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, s => s.toUpperCase());
}
  