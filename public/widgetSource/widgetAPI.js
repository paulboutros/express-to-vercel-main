
 
 
   //composer/bootstrap: warning this is async, subsequent <script> will execute before this finished loading...
   // import "http://localhost:2000/widgetSource/composer.js";
    
    import "./composer.js";
   
/*
    WuliComposer.runWidget(
    {      // "wuli-consoleTXT-widget"
         container:  document.getElementById("bottomRight"),
         shadowName: "consoleTXT"
     },
    (widgetContent) =>
        WuliComposer.initCompose(
              widgetContent,[{
                 widget: WuliComposer.widgets.consoleTXT ,
                 options: {
                      instanceName:"consoleTXT_01"
                      // onResult: WuliComposer.refreshQueryResult 
                 }
              }]
         )
     );

   //==============================================================================
      WuliComposer.runWidget(
    {      // "wuli-consoleTXT-widget"
         container:  document.getElementById("bottomRow1"),
         shadowName: "consoleTXT"
     },
    (widgetContent) =>
        WuliComposer.initCompose(
              widgetContent,[{
                 widget: WuliComposer.widgets.consoleTXT,
                 options: {
                      instanceName:"consoleTXT_02"
                      // onResult: WuliComposer.refreshQueryResult 
                 }
                
                }]
         )
     );
      
     // pass instance to client
        window.eventBus.emit(
            window.eventBus.eventNames.EVENT_widgetLoaded,
                {   
                    name: "add_consoleTXT_to_WuliComposer",
                    uIActionRegistry_actions: "default",
                    consoleInstance:  window.WuliComposer.instance["consoleTXT_01"]   
                    // window.WuliComposer.instance.consoleBtnDescriptiontxt
                }
        ); 
              
 
*/



 
import "./composer.js";


const WuliAPI = {

    // ============================================================
    // Internal widget creation
    // ============================================================

    async createWidget(config) {

        const {
            type,
            container,
            instanceName,
            options = {}
        } = config;


        if (!type) {
            throw new Error("WuliAPI: widget type is required");
        }

        if (!container) {
            throw new Error(
                `WuliAPI: container missing for "${type}"`
            );
        }


        // --------------------------------------------------------
        // Resolve widget from Composer
        // --------------------------------------------------------

        const widget = WuliComposer.widgets[type];
 
        if (!widget) {
            throw new Error(
                `WuliAPI: unknown widget "${type}"`
            );
        }


        // --------------------------------------------------------
        // Build Composer widget configuration
        // --------------------------------------------------------

         const widgetConfig = {  container,
               shadowName: type
         };


        // --------------------------------------------------------
        // Wait until Composer has created the widget container
        // --------------------------------------------------------

        return new Promise((resolve, reject) => {

            try {

                WuliComposer.runWidget(
                    widgetConfig,

                    (widgetContent) => {

                        try {
                             const composeConfig = {
                                 widget,
                                 options 

                            };


                            // ------------------------------------
                            // Let Composer initialize the widget
                            // ------------------------------------

                            WuliComposer.initCompose(
                                widgetContent,
                                [composeConfig]
                            );


                            // ------------------------------------
                            // Retrieve the public instance
                            // ------------------------------------

                         //  const instance = instanceName ? 
                          //  WuliComposer.instance[options.instanceName] : null;

                                


                            resolve({    type   });

                               

            if ( options.instanceName === "consoleTXT_02" ) {
                        window.eventBus.emit(
                            window.eventBus.eventNames.EVENT_widgetLoaded,
                                {   
                                    name: "add_consoleTXT_to_WuliComposer",
                                    uIActionRegistry_actions: "default",
                                    consoleInstance:  window.WuliComposer.instance["consoleTXT_01"]   
                                    // window.WuliComposer.instance.consoleBtnDescriptiontxt
                                }
                        ); 
                }

            if ( type === "assetPicker" ) {

                console.log( "f ( options.instanceName ===  assetPicker  ) {");
                            window.eventBus.emit(
                    window.eventBus.eventNames.EVENT_widgetLoaded,
                        {  
                            name: "pass_assetPicker_to_client",
                            getAssetPicker :  window.WuliComposer.instance["getAssetPicker"], 
                            getTiersTab    :  window.WuliComposer.instance["getTiersTab"]
            

                            
                        }
                ); 
                }

                              

                              

                           

                        }
                        catch (error) {

                            reject(error);

                        }

                    }
                );

            }
            catch (error) {

                reject(error);

            }

        });

    },


    // ============================================================
    // Create multiple widgets
    // ============================================================

    async createWidgets(widgetConfigs = []) {

        if (!Array.isArray(widgetConfigs)) {
            throw new Error(
                "WuliAPI.createWidgets expects an array"
            );
        }


        const instances = [];


        for (const config of widgetConfigs) {

            const result =await this.createWidget(config);
                

            instances.push(result);

        }


      /*
      window.eventBus.emit(
            window.eventBus.eventNames.EVENT_widgetLoaded,
                {   
                    name: "add_consoleTXT_to_WuliComposer",
                    uIActionRegistry_actions: "default",
                    consoleInstance:  window.WuliComposer.instance["consoleTXT_01"]   
                    // window.WuliComposer.instance.consoleBtnDescriptiontxt
                }
        ); 
        */






        return instances;

    }

};


globalThis.WuliAPI = WuliAPI;

window.WuliAPI = WuliAPI;

export default WuliAPI;
 
