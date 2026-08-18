const UIstate = {
  activeTraitUI: new Map(),
  activeTraits: new Map(),
  activeFilterMap_IDS:[],
  activeFilterMap_suffleIDS:[],
  IDS_Match_Count : 0,

  queryMode:"TRAIT_SEARCH",
  raw:"raw_has_not_been_set" ,
  dna:"undefined_dna",
  cardToDisplay:"nft_id",
  queryData:{},


  filterModeABS:"OR",//treat it as boolean bannish others,than OR/AND

   serializeActivePills:null,

   totalSheetCount:0,
   containsInvalidBlocks:false                                          


};

export function get_UIstate(){  
    return UIstate;
}

// handlers configured once by Electron or web bootstrap
let onRemoveTraitHandler = null;

export function setTraitUIHandlers({ onRemoveTrait } = {}) {
  onRemoveTraitHandler = typeof onRemoveTrait === "function" ? onRemoveTrait : null;
}

export function call_addTrait_inUI(traitKey, value, ids) {
  // --- UI memory ---
  if (!UIstate.activeTraitUI.has(traitKey)) {
    UIstate.activeTraitUI.set(traitKey, new Set());
  }

  const set = UIstate.activeTraitUI.get(traitKey);
  if (set.has(value)) {
    return getTraitUIResult();
  }

  set.add(value);

  // --- local trait/filter memory ---
  applyTraitFilter(traitKey, value, ids);

  renderTraitBar();

  return getTraitUIResult();
}

export function updateActiveTraitBar(activeTraitUI, onRemoveTrait) {
 // const bar = document.getElementById("activeTraitBar");
  const pillsContainerName ="trait-pill-container";
  const bar = document.getElementById(pillsContainerName); // "activeTraitBar" 
  if (!bar) {
       throw new Error(" trait bar element named "+  pillsContainerName  +" does not exist. can not add pills");
   }  

 
  bar.querySelectorAll(".trait-pill").forEach(pill => pill.remove());
 /* bar.innerHTML = "";*/// this works, but we want to add the and/or button in the container

  for (const [traitType, values] of Object.entries(activeTraitUI || {})) {
    for (const value of values) {
      const pill = document.createElement("span");
      pill.className = "trait-pill";
      pill.textContent = `${traitType}: ${value}`;

      const close = document.createElement("button");
      close.textContent = "×";

      close.onclick = () => {
        if (onRemoveTrait) {
          onRemoveTrait(traitType, value);
        }
      };

      pill.appendChild(close);
      bar.appendChild(pill);
    }
  }
}

export function applyTraitFilter(traitType, value, ids, savedKey) {
  const key = savedKey ?? `${traitType}::${value}`;

  if (!UIstate.activeTraits.has(key)) {
    UIstate.activeTraits.set(key, new Set(ids));
  }

  console.log("UIstate.activeTraits =", UIstate.activeTraits);
}

export function removeTraitFromUI(traitType, value) {
  const key = `${traitType}::${value}`;

  // remove from filter memory
  UIstate.activeTraits.delete(key);

  // remove from pill memory
  if (UIstate.activeTraitUI.has(traitType)) {
    const set = UIstate.activeTraitUI.get(traitType);
    set.delete(value);

    
    if (set.size === 0) {
      UIstate.activeTraitUI.delete(traitType);
    }
  }

  renderTraitBar();

  return getTraitUIResult();
}

export function renderTraitBar() {
  const activeTraitUI = mapSetToObject(UIstate.activeTraitUI);

  updateActiveTraitBar(activeTraitUI, (traitType, value) => {
    // always keep local UI state in sync first
    removeTraitFromUI(traitType, value);

    // then let Electron/web do their own side effects
    if (onRemoveTraitHandler) {
      onRemoveTraitHandler(traitType, value, getTraitUIResult());
    }
  });
}

export function getTraitUIResult() {

   UIstate.serializeActivePills = serializeActiveTraitUI(UIstate.activeTraitUI);
  return {
    activeTraitUI: mapSetToObject(UIstate.activeTraitUI),

    pills: UIstate.serializeActivePills // serializeActiveTraitUI(UIstate.activeTraitUI)//,
    //activeTraitsData: serializeActiveTraitUI(UIstate.activeTraits) 
     
  };
}

export function getUIState() {
  return UIstate;
}

export function loadTraitPills(pills = []) {
  UIstate.activeTraitUI = new Map();
  UIstate.activeTraits = new Map();

  pills.forEach(({ traitKey, value }) => {
    if (!UIstate.activeTraitUI.has(traitKey)) {
      UIstate.activeTraitUI.set(traitKey, new Set());
    }
    UIstate.activeTraitUI.get(traitKey).add(value);
  });

  renderTraitBar();
  return getTraitUIResult();
}

function mapSetToObject(map) {
  return Object.fromEntries(
    [...map.entries()].map(([key, value]) => [
      key,
      value instanceof Set ? [...value] : value
    ])
  );
}

function serializeActiveTraitUI(TraitUI) {
  const list = [];

  for (const [traitKey, values] of TraitUI.entries()) {
    for (const value of values) {
      list.push({ traitKey, value });
    }
  }

  return list;
}


//==================================================================================

export function get_VideoFilterObject() {

    // const{ activeTraits, activeFilterMap_IDS, activeTraitUI, queryMode } = clientObj ;
    let sheetTitle = "";
    let activeTraits_stringArray=[];

    for (const [key, nftSet] of  UIstate.activeTraits.entries()) {
      sheetTitle += key + " ";
      activeTraits_stringArray.push(key);
    }

    return {
      filterModeABS:  UIstate.filterModeABS,
      activeFilterMap_IDS:  UIstate.activeFilterMap_IDS,
      activeTraitUI_toArray:  buildVideoFilterObject(),
      queryMode: UIstate.queryMode,
      raw:  UIstate.raw,
      dna:  UIstate.dna,
      queryData : UIstate.queryData,
      sheetTitle,
      activeTraits_stringArray,
      containsInvalidBlocks: UIstate.containsInvalidBlocks,
      
      cardToDisplay: UIstate.cardToDisplay,
    };
  }

/*
export function get_VideoFilterObject() { 
         return   buildVideoFilterObject(UIstate.activeTraitUI);
     };*/


   function  buildVideoFilterObject(activeTraitUI) {
      const filter = {};
            for (const [traitType, valueSet] of UIstate.activeTraitUI.entries()) {
                 filter[traitType] = Array.from(valueSet);
            }
       return filter;
     };



     /*

 function get_VideoFilterObject( clientObj) {

     const{ activeTraits, activeFilterMap_IDS, activeTraitUI, queryMode } = clientObj ;
    let sheetTitle = "";

    for (const [key, nftSet] of  activeTraits.entries()) {
      sheetTitle += key + " ";
    }

    return {
      filterModeABS:  filterModeABS,
      activeFilterMap_IDS:  activeFilterMap_IDS,
      activeTraitUI_toArray:  buildVideoFilterObject( activeTraitUI),
      queryMode: queryMode,
      sheetTitle
    };
  }

  function serializeActiveTraitUI ( activeTraitUI ) {
    const list = [];

    for (const [traitKey, values] of  activeTraitUI.entries()) {
      for (const value of values) {
        list.push({ traitKey, value });
      }
    }

    return list;
  }

  function buildVideoFilterObject(activeTraitUI) {
    const filter = {};

    for (const [traitType, valueSet] of activeTraitUI.entries()) {
      filter[traitType] = Array.from(valueSet);
    }

    return filter;
  }

     */