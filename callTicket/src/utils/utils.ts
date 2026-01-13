import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginResponse } from "../services/auth.service";

// Helpers para persistencia local de auth.
export const storeJwtToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("jwtToken", token);
  } catch (e) {
    throw e;
  }
};

// Le o token JWT salvo.
export const getJwtToken = async () => {
  try {
    const value = await AsyncStorage.getItem("jwtToken");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    throw e;
  }
};
// Remove o token JWT do storage.
export const removeJwtToken = async () => {
  try {
    await AsyncStorage.removeItem("jwtToken");
  } catch (e) {
    throw e;
  }
  console.log("Done.");
};

// Salva dados do usuario autenticado.
export const storeUserData = async (value: loginResponse) => {
  try {
    const jsonValue = JSON.stringify(value.data.user);
    await AsyncStorage.setItem("userData", jsonValue);
    console.log(value);
  } catch (e) {
    throw e;
  }
};
// Recupera os dados do usuario autenticado.
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userData");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw e;
  }
};
