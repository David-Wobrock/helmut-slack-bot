class Participant {
    slackMention: string;

    constructor(public id: string) {
        this.slackMention = '<@' + id + '>';
    }
}
