import { Router } from 'express';
import { ConfigController } from '../../../api/controllers';

const controller = new ConfigController();
const router = Router();

router.get('/', controller.get());

export const configRouter = router;
