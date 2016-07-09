import { User } from "./User";
import { Database } from "../Database/Database";

class Order {

    constructor(private _id: number, private _title: string, private _owner: User, private _participants: Array<User>) {
    }

    public get Id(): number {
        return this._id;
    }

    public Delete(): void {
        Database.GetInstance().DeleteOrder(this._id);
    }

    public SendInvitations(): void {
        // TODO
    }

    public ToString(): string {
        let orderStr: string = '• ID: ' + this._id + '\n\
        • Description: ' + this._title + '\n\
        • Invited users: ';

        for (let i = 0; i < this._participants.length; ++i)
            orderStr += '\t• ' + this._participants[i].SlackMention + '\n';

        return orderStr;
    }
}

export { Order };
