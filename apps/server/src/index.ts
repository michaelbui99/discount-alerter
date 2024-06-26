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
import { ITracker, Tracker } from './tracker/tracker';
import {
    InMemoryStorage,
    Storage,
    StorageLoader,
    StorageManager,
} from '@michaelbui99-discount-alerter/storage';
import { Notifier } from '@michaelbui99-discount-alerter/notification';
import discordNotificationChannel from '@michaelbui99-discount-alerter/discord-notification-channel';

async function main() {
    const config = await loadConfig();
    const providerManager = await setupProviders(config);
    const storageManager = await setupStorage(config);
    const notifier = await setupNotificationChannels(config);
    const tracker: ITracker = new Tracker(
        config.tracker.trackSchedule,
        providerManager.listEnabled(),
        storageManager,
        notifier,
    );

    await tracker.start();
    await startApiServer(config, providerManager, storageManager);
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

async function setupStorage(
    config: ApplicationConfiguration,
): Promise<StorageManager> {
    const loader = new StorageLoader(config.storage.configurations);

    const envReader = new EnvironmentVariableReader();
    const storagePluginsDir = envReader.readOrElseGet({
        variableName: 'DA_STORAGE_PLUGINS_DIR',
        orElse: () => `${os.homedir()}/.discount-alerter/storage-plugins`,
    });

    loader.registerProviderDir(path.resolve(storagePluginsDir));

    const includedStorage = [new InMemoryStorage()];
    includedStorage.forEach((storage) => loader.registerStorage(storage));

    const storage: Storage[] = await loader.load();

    const logger = Logger.for('API');
    logger.info(`${storage.length} storage plugins has been loaded`);

    return new StorageManager(storage, config);
}

async function setupNotificationChannels(
    config: ApplicationConfiguration,
): Promise<Notifier> {
    const notifier = new Notifier(config.channels.configurations);

    const envReader = new EnvironmentVariableReader();
    const notificationChannelsDir = envReader.readOrElseGet({
        variableName: 'DA_NOTIFICATION_CHANNELS_DIR',
        orElse: () => `${os.homedir()}/.discount-alerter/notification-channels`,
    });

    notifier.registerChannelDir(notificationChannelsDir);
    notifier.registerChannel(discordNotificationChannel);

    await notifier.loadChannels();

    return notifier;
}

main();
