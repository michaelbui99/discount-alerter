import path from 'path';
import { ProviderLoader } from '../src/provider-loader';

describe('Provider Loader tests', () => {
    test('Providers can be loaded from directory', async () => {
        // Arrange
        const providerDir = path.join(__dirname, 'data', 'providers');
        const loader = new ProviderLoader([
            {
                provider: '@michaelbui99-discount-alerter/sample-provider',
                config: new Map<string, any>([
                    ['testProp1', 'val1'],
                    ['testProp2', 'val2'],
                ]),
            },
        ]);
        loader.registerProviderDir(providerDir);

        // Act
        const providers = await loader.load();

        // Assert
        expect(providers).toHaveLength(1);
        expect(providers[0].getName()).toEqual('Sample Provider');
        expect(providers[0].getId()).toEqual(
            '@michaelbui99-discount-alerter/sample-provider',
        );
        expect(providers[0].getVersion()).toEqual('0.1.0');
    });

    test('Loader calls init on loaded provider', async () => {
        // Arrange
        const providerDir = path.join(__dirname, 'data', 'providers');
        const loader = new ProviderLoader([
            {
                provider: '@michaelbui99-discount-alerter/sample-provider',
                config: new Map<string, any>([
                    ['testProp1', 'val1'],
                    ['testProp2', 'val2'],
                ]),
            },
        ]);
        loader.registerProviderDir(providerDir);

        // Act
        const providers = await loader.load();

        // Assert
        expect((providers[0] as any)['testPropertyOne']).toEqual('val1');
        expect((providers[0] as any)['testPropertyTwo']).toEqual('val2');
    });
});
