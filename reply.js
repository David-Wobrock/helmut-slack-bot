var path = require('path');
var db = require(path.join(__dirname, 'db.js'));

var reply = {};

reply.handleReplyToOrder = function(message, bot) {
    text_message = message.text.replace('reply', '').trim();
    console.log("MESSAGE");
    console.log(text_message);
    // Specified id
    if (text_message.startsWith('&lt;')) {
        var pos = text_message.indexOf('&gt;');
        var id = parseInt(text_message.substr(4, pos));
        text_message = text_message.replace('&lt;' + id + '&gt;', '').trim();
    } else { // Last received order id
        var id = getLastReceivedOrderId(message.user);
        if (!id) {
            bot.reply(message, 'You have no open received orders.');
            return;
        }
    }
    console.log("ID");
    console.log(id);
    // Verify it exists, is open and this user is mentionend
    if (!(id in db.orders)) {
        bot.reply(message, 'The id ' + id + ' is not an existing order');
        return;
    }
    
    var found = false;
    for (var i = 0; db.orders[id].targets.length; ++i) {
        if (db.orders[id].targets[i].name === message.user) {
            found = true;
            break;
        }
    }
    if (!found) {
        bot.reply(message, 'You have not been invited to order #' + id);
        return;
    }

    if (db.orders[id].status !== 'OPEN') {
        bot.reply(message, 'The order #' + id + ' already closed.');
        return;
    }

    var order = db.orders[id];
    console.log("WANTS: " + text_message);
    
    for (var i = 0; i < order.targets.length; i++) {
        if (order.targets[i].name == message.user) {
            order.targets[i].replies.push(text_message);
            bot.reply(message, 'Your reply has been registered!');
            return;
        }
    }
};

function getLastReceivedOrderId(receiverUser) {
    for (var id in db.orders) {
        var order = db.orders[id];
        for (var i = 0; i < order.targets.length; ++i) {
            var target = order.targets[i];
            if (target.name === receiverUser)
                return id;
        }
    }
    return null;
}

module.exports = reply;
