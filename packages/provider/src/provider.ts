import {
    Discount,
    ProviderConfiguration,
} from '@michaelbui99-discount-alerter/models';

const PROVIDER_SYMBOL = Symbol.for('michaelbui99-discount-alerter/Provider');

// TODO: Rethink abstraction to account for discounts from online stores.
export abstract class Provider {
    protected readonly id: string;
    protected readonly name: string;
    protected readonly version: string;

    constructor(id: string, name: string, version: string) {
        this.id = id;
        this.name = name;
        this.version = version;

        Object.defineProperty(this, PROVIDER_SYMBOL, { value: true });
    }

    public static isProvider(x: any): x is Provider {
        return x !== null && typeof x === 'object' && PROVIDER_SYMBOL in x;
    }

    public abstract getDiscounts(): Promise<Discount[]>;
    public abstract init(config: ProviderConfiguration): void;

    public getId(): string {
        return this.id;
    }
    public getVersion(): string {
        return this.version;
    }
    public getName(): string {
        return this.name;
    }
}
