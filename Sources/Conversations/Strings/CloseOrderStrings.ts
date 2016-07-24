import { Order } from "../../Models/Order";

class CloseOrderStrings {

    public static ASK_FOR_CONFIRMATION_STR(order: Order): string {
        return "Closing means that you are going to get people's food. Did everybody order?\n\
Here is the current status of the order:\n" + order.ToString() + "\n\
Do you want to close the order? Say *yes* to close it.";
    }

    public static get CANCEL_CLOSING_STR(): string {
        return "Closing order cancelled.";
    }

    public static SEND_ORDER_CLOSED_STR(order: Order): string {
        return order.Owner.SlackMention + " just closed the order '" + order.Title + "'\n";
    }
}

export { CloseOrderStrings };
