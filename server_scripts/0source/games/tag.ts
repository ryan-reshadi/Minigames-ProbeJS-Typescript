class Tag extends Game<MapRegister> {
    protected processDroppedItem(itemID: string, droppingPlayer: Internal.Player): boolean {
        throw new Error("Method not implemented.");
    }
    public playerInteractEntity(event: any): void {
        throw new Error("Method not implemented.");
    }
    
    public checkEndGame(): boolean {
        throw new Error("Method not implemented.");
    }
    public onPlayerDeath(player: Internal.Player): void {
        throw new Error("Method not implemented.");
    }

}