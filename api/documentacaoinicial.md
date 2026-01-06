API

Base: /api

Health

GET /health
-> { "data": "Funcionando" }

Database

GET /db
-> { "data": { "alive": 1 } }

Auth

POST /auth/login
Body: { "email": "user@example.com", "password": "secret" }
-> { "data": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" } }

GET /auth/me
-> 501 Not implemented

Tickets

GET /tickets
-> 501 Not implemented

Types
-> UserResponse { id, name, email, created_at }
