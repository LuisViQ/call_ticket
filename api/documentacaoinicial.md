API

Base: /api

Health

GET /health
-> { "data": "ok" }

Database

GET /db
-> { "data": { "alive": 1 } }

Auth

POST /auth/login
Body: { "email": "user@example.com", "password": "secret" }
-> { "data": { "user": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" }, "token": "..." } }

GET /auth/me
Header: Authorization: Bearer <token>
-> { "data": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" } }

Tickets

GET /tickets
-> 501 Not implemented
