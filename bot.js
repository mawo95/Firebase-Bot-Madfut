const { initializeApp } = require('firebase/app');
const { CustomProvider, initializeAppCheck } = require('firebase/app-check');
const { getDatabase, ref, set, onValue, onChildAdded, child, off, onDisconnect, get ,update} = require('firebase/database');
const Auth = require('./auth');
const jwt_decode = require("jwt-decode");
const { getFirestore, getDoc, doc, setDoc, where, query, limit, collection } = require("firebase/firestore")
const fs = require('fs');


class Bot {
  constructor(appCheckToken, validTime) {
    var appConfig = {
      apiKey: "AIzaSyBxmfb16mlmD5vNoliSnCuCJqjxFapS_q4",
            authDomain: "mf23-room-ids.europe-west1.firebasedatabase.app",
            projectId: "madfut-23",
            storageBucket: "madfut-23.appspot.com",
            messagingSenderId: "359609929204",
            databaseURL: "https://mf23-trading-invites-2.europe-west1.firebasedatabase.app/",
            appId: "1:359609929204:ios:2fd5ba3bd87c65f0d2fda1"
    }
    this.app = initializeApp(appConfig,Math.random().toString(36).substr(2, 9) + Date.now());
    this.appCheckToken = appCheckToken;
    this.validTime = validTime;
    console.log("expireTimeMillis: "+ JSON.stringify(this.validTime*1000-Date.now()))
    initializeAppCheck(this.app, {
      provider: new CustomProvider({
        getToken: () => {
          return Promise.resolve({
            token: this.appCheckToken,
            expireTimeMillis: Math.max(0, this.validTime*1000 - Date.now())//reading from token
          });
        }
      }),
      debugMode: true,
      isTokenAutoRefreshEnabled: true
    });
    
    this.auth = new Auth(this.app)
    this.uid = null
    this.wl = null
    this.giveCount = 0
    this.positionIndex = 0
    this.mode = "cards" //or "packs"
    this.fs = getFirestore(this.app)
    this.invitesDatabase = getDatabase(this.app)
    this.authDatabase = getDatabase(this.app, "https://mf23-room-ids.europe-west1.firebasedatabase.app")
    this.roomsDatabase = getDatabase(this.app,"https://mf23-trading-invites-rooms-1.europe-west1.firebasedatabase.app")
  }
    
    sleep(ms) {

    return new Promise((resolve)=>setTimeout(resolve, ms)

    );

}
    
  async logout(){
      var suc = await this.auth.signOut()
      return suc
      }

  async login(email,password) {
    try {
      //accounts.js xD
     // const email = 'yaasir.romelle@minofangle.org';
   //   const password = 'qwertz23';
      

      
      
      const user = await this.auth.signIn(email, password);
      console.log('Authenticated successfully:', user.email + " ("+user.uid+")");
      this.uid = user.uid

    } catch (error) {
      console.error(error);
    }
  }


