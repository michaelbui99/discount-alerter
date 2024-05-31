export type ProviderConfiguration = {
    provider: string;
    config: { [key: string]: any };
};

export type NotificationChannelConfiguration = {
    channel: string;
    config: { [key: string]: any };
};

export type StorageConfiguration = {
    storage: string;
    config: { [key: string]: any };
};

export type ApplicationConfiguration = {
    providers: {
        configurations: ProviderConfiguration[];
    };
    channels: {
        configurations: NotificationChannelConfiguration[];
    };
    server: {
        port: number;
    };
    tracker: {
        trackSchedule: string;
    };
};
