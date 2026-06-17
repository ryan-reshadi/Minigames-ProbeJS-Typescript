abstract class MapRegister {
    private pastePoint: Point;
    private structureName: string;
    public constructor(pastePos: Point, path: string) {
        this.pastePoint = pastePos;
        this.structureName = path;
    }

    public pasteStructure(server: Internal.MinecraftServer): void {
        server.runCommandSilent("place template " + this.structureName + "");
    }

    public abstract teleportPlayers(server: Internal.MinecraftServer): void;

}