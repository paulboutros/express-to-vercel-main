class LayoutManager {

    constructor() {

        this.slots = new Map();
        this.components = new Map();
        this.layouts = new Map();

    }

    registerSlot(name, element) {

        this.slots.set(name, element);

    }

    registerComponent(name, element) {

        this.components.set(name, element);

    }

    registerLayout(name, definition) {

        this.layouts.set(name, definition);

    }

    apply(layoutName) {

        const layout = this.layouts.get(layoutName);

        if (!layout){ 
            
            console.log("layoutName :", layoutName , "has not been registed" );
            return;}

            console.log("APPLY layoutName :", layoutName   ); 

        for (const [componentName, slotName] of Object.entries(layout)) {

            const component = this.components.get(componentName);
            const slot = this.slots.get(slotName);

            if (!component || !slot)
                continue;

            slot.appendChild(component);

        }

    }

}

export default LayoutManager;