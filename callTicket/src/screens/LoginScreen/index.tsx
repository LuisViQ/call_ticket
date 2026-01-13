import React, { useState } from "react";
import {
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import loginService from "../../services/auth.service";
import { storeJwtToken, storeUserData } from "../../utils/utils";
import { useAuth } from "../../contexts/AuthContext";

const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

// Tela de login do app.
export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { setIsAuth, isOffline } = useAuth();
  // Envia credenciais e salva token no storage.
  async function handleLogin() {
    if (!email || !password) {
      setLoginError("Preencha email e senha.");
      return;
    }
    try {
      setIsLoading(true);
      setLoginError("");
      const response = await loginService(email, password);
      await storeJwtToken(response.data.token);
      await storeUserData(response);
      setIsAuth(true);
    } catch (error) {
      // trata caso ocorra algum erro no login
      const message =
        error instanceof Error ? error.message : "Verifique seu email ou senha";
      if (message === "HTTP 401") {
        setLoginError(
          `Verifique as informações da conta que você inseriu \n e tente novamente.`
        );
      } else {
        setLoginError(message);
      }
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
                onChangeText={(value) => {
                  setEmail(value);
                  if (loginError) setLoginError("");
                }}
                placeholder="E-mail"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                maxLength={MAX_EMAIL_LENGTH}
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
                onChangeText={(value) => {
                  setPassword(value);
                  if (loginError) setLoginError("");
                }}
                placeholder="Senha"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                maxLength={MAX_PASSWORD_LENGTH}
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
            {isOffline ? (
              <View style={styles.errorArea}>
                <MaterialIcons
                  name="wifi-off"
                  size={14}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}> Voce esta offline.</Text>
              </View>
            ) : null}
            {loginError ? (
              <View style={styles.errorArea}>
                <MaterialIcons
                  name="error-outline"
                  size={14}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}> {loginError}</Text>
              </View>
            ) : null}
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
