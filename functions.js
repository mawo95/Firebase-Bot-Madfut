const moment = require("moment")
const jwt_decode = require("jwt-decode");
const Bot = require("./bot")
const fs = require("fs")
const sqlite = require('better-sqlite3');





class Functions{
  constructor(){
   
     







   
    
    this.database = new sqlite("database.db")
      this.database.exec("CREATE TABLE IF NOT EXISTS Players (id TEXT PRIMARY KEY, name TEXT, rating INTEGER, position TEXT, color TEXT, clubId INTEGER, leagueId INTEGER, nationId INTEGER, packable INTEGER)");
      this.database.exec('CREATE TABLE IF NOT EXISTS Packs (displayName TEXT, packId TEXT)');
      this.database.exec("CREATE TABLE IF NOT EXISTS Data (discordId INTEGER PRIMARY KEY, mfUsername TEXT, coins INTEGER DEFAULT 0, packs TEXT DEFAULT '{}', cards TEXT DEFAULT '{}', botTrades INTEGER DEFAULT 0, trades INTEGER DEFAULT 0)")


      
    this.inTrade = {}
    this.accArr =  fs.readFileSync("acc.txt",{encoding:"utf-8"}).split("\n")
      console.log("Functions ready")
  }
    async getTradeAmount(discordId){
        const fStmt = this.database.prepare("SELECT trades FROM Data WHERE discordId = ?")
        const res = await fStmt.get(discordId)
        if(res != undefined){
        return res.trades
            }else{
                return 0
                }
        
    }
    async addTrade(discordId){
  //     try{
        const getStmt = this.database.prepare("SELECT trades FROM Data WHERE discordId = ?")
        const tradeAmount2 = await getStmt.get(discordId)
        console.log(discordId)
        console.log(tradeAmount2)
        var tradeAmount
        if(tradeAmount2 == undefined){
            tradeAmount = 0
        }else{
        tradeAmount = tradeAmount2.trades
        }
        const addStmt = this.database.prepare("UPDATE Data SET trades = ? WHERE discordId = ?")
        await addStmt.run(tradeAmount+=1,discordId)
        return true
       //    }catch{
          //     return false
         //      }
        
    }

    async clearWallet(discordId){
        const clearStmt = this.database.prepare("UPDATE Data SET coins = 0, cards = '{}', packs = '{}', botTrades = 0 WHERE discordId = ?")
        await clearStmt.run(discordId)
        
        
        }
    
    async dbDeposit(result,discordId,admin){
        //interaction.followUp(JSON.stringify(result))
        
        var cheater = false
        //discordId = interaction.user.id
       var currentWallet = await this.getWallet(discordId)
        console.log(currentWallet)
        if(result.coins > 10000000 || result.coins < 0){
            cheater = true
            currentWallet.coins = currentWallet.coins += result.coins
            }else{
                
        currentWallet.coins = currentWallet.coins+=result.coins
                }
        currentWallet.botTrades = currentWallet.botTrades += result.botTrades
        var cardPackCounter = 0
        if(result.cardsGetting != 0){
           
            var currentObj = JSON.parse(currentWallet.cards)
            for(var card of result.cardsGetting){
                cardPackCounter++
                if(cardPackCounter > 3){
                    cheater = true//do some very eval stuff
                }else{}
                if(currentObj[card] == undefined){
                    currentObj[card] = 1
                }else{
                   
                    currentObj[card] += 1
             
                 
                    }
                    
                  //  }
                }
            currentWallet.cards = JSON.stringify(currentObj)
            }else{}
        
        
        if (result.packsGetting !== 0) {
  const currentObj = JSON.parse(currentWallet.packs);
  const packsGetting = result.packsGetting;

  for (const pack in packsGetting) {
    if (Object.prototype.hasOwnProperty.call(packsGetting, pack)) {
      cardPackCounter++;

      if (cardPackCounter > 3) {
          cheater = true
        // Perform additional evaluation logic
      } else {}
        if (currentObj[pack] === undefined) {
          if(packsGetting[pack] > 20){cheater = true}else{
          currentObj[pack] = packsGetting[pack];
              }
        } else {
            if(packsGetting[pack] > 20){
                cheater = true}else{
          currentObj[pack] += packsGetting[pack];
                    }
        }
    //  }
    }
  }

  currentWallet.packs = JSON.stringify(currentObj);
        }else{}
        
        
        
  
        const stmt1 = this.database.prepare("UPDATE Data SET coins = ?, cards = ?, packs = ?, botTrades = ? WHERE discordId = ?");
        if(!cheater || admin){
    
        try{
            await stmt1.run(currentWallet.coins,currentWallet.cards,currentWallet.packs,currentWallet.botTrades,discordId)
            return true
            }catch{
                return false
                }
            }else{
                this.clearWallet(discordId)
                                 }
        
        
        
        }
    
