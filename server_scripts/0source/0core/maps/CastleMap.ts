class CastleMap extends AmongUsMap {

    constructor() {
        super(new Point(19, -60, -114), "pvpdreadlord:castle", new Point(104, -58, -38), [new Point(101, -59, -38), new Point(101, -59, -38)]);
    }
    public teleportPlayers(server: Internal.MinecraftServer): void {
        server.runCommand("/spreadplayers 104.15 -30.62 10 40 under -60 false @a[team=Alive]");
    }
    public meetingRoomTp(players: Internal.Player[]): void {
        this.meetingPoint.tpPlayers(players)
    }
}