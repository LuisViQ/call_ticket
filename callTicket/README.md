callTicket

Visao geral
Aplicativo mobile para abrir, listar e acompanhar chamados de suporte, com opcao de anexar imagem.

Stack
-> Expo + React Native
-> React Navigation (Stack)
-> AsyncStorage para token e dados do usuario
-> Expo Image Picker para anexos (opcional)

Como rodar

1. Instalar dependencias: `npm install`
2. Iniciar: `npx expo start`
3. Se for usar anexos: `npx expo install expo-image-picker`

Configuracao

-> Defina `EXPO_PUBLIC_BASE_URL` no `.env` (ex: `http://10.0.0.244:3000/v1/`)
-> Se mudar o `.env`, reinicie com cache: `npx expo start -c`

Fluxos principais

-> Login: autentica, salva `jwtToken` e `userData` no AsyncStorage e entra no AppStack.
-> Home: atalhos para abrir chamado, listar chamados e editar.
-> Novo chamado: envia descricao + tipo + area, com upload de imagem opcional.
-> Listagem: carrega os chamados do usuario e abre o detalhe.
-> Detalhe: mostra dados completos e imagens relacionadas.
-> Edicao: seleciona um chamado e atualiza seu status.

Navegacao

-> `AuthStack`: Login
-> `AppStack`: Home, NewTicketScreen, CallScreen, TicketDetailScreen, EditTicketScreen
-> A troca de stacks e controlada pelo `AuthContext`.

Armazenamento local

-> `jwtToken`: token de acesso
-> `userData`: dados do usuario (id, nome, email)

Estrutura do projeto

-> `src/screens`: telas do app
-> `src/routes`: stacks e rotas
-> `src/services`: chamadas de API (auth, tickets, uploads)
-> `src/contexts`: estado global de auth
-> `src/components`: componentes reutilizaveis
-> `src/utils`: helpers e AsyncStorage

Upload de imagem (resumo)

-> Seleciona imagem no device.
-> Faz upload e recebe uma `url`.
-> Envia o ticket com `url`.
-> No detalhe, a imagem e exibida a partir da `url` (relativa ou absoluta).
