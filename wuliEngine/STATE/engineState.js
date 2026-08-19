 

 const { getPath } = require('../PATH_REGISTRY/PATH');
   const PATH = require("../PATH_REGISTRY/PATH.js");
const { get_savedFilters } = require('../storage/writeServices');

 

//=============================================================
let weaponShieldcombo  ;
let weaponPat_nftMap  ;
 let masknPat_nftMap ;
 //==================================
  let nft_matching_this_filter=[] ;
   
//=============================================================================
//This is your “brainless router”:  knows nothing, just dispatch
const inputDispatcher = {

    modeHandler: null,

    setModeHandler(handler) {
        this.modeHandler = handler;
    },

    handleKeyDown(e) {

        if (!this.modeHandler) return;

        switch (e.key) {

            case "ArrowRight":
                if (e.repeat) return;
                this.modeHandler.onNext(e);
                break;

            case "ArrowLeft":
                if (e.repeat) return;
                this.modeHandler.onPrev(e);
                break;

            case "Escape":
                this.modeHandler.onEscape?.(e);
                break;
        }
    }
};

const shared_state={ 

     auto_last_saved  :"auto_last_saved",
 
    currentPreviewURLList :[],
    currentPreviewURL : null,
    sheetPreviewwMode : false, // false: save to disk, true: write to buffer
    reviewMode : false,

    exportIndexList_fromFilter : [],
  //  activeTraits : new Map(),
    videoFilter :null
}
 
const filterSavePath =  getPath("savedFilters.json", "JSONDATA"); 
 //==========================================
let exportModeHandler;
//============================================
let internalModeHandler;//
   
//const auto_last_saved = traitGrouping.auto_last_saved;

let activeFilters = [];
let selectedKeys = []; // support multiple selection
let selectedKeysABS = [];// the actual abs  image number 101,102,1253 etc... not idBase
 
function set_activeFilters( value){ activeFilters = value;}
 function clearActiveTraits(){shared_state.activeTraits = new Map();}
 function get_activeFilters (){  return activeFilters;  }
 function set_selectedKeys( value){ selectedKeys = value;}
 function get_selectedKeys (){ return selectedKeys;}
// good for forcing a list selection.. regardless of mode or context... good for forcing specific rendering nftids
function set_selectedKeysABS( value ){selectedKeysABS = value;}
function get_selectedKeysABS(){return selectedKeysABS;}
 
//==========================================================================================
function selectedKeys_splice (  idx, count ){

  console.log(   "  selectedKeys_splice  ");
    selectedKeys.splice(idx, count);

}
function selectedKeys_push ( key ){ 
     selectedKeys.push(key);

}
 
function selectedKeys_clear (){
 
    console.log(   " selectedKeys  ");
    selectedKeys =[];
}
//==========================================================================================
//==========================================================================================
function selectedKeysABS_splice (  idx, count ){
    selectedKeysABS.splice(idx, count);

}
function selectedKeysABS_push ( key ){ 
     selectedKeysABS.push(key);

}
function selectedKeysABS_clear (){
    selectedKeysABS =[];
}
//==========================================================================================
//==========================================================================================


  function removeFrom_ActiveTraits( traitType, value ) {
       const key = `${traitType}::${value}`;
       this.activeTraits.delete(key);
  }

 function removeActiveTrait( traitType, value ) {
   // Remove from filter map
   this.activeTraits.delete(key);
 
    // Remove from UI memory
    if (  this.activeTraitUI.has(traitType)) {
      const set = this.activeTraitUI.get(traitType);
      set.delete(value);           // remove only this value
      if (set.size === 0) {
          this.activeTraitUI.delete(traitType); // clean up if no more values
      }
    }
    
  }

function set_nft_matching_this_filter( value ){

     nft_matching_this_filter =  value;
   
}
function get_nft_matching_this_filter(){

      return  nft_matching_this_filter;
}

 //==========================================================================================
//==========================================================================================



//=========================================================





  function add_activeFilter(filter) {
  const exists = activeFilters.some(f =>
    f.prop === filter.prop &&
    f.value === filter.value &&
    f.inverse === filter.inverse
  );
  if (!exists) {
    activeFilters = [...activeFilters, filter];
  }
}

  function clear_activeFilters() {
  activeFilters = [];
}




 

auto_loadFilterSet( shared_state.auto_last_saved );

function auto_loadFilterSet(name) {

   const fs = require('fs');
  if (!fs.existsSync(filterSavePath)) {
    alert("❌ No saved filter file found.");
    return null;
  }

  try {
    const filterSets = get_savedFilters();//      JSON.parse(fs.readFileSync(filterSavePath, 'utf8'));
 
    
    const selectedSet = filterSets[name];

    set_activeFilters(selectedSet)
   //updateFilterBar(selectedSet);


     console.log('Loaded preset in B:', name);
   //  eventBus.emit('auto_loadFilterSet', selectedSet);



    if (!selectedSet) {
      alert(`❌ Filter set "${name}" not found.`);
      return null;
    }
    return selectedSet;
  } catch (e) {
    alert("❌loadFilterSet: Error reading saved filters: " + e.message);
    return null;
  }
}



// to do: move to grid helper

function buildExpandedPatternMap(nftMap) {
  const expanded = {};

  Object.entries(nftMap).forEach(([baseId, data]) => {
    const base = Number(baseId);

    for (let i = 0; i < 5; i++) {
      expanded[base + i] = {
        patname: data.patname,
        baseId: base,
        offset: data.patOffset
      };
    }
  });

  return expanded;
}



 




module.exports ={

  shared_state, inputDispatcher, exportModeHandler, internalModeHandler,


  clearActiveTraits,

  auto_loadFilterSet,
  // activeFilters ,
   set_activeFilters , 
   get_activeFilters ,

   add_activeFilter,

 //  ===========================
  set_selectedKeys, get_selectedKeys, selectedKeys_splice,selectedKeys_push, selectedKeys_clear ,
 

  set_selectedKeysABS,  get_selectedKeysABS ,selectedKeysABS_splice,  selectedKeysABS_push, selectedKeysABS_clear ,
  
  
   
     buildExpandedPatternMap,


      nft_matching_this_filter ,  
      set_nft_matching_this_filter, get_nft_matching_this_filter


}