# SmartCard Platform Architecture

This document describes the systems and data flows of the SmartCard SaaS application.

## System Topology

```
                  +---------------------+
                  |   Next.js Frontend  | (Port 3000)
                  +----------+----------+
                             |
                             | HTTP/REST Requests
                             v
                  +---------------------+
                  | Express.js Backend  | (Port 5000)
                  +-----+----+----+-----+
                        |    |    |
       +----------------+    |    +---------------+
       |                     |                    |
       v                     v                    v
+--------------+      +--------------+     +--------------+
|   MongoDB    |      |    Redis     |     |  Cloudinary  |
|  (Database)  |      |   (Cache)    |     | (Asset CDN)  |
+--------------+      +--------------+     +--------------+
```

## Architectural Guidelines

### 1. Separation of Concerns
- The **Frontend** next.js application remains visual-only, consuming data via the REST API endpoints.
- The **Backend** Express application encapsulates business logic in **Services**, data fetching in **Repositories**, and keeps **Controllers** slim and non-blocking.

### 2. Caching Strategy
- Redis stores rate-limit registers, temporary OTP codes, and caches slow query operations (e.g. analytics graphs) for 5 minutes.
- Databases should not be queried repeatedly for identical read payloads.

### 3. Background Queues
- BullMQ coordinates transactional mails, geolocation parsing, and database analytics aggregation outside the main HTTP server thread.
