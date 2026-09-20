/**
 * Copy this class when creating a map for a game.
 *
 * The structure ID and dimensions are placeholders. Replace them with values
 * that exist in the active Minecraft instance before using this map in a game.
 */
class ExampleMap extends MapRegister {

    //Feel free to add extra aspects to your maps based on what game you're making; look to existing map classes for inspiration
    public readonly spawnPoint: Point;

    public constructor() {
        // paste point, structure ID, X size, Y size, Z size, ideal time
        super(new Point(0, 64, 0), "example:map", 64, 64, 64, 1200);
        this.spawnPoint = new Point(0, 65, 0);
    }

    public override teleportPlayers(server: Internal.MinecraftServer): void {
        // No default behavior. Teleporting is map-specific, so an empty
        // implementation leaves players where they are. Use commands or
        // Point.tpPlayers() here when this map is selected.
    }
}