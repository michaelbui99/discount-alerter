import path from 'path';
import fs from 'fs';
import { Provider } from './provider';

export class ProviderLoader {
    private providerDirs: string[];
    private providers: Provider[];
    private providerIdMap: any = {};

    constructor() {
        this.providerDirs = [];
        this.providers = [];
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

    public registerProviderDir(dirPath: string) {
        this.providerDirs.push(path.resolve(dirPath));
    }

    public async load(): Promise<Provider[]> {
        await Promise.all(
            this.providerDirs.map((dirPath) => this.loadDirectory(dirPath)),
        );

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
