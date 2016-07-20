import { AbstractConversation } from "./AbstractConversation";
import { Order } from "../Models/Order";
import { CloseOrderStrings } from "./Strings/CloseOrderStrings";
import { CommonStrings } from "./Strings/CommonStrings";

class CloseOrderConversation extends AbstractConversation {
    private _order: Order;

    constructor(_bot, _message) {
        super(_bot, _message, 1);
    }

    protected StartConversation(err, conversation): void {
        let idStr: string = this._message.text.replace('close', '').trim();
        let id: number = Number(idStr);

        let order: Order;
        if (id === 0 || id === NaN)
            order = Order.FindLatestOfOwner(this._initiator);
        else
            order = Order.FindByIdAndOwner(id, this._initiator);

        if (order === null) {
            conversation.say(CommonStrings.ORDER_NOT_FOUND_STR);
            return;
        }

        this._order = order;

        this.AskForConfirmation(conversation);
    }

    private AskForConfirmation(conversation): void {
        let msg: string = this.FormatStepMessage(CloseOrderStrings.ASK_FOR_CONFIRMATION_STR);

        conversation.ask(msg, this.AskForConfirmation_HandleResponse.bind(this));
    }

    private AskForConfirmation_HandleResponse(response, conversation): void {
        let responseText = response.text;

        if (responseText.toLowerCase() === 'yes' || responseText.toLowerCase() === 'y') {

        } else {
            
        }
   }
}

export { CloseOrderConversation };
