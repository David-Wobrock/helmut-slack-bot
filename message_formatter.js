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
		resultStr += "- " + options[i].text + " (" + options[i].counter + " times)";
	}

	return resultStr;
}

module.exports = formatter;
