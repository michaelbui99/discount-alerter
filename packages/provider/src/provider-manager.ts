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
    private providerEnabled: Map<string, boolean>;

    constructor(providers: Provider[]) {
        this.providerMap = new Map<string, Provider>();
        this.providerEnabled = new Map<string, boolean>();

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
            this.providerEnabled.set(provider.getId(), true);
        }
    }

    listEnabled(): Provider[] {
        const enabled: Provider[] = [];
        for (let [id, isEnabled] of this.providerEnabled.entries()) {
            if (isEnabled) {
                enabled.push(this.providerMap.get(id)!);
            }
        }

        return enabled;
    }

    listDisabled(): Provider[] {
        const disabled: Provider[] = [];
        for (let [id, isEnabled] of this.providerEnabled.entries()) {
            if (!isEnabled) {
                disabled.push(this.providerMap.get(id)!);
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

        this.providerEnabled.set(id, true);
        return this;
    }

    disable(id: string): ProviderManager {
        if (!this.providerMap.has(id)) {
            return this;
        }

        this.providerEnabled.set(id, false);
        return this;
    }
}
