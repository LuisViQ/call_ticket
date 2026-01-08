import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Pressable } from "react-native";

import { styles } from "./styles";
import { useAuth } from "../../contexts/AuthContext";
import { getUserData, removeJwtToken } from "../../utils/utils";
import { ActionCard } from "../../components/ActionCard";
import { useNavigation } from "@react-navigation/native";

import type { StackNavigationProp } from "@react-navigation/stack";

type AppStackParamList = {
  Home: undefined;
  NewTicketScreen: undefined;
  CallScreen: undefined;
  EditTicketScreen: undefined;
};

export function HomeScreen() {
  const { setIsAuth } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  function handleLogout() {
    setIsAuth(false);
    removeJwtToken();
  }
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Bem-vindo(a)</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Pressable onPress={handleLogout} hitSlop={12}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>

        {/* Área branca (painel) */}
        <View style={styles.actionsArea}>
          <View style={styles.actionsAreaBackground} />
          <ActionCard
            top={30}
            title="Abrir um novo chamado"
            onPress={() => {
              navigation.navigate("NewTicketScreen");
            }}
          />

          <ActionCard
            top={136}
            title={"Ver histórico \n" + "de chamados"}
            onPress={() => {
              navigation.navigate("CallScreen");
            }}
          />

          <ActionCard
            top={247}
            title="Editar chamados"
            onPress={() => {
              navigation.navigate("EditTicketScreen");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
