/**
 * Copy this class when creating a new minigame.
 *
 * The methods are deliberately conservative: hooks that do not need custom
 * behavior do nothing, while lifecycle methods call the base implementation
 * when it provides shared cleanup or server configuration.
 */
class ExampleGame extends Game<ExampleMap> {
    public constructor() {
        // name, allow item dropping, allow corpses, better combat, parcool
        super("example_game", true, true, false, false);
        this.setMap(new ExampleMap());
    }

    public override start(): void {
        // Game.start() removes godmode players. Keep this call unless the game
        // intentionally has a different policy for players with that tag.
        super.start();

        // Map placement is opt-in. Call this only after replacing the example
        // structure ID and deciding when the arena should be pasted.
        // this.map?.pasteStructure(this.getServer());
    }

    public override tick(): void {
        // This updates timers, optional mod settings, cleanup tags, voting,
        // dropped items, and corpses. Omit it only if you replace all of that.
        super.tick();
    }

    public override end(): void {
        // Clears this game's timers, removes player tags, and releases the
        // global current-game reference.
        super.end();
    }

    public override checkEndGame(): boolean {
        // Return true when the game has finished. The central tick handler
        // calls end() after this returns true. False keeps the game running.
        return false;
    }

    public override onPlayerDeath(player: Internal.Player): void {
        // No default death behavior is required. Add a respawn, team change,
        // spectator transition, or score update here when the game needs one.
    }

    public override onPlayerJoin(event: any): void {
        // Game.onPlayerJoin() re-applies the configured Parcool and Better
        // Combat settings. Call it if joining players should receive them.
        super.onPlayerJoin(event);
    }

    public override onPlayerLeave(player: any): void {
        // No default behavior. Remove the player from teams, votes, or timers
        // here if leaving the game must change its state.
    }

    public override playerInteractEntity(event: any): void {
        // No default behavior. If this interaction should be blocked and the
        // event exposes cancel(), call event.cancel(); otherwise it is allowed.
        // "interacting" means right clicking, with any item in hand; read kubejs documentation for how to extract which item was used to right click
        // applies to all entities including players
    }

    public override playerInteractPlayer(event: KubeEvent<typeof ItemEvents.entityInteracted>): void {
        // No default behavior. An empty hook allows the event to continue.
        // Use event.cancel() only when this game should prevent the interaction.
        // "interacting" means right clicking, with any item in hand; read kubejs documentation for how to extract which item was used to right click
        // applies only to players
    }

    public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // The default Game implementation allows the attack and does nothing.
        // Call event.cancel() here to disable PvP for this game.
    }

    public override playerDamaged(event: KubeEvent<typeof EntityEvents.hurt>): void {
        // The default Game implementation allows damage and does nothing.
        // Call event.cancel() to prevent environmental or other damage.
    }

    public override processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {
        // No default behavior. Block breaking remains allowed. Call
        // event.cancel() to prevent this block being broken
    }

    public override processBlockPlaced(event: KubeEvent<typeof BlockEvents.placed>): void {
        // No default behavior. Block placing remains allowed. Call
        // event.cancel() to protect the arena or restrict specific players.
    }

    public override itemRightClicked(event: KubeEvent<typeof ItemEvents.rightClicked>): void {
        // No default behavior. The item use remains allowed. Call
        // event.cancel() to cancel the item's normal use, read kubejs documentation for how to extract which item was used to right click
    }
}