"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../../../src/provider");
class SampleProvider extends provider_1.Provider {
    constructor() {
        super('@michaelbui99-discount-alerter/sample-provider', 'Sample Provider', '0.1.0');
    }
    async getDiscounts() {
        return [];
    }
    init(config) {
        this.testPropertyOne = config.config.get('testProp1');
        this.testPropertyTwo = config.config.get('testProp2');
    }
}
const provider = new SampleProvider();
exports.default = provider;
