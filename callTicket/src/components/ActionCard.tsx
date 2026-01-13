import { Pressable, Text } from "react-native";
import { styles } from "../screens/HomeScreen/styles";

// Propriedades do card de acao.
type ActionCardProps = {
  top: number;
  title: string;
  icon?: any;
  onPress?: () => void;
};
// Componente do card de acao na tela home.
export function ActionCard({ top, title, onPress }: ActionCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.actionCard, { top }]}>
      <Text style={styles.actionTitle}>{title}</Text>
    </Pressable>
  );
}
