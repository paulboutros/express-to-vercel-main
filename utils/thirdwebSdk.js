import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Sepolia } from "@thirdweb-dev/chains";

import { ethers } from "ethers";
 export   function GetThirdWebSDK_fromSigner( ETH_NETWORK){

     const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  ); // "{{private_key}}"
     const sdk =   ThirdwebSDK.fromSigner(signer,  ETH_NETWORK , {
     
      secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
    });
  return sdk;

}

export async function GetThirdWeb_readOnlySdk(  ETH_NETWORK  ){
  
const readOnlySdk = new ThirdwebSDK( ETH_NETWORK , {
    //clientId:  process.env.REACT_APP_THIRDWEB_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
    secretKey:  process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  });
return readOnlySdk ;

} 






export async function GetThirdWebSDK( ETH_NETWORK ){

    const sdk =  new ThirdwebSDK( ETH_NETWORK  , {
        secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY,
      });
      return sdk;

}

export async function GetThirdWebSDK_fromPrivateKey( ETH_NETWORK ){

  
 //return;
const sdk = await ThirdwebSDK.fromPrivateKey(
    process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY,
     ETH_NETWORK,
    {
          clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
    }
    );
   
     return sdk;
}

export async function GetThirdWebSDK_readOnly(){
     const sdk =   new ThirdwebSDK(  Sepolia 
       ,
        {
              clientId:  process.env.REACT_APP_THIRDWEB_CLIENT_ID
           // secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY 
        }
        );
       
    
         return sdk;
    }