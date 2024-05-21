import {
    Discount,
    Offer,
    Product,
    Store,
} from '@michaelbui99-discount-alerter/models';
import { Provider } from '@michaelbui99-discount-alerter/provider';
import {
    SallingGroupAPIClient,
    createSallingGroupAPIClient,
} from './api-client/api-client';

class SallingProvider extends Provider {
    private authToken: string;
    private stores: string[];
    private apiClient: SallingGroupAPIClient;

    constructor() {
        super(
            '@michaelbui99-discount-alerter/salling-provider',
            'Salling Provider',
            '0.1.0',
        );

        this.authToken = this.config.get('AUTH_TOKEN');
        this.stores = this.config.get('STORE_IDS');

        this.apiClient = createSallingGroupAPIClient(this.authToken);
    }

    public async getDiscounts(): Promise<Discount[]> {
        const promises = this.stores.map((storeId) =>
            this.apiClient.foodWaste.byStoreId(storeId),
        );
        const storeClearances = await Promise.all(promises);

        return storeClearances.flatMap((storeClearance) => {
            return storeClearance.clearances.map((clearance) => {
                const offer: Offer = {
                    currency: clearance.offer.currency,
                    description: clearance.offer.description,
                    discountAmount: clearance.offer.discount,
                    newPrice: clearance.offer.newPrice,
                    originalPrice: clearance.offer.originalPrice,
                    percentDiscount: clearance.offer.percentDiscount,
                    stock: clearance.offer.stock,
                    stockUnit: clearance.offer.stockUnit,
                    ean: clearance.product.ean,
                    endTime: clearance.offer.endTime,
                    lastUpdate: clearance.offer.lastUpdate,
                    startTime: clearance.offer.startTime,
                };

                const product: Product = {
                    categories: [clearance.product.categories],
                    ean: clearance.product.ean,
                    name: clearance.product.description,
                    image: clearance.product.image,
                };

                const store: Store = {
                    address: {
                        city: storeClearance.store.address.city,
                        country: storeClearance.store.address.country,
                        street: storeClearance.store.address.street,
                        zipCode: storeClearance.store.address.zip,
                    },
                    name: storeClearance.store.name,
                    geolocation: {
                        lon: storeClearance.store.coordinates[0],
                        lat: storeClearance.store.coordinates[1],
                    },
                    phoneNumber: storeClearance.store.phoneNumber,
                };

                return { offer, product, store };
            });
        });
    }
}

export const provider = new SallingProvider();
