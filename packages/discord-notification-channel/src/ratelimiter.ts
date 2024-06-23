export class Bucket {
    private capacity: number;
    private tokens: number;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    refill(): void {
        this.tokens = this.capacity;
    }

    getToken() {
        if (this.tokens === 0) {
            throw new Error('No tokens available');
        }

        this.tokens--;
    }
}

export class RateLimiter {
    private _rateLimit: number;
    private refillRateInMs: number;
    private bucket: Bucket;
    private refiller: any;

    constructor(rateLimit: number, refillRateInMs: number) {
        this._rateLimit = rateLimit;
        this.refillRateInMs = refillRateInMs;
        this.bucket = new Bucket(rateLimit);
        this.refiller = setInterval(() => {
            this.bucket.refill();
        }, refillRateInMs);
    }

    public get rateLimit(): number {
        return this._rateLimit;
    }

    public set rateLimit(val: number) {
        this._rateLimit = val;
        this.bucket = new Bucket(this.rateLimit);
        clearInterval(this.refiller);
        this.refiller = setInterval(() => {
            this.bucket.refill();
        }, this.refillRateInMs);
    }

    public acquire(): boolean {
        try {
            this.bucket.getToken();
            return true;
        } catch (err: any) {
            return false;
        }
    }
}
