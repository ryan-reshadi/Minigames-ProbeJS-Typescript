class Timer {
    private time: number = 0;
    private maxTime: number;
    private running: boolean;
    private repeating: boolean = false;
    private execution: () => void;

    constructor(maxTime: number, execution: () => void, repeating: boolean = false) {
        this.time = 0;
        this.maxTime = maxTime;
        this.running = false;
        this.repeating = repeating;
        this.execution = execution;
    }

    public start(): void {
        this.running = true;
    }

    public pause(): void {
        this.running = false;
    }

    public restart(): void {
        this.time = 0;
        this.running = this.repeating;
    }

    public isActive(): boolean {
        return this.running;
    }

    public tick(): void {

        if (this.running) {
            this.time++;

        }
        if (this.time >= this.maxTime) {
            this.execution();
            this.restart();

        }
    }

    public setRepeating(value: boolean): void {
        this.repeating = value;
    }

    public isRepeating(): boolean {
        return this.repeating;
    }
    
    public getRemainingTime():number {
        return this.time;
    }
}