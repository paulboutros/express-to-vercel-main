 import { Client, Events, GatewayIntentBits } from 'discord.js' ;
 
//node botTest.js
import dotenv from 'dotenv';
 
dotenv.config();

/*
const serverId="947487866622201886"  
const token="OTgzMDIzMjU0MjQ5ODA3OTMz.GafhGl.Cv9QNG9gWEjIy3l73gQLaLU7FgkPIY_zvm1WGo"
const clientId="983023254249807933"
*/


const targetChannelID = '947487867658199071';
 
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const channel = client.channels.cache.get(targetChannelID);  

client.once(Events.ClientReady, () => {
	console.log('Ready!');
 
   const channel = client.channels.cache.get(targetChannelID);  

  
      channel.send('>>>>>>>>>  Hello, this is a message from the bot!');

 
        const guild = client.guilds.cache.get(serverId);
        if (guild) {
            console.log(`Bot is a member of the guild: ${guild.name}`);
        } else {
            console.log(`Bot is not a member of the specified guild.`);
        }

       

});


 
async function  getMembers(guild){
   
    const allMembers = [];
  
    const ServerMembers = await guild.members.fetch();
    // Filter out the bots
    const members = ServerMembers.filter(member => !member.user.bot);
  
     
    for (const member of members.values()) {
      const user = member.user;
  
      // Now you can access properties of the 'user' object
      const username = user.username;
      const userID = user.id;
      
       console.log(`>>  user:`, user);
      
        allMembers.push(user);
  
  
  
    }
  
 
     
}


client.on("message", (message) => {
    if (message.author.bot || !message.guild) return;
  
    // command handler
    
  })





client.on(Events.InteractionCreate, interaction => {
 });

client.login(   token    );  

//node botTest.js
