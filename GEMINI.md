# Project Setup & Workflow Notes for Gemini

This document contains setup and workflow instructions for the Gemini agent to work effectively with this project.

## Backend

The backend is a TypeScript/Express application using Drizzle ORM.

### Dependencies

To install dependencies, run `npm install` in the `backend` directory.

### Testing

The backend tests require a running PostgreSQL database. To run the tests:

1.  **Create Environment File:** (only if .env file doesn't exist) Create a `.env` file in the `backend` directory. You can copy `test.env.example` from the root directory as a starting point.
2.  **Configure Database URL:** Ensure the `backend/.env` file contains the following line:
    ```
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auto_order?schema=public
    ```
3.  **Start Database:** Start the PostgreSQL container by running `docker-compose up -d` in the `backend` directory. This uses the `backend/docker-compose.yml` file.
4.  **Run Tests:** Run the tests with `npm test` in the `backend` directory.
5.  **Stop Database:** After the tests are complete, stop the database container by running `docker-compose down` in the `backend` directory.

## Frontend

The frontend is a React application built with Vite and styled with Tailwind CSS.

### Dependencies

To install dependencies, run `npm install` in the `react` directory.

### Development

To start the development server, run `npm run dev` in the `react` directory.