  async InviteUser(username, inviter, nation,interaction){
    const firestore = this.fs
    const documentRef = doc(firestore,"usernames",username)
    const dataToInvite = await getDoc(documentRef)
    if(dataToInvite.exists()){
      const uidToInvite = dataToInvite.data().uid
      const invPath = uidToInvite +"/" + this.uid
      const invRef = ref(this.invitesDatabase, invPath)
      const setData = {
        "b":nation,
        "u":inviter,
        "t": new Date().getTime()
      }
      onDisconnect(invRef).remove()
      await set(invRef, setData)
      var roomIdData 
      const roomsRef = ref(this.authDatabase, this.uid)
      await set(roomsRef,null)

      return new Promise((resolve, reject) => {
      const callback = onValue(roomsRef, async (snap) => {
        if (snap.val() == null) {
          // Do nothing
        } else {
          await set(invRef, null);
          await set(roomsRef, null);
          off(roomsRef, callback);
          roomIdData = snap.val();
          const hosting = roomIdData.split(",")[1] === "true";
          const roomId = roomIdData.split(",")[0];
          resolve({
            username,
            uidToInvite,
            inviter,
            nation,
            interaction,
            hosting,
            roomId
          });
        }
      })
      })
       
    }else{
        return new Promise((resolve, reject) => {
            (async()=>{
            console.log("L username")
      await interaction.followUp("<@"+interaction.user.id+"> Enter a valid username")
            resolve("invalid")
            })()
            })
    }
  }
    
    
    async joinTrade(result) {
        var myProfile;
        var myAction;
        var otherProfile;
        var otherAction;
  if (result.hosting) {
    myProfile = "h";
    myAction = "H";
    otherProfile = "g";
    otherAction = "G";
  } else {
    myProfile = "g";

    myAction = "G";

    otherProfile = "h";

    otherAction = "H"
    
  }
  
 



  await update(ref(this.roomsDatabase, result.roomId), {
      [myProfile]:{
    a: this.uid,
    b: result.inviter,
    c: result.nation,
    d: {},
    e: { "0": 11 },
    f: 42069,
    g: "",
    h: "",
    i: "",
    j: "",
    k: "",
    u1: this.uid,
    u2: result.uidToInvite
          }
  });

 
  
  await update(ref(this.roomsDatabase, result.roomId), {
      [myAction]:{
    x: "b"
          }
  });

 

        
        

  return new Promise((resolve, reject) => {
      const callback = onValue(ref(this.roomsDatabase, result.roomId+"/"+otherAction),async (snap)=>{
       //   console.log(snap.val())
          if(snap.val() != null){
              var gettinglol = await get(ref(this.roomsDatabase,result.roomId+"/"+otherProfile+"/d"))
              this.wl = gettinglol.val()
              off(ref(this.roomsDatabase,result.roomId+"/"+otherAction), callback)
        resolve({
      myAction: myAction,
      myProfile: myProfile,
      otherAction: otherAction,
      otherProfile: otherProfile,
            roomId:result.roomId
        });
              }
          })
  });
    }
    
  
        
        //giving the items and sleepjng anf so on
    
