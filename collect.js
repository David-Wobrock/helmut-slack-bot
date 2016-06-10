var path = require('path');
var db = require(path.join(__dirname, 'db.js'));

var collect = {};

collect.getReplies = function(id) {
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

module.exports = collect;
