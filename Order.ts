class Order {
    participants: Array<Participant>;

    constructor(public title: string, participantIds: number[]) {
        var nbParticipants = participantIds.length;
        for (let i = 0; i < nbParticipants; ++i) {
            let currentParticipant = new Participant(participantIds[i]);
            this.participants.push(currentParticipant);
        }
    }
}
