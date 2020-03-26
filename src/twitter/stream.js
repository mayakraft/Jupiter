/////////////////////////////////////////////////////////
////////////////      STREAM      ///////////////////////
/////////////////////////////////////////////////////////
// var stream = T.stream('user');

// stream.on('follow', function (eventMsg){
//  var name = eventMsg.source.name;
//  var screenName = eventMsg.source.screen_name;
// });
// stream.on('limit', function (limitMessage) { console.log('limit !!'); });
// stream.on('favorite', function (eventMsg) { console.log('got a fav'); });
// stream.on('quoted_tweet', function (eventMsg) {});
// stream.on('retweeted_retweet', function (eventMsg) {});


// stream.on('tweet', tweetAtMeEvent);
// function tweetAtMeEvent(eventMsg){
//   var replyto = eventMsg.in_reply_to_screen_name;
//   var text = eventMsg.text;
//   var from = eventMsg.user.screen_name;
//   var tweetReplyIDString = eventMsg.id_str;
//   var userReplyIDString = eventMsg.user.id_str;
//   if(replyto === TWITTER_HANDLE){
//     console.log(from + ' sent us a tweet: "' + text + '"');
//     console.log(eventMsg);
//     // remove the @ mention of this twitter bot
//     var tweetContent = text.toLowerCase().replace('@'+TWITTER_HANDLE.toLowerCase(),'');
//     tweetContent = tweetContent.replace(' ', '');
//     tweetReplyTo(tweetContent, eventMsg);
//   }
// }



// function parseUserSubmission(textString){
//   var mDate;
//   if(moment.unix(textString).isValid()){
//     mDate = moment.unix(textString);//.utc();
//   } else{
//     mDate = moment().utc();
//   }
//   var year = mDate.year();
//   var month = mDate.month() + 1;  // January start at 1
//   var day = mDate.date();
//   var hour = mDate.hour();
//   var minute = mDate.minute();
//   var second = mDate.second();

//   return mDate;

//   // var fileString = year+'\n'+month+'\n'+day+'\n'+hour+'\n'+minute+'\n'+second;
//   // var b64 = fs.writeFileSync(dateFile, fileString);
//   // return mDate.format('H:mm') + ' UTC on ' + mDate.format('D MMMM YYYY');
// }


// const tweetReplyTo = function (tweetTextContent, eventMsg) {
//   console.log("tweetReplyTo");
//   var tweet = {};
//   var date = parseUserSubmission(tweetTextContent);
//   if (date != valid) { return; }
//   var dateString = ;
//   var id = data.media_id_string;
//   var replyTweetString = '@' + eventMsg.user.screen_name + ' ' + dateString;
//   var tweet = {
//     status: replyTweetString,
//     in_reply_to_status_id: eventMsg.id_str,
//     media_ids: [id]
//   }
//   T.post('statuses/update', tweet, tweeted);
//   function tweeted(err, data, response) {
//     if(err){ console.log('ERROR: ' + err); }
//     else{
//       console.log('reply posted');
//       fs.exists(imageFile, function(exists) {
//         if(exists) fs.unlink(imageFile);
//       });
//       fs.exists(dateFile, function(exists) {
//         if(exists) fs.unlink(dateFile);
//       });
//     }
//   };
// };

// function tweetSimpleReplyTo(tweetTextContent, eventMsg){
//   var tweet = {};
//   if(eventMsg != undefined){
//     console.log('this is a tweet response to someone ');
//     tweet = {
//       status: tweetTextContent,
//       in_reply_to_status_id: eventMsg.id_str
//     }
//     T.post('statuses/update', tweet, tweeted);
//     console.log("tweeting this:");
//     console.log(tweet);
//     function tweeted(err, data, response) {
//       if(err){ console.log('ERROR: ' + err); }
//       else{ console.log('tweet posted'); }
//     };
//   }
// }
