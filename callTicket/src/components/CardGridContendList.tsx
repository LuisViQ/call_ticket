import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useCardGridContentList } from "../contexts/CardGridContentListContext";
import type { TicketItem } from "../services/tickets.service";

// Tipos de navegacao usados na tela de detalhe.
type AppStackParamList = {
  TicketDetailScreen: { ticket: TicketItem };
};
// Componente que renderiza a lista de chamados.
export const CardGridContentList = () => {
  const { tickets, isLoading, error } = useCardGridContentList();
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  // Renderiza estado vazio, erro ou carregando.
  const renderEmptyState = () => {
    if (isLoading) {
      return <Text style={styles.stateText}>Carregando chamados...</Text>;
    }
    if (error) {
      return <Text style={styles.stateText}>{error}</Text>;
    }
    return <Text style={styles.stateText}>Nenhum chamado encontrado.</Text>;
  };

  return (
    <SafeAreaView style={styles.cardGridContentList}>
      {/* Lista de chamados recebidos do contexto. */}
      <FlatList
        data={tickets}
        // Usa o id como chave do item.
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.view}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        // Abre a tela de detalhes do chamado.
        renderItem={({ item: ticket }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("TicketDetailScreen", { ticket })
            }
          >
            {/* Conteudo do card do chamado. */}
            <View style={styles.body}>
              <View style={styles.text}>
                <Text style={styles.title}>Chamado #{ticket.id}</Text>
                <Text
                  style={[styles.bodyTextFor, styles.button2Typo]}
                  numberOfLines={3}
                >
                  {ticket.description}
                </Text>
                <Text style={[styles.metaText, styles.button2Typo]}>
                  Tipo: {ticket.ticket_type || "Nao informado"}
                </Text>
                <Text style={[styles.metaText, styles.button2Typo]}>
                  Area: {ticket.area_type || "Nao informado"}
                </Text>
              </View>
              <View style={[styles.buttonGroup, styles.buttonFlexBox]}>
                <View style={[styles.button, styles.buttonFlexBox]}>
                  <Text style={[styles.button2, styles.button2Typo]}>
                    {ticket.status}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  cardGridContentList: {
    backgroundColor: "#fff",
    flex: 1,
  },
  button2Typo: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    textAlign: "left",
  },
  buttonFlexBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  view: {
    width: "100%",
    padding: 24,
    backgroundColor: "#fff",
  },
  cardSeparator: {
    height: 48,
  },
  card: {
    gap: 16,
    minWidth: 240,
    flexDirection: "row",
  },
  body: {
    gap: 16,
    minWidth: 160,
    flex: 1,
  },
  text: {
    gap: 8,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 24,
    letterSpacing: -0.5,
    lineHeight: 29,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    textAlign: "left",
    color: "#1e1e1e",
    alignSelf: "stretch",
  },
  bodyTextFor: {
    lineHeight: 22,
    color: "#757575",
    alignSelf: "stretch",
  },
  metaText: {
    lineHeight: 20,
    color: "#4b5563",
    alignSelf: "stretch",
  },
  buttonGroup: {
    alignSelf: "stretch",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#e3e3e3",
    borderStyle: "solid",
    borderColor: "#767676",
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    padding: 12,
  },
  button2: {
    lineHeight: 16,
    color: "#1e1e1e",
    fontSize: 16,
  },
  stateText: {
    color: "#757575",
    fontSize: 16,
    textAlign: "left",
  },
});
export default CardGridContentList;
