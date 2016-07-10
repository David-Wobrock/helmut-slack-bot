import { AbstractConversation } from "./AbstractConversation";
import { CreateOrderConversation } from "./CreateOrderConversation";
import { ReplyConversation } from "./ReplyConversation";

enum ConversationType {
    CreateOrder,
    Reply
}

class ConversationFabric {
    static CreateConversation(conversationType: ConversationType, bot, message): AbstractConversation {
        switch (conversationType) {
            case ConversationType.CreateOrder:
                return new CreateOrderConversation(bot, message);
            case ConversationType.Reply:
                return new ReplyConversation(bot, message);

            default:
                console.log("Error! Unknown conversation type.");
                break;
        }
    }
}

export { ConversationType, ConversationFabric };
