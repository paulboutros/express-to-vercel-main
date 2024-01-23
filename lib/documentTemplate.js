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
  debugMode:true, // let's make debug mode true by default, so new user can jump into the action right away
  

 /*
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
*/
  
 // airDopAmount :0,
 // socialScore :0,
  
    
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
     // newUserDocument.walletShort = getShortAddress( wallet)  ;
      newUserDocument.id = ID; // id ; 

      newUserDocument.discordUserData = discordUserData;
      newUserDocument.date =  new Date()

  return newUserDocument;

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



