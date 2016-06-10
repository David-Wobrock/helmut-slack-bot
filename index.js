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
var collect = require(path.join(__dirname, 'collect.js'));
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
    var id;
    if (textMessage)
        id = textMessage;
    else
        id = db.findLastOrderId(message.user);

    if (!db.orderIdExists(id, message.user)) {
        bot.reply(message, "You don't seem to have an order with id: " + id);
        return;
    }

    var replies = collect.getReplies(id);
    var resultString = formatter.formatCollectedReplies(id, replies);
    bot.reply(message, resultString);
});

  //targets: [ 'U1FS19R9S', 'U1FSR1674' , 'U1FS6MVHN'],

controller.hears(['text'], 'direct_message', function(bot, message) {
    console.log("Saying something....");
    startConversationWithMarat();

});

controller.hears(['close'], 'direct_message', function(bot, message) {
    textMessage = message.text.replace('close').trim();
    var id;
    if (textMessage)
        id = textMessage;
    else
        id = db.findLastOrderId(message.user);

    if (!db.orderIdExists(id, message.user)) {
        bot.reply(message, "You don't seem to have an order with id: " + id);
        return;
    }

    var replies = collect.getReplies(id);
    var resultString = formatter.formatCollectedReplies(id, replies);
    bot.reply(message, resultString);
    
    // Add to logic for sending to everyone that the order is closed + don't accept any replies 
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

controller.on('rtm_open', function() {
})
//U1FSR1674
function startConversationWithMarat(){
    console.log("Sending stuff to marat...");
    bot.startPrivateConversation({user: 'U1FSR1674'}, function(err, conversation){
        conversation.say("Hi Marat!");
        conversation.next();
    });
}



function getUserString(userid){
    return "<@" + userid + ">";
}
