import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./styles";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData, removeJwtToken } from "../../utils/utils";
import { useNavigation } from "@react-navigation/native";
import {
  CardGridContentListProvider,
  useCardGridContentList,
} from "../../contexts/CardGridContentListContext";
import type { TicketItem } from "../../services/tickets.service";

import type { StackNavigationProp } from "@react-navigation/stack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Tipos de navegacao usados na home.
type AppStackParamList = {
  Home: undefined;
  NewTicketScreen: undefined;
  TicketDetailScreen: { ticket: TicketItem };
};

function getStatusStyle(status: TicketItem["status"]) {
  switch (status) {
    case "AGUARDANDO":
      return { pill: styles.statusPillWaiting, text: styles.statusTextWaiting };
    case "EM_ATENDIMENTO":
      return {
        pill: styles.statusPillInProgress,
        text: styles.statusTextInProgress,
      };
    case "CANCELADO":
      return {
        pill: styles.statusPillCanceled,
        text: styles.statusTextCanceled,
      };
    case "ENCERRADO":
      return { pill: styles.statusPillClosed, text: styles.statusTextClosed };
    default:
      return { pill: styles.statusPill, text: styles.statusText };
  }
}

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

function HomeScreenContent() {
  const { setIsAuth, isOffline } = useAuth();
  const { tickets, isLoading, error, refreshTickets } =
    useCardGridContentList();
  const [userName, setUserName] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();

  // Remove auth local e encerra sessao.
  function handleLogout() {
    setIsAuth(false);
    removeJwtToken();
  }

  // Carrega nome do usuario salvo localmente.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getUserData();
        if (active && data?.name) {
          setUserName(data.name);
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.logo}>
              <Text style={styles.logoTop}>LINK</Text>
              <Text style={styles.logoBottom}>TICKET</Text>
            </View>
            <Text style={styles.welcome}>Bem-vindo(a)</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
        {isOffline ? (
          <View style={styles.errorArea}>
            <MaterialIcons name="wifi-off" size={14} style={styles.errorIcon} />
            <Text style={styles.errorText}>Voce esta offline.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <FlatList
          data={tickets}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Pressable
                style={[
                  styles.primaryButton,
                  // Estilo condicional para quando estiver desabilitado
                  isOffline
                    ? styles.primaryButtonDisabled
                    : styles.primaryButtonEnabled,
                ]}
                onPress={() => navigation.navigate("NewTicketScreen")}
                disabled={isOffline}
              >
                <MaterialIcons
                  name="add-circle-outline"
                  size={18}
                  style={styles.primaryButtonIcon}
                />
                <Text style={styles.primaryButtonText}>
                  Abrir um novo chamado
                </Text>
              </Pressable>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Historico de chamados</Text>
                <Pressable onPress={refreshTickets}>
                  <Text style={styles.sectionAction}>Atualizar</Text>
                </Pressable>
              </View>
            </View>
          }
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            const titleText = item.title?.trim();
            const ticketTypeLabel = resolveMetaLabel(
              item.ticket_type,
              item.ticket_type_id
            );
            const areaTypeLabel = resolveMetaLabel(
              item.area_type,
              item.area_type_id
            );
            return (
              <Pressable
                style={styles.ticketCard}
                onPress={() =>
                  navigation.navigate("TicketDetailScreen", { ticket: item })
                }
              >
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>
                    {titleText || `Chamado #${item.id}`}
                  </Text>
                  <View style={[styles.statusPill, statusStyle.pill]}>
                    <Text style={[styles.statusText, statusStyle.text]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ticketDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.ticketMeta}>Tipo: {ticketTypeLabel}</Text>
                <Text style={styles.ticketMeta}>Area: {areaTypeLabel}</Text>
              </Pressable>
            );
          }}
          refreshing={isLoading}
          onRefresh={refreshTickets}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

// Tela inicial com atalhos de chamados.
export function HomeScreen() {
  return (
    <CardGridContentListProvider>
      <HomeScreenContent />
    </CardGridContentListProvider>
  );
}
