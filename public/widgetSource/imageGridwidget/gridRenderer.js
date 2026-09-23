 
    console.log( " ==============   grid render script laoded   =====")
 
 //import {FeatureState}  from "../../JS/Features/featureState.js"
     import  {FrameManager}  from  "./FrameManager.js" ;
   import {  shared_state  } from "./sharedState.js" ;

let sessionData ={ 

}
 let root;

   let traitCardPanelContainer ;
   let nftGrid  ;
   let zoomIn  ;
   let zoomOut  ;
   let openNFTMETA ;
   let openNFTfolder ;
   let grid  ;
   let showFivesButton ;
   let frameManager;
   let imgRefs;


   let multiSelectMode;
   let lastClickedIDX;
export function setGridDOM({ root: gridRoot }) {


  console.log(   "  grid  ====   root  =====  ",    gridRoot   );

    root = gridRoot;


     



    traitCardPanelContainer  = getElement('trait-card-panel-container');
   nftGrid   = getElement('nft-grid');
   zoomIn = getElement('zoomIn');
   zoomOut = getElement('zoomOut');
   openNFTMETA= getElement('openNFTMETA');
   openNFTfolder = getElement('openNFTfolder');
   grid = getElement('nft-grid');
   showFivesButton = getElement("showFives");

   //===========================
   zoomIn.addEventListener('click', () => {
    gridCellSize = Math.min(gridCellSize + 20, 500); // max 500px
    updateGridSize( gridCellSize );
   });

  zoomOut.addEventListener('click', () => {
    gridCellSize = Math.max(gridCellSize - 20, 50); // min 50px
    updateGridSize( gridCellSize );
  });

  nftGrid.addEventListener("scroll", () => {
   sessionData.scrollTop = nftGrid.scrollTop;
 });


 //==============================================

 

 
 frameManager = new FrameManager({root});
  
   imgRefs = frameManager.imgRefs ;//  new Map();
  shared_state.internalModeHandler= { 
 

    onNext() {
        nextFrame_function();
        
    },

    onPrev() {
        
          prevFrame_function();
       
    }
};
 
   frameManager.prevFrame.addEventListener('click', () => {
         frameManager.loadNextChunk( -1, populateGrid );
  
   });
 
 
 frameManager.nextFrame.addEventListener('click', () => {
        
      frameManager.loadNextChunk( 1, populateGrid );
   
});
  frameManager.frameUpdate.addEventListener('click', () => {
 
   reloadNFTImage(   get_selectedKeys()[0]   );
 
  });


}
//=======
function getElement(id) {

   const el =  root.querySelector(`#${id}`);
 
    console.log( " ======= el ", el )
    return el;
}


const {    get_activeFilters, 
    
            get_selectedKeys, 
            selectedKeys_splice, selectedKeys_push, selectedKeys_clear ,
             selectedKeysABS_splice, set_selectedKeysABS, 
             get_selectedKeysABS , selectedKeysABS_clear , selectedKeysABS_push,
 
  } = shared_state;

   
 
 //const featState = new FeatureState();
 const imgABSRefs = new Map()
   
 
  let renderedCount = 0;
   
  

//let showConfigPanel= false;// true;
  
let use_gloabal_currentFrame =  true;// so all config displays the same frame (quick visualisation)
//============================================================
  

 
  

let gridCellSize = 150; // default width in px
// Initialize sessionData
 

let mixDataMap;
   


const images = () => grid.querySelectorAll('img'); // helper to get all imgs
   
 
export function populateGrid() {
    
         renderAbsoluteGrid();

        updateGridSize( gridCellSize );
   
   
 }

//window.eventBus = eventBus;
window.populateGrid = populateGrid;
 
 

