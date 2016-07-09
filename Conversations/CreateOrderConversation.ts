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

    private static get ASK_TO_MENTION_PEOPLE(): string {
        return '*Mention the people you want to invite to your order.*\n\
        Just use the basic slack mentioning @marat @david_wobrock...';
    }

    private static get ASK_FOR_CONFIRMATION_BEGINNING_STR(): string {
        return 'Creation completed! Nice work! Here is the summary of your order:';
    }

    private static get ASK_FOR_CONFIRMATION_ENDING_STR(): string {
        return 'Is that ok? (type * yes * to accept, or something else to cancel)';
    }

    private _order: Order;
    private _orderTitle: string;
    private _mentionedIds: string[];

    constructor(_bot, _message) {
        super(_bot, _message);
        this._orderTitle = '';
        this._mentionedIds = [];
    }

    public start(): void {
        this._bot.startPrivateConversation(this._message, this.startConversation.bind(this));
    }

    private startConversation(err, conversation): void {
        this.askForTitle(conversation);
    }

    private askForTitle(conversation): void {
        let msg: string = this.formatMessage(CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_FOR_TITLE_STR);

        conversation.ask(msg, this.askForTitle_HandleResponse.bind(this));
    }

    private askForTitle_HandleResponse(response, conversation): void {
        this._orderTitle = response.text;

        this.step(conversation);
        this.askToMentionPeople(conversation);
    }

    private askToMentionPeople(conversation): void {
        let msg: string = this.formatMessage(CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_TO_MENTION_PEOPLE);

        conversation.ask(msg, this.askToMentionPeople_HandleResponse.bind(this));
    }

    private askToMentionPeople_HandleResponse(response, conversation): void {
        var mentionedPersons = response.text.split(' ');

        for (let i = 0; i < mentionedPersons.length; ++i) {
            if (!mentionedPersons[i].startsWith('<@')) {
                conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                continue;
            }
            this._mentionedIds.push(mentionedPersons[i]);
        }

        this.step(conversation);
        // TODO: Add predefined options
        this.askForConfirmation(conversation);
    }

    private askForConfirmation(conversation): void {
        this._order = OrderFabric.createOrder(this._orderTitle, this._initiator, this._mentionedIds);

        let messageString: string = CreateOrderConversation.ASK_FOR_CONFIRMATION_BEGINNING_STR + '\n' + this._order.ToString() + '\n\n' + CreateOrderConversation.ASK_FOR_CONFIRMATION_ENDING_STR;

        let completeMessage: string = this.formatMessage(CreateOrderConversation.NUMBER_OF_STEPS, messageString);

        conversation.ask(completeMessage, this.askForConfirmation_HandleResponse.bind(this));
    }

    private askForConfirmation_HandleResponse(response, conversation) {
        let endingConversationMessage: string;

        let responseText = response.text;
        if (responseText === 'yes' || responseText === 'y' || responseText === 'Y' || responseText === 'YES') {
            this._order.SendInvitations();
            endingConversationMessage = 'The order has been sent out to the participants.';
        } else {
            this._order.Delete();
            endingConversationMessage = 'Order has been canceled. You can begin over now.';
        }

        this.step(conversation);
        conversation.say(endingConversationMessage);
        /*var order = db.orders[orderId];

        let msg = this.formatMessage(

        conversation.say("(4/4) Creation completed! Nice work! Here is the summary of your order: ");
        conversation.say(formatter.orderToStringPretty(order));

        conversation.ask("Is that ok? (type *yes* to accept, or something else to cancel)", function (response, conversation) {
            var responsetext = response.text;
            if (responsetext === 'yes' || responsetext === 'y' || responsetext === 'Y' || responsetext === 'YES') {
                conversation.next();
                //Handle Sending and Collecting data
                conversation.say("Sending...")
                db.orders[orderId].timestamp = new Date().getTime();
                for (var i = 0; i < order.targets.length; ++i) {
                    conversation.task.bot.startPrivateConversation({ 'user': order.targets[i].name, }, function (err, conversation) {
                        conversation.say(formatter.receivedOrder(order));
                        conversation.say("Write `reply 1` for example to choose a predefined option.\n\
Write `reply my custom meal description` to select something else than the predefined options\n\
Write `reply <id> my custom meal description to specify that the reply corresponds the an order that is not the latest.`");
                        conversation.next();
                    });
                }
                conversation.say("Done!");
            } else {// remove the stuff;
                conversation.next();
                delete db.orders[orderId];
                conversation.say("Order deleted. You can begin over now.");
                return;
            }
        });*/
    }
}

export { CreateOrderConversation };
