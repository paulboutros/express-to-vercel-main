//import _ from 'lodash'
/*
if you change something here, make sure you restaart the server before reuploading the scheme to the databese
*/
export const layerSupply={
   
   //supply:{ kn: 4, be : 6,  we : 1, he : 1,sh : 4};
     
   layers:{
   
    kn:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,] ,  
    be:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,] ,  
    we:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,] ,  
    he:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,] ,  
    sh:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]   
  }
 }


 
export const newRewardCombo={
 // rewardID:"he1sh6we4kn7",
  prize:"1235", //|$12.35 ( / 100)
  claimed: false, // did somebody claimed or earned it?
  locked: false,

  lockPrices:[
    { userID:"1234",wallet:"1234" ,  lockprice:"1" , },
    { userID:"5678",wallet:"1234" ,  lockprice:"3"}

  ],
  layerSupplies :{ kn: 4, be : 6,  we : 1, he : 1,sh : 4}
    
    
   
    
    
}



export const newUserDocumentTemplate ={

  ID: "ID", 
  id: "id", // this is mendatory for material to id each row
  discord:  "discord",  
  wallet:  "wallet",

  discordUserData:{}, // the discord user object  from discord API  uer/@me

   walletShort:"[]",
   
  scoreData:{
      totalScore :0,
       scoreShare:0 , 
         earning: 0,

       socialScore:0, // this should only be used for the bar chars twitter +discord bar size

       layer:{
          total:0, // the total score for layer
          shScore:0, boScore:0,  heScore:0, weScore:0,

       },
       discord:{
        scoreShareRelative:0, // based on own total ...if user has 100 pt, and discord score = 50 ,  scoreShare = 50
        scoreShareAbsolute:0,

          earning:0,
          total:0, // the total score for layer
          invite_code :"" ,
           message :0, 
          invite_sent : 0,
           invite_use :0, fake_invite:0, discord_score:0,

       },
       twitter:{
        
           earning:0,
           total:0,
          
            like:0,  retweet:0,

       }

  },

 
  layers:{

    he:[] , 
    sh:[],    
    we:[], 
    be:[] ,  
    kn:[]
    
    
  },
  giveAwayTiming:{
      NextGiveAway:"",//time  // when login in, the server will check if current time is beyound this, if so, send reward
      lastGiveAway:"",//time
      frequency:"",//time
      giveAways:[] // should contain the following object:
      /*
         {  time: UTC time where is should be given
             given = false,  // will be set to true after the give away has been given aaway
             content:{}   // the content of the gie away
        }

      */
  },
  /*
  when layers are gived Away, store here,
  they will appear as question mark
  user will need to claim them
  they should be object like:
    {category, layerNumber}
  */
/*
  tempGiveAway:[


  ],
*/
 
  /*
  layers: [
    {
      category: "bo",
      items: [  ]
         
    },
    {
      category: "be",
      items: [  ]
         
    }
  ],
*/







  //=====================================================================================
 // allLayerScore:0, // the total score for layer
//  shScore:0,
  sh01:0, sh02:0,sh03:0,sh04:0,sh05:0,sh06:0,sh07:0,sh08:0,sh09:0,sh10:0,
//  boScore:0,
  bo01:0, bo02:0,bo03:0,bo04:0,bo05:0,bo06:0,bo07:0,bo08:0,bo09:0,bo10:0,
 // heScore:0,
  he01:0, he02:0,he03:0,he04:0,he05:0,he06:0,he07:0,he08:0,he09:0,he10:0,
//  weScore:0,
  we01:0, we02:0,we03:0,we04:0,we05:0,we06:0,we07:0,we08:0,we09:0,we10:0,


  
 //=====================================================================================
 


 

  airDopAmount :0,
  socialScore :0,
  
    
  date: new Date()
  // Other properties...


}

export const globalTemplate ={

all_invites_sent:0,
all_invites_used: 0, 
all_retweets: 0, // this is mendatory for material to id each row
all_likes: 0, // this is mendatory for material to id each row
reward_pool:  0 ,
sum_of_all_user_score:0
// highestEarner

}

export function CreateNewUserDocument(
  newUserDocument,


 ID, 
discord, 
wallet,
discordUserData, 
 //id
 ) {
   

  //let newUserDocument = _.cloneDeep(newUserDocumentTemplate); // Create a deep copy of newUserDocumentTemplate
      newUserDocument.ID = ID;
      newUserDocument.discord = discord;
      newUserDocument.wallet = wallet   ;
      newUserDocument.walletShort = getShortAddress( wallet)  ;
      newUserDocument.id = ID; // id ; 

      newUserDocument.discordUserData = discordUserData;
      newUserDocument.date =  new Date()

  return newUserDocument;

}


function getShortAddress(inputString){ 


if (inputString.length <= 8) {
// If the input string is 8 characters or less, return it as is
return inputString;
} else {
// If the input string is longer than 8 characters, format it
const firstFour = inputString.slice(0, 4); // Get the first 4 characters
const lastFour = inputString.slice(-4); // Get the last 4 characters
return  `${firstFour}..${lastFour}`;
}
}  


export function calculateEarning(rewardPool, userSharePercentage) {
  if (rewardPool < 0 || userSharePercentage < 0) {
    // Handle invalid input, such as negative values.
    return 0;
  }
      
  // Calculate the earnings in dollars (userSharePercentage should be in the range [0, 100]).
  const earning = (userSharePercentage / 100) * rewardPool;
  return  Round2(earning);
}
function Round2(number){

  return   Math.round(number * 100) / 100;
}