//=====================================================================
function renderAbsoluteGrid(  ){ 
  
    nftGrid.innerHTML = "";
 
//=============================================================
 
  console. log( "renderAbsoluteGrid: activeFilterMap \n" ,  featState.activeFilterMap);
    if (!featState.activeFilterMap   || featState.activeFilterMap.size === 0   ) {
        return;
    }
 //==============================================================
  
renderedCount=0;
   
  

  let loadAtOnce =0;
 //===========  absolute list from Trait Filter  ================
  var absoluteList  = featState.activeFilterMap ;
 
    absoluteList.forEach(entry => {
       
    loadAtOnce++;
    if ( loadAtOnce <  frameManager.loadingCap[frameManager.lcap].start   || 
         loadAtOnce >  frameManager.loadingCap[frameManager.lcap].end


       ){ return; }  



      renderedCount++;

        const { id, idBase } = entry;

       

        // --- IMAGE ---
        let img = document.createElement("img");
       // img.className = "nft-img";
  
       // img.loading = "lazy";

        const NFToutput = [ idBase , idBase + 9];  
        // 🔧 Adjust path if needed
        img.src = `${WULI_API_URL}/IMG/NFT/thumb500/${id}.webp`
        //  core.PATH.buildImagePathWithCache(  NFToutput , id ); 

    
        
        let imgObj;

       let capOffset = 0; 
           capOffset = frameManager.lcap > 0 ? frameManager.loadingCap[frameManager.lcap-1].start: 0;
       let IDX = capOffset + loadAtOnce -1;


          if (imgABSRefs.has(id)) {
              
              // Reuse existing image reference
              imgObj = imgABSRefs.get(id);
              img = imgObj.img;

          } else {
               // Create new registry entry
                imgObj = {
                  img: img,
                  NFToutput:NFToutput,
                  filePath: `${WULI_API_URL}/IMG/NFT/thumb500/${id}.png`,
                  // core.PATH.buildImagePath(NFToutput, id),  // real filesystem path
                  timestamp: Date.now(),
                  imageNumber: id,
                  IDX:IDX,
                  idBase:idBase
                };

              imgABSRefs.set(id, imgObj);

          }
 

       let frame = id - idBase;
       // --- WRAPPER ---
        const wrapper = document.createElement("div");
              wrapper.classList.add("nft-item");

              const imgData = {idBase:idBase,id:id, frame:frame };
              wrapper.dataset.imgData = JSON.stringify(imgData);

    //=========================================================================================
 

  wrapper.addEventListener("click", (e) => {

    // SHIFT range selection
    if (e.shiftKey) {

        handleShiftSelection(
            IDX,
            idBase,
            img,
            id
        );

        return;
    }

    // CTRL multi-selection
    if (
        multiSelectMode ||
        e.ctrlKey ||
        e.metaKey
    ) {

        toggleSelectionABS(
            idBase,
            img,
            id
        );

         lastClickedIDX =imgABSRefs.get(id).IDX;

        return;
    }

    // Normal click
    selectSingle(
        idBase,
        img,
        id,
        NFToutput  
         
    );
});


 
//=============================================================================
//====================  HOVER POP-UP  INFORMATION ===============================
  
 

      const TraitIDX = document.createElement("div");
          
            TraitIDX.textContent = "IDX:"+ IDX ;

 
  
        // Assemble
        wrapper.appendChild(img);
      
        nftGrid.appendChild(wrapper);
    });
  
     frameManager.isLoadingNextChunk = false;
}
//===================================  ADDjuSt GRID SIZE =========================================
//=================== click selection functions
 

function selectSingle(idBase, img, id, NFToutput  ) {

    
    clearSelection_ABS();
    clearSelection();

    toggleSelectionABS(idBase, img, id);


    lastClickedIDX =  imgABSRefs.get(id).IDX;
}
 
 
 
function prevFrame_function(){
 frameManager.incrementGlobalLocalImage(-1);

  const selectedKeys = get_selectedKeys();
    for (let index = 0; index < selectedKeys.length; index++) {
      const selKey = selectedKeys[index];

          prevFrameFN(   selKey   );
      
    }
 

}

 
function  nextFrame_function(){ 


  console.log( " nextFrame_function " )
    frameManager.  incrementGlobalLocalImage(1);
      
      const selectedKeys = get_selectedKeys();
    for (let index = 0; index < selectedKeys.length; index++) {
      const selKey = selectedKeys[index];

          nextFrameFN(   selKey   );
      
    }

}
  

