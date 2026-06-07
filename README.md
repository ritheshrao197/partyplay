# partyplay - Multiplayer Party Game Platform

partyplay is a real-time multiplayer party game platform where users can create rooms, invite friends, and play various social games together. The platform is built using a modern TypeScript stack, featuring a React frontend and a Node.js/Express backend, with Socket.IO for real-time communication.

## 🏗️ Architecture & Tech Stack

The project is structured as a monorepo containing both the client and server.

### Frontend (Client)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand
- **Styling**: Tailwind CSS, PostCSS, Framer Motion (for animations)
- **Real-time**: Socket.IO Client

### Backend (Server)

- **Runtime**: Node.js with Express
- **Language**: TypeScript (run with `tsx` in dev)
- **Real-time**: Socket.IO with Redis Adapter (for horizontal scaling)
- **Database**: PostgreSQL (using `pg` driver)
- **Caching & Pub/Sub**: Redis
- **Validation**: Zod
- **Auth**: JWT, bcryptjs

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (used in the client Docker container)

## 🎮 Available Games

The platform features a modular game engine supporting the following game modes:

1. **Imposter**: A deduction game similar to Spyfall / Among Us.
2. **Never Have I Ever**: A classic social party game.
3. **Word Rush**: A fast-paced word discovery/creation game.
4. **Wrong Answers Only**: A comedic party game where the goal is to give the funniest incorrect answer.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Docker & Docker Compose (for the easiest setup)

### Environment Setup

Copy the `.env.example` files to `.env` in both the root, client, and server directories (if applicable) and configure the variables.

### Running with Docker (Recommended)

You can spin up the entire stack (PostgreSQL, Redis, Server, and Client) using Docker Compose:

```bash
# Start all services
npm run docker:up

# Start only databases (useful for local development)
npm run docker:dev

# Stop all services
npm run docker:down
```

### Local Development (Without Docker)

If you prefer running the Node apps directly on your host machine (you still need Postgres and Redis running):

1. **Install Dependencies** (in root, client, and server):

   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

2. **Database Setup**:
   Ensure Postgres and Redis are running locally or via `npm run docker:dev`. Then run migrations and seeds:

   ```bash
   npm run migrate
   npm run seed
   ```

3. **Start Development Servers**:
   Run both client and server concurrently from the root directory:
   ```bash
   npm run dev
   ```

   - Client will be available at `http://localhost:5173` (or `3000` via Docker)
   - Server API will be available at `http://localhost:4000`

## 📂 Project Structure

```text
partyplay/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── games/          # Client-side logic and UI for specific games
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route components (Home, Login, Profile, Game)
│   │   ├── socket/         # Socket.IO client setup and listeners
│   │   └── store/          # Zustand state stores (auth, room, etc.)
│   ├── Dockerfile          # Multi-stage build with Nginx
│   └── nginx.conf          # Nginx configuration for serving the built app
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── database/       # DB connection (pg), Redis setup, migrations
│   │   ├── game-engine/    # Base game classes and specific game logic
│   │   ├── middleware/     # Express middlewares (auth, error handling)
│   │   ├── models/         # Data interfaces and DB interaction layers
│   │   ├── routes/         # Express API routes (e.g., auth)
│   │   ├── services/       # Business logic
│   │   ├── socket/         # Socket.IO event handlers and setup
│   │   └── types/          # Shared TypeScript definitions
│   └── Dockerfile          # Node.js production image
└── docker-compose.yml      # Service orchestration for local dev/prod
```

## 🔌 Socket.IO Events

Real-time interactions are powered by Socket.IO. The event contract is strictly typed in `server/src/types/index.ts`.

**Client-to-Server Events:**

- `room:create`, `room:join`, `room:leave`, `room:ready`, `room:start`
- `game:action`
- `chat:message`, `chat:typing`

**Server-to-Client Events:**

- `room:state`, `room:error`, `room:created`, `room:joined`, `room:left`
- `game:phase`, `game:state`, `game:timer`, `game:scores`, `game:ended`
- `chat:message`, `chat:typing`
- `presence:update`

## 🔒 Authentication & Users

- Supports Guest logins and persistent accounts (Google OAuth planned/supported).
- Users have levels, XP, and customizable avatars.
- Friend system included (pending, accepted, rejected statuses).

## 📜 Scripts

Available npm scripts in the root directory:

- `npm run dev`: Concurrently run client and server in dev mode.
- `npm run build`: Build both client and server.
- `npm run docker:up`: Start all Docker services.
- `npm run docker:down`: Stop all Docker services.
- `npm run seed`: Seed the database with initial data.
- `npm run migrate`: Run database migrations.
