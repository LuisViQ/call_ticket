import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { TicketItem } from "../../services/tickets.service";

type AppStackParamList = {
  TicketDetailScreen: { ticket: TicketItem };
};

function resolveTicketUrl(url?: string | null) {
  if (!url) {
    return null;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const apiUrl = process.env.EXPO_PUBLIC_BASE_URL || "";
  const base = apiUrl.replace(/\/v1\/?$/, "/").replace(/\/$/, "");
  const path = url.startsWith("/")
    ? url
    : url.startsWith("uploads/")
    ? `/${url}`
    : `/uploads/${url}`;
  return base ? `${base}${path}` : path;
}

export default function TicketDetailScreen() {
  const route = useRoute<RouteProp<AppStackParamList, "TicketDetailScreen">>();
  const { ticket } = route.params;
  const imageUrl = resolveTicketUrl(ticket.url);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chamado #{ticket.id}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{ticket.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Descricao</Text>
        <Text style={styles.value}>{ticket.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{ticket.ticket_type || "Nao informado"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Area</Text>
        <Text style={styles.value}>{ticket.area_type || "Nao informado"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Imagem</Text>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.emptyText}>Sem imagem.</Text>
        )}
      </View>
    </ScrollView>
  );
}
