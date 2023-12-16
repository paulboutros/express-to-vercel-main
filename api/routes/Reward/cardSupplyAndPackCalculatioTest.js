// you can test this in:
// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
// this is jsut to get estimates  of al pack data
const progress = 1;
function calculate(){
    let supply = 0;
    let total=0;
    for (let i =1; i <= 10; i++ ){
        
        total = i ;
        supply +=total;
        console.log("head design ", i,"=" , total);
        
    }
console.log("==============================================" );  
      calculatepacks( supply);
 console.log("==============================================" );
} 

function calculateLogarithmic() {
    let supply = 0;
    let total = 0;
    for (let i = 0; i <= 10; i++) {
         total = Math.ceil(Math.log(i + 1) * 10);
        supply +=total;
     
        console.log("head design ", i, "=", total);
    }
 console.log("==============================================" );  
      calculatepacks( supply);
 console.log("==============================================" );
     
}


export function createPackSuppy(){
    for (let i =1; i <  49; i++ ){
        
        tokenId = i ;
        supply +=total;
        console.log("head design ", i,"=" , total);
        
    } 

}

calculate();

calculateLogarithmic();

function calculatepacks( supply ) {
    
    console.log("supply ", supply );
    const totalSuppy = totalSupply = supply * 5;
    console.log("totalSuppy ", totalSuppy );
     return totalSuppy;
}


/*
then find the varition total supply factor

Our total supply is 275 so:

1   >> 275 cards
5   >> 55 cards
11  >>  25 cards
25  >>  11 cards

55  >>   5 cards


275 >>   1 cards


let's go with 55 pack of 5 card.



*/
