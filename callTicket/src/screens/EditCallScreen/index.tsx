import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import {
  getAreaTypes,
  getTicketTypes,
  showTicketService,
  type AreaType,
  TicketItem,
  TicketStatus,
  type TicketType,
  updateTicketService,
} from "../../services/tickets.service";
import { useAuth } from "../../contexts/AuthContext";

function formatMetaLabel(
  item: { id: number; name?: string | null; title?: string | null },
  fallback: string
) {
  return item.name || item.title || `${fallback} ${item.id}`;
}

// Tela para editar chamados existentes.
export default function EditTicketScreen() {
  const { isOffline } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [callType, setCallType] = useState<TicketStatus | "">("");
  const [ticketTypeId, setTicketTypeId] = useState(0);
  const [areaTypeId, setAreaTypeId] = useState(0);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [areaTypes, setAreaTypes] = useState<AreaType[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aplica os dados do chamado selecionado no formulario.
  function applyTicketSelection(ticket: TicketItem) {
    const resolvedTicketTypeId =
      ticket.ticket_type_id ??
      (typeof ticket.ticket_type === "object" && ticket.ticket_type
        ? ticket.ticket_type.id
        : 0);
    const resolvedAreaTypeId =
      ticket.area_type_id ??
      (typeof ticket.area_type === "object" && ticket.area_type
        ? ticket.area_type.id
        : 0);

    setSelectedTicketId(ticket.id);
    setTitle(ticket.title || "");
    setDescription(ticket.description || "");
    setTicketTypeId(resolvedTicketTypeId || 0);
    setAreaTypeId(resolvedAreaTypeId || 0);
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
    const rawTitle = (ticket.title || "").trim();
    if (rawTitle) {
      return `#${ticket.id} - ${rawTitle}`;
    }
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
      if (isOffline) {
        if (!active) {
          return;
        }
        setTickets([]);
        setError("Voce esta offline. Conecte-se para carregar os chamados.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await showTicketService();
        if (!active) {
          return;
        }
        if (!result.ok) {
          setTickets([]);
          setError("Nao ha chamados para esse usuario.");
          return;
        }
        setTickets(result.data || []);
        if (result.data && result.data.length > 0) {
          applyTicketSelection(result.data[0]);
        }
      } catch (error) {
        if (!active) {
          return;
        }
        if (
          !(
            error instanceof Error &&
            (error.name === "TimeoutError" || error.name === "OfflineError")
          )
        ) {
          console.error(error);
        }
        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os chamados.";
        setError(message);
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
  }, [isOffline]);

  useEffect(() => {
    let active = true;

    async function loadMeta() {
      if (isOffline) {
        if (!active) {
          return;
        }
        setTicketTypes([]);
        setAreaTypes([]);
        setIsLoadingMeta(false);
        setMetaError("Voce esta offline. Conecte-se para carregar os dados.");
        return;
      }

      try {
        setIsLoadingMeta(true);
        setMetaError(null);
        const [typesResult, areasResult] = await Promise.all([
          getTicketTypes(),
          getAreaTypes(),
        ]);
        if (!active) {
          return;
        }
        if (!typesResult.ok || !areasResult.ok) {
          setMetaError("Nao foi possivel carregar tipos e areas.");
        }
        setTicketTypes(typesResult.data || []);
        setAreaTypes(areasResult.data || []);
      } catch (error) {
        if (!active) {
          return;
        }
        if (
          !(
            error instanceof Error &&
            (error.name === "TimeoutError" || error.name === "OfflineError")
          )
        ) {
          console.error(error);
        }
        setTicketTypes([]);
        setAreaTypes([]);
        setMetaError("Nao foi possivel carregar tipos e areas.");
      } finally {
        if (active) {
          setIsLoadingMeta(false);
        }
      }
    }

    loadMeta();

    return () => {
      active = false;
    };
  }, [isOffline]);

  // Envia atualizacao do chamado selecionado.
  async function handleSubmit() {
    if (isOffline) {
      Alert.alert("Erro", "Voce esta offline.");
      return;
    }
    if (!selectedTicketId) {
      Alert.alert("Erro", "Selecione um chamado.");
      return;
    }
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o titulo.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Erro", "Informe a descricao.");
      return;
    }
    if (!ticketTypeId) {
      Alert.alert("Erro", "Selecione o tipo.");
      return;
    }
    if (!areaTypeId) {
      Alert.alert("Erro", "Selecione a area.");
      return;
    }
    if (!callType) {
      Alert.alert("Erro", "Selecione o estado.");
      return;
    }
    try {
      await updateTicketService(selectedTicketId, {
        title: title.trim(),
        description: description.trim(),
        status: callType,
        ticket_type_id: ticketTypeId,
        area_type_id: areaTypeId,
      });
      Alert.alert("Sucesso", "Chamado atualizado com sucesso!");
    } catch (error) {
      if (
        !(
          error instanceof Error &&
          (error.name === "TimeoutError" || error.name === "OfflineError")
        )
      ) {
        console.error(error);
      }
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar o chamado.";
      Alert.alert("Erro", message);
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
          <Text style={styles.pickerLabel}>Titulo</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titulo do chamado"
            placeholderTextColor="#bdbdbd"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Descricao</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o problema ou solicitacao"
            placeholderTextColor="#bdbdbd"
            style={[styles.input, styles.inputMultiline]}
            multiline={true}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Tipo de chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={ticketTypeId}
              onValueChange={(value) => setTicketTypeId(Number(value))}
              style={styles.picker}
            >
              <Picker.Item
                label={isLoadingMeta ? "Carregando..." : "Selecione..."}
                value={0}
                color="#bdbdbd"
              />
              {ticketTypes.map((type) => (
                <Picker.Item
                  key={type.id}
                  label={formatMetaLabel(type, "Tipo")}
                  value={type.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Area do chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={areaTypeId}
              onValueChange={(value) => setAreaTypeId(Number(value))}
              style={styles.picker}
            >
              <Picker.Item
                label={isLoadingMeta ? "Carregando..." : "Selecione..."}
                value={0}
                color="#bdbdbd"
              />
              {areaTypes.map((area) => (
                <Picker.Item
                  key={area.id}
                  label={formatMetaLabel(area, "Area")}
                  value={area.id}
                />
              ))}
            </Picker>
          </View>
          {metaError ? (
            <Text style={styles.pickerLabel}>{metaError}</Text>
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
