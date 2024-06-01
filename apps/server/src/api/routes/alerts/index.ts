import { Router } from 'express';
import { AlertsController } from '../../../api/controllers';

export function initAlertsRouter(): Router {
    const controller = new AlertsController();
    const router = Router();

    router.get('/', controller.getAll());
    router.post('/', controller.create());
    router.put('/:id', controller.update());
    router.delete('/:id', controller.delete());

    return router;
}
