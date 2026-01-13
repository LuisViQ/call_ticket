Componentes

src/components/ActionCard.tsx
-> Cartao Pressable simples usado na Home.
-> Props: top (offset absoluto), title, onPress.
-> Reusa estilos da HomeScreen.

src/components/CardGridContendList.tsx
-> Busca a lista de tickets via showTicketService no mount.
-> Trata carregamento, erro e estado vazio.
-> Renderiza uma lista de cards Pressable e navega para TicketDetailScreen com o ticket selecionado.
-> Usa SafeAreaView para padding em dispositivos com notch.
