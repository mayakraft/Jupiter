// this bot's twitter handle:
var TWITTER_HANDLE = 'jupiternow';

var Twit = require('twit');
var exec = require('child_process').exec;
var fs = require('fs');
var moment = require('moment');
var config = require('./config');  //get keys from the other file

// start twit with keys
var T = new Twit(config);

/////////////////////////////////////////////////////////
////////////////     TERMINAL     ///////////////////////
/////////////////////////////////////////////////////////

console.log("Starting Twitter Bot..");

// var imagemakerFolder = 'application.macosx/';
var imagemakerFolder = 'application.linux64/';

// tweetForecastAnim();
// setInterval(tweetForecastAnim, 1000 * 60 * 60 * 6);  // 6 hours


function tweetForecastAnim(){
	var startDate = moment().utc().format('D MMMM YYYY');
	// var startTime = moment().format('YYYY-MM-DD hh:mm:ss a')
	// var endTime = moment().add(6,'hours').format('YYYY-MM-DD hh:mm:ss a')
	var startTime = moment().utc().format('H:mm');
	var endTime = moment().utc().add(6,'hours').format('H:mm');

	var tweetTextContent = ' ';
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
	var cmd = '`pwd`/' + imagemakerFolder + 'JovianMoons';
	// mac executable:
	// var cmd = 'open ' + imagemakerFolder + 'JovianMoons.app';
	exec(cmd, processingFinished);

	function processingFinished(error, stdout, stderr){
		if(error){ console.log(error); return; }

		// convert -delay 3 -loop 0 *.png animated.gif
		var cmd = 'convert -delay 3 -loop 0 ' + imagemakerFolder + 'images/*.png ' + imagemakerFolder + 'images/animated.gif';
		exec(cmd, uploadAndTweetImage);

		function uploadAndTweetImage(){
			var imageFile = imagemakerFolder + 'images/animated.gif';
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





/*
var exec = require('child_process').exec;
var fs = require('fs');
var cmd = '/Applications/LilyPond.app/Contents/Resources/bin/lilypond Untitled.ly';
exec(cmd, processing);

function processing() {
	var filename = 'output.png';
	var params = { encoding: 'base64' }
	var b64 = fs.readFileSync(filename, params);
	T.post('media/upload', { media_data: b64 }, uploaded);
	function uploaded(err, data, response){
		var id = data.media_id_string;
		var tweet = {
			status: 'tweet message',
			media_ids: [id]
		}
		T.post('statuses/update', tweet, tweeted);
		function tweeted(err, data, response){
			if(err){
				console.log("ERROR:");
				console.log(err);
			}
			console.log(data);
		}
	}
}*/

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

stream.on('tweet', function (eventMsg) {
	var inReply = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	if(inReply === TWITTER_HANDLE){
		console.log("matching: inReply === TWITTER_HANDLE")
		console.log(from + ' sent us a tweet: "' + text + '"');
	} else{	
		console.log("NOT matching: inReply === TWITTER_HANDLE")
		console.log(inReply);
		console.log(text);
		console.log(from);
		console.log(eventMsg);
	}
	tweetEvent(eventMsg);
});



function tweetEvent(eventMsg){
	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	var tweetReplyID = eventMsg.id_str;

	// if(replyto === TWITTER_HANDLE){
		console.log(from + ' sent us a tweet: "' + text + '"');
		var tweetContent = text.toLowerCase().replace('@'+TWITTER_HANDLE.toLowerCase(),'');
		// tweetContent = tweetContent.replace('@'+TWITTER_HANDLE,'');
		tweetContent = tweetContent.replace(' ', '');

		// if(tweetContent === '' || tweetContent === ' '){
			// console.log('Attepting IPA of ' + from);
			// IPAFromWord(from, from, tweetReplyID);
		// }
		// else{
			// console.log('Attepting IPA of ' + tweetContent);
			// IPAFromWord(tweetContent, from, tweetReplyID);
		// }
		var newTweet = '@' + from + ' ' + tweetContent;
		tweetReplyTo(tweetReplyID, tweetContent);
	// }

	// console.log("event");
	// var name = eventMsg.source.name;
	// var screenName = eventMsg.source.screen_name;
}




function tweetReplyTo(tweetReplyID, tweetTextContent){
	var tweet = {};
	// var imageFile = imagemakerFolder + 'images/animated.gif';
	// var params = {
	// 	encoding: 'base64'
	// };
	// var b64 = fs.readFileSync(imageFile, params);
	// T.post('media/upload', { media_data: b64}, uploaded);

	// function uploaded(err, data, response){
	// 	// media has been uploaded, now we can tweet with the ID of the image
	// 	var id = data.media_id_string;
	// 	var tweet = {
	// 		status: tweetTextContent,
	// 		media_ids: [id]
	// 	}
		if(tweetReplyID != undefined){
			console.log('this is a tweet response to someone ' + tweetReplyID);
			tweet = {
				status: tweetTextContent,
	//			media_ids: [id],
				in_reply_to_status_id: tweetReplyID
			}
			console.log('augmented the tweet body');
		}
		T.post('statuses/update', tweet, tweeted);
		// console.log(data);
		function tweeted(err, data, response) {
			if(err){
				console.log('ERROR: ' + err);
			}
			else{
				console.log('tweet posted');
				fs.exists(imageFile, function(exists) {
					if(exists) fs.unlink(imageFile);
				});
			}
		};
	}
}

/////////////////////////////////////////////////////////
////////////////      TWEET       ///////////////////////
/////////////////////////////////////////////////////////
/*
tweetIt('my tweet message');

setInterval(tweetIt('my tweet message'), 1000 * 60 * 5);

function tweetIt(tweetText){
	var tweet = { status: tweetText };

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response){
		if(err){
			console.log("ERROR:");
			console.log(err);
		}
		console.log(data);
	}
}
*/
/////////////////////////////////////////////////////////
////////////////      SEARCH      ///////////////////////
/////////////////////////////////////////////////////////
/*
var params = {
	q: 'origami since:2011-07-11', 
	count: 2 
};

T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
	var tweets = data.statuses;
	for(var i = 0; i < tweets.length; i++){
		console.log(tweets[i].text);
	}
};
*/