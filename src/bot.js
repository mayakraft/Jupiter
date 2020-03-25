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
const endDate = moment(startDate).add(5, "hours");

const sendTweet = function (tweetInfo) {
  console.log(tweetInfo.tweet);
  // uploadMedia(T, tweetInfo.media)
  //   .catch(err => { console.log(err); })
  //   .then(data => {
  //     const tweet = {
  //       status: tweetInfo.tweet,
  //       media_ids: [data.media_id_string]
  //     }
  //     T.post("statuses/update", tweet)
  //       .catch(err => { console.log(err); })
  //       .then((data, response) => {
  //         console.log("...tweet posted.");
  //         setTimeout(() => rmdir(tweetInfo.tmp), 1000);
  //       });
  //   });
};

console.log("Starting Twitter Bot..");
console.log(startDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

Closeup(startDate, endDate, 120)
  .then(sendTweet)
  .catch(error => {})


// tweetForecastAnim();
// setInterval(tweetForecastAnim, 1000 * 60 * 60 * HOURINTERVAL);

// function tweetForecastAnim(){
//  var startDate = moment().utc().format('D MMMM YYYY');
//  var startTime = moment().utc().format('H:mm');
//  var endTime = moment().utc().add(HOURINTERVAL,'hours').format('H:mm');

//  var tweetTextContent;
//  if(moment().utc().date() == moment().utc().add(HOURINTERVAL,'hours').date()){
//    tweetTextContent = startDate + "\nfrom " + startTime + " to " + endTime;
//  } else{
//    tweetTextContent = startDate + "\nfrom " + startTime + " to tomorrow at " + endTime;
//  }
//  console.log( tweetTextContent );

//  // UNCOMPILED PROCESSING SKETCH
//  // var cmd = 'processing-java --sketch=`pwd`/imagemaker --run';
//  // exec(cmd, processing);

//  // COMPILED PROCESSING SKETCH
//  // linux executable:
//  var cmd = '`pwd`/' + appDirectory + animationAppName;
//  // mac executable:
//  // var cmd = 'open ' + appDirectory + animationAppName + '.app';
//  exec(cmd, processingFinished);

//  function processingFinished(error, stdout, stderr){
//    if(error){ console.log(error); return; }

//    // convert -delay 3 -loop 0 *.png animated.gif
//    var cmd = 'convert -delay 3 -loop 0 ' + appDirectory + 'images/*.png ' + appDirectory + 'images/animated.gif';
//    exec(cmd, sendTweet);

//    function sendTweet(){
//      var imageFile = appDirectory + 'images/animated.gif';
//      var params = { encoding: 'base64' };
//      var b64 = fs.readFileSync(imageFile, params);
//      T.post('media/upload', { media_data: b64}, imageDidUpload);

//      function imageDidUpload(err, data, response){
//        // media has been uploaded, now we can tweet with the ID of the image
//        var id = data.media_id_string;
//        var tweet = {
//          status: tweetTextContent,
//          media_ids: [id]
//        }
//        T.post('statuses/update', tweet, tweeted);
//        function tweeted(err, data, response) {
//          if(err){ console.log('ERROR: ' + err); }
//          else{
//            console.log('tweet posted');
//            fs.exists(imageFile, function(exists) {
//              if(exists) fs.unlink(imageFile);
//            });
//          }
//        };
//      }
//    }
//  }
// }

/////////////////////////////////////////////////////////
////////////////      STREAM      ///////////////////////
/////////////////////////////////////////////////////////
/*
var stream = T.stream('user');

// stream.on('follow', function (eventMsg){
//  var name = eventMsg.source.name;
//  var screenName = eventMsg.source.screen_name;
// });
// stream.on('limit', function (limitMessage) { console.log('limit !!'); });
// stream.on('favorite', function (eventMsg) { console.log('got a fav'); });
// stream.on('quoted_tweet', function (eventMsg) {});
// stream.on('retweeted_retweet', function (eventMsg) {});

stream.on('tweet', tweetAtMeEvent);

function tweetAtMeEvent(eventMsg){
  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text;
  var from = eventMsg.user.screen_name;
  var tweetReplyIDString = eventMsg.id_str;
  var userReplyIDString = eventMsg.user.id_str;

  if(replyto === TWITTER_HANDLE){
    console.log(from + ' sent us a tweet: "' + text + '"');
    console.log(eventMsg);
    // remove the @ mention of this twitter bot
    var tweetContent = text.toLowerCase().replace('@'+TWITTER_HANDLE.toLowerCase(),'');
    tweetContent = tweetContent.replace(' ', '');
    tweetReplyTo(tweetContent, eventMsg);
  }
}

*/

// function parseUserSubmission(textString){
//  var mDate;
//  if(moment.unix(textString).isValid()){
//    mDate = moment.unix(textString);//.utc();
//  } else{
//    mDate = moment().utc();
//  }
//  var year = mDate.year();
//  var month = mDate.month() + 1;  // January start at 1
//  var day = mDate.date();
//  var hour = mDate.hour();
//  var minute = mDate.minute();
//  var second = mDate.second();

//  var fileString = year+'\n'+month+'\n'+day+'\n'+hour+'\n'+minute+'\n'+second;
//  var b64 = fs.writeFileSync(dateFile, fileString);
//  return mDate.format('H:mm') + ' UTC on ' + mDate.format('D MMMM YYYY');
// }


// function tweetReplyTo(tweetTextContent, eventMsg){
//  console.log("tweetReplyTo");
//  var tweet = {};
//  var imageFile = folderPhotoApp + 'images/output.png';

//  var dateString = parseUserSubmission(tweetTextContent);

//  // linux executable:
//  var cmd = '`pwd`/' + folderPhotoApp + photoAppName;
//  // mac executable:
//  // var cmd = 'open ' + folderPhotoApp + photoAppName + '.app';
//  exec(cmd, processingFinished);

//  function processingFinished(error, stdout, stderr){
//    if(error){ console.log(error); return; }

//    var params = { encoding: 'base64' };
//    var b64 = fs.readFileSync(imageFile, params);

//    T.post('media/upload', { media_data: b64}, imageDidUpload);

//    function imageDidUpload(err, data, response){
//      // media has been uploaded, now we can tweet with the ID of the image
//      var id = data.media_id_string;
//      var replyTweetString = '@' + eventMsg.user.screen_name + ' ' + dateString;
//      var tweet = {
//        status: replyTweetString,
//        in_reply_to_status_id: eventMsg.id_str,
//        media_ids: [id]
//      }
//      T.post('statuses/update', tweet, tweeted);
//      function tweeted(err, data, response) {
//        if(err){ console.log('ERROR: ' + err); }
//        else{
//          console.log('reply posted');
//          fs.exists(imageFile, function(exists) {
//            if(exists) fs.unlink(imageFile);
//          });
//          fs.exists(dateFile, function(exists) {
//            if(exists) fs.unlink(dateFile);
//          });
//        }
//      };
//    }
//  }
// }

// function tweetSimpleReplyTo(tweetTextContent, eventMsg){
//  var tweet = {};
//  if(eventMsg != undefined){
//    console.log('this is a tweet response to someone ');
//    tweet = {
//      status: tweetTextContent,
//      in_reply_to_status_id: eventMsg.id_str
//    }
//    T.post('statuses/update', tweet, tweeted);
//    console.log("tweeting this:");
//    console.log(tweet);
//    function tweeted(err, data, response) {
//      if(err){ console.log('ERROR: ' + err); }
//      else{ console.log('tweet posted'); }
//    };
//  }
// }
