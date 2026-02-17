# Expense Tracker

A robust, production-grade personal finance application.

## Why MongoDB?

We chose MongoDB for this project because:
*   **Flexible Schema:** Expenses can vary (e.g., optional descriptions, future metadata), and MongoDB's document model handles this naturally without rigid migrations.
*   **JSON-Native:** Since our frontend (React) and backend (Node.js) both speak JSON, storing data as BSON (Binary JSON) in MongoDB eliminates the need for complex object-relational mapping (ORM).
*   **Speed & Scalability:** MongoDB is optimized for high write loads (logging expenses) and fast reads (filtering/sorting), making it ideal for real-time transaction tracking.

## Design Decisions & Trade-offs (4-Hour Timebox)

Given the tight 4-hour constraints, several strategic decisions were made to balance speed, quality, and robustness:

### Key Design Decisions
*   **Idempotency over Auth:** Prioritized robust API design (handling network retries/double-clicks via `Idempotency-Key`) over implementing full user authentication, as data integrity is critical for finance apps.
*   **Vanilla CSS Variables:** Used standard CSS variables for theming (Dark Mode) instead of setting up heavy UI libraries like Tailwind or Material UI. This reduced setup time while maintaining a premium look.
*   **Component-Centric UI:** Built reusable components (`ExpenseList`, `ExpenseForm`, `CategorySummary`) to allow parallel development and easy testing.
*   **MongoDB Atlas:** Chose a managed cloud database immediately to mimic a production environment rather than sticking to local-only databases.

### Trade-offs
*   **Single User Scope:** No authentication/login system was implemented. The app assumes a single-user environment.
*   **Basic State Management:** Used React `useState`/`useEffect` instead of Redux/Context API, which is sufficient for this scale but would need refactoring for larger apps.
*   **Integration Tests vs Unit Tests:** Focused on Backend Integration Tests (Supertest) to cover the most critical flows (API -> DB -> Response) rather than granular unit tests for every function.
*   **Alert-based Feedback:** Error handling often relies on simple text messages rather than a sophisticated toast notification system.

### Out of Scope & Future Improvements
*   **User Authentication:** Intentionally omitted for this single-user MVP. Future versions would include JWT-based login.
*   **Complex State Management:** React `useState` was sufficient; Redux or Context API were deemed over-engineered for this scale.
*   **Advanced Validation:** Relied on HTML5/Basic JS validation instead of heavy libraries like Zod or Joi to keep bundle size small.
*   **Date Range Filtering:** Focused on core "sort by date" functionality; range pickers would be a nice-to-have addition.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
  - *MongoDB is a flexible NoSQL database suitable for JSON-like data structures like expenses. Mongoose provides schema validation and easy interaction.*
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

### Deployment (Vercel)
1.  Push this repository to GitHub.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Import your repository.
4.  **Environment Variables**: Add your `MONGO_URI` in the Vercel project settings.
5.  **Build Command**: Vercel should automatically detect the configuration from `vercel.json`.
    - It uses the root `vercel.json` to deploy the frontend statically and the backend as a Serverless Function.
6.  Click **Deploy**!

## API Endpoints
- `POST /expenses`: Create expense. Headers: `Idempotency-Key` (required).
- `GET /expenses`: List expenses. Query: `category`, `sort=date_desc`.

## Folder Structure

```
ExpenseTracker/
├── backend/
│   ├── models/
│   │   ├── Expense.js        # Mongoose Schema for Expense
│   │   └── Idempotency.js    # Schema for idempotency keys
│   ├── tests/
│   │   └── expenses.test.js  # Integration (Supertest) tests
│   ├── .env                  # Environment variables (Mongo URI)
│   ├── routes.js             # API Routes (POST, GET, DELETE)
│   └── server.js             # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategorySummary.jsx  # Totals by category
│   │   │   ├── ExpenseForm.jsx      # Add expense form
│   │   │   └── ExpenseList.jsx      # List with sort/filter/delete
│   │   ├── App.jsx           # Main state & layout
│   │   ├── index.css         # Global styles & theming
│   │   └── main.jsx          # React entry point
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```
