abstract class Game<TMap extends MapRegister> {
    static CurrentGame: Game<MapRegister> | null = null;
    private tickCount: number;
    protected name: string;
    protected server!: Internal.MinecraftServer;
    protected timers: Timer[] = [];
    private betterCombat: boolean = false;
    private parcool: boolean = false;
    protected currentVoting: VotingSystem | null = null;
    protected map?: TMap;
    protected allowItemDropping: boolean = true;

    public constructor(name: string, allowDropping: boolean, betterCombat: boolean, parcool: boolean) {
        this.name = name;
        this.allowItemDropping = allowDropping;
        this.betterCombat = betterCombat;
        this.parcool = parcool;
        this.tickCount = 0;
        Game.CurrentGame = this;
    }

    public setServer(server: Internal.MinecraftServer) {
        this.server = server;
    }

    public abstract playerInteractEntity(event: any): void;

    public abstract start(): void;
    public abstract checkEndGame(): boolean;
    public tick(): void {
        this.timers.forEach((value: Timer) => (value.tick()));
        this.server.runCommandSilent('parcool ' + this.booleanToEnable(this.parcool));
        this.server.runCommandSilent('bctoggle ' + this.booleanToEnable(this.betterCombat));
        this.command("/kill @e[tag=kill]");
        this.command("tag @a remove kill");
        this.currentVoting?.tick();
        if (!this.allowItemDropping) {
            this.catchItemDrop();
        }
    };

    public end(): void {
        this.timers.length = 0;
        this.resetTags();
        Game.CurrentGame = null;
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

    public playerHasTag(player: Internal.Player, tagName: string): boolean {
        const tags = player.getTags()
        for (var tag of tags) {
            if (tag == tagName) {
                return true;
            }
        }
        return false;
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

    protected catchItemDrop() {
        if (!this.allowItemDropping) {

            this.server.allLevels.forEach((level: { getEntities: () => any[]; }) => {
                level.getEntities().forEach(entity => {

                    // Check if the entity is a dropped item
                    if (entity.type === 'minecraft:item') {

                        // Get the itemstack (the actual item data)
                        const itemStack = entity.item

                        // Try to find the player who dropped it (the owner)
                        const droppingPlayer = entity.owner

                        // Only act if we can identify the owner AND the item is not empty
                        if (droppingPlayer) {
                            if (!this.processDroppedItem(itemStack, droppingPlayer)) {
                                droppingPlayer.give(itemStack)
                                entity.kill()
                            }
                        }
                    }
                })
            })
        }
    }
    protected abstract processDroppedItem(itemID: string, droppingPlayer: Internal.Player): boolean;
    public ressurrectCorpse(corpseEntity: Internal.Entity, script: () => void = () => { }) {
        if (corpseEntity.type === "corpse:corpse") {
            const corpsePos = corpseEntity.getPosition(0);
            const playerName = this.corpseName(corpseEntity);
            this.command("tp " + playerName + " " + corpsePos.x() + " " + corpsePos.y() + " " + corpsePos.z());
            script();
        }
    }

    public switchGame(newGame: Game<MapRegister> | null) {
        Game.CurrentGame = newGame;
    }

    public getPlayerInventory(player: Internal.Player): Internal.List<Internal.ItemStack> {
        return player.inventory.allItems;
    }
    public itemStacksWithItem(player: Internal.Player, targetItemID: string): Internal.ItemStack[] {
        const inv = this.getPlayerInventory(player);
        let ret: Internal.ItemStack[] = []
        for (let i of inv) {
            if (i.getItem().id === targetItemID) {
                ret.push(i.getItem());

            }
        }
        return ret;
    }
    public filterItems(player: Internal.Player, allowedItems: string[]) {
        const inv = this.getPlayerInventory(player);
        for (let i of inv) {
            let clean = false;
            for (let s of allowedItems) {
                if (i.getItem().id === s) {
                    clean = true;
                    break;
                }
            }
            if (!clean) {
                this.command("clear " + player.username + " " + i.getItem().id);
            }
        }
    }
}