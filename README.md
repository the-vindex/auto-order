# Auto-Order alias Timely Buyer (tm) - Product Reminder and Ordering App

## 1. Introduction

Auto-Order is an application designed to help users manage product reminders and potentially automate ordering processes. It consists of a backend API and a React frontend.

## 2. Tech Stack

*   **Backend:** Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL
*   **Frontend:** React, Vite
*   **Database:** PostgreSQL
*   **Containerization:** Docker, Docker Compose

## 3. How to Start in Production

To run the application in a production-like Dockerized environment:

1.  Ensure Docker is installed and running.
2.  Navigate to the project root directory:
    ```bash
    cd auto-order
    ```
3.  Create jwt.secret file with JWT_TOKEN=your_secret_key
    ```bash
    echo JWT_TOKEN=your_secret_key > jwt.secret
    ```
4Start the services using the production Docker Compose file. This will build images, set up the database, run migrations, and start the backend server.
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
    The backend will be accessible on `http://localhost:3000`.
    TODO: The frontend will be accessible on `http://localhost:5173`.

5.  To stop the services, run:
    ```bash 
    docker-compose -f docker-compose.prod.yml down
    ```

## 4. How to Setup Development Environment

### Backend Development

1.  Navigate to the backend directory:
    ```bash
    cd auto-order/backend
    ```
2.  Create a `.env` file from the example. This file will hold your local environment variables, including the database URL and JWT secret.
    ```bash
    cp .env.example .env
    # Edit .env with your local database connection string and JWT_SECRET
    ```
3.  Install backend dependencies:
    ```bash
    npm install
    ```
4.  Start the backend in development mode:
    ```bash
    npm run dev
    ```
    The backend will run on `http://localhost:3000` (or the port specified in your `.env`).

### Frontend Development

1.  Navigate to the React frontend directory:
    ```bash
    cd auto-order/react
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will typically run on `http://localhost:5173`.
