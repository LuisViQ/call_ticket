import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens/HomeScreen";
import NewTicketScreen from "../screens/CallScreen";
import { ListCallScreen } from "../screens/ListCallScreen";
import EditTicketScreen from "../screens/EditCallScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";
const { Screen, Navigator } = createStackNavigator();

// Stack de rotas autenticadas do app.
export function AppStack() {
  return (
    <Navigator>
      <Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Início", headerShown: false }}
      />
      <Screen
        name="NewTicketScreen"
        component={NewTicketScreen}
        options={{ title: "Novo Chamado" }}
      />
      <Screen
        name="CallScreen"
        component={ListCallScreen}
        options={{ title: "Seus chamados" }}
      />
      <Screen
        name="TicketDetailScreen"
        component={TicketDetailScreen}
        options={{ title: "Detalhe do chamado" }}
      />
      <Screen
        name="EditTicketScreen"
        component={EditTicketScreen}
        options={{ title: "Editar chamado" }}
      />
    </Navigator>
  );
}
