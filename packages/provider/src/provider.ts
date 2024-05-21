import { Discount } from '@michaelbui99-discount-alerter/models';

const PROVIDER_SYMBOL = Symbol.for('michaelbui99-discount-alerter/Provider');

export type ProviderConfiguration = Map<string, any>;
export abstract class Provider {
    protected readonly id: string;
    protected readonly name: string;
    protected readonly version: string;
    protected config: ProviderConfiguration;

    constructor(id: string, name: string, version: string) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.config = new Map<string, any>();

        Object.defineProperty(this, PROVIDER_SYMBOL, { value: true });
    }

    public static isProvider(x: any): x is Provider {
        return x !== null && typeof x === 'object' && PROVIDER_SYMBOL in x;
    }

    public abstract async getDiscounts(): Promise<Discount[]>;
    public configure(f: (config: ProviderConfiguration) => void) {
        f(this.config);
    }
}
