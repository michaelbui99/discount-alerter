import { ProviderManager } from '@michaelbui99-discount-alerter/provider';
import { Request, Response } from '../typedefs';
import { ApiResponse } from '../dtos/api-response';

export class ProviderController {
    private providerManager: ProviderManager;
    private static $injected: { providerManager: ProviderManager | undefined } =
        { providerManager: undefined };

    constructor() {
        if (!ProviderController.$injected.providerManager) {
            throw new Error(`Missing required Provider Manager`);
        }
        this.providerManager = ProviderController.$injected.providerManager;
    }

    public get() {
        return (req: Request, res: Response) => {
            res.json(
                ApiResponse.Ok({
                    data: this.providerManager.listAll().map((provider) => {
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

    public getDisabled() {
        return (req: Request, res: Response) => {
            res.json(
                ApiResponse.Ok({
                    data: this.providerManager
                        .listDisabled()
                        .map((provider) => {
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

    public getEnabled() {
        return (req: Request, res: Response) => {
            res.json(
                ApiResponse.Ok({
                    data: this.providerManager.listEnabled().map((provider) => {
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

    public static $inject(injection: { providerManager: ProviderManager }) {
        ProviderController.$injected = {
            ...ProviderController.$injected,
            ...injection,
        };
    }
}
