import { AbstractConversation } from "./AbstractConversation";
import { Order } from "../Models/Order";
import { CloseOrderStrings } from "./Strings/CloseOrderStrings";
import { CommonStrings } from "./Strings/CommonStrings";

class CloseOrderConversation extends AbstractConversation {
    private _order: Order;

    constructor(_bot: any, _message: any) {
        super(_bot, _message, 1);
    }

    protected StartConversation(err: any, conversation: any): void {
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

    private AskForConfirmation(conversation: any): void {
        let msg: string = this.FormatStepMessage(CloseOrderStrings.ASK_FOR_CONFIRMATION_STR(this._order));

        conversation.ask(msg, this.AskForConfirmation_HandleResponse.bind(this));
    }

    private AskForConfirmation_HandleResponse(response: any, conversation: any): void {
        let responseText = response.text;

        if (responseText.toLowerCase() === 'yes' || responseText.toLowerCase() === 'y') {
            this._order.Close();
            this.SendOrderClosed();
        } else {
            conversation.say(CloseOrderStrings.CANCEL_CLOSING_STR);
            return;
        }
    }

    private SendOrderClosed(): void {
        let participants = this._order.Participants;
        for (let i = 0; i < participants.length; ++i) {
            let userDict: Object = { 'user': participants[i].Id };
            this._bot.startPrivateConversation(userDict, this.SendOrderClosedMessage.bind(this));
        }
    }

    private SendOrderClosedMessage(err: any, conversation: any): void {
        let message: string = CloseOrderStrings.SEND_ORDER_CLOSED_STR(this._order);
        conversation.say(message);
    }
}

export { CloseOrderConversation };
