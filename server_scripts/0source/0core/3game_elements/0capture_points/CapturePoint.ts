abstract class CapturePoint {
    private center: Point;
    private radius: number;
    private captureType: CaptureType;
    private currentHolder: string | null = null;
    private currentProgress: number = 0;
    private totalStorage: number;
    private decreaseWhenAlone: boolean = false;
    private secure:boolean = false;
    public constructor(centerPoint: Point, radius: number, capType: CaptureType, totalCapacity: number) {
        this.center = centerPoint;
        this.radius = radius;
        this.captureType = capType;
        this.totalStorage = totalCapacity;
    }
    public tick(server: Internal.MinecraftServer): void {
        const contestingGroups: Map<string, number> = this.getContestingGroupAmounts(server.players);
        if (this.currentProgress == this.totalStorage){
            this.onCapture(server);
            return;
        }
        if (contestingGroups.size == 1) {
            if (this.currentProgress == 0){
                this.currentHolder = null;
            }
            if (contestingGroups.keys().next().value == this.currentHolder && !this.secure) {
                this.currentProgress++;
            }
            else {
                this.currentProgress--;
            }
        }
        else {
            if (contestingGroups.size == 0 && this.decreaseWhenAlone){
                this.currentProgress--;
            }
        }

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