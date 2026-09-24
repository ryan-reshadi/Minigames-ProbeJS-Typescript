class Dummy extends Game<MapRegister> {
    
    public constructor() {
        super("dummy", true, true, false, false);
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

    public processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {
        // The idle game does not change block-breaking behavior.
    }
    public processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void {
        // The idle game does not change block-placing behavior.
    }
    public itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        // The idle game does not change item-use behavior.
    }
    
    public checkEndGame(): boolean {
        return false;
    }

}