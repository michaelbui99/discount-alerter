import { Router } from 'express';
import { ConfigController } from '../../../api/controllers';

export function initConfigRouter(): Router {
    const controller = new ConfigController();
    const router = Router();

    router.get('/', controller.get());

    return router;
}

// const controller = new ConfigController();
// const router = Router();

// router.get('/', controller.get());

// export const configRouter = router;
// export const configController = controller;
