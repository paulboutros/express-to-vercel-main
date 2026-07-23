 
export default class GridView {

    constructor( {container = null, nftGrid = null, onSheetSelected= null ,SHEET_SIZE=6 } = {} ) {


        this.SHEET_SIZE = SHEET_SIZE;
        this.container = container;
        this.nftGrid = nftGrid;
        this.onSheetSelected = onSheetSelected;

        this.DEST_THUMB = "/IMG/NFT/thumb160/";

        this.activeNFTIds = [];
    }

    setNFTIds(ids) {

        this.activeNFTIds = ids;

    }

    show() {

        this.container.style.display = "block";

        this.render();

    }

    hide() {

        this.container.style.display = "none";

        this.clear();

    }

    clear() {

        this.nftGrid.innerHTML = "";

    }


   selectChunk(sheet){

    this.nftGrid
        .querySelectorAll(".result-chunk")
        .forEach(chunk => chunk.classList.remove("sheet-selected"));

        sheet.classList.add("sheet-selected");

    }
   

    render() {

        this.clear();


        console.log("this.activeNFTIds: " , this.activeNFTIds );
        if (!this.activeNFTIds.length)
            return;

       // let index=0;
       /*
        this.activeNFTIds.forEach((nftID, index) => {

      

            const img = document.createElement("img");
            img.loading = "lazy";
            img.src = `${this.DEST_THUMB}${nftID}.webp`;

           

            const wrapper = document.createElement("div");

            wrapper.classList.add("nft-item");

 

            wrapper.dataset.index = index;
            wrapper.dataset.id = nftID;
            wrapper.addEventListener("mouseenter", () => {
                applyChunkClass(index, "sheet-hover", this.SHEET_SIZE);//  highlightSheet(index); sheet-highlight
            });
            wrapper.addEventListener('click', (e) => { 


                     applyChunkClass(index, "sheet-selected", this.SHEET_SIZE);
                    const chunk = getChunk(index, this.SHEET_SIZE);
                    this.onSheetSelected(chunk.page);

                   //  .sheet-selected

            });




            wrapper.appendChild(img);

            this.nftGrid.appendChild(wrapper);

          //  index++;
        })
*/


 //====================================================================

  for (let i = 0; i < this.activeNFTIds.length; i += this.SHEET_SIZE) {

   // const nftID = this.activeNFTIds[i];
    const sheet = document.createElement("div");
    sheet.classList.add("result-chunk");


     const page = i / this.SHEET_SIZE;
    sheet.dataset.page = page;
    const ids = this.activeNFTIds.slice(i, i + this.SHEET_SIZE);


   sheet.addEventListener("mouseenter", () => {
        sheet.classList.add("sheet-hover");
     });

    sheet.addEventListener("mouseleave", () => {
          sheet.classList.remove("sheet-hover");
     });
     sheet.addEventListener("click", () => {

             this.selectChunk(sheet);
             this.onSheetSelected(  page);

     });



    ids.forEach(id => {

        const wrapper = document.createElement("div");
        wrapper.classList.add("nft-item");

        const img = document.createElement("img");
         img.loading = "lazy";
         img.src = `${this.DEST_THUMB}${id}.webp`;

        

        wrapper.appendChild(img);
        sheet.appendChild(wrapper);
  
    });
    sheet.addEventListener("mouseenter", () => {
               
            });
    sheet.addEventListener('click', (e) => { 
   
   });
 
 

       this.nftGrid.appendChild(sheet);
}

      










    }


    



}


function getChunk(index, chunkSize) {

    const page = Math.floor(index / chunkSize);

    return {

        page,

        start: page * chunkSize,

        end: page * chunkSize + chunkSize - 1

    };

}

function getSheetRange(index, pageSize = 6) {

    const start = Math.floor(index / pageSize) * pageSize;

    return {

        start,
        end: start + pageSize - 1

    };

}
/*
function highlightSheet(index) {

    const { start, end } = getSheetRange(index);

    document
        .querySelectorAll(".nft-item")
        .forEach((item, i) => {

            item.classList.toggle(

                "sheet-highlight",

                i >= start && i <= end

            );

        });

}
*/

function applyClass( className ) {

     

    const items = document.querySelectorAll(".result-chunk");

    items.forEach(item => item.classList.remove(className));

    for (let i = start; i <= end && i < items.length; i++) {
        items[i].classList.add(className);
    }

}


function applyChunkClass(index, className, SHEET_SIZE) {

    const { start, end } = getChunk(index, SHEET_SIZE);

    const items = document.querySelectorAll(".nft-item");

    items.forEach(item => item.classList.remove(className));

    for (let i = start; i <= end && i < items.length; i++) {
        items[i].classList.add(className);
    }

}