import { Order } from "../Models/Order";

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
}

export { Database };
