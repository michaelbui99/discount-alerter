import {
    EqualsExpression,
    FieldSelector,
    GreaterThanExpression,
    IncludesExpression,
    LessThanExpression,
} from '../src/json-expression';

import { Discount } from '../src';

describe('JSON Expression tests', () => {
    describe('Includes', () => {
        test('Expression should be case sensitive during evaluation', () => {
            // Arrange
            const expression = new IncludesExpression({
                guard: 'Bob',
                options: new Map<string, any>([['CASE_INSENSITIVE', false]]),
                selector: new FieldSelector('ship.crew.captain.name'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bobby',
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            // Assert
            expect(res).toBeFalsy();
        });

        test('Expression should be case insensitive during evaluation', () => {
            // Arrange
            const expression = new IncludesExpression({
                guard: 'Bob',
                options: new Map<string, any>([['CASE_INSENSITIVE', true]]),
                selector: new FieldSelector('ship.crew.captain.name'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bobby',
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            // Assert
            expect(res).toBeTruthy();
        });
    });

    describe('Greater than', () => {
        test('Should not accept equal during evalution', () => {
            // Arrange
            const expression = new GreaterThanExpression({
                guard: 25,
                options: new Map<string, any>([['ACCEPT_EQUAL', false]]),
                selector: new FieldSelector('offer.percentDiscount'),
            });
            const discount: Partial<Discount> = {
                offer: {
                    currency: 'DKK',
                    description: 'Lean Meat',
                    discountAmount: 10,
                    newPrice: 30,
                    originalPrice: 40,
                    percentDiscount: 25,
                    stock: 1,
                    stockUnit: 'EACH',
                },
            };

            // Act
            const res = expression.evaluate(discount);

            // Assert
            expect(res).toBeFalsy();
        });

        test('Should accept equal during evalution', () => {
            // Arrange
            const expression = new GreaterThanExpression({
                guard: 25,
                options: new Map<string, any>([['ACCEPT_EQUAL', true]]),
                selector: new FieldSelector('offer.percentDiscount'),
            });
            const discount: Partial<Discount> = {
                offer: {
                    currency: 'DKK',
                    description: 'Lean Meat',
                    discountAmount: 10,
                    newPrice: 30,
                    originalPrice: 40,
                    percentDiscount: 25,
                    stock: 1,
                    stockUnit: 'EACH',
                },
            };

            // Act
            const res = expression.evaluate(discount);

            // Assert
            expect(res).toBeTruthy();
        });
    });

    describe('Less than', () => {
        test('Should not accept equal during evalution', () => {
            // Arrange
            const expression = new LessThanExpression({
                guard: 25,
                options: new Map<string, any>([['ACCEPT_EQUAL', false]]),
                selector: new FieldSelector('offer.percentDiscount'),
            });
            const discount: Partial<Discount> = {
                offer: {
                    currency: 'DKK',
                    description: 'Lean Meat',
                    discountAmount: 10,
                    newPrice: 30,
                    originalPrice: 40,
                    percentDiscount: 25,
                    stock: 1,
                    stockUnit: 'EACH',
                },
            };

            // Act
            const res = expression.evaluate(discount);

            // Assert
            expect(res).toBeFalsy();
        });

        test('Should accept equal during evalution', () => {
            // Arrange
            const expression = new LessThanExpression({
                guard: 26,
                options: new Map<string, any>([['ACCEPT_EQUAL', true]]),
                selector: new FieldSelector('offer.percentDiscount'),
            });
            const discount: Partial<Discount> = {
                offer: {
                    currency: 'DKK',
                    description: 'Lean Meat',
                    discountAmount: 10,
                    newPrice: 30,
                    originalPrice: 40,
                    percentDiscount: 25,
                    stock: 1,
                    stockUnit: 'EACH',
                },
            };

            // Act
            const res = expression.evaluate(discount);

            // Assert
            expect(res).toBeTruthy();
        });
    });

    describe('Equals', () => {
        test('String equals should be case sensitive', () => {
            // Arrange
            const expression = new EqualsExpression({
                guard: 'Bob',
                options: new Map<string, any>([['CASE_INSENSITIVE', false]]),
                selector: new FieldSelector('ship.crew.captain.name'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bob',
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            //Assert
            expect(res).toBeFalsy();
        });

        test('String equals should be case insensitive', () => {
            // Arrange
            const expression = new EqualsExpression({
                guard: 'Bob',
                options: new Map<string, any>([['CASE_INSENSITIVE', true]]),
                selector: new FieldSelector('ship.crew.captain.name'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bob',
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            //Assert
            expect(res).toBeTruthy();
        });

        test('Number requals should return false', () => {
            // Arrange
            const expression = new EqualsExpression({
                guard: 60000.4,
                options: new Map<string, any>(),
                selector: new FieldSelector('ship.crew.captain.salary'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bob',
                            salary: 60000.5,
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            //Assert
            expect(res).toBeFalsy();
        });

        test('Number requals should return true', () => {
            // Arrange
            const expression = new EqualsExpression({
                guard: 60000.5,
                options: new Map<string, any>(),
                selector: new FieldSelector('ship.crew.captain.salary'),
            });
            const obj = {
                ship: {
                    crew: {
                        captain: {
                            name: 'bob',
                            salary: 60000.5,
                        },
                    },
                },
            };

            // Act
            const res = expression.evaluate(obj);

            //Assert
            expect(res).toBeTruthy();
        });
    });
});
