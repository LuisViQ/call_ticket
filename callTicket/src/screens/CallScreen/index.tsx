import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import ticketService, { uploadTicketImage } from "../../services/tickets.service";
import * as ImagePicker from "expo-image-picker";

export default function NewTicketScreen() {
  const [description, setDescription] = useState("");
  const [callType, setCallType] = useState("");
  const [callArea, setCallArea] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit() {
    if (!description || !callArea || !callType) {
      Alert.alert("Erro", "Preencha descricao, area e tipo");
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
        description,
        ticket_type: callType,
        area_type: callArea,
        url: imageUrl,
      });
      setImageUri(null);
      Alert.alert("Sucesso", "Chamado enviado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel enviar o chamado.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      {/* Form */}
      <View style={styles.form}>
        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Descrição do Chamado</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o problema ou solicitacao"
            placeholderTextColor="#bdbdbd"
            style={styles.input}
          />
        </View>

        {/* Call Type */}
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Tipo de chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={callType}
              onValueChange={setCallType}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#bdbdbd" />
              <Picker.Item label="Suporte Tecnico" value="suporte" />
              <Picker.Item label="Manutencao" value="manutencao" />
              <Picker.Item label="Duvida" value="duvida" />
              <Picker.Item label="Reclamacao" value="reclamacao" />
            </Picker>
          </View>
        </View>

        {/* Call Area */}
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Area do chamado</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={callArea}
              onValueChange={setCallArea}
              style={styles.picker}
            >
              <Picker.Item label="Selecione..." value="" color="#bdbdbd" />
              <Picker.Item label="TI" value="ti" />
              <Picker.Item label="Recursos Humanos" value="rh" />
              <Picker.Item label="Financeiro" value="financeiro" />
              <Picker.Item label="Operacoes" value="operacoes" />
            </Picker>
          </View>
        </View>

        {/* Image */}
        <View style={styles.field}>
          <Text style={styles.pickerLabel}>Imagem (opcional)</Text>
          <Pressable style={styles.secondaryButton} onPress={handlePickImage}>
            <Text style={styles.secondaryButtonText}>
              {imageUri ? "Trocar imagem" : "Selecionar imagem"}
            </Text>
          </Pressable>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : null}
        </View>

        {/* Submit */}
        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
