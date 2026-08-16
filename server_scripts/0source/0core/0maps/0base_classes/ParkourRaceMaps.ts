abstract class ParkourRaceMap extends MapRegister {
    protected startPoint: Point;
    protected endPoint: Point;
    public constructor(pastePos: Point, path: string, xDim:number, yDim:number, zDim:number, startPoint: Point, endPoint: Point) {
        super(pastePos, path, xDim, yDim, zDim);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    public getStartPoint(): Point {
        return this.startPoint;
    }

    public getEndPoint(): Point {
        return this.endPoint;
    }  
}