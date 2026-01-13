import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";
import loginService from "../../services/auth.service";
import { storeJwtToken, storeUserData } from "../../utils/utils";
import { useAuth } from "../../contexts/AuthContext";

// Tela de login do app.
export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuth } = useAuth();
  // Envia credenciais e salva token no storage.
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha email e senha.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await loginService(email, password);
      await storeJwtToken(response.data.token);
      await storeUserData(response);
      setIsAuth(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Falha no login", "Verifique seu email ou senha");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, styles.flex]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View style={styles.card}>
            <Text style={styles.title}>
              <Text style={styles.titleLight}>LINK</Text>{" "}
              <Text style={styles.titleDark}>TICKET</Text>
            </Text>

            <Text style={styles.subtitle}>
              Seus chamados, tudo em um só lugar.
            </Text>

            <View style={styles.inputWrap}>
              <View style={styles.leftIcon}>
                <Feather name="user" size={20} color="#1f2937" />
              </View>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="E-mail"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.leftIcon}>
                <Feather name="lock" size={20} color="#1f2937" />
              </View>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.inputWithRightIcon]}
              />

              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.rightIconButton}
                hitSlop={10}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#4b5563"
                />
              </Pressable>
            </View>

            <View style={styles.buttonArea}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Entrando..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
