declare var require: any;
declare var process: any;

var botkit = require('botkit');
var os = require('os');
import { ConversationFabric, ConversationType } from "./Conversations/ConversationFabric";


var controller = botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.TOKEN || 'xoxb-49895947781-WXerjwLI6CpltOcziC7RU6ze'
}).startRTM();

function createAndStartConversation(conversationType: ConversationType, bot, message) {
    let conversation = ConversationFabric.CreateConversation(conversationType, bot, message);
    conversation.Start();
}

controller.hears(['order'], 'direct_message', function (bot, message) {
    createAndStartConversation(ConversationType.CreateOrder, bot, message);
});

controller.hears(['reply'], 'direct_message', function (bot, message) {
    createAndStartConversation(ConversationType.Reply, bot, message);
});

controller.hears(['close'], 'direct_message', function (bot, message) {
    createAndStartConversation(ConversationType.CloseOrder, bot, message);
});
