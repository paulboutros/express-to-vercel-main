 
class ViewManager {

    constructor() {

        this.views = new Map();

        this.activeView = null;

    }

    register(name, view) {

        this.views.set(name, view);

    }

    getView(name) {

        const view = this.views.get(name);

        if (!view) {

            console.warn(`Unknown view: ${name}`);

            return null;

        }

        return view;

    }

    setInitialView(name) {

        this.showView(name);

    }

    showView(name) {

        const nextView = this.getView(name);

        if (!nextView)
            return;

        if (this.activeView?.hide) {

            this.activeView.hide();

        }

        this.activeView = nextView;

        console.log("activeView:", this.activeView);

        if (this.activeView?.show) {

            this.activeView.show();

        }

    }

    show(name) {

        const view = this.getView(name);

        if (!view)
            return;

        view.show?.();

    }

    hide(name) {

        const view = this.getView(name);

        if (!view)
              return;

        view.hide?.();

    }

    toggle(name) {

        const view = this.getView(name);

        if (!view)
            return;

        view.toggle?.();

    }

    getActiveView() {

        return this.activeView;

    }

}

// we make this an explicit singleton, even though default ESM module are singelton by default.
const viewManager = new ViewManager();
 export default viewManager;