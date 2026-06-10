import { client } from '../../prisma/client';

type CreateReservationBody = {
  dropId: string;
  userId: string;
};

export const createReservation = async (body: CreateReservationBody) => {
  const { dropId, userId } = body;

  return body;
};
