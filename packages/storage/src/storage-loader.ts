import path from 'path';
import fs from 'fs';
import { Storage } from './storage';
import { StorageConfiguration } from '@michaelbui99-discount-alerter/models';

export class StorageLoader {
    private storagePluginDirs: string[];
    private storagePlugins: Storage[];
    private storageIdMap: any = {};
    private configurations: StorageConfiguration[];
    private configMap: Map<string, StorageConfiguration>;

    constructor(configurations: StorageConfiguration[]) {
        this.storagePluginDirs = [];
        this.storagePlugins = [];
        this.configurations = configurations;

        this.configMap = new Map<string, StorageConfiguration>();
        this.configurations.forEach((config) => {
            if (this.configMap.has(config.storage)) {
                throw new Error(
                    `Storage with id ${config.storage} has been configured multiple times.`,
                );
            }

            this.configMap.set(config.storage, config);
        });
    }

    public registerStorage(storage: Storage): StorageLoader {
        if (this.storageIdMap[storage.getId()]) {
            throw new Error(
                `Storage with id ${storage.getId()} has already been loaded. (version: ${storage.getVersion()})`,
            );
        }

        if (!(storage instanceof Storage)) {
            throw new Error('Invalid provider');
        }

        this.storageIdMap[storage.getId()] = true;
        this.storagePlugins.push(provider);

        return this;
    }

    public registerProviderDir(dirPath: string): StorageLoader {
        this.storagePluginDirs.push(path.resolve(dirPath));
        return this;
    }

    public async load(): Promise<Provider[]> {
        await Promise.all(
            this.storagePluginDirs.map((dirPath) =>
                this.loadDirectory(dirPath),
            ),
        );

        this.storagePlugins.forEach((provider) => {
            if (!this.configMap.has(provider.getId())) {
                console.warn(
                    `No configurations found for provider ${provider.getId()}`,
                );
            }

            const config = this.configMap.get(provider.getId()) ?? {
                provider: provider.getId(),
                config: new Map<string, any>(),
            };
            provider.init(config);
        });

        return this.storagePlugins;
    }

    private async loadDirectory(providerDir: string) {
        const resolvedDirPath = path.resolve(providerDir);
        const files = fs.readdirSync(resolvedDirPath);
        const jsFiles = files.filter((file) => file.endsWith('.js'));
        const importedModules = await Promise.all(
            jsFiles.map(
                async (file) => await import(path.join(resolvedDirPath, file)),
            ),
        );

        const loadedStorage = importedModules
            .filter((module) => module.default)
            .map((module) => module.default)
            .filter((storageCandidate) => storageCandidate instanceof Storage);

        loadedStorage.forEach((provider) => this.registerStorage(provider));
    }
}
