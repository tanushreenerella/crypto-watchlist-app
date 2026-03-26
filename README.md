# Crypto Watchlist App

A full-stack application that allows users to securely manage a crypto watchlist with real-time pricing.

---

## Live Demo

Frontend: https://crypto-watchlist-app-bice.vercel.app/
Backend: https://your-backend-url.onrender.com

---

## Overview

Users can:

* Register & login securely 
* Add/remove cryptocurrencies 
* Track real-time prices via API 

---

## ⚙️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite (can be replaced with PostgreSQL)
* JWT Authentication
* Pydantic

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Axios

---

## Features

### Authentication

* User Registration & Login
* JWT-based authentication
* Password hashing (bcrypt)

### Watchlist

* Add coins
* View watchlist
* Delete coins
* Real-time price fetching (CoinGecko API)

### Security

* Protected routes
* Role-based access (admin)
* Input validation

---

## API Endpoints

### Auth

* `POST /api/v1/auth/register`
* `POST /api/v1/auth/login`

### Watchlist

* `GET /api/v1/watchlist/`
* `POST /api/v1/watchlist/add`
* `DELETE /api/v1/watchlist/{id}`

---

## Setup Instructions

### Clone the repo

```bash
git clone https://github.com/your-username/crypto-watchlist-app.git
cd crypto-watchlist-app
```

---

## Backend Setup

```bash
cd crypto-backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on: http://127.0.0.1:8000

---

## Frontend Setup

```bash
cd crypto-frontend
npm install
npm run dev
```

Runs on: http://localhost:3000

---

## Running Tests

```bash
pytest
```

---

## Deployment

* Frontend → Vercel
* Backend → Render

---

## Preview

Screenshots
![Dashboard](./screenshot.png)

🚀 Scalability Note

The system is built using a modular architecture with clear separation of concerns, making it easy to scale and extend. API versioning (/api/v1) ensures backward compatibility.
For scalability, caching (Redis), database optimization (PostgreSQL with indexing), and horizontal scaling using containers and load balancing can be introduced. External API calls can be optimized using asynchronous processing and retries.
The frontend is decoupled from the backend, enabling independent scaling and deployment.
