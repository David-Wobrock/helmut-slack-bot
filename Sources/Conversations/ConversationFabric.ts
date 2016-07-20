import { AbstractConversation } from "./AbstractConversation";
import { CreateOrderConversation } from "./CreateOrderConversation";
import { ReplyConversation } from "./ReplyConversation";
import { CloseOrderConversation } from "./CloseOrderConversation";

enum ConversationType {
    CreateOrder,
    Reply,
    CloseOrder
}

class ConversationFabric {
    static CreateConversation(conversationType: ConversationType, bot, message): AbstractConversation {
        switch (conversationType) {
            case ConversationType.CreateOrder:
                return new CreateOrderConversation(bot, message);
            case ConversationType.Reply:
                return new ReplyConversation(bot, message);
            case ConversationType.CloseOrder:
                return new CloseOrderConversation(bot, message);


            default:
                console.log("Error! Unknown conversation type.");
                break;
        }
    }
}

export { ConversationType, ConversationFabric };
