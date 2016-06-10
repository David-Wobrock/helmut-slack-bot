var path = require('path');
var db = require(path.join(__dirname, 'db.js'));

var order_management = {};

order_management.getReplies = function(id) {
	var result = [];
	var order = db.orders[id];
	for (var i = 0; i < db.orders[id].targets.length; i++) {
		var target = db.orders[id].targets[i];
		for (var j = 0; j < target.replies.length; ++j) {
			result.push(target.replies[j]);
		}
	}

	return result;
};

order_management.closeOrder = function(id) {
	db.orders[id].status = 'CLOSED';
}

order_management.notifyOrderClosed = function(id, bot) {
	var order = db.orders[id];
	for (var i = 0; i < order.targets.length; ++i) {
		bot.startPrivateConversation({
			'user': order.targets[i],
			'text': "The order #" + order.id + " is now closed. <@" + order.owner + "> will get your food soon :)" ,
		});
	}
}

module.exports = order_management;
