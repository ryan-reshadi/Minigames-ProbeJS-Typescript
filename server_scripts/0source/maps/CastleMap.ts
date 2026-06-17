class CastleMap extends AmongUsMap {
    
    constructor() {
        super(19 -60 -114, "pvpdreadlord:castle", );
        this.meetingPoint = new Point();
    }
    public teleportPlayers(players: Internal.Player[], server: Internal.MinecraftServer): void {
        server.runCommand("/spreadplayers 104.15 -30.62 10 40 under -60 false @a[team=Alive]");
    }
    public meetingRoomTp(players: Internal.Player[], server: Internal.MinecraftServer):void {

    }
}