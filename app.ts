declare var require: any
declare var process: any

var botkit = require('botkit');
var os = require('os');
import { CreateOrderConversation } from "./Conversations/CreateOrderConversation";


var controller = botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.TOKEN || 'xoxb-49895947781-WXerjwLI6CpltOcziC7RU6ze'
}).startRTM();

controller.hears(['order'], 'direct_message', function (bot, message) {
    let conversation = new CreateOrderConversation(bot, message);
    conversation.Start();
});
