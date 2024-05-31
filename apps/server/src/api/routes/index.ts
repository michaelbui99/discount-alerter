import { Router } from 'express';
import { initConfigRouter } from './config';
import { initProviderRouter } from './providers';

export function initAppRouter(): Router {
    const router = Router();

    const configRouter = initConfigRouter();
    router.use('/config', configRouter);

    const providerRouter = initProviderRouter();
    router.use('/providers', providerRouter);

    return router;
}
