# Minigame Architecture Guide

This guide describes the server-side minigame framework in `kubejs_src`. It is
written for developers adding games and maps to this Minecraft instance.

## Quick start

1. Copy `server_scripts/0source/games/ExampleGame.ts` to a new game file.
2. Copy `server_scripts/0source/0core/0maps/actual_maps/ExampleMap.ts` to a new
   map file.
3. Rename both classes and replace the example structure ID, dimensions, and
   points.
4. Make the game constructor call `super(...)`, then call `this.setMap(...)`.
5. Implement `checkEndGame()` and the game-specific hooks.
6. Add a start trigger in `server_scripts/0source/index.ts`.
7. Test the game with at least two players, a reload, a death, a disconnect,
   and a normal end condition.

KubeJS loads these TypeScript files into the server script environment. Classes
are used as globals rather than imported modules, so preserve the existing file
layout and avoid duplicate class names.

## Runtime model

`Game.CurrentGame` is the global active-game reference. A start trigger creates
the game, assigns its server, and calls `start()`:

```ts
Game.CurrentGame = new ExampleGame();
Game.CurrentGame.setServer(event.server);
Game.CurrentGame.start();
```

Every server tick, the central script assigns the current server and calls
`tick()`. It then calls `checkEndGame()`. When that returns `true`, it calls
`end()` and installs `Dummy` as the idle game. A game should therefore return
`true` exactly when it is ready for cleanup.

The server reference is assigned outside the constructor. Do not execute
server commands from a constructor; use `start()` or a later hook.

## Class responsibilities

### `Game<TMap>`

`Game` is the reusable game controller. It owns:

- the game name and global active-game lifecycle;
- the server reference and command helper;
- timers and per-tick processing;
- optional Better Combat and Parcool settings;
- item-drop and corpse policies;
- the active map and voting system;
- helpers for players, teams, tags, inventories, corpses, loot, and commands.

`TMap` must extend `MapRegister`, which gives the game a typed map instead of
an unstructured `any` value.

### `MapRegister`

`MapRegister` is map metadata plus the map's player-placement contract. Its
constructor stores a paste point, structure ID, dimensions, and ideal world
time. `pasteStructure(server)` places the registered structure and sets the
world time. `teleportPlayers(server)` is abstract because spawn logic differs
for every map.

The paste point and dimensions are currently stored metadata; the current
`pasteStructure` implementation does not pass them to the Minecraft command.
Do not assume they perform bounds checking or transform a structure. If that is
needed, extend `MapRegister` deliberately and update this documentation.

### `Point`

`Point` stores integer-like coordinates, formats them for commands with
`toString()`, places blocks, and teleports a supplied player list. A map should
own named points such as `spawnPoint`, `waitingRoomPoint`, or `meetingPoint`
instead of scattering raw coordinate strings through a game.

## Lifecycle hooks

The following hooks are required by `Game` and must be implemented by every
concrete game:

| Hook | Return | Meaning |
| --- | --- | --- |
| `start()` | `void` | Initialize teams, map state, timers, UI, and kits. Call `super.start()` unless intentionally replacing its godmode cleanup. |
| `checkEndGame()` | `boolean` | Return `true` when the game is over. The central dispatcher calls `end()` afterward. |
| `onPlayerDeath(player)` | `void` | Apply the game's death rule. An empty method means no custom death handling. |
| `processBlockBroken(event)` | `void` | Handle or cancel block breaking. An empty method leaves the event allowed. |
| `processBlockPlaced(event)` | `void` | Handle or cancel block placing. An empty method leaves the event allowed. |
| `itemRightClicked(event)` | `void` | Handle item abilities or restrictions. An empty method leaves item use allowed. |

Useful optional hooks include `tick()`, `end()`, `onPlayerJoin()`,
`onPlayerLeave()`, `playerInteractEntity()`, `playerInteractPlayer()`,
`playerAttackPlayer()`, and `playerDamaged()`.

## Event cancellation

KubeJS event objects commonly expose `event.cancel()`. Calling it prevents the
event's normal action when that event supports cancellation. An empty hook does
not cancel anything; it allows the default Minecraft/KubeJS behavior to run.

Typical policies:

