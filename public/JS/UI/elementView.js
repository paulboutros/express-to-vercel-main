export class ElementView {

    constructor(selector, hiddenClass = "panel-hidden") {

        this.elements =
            document.querySelectorAll(selector);

        this.hiddenClass = hiddenClass;

    }

    show() {

        this.elements.forEach(el =>
            el.classList.remove(this.hiddenClass)
        );

    }

    hide() {

        this.elements.forEach(el =>
            el.classList.add(this.hiddenClass)
        );

    }
    toggle() {

        this.elements.forEach(el =>
            el.classList.toggle(this.hiddenClass)
        );

    }

    isVisible() {

        if (this.elements.length === 0) return false;

        return !this.elements[0].classList.contains(this.hiddenClass);

    }
 




}