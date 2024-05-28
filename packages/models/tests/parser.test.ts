import { JsonExpressionParser, JsonExpressionScanner } from '../src';

describe('JSON Expression Parser tests', () => {
    test('Invalid operator throws exception', () => {
        // Arrange
        const source = 'ship.imo DSAKL "4242424"';
        const parser = new JsonExpressionParser(
            new JsonExpressionScanner(source),
        );

        // Act & Assert
        expect(parser.parse).toThrow();
    });
    test('Parser returns includes expression that should evaluate to true', () => {
        // Arrange
        const obj = {
            ship: {
                security: {
                    cso: {
                        name: 'Bob Marley',
                    },
                },
            },
        };
        const source = 'ship.security.cso.name INCLUDES "bob"';
        const parser = new JsonExpressionParser(
            new JsonExpressionScanner(source),
        );

        // Act
        const expression = parser.parse(source);

        // Assert
        expect(expression.expressionName).toEqual('INCLUDES_EXPRESSION');
        expect(expression.selector.selector).toEqual('ship.security.cso.name');
        expect(expression.guard).toEqual('bob');
        expect(expression.evaluate(obj)).toEqual(true);
    });
    test('Parser returns includes expression that should evaluate to false', () => {
        // Arrange
        const obj = {
            ship: {
                security: {
                    cso: {
                        name: 'Bob Marley',
                    },
                },
            },
        };
        const source = 'ship.security.cso.name INCLUDES "alice"';
        const parser = new JsonExpressionParser(
            new JsonExpressionScanner(source),
        );

        // Act
        const expression = parser.parse(source);

        // Assert
        expect(expression.expressionName).toEqual('INCLUDES_EXPRESSION');
        expect(expression.selector.selector).toEqual('ship.security.cso.name');
        expect(expression.guard).toEqual('alice');
        expect(expression.evaluate(obj)).toEqual(false);
    });

    test('Parser returns not includes expression that should evaluate to false', () => {
        // Arrange
        const obj = {
            ship: {
                security: {
                    cso: {
                        name: 'Bob Marley',
                    },
                },
            },
        };
        const source = 'ship.security.cso.name NOT_INCLUDES "bob"';
        const parser = new JsonExpressionParser(
            new JsonExpressionScanner(source),
        );

        // Act
        const expression = parser.parse(source);

        // Assert
        expect(expression.expressionName).toEqual('NOT_INCLUDES_EXPRESSION');
        expect(expression.selector.selector).toEqual('ship.security.cso.name');
        expect(expression.evaluate(obj)).toEqual(false);
    });
    test('Parser returns not includes expression that should evaluate to true', () => {
        // Arrange
        const obj = {
            ship: {
                security: {
                    cso: {
                        name: 'Bob Marley',
                    },
                },
            },
        };
        const source = 'ship.security.cso.name NOT_INCLUDES "ALICE"';
        const parser = new JsonExpressionParser(
            new JsonExpressionScanner(source),
        );

        // Act
        const expression = parser.parse(source);

        // Assert
        expect(expression.expressionName).toEqual('NOT_INCLUDES_EXPRESSION');
        expect(expression.selector.selector).toEqual('ship.security.cso.name');
        expect(expression.evaluate(obj)).toEqual(true);
    });

    // TODO: Add test for remaining expression types.
});
