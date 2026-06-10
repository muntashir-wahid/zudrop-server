import { ReservationStatus } from '../../generated/prisma/enums';
import { emitStockEvent } from '../../config/socket';
import { client } from '../../prisma/client';
import { AppError } from '../../utils/errors';

type CreateReservationBody = {
  dropId: string;
  username: string;
};

export const createReservation = async (body: CreateReservationBody) => {
  const { dropId, username } = body;

  const drop = await client.drop.findUnique({
    where: { id: dropId },
    select: { id: true, availableStock: true },
  });

  if (!drop) {
    throw new AppError('Drop not found', 404);
  }

  if (drop.availableStock <= 0) {
    throw new AppError('Drop is out of stock', 409);
  }

  let reservationUser = await client.user.findUnique({
    where: { username },
    select: { id: true },
  });

  try {
    const result = await client.$transaction(async (txClient) => {
      if (!reservationUser) {
        reservationUser = await txClient.user.create({
          data: { username },
        });
      }

      const existingReservation = await txClient.reservation.findFirst({
        where: {
          userId: reservationUser.id,
          dropId,
          status: ReservationStatus.ACTIVE,
          expiresAt: { gt: new Date() },
        },
      });

      if (existingReservation) {
        throw new AppError('User already has an active reservation for this drop', 409);
      }

      const reservation = await txClient.reservation.create({
        data: {
          dropId,
          userId: reservationUser.id,
          status: ReservationStatus.ACTIVE,
          expiresAt: new Date(Date.now() + 1 * 60 * 1000), // 1 minutes from now
        },
      });

      const updatedDrop = await txClient.drop.update({
        where: { id: dropId },
        data: { availableStock: { decrement: 1 } },
      });

      return { reservation, updatedDrop };
    });

    emitStockEvent({
      action: 'reserved',
      drop: result.updatedDrop,
    });

    return result.reservation;
  } catch (error) {
    throw new AppError(
      error instanceof AppError ? error.message : 'Failed to create reservation',
      error instanceof AppError ? error.statusCode : 500,
    );
  }
};
