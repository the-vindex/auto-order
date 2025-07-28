# Auto-Order alias Timely Buyer (tm) - Product Reminder and Ordering App
Track sales on your favorite items, all in one place!
TODO: ADD AN IMAGE OF THE SITE HERE

## Motivation

Online shoppers often come across products they want but prefer to wait for a sale before purchasing. This project was built to centralize and track those "wait-for-a-sale" items in one place. Users can register products, set a target price, and receive a notification when the item's price drops below their specified threshold — helping them buy at the right time without constantly checking for deals.

## Quick Start

### (OPTIONAL) Set Up Resend Account

To receive email notifications in development, a resend api key is needed. Go to resend.com, create an account, and get an API key. Use this api key in your .env file, as RESEND_API_KEY. Ensure the email you use when tseting this app is the same one you use to create your resend account.

### Database Setup

1.  Navigate to the backend directory:


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
3.  Start the database with docker compose:
   ```bash
   docker compose up -d
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

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** React
*   **Database:** PostgreSQL
*   **Containerization:** Docker

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
4.  Start the services using the production Docker Compose file. This will build images, set up the database, run migrations, and start the backend server.
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d
    ```
    The backend will be accessible on `http://localhost:3000`.
    TODO: The frontend will be accessible on `http://localhost:5173`.

5.  To stop the services, run:
    ```bash 
    docker-compose -f docker-compose.prod.yml down
    ```
