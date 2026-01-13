# Rotas

src/routes/index.tsx
-> Escolhe entre AuthStack e AppStack com base em AuthContext.isAuth.
-> Retorna null enquanto o estado de auth e desconhecido, depois renderiza NavigationContainer.

src/routes/authStack.routes.tsx
-> Navegador de stack para fluxo nao autenticado.
-> Contem apenas a tela de Login, com header oculto.

src/routes/appStack.routes.tsx
-> Navegador de stack para fluxo autenticado.
-> Telas: Home, NewTicketScreen, CallScreen, TicketDetailScreen, EditTicketScreen.
-> Opcoes de titulo sao definidas por tela (Home esconde o header).
