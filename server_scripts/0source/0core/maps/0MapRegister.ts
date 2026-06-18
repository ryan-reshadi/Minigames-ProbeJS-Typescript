abstract class MapRegister {
    private pastePoint: Point;
    private structureName: string;
    private xDim: number;
    private yDim: number
    private zDim: number
    private idealTime: number;
    public constructor(pastePos: Point, path: string, xDim:number, yDim:number, zDim:number) {
        this.pastePoint = pastePos;
        this.structureName = path;
        this.xDim = xDim;
        this.yDim = yDim;
        this.zDim = zDim;
    }
    private setIdealTime(time:number){
        
    }
    public pasteStructure(server: Internal.MinecraftServer): void {
        server.runCommandSilent("place template " + this.structureName + "");
    }

    public abstract teleportPlayers(server: Internal.MinecraftServer): void;

}