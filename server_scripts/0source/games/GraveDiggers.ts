class GraveDiggers extends Game<MapRegister> {
    private readonly keptItems: string[] = ["supplementaries:wind_vane", "minecraft:end_crystal", "minecraft:oak_sign"];
    private readonly vulnerableBlocks: string[] = ["minecraft:stone", "minecraft:cobblestone", "minecraft:andesite", "mossy_cobblestone", "chipped:trodden_mossy_cobblestone", "rough_mossy_cobblestone", "eroded_mossy_stone_bricks", "minecraft:diamond_ore", "minecraft:coal_ore", "minecraft:iron_ore", "minecraft:gold_ore", "minecraft:torch"]
    public constructor() {
        super("gravediggers", true, false, true, true);
    }
    public override start() {
        this.command("gamerule keepInventory true");
        this.command("//pos1 -78,25,256")
        this.command("//pos2 -28,0,156")
        this.command("//set air")
        this.command("//replace air 500%air,10%coal_ore,10%iron_ore,1%diamond_ore")
        this.command("//replace air 12.5%stone,12.5%andesite,25%cobblestone,12.5%chipped:trodden_mossy_stone_bricks,12.5%chipped:rough_mossy_cobblestone,12.5%mossy_cobblestone,12.5%chipped:eroded_mossy_stone_bricks")
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
    public override processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {
        const name = event.block.id;
        for (let block of this.vulnerableBlocks) {
            if (block == name) {
                return;
            }
        }
        event.cancel();
    }
    public override processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void {
    }
}