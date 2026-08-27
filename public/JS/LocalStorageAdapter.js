const STORAGE_PREFIX = "wulirocks.project.";

export default class LocalStorageAdapter {

    save(project) {

        const now = new Date().toISOString();

        const record = {
            format: "wulirocks-project",
            schemaVersion: 1,

            project: {
                ...project,
                createdAt: project.createdAt || now,
                updatedAt: now
            }
        };

        localStorage.setItem(
            STORAGE_PREFIX + project.id,
            JSON.stringify(record)
        );

        

        return record.project;
    }

    load(projectId) {

        const raw =
            localStorage.getItem(
                STORAGE_PREFIX + projectId
            );

        if (!raw) return null;

        const record = JSON.parse(raw);

        if (record.format !== "wulirocks-project") {
            throw new Error("Invalid Wulirocks project format");
        }

        return record.project;
    }

    loadAll() {

        const projects = [];

        for (let i = 0; i < localStorage.length; i++) {

            const key = localStorage.key(i);

            if (!key?.startsWith(STORAGE_PREFIX)) {
                continue;
            }

            const raw = localStorage.getItem(key);

            if (!raw) continue;

            const record = JSON.parse(raw);

            if (record.format !== "wulirocks-project") {
                continue;
            }

            projects.push(record.project);
        }

        return projects;
    }

    remove(projectId) {

        localStorage.removeItem(
            STORAGE_PREFIX + projectId
        );
    }
}