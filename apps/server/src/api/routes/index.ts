import { Router } from 'express';
import { initConfigRouter } from './config';
import { initProviderRouter } from './providers';
import { initStorageRouter } from './storage';
import { initAlertsRouter } from './alerts';

export function initAppRouter(): Router {
    const router = Router();

    const configRouter = initConfigRouter();
    router.use('/config', configRouter);

    const providerRouter = initProviderRouter();
    router.use('/providers', providerRouter);

    const storageRouter = initStorageRouter();
    router.use('/storage', storageRouter);

    const alertsRouter = initAlertsRouter();
    router.use('/alerts', alertsRouter);

    return router;
}
