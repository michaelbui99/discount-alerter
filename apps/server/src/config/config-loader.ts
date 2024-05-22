import { ApplicationConfiguration } from '@michaelbui99-discount-alerter/models';
import path from 'path';
import os from 'os';
import fs from 'fs';
import yaml from 'yaml';

export class ConfigLoader {
    private readonly DEFAULT_CONFIG_PATH = `${os.homedir()}/.discount-alerter/app-config.yaml`;
    constructor() {}

    public async load(configPath?: string): Promise<ApplicationConfiguration> {
        const resolvedPath = path.resolve(
            configPath ?? this.DEFAULT_CONFIG_PATH,
        );
        const fileContents = fs.readFileSync(resolvedPath, {
            encoding: 'utf-8',
        });
        const parsedConfig = yaml.parse(fileContents);

        return parsedConfig as ApplicationConfiguration;
    }
}
