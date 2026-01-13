import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import {
  showTicketService,
  TicketItem,
  TicketStatus,
  updateTicketService,
} from "../../services/tickets.service";

// Tela para editar chamados existentes.
export default function EditTicketScreen() {
  const [description, setDescription] = useState("");
  const [callType, setCallType] = useState<TicketStatus | "">("");
  const [callArea, setCallArea] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState<string | null>(null);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplica os dados do chamado selecionado no formulario.
  function applyTicketSelection(ticket: TicketItem) {
    setSelectedTicketId(ticket.id);
    setDescription(ticket.description || "");
    setCallArea(ticket.area_type ?? null);
    setTicketType(ticket.ticket_type ?? null);
    setTicketUrl(ticket.url ?? null);
    setCallType(ticket.status);
  }

  // Atualiza o chamado selecionado no picker.
  function handleTicketChange(value: number | string) {
    if (value === 0 || value === "0") {
      setSelectedTicketId(null);
      return;
    }
    const ticketId = Number(value);
    const ticket = tickets.find((item) => item.id === ticketId);
    if (ticket) {
      applyTicketSelection(ticket);
    } else {
      setSelectedTicketId(ticketId);
    }
  }

  // Formata o label exibido no picker.
  function formatTicketLabel(ticket: TicketItem) {
    const rawDescription = (ticket.description || "Sem descricao").trim();
    const shortDescription =
      rawDescription.length > 120
        ? `${rawDescription.slice(0, 120)}...`
        : rawDescription;
    return `#${ticket.id} - ${shortDescription}`;
  }

  // Carrega a lista de chamados ao montar.
  useEffect(() => {
    let active = true;

    async function loadTickets() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await showTicketService();
        if (!active) {
          return;
        }
        if (!result.ok) {
          setTickets([]);
          setError("Não há chamados para esse usuário");
          return;
        }
        setTickets(result.data || []);
        if (result.data && result.data.length > 0) {
          applyTicketSelection(result.data[0]);
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setError("Não foi possivel carregar os chamados.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  // Envia atualizacao do chamado selecionado.
  async function handleSubmit() {
    if (!selectedTicketId) {
      Alert.alert("Erro", "Selecione um chamado.");
      return;
    }
    if (!callType) {
      Alert.alert("Erro", "Selecione o estado.");
      return;
    }
    try {
      await updateTicketService(selectedTicketId, {
        description,
        status: callType,
        ticket_type: ticketType,
        area_type: callArea,
        url: ticketUrl,
      });
      Alert.alert("Sucesso", "Chamado atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possivel atualizar o chamado.");
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Chamado</Text>
          {isLoading ? (
            <Text style={styles.pickerLabel}>Carregando chamados...</Text>
          ) : null}
          {!isLoading && error ? (
            <Text style={styles.pickerLabel}>{error}</Text>
          ) : null}
          {!isLoading && !error ? (
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={selectedTicketId ?? 0}
                onValueChange={handleTicketChange}
                style={styles.picker}
              >
                <Picker.Item label="Selecione..." value={0} color="#bdbdbd" />
                {tickets.map((ticket) => (
                  <Picker.Item
                    key={ticket.id}
                    label={formatTicketLabel(ticket)}
                    value={ticket.id}
                  />
                ))}
              </Picker>
            </View>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Estado do chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={callType}
              onValueChange={setCallType}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#bdbdbd" />
              <Picker.Item label="AGUARDANDO" value="AGUARDANDO" />
              <Picker.Item label="EM ATENDIMENTO" value="EM_ATENDIMENTO" />
              <Picker.Item label="CANCELADO" value="CANCELADO" />
              <Picker.Item label="ENCERRADO" value="ENCERRADO" />
            </Picker>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}
