# Backend Service

This document explains how to set up and run the backend service, including database setup, running the server, and testing.

## Database Setup (PostgreSQL with Docker Compose)

To run the PostgreSQL database required for this service, you can use Docker Compose. Ensure you have Docker and Docker Compose installed on your system.

1.  **Navigate to backend module:**
    ```bash
    cd backend
    ```

2.  **Start the PostgreSQL container:**
    The `docker-compose.yml` file in the project root defines the PostgreSQL service. Run the following command to start it:
    ```bash
    docker-compose up -d
    ```
    This will start the PostgreSQL container in the background.

3.  **Verify database connection string:**
    Ensure your `backend/.env` file has the correct `DATABASE_URL` for the Dockerized PostgreSQL. A typical value might be:
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auto_order"
    ```
    (Adjust `postgres:postgres` if you've changed the user/password in `docker-compose.yml`, and `auto_order` for the database name if different).

4.  **Run Drizzle Migrations:**
    Once the database is running, apply the Drizzle ORM migrations to create the necessary tables:
    ```bash
    cd backend
    npm run migrate
    ```

## Running the Node.js Server

To start the backend server in development mode (with `ts-node` for live reloading):

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies (if you haven't already):**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm run dev
    ```
    The server should start on `http://localhost:3000` (or the port specified in your `.env` file).

## Running Automatic Tests

This project uses Vitest for automated testing.

1.  **Ensure the database is running** (as described in "Database Setup").

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Run the tests:**
    ```bash
    npm test
    ```

## Manual API Testing (with cURL)

Once the server is running, you can manually test the API endpoints using `curl`.

1.  **Create a new user (POST request):**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"fullName": "Jane Doe"}' http://localhost:3000/users
    ```

2.  **Get all users (GET request):**
    ```bash
    curl http://localhost:3000/users
    ```
