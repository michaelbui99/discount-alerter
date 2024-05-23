"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonExpressionScanner = exports.TokenType = void 0;
const operatorMap = new Map([
    ['==', true],
    ['!=', true],
    ['>=', true],
    ['<=', true],
    ['>', true],
    ['<', true],
    ['INCLUDES', true],
    ['NOT_INCLUDES', true],
]);
var TokenType;
(function (TokenType) {
    TokenType["BOOLEAN_LITERAL"] = "BOOLEAN_LITERAL";
    TokenType["STRING_LITERAL"] = "STRING_LITERAL";
    TokenType["NUMBER_LITERAL"] = "NUMBER_LITERAL";
    TokenType["OPERATOR"] = "OPERATOR";
    TokenType["SELECTOR"] = "SELECTOR";
})(TokenType || (exports.TokenType = TokenType = {}));
class JsonExpressionScanner {
    constructor(source) {
        this.source = source;
    }
    scanAll() {
        let tokens = [];
        let matches = this.source
            .split(' ')
            .filter((lexeme) => lexeme !== '' && lexeme !== ' ');
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
    isNumberLiteral(s) {
        return !isNaN(parseFloat(s)) && !isNaN(parseInt(s));
    }
    isStringLiteral(s) {
        return ((s.startsWith("'") && s.endsWith("'")) ||
            (s.startsWith('"') && s.endsWith('"')));
    }
}
exports.JsonExpressionScanner = JsonExpressionScanner;
//# sourceMappingURL=parser.js.map