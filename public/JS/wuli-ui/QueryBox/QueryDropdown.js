 
export default class QueryDropdown {

    constructor(container) {

        this.el = container;

        this.items = [];
        this.selected = -1;
        this.data={};


        this.queryBox;
       // this.width;
       // this.height;

        this.onSelect = () => {};
        this.nodeRefreshPipeline = () => {};
    }

    setItems(items , data) {

         this.data = data;

        this.items = items;
        this.selected = -1;

        this.render();

    }

    render() {

       switch(this.data.type){  

       case "queryExample":
            
            this.renderList();
       break;
        case "renderAvailableValue":
        case "renderProducersList":
        case "renderAvailableTrait":

        //console.log( "query drop down: render =",  this.data.type   );
             this.renderList();
           /* this.renderAvailableValue();*/
       break;

         case "renderList_v2":
         this.renderList_v2( );
         break;

       

    }
      

    }
 

 renderList_v2(){ 
     this.el.innerHTML = "";
     const node = this.data.node;

    //--------------------------------------------------
// Node root
//--------------------------------------------------

const root = document.createElement("div");
root.classList.add("pipelineNode");

 // const widget = node.instance.el.querySelector(".pipelineWidget");
//---  -----------------------------------------------
// Header
//--------------------------------------------------

const header = document.createElement("div");
header.classList.add("pipelineNodeHeader");


const renderSpec = node.renderSpec || {};
 

//--------------------------------------------------
// Render header fields
//--------------------------------------------------

Object.entries(renderSpec).forEach(([key, spec]) => {

    const element = document.createElement("div");
 

    if (spec.cssClass) {
     //   element.classList.add(spec.cssClass);
    }
     if (spec.cssClassList) {
        element.classList.add(...spec.cssClassList);
    }
 

    if (spec.textContent !== undefined) {
        element.textContent = spec.textContent;
    }

    header.appendChild(element);

});


//--------------------------------------------------
// Append header
//--------------------------------------------------

root.appendChild(header);
 
       if (node.details && node.details.length) {

        const details = document.createElement("div");
        details.classList.add("pipelineNodeDetails");
        details.style.display = "none";

        node.details.forEach(item => {

            const row = document.createElement("div");
            row.classList.add("pipelineNodeRow");

            const key = document.createElement("div");
            key.classList.add("pipelineNodeRowKey");
            key.textContent = item.key;

            const val = document.createElement("div");
            val.classList.add("pipelineNodeRowValue");
            val.textContent = item.value;

            row.appendChild(key);
            row.appendChild(val);

            details.appendChild(row);

        });
 
         
        this.headerOnClickDOM(details ,node, root);// run once to get state from stateMap
        header.classList.add("clickable");
        header.onclick = () => {
        
           this.headerOnClickDOM(details ,node, root);
           this.nodeRefreshPipeline();   
        };
         root.appendChild(details);
        }


        if(node.dataList){
 
           const dataList = document.createElement("div");
           dataList.classList.add("pipelineNodeDetails");
           dataList.style.display = "none";
  
           this.dataRenderList(dataList,
                             node.dataList,
                             node 
                           //  this.onSelect = correction => {   
                              //   this.queryBox.onSelect_traitType(correction, this.queryBox.input);
                             //  } 
                             );




           this.headerOnClickDOM(dataList ,node, root); // run once to get state from stateMap
           header.classList.add("clickable");
           header.onclick = () => {
        
               this.headerOnClickDOM(dataList ,node, root);
               this.nodeRefreshPipeline();   
          };

           
          
            root.appendChild(dataList);
        }


     //--------------------------------------------------
    // Display
    //--------------------------------------------------



     if (node.generalCss ){ 
        node.generalCss.forEach(element => {
             root.classList.add(element);
        });

     }
       

      this.el.appendChild(root);


   // root.classList.add("pipelineNode");
          node.pipelineNode = root;
 // const pipelineNode = node.instance.el.querySelector(".pipelineNode");

 //================================================
 /*
     setSizeAfterRender({ 
         widthAfter  = this.el.width,
         heightAfter = this.el.width,
     })*/
                  
         this.#scrollSelectedIntoView();
    }
 