    async getPlayerName(playerId){
        const playerStmt = this.database.prepare("SELECT * FROM Players WHERE id = ?")
        const result = await playerStmt.get(playerId)
        
        if(result == null || result == undefined){
            return {
                success:false,
                id:playerId
                }
        }else{
            const words = result.color.split('_');

  const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  const res = formattedWords.join(' ');


            return {
                success:true,
                cardType:res,
                cardDisplayName:result.name,
                cardRating:result.rating
        }
            }
        
        
    }
    
    
    async getPackName(packId){
        const packNameStmt = this.database.prepare("SELECT displayName FROM Packs WHERE packId = ?")
        const result = await packNameStmt.get(packId)
        if(result == null || result == undefined){
            return packId
        }else{
            return result.displayName
            }
        
        
        
    }
    async getWallet(userId){
        const walletStmt = this.database.prepare("SELECT * FROM Data WHERE discordId = ?")
        var result = await walletStmt.get(userId)
        var coins
        var packs
        var cards
        var botTrades
        if(result == undefined){
            coins = 0
            packs = {}
            cards = {}
            botTrades = 0
            }else{
            
        coins = result.coins
        packs = result.packs
        cards = result.cards
        botTrades = result.botTrades
        }
        const obj = {
            coins:coins,
            packs:packs,
            cards:cards,
            botTrades:botTrades
        }
            
        return obj
        
    }
    
    async dbGetCurrentLink(discordId){
     //   console.log(discordId)
        const selectUsernameStmt = this.database.prepare("SELECT mfUsername FROM Data WHERE discordId = ?")
        const result = selectUsernameStmt.get(discordId)
        return result
     }
    async isLinked(discordId){
        const linkedStmt = this.database.prepare("SELECT mfUsername FROM Data WHERE discordId = ?")
        const result = linkedStmt.get(discordId)
    //    console.log(result)
        if(result != undefined){
            if(result.mfUsername != null){
                return true
                }else{
                    return false
                    }
            }else{
                return false
                }
        
    }
    async dbLinkAcc(discordId,mfUsername){
   //     console.log(discordId)
   //     console.log(mfUsername)
        const insertUserStmt = this.database.prepare("INSERT INTO Data (discordId, mfUsername) VALUES (?, ?) ON CONFLICT(discordId) DO UPDATE SET mfUsername = excluded.mfUsername")
        try{
            insertUserStmt.run(discordId,mfUsername)
            return true
            }catch{
                return false
            }
        }

    
    
    async updateMapping(interaction){
        const jsonPlayers2 = await fs.readFileSync("players.json",{encoding:"utf-8"})
        const jsonPacks2 = await fs.readFileSync("packs.json",{encoding:"utf-8"})
        const players = JSON.parse(jsonPlayers2)
        const packs = JSON.parse(jsonPacks2)
        try{
        const dropPacksTableStmt = this.database.prepare('DROP TABLE IF EXISTS Packs');

// Run the statement to drop the `Packs` table

dropPacksTableStmt.run();
            const dropCardsTableStmt = this.database.prepare("DROP TABLE IF EXISTS Players")
            dropCardsTableStmt.run()
            }catch{console.log("Couldnt delete the old db before mapping")}
        const db = new sqlite("database.db")
        this.database = db
        this.database.exec("CREATE TABLE IF NOT EXISTS Players (id TEXT PRIMARY KEY, name TEXT, rating INTEGER, position TEXT, color TEXT, clubId INTEGER, leagueId INTEGER, nationId INTEGER, packable INTEGER)");
        this.database.exec('CREATE TABLE IF NOT EXISTS Packs (displayName TEXT, packId TEXT)');
        const insertStmt = this.database.prepare('INSERT INTO Packs (packId, displayName) VALUES (?, ?)');



for (const pack of packs) {

  insertStmt.run(pack.id, pack.displayName);

}
        players.Player.forEach((player) => { 
          
           
          

  this.savePlayer(this.database,player);

});
        interaction.followUp("Done! (Mapped packs and cards)")
        
        
        
        
        


    

    
    

    
    

        
        
        
    }
    
    async savePlayer(playerDb,player) {

  const stmt = playerDb.prepare("INSERT INTO Players (id, name, rating, position, color, clubId, leagueId, nationId, packable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")

  stmt.run(

    player.id, player.name, player.rating, player.position,

    player.color, player.clubId, player.leagueId, player.nationId,

    player.packable

    

  );

}
    
