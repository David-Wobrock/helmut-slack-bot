import { Order } from "../Models/Order";
import { User } from "../Models/User";

class Database {

    private static _instance: Database = new Database();

    constructor() {
        if (Database._instance)
            throw new Error("Error: Database instance exists already");
        Database._instance = this;
    }

    public static GetInstance(): Database {
        return Database._instance;
    }

    private _database = {
        'orders': {}
    };

    public AddOrder(order: Order): void {
        this._database.orders[order.Id] = order;
    }

    public DeleteOrder(orderId: number): void {
        // TODO handle error
        delete this._database.orders[orderId];
    }

    public OrdersWithParticipant(participant: User): Array<Order> {
        let orders: Array<Order> = [];

        for (let orderId in this._database.orders) {
            let currentOrder: Order = this._database.orders[orderId];
            if (currentOrder.IsOpen)
                for (let i = 0; i < currentOrder.Participants.length; ++i)
                    if (currentOrder.Participants[i].Id === participant.Id)
                        orders.push(currentOrder);
        }

        return orders;
    }

    public OrdersOfOwner(owner: User): Array<Order> {
        let orders: Array<Order> = [];

        for (let orderId in this._database.orders) {
            let currentOrder: Order = this._database.orders[orderId];
            if (currentOrder.Owner.Id === owner.Id)
                orders.push(currentOrder);
        }

        return orders;
    }
}

export { Database };
