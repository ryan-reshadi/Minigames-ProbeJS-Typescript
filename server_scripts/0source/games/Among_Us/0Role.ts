abstract class Role {
    private id: string = "";
    private amount: number = 0;
    protected players: Internal.Player[] = [];
    public constructor(id: string, amount: number) {
        this.id = id;
        this.amount = amount;
    }
    public getID(): string {
        return this.id;
    }
    public abstract rightClickPlayer(args: any[]): any;
    public abstract leftClickPlayer(args: any[]): any;
    public abstract crouch(args: any[]): any

    //empty array for all other roles being conflict, null for no conflicts
    public assignToRandomPlayers(players: Internal.Player[], otherRoles: Role[] | null = []) {
        var candidates: Internal.Player[] = [];
        if (otherRoles) {
            if (otherRoles.length == 0) {

                for (var player of players) {
                    if (player.getTags().length == 0) {
                        candidates.push(player);
                    }
                }
            }
            else {

                for (var player of players) {
                    var clean: boolean = true;
                    for (var role of otherRoles) {
                        if (player.getTags().contains(role)) {
                            clean = false;
                            break;
                        }
                    }
                    if (clean) {
                        candidates.push(player);
                    }
                }
            }
        }
        else {
            candidates = players;
        }
        for (var i = this.amount; i > 0; --i) {
            const player: Internal.Player = this.pickRandomPlayer(candidates);
            this.assignToPlayer(player);
            candidates = candidates.filter(x => x !== player);
        }
    }
    public assignToPlayer(player: Internal.Player) {
        player.addTag(this.id);
        this.tellPlayer(player);
        this.players.push(player);
    }
    private pickRandomPlayer(candidates: Internal.Player[]): Internal.Player {
        return candidates[Math.floor(Math.random() * candidates.length)]
    }

    public abstract tellPlayer(player: Internal.Player): void;

    public abstract tick(server: Internal.MinecraftServer): void;

    public getPlayers(): Internal.Player[] {
        return this.players;
    }
}