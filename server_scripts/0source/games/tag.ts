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
        this.command("gamemode adventure @a[team=Alive]");
        this.command("/kill @e[type=minecraft:item]");
        this.command("/tag @r[team=!Spectator] add tagger")
        this.addTimer(new Timer(300 * 20, () => {
            this.command("/kill @a[tag=tagger]")
            this.command("/tag @r[team=Alive] add tagger")
        }, true))
    }
    public checkEndGame(): boolean {
        if (this.playersOnTeam("Alive").length === 1) {
            return true
        } else {
            return false
        }
    }
    public onPlayerDeath(player: Internal.Player): void {
        this.command("/team join Lobby " + player.username)
        this.server.tell(player.username + " died!")
    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        const attacker = (event.source.getImmediate() as Internal.Player)
        const victim = (event.entity as Internal.Player);

        if (this.playerHasTag(attacker, "tagger") === true) {
            this.command("/tag " + attacker.username + " remove tagger")
            this.command("/tag " + victim.username + " add tagger")
            this.server.tell(victim.username + " is the tagger now.")
        }
        event.cancel();
    }
}

