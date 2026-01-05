# Pastebin Lite

A simple Pastebin-like web application where users can create text pastes, generate a shareable link, and view the content with optional expiration based on time or number of views.

This project was built as part of a take-home assignment and focuses on backend correctness and automated test compatibility.

---

## Features

- Create text pastes
- Generate shareable URLs
- View pastes via browser
- Optional TTL (time-based expiry)
- Optional max view limits
- Safe content rendering
- Health check endpoint

---

## Tech Stack

- Next.js (App Router)
- Node.js
- PostgreSQL (Neon)
- Vercel (Deployment)

---

## Persistence Layer

The application uses **PostgreSQL (Neon)** as the persistence layer.

This ensures:
- Data persistence across requests
- Compatibility with serverless environments
- Safe handling of view counts and TTL logic

---

## Running Locally

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database

### Steps

1. Clone the repository:
```bash
git clone <your-repository-url>
cd pastebin-lite

Install dependencies:

npm install


Create .env.local:

DATABASE_URL=your_neon_postgres_connection_string


Start the app:

npm run dev


Open in browser:

http://localhost:3000

API Endpoints
Health Check
GET /api/healthz

Create Paste
POST /api/pastes

Fetch Paste (API)
GET /api/pastes/:id

View Paste (HTML)
GET /p/:id

Design Decisions

View counts are updated atomically in the database

TTL is handled using timestamps

Deterministic time support is added for automated testing

UI is intentionally minimal

Notes

No secrets are committed

No hardcoded localhost URLs in production

Designed to pass automated tests


📌 Do **NOT** shorten this  
📌 Do **NOT** remove sections  

---

## 🔹 STEP 2: PUSH README TO GITHUB

After adding README:

```bash
git add README.md
git commit -m "Add README documentation"
git push