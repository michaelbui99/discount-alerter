export interface Offer {
    description: string;
    currency: string;
    discountAmount: number;
    ean?: string;
    startTime?: Date;
    endTime?: Date;
    lastUpdate?: Date;
    newPrice: number;
    originalPrice: number;
    percentDiscount: number;
    stock: number;
    stockUnit: string;
}
