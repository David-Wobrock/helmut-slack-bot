import botkit = require('botkit');
import os = require('os');

var controller = botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.TOKEN || 'xoxb-49895947781-WXerjwLI6CpltOcziC7RU6ze'
}).startRTM();

controller.hears(['order'], 'direct_message', function (bot, message) {
    let conversation = new CreateOrderConversation(bot, message);
    conversation.start();
});
