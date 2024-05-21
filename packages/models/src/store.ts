export interface Store {
    name: string;
    address: Address;
    geolocation?: {
        lat: string;
        lon: string;
    };
    phoneNumber?: string;
}

export interface Address {
    city: string;
    country: string;
    street: string;
    zipCode: string;
}
