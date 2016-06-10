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
		'status': 'OPEN', // or CLOSED
		'replies': []
    };
    return id;
};

db.addToOrder = function(orderId, user) {
	db.orders[orderId]['targets'].push({
		'name': user,
		'replies': []
	});
}

db.findLastOrderId = function(user) {
	var lastId;
	console.log(db.orders);
	for (var currentId in db.orders) {
		console.log("CURRENT:" + currentId);
		if (db.orders[currentId].owner == user) {
			console.log("FOUND");
			lastId = currentId;
		}
	}

	return lastId;
}

db.orderIdExists = function(orderId, user) {
	if (!orderId)
		return false;

	if (!(orderId in db.orders))
		return false;

		console.log(db.orders[orderId]);
	if (db.orders[orderId].owner != user)
		return false;
		
	return true;
}

db.getOrdersOfUser = function(userId){
	var ordersofuser = [];

	console.log(userId);
	console.log(db.orders);

	for(var id in db.orders){
		cord = db.orders[id];
		if(db.orders[id].owner == userId){
			ordersofuser.push(db.orders[id]);
			continue;
		}
		for(var i = 0; i < cord.targets; i++){
			if(cord.targets[i] == userId){
				ordersofuser.push(cord);
			}
		}
	}

	return ordersofuser;
}

module.exports = db;
