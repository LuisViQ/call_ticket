import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { TicketItem } from "../../services/tickets.service";
import { StatusBar } from "expo-status-bar";

type AppStackParamList = {
  TicketDetailScreen: { ticket: TicketItem };
};

function resolveMetaLabel(
  value: TicketItem["ticket_type"] | TicketItem["area_type"],
  id?: number | null
) {
  if (!value) {
    return id ? `ID ${id}` : "Nao informado";
  }
  if (typeof value === "string") {
    return value;
  }
  const label = value.name || value.title;
  if (label) {
    return label;
  }
  return id ? `ID ${id}` : "Nao informado";
}

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
  const [imageStatus, setImageStatus] = useState<
    Record<string, "loading" | "loaded" | "error" | "timeout">
  >({});
  const imageTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  // Monta a lista de URLs de anexos (campo attachments ou url unica).
  const attachmentUrls = useMemo(() => {
    const urls =
      ticket.attachments
        ?.map((attachment) => attachment?.file_url)
        .filter((url): url is string => Boolean(url)) || [];
    if (urls.length === 0 && ticket.url) {
      urls.push(ticket.url);
    }
    return urls;
  }, [ticket.attachments, ticket.url]);
  // Normaliza os caminhos para URLs validas.
  const imageUrls = useMemo(
    () =>
      attachmentUrls
        .map((url) => resolveTicketUrl(url))
        .filter((url): url is string => Boolean(url)),
    [attachmentUrls]
  );
  const imageKey = imageUrls.join("|");

  useEffect(() => {
    Object.values(imageTimeoutsRef.current).forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    imageTimeoutsRef.current = {};

    if (imageUrls.length === 0) {
      setImageStatus({});
      return;
    }

    const nextStatus: Record<
      string,
      "loading" | "loaded" | "error" | "timeout"
    > = {};
    imageUrls.forEach((url) => {
      nextStatus[url] = "loading";
    });
    setImageStatus(nextStatus);

    imageUrls.forEach((url) => {
      imageTimeoutsRef.current[url] = setTimeout(() => {
        setImageStatus((prev) => {
          if (prev[url] === "loaded") {
            return prev;
          }
          return { ...prev, [url]: "timeout" };
        });
      }, 5000);
    });

    return () => {
      Object.values(imageTimeoutsRef.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      imageTimeoutsRef.current = {};
    };
  }, [imageKey]);

  function handleImageLoaded(url: string) {
    const timeoutId = imageTimeoutsRef.current[url];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete imageTimeoutsRef.current[url];
    }
    setImageStatus((prev) => ({ ...prev, [url]: "loaded" }));
  }

  function handleImageError(url: string) {
    const timeoutId = imageTimeoutsRef.current[url];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete imageTimeoutsRef.current[url];
    }
    setImageStatus((prev) => ({ ...prev, [url]: "error" }));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>
        {ticket.title || `Chamado #${ticket.id}`}
      </Text>

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
        <Text style={styles.value}>
          {resolveMetaLabel(ticket.ticket_type, ticket.ticket_type_id)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Area</Text>
        <Text style={styles.value}>
          {resolveMetaLabel(ticket.area_type, ticket.area_type_id)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Imagem</Text>
        {imageUrls.length > 0 ? (
          <View>
            {imageUrls.map((url, index) => {
              const status = imageStatus[url] ?? "loading";
              if (status === "error" || status === "timeout") {
                return (
                  <View
                    key={`${ticket.id}-${index}`}
                    style={styles.imageFallback}
                  >
                    <Text style={styles.imageFallbackText}>
                      Nao foi possivel carregar a imagem.
                    </Text>
                  </View>
                );
              }
              return (
                <Image
                  key={`${ticket.id}-${index}`}
                  source={{ uri: url }}
                  style={styles.image}
                  onLoad={() => handleImageLoaded(url)}
                  onError={() => handleImageError(url)}
                />
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>Sem imagem.</Text>
        )}
      </View>
    </ScrollView>
  );
}
