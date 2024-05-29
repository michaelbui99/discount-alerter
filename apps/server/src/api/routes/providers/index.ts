import { Router } from 'express';
import { ProviderController } from '../../../api/controllers/provider';

export function initProviderRouter(): Router {
    const controller = new ProviderController();
    const router = Router();

    router.get('/', controller.get());
    router.get('/enabled', controller.getEnabled());
    router.get('/disabled', controller.getDisabled());

    return router;
}
