 

 
class FeatureState {
  constructor({ 
     traitCounter_Data = null,
     getFirstInSet = null, 
     getALL_NFTIDS = null,
     nameArg ="defaultName"} = {}  ) {

    this.name = nameArg,
    this.traitCounter_Data = traitCounter_Data;
    this.getFirstInSet = getFirstInSet;
    this.getALL_NFTIDS = getALL_NFTIDS;

    this.activeTraitUI = new Map();
    this.activeTraits = new Map();

    this.activeFilterMap_IDS = [];
    this.activeFilterMap_IDBASE = []; // used for main configuration (non absolute) grid
    this.activeFilterMap = new Map(); // used for Absolute grid

    this.NFTSearchResults = []; // later: populated from search bar

    this.gridMode = Object.freeze({
      ABSOLUTE: "ABSOLUTE",
      BATCH: "BATCH"
    });

    this.filterMode = "AND";
    this.filterModeABS = "AND";

    this.gridRenderMode = "unSet";
    this.queryMode = "TRAIT_SEARCH"; // default



   
   
  }

  QueryState = {

    includedIdsSet: new Set(),
    excludedIdsSet: new Set(),
    includedValueIdsSet: new Set(),
    exclusiveValueIdsSet: new Set(),
    exclusiveRuleSets:[],

    ALL_NFTIDS : ( ) => { this.getALL_NFTIDS()  },

    Mode:null,
    
    setMode(valueArg){
         this.Mode = valueArg;
     }

   } 



   setQueryMode(arg) {
    this.queryMode = arg;
  }

  getQueryMode() {
    return this.queryMode;
  }

  reset() {
    this.activeTraitUI = new Map();
    this.activeTraits = new Map();
    this.activeFilterMap_IDS = [];
    this.activeFilterMap_IDBASE = [];
    this.activeFilterMap = new Map(); // used for Absolute grid
    this.NFTSearchResults = []; // later: populated from search bar
  }

  set_gridRenderMode(mode) {
    this.gridRenderMode = mode;
  }

  get_gridRenderMode() {
    return this.gridRenderMode;
  }

  get_filterModeABS() {
    return this.filterModeABS;
  }

   on_clearAllSearchQuery(){ 
           this.clearAllFilters();
           this.restore_nftFilter_from_activeTraitUI( this.activeTraitUI  );
  
  }
 
   applyTraitFilter( traitType, value, ids , savedKey) {
   let key ;
  
  if (!savedKey){ 
     key = `${traitType}::${value}`;
  }else{ 
      key = savedKey;
  }
 
  if (!this.activeTraits.has(key)) {
       this.activeTraits.set(key, new Set(ids));
  }
   
 }

  rebuildFiltersFromUI() {
    // traitCounter_Data = get_rarityTraitCount();
    this.activeTraits.clear();
    for (const [traitType, value] of this.activeTraitUI.entries()) {
         const ids = traitCounter_Data[traitType][value];
    
         this.applyTraitFilter(traitType, value, ids, null);
    }
   }


  set_filterModeABS(valueArg) {
     console.log("set_filterModeABS(valueArg)", valueArg);
    this.filterModeABS = valueArg;
    return { filterModeABS: valueArg };
  }

  get_activeFilterMap_IDS() {
    return this.activeFilterMap_IDS;
  }

  get_VideoFilterObject() {
    let sheetTitle = "";

    for (const [key, nftSet] of this.activeTraits.entries()) {
      sheetTitle += key + " ";
    }

    return {
      filterModeABS: this.filterModeABS,
      activeFilterMap_IDS: this.activeFilterMap_IDS,
      activeTraitUI_toArray: this.buildVideoFilterObject(this.activeTraitUI),
      queryMode: this.getQueryMode(),
      sheetTitle
    };
  }

  serializeActiveTraitUI() {
    const list = [];

    for (const [traitKey, values] of this.activeTraitUI.entries()) {
      for (const value of values) {
        list.push({ traitKey, value });
      }
    }

    return list;
  }

  buildVideoFilterObject(activeTraitUI) {
    const filter = {};

    for (const [traitType, valueSet] of activeTraitUI.entries()) {
      filter[traitType] = Array.from(valueSet);
    }

    return filter;
  }

  

  getTraitUIResult() {
    return {
      // activeTraitUI: mapSetToObject(this.activeTraitUI),
      pills: this.serializeActiveTraitUI()
      // activeTraitsData: serializeActiveTraitUI(UIstate.activeTraits)
    };
  }

  setGeneralFilterMode() {
    this.activeTraits.clear();
    this.activeFilterMap.clear();
  }

   restore_nftFilter_from_activeTraitUI( activeTraitUI ) { 
      for (const [traitType, valueSet] of activeTraitUI.entries()) {

            for (const value of valueSet) {

                const ids = this.traitCounter_Data?.[traitType]?.[value] || [];
                this.activeFilterMap_IDS.push(ids)
            
                for (let index = 0; index < ids.length; index++) {
                    
                        var id = ids[index] ;//#3200
                        var idBase =  getFirstInSet(id); // getFirstInSet(id);
                        this.activeFilterMap.set(id, { id: id, idBase: idBase });
                    
                }
                this.rebuildactiveFilterMap_IDBASE_fromMap();
                this.rebuildactiveFilterMap_IDS_fromMap(  );
            
            }
    }
 
}



  clearAllFilters() {
    this.activeFilterMap.clear();
    this.activeFilterMap_IDS.length = 0;
    this.activeFilterMap_IDBASE.length = 0;

    this.set_gridRenderMode(this.gridMode.ABSOLUTE);

    console.log("add call back to replace: window.updateGrid()");
    // if (window.updateGrid) window.updateGrid();
   } 
 
  rebuildactiveFilterMap_IDS_fromMap() {
     this.activeFilterMap_IDS.length = 0;
     this.activeFilterMap.forEach( (entry) => {
         

        if (this.activeFilterMap_IDS.indexOf( entry.id ) === -1) {
            this.activeFilterMap_IDS.push( entry.id );
        }
    });
  } 

  rebuildactiveFilterMap_IDBASE_fromMap() {
    this.activeFilterMap_IDBASE.length = 0;

    this.activeFilterMap.forEach( (entry) => {
        var idBase = entry.idBase;
 

        if (this.activeFilterMap_IDBASE.indexOf(idBase) === -1) {
            this.activeFilterMap_IDBASE.push(idBase);
        }
    });
   }



}

module.exports = { FeatureState };
  

function safeFileName(str) {
    return str
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]/g, "");
}

function sanitizeText(str) {
    return str
        .replace(/\r?\n/g, " ")  // remove line breaks
        .trim();
}

  
