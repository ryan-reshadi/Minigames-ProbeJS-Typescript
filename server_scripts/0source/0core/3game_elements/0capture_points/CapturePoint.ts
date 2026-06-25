abstract class CapturePoint {
    private center: Point;
    private radius: number;
    private captureType:CaptureType;
    private currentHolder:string|null = null;
    private currentProgress: number = 0;
    private totalStorage:number;
    public constructor(centerPoint: Point, radius: number, capType: CaptureType, totalCapacity:number) {
        this.center = centerPoint;
        this.radius = radius;
        this.captureType = capType;
        this.totalStorage = totalCapacity;
    }
    public tick(players:Internal.Player[]):void {
        const contestingPlayers:Internal.Player[] = this.getContestingPlayers(players);
        switch(this.captureType){
            case CaptureType.Teams:
                for (let player of contestingPlayers){
                    if (this.checkPlayerInRange(player)){
                        
                    }
                }
                break;
        }
    }
    public abstract checkPlayerInRange(player: Internal.Player):boolean;
    public getContestingPlayers(players:Internal.Player[]):Internal.Player[]{
        let returnArr = [];
        for (let player of players){
            if (this.checkPlayerInRange(player)){
                returnArr.push(player);
            }
        }
        return returnArr;
    }
    public abstract getGroupAmounts(players:Internal.Player[]):Map<string, number>;

    public abstract onCapture(server:Internal.MinecraftServer):void;
}

enum CaptureType {
    Teams,
    Individual,
    Tag
}