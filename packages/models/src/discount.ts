import { Offer } from './offer';
import { Product } from './product';
import { Store } from './store';

export interface Discount {
    id: string;
    offer: Offer;
    product: Product;
    store: Store;
}
