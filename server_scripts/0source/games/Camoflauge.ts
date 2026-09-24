class Camoflauge extends Game<CamoflaugeMap> {
    private gameOver: boolean = false;
    private initialSeeker: Internal.Player | null = null;
    private seekingRemaining: number = 180;

    public constructor() {
        // name, allow item dropping, allow corpses, better combat, parcool, allow dodging
        super("camoflauge", false, false, false, false);
        this.setMap(new CamoflaugeMap());
    }

    public playerInteractEntity(event: any): void {
        // No custom entity interaction behavior.
    }

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
                // teleport seeker to seeker spawn point
                this.command("tp " + player.username + " " + (this.map?.seekerSpawnPoint.toString() ?? "0 64 0"));
            } else {
                this.command("team join Hider " + player.username);
                // tag hiders for reliable tracking (in addition to team)
                this.command("tag " + player.username + " add camo_hider");
                // disguise the hider as a mob via the walkers mod
                this.command("/walkers switchShape " + player.username + " minecraft:pig");
                // give slowness 2 with particles hidden (4th arg true hides particles)
                this.command("effect give " + player.username + " minecraft:slowness 1000000 1 true");
            }
        }

        // teleport hiders into the arena and scatter them
        this.map?.teleportPlayers(this.server);

        // seeker bossbar
        this.command("bossbar add camo:seeking \"Seeking Time\"");
        this.seekingRemaining = 180;
        this.command("bossbar set camo:seeking max " + this.seekingRemaining);
        this.command("bossbar set camo:seeking value " + this.seekingRemaining);
        this.command("bossbar set camo:seeking players @a[team=Seeker]");
        this.addTimer(new Timer(20, () => {
            this.seekingRemaining--;
            if (this.seekingRemaining >= 0) {
                this.command("bossbar set camo:seeking value " + Math.max(0, this.seekingRemaining));
            }
        }, true));
        // seekers win by timeout if any hiders remain
        this.addTimer(new Timer(180 * 20, () => {
            if (this.playersOnTeam("Hider").length > 0) {
                this.server.tell("Time's up! Hiders win — seekers failed to find everyone.");
            } else {
                this.server.tell("Seekers win by timeout!");
            }
            this.command("team join Lobby @a");
            this.gameOver = true;
        }, false));
    }

    public override tick(): void {
        super.tick();
    }

    public override end(): void {
        this.command("bossbar remove camo:seeking");
        // remove any lingering slowness effects from hiders
        this.playersOnTeam("Hider").forEach((p: Internal.Player) => {
            this.command("effect clear " + p.username + " minecraft:slowness");
        });
        super.end();
    }

    public checkEndGame(): boolean {
        if (this.gameOver) return true;
        // seeker wins when no hiders remain
        if (this.playersOnTeam("Hider").length === 0 && this.playersOnTeam("Seeker").length > 0) {
            this.server.tell("Seekers win — all hiders have been found!");
            this.command("team join Lobby @a");
            return true;
        }
        return false;
    }

    public onPlayerDeath(player: Internal.Player): void {
        if (player.getTeamId() !== "Spectator") {
            // remove hider tracking tag on death so we don't count them as a mob kill
            this.command("tag " + player.username + " remove camo_hider");
            this.command("effect clear " + player.username + " minecraft:slowness");
            this.command("team join Seeker " + player.username);
            this.server.tell(player.username + " has been found — they are now a seeker!");
        }
    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // allow PvP between players
    }

    public override playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // cancel non-player damage so hiders can't die to environmental mobs
        if (!event.source.getImmediate() || (event.source.getImmediate()).type !== "minecraft:player") {
            event.cancel();
        }
    }

    public processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void { }
    public processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void { }

    public itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        // no special item abilities
    }
}