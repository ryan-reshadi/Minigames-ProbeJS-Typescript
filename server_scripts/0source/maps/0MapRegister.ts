abstract class MapRegister {
    private pastePoint: Point;
    private structureName: string;
    public constructor(x: number, y: number, z: number, path: string) {
        this.pastePoint = new Point(x, y, z);
        this.structureName = path;
    }

    public pasteStructure(server: Internal.MinecraftServer): void {
        server.runCommandSilent("place template " + this.structureName + "");
    }

    public abstract teleportPlayers(players: Internal.Player[], server: Internal.MinecraftServer): void;

}