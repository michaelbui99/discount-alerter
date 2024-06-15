import { Provider } from './provider';

export interface IProviderManager {
    listEnabled(): Provider[];
    listDisabled(): Provider[];
    listAll(): Provider[];
    getById(id: string): Provider | null;
    enable(id: string): ProviderManager;
    disable(id: string): ProviderManager;
}

export class ProviderManager implements IProviderManager {
    private providerMap: Map<string, Provider>;

    constructor(providers: Provider[]) {
        this.providerMap = new Map<string, Provider>();

        for (let provider of providers) {
            if (this.providerMap.has(provider.getId())) {
                const existingProvider = this.providerMap.get(
                    provider.getId(),
                )!;

                if (existingProvider.getVersion() !== provider.getVersion()) {
                    throw new Error(
                        `Multiple versions of provider ${provider.getId()} has been loaded (${existingProvider.getVersion()} AND ${provider.getVersion()})`,
                    );
                } else {
                    continue;
                }
            }

            this.providerMap.set(provider.getId(), provider);
        }
    }

    listEnabled(): Provider[] {
        const enabled: Provider[] = [];
        for (let provider of this.providerMap.values()) {
            if (provider.enabled) {
                enabled.push(provider);
            }
        }

        return enabled;
    }

    listDisabled(): Provider[] {
        const disabled: Provider[] = [];
        for (let provider of this.providerMap.values()) {
            if (!provider.enabled) {
                disabled.push(provider);
            }
        }

        return disabled;
    }

    listAll(): Provider[] {
        const all: Provider[] = [];
        for (let provider of this.providerMap.values()) {
            all.push(provider);
        }

        return all;
    }

    getById(id: string): Provider | null {
        if (!this.providerMap.has(id)) {
            return null;
        }

        return this.providerMap.get(id)!;
    }

    enable(id: string): ProviderManager {
        if (!this.providerMap.has(id)) {
            return this;
        }

        this.providerMap.get(id)!.enabled = true;
        return this;
    }

    disable(id: string): ProviderManager {
        if (!this.providerMap.has(id)) {
            return this;
        }

        this.providerMap.get(id)!.enabled = false;
        return this;
    }
}
