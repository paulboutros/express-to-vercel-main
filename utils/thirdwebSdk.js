import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Sepolia } from "@thirdweb-dev/chains";

import { ethers } from "ethers";
 export   function GetThirdWebSDK_fromSigner(){

     const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  ); // "{{private_key}}"
     const sdk =   ThirdwebSDK.fromSigner(signer, process.env.REACT_APP_ETH_NETWORK, {
     // clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID , // Use client id if using on the client side, get it from dashboard settings
      secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
    });
  return sdk;

}

export async function GetThirdWeb_readOnlySdk(){
  // Read-only mode
const readOnlySdk = new ThirdwebSDK(process.env.REACT_APP_ETH_NETWORK, {
    //clientId:  process.env.REACT_APP_THIRDWEB_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
    secretKey:  process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  });
return readOnlySdk ;

} 






export async function GetThirdWebSDK(){

    const sdk =  new ThirdwebSDK(process.env.REACT_APP_ETH_NETWORK, {
        secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY,
      });
      return sdk;

}

export async function GetThirdWebSDK_fromPrivateKey(){
const sdk = await ThirdwebSDK.fromPrivateKey(
    process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY,
    process.env.REACT_APP_ETH_NETWORK,
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