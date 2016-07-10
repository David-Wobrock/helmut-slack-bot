import { Order } from "../../Models/Order";
import { OrderResponse } from "../../Models/OrderResponse";

class ReplyStrings {
    public static get ORDER_NOT_FOUND_STR(): string {
        return 'We could not find any matching order. Sorry :(';
    }

    public static ASK_FOR_ORDER_RESPONSE_STR(order: Order): string {
        return "What do you want for the order '" + order.Title + "' from " + order.Owner.SlackMention + "? Or write `cancel` to stop replying.";
    }

    public static get CANCEL_RESPONSE_STR(): string {
        return 'Your response has been cancelled.';
    }

    public static get SENT_RESPONSE_STR(): string {
        return 'Your response has been transmitted to the owner of the order.';
    }

    public static RECEIVED_RESPONSE_STR(order: Order, response: OrderResponse): string {
        return "You received a response from " + response.Owner.SlackMention + " for your order '" + order.Title + "':\n" +
"\t" + response.Content;
    }
}

export { ReplyStrings };
