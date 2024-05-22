import { ProviderLoader } from '@michaelbui99-discount-alerter/provider';
import path from 'path';
import { ConfigLoader } from './config/config-loader';

console.log('Hello world!');

const loader = new ProviderLoader([]);
const configLoader = new ConfigLoader();
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

    const configPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'app-config.yaml',
    );

    const providers = await loader.registerProviderDir(providerPath).load();
    console.log('PROVIDERS', providers);
    await configLoader.load(configPath);
};

test();
