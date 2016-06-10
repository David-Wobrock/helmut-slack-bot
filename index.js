/*var rtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {logLevel: 'debug'});
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
	console.log(message);
});
rtm.start();*/

if (!process.env.token) {
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token || 'xoxb-49895947781-WXerjwLI6CpltOcziC7RU6ze'
}).startRTM();

controller.hears(['order'], 'direct_message', function(bot, message) {
	console.log(message);
	bot.reply(message,
		'Hi! I am helmut'
	);
    /*bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });*/
});

