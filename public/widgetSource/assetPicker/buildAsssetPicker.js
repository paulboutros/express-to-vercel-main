// ==============================
// Pattern Editor   
// ==============================
 

 
 import { AssetPicker } from"./AssetPicker.js" ;
  import { HorizontalSelector } from"./horizontalSelector.js" ;
 //import  { getTab01, buildMetaUI} from "./layoutElement.js" ;

// should be provided by client
/*
 import {   get_assetPath  } from "./services/writeServices.js" ;
 import { loadAssets  } from"./services/overrideAssets.js" ;
*/

 
//const saveLive = true;
let tiersSelector={};


let picker; // asset picker
 

let asset_are_loaded = false;
  
/*
 getTab01();
  */
 
 
// ------------------------------
// Config
// ------------------------------
 

 
let weaponAssets =[];
let shieldAssets =[];
let maskAssets   = [];
 
    
 let weaponShieldcombo = filemanager.weaponShieldcombo.load();   // JSON.parse(fs.readFileSync( core.PATH.weaponShi eldcomboPATH   , "utf8"));
 
//let traitCounterLength = filemanager.traitCounterLength.load();//  get_rarityTraitLength();  //   core.PATH.getData(core.PATH.traitCounterLengthPATH ); 

let tiersCount = filemanager.tiersCount.load(); //core.PATH.getData(core.PATH.getPath("tiersCount.json", scriptType.JSONDATA ) );

 
 
 
const traitOverrideNames = filemanager.traitOverrideNames.load();
 // JSON.parse(fs.readFileSync( core.PATH.traitOv errideNamesPATH, "utf8"));
 
  
  
function get_asset(type){

      switch (type) {
        case "weapon":  return  weaponAssets;
        case "shield":  return  shieldAssets;
        case "mask"  :  return  maskAssets;
             
          
      }


}
  

export function getTiersTab( type , argObj  ){
  
  const keyType  = type.toUpperCase();
 
  const tierOptions = [
    { id: "ALL", label: "All" },
    ... Object.entries(tiersCount[keyType]).map(([tier, data]) => ({
        id: tier,
        label: `${tier} (${data.currentCount})`,
        range: data.range,
        target: data.targetCount,
         current: data.currentCount
    }))
  ];
  

   tiersSelector[type] = new HorizontalSelector({
      root: argObj.root,
    container:  argObj.selectorContainer,// document.getElementById("myUIContainer"), //"tierTabs"
    options: tierOptions ,
    defaultValue: "ALL",

    onChange: (tierName) => {
      if (tierName === "ALL") {
          getAssetPicker( argObj ).render(type); // no filter
          return;
      }
         const allowedNames = Object.keys(tiersCount[keyType][tierName].content
         );
    
        getAssetPicker( argObj ).renderFiltered(  type , allowedNames);
    }
});
 
 //console.log( "tiers type " , type , "   tiersSelector[type]   = " , tiersSelector[type]);
    return tiersSelector[type];
 }  
 
 
export function getAssetPicker({ 
        root ,
        container,
        instanceName 
     } ){ 


console.log( "picker    "    , picker ) ;



//============

  if ( !asset_are_loaded) { 
       ({ weaponAssets , maskAssets,shieldAssets,
       //   weaponImages, shieldImages ,maskImages,
         // weaponImageNames,shieldImageNames
        } = loadAssets());

      // console.log(   weaponAssets , maskAssets,shieldAssets );
        asset_are_loaded = true;
  }
 
    if (!picker){ 
      picker = new AssetPicker({
          root,
          container, // document.getElementById("assetPickerGrid"),
          getUserAsssetsPath: get_asset,
          getAssetPath: get_assetPath,
        //  cardPath,
          onSelect: ( { asset, index, type } ) =>{ 
                        console.log( " asset picker onselect fucntion:" , 

                            { asset, 
                              index,
                               type ,

                               actionPassed: window.WuliComposer.actions[  instanceName]
                            }
                            
                        ) 
                      window.WuliComposer.actions[ instanceName]( { asset, index, type }  );  
                 }   
          
          



      });
      //  return picker;

    }

    return picker;
 
} 



 