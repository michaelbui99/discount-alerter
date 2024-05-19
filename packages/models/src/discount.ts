import { Offer } from "./offer";
import { Product } from "./product";
import { Store } from "./store";

export interface Discount {
    offer: Offer;
    product: Product;
    store: Store;
}