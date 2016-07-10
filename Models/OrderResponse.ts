import { User } from "./User";

class OrderResponse {
    constructor(private _owner: User, private _content: string) {
    }

    public get Owner(): User {
        return this._owner;
    }

    public get Content(): string {
        return this._content;
    }
}

export { OrderResponse };