class HungerRace extends Game<HungerRaceMap> {

    public constructor(teamsOn: boolean = false) {
        super("Hunger Race", true, false, false, false);

    }
    public override start() {
        super.start();
        this.command("gamerule keepInventory true");
        this.command("gamerule doMobSpawning false");
        this.command("gamerule doDaylightCycle false");
        this.command("gamerule doWeatherCycle false");
        this.command("gamerule doEntityDrops false");
        this.command("spawnpoint @a[team!=Spectator] " + this.map?.getStartPoint().toString());
        this.command("/execute as @a run attribute @s feathers:feathers.max_feathers base set 0")
        this.command("gamerule naturalRegeneration false")
        // this.command("/execute as @a run attribute @s feathers:feathers.max_feathers base set 20")
        // this.command("/execute as @a run attribute @s feathers:feathers.feather_regen base set 50")
        
        // this.addTimer(new Timer(20, () => {
        //     this.command("/execute as @a run attribute @s feathers:feathers.feather_regen base set 1")
        // }));
    }

    public override tick() {
        super.tick();

    }

    public override end() {
        super.end();
        this.command("/execute as @a run attribute @s feathers:feathers.max_feathers base set 20")
        this.command("/execute as @a run attribute @s feathers:feathers.feather_regen base set 50")
        this.addTimer(new Timer(20, () => {
            this.command("/execute as @a run attribute @s feathers:feathers.feather_regen base set 1")
        }));

    }
    public playerInteractEntity(event: any): void {

    }
    public checkEndGame(): boolean {
        return false;
    }
    public onPlayerDeath(player: Internal.Player): void {
        this.command("/team join Dead " + player.username)

    }

    public processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {

    }
    public processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void {

    }

    public itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        
    }

    public getMedicineItemID(name: string): string {
        switch (name) {
            case "Medicine Bottle":
                return `minecraft:potion{CustomPotionEffects:[{Id:10,Amplifier:0,Duration:200}],display:{Name:'{"text":"Medicine Bottle"}'}}`
            case "Potent Medicine Bottle":
                return `minecraft:potion{CustomPotionEffects:[{Id:10,Amplifier:1,Duration:130}],display:{Name:'{"text":"Potent Medicine Bottle"}'}}`
            case "Burst Medicine Bottle":
                return `minecraft:splash_potion{CustomPotionEffects:[{Id:10,Amplifier:0,Duration:200}],display:{Name:'{"text":"Burst Medicine Bottle"}'}}`
        }
        return `/give @s minecraft:potion{CustomPotionEffects:[{Id:10,Amplifier:0,Duration:200}],display:{Name:'{"text":"Medicine Bottle"}'}} 1`
    }
}