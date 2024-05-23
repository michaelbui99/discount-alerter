import {
    Discount,
    ProviderConfiguration,
} from '@michaelbui99-discount-alerter/models';
import { Provider } from '../../../src/provider';

class SampleProvider extends Provider {
    public testPropertyOne: string;
    public testPropertyTwo: string;
    constructor() {
        super(
            '@michaelbui99-discount-alerter/sample-provider',
            'Sample Provider',
            '0.1.0',
        );
    }

    async getDiscounts(): Promise<Discount[]> {
        return [] as Discount[];
    }

    public init(config: ProviderConfiguration): void {
        this.testPropertyOne = config.config.get('testProp1');
        this.testPropertyTwo = config.config.get('testProp2');
    }
}

const provider = new SampleProvider();
export default provider;
