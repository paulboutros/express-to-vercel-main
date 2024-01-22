import { connectToDataBase } from "../../../lib/connectToDataBase.js";
import jwt from 'jsonwebtoken';
import  {Push_giveaway_toList } from "../GiveAway/GiveAwayLayers.js"



// this is a referral middleware that is used my egt user/me
// so when the referred user get authenticated, this will execute
// obsiously at this point the referral code exist since it has be shared

const processClientReferralToken = async (request, response, next) => {

  
  try {
    // Get the referral token from the cookie
    const referralDataCookie = request.cookies.referralData;

 
    
    if (!referralDataCookie) {
      // Handle the case when no referral token is found
      // Continue with the request (for users who do not have a referral code)
      return next();
    }
    const referralData = JSON.parse(request.cookies.referralData);
    const referralCode = referralData.referralCode;
   // console.log("XXXXXXXXXXXXXXXXX   Referral Code: " + referralCode);

    const { mongoClient } = await connectToDataBase();
    const db = mongoClient.db("wudb");
    const user_tracking = db.collection("user_tracking");



    /*
    const referrer_user = await user_tracking.findOne({
      "referralCodes": {
        $elemMatch: {
          $eq:  referralCode // Use referralData to access the referral code
        }
      }
    });
*/
const referrer_user = await user_tracking.findOne({
  "referralCodes.code": referralCode
});

    //console.log("  >>>>>>>>>>>>>>   middleware referralData: "   , referralCode);
   
   
    if (referrer_user) {
  
      const  tempID =referrer_user.ID;  // this is wrong should eb replsced by REFERRED
      

      const result = await user_tracking.updateOne(
        { ID: referrer_user.ID, "referralCodes.referredUser": { $ne: tempID } },  
        { $addToSet: { "referralCodes.referredUser": tempID } }
      );
      

      let rewardedGiveAway;
      if (result.modifiedCount === 0) {
        console.log(`Element ${tempID} already exists in the array.`);
        // Perform your action if the element already exists.
   
           // after joining with invite, the site will try to authenticate again sending the cookie
           // the referral cookie will still exist,
          // so this code will run again
          // and we not not want to give away twice
        next();
       // return response.status(401)
      //  .json({ message: `This user has already joined using the invite ${referralCode} !!` });
      } else {
        rewardedGiveAway = Push_giveaway_toList(referrer_user.ID,1);
        console.log(`GiveAwayLayers  >>Element ${tempID} was added to the array.`);
        // Perform your action if the element was added.
      }
 
 
       next();
    }else{
        next();

    }

  
  } catch (error) {
    // Handle any errors related to referral token verification
    console.error(error);
      return response.status(401).json({ message: 'Invalid or expired referral token' });
  }
};





export default processClientReferralToken;
