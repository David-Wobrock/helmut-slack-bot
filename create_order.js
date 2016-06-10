var path = require('path');
var db = require(path.join(__dirname, 'db.js'));

var create_order = {};

create_order.startCreateOrderConversation = function(message, conversation) {
	message = message.text.replace('order', '').trim();
	console.log(message);
	// No message/title
	if (message === '') {
		askForTitle(conversation);
	} else {
		var orderId = db.createOrder(message);
		askToMentionPeople(orderId, conversation);
	}
};

function askForTitle(conversation) {
    conversation.ask('What is the description of your order?', function(response, conversation) {
        console.log("Title: " + response);
        var orderId = db.createOrder(response);
        askToMentionPeople(orderId, conversation);
    });
}

function askToMentionPeople(orderId, conversation) {
    conversation.ask("Mention all the people you will be able to take part of your order with @... @...", function(response, conversation) {
        console.log("You mentionend: " + response);
        if(response.text.trim().length==0) {
            conversation.say('You seem to ignore my question....');
            askToMentionPeople(orderId, conversation);
            return;
        }
        var mentionedPersons = response.text.split(' ');
        // TODO test that strings begin with @ (+ that this person exists?)


        for (var i = 0; i < mentionedPersons.length; ++i)
            if(!mentionedPersons[i].startsWith('<@')){
                conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                continue;
            }

        askForPredefinedOption(orderId, conversation);
    });
}

function askForPredefinedOption(orderId, conversation) {
    conversation.ask("Set a predefined option (or say finish)", function(response, conversation) {
        if (response.text === 'finish') {
            // Send to everyone
            var mentionendPersons = orders[orderId].targets;
            for (var i = 0; i < mentionendPersons; ++i) {
                console.log("send to " + mentionendPersons[i]);
            }
        } else {
            if(response.text.trim().length > 0){
                orders[orderId].options.push(response);
            }
            // Add predefined option in memory
            askForPredefinedOption(orderId, conversation);
        }
    });
}


function askOrder(orderId){
    var currentOrder = orders[orderId];

    for(var i = 0; i < currentOrder.targets.length; i++){
        var uid = currentOrder.targets[i];
        var owner = currentOrder.owner;
        var choices = currentOrder.
        bot.startPrivateConversation({'userId': currentOrder.targets[i] })
    }
}

module.exports = create_order;