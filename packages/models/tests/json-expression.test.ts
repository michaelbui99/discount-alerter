import {
    EqualsExpression,
    FieldSelector,
    GreaterThanExpression,
    IncludesExpression,
    JsonExpressionScanner,
    LessThanExpression,
    TokenType,
} from '../src/json-expression';

import { Discount } from '../src';

describe('JSON Expression tests', () => {
    describe('Field Selector', () => {
        test('It should return empty result if property does not exist', () => {
            // Arrange
            const obj = {
                ship: {
                    name: 'Destroyer',
                    imo: '4242424',
                },
            };
            const selector = new FieldSelector('ship.crew.captain.name');

            // Act
            const result = selector.select(obj);

            // Assert
            expect(result.unwrap()).toBeUndefined;
            expect(result.hasValue()).toBeFalsy();
        });

        test('It should return string result', () => {
            const obj = {
                ship: {
                    name: 'Destroyer',
                    imo: '4242424',
                },
            };
            const selector = new FieldSelector('ship.name');

            // Act
            const result = selector.select(obj);

            // Assert
            expect(result.hasValue()).toBeTruthy();
            expect(result.unwrapAs<string>()).toEqual('Destroyer');
        });
    });

    describe('Scanner', () => {
        test('It should parse correct tokens - String literal', () => {
            // Arrange
            const source = "ship.imo == '4242424'";
            const scanner = new JsonExpressionScanner(source);

            // Act
            const tokens = scanner.scanAll();

            // Assert
            console.log(tokens);
            expect(tokens[0].literal).toEqual('ship.imo');
            expect(tokens[0].type).toEqual(TokenType.SELECTOR);
            expect(tokens[1].literal).toEqual('==');
            expect(tokens[1].type).toEqual(TokenType.OPERATOR);
            expect(tokens[2].literal).toEqual('4242424');
            expect(tokens[2].type).toEqual(TokenType.STRING_LITERAL);
        });

        test('It should parse correct tokens 2 - Boolean Literal 1', () => {
            // Arrange
            const source = 'ship.isExemptFromProvidingWaste == true';
            const scanner = new JsonExpressionScanner(source);

            // Act
            const tokens = scanner.scanAll();

            // Assert
            console.log(tokens);
            expect(tokens[0].literal).toEqual(
                'ship.isExemptFromProvidingWaste',
            );
            expect(tokens[0].type).toEqual(TokenType.SELECTOR);
            expect(tokens[1].literal).toEqual('==');
            expect(tokens[1].type).toEqual(TokenType.OPERATOR);
            expect(tokens[2].literal).toEqual('true');
            expect(tokens[2].type).toEqual(TokenType.BOOLEAN_LITERAL);
        });

        test('It should parse correct tokens 3 - Boolean Literal 2', () => {
            // Arrange
            const source = 'ship.isExemptFromProvidingWaste == false';
            const scanner = new JsonExpressionScanner(source);

            // Act
            const tokens = scanner.scanAll();

            // Assert
            console.log(tokens);
            expect(tokens[0].literal).toEqual(
                'ship.isExemptFromProvidingWaste',
            );
            expect(tokens[0].type).toEqual(TokenType.SELECTOR);
            expect(tokens[1].literal).toEqual('==');
            expect(tokens[1].type).toEqual(TokenType.OPERATOR);
            expect(tokens[2].literal).toEqual('false');
            expect(tokens[2].type).toEqual(TokenType.BOOLEAN_LITERAL);
        });

        test('It should parse correct tokens - Integer is scanned as Number Literal', () => {
            // Arrange
            const source = 'ship.weight > 3';
            const scanner = new JsonExpressionScanner(source);

            // Act
            const tokens = scanner.scanAll();

            // Assert
            console.log(tokens);
            expect(tokens[0].literal).toEqual('ship.weight');
            expect(tokens[0].type).toEqual(TokenType.SELECTOR);
            expect(tokens[1].literal).toEqual('>');
            expect(tokens[1].type).toEqual(TokenType.OPERATOR);
            expect(tokens[2].literal).toEqual('3');
            expect(tokens[2].type).toEqual(TokenType.NUMBER_LITERAL);
        });

        test('It should parse correct tokens 5 - Float is scanned as Number Literal', () => {
            // Arrange
            const source = 'ship.weight > 3.0';
            const scanner = new JsonExpressionScanner(source);

            // Act
            const tokens = scanner.scanAll();

            // Assert
            console.log(tokens);
            expect(tokens[0].literal).toEqual('ship.weight');
            expect(tokens[0].type).toEqual(TokenType.SELECTOR);
            expect(tokens[1].literal).toEqual('>');
            expect(tokens[1].type).toEqual(TokenType.OPERATOR);
            expect(tokens[2].literal).toEqual('3.0');
            expect(tokens[2].type).toEqual(TokenType.NUMBER_LITERAL);
        });
    });

    describe('Expressions', () => {
        describe('Includes', () => {
            test('Expression should be case sensitive during evaluation', () => {
                // Arrange
                const expression = new IncludesExpression({
                    guard: 'Bob',
                    options: new Map<string, any>([
                        ['CASE_INSENSITIVE', false],
                    ]),
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
                    options: new Map<string, any>([
                        ['CASE_INSENSITIVE', false],
                    ]),
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
});
