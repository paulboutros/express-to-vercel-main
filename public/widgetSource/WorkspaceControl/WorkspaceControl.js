 
class WorkspaceControl {

    constructor(container, definition = {}) {

        this.container = container;
        this.definition = definition;

        this.render();

        this.container.addEventListener(
            "change",
            event => this.handleChange(event)
        );

        this.container.addEventListener(
            "click",
            event => this.handleClick(event)
        );
    }


    // ============================================================
    // Render
    // ============================================================

    render() {

        this.container.innerHTML = "";

        Object.entries(this.definition).forEach(
            ([key, item]) => {

                this.renderItem(
                    this.container,
                    key,
                    item
                );

            }
        );
    }


    renderItem(parent, key, item) {

        if (item.type === "group") {

            this.renderGroup(
                parent,
                key,
                item
            );

            return;
        }


        if (item.type === "radio") {

            this.renderRadio(
                parent,
                key,
                item
            );

            return;
        }


        if (item.type === "checkbox") {

            this.renderCheckbox(
                parent,
                key,
                item
            );

            return;
        }

    }


    // ============================================================
    // Group
    // ============================================================

    renderGroup(parent, key, item) {

        const group = document.createElement("div");

        group.className = "workspace-control-group";

        group.dataset.control = "group";
        group.dataset.key = key;


        const button =
            document.createElement("button");

        button.className =
            "workspace-control-group-button";

        button.dataset.control = "group-toggle";
        button.dataset.key = key;

        button.textContent =
            item.label || key;


        const children =
            document.createElement("div");

        children.className =
            "workspace-control-children";

        children.dataset.group = key;


        Object.entries(item.children || {})
            .forEach(([childKey, child]) => {

                this.renderItem(
                    children,
                    childKey,
                    child
                );

            });


        group.appendChild(button);
        group.appendChild(children);

        parent.appendChild(group);

    }


    // ============================================================
    // Radio
    // ============================================================

    renderRadio(parent, key, item) {

        const label =
            document.createElement("label");

        label.className =
            "workspace-control-radio";


        const input =
            document.createElement("input");

        input.type = "radio";

        input.name =
            item.group || key;

        input.value =
            item.value ?? key;

        input.checked =
            Boolean(item.checked);


        input.dataset.control = "radio";
        input.dataset.key = key;
        input.dataset.group =
            item.group || "";


        const text =
            document.createElement("span");

        text.textContent =
            item.label || key;


        label.appendChild(input);
        label.appendChild(text);

        parent.appendChild(label);

    }


    // ============================================================
    // Checkbox
    // ============================================================

    renderCheckbox(parent, key, item) {

        const label =
            document.createElement("label");

        label.className =
            "workspace-control-checkbox";


        const input =
            document.createElement("input");

        input.type = "checkbox";

        input.checked =
            Boolean(item.checked);


        input.dataset.control = "checkbox";
        input.dataset.key = key;


        const text =
            document.createElement("span");

        text.textContent =
            item.label || key;


        label.appendChild(input);
        label.appendChild(text);

        parent.appendChild(label);

    }


    // ============================================================
    // Events
    // ============================================================

    handleChange(event) {

        const element =event.target;
            

        const control =element.dataset.control;
            


        if (
            control !== "radio" &&
            control !== "checkbox"
        ) {
            return;
        }


        this.onChange({
            type: control,

            key:
                element.dataset.key,

            group:
                element.dataset.group || null,

            value:
                element.value,

            checked:
                element.checked,

            element
        });

    }


    handleClick(event) {

        const element =
            event.target.closest(
                '[data-control="group-toggle"]'
            );


        if (!element) {
            return;
        }


        const key =
            element.dataset.key;


        const children =
            this.container.querySelector(
                `[data-group="${key}"]`
            );


        if (!children) {
            return;
        }


        const hidden =
            children.hidden;


        children.hidden =
            !hidden;


        element.dataset.open =
            String(hidden);

    }


    // ============================================================
    // Client callback
    // ============================================================

    onChange(data) {

        // Override or assign from outside.

        console.log(
            "WorkspaceControl:",
            data
        );

    }

}
 
 
const workspaceControls = {

    render: {

        type: "group",

        label: "Render",

        children: {

            sheet: {
                type: "radio",
                label: "Sheet",
                value: "sheet",
                group: "render",
                checked: true
            },

            grid: {
                type: "radio",
                label: "Grid",
                value: "grid",
                group: "render"
            }

        }

    },

    rarityCount2: {

        type: "group",

        label: "rarityCount2",

        children: {
            wpsh_visibile: {
                type: "checkbox",
                label: "Visibility",
                value: "visibility"
            },
            weapons: {
                type: "radio",
                label: "Weapons",
                value: "weapon",
                group: "rarityCount2",
                checked: true
            },

            shields: {
                type: "radio",
                label: "Shields",
                value: "shield",
                group: "rarityCount2"
            }

        }

    },

    rarityCount: {

        type: "group",

        label: "Rarity Count",

        children: {

            overrides: {
                type: "checkbox",
                label: "Overrides",
                value: "overrides"
            },
             shields: {
                type: "checkbox",
                label: "Shields",
                value: "shields"
            },
             weapons: {
                type: "checkbox",
                label: "Weapons",
                value: "weapons"
            }

        }

    }

};


function initWorkspaceControl(){ 
    const controls =
    new WorkspaceControl(
        document.getElementById("workspaceControls"),//workspaceControls
        workspaceControls
    );


  controls.onChange = data => {
     console.log(data);
  };

  return controls;
}

 window.eventBus.emit(window.eventBus.eventNames.EVENT_widgetLoaded,{ 
                                    
                                    name: "WorkspaceControl_ready",
                                    initWorkspaceControl 
                                    
                                }
                        ); 
 