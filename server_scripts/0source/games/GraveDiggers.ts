class GraveDiggers extends Game<MapRegister> {
    private readonly keptItems: string[] = ["supplementaries:wind_vane", "minecraft:end_crystal", "minecraft:oak_sign"];
    public constructor() {
        super("gravediggers", true, false, true, true);
    }
    public override start() {
        this.command("gamerule keepInventory true");
    }
    public override tick() {
        super.tick();
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
    public testMethod() {
        this.server.tell("flag numbuh 2");
    }
}