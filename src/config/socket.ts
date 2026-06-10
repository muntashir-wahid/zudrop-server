import { Server as SocketIOServer } from 'socket.io';

export const SOCKET_EVENTS = {
  STOCK: 'stock',
} as const;

export type StockEventPayload = {
  action: 'created' | 'reserved' | 'expired';
  drop: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    availableStock: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date | null;
  };
};

let io: SocketIOServer | null = null;

export const initializeSocket = (socketServer: SocketIOServer) => {
  io = socketServer;

  socketServer.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // Keep the socket layer lightweight; no extra cleanup is required here yet.
    });
  });
};

export const emitStockEvent = (payload: StockEventPayload) => {
  if (!io) {
    return;
  }

  io.emit(SOCKET_EVENTS.STOCK, payload);
};
