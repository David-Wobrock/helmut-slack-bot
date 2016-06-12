var path = require('path');
var db = require(path.join(__dirname, 'db.js'));
var reply = require(path.join(__dirname, 'reply.js'));
var formatter = require(path.join(__dirname, 'message_formatter.js'));

var create_order = {};

create_order.startCreateOrderConversation = function(message, conversation) {
	message = message.text.replace('order', '').trim();
	askForTitle(conversation);
};

function askForTitle(conversation) {
    conversation.ask('(1/4) *What is the description of your order?*', function(response, conversation) {
        var orderId = db.createOrder(response.text);

        conversation.next();
        askToMentionPeople(orderId, conversation);
    });
}

function askToMentionPeople(orderId, conversation) {
    conversation.ask("(2/4) *Mention the people you want to invite to your order.*\n\
Just use the basic slack mentioning @marat @david_wobrock ...", function(response, conversation) {
        db.orders[orderId].owner = response.user;

        if(response.text.trim().length === 0) {
            conversation.say('You seem to ignore my question...');
            conversation.next()
            askToMentionPeople(orderId, conversation);
            return;
        }
        var mentionedPersons = response.text.split(' ');

        for (var i = 0; i < mentionedPersons.length; ++i) {
            if (!mentionedPersons[i].startsWith('<@')) {
                conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                continue;
            }
			db.addToOrder(orderId, mentionedPersons[i].substr(2,9));
		}

        conversation.next();
        askForPredefinedOption(orderId, conversation);
    });
}

function askForPredefinedOption(orderId, conversation) {
    conversation.ask("(3/4) *Add a predefined option for your colleagues, so it will be easy to choose* (or say `finish` to end the input of options)", function(response, conversation) {
        if (response.text === 'finish' || response.text.trim() === '') {
            conversation.next();
            showOrderSummaryAndConfirm(orderId, conversation);
            return;
        } else {
            if(response.text.trim().length > 0){
                db.orders[orderId].options.push(response.text);
            }
            // Add predefined option in memory
            conversation.next();
            askForPredefinedOption(orderId, conversation);
        }
    });
}


function showOrderSummaryAndConfirm(orderId, conversation) {

    var order = db.orders[orderId];

    conversation.say("(4/4) Creation completed! Nice work! Here is the summary of your order: ");
    conversation.say(formatter.orderToStringPretty(order));

    conversation.ask("Is that ok? (type *yes* to accept, or something else to cancel)", function(response, conversation) {
        var responsetext = response.text;
        if(responsetext === 'yes' || responsetext === 'y' || responsetext === 'Y' || responsetext === 'YES') {
            conversation.next();
            //Handle Sending and Collecting data
            conversation.say("Sending...")
            db.orders[orderId].timestamp = new Date().getTime();
            for (var i = 0; i < order.targets.length; ++i) {
                conversation.task.bot.startPrivateConversation({'user': order.targets[i].name,}, function(err, conversation) {
                    conversation.say(formatter.receivedOrder(order));
                    conversation.say("Write `reply 1` for example to choose a predefined option.\n\
Write `reply my custom meal description` to select something else than the predefined options\n\
Write `reply <id> my custom meal description to specify that the reply corresponds the an order that is not the latest.`");
                    conversation.next();
                });
            }
            conversation.say("Done!");
        } else {// remove the stuff;
            conversation.next();
            delete db.orders[orderId]; 
            conversation.say("Order deleted. You can begin over now.");
            return;
        }
    });
}

module.exports = create_order;
