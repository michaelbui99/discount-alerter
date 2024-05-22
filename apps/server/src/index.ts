import { ProviderLoader } from '@michaelbui99-discount-alerter/provider';
import sallingProvider from '@michaelbui99-discount-alerter/salling-provider';
import path from 'path';

console.log('Hello world!');

const loader = new ProviderLoader();
// loader.loadDirectory(path.join(__dirname, '..', '..', '..', '..'));
console.log(path.join(__dirname, '..', '..', '..', 'packages', 'provider', ''));

const test = async () => {
    const providerPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'packages',
        'salling-provider',
        'src',
    );

    const providers = await loader.registerProviderDir(providerPath).load();
    console.log('PROVIDERS', providers);
};

test();
