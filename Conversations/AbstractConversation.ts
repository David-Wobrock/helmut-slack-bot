abstract class AbstractConversation {
    protected _initiator: User;

    constructor(protected _bot, protected _message) {
        this._initiator = new User(_message.user); // TODO works?
    }

    public abstract start(): void;

    protected step(stepNb: number, conversation): number {
        conversation.next();
        return ++stepNb;
    }

    protected formatMessage(currentStep: number, totalNumberOfSteps: number, message: string): string {
        return this.stepNbToString(currentStep, totalNumberOfSteps) + " " + message;
    }

    private stepNbToString(currentStep: number, totalNumberOfSteps: number): string {
        return `(${currentStep}/${totalNumberOfSteps})`;
    }
}
