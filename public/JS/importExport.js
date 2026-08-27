import { serializeProject } from "./ProjectSerializer.js";

function exportProject(project) {

    const json =
        serializeProject(project);

    const blob =
        new Blob(
            [json],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download =
        `${project.title || "wulirocks-project"}.json`;

    link.click();

    URL.revokeObjectURL(url);
}

import { deserializeProject } from "./ProjectSerializer.js";

async function importProject(file) {

    const json =
        await file.text();

    const project =
        deserializeProject(json);

    projectStore.save(project);

    return project;
}