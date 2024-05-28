import { FieldSelector } from '../src';

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
