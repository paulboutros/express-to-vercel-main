 
//const { filemanager } = require("../../services/writeServices");
import { HorizontalSelector } from  "./horizontalSelector.js" ;
//const traitOverrideNames = filemanager.traitOverrideNames.load();
 


let tab01 = null;
let weaponMetaDropDown;


export function getTab01(  ){
  
  const tierOptions = [
      { id: "GENERAL", label: "GENERAL" },
      { id: "WEAPON_METADATA", label: "WEAPON METADATA" },
  ];
  
  
     const patEditorPanel01 = document.getElementById("patEditorPanel01")   //document.querySelectorAll("#patEditorPanel01");
     const patEditorPanel02 = document.getElementById("patEditorPanel02")
           patEditorPanel02.classList.add("hidden");

     //if ( !tab01 ){     
         tab01 = new HorizontalSelector({
    container: document.getElementById("patEditorTab01"), //"tierTabs"
    options: tierOptions ,
    defaultValue: "GENERAL",

    onChange: (tierName) => {
      if (tierName === "GENERAL") {
         // getAssetPicker().render(type); // no filter
          //return;
      }
      console.log( "tierName " , tierName  );

          switch (tierName) {

            case "GENERAL":
                 
                  patEditorPanel01.classList.remove("hidden");
                   patEditorPanel02.classList.add("hidden");
              break;
            case "WEAPON_METADATA":


                patEditorPanel01.classList.add("hidden");
                patEditorPanel02.classList.remove("hidden");

                if ( !weaponMetaDropDown){ 
                   const weaponClassDrop  = document.getElementById("weaponClassDrop")
                   weaponMetaDropDown = createPopulatedDropDown(weaponClassDrop, CLASSoptions, "— No CLASS —", 
                    (selectedValue) => {
 
                         //  console.log( " assetClicked = " , assetClicked   ,  
                                //      " selectedValue =  " , selectedValue ,
                               //       " activeSlotType =  " , activeSlotType 
                                    
                               //     );
                      if ( assetClicked  && activeSlotType === "weapon" ){ 
                       
                         traitOverrideNames["weaponMeta"][ assetClicked.name ] = { 

                                   publicName :  traitOverrideNames["weapon"][ assetClicked.name ],
                                   class :  selectedValue
                         }

                          console.log( "    traitOverrideNames[ weaponMeta ] = " , 
                               traitOverrideNames["weaponMeta"]);

                    }


                    }, "Select CLASS"  
                  
                  );
               }


                     
                  // patEditorPanel01.classList.remove("hidden");
              break;
          
            default:
              break;
          }
      
    }
        });
      
    return tab01;
 } 


 export function  buildMetaUI(  assetName)  {
 // tab containing the drop down has not been clicked yet. so drop down does not exist yet
   if (!weaponMetaDropDown)return;

  let classValue = null;
     const weaponMeta = traitOverrideNames["weaponMeta"][ assetName ];
     if (  weaponMeta ){ 
        console.log( " weaponMeta  " ,  weaponMeta);
         if ( weaponMeta.class ){ 


             console.log( "  weaponMeta.class  " ,   weaponMeta.class);
              classValue = weaponMeta.class;
         }

     }else{
            traitOverrideNames["weaponMeta"][ assetName ] ={ 
                   publicName : traitOverrideNames["weapon"][ assetName ]  ,
                    class :"NO_CLASS"
  
            }

     }
    
     
    if (classValue){ 
         weaponMetaDropDown.value = classValue;
    } else{
         weaponMetaDropDown.value = "NO_CLASS";
    }

    
 // grid.innerHTML = "";
}

/*
 module.exports ={ 
    getTab01, buildMetaUI

 }*/