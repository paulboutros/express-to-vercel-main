class TraitSelectorPanel {

    constructor(options = {}) {

        this.container = options.container;

        this.onAdd = options.onAdd || (() => {});

        this.panel_ignored_traits = options.panel_ignored_traits || [];

        this.ignoreLabel = options.ignoreLabel || "(ignore)";
        this.buttonLabel = options.buttonLabel || "+";

        this.classNames = {

            block: "trait-block",
            label: "trait-label",
            row: "trait-row",
            button: "trait-toggle-btn",

            ...(options.classNames || {})
        };
    }

    render(traitData) {

        this.container.innerHTML = "";

        Object.entries(traitData).forEach(([traitKey, values]) => {


           if (this.panel_ignored_traits.includes(traitKey) ){
                return;
           }

            const block = document.createElement("div");
            block.className = this.classNames.block;

            const label = document.createElement("label");
            label.className = this.classNames.label;
            label.textContent =
                `${traitKey} (${Object.keys(values).length})`;

            const row = document.createElement("div");
            row.className = this.classNames.row;

            const select = document.createElement("select");

            select.appendChild(
                new Option(this.ignoreLabel, "")
            );

            Object.entries(values)
                .sort((a, b) => a[1].length - b[1].length)
                .forEach(([valueName, ids]) => {

                    select.appendChild(

                        new Option(
                            `${valueName} (${ids.length})`,
                            valueName
                        )

                    );

                });

            const addBtn = document.createElement("button");

            addBtn.textContent = this.buttonLabel;
            addBtn.className = this.classNames.button;

            addBtn.addEventListener("click", () => {

                if (!select.value) return;

                this.onAdd({

                    traitKey,
                    value: select.value,
                    ids: values[select.value],
                    select

                });

            });

            row.append(select, addBtn);
            block.append(label, row);

            this.container.appendChild(block);

        });

    }

}

 export default TraitSelectorPanel;
 //module.exports =TraitSelectorPanel;