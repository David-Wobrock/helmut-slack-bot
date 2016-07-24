declare var require: any;
var assert = require('assert');

import { Database } from "../Sources/Database/Database";
import { OrderFabric } from "../Sources/Models/Fabrics/OrderFabric";
import { User } from "../Sources/Models/User";
import { Order } from "../Sources/Models/Order";

function SetUpDatabase() {
    let slackId1: string = '<@1234567>';
    let slackId2: string = '<@abcderf>';
    let slackId3: string = '<@7654321>';
    let user1: User = new User(slackId1);
    let user2: User = new User(slackId2);
    let user3: User = new User(slackId3);

    Database.GetInstance().AddOrder(OrderFabric.CreateOrder('Order1', user1, [slackId2, slackId3]));
    Database.GetInstance().AddOrder(OrderFabric.CreateOrder('Order2', user1, [slackId2, slackId3]));
    Database.GetInstance().AddOrder(OrderFabric.CreateOrder('Order3', user2, [slackId1, slackId3]));
}

export function FindOrdersTests(): void {
    SetUpDatabase();

    // Tests ces deux méthodes
    //OrdersWithParticipant
    //OrdersOfOwner

    assert.ok(true, 'is true');
}
