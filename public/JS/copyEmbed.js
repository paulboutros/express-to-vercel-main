async function copyEmbedCode(embedUrl) {

    const embedCode = `
<iframe
    src="${embedUrl}"
    title="Wulirocks architecture diagram"
    loading="lazy"
    style="display:block; width:100%; height:100vh; border:none;">
</iframe>`.trim();

    try {

        await navigator.clipboard.writeText(embedCode);

        console.log("Embed code copied:", embedCode);

        return true;

    } catch (error) {

        console.error("Failed to copy embed code:", error);

        return false;

    }

}

export function copyEmbed(data) {

    const embedUrl =
        `${window.location.origin}/${data.collection}/${data.slug}/embed/${data.componentId}`;

    console.log(embedUrl);

    copyEmbedCode(embedUrl);

}

export async function uploadJSON() {

    return new Promise((resolve, reject) => {

        const input =
            document.createElement("input");

        input.type = "file";

        input.accept =
            ".json,application/json";


        input.addEventListener(
            "change",
            async () => {

                const file =
                    input.files?.[0];

                if (!file) {

                    resolve(null);

                    return;

                }


                try {

                    const text =
                        await file.text();


                    const json =
                        JSON.parse(text);


                    console.log(
                        "JSON uploaded:",
                        json
                    );


                    resolve(json);

                }

                catch (error) {

                    console.error(
                        "Failed to load JSON:",
                        error
                    );


                    reject(error);

                }

            }
        );


        input.click();

    });

}


export function downloadJSON(data, filename = "diagram.json") {

    const json =
        JSON.stringify(
            data,
            null,
            2
        );

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}
    

 