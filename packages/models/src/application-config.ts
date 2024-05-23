export type ProviderConfiguration = {
    provider: string;
    config: Map<string, any>;
};

export type ApplicationConfiguration = {
    providers: {
        configurations: ProviderConfiguration[];
    };
    server: {
        port: number;
    };
    tracker: {
        trackSchedule: string;
    };
};
