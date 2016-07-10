import { User } from "./User";
import { Database } from "../Database/Database";

class Order {

    constructor(private _id: number, private _title: string, private _owner: User, private _participants: Array<User>) {
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
}

export { Order };
