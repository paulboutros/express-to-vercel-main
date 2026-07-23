export default class PanelToggle {

    constructor(){

        this.button = document.getElementById("panelToggle");

        this.panel = document.getElementById("column1");

        this.button.addEventListener("click",()=>{

            this.toggle();

        });

    }

    toggle(){

        this.panel.classList.toggle("panel-hidden");

    }

    open(){

        this.panel.classList.remove("panel-hidden");

    }

    close(){

        this.panel.classList.add("panel-hidden");

    }

}