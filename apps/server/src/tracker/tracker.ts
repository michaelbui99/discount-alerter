import { Provider } from '@michaelbui99-discount-alerter/provider';
import {
    Discount,
    ILogger,
    Logger,
} from '@michaelbui99-discount-alerter/models';
import { CronJob } from 'cron';
import { StorageManager } from '@michaelbui99-discount-alerter/storage';
import { Notifier } from '@michaelbui99-discount-alerter/notification';

export interface ITracker {
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    setProviders(providers: Provider[]): Promise<void>;
    setSchedule(schedule: string): Promise<void>;
}

export class Tracker implements ITracker {
    private job: CronJob | undefined;
    private schedule: string;
    private providers: Provider[];
    private storageManager: StorageManager;
    private notifier: Notifier;
    private readonly logger: ILogger;

    constructor(
        schedule: string,
        providers: Provider[],
        storageManager: StorageManager,
        notifier: Notifier,
    ) {
        this.logger = Logger.for('TRACKER');
        this.schedule = schedule;
        this.providers = providers;
        this.storageManager = storageManager;
        this.notifier = notifier;
    }

    public async start(): Promise<void> {
        this.logger.info('Starting tracker...');
        this.job = new CronJob(this.schedule, async () => {
            this.logger.info('Scanning for discounts...');
            const storage = this.storageManager.getResolvedStorage();
            await storage.ensureInitialized();

            const discountsPromises: Promise<Discount[]>[] = [];
            this.providers.forEach((provider) => {
                discountsPromises.push(provider.getDiscounts());
            });
            const awaitedDiscounts = await Promise.all(discountsPromises);
            let discounts: Discount[] = [];
            for (let discountArr of awaitedDiscounts) {
                discounts = discounts.concat(discountArr);
            }

            const alerts = await storage.getAlerts();

            this.logger.info('Testing alerts...');
            for (let discount of discounts) {
                for (let alert of alerts) {
                    if (alert.shouldTrigger(discount)) {
                        const channels = this.notifier.getChannels();
                        for (let channel of channels) {
                            await this.notifier.notify(channel, discount);
                        }
                    }
                }
            }
        });
        this.job.start();
        this.logger.info('Tracker started.');
    }

    public async stop(): Promise<void> {
        this.logger.info('Stopping tracker...');
        if (this.job) {
            this.job.stop();
            this.job = undefined;
        }
        this.logger.info('Tracker stopped.');
    }

    public async restart(): Promise<void> {
        this.logger.info('Restarting tracker...');
        await this.stop();
        await this.start();
        this.logger.info('Tracker restarted.');
    }

    public async setProviders(providers: Provider[]): Promise<void> {
        this.providers = providers;
        await this.restart();
    }

    public async setSchedule(schedule: string): Promise<void> {
        this.schedule = schedule;
        await this.restart();
    }
}
