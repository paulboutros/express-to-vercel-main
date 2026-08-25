export default class ArchitectureNodeInstance {

    constructor(element) {
        this.element = element;
    }

    setPosition(position) {
         
        this.element.style.position = "absolute";

        if (position.left !== undefined) {
            this.element.style.left =
                position.left;
        }

        if (position.top !== undefined) {
            this.element.style.top =
                position.top;
        }

        if (position.right !== undefined) {
            this.element.style.right =
                position.right;
        }
    }
}