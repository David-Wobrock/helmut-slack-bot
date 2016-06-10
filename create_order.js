var path = require('path');
var db = require(path.join(__dirname, 'db.js'));
var reply = require(path.join(__dirname, 'reply.js'));
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

        console.log("Title: " + response.text);
        var orderId = db.createOrder(response.text);

        conversation.next();
        askToMentionPeople(orderId, conversation);
    });
}

function askToMentionPeople(orderId, conversation) {
    conversation.ask("Mention all the people you will be able to take part of your order with @... @...", function(response, conversation) {
        db.orders[orderId].owner = response.user;

        console.log("You mentionend: " + response);
		console.log(response);
        if(response.text.trim().length === 0) {
            conversation.say('You seem to ignore my question...');
            conversation.next()
            askToMentionPeople(orderId, conversation);
            return;
        }
        var mentionedPersons = response.text.split(' ');
        // TODO test that strings begin with @ (+ that this person exists?)

        for (var i = 0; i < mentionedPersons.length; ++i) {
            if (!mentionedPersons[i].startsWith('<@')) {
                conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                continue;
            }
			console.log("ADDING TO ORDER: " + mentionedPersons[i].substr(2,9));
			db.addToOrder(orderId, mentionedPersons[i].substr(2,9));
		}

        conversation.next();
        askForPredefinedOption(orderId, conversation);
    });
}

function askForPredefinedOption(orderId, conversation) {
    conversation.ask("Set a predefined option (or say finish)", function(response, conversation) {
        if (response.text === 'finish' || response.text.trim() === '') {
            // Send to everyone
            console.log(db.orders[orderId]);
            var mentionendPersons = db.orders[orderId].targets;
            for (var i = 0; i < mentionendPersons.length; ++i) {
                console.log("send to " + mentionendPersons[i]);
            }
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


function askOrder(orderId){
    var currentOrder = db.orders[orderId];

    for(var i = 0; i < currentOrder.targets.length; i++){
        var uid = currentOrder.targets[i];
        var owner = currentOrder.owner;
        var choices = currentOrder.
        bot.startPrivateConversation({'userId': currentOrder.targets[i], text:"Hi There"});
    }
}

function showOrderSummaryAndConfirm(orderId, conversation){

    var order = db.orders[orderId];

    var orderstr = db.orderToStringPretty(order);
    conversation.say("Creation completed!Here is Your Order:")

    conversation.say(orderstr);
    conversation.ask("Is that ok? (type yes to accept, or something else to cancel!)", function(response, conversation){
        var responsetext = response.text;
        if(responsetext === 'yes'){
            conversation.next();
            //Handle Sending and Collecting data
            conversation.say("Sending...")
            for (var i = 0; i < order.targets.length; ++i) {
                conversation.task.bot.startPrivateConversation({'user': order.targets[i].name,}, function(err, conversation) {
                    conversation.say("ORDER INCOMING from <@" + order.owner + ">");
                    orderstr = "";
                    orderstr += "ID: " + order.id + "\n";
                    orderstr += "Title: "+ order.title + "\n";
                    for(var i = 0; i < order.options.length; i++){
                        orderstr += i + ": " + order.options[i] + "\n";
                    }

                    conversation.say(orderstr);
                    conversation.say("Reply with 'reply (number)' to select a choice or reply (text) to choose your own.");
                    conversation.next();
                });
            }
            conversation.say("Done!");
        }else{// remove the stuff;
            conversation.next();
            conversation.say("Order Deleted...");
            conversation.
            db.orders[orderId] = {};
            return;
        }
    });
}

module.exports = create_order;
