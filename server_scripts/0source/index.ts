var game:Game<MapRegister> = new AmongUs();

ItemEvents.dropped("supplementaries:wind_vane", (event: KubeEvent<typeof ItemEvents.dropped>) => {
    game.start();
});


//whenever calling tick or start, pass in event.server ALWAYS


ServerEvents.tick(event => {
    game.setServer(event.server);
    game.tick();
    if (game.checkEndGame()){
        game.end();
        game = new Dummy();
    }
});


ItemEvents.entityInteracted(event => {
    game.playerInteractEntity(event);
});

ServerEvents.commandRegistry(event => {
    const { commands, arguments: args } = event;

    event.register(
        commands.literal('vote')
            .requires((src: any) => src.hasPermission(0))
            .then(
                commands.argument('targetPlayer', args.PLAYER.create(event))
                    .executes((ctx: any) => {
                        // ctx.source.player can be null if run from the server console
                        const player = ctx.source.player;

                        // Explicitly cast the argument to a ServerPlayer
                        const targetPlayer = args.PLAYER.getResult(ctx, 'targetPlayer');

                        if (player) {
                            game.vote(player,targetPlayer.username);
                        } else {
                            // Fallback handle if command is run by console/RCON
                            player.tell("Error");
                        }

                        return 1;
                    })
            )
    );

    event.register(
        commands.literal('instructions').executes((ctx: any) => {
            ctx.source.server.runCommandSilent()
        })
    )
});

EntityEvents.death((event: KubeEvent<typeof EntityEvents.death>) => {
    if (event.entity.type == "minecraft:player") {
        game.onPlayerDeath(event.entity as Internal.Player)
    }
});

EntityEvents.hurt((event: KubeEvent<typeof EntityEvents.hurt>) => {

    if (event.entity.type == "minecraft:player") {
        if (event.source.getImmediate() && (event.source.getImmediate()).type == "minecraft:player") {
            game.playerAttackPlayer(event);
        }
        else {
            game.playerDamaged(event);
        }

    }
});

PlayerEvents.chat((event: KubeEvent<typeof PlayerEvents.chat>) => {
    if (event.message.contains("hey")){
        event.player.tell("fuck yuou")
    }
})
