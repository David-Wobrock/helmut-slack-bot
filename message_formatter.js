var path = require('path');
var db = require(path.join(__dirname, 'db.js'));

var formatter = {};

formatter.formatCollectedReplies = function(orderId, replies) {
	var resultStr = "Here are the current replies to order #" + orderId + "\n";
	var options = [];
	var defaultOptions = db.orders[orderId].options;
	var numberOfDefaultOptions = defaultOptions.length;

	// INIT OPTIONS
	for (var i = 0; i < numberOfDefaultOptions; ++i) {
		options.push({
			'text': defaultOptions[i],
			'counter': 0
		});
	}

	// COUNT REPLIES
	for (var i = 0; i < replies.length; ++i) {
		if (replies[i] === parseInt(replies[i], 10)) {
			var replyNb = parseInt(replies[i]);
			// Is int, so maybe an option
			if (1 < replyNb && replyNb <= numberOfDefaultOptions) {
				options[replyNb].counter++;
			} else {
				options.push({
					'text': replyNb + '(helmut: yes, he replied with a number...)',
					'counter': 1
				});
			}
		} else {
			// Not an int, so a custom option
			options.push({
					'text': replies[i],
					'counter': 1
				});
		}
	}

	// OUTPUT
	for (var i = 0; i < options.length; ++i) {
		resultStr += "- " + options[i].text + " (" + options[i].counter + " times)\n";
	}

	return resultStr;
}

formatter.help_message = function() {
	return "Hi! I'm helmut, the waiter bot. I will help you organize meals in your team.\n\
Here is how I work. I am very easy to use, you will see :)\n\
My commands:\n\
• help - see this help. Write this command when you need some reminder about how I work\n\
• order - this takes you to the process of creating a new order for your colleagues\n\
• reply - reply do an order, either as one of this form:\n\
\t• reply _number_ (_choose a predefined option of the last received order_)\n\
\t• reply _my custom option_ (_replying to the last order you received_)\n\
\t• reply <_id_> _my custom order_ (_specifying the order_)\n\
• collect [_id_] - collect the replies of the specified order (by id), or by the last one you made when no _id_ specified\n\
• close [_id_] - closes an order. Nobody can reply to it anymore! You are going to store and buy the stuff\n\
• notify [_id_] - notifies all invited colleagues that their stuff has arrived at the office. You are back!\n\
• show - display all your current orders you made and you received\
";
};

module.exports = formatter;
