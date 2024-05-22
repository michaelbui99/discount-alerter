const operatorMap = {
    '==': true,
    '!=': true,
    '>=': true,
    '<=': true,
    '>': true,
    '<': true,
    INCLUDES: true,
};

export enum TokenType {
    BOOLEAN_LITERAL,
    STRING_LITERAL,
    NUMBER_LITERAL,
    OPERATOR,
    SELECTOR,
}

export type Token = {
    literal: string;
    type: TokenType;
};

export class JsonExpressionScanner {
    private pattern: RegExp = /(\w|\.|(!=)|(\=\=)|(\>\=)|(\<\=)|(>)|(<)|\")+/g;
    private source: string;

    constructor(source) {
        this.source = source;
    }
}
