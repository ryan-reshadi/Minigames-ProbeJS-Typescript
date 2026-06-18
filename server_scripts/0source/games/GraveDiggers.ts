class GraveDiggers extends Game<MapRegister> {
    private readonly keptItems: string[] = [];
    public constructor() {
        super("gravediggers", true, false, true, true);
    }
    public override start() {
        this.command("gamerule keepinventory true");
    }
    public override tick() {

    }
    public override checkEndGame(): boolean {
        return false;
    }
    public override playerInteractEntity(event: any): void {

    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {

    }

    public override onPlayerDeath(player: Internal.Player): void {
        this.filterItems(player, this.keptItems)
    }

    public override processDroppedItem(itemID: string, droppingPlayer: Internal.Player): boolean {
        return false;
    }
}