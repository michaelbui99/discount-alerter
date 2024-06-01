import { StorageManager } from '@michaelbui99-discount-alerter/storage';
import { Request, Response } from '../typedefs';
import { ApiResponse } from '../dtos/api-response';
import { CreateAlertDto, UpdateAlertDto } from '../dtos/create-alert-dto';
import { Alert } from '@michaelbui99-discount-alerter/models';
import { v4 as uuidv4 } from 'uuid';

export class AlertsController {
    private static $injected: { storageManager: StorageManager | undefined } = {
        storageManager: undefined,
    };

    private readonly storageManager: StorageManager;

    constructor() {
        if (!AlertsController.$injected.storageManager) {
            throw new Error('Missing required Storage Manager');
        }

        this.storageManager = AlertsController.$injected.storageManager!;
    }

    getAll() {
        return async (req: Request, res: Response) => {
            const storage = this.storageManager.getResolvedStorage();
            await storage.ensureInitialized();
            return res.json(
                ApiResponse.Ok({
                    data: await storage.getAlerts(),
                }),
            );
        };
    }

    create() {
        return async (req: Request, res: Response) => {
            const storage = this.storageManager.getResolvedStorage();
            await storage.ensureInitialized();
            const dto = req.body as CreateAlertDto;
            const alert = new Alert(
                dto.conditionsEvaluationContext,
                dto.conditions,
                dto.notificationChannelIds,
            );
            alert.id = uuidv4();
            await storage.storeAlert(alert);
            return res.json(ApiResponse.Ok({ data: alert }));
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            const storage = this.storageManager.getResolvedStorage();
            await storage.ensureInitialized();
            const dto = req.body as UpdateAlertDto;
            const id = req.params['id'];
            const alert = new Alert(
                dto.conditionsEvaluationContext,
                dto.conditions,
                dto.notificationChannelIds,
            );
            alert.id = id;
            const updated = await storage.updateAlert(id, alert);
            return res.json(
                ApiResponse.Ok({
                    data: updated,
                }),
            );
        };
    }

    delete() {
        return async (res: Response, req: Request) => {
            const storage = this.storageManager.getResolvedStorage();
            await storage.ensureInitialized();

            const id = req.params['id'];
            const deleted = await storage.deleteAlert(id);
            return res.json(
                ApiResponse.Ok({
                    data: deleted,
                }),
            );
        };
    }

    public static $inject(injection: { storageManager: StorageManager }) {
        AlertsController.$injected = {
            ...AlertsController.$injected,
            ...injection,
        };
    }
}
