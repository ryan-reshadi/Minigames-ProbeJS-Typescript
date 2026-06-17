abstract class Game<TMap extends MapRegister> {
    protected server!: Internal.MinecraftServer;
    protected timers: Timer[] = [];
    private betterCombat: boolean = false;
    private parcool: boolean = false;
    protected currentVoting: VotingSystem | null = null;
    protected map?: TMap;
    public constructor(betterCombat: boolean, parcool: boolean) {
        this.betterCombat = betterCombat;
        this.parcool = parcool;
    }
    public setServer(server: Internal.MinecraftServer) {
        this.server = server;
    }

    public abstract playerInteractEntity(event: any): void;

    public abstract start(): void;

    public tick(): void {
        this.timers.forEach((value: Timer) => (value.tick()));
        this.server.runCommandSilent('parcool ' + this.booleanToEnable(this.parcool));
        this.server.runCommandSilent('bctoggle ' + this.booleanToEnable(this.betterCombat));
        this.command("/kill @e[tag=kill]");
        this.command("tag @a remove kill");

    };

    public end(): void {
        this.timers.length = 0;
        this.resetTags();
    };

    public onPlayerJoin(event: any): void {
        this.server.runCommandSilent('parcool ' + this.booleanToEnable(this.parcool));
        this.server.runCommandSilent('bettercombat ' + this.booleanToEnable(this.betterCombat));
    }

    public onPlayerLeave(player: any): void { };

    public abstract onPlayerDeath(player: Internal.Player): void;

    public addTimer(timer: Timer): void {
        this.timers.push(timer);
        timer.start();
    }

    public removeInactiveCompletedTimers(): void {
        this.timers = this.timers.filter((timer) => {
            return timer.isActive || timer.getRemainingTime() !== 0;
        });
    }

    public tickTimers() {
        this.timers.forEach(timer => timer.tick());
    }

    private booleanToEnable(value: boolean): string {
        return value ? 'enable' : 'disable';
    }

    public getServer(): any {
        return this.server;
    }

    public playersOnTeam(teamName: string): Internal.Player[] {
        var ret: Internal.Player[] = [];
        const players = this.server.players;
        for (const player of players) {
            const team = player.getTeam();

            if (team && team.getName() === teamName) {
                ret.push(player);
            }
        }
        return ret;
    }

    public playersWithTag(tagName: string): Internal.Player[] {
        const ret: Internal.Player[] = [];

        this.server.players.forEach((player: Internal.Player) => {
            const tags = player.getTags();

            if (tags.contains(tagName)) {
                ret.push(player);
            }
        });

        return ret;
    }

    public getPlayer(username: string): Internal.Player | null {
        const players = this.server.players;
        players.forEach((player: Internal.Player) => {
            if (player.username == username) {
                return player;
            }
        });
        return null;
    }

    public resetTags(): void {
        const players = this.server.players;

        for (var player of players) {
            const tags = player.getTags();
            for (var tag of tags) {
                player.removeTag(tag);
            }
        }
    }

    public removeCorpses(): string[] {
        const entities: Internal.Entity[] = this.server.getEntities();

        const ret: string[] = [];
        for (var entity of entities) {
            if (entity.type == "corpse:corpse") {
                ret.push(this.corpseName(entity));
                entity.kill();
            }
        }
        return ret;
    }
    public enableParcool(): void {
        this.parcool = true;
    }

    public disableParcool(): void {
        this.parcool = false;
    }

    public enableBetterCombat(): void {
        this.betterCombat = true;
    }

    public disableBetterCombat(): void {
        this.betterCombat = false;
    }

    public corpseName(corpseEntity: Internal.Entity) {
        const text = String(corpseEntity.displayName);

        const start = text.indexOf("args=[");
        const end = text.indexOf("]", start);

        return text.substring(start + 6, end);
    }

    public command(command: string): void {
        this.server.runCommandSilent(command);
    }

    public playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {

    };

    public playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {

    };

    public playerInteractPlayer(event: KubeEvent<typeof ItemEvents.entityInteracted>): void {

    };

    public getBlockAt(point: Point): string {
        return this.getServer().overworld().getBlock(0, 0, 0)
    }
    public vote(voter: Internal.Player, votee: any) {
        this.currentVoting?.vote(voter, votee);
    }
    public setMap(map: TMap) {
        this.map = map;
    }

}