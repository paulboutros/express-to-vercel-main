
  const buttonRegistry ={};
  export function getButtonRegistry(){
     return buttonRegistry;
  }

 const widgetContent={};
  export function getDOMregistry(){ 

     return widgetContent;

  }

  export function getDOMRoot() {
 
    return (
        getDOMregistry().widgetContent
        || document
    );

}

export function getDOMElement(id) {

    return getDOMRoot().querySelector(
        `#${id}`
    );

}
/*
document
│
├── #app
│    └── #queryBox          ← document.querySelector() can see this
│
└── <my-widget>
      #shadow-root
          └── #queryBox     ← document.querySelector() CANNOT see this
*/