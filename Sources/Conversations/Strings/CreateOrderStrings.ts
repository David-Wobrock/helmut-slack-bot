import { Order } from "../../Models/Order";

class CreateOrderStrings {

    public static get ASK_FOR_TITLE_STR(): string {
        return '*What is the description of your order?*';
    }

    public static get ASK_TO_MENTION_PEOPLE_STR(): string {
        return '*Mention the people you want to invite to your order.*\n\
Just use the basic slack mentioning @marat @david_wobrock...';
    }

    public static ASK_FOR_CONFIRMATION_STR(order: Order): string {
        return 'Creation completed! Nice work! Here is the summary of your order:\n' + order.ToString() + 
'\n\nIs that ok? (type *yes* to accept, or something else to cancel)';
    }

    public static SEND_INVITATION_STR(order: Order): string {
        return 'You received an order from ' + order.Owner.SlackMention + '\n' + order.ToParticipantString() + '\n' + 
'Write `reply` to begin answering to the latest order received.\n\
Else, write `reply <id>` to answer a specific order you received.';
    }

    public static get INVITATIONS_SENT_OUT_STR(): string {
        return 'The order has been sent out to the participants.';
    }

    public static get ORDER_CANCELLED_STR(): string {
        return 'Order has been canceled. You can begin over now.';
    }
}

export { CreateOrderStrings };
