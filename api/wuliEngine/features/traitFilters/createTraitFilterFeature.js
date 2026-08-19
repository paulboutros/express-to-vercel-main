 
const  QueryEngine = require("../../query/QueryEngine.js");
const { build_PART_GROUP_for_JSX, getFirstInSet,  getFirstInSetList, getMetaDataPathFromID } =
 require("../../metadata/MetaDataAPI.js");

const {  
    rebuildactiveFilterMap_IDBASE_fromMap,
    rebuildactiveFilterMap_IDS_fromMap

} = require( "../FeatureState/featureState.js");

const { getMixInfoABS } = require('../../DATA_TRANSFORM/headBodyMixMAP.js');
const { get_rarityTraitCount } = require("../../storage/writeServices");
 
  const wuliDta =   require('../../storage/writeServices');
const { mapSetToObject , pillsArrayToTraitMap} = require("../../UTILITY/generalUtil2");
  let traitCounter_Data = get_rarityTraitCount();
  function getLoadedrarityTraitCount() { 
     return traitCounter_Data;
  }
  
   
  //============================ api response interface  ===============================
  let APIresponse;
  function set_APIresponse(arg){
        APIresponse = arg;
  }
  function get_APIresponse(){
      return APIresponse;
  }
  //====================================================================================

  let featState;
 function get_featState() { 
    return featState
 }
 function set_featState( featState_ARG) { 
     featState = featState_ARG;

    // QueryEngine.set_featState( featState_ARG);
  }

function createTraitFilterFeature(  featStateARG,  options = {}       ) {
  const {
    onTraitAdded = null,
    onStateChanged = null
  } = options;
 
  function addTraitSelection(featStateArg, traitKey, value, ids  ,   activeTraitUI_result_pills ) {
  
     var resultTraitUI =  pillsArrayToTraitMap ( activeTraitUI_result_pills ) ;
 
        featStateArg.activeTraitUI               = resultTraitUI; 
        featStateArg.activeTraitUI_result_pills  = activeTraitUI_result_pills;// for response origin/tracking.

        console.log("addTraitSelection addTraitSelection"  , resultTraitUI  );


    if (!featStateArg.activeTraitUI.has(traitKey)) {
         featStateArg.activeTraitUI.set(traitKey, new Set());
    }

 

   //let result = traitSet.has(value) ;

    /*
    // avoid duplicate UI entries
    if (traitSet.has(value)) {
      return {
        added: false,
        reason: "duplicate",
        traitKey,
        value,
        ids,
       // state: featState.activeTraitUI //       getState()
       
      };
    }
*/
  
   // traitSet.add(value);
 
 
    const payload = {
      added: true,
      traitKey,
      value,
      ids//,
     // activeValuesForTrait: [...traitSet] 
    
    };

   // console.log( " payload   ===========  "  , payload )

   // if (onTraitAdded) 
        onTraitAdded(payload);
    if (onStateChanged) onStateChanged(payload.state);

    return payload;
  }

  return {
    addTraitSelection//, call back function to 
   // getState//,
  //  setState
  };
}

 /*
function applyTraitFilter( traitType, value, ids , savedKey) {
   let key ;
  
  if (!savedKey){ 
     key = `${traitType}::${value}`;
  }else{ 
      key = savedKey;
  }
   

  if (!featState.activeTraits.has(key)) {
       featState.activeTraits.set(key, new Set(ids));s
  }

  
}
 */
// at this point activeTraitUI value is 1 element ex:  "brow boots" .value here is not an array
  

// payload currently use by webclient
 function rebuildActiveFilterMap(argObg) { //traitPayload 
   
  let { featStateArg, serializeActivePills } = argObg;
        set_APIresponse({ 
             activeMap :"empty"
       });
   if (typeof argObg !== "object") { throw new Error("❌ 'featState' must be a valid object");} 

   // console.log( "==========================     argObg :" , argObg     );
   if ( serializeActivePills){ 
          
     var resultTraitUI =  pillsArrayToTraitMap ( serializeActivePills ) ;
 
       featStateArg.activeTraitUI  = resultTraitUI; 
       
       
        
       restore_ActiveTraits_from_activeTraitUI (featStateArg ); //featStateArg.activeTraitUI
    //  console.log( "final activeTraitUI:  rebuildActiveFilterMap rebuilt = " ,  featState.activeTraitUI  );
    }

 //console.log( "rebuildActiveFilterMap: featState   = " ,  featState  );
    if (!featStateArg){ 
       throw new Error("❌ 'featState' must be a valid object");
    } // return;
 
  //  console.log( "final activeTraitUI:   rebuilt = " ,  featState.activeTraitUI  );
   // console.log( "final activeTraitUI:  activeTraits = " , featState.activeTraits  );
 
    featStateArg.activeFilterMap.clear();
    featStateArg.activeFilterMap_IDBASE.length  = 0;
    featStateArg.activeFilterMap_IDS.length     = 0;
 
   // ==========================
   // NFT SEARCH MODE (bypass traits)
   // ==========================
     if ( QueryEngine.applyNFTSearchMode(featStateArg) ) {  return;}
   // ==========================
   // Build working set using intersection logic
   // ==========================
    if (      QueryEngine.evaluateQueryToActiveFilterMap(featStateArg) ) {
       return QueryEngine.get_APIresponse();}
 
   //============================================================================================
   //          basic market place trait dropdown selection with AND/OR operator
   //============================================================================================

  //  console.log( " QueryEngine.applyTraitBlockLogic   =====" , featStateArg );

              QueryEngine.applyTraitBlockLogic( featStateArg ); 
          const response = get_APIresponse();
           console.log( "============APIresponse==============\n" , response );
         return response;//   get_APIresponse();
   
 }

   
//=================================================

// called from grid
function SetAllCall_NFTSearchMode(raw){ 

 traitSearch.value = raw;//"#3200,3201,3202,3203";
  call_NFTSearchMode(traitSearch.value);
}

 

// at this point activeTraitUI value is an array containing 1 or more trait value ex: ["brow boots","bpne boots"]
function  restore_ActiveTraits_from_activeTraitUI(featStateArg) { //activeTraitUI
        featStateArg.activeTraits.clear();
       for (const [traitType, valueSet] of featStateArg.activeTraitUI.entries()) {
             for (const value of valueSet) {
                 const ids = getLoadedrarityTraitCount()?.[traitType]?.[value] || [];
                   
                       featStateArg.applyTraitFilter(traitType, value, ids, null);
            }
        }
 }
 

 

module.exports = {
  
     createTraitFilterFeature,
     rebuildActiveFilterMap,

   //  applyTraitFilter,
   //    removeActiveTrait , 

   // on_clearAllSearchQuery ,
     SetAllCall_NFTSearchMode,

    

     set_featState,get_featState
};