class Point{
    public x:number;
    public y:number;
    public z:number;
    constructor(x:number, y:number, z:number){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public placeBlock(blockID:string, server:Internal.MinecraftServer):void{

    }
    public toString():string{
        return this.x + " " + this.y + " " + this.z;
    }
}