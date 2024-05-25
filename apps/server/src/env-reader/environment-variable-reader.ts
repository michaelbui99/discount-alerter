export type ReadArgs = {
    variableName: string;
    orElse: () => string;
};

export interface IEnvironmentVariableReader {
    readOrElseGet(args: ReadArgs): string;
}

export class EnvironmentVariableReader implements IEnvironmentVariableReader {
    readOrElseGet(args: ReadArgs): string {
        const { variableName, orElse } = args;
        return process.env[variableName] ?? orElse();
    }
}
