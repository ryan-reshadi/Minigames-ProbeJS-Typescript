abstract class CapturePoint {
    private center: Point;
    private radius: number;
    private captureType: CaptureType;
    private currentHolder: string | null = null;
    private currentProgress: number = 0;
    private totalStorage: number;
    private decreaseWhenAlone: boolean = false;
    private secure: boolean = false;
    public constructor(centerPoint: Point, radius: number, capType: CaptureType, totalCapacity: number) {
        this.center = centerPoint;
        this.radius = radius;
        this.captureType = capType;
        this.totalStorage = totalCapacity;
    }
    public tick(server: Internal.MinecraftServer): void {
        this.draw(server);
        const contestingGroups: Map<string, number> = this.getContestingGroupAmounts(server.players);
        if (this.currentProgress == this.totalStorage) {
            this.onCapture(server);
            return;
        }
        if (contestingGroups.size == 1) {
            if (this.currentProgress == 0) {
                this.currentHolder = null;
            }
            if (contestingGroups.keys().next().value == this.currentHolder && !this.secure) {
                this.changeProgress(1);
            }
            else {
                this.changeProgress(-1);
            }
        }
        else {
            if (contestingGroups.size == 0 && this.decreaseWhenAlone) {
                this.changeProgress(-1);
            }
        }

    }
    public changeProgress(amount: number): void {
        this.currentProgress = Math.max(0, Math.min(this.totalStorage, this.currentProgress + amount));
    }
    public draw(server: Internal.MinecraftServer): void {
        let points: Point[] = this.getCirclePerimeterPoints();
        for (let point of points) {
            this.displayParticle(server, point, "minecraft:flame");
        }
    }
    private displayParticle(server: Internal.MinecraftServer, point: Point, particleType: string): void {
        server.runCommandSilent(`particle ${particleType} ${point.x} ${point.y} ${point.z} 0 0 0 0 1 force`);
    }
    private getPointsInsideCircle(): Point[] {
        let points: Point[] = [];
        for (let x = this.center.x - this.radius; x <= this.center.x + this.radius; x++) {
            for (let z = this.center.z - this.radius; z <= this.center.z + this.radius; z++) {
                const distance = Math.sqrt(Math.pow(x - this.center.x, 2) + Math.pow(z - this.center.z, 2));
                if (distance <= this.radius) {
                    points.push(new Point(x, this.center.y, z));
                }
            }
        }
        return points;
    }

    private getCirclePerimeterPoints(): Point[] {
        const points: Point[] = [];
        const seen = new Set<string>();

        const addPoint = (x: number, z: number) => {
            const worldX = this.center.x + x;
            const worldZ = this.center.z + z;

            const key = `${worldX},${worldZ}`;
            if (!seen.has(key)) {
                seen.add(key);
                points.push(new Point(worldX, this.center.y, worldZ));
            }
        };

        const addSymmetricPoints = (x: number, z: number) => {
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


    public abstract checkPlayerInRange(player: Internal.Player): boolean;
    public getContestingPlayers(players: Internal.Player[]): Internal.Player[] {
        let returnArr = [];
        for (let player of players) {
            if (this.checkPlayerInRange(player)) {
                returnArr.push(player);
            }
        }
        return returnArr;
    }
    public abstract getContestingGroupAmounts(players: Internal.Player[]): Map<string, number>;

    public abstract onCapture(server: Internal.MinecraftServer): void;
}

enum CaptureType {
    Teams,
    Individual,
    Tag
}