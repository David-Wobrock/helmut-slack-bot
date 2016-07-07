class Order {

    constructor(private _id: number, private _title: string, private _owner: User, private _participants: Array<User>) {
    }

    public get id(): number {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }
}
