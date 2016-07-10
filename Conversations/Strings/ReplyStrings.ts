import { Order } from "../../Models/Order";

class ReplyStrings {
    public static get ORDER_NOT_FOUND_STR(): string {
        return 'We could not find any matching order. Sorry :(';
    }

    public static ASK_FOR_ORDER_RESPONSE_STR(order: Order): string {
        return "What do you want for the order '" + order.Title + "' from " + order.Owner.SlackMention + "? Or write `cancel` to stop replying.";
    }
}

export { ReplyStrings };
