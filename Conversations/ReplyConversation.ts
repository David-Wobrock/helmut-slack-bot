import { AbstractConversation } from "./AbstractConversation";

class ReplyConversation extends AbstractConversation {
    constructor(_bot, _message) {
        super(_bot, _message);
    }

    public Start(): void {
        this._bot.startPrivateConversation(this._message, this.StartConversation.bind(this));
    }

    private StartConversation(err, conversation): void {
        
    }
}

export { ReplyConversation };
