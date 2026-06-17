
const diamondDropLoot = new LootTable();
diamondDropLoot.addLoot('minecraft:diamond', 10, 1);
diamondDropLoot.addLoot('minecraft:gold_ingot', 20, 2);
diamondDropLoot.addLoot('minecraft:iron_ingot', 30, 3);
diamondDropLoot.addLoot('minecraft:emerald', 5, 1);
diamondDropLoot.addLoot('minecraft:coal', 35, 4);


PlayerEvents.loggedIn((event: KubeEvent<typeof PlayerEvents.loggedIn>) => {
});


function rollAllPlayers(rolls: number, event: any) {
    const players = event.server.getPlayerList().getPlayers();
    players.forEach((player: Internal.Player) => {
        diamondDropLoot.giveRandomLoot(player, rolls);
    });
}

function rollPlayers(rolls: number, players: Internal.Player[]) {
    players.forEach((player) => {
        diamondDropLoot.giveRandomLoot(player, rolls);
    });
}

ServerEvents.commandRegistry(event => {
    // 1. Get the command builder helper from the event
    const { commands, arguments: args } = event;

    // 2. Register your custom command name
    event.register(
        commands.literal('summonloot') // The base command: /healme
            .requires((src: any) => src.hasPermission(2)) // Permission level (0 = anyone can use it)
            .executes((ctx: any) => {
                // Get the player running the command safely from the context
                const player = ctx.source.player;
                player.tell('Rolling loot for all players...');
                rollPlayers(3, ctx.source.server.players);
                return 1;
            })
    );
});