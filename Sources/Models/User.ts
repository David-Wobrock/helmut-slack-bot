class User {
    private _id: string;

    constructor(private _slackMention: string) {
        this._id = this._slackMention.substr(2, 9);
    }

    public get Id(): string {
        return this._id;
    }

    public get SlackMention(): string {
        return this._slackMention;
    }
}

export { User };
