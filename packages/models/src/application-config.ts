export type ApplicationConfiguration = {
    providers: {
        configurations: Map<string, any>[];
    };
    server: {
        port: number;
    };
    tracker: {
        trackSchedule: string;
    };
};
