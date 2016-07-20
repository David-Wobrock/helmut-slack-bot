import { User } from "./User";
import { OrderResponse } from "./OrderResponse";
import { Database } from "../Database/Database";

class Order {

    private _responses: Array<OrderResponse>;

    constructor(private _id: number, private _title: string, private _owner: User, private _participants: Array<User>) {
        this._responses = [];
    }

    public get Id(): number {
        return this._id;
    }

    public get Title(): string {
        return this._title;
    }

    public get Owner(): User {
        return this._owner;
    }

    public get Participants(): Array<User> {
        return this._participants;
    }

    public Delete(): void {
        Database.GetInstance().DeleteOrder(this._id);
    }

    public AddResponse(response: OrderResponse): void {
        this._responses.push(response);
    }

    public ToString(): string {
        let orderStr: string = this.ToParticipantString() + '\n\
• Invited users:\n';

        for (let i = 0; i < this._participants.length; ++i)
            orderStr += '\t• ' + this._participants[i].SlackMention + '\n';

        return orderStr;
    }

    public ToParticipantString(): string {
        return '• ID: ' + this._id + '\n\
• Description: ' + this._title;
    }

    public static FindLatestOfParticipant(participant: User): Order {
        let orders: Array<Order> = Database.GetInstance().OrdersWithParticipant(participant);

        if (orders.length === 0)
            return null;

        let latestOrder: Order;
        for (let i = 0; i < orders.length; ++i)
            if (!latestOrder || latestOrder.Id < orders[i].Id)
                latestOrder = orders[i];

        return latestOrder;
    }

    public static FindByIdAndParticipant(orderId: number, participant: User): Order {
        let orders: Array<Order> = Database.GetInstance().OrdersWithParticipant(participant);

        if (orders.length === 0)
            return null;

        for (let i = 0; i < orders.length; ++i)
            if (orderId === orders[i].Id)
                return orders[i];

        return null;
    }

    public static FindLatestOfOwner(owner: User): Order {
        let orders: Array<Order> = Database.GetInstance().OrdersOfOwner(owner);

        if (orders.length === 0)
            return null;

        let latestOrder: Order;
        for (let i = 0; i < orders.length; ++i)
            if (!latestOrder || latestOrder.Id < orders[i].Id)
                latestOrder = orders[i];

        return latestOrder;
    }

    public static FindByIdAndOwner(orderId: number, owner: User): Order {
        let orders: Array<Order> = Database.GetInstance().OrdersOfOwner(owner);

        if (orders.length === 0)
            return null;

        for (let i = 0; i < orders.length; ++i)
            if (orderId === orders[i].Id)
                return orders[i];

        return null;
    }
}

export { Order };
