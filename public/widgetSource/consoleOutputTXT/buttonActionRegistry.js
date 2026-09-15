
 /*
const fs = require("fs");
const { create_weaponShield_gridLayoutPATH, placeCardPATH, loadFolderContentAsSmartObjPATH, saveJpeg_PATH, placeFileAsLinked_fromActiveSel_PATH, replaceFileAsLinked_fromActiveSel_PATH, collapseAllgroup_PATH, setSize50Percent_PATH, nftMix_PATH, jsxPathObj } = require("../BOOTSTRAP/JSXScriptPATH");
const { getData, getPath, scriptType } = require("../BOOTSTRAP/PATH");
const { runJSXfn, runJSXdispacher } = require("../buttonFunction/runJSX");
const { getMissingFiles } = require("../services/findMissingfiles");
const { scriptObj } = require("../services/nodeRunScript");
const { sendWarning } = require("../services/warning");
const { get_weaponShieldSession,  get_psdEditorSessionData,
     get_gridSessionData, writeWeaponShieldOverrides, writeWeaponShield_fromUnsavedData, 
     load_weaponShieldcombo, save_weaponShieldcombo, 
     save_activeDocData,
     get_activeDocData,
     get_UI_DEFAULT_CONFIG,
     save_activeDocDataPATH} 
     = require("../services/writeServices");

const { getFiveBlockFromAny } = require("../UTILITY/gridHelper");
const { override_Meta_Traits, call_overrideMETA_Weapons_Shield_Mask } = require("../DATA_TRANSFORM/runNFTMIX");
const { sharedState } = require("../PSDEDITOR/psdEditorSharedState");
const { rebuildRarityDocCount } = require("../TRAITCOUNT/docCountTraits");
  

const sc ="D:/GIT/hashLipsWuli/hashlips_art_engine/utils/NFT_ELECTRON/DATA_TRANSFORM/NFT_groupRefactor.js";


const jsxPath =  "D:\\GIT\\hashLipsWuli\\hashlips_art_engine\\utils\\WEAPON_ANGLE_MODIFICATION\\utils\\JSX\\";
const jsxController =  jsxPath + "CONTROLLER\\";
  const JS_Dispatch_JSX_script = getPath("scriptDispatcher.jsx","jsxService");
 const JS_Dispatch_JSX_PATH   = getPath("JS_Dispatch_JSX.json","BRIDGE");

 

const DEFAULT_CONFIG   = get_UI_DEFAULT_CONFIG();  
 
 */

// variable added here do widget is path agnostic

  

let scriptObj = null;
 
let NFT_refactor_path ="";
let jsxPath = "";
let jsxController = "";

 let loadNFTMix_path = "";
let create_weaponShield_gridLayoutPATH = "";
let psdData_json = "" ; 
let comp_currentImage_path =  "";
let comp_nextImageFromAList_path =   "";
 
let runPSDmix_path ="" ;
let nextImage_path = "";
let placeCardPATH = "";
 let loadFolderContentAsSmartObjPATH = ""; 
 let saveJpeg_PATH = "";
 let  placeFileAsLinked_fromActiveSel_PATH = "";
  let  replaceFileAsLinked_fromActiveSel_PATH = "";
  let   collapseAllgroup_PATH = ""; 
  let   setSize50Percent_PATH = "";
 let nftMix_PATH = "";
  let jsxPathObj= "";
     



/*

loadNFTMix_path =    getPath( "loadNFTMix.jsx", "HEAD_BODY_MIXER")  ;
  psdData_json = getPath("psdData.json", scriptType.PSDDATA);
  comp_currentImage_path =  getPath( "comp_currentImage.jsx", "HEAD_BODY_MIXER");
 comp_nextImageFromAList_path = getPath( "comp_nextImageFromAList.jsx", "HEAD_BODY_MIXER") ;

    runPSDmix_path = getPath( "runPSDmix.jsx", "HEAD_BODY_MIXER") ;
    nextImage_path =  getPath( "nextImage.jsx", "HEAD_BODY_MIXER");


*/


// button temp session for quik update:
 

