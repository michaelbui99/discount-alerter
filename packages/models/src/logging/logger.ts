import { UTCDate } from '@date-fns/utc';

export interface ILogger {
    info(s: string): void;
    error(s: string): void;
    warn(s: string): void;
    debug(s: string): void;
}

export class Logger implements ILogger {
    static instances: Map<string, Logger> = new Map<string, Logger>();

    context: string;
    timeProvider: () => Date;

    private constructor(context: string) {
        this.context = context;
        this.timeProvider = () => new UTCDate();
    }

    public static For(context: string): Logger {
        if (Logger.instances.has(context)) {
            return Logger.instances.get(context)!;
        }

        const instance = new Logger(context);
        Logger.instances.set(context, instance);
        return instance;
    }

    // TODO: Add a way to hook into structured message handling

    info(s: string): void {
        console.log(this.getMessage(s, 'INFO').toString());
    }
    error(s: string): void {
        console.error(this.getMessage(s, 'ERROR').toString());
    }
    warn(s: string): void {
        console.warn(this.getMessage(s, 'WARN').toString());
    }
    debug(s: string): void {
        if (process.env['DEBUG']) {
            console.warn(this.getMessage(s, 'DEBUG').toString());
        }
    }

    private getMessage(message: string, level: string) {
        return new LogMessage({
            context: this.context,
            level: level,
            message: message,
            time: this.timeProvider(),
        });
    }
}

export class LogMessage {
    context: string;
    level: string;
    time: Date;
    message?: string;

    constructor(props: {
        context: string;
        level: string;
        message?: string;
        time?: Date;
    }) {
        this.context = props.context;
        this.level = props.level;
        this.message = props.message;
        this.time = props.time ?? new UTCDate();
    }

    toString() {
        return `[${this.level}][${this.context}][${this.time.toUTCString()}]: ${
            this.message
        }`;
    }
}
