class Dummy extends Game<MapRegister> {
    protected processDroppedItem(itemID: string, droppingPlayer: Internal.Player): boolean {

    }
    public checkEndGame(): boolean {
        return false;
    }
    public constructor() {
        super("dummy", true, true, true);
    }
    public playerAttackPlayer(event: Internal.Event): void {

    }
    public playerInteractPlayer(event: KubeEvent<typeof ItemEvents.entityInteracted>): void {

    }
    public pasteMap(): void {

    }
    public playerInteractEntity(event: any): void {

    }
    public override start(): void {

    }
    public override tick(): void {
        super.tick();
    }

    public override end(): void {

    }

    public override onPlayerDeath(player: Internal.Player): void {

    }

    public override onPlayerJoin(event: any): void {

    }

}