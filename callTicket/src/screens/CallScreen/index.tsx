import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import ticketService, {
  uploadTicketImage,
} from "../../services/tickets.service";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Tela para abertura de novo chamado.
export default function NewTicketScreen() {
  const { isOffline } = useAuth();
  const [description, setDescription] = useState("");
  const [callType, setCallType] = useState("");
  const [callArea, setCallArea] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [callTypeError, setCallTypeError] = useState("");
  const [callAreaError, setCallAreaError] = useState("");
  const [submitError, setSubmitError] = useState("");

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
    let hasError = false;
    if (!description) {
      setDescriptionError("Informe a descricao.");
      hasError = true;
    }
    if (!callType) {
      setCallTypeError("Selecione o tipo.");
      hasError = true;
    }
    if (!callArea) {
      setCallAreaError("Selecione a area.");
      hasError = true;
    }
    if (hasError) {
      setSubmitError("");
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError("");
      let imageUrl: string | undefined;
      if (imageUri) {
        const upload = await uploadTicketImage(imageUri);
        imageUrl = upload.url;
      }
      await ticketService({
        description,
        ticket_type: callType,
        area_type: callArea,
        url: imageUrl,
      });
      setImageUri(null);
      Alert.alert("Sucesso", "Chamado enviado com sucesso!");
    } catch (error) {
      if (!(error instanceof Error && error.name === "TimeoutError")) {
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

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Descrição do Chamado</Text>
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
          <Text style={styles.pickerLabel}>Tipo de chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={callType}
              onValueChange={(value) => {
                setCallType(value);
                if (callTypeError) setCallTypeError("");
                if (submitError) setSubmitError("");
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#bdbdbd" />
              <Picker.Item label="Suporte Tecnico" value="suporte" />
              <Picker.Item label="Manutencao" value="manutencao" />
              <Picker.Item label="Duvida" value="duvida" />
              <Picker.Item label="Reclamacao" value="reclamacao" />
            </Picker>
          </View>
          {callTypeError ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{callTypeError}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Area do chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={callArea}
              onValueChange={(value) => {
                setCallArea(value);
                if (callAreaError) setCallAreaError("");
                if (submitError) setSubmitError("");
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#bdbdbd" />
              <Picker.Item label="TI" value="ti" />
              <Picker.Item label="Recursos Humanos" value="rh" />
              <Picker.Item label="Financeiro" value="financeiro" />
              <Picker.Item label="Operacoes" value="operacoes" />
            </Picker>
          </View>
          {callAreaError ? (
            <View style={styles.errorArea}>
              <MaterialIcons
                name="error-outline"
                size={14}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{callAreaError}</Text>
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
  );
}
