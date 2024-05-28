import {
    EqualsExpression,
    GreaterThanExpression,
    IncludesExpression,
    JsonExpression,
    LessThanExpression,
    NotExpression,
} from './expression';
import { FieldSelector } from './field-selector';

type Operator =
    | '=='
    | '!='
    | '>='
    | '<='
    | '>'
    | '<'
    | 'INCLUDES'
    | 'NOT_INCLUDES';

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

    constructor(source?: string) {
        this.source = source ?? '';
    }

    public setSource(newSource: string): JsonExpressionScanner {
        this.source = newSource;
        return this;
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

export class JsonExpressionParser {
    private readonly scanner: JsonExpressionScanner;

    constructor(scanner: JsonExpressionScanner) {
        this.scanner = scanner;
    }

    public parse(source: string): JsonExpression {
        const tokens = this.scanner.setSource(source).scanAll();
        if (tokens.length !== 3) {
            throw new Error(
                `Expected <SELECTOR> <OPERATOR> <GUARD> - got ${JSON.stringify(
                    tokens,
                    null,
                    4,
                )}`,
            );
        }

        const selector = this.parseSelector(tokens[0]);
        if (!operatorMap.has(tokens[1].literal)) {
            throw new Error(
                `unable to parse expression: unknown operator ${tokens[1].literal}`,
            );
        }
        const operator: Operator = tokens[1].literal as Operator;
        const guard = tokens[2].literal;
        let expression: JsonExpression;
        switch (operator) {
            case '!=': {
                expression = new NotExpression({
                    guard: new EqualsExpression({
                        guard: guard,
                        selector: selector,
                        options: new Map<string, any>([
                            ['CASE_INSENSITIVE', true],
                        ]),
                    }),
                    selector,
                });
                break;
            }
            case '<': {
                expression = new LessThanExpression({
                    guard,
                    selector,
                });
                break;
            }
            case '<=': {
                expression = new LessThanExpression({
                    guard,
                    selector,
                    options: new Map<string, any>([['ACCEPT_EQUAL', true]]),
                });
                break;
            }
            case '==': {
                expression = new EqualsExpression({
                    guard,
                    selector,
                    options: new Map<string, any>([['CASE_INSENSITIVE', true]]),
                });
                break;
            }
            case '>': {
                expression = new GreaterThanExpression({
                    guard,
                    selector,
                });
                break;
            }
            case '>=': {
                expression = new GreaterThanExpression({
                    guard,
                    selector,
                    options: new Map<string, any>([['ACCEPT_EQUAL', true]]),
                });
                break;
            }
            case 'INCLUDES': {
                expression = new IncludesExpression({
                    guard,
                    selector,
                    options: new Map<string, any>([['CASE_INSENSITIVE', true]]),
                });
                break;
            }
            case 'NOT_INCLUDES': {
                expression = new NotExpression({
                    selector,
                    guard: new IncludesExpression({
                        guard,
                        selector,
                        options: new Map<string, any>([
                            ['CASE_INSENSITIVE', true],
                        ]),
                    }),
                });
                break;
            }
            default: {
                throw new Error(
                    `Unable to parse expression: unknown operator ${operator}`,
                );
            }
        }

        return expression;
    }

    private parseSelector(token: Token): FieldSelector {
        this.acceptType(TokenType.SELECTOR, token);
        return new FieldSelector(token.literal);
    }

    private acceptType(type: TokenType, token: Token): void {
        if (token.type !== type) {
            throw new Error(
                `Expected type ${type}, but received ${token.type}`,
            );
        }
    }
}
