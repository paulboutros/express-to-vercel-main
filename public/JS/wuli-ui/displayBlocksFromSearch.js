
/*
export function applyTraitSearchBlock(q){ 
   
  
   const blocks = document.querySelectorAll("#final_traitFILTERListContainer .trait-block");
 
  blocks.forEach(block => {
    const select = block.querySelector("select");
    let hasMatch = false;

    Array.from(select.options).forEach(opt => {
      if (!opt.value) {
        opt.hidden = false; // always keep "(ignore)"
        return;
      }

      const match = opt.textContent.toLowerCase().includes(q);
      opt.hidden = !match;

      if (match) hasMatch = true;
    });

    // hide whole trait group if nothing matches
    block.style.display = hasMatch || q === "" ? "" : "none";
  });
 

}
*/



export function applyTraitSearchBlock(q) {
  q = (q || "").trim().toLowerCase();

  const blocks = document.querySelectorAll(
    "#final_traitFILTERListContainer .trait-block"
  );

  blocks.forEach(block => {
    const select = block.querySelector("select");

    // Empty query => restore everything
    if (q === "") {
      Array.from(select.options).forEach(opt => {
        opt.hidden = false;
      });

      block.style.display = "";
      return;
    }

    let hasMatch = false;

    Array.from(select.options).forEach(opt => {
      if (!opt.value) {
        opt.hidden = false; // always keep "(ignore)"
        return;
      }

      const match = opt.textContent.toLowerCase().includes(q);
      opt.hidden = !match;

      if (match) hasMatch = true;
    });

    // hide whole trait group if nothing matches
    block.style.display = hasMatch ? "" : "none";
  });
}