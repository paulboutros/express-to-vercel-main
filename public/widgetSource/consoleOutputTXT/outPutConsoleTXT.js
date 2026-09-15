
import { formatConsoleObject } from "./consoleFormatter.js" ;
import { handleConsoleResponse } from "./responseHandler.js" ;


const TAG_MAP = {
    "[DEV]": "log-dev",
    "[USER]": "log-user",
    "[WARN]": "log-warn",
    "[ERROR]": "log-error",
    "[OK]": "log-ok"
};
function formatLogLine(line) {

    for (const tag in TAG_MAP) {
        if (line.includes(tag)) {

            const cssClass = TAG_MAP[tag];

            const clean = line.replace(tag, "").trim();

            return `<div class="${cssClass}">
                        <span class="log-tag">${tag}</span>
                        <span class="log-msg">${clean}</span>
               </div>`;
        }
    }

    return `<div class="log-line">${line}</div>`;
}


function build_BTN_Description_HTML( item ) {
  if (!item) return "";


  console.log (   "item    =  "   , item    )


    return formatConsoleObject(item);




     const lines = raw.split("\n");

    return lines
        .filter(l => l.trim())
        .map(formatLogLine)
        .join("");

}
 

function buildConsoleHTML(raw) {

    const lines = raw.split("\n");

    return lines
        .filter(l => l.trim())
        .map(formatLogLine)
        .join("");
}


export class OutputConsoleTXT {
    constructor({ 
        root,
        containerId,
         jsonPath,
         editable = false, 
         autoRefresh = true ,
          defaultMsg ="No Data",
           consoleClassName =""
         }) {

          this.root = root;

        console.log( "console class: "  ,  { 
        containerId,
        root
              
        }  )

        this.container = this.getElement(containerId);
          // document.getElementById(containerId);
        this.jsonPath = jsonPath;
        this.editable = editable;
        this.watchTimeout = null;
        this.autoRefresh = autoRefresh;
        this.defaultMsg = defaultMsg;
        this.consoleClassName = consoleClassName;
        

        this.buildUI();
        this.watchFile();
        this.refresh();
        this.refreshBTNdescription();
    }
  
    getElement(id) {
        return this.root.querySelector(`#${id}`);
    }
    buildUI() {
       // this.textarea = document.createElement("textarea");
        this.output = document.createElement("pre");
        this.output.className = this.consoleClassName; // consoleClassName ="output-console";

     //   this.textarea.className = "output-console";
      //  this.textarea.readOnly = !this.editable;

        this.container.appendChild(this.output);
    }

    refresh( raw ) {
       
           
      try {
            this.output.innerHTML  = buildConsoleHTML(raw);
            this.output.scrollTop = this.output.scrollHeight;
 
       } catch (err) {
          this.output.innerHTML = this.defaultMsg;// "Error reading log";
       }
     }
  
   refreshBTNdescription( raw , option = { callBack: ( )=>{}  } ) {
       
            
                  option?.callBack();
           
           
     //  try {
            this.output.innerHTML  = build_BTN_Description_HTML(raw);
            this.output.scrollTop = this.output.scrollHeight;
 
     //  } catch (err) {
       //   this.output.innerHTML = this.defaultMsg;// "Error reading log";
      // }
     }







    watchFile() {

         if ( !this.autoRefresh )return;
        const fs = require("fs");
 
        fs.watch(this.jsonPath, () => {
            clearTimeout(this.watchTimeout);

            this.watchTimeout = setTimeout(() => {

                  
               const raw = fs.readFileSync(this.jsonPath, "utf8");  

                this.refresh(raw);
            }, 100);
        });
    }

    getValue() {
        return this.textarea.value;
    }

    setValue(text) {
        this.textarea.value = text;
    }

    appendConsole(html) {
      this.output.innerHTML += html + "\n";
      this.output.scrollTop = this.output.scrollHeight;
    }

    
    renderConsole(data) {

    setTimeout(() => {
        this.appendConsole("⚠ Missing NFT cards detected\n");
    }, 200);

    setTimeout(() => {
        this.renderMissingBox(data.missingNftCards);
    }, 500);

    const totalDelay = 500 + (data.missingNftCards.length + 2) * 70;

    setTimeout(() => {
        this.appendConsole("\nSuggested action:");
    }, totalDelay);

    setTimeout(() => {
        this.appendConsole(
            '<span class="consoleAction">' +
            data.suggestedAction +
            '</span>'
        );
       }, totalDelay + 180);
    }
 



    renderMissingBox(items) {
    if (!items || !items.length) return;

    const width = 28;
    let delay = 0;
    const step = 70; // milliseconds per line

    this.appendConsole("┌" + "─".repeat(width) + "┐");

    items.forEach((item) => {
        delay += step;

        setTimeout(() => {
            const text = String(item).padEnd(width, " ");
            this.appendConsole("│" + text + "│");
        }, delay);
    });

    delay += step;

    setTimeout(() => {
        this.appendConsole("└" + "─".repeat(width) + "┘");
    }, delay);
}
    

}

    
 