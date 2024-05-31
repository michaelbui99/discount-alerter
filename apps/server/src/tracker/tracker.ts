import { Provider } from '@michaelbui99-discount-alerter/provider';
import { Alert, ILogger, Logger } from '@michaelbui99-discount-alerter/models';
import { CronJob } from 'cron';

export interface ITracker {
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    getNext(): Promise<number>;
    setAlerts(alerts: Alert[]): Promise<void>;
    setProviders(providers: Provider[]): Promise<void>;
    setSchedule(schedule: string): Promise<void>;
}

export class Tracker implements ITracker {
    private job: CronJob;
    private schedule: string;
    private providers: Provider[];
    private alerts: Alert[];
    private readonly logger: ILogger;

    constructor(schedule: string, providers: Provider[], alerts: Alert[]) {
        this.logger = Logger.for('TRACKER');
        this.schedule = schedule;
        this.providers = providers;
        this.alerts = alerts;
    }

    public async start(): Promise<void> {
        this.logger.info('Starting tracker...');
        this.job = new CronJob(this.schedule, () => {
            this.logger.info('TRIGGERED');
        });
        this.job.start();
        console.log(this.job);
        console.log(this.providers);
        console.log(this.alerts);
        this.logger.info('Tracker started.');
    }

    public async stop(): Promise<void> {
        this.logger.info('Stopping tracker...');
        this.logger.info('Tracker stopped.');
    }

    public async restart(): Promise<void> {
        this.logger.info('Restarting tracker...');
        await this.stop();
        await this.start();
        this.logger.info('Tracker restarted.');
    }

    getNext(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    setAlerts(alerts: Alert[]): Promise<void> {
        throw new Error('Method not implemented.');
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
