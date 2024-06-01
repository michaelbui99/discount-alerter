import { Discount } from './discount';
import { JsonExpressionParser, JsonExpressionScanner } from './json-expression';

export class Alert {
    id: string;
    readonly conditions: string[];
    readonly conditionsEvaluationContext: 'EVERY' | 'SOME';
    readonly notificationChannelIds: string[];
    private readonly expressionParser: JsonExpressionParser;

    constructor(
        conditionsEvaluationContext?: 'EVERY' | 'SOME',
        conditions?: string[],
        notificationChannelIds?: string[],
    ) {
        this.expressionParser = new JsonExpressionParser(
            new JsonExpressionScanner(),
        );
        this.conditionsEvaluationContext =
            conditionsEvaluationContext ?? 'EVERY';
        this.conditions = conditions ?? [];
        this.notificationChannelIds = notificationChannelIds ?? [];
    }

    public shouldTrigger(discount: Discount) {
        let results = [] as boolean[];
        for (let condition of this.conditions) {
            const expression = this.expressionParser.parse(condition);
            results.push(expression.evaluate(discount));
        }

        return this.conditionsEvaluationContext === 'EVERY'
            ? results.every((res) => res)
            : results.some((res) => res);
    }
}
