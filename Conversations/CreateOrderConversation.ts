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

    private orderTitle: string;
    private mentionedIds: string[];

    public start(): void {
        this._bot.startPrivateConversation(this._message, function (err, conversation) {
            this.askForTitle(1, conversation);
        });
    }

    private askForTitle(stepNb, conversation): void {
        let msg: string = this.formatMessage(stepNb, CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_FOR_TITLE_STR);

        conversation.ask(msg, function (response, conversation) {
            this.orderTitle = response.text;

            stepNb = this.step(stepNb);
            this.askToMentionPeople(stepNb, conversation);
        });
    }

    private askToMentionPeople(stepNb, conversation): void {
        let msg = this.formatMessage(stepNb, CreateOrderConversation.NUMBER_OF_STEPS, CreateOrderConversation.ASK_TO_MENTION_PEOPLE);

        conversation.ask(msg, function (response, conversation) {
                var mentionedPersons = response.text.split(' ');

                for (let i = 0; i < mentionedPersons.length; ++i) {
                    if (!mentionedPersons[i].startsWith('<@')) {
                        conversation.say('Sorry, we dont know who ' + mentionedPersons[i] + " is :(");
                        continue;
                    }
                    this.mentionedIds.push(mentionedPersons[i].substr(2, 9)); // TODO really necessary?
                }

                stepNb = this.step(stepNb);
                // TODO add predefined options
                this.askForCon(stepNb, conversation);
            });
    }

    private askForConfirmation(stepNb, conversation): void {
        var order = db.orders[orderId];

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
        });
    }
}