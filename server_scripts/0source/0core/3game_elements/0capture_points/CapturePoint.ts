abstract class CapturePoint {
    private center: Point;
    private radius: number;
    private captureType: CaptureType;

    // Team/player that fully owns the point
    private owner: string | null = null;

    // Team/player that the current progress belongs to
    private progressOwner: string | null = null;

    // Current capture progress
    private progress: number = 0;

    private readonly totalStorage: number;

    protected decreaseWhenAlone: boolean = false;

    public constructor(
        centerPoint: Point,
        radius: number,
        capType: CaptureType,
        totalCapacity: number
    ) {
        this.center = centerPoint;
        this.radius = radius;
        this.captureType = capType;
        this.totalStorage = totalCapacity;
    }

    public tick(server: Internal.MinecraftServer): void {
        this.draw(server);

        const contestingGroups = this.getContestingGroupAmounts(server.players);

        // Nobody is on the point
        if (contestingGroups.size === 0) {
            this.handleEmptyPoint();
            return;
        }

        // Multiple groups are on the point -> contested
        if (contestingGroups.size > 1) {
            return;
        }

        const [group, playerCount] =
            contestingGroups.entries().next().value as [string, number];

        const captureSpeed = Math.max(1, playerCount);

        // Completely neutral point
        if (this.owner === null && this.progressOwner === null) {
            this.progressOwner = group;
            this.changeProgress(captureSpeed);

            this.checkCaptureComplete(server);
            return;
        }

        // Reinforcing existing progress
        if (group === this.progressOwner) {
            this.changeProgress(captureSpeed);

            this.checkCaptureComplete(server);
            return;
        }

        // Attacking another group's progress
        this.changeProgress(-captureSpeed);

        if (this.progress === 0) {
            // Point is neutralized
            this.owner = null;
            this.progressOwner = group;

            // Immediately begin capturing for attacker
            this.changeProgress(captureSpeed);

            this.checkCaptureComplete(server);
        }
    }

    private handleEmptyPoint(): void {
        if (!this.decreaseWhenAlone) {
            return;
        }

        this.changeProgress(-1);

        if (this.progress === 0) {
            this.owner = null;
            this.progressOwner = null;
        }
    }

    private checkCaptureComplete(server: Internal.MinecraftServer): void {
        if (this.progress < this.totalStorage) {
            return;
        }

        this.progress = this.totalStorage;
        this.owner = this.progressOwner;

        this.onCapture(server);
    }

    protected changeProgress(amount: number): void {
        this.progress = Math.max(
            0,
            Math.min(this.totalStorage, this.progress + amount)
        );
    }

    public draw(server: Internal.MinecraftServer): void {
        const points = this.getCirclePerimeterPoints();

        for (const point of points) {
            this.displayParticle(server, point, "minecraft:flame");
        }
    }

    private displayParticle(
        server: Internal.MinecraftServer,
        point: Point,
        particleType: string
    ): void {
        server.runCommandSilent(
            `particle ${particleType} ${point.x} ${point.y} ${point.z} 0 0 0 0 1 force`
        );
    }

    protected getPointsInsideCircle(): Point[] {
        const points: Point[] = [];

        for (
            let x = this.center.x - this.radius;
            x <= this.center.x + this.radius;
            x++
        ) {
            for (
                let z = this.center.z - this.radius;
                z <= this.center.z + this.radius;
                z++
            ) {
                const dx = x - this.center.x;
                const dz = z - this.center.z;

                if (dx * dx + dz * dz <= this.radius * this.radius) {
                    points.push(new Point(x, this.center.y, z));
                }
            }
        }

        return points;
    }

    private getCirclePerimeterPoints(): Point[] {
        const points: Point[] = [];
        const seen = new Set<string>();

        const addPoint = (x: number, z: number): void => {
            const worldX = this.center.x + x;
            const worldZ = this.center.z + z;

            const key = `${worldX},${worldZ}`;

            if (!seen.has(key)) {
                seen.add(key);
                points.push(new Point(worldX, this.center.y, worldZ));
            }
        };

        const addSymmetricPoints = (x: number, z: number): void => {
            addPoint(x, z);
            addPoint(-x, z);
            addPoint(x, -z);
            addPoint(-x, -z);

            addPoint(z, x);
            addPoint(-z, x);
            addPoint(z, -x);
            addPoint(-z, -x);
        };

        let x = this.radius;
        let z = 0;
        let decision = 1 - this.radius;

        while (x >= z) {
            addSymmetricPoints(x, z);

            z++;

            if (decision < 0) {
                decision += 2 * z + 1;
            } else {
                x--;
                decision += 2 * (z - x) + 1;
            }
        }

        return points;
    }

    public getContestingPlayers(
        players: Internal.Player[]
    ): Internal.Player[] {
        const result: Internal.Player[] = [];

        for (const player of players) {
            if (this.checkPlayerInRange(player)) {
                result.push(player);
            }
        }

        return result;
    }

    protected getOwner(): string | null {
        return this.owner;
    }

    protected getProgressOwner(): string | null {
        return this.progressOwner;
    }

    protected getProgress(): number {
        return this.progress;
    }

    protected getCapturePercent(): number {
        return (this.progress / this.totalStorage) * 100;
    }

    protected isCaptured(): boolean {
        return (
            this.owner !== null &&
            this.owner === this.progressOwner &&
            this.progress === this.totalStorage
        );
    }

    protected getCenter(): Point {
        return this.center;
    }

    protected getRadius(): number {
        return this.radius;
    }

    protected getCaptureType(): CaptureType {
        return this.captureType;
    }

    public abstract checkPlayerInRange(
        player: Internal.Player
    ): boolean;

    public abstract getContestingGroupAmounts(
        players: Internal.Player[]
    ): Map<string, number>;

    public abstract onCapture(
        server: Internal.MinecraftServer
    ): void;
}

enum CaptureType {
    Teams,
    Individual,
    Tag
}