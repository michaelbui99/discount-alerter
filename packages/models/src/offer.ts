export interface Offer {
    description: string;
    currency: string;
    amount: number;
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