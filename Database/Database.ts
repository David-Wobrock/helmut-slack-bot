import { Order } from "../Models/Order";

class Database {

    private static instance: Database = new Database();

    constructor() {
        if (Database.instance)
            throw new Error("Error: Database instance exists already");
        Database.instance = this;
    }

    public static getInstance(): Database {
        return Database.instance;
    }

    private database = {
        'orders': {}
    };

    public addOrder(order: Order): void {
        this.database.orders[order.id] = order;
    }
}

export { Database };
