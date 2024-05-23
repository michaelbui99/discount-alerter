export class SelectorResult {
    private val: any;
    constructor(val: any) {
        this.val = val;
    }

    public static empty(): SelectorResult {
        return new SelectorResult(undefined);
    }

    public static of(value: any): SelectorResult {
        return new SelectorResult(value);
    }

    public hasValue(): boolean {
        return this.val !== undefined && this.val !== null;
    }

    public unwrap(): any {
        return this.val;
    }

    public unwrapAs<T>(): T {
        return this.val as T;
    }
}

export class FieldSelector {
    constructor(public selector: string) {}

    public select(obj: object): SelectorResult {
        const selectorParts = this.selector.split('.');
        let selected: any = obj;
        let result: SelectorResult = SelectorResult.empty();
        for (let part of selectorParts) {
            if (
                typeof selected === 'object' &&
                (selected as object).hasOwnProperty(part)
            ) {
                selected = selected[part];
            } else {
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
