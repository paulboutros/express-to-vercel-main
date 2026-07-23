// InfoCard.js

export default class InfoCard {

    constructor(container, title = "", value = "") {

        this.container = container;

        this.root = document.createElement("div");
        this.root.className = "infoCard";

        this.titleEl = document.createElement("div");
        this.titleEl.className = "infoCard-title";

        this.valueEl = document.createElement("div");
        this.valueEl.className = "infoCard-value";

        this.root.appendChild(this.titleEl);
        this.root.appendChild(this.valueEl);

        this.container.appendChild(this.root);

        this.setTitle(title);
        this.setValue(value);

    }

    setTitle(title) {

        this.titleEl.textContent = title;

    }

    setValue(value) {

        this.valueEl.textContent = value;

    }

    set(title, value) {

        this.setTitle(title);
        this.setValue(value);

    }

    show() {

        this.root.style.display = "";

    }

    hide() {

        this.root.style.display = "none";

    }

}