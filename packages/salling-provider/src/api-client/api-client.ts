export type SallingClearance = {
    product: SallingProduct;
    offer: SallingOffer;
};

export type SallingProduct = {
    categories: string;
    description: string;
    ean: string;
    image: string;
};

export type SallingOffer = {
    description: string;
    currency: string;
    discount: number;
    endTime?: Date;
    lastUpdate?: Date;
    newPrice: number;
    originalPrice: number;
    percentDiscount: number;
    startTime?: Date;
    stock: number;
    stockUnit: string;
};
export type SallingStore = {
    name: string;
    address: SallingAddress;
    coordinates: string[];
    phoneNumber: string;
};

export type SallingAddress = {
    city: string;
    country: string;
    street: string;
    zip: string;
};

export type StoreClearances = {
    store: SallingStore;
    clearances: SallingClearance[];
};

export type SallingGroupAPIClient = {
    foodWaste: {
        byStoreId(storeId: string): Promise<StoreClearances>;
    };
};

export function createSallingGroupAPIClient(
    authToken: string,
): SallingGroupAPIClient {
    const baseUrl = 'https://api.sallinggroup.com/v1';
    const endpoint = (endpoint: string) => `${baseUrl}/${endpoint}`;

    const getJson = async (url: string): Promise<any> => {
        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${authToken}`,
                Accept: 'application/json',
            },
        });

        return response.json();
    };

    const foodWaste = {
        async byStoreId(storeId: string): Promise<StoreClearances> {
            return (await getJson(
                endpoint(`food-waste/${storeId}`),
            )) as StoreClearances;
        },
    };

    return {
        foodWaste,
    };
}
