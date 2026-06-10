import { Router } from 'express';
import { createReservation } from './reservation.controller';
import { validate } from '../../middleware/validation.middleware';
import { createDropSchema } from './reservation.validation';

const router = Router({ mergeParams: true });

router.route('/').post(validate(createDropSchema), createReservation);

export default router;
