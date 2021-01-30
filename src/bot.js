// this bot's twitter handle:
const TWITTER_HANDLE = "jupiternow";

const Twit = require("twit");
const exec = require("child_process").exec;
const fs = require("fs");
const moment = require("moment");
const config = require("../config");  //get keys from the other file
const mkdir = require("./file/mkdir");
const rmdir = require("./file/rmdir");
const uploadMedia = require("./twitter/uploadMedia");

// scenes
const Forecast = require("./scenes/telescopeForecast");
const Closeup = require("./scenes/closeup");

// start twit with keys
const T = new Twit(config);

/////////////////////////////////////////////////////////
////////////////     TERMINAL     ///////////////////////
/////////////////////////////////////////////////////////


// right now this bot is displaying in mirror-reversed view.


// make sure temp directory exists
mkdir("./tmp/");

// const startDate = moment().utc();
// const endDate = moment(startDate).add(HOURINTERVAL, "hours");
// Forecast(startDate, endDate, 60, sendTweet);

const startDate = moment().utc();
// 30 Nov 2019 13:46
// startDate.set('year', 2020);
// startDate.set('month', 2); // december
// startDate.set('date', 21);
// startDate.set('hour', 0);
// startDate.set('minute', 0);
// startDate.set('second', 0);
// startDate.set('millisecond', 0);
const endDate = moment(startDate).add(5.5, "hours");

const sendTweet = function (tweetInfo) {
  console.log(tweetInfo.tweet);
  uploadMedia(T, tweetInfo.media)
    .catch(err => { console.log(err); })
    .then(data => {
      const tweet = {
        status: tweetInfo.tweet,
        media_ids: [data.media_id_string]
      }
      T.post("statuses/update", tweet)
        .catch(err => { console.log(err); })
        .then((data, response) => {
          console.log("...tweet posted.");
          setTimeout(() => rmdir(tweetInfo.tmp), 1000);
        });
    });
};

// Schedule.fill()

console.log("Starting Twitter Bot..");
console.log(startDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

Forecast(startDate, endDate, 120)
  // .then(sendTweet)
  .then(a => console.log(a))
  .catch(error => {})

// tomorrow detection
 // if(moment().utc().date() == moment().utc().add(HOURINTERVAL,'hours').date()){}
