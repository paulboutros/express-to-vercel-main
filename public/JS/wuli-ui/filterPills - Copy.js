 

   const UIstate ={ // may be used locally for webclient.. 
     activeTraitUI : new Map() ,
     activeTraits : new Map() 
}
 

export function call_addTrait_inUI( traitKey, value , ids ) { 
     
  let prop = traitKey;

    console.log(  "call traitKey = " ,  traitKey  )
  // --- UI memory (OR-safe) ---
  if (!UIstate.activeTraitUI.has(traitKey)) {
       UIstate.activeTraitUI.set(traitKey, new Set());
  }

  const set = UIstate.activeTraitUI.get(traitKey);
  if (set.has(value)) return; // avoid duplicates
      set.add(value);
 
  // --- filter logic ---
      applyTraitFilter(prop, value, ids);

   //   if ( updateActiveTraitBar ){ 
     const activeTraitUI = mapSetToObject( UIstate.activeTraitUI );

   console.log(  "call UIstate.activeTraitUI  = " ,  UIstate.activeTraitUI   );
   console.log(  "\n call map=>obj activeTraitUI  = " ,      activeTraitUI   );


   const serialobj = serializeActiveTraitUI( UIstate.activeTraitUI )
   console.log(  "\n call serializeActiveTraitUI  = " ,      serialobj   );
 

   updateActiveTraitBar(   activeTraitUI ,  removeActiveTrait  );// contains or full DOM
     
    
 
   return {  activeTraitUI:activeTraitUI , 
             pills:      serialobj   // can be converted from json to pills
         }
}

export function updateActiveTraitBar(activeTraitUI, onRemoveTrait) {
  const bar = document.getElementById("activeTraitBar");
  if (!bar) return;

  bar.innerHTML = "";

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
 

export function applyTraitFilter(traitType, value, ids , savedKey) {
   let key ;
  
  if (!savedKey){ 
    key = `${traitType}::${value}`;
  }else{ 
    key = savedKey;
  }
 
  if (!UIstate.activeTraits.has(key)) {
       UIstate.activeTraits.set(key, new Set(ids));
  }
   console.log("  UIstate.activeTraits :",  UIstate.activeTraits   );
    
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

  for (const [traitKey, values] of  TraitUI.entries()) {
    for (const value of values) {
      list.push({ traitKey, value });
    }
  }

  return list;
}
 

 function removeActiveTrait( traitType, value ) {
   const key = `${traitType}::${value}`;

  // Remove from filter map
     UIstate.activeTraits.delete(key);

  // Remove from UI memory
  if (  UIstate.activeTraitUI.has(traitType)) {
    const set =  UIstate.activeTraitUI.get(traitType);
    set.delete(value);           // remove only this value
    if (set.size === 0) {
       UIstate.activeTraitUI.delete(traitType); // clean up if no more values
    }
  }
 
        //rebuildActiveFilterMap(); Electron logic
      // if (window &&  window.updateGrid) Electron  window.updateGrid();


    const activeTraitUI = mapSetToObject( UIstate.activeTraitUI );
     updateActiveTraitBar(   activeTraitUI,  removeActiveTrait );  // DOM
   
   
  }


 
