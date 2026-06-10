import { ReservationStatus } from '../../generated/prisma/enums';
import { expireReservation } from '../reservation/reservation-expiry.service';
import { client } from '../../prisma/client';
import { AppError } from '../../utils/errors';
import { CreatePurchaseBody } from './purchases.validation';

export const createPurchase = async (body: CreatePurchaseBody) => {
  const { dropId, username } = body;

  const drop = await client.drop.findUnique({
    where: { id: dropId, isActive: true, availableStock: { gt: 0 } },
  });

  if (!drop) {
    throw new AppError('Drop not found or not available', 404);
  }

  const activeReservation = await client.reservation.findFirst({
    where: {
      dropId,
      user: { username },
      status: ReservationStatus.ACTIVE,
    },
  });

  if (!activeReservation) {
    throw new AppError('No active reservation found for this user and drop', 400);
  }

  const now = new Date();
  if (activeReservation.expiresAt < now) {
    await expireReservation(activeReservation.id, now);

    throw new AppError('The reservation has expired', 400);
  }

  const user = await client.user.findUnique({ where: { username } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const result = await client.$transaction(async (prisma) => {
    await prisma.reservation.update({
      where: { id: activeReservation.id },
      data: { status: ReservationStatus.COMPLETED },
    });

    const purchase = await prisma.purchase.create({
      data: {
        dropId,
        userId: user.id,
      },
    });

    return purchase;
  });

  return result;
};
