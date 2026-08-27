export function serializeProject(project) {

    return JSON.stringify(
        {
            format: "wulirocks-project",
            schemaVersion: 1,
            project
        },
        null,
        2
    );
}


export function deserializeProject(json) {

    const record =
        typeof json === "string"
            ? JSON.parse(json)
            : json;

    if (record.format !== "wulirocks-project") {
        throw new Error(
            "Invalid Wulirocks project file"
        );
    }

    if (record.schemaVersion !== 1) {
        throw new Error(
            `Unsupported project schema version: ${record.schemaVersion}`
        );
    }

    return record.project;
}