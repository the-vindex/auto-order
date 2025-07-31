# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Timely Buyer is a full-stack web application that helps users track product prices and receive notifications when items go on sale. Users can create product reminders with target prices and get notified via email when prices drop below their threshold.

**Tech Stack:**
- Backend: Node.js + Express.js + TypeScript
- Frontend: React + Vite + Tailwind CSS  
- Database: PostgreSQL with Drizzle ORM
- Testing: Vitest (backend), Playwright (frontend E2E)
- Containerization: Docker

## Project Structure

```
auto-order/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── api/       # API routes and handlers
│   │   ├── auth/      # Authentication logic
│   │   ├── db/        # Database schema and queries
│   │   ├── jobs/      # Background jobs (price scraping, notifications)
│   │   └── notifier/  # Email notification service
│   └── test/          # Backend tests (unit, integration, E2E)
├── react/             # React frontend
│   ├── src/           # React components and pages
│   └── tests/         # Playwright E2E tests
└── documentation/     # Project docs and requirements
```

## Common Development Commands

### Backend Development
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start development server (port 3000)
npm test                # Run all tests with Vitest
npm run build           # Build TypeScript to dist/
npm run generate        # Generate Drizzle migrations
npm run type-check      # Run TypeScript type checking
```

### Frontend Development  
```bash
cd react
npm install              # Install dependencies
npm run dev             # Start Vite dev server (port 5173)
npm run build           # Build for production
npm run lint            # Run ESLint
npm test:e2e            # Run Playwright E2E tests
```

### Full Stack Development
```bash
./dev.sh                # Start both backend + frontend + database
./start-stop.sh --test  # Start full application with Docker
```

### Database Management
```bash
cd backend
docker-compose up -d    # Start PostgreSQL container
docker-compose down     # Stop PostgreSQL container
```

## Architecture Details

### Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Auth middleware protects API routes: `backend/src/api/middleware.ts:9`
- User sessions managed via cookies with `authMiddleWare`

### Database Layer
- **Schema**: Defined in `backend/src/db/schema.ts` using Drizzle ORM
- **Queries**: Organized in `backend/src/db/queries/` by domain
- **Migrations**: Generated with `npm run generate`, stored in `backend/drizzle/`

### API Structure
- **Routes**: Defined in `backend/src/server.ts:22` using Express Router
- **Validation**: JSON Schema validation via `validateWithSchema` middleware
- **Contracts**: API schemas in `backend/contracts/` (login, product_reminder)

### Frontend Architecture
- **Routing**: React Router for client-side routing
- **State**: React Query for server state management
- **UI**: Radix UI components with Tailwind CSS styling
- **Auth**: Protected routes via `RequireAuth` component

### Background Jobs
- **Price Scraping**: `backend/src/jobs/scrapeprices.ts` - Uses Puppeteer to scrape Amazon prices
- **Email Notifications**: `backend/src/jobs/sendreminders.ts` - Sends alerts via Resend API
- **Scheduling**: node-cron for periodic job execution

### Testing Strategy
- **Backend**: Vitest for unit/integration tests in `backend/test/`
- **Frontend**: Playwright for E2E tests in `react/tests/`
- **Test Environment**: Uses separate test database and environment files

## Key Configuration Files
- `backend/drizzle.config.ts` - Database connection and migration config
- `react/playwright.config.ts` - E2E test configuration with auth state
- Environment files: `.env.example`, `test.env.example`, `production.env.example`

## Development Notes
- The application requires PostgreSQL running (via Docker or locally)
- Puppeteer setup needed for price scraping - run `npx puppeteer install`
- Email notifications require Resend API key in environment
- E2E tests use authenticated sessions stored in `react/.auth/user.json`