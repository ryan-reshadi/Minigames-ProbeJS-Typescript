class LuckyTowers extends Game<MapRegister> {
    public checkEndGame(): boolean {
        throw new Error("Method not implemented.");
    }
    public playerAttackPlayer(event: Internal.Event): void {
        throw new Error("Method not implemented.");
    }
    public playerInteractPlayer(event: KubeEvent<typeof ItemEvents.entityInteracted>): void {
        throw new Error("Method not implemented.");
    }
    public pasteMap(): void {

    }
    public playerInteractEntity(event: any): void {

    }
    private lootManager: LootTable = new LootTable();

    public start(): void {
        this.setUpLootManager();
        this.command("/team modify Alive friendlyFire true");
        this.disableBetterCombat();
        this.disableParcool();
        this.addTimer(new Timer(120, () => {
            const players = this.playersOnTeam("Alive");
            for (var player of players) {
                this.lootManager.giveRandomLoot(player, 1);
            }
        }))

    }
    public end(): void {

    }

    public override tick() {
        super.tick();
        this.removeCorpses();
        const alivePlayers = this.playersOnTeam("Alive");
        if (alivePlayers.length == 1) {
            this.server.tell("The winner is " + alivePlayers[0]);
            this.end();
            return;
        }
        else {
            if (alivePlayers.length == 0) {
                this.server.tell("There are no winners...");
            }
        }
    }

    public onPlayerDeath(player: Internal.Player): void {
        this.command("team join Dead " + player.username);
    }
    private setUpLootManager() {

    }

}