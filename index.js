const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();
require("dotenv");

const cron = require("node-cron");

const USERNAME = process.env.INSTA_USERNAME;
const PASSWORD = process.env.INSTA_PASSWORD;
console.log(process.env);

ig.state.generateDevice(USERNAME);

(async () => {
  await ig.simulate.preLoginFlow();
  await ig.account.login(USERNAME, PASSWORD);

  cron.schedule("* * * * *", async () => {
    process.nextTick(async () => await ig.simulate.postLoginFlow());
    console.log(
      new Date().getHours(),
      new Date().toLocaleString().split(" ")[2]
    );
    const setBio = await ig.account.setBiography(
      `Hey, Its ${new Date().toLocaleString().split(" ")[1].split(":")[0]}:${
        new Date().toLocaleString().split(" ")[1].split(":")[1]
      }${new Date().toLocaleString().split(" ")[2]} and you are here.`
    );
    console.log(setBio);
  });
})();

// main();
