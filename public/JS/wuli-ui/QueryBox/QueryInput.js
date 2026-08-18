export default class QueryInput {

    constructor( {inputElement,
                  readQueryState
               }){

        this.el = inputElement;

       
       this.lastKey = null;

        this.onChange = () => {};
        this.onArrowDown = () => {};
        this.onArrowUp = () => {};
        this.onEnter = () => {};
        this.onEscape = () => {};
        this.onFocus = () => {};
        this.onBlur = () => {};
        this.setupInputScrollSync= () => {};
        this.onCaretChanged = () => {};
        this.refreshQueryResult = () => {};

        this.#bind();
    }

    #bind() {


     
                 
        this.el.addEventListener("scroll", () => {
 
               this.setupInputScrollSync();
                // assistant.scrollLeft = input.scrollLeft;

        });
        this.el.addEventListener("click", () => {
                 // const raw = this.getValue();

                // const caret = this.getCaret();
                //   this.refreshQueryResult( {raw: raw, caret}); 
                                           
              //=================================================
                this.onCaretChanged(
                this.el.selectionStart
             );
             

         }); 

         this.el.addEventListener("keyup", () => {
             this.onCaretChanged(
                this.el.selectionStart
            );

        });
        this.el.addEventListener("input",  () => {
          //   const raw = this.getValue();
          //   await this.refreshQueryResult( raw);


             this.onCaretChanged(
                this.el.selectionStart
            );
            this.onChange(this.value);

        });

        this.el.addEventListener("focus", () => {
            this.onFocus();
        });

        this.el.addEventListener("blur", () => {
            setTimeout(() => this.onBlur(), 150);
        });

        this.el.addEventListener("keydown", e => {

            switch (e.key) {

                case "ArrowDown":
                    e.preventDefault();
                    this.onArrowDown();
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    this.onArrowUp();
                    break;

                case "Enter":
                    this.onEnter();
                    break;

                case "Escape":
                     this.lastKey = "escape";
                    this.onEscape();
                    break;

                    case "Backspace":
                        this.lastKey = "backspace";
                        break;

                    case "Delete":
                        this.lastKey = "delete";
                        break;

                    case " ":
                        this.lastKey = "space";
                        break;

                    default:
                        this.lastKey = "insert";
                        break;

            }

        });

    }
    consumeLastKey() {
       const key = this.lastKey;
       this.lastKey = null;
       return key;
    }
 
    get value() {
        return this.el.value;//.trim();
    }

    //+v[he] +v[HE] +v[sh]
    getValue() {
        return this.el.value;//.trim();
    }

    setValue(value) {
        this.el.value = value;
    }

    focus() {
        this.el.focus();
    }

    getCaret(){

         return this.el.selectionStart;

    }

    setCaret(position){

        this.el.setSelectionRange(position, position);

    }

}