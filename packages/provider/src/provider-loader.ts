import path from 'path';
import fs from 'fs';
import { Provider } from './provider';
import { ProviderConfiguration } from '@michaelbui99-discount-alerter/models';

export class ProviderLoader {
    private providerDirs: string[];
    private providers: Provider[];
    private providerIdMap: any = {};
    private configurations: ProviderConfiguration[];
    private configMap: Map<string, ProviderConfiguration>;

    constructor(configurations: ProviderConfiguration[]) {
        this.providerDirs = [];
        this.providers = [];
        this.configurations = configurations;

        this.configMap = new Map<string, ProviderConfiguration>();
        this.configurations.forEach((config) => {
            if (this.configMap.has(config.provider)) {
                throw new Error(
                    `Provider with id ${config.provider} has been configured multiple times.`,
                );
            }

            this.configMap.set(config.provider, config);
        });
    }

    public registerProvider(provider: Provider): ProviderLoader {
        if (this.providerIdMap[provider.getId()]) {
            throw new Error(
                `Provider with id ${provider.getId()} has already been loaded. (version: ${provider.getVersion()})`,
            );
        }

        if (!(provider instanceof Provider)) {
            throw new Error('Invalid provider');
        }

        this.providerIdMap[provider.getId()] = true;
        this.providers.push(provider);

        return this;
    }

    public registerProviderDir(dirPath: string): ProviderLoader {
        this.providerDirs.push(path.resolve(dirPath));
        return this;
    }

    public async load(): Promise<Provider[]> {
        await Promise.all(
            this.providerDirs.map((dirPath) => this.loadDirectory(dirPath)),
        );

        this.providers.forEach((provider) => {
            if (!this.configMap.has(provider.getId())) {
                console.warn(
                    `No configurations found for provider ${provider.getId()}`,
                );
            }

            const config = this.configMap.get(provider.getId()) ?? {
                provider: provider.getId(),
                enable: true,
                config: new Map<string, any>(),
            };
            provider.enabled = config.enable;
            provider.init(config);
        });

        return this.providers;
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

        const loadedProviders = importedModules
            .filter((module) => module.default)
            .map((module) => module.default)
            .filter(
                (providerCandidate) => providerCandidate instanceof Provider,
            );

        loadedProviders.forEach((provider) => this.registerProvider(provider));
    }
}
