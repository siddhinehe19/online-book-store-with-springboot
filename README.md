# Siddhi's Bookstore

A responsive full-stack online bookstore built with React, Spring Boot, and MySQL.

## Features
- Professional responsive storefront
- Book search and category filtering
- Book details
- User registration and login
- JWT authentication
- Shopping cart
- Checkout/order creation
- My Orders page
- REST APIs with Spring Boot
- MySQL persistence
- Form validation and error handling

## Tech Stack
Frontend: React + Vite + React Router + Axios + Lucide React  
Backend: Spring Boot + Spring Data JPA + Spring Security + JWT  
Database: MySQL

## Run locally

### 1. Database
Create a MySQL database:

```sql
CREATE DATABASE dhanshris_bookstore;
```

### 2. Backend
Configure the backend environment variables before starting it:

- `DB_URL` (optional; defaults to the local `dhanshris_bookstore` database URL)
- `DB_USERNAME` (optional; defaults to `root`)
- `DB_PASSWORD` (optional; defaults to an empty password)
- `JWT_SECRET` (required; use a private random secret of at least 32 bytes)

Then run:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

The frontend expects the backend at `http://localhost:8080/api`.
