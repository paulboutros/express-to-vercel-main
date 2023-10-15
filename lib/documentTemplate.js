//import { Module } from "module";
  
// what a freshly created user should look like
//export const newUserDocument = 

  
  
/*
if you change something here, make sure you restaart the server before reuploading the scheme to the databese
*/
    export const newUserDocumentTemplate ={

        ID: "ID", 
        id: "id", // this is mendatory for material to id each row
        discord:  "discord",  
        wallet:  "wallet",
      
         walletShort:"[]",
         
        scoreData:{
            totalScore :0,
             scoreShare:0 , 

             socialScore:0, // this should only be used for the bar chars twitter +discord bar size

             layer:{
                total:0, // the total score for layer
                shScore:0, boScore:0,  heScore:0, weScore:0,

             },
             discord:{
                total:0, // the total score for layer
                invite_code :"" ,
                 message :0, 
                invite_sent : 0,
                 invite_use :0, fake_invite:0, discord_score:0,

             },
             twitter:{
                 like:0,  retweet:0, total:0,

             }

        },

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
   

  
 
