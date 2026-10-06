# SmartCard Backend

Enterprise-grade, production-ready, feature-based modular backend for the SmartCard SaaS platform, built using Node.js, Express, TypeScript, MongoDB, and Redis.

## Folder Explanation

- **`src/config/`**: Dynamic config variables with Zod validation.
- **`src/database/`**: Mongoose connections and database seeds.
- **`src/lib/`**: SDK client connectors (Redis, Mongoose, Pino, Cloudinary, BullMQ).
- **`src/middlewares/`**: Security middlewares (rateLimiters, authentication, RBAC, validators).
- **`src/errors/`**: Centralized custom application errors.
- **`src/repositories/`**: Mongoose Generic Base Repository.
- **`src/modules/`**: Modular logic representing features. Each folder contains its own models, repositories, services, controllers, validations, and routes.
- **`src/validators/`**: App-wide schema checkers.
- **`src/events/`**, **`src/jobs/`**, **`src/queues/`**: Background jobs and async processing pipelines (via BullMQ).
- **`src/auth/`**, **`src/permissions/`**: Helper scopes for access validation.

## Getting Started

### Local Setup
1. Move to the directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start local development watcher:
   ```bash
   npm run dev
   ```

### Docker Execution
To compile and test the Node container separately:
```bash
# Build image
docker build -t smartcard-backend .

# Start container
docker run -p 5000:5000 smartcard-backend
```
Alternatively, launch via the root `docker-compose.yml`.
