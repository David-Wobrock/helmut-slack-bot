var RtmClient = require('@slack/client').RtmClient;
var token = 'xoxb-49895947781-WXerjwLI6CpltOcziC7RU6ze';
var rtm = new RtmClient(token, {logLevel: 'debug'});
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
	console.log(message);
});
rtm.start();
