# Expense Tracker

A simple, robust personal finance tool built with a "production-like" mindset.

## Why MongoDB?

We chose MongoDB for this project because:
*   **Flexible Schema:** Expenses can vary (e.g., optional descriptions, future metadata), and MongoDB's document model handles this naturally without rigid migrations.
*   **JSON-Native:** Since our frontend (React) and backend (Node.js) both speak JSON, storing data as BSON (Binary JSON) in MongoDB eliminates the need for complex object-relational mapping (ORM).
*   **Speed & Scalability:** MongoDB is optimized for high write loads (logging expenses) and fast reads (filtering/sorting), making it ideal for real-time transaction tracking.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
  - *Choice Rationale*: Originally planned for SQLite, but switched to MongoDB as per request. MongoDB is a flexible NoSQL database suitable for JSON-like data structures like expenses. Mongoose provides schema validation and easy interaction.
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (Custom properties, responsive, dark mode)

## Features
- Create expenses (Amount, Category, Description, Date)
- List expenses with filtering by category and sorting by date
- Idempotency handling for reliable expense creation (prevents duplicates on retry)
- Responsive UI

## Setup

### Prerequisites
- Node.js
- MongoDB running locally or a connection string

### Backend
1.  Navigate to `backend`: `cd backend`
2.  Install dependencies: `npm install`
3.  Create `.env` file (optional, defaults to local mongo):
    ```
    MONGO_URI=mongodb://localhost:27017/expense-tracker
    PORT=5000
    ```
4.  Start server: `npm start` (or `npm run dev` for nodemon)
5.  Run tests: `npm test`

### Frontend
1.  Navigate to `frontend`: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`

## API Endpoints
- `POST /expenses`: Create expense. Headers: `Idempotency-Key` (required).
- `GET /expenses`: List expenses. Query: `category`, `sort=date_desc`.
