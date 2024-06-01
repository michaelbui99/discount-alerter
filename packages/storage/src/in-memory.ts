import {
    StorageConfiguration,
    Alert,
    Discount,
} from '@michaelbui99-discount-alerter/models';
import { Storage } from './storage';

export class InMemoryStorage extends Storage {
    private alerts: Alert[];
    private discounts: Discount[];

    constructor() {
        super(
            '@michaelbui99-discount-alerter/in-memory-storage',
            'In-Memory Storage',
            '0.1.0',
        );
    }

    public init(config: StorageConfiguration): void {}
    public async ensureInitialized(): Promise<void> {
        if (!this.alerts) {
            this.alerts = [];
        }

        if (!this.discounts) {
            this.discounts = [];
        }
    }
    public async storeAlert(alert: Alert): Promise<Alert> {
        this.alerts.push(alert);
        return alert;
    }
    public async getAlerts(): Promise<Alert[]> {
        return this.alerts;
    }
    public async storeDiscount(discount: Discount): Promise<Discount> {
        this.discounts.push(discount);
        return discount;
    }
    public async getDiscounts(): Promise<Discount[]> {
        return this.discounts;
    }
}
