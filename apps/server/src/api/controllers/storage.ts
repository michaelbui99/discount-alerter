import { StorageManager } from '@michaelbui99-discount-alerter/storage';
import { Request, Response } from '../typedefs';
import { ApiResponse } from '../dtos/api-response';

export class StorageController {
    private storageManager: StorageManager;
    private static $injected: { storageManager: StorageManager | undefined } = {
        storageManager: undefined,
    };

    constructor() {
        if (!StorageController.$injected.storageManager) {
            throw new Error('Missing required Storage Manager');
        }

        this.storageManager = StorageController.$injected.storageManager!;
    }

    get() {
        return (req: Request, res: Response) => {
            res.json(
                ApiResponse.Ok({
                    data: this.storageManager.getAll().map((provider) => {
                        return {
                            id: provider.getId(),
                            name: provider.getName(),
                            version: provider.getVersion(),
                        };
                    }),
                }),
            );
        };
    }

    getResolved() {
        return (req: Request, res: Response) => {
            const resolved = this.storageManager.getResolvedStorage();
            return res.json(
                ApiResponse.Ok({
                    data: {
                        id: resolved.getId(),
                        name: resolved.getName(),
                        version: resolved.getVersion(),
                    },
                }),
            );
        };
    }

    public static $inject(injection: { storageManager: StorageManager }) {
        StorageController.$injected = {
            ...StorageController.$injected,
            ...injection,
        };
    }
}
