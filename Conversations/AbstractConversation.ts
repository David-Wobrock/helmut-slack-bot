import { User } from "../Models/User"

abstract class AbstractConversation {
    protected _initiator: User;
    protected self: AbstractConversation;
    private _stepNb: number;

    constructor(protected _bot, protected _message) {
        this._initiator = new User(_message.user); // TODO works?
        this._stepNb = 0;
    }

    public abstract start(): void;

    protected step(conversation): void {
        conversation.next();
        ++(this._stepNb);
    }

    protected formatMessage(totalNumberOfSteps: number, message: string): string {
        return this.stepNbToString(this._stepNb, totalNumberOfSteps) + " " + message;
    }

    private stepNbToString(currentStep: number, totalNumberOfSteps: number): string {
        return `(${currentStep}/${totalNumberOfSteps})`;
    }
}

export { AbstractConversation };