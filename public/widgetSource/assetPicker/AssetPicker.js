//const { updateCardIfExist } = require("../services/overrideAssets");
//const { fileSrc } = require("../UTILITY/generalUtils");

export  class AssetPicker {
    constructor({
        root,
        container,
        //getAssets,
        getUserAsssetsPath,
        getAssetPath,
        onSelect,
        cardPath = ""
    }) {
        this.root = root;
        this.container =  this.getElement(container), //    container;
        this.getUserAsssetsPath = getUserAsssetsPath;
        this.getAssetPath = getAssetPath;
        this.onSelect = onSelect;
        this.cardPath = cardPath;
        this.selectedElement = null;
    }
     getElement(id) {
        return this.root.querySelector(`#${id}`);
    }
    render(type) {
        const grid = this.container;
        grid.innerHTML = "";

        console.log(" ==== getUserAsssetsPath  " , 
         { // folder , 
          getAssetPath: this.getAssetPath , 
           type} );


        const assets = this.getUserAsssetsPath(type);
        const folder = this.getAssetPath(type);

      console.log(" ==== folder  " , 
         {  folder 
        } );

         assets.forEach((asset, i) => {
           // const item = this.createItem(asset, type, folder);
            const item = this.createItem(asset, i, type, folder);
   

            grid.appendChild(item);
        });
    }

 //==============================================
   renderFiltered(type, allowedNames = []) {
    const grid = this.container;
    grid.innerHTML = "";

    const assets = this.getUserAsssetsPath(type);
    const folder = this.getAssetPath(type);


  console.log(" ==== folder (2)" , 
     {folder ,  
        getAssetPath:  this.getAssetPath } )

    const filtered = [];

    assets.forEach((asset, i) => {
        if (allowedNames.includes(asset.name)) {
            filtered.push({
                asset,
                index: i
            });
        }
    });

    // sort by count (high → low)
    filtered.sort((a, b) => (b.asset.rarityCount || 0) - (a.asset.rarityCount || 0));

    filtered.forEach(({ asset, index }) => {
        const item = this.createItem(asset, index, type, folder);
        grid.appendChild(item);
    });
   }
   
 //==============================================
     
    createItem(asset, index, type, folder) {
    const item = document.createElement("div");
    item.classList.add("pickerItem");


      const imgData = asset.name;// {fileName:  asset.file  , folder:folder  };
       item.dataset.imgData = imgData;// JSON.stringify(imgData);


  //console.log(   "  fileSrc    ===== "  ,   fileSrc  );
    if (!asset.file) {
        item.textContent = "None";
    } else {
        const img = document.createElement("img");
        img.src = fileSrc(folder, asset.file);
        item.appendChild(img);
    }

    if ((type === "weapon" || type === "shield") && Number(asset.rarityCount) > 0) {
        const weaponCards = document.createElement("div");
        weaponCards.classList.add("pickerWeaponChart");
        updateCardIfExist(weaponCards, asset.name, asset.rarityCount  );
        item.appendChild(weaponCards);
    }

    const namebadge = document.createElement("div");
    namebadge.className = "namebadge";
    namebadge.textContent = asset.name;
    item.appendChild(namebadge);

    const badge = document.createElement("div");
    badge.className = "rarityBadge";
    badge.textContent = asset.rarityCount ?? 0;
    item.appendChild(badge);

    item.addEventListener("click", () => {
        this.selectItem(item, asset, index, type);
    });

    return item;
}

selectItem(item, asset, index, type) {
    if (this.selectedElement) {
        this.selectedElement.classList.remove("selected");
    }

    item.classList.add("selected");
    this.selectedElement = item;

     console.log( " CLASS picked index  = "  ,  index );

    if (typeof this.onSelect === "function") {
        this.onSelect({
            asset,
            index,
            type,
            item,
            picker: this
        });
    }
}
 
 
 

}

function fileSrc(folder, filename) {
  return "file://" +  folder +"/"+ filename ;
  //return "file://" + path.join(folder, filename);
} 

 