import {
    Discount,
    NotificationChannelConfiguration,
} from '@michaelbui99-discount-alerter/models';

const CHANNEL_SYMBOL = Symbol.for(
    'michaelbui99-discount-alerter/NotificationChannel',
);

export abstract class NotificationChannel {
    protected readonly id: string;
    protected readonly name: string;
    protected readonly version: string;

    constructor(id: string, name: string, version: string) {
        this.id = id;
        this.name = name;
        this.version = version;

        Object.defineProperty(this, CHANNEL_SYMBOL, { value: true });
    }

    public static isNotificationChannel(x: any): x is NotificationChannel {
        return x !== null && typeof x === 'object' && CHANNEL_SYMBOL in x;
    }

    public abstract send(discount: Discount): Promise<void>;
    public abstract init(config: NotificationChannelConfiguration): void;

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
