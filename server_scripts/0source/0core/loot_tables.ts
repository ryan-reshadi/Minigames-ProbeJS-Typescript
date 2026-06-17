class LootEntry {
    // Explicitly define properties for ES5 compatibility
    public name: string;
    public weight: number;
    public amount: number;

    constructor(name: string, weight: number, amount: number) {
        this.name = name;
        this.weight = weight;
        this.amount = amount;
    }

    public getName(): string { return this.name; }
    public getWeight(): number { return this.weight; }
    public getAmount(): number { return this.amount; }
}

class LootTable {
    public entries: LootEntry[];

    constructor() {
        this.entries = [];
    }

    public addLoot(name: string, weight: number, amount: number) {
        this.entries.push(new LootEntry(name, weight, amount));
    }

    public getTotalWeight(): number {
        let total = 0;
        for (let i = 0; i < this.entries.length; i++) {
            total += this.entries[i].getWeight();
        }
        return total;
    }

    public getRandomLoot(): LootEntry | null {
        let totalWeight = this.getTotalWeight();
        if (totalWeight === 0) return null;

        let randomWeight = Math.random() * totalWeight;
        for (let i = this.entries.length - 1; i >= 0; --i) {
            // for (let i = 0, l = this.entries.length; i < l; i++) {
            let entry = this.entries[i];
            randomWeight -= entry.getWeight();
            if (randomWeight <= 0) {
                return entry;
            }
        }
        return null;
    }

    public rollRandomLoot(rolls: number): LootEntry[] {
        let results: LootEntry[] = [];
        for (let i = 0; i < rolls; i++) {
            let loot = this.getRandomLoot();
            if (loot) {
                results.push(loot);
            }
        }
        return results;
    }

    public giveRandomLoot(player: Internal.Player, rolls: number) {
        let lootEntries = this.rollRandomLoot(rolls);
        lootEntries.forEach((entry) => {
            player.give(Item.of(entry.getName(), entry.getAmount()));
        });
    }

    public givePlayersRandomLoot(players: Internal.Player[], rolls: number): void {
        for (var player of players) {
            this.giveRandomLoot(player, rolls);
        }
    }
}