import { AbstractConversation } from "./AbstractConversation";
import { Order } from "../Models/Order";
import { OrderResponse } from "../Models/OrderResponse";
import { ReplyStrings } from "./Strings/ReplyStrings";
import { CommonStrings } from "./Strings/CommonStrings";

class ReplyConversation extends AbstractConversation {

    private _order: Order;
    private _responseObject: OrderResponse;

    constructor(_bot, _message) {
        super(_bot, _message, 1);
    }

    protected StartConversation(err, conversation): void {
        let idStr: string = this._message.text.replace('reply', '').trim();
        let id: number = Number(idStr);

        let order: Order;
        if (id === 0 || id === NaN)
            order = Order.FindLatestOfParticipant(this._initiator);
        else
            order = Order.FindByIdAndParticipant(id, this._initiator);

        if (order === null) {
            conversation.say(CommonStrings.ORDER_NOT_FOUND_STR);
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
        let responseText = response.text.trim();
        if (responseText === '' || responseText === 'cancel') {
            conversation.say(ReplyStrings.CANCEL_RESPONSE_STR);
            return;
        }
        
        this.Step(conversation);

        this._responseObject = new OrderResponse(this._initiator, responseText);
        this._order.AddResponse(this._responseObject);
        let orderOwnerDict: Object = { 'user': this._order.Owner.Id };
        this._bot.startPrivateConversation(orderOwnerDict, this.SendOrderResponseMessage.bind(this));

        conversation.say(ReplyStrings.SENT_RESPONSE_STR);
    }

    private SendOrderResponseMessage(err, conversation): void {
        let message: string = ReplyStrings.RECEIVED_RESPONSE_STR(this._order, this._responseObject);
        conversation.say(message);
    }
}

export { ReplyConversation };
