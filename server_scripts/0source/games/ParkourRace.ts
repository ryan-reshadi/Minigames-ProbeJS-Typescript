class ParkourRace extends Game<ParkourRaceMap> {

    public constructor() {
        super("Parkour Race", true, false, false, false);
    }
    public override start() {
        // super.start();
        this.command("say Parkour Race has started!");
        this.command("gamerule keepInventory true");
        this.command("gamerule doMobSpawning false");
        this.command("gamerule doDaylightCycle false");
        this.command("gamerule doWeatherCycle false");
        this.command("gamerule doEntityDrops false");
        this.command("spawnpoint @a[team!=Spectator] " + this.map?.getStartPoint().toString());
        this.command("/attribute @s feathers:feathers.max_feathers base set 0")
        this.command("/attribute @s feathers:feathers.max_feathers base set 20")
        this.command("/attribute @s feathers:feathers.feather_regen base set 50")
        this.addTimer(new Timer(20, () => {
            this.command("/attribute @s feathers:feathers.feather_regen base set 1")
        }));
    }

    public override tick() {
        super.tick();
        
    }

    public override end() {
        super.end();
        this.command("/attribute @s feathers:feathers.max_feathers base set 20")
        this.command("/attribute @s feathers:feathers.feather_regen base set 50")
        this.addTimer(new Timer(20, () => {
            this.command("/attribute @s feathers:feathers.feather_regen base set 1")
        }));
        
    }
    public playerInteractEntity(event: any): void {

    }
    public checkEndGame(): boolean {
        return false;
    }
    public onPlayerDeath(player: Internal.Player): void {

    }
    
    public processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {

    }
    public processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void {

    }

    public itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        if ((event.item.id as string) == "simplyswords:ribboncleaver") {
            event.player.setMainHandItem(Item.of('minecraft:air'))
            // if((event.player.getMainHandItem().getItem() as string) == "simplyswords:ribboncleaver") {
            // }else if((event.player.getOffHandItem().getItem() as string) == "simplyswords:ribboncleaver") {
            //     event.player.setOffHandItem(Item.of('minecraft:air'))
            // }   
        }
    }
}