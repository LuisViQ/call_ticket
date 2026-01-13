import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { TicketItem } from "../../services/tickets.service";

type AppStackParamList = {
  TicketDetailScreen: { ticket: TicketItem };
};

// Normaliza URLs de anexos para uso no Image.
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

// Tela de detalhes do chamado.
export default function TicketDetailScreen() {
  const route = useRoute<RouteProp<AppStackParamList, "TicketDetailScreen">>();
  const { ticket } = route.params;
  // Monta a lista de URLs de anexos (campo attachments ou url unica).
  const attachmentUrls =
    ticket.attachments
      ?.map((attachment) => attachment?.file_url)
      .filter((url): url is string => Boolean(url)) || [];
  if (attachmentUrls.length === 0 && ticket.url) {
    attachmentUrls.push(ticket.url);
  }
  // Normaliza os caminhos para URLs validas.
  const imageUrls = attachmentUrls
    .map((url) => resolveTicketUrl(url))
    .filter((url): url is string => Boolean(url));

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
        {imageUrls.length > 0 ? (
          <View>
            {imageUrls.map((url, index) => (
              <Image key={`${ticket.id}-${index}`} source={{ uri: url }} style={styles.image} />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Sem imagem.</Text>
        )}
      </View>
    </ScrollView>
  );
}
