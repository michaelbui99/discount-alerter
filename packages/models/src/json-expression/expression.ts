import { FieldSelector } from './field-selector';

export type JsonExpressionProps = {
    selector: FieldSelector;
    guard: any;
    options: Map<string, any>;
};

export abstract class JsonExpression {
    readonly selector: FieldSelector;
    readonly guard: any;
    readonly options: Map<string, any>;

    constructor(props: JsonExpressionProps) {
        this.selector = props.selector;
        this.guard = props.guard;
        this.options = props.options;
    }

    abstract get expressionName(): string;
    abstract evaluate(obj: object): boolean;
}

export class IncludesExpression extends JsonExpression {
    constructor(props: JsonExpressionProps) {
        super(props);
    }

    get expressionName(): string {
        return 'INCLUDES_EXPRESSION';
    }

    evaluate(obj: object): boolean {
        const selectorResult = this.selector.select(obj);
        if (!selectorResult.hasValue()) {
            return false;
        }

        const value = selectorResult.unwrapAs<string>();
        const caseInsensitive =
            (this.options.get('CASE_INSENSITIVE') as boolean) ?? false;

        return caseInsensitive
            ? value.toLowerCase().includes((this.guard as string).toLowerCase())
            : value.includes(this.guard as string);
    }
}

export class GreaterThanExpression extends JsonExpression {
    constructor(props: JsonExpressionProps) {
        super(props);
    }

    get expressionName(): string {
        return 'GREATER_THAN_EXPRESSION';
    }

    evaluate(obj: object): boolean {
        const selectorResult = this.selector.select(obj);
        if (!selectorResult.hasValue()) {
            return false;
        }

        const value = selectorResult.unwrapAs<number>();
        const acceptEqual =
            (this.options.get('ACCEPT_EQUAL') as boolean) ?? false;

        return acceptEqual
            ? value >= (this.guard as number)
            : value > (this.guard as number);
    }
}

export class LessThanExpression extends JsonExpression {
    constructor(props: JsonExpressionProps) {
        super(props);
    }

    get expressionName(): string {
        return 'LESS_THAN_EXPRESSION';
    }

    evaluate(obj: object): boolean {
        const selectorResult = this.selector.select(obj);
        if (!selectorResult.hasValue()) {
            return false;
        }

        const value = selectorResult.unwrapAs<number>();
        const acceptEqual =
            (this.options.get('ACCEPT_EQUAL') as boolean) ?? false;

        return acceptEqual
            ? value <= (this.guard as number)
            : value < (this.guard as number);
    }
}

export class EqualsExpression extends JsonExpression {
    constructor(props: JsonExpressionProps) {
        super(props);
    }

    get expressionName(): string {
        return 'EQUALS_EXPRESSION';
    }

    evaluate(obj: object): boolean {
        const selectorResult = this.selector.select(obj);
        if (!selectorResult.hasValue()) {
            return false;
        }

        let value = selectorResult.unwrap();
        const caseInsensitive =
            (this.options.get('CASE_INSENSITIVE') as boolean) ?? false;

        if (caseInsensitive) {
            return (
                (value as string).toLowerCase() ===
                (this.guard as string).toLowerCase()
            );
        }

        return (value as any) === (this.guard as any);
    }
}
