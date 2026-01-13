import React from "react";

import CardGridContentList from "../../components/CardGridContendList";
import { CardGridContentListProvider } from "../../contexts/CardGridContentListContext";

// Tela de lista de chamados com provider dedicado.
export function ListCallScreen() {
  return (
    <CardGridContentListProvider>
      <CardGridContentList />
    </CardGridContentListProvider>
  );
}
