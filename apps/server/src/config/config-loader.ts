import { ApplicationConfiguration } from '@michaelbui99-discount-alerter/models';
import path from 'path';
import os from 'os';
import fs from 'fs';
import yaml from 'yaml';
import { EnvironmentVariableReader } from '../env-reader/environment-variable-reader';

export class ConfigLoader {
    private readonly DEFAULT_CONFIG_PATH = `${os.homedir()}/.discount-alerter/app-config.yaml`;
    private readonly reader: EnvironmentVariableReader;
    constructor() {
        this.reader = new EnvironmentVariableReader();
    }

    public async load(configPath?: string): Promise<ApplicationConfiguration> {
        const resolvedPath = path.resolve(
            configPath ??
                this.reader.readOrElseGet({
                    variableName: 'DA_CONFIG',
                    orElse: () => this.DEFAULT_CONFIG_PATH,
                }),
        );
        const fileContents = fs.readFileSync(resolvedPath, {
            encoding: 'utf-8',
        });
        const parsedConfig = yaml.parse(fileContents);

        return parsedConfig as ApplicationConfiguration;
    }
}
