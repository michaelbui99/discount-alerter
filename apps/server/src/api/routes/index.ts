import { Router } from 'express';
import { initConfigRouter } from './config';
import { initProviderRouter } from './providers';
import { initStorageRouter } from './storage';

export function initAppRouter(): Router {
    const router = Router();

    const configRouter = initConfigRouter();
    router.use('/config', configRouter);

    const providerRouter = initProviderRouter();
    router.use('/providers', providerRouter);

    const storageRouter = initStorageRouter();
    router.use('/storage', storageRouter);

    return router;
}
