class HideAndSeekMap extends MapRegister {
    public waitingRoomPoint: Point;
    public arenaCenter: Point;
    private spreadDistance: number;

    constructor() {
        // pastePos, structure name, dims, waiting room, arena center
        super(new Point(0, 0, 0), "hns:arena", 200, 100, 200);
        this.waitingRoomPoint = new Point(0, 64, 0);
        this.arenaCenter = new Point(0, 64, 0);
        this.spreadDistance = 10;
    }

    public teleportPlayers(server: Internal.MinecraftServer): void {
        // Scatter all hiders around the arena center
        const x = this.arenaCenter.x;
        const z = this.arenaCenter.z;
        server.runCommandSilent("spreadplayers " + x + " " + z + " 2 " + this.spreadDistance + " false @a[team=Hider]");
    }
}
