
import { Client, Events, GatewayIntentBits } from 'discord.js' ;
 
 
import dotenv from 'dotenv';
dotenv.config();


const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_ID = process.env.SERVER_ID;
 

 
let discordClient = new Client({ intents: 
       [ GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers  ] });



 
//let mongoClient; // this becomes our cached connection
if (!process.env.BOT_TOKEN) {
    throw new Error('Invalid/Missing environment variable: "BOT_TOKEN"')
  }

   export async function connectToDiscord() {
    try {
      if (discordClient) {

       
        await discordClient.login(BOT_TOKEN);

       // console.log('>>>>>>>>>>>>>  discordClient!', discordClient );
        return { discordClient };
      }
  
    
      
      // Additional setup for your bot (events, commands, etc.)
  
      
  
      
      console.log('Discord Bot Connected!');
 
      return { discordClient };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }





 

   