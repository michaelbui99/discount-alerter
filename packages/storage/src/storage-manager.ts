import { ApplicationConfiguration } from '@michaelbui99-discount-alerter/models';
import { Storage } from './storage';

export interface IStorageManager {
    getResolvedStorage(): Storage;
}

export class StorageManager implements IStorageManager {
    private readonly appConfig: ApplicationConfiguration;
    private readonly storageMap: { [id: string]: Storage | undefined };

    constructor(storage: Storage[], appConfig: ApplicationConfiguration) {
        this.appConfig = appConfig;
        const initMap = {} as { [id: string]: Storage | undefined };
        this.storageMap = storage.reduce((sMap, next) => {
            sMap[next.getId()] = next;
            return sMap;
        }, initMap);
    }

    public getResolvedStorage(): Storage {
        const fallbackStorage =
            '@michelbui99-discount-alerter/in-memory-storage';
        if (!this.appConfig.storage.use) {
            if (!this.storageMap[fallbackStorage]) {
                throw new Error(
                    'Discount Alerter has not been configured to use any storage',
                );
            }

            return this.storageMap[fallbackStorage]!;
        }

        if (!this.storageMap[this.appConfig.storage.use]) {
            throw new Error(
                `No storage plugin ${this.appConfig.storage.use} has been loaded`,
            );
        }

        return this.storageMap[this.appConfig.storage.use]!;
    }
}
