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
-> { id: number, description: string, status: TicketStatus, ticket_type: TicketType | null, area_type: AreaType | null, attachments: TicketAttachment[] }

TicketAttachment
-> { id: number, ticket_id: number, file_url: string, file_type: string }

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
Obs: attachments[].file_url e o caminho da imagem.

POST /tickets cria um novo ticket para o usuário enviado pelo Header
Header: Authorization: Bearer <token>
Body: { "description": "Sem internet", "status": "AGUARDANDO", "ticket_type": "SUPORTE", "area_type": "TI", "url": "https://exemplo.com/foto.jpg" }
Obs: url e opcional e quando informado salva em ticket_attachments.
-> { "ok": true, "data": { "id": 123 } }

PATCH /tickets/:id edita um ticket já criado, se localiza pelo id enviado pelo URL e pelo Header
Header: Authorization: Bearer <token>
Body: { "status": "EM_ATENDIMENTO", "description": "Ainda esta lento", "ticket_type": "SUPORTE", "area_type": "TI" }
-> { "ok": true, "data": { "updated": true } }

Uploads

POST /uploads faz upload de imagem e salva localmente em ticket_attachments
Header: Authorization: Bearer <token>
Body: multipart/form-data com campo "image"
Obs: use o url retornado no campo url do ticket.
-> { "ok": true, "data": { "filename": "uuid.jpg", "originalName": "foto.jpg", "mimetype": "image/jpeg", "size": 12345, "path": "ticket_attachments/uuid.jpg", "url": "/ticket_attachments/uuid.jpg" } }
