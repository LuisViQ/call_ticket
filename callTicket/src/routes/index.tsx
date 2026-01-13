import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { AuthStack } from "./authStack.routes";
import { AppStack } from "./appStack.routes";
import { useAuth } from "../contexts/AuthContext";

// Seleciona o fluxo de rotas com base na autenticacao.
export function Routes() {
  const { isAuth } = useAuth();

  // Exibe loader enquanto valida o token.
  if (isAuth === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuth ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
