// this bot's twitter handle:
var TWITTER_HANDLE = 'jupiternow';

var Twit = require('twit');
var exec = require('child_process').exec;
var fs = require('fs');
var moment = require('moment');
var config = require('./config');  //get keys from the other file

// start twit with keys
var T = new Twit(config);

// 2 applications: 1 makes an animation of the next 6 hours into a .gif
// var folderAnimationApp = 'application.macosx/';
var folderAnimationApp = 'application.linux64/';
var animationAppName = 'JovianMoons';
// 1 makes a photo given a timestamp found in .txt file 'dateFile'
// var folderPhotoApp = 'application.reader.macosx/';
var folderPhotoApp = 'application.reader.linux64/';
var photoAppName = 'JupiterMoons_reader';
var dateFile = folderPhotoApp + 'date.txt';

/////////////////////////////////////////////////////////
////////////////     TERMINAL     ///////////////////////
/////////////////////////////////////////////////////////

console.log("Starting Twitter Bot..");

tweetForecastAnim();
setInterval(tweetForecastAnim, 1000 * 60 * 60 * 6);  // 6 hours

function tweetForecastAnim(){
	var startDate = moment().utc().format('D MMMM YYYY');
	var startTime = moment().utc().format('H:mm');
	var endTime = moment().utc().add(6,'hours').format('H:mm');

	var tweetTextContent;
	if(moment().utc().date() == moment().utc().add(6,'hours').date()){
		tweetTextContent = startDate + "\nfrom " + startTime + " to " + endTime;
	} else{
		tweetTextContent = startDate + "\nfrom " + startTime + " to tomorrow at " + endTime;
	}
	console.log( tweetTextContent );

	// UNCOMPILED PROCESSING SKETCH
	// var cmd = 'processing-java --sketch=`pwd`/imagemaker --run';
	// exec(cmd, processing);

	// COMPILED PROCESSING SKETCH
	// linux executable:
	var cmd = '`pwd`/' + folderAnimationApp + animationAppName;
	// mac executable:
	// var cmd = 'open ' + folderAnimationApp + animationAppName + '.app';
	exec(cmd, processingFinished);

	function processingFinished(error, stdout, stderr){
		if(error){ console.log(error); return; }

		// convert -delay 3 -loop 0 *.png animated.gif
		var cmd = 'convert -delay 3 -loop 0 ' + folderAnimationApp + 'images/*.png ' + folderAnimationApp + 'images/animated.gif';
		exec(cmd, uploadAndTweetImage);

		function uploadAndTweetImage(){
			var imageFile = folderAnimationApp + 'images/animated.gif';
			var params = { encoding: 'base64' };
			var b64 = fs.readFileSync(imageFile, params);
			T.post('media/upload', { media_data: b64}, imageDidUpload);

			function imageDidUpload(err, data, response){
				// media has been uploaded, now we can tweet with the ID of the image
				var id = data.media_id_string;
				var tweet = {
					status: tweetTextContent,
					media_ids: [id]
				}
				T.post('statuses/update', tweet, tweeted);
				function tweeted(err, data, response) {
					if(err){ console.log('ERROR: ' + err); }
					else{
						console.log('tweet posted');
						fs.exists(imageFile, function(exists) {
							if(exists) fs.unlink(imageFile);
						});
					}
				};
			}
		}
	}
}

/////////////////////////////////////////////////////////
////////////////      STREAM      ///////////////////////
/////////////////////////////////////////////////////////

var stream = T.stream('user');

// stream.on('follow', function (eventMsg){
// 	var name = eventMsg.source.name;
// 	var screenName = eventMsg.source.screen_name;
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

function parseUserSubmission(textString){
	var mDate;
	if(moment.unix(textString).isValid()){
		mDate = moment.unix(textString);//.utc();
	} else{
		mDate = moment().utc();
	}
	var year = mDate.year();
	var month = mDate.month() + 1;  // January start at 1
	var day = mDate.date();
	var hour = mDate.hour();
	var minute = mDate.minute();
	var second = mDate.second();

	var fileString = year+'\n'+month+'\n'+day+'\n'+hour+'\n'+minute+'\n'+second;
	var b64 = fs.writeFileSync(dateFile, fileString);
	return mDate.format('H:mm') + ' UTC on ' + mDate.format('D MMMM YYYY');
}


function tweetReplyTo(tweetTextContent, eventMsg){
	console.log("tweetReplyTo");
	var tweet = {};
	var imageFile = folderPhotoApp + 'images/output.png';

	var dateString = parseUserSubmission(tweetTextContent);

	// linux executable:
	var cmd = '`pwd`/' + folderPhotoApp + photoAppName;
	// mac executable:
	// var cmd = 'open ' + folderPhotoApp + photoAppName + '.app';
	exec(cmd, processingFinished);

	function processingFinished(error, stdout, stderr){
		if(error){ console.log(error); return; }

		var params = { encoding: 'base64' };
		var b64 = fs.readFileSync(imageFile, params);

		T.post('media/upload', { media_data: b64}, imageDidUpload);

		function imageDidUpload(err, data, response){
			// media has been uploaded, now we can tweet with the ID of the image
			var id = data.media_id_string;
			var replyTweetString = '@' + eventMsg.user.screen_name + ' ' + dateString;
			var tweet = {
				status: replyTweetString,
				in_reply_to_status_id: eventMsg.id_str,
				media_ids: [id]
			}
			T.post('statuses/update', tweet, tweeted);
			function tweeted(err, data, response) {
				if(err){ console.log('ERROR: ' + err); }
				else{
					console.log('reply posted');
					fs.exists(imageFile, function(exists) {
						if(exists) fs.unlink(imageFile);
					});
					fs.exists(dateFile, function(exists) {
						if(exists) fs.unlink(dateFile);
					});
				}
			};
		}
	}
}

function tweetSimpleReplyTo(tweetTextContent, eventMsg){
	var tweet = {};
	if(eventMsg != undefined){
		console.log('this is a tweet response to someone ');
		tweet = {
			status: tweetTextContent,
			in_reply_to_status_id: eventMsg.id_str
		}
		T.post('statuses/update', tweet, tweeted);
		console.log("tweeting this:");
		console.log(tweet);
		function tweeted(err, data, response) {
			if(err){ console.log('ERROR: ' + err); }
			else{ console.log('tweet posted'); }
		};
	}
}
