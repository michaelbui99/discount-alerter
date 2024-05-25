import {
    FieldSelector,
    JsonExpressionScanner,
    TokenType,
} from '../src/json-expression';

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
            expect(result.hasValue()).not.toBeTruthy();
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
});
