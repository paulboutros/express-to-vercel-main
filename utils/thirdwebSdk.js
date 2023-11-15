import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Goerli } from "@thirdweb-dev/chains";

import { ethers } from "ethers";
 const chain = "goerli";
export   function GetThirdWebSDK_fromSigner(){

     const signer = new ethers.Wallet(process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY  ); // "{{private_key}}"
     const sdk =   ThirdwebSDK.fromSigner(signer, chain, {
     // clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID , // Use client id if using on the client side, get it from dashboard settings
      secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
    });
  return sdk;

}

export async function GetThirdWeb_readOnlySdk(){
  // Read-only mode
const readOnlySdk = new ThirdwebSDK(chain, {
    //clientId:  process.env.REACT_APP_THIRDWEB_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
    secretKey:  process.env.REACT_APP_THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  });
return readOnlySdk ;

} 






export async function GetThirdWebSDK(){

    const sdk =  new ThirdwebSDK(chain, {
        secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY,
      });
      return sdk;

}

export async function GetThirdWebSDK_fromPrivateKey(){
const sdk = await ThirdwebSDK.fromPrivateKey(
    process.env.REACT_APP_THIRDWEB_WALLET_PRIVATE_KEY,
    chain,
    {
          clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
    }
    );

     return sdk;
}

export async function GetThirdWebSDK_readOnly(){
    const sdk =   new ThirdwebSDK(  Goerli 
       ,
        {
            clientId:  process.env.REACT_APP_THIRDWEB_CLIENT_ID
           // secretKey: process.env.REACT_APP_THIRDWEB_SECRET_KEY 
        }
        );
       
    
         return sdk;
    }