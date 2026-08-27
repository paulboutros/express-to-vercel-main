export default class ProjectStore {

    constructor(storage) {
        this.storage = storage;
    }

    save(project) {
        return this.storage.save(project);
    }

    load(projectId) {
        return this.storage.load(projectId);
    }

    loadAll() {
        return this.storage.loadAll();
    }

    remove(projectId) {
        return this.storage.remove(projectId);
    }
}