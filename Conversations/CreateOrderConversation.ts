import { AbstractConversation } from "./AbstractConversation";
import { OrderFabric } from "../Models/Fabrics/OrderFabric";
import { Order } from "../Models/Order";

class CreateOrderConversation extends AbstractConversation {

    private static get NUMBER_OF_STEPS(): number {
        return 3;
    }
    private static get ASK_FOR_TITLE_STR(): string {
        return '*What is the description of your order?*';
    }

    private static get ASK_TO_MENTION_PEOPLE_STR(): string {
        return '*Mention the people you want to invite to your order.*\n\
Just use the basic slack mentioning @marat @david_wobrock...';
    }

    private static get ASK_FOR_CONFIRMATION_BEGINNING_STR(): string {
        return 'Creation completed! Nice work! Here is the summary of your order:';
    }

    private static get ASK_FOR_CONFIRMATION_ENDING_STR(): string {
        return 'Is that ok? (type *yes* to accept, or something else to cancel)';
    }

    private static get SEND_INVITATION_BEGINNING_STR(): string {
        return 'You received an order from ';
    }

    private static get SEND_INVITATION_ENDING_STR(): string {
        return 'Write `reply` to begin answering to the latest order received.\n\
Else, write `reply <id>` to answer a specific order you received.';
    }

    private _order: Order;
    private _orderTitle: string;
    private _mentionedIds: string[];

    constructor(_bot, _message) {
        super(_bot, _message);
        this._orderTitle = '';
        this._mentionedIds = [];
    }

    public Start(): void {
        this._bot.startPrivateConversation(this._message, this.StartConversation.bind(this));
    }

    private StartConversation(err, conversation): void {
        this.AskForTitle(conversation);
    }

    private AskForTitle(conversation): void {
        let msg: string = this.FormatMessage(CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_FOR_TITLE_STR);

        conversation.ask(msg, this.AskForTitle_HandleResponse.bind(this));
    }

    private AskForTitle_HandleResponse(response, conversation): void {
        this._orderTitle = response.text;

        this.Step(conversation);
        this.AskToMentionPeople(conversation);
    }

    private AskToMentionPeople(conversation): void {
        let msg: string = this.FormatMessage(CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_TO_MENTION_PEOPLE_STR);

        conversation.ask(msg, this.AskToMentionPeople_HandleResponse.bind(this));
    }

    private AskToMentionPeople_HandleResponse(response, conversation): void {
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

    private AskForConfirmation(conversation): void {
        this._order = OrderFabric.CreateOrder(this._orderTitle, this._initiator, this._mentionedIds);

        let messageString: string = CreateOrderConversation.ASK_FOR_CONFIRMATION_BEGINNING_STR + '\n' + this._order.ToString() + '\n\n' + CreateOrderConversation.ASK_FOR_CONFIRMATION_ENDING_STR;

        let completeMessage: string = this.FormatMessage(CreateOrderConversation.NUMBER_OF_STEPS, messageString);

        conversation.ask(completeMessage, this.AskForConfirmation_HandleResponse.bind(this));
    }

    private AskForConfirmation_HandleResponse(response, conversation) {
        let endingConversationMessage: string;

        let responseText = response.text;
        if (responseText === 'yes' || responseText === 'y' || responseText === 'Y' || responseText === 'YES') {
            this.SendInvitations();
            endingConversationMessage = 'The order has been sent out to the participants.';
        } else {
            this._order.Delete();
            endingConversationMessage = 'Order has been canceled. You can begin over now.';
        }

        this.Step(conversation);
        conversation.say(endingConversationMessage);
    }

    private SendInvitations(): void {
        let participants = this._order.Participants;
        for (let i = 0; i < participants.length; ++i) {
            let userDict = { 'user': participants[i].Id };
            this._bot.startPrivateConversation(userDict, this.SendInvitationsMessage.bind(this));
        }
    }

    private SendInvitationsMessage(err, conversation): void {
        let message: string = CreateOrderConversation.SEND_INVITATION_BEGINNING_STR + this._initiator.SlackMention + '\n' + this._order.ToParticipantString() + '\n' + CreateOrderConversation.SEND_INVITATION_ENDING_STR;
        conversation.say(message);
    }
}

export { CreateOrderConversation };
