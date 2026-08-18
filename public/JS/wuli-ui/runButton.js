  class RunButton {
    constructor({
         
        container = null,
        containerId = null,
        label = "Run",
        onClick = null
    } = {}) {
        this.container = container || document.getElementById(containerId);
        this.label = label;
        this.onClick = onClick;

        this.buildUI();
    }

    buildUI() {
        this.button = document.createElement("button");
        this.button.textContent = this.label;
       
       this.button.dataset.tool = this.containerId;
       this.button.classList.add("regularButton");


        this.button.addEventListener("click", () => {
            if (this.onClick) {
                this.onClick();
            }
        });

        if (this.container) {
            this.container.appendChild(this.button);
            
        }
    }

    setLabel(text) {
        this.label = text;
        this.button.textContent = text;
    }

    disable() {
        this.button.disabled = true;
    }

    enable() {
        this.button.disabled = false;
    }
}
 export default RunButton;