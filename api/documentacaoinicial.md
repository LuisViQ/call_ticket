API

Types

User
-> { id: number, name: string, email: string, created_at: string }

LoginInput
-> { email: string, password: string }

LoginOutput
-> { user: User, token: string }

Ticket
-> { id: number, user_id: number, description: string, status: TicketStatus, ticket_type: TicketType | null, area_type: AreaType | null, created_at: string, updated_at: string }

TicketStatus
-> "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO"

TicketType
-> string

AreaType
-> string

TicketRow
-> { id: number, description: string, status: TicketStatus, ticket_type: TicketType | null, area_type: AreaType | null }

ErrorResponse
-> { ok: false, error: string }

Base: /api

Health

GET /health testa se o servidor está no ar
-> { "ok": true, "data": "ok" }

Database

GET /db testa se a conexão foi bem sucedida
-> { "ok": true, "data": { "alive": 1 } }

Auth

POST /auth/login faz o login do uruário
Body: { "email": "user@example.com", "password": "secret" }
-> { "ok": true, "data": { "user": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" }, "token": "..." } }

GET /auth/me faz uma verificação do token
Header: Authorization: Bearer <token>
-> { "ok": true, "data": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" } }

Tickets

GET /tickets/:id retorna todos os tickets do usuário enviado pelo parametro.
-> { "ok": true, "data": [TicketRow] }

POST /tickets cria um novo ticket para o usuário enviado pelo Header
Header: Authorization: Bearer <token>
Body: { "description": "Sem internet", "status": "AGUARDANDO", "ticket_type": "SUPORTE", "area_type": "TI", "url": "https://exemplo.com/foto.jpg" }
-> { "ok": true, "data": { "id": 123 } }

PATCH /tickets/:id edita um ticket já criado, se localiza pelo id enviado pelo URL e pelo Header
Header: Authorization: Bearer <token>
Body: { "status": "EM_ATENDIMENTO", "description": "Ainda esta lento", "ticket_type": "SUPORTE", "area_type": "TI" }
-> { "ok": true, "data": { "updated": true } }
