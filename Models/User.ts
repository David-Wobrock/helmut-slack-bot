class User {
    constructor(private _slackMention: string) {
    }

    public get SlackMention(): string {
        return this._slackMention;
    }
}

export { User };