```ts
public override playerAttackPlayer(event: KubeEvent<typeof EntityEvents.hurt>): void {
    // Disable PvP for this game.
    event.cancel();
}

public override processBlockBroken(event: KubeEvent<typeof BlockEvents.broken>): void {
    if (event.block.id === "minecraft:bedrock") {
        event.cancel();
    }
}
```

Only cancel after checking the event's shape and the intended rule. Cancellation
is not a replacement for changing game state: for example, a death hook should
change teams or scores, while a hurt hook should cancel damage.

## Tick and timers

Minecraft runs at 20 ticks per second. `Timer(maxTime, callback, repeating)`
counts ticks after `addTimer(timer)` starts it. A repeating timer restarts after
its callback; a non-repeating timer becomes inactive after its callback.

Call `super.tick()` from an override unless the game intentionally replaces all
base processing. The base tick:

- advances every registered timer;
- applies Better Combat and Parcool settings;
- kills entities tagged `kill` and removes that tag from players;
- advances active voting;
- enforces item-drop and corpse policies.

`end()` clears the game's timer list, removes all player tags, and clears
`Game.CurrentGame`. Put game-specific cleanup before `super.end()` when it
needs the active server or game state.

Timers are owned by the game. Register every timer with `addTimer()` so `end()`
can clear it. Avoid creating an untracked repeating timer in a callback.

## Map workflow

A typical game start looks like this:

```ts
public override start(): void {
    super.start();
    this.map?.pasteStructure(this.getServer());
    this.map?.teleportPlayers(this.getServer());
}
```

Pasting is not automatic when `setMap()` is called. Decide whether a map should
be pasted once per round, reused, or managed by an external world setup. A map
should expose named points and keep coordinate-specific commands in the map,
not in the game controller.

## Existing event wiring

The current `server_scripts/0source/index.ts` dispatches these game hooks:

- server ticks;
- block broken and placed;
- entity interaction;
- player death;
- player hurt, split into player attack versus other damage;
- right-click item use;
- the custom vote command.

`onPlayerJoin`, `onPlayerLeave`, and `playerInteractPlayer` exist on `Game`,
but are not currently dispatched by that file. Implementing those methods alone
will not make them run. Add a central dispatcher before relying on them, and
pass the event/server object expected by the hook.

The start triggers are item-drop handlers. Each one replaces `CurrentGame`,
sets the server, and calls `start()`. Add a deliberate trigger for a new game;
do not instantiate games from constructors or from a per-tick path.

## Shared helpers and policies

- `command()` runs a silent server command and logs an error if no server is set.
- `playersOnTeam()` and `playersWithTag()` are safer than repeating player loops.
- `resetTags()` removes every tag from every online player; use it only when that
  broad cleanup is appropriate.
- `allowItemDropping = false` enables the base drop interception. Override
  `processDroppedItem()` to return `true` when a drop should be retained; the
  base behavior otherwise gives the item back and kills the dropped entity.
- `corpsesSpawn = false` makes the base tick remove corpse entities.
- `addNewChestLoot()` records game loot configuration; the chest event itself
  must still be wired to use that configuration.
- `switchGame()` changes the global reference but does not call `start()` or
  `end()`. Perform lifecycle calls explicitly.

## Quality checklist

Before publishing a game, verify:

- the constructor has a unique name and correct four feature flags;
- the map structure ID exists and its spawn points are safe;
- the game calls `setServer()` before commands or `getServer()` are used;
- `start()` resets state from a previous round;
- every repeating timer is cleared by `end()`;
- `checkEndGame()` handles zero players and disconnects;
- death, joining, leaving, and reloading cannot leave permanent teams, tags,
  effects, bossbars, or inventories behind;
- event cancellation is applied only to intended events;
- all required hooks are implemented without `throw new Error` placeholders;
- the trigger is wired in `index.ts`;
- a fresh server reload produces no TypeScript or runtime errors.

## Known framework notes

The templates intentionally expose the current API rather than hiding it. A
future framework pass could improve type safety for `any` event hooks, make map
metadata available to subclasses, remove duplicate timer paths, and centralize
join/leave dispatch. Those changes should be made in `Game`, `MapRegister`, and
the central event script together so existing games keep their behavior.