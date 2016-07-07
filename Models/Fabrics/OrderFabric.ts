import { Order } from "../Order";
import { User } from "../User";
import { Database } from "../../Database/Database";

class OrderFabric {

    static _currentOrderId = 1;

    static createOrder(title: string, ownerId: string, participantIds: string[]): Order {
        let orderId = OrderFabric._currentOrderId++;

        let owner = new User(ownerId);

        let nbParticipants = participantIds.length;
        let participants = new Array<User>(nbParticipants);
        for (let i = 0; i < nbParticipants; ++i) {
            let currentParticipant = new User(participantIds[i]);
            participants[i] = currentParticipant;
        }

        let newOrder = new Order(orderId, title, owner, participants);
        Database.getInstance().addOrder(newOrder);
        return newOrder;
    }
}

export { OrderFabric };
