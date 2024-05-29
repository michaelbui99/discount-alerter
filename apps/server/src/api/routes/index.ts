import { Router } from 'express';
import { initConfigRouter } from './config';
import { initProviderRouter } from './providers';
// import { configRouter } from './config';
// import { providerRouter } from './providers';

export function initAppRouter(): Router {
    const router = Router();

    const configRouter = initConfigRouter();
    router.use('/config', configRouter);

    const providerRouter = initProviderRouter();
    router.use('/providers', providerRouter);

    return router;
}

// const router = Router();
// router.use('/config', configRouter);
// router.use('/providers', providerRouter);

// export const appRouter = router;