    async getPlayerById(id) {

  const stmt = this.database.prepare('SELECT * FROM Players WHERE id = ?');

  const result = stmt.get(id);

  return result;

}

// Function to search for players by name

async searchPlayersByName(name,rating,mode,interaction) {
    
  let query;
  let params;

  if (mode === undefined || mode) {
    if (rating) {
      query = 'SELECT * FROM Players WHERE name = ? AND rating = ?';
      params = [name, rating];
    } else {
      query = 'SELECT * FROM Players WHERE name = ?';
      params = [name];
    }
  } else {
    if (rating) {
      query = 'SELECT * FROM Players WHERE name LIKE ? AND rating = ?';
      params = [name + '%', rating];
    } else {
      query = 'SELECT * FROM Players WHERE name LIKE ?';
      params = [name + '%'];
    }
  }

  const stmt = this.database.prepare(query);
  const result = stmt.all(params);

  
    
    
    
    
    
       
  var resultArr = []
  for(var cardData of result){
      resultArr.push(cardData)
      }
  return resultArr
  
            
}

  async searchPack(name,mode,interaction){
      let query
      let params
      if(mode === null || mode){
          query = "SELECT * FROM Packs WHERE displayName = ? OR packId = ? LIMIT 16"
          params = [name,name]
      }else{
          query = "SELECT * FROM Packs WHERE displayName LIKE ? OR packId LIKE ? LIMIT 16"
          params = ["%"+name+"%","%"+name+"%"]
          }
      
      const stmt = this.database.prepare(query)
      const result = stmt.all(params)
      var resultArr = []

  for(var cardData of result){

      resultArr.push(cardData)

      }

  return resultArr
      
   }
    
  async unlinkMfUsername(interaction){
      const isLinked = await this.isLinked(interaction.user.id)
      if(!isLinked){
          return false
      }else{
      const unlinkStmt = this.database.prepare("UPDATE Data SET mfUsername = NULL WHERE discordId = ?")
      try{
      unlinkStmt.run(interaction.user.id)
          return true
          }catch{return false}
          }
      }
    
  async getCurrentLink(interaction){
      const result = await this.dbGetCurrentLink(interaction.user.id)
      return result
      }
      
  async appcheckDateReturn(appCheckToken){
  var expirationTime = jwt_decode(appCheckToken).exp;
  const formattedDuration = "Appcheck will expire at: "+"<t:"+expirationTime+">"
  return formattedDuration;   
  }

  async appcheckExpired(appCheckToken){
    if(await jwt_decode(appCheckToken).exp < Math.floor(Date.now() / 1000)){
      console.log("THE APPCHECK EXPIRED!!!")
      return false
    }else{
      console.log("Appcheck valid")
      return true
    }
  }

  async appcheckMillis(appCheckToken){
    return await jwt_decode(appCheckToken).exp
  }



  async freeTrades(username,amount,interaction,appCheckToken){
      
      await interaction.reply("Freetrades sent!")
      var tradesDone = 0
      while(tradesDone < amount){ 
      const timemillis = await jwt_decode(appCheckToken).exp
      var freeTradesBot = new Bot(appCheckToken, timemillis)
      const password = "mawo100"
      
      var emailFound = false
      var email
      while(!emailFound){
      email = this.accArr[Math.floor(Math.random() * this.accArr.length)]
      if(this.inTrade[email] == undefined){
          emailFound = true
          }else{}
          }
     
      
      await freeTradesBot.login(email,password)
          this.inTrade[email] = password
      
      await freeTradesBot.InviteUser(username,"freetrades","nation_badge_21",interaction)

    .then(async (result)=>{

      //linking

      if(result == "invalid"){amount = 0}else{

     

      const propertys = await freeTradesBot.joinTrade(result)
      
      const tradeResult = await freeTradesBot.trade(propertys,{

          give:{

         

          

              cards:"wishlist",

              packs: ["95_special","94_special","query,shapeshifters,,96,98,-1,-1,-1,false,100"],

              coins:10000000

          },

          receive:false,

          switch:true

      })
      
      if(tradeResult.status){
          const usernameToDiscordId = this.database.prepare("SELECT discordId FROM Data WHERE mfUsername = ?")
          const lel = usernameToDiscordId.get(username)
          if(lel != undefined){
          const dcId = lel.discordId
          await this.addTrade(dcId)
          tradesDone++
              }else{
                  tradesDone++
                  }
      }

      }
          var logout = await freeTradesBot.logout()

      if(logout){

          console.log("Signed out")

          }else{

              console.log("Couldnt sign out -> ram+")

              }

              

           

          
      this.inTrade[email] = undefined
      freeTradesBot = undefined
          })
          }
      
      
      
     
      
      }
    
