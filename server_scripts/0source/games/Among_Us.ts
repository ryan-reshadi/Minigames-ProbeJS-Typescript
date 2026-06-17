class AmongUs extends Game {
    private roles: Role[] = [new ImpostorRole(1, 20)];
    private killSafe:boolean = false;
    public constructor() {
        super(false, false);
        this.currentVoting = new VotingSystem();
    }

    public override playerInteractEntity(event: any): void {
        if (event.target.type == "corpse:corpse") {
            this.reportBody(event.player, event.target);
        }
    }



    public override start(): void {
        this.resetTags();
        this.command("team join Alive @a[team=!Spectator]")
        this.command("team join Alive @a[team=Dead]")
        this.command("gamemode adventure @a[team=Alive]");
        this.roles.forEach((role: Role) => {
            role.assignToRandomPlayers(this.playersOnTeam("Alive"), []);
        })

    }

    public override tick(): void {
        super.tick();
        for (var role of this.roles) {
            role.tick(this.server);
        }
    }

    public end(): void {

    }
    public onPlayerDeath(player: Internal.Player): void {
        this.command("team join Dead " + player.username);
    }
    private registerMeeting(caller: Internal.Player): void {

        const deadPlayers = this.removeCorpses();
        this.server.tell("Unfortunately, " + deadPlayers + " died during the round :(");
        this.currentVoting?.enable();
    }



    private reportBody(caller: Internal.Player, body: Internal.Entity): void {
        this.server.tell(caller.username + " has found the body of " + this.corpseName(body) + "!");
        this.registerMeeting(caller);
    }

    private teleportPlayersToMeetingRoom() {

    }

    public playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        const attacker = (event.source.getImmediate() as Internal.Player)
        const victim = (event.entity as Internal.Player);
        const attackerRoleId = attacker.getTags()[0];
        for (var role of this.roles){
            if (role.getID() == attackerRoleId){
                role.leftClickPlayer([attacker,victim, this.killSafe]);
            }
        }
        event.cancel();
    }

    public playerInteractPlayer(event: KubeEvent<typeof ItemEvents.entityInteracted>): void {

    }

    public playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {
        if (!event.entity.getTags().contains("kill")) {
            event.cancel()
        }
    }

    public pasteMap(): void {

    }

    private tellVillagers() {

    }
}