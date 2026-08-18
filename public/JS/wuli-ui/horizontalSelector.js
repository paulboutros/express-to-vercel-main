 
export default class HorizontalSelector {
    constructor({
        container,
        options = [],
        defaultValue = null,
        onChange = null
    }) {
        this.container = container;
        this.options = options;
        this.value = defaultValue;
        this.onChange = onChange;
        this.buttons = new Map();

        this.render();
    }

    render() {
        this.container.innerHTML = "";
        this.container.classList.add("horizontal-selector");
        this.buttons.clear();

        this.options.forEach(option => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.value = option.id;

            // -----------------------
            // LABEL
            // -----------------------
            const label = document.createElement("div");
            label.className = "tabLabel";
            label.textContent = option.label;
            button.appendChild(label);



            console.log( " option.current "  , option.current   , " option.target  " , option.target  );
            // -----------------------
            // COUNT (current : target)
            // -----------------------
            if (
                option.current !== undefined &&
                option.target !== undefined &&
                option.id !== "ALL"
            ) {
                const countEl = document.createElement("div");
                countEl.className = "tabCount";
                countEl.textContent = `${option.current} : ${option.target}`;

                // optional state coloring
                if (option.current > option.target) {
                    countEl.classList.add("over");
                } else if (option.current < option.target) {
                    countEl.classList.add("under");
                } else {
                    countEl.classList.add("balanced");
                }

                button.appendChild(countEl);
            }

            // -----------------------
            // RANGE (optional)
            // -----------------------
            if (option.range && option.id !== "ALL") {
                const rangeEl = document.createElement("div");
                rangeEl.className = "tabRange";

                const [min, max] = option.range;
                rangeEl.textContent = this.formatRange(min, max);

                button.appendChild(rangeEl);
            }

            // -----------------------
            // CLICK
            // -----------------------
            button.addEventListener("click", () => {
                this.setValue(option.id);
            });

            this.buttons.set(option.id, button);
            this.container.appendChild(button);
        });

        if (this.value) {
            this.updateUI();
        }
    }

    setValue(value) {
        const isSame = this.value === value;

        // allow re-click ONLY for ALL
        if (isSame && value !== "ALL") return;

        this.value = value;
        this.updateUI();

        if (typeof this.onChange === "function") {
            this.onChange(value);
        }
    }

    updateUI() {
        this.buttons.forEach((button, id) => {
            button.classList.toggle("active", id === this.value);
        });
    }

    getValue() {
        return this.value;
    }

    setOptions(newOptions) {
        this.options = newOptions;
        this.render();
    }

    // -----------------------
    // HELPERS
    // -----------------------
    formatRange(min, max) {
        if (max === Infinity || max >= 10000) {
            return `${min} - ∞`;
        }
        return `${min} - ${max}`;
    }
}
 