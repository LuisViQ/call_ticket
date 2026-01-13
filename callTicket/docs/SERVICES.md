# Servicos

src/services/auth.service.ts
-> loginService(email, password)
-> Faz POST em auth/login e retorna loginResponse (token + user).
-> verifyToken()
-> Le token do AsyncStorage e chama auth/me.
-> Retorna boolean baseado em response.ok.
-> Usa EXPO_PUBLIC_BASE_URL e normaliza a barra final.

src/services/tickets.service.ts
-> Tipos para TicketStatus, Ticket, TicketItem, TicketListResponse, e payloads de update.
-> getAuthToken() le jwtToken e lanca erro se faltar.
-> getUserId() le dados do usuario salvos e retorna id.
-> ticketService(ticket)
-> POST /tickets com description, status, ticket_type, area_type, e url opcional.
-> showTicketService(userId?)
-> GET /tickets/:id usando o user id salvo por padrao.
-> updateTicketService(ticketId, payload)
-> PATCH /tickets/:id com status, description, types, e url opcional.
-> uploadTicketImage(uri)
-> POST /uploads com multipart/form-data (campo image).
-> normalizeUploadResponse() aceita string simples ou objeto e retorna url.

Notas
-> uploadTicketImage usa FormData e inclui header Authorization.
-> TicketItem suporta attachments para renderizar imagens no detalhe.
