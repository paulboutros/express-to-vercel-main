 
class ToggleButton {

    constructor({
        containerId,
        id,
        label = "Toggle",
        className = "ToggleButton",
        values = ["OFF", "ON"],
        initialIndex = 0,
        onChange = null
    }) {

        this.container = document.getElementById(containerId);


        this.id = id;
        this.label = label;
        this.className = className;
        this.values = values;
        this.valueIndex = initialIndex;

        this.onChange = onChange;

        this.buildUI(); 
        this.updateUI();
    }
     buildUI() {
        this.button = document.createElement("button");
        this.button.className = this.className;  
        this.button.id = this.id;
        
        this.button.addEventListener("click", () => {
            this.toggle();
        });

        this.container.appendChild(this.button);
    }

    updateUI() {

        this.button.textContent =  `${this.values[this.valueIndex]}`;
           /* `${this.label}: ${this.values[this.valueIndex]}`;*/

        // Optional default styling for first/second value
        this.button.style.background =
            this.valueIndex === 0 ? "#555" : "#2e8b57";
    }

    toggle() {

        this.valueIndex =
            (this.valueIndex + 1) % this.values.length;

        this.updateUI();

        if (this.onChange) {
            this.onChange(this.getValue());
        }
    }

    setValue(value) {

        const index = this.values.indexOf(value);

        if (index !== -1) {

            this.valueIndex = index;
            this.updateUI();

        }

    }

    getValue() {

        return this.values[this.valueIndex];

    }

    setIndex(index) {

        if (index >= 0 && index < this.values.length) {

            this.valueIndex = index;
            this.updateUI();

        }

    }

    getIndex() {

        return this.valueIndex;

    }

}

export default ToggleButton;
 