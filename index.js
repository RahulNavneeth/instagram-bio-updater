const keepAlive = require("./server.js");
keepAlive();
require("dotenv");
const { IgApiClient } = require("instagram-private-api");
const USERNAME = process.env.INSTA_USERNAME;
const ig = new IgApiClient();
const cron = require("node-cron");
ig.state.generateDevice(USERNAME);

const formateTime = (date) => {
  var currentTime = date;
  var currentOffset = currentTime.getTimezoneOffset();

  var ISTOffset = 330;
  var ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  ).toLocaleString();

  return ISTTime;
};

(async () => {
  // await ig.simulate.preLoginFlow();
  await ig.account.login(USERNAME, USERNAME.split("m").join("") + "14");
  cron.schedule("0 * * * * *", async () => {
    while (formateTime(new Date()).split(" ")[1].split(":")[1] === "00") {
      process.nextTick(async () => await ig.simulate.postLoginFlow());
      const setBio = await ig.account.setBiography(
        `Hey, Its ${formateTime(new Date()).split(" ")[1].split(":")[0]}${
          formateTime(new Date()).split(" ")[2]
        } and you are here.`
      );
      console.log(setBio);
      console.log(formateTime(new Date()));
      break;
    }
  });
})();
