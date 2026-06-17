class CastleMap extends AmongUsMap {

    constructor() {
        super(new Point(4, -14, 31), "pvpdreadlord:castle", 200, 100, 200, new Point(90, 2, 107), [new Point(85, 1, 107), new Point(85, 2, 107)]);
    }
    public teleportPlayers(server: Internal.MinecraftServer): void {
        server.runCommand("/spreadplayers 104.15 -30.62 10 40 under -60 false @a[team=Alive]");
    }
    public meetingRoomTp(players: Internal.Player[]): void {
        this.meetingPoint.tpPlayers(players)
    }
}