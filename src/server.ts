import 'dotenv/config';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import app from './app';
import { allowedOrigins } from './config/cors';
import { initializeSocket } from './config/socket';
import { startReservationExpirySweeper } from './modules/reservation/reservation-expiry.service';

const PORT = Number(process.env.PORT ?? 8000);

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

initializeSocket(io);

const reservationExpirySweeper = startReservationExpirySweeper();

const startServer = () => {
  httpServer.listen(PORT, () => {
    console.log(`Zudrop Server running on port ${PORT}`);
  });
};

const shutdown = (signal: string) => {
  console.log(`${signal} received. Shutting down server...`);

  reservationExpirySweeper.stop();

  io.close(() => {
    httpServer.close(() => {
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

void (async () => {
  await reservationExpirySweeper.start();
  startServer();
})();