//================================================
function createButtonMessages(registry) {

    return  { 

     "activeSelection":{
        tag: "contract",
        payload:()=> ({

            type: "Active Selection" 
            
            
        }) ,
        validate: () => {
            return validateSelection( sessionState.selectedKeys );
        } 

    },


    "GetActiveDoc":{
        tag: "contract",
        payload:()=> ({

            title: "Replace NFT Image",
            requires: "1 selected NFT grid item"
            
        } )

    },
     RunRarityDoc:{
        tag: "contract",
        payload:()=> ({

            
            requires: "",
            description:"gemerate raity count of psd file contente"
                         
            
        } )

    },

    nextImageFromActiveSel:{
        tag: "system",
        payload:() => ( {
            requires: "select at least 1 NFT grid item AND select at least one in target Doc",
            description:"send an item from your grid selection to current Photoshop selected Node,\n"+
                        " picks one randomly every click" 
            
        }),
        validate: () => {
            return validateProcess(

                    getCache("get_gridSessionData").selectedKeysABS
            );
        }
    },
    selectRandomFromActiveSel:{
        tag: "system",
        payload: () => ({
            requires:   "select at least 1 NFT grid item AND select at least one in target Doc",
            description:"send an item from your grid selection to current Photoshop selected Node,\n"+
                        " picks one randomly every click" 
            
        }) 
    },
    "ScanDoc":{
        tag: "layerSelection",
        payload: ()=>({
            scope: "Head",
            minActive: 2,
            note: "Requires minimum 2 active head layers."
        })
    },
    "snap":{
        tag: "system",
        payload:() => { 
               const payload = {
                 requires: "none",
                 description:"Snap all doc group using their child layer's bounds to determine final groups position" 

             };

               const config = DEFAULT_CONFIG.layoutGrid;

                for (const key in config) {

                    payload[key] = getSessionValue(
                        key,
                        () =>  getDocConfigValue("layoutGrid", key ) // config[key]
                    );

                }

                return payload;
 
        } 
     },
     
    "weaponOverride":{
        tag: "system",
        payload:() => ( {
            requires: "select at least 1 NFT grid item",
            description:"Applies a fast weapon-only patch to the current final image. Only the weapon area is updated. Mask and shield changes are ignored.",
            weapon:  getCache("get_weaponShieldSession").patterns.last_picked.weapon 
        }),
        validate: () => {
             return validateProcess(

                  getCache("get_gridSessionData").selectedKeysABS 
             );
        }
    },
    "shieldOverride":{
        tag: "system",
        payload:() => ( {
            requires: "select at least 1 NFT grid item",
            description:"Applies a fast shield-only patch to the current final image. Only the shield area is updated. Mask and weapon changes are ignored.",
            shield: getCache("get_weaponShieldSession").patterns.last_picked.shield ,
            shieldSource:  getSessionValue(
                  "shieldOverride_shieldSource",
                  () => getCache("get_psdEditorSession")["shieldSource"].mode
                  ), 



        }),
        validate: () => {
             return validateProcess( 
                 getCache("get_gridSessionData").selectedKeysABS 
             );
        }
    },


    "charaXweapon":{
        tag: "system",
        payload:() => ( {
            requires: "select at least 1 NFT grid item",
            description:"Preview next character from selection with fix weapon",
            weapon:  getCache("get_weaponShieldSession").patterns.last_picked.weapon,
            nftSource: getSessionValue(
                  "charaXweapon_NFTsource",
                  () => getCache("get_psdEditorSession")["NFTsource"].mode
                  ), 
                   
           
                     
        }),
        validate: () => {

            return validateProcess(  
                       getCache("get_gridSessionData").selectedKeysABS 
                     );
           
        }
    },
    "saveCharaXweapon":{
        tag: "system",
         payload: () => {
               /* this is the most recent redenrered nftID, this button use this as
                base to determine the saving range 
               */
                const nftID = getSessionValue(
                    "charaXweapon_toNFT",
                    () => getCache("get_psdEditorSession")["charaXweapon"].nftToRender
                );
                const toID = getCache("get_psdEditorSession").saveCharaXweapon.toID;
                const nft_seq_five = getFiveBlockFromAny(nftID);
               // const rawQuery = "#" + nft_seq_five.join(",");

                return {
                    requires: "no requirement",
                    description: "Save this override into one of the matching character variants",
                    fromID: nftID,
                    saveTargets: nft_seq_five,
                    toID: toID // rawQuery
                };
            }
    } 
 
} 

}



 
 
