abstract class MapRegister {
    private pastePoint: Point;
    private structureName: string;
    private xDim: number;
    private yDim: number
    private zDim: number
    private idealTime: number;
    
    public constructor(pastePos: Point, path: string, xDim:number, yDim:number, zDim:number, idealTime:number = 1200) {
        this.pastePoint = pastePos;
        this.structureName = path;
        this.xDim = xDim;
        this.yDim = yDim;
        this.zDim = zDim;
        this.idealTime = idealTime;
    }
    private setIdealTime(time:number){
        this.idealTime = time;
    }
    public pasteStructure(server: Internal.MinecraftServer): void {
        server.runCommandSilent("place template " + this.structureName + "");
        server.runCommandSilent("time set "+this.idealTime);
    }

    public abstract teleportPlayers(server: Internal.MinecraftServer): void;

}