# SmartCard Frontend

The frontend user interface for SmartCard, built as a modern, high-fidelity Next.js application using React, TailwindCSS, and Lucide React icons.

## Folder Explanation

- **`components/`**: Reusable page components (e.g., iPhone visualizers, forms, interactive widgets).
- **`src/app/`**: Next.js App Router folders defining routes, layouts, and page views.
- **`public/`**: Static assets, brand icons, and favicons.
- **`lib/`**: Helpers, API connection clients, and integrations.

## Getting Started

### Local Setup
1. Move to the directory:
   ```bash
   cd frontend
   ```
2. Install the node modules:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the local server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### Docker Execution
To compile and test the Next.js container separately:
```bash
# Build image
docker build -t smartcard-frontend .

# Start container
docker run -p 3000:3000 smartcard-frontend
```
Alternatively, launch via the root `docker-compose.yml`.
