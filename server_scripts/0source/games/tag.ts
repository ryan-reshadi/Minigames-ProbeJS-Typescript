class Tag extends Game<MapRegister> {

    public constructor(parcoolActive: boolean) {
        super("tag", false, false, parcoolActive);
    }

    protected processDroppedItem(itemID: string, droppingPlayer: Internal.Player): boolean {
        return false;
    }
    public playerInteractEntity(event: any): void {
    }

    public start(): void {
        this.command("team join Alive @a[team=!Spectator]")
        this.command("tag @a remove tagger");
        this.command("gamemode adventure @a[team=Alive]");
        this.command("/kill @e[type=minecraft:item]");
        this.command("/tag @r[team=!Spectator] add tagger")
        this.command(`/title @a[tag=tagger] title "You are the tagger" `);
        var taggerTime: number = this.playersOnTeam("Alive").length * 30;
        this.addTimer(new Timer(taggerTime * 20, () => {
            this.command("/tag @a[tag=tagger] add kill")
            this.command("/tag @a[tag=tagger] remove tagger")
            this.command("/tag @r[team=Alive] add tagger")
            this.command(`/title @a[tag=tagger] title "You are the tagger" `)
            this.server.tell("The tagger died!");
        }, true))
    }
    public checkEndGame(): boolean {
        if (this.playersOnTeam("Alive").length === 1) {
            return true
        } else {
            return false
        }
    }
    public override end() {
        this.command(`/title @a title "` + this.playersOnTeam("Alive")[0].username + ` won the game!!!"`);
    }
    public onPlayerDeath(player: Internal.Player): void {
        this.command("/team join Lobby " + player.username)
        this.server.tell(player.username + " died!")
    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        const attacker = (event.source.getImmediate() as Internal.Player)
        const victim = (event.entity as Internal.Player);

        if (this.playerHasTag(attacker, "tagger") === true && victim.teamId == "Alive" && attacker.teamId == "Alive") {
            this.command("/tag " + attacker.username + " remove tagger")
            this.command("/tag " + victim.username + " add tagger")
            this.command(`/title @a[tag=tagger] actionbar "You are the tagger" `)
            this.server.tell(victim.username + " is the tagger now.")
        }
        event.cancel();
    }

    public override playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {
        if (!event.entity.getTags().contains("kill")) {
            event.cancel()
        }
    }
}

