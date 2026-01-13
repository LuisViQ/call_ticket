# Telas

src/screens/LoginScreen/index.tsx
-> Formulario de login com email e senha.
-> Usa loginService e salva jwtToken + userData no sucesso.
-> Alterna visibilidade da senha e desabilita botao durante o carregamento.
-> Usa AuthContext para setar isAuth.

src/screens/LoginScreen/styles.tsx
-> Layout e tema da tela de login, inputs e botoes.

src/screens/HomeScreen/index.tsx
-> Le o nome do usuario do AsyncStorage e exibe.
-> Atalhos do ActionCard navegam para NewTicketScreen, CallScreen, e EditTicketScreen.
-> Logout limpa auth e token.

src/screens/HomeScreen/styles.tsx
-> Layout da Home, posicionamento do header, estilo dos action cards.

src/screens/CallScreen/index.tsx
-> Formulario para criar um novo ticket.
-> Seletor de imagem opcional usa expo-image-picker e uploadTicketImage.
-> Envia dados do ticket com url opcional e mostra alertas no sucesso/erro.

src/screens/CallScreen/styles.tsx
-> Estilos do formulario, layout do picker e preview de imagem.

src/screens/ListCallScreen/index.tsx
-> Wrapper que renderiza CardGridContentList dentro de um ScrollView.

src/screens/ListCallScreen/styles.tsx
-> Arquivo de estilo placeholder (container vazio atualmente).

src/screens/EditCallScreen/index.tsx
-> Carrega tickets do usuario e mostra um Picker para selecionar um.
-> Exibe descricao encurtada no label do Picker.
-> Atualiza status do ticket selecionado via updateTicketService.
-> Preserva ticket_type, area_type, e url do item selecionado.

src/screens/EditCallScreen/styles.tsx
-> Estilos do formulario similares ao CallScreen com picker e botao.

src/screens/TicketDetailScreen/index.tsx
-> Mostra detalhes de um ticket passado via parametros de navegacao.
-> Resolve URLs de imagem a partir de attachments[].file_url ou ticket.url.
-> Renderiza uma ou mais imagens se disponivel.

src/screens/TicketDetailScreen/styles.tsx
-> Layout do detalhe e estilo de imagem.