export class UIActionRegistry {
  constructor() {
    this.snapInputCurValue = { x: 0, y: 0 };
    this.currentIndex =0;
    this.activeDoc =null;
    this.nftCardOffset={ x: 0, y: 0 };
    


 // this.actions = createActions(this);
    this.messages = createButtonMessages(this);

    this.actions = { 
      ScanDoc:{
        
        profiles: ["alwaysAvailable"],
        container: "middleRow", ui: "button",
         btnDescription:   this.messages["ScanDoc"],
        
       // JS_Dispatch_JSX
         afterRun: () => {
            
            
          runJSXdispacher( ["DocumentScanner.jsx", "DoFullScan",{}] );
            
             
        }


       
    },

     
     GetActiveDoc:{
        profiles: ["ifActiveDocIsNull","alwaysAvailable"],
        container: "middleRow", ui: "button",
      
        btnDescription:   this.messages["GetActiveDoc"],
         afterRun: () => {
            runJSXdispacher( ["getActiveDoc.jsx", "JS_APP_requestActiveDoc",{}] );

         }

    },
     RunRarityDoc:{
        profiles: ["ifActiveDocIsNull","alwaysAvailable"],
        container: "middleRow", ui: "button",
      
        btnDescription:   this.messages["RunRarityDoc"],
         afterRun: () => {
           // runJSXdispacher( ["getActiveDoc.jsx", "JS_APP_requestActiveDoc",{}] );
                 rebuildRarityDocCount(); //  rebuildRarityDocCount
         }

    },

    selectPSDFile:{
       container: "middleRow", ui: "dropDown",
       jsonPath: psdData_json,

    },
 
    alignButton: {
        container: "middleRow", ui: "button",
        path: create_weaponShield_gridLayoutPATH
    },

    loadStatCard: {
        container: "middleRow", ui: "button",
        path: placeCardPATH ,
        getInput: () => {
            return {
                key: "placeCard",
                value: {
                    cardType: "cards",
                    
                }
            };
        },

        
    },
 
    loadFolderContentAsSmartObj: {
        container: "middleRow", ui: "button",
        path: loadFolderContentAsSmartObjPATH
    },

    saveJpeg: {
        container: "middleRow", ui: "button",
        profiles: ["alwaysAvailable"],
       // path: saveJpeg_PATH
        afterRun: () => {
                
               

             runJSXdispacher(  ["saveJpeg.jsx", "saveForWebJPEG", {}     ] )
           
        }


    },

    placeFileAsLinked_fromActiveSel: {
        container: "middleRow", ui: "button",
        path: placeFileAsLinked_fromActiveSel_PATH//placeFileAsLinked_fromActiveSel_PATH
    },

    replaceFileAsLinked_fromActiveSel: {
        profiles: ["gr_CA_IM"],
        container: "middleRow", ui: "button",
        path:  replaceFileAsLinked_fromActiveSel_PATH// replaceFileAsLinked_fromActiveSel_PATH
    },

    collapseAllgroup: {
         container: "middleRow", ui: "button",
         profiles: ["gr_CA_IM"],
         path:collapseAllgroup_PATH // collapseAllgroup_PATH
    },

    setSize50Percent: {
        container: "middleRow", ui: "button",
        path: setSize50Percent_PATH// setSize50Percent_PATH
    },

    laodNFTMIX: {
        profiles: ["gr_BO_BO", "alwaysAvailable"],//"headBodyMix"
        container: "middleRow", ui: "button",
        path:  loadNFTMix_path   
    },
 
    comp_currentImage: {
        profiles: ["gr_BO_BO"],//"headBodyMix"
        container: "middleRow", ui: "button",
        path: comp_currentImage_path   //   jsxPathObj.comp_currentImage_PATH
    },

    comp_nextImageFromAList: {
        profiles: ["gr_BO_BO"],//"headBodyMix"
        container: "middleRow", ui: "button",
        path:  comp_nextImageFromAList_path  
    },

    saveHeadBodymix: {
        profiles: ["gr_BO_BO"],//"headBodyMix"
        container: "middleRow", ui: "button",
        path: runPSDmix_path  // jsxPathObj.runPSDmix_PATH
    },

    nextImage: {
        profiles: ["gr_BO_BO"],//"headBodyMix"
        container: "middleRow", ui: "button",
        path: nextImage_path // jsxPathObj.nextImage_PATH
    },

    createNftCard:{ 
      profiles: ["gr_IM", "gr_CA_IM"],
      container: "middleRow", ui: "button",
      path: scriptObj ? scriptObj.chartGeneration.script : "",
     
        afterRun: () => {
            
             const sessionData = getData(  getPath("sessionData.json","JSONDATA"));
             const selKeysAbs  = sessionData.selectedKeysABS;

             const missingCard = getMissingFiles(  getPath("NFTcards/","IMAGE"), selKeysAbs  );

              let cardList; 

           //   console.log( "missingCard " , missingCard , " this.activeDoc " , this.activeDoc  )
              if (missingCard && missingCard.length> 0 ){ 
                nodeRunThis(scriptObj.chartGeneration.script,["nftCard",  "missingFromActiveSel" , this.activeDoc ]);
              }else{ 


                // no active selection, simply use full fist of nft/image to re-generate
                 nodeRunThis(scriptObj.chartGeneration.script,["nftCard",  "cardFromNFTimageName" ,  this.activeDoc ]);
              }
             
        }
    
   },


    nextImageFromActiveSel: {

        container: "middleRow", ui: "button",
        path: jsxPath + "nextImageFromActiveSel.jsx",
        profiles: ["gr_CA_IM"],
        getInput:  () => {
            return {
                key: "nextImageFromActiveSel",
                value: {
                    index: this.currentIndex,
                    mode: "list_iteration"
                }
            };
        },

        btnDescription:   this.messages["nextImageFromActiveSel"],

        afterRun: () => {
            this.currentIndex++;
        }
    },

    selectRandomFromActiveSel: {
        container: "middleRow", ui: "button",
       // path: jsxPath + "nextImageFromActiveSel.jsx",
        profiles: ["gr_CA_IM"],

        /*
        getInput: ()=> {
            return {
                key: "nextImageFromActiveSel",
                value: {
                    mode: "list_random"
                }
            };
        },
         */
        preCheckNeeded: () => {

             const sessionData = getData(  getPath("sessionData.json","JSONDATA"));
             const selKeysAbs  = sessionData.selectedKeysABS;

             const missingCard = getMissingFiles(  getPath("NFTcards/","IMAGE"), selKeysAbs  );

           //  console.log( "missingFileNames: " , missingFileNames  );
             if ( missingCard && missingCard.length > 0 ){
                 //   console.log( "missingFileNames :" , missingFileNames  );
                 const warnArg =  
                      {
                          responseType:"missingNFTCards",
                          missingNftCards:missingCard
                       };
                 
                 sendWarning(warnArg );

                 return true;
             }
              console.log( "no missing files " );
              return false;
        },
        btnDescription:   this.messages["selectRandomFromActiveSel"],
         afterRun: () => {
                
              const traitsUI = get_gridSessionData().traitsUI;
              save_activeDocDataPATH( sharedState.getActiveDoc(),
                  { path: ["config", "traitsUI"], value:  traitsUI  } 
              );

               var inputArg = { 
                        mode:"list_random"
               }
             //  runJSXdispacher(  ["nextImageFromActiveSel.jsx", "nxtImFromActive",  inputArg   ] )
              
        }    
 

    },

    swapSO_right: {
        container: "middleRow", ui: "button",
        path: jsxController + "swap_SO_list.jsx",
        profiles: ["gr_CA_IM"],
        getInput: () => {
            return {
                key: "swapSO",
                value: {
                    direction: "right"
                }
            };
        }
    },

    
    swapSO_left: {
        
       profiles: ["gr_CA_IM"],
       container: "middleRow", ui: "button",

        path: jsxController + "swap_SO_list.jsx",
        getInput: () => {
            return {
                key: "swapSO",
                value: {
                    direction: "left"
                }
            };
        }
    },

   
      PlaceNFTCard: {
        
        ui: "vector2",
        container: "snapContainer",
        profiles: ["gr_CA_IM" ],
        dependencies:["NFTCard_exist"], 
      
         path: jsxController + "placeCard.jsx" , 
         label: "Place NFT Card",
         vector: ()=> this.nftCardOffset    ,
              
         getInput: () => {return {key: "placeCard", value: { cardType: "NFTcards", offset: this.nftCardOffset} };}
          


                 
     },

      generateWeaponCards:{ 
         profiles: [ "alwaysAvailable"],
         container: "middleRow", ui: "button",
          path: scriptObj ? scriptObj.chartGeneration.script : "",
     
        afterRun:  () => {
           nodeRunThis(scriptObj.chartGeneration.script,["weapon"]);
        }
   },


   generateShieldCards:{
         profiles: [ ],
         container: "middleRow", ui: "button",
          path: scriptObj ? scriptObj.chartGeneration.script : "",
     
        afterRun:   () => {
             nodeRunThis(scriptObj.chartGeneration.script,["shield"]);
        }
   },
     /*
      createWeaponUsePercentage:{ 
         profiles: [ ],
         container: "middleRow", ui: "button",
          path: sc,
     
        afterRun:   () => {
             nodeRunThis( sc,["createWeaponUsePercentage"]);
        }
      },
*/
      getClanPerFive :{ 
         profiles:["alwaysAvailable"],
         container: "middleRow", ui: "button",
          path: NFT_refactor_path,
     
        afterRun:   () => {
            nodeRunThis(NFT_refactor_path,["getClanPerFive"]);
        }

      },
 

       shieldOverride:{ 
        profiles: ["alwaysAvailable"],// [ "WeaponSh_light_weapon"],
        container: "middleRow", ui: "button",
         afterRun: () => {
              
               const shield  =  getCache("get_weaponShieldSession").patterns.last_picked.shield;
              // const selectedKeysABS = getCache( "get_gridSessionData").selectedKeysABS;   
  
              const gridSessionData = getCache( "get_gridSessionData");
               const selectedKeysABS = gridSessionData.selectedKeysABS;   
 
                console.log(" gridSessionData.DOsaveJSON" , gridSessionData.DOsaveJSON );
               if ( gridSessionData.DOsaveJSON){
 
                //1) load, 2) write data on X amount of nft pattern. 3) save once
                //====================================================
                   //=========================================
                   
                 var  weaponShieldcombo =  load_weaponShieldcombo();
                 for (let index = 0; index < selectedKeysABS.length; index++) {
                      const nftIdtoSave = selectedKeysABS[index];
                     writeWeaponShield_fromUnsavedData( weaponShieldcombo, nftIdtoSave   ) // , shield:null
                 }
                 save_weaponShieldcombo( weaponShieldcombo );
                 
                 //=========================================
                    //=========================================


                 for (let index = 0; index < selectedKeysABS.length; index++) {
                     const nftIdtoSave = selectedKeysABS[index];
                      // modifies data in  pattern editor json
                    //    writeWeaponShieldOverrides( nftIdtoSave, { shield: shield } ) // , shield:null

                    //=========================================
                     
                    
                  /// weaponShieldcombo.unsavedPattern.patterns[  String(currentSelection[0] )  ]

                    //==================================

                        call_overrideMETA_Weapons_Shield_Mask(nftIdtoSave);
                }
              }
    

   
           
                runJSXfn( getPath("WeaponSh_shieldOnly.jsx","overrides"));



         },
        
        btnDescription:   this.messages["shieldOverride"]
       
      
         
       },

        snap:{
        container: "middleRow", ui: "button",
        profiles: ["gr_CA_IM","gr_IM"],
        btnDescription: this.messages["snap"],
        
        label: "SNAP",
        vector: () => this.snapInputCurValue,// { x: snapInputCurValue.x, y:snapInputCurValue.y },

       // path: jsxPath + "snap_512.jsx" ,
         

        afterRun: () => {

            const gridEngine = "sharp" ;//"jsx"

                  var inputArg = { 
                        ...DEFAULT_CONFIG.layoutGrid,
                        ...( get_activeDocData( sharedState.getActiveDoc() ).config.layoutGrid || {})
                   }
 

                 if ( gridEngine === "sharp" ){ 


                        console.log( " TODO: call API sheet rendereing endpoint HERE ")

                        // renderLayout( inputArg ) ; //  renderLayoutTest();
                 }else{ 
                     
                       runJSXdispacher(  ["snap_512.jsx", "layoutGroupsGrid",  inputArg   ] );
                 }
               
           
        }
 
        },
       
 
        charaXweapon:{ 
        profiles: ["alwaysAvailable"],//["WeaponSh_light_weapon"],
        container: "middleRow", ui: "button",
        
          afterRun: () => {
      
            runJSXdispacher( ["charaXweapon.jsx", "charaXweapon_render",{}] );
            
              
        },

        getInput: () => {
        const nftListToRender = getCache("get_gridSessionData").selectedKeysABS || [];

        if (!nftListToRender.length) {

            console.warn("No NFT selected");
            currentIndex = 0;
            return {
                    key: "charaXweapon",
                    value: { error: "No NFT selected" }
                    };
        }

        currentIndex = currentIndex % nftListToRender.length; //reseting it first
        currentIndex = (currentIndex + 1) % nftListToRender.length;

        const nftToRender = nftListToRender[currentIndex];

         setSessionValue("charaXweapon_toNFT", nftToRender);

        return {
            key: "charaXweapon",
            value: { nftToRender }
        };
    },
        


        btnDescription:   this.messages["charaXweapon"]
         
       } 
       ,
        saveCharaXweapon:{ 
        profiles: ["alwaysAvailable"],// ["WeaponSh_light_weapon"],
        container: "middleRow", ui: "button",
      
         afterRun: () => {
            
            const JS_Dispatch_JSX = getData( JS_Dispatch_JSX_PATH );

             JS_Dispatch_JSX.scriptDispatcher.arguments = [
                 "charaXweapon.jsx", "charaXweapon_DoSave",
                 {}// object function arguments, no needed here

             ] 
            // to do: use write service instead
             const fs = require("fs-extra");
             fs.writeFileSync(
                 JS_Dispatch_JSX_PATH, JSON.stringify( JS_Dispatch_JSX, null, 2)
                
              );
               
               runJSXfn(JS_Dispatch_JSX_script);
              
             
        },
       


          btnDescription:   this.messages["saveCharaXweapon"]
         
       } 
      

   }
    

   

   

   //this.jsonDirty = true;
  // this.cache = {};
  
 //  this.dataProviders = {};
 
/*
   this.get_weaponShieldSession = ()=>{};
   this.get_gridSessionData  = ()=>{};
   this.get_psdEditorSessionData= ()=>{}; 
   this.get_activeDocData = ()=>{}; //: () =>  get_activeDocData(  sharedState.getActiveDoc()   ) 
*/
  }
   

