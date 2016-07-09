import { User } from "../Models/User"

abstract class AbstractConversation {
    protected _initiator: User;
    protected self: AbstractConversation;
    private _stepNb: number;

    constructor(protected _bot, protected _message) {
        this._initiator = new User(_message.user);
        this._stepNb = 1;
    }

    public abstract Start(): void;

    protected Step(conversation): void {
        conversation.next();
        ++(this._stepNb);
    }

    protected FormatMessage(totalNumberOfSteps: number, message: string): string {
        return this.StepNbToString(this._stepNb, totalNumberOfSteps) + " " + message;
    }

    private StepNbToString(currentStep: number, totalNumberOfSteps: number): string {
        return `(${currentStep}/${totalNumberOfSteps})`;
    }
}

export { AbstractConversation };