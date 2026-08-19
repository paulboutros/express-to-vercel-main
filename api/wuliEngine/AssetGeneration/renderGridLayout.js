


const sharp = require("sharp");
const path = require("path");


 
 
 
const { shared_state }    = require("../STATE/engineState.js");

const { get_traitOverrideNames_invers, 
          get_rarityTraitCount } = require("../storage/writeServices.js");
 

const { createTextBuffer, renderMultilineSvg } = require("./textGeneration");
const { buildObject } = require("../UTILITY/generalUtil2");

//const { createCardFromList } = require("../PSDEDITOR/chartGeneration");


 let layoutData  ; 

let canvasWidth ;
let canvasHeight ;
let rarityTraitCount;
let traitOverrideNames_invers;
async function renderLayout(layout, argObj , reviewSheetData ) {
  
    rarityTraitCount = get_rarityTraitCount();
   traitOverrideNames_invers = get_traitOverrideNames_invers(); 
   const {activeTraits_stringArray , cardToDisplay , assetRoot  } = argObj;
   const DEST_THUMB_500 = assetRoot + "/NFT/thumb500"; 

     const composites = [];

    const canvas ={
        
         background : "#e8e8e8"
    }; 

     const images=  argObj.nftIDS; 

   const crop = buildObject(layout,"crop");
   const grid = buildObject(layout,"grid");
   const padding = buildObject(layout,"padding");

   const cell = buildObject(layout,"cell");
   const card = buildObject(layout,"card");//   card. nftCard.posX ..  card.weaponCard.posX
   
 
  const text = buildObject(layout,"text");//   card.nftCard.posX
   
 
//======================================

 grid.rowLength = Math.ceil(images.length /  argObj.rows);

const rows = Math.ceil(images.length / grid.rowLength);

  canvasWidth =
    padding.left +
    padding.right +
    (grid.rowLength * cell.width) +
    ((grid.rowLength - 1) * grid.spaceX)  ;

  canvasHeight =
    padding.top +
    padding.bottom +
    (rows * cell.height) +
    ((rows - 1) * grid.spaceY) ;


   //canvasWidth = canvasWidth/4;
   //canvasHeight = canvasHeight/4;
    
 
    for (let i = 0; i < images.length; i++) {

        const id = images[i];
      
       
        //console.log( " cardPath =  " ,  cardPath );
        const column = i % grid.rowLength;
        const row = Math.floor(i / grid.rowLength);

        // center seconf row if image do not occuppy full with
        const rowOffset = processAlignment(images, row, cell,  grid);
   
        const x = padding.left +    rowOffset +  column * (cell.width + grid.spaceX);
        const y = padding.top  +                   row *  (cell.height + grid.spaceY);
 
        //==================================   croping and resizing =============================================
        
        const imageFolder = getImagePath(id, DEST_THUMB_500); 
        const buffer = await sharp(
             imageFolder //  path.join(imageFolder, id + ".png")
        )
         // .resize(cell.width, cell.height)
         .toBuffer();
         //=======================================================================================================
         composites.push({
            input: buffer,
            left: x,
            top: y
        });
          

    //  const cardToDisplay = "weapon_and_shield";  "nft_id
     
        let cardPath;
        
        let cardbuffer;
        let shield_cardbuffer;
      //  const NFTmetaData = getMetaDataFromID(id)
      switch (cardToDisplay) {
            case "weapon_and_shield":{
                   
                let NFTequipment = getNFTEquipment( id, rarityTraitCount) ;
                 let WEAPON =  NFTequipment.weapon; 
                 let SHIELD =  NFTequipment.shield; 
                  // let WEAPON = getValue_in_trait_type ( NFTmetaData.attributes, "WEAPON"  ) ;
                  // let SHIELD = getValue_in_trait_type ( NFTmetaData.attributes, "SHIELD"  ) ;

                   const WEAPON_internal = traitOverrideNames_invers.weapon[WEAPON] ;
                     cardPath = getCardFile(assetRoot, "CARDS", WEAPON_internal);
                        cardbuffer = await sharp(
                        cardPath //  path.join(imageFolder, id + ".png")
                    )
                    .resize(160, 120) //50% of original size(320x240)
                    .toBuffer();
                    composites.push({
                        input: cardbuffer,// cardPath,
                         
                        left: x +  card.weapon.posX,
                        top: y  +  card.weapon.posY 
                      
                    });  

               //=============================

               
                   // let SHIELD = getValue_in_trait_type ( NFTmetaData.attributes, "SHIELD"  ) ;

                   const SHIELD_internal = traitOverrideNames_invers.shield[SHIELD] ;
                      cardPath = getCardFile(assetRoot,"CARDS", SHIELD_internal);
                        shield_cardbuffer = await sharp(
                        cardPath //  path.join(imageFolder, id + ".png")
                    )
                    .resize(160, 120) //50% of original size(320x240)
                    .toBuffer();
                    composites.push({
                        input: shield_cardbuffer,// cardPath,
                         
                        left: x +  card.shield.posX,
                        top: y  +  card.shield.posY 
                      
                    });  
 

            }
                
            break;

            case "nft_id":
                       cardPath = getCardFile(assetRoot, "NFTcards",id);
                 
                      cardbuffer = await sharp(
                        cardPath //  path.join(imageFolder, id + ".png")
                    )
                    .resize(160, 60)
                    .toBuffer();
                    composites.push({
                        input: cardbuffer,// cardPath,
                        left: x +  card.nftCard.posX,
                        top: y  +  card.nftCard.posY
                    });  
            break;
        
            default:
            break;
      }
    //==============================  add NFT ID card ================================
       


        
    }
 
      
         let titleBuffer = null;
        if ( activeTraits_stringArray && activeTraits_stringArray.length > 0 ){ 
               titleBuffer = await createTextBuffer(
                //argObj.sheetTitle ,
                 [...activeTraits_stringArray, "["+ argObj.filterModeABS +"]"  ],
                 canvasWidth,
                 (420/2),    // 120+300,// more space for multi-line
                canvasWidth,
                canvasHeight,
                   {
                    position: "absolute",
                    justify: "left",
                    align: "top",
                    color: "#666",

                    fontSize:20 ,//50, // changed

                    marginX: text.multiLine.marginX,
                     marginY: text.multiLine.marginY  // change add +30

                 }, renderMultilineSvg
          ); 

        }else{ 
             // single line
             
               titleBuffer = await createTextBuffer(
                argObj.sheetTitle ,
                canvasWidth,
                60,// 120,
                canvasWidth,
                canvasHeight,
                   {
                    position: "absolute",
                    justify: "center",
                    align: "top",
                    color: "#666",
                    marginX: 30,
                    marginY: 20
                  }
               );  

        }

               
          
           const queryModeBuffer = await createTextBuffer(
                argObj.queryMode ,
                canvasWidth,
                60,// 120,
                canvasWidth,
                canvasHeight,
                   {
                    position: "absolute",
                    justify: "left",
                    align: "top",
                    color: "#666",
                    marginX: 30,
                    marginY: 20
                  }
               );  
       
           const paginationBuffer = await createTextBuffer(
                argObj.pagination ,
                canvasWidth,
                60,// 120,
                canvasWidth,
                canvasHeight,
                   {
                    position: "absolute",
                    justify: "right",
                    align: "top",
                    color: "#666",
                    marginX: 30,
                    marginY: 20
                  }
               );  
 
          
           const footer = await createTextBuffer(
                "Generated by the Wulirocks Collection Engine. Artwork IDs shown. NFT Token IDs are assigned at mint.",
                canvasWidth, // box width
                40,// 80, // box height
                  canvasWidth,
                 canvasHeight,
                {
                    position: "absolute",
                    justify: "center",
                    align: "bottom",
                    fontSize: 22,//44,
                    color: "#666",
                    marginX: 30,
                    marginY: 20
                }
            ) ;

          
      composites.push(queryModeBuffer);
         composites.push(paginationBuffer);    
         composites.push(footer);
          
        composites.push(titleBuffer); 

       const flattenedBuffer = await sharp({
         create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 4,
            background: canvas.background
        }

        })
        .composite(composites)
         
         .png() // .jpeg({ quality: 75 })
        .toBuffer();

        const jpegBuffer = await sharp(flattenedBuffer)
            .resize({
                width: 1200,// 1500,
                fit: "inside",
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();
        // display on browser:

         //const blob = new Blob([jpegBuffer], { type: "image/jpeg" });

         if (shared_state.currentPreviewURL) {
             //  URL.revokeObjectURL( shared_state.currentPreviewURL );
         }

  
         // let objUrl = URL.createObjectURL(blob);
         // reviewSheetData[ argObj.fileName].currentPreviewURL = objUrl
 
          shared_state.currentPreviewURLList.push( jpegBuffer);
         /*
         const preview = document.getElementById("mainSlotA");
         const img = document.createElement("img");
              img.src = shared_state.currentPreviewURL;
             preview.appendChild(img);
             */
    
 //  }
       
    

}
 

function processAlignment(images, row, cell,  grid){ 

    const firstIndex = row * grid.rowLength;

const imagesInRow = Math.min(
    grid.rowLength,
    images.length - firstIndex
);

const maxRowWidth =
    grid.rowLength * cell.width +
    (grid.rowLength - 1) * grid.spaceX;

const rowWidth =
    imagesInRow * cell.width +
    (imagesInRow - 1) * grid.spaceX;

let rowOffset = 0;

// For now, center only
rowOffset = (maxRowWidth - rowWidth) / 2;
 return rowOffset;
}
 
 
function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getImagePath(id, DEST_THUMB_500 ) { 

     return  path.join(DEST_THUMB_500, id + ".webp");//".png"
}   


function getNFTEquipment(nftId, rarityData) {

    nftId = Number(nftId);

    let weapon = null;
    let shield = null;

    for (const [name, ids] of Object.entries(rarityData.WEAPON || {})) {
        if (ids.includes(nftId)) {
            weapon = name;
            break;
        }
    }

    for (const [name, ids] of Object.entries(rarityData.SHIELD || {})) {
        if (ids.includes(nftId)) {
            shield = name;
            break;
        }
    }

    return { weapon, shield };
}

function getCardFile( assetRoot, cardType , name_internal  ){ 


      const pathResolved =  path.join( assetRoot , cardType, (name_internal + ".png") ); 
   //  console.log( " pathResolved  === "  , pathResolved );
     return pathResolved;
}

module.exports = {
     
    renderLayout
};