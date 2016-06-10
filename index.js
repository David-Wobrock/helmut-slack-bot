/*var rtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {logLevel: 'debug'});
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
	console.log(message);
});
rtm.start();*/

var path = require('path');
var reply = require(path.join(__dirname, 'reply.js'));
var create_order = require(path.join(__dirname, 'create_order.js'));




if (!process.env.token) {
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token || 'xoxb-49949903845-oVTjY3K5OptAH9o4PDtTO18N'
}).startRTM();

controller.hears(['order'], 'direct_message', function(bot, message) {
    bot.startPrivateConversation(message, function(err, conversation) {
        create_order.startCreateOrderConversation(message, conversation);
    })
});




function getUserString(userid){
    return "<@" + userid + ">";
}
