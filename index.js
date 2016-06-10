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

    bot.startPrivateConversation(message, function(err, conversation) {
        message = message.replace('order', '').trim();
        console.log(message);
        // No message/title
        if (message === '') {
            conversation.ask('What is the description of your order?', function(response, conversation) {
                console.log("Title: " + response);
                mentionPeople(conversation);
            });
        } else {
            mentionPeople(conversation);
        }
    })
});

function mentionPeople(conversation) {
    conversation.ask("Mention all the people you will be able to take part of your order with @... @...", function(response, conversation) {
        console.log("You mentionend: " + response);
    });
}

function setPredefinedOption(conversation) {
    conversation.ask("Set a predefined option (or say finish)", function(response, conversation) {
        if (response === 'finish') {

        } else {
            // Add predefined option to memory
            setPredefinedOption(conversation);
        }
    });
}