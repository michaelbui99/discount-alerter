"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldSelector = exports.SelectorResult = void 0;
class SelectorResult {
    constructor(val) {
        this.val = val;
    }
    static empty() {
        return new SelectorResult(undefined);
    }
    static of(value) {
        return new SelectorResult(value);
    }
    hasValue() {
        return this.val !== undefined && this.val !== null;
    }
    unwrap() {
        return this.val;
    }
    unwrapAs() {
        return this.val;
    }
}
exports.SelectorResult = SelectorResult;
class FieldSelector {
    constructor(selector) {
        this.selector = selector;
    }
    select(obj) {
        const selectorParts = this.selector.split('.');
        let selected = obj;
        let result = SelectorResult.empty();
        for (let part of selectorParts) {
            if (typeof selected === 'object' &&
                selected.hasOwnProperty(part)) {
                selected = selected[part];
            }
            else {
                selected = undefined;
                break;
            }
        }
        if (selected !== undefined) {
            result = SelectorResult.of(selected);
        }
        return result;
    }
}
exports.FieldSelector = FieldSelector;
//# sourceMappingURL=field-selector.js.map