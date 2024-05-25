# Provider

Provider library that exposes the `Provider` base class that all provider's must extend.
A `Provider` provides discounts from some external source, e.g. store of specific brand, online shop etc.

All custom providers must expose an instance of their provider as the default import.
The Provider Loader will ensure that the provider has access to its configuration by invoking init with the parsed configurations.

```typescript
import { Discount } from '@michaelbui99-discount-alerter/models';
import {
    Provider,
    ProviderConfiguration,
} from '@michaelbui99-discount-alerter/provider';

class SampleProvider extends Provider {
    private authToken: string;
    private stores: string[];

    constructor() {
        super(
            '@michaelbui99-discount-alerter/salling-provider',
            'Salling Provider',
            '0.1.0',
        );
    }

    public init(config: ProviderConfiguration): Promise<Discount[]> {
        this.config = config;
        this.authToken = this.config.get('AUTH_TOKEN');
        this.stores = this.config.get('STORE_IDS');
    }

    public async getDiscounts(): Promise<Discount[]> {
        // Fetch and map response to model
    }
}

const provider = new SampleProvider();
export default provider;
```
