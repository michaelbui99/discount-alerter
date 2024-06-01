import {
    StorageConfiguration,
    Alert,
    Discount,
} from '@michaelbui99-discount-alerter/models';
import { Storage } from './storage';

export class InMemoryStorage extends Storage {
    private discounts: Discount[];
    private alertsMap: { [id: string]: Alert | undefined };

    constructor() {
        super(
            '@michaelbui99-discount-alerter/in-memory-storage',
            'In-Memory Storage',
            '0.1.0',
        );
    }

    public init(config: StorageConfiguration): void {}
    public async ensureInitialized(): Promise<void> {
        if (!this.discounts) {
            this.discounts = [];
        }

        if (!this.alertsMap) {
            this.alertsMap = {};
        }
    }
    public async storeAlert(alert: Alert): Promise<Alert> {
        this.alertsMap[alert.id] = alert;
        return alert;
    }

    public async getAlerts(): Promise<Alert[]> {
        let alerts = [] as Alert[];
        for (let id of Object.keys(this.alertsMap)) {
            alerts.push(this.alertsMap[id]!);
        }

        return alerts;
    }

    public async updateAlert(id: string, entity: Alert): Promise<Alert> {
        if (!this.alertsMap[id]) {
            throw new Error(`Alert ${id} does not exist`);
        }

        this.alertsMap[id] = entity;
        return entity;
    }

    public async deleteAlert(id: string): Promise<Alert> {
        if (!this.alertsMap[id]) {
            throw new Error(`Alert ${id} does not exist`);
        }

        const entity = JSON.parse(JSON.stringify(this.alertsMap[id]!)) as Alert;
        delete this.alertsMap[id];
        return entity;
    }

    public async storeDiscount(discount: Discount): Promise<Discount> {
        this.discounts.push(discount);
        return discount;
    }

    public async getDiscounts(): Promise<Discount[]> {
        return this.discounts;
    }
}
