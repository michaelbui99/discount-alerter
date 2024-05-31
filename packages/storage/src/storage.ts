import {
    Alert,
    Discount,
    StorageConfiguration,
} from '@michaelbui99-discount-alerter/models';

const STORAGE_SYMBOL = Symbol.for('michaelbui99-discount-alerter/Storage');

export abstract class Storage {
    protected readonly id: string;
    protected readonly name: string;
    protected readonly version: string;

    constructor(id: string, name: string, version: string) {
        this.id = id;
        this.name = name;
        this.version = version;

        Object.defineProperty(this, STORAGE_SYMBOL, { value: true });
    }

    public static isStorage(x: any): x is Storage {
        return x !== null && typeof x === 'object' && STORAGE_SYMBOL in x;
    }

    public abstract init(config: StorageConfiguration): void;

    /**
     * Ensure the storage backend is initialized and ready to store data.
     */
    public abstract ensureInitialized(): Promise<void>;
    public abstract storeAlert(alert: Alert): Promise<Alert>;
    public abstract getAlerts(): Promise<Alert[]>;
    public abstract storeDiscount(discount: Discount): Promise<Discount>;
    public abstract getDiscounts(): Promise<Discount[]>;

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
