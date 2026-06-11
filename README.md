# ZuDrop Backend

Backend API for the **ZuDrop Limited Edition Sneaker Drop System**.

## Live API

Base URL:

https://zudrop-server.onrender.com

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Socket.IO
* TypeScript

## Features

* Atomic inventory reservations
* Real-time stock synchronization via WebSockets
* Automatic reservation expiration (60 seconds)
* Stock recovery for expired reservations
* Purchase validation and completion
* Activity feed showing the latest successful purchasers
* Merch Drop creation API

## Architecture Highlights

### Reservation Expiration

When a user reserves an item, the reservation remains active for **60 seconds**. A background expiration process automatically releases expired reservations and restores stock availability. Connected clients receive stock updates instantly through Socket.IO.

### Concurrency Protection

Overselling is prevented using **database transactions**. Even if multiple users attempt to reserve the last available item simultaneously, only one reservation can succeed.

## Create a New Merch Drop

**POST** `/api/drops`

Request Body:

```json
{
  "name": "Asics Gel-Kayano 14",
  "description": "Performance runner with retro Y2K aesthetic.",
  "price": 149.99,
  "availableStock": 65
}
```

Example:

```bash
curl -X POST https://zudrop-server.onrender.com/api/drops \
-H "Content-Type: application/json" \
-d '{
  "name": "Asics Gel-Kayano 14",
  "description": "Performance runner with retro Y2K aesthetic.",
  "price": 149.99,
  "availableStock": 65
}'
```

## Running Locally

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=8000
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
npm start
```

## Frontend

Live Application:

https://zudrop.vercel.app
