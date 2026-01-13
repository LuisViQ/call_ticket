import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
const { Screen, Navigator } = createStackNavigator();

// Stack de rotas para usuarios nao autenticados.
export function AuthStack() {
  return (
    <Navigator>
      <Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login", headerShown: false }}
      />
    </Navigator>
  );
}
