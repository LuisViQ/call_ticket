import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import {
  showTicketService,
  TicketItem,
  TicketListResponse,
} from "../services/tickets.service";

type AppStackParamList = {
  TicketDetailScreen: { ticket: TicketItem };
};
export const CardGridContentList = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  useEffect(() => {
    let isActive = true;

    async function loadTickets() {
      try {
        setIsLoading(true);
        setError(null);
        const data = (await showTicketService()) as TicketListResponse;
        if (isActive) {
          if (!data.ok) {
            setTickets([]);
            setError("Nao ha chamados.");
            return;
          }
          setTickets(data.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isActive) {
          setError("Nao foi possivel carregar os chamados.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.cardGridContentList}>
      <View style={styles.view}>
        {isLoading ? (
          <Text style={styles.stateText}>Carregando chamados...</Text>
        ) : null}
        {!isLoading && error ? (
          <Text style={styles.stateText}>{error}</Text>
        ) : null}
        {!isLoading && !error && tickets.length === 0 ? (
          <Text style={styles.stateText}>Nenhum chamado encontrado.</Text>
        ) : null}
        {!isLoading && !error && tickets.length > 0 ? (
          <View style={styles.cards}>
            {tickets.map((ticket) => (
              <Pressable
                key={ticket.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TicketDetailScreen", { ticket })
                }
              >
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
            ))}
          </View>
        ) : null}
      </View>
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
  cards: {
    gap: 48,
    alignSelf: "stretch",
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
