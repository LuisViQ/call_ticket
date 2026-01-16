# call_ticket

Projeto com API e app mobile para abertura e acompanhamento de chamados de suporte, com anexos de imagem opcionais.

## Visao geral
- Backend em Node.js/TypeScript com rotas REST e upload de arquivos.
- App mobile em Expo/React Native para login, abertura e listagem de chamados.
- Persistencia em MySQL e autenticacao via JWT.

## Tecnologias
API
- Node.js + TypeScript
- Express, CORS, dotenv
- MySQL (mysql2)
- JWT (jsonwebtoken) e bcrypt
- Upload de arquivos com Multer

Mobile
- Expo + React Native
- React Navigation (stack)
- AsyncStorage
- Expo Image Picker

## Estrutura do repositorio
- `api/` backend e documentacao de endpoints
- `api/bdDUMP/` exportacao do banco (schema + dados)
- `callTicket/` app mobile
- `api/README.md` referencia de rotas e payloads

## Como rodar (desenvolvimento)
Pre-requisitos:
- Node.js e npm
- MySQL em execucao

### 1) API
1. Instale dependencias:
   `cd api` e `npm install`
2. Ajuste o `.env` se necessario:
   - `PORT=3000`
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
   - `JWT_SECRET`, `JWT_EXPIRES_IN`
3. Garanta que o banco possui as tabelas esperadas (`users`, `tickets`, `ticket_types`, `ticket_area_types`, `ticket_attachments`, `ticket_status_history`).
   - Opcional: importe o dump `api/bdDUMP/dump-call_ticket-202601161342.sql` para criar schema e dados base.
4. Inicie:
   `npm run dev`

### 2) App mobile
1. Instale dependencias:
   `cd callTicket` e `npm install`
2. Configure o `.env`:
   - `EXPO_PUBLIC_BASE_URL=http://<seu-ip>:3000/v1/`
3. Inicie o Expo:
   `npm run start`

## Uso rapido
- Suba a API primeiro e confirme o health check em `GET /v1/health`.
- No app, faca login e navegue pelos fluxos de abertura e acompanhamento de chamados.
- Para detalhes de rotas e payloads, veja `api/README.md`.

## Banco de dados (dump)
- Arquivo: `api/bdDUMP/dump-call_ticket-202601161342.sql`
- Importar (exemplo):
  `mysql -u root -p call_ticket < api/bdDUMP/dump-call_ticket-202601161342.sql`
- O dump contem schema, triggers e dados de exemplo para desenvolvimento.
