import { Router } from 'express';

import reservationRoutes from '../reservation/reservation.routes';

import { validate } from '../../middleware/validation.middleware';
import { createPurchaseSchema } from './purchases.validation';
import { createPurchase } from './purchases.controller';

const router = Router();

router.route('/').post(validate(createPurchaseSchema), createPurchase);

export default router;
