# SmartCard SaaS Platform

SmartCard is an enterprise-grade digital visiting card platform. This repository contains the complete monorepo layout:
- `/frontend`: Next.js single-page application.
- `/backend`: Scalable Express.js / TypeScript feature-based modular API.



## Folder Layout

```
SmartCard/
├── frontend/             # Next.js UI client
├── backend/              # Node.js API services
├── docs/                 # Platform specifications & architecture
├── docker-compose.yml    # Main multi-container composer definition
└── .gitignore            # Monorepo level ignores
```

---

## Local Development Setup

To run services locally:

### 1. Prerequisite Checklist
- Install [Node.js (v20+)](https://nodejs.org)
- Start a local [MongoDB](https://www.mongodb.com/) instance
- Start a local [Redis](https://redis.io/) instance

### 2. Startup Steps

#### Start the Backend API
1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Copy environment overrides and install modules:
   ```bash
   cp .env.example .env
   npm install
   ```
3. Boot development server:
   ```bash
   npm run dev
   ```

#### Start the Frontend UI
1. Open a new shell and navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Setup overrides and install modules:
   ```bash
   cp .env.example .env.local
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

---

## Run via Docker Compose

To boot the entire stack (Frontend, Backend, Database, and Cache) using single command orchestrations:

1. Copy env templates:
   ```bash
   cp .env.example .env
   ```
2. Boot docker-compose stack:
   ```bash
   docker-compose up --build
   ```
   This will spin up:
   - **MongoDB** on `mongodb://localhost:27017`
   - **Redis** on `redis://localhost:6379`
   - **Backend API** on `http://localhost:5000`
   - **Frontend UI** on `http://localhost:3000`
