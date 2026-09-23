
 const { FeatureState } = require( "./features/FeatureState/featureState.js");
 let featState = new FeatureState();
const { eventBus } = require('./appGlobal/eventBus.js');
 const { ipcRenderer, shell } = require('electron');


  cacheInit();

window.eventBus = eventBus;
 //===============================

const {  filemanager , get_UI_DEFAULT_CONFIG, 
  get_assetPath // use for assetpicker
  } =  require("./services/writeServices.js");

const { loadAssets, // use for assetpicker
       updateCardIfExist // use for assetpicker

 } = require("./services/overrideAssets.js")


const { get_selectedKeysABS } = require("./sharedState.js");


  const  inputConfig = get_UI_DEFAULT_CONFIG();
  const  traitCounter_Data = filemanager.traitCounter.load();  //  JSON.parse(fs.readFileSync( traitCounterPATH , 'utf8'));
  const  traitCounterLength = filemanager.traitCounterLength.load();// get_rarityTraitLength();   //    core.PATH.getData(core.PATH.traitCounterLengthPATH );  
 const  weaponShieldSession =  filemanager.weaponShieldSession.load();

let TRAIT_MODE =  "FILTER_BASKET";//"FOLLOW_NFT"; 

let NFT_BASE ;
 let NFT_HEAD ;
  let NFT_WEAPON ;
   let NFT_SHIELD ;




let sessionData = {};
let liveEditData = {}; 

let selectedNFTFirstNumber = []; 
let ModuloDisplayMode;
 



eventBus.on(eventBus.eventNames.EVENT_loadSessionData, 
     (eventObj) => {
 
       console.log( "eventbus: EVENT_loadSessionData  block01.js  ");
      
 
    }
  );

  