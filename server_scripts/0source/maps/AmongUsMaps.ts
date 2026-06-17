abstract class AmongUsMap extends MapRegister{
    protected meetingPoint:Point;
    protected meetingBlockOffs:Point[]=[];

    public constructor(x: number, y: number, z: number, path: string,meetingPoint:Point, meetingBlockOffs:Point[]){
        super(x, y ,z, path);
        this.meetingPoint = meetingPoint;
        this.meetingBlockOffs = meetingBlockOffs;
    }

    public summonToMeeting(players: Internal.Player[]){
        players[0].server.runCommandSilent("tp @a[team=Alive] "+this.meetingPoint.toString());
    }
}