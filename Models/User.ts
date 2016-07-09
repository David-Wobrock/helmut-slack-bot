class User {
    constructor(private _slackMention: string) {
    }

    public get slackMention(): string {
        return this._slackMention;
    }
}

export { User };
