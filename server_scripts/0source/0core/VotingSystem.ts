class VotingSystem {
    //key: voting player, value: voted object
    private votes: Map<string, string>;
    private active:boolean = false;
    constructor() {
        this.votes = new Map<string, string>();
    }

    public vote(voter: string, votee: string): void {
        this.votes.set(voter, votee);
    }

    public findMostVoted(): string {
        const voteCounts: Map<string, number> = new Map<string, number>();
        this.votes.forEach((votee) => {
            voteCounts.set(votee, (voteCounts.get(votee) || 0) + 1);
        });
        let mostVoted = '';
        let maxVotes = 0;
        voteCounts.forEach((count, player) => {
            if (count > maxVotes) {
                maxVotes = count;
                mostVoted = player;
            }
        });
        return mostVoted;
    }

    public resetVotes(): void {
        this.votes.clear();
    }

    public repealVote(voter: string): void {
        this.votes.delete(voter);
    }

    public removeVotesFor(votee: string): void {
        this.votes.forEach((v, k) => {
            if (v === votee) {
                this.votes.delete(k);
            }
        });
    }

    public enable():void{
        this.active = true;
    }

    public disable():void {
        this.active = false;
    }

    public isActive():boolean {
        return this.active;
    }

    public setActive(activator:boolean){
        this.active = activator;
    }
}