import { NavigationContainer } from "@react-navigation/native";
import { AuthStack } from "./authStack.routes";
import { AppStack } from "./appStack.routes";
import { useAuth } from "../contexts/AuthContext";

export function Routes() {
  const { isAuth } = useAuth();

  if (isAuth === null) return null;

  return (
    <NavigationContainer>
      {isAuth ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
