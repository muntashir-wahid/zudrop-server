import { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import * as reservationService from './reservation.service';

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const dropId = req.params.id as string;
  const username = req.body.username as string;

  const data = await reservationService.createReservation({ dropId, username });
  successResponse(res, data, 201);
});
