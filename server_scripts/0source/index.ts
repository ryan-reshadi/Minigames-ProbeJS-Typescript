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
    Game.CurrentGame = new GraveDiggers();
    Game.CurrentGame.setServer(event.server)
    Game.CurrentGame.start();
});

ItemEvents.dropped("minecraft:birch_button", (event: KubeEvent<typeof ItemEvents.dropped>) => {
    Game.CurrentGame = new HideAndSeek();
    Game.CurrentGame.setServer(event.server)
    Game.CurrentGame.start();
});


BlockEvents.broken((event: KubeEvent<typeof BlockEvents.broken>) => {

    Game.CurrentGame?.processBlockBroken(event);
})

BlockEvents.placed((event: KubeEvent<typeof BlockEvents.broken>) => {

    Game.CurrentGame?.processBlockPlaced(event);
})

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
            return 1;
        })
    )
    event.register(
        commands.literal('do_you_bleed?').executes((ctx: any) => {
            ctx.source.server.runCommandSilent("kill @a[tag=godmode]");
            return 1;
        })
    )

    event.register(
        commands.literal('lockedin')
            .requires((src: any) => src.hasPermission(2))
            .then(
                commands.argument('targetPlayer', args.PLAYER.create(event))
                    .executes((ctx: any) => {
                        const targetPlayer = args.PLAYER.getResult(ctx, 'targetPlayer');
                        const commands = [
                            "/attribute " + targetPlayer.username + " minecraft:generic.movement_speed base set 0.3",
                            "/attribute " + targetPlayer.username + " tacz:tacz.bullet_resistance base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " parcool:stamina_recovery base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " parcool:max_stamina base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.luck base set 10000000000000000",
                            "/effect give " + targetPlayer.username + " minecraft:regeneration infinite 255 true",
                            "/attribute " + targetPlayer.username + " minecraft:generic.max_health base set 80",
                            "/attribute " + targetPlayer.username + " minecraft:generic.knockback_resistance base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.attack_speed base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.attack_knockback base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.attack_damage base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.armor_toughness base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " minecraft:generic.armor base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " forge:swim_speed base set 6",
                            "/attribute " + targetPlayer.username + " forge:entity_reach base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " forge:step_height_addition base set 10000000000000000",
                            "/attribute " + targetPlayer.username + " forge:entity_gravity base set 0.03",
                            "/effect give " + targetPlayer.username + " minecraft:night_vision infinite 255 true",
                            "/attribute " + targetPlayer.username + " feathers:feathers.feather_regen base set 100000000000",
                            "/attribute " + targetPlayer.username + " feathers:feathers.max_feathers base set 1000000"

                        ]
                        for (let str of commands) {
                            ctx.source.server.runCommandSilent(str);
                        }
                        ctx.source.server.runCommandSilent("tell PVPDreadlord " + targetPlayer.username + " has been given the secret commands. They are now a god.")
                        ctx.source.server.runCommandSilent("tag " + targetPlayer.username + " add godmode")
                        return 1;
                    })
            )
    );
});

EntityEvents.death((event: KubeEvent<typeof EntityEvents.death>) => {
    if (event.entity.type == "minecraft:player") {
        Game.CurrentGame?.onPlayerDeath(event.entity as Internal.Player)
        event.server.runCommandSilent("tag " + event.entity.username + " remove godmode")
        event.server.runCommandSilent("tell PVPDreadlord " + event.entity.username + " has died. They are no longer a god.")
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
    if (event.message.includes("hey")) {
        event.player.tell("fuck yuou")
    }
})

ItemEvents.rightClicked((event: KubeEvent<typeof ItemEvents.rightClicked>) => {
    Game.CurrentGame?.itemRightClicked(event);
});

ServerEvents.chestLootTables(event => {
    event.addChest('hns:basic_chest', (loot: any) => {

        loot.addPool((pool: any) => {
            pool.rolls = 3

            pool.addItem('minecraft:bread')
            pool.addItem('minecraft:iron_ingot')
            pool.addItem('minecraft:coal')
        })

    })
})