    async deposit(interaction,multiple,appCheckToken){
        var leftTradeStopDeposit = false
        const isLinked = await this.isLinked(interaction.user.id)
        if(!isLinked){
            await interaction.reply("You arent linked! To deposit items, link your account with /link")
        }else{
            const linkedAcc = await this.dbGetCurrentLink(interaction.user.id)
            console.log(linkedAcc.mfUsername)
            await interaction.reply("Your account " + linkedAcc.mfUsername + " got invited for deposit!")
       while(!leftTradeStopDeposit){
            const timemillis = await jwt_decode(appCheckToken).exp

    

    var depositBot = new Bot(appCheckToken,timemillis)

      

    const password = "mawo100"

    var emailFound = false

    var email

    while(!emailFound){

    email = this.accArr[Math.floor(Math.random() * this.accArr.length)]

        if(this.inTrade[email] == undefined){

            emailFound = true

            }else{

                }

        }
            await depositBot.login(email,password)
            const result = await depositBot.InviteUser(linkedAcc.mfUsername,"deposit","nation_badge_21",interaction)
            const props = await depositBot.joinTrade(result)
            const tradeResult = await depositBot.trade(props,{give:false,receive:true,switch:false})
            console.log(tradeResult)
            if(!multiple){
                leftTradeStopDeposit = true
            }
            if(tradeResult.status == false){
                leftTradeStopDeposit = true
                await interaction.followUp("Stopped your deposit")
                }else if(tradeResult.status){
                    const usernameToDiscordId = this.database.prepare("SELECT discordId FROM Data WHERE mfUsername = ?")

          const lel = usernameToDiscordId.get(linkedAcc.mfUsername)
                                        

          if(lel != undefined){

          const dcId = lel.discordId

          await this.addTrade(dcId)
              }
                    
                    var dbResult = await this.dbDeposit(tradeResult, interaction.user.id,false)
                    if(dbResult){
                    interaction.followUp("Sucessfully deposited")
                        }else{
                            interaction.followUp("Failed to save your items. We are sorry!")
                            }
                    
                    
                    
                    
                    
                    
                    
                    }else{leftTradeStopDeposit = true}
            
            
            var logout = await depositBot.logout()

      if(logout){

          console.log("Signed out")

          }else{

              console.log("Couldnt sign out -> ram+")

              }
           }

              

           

      this.inTrade[email] = undefined

      depositBot = undefined //
            
            
            
            
        }
        
    }
  async linkAccount(username,interaction,appCheckToken){
    const isLinked = await this.isLinked(interaction.user.id)
    if(isLinked){
        await interaction.reply("You are already linked! Use /view-link to view your linked madfut account and /unlink to unlink your account")
    }else{
    const timemillis = await jwt_decode(appCheckToken).exp
    
    var linkBot = new Bot(appCheckToken,timemillis)
      
    const password = "mawo100"
    var emailFound = false
    var email
    while(!emailFound){
    email = this.accArr[Math.floor(Math.random() * this.accArr.length)]
        if(this.inTrade[email] == undefined){
            emailFound = true
            }else{
                }
        }
    //in case different passwords
    /*const acc = this.accArr[Math.floor(Math.random() * this.accArr.length)]
    const email = acc.email
    const password = acc.password
    */
    
    await linkBot.login(email,password)
      this.inTrade[email] = password
    await interaction.reply("A bot got prepeared for you. Check for an invite and accept it to link your accounts")
    
    await linkBot.InviteUser(username,"linking","nation_badge_21",interaction)
    .then(async (result)=>{
      //linking
      if(result == "invalid"){}else{
          
          const propertys = await linkBot.joinTrade(result)
          const dbResult = await this.dbLinkAcc(interaction.user.id,username)
          if(dbResult){
              const usernameToDiscordId = this.database.prepare("SELECT discordId FROM Data WHERE mfUsername = ?")

          const lel = usernameToDiscordId.get(username)

          if(lel != undefined){

          const dcId = lel.discordId

          await this.addTrade(dcId)
              }
      interaction.followUp("<@"+interaction.user.id+"> You succesfully linked your discord account to your madfut account -> ``"+interaction.member.displayName+" x "+username+"``")
              }else{
                  interaction.followUp("An error occoured in the linking progress while linking in the database.")}
      

      const tradeResult = await linkBot.trade(propertys,{
          give:{
         
          
              cards:[],//["id50575359","id218591","id212273"],
              packs: [],//["special","silver","gold"],
              coins:69
          },

          receive:false,
          switch:false
      })
      }
      var logout = await linkBot.logout()
      if(logout){
          console.log("Signed out")
          }else{
              console.log("Couldnt sign out -> ram+")
              }
              
           
      this.inTrade[email] = undefined
      linkBot = undefined //garbage collection by js engine
     // console.log(tradeResult)
        //do more stuff lol
          
              
      
    })
    .catch(error=>{
        console.log(error)
      interaction.followUp("An error occoured in the linking progress")
      //console.log(error)
    })
        }
    
  }
}

module.exports = Functions