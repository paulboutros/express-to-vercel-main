export async function loadMetadataFolder() {

    const folderHandle =
        await window.showDirectoryPicker();

    const collection = {};

    async function scanDirectory(directoryHandle) {

        for await (const [name, handle] of directoryHandle.entries()) {

            if (handle.kind === "directory") {

                await scanDirectory(handle);

                continue;
            }

            if (
                handle.kind === "file" &&
                name.toLowerCase().endsWith(".json")
            ) {

                const file = await handle.getFile();

                const text = await file.text();

                const metadata = JSON.parse(text);

                const id = name.replace(/\.json$/i, "");

                collection[id] = metadata;
            }
        }
    }

    await scanDirectory(folderHandle);

    return collection;
}

export async function loadMetadataFile() {

    const [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: "JSON files",
                accept: {
                    "application/json": [".json"]
                }
            }
        ],
        multiple: false
    });

    const file = await fileHandle.getFile();

    const text = await file.text();

    const metadataCollection = JSON.parse(text);

    return metadataCollection;
}

export function saveMetadataCollection(metadataCollection, filename = "metadataCollection.json") {

    const json = JSON.stringify(metadataCollection, null, 2);

    const blob = new Blob(
        [json],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}



export function metaButtonBlock_init( {containerId = "mainLayoutC"} ={} ){

const blockRender =`
      <button id="loadmetaDataJsonFOLDERButton"> load metadata json folder </button>
      <button id="loadmetaDataJsonFILEButton"> load metadata json file </button>
      <button id="saveButton"> save metadata </button>
      <button id="saveRarity"> save rarity </button>
  `;
  const container = document.getElementById(containerId);
    container.innerHTML =blockRender;
 
const loadmetaDataJsonFOLDERButton = document.getElementById("loadmetaDataJsonFOLDERButton");

   loadmetaDataJsonFOLDERButton.addEventListener("click", async (e) => {
         
    
       const metadataCollection =
           await loadMetadataFolder();
               console.log(metadataCollection);

                 window.metadataCollection = metadataCollection;
            

   });
const loadmetaDataJsonFILEButton = document.getElementById("loadmetaDataJsonFILEButton");
loadmetaDataJsonFILEButton.addEventListener("click", async (e) => {
         
    const metadataCollection = await loadMetadataFile();
  
         window.metadataCollection = metadataCollection;
    const rarityCount =  window.WuliComposer.actions.rebuildRarityCount(metadataCollection);
           window.WuliComposer.actions.registerExistingData(rarityCount);
         // window.WuliComposer.getUIelements().traitPanel.render(rarityCount); 

   });



const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", async (e) => {
         
       saveMetadataCollection( window.metadataCollection); 

   });

   const saveRarity = document.getElementById("saveRarity");

saveRarity.addEventListener("click", async (e) => {
         
       saveMetadataCollection( window.rarityCountResult); 

   });


}
