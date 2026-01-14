import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import ticketService, {
  getAreaTypes,
  getTicketTypes,
  type AreaType,
  type TicketType,
  uploadTicketImage,
} from "../../services/tickets.service";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function formatMetaLabel(
  item: { id: number; name?: string | null; title?: string | null },
  fallback: string
) {
  return item.name || item.title || `${fallback} ${item.id}`;
}

// Tela para abertura de novo chamado.
export default function NewTicketScreen() {
  const { isOffline } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketTypeId, setTicketTypeId] = useState(0);
  const [areaTypeId, setAreaTypeId] = useState(0);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [areaTypes, setAreaTypes] = useState<AreaType[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [ticketTypeLoadError, setTicketTypeLoadError] = useState("");
  const [areaTypeLoadError, setAreaTypeLoadError] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [ticketTypeError, setTicketTypeError] = useState("");
  const [areaTypeError, setAreaTypeError] = useState("");
  const [submitError, setSubmitError] = useState("");

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
        setTicketTypeLoadError(
          "Voce esta offline. Conecte-se para carregar os tipos."
        );
        setAreaTypeLoadError(
          "Voce esta offline. Conecte-se para carregar as areas."
        );
        return;
      }

      try {
        setIsLoadingMeta(true);
        setTicketTypeLoadError("");
        setAreaTypeLoadError("");
        const [typesResult, areasResult] = await Promise.all([
          getTicketTypes(),
          getAreaTypes(),
        ]);
        if (!active) {
          return;
        }
        if (!typesResult.ok) {
          setTicketTypes([]);
          setTicketTypeLoadError("Nao foi possivel carregar os tipos.");
        } else {
          setTicketTypes(typesResult.data || []);
        }
        if (!areasResult.ok) {
          setAreaTypes([]);
          setAreaTypeLoadError("Nao foi possivel carregar as areas.");
        } else {
          setAreaTypes(areasResult.data || []);
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
            : "Nao foi possivel carregar os dados.";
        setTicketTypes([]);
        setAreaTypes([]);
        setTicketTypeLoadError(message);
        setAreaTypeLoadError(message);
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

  // Seleciona imagem da galeria.
  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Erro", "Permissao de fotos necessaria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  // Tira foto usando a camera.
  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Erro", "Permissao de camera necessaria.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  // Envia o chamado para a API.
  async function handleSubmit() {
    if (isOffline) {
      setSubmitError("Voce esta offline. Conecte-se para enviar o chamado.");
      return;
    }
    setTitleError("");
    setDescriptionError("");
    setTicketTypeError("");
    setAreaTypeError("");
    setSubmitError("");

    let hasError = false;
    if (!title.trim()) {
      setTitleError("Informe o titulo.");
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError("Informe a descricao.");
      hasError = true;
    }
    if (!ticketTypeId) {
      setTicketTypeError("Selecione o tipo.");
      hasError = true;
    }
    if (!areaTypeId) {
      setAreaTypeError("Selecione a area.");
      hasError = true;
    }
    if (hasError) {
      return;
    }
    try {
      setIsSubmitting(true);
      let imageUrl: string | undefined;
      if (imageUri) {
        const upload = await uploadTicketImage(imageUri);
        imageUrl = upload.url;
      }
      await ticketService({
        title: title.trim(),
        description: description.trim(),
        status: "AGUARDANDO",
        ticket_type_id: ticketTypeId,
        area_type_id: areaTypeId,
        url: imageUrl,
      });
      setImageUri(null);
      Alert.alert("Sucesso", "Chamado enviado com sucesso!");
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
          : "Nao foi possivel enviar o chamado.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const typeErrorMessage = ticketTypeError || ticketTypeLoadError;
  const areaErrorMessage = areaTypeError || areaTypeLoadError;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Titulo do Chamado</Text>
          <TextInput
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (titleError) setTitleError("");
              if (submitError) setSubmitError("");
            }}
            placeholder="Titulo do chamado"
            placeholderTextColor="#bdbdbd"
            style={[styles.input, styles.inputSingleLine]}
          />
          {titleError ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{titleError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Descricao do Chamado</Text>
          <TextInput
            value={description}
            onChangeText={(value) => {
              setDescription(value);
              if (descriptionError) setDescriptionError("");
              if (submitError) setSubmitError("");
            }}
            placeholder="Descreva o problema ou solicitacao"
            placeholderTextColor="#bdbdbd"
            style={styles.input}
            multiline={true}
          />
          {descriptionError ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{descriptionError}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Tipo de chamado *</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={ticketTypeId}
              onValueChange={(value) => {
                setTicketTypeId(Number(value));
                if (ticketTypeError) setTicketTypeError("");
                if (ticketTypeLoadError) setTicketTypeLoadError("");
                if (submitError) setSubmitError("");
              }}
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
          {typeErrorMessage ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{typeErrorMessage}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Area do chamado *</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={areaTypeId}
              onValueChange={(value) => {
                setAreaTypeId(Number(value));
                if (areaTypeError) setAreaTypeError("");
                if (areaTypeLoadError) setAreaTypeLoadError("");
                if (submitError) setSubmitError("");
              }}
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
          {areaErrorMessage ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{areaErrorMessage}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Imagem (opcional)</Text>
          <View style={styles.imageActions}>
            <Pressable
              style={[styles.secondaryButton, styles.imageActionButton]}
              onPress={handleTakePhoto}
            >
              <Text style={styles.secondaryButtonText}>
                {imageUri ? "Tirar outra foto" : "Tirar foto"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryButton, styles.imageActionButton]}
              onPress={handlePickImage}
            >
              <Text style={styles.secondaryButtonText}>
                {imageUri ? "Trocar imagem" : "Selecionar imagem"}
              </Text>
            </Pressable>
          </View>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : null}
        </View>
        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Text>
        </Pressable>
        {submitError ? (
          <View style={styles.errorArea}>
            <MaterialIcons
              name="error-outline"
              size={14}
              style={styles.errorIcon}
            />
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
