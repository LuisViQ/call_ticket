API

Types

User
-> { id: number, name: string, email: string, created_at: string }

LoginInput
-> { email: string, password: string }

LoginOutput
-> { user: User, token: string }

Ticket
-> { id: number, user_id: number, description: string, status: TicketStatus, created_at: string, updated_at: string }

TicketStatus
-> "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO"

TicketRow
-> { id: number, description: string, status: TicketStatus }

ErrorResponse
-> { ok: false, error: string }

Base: /api

Health

GET /health
-> { "ok": true, "data": "ok" }

Database

GET /db
-> { "ok": true, "data": { "alive": 1 } }

Auth

POST /auth/login
Body: { "email": "user@example.com", "password": "secret" }
-> { "ok": true, "data": { "user": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" }, "token": "..." } }

GET /auth/me
Header: Authorization: Bearer <token>
-> { "ok": true, "data": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" } }

Tickets

GET /tickets
Header: Authorization: Bearer <token>
-> { "ok": true, "data": [TicketRow] }

POST /tickets
Header: Authorization: Bearer <token>
Body: { "description": "Sem internet", "status": "AGUARDANDO", "url": "https://exemplo.com/foto.jpg" }
-> { "ok": true, "data": { "id": 123 } }

PATCH /tickets/:id
Header: Authorization: Bearer <token>
Body: { "status": "EM_ATENDIMENTO", "description": "Ainda esta lento" }
-> { "ok": true, "data": { "updated": true } }
