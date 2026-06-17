abstract class MapRegister {
    private pasteX: number;
    private pasteY: number;
    private pasteZ: number;
    private structureName: string;
    public constructor(x: number, y: number, z: number, path: string) {
        this.pasteX = x;
        this.pasteY = y;
        this.pasteZ = z;
        this.structureName = path;
    }

    public pasteStructure(server: Internal.MinecraftServer): void {
        server.runCommandSilent("place template " + this.structureName + "");
    }

    public abstract teleportPlayers(players: Internal.Player[], server: Internal.MinecraftServer): void;

}