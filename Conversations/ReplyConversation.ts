import { AbstractConversation } from "./AbstractConversation";
import { Order } from "../Models/Order";
import { ReplyStrings } from "./Strings/ReplyStrings";

class ReplyConversation extends AbstractConversation {

    private _order: Order;

    constructor(_bot, _message) {
        super(_bot, _message, 1);
    }

    public Start(): void {
        this._bot.startPrivateConversation(this._message, this.StartConversation.bind(this));
    }

    private StartConversation(err, conversation): void {
        let id = this._message.response.replace('reply', '').trim();

        let order: Order;
        if (id)
            order = Order.FindByIdAndParticipant(id, this._initiator);
        else
            order = Order.FindLatestOfParticipant(this._initiator);

        if (order === null) {
            conversation.say(ReplyStrings.ORDER_NOT_FOUND_STR);
            return;
        }

        this._order = order;
        this.AskForOrderResponse(conversation);
    }

    private AskForOrderResponse(conversation): void {
        let msg: string = this.FormatStepMessage(ReplyStrings.ASK_FOR_ORDER_RESPONSE_STR(this._order));

        conversation.ask(msg, this.AskForOrderResponse_HandleResponse.bind(this));
    }

    private AskForOrderResponse_HandleResponse(response, conversation): void {
        if ('cancel')
            stoooop;
        

        this.Step(conversation);
    }
}

export { ReplyConversation };
