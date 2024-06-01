import { Alert } from '@michaelbui99-discount-alerter/models';

export interface IAlertsRepository {
    getAll(): Alert[];
}