   setDataProviders(providers) {

      console.log( "constructor: providers  = ", providers   );


         Object.assign( dataProviders, providers);
  } 
     

  /*
    loadAllJsonFilesSSSSSS() {
      try {
   
        const obj = {};
        for (const [key, provider] of Object.entries(this.dataProviders)) {
            obj[key] = provider();
        }

     } catch (err) {
           console.log("Cache load error:", err);
          return cache || {};
       }
        
    }
 */

} 

 
function validateSelection(  selected ){ 

   
            const isValid = Array.isArray(selected) && selected.length > 0; 
            return {
                valid: isValid,// !!selected,
                value: isValid ? "#" + selected.join(", ") : "none selected"
            };
}

function validateProcess( selected  ){ 
    
   
          //  var  selected =  getCache("get_gridSessionData").selectedKeysABS ;
                   
             // console.log( " selected=",selected );
            const isValid = Array.isArray(selected) && selected.length > 0; 
            return {
                valid: isValid,// !!selected,
                value: isValid ? "#" + selected.join(", ") : "none selected"
            };
}
 

/*
                     WIDGET
┌────────────────────────────────────────────┐
│                                            │
│  UI Action Registry                        │
│       ↓                                    │
│  Button Factory                            │
│       ↓                                    │
│  Button definitions                        │
│                                            │
│  Cache                                     │
│       ↓                                    │
│  Data Providers ←──────────────┐           │
│                                │           │
└────────────────────────────────┼───────────┘
                                 │
                         injected by client
                                 │
                     ┌───────────┴───────────┐
                     │       CLIENT          │
                     │                       │
                     │ JSON / filesystem     │
                     │ sharedState           │
                     │ Photoshop             │
                     │ localStorage          │
                     │ API / database        │
                     └───────────────────────┘


*/

/*

*/