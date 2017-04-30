// this bot's twitter handle:
var TWITTER_HANDLE = 'jupiternow';


var Twit = require('twit');
//get keys from the other file
var config = require('./config');
// start twit with keys
var T = new Twit(config);
var exec = require('child_process').exec;
var fs = require('fs');
var moment = require('moment');


/////////////////////////////////////////////////////////
////////////////     TERMINAL     ///////////////////////
/////////////////////////////////////////////////////////


// var imagemakerFolder = 'application.macosx/';
var imagemakerFolder = 'application.linux64/';

console.log("Starting Twitter Bot..");
tweetImage();
setInterval(tweetImage, 1000 * 60 * 60 * 6);  // 6 hours



function tweetImage(tweetTextContent, tweetReplyID){
	if(tweetTextContent == undefined)
		tweetTextContent = ' ';

	var startDate = moment().utc().format('D MMMM YYYY');

	// var startTime = moment().format('YYYY-MM-DD hh:mm:ss a')
	// var endTime = moment().add(6,'hours').format('YYYY-MM-DD hh:mm:ss a')
	var startTime = moment().utc().format('H:mm')
	var endTime = moment().utc().add(6,'hours').format('H:mm')
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
	exec(cmd, processing);

	function processing(error, stdout, stderr){
		if(error){
			console.log(error);
			if(stdout){
				console.log(stdout);
			}
			if(stderr){
				console.log(stderr);
			}
			return;
		}

		// convert -delay 3 -loop 0 *.png animated.gif
		// console.log("converting image");
		var cmd = 'convert -delay 3 -loop 0 ' + imagemakerFolder + 'images/*.png ' + imagemakerFolder + 'images/animated.gif';
		exec(cmd, readyToPostImage);

		function readyToPostImage(){
			// console.log("convert end");
			var imageFile = imagemakerFolder + 'images/animated.gif';
			var params = {
				encoding: 'base64'
			};
			var b64 = fs.readFileSync(imageFile, params);
			T.post('media/upload', { media_data: b64}, uploaded);

			function uploaded(err, data, response){
				// console.log('image uploaded');
				// media has been uploaded, now we can tweet with the ID of the image
				var id = data.media_id_string;
				var tweet = {
					status: tweetTextContent,
					media_ids: [id]
				}
				if(tweetReplyID != undefined){
					console.log('this is a tweet response to someone ' + tweetReplyID);
					tweet = {
						status: tweetTextContent,
						in_reply_to_status_id: tweetReplyID,
						media_ids: [id]
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
						// console.log(data);
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
/*
var stream = T.stream('user');

stream.on('follow', function (eventMsg){
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
});
stream.on('limit', function (limitMessage) { console.log('limit !!'); });
stream.on('favorite', function (eventMsg) { console.log('got a fav'); });
stream.on('quoted_tweet', function (eventMsg) {});
stream.on('retweeted_retweet', function (eventMsg) {});
stream.on('tweet', function (eventMsg) {
	var inReply = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	if(inReply === TWITTER_HANDLE){
		console.log(from + ' sent us a tweet: "' + text + '"');
		var newTweet = '@' + from + ' here\'s some music';
		tweetIt(newTweet);
	}
});
*/
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