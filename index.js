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
var order_management = require(path.join(__dirname, 'order_management.js'));
var formatter = require(path.join(__dirname, 'message_formatter.js'));
var db = require(path.join(__dirname, 'db.js'));




if (!process.env.token) {
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token || 'xoxb-49945661952-GWvUBhJdCqDcxISw7Slf6aH5'
}).startRTM();

controller.hears(['order'], 'direct_message', function(bot, message) {
    bot.startPrivateConversation(message, function(err, conversation) {
        create_order.startCreateOrderConversation(message, conversation);
    })
});

controller.hears(['collect'], 'direct_message', function(bot, message) {
    textMessage = message.text.replace('collect').trim();

    var res = getDefaultOrId(textMessage, message.user);
    if (!res.success) {
        bot.reply(message, res.message);
        return;
    }
    var id = res.id;

    var replies = order_management.getReplies(id);
    var resultString = formatter.formatCollectedReplies(id, replies);
    bot.reply(message, resultString);
});

/**
 * Hier fehlt noch das id parsen.
 */
controller.hears(['reply'], 'direct_message', function(bot, message){
    text_message = message.text.replace('reply', '').trim();
    var isnum = /^\d+$/.test(text_message);

    var replytext;
    var order;
    if(isnum){
        order = db.getLastOrderForReply(message.user);
        replytext = order.options[text_message];
    }else{
        replytext = text_message;
        order = db.getLastOrderForReply(message.user);
    }


    for(var i = 0; i < order.targets.length; i++){
        if(order.targets[i].name == message.user){
            order.targets[i].replies.push(replytext);
        }
    }






});

controller.hears(['close'], 'direct_message', function(bot, message) {
    textMessage = message.text.replace('close').trim();

    var res = getDefaultOrId(textMessage, message.user);
    if (!res.success) {
        bot.reply(message, res.message);
        return;
    }
    var id = res.id;

    var replies = order_management.getReplies(id);
    var resultString = formatter.formatCollectedReplies(id, replies);
    bot.reply(message, resultString);
    
    order_management.closeOrder(id);
    order_management.notifyOrderClosed(id, bot);
});

controller.hears(['show'], 'direct_message', function(bot, message){
    console.log(typeof message.user);
    console.log("show");
    var orders = db.getOrdersOfUser(message.user);
    if(orders == null || orders.length == 0){
        bot.reply(message, "no Orders found");
    }else{
        reply = "";
        for(var i = 0; i < orders.length; i++){
            reply += db.orderToStringPretty(orders[i]);
            reply += "----------\n";
        }
        bot.reply(message, reply);
    }
});

controller.hears(['notify'], 'direct_message', function(bot, message) {
    textMessage = message.text.replace('close').trim();

    var res = getDefaultOrId(textMessage, message.user);
    if (!res.success) {
        bot.reply(message, res.message);
        return;
    }
    var id = res.id;
    // Send to all targets that order has arrived

    // Delete order
});

controller.hears(['help'], 'direct_message', function(bot, message) {
    bot.reply(message, formatter.help_message());
});



function getDefaultOrId(textMessage, user) {
    var id;

    if (typeof textMessage != 'undefined' && textMessage != undefined && textMessage !== 'undefined') {
        console.log("IN MESSAGE");
        id = textMessage;
    } else {
        console.log("TRY TO FIND");
        id = db.findLastOrderId(user);
    }
    
    if (!db.orderIdExists(id, user)) {
        return {'success': false, 'message': "You don't seem to have an order with id: " + id};
    }

    return {'success': true, 'id': id};
}


function getUserString(userid){
    return "<@" + userid + ">";
}
