import { ReservationStatus } from '../../generated/prisma/enums';
import { client } from '../../prisma/client';
import { emitStockEvent } from '../../config/socket';

const DEFAULT_SWEEP_INTERVAL_MS = 5_000;

type ExpiredReservationResult = {
  reservationId: string;
  drop: Awaited<ReturnType<typeof client.drop.update>>;
};

const expireReservationById = async (reservationId: string, now = new Date()) => {
  const result = await client.$transaction(async (txClient) => {
    const reservation = await txClient.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        dropId: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!reservation) {
      return null;
    }

    if (reservation.status !== ReservationStatus.ACTIVE || reservation.expiresAt > now) {
      return null;
    }

    const updatedReservation = await txClient.reservation.updateMany({
      where: {
        id: reservationId,
        status: ReservationStatus.ACTIVE,
        expiresAt: { lte: now },
      },
      data: {
        status: ReservationStatus.EXPIRED,
      },
    });

    if (updatedReservation.count === 0) {
      return null;
    }

    const updatedDrop = await txClient.drop.update({
      where: { id: reservation.dropId },
      data: {
        availableStock: {
          increment: 1,
        },
      },
    });

    return {
      reservationId: reservation.id,
      drop: updatedDrop,
    } satisfies ExpiredReservationResult;
  });

  if (!result) {
    return null;
  }

  emitStockEvent({
    action: 'expired',
    drop: result.drop,
  });

  return result;
};

export const sweepExpiredReservations = async (now = new Date()) => {
  const expiredReservations = await client.reservation.findMany({
    where: {
      status: ReservationStatus.ACTIVE,
      expiresAt: { lte: now },
    },
    select: { id: true },
    orderBy: { expiresAt: 'asc' },
  });

  const processed: ExpiredReservationResult[] = [];

  for (const reservation of expiredReservations) {
    try {
      const result = await expireReservationById(reservation.id, now);
      if (result) {
        processed.push(result);
      }
    } catch (error) {
      console.error(`Failed to expire reservation ${reservation.id}`, error);
    }
  }

  return processed;
};

export const startReservationExpirySweeper = () => {
  let inFlight = false;
  let timer: NodeJS.Timeout | null = null;

  const runSweep = async () => {
    if (inFlight) {
      return;
    }

    inFlight = true;

    try {
      await sweepExpiredReservations();
    } catch (error) {
      console.error('Failed to sweep expired reservations', error);
    } finally {
      inFlight = false;
    }
  };

  const start = async () => {
    await runSweep();

    timer = setInterval(
      () => {
        void runSweep();
      },
      Number(process.env.RESERVATION_SWEEP_INTERVAL_MS ?? DEFAULT_SWEEP_INTERVAL_MS),
    );
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  return {
    start,
    stop,
    runSweep,
  };
};

export const expireReservation = expireReservationById;
