import { AbstractConversation } from "./AbstractConversation";

class CloseOrderConversation extends AbstractConversation {
    constructor(_bot, _message) {
        super(_bot, _message, 1);
    }

    protected StartConversation(err, conversation): void {
        // TODO
    }
}
