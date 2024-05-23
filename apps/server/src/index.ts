import { ProviderLoader } from '@michaelbui99-discount-alerter/provider';
import path from 'path';
import { ConfigLoader } from './config/config-loader';
import { JsonExpressionScanner } from '@michaelbui99-discount-alerter/models';

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

    const scanner = new JsonExpressionScanner(`ship.imo == '424242'`);
    scanner.scanAll();
};

test();
