var HTTPS = require('https');
var nextRaid = "No message set. Use /setraidmsg: to set one.";

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var nextRaidRegex = /^\/when is raid$/;
  var nextRaidRegex2 = /^\/raid\?$/;
  var input = request.text;

  if(request.text && (nextRaidRegex.test(input) || nextRaidRegex2.test(input))) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else if (request.text && input.indexOf("/setraidmsg:") > -1){
	nextRaid = input.replace("/setraidmsg:", "");
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = nextRaid;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;