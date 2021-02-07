// this bot's twitter handle:
const TWITTER_HANDLE = "jupiternow";
const Twit = require("twit");
const exec = require("child_process").exec;
const fs = require("fs");
const moment = require("moment");
const config = require("../config");  //get keys from the other file
const uploadMedia = require("./twitter/uploadMedia");
// scenes
const ElapsedTelescope = require("./scenes/elapsedTelescope");
const Closeup = require("./scenes/closeup");
const DiagramTop = require("./scenes/diagramTop");
// start twit with keys
const T = new Twit(config);
// is this still true? ...
// right now this bot is displaying in mirror-reversed view.
const sendTweet = function (tweetInfo) {
  console.log(tweetInfo.text);
  uploadMedia(T, tweetInfo.media)
    .catch(err => { console.log(err); })
    .then(data => {
      const tweet = {
        status: tweetInfo.text,
        media_ids: [data.media_id_string]
      }
      T.post("statuses/update", tweet)
        .catch(err => { console.log(err); })
        .then((data, response) => {
          console.log("...tweet posted.");
          fs.unlinkSync(tweetInfo.media);
        });
    });
};

const date = moment().utc();

console.log("Starting Twitter Bot..");
console.log(date.format("dddd, MMMM Do YYYY, h:mm:ss a"));

DiagramTop(date, moment(date).add(12, "hours"), 240)
// ElapsedTelescope(date, moment(date).add(12, "hours"), 480)
// Closeup(date, moment(date).add(12, "hours"), 480)
  // .then(filename => console.log(filename))
  .then(sendTweet)
  .catch(error => console.error(error))

// tomorrow detection
 // if(moment().utc().date() == moment().utc().add(HOURINTERVAL,'hours').date()){}
