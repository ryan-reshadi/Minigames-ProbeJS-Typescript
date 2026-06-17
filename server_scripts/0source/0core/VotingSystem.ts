class VotingSystem {
    //key: voting player, value: voted object
    private votes: Map<string, string>;
    private active: boolean = false;
    private activeTimer: Timer | null = null;
    constructor() {
        this.votes = new Map<string, string>();
    }

    public vote(voter: Internal.Player, votee: string): void {
        if (this.active) {
            this.votes.set(voter.username, votee);
            voter.tell("Voted for " + votee + "...")
        }
        else {
            voter.tell("Voting hasn't opened yet");
        }
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

    public tick(): void {
        if (this.activeTimer) {
            this.activeTimer.tick();
        }
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

    public enable(): void {
        this.active = true;
    }

    public disable(extraCode: () => void = () => { }): void {
        this.active = false;
        extraCode();
        this.activeTimer = null;
    }

    public isActive(): boolean {
        return this.active;
    }

    public setActive(activator: boolean) {
        this.active = activator;
    }
    public setActiveFor(activeTicks: number, extraCode: () => void = () => { }) {
        this.enable()
        console.log("started");
        this.activeTimer = new Timer(activeTicks, () => {
            console.log("ended");
            this.disable();
            extraCode();
        })
    }
}