    headerOnClickDOM(details ,node,root){ 

        
         details.style.display = node.state.detailsOpen? "block"  : "none";
 
        if( node.state.detailsOpen ){
          root.classList.add("open");
         }else{ 
              root.classList.remove("open");  
        }
    }
 

     setPosition(anchorData){ 
               this.el.style.position =  anchorData.position; // "fixed";
               this.el.style.left    =   anchorData.left;//  (rect.left ) + "px";
               this.el.style.top     =   anchorData.top;// rect.bottom + "px";
               this.el.style.right   =   anchorData.right;//    "auto";
    }

    getRect() {

      return this.el.getBoundingClientRect();

   }


    renderList(){ 
        this.el.innerHTML = "";
 
         //   console.log( "renderProducersList  drop down this.items : "   ,this.data  );

            if( this.data.anchor ){ 
                    const rect = this.data.anchor.getBoundingClientRect();
                    this.el.style.position = "fixed";
                    this.el.style.left = (rect.left ) + "px";
                    this.el.style.top = rect.bottom + "px";
                    this.el.style.right = "auto";

            }



            if( this.data.anchorData ){
                    this.el.style.position =  this.data.anchorData.position; // "fixed";
                    this.el.style.left    =  this.data.anchorData.left;//  (rect.left ) + "px";
                    this.el.style.top     =  this.data.anchorData.top;// rect.bottom + "px";
                    this.el.style.right   =  this.data.anchorData.right;//    "auto";
                
            }

                this.dataRenderList(this.el,this.data.renderList, null );
 
                if (this.data.infoList ){ 
                    this.renderInfo(this.data.infoList);
                }
                 
                this.#scrollSelectedIntoView();
    }
    
    dataRenderList(container, dataList, node){ 
            dataList.forEach((item, index) => {

                 // this allow the node to display only values result for 1 specific token
                   if (node ){ 
                     if (node.token.type === "VALUE"){ 
                        if (item.select.start !== node.token.start )return;  
                     }
                   } 
 


                       const row = document.createElement("div");
                             row.classList.add("pipelineNodeRow");
 
                   

                     const div = document.createElement("div");
                     div.classList.add("pipelineNodeRowKey");

                     const val = document.createElement("div");
                           val.classList.add("pipelineNodeRowValue");
                           val.textContent = item.val;
                  
                    if (index === this.selected){  div.classList.add("selected"); }
                      
                        div.textContent = item.label;//  itemLabel;
                        val.textContent = item.val;
                      
                  
                        div.onclick = () => {
                             if (node){ 
                                 node.onSelect( item.select );//itemLabel
                             }else{ 
                                 this.onSelect( item.select );//itemLabel
                             }

                        } 
                       
                         row.appendChild(div);
                         row.appendChild(val);

                         container.appendChild(row);

                });
         
    }
    renderQueryExamlpe(){ 
        this.el.innerHTML = "";

                this.items.forEach((item, index) => {

                    const div = document.createElement("div");

                    div.className = "queryItem";

                    if (index === this.selected)
                        div.classList.add("selected");

                     div.textContent = item.raw;
                     div.onclick = () => this.onSelect(item);
                     this.el.appendChild(div);

                });

                this.#scrollSelectedIntoView();
    }

    renderInfo(infoList){

    infoList.forEach(info => {

        const row=document.createElement("div");
         row.className="assistantInfo assistantInfo--"+info.type;
         row.textContent=info.text;
         this.el.appendChild(row);

        });

    }

    selectNext() {

       //  console.log( "this.items  = ", this.items   );
        if (!this.items.length) return;

        this.selected = Math.min(
            this.selected + 1,
            this.items.length - 1
        );

        this.render();

    }

    selectPrevious() {

        if (!this.items.length) return;

        this.selected = Math.max( this.selected - 1,  0 );
           
        this.render();

    }

    get selectedItem() {

        return this.items[this.selected];

    }

    show( /*{anchor, items,type}={}*/) {
 
        this.el.classList.add("visible");

    }

    hide() {
 
         console.log( "============              hide" , this.el    );
      console.trace("hide() called");

        this.el.classList.remove("visible");

    }

    get isOpen() {

        return this.el.classList.contains("visible");

    }

    #scrollSelectedIntoView() {

        const selected = this.el.querySelector(".selected");

        selected?.scrollIntoView({
            block: "nearest"
        });

    }

}