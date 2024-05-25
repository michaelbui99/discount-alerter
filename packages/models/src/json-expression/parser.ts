const operatorMap = new Map<string, boolean>([
    ['==', true],
    ['!=', true],
    ['>=', true],
    ['<=', true],
    ['>', true],
    ['<', true],
    ['INCLUDES', true],
    ['NOT_INCLUDES', true],
]);

export enum TokenType {
    BOOLEAN_LITERAL = 'BOOLEAN_LITERAL',
    STRING_LITERAL = 'STRING_LITERAL',
    NUMBER_LITERAL = 'NUMBER_LITERAL',
    OPERATOR = 'OPERATOR',
    SELECTOR = 'SELECTOR',
}

export type Token = {
    literal: string;
    type: TokenType;
};

export class JsonExpressionScanner {
    private source: string;

    constructor(source: string) {
        this.source = source;
    }

    public scanAll(): Token[] {
        let tokens = [] as Token[];

        let matches = this.source
            .split(' ')
            .filter((lexeme) => lexeme !== '' && lexeme !== ' ');

        // For simplicity we always assume the first matched string to be a selector
        if (matches.length > 0) {
            tokens.push({
                literal: matches[0],
                type: TokenType.SELECTOR,
            });
        }

        const remaining = matches.slice(1);
        remaining.forEach((match) => {
            if (operatorMap.has(match.trim())) {
                tokens.push({
                    literal: match,
                    type: TokenType.OPERATOR,
                });
                return;
            }

            if (match === 'true' || match === 'false') {
                tokens.push({
                    literal: match,
                    type: TokenType.BOOLEAN_LITERAL,
                });
                return;
            }

            if (this.isNumberLiteral(match)) {
                tokens.push({
                    literal: match,
                    type: TokenType.NUMBER_LITERAL,
                });
                return;
            }

            if (this.isStringLiteral(match)) {
                tokens.push({
                    literal: match.replaceAll("'", '').replaceAll('"', ''),
                    type: TokenType.STRING_LITERAL,
                });
            }
        });

        return tokens;
    }

    private isNumberLiteral(s: string): boolean {
        return !isNaN(parseFloat(s)) && !isNaN(parseInt(s));
    }

    // TODO: make more robust to account for unterminated strings. Should suffice for now, since priority is getting a MVP up and running.
    private isStringLiteral(s: string): boolean {
        return (
            (s.startsWith("'") && s.endsWith("'")) ||
            (s.startsWith('"') && s.endsWith('"'))
        );
    }
}