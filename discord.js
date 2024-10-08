const {  Client } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Functions = require("./functions")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');




class DiscordBot {
  constructor(appCheckToken) {
    this.token = appCheckToken
    this.functions = new Functions()
    this.client = new Client({intents:32767});
    this.commands = [];
  }

  setupCommands() {
    this.commands.push(
      new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your Account To your discord Account')
        .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
        .toJSON()
    );
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('freetrades')

        .setDescription('Send freetrades to an user')

        .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
          
          .addIntegerOption(option =>

        option.setName('amount')

            .setDescription('The amount of trades')

            .setRequired(true))

        .toJSON()

    );


    this.commands.push(
      new SlashCommandBuilder()
        .setName('appcheck')
        .setDescription('View the appchecks expiration')
        .toJSON()
    );
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('wallet')

        .setDescription('See your wallet!')
        .addUserOption(option=>
                         option.setName("user")
                         .setDescription("From which person u wanna see the wallet?")
                         .setRequired(false))
                       //.addChoices({name:"Coins",value:"1"})
                         //.addChoices({name:"Cards",value:"2"})
                         //.addChoices("Packs",3)
                         //.addChoices("Special",4)

        .toJSON()

    );
      
      this.commands.push(
          new SlashCommandBuilder()
          .setName("deposit")
          .setDescription("Deposit items from your account to your wallet")
          .addBooleanOption(option=>
                            option.setName("multiple")
                            .setDescription("Wanna deposit more than 1 trade?")
                            .setRequired(true)
                            )
          .toJSON()
          )
          
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('mapping')

        .setDescription('Map the bot with the players and packs file!')

        .toJSON()

    );
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('view-link')

        .setDescription('View the madfut username linked to your discord account')

        .toJSON()

    );
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('one-rt')

        .setDescription("Send one bot into rt lol logs are there")

        .toJSON()

    );
      
      this.commands.push(

      new SlashCommandBuilder()

        .setName('unlink')

        .setDescription('Unlink your madfut account from this discord account')

        .toJSON()

    );
      
 /*     this.commands.push(
          new SlashCommandBuilder()
          .setName("pay")
          .setDescription("Pay users items from your own wallet")
          .addUserOption(option=>
                         option.setName("user")
                         .setDescription("The user u want to pay")
                         
                         .setRequired(true))
          
          .addIntegerOption(option=>

                         option.setName("coins")

                         .setDescription("The amount of coins to pay")

                         

                         .setRequired(false))
          
          .addStringOption(option=>

                         option.setName("cards")

                         .setDescription("The cards u want to pay seperatee by a comma")

                         

                         .setRequired(false))
          
          .addStringOption(option=>

                         option.setName("packs")

                         .setDescription("The packs you want to pay seperated by a comma")

                         

                         .setRequired(false))
          
          
      )*/
      
      this.commands.push(
          new SlashCommandBuilder()
          .setName("withdraw")
          .setDescription("Withdraw wallet items to your madfut account")
          .addIntegerOption(option=>
                            option.setName("amount").setDescription("How many items overall?").setRequired(true))
          .addStringOption(option=>
                      option.setName("type").setDescription("Packs or cards to withdraw?").addChoices({name:"Packs",value:"packs"}).addChoices({name:"Cards",value: "cards"}).setRequired(true))
          
          
                            
          .toJSON()
          
      )
          
      
      this.commands.push(
          new SlashCommandBuilder()
          .setName("search-card")
          .setDescription("Search a player via name of the current mapping")
          .addStringOption(option => option.setName('name').setDescription('Players name').setRequired(true))
          .addBooleanOption(option=>
                            option.setName("exactly").setDescription("Wheter the name needs to match exactly (default -> true").setRequired(false))
          .addIntegerOption(option=>
                            option.setName("rating").setDescription("The rating (optional)").setRequired(false))
          
          .toJSON()
          );
      
      
      
      this.commands.push(

          new SlashCommandBuilder()

          .setName("admin-pay")

          .setDescription("Pay a member items for free :)")

          .addUserOption(option => option.setName('user').setDescription("User to pay").setRequired(true))

          .addIntegerOption(option=>

                            option.setName("coins").setDescription("How many coins to pay?").setRequired(false))

          .addIntegerOption(option=>

                            option.setName("bot-trades").setDescription("How many bot trades to pay?").setRequired(false))
          
          .addStringOption(option=>

                            option.setName("cards").setDescription("What cards to pay? Seperate the card ids with a comma 11x id27234, 20x id28272").setRequired(false))
          
          .addStringOption(option=>

                            option.setName("packs").setDescription("What packs to pay? Seperate the ids with a comma. 1x 95_special, 5x 94_special").setRequired(false))

          

          .toJSON()

          );
      
      
      
      this.commands.push(
          new SlashCommandBuilder()
          .setName("clear-wallet")
          .setDescription("Clear someones wallet completly")
          .addUserOption(option=>
                         option.setName("user")
                         .setDescription("The user which wallet needs a reset")
                         .setRequired(true))
          .toJSON()
          )
      
      this.commands.push(

          new SlashCommandBuilder()

          .setName("search-pack")

          .setDescription("Search a pack via name of the current mapping")

          .addStringOption(option => option.setName('name').setDescription('acks name').setRequired(true))

          .addBooleanOption(option=>

                            option.setName("exactly").setDescription("Wheter the name needs to match exactly (default -> true").setRequired(false))

        

                           

          

          .toJSON()

          );
    




    
    this.client.once('ready', () => {
      console.log('Discord bot is ready!');
      this.registerCommands();
    });

    this.client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()){
      //    if (interaction.isButton()) {
       //       console.log("Button")
         

    

 // }else{
      return//}
          }

      const { commandName, options } = interaction;
        
        if(commandName == "one-rt"){
            await interaction.reply("Sending...")
            await this.functions.rt(this.token)
            await interaction.followUp("Done")


                         
    }else if (commandName === 'link') {
        const username = options.getString('username');

        // Call the function from FirestoreFunctions class
      //  await firestoreFunctions.linkAccount(username, interaction);
        this.functions.linkAccount(username,interaction,this.token)
          }else if(commandName === "wallet"){
              var user
              var username
              if(options.getUser("user")){
              user = options.getUser("user").id
                  username = options.getUser("user").username
                  }else{
                      user = interaction.user.id
                      username = interaction.user.username
                      }
           //   console.log(user)
              
              const wallet = await this.functions.getWallet(user)
              console.log(wallet)
              //console.log(options.getString("coins"))
              const tradesDoneByUser = await this.functions.getTradeAmount(user)
              const crd = []
              const pck = []
        /*      for(var qwert of JSON.parse(wallet.packs)){
                  console.log(qwert)
                  pck.push(qwert)
                  
              }
              for(var qwert of JSON.parse(wallet.cards)){
                  crd.push(qwert)
                  
              }*/
                 
              var embed = new EmbedBuilder();

  embed.setTitle(username + "'s wallet overview");

  embed.setColor("#FFA500");
              var walletPacksRight
              var walletCardsRight
              try{
               walletPacksRight = JSON.parse(wallet.packs)
               walletCardsRight = JSON.parse(wallet.cards)
              }catch{
                  walletPacksRight = {}
                  walletCardsRight = {}
              }
              embed.setDescription("Coins: " + wallet.coins +"\nDifferent Cards: " + Object.keys(walletCardsRight).length + "\nDifferent Packs: " + Object.keys(walletPacksRight).length + "\nBot Trades: " + wallet.botTrades)
              
              const select = new StringSelectMenuBuilder()
			.setCustomId('items')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Coins')
					.setDescription('View your coins')
					.setValue('coins'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Cards')
					.setDescription('View your cards')
					.setValue('cards'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Packs')
					.setDescription('View your packs')
					.setValue('packs'),
                new StringSelectMenuOptionBuilder()
                .setLabel("Bot trades")
                .setDescription("View your bot trades")
                .setValue("bot-trades")
			);
              
              const row = new ActionRowBuilder()

			.addComponents(select);
              
        /*      const coins = new ButtonBuilder()

			.setCustomId('coins')

			.setLabel('Coins')
              
              const cards = new ButtonBuilder()

			.setCustomId('cards')

			.setLabel('Cards')
              
              const packs = new ButtonBuilder()

			.setCustomId('packs')

			.setLabel('Packs')
              
              const special = new ButtonBuilder()

			.setCustomId('special')

			.setLabel('Special')

			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder()

			.addComponents(coins);
             */ 
              var msg = await interaction.reply({
                  embeds:[embed],
                  components: [row]
               
                  })
              var coll = msg.createMessageComponentCollector(//{
             //     filter:i=> i.user.id === interaction.user.id
                  //});
                  );
              coll.on("collect",async (i)=>{
                  if(i.user.id != interaction.user.id){
                   
                      await i.reply({
                          content:"Not your wallet!",
                          ephemeral:true
                          })
                      }else{
                          if(i.values.includes("coins")){
                              embed = new EmbedBuilder();

  embed.setTitle(username + "'s wallet's coins");

  embed.setColor("#FFA500");

              embed.setDescription("Your coins: **"+wallet.coins+"**")
                              
                              
                            

  
                              await interaction.editReply({embeds:[embed],components:[row]})
                              await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })
                             
                            
                      
                              
                              }else if(i.values.includes("packs")){
             //                     await i.reply({content:"Success",ephemeral:true})
                                  const packs = JSON.parse(wallet.packs);
const packEntries = Object.entries(packs);
                                  if(packEntries.length > 0){
                                  packEntries.sort((a, b) => b[1] - a[1]);

const embedChunks = [];
let currentChunk = '';

for (const [pack, amount] of packEntries) {
    var packLine
    if (pack.startsWith('query,')) {
    const packInfo = pack.split(',');

    const packName = packInfo[1];
    const firstValue = packInfo[3];
    const secondValue = packInfo[4];
    const lastValue = packInfo[9];
//query,shapeshifters,,96,98,-1,-1,-1,false,100
    packLine = `**${amount}X** *${packName} ${firstValue}-${secondValue} ${lastValue}% New custom pack*\n`;
        }else{
    const packDisplayName = await this.functions.getPackName(pack)
  packLine = `**${amount}X** *${packDisplayName}*\n`;
            }

  if (currentChunk.length + packLine.length > 2048) {
    embedChunks.push(currentChunk);
    currentChunk = '';
  }

  currentChunk += packLine;
}

if (currentChunk.length > 0) {
  embedChunks.push(currentChunk);
}

for (let i = 0; i < embedChunks.length; i++) {
  const embed = new EmbedBuilder();
  embed.setTitle(`${username}'s wallet's packs (${i + 1}/${embedChunks.length})`);
  embed.setColor("#FFA500");
  embed.setDescription(embedChunks[i]);

  if (i === 0) {
      await interaction.editReply({ embeds: [embed], components: [row] })
  //  await i.reply({
   //   content: "Success",
   //   ephemeral: true,
  //    embeds: [embed],
 //   });
  } else {
    await interaction.followUp({ embeds: [embed], components: [row] });
  }
}
                                  await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })
                                  
                                  
                                  
                                  
                              
                              
                          
                         }else{
                             const embed = new EmbedBuilder();

  embed.setTitle(`${username}'s wallet's packs`);

  embed.setColor("#FFA500");

  embed.setDescription("No packs to show ;-;");
                             await interaction.editReply({embeds:[embed],components:[row]})
                             await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })
                             }
                              }else if(i.values.includes("cards")){
                              
               //               await i.reply({content:"Success",ephemeral:true})
                                  const cards = JSON.parse(wallet.cards);
const cardEntries = Object.entries(cards);
                                  if(cardEntries.length > 0){
                                  cardEntries.sort((a, b) => b[1] - a[1]);

const embedChunks = [];
let currentChunk = '';

for (const [card, amount] of cardEntries) {
    var cardLine
  /*  if (card.startsWith('query,')) {
    const cardInfo = pack.split(',');

    const packName = packInfo[1];
    const firstValue = packInfo[3];
    const secondValue = packInfo[4];
    const lastValue = packInfo[9];
//query,shapeshifters,,96,98,-1,-1,-1,false,100
    packLine = `**${amount}X** *${packName} ${firstValue}-${secondValue} ${lastValue}% New custom pack*\n`;
        }else{*/
    const xd = await this.functions.getPlayerName(card)
    if(xd.success){
  cardLine = `**${amount}X** *${xd.cardRating} ${xd.cardType} ${xd.cardDisplayName}*\n`
  }else{
      cardLine = `**${amount}X** *${xd.id}*\n`}
       //     }

  if (currentChunk.length + cardLine.length > 2048) {
    embedChunks.push(currentChunk);
    currentChunk = '';
  }

  currentChunk += cardLine;
}
if (currentChunk.length > 0) {
  embedChunks.push(currentChunk);
}

for (let i = 0; i < embedChunks.length; i++) {
  const embed = new EmbedBuilder();
  embed.setTitle(`${username}'s wallet's cards (${i + 1}/${embedChunks.length})`);
  embed.setColor("#FFA500");
  embed.setDescription(embedChunks[i]);

  if (i === 0) {
      await interaction.editReply({ embeds: [embed], components: [row] })
  //  await i.reply({
   //   content: "Success",
   //   ephemeral: true,
  //    embeds: [embed],
 //   });
  } else {
    await interaction.followUp({ embeds: [embed], components: [row] });
  }
}
                              await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })
                          
                                      

                              

                          }else{
                              await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })
                              
                              const embed = new EmbedBuilder();

  embed.setTitle(`${username}'s wallet's cards`);

  embed.setColor("#FFA500");

  embed.setDescription("No cards to show °-°");
                              await interaction.editReply({embeds:[embed],components:[row]})
                          }

                              }else if(i.values.includes("bot-trades")){

                             embed = new EmbedBuilder();

  embed.setTitle(username + "'s wallet's bot trades");

  embed.setColor("#FFA500");

              embed.setDescription("Your bot trades: **"+wallet.botTrades+"**")
                          //        await //i.reply({

                                  //content:"Sucess",

                                  //ephemeral:true

                                  

                              await interaction.editReply({embeds:[embed],components:[row]})
                                  await i.reply({

                                  content:"Sucess",

                                  ephemeral:true

                                  })

                              }else{}
                
                  
              }
                  })
              
              
          }else if(commandName === "freetrades"){
              if(interaction.member.permissions.has("ADMINISTRATOR")){
              const username = options.getString("username")
              const amount = options.getInteger("amount")
              this.functions.freeTrades(username,amount,interaction,this.token)
              }else{await interaction.reply("no perms!")}
      }else if(commandName === "mapping"){
          if(interaction.member.permissions.has("ADMINISTRATOR")){
          await interaction.reply("Give me some time...")
          this.functions.updateMapping(interaction)
          }else{interaction.reply("No perms!")}
      }else if(commandName === "search-card"){
          if(!interaction.member.permissions.has("ADMINISTRATOR")){
              interaction.reply("No perms!")
          }else{
          const name = options.getString("name")
          const rating = options.getInteger("rating")
          const exactly = options.getBoolean("exactly")
          var result = await this.functions.searchPlayersByName(name, rating,exactly, interaction);
await interaction.reply("Your cards (" + result.length + "):");
          while (result.length > 0) {
  var embed = new EmbedBuilder();
  embed.setTitle("Results " + name + ":");
  embed.setColor("#FFA500"); // Orange color

  for (var i = 0; i < 2; i++) {
    if (result.length === 0) {
      break;
    }

    var card1 = result.shift();
    var card2 = result.shift();
  //  if(card1 == undefined || card2 == undefined){
    //    await interaction.followUp({embeds:[embed]})
    //    break
   //     }
    
    embed.addFields(
      { name: "__**Name**__", value: card1.name, inline: true },
      { name: "__**Id**__", value: card1.id, inline: true },
      { name: "__**Rating**__", value: card1.rating.toString(), inline: true },
      { name: "__**Card type**__", value: card1.color.toString(), inline: true },
      { name: "__**Position**__", value: card1.position, inline: true },
      { name: "**---------------**", value: "\u200b", inline: true }
    );

    if(card2 != undefined){
    embed.addFields(
      { name: "__***Name***__", value: card2.name, inline: true },
      { name: "__**Id**__", value: card2.id, inline: true },
      { name: "__**Rating**__", value: card2.rating.toString(), inline: true },
      { name: "__**Card type**__", value: card2.color.toString(), inline: true },
      { name: "__**Position**__", value: card2.position, inline: true },
      { name: "**---------------**", value: "\u200b", inline: true }
    );
        }
  }

  await interaction.followUp({ embeds: [embed] });

  if (result.length === 0) {
    break;
  }
          }
          
          
          
          


   
    
  

          
          
          
          
       
          
     // .addFields(


      
      
      
          
         
        
          
          
       
              
      

		

		

        
          

  
         

    
          
          }
         }else if(commandName === "clear-wallet"){
             if(interaction.member.permissions.has("ADMINISTRATOR")){
             const user = options.getUser("user")
             const userId = user.id
             await this.functions.clearWallet(userId)
             await interaction.reply("Sucess!")
             }else{
                 await interaction.reply("No perms!")
             }
             
             
             
             
         }else if(commandName === "deposit"){
             
             const multiple = options.getBoolean("multiple")
             await this.functions.deposit(interaction,multiple,this.token)
             
             
             
        }else if(commandName == "unlink"){
            const result = await this.functions.unlinkMfUsername(interaction)
            if(result){
                await interaction.reply("Successfully unlinked!")
                }else{
                    await interaction.reply("You aren't linked to an account, so no need to unlink! Link one using /link")
                    }
            
            
       }else if(commandName == "view-link"){
           
           const username = await this.functions.getCurrentLink(interaction)
           if(username){
               if(username.mfUsername == null){
                   await interaction.reply("You arent currently linked!")
                   }else{
           await interaction.reply("Your currently linked to: **" + username.mfUsername + "**")
                       }
               }else{
             
                   await interaction.reply("You arent currently linked!")
                   }
                   
           
           
      }else if(commandName === "search-pack"){
          if(!interaction.member.permissions.has("ADMINISTRATOR")){
              await interaction.reply("No perms!")
          }else{
          const name = options.getString("name")
          const exactly = options.getBoolean("exactly")
          var result = await this.functions.searchPack(name,exactly,interaction)
          if(result.length == 16){
            await interaction.reply("Your packs ("+result.length+" prob more though use better search):")
              }else{
                  await interaction.reply("Your packs ("+result.length+")")
                  }
          while (result.length > 0) {

  var embed = new EmbedBuilder()

  .setTitle("Results " + name + ":");

  var perEmbed = 0;

  for (var i = 0; i < 8; i++) {

    if (result.length === 0) {

      break;

    }

    var pack = result.shift();
      embed.addFields(

      {name: "__***Name***__",value:pack.displayName},

      { name: "__**Id**__", value: pack.packId },


  //    { name: "__**Position**__", value: card.position },

  //    { name: "__**Id**__", value: card.id },

      { name: "**---------------**", value: "\u200b" }

    );

    perEmbed++;

  }

  await interaction.followUp({ embeds: [embed] });

if (result.length === 0) {

    break;

  }

}
          
          
          
          
          
          } 
      }else if(commandName === "appcheck"){
        
        const showStr = await this.functions.appcheckDateReturn(this.token)
        const embed = new EmbedBuilder()
  .setTitle('Appcheck expiration')
  .setDescription(showStr)
  .setColor('#00FF00')
  .setTimestamp();
        await interaction.reply({embeds:[embed]})
      }else if(commandName === "admin-pay"){
          if(!interaction.member.permissions.has("ADMINISTRATOR")){
              await interaction.reply("U tried xD")
          }else{
          const user = options.getUser("user")
          const coins = options.getInteger("coins")
          const botTrades = options.getInteger("bot-trades")
          const cards = options.getString("cards")
          const packs = options.getString("packs")
          
     /*     function transformStringToObject(inputString) {
  const regex = /(\d*)\s*x?\s*([^\s,]+)/g;
  const matches = inputString.matchAll(regex);
  const obj = {};

  if (!inputString.includes(',')) {
    const match = regex.exec(inputString);
    if (match) {
      const quantity = match[1] ? parseInt(match[1]) : 1;
      const id = match[2];
      obj[id] = quantity;
    }
  } else {
    for (const match of matches) {
      const quantity = match[1] ? parseInt(match[1]) : 1;
      const id = match[2];
      obj[id] = quantity;
    }
  }

  return obj;
          }*/
          
          
    /*      function transformStringToObject(inputString) {
  const regex = /(\d*)\s*x?\s*([^\s,]+)/g;
  const matches = inputString.matchAll(regex);
  const obj = {};

  for (const match of matches) {
    const quantity = match[1] ? parseInt(match[1]) : 1;
    const id = match[2];
    obj[id] = quantity;
  }

  return obj;
          }*/
          
          
        /*  function transformStringToObject(inputString) {
  const regex = /(\d*)x?\s*([^\s,]+)/g;
  const matches = inputString.matchAll(regex);
  const obj = {};

  for (const match of matches) {
    const quantity = match[1] ? parseInt(match[1]) : 1;
    const id = match[2];
    obj[id] = quantity;
  }

  return obj;
}*/
/*function transformStringToArray(inputString) {
  const packs = inputString.split(",");
  const arr = [];

  for (const pack of packs) {
    const parts = pack.split("x");
    const quantity = parseInt(parts[0].trim()) || 1;
    const id = parts[1]?.trim();

    for (let i = 0; i < quantity; i++) {
      arr.push(id);
    }
  }

  return arr;
}*/
          
     /*     function transformStringToArray(inputString) {
  const packs = inputString.split(",");
  const arr = [];

  for (const pack of packs) {
    const parts = pack.split("x");
    const quantity = parts.length === 1 ? 1 : parseInt(parts[0].trim()) || 1;
    const id = parts[parts.length === 1 ? 0 : 1]?.trim();

    for (let i = 0; i < quantity; i++) {
      arr.push(id);
    }
  }

  return arr;
          }*/
          function transformStringToArray(inputString) {
  
    console.log(inputString)  
              const packs = inputString.split(",");
  const arr = [];

  for (const pack of packs) {
    const parts = pack.split("x");
    const quantity = parts.length === 1 ? 1 : parseInt(parts[0].trim()) || 1;
    const id = parts[parts.length === 1 ? 0 : 1]?.trim();

    for (let i = 0; i < quantity; i++) {
      arr.push(id);
    }
  }

  return arr;
          }
          
          
/*function transformStringToArray(inputString) {
  const regex = /(\d*)x\s*([^\s,]+)/g;
  const matches = inputString.matchAll(regex);
  const arr = [];

  for (const match of matches) {
    const quantity = parseInt(match[1]) || 1;
    const id = match[2];

    for (let i = 0; i < quantity; i++) {
      arr.push(id);
    }
  }

  return arr;
}*/
          
        /*  function transformStringToObject(inputString) {
  const regex = /(\d*)x?\s*([^,\s]+)/g;
  const matches = inputString.matchAll(regex);
  const obj = {};

  for (const match of matches) {
    const quantity = match[1] ? parseInt(match[1]) : 1;
    const packName = match[2];
    obj[packName] = quantity;
  }

  return obj;
          }*/
          function transformStringToObject(inputString) {
  const parts = inputString.split(',');
  const obj = {};

  for (const part of parts) {
    try {
      const [amountString, packName] = part.trim().split('x');
      const amount = parseInt(amountString.trim());
      obj[packName.trim()] = isNaN(amount) ? 1 : amount;
    } catch (error) {
      obj[part.trim()] = 1;
    }
  }

  return obj;
          }
          
          
          
          
          
          
          
          
          
          const discordId = user.id
          var coinsDep = 0
          var botTradesDep = 0
          var packsDep = {}
          var cardsDep = []
          if(coins){
              coinsDep = coins
          }
          if(botTrades){
              botTradesDep = botTrades
          }
          if(cards){
              cardsDep = transformStringToArray(cards)
          }
          if(packs){
              packsDep = transformStringToObject(packs)
              }
          
          
          
          
          
          
          
          const obj = {
              coins:coins,
              cardsGetting:cardsDep,
              packsGetting:packsDep,
              botTrades:botTrades
              }
          
          
          await this.functions.dbDeposit(obj,discordId,true)
          await interaction.reply("Admin payed <@"+discordId+">")
          
              
          
          
          
          }
          
          }else if(commandName === "pay"){
              const user = options.getUser("user")
              const coins = options.getInteger("coins")
              const cards = options.getString("cards")
              const packs = options.getString("packs")
              
              const linked = await this.functions.isLinked(interaction.user.id)
              const linkedOther = await this.functions.isLinked(user.id)
              
              if(!linked || !linkedOther){
                  await interaction.reply("You both need to be linked! You: "+ linked + " Other: "+linkedOther)
                  }else{
                      var coinsToGive = 0
                      var packsToGive = {}
                      var cardsToGive = []
                      const ownWallet = await this.functions.getWallet(interaction.user.id)
                      
                      if(coins){
                          if(coins < ownWallet.coins){
                              coinsToGive = coins
                              if(cards){
                                  const cardArr = cards.split(", ")
                                  var succ = true
                                  for(var arrCard of cardArr){
                                      if(ownWallet.cards[arrCard] != undefined){cardsToGive.push(arrCard)}else{succ = false}
                                      }
                                  if(!succ){
                                      await interaction.reply("You dont have all the cards you want to pay an other user. u need them though :)")
                                      }else{
                                          
                                          if(packs){
                                              const packArr = packs.split(", ")
                                              var hey = true
                                            for(var arrPack of packArr){
                                                  if(ownWallet.packs[arrPack] != undefined){
                                                      var res = packsToGive[arrPack]
                                                      if(res != undefined){
                                                          packsToGive[arrPack] = res+=1
                                                      }else{
                                                  packsToGive[arrPack] = 1
                                                          }
                                                      }else{
                                                          hey = false
                                                          }
                                                }
                                              if(!hey){
                                                  await interaction.reply("You dont have all packs u provided to pay...")
                                              }
                                              await this.functions.dbDeposit({
                                                  coins:coinsToGive,
                                                  cardsGetting:cardsToGive,
                                                  packsGetting:packsToGive,
                                                  botTrades:0
                                              }, user.id,true)
                                              }}
                                  }}
                          
              
                                                  
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                  
                                  
                                  
                                  
                          }else{
                              await interaction.reply("You dont have "+coins+" coins! You just got "+ownWallet.coins+"!")
                              }
                              
                      
                      
                      
                      
                      
                      
                      
                      }
              } else if (commandName === "withdraw") {
 /* const coins = options.getInteger("coins") || 0;
  const botTrades = options.getInteger("bot-trades") || 0;
  const cards = options.getString("cards");
  const packs = options.getString("packs");
  if(!coins && !packs && !cards && !botTrades){
      await interaction.reply("U need to withdraw smth!")
  }else if(coins < 0 || botTrades <0){
      await interaction.reply("Dont withdraw - stuff lol, cheater xD")
      
  
  }else{
  if (botTrades && (coins || cards || packs)) {
    
    await interaction.reply("If withdrawing bot trades, you can't withdraw other items.");
  } else {
    const result = {
      coins: coins,
      botTrades: botTrades,
      packs: {},
      cards: {}
    };

    if (!botTrades && packs) {
      const packItems = packs.split(",");
      packItems.forEach((item) => {
        const packCountMatch = item.match(/(\d+)x/);
        const packCount = packCountMatch ? parseInt(packCountMatch[1]) : 1;
        const packName = packCountMatch ? item.replace(packCountMatch[0], "").trim() : item.trim();
        result.packs[packName] = packCount;
      });
    }

    if (!botTrades && cards) {
      const cardItems = cards.split(",");
      cardItems.forEach((item) => {
        const cardCountMatch = item.match(/(\d+)x/);
        const cardCount = cardCountMatch ? parseInt(cardCountMatch[1]) : 1;
        const cardName = cardCountMatch ? item.replace(cardCountMatch[0], "").trim() : item.trim();
        result.cards[cardName] = cardCount;
      });
    }
      */
    const myWallet = await this.functions.getWallet(interaction.user.id)
    const type = options.getString("type")
    const amount = options.getInteger("amount")
    const crd = JSON.stringify(myWallet.cards)
    const pck = JSON.stringify(myWallet.packs)
    if(myWallet.coins != 0 || crd != '{}' || pck != '{}'){
        await interaction.reply("Alr! "+type + " " + amount)
    }else{
        await interaction.reply("U dont have anything in ur wallet!")
    }
   /* const ableToWithdraw = await this.functions.checkWithdraw(result,myWallet)
    console.log(result)
      console.log(myWallet)
    if(!ableToWithdraw){
        await interaction.reply("You dont got all items u want to withdraw")
    }else{
        await interaction.reply("You can withdraw! (trading part done tmr prob)")
}
  }
  }*/
}

              
              
          /*    } else if (commandName === "withdraw") {
  const coins = options.getInteger("coins") || 0;
  const botTrades = options.getInteger("bot-trades") || 0;
  const cards = options.getString("cards");
  const packs = options.getString("packs");

  if (botTrades && (coins || cards || packs)) {
    interaction.reply("If withdrawing bot trades, you can't withdraw other items.");
  } else {
    const result = {
      coins: coins,
      botTrades: botTrades,
      packs: {},
      cards: {}
    };

    if (!botTrades && packs) {
      const packItems = packs.split(",");
      packItems.forEach((item) => {
        const packCount = parseInt(item.split("x")[0]);
        const packName = item.split("x")[1]?.trim() || item.trim();
        result.packs[packName] = packCount || 1;
      });
    }

    if (!botTrades && cards) {
      const cardItems = cards.split(",");
      cardItems.forEach((item) => {
        const cardCount = parseInt(item.split("x")[0]);
        const cardName = item.split("x")[1]?.trim() || item.trim();
        result.cards[cardName] = cardCount || 1;
      });
    }

    interaction.reply(JSON.stringify(result));
  }
}*/

              
              
              
       /*       } else if (commandName === "withdraw") {
  const coins = options.getInteger("coins") || 0;
  const botTrades = options.getInteger("bot-trades") || 0;
  const cards = options.getString("cards");
  const packs = options.getString("packs");

  if (botTrades && (coins || cards || packs)) {
    interaction.reply("If withdrawing bot trades, you can't withdraw other items.");
  } else {
    const packsObj = {};
    const cardsObj = {};

    if (packs && !botTrades) {
      const packItems = packs.split(",");
      packItems.forEach((item) => {
        const packCount = parseInt(item.split("x")[0]);
        const packName = item.split("x")[1]?.trim() || item.trim();
        packsObj[packName] = packCount || 1;
      });
    }

    if (cards && !botTrades) {
      const cardItems = cards.split(",");
      cardItems.forEach((item) => {
        const cardCount = parseInt(item.split("x")[0]);
        const cardName = item.split("x")[1]?.trim() || item.trim();
        cardsObj[cardName] = cardCount || 1;
      });
    }

    const result = {
      coins: coins,
      botTrades: botTrades,
      packs: packsObj,
      cards: cardsObj
    };

    if (Object.keys(packsObj).length > 0 || Object.keys(cardsObj).length > 0) {
      interaction.reply(JSON.stringify(result));
    } else {
      interaction.reply("Wrong usage, see the bot introduction channel");
    }
  }
}*/

         /*     }else if(commandName === "withdraw"){
                  const coins = options.getInteger("coins") || 0
                  const botTrades = options.getInteger("bot-trades") || 0
                  const cards = options.getString("cards")
                  const packs = options.getString("packs")
                  
                  //coins = 10000
                  //botTrades = 10
                  //cards = "Pele 88, 4x Maradonna 78, Lewandoski 99"
                  //packs = "95+ OP Special Pack, 10x special, 3x gold"
                  
              }*/
        })
      }
    
  

  async registerCommands() {
    const guildId = '1122883725034782782'; // Replace with your Discord guild ID
 //   const guildId = "1059769086105628742"
    try {
      await this.client.guilds.cache.get(guildId)?.commands.set(this.commands);
      console.log('Successfully registered commands!');
    } catch (error) {
      console.error('Error registering commands:', error);
    }
  }
    
    
    
    
    
    

  startBot(token) {
    this.client.login(token);
  }
}

module.exports = {
  DiscordBot
};
            