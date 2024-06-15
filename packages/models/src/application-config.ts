export type ProviderConfiguration = {
    provider: string;
    enable: boolean;
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

    storage: {
        use: string;
        configurations: StorageConfiguration[];
    };

    server: {
        port: number;
    };

    tracker: {
        trackSchedule: string;
    };
};
