export type CreateAlertDto = {
    conditions: string[];
    conditionsEvaluationContext: 'EVERY' | 'SOME';
    notificationChannelIds: string[];
};

export type UpdateAlertDto = CreateAlertDto;
