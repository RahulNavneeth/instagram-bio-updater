const keepAlive = require("./server.js");
keepAlive();
require("dotenv");
const { IgApiClient } = require("instagram-private-api");
const USERNAME = process.env.INSTA_USERNAME;
const PASSWORD = process.env.PASSWORD;
const ig = new IgApiClient();
const cron = require("node-cron");
ig.state.generateDevice(USERNAME);

(async () => {
  // await ig.simulate.preLoginFlow();
  await ig.account.login(USERNAME, PASSWORD);
  
  // Scheduled every hour -> (for custom scheduling head to - [ https://crontab.guru/ ] )
  cron.schedule("0 * * * * *", async () => {
    // (or) could have schduled every minute and use if condition to stop at certain time (new Date()... N Stuff)
    
    while (formateTime(new Date()).split(" ")[1].split(":")[1] === "00") {
      process.nextTick(async () => await ig.simulate.postLoginFlow());
      const setBio = await ig.account.setBiography(
        `----YOUR MESSAGE----`
      );
      console.log(setBio);
      console.log(formateTime(new Date()));
      break;
    }
  });
})();
