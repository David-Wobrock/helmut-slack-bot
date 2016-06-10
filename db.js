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
		'status': 'OPEN' // or CLOSED
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

db.getOrdersOfUser = function(userId){
	var ordersofuser = [];

	console.log(userId);
	console.log(db.orders);

	for (var i = 0; i < db.orders.length; i++){
		if(db.orders[i].owner == userId){
			ordersofuser.push(db.orders[i]);
		}
	}
	return ordersofuser;
}

db.orderToStringPretty = function(order){
	var orderstr = '';
	orderstr += 'Title: ' + order.title + '\n';
	orderstr += 'Invited Users: \n';
	for (var i = 0; i < order.targets.length; i++) {
		orderstr += '\t<@' + order.targets[i] + '>\n';
	}
	orderstr += 'Possible Choices: \n';
	for (var i = 0; i < order.options.length; i++) {
		orderstr += '\t' + order.options[i] + '\n';
	}
	return orderstr;
}
module.exports = db;
