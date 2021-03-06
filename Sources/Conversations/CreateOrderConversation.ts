﻿import { AbstractConversation } from "./AbstractConversation";
import { OrderFabric } from "../Models/Fabrics/OrderFabric";
import { Order } from "../Models/Order";
import { CreateOrderStrings } from "./Strings/CreateOrderStrings";

class CreateOrderConversation extends AbstractConversation {

    private _order: Order;
    private _orderTitle: string;
    private _mentionedIds: string[];

    constructor(_bot: any, _message: any) {
        super(_bot, _message, 3);
        this._orderTitle = '';
        this._mentionedIds = [];
    }

    protected StartConversation(err: any, conversation: any): void {
        this.AskForTitle(conversation);
    }

    private AskForTitle(conversation: any): void {
        let msg: string = this.FormatStepMessage(CreateOrderStrings.ASK_FOR_TITLE_STR);

        conversation.ask(msg, this.AskForTitle_HandleResponse.bind(this));
    }

    private AskForTitle_HandleResponse(response: any, conversation: any): void {
        this._orderTitle = response.text;

        this.Step(conversation);
        this.AskToMentionPeople(conversation);
    }

    private AskToMentionPeople(conversation: any): void {
        let msg: string = this.FormatStepMessage(CreateOrderStrings.ASK_TO_MENTION_PEOPLE_STR);

        conversation.ask(msg, this.AskToMentionPeople_HandleResponse.bind(this));
    }

    private AskToMentionPeople_HandleResponse(response: any, conversation: any): void {
        var mentionedPersons = response.text.split(' ');

        for (let i = 0; i < mentionedPersons.length; ++i) {
            if (!mentionedPersons[i].startsWith('<@')) {
                conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                continue;
            }
            this._mentionedIds.push(mentionedPersons[i]);
        }

        this.Step(conversation);
        // TODO: Add predefined options
        this.AskForConfirmation(conversation);
    }

    private AskForConfirmation(conversation: any): void {
        this._order = OrderFabric.CreateOrder(this._orderTitle, this._initiator, this._mentionedIds);

        let message: string = this.FormatStepMessage(CreateOrderStrings.ASK_FOR_CONFIRMATION_STR(this._order));

        conversation.ask(message, this.AskForConfirmation_HandleResponse.bind(this));
    }

    private AskForConfirmation_HandleResponse(response: any, conversation: any) {
        let endingConversationMessage: string;

        let responseText = response.text;
        if (responseText === 'yes' || responseText === 'y' || responseText === 'Y' || responseText === 'YES') {
            this.SendInvitations();
            endingConversationMessage = CreateOrderStrings.INVITATIONS_SENT_OUT_STR;
        } else {
            this._order.Delete();
            endingConversationMessage = CreateOrderStrings.ORDER_CANCELLED_STR;
        }

        this.Step(conversation);
        conversation.say(endingConversationMessage);
    }

    private SendInvitations(): void {
        let participants = this._order.Participants;
        for (let i = 0; i < participants.length; ++i) {
            let userDict: Object = { 'user': participants[i].Id };
            this._bot.startPrivateConversation(userDict, this.SendInvitationsMessage.bind(this));
        }
    }

    private SendInvitationsMessage(err: any, conversation: any): void {
        let message: string = CreateOrderStrings.SEND_INVITATION_STR(this._order);
        conversation.say(message);
    }
}

export { CreateOrderConversation };