    async trade(place, data){

    //    console.log(place)
       
            
        
        const action = {
            ready:"h",
            unready:"i",
            confirm:"k",
            cancel:"j",
            handshake:"l",
            emoji:"n",
            messageCoins:"r",
            message:"m",
            coins:"q",
            packs:"o",
            cards:"e",
            random:"t",
            inTrade:"b",
            remove:"f",
            choosing:"c"
            
            

        }
        
        /*const tasks = []
        const switching = data.switch
        if(data.give != false){

            if(data.give.cards == "wishlist"){
                tasks.unshift({"wl":true})
                
            }else{
            for(var card in data.give.cards){
             
                tasks.unshift({"card":data.give.cards[card]})
            

        
        const myAction = place.myAction
        const tradeReference = ref(this.roomsDatabase, place.roomId)
        /*data = give:{

              cards:[],

              packs:[],

              coins:0

          },

          receive:false*/
                           
        
        
        
        
        const myAction = place.myAction
        const tradeReference = ref(this.roomsDatabase,place.roomId)
        return new Promise((resolve, reject)=>{
            


            var otherItemsGave = 0

            var otherCoinsGave = 0
                
            const callback = onValue(ref(this.roomsDatabase,place.roomId+"/"+place.otherAction),async (snapshot)=>{
                
                
                
                

               
                if(snapshot.val() == null){
                    off(tradeReference, callback)
                    resolve("left")
                }else if(snapshot.val().
                         x == action.inTrade){
                    
                    
                    if(data.give){
                        await this.sleep(1000)
                        
                        
                        if(data.give.coins > 0 && data.give.coins <= 10000000){
                            update(tradeReference, {
                                [myAction]:{
                                    x:action.coins,
                                    v:data.give.coins
                                    }
                                })
                            }else{console.log("Invalid coins value")}
                        //coins gave
                        
                       
                         
                            if(data.give.cards == "wishlist"){
                            for(var card of this.wl){
                                if(this.giveCount < 3){
                                    update(tradeReference,{
                                        [myAction]:{
                                            x:action.cards,
                                            v:card+","+this.positionIndex.toString()
                                            }
                                        })
                                    this.positionIndex++
                                    this.giveCount++
                                    }else{}
                                }
                                }else{
                                    for(var card of data.give.cards){
                                        if(this.giveCount < 3){
                                            update(tradeReference, {
                                                [myAction]:{
                                                    x:action.cards,
                                                    v:card+","+this.positionIndex.toString()
                                                    }
                                                })
                                            this.positionIndex++
                                            this.giveCount++
                                            }else{}
                                        }
                                    }
                        
                        for(var pack of data.give.packs){
                            if(this.giveCount < 3){
                                update(tradeReference,{
                                    [myAction]:{
                                    x:action.packs,
                                    a:pack,
                                    b:1,
                                    c:this.positionIndex.toString()
                                    }
                                    })
                                this.positionIndex++
                                this.giveCount++
                                       
                                
                        }else{}
                            }
                                
                                
                            
                    
               
                    
                    //giver here
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    //sleep 1 sec
                    //giving
           /*         var itemCounter = 0
                    var positionCounter = 0
                    for(var ac in tasks){
                       
                                   
                        //console.log(tasks[ac])
                    if(tasks[ac].hasOwnProperty("coins")){
                        update(tradeReference,{
                            [myAction]:{
                                x:action.coins,
                                v:tasks[ac].coins
                                }
                            })
                        }else if(tasks[ac].hasOwnProperty("pack")){
                            if(itemCounter >= 3){}else{
                                itemCounter++
                                update(tradeReference,{
                                    [myAction]:{
                                        a:tasks[ac].pack,
                                        b: 1,
                                        c: positionCounter.toString(),
                                        x: action.packs
                                        }
                                    })
                                positionCounter++
                                        
                        }
          
                            }else if(tasks[ac].hasOwnProperty("card")){
                                if(itemCounter >= 3){}else{
                                    itemCounter++
                                    
                                    update(tradeReference, {
                                        [myAction]:{
                                            x:action.cards,
                                            v:tasks[ac].card + "," + positionCounter.toString()
                                           
                                            }
                                        })
                                    positionCounter++
                                    }
                                }else if(tasks[ac].hasOwnProperty("wl")){
                                    
                                         const wlRef = ref(this.roomsDatabase, place.roomId+"/"+place.otherProfile+"/d")
                                        
                                        onValue(wlRef, async(snapwl)=>{
                                            var wlData = snapwl.val()
                                            
                                            
                                            off(wlRef)
                                            
                                            console.log(wlData)
                                            
                                    
                                    for(var wlCard in wlData){
                                        console.log(wlData[wlCard])
                                        console.log(itemCounter)
                                        if(itemCounter >= 3){}else{
                                            console.log("addingm..")
                                            itemCounter++
                                            await update(tradeReference,{
                                                [myAction]:{
                                                    x:action.cards,
                                                    v:wlData[wlCard]+","+positionCounter.toString()
                                                    }
                                                })
                                            positionCounter++
                                            }
                                        }
                                            })
                                        
                                    
                                            
                                        
                                         
                                }else{
                                    console.log("Invalid trade giving option lol")
                                    }
                        }*/
                    
                                
                    
                        
                          
                            
                     
                    
                   }else{}
                    }else if(snapshot.val().x == action.message){
                        //if(snapshot.val().v.toString().contains("4")){
                            if(this.mode == "packs" || data.give == false || data.switch == false){}else{
                                this.mode = "packs"
                                var removeCount = 0
                                while(removeCount <= 2){
                                    update(tradeReference, {
                                        [myAction]:{
                                            x:action.remove,
                                            v:removeCount
                                            }
                                        })
                                    removeCount++
                                    this.giveCount--
                                    this.positionIndex--
                                    
                                    }
                                for(var pack of data.give.packs){
                                    if(this.giveCount < 3){
                                        update(tradeReference,{
                                            [myAction]:{
                                                x:action.packs,
                                                a:pack,
                                                b:1,
                                                c:this.positionIndex
                                                }
                                            })
                                        this.giveCount++
                                        this.positionIndex++
                                        }else{}
                                    }
                                            
                            //changing to packs
                                
                                }
                       //     }else{}
                            
                    }else if(snapshot.val().x == action.emoji){
                        if(this.mode == "cards" || data.give == false || data.switch == false){}else{
                            this.mode = "cards"
                            removeCount = 0

                                while(removeCount <= 2){

                                    update(tradeReference, {

                                        [myAction]:{

                                            x:action.remove,

                                            v:removeCount

                                            }

                                        })

                                    removeCount++

                                    this.giveCount--

                                    this.positionIndex--

                                    

                                    }
                            if(data.give.cards == "wishlist"){
                            for(var card of this.wl){
                                if(this.giveCount < 3){
                                    update(tradeReference,{
                                        [myAction]:{
                                            x:action.cards,
                                            v:card+","+this.positionIndex.toString()
                                            }
                                        })
                                    this.giveCount++
                                    this.positionIndex++
                                    }else{}
                                }
                                }else{
                                    
                                    for(var card of data.give.cards){

                                if(this.giveCount < 3){

                                    update(tradeReference,{

                                        [myAction]:{

                                            x:action.cards,

                                            v:card+","+this.positionIndex.toString()

                                            }

                                        })

                                    this.giveCount++

                                    this.positionIndex++

                                    }else{}
                                        
                                    }
                                    }
                                    //adding normal cards 
                            
                        //changing to cards
                            }
                    }else if(snapshot.val().x == action.ready){
                      
                        if(!data.receive){
                            
                           
                           
                        if(otherItemsGave > 0 || otherCoinsGave > 0){
                            
                            await update(tradeReference, {
                                [myAction]:{
                                    x:action.emoji,
                                    v:"6Q"
                                    }
                                })
                            await update(tradeReference,{
                                [myAction]:{
                                    x:action.inTrade
                                    }
                                })
                                    
                            //emoji
                            }else{
                            
          
                           

                    
                  update(tradeReference, {
                        [myAction]:{
                        x:action.ready
                            }
                        })
                                        }
                            }else{
                              
                                update(tradeReference, {
                                    [myAction]:{
                                        x:action.ready
                                        }
                                    })
                                }
      
                    }else if(snapshot.val().x == action.confirm){
                        update(tradeReference, {
                            [myAction]:{
                            x:action.confirm
                                }
                            })
                        }else if(snapshot.val().x == action.handshake){
                            var a = 0
                            var b = 0
                            var c = 0
                            var d = 0
                            var e = 0
                            
                            if(snapshot.val().hasOwnProperty('a')){
                            a = snapshot.val().a
                                }
                            if(snapshot.val().hasOwnProperty('b')){
                           
                            
                            b = snapshot.val().b
                                }
                            if(snapshot.val().hasOwnProperty('c')){
                                
                           
                            c = snapshot.val().c
                                }
                            if(snapshot.val().hasOwnProperty('d')){
                            
                            
                            d = snapshot.val().d
                                }
                               
                            
                            e =
                                  snapshot.val().e
                                
                            update(tradeReference, {
                                [myAction]:{
                                x:action.handshake,
                                a:b,
                                b:a,
                                c:d,
                                d:c,
                                e:-e
                                    }
                                })
                            // a: cards giving

                        // b: cards getting

                        // c: packs giving

                        // d: packs getting

                        // e: coins i get
                            off(tradeReference, callback)
                            resolve("sucess")
                            }else if(snapshot.val().x == action.cards){
                                otherItemsGave++
                                }else if(snapshot.val().x == action.packs){
                                   otherItemsGave++
                                    }else if(snapshot.val().x == action.coins){
                                        otherCoinsGave = snapshot.val().v
                                        }else if(snapshot.val().x == action.remove){
                                            otherItemsGave--
                                            }else if(snapshot.val().x == action.cancel){
                                                update(tradeReference,{
                                                    [myAction]:{
                                                        x:action.cancel
                                                        }
                                                    })
                                                }else{}
                                       
                                
                                
                        
            })
            })
    }
    
    
    
    
    
    
    
    

  

  

}

module.exports = Bot;
