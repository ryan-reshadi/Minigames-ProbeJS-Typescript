abstract class AmongUsMap extends MapRegister {
    protected meetingPoint: Point;
    protected meetingBlockOffs: Point[] = [];

    public constructor(pastePos: Point, path: string, meetingPoint: Point, meetingBlockOffs: Point[]) {
        super(pastePos, path);
        this.meetingPoint = meetingPoint;
        this.meetingBlockOffs = meetingBlockOffs;
    }

    public summonToMeeting(server: Internal.MinecraftServer) {
        this.fillBlockOff("minecraft:oak_planks", server);
        server.runCommandSilent("tp @a[team=Alive] " + this.meetingPoint.toString());
    }

    public releaseMeeting(server: Internal.MinecraftServer) {
        this.fillBlockOff("minecraft:air",server);
    }

    public fillBlockOff(blockID: string, server: Internal.MinecraftServer): void {
        for (var point of this.meetingBlockOffs) {
            point.placeBlock(blockID, server, true);
        }
    }
}