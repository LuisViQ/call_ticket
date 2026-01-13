API

Types

User
-> { id: number, name: string, email: string, created_at: string }

LoginInput
-> { email: string, password: string }

LoginOutput
-> { user: User, token: string }

Ticket
-> { id: number, user_id: number, title: string, description: string, status: TicketStatus, ticket_type: TicketType | null, area_type: AreaType | null, created_at: string, updated_at: string }

TicketStatus
-> "AGUARDANDO" | "EM_ATENDIMENTO" | "CANCELADO" | "ENCERRADO"

TicketType
-> { id: number, name: string }

AreaType
-> { id: number, name: string }

TicketRow
-> { id: number, title: string, description: string, status: TicketStatus, ticket_type: TicketType | null, area_type: AreaType | null, attachments: TicketAttachment[] }

TicketAttachment
-> { id: number, ticket_id: number, file_url: string, file_type: string }

ErrorResponse
-> { ok: false, error: string }

Base: /api

Health

GET /health testa se o servidor esta no ar
-> { "ok": true, "data": "ok" }

Database

GET /db testa se a conexao foi bem sucedida
-> { "ok": true, "data": { "alive": 1 } }

Auth

POST /auth/login faz o login do usuario
Body: { "email": "user@example.com", "password": "secret" }
-> { "ok": true, "data": { "user": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" }, "token": "..." } }

GET /auth/me faz uma verificacao do token
Header: Authorization: Bearer <token>
-> { "ok": true, "data": { "id": 1, "name": "User", "email": "user@example.com", "created_at": "2026-01-06T12:00:00.000Z" } }

Tickets

GET /tickets/:id retorna todos os tickets do usuario enviado pelo parametro.
-> { "ok": true, "data": [TicketRow] }
Obs: attachments[].file_url e o caminho da imagem.

POST /tickets cria um novo ticket para o usuario enviado pelo Header
Header: Authorization: Bearer <token>
Body: { "title": "Sem internet", "description": "Sem internet desde ontem", "status": "AGUARDANDO", "ticket_type_id": 1, "area_type_id": 2, "url": "https://exemplo.com/foto.jpg" }
Obs: url e opcional e quando informado salva em ticket_attachments.
-> { "ok": true, "data": { "id": 123 } }

PATCH /tickets/:id edita um ticket ja criado, se localiza pelo id enviado pelo URL e pelo Header
Header: Authorization: Bearer <token>
Body: { "status": "EM_ATENDIMENTO", "title": "Ainda sem internet", "description": "Ainda esta lento", "ticket_type_id": 1, "area_type_id": 2 }
-> { "ok": true, "data": { "updated": true } }

Ticket Types

GET /ticket-types retorna todos os tipos de ticket cadastrados
Header: Authorization: Bearer <token>
-> { "ok": true, "data": [TicketType] }

Area Types

GET /area-types retorna todas as areas cadastradas
Header: Authorization: Bearer <token>
-> { "ok": true, "data": [AreaType] }

Uploads

POST /uploads faz upload de imagem e salva localmente em ticket_attachments
Header: Authorization: Bearer <token>
Body: multipart/form-data com campo "image"
Obs: use o url retornado no campo url do ticket.
-> { "ok": true, "data": { "filename": "uuid.jpg", "originalName": "foto.jpg", "mimetype": "image/jpeg", "size": 12345, "path": "ticket_attachments/uuid.jpg", "url": "/ticket_attachments/uuid.jpg" } }
