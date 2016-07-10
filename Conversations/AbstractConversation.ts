import { User } from "../Models/User"

abstract class AbstractConversation {
    protected _initiator: User;
    protected self: AbstractConversation;
    private _stepNb: number;

    constructor(protected _bot, protected _message, private _totalNbSteps: number) {
        this._initiator = new User('<@' + _message.user + '>');
        this._stepNb = 1;
    }

    public abstract Start(): void;

    protected Step(conversation): void {
        conversation.next();
        ++(this._stepNb);
    }

    protected FormatStepMessage(message: string): string {
        return this.StepNbToString() + " " + message;
    }

    private StepNbToString(): string {
        return `(${this._stepNb}/${this._totalNbSteps})`;
    }
}

export { AbstractConversation };