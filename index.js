/*var rtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {logLevel: 'debug'});
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
	console.log(message);
});
rtm.start();*/

var orders = {};
var current_id = 1;

function getId() {
    return current_id++;
}

function createOrder(title) {
    var id = getId();
    orders[id] = {
        'title': title,
        'targets': []
    };
    return id;
}




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
	console.log(message);''

    bot.startPrivateConversation(message, function(err, conversation) {
        message = message.replace('order', '').trim();
        console.log(message);
        // No message/title
        if (message === '') {
           askForTitle(conversation);
        } else {
            var orderId = createOrder(message);
            askToMentionPeople(orderId, conversation);
        }
    })
});


function askForTitle(conversation) {
    conversation.ask('What is the description of your order?', function(response, conversation) {
        console.log("Title: " + response);
        var orderId = createOrder(response);
        askToMentionPeople(orderId, conversation);
    });
}

function askToMentionPeople(orderId, conversation) {
    conversation.ask("Mention all the people you will be able to take part of your order with @... @...", function(response, conversation) {
        console.log("You mentionend: " + response);
        
        var mentionedPersons = response.split(' ');
        // TODO test that strings begin with @ (+ that this person exists?) 
        for (var i = 0; i < mentionedPersons.length; ++i)
            orders[orderId]['targets'].append(mentionedPersons[i]);

        askForPredefinedOption(orderId, conversation);
    });
}

function askForPredefinedOption(orderId, conversation) {
    conversation.ask("Set a predefined option (or say finish)", function(response, conversation) {
        if (response === 'finish') {
            // Send to everyone
            var mentionendPersons = orders[orderId].targets;
            for (var i = 0; i < mentionendPersons; ++i) {
                console.log("send to " + mentionendPersons[i]);
            }
        } else {
            // Add predefined option in memory
            askForPredefinedOption(orderId, conversation);
        }
    });
}
