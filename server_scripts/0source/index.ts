var frameBuffer = 10;
ItemEvents.dropped("supplementaries:wind_vane", (event: KubeEvent<typeof ItemEvents.dropped>) => {
    Game.CurrentGame = new AmongUs()
    Game.CurrentGame.setServer(event.server);
    Game.CurrentGame.start();
});

ItemEvents.dropped("minecraft:end_crystal", (event: KubeEvent<typeof ItemEvents.dropped>) => {
    Game.CurrentGame = new Tag(true);
    Game.CurrentGame.setServer(event.server);
    Game.CurrentGame.start();
});

ItemEvents.dropped("minecraft:oak_sign", (event: KubeEvent<typeof ItemEvents.dropped>) => {
    Game.CurrentGame?.filterItems(event.player, ["supplementaries:wind_vane", "minecraft:end_crystal"]);
});



//whenever calling tick or start, pass in event.server ALWAYS


ServerEvents.tick(event => {
    Game.CurrentGame?.setServer(event.server);
    Game.CurrentGame?.tick();
    if (frameBuffer == 0) {
        if (Game.CurrentGame?.checkEndGame()) {
            Game.CurrentGame?.end();
            Game.CurrentGame = new Dummy();
        }
    } else {
        --frameBuffer;
    }
    if (!Game.CurrentGame) {
        Game.CurrentGame = new Dummy();
    }
});


ItemEvents.entityInteracted(event => {
    Game.CurrentGame?.playerInteractEntity(event);
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
                            Game.CurrentGame?.vote(player, targetPlayer.username);
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
        Game.CurrentGame?.onPlayerDeath(event.entity as Internal.Player)
    }
});

EntityEvents.hurt((event: KubeEvent<typeof EntityEvents.hurt>) => {

    if (event.entity.type == "minecraft:player") {
        if (event.source.getImmediate() && (event.source.getImmediate()).type == "minecraft:player") {
            Game.CurrentGame?.playerAttackPlayer(event);
        }
        else {
            Game.CurrentGame?.playerDamaged(event);
        }

    }
});

PlayerEvents.chat((event: KubeEvent<typeof PlayerEvents.chat>) => {
    if (event.message.contains("hey")) {
        event.player.tell("fuck yuou")
    }
})
