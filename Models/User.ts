class User {
    private _slackMention: string;

    constructor(private _id: string) {
        this._slackMention = '<@' + _id + '>';
    }

    public get slackMention(): string {
        return this._slackMention;
    }
}

export { User };
