import React from "react";
import { ScrollView, View } from "react-native";

import { styles } from "./styles";
import CardGridContentList from "../../components/CardGridContendList";

export function ListCallScreen() {
  return (
    <ScrollView>
      <CardGridContentList />
    </ScrollView>
  );
}
