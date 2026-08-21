class HideAndSeek extends Game<HideAndSeekMap> {
    private hidingSeconds: number = 30;
    private seekingSeconds: number = 180;
    private hidingRemaining: number = 0;
    private seekingRemaining: number = 0;
    private initialSeeker: Internal.Player | null = null;
    private hidingUpdateTimer: Timer | null = null;
    private seekingUpdateTimer: Timer | null = null;
    private lightningAbility: Ability;
    private gameOver: boolean = false;

    public constructor() {
        super("hide_and_seek", false, false, false, true);
        this.setMap(new HideAndSeekMap());
        this.lightningAbility = new Ability("lightning", 60 * 20, () => {
            this.command("effect give @a[team=Hider] minecraft:glowing 10 0 true");
            this.server.tell("Seeker activated lightning rod: Hiders glowing for 10s");
        });
    }

    public playerInteractEntity(event: any): void { }

    public override start(): void {
        super.start();
        this.gameOver = false;
        this.resetTags();

        // gather non-spectator players
        const candidates: Internal.Player[] = [];
        for (var p of this.server.players) {
            if (p.getTeamId() !== "Spectator") candidates.push(p);
        }
        if (candidates.length === 0) return;

        // choose initial seeker
        const idx = Math.floor(Math.random() * candidates.length);
        this.initialSeeker = candidates[idx];

        // assign teams and kits
        for (var player of candidates) {
            if (player.username === this.initialSeeker.username) {
                this.command("team join Seeker " + player.username);
                this.command("/loadinventory seeker " + player.username);
                // give lightning rod to initial seeker
                this.command("/give " + player.username + " minecraft:lightning_rod");
                // teleport seeker to waiting room
                this.command("tp " + player.username + " " + (this.map?.waitingRoomPoint.toString() ?? "0 64 0"));
            } else {
                this.command("team join Hider " + player.username);
                this.command("/loadinventory hider " + player.username);
            }
        }

        // teleport hiders into arena and give short blindness/slowness
        this.map?.teleportPlayers(this.server);
        this.command("effect give @a[team=Hider] minecraft:blindness 1 0 true");
        this.command("effect give @a[team=Hider] minecraft:slowness 1 0 true");

        // setup hiding bossbar and timers
        this.command("bossbar add hns:hiding \"Hiding Time\"");
        this.hidingRemaining = this.hidingSeconds;
        this.command("bossbar set hns:hiding max " + this.hidingSeconds);
        this.command("bossbar set hns:hiding value " + this.hidingRemaining);
        this.command("bossbar set hns:hiding players @a[team=Hider]");

        // update every second
        this.hidingUpdateTimer = new Timer(20, () => {
            this.hidingRemaining--;
            this.command("bossbar set hns:hiding value " + Math.max(0, this.hidingRemaining));
        }, true);
        this.addTimer(this.hidingUpdateTimer);

        // finish hiding after full duration
        this.addTimer(new Timer(this.hidingSeconds * 20, () => { this.finishHidingPhase() }, false));
    }

    private finishHidingPhase(): void {
        // remove hiding bossbar
        this.command("bossbar remove hns:hiding");

        // move initial seeker into arena center
        if (this.initialSeeker) {
            this.command("tp " + this.initialSeeker.username + " " + (this.map?.arenaCenter.toString() ?? "0 64 0"));
        }

        // start seeking phase bossbar
        this.command("bossbar add hns:seeking \"Seeking Time\"");
        this.seekingRemaining = this.seekingSeconds;
        this.command("bossbar set hns:seeking max " + this.seekingSeconds);
        this.command("bossbar set hns:seeking value " + this.seekingRemaining);
        this.command("bossbar set hns:seeking players @a[team=Seeker]");

        this.seekingUpdateTimer = new Timer(20, () => {
            this.seekingRemaining--;
            this.command("bossbar set hns:seeking value " + Math.max(0, this.seekingRemaining));
        }, true);
        this.addTimer(this.seekingUpdateTimer);

        this.addTimer(new Timer(this.seekingSeconds * 20, () => { this.finishSeekingPhase() }, false));
    }

    private finishSeekingPhase(): void {
        // if hiders remain they win, otherwise seekers win
        const hiders = this.playersOnTeam("Hider").length;
        if (hiders > 0) {
            this.server.tell("Hiders win with " + hiders + " remaining!");
        } else {
            this.server.tell("Seekers win!");
        }
        this.command("bossbar remove hns:seeking");
        this.gameOver = true;
        // move everyone to Lobby
        this.command("team join Lobby @a");
    }

    public checkEndGame(): boolean {
        if (this.gameOver) return true;
        // seekers win if no hiders remain
        if (this.playersOnTeam("Hider").length === 0 && this.playersOnTeam("Seeker").length > 0) {
            this.server.tell("Seekers have found all hiders!");
            this.command("team join Lobby @a");
            return true;
        }
        return false;
    }

    public onPlayerDeath(player: Internal.Player): void {
        // convert to seeker, give seeker kit (no lightning rod)
        if (player.getTeamId() !== "Spectator") {
            this.command("team join Seeker " + player.username);
            this.command("/loadinventory seeker " + player.username);
            this.server.tell(player.username + " is now a seeker!");
        }
    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // allow PvP between players
        const attacker = (event.source.getImmediate() as Internal.Player)
        const victim = (event.entity as Internal.Player);
        // default behavior: allow attack and do nothing special
    }

    public override playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // cancel non-player damage
        if (!event.source.getImmediate() || (event.source.getImmediate()).type !== "minecraft:player") {
            event.cancel();
        }
    }

    public processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void { }
    public processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void { }

    public itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        if ((event.item.id as string) === "minecraft:lightning_rod") {
            // only seekers with the rod can use it
            if (event.player.getTeamId() === "Seeker") {
                this.lightningAbility.activate();
            }
        }
    }
}
