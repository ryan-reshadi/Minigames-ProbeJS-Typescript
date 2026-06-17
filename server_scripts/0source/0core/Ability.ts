class Ability {
    private name: string = "";
    private execution: () => void;
    private timer: Timer;
    private ready: boolean = true;
    public constructor(name:string, cooldown: number, execution: () => void = () => { }) {
        this.name = name;
        this.execution = execution;
        this.timer = new Timer(cooldown, () => {
            this.ready = true;
        }, false);
    }

    public activate() {
        if (this.ready) {
            this.execution();
            this.timer.restart()
            this.timer.start();
            this.ready = false;
        }
    }
    public tick(): void {
        this.timer.tick();
    }

    public isReady(): boolean {
        return this.ready;
    }

    public remainingAbilityCooldown():number{
        return this.timer.getRemainingTime();
    }

    public getName():string {
        return this.name
    }
}