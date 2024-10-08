const moment = require("moment")
const { DiscordBot } = require('./discord');

//

const appTo = "eyJraWQiOiJsWUJXVmciLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjM1OTYwOTkyOTIwNDphbmRyb2lkOjhiYjc3YTlhNWU1ZmRmYjdkMmZkYTEiLCJhdWQiOlsicHJvamVjdHNcLzM1OTYwOTkyOTIwNCIsInByb2plY3RzXC9tYWRmdXQtMjMiXSwicHJvdmlkZXIiOiJwbGF5X2ludGVncml0eSIsImlzcyI6Imh0dHBzOlwvXC9maXJlYmFzZWFwcGNoZWNrLmdvb2dsZWFwaXMuY29tXC8zNTk2MDk5MjkyMDQiLCJleHAiOjE2OTM5NDYzMTAsImlhdCI6MTY5MzM0MTUxMCwianRpIjoiM2FlN1JPZllILXRUZnBMRU44d1lnd2hfb05td21WaDdMRVJSWXVDVTlmSSJ9.1ehlOZsiVOp08EqvOnE9GafEKYPmtbTyXNepgfEc_EUCDk7VKgdeTMXidJYBwNKxWU7k4QeCdbQnbGhqb7GPf5-CSYjI9yiliNttqdmDvadREfpi6VsDS7yTRHxxwctx8EtSP-y2U4AwMu53cgDJdOcdAdSc-XXkRtctOeDUUDUWU3m5aCkjiGCM_7u3dXdng_s_GAk6wn4YP1EqPgiL_xqcDekql0eh0qzv6t3aB87zUk-_9r7Qhg7jdN0tf9FoOTjzsZ6GBuncyLS1c_QBEUI8CGGHy8G2XE8t1P8v5JAFKG12O3uFjIk2ftuszlZ20pzo7-hme35dTg6Me2MZSrY4B_4MH5o9dLgJn970saTnyHqfXQMbZ-CZeRgrmAnEqrEgceiJSCQyZ1vKR-TGYXBi2Oki0uZs7YzWikNra8FJjaEyulYHhMag6KRXsk2j64C1L0fEd8-gdSmKHb3gnSoa25Z4_ueN4SL2NerXhFwmIpAbd10yabZhDrPxmJmK"
 var crashTimer = setTimeout(async function() {
     process.exit()
 },60*1000*60);
//check the appcheck
/*async () => {
    try{
  //await functions.appcheckExpired(appToo)
}catch{console.log("invalid appcheck")}
    })();*/
//start the bot
const discordBot = new DiscordBot(appTo)
discordBot.setupCommands()
discordBot.startBot("BOTTOKEN")