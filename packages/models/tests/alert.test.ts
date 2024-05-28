import { Alert, Discount } from '../src';

describe('Alert tests', () => {
    test('Alert with EVERY context should return true when all conditions are true', () => {
        // Arrange
        const discount: Discount = {
            offer: {
                currency: 'DKK',
                description: 'Wagyu beef',
                discountAmount: 100,
                newPrice: 900,
                originalPrice: 1000,
                percentDiscount: 10,
                stock: 1,
                stockUnit: 'EACH',
            },
            product: {
                categories: ['MEAT>PREMIUM'],
                ean: '5912345127893',
            },
            store: {
                name: 'Netto Åbyhøj',
                address: {
                    city: 'Åbyhøj',
                    country: 'Denmark',
                    street: 'Søren Frichs Vej 53 M',
                    zipCode: '8230',
                },
            },
        };
        const alert: Alert = new Alert('EVERY', [
            'offer.description INCLUDES "wagyu"',
            'offer.discountAmount == 100',
            'offer.percentDiscount == 10',
        ]);

        // Act
        const shouldTrggier = alert.shouldTrigger(discount);

        // Assert
        expect(shouldTrggier).toEqual(true);
    });

    test('Alert with EVERY context should return false when at least one condition is false', () => {
        // Arrange
        const discount: Discount = {
            offer: {
                currency: 'DKK',
                description: 'Wagyu beef',
                discountAmount: 100,
                newPrice: 900,
                originalPrice: 1000,
                percentDiscount: 10,
                stock: 1,
                stockUnit: 'EACH',
            },
            product: {
                categories: ['MEAT>PREMIUM'],
                ean: '5912345127893',
            },
            store: {
                name: 'Netto Åbyhøj',
                address: {
                    city: 'Åbyhøj',
                    country: 'Denmark',
                    street: 'Søren Frichs Vej 53 M',
                    zipCode: '8230',
                },
            },
        };
        const alert: Alert = new Alert('EVERY', [
            'offer.description INCLUDES "wagyu"',
            'offer.discountAmount == 100',
            'offer.percentDiscount > 10',
        ]);

        // Act
        const shouldTrggier = alert.shouldTrigger(discount);

        // Assert
        expect(shouldTrggier).toEqual(false);
    });

    test('Alert with SOME context should return true when at least one condition is true', () => {
        // Arrange
        const discount: Discount = {
            offer: {
                currency: 'DKK',
                description: 'Wagyu beef',
                discountAmount: 100,
                newPrice: 900,
                originalPrice: 1000,
                percentDiscount: 10,
                stock: 1,
                stockUnit: 'EACH',
            },
            product: {
                categories: ['MEAT>PREMIUM'],
                ean: '5912345127893',
            },
            store: {
                name: 'Netto Åbyhøj',
                address: {
                    city: 'Åbyhøj',
                    country: 'Denmark',
                    street: 'Søren Frichs Vej 53 M',
                    zipCode: '8230',
                },
            },
        };
        const alert: Alert = new Alert('SOME', [
            'offer.description INCLUDES "chicken"',
            'offer.discountAmount == 3213214',
            'offer.percentDiscount == 10',
        ]);

        // Act
        const shouldTrggier = alert.shouldTrigger(discount);

        // Assert
        expect(shouldTrggier).toEqual(true);
    });
    test('Alert with SOME context should return false when all conditions are false', () => {
        // Arrange
        const discount: Discount = {
            offer: {
                currency: 'DKK',
                description: 'Wagyu beef',
                discountAmount: 100,
                newPrice: 900,
                originalPrice: 1000,
                percentDiscount: 10,
                stock: 1,
                stockUnit: 'EACH',
            },
            product: {
                categories: ['MEAT>PREMIUM'],
                ean: '5912345127893',
            },
            store: {
                name: 'Netto Åbyhøj',
                address: {
                    city: 'Åbyhøj',
                    country: 'Denmark',
                    street: 'Søren Frichs Vej 53 M',
                    zipCode: '8230',
                },
            },
        };
        const alert: Alert = new Alert('SOME', [
            'offer.description INCLUDES "chicken"',
            'offer.discountAmount == 3213214',
            'offer.percentDiscount == 50',
        ]);

        // Act
        const shouldTrggier = alert.shouldTrigger(discount);

        // Assert
        expect(shouldTrggier).toEqual(false);
    });
});
