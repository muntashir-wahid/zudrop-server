import { Router } from 'express';

import reservationRoutes from '../reservation/reservation.routes';

import { createDrop, getDrops } from './drops.controller';
import { validate } from '../../middleware/validation.middleware';
import { createDropSchema } from './drops.validation';

const router = Router();

router.route('/').post(validate(createDropSchema), createDrop).get(getDrops);

router.use('/:id/reservations', reservationRoutes);

export default router;