function updateGridSize( gridCellSizeArg ) {

  gridCellSize = gridCellSizeArg;
  sessionData.gridCellSize = gridCellSize; 

  
  grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridCellSize}px, 1fr))`;
  images().forEach(img => {
    img.style.maxWidth = `${gridCellSize}px`;
  });

   saveSessionData(sessionData);
}





//==================================================


 
/*
function updateSelectedNFTFirstNumbers() {
  selectedNFTFirstNumber = get_selectedKeys().map(key => {
    const nft = configurationdata[key];
    return nft?.NFToutput?.[0];
  }).filter(v => v !== undefined);

   
}*/

// ----------------- SELECTION -----------------
function toggleSelection(key, imgElement) {
  const idx = get_selectedKeys().indexOf(key);

  const nft = configurationdata[key];
  // if == -1. it means it has been added already , so clicking on it will remove it
  if (idx >= 0) {
  
    selectedKeys_splice(idx, 1);
   // selectedKeys.splice(idx, 1);
    imgElement.classList.remove('selected');

  } else {
 
    
    selectedKeys_push(key);
  //  selectedKeys.push(key);
    imgElement.classList.add('selected');

  }

  displayNFT_displayOrder( nft );


  updateSelectedNFTFirstNumbers();
    

  updateTraitPanel( configurationdata , populateGrid );


if ( configurationdata[key].colorSqn === Undefined )return;
  var temp_ONENFT_attributes = null;//  dataProcess.update_final_metaData ( [key]  , imgRefs.get(key).imageLocalNumber );
   traitFilterController.update_final_TraitPanel( 
    get_selectedKeys(),
     configurationdata ,
     imgRefs.get(key).imageNumber,
     traitCounter_Data,
    
    temp_ONENFT_attributes);
     
}

/*
function getKeyFromIDBASE ( idBase  , configurationdata ){
    const key = Object.keys(configurationdata).find(k => {
        const nft = configurationdata[k];
        return nft?.NFToutput?.[0] === idBase;
    });

   return key;

}*/

 function toggleSelectionABS( idBase, imgElement , absID ) {
 
 
    //const key  = getKeyFromIDBASE ( idBase , configurationdata  );
 
  // const idx = get_selectedKeys().indexOf(key);

    const idxABS = get_selectedKeysABS().indexOf(  absID   );

 // const nft = configurationdata[key];


 
  // if == -1. it means it has been added already , so clicking on it will remove it
    //===================================================================================

  if (idxABS >= 0) {
     selectedKeysABS_splice(idxABS, 1);
      imgElement.classList.remove('selected');
   } else {
     selectedKeysABS_push(absID);
      imgElement.classList.add('selected');
   }
 
   if (WuliComposer.actions.updateConsole ){ 
        WuliComposer.actions.updateConsole({
          type: "activeSelection",
          selectedKeys: get_selectedKeysABS()
        });
    }
//================================== UPDATE IPC =============================================
   /*
   ipcRenderer.send("selection-changed",  get_selectedKeysABS()   );
      
     if ( pendingPick.ispending ){ 
      pendingPick.ispending= false;
         const ARG = { 
         command: "NFTgridItemPicked",
         value: get_selectedKeysABS()[0]
      }
       ipcRenderer.send( "NFTgrid:toPSDeditor" ,  ARG  );
     }
     */

     //===================================================================================
     // save for weapon pattern renderer 
     
     saveSessionData(sessionData);
   //===================================================================================

   console.log( "selected = " , { 
       
        selected: get_selectedKeysABS()
   });
if (  get_selectedKeysABS().length > 1 )return;
   //==========================================================

 // displayNFT_displayOrder(nft);


  //updateSelectedNFTFirstNumbers();
     /*
   updateTraitPanel( configurationdata , populateGrid )
  */

  
  
   /*
    update_final_TraitPanelv2(projectPath.internal,
      absID,
      traitCounter_Data,
       traitCardPanelContainer,
        () => {  

           console.log( "make api call or refresh input query ");
         
          // rebuildActiveFilterMap();
           populateGrid();
         }
     );
    */
    
}

function saveSessionData(data){ 

}
 

function clearSelection_ABS() {
  nftGrid.querySelectorAll('img.selected').forEach(img => img.classList.remove('selected'));
 // selectedKeys = [];
 // selectedKeys_clear();
  selectedKeysABS_clear();
}

function clearSelection() {
  nftGrid.querySelectorAll('img.selected').forEach(img => img.classList.remove('selected'));
 // selectedKeys = [];
   selectedKeys_clear();
 // selectedKeysABS_clear();
}
 
 

// ----------------- INIT -----------------
 //updateTraitPanel( configurationdata , populateGrid );
  

function loadMixData(){ 
   

     mixDataMap        = filemanager.headBodyMixMAP.load();// JSON.parse(fs.readFileSync(  headBo dyMixMAP_PATH ));
     reverseMixData    =   filemanager.MixedToSourceMap.load();//       JSON.parse(fs.readFileSync(  MixedTo SourceMap_PATH ));
     

     
}
  

function restoreScrollPosition() {
   
     
    gridCellSize =  sessionData.gridCellSize ; 

    setTimeout(() => {
        
          updateGridSize( gridCellSize );
          nftGrid.scrollTop = sessionData.scrollTop;
        
         
    }, 100); // 50ms wait for layout

   
   
}
 

 function nextFrameFN(key){ 
   
  moveframe( key, 1 );
 }
 function prevFrameFN(key){ 
   
  moveframe( key, -1 );
 }

 

function reloadNFTImage(key) {
    moveframe( key, 0 );
}

function moveframe(key , incr ) {
      featState.setGeneralFilterMode();
     
   
    // Check if the image is registered
    if (!imgRefs.has(key)) {
        console.log("key not found, cannot update");
        return;
    }

    // Get the stored object (NOT the image directly)
    const imgObj = imgRefs.get(key);
    const img = imgObj.img;

    // Update debug prop
    imgObj.something = !imgObj.something;
    

    // Setup NFT image refresh
    const nft = configurationdata[key];
    if (!nft || !nft.NFToutput) return;

   
    const nftId =  nft.NFToutput[0];

    imgObj.imageNumber +=incr;
   
  
    
     if ( imgObj.imageNumber >  nftId+9){ imgObj.imageNumber  = nftId;   }
     if ( imgObj.imageNumber <  nftId){ imgObj.imageNumber  = nftId+9;    }
        
     
     
  if ( !use_gloabal_currentFrame  ){
      imgObj.imageLocalNumber = sessionData.imageLocalNumber = curFrame.textContent = imgObj.imageNumber - nftId; 
   }else{
     
 
   }
  if (  use_gloabal_currentFrame  ){ 
 

     imgObj.imageLocalNumber = sessionData.imageLocalNumber = curFrame.textContent =  global_imageLocalNumber; 
     imgObj.imageNumber = nftId+  global_imageLocalNumber;
        // imgObj.imageNumber = nftId+ imgObj.offSet_imageLocal;
   
       
 }

   

    const newSrc = core.PATH.buildImagePathWithCache(  nft.NFToutput,  imgObj.imageNumber);
    

// ⭐ FLICKER-FREE SWAP ⭐
    const pre = new Image();
    pre.onload = () => {
        img.src = newSrc;       // Swap only after fully loaded → NO FLASH
    };
    pre.src = newSrc;

 
    // Update the object in the map (optional but clean)
    imgRefs.set(key, imgObj);
 
    
    populateGrid();
}
  
 
  
   
 eventBus.on(eventBus.eventNames.EVENT_active_filter_update, 
     (eventObj) => { 
       
      

        Object.assign(featState, eventObj);
   
        featState.rebuildactiveFilterMap_from_IDS();
        featState.rebuildactiveFilterMap_IDBASE_fromMap();
 
       

       populateGrid();
    } 
   ) 



 eventBus.on( eventBus.eventNames.EVENT_widgetLoaded , 
  ({ name }) => {
 
  if (name === "pass_assetPicker_to_client"){ 
 
        window.WuliComposer.actions["getAssetPicker"] =   // PickerOnSelect;
            ({ asset, index, type }) => {
          

        //  refreshQueryResult({raw: raw, caret: raw.length, action: null, command:null});
             
           
           const raw ="+v["+ type.toUpperCase() +":["+ asset.traitName +"]]";
           window.WuliComposer.actions.refreshQueryResult({raw, caret: raw.length, action: null, command:null  });
           
          
          console.log("called from grid renderer:" ,  
         { asset, index, type })


                  // save_pickedAsOverride( activeSlotType, asset.name  );
                  //   const IPC_arg = { command: "assetpickerSelected"  }; 
                 //  sendUpdateToIPC( IPC_arg);
       }
     }
   }
  );

 

 eventBus.on( eventBus.eventNames.EVENT_widgetLoaded , 
  ({ name,   consoleInstance,  uIActionRegistry }) => {
 
     
   ///=======

     if (name !== "register_UIActionRegistry_to_client"){
        
         return; 
      }

     
     
      WuliComposer.actions.updateConsole = ({type, selectedKeys}) => {
        
               consoleInstance
             // UIRegistry.consoleBtnDescriptiontxt
              .refreshBTNdescription(
                  getBtnDescription() ,
                  { callBack:  ()=>{ 
                      window.WuliComposer.actions.setSessionState ( { selectedKeys   }  );
                   }
                 }
            );
        
            
            function getBtnDescription(){ 
                return  uIActionRegistry.messages["activeSelection"]
              //  return window.WuliComposer.instance.buttonHoverMessages["activeSelection"] ;
            }
           
          }
 
 

    
});


   