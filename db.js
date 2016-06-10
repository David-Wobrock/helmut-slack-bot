var db = {};

db.orders = {};
var current_id = 1;

function getId() {
    return current_id++;
}

db.createOrder = function(title) {
    var id = getId();
    db.orders[id] = {
        'id': id,
        'title': title,
        'targets': [],
        'options': [],
    };
    return id;
};

db.addToOrder = function(orderId, user) {
	db.orders[orderId]['targets'].push(user);
}

db.findLastOrderId = function(user) {
	var lastId;
	for (var currentId in db.orders) {
		if (db.orders[currentId].owner == message.user) {
			lastId = currentId;
		}
	}

	return lastId;
}

db.orderIdExists = function(orderId, user) {
	if (!orderId)
		return false;

	if (!orderId in db.orders)
		return false;

	if (db.orders[orderId].owner != user)
		return false;
		
	return true;
}

module.exports = db;
