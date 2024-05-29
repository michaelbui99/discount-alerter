import os from 'os';
import path from 'path';
import {
    ProviderLoader,
    ProviderManager,
} from '@michaelbui99-discount-alerter/provider';
import { startApiServer } from './api';
import { ConfigLoader } from './config/config-loader';
import {
    ApplicationConfiguration,
    Logger,
} from '@michaelbui99-discount-alerter/models';
import sallingProvider from '@michaelbui99-discount-alerter/salling-provider';
import { EnvironmentVariableReader } from './env-reader/environment-variable-reader';

async function main() {
    const config = await loadConfig();
    const providerManager = await setupProviders(config);

    await startApiServer(config, providerManager);
}

async function loadConfig(): Promise<ApplicationConfiguration> {
    const configLoader = new ConfigLoader();
    const config = await configLoader.load();

    const logger = Logger.for('API');
    logger.info(
        `Application configuration has been loaded successfully: ${config.channels.configurations.length} channel configuration(s) and ${config.providers.configurations.length} provider configuration(s)`,
    );

    return config;
}

async function setupProviders(
    config: ApplicationConfiguration,
): Promise<ProviderManager> {
    const providerLoader = new ProviderLoader(config.providers.configurations);

    const envReader = new EnvironmentVariableReader();
    const providerDir = envReader.readOrElseGet({
        variableName: 'DA_PROVIDER_DIR',
        orElse: () => `${os.homedir()}/.discount-alerter/providers`,
    });
    providerLoader.registerProviderDir(path.resolve(providerDir));

    const includedProviders = [sallingProvider];
    includedProviders.forEach((provider) =>
        providerLoader.registerProvider(provider),
    );

    const providers = await providerLoader.load();

    const logger = Logger.for('API');
    logger.info(`${providers.length} provider(s) has been loaded.`);

    return new ProviderManager(providers);
}

main();
