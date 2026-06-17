class ImpostorRole extends Role {
    private baseKillCooldown = 20;
    private tool: string = "better_weaponry:iron_dagger";
    private killCooldown: Ability[] = [];
    private numPoints: number = 7;
    public constructor(amount: number, killCooldown: number) {
        super("impostor", amount);
        this.baseKillCooldown = killCooldown;
    }

    public rightClickPlayer(args: any[]) {

    }
    public leftClickPlayer(args: any[]):any {
        const impostor = (args[0] as Internal.Player);
        const victim = (args[1] as Internal.Entity);
        const killSafe = (args[3] as boolean)
        if (killSafe){
            impostor.tell("You cannot kill during this period...");
            return;
        }
        const mainHandID = (impostor.mainHandItem as Internal.ItemStack).id;

        if ((mainHandID as String == this.tool) && (impostor).getTags().contains("impostor") && (!victim.getTags().contains("impostor")) && ((victim as Internal.Entity).team.getName() == "Alive")) {
            
            var killAbility = this.getKillCooldownForPlayer(impostor);
            if (killAbility?.isReady()) {
                (victim as Internal.Entity).addTag("kill");
                killAbility?.activate();
            }
        }
    }
    public crouch(args: any[]) {

    }
    public tellPlayer(player: Internal.Player) {
        player.server.runCommandSilent('tellraw ' + player.username + ' [{"text":"You are the ","color":"red"},{"text":"IMPOSTOR","color":"dark_red","bold":true},{"text":"!","color":"red"}]');
        player.server.runCommandSilent('playsound minecraft: entity.warden.heartbeat master @s ~ ~ ~1 1');
        player.server.runCommandSilent('title ' + player.username + ' times 20 100 20');
        player.server.runCommandSilent('title ' + player.username + ' title { "text": "IMPOSTOR", "color": "dark_red", "bold": true }');
        player.server.runCommandSilent('title ' + player.username + ' subtitle { "text": "Eliminate everyone else", "color": "red" }');
        player.server.runCommandSilent('give ' + player.username + ' better_weaponry:iron_dagger');

    }
    public override assignToPlayer(player: Internal.Player): void {
        super.assignToPlayer(player);
        const ability = new Ability("kill", this.baseKillCooldown * 20)
        this.killCooldown.push(ability);
        const bossbarName = player.username.toLocaleLowerCase() + ":" + ability.getName()
        
        player.server.runCommandSilent("bossbar add " + bossbarName + ' \"Kill\"');
        player.server.runCommandSilent("/bossbar set " + bossbarName + " color red");
        player.server.runCommandSilent("bossbar set " + bossbarName + ' max ' + this.baseKillCooldown * 20);
        player.server.runCommandSilent("bossbar set " + bossbarName + " players " + player.username)
    }
    public override tick(server: Internal.MinecraftServer): void {
        for (var i = this.killCooldown.length - 1; i >= 0; --i) {
            const ability = this.killCooldown[i];
            ability.tick();
            if (!ability.isReady()){

            }
            const value = (this.baseKillCooldown * 20 - ability.remainingAbilityCooldown());
            const bossbarName = this.players[i].username.toLocaleLowerCase() + ":" + ability.getName();
            
            server.runCommandSilent("bossbar set " + bossbarName + " value " + (value))
        }
    }

    public getKillCooldownForPlayer(player: Internal.Player): Ability | null {
        const players = this.getPlayers()
        const playersNum = players.length;
        for (var i = playersNum - 1; i >= 0; --i) {
            if (players[i].username === player.username) {
                return this.killCooldown[i];
            }
        }
        return null;
    }

    public getKillCooldowns() {
        return this.killCooldown;
    }

}