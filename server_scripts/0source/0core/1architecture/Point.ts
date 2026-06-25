class Point {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public placeBlock(blockID: string, server: Internal.MinecraftServer, ensureAir: boolean = true): void {
        if (ensureAir) {
            server.runCommandSilent("setblock " + this.toString() + " " + blockID + " keep");
        }
        else {
            server.runCommandSilent("setblock " + this.toString() + " " + blockID);
        }
    }
    public toString(): string {
        return this.x + " " + this.y + " " + this.z;
    }

    public tpPlayers(players: Internal.Player[]) {
        const server = players[0].server;
        for (var player of players) {
            server.runCommandSilent("tp " + player.username + " " + this.toString());
        }
    }
}