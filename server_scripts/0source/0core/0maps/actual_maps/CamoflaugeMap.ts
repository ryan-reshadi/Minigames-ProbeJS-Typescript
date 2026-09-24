/**
 * Camoflauge map.
 *
 * All points are derived from a single BASE POINT via transformation offsets.
 * Change the basePoint coordinates to move the entire layout.
 */
class CamoflaugeMap extends MapRegister {
    // ============================================================
    // BASE POINT
    // Fill in your values here. All other points are derived from
    // this base point via transformations (offsets).
    // ============================================================
    public readonly basePoint: Point;

    // Derived points — computed from basePoint in the constructor
    public readonly seekerSpawnPoint: Point;
    public readonly hiderSpawnCenter: Point;
    public readonly waitingRoomPoint: Point;

    private readonly spreadRadius: number = 10;

    constructor() {
        // pastePos, structure ID, X size, Y size, Z size, ideal time
        super(new Point(0, 64, 0), "camoflauge:arena", 200, 100, 200);

        // === BASE POINT ===
        // Change these coordinates to move the entire map layout.
        // All derived points are computed as offsets from this point.
        this.basePoint = new Point(0, 64, 0);

        // === DERIVED POINTS ===
        // Each point is basePoint + a transformation offset.
        this.seekerSpawnPoint = new Point(
            this.basePoint.x + 10,  // offset east
            this.basePoint.y,       // same level
            this.basePoint.z        // same depth
        );
        this.hiderSpawnCenter = new Point(
            this.basePoint.x - 10,  // offset west
            this.basePoint.y,       // same level
            this.basePoint.z        // same depth
        );
        this.waitingRoomPoint = new Point(
            this.basePoint.x,       // same x
            this.basePoint.y + 5,   // offset up
            this.basePoint.z + 20   // offset north
        );
    }

    public getStartPoint(): Point {
        return this.waitingRoomPoint;
    }

    public teleportPlayers(server: Internal.MinecraftServer): void {
        // Scatter all hiders around the hider spawn center
        server.runCommandSilent("spreadplayers " +
            this.hiderSpawnCenter.x + " " +
            this.hiderSpawnCenter.z + " " +
            "2 " + this.spreadRadius + " false @a[team=Hider]");
    }
}